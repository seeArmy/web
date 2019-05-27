/**
 * Created by zhuyi on 17/5/2.
 */

import * as apiConst from './ApiConst';
import * as HTTP from './httpUtil';

const axios = require('axios');
axios.defaults.withCredentials = true;

/**
 * 登录方法
 *
 * @param account 账户
 * @param password 密码
 * @param callback 回调方法
 */
function login(account, password, callback) {
  const url = `${apiConst.apiDomain}/login`;
  HTTP.post(url, {
  	account,
  	password
  }, (success, error) => {
    callback(success, error);
  });
}

/**
 * 登出方法
 */
function logout(callback) {
  const url = `${apiConst.apiDomain}/logout`;
  HTTP.get(url, {}, (success, error) => {
    callback(success, error);
  });
}

/**
 * 获取信息
 */
function webapp(callback) {
  const url = `${apiConst.apiPlatformDomain}/platform/core/config/webapp`;
  HTTP.get(url, {}, (success, error) => {
    callback(success, error);
  });
}

/**
 * 获取信息 other
 */
function otherapp(callback) {
  const url = `${apiConst.apiPlatformDomain}/platform/core/config/other`;
  HTTP.get(url, {}, (success, error) => {
    callback(success, error);
  });
}


/**
 * 获取货源列表  GET /driver-api/freight/list
 */
function list(paramObj, callback) {
  const apiUrl = `${apiConst.BaseDomain}/driver-api/driver-api/freight/list`;
  HTTP.get(apiUrl, paramObj, (response, err) => {
    callback(response, err);
  });
}

export { login, logout, webapp , list ,otherapp };
