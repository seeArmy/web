/* jshint esversion:6 */
/** websocket */
// const WS = require('../../api/ApiConst').ws
const WS = 'ws://127.0.0.1:8001'
var io = null

export function connect() {
  if (io != null) {
    return
  }
  if ('WebSocket' in window) {
    io = new WebSocket(WS)
  } else if ('MozWebSocket' in window) {
    io = new MozWebSocket(WS)
  } else {
    alert("您的浏览器不支持WebSocket")
    return
  }
  io.onopen = () =>{
    console.log('connected')
  }
  return io
}


export function disconnect() {
  if (io != null) {
    io.close()
    io = null
  }
}
