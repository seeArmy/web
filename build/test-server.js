var express = require('express');
var app = express();

var ENV_PERSETS=['dev','test','staging','production'];    // 定义支持的环境。

// 解析环境。
var env = 'dev';    // 默认为开发环境
if(!process.argv.includes('item')){   //build命令支持指定环境 npm run build [dev/test/staging/production]
  env = process.argv[process.argv.length-1];
}
if(!ENV_PERSETS.includes(env)){   // check env.
  var msg =`env:[${env}] is not supported, please check your command, supported env is [${ENV_PERSETS}]`;
  throw msg;
}

var dir=`dist/${env}`;

app.use(express.static(dir));
app.get('/', function(req, res) {
  res.redirect('/login/login.html');
});

var server = app.listen(8099, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('app serve at [%s] dir, listening at http://%s:%s',dir, host, port);
});