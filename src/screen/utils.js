/* jshint esversion:6 */

export function screenTest() {
  var s = "";
  s += " 网页可见区域宽："+ document.body.clientWidth+"<br />";
  s += " 网页可见区域高："+ document.body.clientHeight+"<br />";
  s += " 网页可见区域宽："+ document.body.offsetWidth + " (包括边线和滚动条的宽)"+"<br />";
  s += " 网页可见区域高："+ document.body.offsetHeight + " (包括边线的宽)"+"<br />";
  s += " 网页正文全文宽："+ document.body.scrollWidth+"<br />";
  s += " 网页正文全文高："+ document.body.scrollHeight+"<br />";
  s += " 网页被卷去的高(ff)："+ document.body.scrollTop+"<br />";
  s += " 网页被卷去的高(ie)："+ document.documentElement.scrollTop+"<br />";
  s += " 网页被卷去的左："+ document.body.scrollLeft+"<br />";
  s += " 网页正文部分上："+ window.screenTop+"<br />";
  s += " 网页正文部分左："+ window.screenLeft+"<br />";
  s += " 屏幕分辨率的高："+ window.screen.height+"<br />";
  s += " 屏幕分辨率的宽："+ window.screen.width+"<br />";
  s += " 屏幕可用工作区高度："+ window.screen.availHeight+"<br />";
  s += " 屏幕可用工作区宽度："+ window.screen.availWidth+"<br />";
  s += " 你的屏幕设置是 "+ window.screen.colorDepth +" 位彩色"+"<br />";
  s += " 你的屏幕设置 "+ window.screen.deviceXDPI +" 像素/英寸"+"<br />";
  document.getElementById("screen-test").innerHTML = s;
  // this.testingpage = true;
}

export function nowtime() {
  var myDate = new Date(),
    y = myDate.getFullYear(),
    m = myDate.getMonth() < 10 ? `0${myDate.getMonth()+1}` : myDate.getMonth(),
    d = myDate.getDate() < 10 ? `0${myDate.getDate()}` : myDate.getDate(),
    tt = myDate.getHours() < 10 ? `0${myDate.getHours()}` : myDate.getHours(),
    mm = myDate.getMinutes() < 10 ? `0${myDate.getMinutes()}` : myDate.getMinutes(),
    ss = myDate.getSeconds() < 10 ? `0${myDate.getSeconds()}` : myDate.getSeconds();
  return `${y}-${m}-${d}  ${tt}:${mm}:${ss}`
}
