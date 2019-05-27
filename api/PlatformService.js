/**
 * 平台服务
 * Created by liangsheng on 2017/8/21.
 */

import * as HTTP from './httpUtil';
var ApiConst= require('./ApiConst');

const axios = require('axios'),
  apiDomain = require('./ApiConst').apiPlatformDomain;

axios.defaults.withCredentials = true;

function setUserInfoCode(code, paramObj, callback) {
  const apiUrl = `${apiDomain}/platform/self/${code}/set`;
  HTTP.post(apiUrl, paramObj, (response, err) => {
    callback(response, err);
  });
}

/**
 * 组织审核列表字段
 */
function certOrgColumn(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/platform/certOrg/list_render_info.json`);
  success = JSON.parse(JSON.stringify(success));
  callback(success);
}

/**
 * 组织审核搜索字段
 */
function certOrgSearch(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/platform/certOrg/search_render_info.json`);
  success = JSON.parse(JSON.stringify(success));
  callback(success);
}

/**
 * 组织审核详情字段
 */
function certOrgDetail(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/platform/certOrg/detail_render_info.json`);
  success = JSON.parse(JSON.stringify(success));
  callback(success);
}

/**
 * 组织审核列表
 * @param paramObj
 * @param callback
 */
function certOrgList(paramObj, callback) {
  const apiUrl = `${apiDomain}/cert_org/list`;
  HTTP.get(apiUrl, paramObj, (response, err) => {
    callback(response, err);
  });
}

/**
 * 组织审核列表数
 * @param paramObj
 * @param callback
 */
function certOrgCount(paramObj, callback) {
  const apiUrl = `${apiDomain}/cert_org/count`;
  HTTP.get(apiUrl, paramObj, (response, err) => {
    callback(response, err);
  });
}

/**
 * 组织审核详情
 * @param paramObj
 * @param callback
 */
function certOrgInfo(paramObj, callback) {
  const apiUrl = `${apiDomain}/cert_org/${paramObj.orgCode}/info`;
  HTTP.get(apiUrl, paramObj, (response, err) => {
    callback(response, err);
  });
}

/**
 * 组织审核
 * @param paramObj
 * @param callback
 */
function certOrgApproval(paramObj, callback) {
  const apiUrl = `${apiDomain}/cert_org/approve`;
  HTTP.post(apiUrl, paramObj, (response, err) => {
    callback(response, err);
  });
}

/**
 * 组织审核
 * @param orgCode
 * @param paramObj
 * @param callback
 */
function certOrgDisabled( certOrgRevokeApprove,orgCode, paramObj, callback) {
  const apiUrl = `${apiDomain}/cert_org/${orgCode}/disabled`;
  HTTP.post(apiUrl, paramObj, (response, err) => {
    callback(response, err);
  });
}

/**
 * 打回组织审核
 * @param userCode
 * @param callback
 */
function certOrgRevokeApprove(code, callback) {
  const apiUrl = `${apiDomain}/cert_org/${code}/approve/revoke`;
  HTTP.post(apiUrl, {}, (response, err) => {
    callback(response, err);
  });
}

/**
 * 司机审核列表字段
 */
 function certPersonColumn(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/platform/certPerson/list_render_info.json`);
  success = JSON.parse(JSON.stringify(success));
  callback(success);
 }

/**
 * 司机审核搜索字段
 */
function certPersonSearch(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/platform/certPerson/search_render_info.json`);
  success = JSON.parse(JSON.stringify(success));
  callback(success);
}

/**
 * 司机审核详情字段
 */
function certPersonDetail(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/platform/certPerson/detail_render_info.json`);
  success = JSON.parse(JSON.stringify(success));
  callback(success);
}

/**
 * 司机审核列表
 * @param paramObj
 * @param callback
 */
function certPersonList(paramObj, callback) {
  const apiUrl = `${apiDomain}/cert_person/list`;
  HTTP.get(apiUrl, paramObj, (response, err) => {
    callback(response, err);
  });
}

/**
 * 司机审核列表数
 * @param paramObj
 * @param callback
 */
function certPersonCount(paramObj, callback) {
  const apiUrl = `${apiDomain}/cert_person/count`;
  HTTP.get(apiUrl, paramObj, (response, err) => {
    callback(response, err);
  });
}

/**
 * 司机审核详情
 * @param paramObj
 * @param callback
 */
function certPersonInfo(paramObj, callback) {
  const apiUrl = `${apiDomain}/cert_person/${paramObj.code}/info`;
  HTTP.get(apiUrl, paramObj, (response, err) => {
    callback(response, err);
  });
}

/**
 * 司机审核
 * @param paramObj
 * @param callback
 */
function certPersonApproval(paramObj, callback) {
  const apiUrl = `${apiDomain}/cert_person/approve`;
  HTTP.post(apiUrl, paramObj, (response, err) => {
    callback(response, err);
  });
}

/**
 * 打回司机审核
 * @param userCode
 * @param callback
 */
function certPersonRevokeApprove(userCode, callback) {
  const apiUrl = `${apiDomain}/cert_person/${userCode}/approve/revoke`;
  HTTP.post(apiUrl, {}, (response, err) => {
    callback(response, err);
  });
}

/**
 * 司机冻结/解冻
 * @param userCode
 * @param paramObj
 * @param callback
 */
function certPersonDisabled(userCode, paramObj, callback) {
  const apiUrl = `${apiDomain}/cert_person/${userCode}/disabled`;
  HTTP.post(apiUrl, paramObj, (response, err) => {
    callback(response, err);
  });
}

