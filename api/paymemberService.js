/* jshint esversion:6 */
import * as HTTP from './httpUtil';
const apiConst = require('./ApiConst');
const api = apiConst.gatewayDomain + '/pay/payMember';


export function fetchCode(paramObj, callback) {
  const apiUrl = `${api}/sendModifyPwdSms`;
  HTTP.post(apiUrl, paramObj, (response, err) => {
    callback(response, err);
  });
}

export function modify(paramObj, callback) {
  const apiUrl = `${api}/resetPayPwdBySms`;
  HTTP.post(apiUrl, paramObj, (response, err) => {
    callback(response, err);
  });
}
