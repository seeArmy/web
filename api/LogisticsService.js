/**
 * LogisticsService.js
 * Created by dsky on 17/7/6.
 */

import * as utils from './Utils';
import * as HTTP from './httpUtil';
const axios = require('axios');
var ApiConst= require('./ApiConst');
const apiLogisticsDomain = ApiConst.apiLogisticsDomain,
  apiResourceDomain = ApiConst.apiResourceDomain;

axios.defaults.withCredentials = true;

// 获取列表数据
function list(paramObj, cb) {
  const apiUrl = `${apiLogisticsDomain}/logistics/list`;
  HTTP.get(apiUrl, paramObj, (response, err) => {
    cb(response, err);
  });
}

// 标准版确认订单列表接口
function pendList(paramObj, cb) {
  const apiUrl = `${apiLogisticsDomain}/logistics/pend/list`;
  HTTP.get(apiUrl, paramObj, (response, err) => {
    cb(response, err);
  });
}

// HN确认订单列表接口
function confirmList(paramObj, cb) {
  const apiUrl = `${apiLogisticsDomain}/logistics/confirm/list`;
  HTTP.get(apiUrl, paramObj, (response, err) => {
    cb(response, err);
  });
}

// HN分配订单列表接口
function assignMerchandisersList(paramObj, cb) {
  const apiUrl = `${apiLogisticsDomain}/logistics/assignMerchandisers/list`;
  HTTP.get(apiUrl, paramObj, (response, err) => {
    cb(response, err);
  });
}

// 获取列表操作
function getAction(paramObj, cb) {
  const apiUrl = `${apiLogisticsDomain}/logistics/action/list`;
  HTTP.post(apiUrl, { 'businessCodeList': paramObj }, (response, err) => {
    cb(response, err);
  });
}

// 获取头部搜索字段配置
function getSearch(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/logistics/logistics/search_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    cb(success);
}

// 标准版获取头部搜索字段配置  在订单确认列表
function getSearchLogisticsAffirm(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/logistics/logisticsAffirm/search_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    cb(success);
}

// HN 获取头部搜索字段配置  在订单分配列表
function getSearchLogisticsAssign(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/logistics/logisticsAssign/search_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    cb(success);
}

// HN 获取头部搜索字段配置  在订单确认列表
function getSearchLogisticsConfirm(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/logistics/logisticsConfirm/search_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    cb(success);
}

// 获取头部搜索字段配置  在订单回收站
function getSearchRecycle(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/logistics/recycle/search_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    cb(success);
}

// 删除数据
function deleted(paramObj, callback) {
  const apiUrl = `${apiLogisticsDomain}/logistics/${paramObj.code}/delete`;
  HTTP.post(apiUrl, {}, (success, error) => {
    callback(success, error);
  });
}

