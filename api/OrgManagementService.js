/**
 * Created by cc on 2017/10/20.
 */

import * as HTTP from './httpUtil';
var ApiConst= require('./ApiConst');
const apiDomain = ApiConst.apiPlatformDomain;

/**
 * 添加组织管理
 */
function add(paramObj, callback) {
  const apiUrl = `${apiDomain}/org/manager/add`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 编辑组织管理
 */
function edit(code, paramObj, callback) {
  const apiUrl = `${apiDomain}/org/manager/edit`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 组织管理列表
 */
function list(paramObj, callback) {
  const apiUrl = `${apiDomain}/org/manager/list`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 根据组织管理编码获取详情
 */
function get(paramObj, callback) {
  const apiUrl = `${apiDomain}/org/manager/detail/${paramObj.code}`;
  HTTP.get(apiUrl, {}, (success, error) => {
    callback(success, error);
  });
}

/**
 * 获取列表字段
 */
function getColumn(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/platform/org/list_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}

/**
 * 获取搜索字段
 */
function getSearch(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/platform/org/search_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}

/**
 * 获取详情字段
 */
function getDetail(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/platform/org/detail_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}

/**
 * export
 * @param callback  apiOrgDomain
 */
function exportCsv(paramObj, callback) {
  const apiUrl = `${ApiConst.apiOrgDomain}/export/custom/platformOrg`;
  HTTP.postJson(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}


export { add, edit, list, get, getColumn, getSearch, getDetail ,exportCsv };
