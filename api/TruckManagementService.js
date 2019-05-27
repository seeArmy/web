/**
 * Created by cc on 2017/10/24.
 */

import * as HTTP from './httpUtil';

const ApiConst = require('./ApiConst');
const apiDomain = ApiConst.apiPlatformDomain,
      apiOrgDomain = ApiConst.apiOrgDomain;

/**
 * 车辆管理列表
 */
function list(paramObj, callback) {
  const apiUrl = `${apiDomain}/platform/truck/manager/list`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}


function listMatch(paramObj, callback) {
  const apiUrl = `${apiDomain}/platform/member/truck/get`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 根据车辆管理编码获取详情
 */
function get(paramObj, callback) {
  const apiUrl = `${apiDomain}/platform/truck/manager/${paramObj.code}/get`;
  HTTP.get(apiUrl, {}, (success, error) => {
    callback(success, error);
  });
}
/**
 * 编辑车辆管理
 * @param paramObj     参数对象
 * @param callback
 */
function edit(code, paramObj, cb) {
  const apiUrl = `${apiDomain}/platform/truck/edit`;
  HTTP.post(apiUrl, paramObj, (res, error) => {
    cb(res, error);
  });
}

/**
 * 获取列表字段
 */
function getColumn(callback) {
    var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/platform/truck/list_render_info.json`)
    success = JSON.parse(JSON.stringify(success));
    callback(success);
}

/**
 * 获取搜索字段
 */
function getSearch(callback) {
    var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/platform/truck/search_render_info.json`)
    success = JSON.parse(JSON.stringify(success));
    callback(success);
}

/**
 * 拉入黑名单
 */
function blacklist(truckCode, paramObj, callback) {
  const apiUrl = `${apiDomain}/platform/truck/manager/${truckCode}/blacklist`;
  HTTP.post(apiUrl, paramObj, (response, err) => {
    callback(response, err);
  });
}

// 导出
function exportCsv(paramObj, callback) {
  const apiUrl = `${apiDomain}/export/custom/memberTruck`;
  HTTP.postJson(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

// 获取详情显示字段
function getDetail(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/platform/truck/detail_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    cb(success);
}

/**
 * 获取公司
 * @param mark          检索
 * @param page          页码
 * @param size          页长
 * @param callback      回调
 */
function joinCompany(paramObj, cb) {
  const apiUrl = `${apiOrgDomain}/org/truck_join_list`;
  HTTP.get(apiUrl, paramObj, (response, error) => {
    cb(response, error);
  });
}


export { list, get, edit, getColumn, getSearch, blacklist ,listMatch, exportCsv, joinCompany };
