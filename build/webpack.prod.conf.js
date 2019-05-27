'use strict'
const config = require('../config')
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const webpackConfig = merge(baseWebpackConfig, {

  module: {
    rules: utils.styleLoaders({sourceMap: config.build.productionSourceMap,extract: true,usePostCSS: true})
  },
  output: {
    path: config.assetsRoot,
    publicPath: config.assetsPublicPath,
    filename: utils.assetsPath('bundle/[name]-[chunkhash:7].js'),
    chunkFilename: utils.assetsPath('bundle/[id]-[chunkhash:7].js')
  },
  //devtool: 'cheap-module-source-map',
  devtool: 'none',
  plugins: [
    new OptimizeCSSPlugin({
      cssProcessorOptions: config.build.productionSourceMap
        ? { safe: true, map: { inline: false } }
        : { safe: true }
    }),
    new ExtractTextPlugin({
      filename: utils.assetsPath('bundle/[name]-[contenthash:7].css'),
	     allChunks: true
    })
  ]
})
/*
if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}
*/
if(config.env==='production' || config.env==='staging'){   // 使用压缩插件将导致 webpack devtool失效，难以查找bug.仅产品环境包含压缩插件。
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
if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
