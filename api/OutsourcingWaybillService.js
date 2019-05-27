/**
 * Created by cc on 2017/9/23.
 */

import * as HTTP from './httpUtil';

const ApiConst = require('./ApiConst');
const apiWayBillDomain = ApiConst.apiWayBillDomain;

/**
 * 添加外包运单
 */
function add(paramObj, callback) {
  const apiUrl = `${apiWayBillDomain}/outsourcing_waybill/add`;
  HTTP.post(apiUrl, paramObj, (res, error) => {
    callback(res, error);
  });
}

/**
 * 编辑外包运单
 */
function edit(code, paramObj, callback) {
  const apiUrl = `${apiWayBillDomain}/outsourcing_waybill/${code}/edit`;
  HTTP.post(apiUrl, paramObj, (response, err) => {
    callback(response, err);
  });
}

/**
 * 获取外包运单列表
 */
// function list(paramObj, callback) {
//   const apiUrl = `${apiWayBillDomain}/outsourcing_waybill/list`;
//   // console.log(apiUrl);
//   HTTP.get(apiUrl, paramObj, (response, err) => {
//     callback(response, err);
//   });
// }

function list(paramObj, callback) {
  const apiUrl = `${apiWayBillDomain}/waybill/outsourcing_list`;
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
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/waybill/outsourcing/list_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}

// 获取详情显示字段
function getDetail(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/waybill/outsourcing/detail_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    cb(success);
}

/**
 * 获取serach数据
 * @param callback
 */
function getSearch(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/waybill/outsourcing/search_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}

/**
 * 根据编码获取详情
 * @param paramObj        参数对象
 *         partnerOrgCode
 * @param callback
 */
// function get(paramObj, callback) {
//   const apiUrl = `${apiWayBillDomain}/outsourcing_waybill/${paramObj.code}/info`;
//   HTTP.get(apiUrl, {}, (success, error) => {
//     callback(success, error);
//   });
// }

function get(paramObj, callback) {
  const apiUrl = `${apiWayBillDomain}/waybill/outsourcing/${paramObj.code}`;
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
  const apiUrl = `${apiWayBillDomain}/outsourcing_waybill/${paramObj.code}/delete`;
  HTTP.post(apiUrl, {}, (success, error) => {
    callback(success, error);
  });
}

/**
 * export
 * @param callback  这个可能没有用了，但是不知道还有什么地方用到
 */
function exportCsv(paramObj, callback) {
  const apiUrl = `${apiWayBillDomain}/export/outsourcing`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

function exportCsvOutsourcing(paramObj, callback) {
  const apiUrl = `${apiWayBillDomain}/export/custom/outsourcingWaybill`;
  HTTP.postJson(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 下载错误数据的CSV文件
 */
function downloadErrorData(paramObj, callback) {
  const apiUrl = `${apiWayBillDomain}/generator/outsourcing`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 下载CSV模板
 */
function downloadTemplate(paramObj, callback) {
  const apiUrl = `${apiWayBillDomain}/download/template/outsourcing`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

// 恢复运单
function recover(paramObj, callback) {
  const apiUrl = `${apiWayBillDomain}/waybill/outsourcing/recover`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

// 获取头部搜索字段配置  运单回收站
function getSearchRecycle(cb) {
   var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/waybill/recycleOutsourcing/search_render_info.json`)

 success = JSON.parse(JSON.stringify(success));
    cb(success);
}

// 获取头部搜索字段配置  运单回收站
function getColumnRecycle(cb) {
   var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/waybill/recycleOutsourcing/list_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    cb(success);
}

export { getSearchRecycle,getColumnRecycle, recover, exportCsvOutsourcing ,add, edit, list, getColumn, getDetail, getSearch, get, deleted, exportCsv, downloadErrorData, downloadTemplate };
