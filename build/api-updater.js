var path = require('path')
var fs = require('fs')




var moduleConf = { maintenance:
  [ 'accident',
    'care',
    'insurance',
    'maintenance',
    'peccancy',
    'remind',
    'tyreInspection',
    'tyre' ],
  logistics: [ 'contract', 'logistics', 'outsourcing' ],
  waybill: [ 'waybill', 'settle', 'outsourcing', 'ticket' ],
  truck: [ 'truck', 'trailer' ],
  person: [ 'driver', 'employee' ],
  org: [ 'partner' ],
  resource: [ 'route', 'rates' ],
  transport: [ 'transport' ],
  lbs: [ 'device' ],
  freight: [ 'freightAcceptRecord', 'freight' ],
  platform: [ 'org' ],
  settle:
    [ 'receivableWaybill',
      'receivableSelWaybill',
      'actualReceipt',
      'payableWaybill',
      'payableSelWaybill',
      'actualPayment' ] }



var sourceDir = path.join(__dirname,'../api');
var buildDir = path.join(__dirname,"../api/fieldMetadata/master");
var rltx='http://gateway.rltx.xyz'
var loginUser='19088888888';   // 管理员账号
var loginPassword='123123';

// var loginUser='19012345678';    // 车队账号
// var loginPassword='123123';


var fileUrlMapping={};

fileUrlMapping[rltx+'/org-config/element_type/define']={outPutFile:path.join(buildDir,'eleDefine.json')}
fileUrlMapping[rltx+'/org-config/element_type/info']={outPutFile:path.join(buildDir,'eleInfo.json')}

var patterns =['list_render_info','search_render_info','detail_render_info'];
Object.keys(moduleConf).forEach(mainModule=>{

  moduleConf[mainModule].forEach(subModule=>{
    var targetDir = path.join(buildDir,mainModule,subModule);
    mkdirsSync(targetDir)
    patterns.forEach(pattern =>{
      var realUrl = rltx+'/'+mainModule+'/'+pattern+'/'+subModule+"/list";
      var targetFile=path.join(targetDir,`${pattern}.json`);
      fileUrlMapping[realUrl]={
        parsedUrl:realUrl,
        outPutFile:targetFile,
      };
    })

  })
})


// 保存文件
function mkdirsSync (dirpath, mode) {
    try
    {
        if (!fs.existsSync(dirpath)) {
            let pathtmp;
            dirpath.split(/[/\\]/).forEach(function (dirname) {  //这里指用/ 或\ 都可以分隔目录  如  linux的/usr/local/services   和windows的 d:\temp\aaaa
                if (pathtmp) {
                    pathtmp = path.join(pathtmp, dirname);
                }
                else {
                    pathtmp = dirname;
                }
                if (!fs.existsSync(pathtmp)) {
                    if (!fs.mkdirSync(pathtmp, mode)) {
                        return false;
                    }
                }
            });
        }
        return true;
    }catch(e)
    {
        log.error("create director fail! path=" + dirpath +" errorMsg:" + e);
        return false;
    }
}

function objToParamStr(paramObj) {
  let paramStr = '';
  function getValue() {
    for (const key of Object.keys(paramObj)) {
      if ((paramObj[key] && !Array.isArray(paramObj[key])) || (Array.isArray(paramObj[key]) && paramObj[key].length)) {
        if (paramObj[key] instanceof Date) { // check type is Date
          const year = paramObj[key].getFullYear(),
            month = formatData(paramObj[key].getMonth() + 1),
            day = formatData(paramObj[key].getDate()),
            hour = formatData(paramObj[key].getHours()),
            minute = formatData(paramObj[key].getMinutes()),
            second = formatData(paramObj[key].getSeconds()),
            str = '-',
            pot = ':';
          paramObj[key] = year + str + month + str + day + ' ' + hour + pot + minute + pot + second;
        }
        paramStr += '&';
        paramStr += key;
        paramStr += '=';
        paramStr += encodeURIComponent(paramObj[key]);
      }
    }
    return paramStr;
  }
  paramStr = getValue();
  return paramStr.substring(1);
}
var axios = require('axios')
axios.defaults.withCredentials= true;
function login(cb){
	var apiURL="http://gateway.rltx.xyz"+"/login";

	axios.post(apiURL,objToParamStr({account:loginUser,password:loginPassword}), {
	  	headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
	  }).then(response=>{
	  	console.log('user logined %s.\n\n\n',response.data)
      cb(getLoginedAxios(response));
	}).catch(function(error){
	    console.log(error);
	});
}
function getLoginedAxios(response){
	var cok = response.headers['set-cookie'];
	var cookies =[];
	cok.forEach(item=>{
		cookies.push(item.split(";")[0]);
	})
	var headers = {
	  	'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
	  	'User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36',
	  	'Cookie':cookies.join(';')
	  }
	return axios.create({
	  headers: headers
	});
}
login(function(loginedAxios){
	var keys=Object.keys(fileUrlMapping);
	var count = keys.length;
	//keys= keys.slice(0,1);
	keys.forEach(url=>{
		loginedAxios.get(url).then(response=>{
			var file = fileUrlMapping[url].outPutFile;
			var data = JSON.stringify(response.data,null,4);
			fs.writeFileSync(file,data);
			count--;
			console.log('finished:'+url+',save file:'+file)
		}).catch(function(error){
	    	console.log(error.request);
		});
	})
	var timer=setInterval(function(){
		if(count>0){
			console.log('remain:'+count);
		}else{
			clearInterval(timer);
			console.log('finished.')
		}
	}, 1000);
});