// 获取列表显示字段
// update to v3 filed setting
function getColumn(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/logistics/logistics/list_render_info.json`)
  success = JSON.parse(JSON.stringify(success));
  cb(success);
}

// 获取详情显示字段
function getDetail(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/logistics/logistics/detail_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    cb(success);
}

// 获取列表显示字段 (订单确认)
function getColumnLogisticsAffirm(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/logistics/logisticsAffirm/list_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    cb(success);
}

// HN 获取列表显示字段 (订单分配)
function getColumnLogisticsAssign(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/logistics/logisticsAssign/list_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    cb(success);
}

// HN 获取列表显示字段 (订单确认)
function getColumnLogisticsConfirm(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/logistics/logisticsConfirm/list_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    cb(success);
}

// 添加
function add(paramObj, cb) {
  const apiUrl = `${apiLogisticsDomain}/logistics/add`;
  // console.log(apiUrl);
  HTTP.post(apiUrl, paramObj, (response, err) => {
    cb(response, err);
  });
}
// 获取信息
function get(paramObj, callback) {
  const url = `${apiLogisticsDomain}/logistics/${paramObj.code}/get`;
  HTTP.get(url, {}, (success, error) => {
    callback(success, error);
  });
}

// 获取信息 来源外包运单
function getOutsourcing(paramObj, callback) {
  const url = `${apiLogisticsDomain}/outsourcing_logistics/${paramObj.code}/get`;
  HTTP.get(url, {}, (success, error) => {
    callback(success, error);
  });
}

// 获取信息  固定科目结算方式设置
function getFixation(paramObj, callback) {
  const url = `${ApiConst.BaseDomain}/org/org/self`;
  HTTP.get(url, {}, (success, error) => {
    callback(success, error);
  });
}

//编辑
function edit( paramObj, cb) {
  const apiUrl = `${apiLogisticsDomain}/logistics/${paramObj.code}/edit`;
  HTTP.post(apiUrl, paramObj, (response, err) => {
    cb(response, err);
  });
}

//添加业务动作
function addAction(code, actionCode, paramObj, nullArray, callback) {
  const apiUrl = `${apiLogisticsDomain}/logistics/${code}/execute/${actionCode}`;
  HTTP.post(apiUrl, { }, (success, error) => {
    callback(success, error);
  });
}

/**
 *
 * @param callbackexport
 */
function exportCsv(paramObj, callback) {
  const apiUrl = `${apiLogisticsDomain}/export/custom/logistics`;
  HTTP.postJson(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 *
 * @param callbackexport
 */
function exportCsvAssign(paramObj, callback) {
  const apiUrl = `${apiLogisticsDomain}/export/custom/logisticsAssignMerchandisers`;
  HTTP.postJson(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 *
 * @param callbackexport
 */
function exportCsvConfirm(paramObj, callback) {
  const apiUrl = `${apiLogisticsDomain}/export/custom/logisticsConfirm`;
  HTTP.postJson(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}


/**
 * 下载错误数据的CSV文件
 */
function downloadErrorData(paramObj, callback) {
  const apiUrl = `${apiLogisticsDomain}/generator/logistics`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 下载CSV模板
 */
function downloadTemplate(paramObj, callback) {
  const apiUrl = `${apiLogisticsDomain}/download/template/logistics`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}
// 运价关联订单
function rateBindLogistic(paramObj, callback) {
  const apiUrl = `${apiLogisticsDomain}/logistics/rate/${paramObj.code}/${paramObj.ratesCode}/relation`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}
// 删除订单运价关联
function deleteLogisticRateRelation(paramObj, callback) {
  const apiUrl = `${apiLogisticsDomain}/logistics/rate/${paramObj.code}/${paramObj.ratesCode}/relation/delete`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}
// 运价选中
function rateSelect(paramObj, callback) {
  const apiUrl = `${apiLogisticsDomain}/logistics/rate/${paramObj.code}/edit`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

// 订单确认列表批量拒绝
function reject(paramObj, callback) {
  const apiUrl = `${apiLogisticsDomain}/logistics/${paramObj.code}/reject`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

// 订单确认列表批量确认
function accept(paramObj, callback) {
  const apiUrl = `${apiLogisticsDomain}/logistics/${paramObj.code}/accept`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}


// 恢复订单
function recoverLogistics(paramObj, callback) {
  const apiUrl = `${apiLogisticsDomain}/logistics/recover`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}


// 获取列表显示字段
// update to v3 filed setting
function getColumnRecycle(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/logistics/recycle/list_render_info.json`)
  success = JSON.parse(JSON.stringify(success));
  cb(success);
}

// 查询订单运单统计数
function getWaybillStatistics(paramObj, callback) {
  const apiUrl = `${ApiConst.apiWayBillDomain}/waybill/statistics`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}


// 查询订单 中统计数
function getWaybillStatisticsDispatched(paramObj, callback) {
  const apiUrl = `${ApiConst.apiWayBillDomain}/waybill/dispatched/statistics`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}


// 查询订单运单统计数
function getResidueNum(code, callback) {
  const apiUrl = `${ApiConst.apiWayBillDomain}/logistics/${code}/getResidueNum`;
  HTTP.get(apiUrl, {}, (success, error) => {
    callback(success, error);
  });
}


