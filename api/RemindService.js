
import * as HTTP from './httpUtil';
var ApiConst= require('./ApiConst');
const apiDomain = ApiConst.apiMaintenaceDomain;

/**
 * 获取待办提醒列表
 */
function list(paramObj, callback) {
  const apiUrl = `${apiDomain}/maintenance_remind_record/list`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 删除待办提醒
 */
function deleted(paramObj, callback) {
  const apiUrl = `${apiDomain}/maintenance_remind_record/${paramObj.code}/delete`;
  HTTP.post(apiUrl, {}, (success, error) => {
    callback(success, error);
  });
}

/**
 * 获取table头部数据
 * @param callback
 */
function getColumn(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/maintenance/remind/list_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}

/**
 * 获取serach数据
 * @param callback
 */
function getSearch(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/maintenance/remind/search_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}

/**
 * 获取待办提醒详情
 * @param callback
 */
function getDetail(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/maintenance/remind/detail_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}

/**
 * export
 * @param callback
 */
function exportCsv(paramObj, callback) {
  const apiUrl = `${apiDomain}/export/custom/remind`;
  HTTP.postJson(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 下载错误数据的CSV文件
 */
function downloadErrorData(paramObj, callback) {
  const apiUrl = `${apiDomain}/generator/remind`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 下载CSV模板
 */
function downloadTemplate(paramObj, callback) {
  const apiUrl = `${apiDomain}/download/template/remind`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

//主要就是消除警报
function add(paramObj, callback) {
 callback(null);
}

export { list, deleted, getColumn, getSearch, getDetail, exportCsv, downloadErrorData, downloadTemplate ,add};
