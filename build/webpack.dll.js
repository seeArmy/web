const path = require('path');
const webpack = require('webpack');
const utils = require('./utils')
var glob = require("glob")
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const vueLoaderConfig = require('./vue-loader.conf')
const config = require('../config')

var ENV_PERSETS=['dev','test','staging','production'];    // 定义支持的环境。

// 解析环境。
var env = 'dev';    // 默认为开发环境
if(process.argv.includes('--define')){   //build命令支持指定环境 npm run build [dev/test/staging/production]
  env = process.argv[process.argv.length-1];
}
if(!ENV_PERSETS.includes(env)){   // check env.
  var msg =`env:[${env}] is not supported, please check your command, supported env is [${ENV_PERSETS}]`;
  throw msg;
}

console.log(`build dll for ${env}`);

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

var webpackConfig ={
  entry: {
    'appdll': [
  	  'vue/dist/vue.esm.js',
      'async-validator',
      'element-ui',  // 此处会打包完成elementui, 不划算，交给commons按需打包
      'axios',
      'core-js',
      'lodash'
    ]
  },
  devtool:'cheap-module-source-map',
  output: {
    path: path.join(__dirname, '../static'),
    filename: '[name].js',
    library: '[name]'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    }
  },
  module: {
    rules: []
  },
  plugins: [
	   new webpack.DefinePlugin({
      'process.env': {
		    NODE_ENV:JSON.stringify(env)
      }
    }),
    new webpack.DllPlugin({
      path: path.join(__dirname, '../static', '[name]-manifest.json'),
      name: '[name]'
    })
  ]
};
var rules=utils.styleLoaders({
  sourceMap: false,
  extract: false,
  usePostCSS: true
});
rules.push({
  test: /\.vue$/,
  loader: 'vue-loader',
  include: [resolve('src')],
  options: vueLoaderConfig,
  exclude: /node_modules/
});
webpackConfig.module.rules=rules;

if(env==='production' || config.env==='staging'){   // 使用压缩插件将导致 webpack devtool失效，难以查找bug.仅产品环境包含压缩插件。
  webpackConfig.plugins.push(
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: true,
        warnings: false
      },
      sourceMap: false,
      parallel: true
    })
  )
}
module.exports = webpackConfig;
