/**
 * Created by zyc on 2017/7/4.
 */

import * as utils from './Utils';
import * as HTTP from './httpUtil';

const ApiConst = require('./ApiConst');
const apiDomain = ApiConst.apiOrgDomain;
const apiPersonDomain = ApiConst.apiPersonDomain;

/**
 * 添加司机
 */
function add(paramObj, callback) {
  const apiUrl = `${apiPersonDomain}/person/driver/add`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 编辑司机
 */
function edit(code, paramObj, callback) {
  const apiUrl = `${apiPersonDomain}/person/driver/${code}/edit`;
  HTTP.post(apiUrl, paramObj, (response, err) => {
    callback(response, err);
  });
}

function editBank(paramObj, success) {
  const apiUrl = `${apiPersonDomain}/person/driver/${paramObj.code}/editBank`;
  HTTP.post(apiUrl, paramObj, (response, err) => {
    success(response, err);
  });
}

/**
 * 获取司机列表
 */
function list(paramObj, callback) {
  const apiUrl = `${apiPersonDomain}/person/driver/list`;
  HTTP.get(apiUrl, paramObj, (response, err) => {
    callback(response, err);
  });
}

/**
 * 司机列表 通过平台查找 POST /platform/person/list
 */
function listPlatform(paramObj, callback) {
  const apiUrl = `${ApiConst.BaseDomain}/platform/platform/person/list`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 获取table头部数据
 * @param callback
 */
function getColumn(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/person/driver/list_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}

/**
 * 获取详情 字段
 * @param callback
 */
function getColumnDetail(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/person/driver/detail_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}

/**
 * 获取serach数据
 * @param callback
 */
function getSearch(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/person/driver/search_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}

/**
 * 根据伙伴编码获取详情
 * @param paramObj        参数对象
 *         partnerOrgCode
 * @param callback
 */
function get(paramObj, callback) {
  const apiUrl = `${apiPersonDomain}/person/driver/${paramObj.code}/get`;
  HTTP.get(apiUrl, utils.codeNull(paramObj), (success, error) => {
    callback(success, error);
  });
}

function getAccountInfo(paramObj, callback) {
  const apiUrl = `${apiPersonDomain}/person/person_account/list`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
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
  const apiUrl = `${ApiConst.apiPersonDomain}/person/driver/${paramObj.code}/delete`;
  HTTP.post(apiUrl, {}, (success, error) => {
    callback(success, error);
  });
}

/**
 * export
 * @param callback
 */
function exportCsv(paramObj, callback) {
  const apiUrl = `${ApiConst.apiPersonDomain}/export/custom/driver`;
  HTTP.postJson(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 下载错误数据的CSV文件
 */
function downloadErrorData(paramObj, callback) {
  const apiUrl = `${ApiConst.apiPersonDomain}/generator/driver`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 下载CSV模板
 */
function downloadTemplate(paramObj, callback) {
  const apiUrl = `${ApiConst.apiPersonDomain}/download/template/driver`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 申请认证
 * @param code
 * @param callback
 */
function verify(code, callback) {
  const apiUrl = `${ApiConst.apiPersonDomain}/person/driver/${code}/verify`;
  HTTP.post(apiUrl, {}, (success, error) => {
    callback(success, error);
  });
}

/**
 * 获取标签列表
 */
function tagList(callback) {
  const apiUrl = `${ApiConst.apiPersonDomain}/tag_info/person/list`
  HTTP.get(apiUrl, {}, (success, error) => {
    callback(success, error);
  });
}

// 添加标签
function addTag(paramObj, callback) {
  const apiUrl = `${ApiConst.apiPersonDomain}/tag_info/person/add`
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

// 编辑标签
function editTag(paramObj, callback) {
  const apiUrl = `${ApiConst.apiPersonDomain}/tag_info/person/edit`
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

// 删除标签
function deleteTag(paramObj, callback) {
  const apiUrl = `${ApiConst.apiPersonDomain}/tag_info/person/delete`
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

export {getColumnDetail,listPlatform, add, edit, editBank, list, getColumn, getSearch, get, getAccountInfo, deleted, exportCsv, downloadErrorData, downloadTemplate, verify,
  tagList, addTag, editTag, deleteTag };
