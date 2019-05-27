/**
 * waybillService.js
 * Created by dsky on 17/7/5.
 */

import * as utils from './Utils';
import * as HTTP from './httpUtil';

const axios = require('axios');
var ApiConst= require('./ApiConst');
//const apiWayBillDomain = ApiConst.apiWayBillDomain;
const apiWayBillDomain = ApiConst.apiWayBillDomain;

const code = {
  success: 200
};
axios.defaults.withCredentials = true;

// 获取列表数据
function list(paramObj, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/paybill/list`;
  HTTP.get(apiUrl, paramObj, (res, err) => {
    cb(res, err);
  });
}



// 获取列表操作
function getAction(paramObj, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/paybill/action/list`;
  HTTP.post(apiUrl, { 'waybillCodeList': paramObj.join(',') }, (res, err) => {
    cb(res, err);
  });
}


// 获取头部搜索字段配置
function getSearch(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/waybill/paybill/search_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    cb(success);
}
// 获取头部搜索字段配置(付款审核页面)
function getSearchApproveAudit(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/waybill/paybill/approveList/search_render_info.json`)
  success = JSON.parse(JSON.stringify(success));
  cb(success);
}

// 获取头部搜索字段配置 (ready 页面)
function getSearchApproveApply(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/waybill/paybill/approveList/search_render_info_ready.json`)
  success = JSON.parse(JSON.stringify(success));
  cb(success);
}


// 删除数据
function deleteList(paramObj, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/paybill/${paramObj.code}/delete`;
  HTTP.post(apiUrl, {}, (res, err) => {
    cb(res, err);
  });
}


// 获取列表显示字段
function getColumn(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/waybill/paybill/list_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    cb(success);
}
function getColumnApprove(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/waybill/paybill/approveList/list_render_info.json`)
  success = JSON.parse(JSON.stringify(success));
  cb(success);
}

function createUploadWaybill(code,cb){
  var apiUrl = `${apiWayBillDomain}/waybill/broker_report/${code}/append`;
  HTTP.get(apiUrl,{}, (response, err) => {
    cb(response, err);
  });
}

