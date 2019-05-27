import * as utils from './Utils';
import * as HTTP from './httpUtil';

const ApiConst = require('./ApiConst');
const apiFreightDomain = ApiConst.apiFreightDomain;
const apiWayBillDomain = ApiConst.apiWayBillDomain;

/**
 * 获取货源接单记录列表
 */
function list(paramObj, callback) {
  const apiUrl = `${apiFreightDomain}/freight_accept_record/list`;
  HTTP.get(apiUrl, paramObj, (response, err) => {
    callback(response, err);
  });
}

/**
 * 编辑货源
 */
function edit(code, paramObj, callback) {
  const apiUrl = `${apiFreightDomain}/freight_accept_record/${code}/edit`;
  HTTP.post(apiUrl, paramObj, (response, err) => {
    callback(response, err);
  });
}

/**
 * 获取货源接单记录详情
 * @param paramObj        参数对象
 *         partnerOrgCode
 * @param callback
 */
function get(paramObj, callback) {
  const apiUrl = `${apiFreightDomain}/freight_accept_record/${paramObj.code}/get`;
  HTTP.get(apiUrl, {}, (success, error) => {
    callback(success, error);
  });
}

/**
 * 获取table头部数据
 * @param callback
 */
function getColumn(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/freight/freightAcceptRecord/list_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}

/**
 * 获取serach数据
 * @param callback
 */
function getSearch(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/freight/freightAcceptRecord/search_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}

/**
 * export
 * @param callback
 */
function exportCsv(paramObj, callback) {
  const apiUrl = `${apiFreightDomain}/export/freightAcceptRecord`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * batchSubmit
 * @param callback
 */
function batchSubmit(paramObj, callback) {
  const apiUrl = `${apiFreightDomain}/freight_accept_record/${paramObj.code}/dispatch`;
  HTTP.post(apiUrl, {}, (success, error) => {
    callback(success, error);
  });
}

/**
 * batchSubmit
 * @param callback
 */
function batchIgnored(paramObj, callback) {
  const apiUrl = `${apiFreightDomain}/freight_accept_record/${paramObj}/ignored`;
  HTTP.post(apiUrl, {}, (success, error) => {
    callback(success, error);
  });
}

/**
 * 下载错误数据的CSV文件
 */
function downloadErrorData(paramObj, callback) {
  const apiUrl = `${apiFreightDomain}/generator/freightAcceptRecord`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 下载CSV模板
 */
function downloadTemplate(paramObj, callback) {
  const apiUrl = `${apiFreightDomain}/download/template/freightAcceptRecord`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

export { list, edit, get, getColumn, getSearch, exportCsv, batchSubmit, batchIgnored, downloadErrorData, downloadTemplate };
