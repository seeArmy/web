/* jshint esversion:6 */
import * as utils from './Utils';
import * as HTTP from './httpUtil';

const apigatewayDomain = require('./ApiConst').gatewayDomain;

export function resetPayPwdBySms(paramObj, cb) {
  const apiUrl = `${apigatewayDomain}/pay/payMember/resetPayPwdBySms`;
  HTTP.post(apiUrl, paramObj, (res, err) => {
    cb(res, err);
  });
}

export function sendModifyPwdSms(paramObj, cb) {
  const apiUrl = `${apigatewayDomain}/pay/payMember/sendModifyPwdSms`;
  HTTP.post(apiUrl, paramObj, (res, err) => {
    cb(res, err);
  });
}

export function updateMemberWithdrawLimit(paramObj, cb) {
  const apiUrl = `${apigatewayDomain}/pay/payMember/updateMemberWithdrawLimit`;
  HTTP.post(apiUrl, paramObj, (res, err) => {
    cb(res, err);
  });
}