// apply  code是运单编码
function applyWaybill(code,cb){
  var apiUrl = `${apiWayBillDomain}/waybill/paybill/${code}/apply`;
  HTTP.post(apiUrl,{}, (response, err) => {
    cb(response, err);
  });
}
// 添加
function add(paramObj, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/paybill/add`;
  HTTP.post(apiUrl, paramObj, (response, err) => {
    cb(response, err);
  });
}
// 获取信息
function get(paramObj, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/paybill/${paramObj.code}/get`;
  HTTP.get(apiUrl, {}, (res, err) => {
    cb(res, err);
  });
}
//编辑
function edit(code, paramObj, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/paybill/${code}/edit`;
  HTTP.post(apiUrl, paramObj, (response, err) => {
    cb(response, err);
  });
}
function executeActionWithRecordCode(waybillCode, actionCode, actionRecordCode, actionParams, chargeParamList, cb) {
  let params = {};
  if (actionParams) {
    Object.keys(actionParams).forEach((propertyName) => {
      params[propertyName] = actionParams[propertyName];
    });
  }
  if (chargeParamList && chargeParamList.length) {
    chargeParamList.forEach((item) => {
      Object.keys(item).forEach((key) => {
        if (key in params) {
          params[key] = `${params[key]},${item[key]}`;
        } else {
          params[key] = `${item[key]}`;
        }
      });
    });
  }
  const apiUrl = `${apiWayBillDomain}/waybill/paybill/${waybillCode}/execute/${actionCode}/record/${actionRecordCode}`;
  HTTP.post(apiUrl, params, (response, err) => {
    cb(response, err);
  });
}
/**
 * 执行业务动作
 * @param waybillCode 运单编码
 * @param actionCode 业务动作编码
 * @param actionParams 业务动作参数
 * @param chargeParamList 费用记录参数
 * @param cb 回调函数（响应，错误）
 */
function executeAction(waybillCode, actionCode, actionParams, chargeParamList, cb) {
  let params = {};
  if (actionParams) {
    Object.keys(actionParams).forEach((propertyName) => {
      params[propertyName] = actionParams[propertyName];
    });
  }
  if (chargeParamList && chargeParamList.length) {
    chargeParamList.forEach((item) => {
      Object.keys(item).forEach((key) => {
        if (key in params) {
          params[key] = `${params[key]},${item[key]}`;
        } else {
          params[key] = `${item[key]}`;
        }
      });
    });
  }
  const apiUrl = `${apiWayBillDomain}/waybill/paybill/${waybillCode}/execute/${actionCode}`;
  HTTP.post(apiUrl, params, (response, err) => {
    cb(response, err);
  });
}


/**
 * export
 * @param callback
 */
function exportCsv(paramObj, callback) {
  const apiUrl = `${apiWayBillDomain}/export/waybill`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

function exportCsvPaybill(paramObj, callback) {
  const apiUrl = `${apiWayBillDomain}/export/paybill`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

// 定制化 导出 支付
function exportCsvPaybillCustom(paramObj, callback) {
  const apiUrl = `${apiWayBillDomain}/export/custom/paybill`;
  HTTP.postJson(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}
// 定制化 导出 审核
function exportCsvWaybillCustom(paramObj, callback) {
  const apiUrl = `${apiWayBillDomain}/export/custom/waybill`;
  HTTP.postJson(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}



function exportPaybill(paramObj, callback) {
  const apiUrl = `${apiWayBillDomain}/export/custom/paybill`;
  HTTP.postJson(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}



/**
 * 下载错误数据的CSV文件
 */
function downloadErrorData(paramObj, callback) {
  const apiUrl = `${apiWayBillDomain}/generator/waybill`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}
function modifyPaybillStatus(code,paramObj,callback){
  const apiUrl = `${apiWayBillDomain}/waybill/paybill/${code}/pay`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}
function approvePaybill(code,paramObj,callback){
  const apiUrl = `${apiWayBillDomain}/waybill/paybill/${code}/approve`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}
// 打回 网络请求
function revocationPaybill(code,paramObj,callback){
  const apiUrl = `${apiWayBillDomain}/waybill/paybill/${code}/pay/revoke`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}
/**
 * 下载CSV模板
 */
function downloadTemplate(paramObj, callback) {
  const apiUrl = `${apiWayBillDomain}/download/template/waybill`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

// 批量控制接口
function batchFreeze(params, cb){
  var apiUrl = `${apiWayBillDomain}/waybill/paybill/${params.code}/update_freeze_status`;
  HTTP.post(apiUrl, params, (response, err) => {
    cb(response, err);
  });
}


// 批量跟换 收款人  （api 需要修改的）
function batchFixPayee(paramObj, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/paybill/updatePayee`;
   HTTP.post(apiUrl, paramObj, (response, err) => {
    cb(response, err);
  });
}


// 撤回
function payRetract(paramObj, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/paybill/pay/retract`;
  HTTP.post(apiUrl, paramObj, (res, err) => {
    cb(res, err);
  });
}

// --------------------  单项付款相关 API  start   ----------------- //

// 单付款申请
function getSearchItemPaybillApply(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/waybill/itemPaybill/approveList/apply/search_render_info.json`)
  success = JSON.parse(JSON.stringify(success));
  cb(success);
}

function getColumnSeItemPaybillApply(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/waybill/itemPaybill/approveList/apply/list_render_info.json`)
  success = JSON.parse(JSON.stringify(success));
  cb(success);
}


// 付款审核
function getSearchItemPaybillAudit(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/waybill/itemPaybill/approveList/aduit/search_render_info.json`)
  success = JSON.parse(JSON.stringify(success));
  cb(success);
}

function getColumnSeItemPaybillAudit(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/waybill/itemPaybill/approveList/aduit/list_render_info.json`)
  success = JSON.parse(JSON.stringify(success));
  cb(success);
}

export {exportPaybill,getSearchItemPaybillApply,getColumnSeItemPaybillApply,getSearchItemPaybillAudit,getColumnSeItemPaybillAudit,  payRetract,batchFixPayee, batchFreeze, exportCsvPaybillCustom , exportCsvWaybillCustom ,exportCsvPaybill ,applyWaybill ,createUploadWaybill, executeAction, executeActionWithRecordCode, list,  getAction,
  getSearch,  deleteList,  getColumn,  add, edit, get, exportCsv, downloadErrorData, downloadTemplate,modifyPaybillStatus,approvePaybill,getSearchApproveAudit,getSearchApproveApply,getColumnApprove,revocationPaybill};
