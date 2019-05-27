'use strict'
const config = require('../config')
const path = require('path')
const utils = require('./utils')
const vueLoaderConfig = require('./vue-loader.conf')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MultiChunkHtmlWebpackPlugin=require("./MultiChunkHtmlWebpackPlugin.js");
const pathConfig = require('../config/pathConfig.js')
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();
const CleanPlugin = require("clean-webpack-plugin");

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}


var dllContext = path.join(__dirname,"../");  // dll context for load library.

console.log("Ready to build: current env:[%s], app gateway:[%s], dll context:[%s]",config.NODE_ENV,config.gatewayUrl,dllContext);
// ����ģ�顣
var appModules=[], appName='', gatewayUrl='';
if (process.argv.includes('--define')) {
  var moduleArg = process.argv[process.argv.length-1]; // 获取npm run dev 后面全部参数字符串
  // 如果没有参数，npm run dev启动所有模块
  if (moduleArg === '--define') {
    appModules = pathConfig.getAllModules();
  } else if (moduleArg.includes('=')) { // 如果参数中包含=号，则传递了页面title名称或者gateway地址
    const str = moduleArg;
    console.log(`node params is ${str}`);
    moduleArg = str.slice(0, str.indexOf('=')); //获取前半部分启动模块，以/分隔
    appModules = pathConfig.getModules(moduleArg.split('/'));
    // 获取右侧参数字符，eg，=公司名称&gatewayUrl=XXX
    const params = str.slice(str.indexOf('=')+1);
    // 判断是否包含gateway地址
    if (params.includes('&gatewayUrl=')) {
      gatewayUrl = params.slice(params.indexOf('=')+1);
      console.log(`gatewayUrl is ${gatewayUrl}`);
      appName = params.slice(0, params.indexOf('&'));
    } else {
      appName = params;
    }
    console.log(`moduleArg is:[${moduleArg}]`);
    console.log(`appName is ${appName}`);
  } else{
    appModules = pathConfig.getModules(moduleArg.split('/'));
  }
} else {
  appModules = pathConfig.getAllModules();
}
//appModules=pathConfig.getModules(["account"])
console.log(`build app modules:[${appModules.length}]`);
console.log(`process.argv is ${process.argv}, length is ${process.argv.length}`);

var entryObj = {};
var includeChunkNames = [];
appModules.forEach((element,index) => {
  entryObj[element.chunks] = ["babel-polyfill", element.filePath];
  includeChunkNames.push(element);
});
let counter=0;

// entryObj['config-js'] = ['./static/config.js']

const _baseWebpackConfig = smp.wrap({
  context: path.resolve(__dirname, '../'),
  entry:entryObj,
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    modules: [
      resolve('src'),
      resolve('node_modules')
    ],
    alias: {
      // 'vue$': 'vue/dist/vue.esm.js',
      'vue$': 'vue/dist/vue.js',
      '@': resolve('src'),
      '@api': resolve('api')
    }
  },
  externals: [],
  module: {
    noParse: /node_modules\/(element-ui\.js)/,
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        include: [resolve('src')],
        options: vueLoaderConfig,
        exclude: /node_modules/
      },
      {
        test: /\.(js|es6)$/,
        use: ['cache-loader','babel-loader?cacheDirectory=true'],
        include: [resolve('src'), resolve('test')],
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        exclude: [resolve('src/components/rl-icons')],
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader',
        include: [resolve('src/components/rl-icons')],
        options: {
          symbolId: 'icon-[name]'
        }
      },
      /*  ��Щ������vue utils���Ѿ�����
     {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          use: ["css-loader", "sass-loader"],
          // �ڿ�������ʹ�� style-loader
          fallback: "style-loader"
        })
      },
      {
        test: /\.css$/,
    exclude: /node_modules/,
        use: ['style-loader','css-loader','postcss-loader']
      }
    */
    ]
  },
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  },
  plugins: [
    // new CleanPlugin(['dist']),
    new webpack.DefinePlugin({    // gateway
      'process.env': {
        'NODE_ENV': config.NODE_ENV,
        'rltx': config.gatewayUrl,
        'WS': config.WSUrl
       },
    }),
  /*  new webpack.optimize.CommonsChunkPlugin({
      name: 'render-json',
      minChunks :function(module,count){
        counter++;
        console.log("counter:" +counter+", module: " + module.resource+", count:"+count);
        return module.resource && module.resource.indexOf('.json')>-1;
      }
    }), */
    new webpack.optimize.CommonsChunkPlugin({
      name: 'commons',
      minChunks: parseInt(includeChunkNames.length*0.7)
      //minChunks: 7
      // minChunks: function (module) {
      //   if(module.resource && (/^.*\.(css|scss)$/).test(module.resource)) {
      //     return false;
      //   }
      //   return module.context && module.context.includes("node_modules");
      // }
    }),
    new webpack.DllReferencePlugin({
      context: dllContext,
      manifest: require("../static/appdll-manifest.json")
    }),
    new CopyWebpackPlugin([
    {
      from: path.resolve(__dirname, '../static'),
      to: config.assetsSubDirectory,
      ignore: ['.*']
    }
    ]),
    new MultiChunkHtmlWebpackPlugin({
      templateVars:{    // 模板变量通过${变量名}使用
        title: appName || config.appName //dev环境从命令中取appName，build从config中取appName
      },
      templateDir: path.join(__dirname,'../template'),
      chunkNames: includeChunkNames,
      includeChunksForEachOne:['commons'],
      includeAssetsForEachOne:[
        {name:'/static/appdll.js', insert:'before'},
        {name:'/static/robot.js', insert:'before'},
        {name:'/static/config-js.js', insert:'before'},
      ]
    })
  ]
})

module.exports = _baseWebpackConfig

