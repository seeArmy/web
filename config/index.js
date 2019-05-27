'use strict'
const path = require('path')

var ENV_CONFIG={
    dev:{
      gatewayUrl:'http://gateway-qlh.rltx.xyz', //http://gateway-qlh.rltx.xyz
      ws: 'http://gateway-qlh.rltx.xyz/platform/messages'
    },
    test:{
      gatewayUrl:'http://gateway.rltxtest.xyz',
      ws: 'http://gateway.rltxtest.xyz/platform/messages'
    },
    staging:{
      gatewayUrl:'https://rltx2-yfb-gateway.rltx.com',
      ws: 'https://rltx2-yfb-gateway.rltx.com/platform/messages'
    },
    production:{
      gatewayUrl:'https://rltx2-yfb-gateway.rltx.com', // http://gateway.hbtdgps.com:8888
      ws: 'https://rltx2-yfb-gateway.rltx.com/platform/messages'
    }
}
var ENV_PERSETS=['dev','test','staging','production'];    // 定义支持的环境。

// 解析环境。
var env = 'dev', appName = '', gatewayUrl = '', wsUrlCopy = '';    // 默认为开发环境
if(!process.argv.includes('--define')){   //build命令支持指定环境 npm run build [dev/test/staging/production]
  var lastArg = process.argv[process.argv.length-1];
  // 判断是否带有参数 eg. npm run build production=公司名称&gatewayUrl=XXX
  if (lastArg.includes('=')) {
    const str = lastArg;
    env = str.slice(0, str.indexOf('='));
    // 获取右侧参数字符，eg，=公司名称&gatewayUrl=XXX
    const params = str.slice(str.indexOf('=')+1);
    console.log(`params is ${params}`);
    // 判断是否包含gateway地址
    if (params.includes('&gatewayUrl=')) {
      console.log(`params is including gatewayUrl`);
      gatewayUrl = params.slice(params.indexOf('=')+1);
      console.log(`gatewayUrl is ${gatewayUrl}`);
      appName = params.slice(0, params.indexOf('&'));
      console.log(`appName is ${appName}`);
    } else {
      appName = params;
    }
  } else {
    env = lastArg;
  }
}

if(!ENV_PERSETS.includes(env)){   // check env.
  var msg =`env:[${env}] is not supported, please check your command, supported env is [${ENV_PERSETS}]`;
  throw msg;
}


process.env.NODE_ENV = env;   // 指定node环境。

let gatewayUrlCopy =  JSON.stringify(ENV_CONFIG[env].gatewayUrl);
wsUrlCopy = JSON.stringify(ENV_CONFIG[env].ws)
if(gatewayUrl){
   gatewayUrlCopy = JSON.stringify(gatewayUrl);
   wsUrlCopy = JSON.stringify(gatewayUrl + '/platform/messages')
}
// console.log('111.....',gatewayUrlCopy);



module.exports = {
  env: env,
  NODE_ENV: JSON.stringify(env),   // vue程序中用到。通用 webpack.define .. 使用。
  gatewayUrl: gatewayUrlCopy,
  WSUrl: wsUrlCopy,
  appName: appName,
  assetsRoot: path.resolve(__dirname, '../dist',env),   // build到指定的env目录。
  assetsSubDirectory: 'static',
  assetsPublicPath: '/',
  dev: {
    proxyTable: {},
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 10001, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: true,
    openPage:"/login/login.html",
    errorOverlay: true,
    notifyOnErrors: true,
    devtool: 'cheap-module-source-map',
    cacheBusting: true,
    cssSourceMap: false,
  },
  build: {
	  bundleAnalyzerReport: false,
    index: path.resolve(__dirname, '../dist/index.html'),
    productionSourceMap: true,
    devtool: 'cheap-module-source-map',
  },

}
