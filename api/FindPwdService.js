/**
 * Created by zhuyi on 17/5/2.
 */

const apiDomain = require('./ApiConst').apiDomain;

import * as HTTP from './httpUtil';

/**
 * 验证用户是否存在
 */
function checkUser(paramObj, cb) {
  const apiUrl = `${apiDomain}/account/${paramObj.loginAccount}/validate`;
  HTTP.post(apiUrl, paramObj, (response, error) => {
    cb(response, error);
  });
}

/**
 * 获取验证码
 */
function getValiCode(paramObj, cb) {
  const apiUrl = `${apiDomain}/account/reset_password/send/verify_code`;
  HTTP.post(apiUrl, paramObj, (response, error) => {
    cb(response, error);
  });
}

/**
 * 校验验证码
 */
function checkValiCode(paramObj, cb) {
  const apiUrl = `${apiDomain}/account/reset_password/verify_code`;
  HTTP.post(apiUrl, paramObj, (response, error) => {
    cb(response, error);
  });
}

/**
 * 重置密码
 */
function resetPwd(paramObj, cb) {
  const apiUrl = `${apiDomain}/account/reset_password`;
  HTTP.post(apiUrl, paramObj, (response, error) => {
    cb(response, error);
  });
}



export { checkUser, getValiCode, checkValiCode, resetPwd };
