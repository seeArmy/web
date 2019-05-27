import * as Utils from './Utils.js'
const axios = require('axios'),
  code = {
    success: 200,
    forbid: 401,
    noUse: 403
  };
axios.defaults.withCredentials = true;

let isLoginRedirected = false;
//添加一个响应拦截器  start ============================
axios.interceptors.response.use(function(res){
  //在这里对返回的数据进行处理 正常返回
  if(res.data.code == 401 || res.data.code ==403){
    if(!isLoginRedirected){
      alert('没有权限,请先登录');
      window.parent.location.href = '/login/login.html';
      isLoginRedirected=true;
    }
    return Promise.reject(res);
  }
  return res;

},function(err){
  // 重点这里 ........  401  403  直接回 login
  console.log("error in interceptors!!!!",err);
  let res = err.response.data;
  // matchRight(resp)
  if (  res.code ==401 ||  res.code ==403) {
    window.parent.location.href = '/login/login.html';
  }
  return Promise.reject(error);
})
//添加一个响应拦截器  end ============================
function showError(response, url) {
  console.error(`server response error:\nurl:${url},\nmsg:\n${JSON.stringify(response)}`);
}
function matchRight (res) {
  if ( res.status === code.forbid || res.data.code === code.forbid ) {
    return true;
  } else {
    return false;
  }
}
function goBack(res) {
  if (matchRight(res)) {
    window.parent.location.href = '/login/login.html';
  }
}
function get(url, paramsObj, callback) {
  const len = Object.keys(paramsObj).length,
    getUrl = len > 0 ? `${url}?${Utils.objToParamStr(paramsObj)}` : `${url}`;
  axios.get(getUrl).then((res) => {
    // goBack(res);
    const response = res.data;
    if (callback && response.code === code.success) {
      callback(response, null);
    } else {
      showError(response, url);
      callback(null, response);
      // alert(response.code);
      return false;
    }
  }).catch((err) => {
  	console.error(err);
    callback(null, err);
  });
}

function post(url, paramsObj, callback) {
  const obj = Array.isArray(paramsObj) ? paramsObj : Utils.objToParamStr(paramsObj);
  axios.post(url, obj, {
  	headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
  }).then((res) => {
    // goBack(res);
    const response = res.data;
    if (callback && response.code === code.success) {
      callback(response, null);
    } else {
      showError(response, url);
      callback(null, response);
      // alert(response.content);
      return false;
    }
  }).catch((err) => {
  	console.error(err);
    callback(null, err);
  });
}

function postJson(url, paramsObj, callback) {
  axios.post(url, paramsObj).then((res) => {
    const response = res.data;
    if (callback && response.code === code.success) {
      callback(response, null);
    } else {
      showError(response, url);
      callback(null, response);
      return false;
    }
  }).catch((err) => {
    console.error(err);
    callback(null, err);
  });
}

export {get, post, postJson};
