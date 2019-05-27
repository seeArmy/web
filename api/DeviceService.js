/**
 * Created by zyc on 2017/8/11.
 */

import * as HTTP from './httpUtil';

const ApiConst = require('./ApiConst');
const apiLbsDomain = ApiConst.apiLbsDomain;

/**
 * 添加设备
 */
function add(paramObj, callback) {
  callback(null, {content: '不支持添加操作！'});
}

/**
 * 编辑设备
 */
function edit(code, paramObj, callback) {
  const apiUrl = `${apiLbsDomain}/lbs/${code}/device_bind_truck`;
  HTTP.post(apiUrl, paramObj, (response, err) => {
    callback(response, err);
  });
}

/**
 * 获取设备列表
 */
function list(paramObj, callback) {
  const apiUrl = `${apiLbsDomain}/lbs/device_bind_truck/list`;
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
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/lbs/device/list_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}

/**
 * 获取serach数据
 * @param callback
 */
function getSearch(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/lbs/device/search_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
  callback(success);
}

/**
 * 根据伙伴编码获取车辆详情
 * @param paramObj        参数对象
 *         partnerOrgCode
 * @param callback
 */
function get(paramObj, callback) {
  const apiUrl = `${apiLbsDomain}/lbs/device_base_info/${paramObj.code}/info`;
  HTTP.get(apiUrl, {}, (success, error) => {
    callback(success, error);
  });
}

/**
 * 删除车辆
 * @param paramObj          参数对象
 *         partnerOrgCode    编码
 * @param callback          回调
 */
function deleted(paramObj, callback) {
  const apiUrl = `${apiLbsDomain}/lbs/device_bind_truck/${paramObj.code}/remove`;
  HTTP.post(apiUrl, {}, (success, error) => {
    callback(success, error);
  });
}

/**
 * export
 * @param callback
 */
function exportCsv(paramObj, callback) {
  const apiUrl = `${apiLbsDomain}/export/custom/device`;
  HTTP.postJson(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 下载错误数据的CSV文件
 */
function downloadErrorData(paramObj, callback) {
  const apiUrl = `${apiLbsDomain}/generator/device`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 下载CSV模板
 */
function downloadTemplate(paramObj, callback) {
  const apiUrl = `${apiLbsDomain}/download/template/device`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

export { add, edit, list, getColumn, getSearch, get, deleted, exportCsv, downloadErrorData, downloadTemplate };
