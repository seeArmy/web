import * as utils from './Utils';
import * as HTTP from './httpUtil';

const apigatewayDomain = require('./ApiConst').gatewayDomain,
  apiPlatformDomain = require('./ApiConst').apiPlatformDomain,
  apiOrgDomain = require('./ApiConst').apiOrgDomain;

/**
 *  获取验证状态
 */
function getInfo(callback) {
  const url = `${apiPlatformDomain}/platform/cert_org_base_info/info`;
  HTTP.get(url, {}, (success, error) => {
    callback(success, error);
  })
}

/**
 *  获取公司认证状态
 */
function verifyInfo(callback) {
  const url = `${apiOrgDomain}/org/self`;
  HTTP.get(url, {}, (success, error) => {
    callback(success, error);
  })
}

/**
 *  公司认证
 */
function verifyAction(success, error) {
  HTTP.post(`${apigatewayDomain}/org/org/verify`, {}, (success, error) => {
    callback(success, error);
  });
}

export { getInfo, verifyInfo, verifyAction };
