/* jshint esversion:6 */
import * as utils from './Utils';
import * as HTTP from './httpUtil';

const apigatewayDomain = require('./ApiConst').gatewayDomain;

export function getCoreRealAccount(paramObj, cb) {
  const apiUrl = `${apigatewayDomain}/pay/virtualAccount/getCoreRealAccount`;
  HTTP.post(apiUrl, paramObj, (res, err) => {
    cb(res, err);
  });
}

export function getMoneyFlowForCompany(paramObj, cb) {
  const url = `${apigatewayDomain}/pay/virtualAccount/getMoneyFlowForCompany`;
  HTTP.get(url, paramObj, (success, error) => {
    cb(success, error);
  })
}

export function getOrgMemberInfoList(paramObj, cb) {
  const url = `${apigatewayDomain}/pay/virtualAccount/getOrgMemberInfoList`;
  HTTP.get(url, paramObj, (success, error) => {
    cb(success, error);
  })
}

// 司机会员资金账户查询
export function getMemberInfoList(paramObj, cb) {
  const url = `${apigatewayDomain}/pay/virtualAccount/getMemberInfoList`;
  HTTP.get(url, paramObj, (success, error) => {
    cb(success, error);
  })
}

// 司机会员出入金记录
export function getMoneyFlowForDriver(paramObj, cb) {
  const url = `${apigatewayDomain}/pay/virtualAccount/getMoneyFlowForDriver`;
  HTTP.get(url, paramObj, (success, error) => {
    cb(success, error);
  })
}

// 企业账户查询
export function getCompanyAcountInfo(paramObj, cb) {
  const url = `${apigatewayDomain}/pay/virtualAccount/getCompanyAcountInfo`;
  HTTP.get(url, paramObj, (success, error) => {
    cb(success, error);
  })
}

export function getMoneyFlowForCore(paramObj, cb) {
  const url = `${apigatewayDomain}/pay/virtualAccount/getMoneyFlowForCore`;
  HTTP.get(url, paramObj, (success, error) => {
    cb(success, error);
  })
}

export function getCoreWithdrawRecode(paramObj, cb) {
  const url = `${apigatewayDomain}/pay/virtualAccount/getCoreWithdrawRecode`;
  HTTP.get(url, paramObj, (success, error) => {
    cb(success, error);
  })
}
