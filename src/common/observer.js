// useage：
// 主要功能：监听 localStorage ，只要 localStorage 有变化 那么就 发通知
// 1. 注册 监听  Observer.addObservers('webappConfig',(res) => {})
// 2. 只要存储中 webappConfig 有变化，那么就 回调执行，同一个 key 可以多处 监听。一个文件内也可以 监听多个 key

const observer = {
  dataDic: {},
  // 添加监听，key 为监听的 字段 比如 webappConfig(就是监听的 localStorage 中的 webappConfig)  cb 为回调函数
  addObservers(key,cb) {
    if(!this.dataDic.hasOwnProperty(key)) this.dataDic[key] = [];
    this.dataDic[key].push(cb);
  },
  // 执行函数
  carryOn(key,res) {
    if(this.dataDic.hasOwnProperty(key)){
      let list = this.dataDic[key];
      list.forEach((fn)=>{
        fn(res)
      })
    }
  }
};
(function(observer) {
  function outer(fn) {
    function inner() {
      let res = fn.apply(this, arguments)
      if (arguments && arguments.length > 0) {
        let key = arguments[0];
        setTimeout(()=>{
           const result = arguments[1] ? JSON.parse(arguments[1]) : undefined;
           observer.carryOn(key,result);
        },500)
      }
      return res;
    }
    return inner
  }
  localStorage.setItem = outer(localStorage.setItem)
})(observer)


export default observer;
