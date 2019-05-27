/**
 * Created by cc on 2017/10/9.
 */

import * as HTTP from './httpUtil';

const ApiConst = require('./ApiConst');
const apiLogisticsDomain = ApiConst.apiLogisticsDomain,
  BaseDomain = ApiConst.BaseDomain;
/**
 * 添加合约
 */
function add(paramObj, callback) {
  const apiUrl = `${apiLogisticsDomain}/logistics_contract/add`;
  HTTP.post(apiUrl, paramObj, (res, error) => {
    callback(res, error);
  });
}

/**
 * 下载更新合约
 */
function addOrUpdate(paramObj, callback) {
  const apiUrl = `${apiLogisticsDomain}/logistics_contract/addOrUpdate`;
  HTTP.post(apiUrl, paramObj, (res, error) => {
    callback(res, error);
  });
}

/**
 * 编辑合约
 */
function edit(code, paramObj, callback) {
  const apiUrl = `${apiLogisticsDomain}/logistics_contract/${code}/edit`;
  HTTP.post(apiUrl, paramObj, (response, err) => {
    callback(response, err);
  });
}

/**
 * 获取合约列表
 */
function list(paramObj, callback) {
  const apiUrl = `${apiLogisticsDomain}/logistics_contract/list`;
  // console.log(apiUrl);
  HTTP.get(apiUrl, paramObj, (response, err) => {
    callback(response, err);
  });
}

/**
 * 获取下载合约列表
 */
function downloadList(paramObj, callback) {
  const apiUrl = `${BaseDomain}/smartz/call`;
  // console.log(apiUrl);
  HTTP.get(apiUrl, paramObj, (response, err) => {
    callback(response, err);
  });
}

/**
 * 获取合约列表 (运营中心里面)
 */
function listPlatform(paramObj, callback) {
  const apiUrl = `${apiLogisticsDomain}/logistics_contract/platform/list`;
  // console.log(apiUrl);
  HTTP.get(apiUrl, paramObj, (response, err) => {
    callback(response, err);
  });
}

/**
 * 获取table头部数据
 * @param callback
 */
function getColumn(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/logistics/contract/list_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}

/**
 * 获取table头部数据 (platform)
 * @param callback
 */
function getColumnPlatform(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/logistics/platformContract/list_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}

/**
 * 获取serach数据
 * @param callback
 */
function getSearch(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/logistics/contract/search_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}

/**
 * 获取serach数据
 * @param callback
 */
function getSearchPlatform(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/logistics/platformContract/search_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}

/**
 * 根据编码获取详情
 * @param paramObj        参数对象
 *         partnerOrgCode
 * @param callback
 */
function get(paramObj, callback) {
  const apiUrl = `${apiLogisticsDomain}/logistics_contract/${paramObj.code}/get`;
  HTTP.get(apiUrl, {}, (success, error) => {
    callback(success, error);
  });
}

/**
 * 删除
 * @param paramObj          参数对象
 *         partnerOrgCode    编码
 * @param callback          回调
 */
function deleted(paramObj, callback) {
  const apiUrl = `${apiLogisticsDomain}/logistics_contract/${paramObj.code}/delete`;
  HTTP.post(apiUrl, {}, (success, error) => {
    callback(success, error);
  });
}

/**
 * export
 * @param callback
 */
function exportCsv(paramObj, callback) {
  const apiUrl = `${apiLogisticsDomain}/export/contract`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 下载错误数据的CSV文件
 */
function downloadErrorData(paramObj, callback) {
  const apiUrl = `${apiLogisticsDomain}/generator/contract`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 下载CSV模板
 */
function downloadTemplate(paramObj, callback) {
  const apiUrl = `${apiLogisticsDomain}/download/template/contract`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

export { getColumnPlatform, getSearchPlatform, listPlatform, add, addOrUpdate, edit, list, downloadList, getColumn, getSearch, get, deleted, exportCsv, downloadErrorData, downloadTemplate };
