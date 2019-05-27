
import * as HTTP from './httpUtil';

var ApiConst= require('./ApiConst');
const apiDomain = ApiConst.apiLogisticsDomain;

/**
 * 获取保单table头部数据
 * @param callback
 */
function getColumn(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/logistics/InsurancePolicy/list_render_info.json`);
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}

/**
 * 获取保单serach数据
 * @param callback
 */
function getSearch(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/logistics/InsurancePolicy/search_render_info.json`);
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}


/**
 * 查询保单列表
 */
function getList(paramObj, callback) {
  const apiUrl = `${apiDomain}/logistics/logistics_insurance/list`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 删除保单
 */
function remove(paramObj, callback) {
  const apiUrl = `${apiDomain}/logistics/logistics_insurance/${paramObj.code}/delete`;
  HTTP.post(apiUrl, {code:paramObj.code}, (success, error) => {
    callback(success, error);
  });
}
/**
 * 获取保单详情
 */
function get(paramObj, callback) {
  const apiUrl = `${apiDomain}/logistics/logistics_insurance/${paramObj.code}/get`;
  HTTP.get(apiUrl,paramObj, (success, error) => {
    callback(success, error);
  });
}
/**
 * 新增运价详情
 */
function add(paramObj, callback) {
  const apiUrl = `${apiDomain}/logistics/logistics_insurance/add`;;
  HTTP.post(apiUrl,paramObj, (success, error) => {
    callback(success, error);
  });
}
/**
 * 编辑运价详情
 */
function edit(code,paramObj, callback) {
  const apiUrl = `${apiDomain}/logistics/logistics_insurance/edit`;
  HTTP.post(apiUrl,paramObj, (success, error) => {
    callback(success, error);
  });
}
/**
 * 获取公调页面详情
 */
function getPage(paramObj, callback) {
  const apiUrl = `${apiDomain}/api/logistics_insurance/${paramObj.code}/get`;
  HTTP.get(apiUrl,paramObj, (success, error) => {
    callback(success, error);
  });
}

function getFile(paramObj, callback) {
  const apiUrl = `${apiDomain}/api/public/file/logistics/${paramObj.resourceCode}/get`;
  HTTP.get(apiUrl,paramObj, (success, error) => {
    callback(success, error);
  });
}

export { getColumn,getSearch,getList,remove,add,edit,get,getPage,getFile};
