
import * as HTTP from './httpUtil';

var ApiConst= require('./ApiConst');
const apiDomain =ApiConst.apiMaintenaceDomain;

/**
 * 添加事故记录
 */
function add(paramObj, callback) {
  const apiUrl = `${apiDomain}/maintenance_accident_record/add`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 编辑事故记录
 */
function edit(code, paramObj, callback) {
  const apiUrl = `${apiDomain}/maintenance_accident_record/${code}/edit`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 获取事故记录列表
 */
function list(paramObj, callback) {
  const apiUrl = `${apiDomain}/maintenance_accident_record/list`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 删除事故记录
 */
function deleted(paramObj, callback) {
  const apiUrl = `${apiDomain}/maintenance_accident_record/${paramObj.code}/delete`;
  HTTP.post(apiUrl, {}, (success, error) => {
    callback(success, error);
  });
}

/**
 * 根据事故记录id获取详情
 */
function get(paramObj, callback) {
  const apiUrl = `${apiDomain}/maintenance_accident_record/${paramObj.code}/get`;
  HTTP.get(apiUrl, {}, (success, error) => {
    callback(success, error);
  });
}

/**
 * 获取table头部数据
 * @param callback
 */
function getColumn(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/maintenance/accident/list_render_info.json`);
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}

/**
 * 获取serach数据
 * @param callback
 */
function getSearch(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/maintenance/accident/search_render_info.json`);
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}

/**
 * 获取事故记录详情
 * @param callback
 */
function getDetail(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/maintenance/accident/detail_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}


/**
 * export
 * @param callback
 */
function exportCsv(paramObj, callback) {
  const apiUrl = `${apiDomain}/export/custom/accident`;
  HTTP.postJson(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 下载错误数据的CSV文件
 */
function downloadErrorData(paramObj, callback) {
  const apiUrl = `${apiDomain}/generator/accident`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 下载CSV模板
 */
function downloadTemplate(paramObj, callback) {
  const apiUrl = `${apiDomain}/download/template/accident`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

export { add, edit, list, deleted, get, getColumn, getSearch, getDetail, exportCsv, downloadErrorData, downloadTemplate };