function certTruckColumn(callback) {
    var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/platform/certTruck/list_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    callback(success);

  }
  
function certTruckSearch(callback) {
    var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/platform/certTruck/search_render_info.json`)
    success = JSON.parse(JSON.stringify(success));
    callback(success);
}

/**
 * 车辆审核详情字段
 */
function certTruckDetail(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/platform/certTruck/detail_render_info.json`)
    success = JSON.parse(JSON.stringify(success));
    callback(success);
}

/**
 * 车辆审核列表
 * @param paramObj
 * @param callback
 */
function certTruckList(paramObj, callback) {
  const apiUrl = `${apiDomain}/cert_truck/list`;
  HTTP.get(apiUrl, paramObj, (response, err) => {
    callback(response, err);
  });
}

/**
 * 车辆审核列表数
 * @param paramObj
 * @param callback
 */
function certTruckCount(paramObj, callback) {
  const apiUrl = `${apiDomain}/cert_truck/count`;
  HTTP.get(apiUrl, paramObj, (response, err) => {
    callback(response, err);
  });
}

/**
 * 车辆审核详情
 * @param paramObj
 * @param callback
 */
function certTruckInfo(paramObj, callback) {
  const apiUrl = `${apiDomain}/cert_truck/${paramObj.code}/info`;
  HTTP.get(apiUrl, paramObj, (response, err) => {
    callback(response, err);
  });
}

/**
 * 车辆审核
 * @param paramObj
 * @param callback
 */
function certTruckApproval(paramObj, callback) {
  const apiUrl = `${apiDomain}/cert_truck/approve`;
  HTTP.post(apiUrl, paramObj, (response, err) => {
    callback(response, err);
  });
}

/**
 * 打回车辆审核
 * @param truckCode
 * @param callback
 */
function certTruckRevokeApprove(truckCode, callback) {
  const apiUrl = `${apiDomain}/cert_truck/${truckCode}/approve/revoke`;
  HTTP.post(apiUrl, {}, (response, err) => {
    callback(response, err);
  });
}

/**
 * 车辆冻结/解冻
 * @param truckCode
 * @param paramObj
 * @param callback
 */
function certTruckDisabled(truckCode, paramObj, callback) {
  const apiUrl = `${apiDomain}/cert_truck/${truckCode}/disabled`;
  HTTP.post(apiUrl, paramObj, (response, err) => {
    callback(response, err);
  });
}

/**
 * 附件图片显示
 * @param resourceCode
 * @param paramObj
 * @param callback
 */
function getImage(resourceCode, paramObj, callback) {
  const apiUrl = `${apiDomain}/fw/image/${resourceCode}/get`;
  HTTP.get(apiUrl, paramObj, (response, err) => {
    callback(response, err);
  });
}

/**
 * 查询车源认证信息
 * @param userCode
 * @param paramObj
 * @param callback
 */
function transformInfo(paramObj, callback) {
  const apiUrl = `${apiDomain}/platform/cert_transport/${paramObj.userCode}/get`;
  HTTP.get(apiUrl, paramObj, (response, err) => {
    callback(response, err);
  });
}

/**
 * 查询司机认证信息
 * @param userCode
 * @param paramObj
 * @param callback
 */
function driverInfo(paramObj, callback) {
  const apiUrl = `${apiDomain}/cert_person/${paramObj.userCode}/get`;
  HTTP.get(apiUrl, paramObj, (response, err) => {
    callback(response, err);
  });
}

/**
 * 审核车源
 * @param paramObj
 * @param callback
 */
function auditTransport(paramObj, callback) {
  const apiUrl = `${apiDomain}/platform/cert/transport/${paramObj.userCode}/approve`;
  HTTP.post(apiUrl, paramObj, (response, err) => {
    callback(response, err);
  });
}

function exportPayLstS(paramObj, callback) {
  const apiUrl = `${apiDomain}/export/custom/waybillPaybillForS`;
  HTTP.postJson(apiUrl, paramObj, (response, err) => {
    callback(response, err);
  });
}

function exportApproveLstS(paramObj, callback) {
  const apiUrl = `${apiDomain}/export/custom/waybillPlatform`;
  HTTP.postJson(apiUrl, paramObj, (response, err) => {
    callback(response, err);
  });
}


// 基本配置页面的 get 请求 .....
function getCoreConfig( paramObj, callback) {
  const apiUrl = `${apiDomain}/platform/core/config`;
  HTTP.get(apiUrl, paramObj, (response, err) => {
    callback(response, err);
  });
}
// 基本配置页面的 post 请求 .....
function postCoreConfig(paramObj, callback) {
   const apiUrl = `${apiDomain}/platform/core/config`;
  HTTP.postJson(apiUrl, paramObj, (response, err) => {
    callback(response, err);
  });
}

// 获取详情显示字段
function getDetailCertOrg(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/platform/certOrg/detail_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    cb(success);
}


export {postCoreConfig, getCoreConfig ,setUserInfoCode,
certOrgColumn, certOrgSearch, certOrgDetail, certOrgList, certOrgCount, certOrgInfo, certOrgApproval, certOrgDisabled, certOrgRevokeApprove,
certPersonColumn, certPersonSearch, certPersonDetail, certPersonList, certPersonCount, certPersonInfo, certPersonApproval, certPersonRevokeApprove, certPersonDisabled,
certTruckColumn, certTruckSearch, certTruckDetail, certTruckList, certTruckCount, certTruckInfo, certTruckApproval, certTruckRevokeApprove, certTruckDisabled, getImage,
transformInfo, driverInfo, auditTransport, exportPayLstS, exportApproveLstS,getDetailCertOrg };
