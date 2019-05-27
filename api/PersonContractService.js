/**
 * Created by cc on 2017/10/9.
 */

import * as HTTP from './httpUtil';

const ApiConst = require('./ApiConst');
const apiPersondomAin = ApiConst.apiPersonDomain;

/**
 * 添加合约
 */
function add(paramObj, callback) {
  const apiUrl = `${apiPersondomAin}/member/person_contract_info/add`;
  HTTP.post(apiUrl, paramObj, (res, error) => {
    callback(res, error);
  });
}

/**
 * 编辑合约
 */
function edit(code, paramObj, callback) {
  const apiUrl = `${apiPersondomAin}/member/person_contract_info/edit`;
  HTTP.post(apiUrl, paramObj, (response, err) => {
    callback(response, err);
  });
}

/**
 * 获取合约列表
 */
function list(paramObj, callback) {
  const apiUrl = `${apiPersondomAin}/member/person_contract_info/list`;
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
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/person/contract/list_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}

/**
 * 获取table头部数据 (platform)
 * @param callback
 */
function getColumnPlatform(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/person/contract/list_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}

/**
 * 获取serach数据
 * @param callback
 */
function getSearch(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/person/contract/search_render_info.json`)
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
  const apiUrl = `${apiPersondomAin}/member/person_contract_info/${paramObj.code}/get`;
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
  const apiUrl = `${apiPersondomAin}/member/person_contract_info/${paramObj.code}/delete`;
  HTTP.post(apiUrl, {}, (success, error) => {
    callback(success, error);
  });
}

/**
 * export
 * @param callback
 */
function exportCsv(paramObj, callback) {
  const apiUrl = `${apiPersondomAin}/member/export/contract`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 下载错误数据的CSV文件
 */
function downloadErrorData(paramObj, callback) {
  const apiUrl = `${apiPersondomAin}/member/generator/contract`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 下载CSV模板
 */
function downloadTemplate(paramObj, callback) {
  const apiUrl = `${apiPersondomAin}/member/download/template/contract`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

export { getColumnPlatform ,listPlatform, add, edit, list, getColumn, getSearch, get, deleted, exportCsv, downloadErrorData, downloadTemplate };
