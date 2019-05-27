/**
 此组件可以批量生成html,用来替代 html-webpack-plugin（下称为h插件）。
 webpack在多页面程序开发中，需要定义多个h插件用来生成html，但是会导致编译奇慢，严重影响开发。
 经过多次实验总结出来的原因是webpack会解析每个插件及插件的引用，
 而且在hot-upload时存在一个bug，导致每次更新都会重新编译，自然奇慢无比。
 本插件解决了以上痛点，在webpack中只需要定义一次本插件即可,从此拒绝卡顿。

 ##配置项##
 template：null
 模板文件路径，指定本配置之后templateDir配置失效，所有chunk的html模板都使用此模板
 配置必须为绝对路径。

 templateDir: null,
 模板目录，目录下的模板文件必须与entry指定的chunk名称一致并且以.html结尾。
 如 entry:{'login/login':'login/login'}, template 目录下的文件路径为login/login.html

 chunkNames: [],
 指定需要生成html的chunk,一般设置为与webpack entry一致。如 ['login/login','login/reg']
 更新配置为
 const pushObj = Object.assign({
          chunks: name,
          templatePath: `template/${name}.html`,
          filePath: `./src/${name}.js`,
          outputPath: `/${name}.html`,
          urlPath: `${name}.html`
        }, ele);

 includeChunksForEachOne:[],
 为每个需要生成html的chunk 添加额外的chunk。用于配合ExtractTextPlugin, 把extract出来的chunk引用到html中。
 如['commons','lib']

 includeAssetsForEachOne:[],
 为每个需要生成html的chunk 添加额外的资源。用于向生成的html中添加自定义的样式文件和js文件，
 如
 [
 {name:'/static/appdll.js',insert:'before'}
 {name:'/static/lib.js',insert:'before'}
 {name:'/static/style.css',insert:'after'}
 ]
 输出结果为
 <script src='/static/lib.js' ...
 <script src='/static/appdll.js' ...
 <link href='/static/style.css' ...
 name 属性定义插入到html的资源路径（访问路径，会原样输出到html中）。
 insert 属性有两个选项，before：插入所有js或css定义之前，after：插入所有js或css 之后，
 注意：多个before资源后来居上，多个after资源后来居下。

 excludeChunksForEachOne:[],	// 暂未支持

 * @author zhangjiwei
 * @date 2018-01-22
 */
'use strict';
var fs = require('fs');
var Promise = require('bluebird');
var path = require('path');
Promise.promisifyAll(fs);

function MultiChunkHtmlWebpackPlugin (options) {
  // Default options
  this.options = Object.assign({
    templateVars:{    // 模板变量通过${变量名}使用
      title: null,
    },
    template:null,
    templateDir: null,
    chunkNames: [],
    includeChunksForEachOne:[],
    includeAssetsForEachOne:[],
    excludeChunksForEachOne:[],	// 暂未支持
    templateContent:{},
    executed:false
  }, options);
}
function isHotUpdate(assets){
  return Object.keys(assets).find(item=>item.indexOf('.hot-update.js')>-1) !=null;
}
function uniq(arr){
  var ret = [];
  arr.forEach(item=>{
    if(!ret.includes(item)){
      ret.push(item);
    }
  });
  return ret;
}


