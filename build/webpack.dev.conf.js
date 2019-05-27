'use strict'
const config = require('../config')
const utils = require('./utils')
const webpack = require('webpack')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')


const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: false })
  },
  output: {
    path: config.assetsRoot,
    filename: utils.assetsPath('bundle/[name].js'),    //  webpack 打包出来的文件名。,
    publicPath: config.assetsPublicPath
  },
  // cheap-module-eval-source-map is faster for development
  devtool: 'cheap-module-source-map',
  // these devServer options should be customized in /config/index.js
  devServer: {
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    host: config.dev.host,
    port: config.dev.port,
    open: config.dev.autoOpenBrowser,
    openPage:config.dev.openPage,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true,
    watchOptions: {
      aggregateTimeout: 1000, // 默认值
      poll: false,
      ignored: /node_modules/
    },
    headers: {
      "Access-Control-Allow-Credentials":true,
      "Access-Control-Allow-Origin": "*"
    },
    disableHostCheck: true,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
