/**
 * Created by cc on 2017/10/9.
 */

import * as HTTP from './httpUtil';

const ApiConst = require('./ApiConst');
const apiPersonDomain = ApiConst.apiPersonDomain;

/**
 * 添加考勤
 */
function add(paramObj, callback) {
  const apiUrl = `${apiPersonDomain}/member/person_attendance_info/add`;
  HTTP.post(apiUrl, paramObj, (res, error) => {
    callback(res, error);
  });
}

/**
 * 编辑考勤
 */
function edit(code, paramObj, callback) {
  const apiUrl = `${apiPersonDomain}/member/person_attendance_info/edit`;
  HTTP.post(apiUrl, paramObj, (response, err) => {
    callback(response, err);
  });
}

/**
 * 获取考勤列表
 */
function list(paramObj, callback) {
  const apiUrl = `${apiPersonDomain}/member/person_attendance_info/list`;
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
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/person/attendance/list_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}

/**
 * 获取serach数据
 * @param callback
 */
function getSearch(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/person/attendance/search_render_info.json`)
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
  const apiUrl = `${apiPersonDomain}/member/person_attendance_info/${paramObj.code}/get`;
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
  const apiUrl = `${apiPersonDomain}/member/person_attendance_info/${paramObj.code}/delete`;
  HTTP.post(apiUrl, {}, (success, error) => {
    callback(success, error);
  });
}

/**
 * export
 * @param callback
 */
function exportCsv(paramObj, callback) {
  const apiUrl = `${apiPersonDomain}/export/custom/attendance`;
  HTTP.postJson(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 下载错误数据的CSV文件
 */
function downloadErrorData(paramObj, callback) {
  const apiUrl = `${apiPersonDomain}/generator/attendance`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 下载CSV模板
 */
function downloadTemplate(paramObj, callback) {
  const apiUrl = `${apiPersonDomain}/download/template/attendance`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}


export { add, edit, list, getColumn, getSearch, get, deleted, exportCsv, downloadErrorData, downloadTemplate };