MultiChunkHtmlWebpackPlugin.prototype.apply = function (compiler) {
  var DEFAULT_TEMPLATE_KEY='MAIN';
  var self = this;

  /*
  if(this.options.template){		//single template mode.
    fs.readFile(this.options.template,'utf-8',function(err,content){
      self.options.templateContent[DEFAULT_TEMPLATE_KEY]=content;
    });
  }else{		// template dir mode
    this.options.chunkNames.forEach(item=>{
      var filePath = path.join(this.options.templateDir,`${item}.html`);
      fs.readFile(filePath,'utf-8',function(err,content){
        self.options.templateContent[item]=content;
      });
    });
  }*/

  this.options.chunkNames.forEach(item=>{   // 直接解析html-webpack-plugin的配置文件 。
    var chunkName=item.chunks;
    var filePath = path.join(__dirname,"../",item.templatePath);
    fs.readFile(filePath,'utf-8',function(err,content){
      // 匹配替换template目录中html文件的title标签中含${title}的字符
      content = content.replace(/\$\{\s*(.*?)\s*\}/g, function(txt,group1){
          var data = self.options.templateVars[group1];
          return data == null ? txt : data;
      });
      self.options.templateContent[chunkName]=content;
    });
  });


  compiler.plugin('emit', function (compilation, callback) {
    if (self.options.executed) {
      console.log(compilation.asset);
      console.log('\n this is hot update,MultiChunkHtmlWebpackPlugin compilation passed');
      return callback();
    }else{
      self.options.executed=true;
    }

    var allChunks = compilation.getStats().toJson().chunks;
    self.options.chunkNames.forEach(item=>{	// 遍历chunks，生成html
      var chunkName= item.chunks;
      console.log('build html for chunk:'+chunkName);
      var selectedChunks =[];
      var chunkNames =(self.options.includeChunksForEachOne).concat([chunkName]);

      chunkNames.forEach(tk=>{
        var ck =compilation.namedChunks[tk];
        if(ck!=null){
          selectedChunks.push(ck);
        }
      });
      if(selectedChunks.length==0){
        return true;
      }
      var assets = self.htmlWebpackPluginAssets(compilation, selectedChunks);

      self.options.includeAssetsForEachOne.forEach(asset=>{		// 增加自定义资源。
        var func = asset.name.indexOf('.js')>-1?assets.js:assets.css;
        if(asset.insert==='after'){
          func.push(asset.name)
        }else{
          func.unshift(asset.name)
        }
      });

      var fileName=item.outputPath.replace(/^\//,'');
      var content= self.options.templateContent[chunkName];


      var assetTags = self.generateAssetTags(assets);
      content = self.injectAssetsIntoHtml(content, assets, {head: assetTags.head, body: assetTags.body});

      // 加进编译器
      compilation.assets[fileName] = {
        source: ()=>content,
        size: ()=> content.length
      };
    })
    return callback();
  });
};


/*
 * Pushes the content of the given filename to the compilation assets
 */
MultiChunkHtmlWebpackPlugin.prototype.addFileToAssets = function (filename, compilation) {
  filename = path.resolve(compilation.compiler.context, filename);
  return Promise.props({
    size: fs.statAsync(filename),
    source: fs.readFileAsync(filename)
  })
    .catch(function () {
      return Promise.reject(new Error('MultiChunkHtmlWebpackPlugin: could not load file ' + filename));
    })
    .then(function (results) {
      var basename = path.basename(filename);
      compilation.fileDependencies.push(filename);
      compilation.assets[basename] = {
        source: function () {
          return results.source;
        },
        size: function () {
          return results.size.size;
        }
      };
      return basename;
    });
};

/**
 * Helper to sort chunks
 */
MultiChunkHtmlWebpackPlugin.prototype.sortChunks = function (chunks, sortMode) {
  // Sort mode auto by default:
  if (typeof sortMode === 'undefined') {
    sortMode = 'auto';
  }
  // Custom function
  if (typeof sortMode === 'function') {
    return chunks.sort(sortMode);
  }
  // Disabled sorting:
  if (sortMode === 'none') {
    return chunkSorter.none(chunks);
  }
  // Check if the given sort mode is a valid chunkSorter sort mode
  if (typeof chunkSorter[sortMode] !== 'undefined') {
    return chunkSorter[sortMode](chunks, this.options.chunkNames);
  }
  throw new Error('"' + sortMode + '" is not a valid chunk sort mode');
};



MultiChunkHtmlWebpackPlugin.prototype.htmlWebpackPluginAssets = function (compilation, chunks) {
  var self = this;
  var compilationHash = compilation.hash;
  // Use the configured public path or build a relative path
  var publicPath = typeof compilation.options.output.publicPath !== 'undefined'
    // If a hard coded public path exists use it
    ? compilation.mainTemplate.getPublicPath({hash: compilationHash})
    // If no public path was set get a relative url path
    : '/';

  if (publicPath.length && publicPath.substr(-1, 1) !== '/') {
    publicPath += '/';
  }

  var assets = {
    // The public path
    publicPath: publicPath,
    // Will contain all js & css files by chunk
    chunks: {},
    // Will contain all js files
    js: [],
    // Will contain all css files
    css: [],
    // Will contain the html5 appcache manifest files if it exists
    manifest: Object.keys(compilation.assets).filter(function (assetFile) {
      return path.extname(assetFile) === '.appcache';
    })[0]
  };


  for (var i = 0; i < chunks.length; i++) {
    var chunk = chunks[i];
    var chunkName = chunk.name;

    assets.chunks[chunkName] = {};
    // Prepend the public path to all chunk files
    var chunkFiles = [].concat(chunk.files).map(function (chunkFile) {
      return publicPath + chunkFile;
    });


    // Webpack outputs an array for each chunk when using sourcemaps
    // But we need only the entry file
    var entry = chunkFiles[0];
    if(entry){
      assets.chunks[chunkName].size = chunk.size;
      assets.chunks[chunkName].entry = entry;
      assets.chunks[chunkName].hash = chunk.hash;
      assets.js.push(entry);
    }
    // Gather all css files
    var css = chunkFiles.filter(function (chunkFile) {
      // Some chunks may contain content hash in their names, for ex. 'main.css?1e7cac4e4d8b52fd5ccd2541146ef03f'.
      // We must proper handle such cases, so we use regexp testing here
      return /.css($|\?)/.test(chunkFile);
    });
    assets.chunks[chunkName].css = css;
    assets.css = assets.css.concat(css);
  }

  // Duplicate css assets can occur on occasion if more than one chunk
  // requires the same css.
  assets.css = uniq(assets.css);

  return assets;
};

/**
 * Injects the assets into the given html string
 */
MultiChunkHtmlWebpackPlugin.prototype.generateAssetTags = function (assets) {
  // Turn script files into script tags
  var scripts = assets.js.map(function (scriptPath) {
    return {
      tagName: 'script',
      closeTag: true,
      attributes: {
        type: 'text/javascript',
        src: scriptPath
      }
    };
  });
  // Make tags self-closing in case of xhtml
  var selfClosingTag = !!this.options.xhtml;
  // Turn css files into link tags
  var styles = assets.css.map(function (stylePath) {
    return {
      tagName: 'link',
      selfClosingTag: selfClosingTag,
      attributes: {
        href: stylePath,
        rel: 'stylesheet'
      }
    };
  });
  // Injection targets
  var head = [];
  var body = [];

  // If there is a favicon present, add it to the head
  if (assets.favicon) {
    head.push({
      tagName: 'link',
      selfClosingTag: selfClosingTag,
      attributes: {
        rel: 'shortcut icon',
        href: assets.favicon
      }
    });
  }
  // Add styles to the head
  head = head.concat(styles);
  // Add scripts to body or head
  if (this.options.inject === 'head') {
    head = head.concat(scripts);
  } else {
    body = body.concat(scripts);
  }
  return {head: head, body: body};
};

/**
 * Injects the assets into the given html string
 */
MultiChunkHtmlWebpackPlugin.prototype.injectAssetsIntoHtml = function (html, assets, assetTags) {
  var htmlRegExp = /(<html[^>]*>)/i;
  var headRegExp = /(<\/head\s*>)/i;
  var bodyRegExp = /(<\/body\s*>)/i;
  var body = assetTags.body.map(this.createHtmlTag);
  var head = assetTags.head.map(this.createHtmlTag);

  if (body.length) {
    if (bodyRegExp.test(html)) {
      // Append assets to body element
      html = html.replace(bodyRegExp, function (match) {
        return body.join('') + match;
      });
    } else {
      // Append scripts to the end of the file if no <body> element exists:
      html += body.join('');
    }
  }

  if (head.length) {
    // Create a head tag if none exists
    if (!headRegExp.test(html)) {
      if (!htmlRegExp.test(html)) {
        html = '<head></head>' + html;
      } else {
        html = html.replace(htmlRegExp, function (match) {
          return match + '<head></head>';
        });
      }
    }

    // Append assets to head element
    html = html.replace(headRegExp, function (match) {
      return head.join('') + match;
    });
  }

  // Inject manifest into the opening html tag
  if (assets.manifest) {
    html = html.replace(/(<html[^>]*)(>)/i, function (match, start, end) {
      // Append the manifest only if no manifest was specified
      if (/\smanifest\s*=/.test(match)) {
        return match;
      }
      return start + ' manifest="' + assets.manifest + '"' + end;
    });
  }
  return html;
};

/**
 * Appends a cache busting hash
 */
MultiChunkHtmlWebpackPlugin.prototype.appendHash = function (url, hash) {
  if (!url) {
    return url;
  }
  return url + (url.indexOf('?') === -1 ? '?' : '&') + hash;
};

/**
 * Turn a tag definition into a html string
 */
MultiChunkHtmlWebpackPlugin.prototype.createHtmlTag = function (tagDefinition) {
  var attributes = Object.keys(tagDefinition.attributes || {})
    .filter(function (attributeName) {
      return tagDefinition.attributes[attributeName] !== false;
    })
    .map(function (attributeName) {
      if (tagDefinition.attributes[attributeName] === true) {
        return attributeName;
      }
      return attributeName + '="' + tagDefinition.attributes[attributeName] + '"';
    });
  // Backport of 3.x void tag definition
  var voidTag = tagDefinition.voidTag !== undefined ? tagDefinition.voidTag : !tagDefinition.closeTag;
  var selfClosingTag = tagDefinition.voidTag !== undefined ? tagDefinition.voidTag && this.options.xhtml : tagDefinition.selfClosingTag;
  return '<' + [tagDefinition.tagName].concat(attributes).join(' ') + (selfClosingTag ? '/' : '') + '>' +
    (tagDefinition.innerHTML || '') +
    (voidTag ? '' : '</' + tagDefinition.tagName + '>');
};

/**
 * Helper to return the absolute template path with a fallback loader
 */
MultiChunkHtmlWebpackPlugin.prototype.getFullTemplatePath = function (template, context) {
  // If the template doesn't use a loader use the lodash template loader
  if (template.indexOf('!') === -1) {
    template =  path.resolve(context, template);
  }
  // Resolve template path
  return template.replace(
    /([!])([^/\\][^!?]+|[^/\\!?])($|\?[^!?\n]+$)/,
    function (match, prefix, filepath, postfix) {
      return prefix + path.resolve(filepath) + postfix;
    });
};

/**
 * Helper to return a sorted unique array of all asset files out of the
 * asset object
 */
MultiChunkHtmlWebpackPlugin.prototype.getAssetFiles = function (assets) {
  var files = uniq(Object.keys(assets).filter(function (assetType) {
    return assetType !== 'chunks' && assets[assetType];
  }).reduce(function (files, assetType) {
    return files.concat(assets[assetType]);
  }, []));
  files.sort();
  return files;
};

/**
 * Helper to promisify compilation.applyPluginsAsyncWaterfall that returns
 * a function that helps to merge given plugin arguments with processed ones
 */
MultiChunkHtmlWebpackPlugin.prototype.applyPluginsAsyncWaterfall = function (compilation) {
  var promisedApplyPluginsAsyncWaterfall = Promise.promisify(compilation.applyPluginsAsyncWaterfall, {context: compilation});
  return function (eventName, requiresResult, pluginArgs) {
    return promisedApplyPluginsAsyncWaterfall(eventName, pluginArgs)
      .then(function (result) {
        if (requiresResult && !result) {
          compilation.warnings.push(new Error('Using ' + eventName + ' without returning a result is deprecated.'));
        }
        return Object.assign(pluginArgs, result);
      });
  };
};

module.exports = MultiChunkHtmlWebpackPlugin;
