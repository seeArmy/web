/**
 * Created by cc on 2017/11/6.
 */

import * as HTTP from './httpUtil';

const apiDomain = require('./ApiConst').apiPlatformDomain;
const fieldMetadataDir = require('./ApiConst').fieldMetadataDir;
import { getParamsFromURL } from '../api/Utils';

/**
 * 添加
 */
function add(paramObj, callback) {
  const apiUrl = `${apiDomain}/accountingChargeItem/add`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 编辑
 */
function edit(code, paramObj, callback) {
  const apiUrl = `${apiDomain}/accountingChargeItem/edit`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 列表
 */
function list(paramObj, callback) {
  const apiUrl = `${apiDomain}/accountingChargeItem/list`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 删除
 */
function deleted(code, paramObj, callback) {
  const apiUrl = `${apiDomain}/accountingChargeItem/delete/${code}`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 根据编码获取详情
 */
function get(paramObj, callback) {
  const apiUrl = `${apiDomain}/accountingChargeItem/detail/${paramObj.code}`;
  delete paramObj.code;
  if(!paramObj.ownerOrgCode){
    paramObj.ownerOrgCode = getParamsFromURL(window.location.search).ownerOrgCode;
  }
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 获取列表字段
 */
function getColumn(callback) {
  var success = require(`./fieldMetadata/${fieldMetadataDir}/platform/chargeItem/list_render_info.json`);
  success = JSON.parse(JSON.stringify(success));
  callback(success);
}

export { add, edit, list, deleted, get, getColumn };