// ###   new logist start =======================================
function getColumnManifestSingle(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/logistics/manifestList/single/list_render_info.json`)
  success = JSON.parse(JSON.stringify(success));
  cb(success);
}
function getColumnManifestMultiple(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/logistics/manifestList/multiple/list_render_info.json`)
  success = JSON.parse(JSON.stringify(success));
  cb(success);
}

// 获取货单信息
function getManifestList(paramObj, callback) {
  const url = `${apiLogisticsDomain}/logistics/logistics_manifest/${paramObj.code}/get`;
  HTTP.get(url, {}, (success, error) => {
    callback(success, error);
  });
}



//获取订单货单剩余货量接口
function manifestRemainder(paramObj, cb) {
  const apiUrl = `${apiLogisticsDomain}/logistics/logistics_manifest/${paramObj.code}/remainder`;
  HTTP.get(apiUrl, paramObj, (response, err) => {
    cb(response, err);
  });
}

//订单分配跟单人
function assignMerchandisers(paramObj, cb) {
  const apiUrl = `${apiLogisticsDomain}/logistics/${paramObj.code}/assignMerchandisers`;
  HTTP.post(apiUrl, paramObj, (response, err) => {
    cb(response, err);
  });
}


// 新建 订单
//waybill：domainObject的json字符串（map类型） domainObject
//manifest：货单的json字符串（map类型）paramObj
function addLogistics( domainObject, list, cb) {
  const link = '@@';
  let paramsObjFinal = {};
  // 处理货物 -------------------------------------------------
 let obj = utils.transformListToObjByStr(list,link);
  // 处理货物 -------------------------------------------------
  domainObject = utils.formatDateInDoamin(domainObject);
  paramsObjFinal['logistics'] = JSON.stringify(domainObject) ;
  if(!obj){
    paramsObjFinal['manifest'] = '{}';
  }else{
     paramsObjFinal['manifest'] = JSON.stringify(obj);
  }

  const apiUrl = `${apiLogisticsDomain}/logistics/manifest/add`;
  HTTP.post(apiUrl, paramsObjFinal, (res, err) => {
    cb(res, err);
  });
}

// 编辑 订单
//waybill：domainObject的json字符串（map类型） domainObject
//manifest：货单的json字符串（map类型）paramObj
function editLogistics( domainObject, list, cb) {
  const link = '@@';
  let paramsObjFinal = {};
  // 处理货物 -------------------------------------------------
 let obj = utils.transformListToObjByStr(list,link);
  // 处理货物 -------------------------------------------------
    domainObject = utils.formatDateInDoamin(domainObject);
  paramsObjFinal['logistics'] = JSON.stringify(domainObject);
   if(!obj){
    paramsObjFinal['manifest'] = '{}';
  }else{
     paramsObjFinal['manifest'] = JSON.stringify(obj);
  }

  const apiUrl = `${apiLogisticsDomain}/logistics/manifest/edit`;
  HTTP.post(apiUrl, paramsObjFinal, (res, err) => {
    cb(res, err);
  });
}

//订单运价单
function getRates(paramObj, cb) {
  const apiUrl = `${apiResourceDomain}/resource/resource_rates/getCurrentEffectiveRates`;
  HTTP.get(apiUrl, paramObj, (response, err) => {
    cb(response, err);
  });
}

// ###   new logist end   =======================================

export {addLogistics,editLogistics,getWaybillStatisticsDispatched,getManifestList, getColumnManifestSingle,getColumnManifestMultiple,getWaybillStatistics, getColumnRecycle, recoverLogistics,getOutsourcing ,getFixation, 
  list, pendList, confirmList, assignMerchandisersList,
  getAction, deleted, getSearch, getColumn, getDetail, add, edit, get, addAction, exportCsv, exportCsvAssign, exportCsvConfirm, downloadErrorData,
  downloadTemplate, rateBindLogistic, deleteLogisticRateRelation, rateSelect, 
  getSearchLogisticsAffirm, getSearchLogisticsAssign, getSearchLogisticsConfirm,
  getColumnLogisticsAffirm, getColumnLogisticsAssign, getColumnLogisticsConfirm,
  reject, accept, getSearchRecycle, getResidueNum, manifestRemainder, assignMerchandisers, getRates };

