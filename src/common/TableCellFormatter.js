/**
 * 此文件服务于表格组件，用于格式化单元格数据，比如后台数据是false,true。表格中不能直接显示，需要格式化为 是、否; 状态数据格式化，比如计量单位，后台是 yuanpertun，前台显示为 元/吨。
 * @author zhangjiwei
 * @date 2018/2/3
 */

Date.prototype.format = function(fmt){
  var o = {
    "M+" : this.getMonth()+1,                 //月份
    "d+" : this.getDate(),                    //日
    "h+" : this.getHours(),                   //小时
    "m+" : this.getMinutes(),                 //分
    "s+" : this.getSeconds(),                 //秒
    "q+" : Math.floor((this.getMonth()+3)/3), //季度
    "S"  : this.getMilliseconds()             //毫秒
  };
  if(/(y+)/.test(fmt))
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
  for(var k in o)
    if(new RegExp("("+ k +")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
  return fmt;
};

const booleanMapping={
  true:'是',
  false:'否',
  'true':'是',
  'false':'否',
  1:"是",
  0:'否'
}
// return 是，否
function booleanFormatter(row, column, cellValue){
  console.log(cellValue)
  return booleanMapping[cellValue];
}
// return yyyy-MM-dd hh:mm:ss
function dateTimeFormatter(row, column, cellValue){
  var date = new Date(cellValue);
  return date.format('yyyy-MM-dd hh:mm:ss');
}
// datetime formatter
function dateFormatter(pattern){
  return function(row,column,cellValue){
    var date = new Date(cellValue);
    return date.format(pattern);
  }
}
export {
  booleanFormatter,
  dateTimeFormatter,
  dateFormatter
}
