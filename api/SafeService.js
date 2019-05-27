/**
 * Created by cc on 2018/5/30.
 */

import * as HTTP from './httpUtil';

const ApiConst = require('./ApiConst');
const apiOrgDomain = ApiConst.apiOrgDomain;

/**
 * 认证
 */
function verify(paramObj, callback) {
  const apiUrl = `${apiOrgDomain}/org/verify`;
  HTTP.post(apiUrl, paramObj, (res, error) => {
    callback(res, error);
  });
}

/**
 * 获取详情
 */
function get(paramObj, callback) {
  const apiUrl = `${apiOrgDomain}/org/self`;
  HTTP.get(apiUrl, {}, (success, error) => {
    callback(success, error);
  });
}


export { verify, get };
