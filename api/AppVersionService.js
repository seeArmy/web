/**
 * Created by mayangyang on 2018/3/30.
 */

import * as utils from './Utils';

const axios = require('axios');
var ApiConst= require('./ApiConst');
const apiDomain = ApiConst.apiDiverApiDomain;
axios.defaults.withCredentials=true;

import * as HTTP from './httpUtil';


/**
 * 获取列表
 */
function list(paramObj, cb) {
  const apiUrl = `${apiDomain}/driver_api/driver_api_app_versions/list`;
  HTTP.get(apiUrl, paramObj, (response, error) => {
    cb(response, error);
  });
}

/**
 * 获取table头部数据
 * @param callback
 */
function getColumn(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/driver-api/version/list_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    cb(success);
}

/**
 * 获取search数据
 * @param callback
 */
function getSearch(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/driver-api/version/search_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    cb(success);
}

/**
 * 删版本管理信息
 * @param paramObj          参数对象
 *        code              编码
 * @param callback          回调
 */
function deleted(paramObj, cb) {
  const apiUrl = `${apiDomain}/driver_api/driver_api_app_versions/${paramObj.code}/delete`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    cb(success, error);
  });
}

/**
 * 添加版本管理
 * @param partnerName       简称
 * @param callback          回调
 */
function add(paramObj, cb) {
  const apiUrl = `${apiDomain}/driver_api/driver_api_app_versions/add`;
  HTTP.post(apiUrl, paramObj, (res, error) => {
    cb(res, error);
  });
}

/**
 * 编辑版本管理
 * @param partnerName       简称
 * @param callback          回调
 */
function edit(code, paramObj, cb) {
  const apiUrl = `${apiDomain}/driver_api/driver_api_app_versions/${code}/edit`;
  HTTP.post(apiUrl, paramObj, (res, error) => {
    cb(res, error);
  });
}

/**
 * 根据线路编码获取线路详情
 * @param paramObj        参数对象
 *        code
 * @param callback
 */
function get(paramObj, cb) {
  const apiUrl = `${apiDomain}/driver_api/driver_api_app_versions/${paramObj.code}/get`;
  HTTP.get(apiUrl, paramObj, (res, error) => {
    cb(res, error);
  });
}

/**
 * export
 * @param callback
*/
function exportCsv(paramObj, callback) {
  const apiUrl = `${apiDomain}/export/custom/route`;
  HTTP.postJson(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}


/**
 * 下载错误数据的CSV文件
 */
function downloadErrorData(paramObj, callback) {
  const apiUrl = `${apiDomain}/generator/route`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 下载CSV模板
 */
function downloadTemplate(paramObj, callback) {
  const apiUrl = `${apiDomain}/download/template/route`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

export { list, getColumn, getSearch, deleted, add, edit, get, exportCsv, downloadErrorData, downloadTemplate };
