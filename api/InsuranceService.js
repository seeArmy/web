
import * as HTTP from './httpUtil';
var ApiConst= require('./ApiConst');
const apiDomain = ApiConst.apiMaintenaceDomain;

/**
 * 添加保险记录
 */
function add(paramObj, callback) {
  const apiUrl = `${apiDomain}/maintenance_insurance_record/add`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 编辑保险记录
 */
function edit(code, paramObj, callback) {
  const apiUrl = `${apiDomain}/maintenance_insurance_record/${code}/edit`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 获取保险记录列表
 */
function list(paramObj, callback) {
  const apiUrl = `${apiDomain}/maintenance_insurance_record/list`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 删除保险记录
 */
function deleted(paramObj, callback) {
  const apiUrl = `${apiDomain}/maintenance_insurance_record/${paramObj.code}/delete`;
  HTTP.post(apiUrl, {}, (success, error) => {
    callback(success, error);
  });
}

/**
 * 根据保险记录id获取详情
 */
function get(paramObj, callback) {
  const apiUrl = `${apiDomain}/maintenance_insurance_record/${paramObj.code}/get`;
  HTTP.get(apiUrl, {}, (success, error) => {
    callback(success, error);
  });
}

/**
 * 获取table头部数据
 * @param callback
 */
function getColumn(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/maintenance/insurance/list_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}

/**
 * 获取serach数据
 * @param callback
 */
function getSearch(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/maintenance/insurance/search_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}

/**
 * 获取保险记录详情
 * @param callback
 */
function getDetail(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/maintenance/insurance/detail_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}


/**
 * export
 * @param callback
 */
function exportCsv(paramObj, callback) {
  const apiUrl = `${apiDomain}/export/custom/insurance`;
  HTTP.postJson(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 下载错误数据的CSV文件
 */
function downloadErrorData(paramObj, callback) {
  const apiUrl = `${apiDomain}/generator/insurance`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 下载CSV模板
 */
function downloadTemplate(paramObj, callback) {
  const apiUrl = `${apiDomain}/download/template/insurance`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

export { add, edit, list, deleted, get, getColumn, getSearch, getDetail, exportCsv, downloadErrorData, downloadTemplate };
