/* jshint esversion:6 */
import * as utils from './Utils';
import * as HTTP from './httpUtil';

const apigatewayDomain = require('./ApiConst').gatewayDomain;

export function sendAddBankCardVerifyCode(paramObj, cb) {
  const apiUrl = `${apigatewayDomain}/pay/trade/sendTransferMoneyVerifyCode`;
  HTTP.post(apiUrl, paramObj, (res, err) => {
    cb(res, err);
  });
}

export function transferMoney(paramObj, cb) {
  const apiUrl = `${apigatewayDomain}/pay/trade/transferMoney`;
  HTTP.post(apiUrl, paramObj, (res, err) => {
    cb(res, err);
  });
}

export function queryPayFreight(paramObj, cb) {
  const apiUrl = `${apigatewayDomain}/pay/trade/queryPayFreight`;
  HTTP.post(apiUrl, paramObj, (res, err) => {
    cb(res, err);
  });
}

export function checkVerificationCode(paramObj, cb) {
  const apiUrl = `${apigatewayDomain}/pay/trade/checkVerificationCode`;
  HTTP.post(apiUrl, paramObj, (res, err) => {
    cb(res, err);
  });
}

export function doCoreWithdraw(paramObj, cb) {
  const apiUrl = `${apigatewayDomain}/pay/trade/doCoreWithdraw`;
  HTTP.post(apiUrl, paramObj, (res, err) => {
    cb(res, err);
  });
}

export function verifyType(paramObj, cb) {
  const apiUrl = `${apigatewayDomain}/pay/trade/getVerifyType`;
  HTTP.post(apiUrl, paramObj, (res, err) => {
    cb(res, err);
  });
}
