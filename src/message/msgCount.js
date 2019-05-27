/* jshint esversion:6 */
var msgTitle = {}
export function meunMsgCount(key, count) {
  var el = document.getElementById(key)
  if(!el) {
    return
  }
  if(!msgTitle[key]) {
    msgTitle[key] = el.innerText
  }
  if(count === 0) {
    el.innerHTML = msgTitle[key]
  } else {
    el.innerHTML = `${msgTitle[key]} <span style="color:red">( ${count > 99 ? '99+' : count} )</span>`
  }
}
