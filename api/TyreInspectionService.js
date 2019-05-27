
import * as HTTP from './httpUtil';
var ApiConst= require('./ApiConst');
const apiDomain = ApiConst.apiMaintenaceDomain;

/**
 * 添加轮胎巡检
 */
function add(paramObj, callback) {
  const apiUrl = `${apiDomain}/maintenance_tyre_inspection_record/add`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 编辑轮胎巡检
 */
function edit(code, paramObj, callback) {
  const apiUrl = `${apiDomain}/maintenance_tyre_inspection_record/${code}/edit`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 获取轮胎巡检列表
 */
function list(paramObj, callback) {
  const apiUrl = `${apiDomain}/maintenance_tyre_inspection_record/list`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 删除轮胎巡检
 */
function deleted(paramObj, callback) {
  const apiUrl = `${apiDomain}/maintenance_tyre_inspection_record/${paramObj.code}/delete`;
  HTTP.post(apiUrl, {}, (success, error) => {
    callback(success, error);
  });
}

/**
 * 根据轮胎巡检id获取详情
 */
function get(paramObj, callback) {
  const apiUrl = `${apiDomain}/maintenance_tyre_inspection_record/${paramObj.code}/get`;
  HTTP.get(apiUrl, {}, (success, error) => {
    callback(success, error);
  });
}

/**
 * 获取table头部数据
 * @param callback
 */
function getColumn(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/maintenance/tyreInspection/list_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}

/**
 * 获取serach数据
 * @param callback
 */
function getSearch(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/maintenance/tyreInspection/search_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}

/**
 * 获取轮胎巡检详情
 * @param callback
 */
function getDetail(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/maintenance/tyreInspection/detail_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}


/**
 * export
 * @param callback
 */
function exportCsv(paramObj, callback) {
  const apiUrl = `${apiDomain}/export/custom/tyreInspection`;
  HTTP.postJson(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 下载错误数据的CSV文件
 */
function downloadErrorData(paramObj, callback) {
  const apiUrl = `${apiDomain}/generator/tyreInspection`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 下载CSV模板
 */
function downloadTemplate(paramObj, callback) {
  const apiUrl = `${apiDomain}/download/template/tyreInspection`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

export { add, edit, list, deleted, get, getColumn, getSearch, getDetail, exportCsv, downloadErrorData, downloadTemplate };
