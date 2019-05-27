var path = require('path')
var fs = require('fs')

var sourceDir = path.join(__dirname,'../api');

var confFile = {};
fs.readdirSync(sourceDir).forEach(file=>{
  if(file.indexOf('.js')>-1){
    var sourceFile = path.join(sourceDir,file);

    var content = fs.readFileSync(sourceFile,"utf-8");
    var matchedUrl= content.match(/(\${ApiConst.fieldMetadataDir}.*?\.json)/ig);
    if(matchedUrl && matchedUrl.length>1){
      matchedUrl.forEach(url=>{

        var realUrl = url.split('/');

        var dirFirst = realUrl[1];
        var dirSecond = realUrl[2];

        var lv1 = confFile[dirFirst];
        if(!lv1){
          lv1=[];
          confFile[dirFirst] = lv1;
        }
        if(!lv1.includes(dirSecond)){
          lv1.push(dirSecond);
        }
      })
    }
  }
})
console.log(confFile)
