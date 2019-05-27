/**
 * Created by cc on 2018/2/2.
 */

import * as utils from './Utils';
const axios = require('axios');
axios.defaults.withCredentials = true;
import * as HTTP from './httpUtil';
var ApiConst = require('./ApiConst');
const apiSettleDomain = ApiConst.apiSettleDomain;

/**
 * 添加
 */
function add(paramObj, success) {
  const apiUrl = `${apiSettleDomain}/settle/settle_output_vat_invoice/add`;
  HTTP.post(apiUrl, paramObj, (response, err) => {
    success(response, err);
  });
}

/**
 * 编辑
 */
function edit(code, paramObj, success) {
  const apiUrl = `${apiSettleDomain}/settle/settle_output_vat_invoice/${code}/edit`;
  HTTP.post(apiUrl, paramObj, (response, err) => {
    success(response, err);
  });
}

/**
 * 列表
 */
function list(paramsObj, success) {
  const apiUrl = `${apiSettleDomain}/settle/settle_output_vat_invoice/list`;
  HTTP.get(apiUrl, paramsObj, (response, err) => {
    success(response, err);
  });
}

/**
 * 删除
 */
function deleted(paramObj, success) {
  const apiUrl = `${apiSettleDomain}/settle/settle_output_vat_invoice/${paramObj.code}/delete`;
  HTTP.post(apiUrl, {}, (response, err) => {
    success(response, err);
  });
}

/**
 * 记录
 */
function invoiced(paramObj, success) {
  const apiUrl = `${apiSettleDomain}/settle/settle_output_vat_invoice/${paramObj.code}/invoiced`;
  HTTP.post(apiUrl, paramObj, (response, err) => {
    success(response, err);
  });
}

/**
 * 审核
 */
function audit(paramObj, success) {
  const apiUrl = `${apiSettleDomain}/settle/settle_output_vat_invoice/${paramObj.code}/status`;
  HTTP.post(apiUrl, paramObj, (response, err) => {
    success(response, err);
  });
}

/**
 * 删除
 */
function deleted(paramObj, success) {
  const apiUrl = `${apiSettleDomain}/settle/settle_output_vat_invoice/${paramObj.code}/delete`;
  HTTP.post(apiUrl, {}, (response, err) => {
    success(response, err);
  });
}

/**
 * 详情
 */
function get(paramObj, success) {
  const apiUrl = `${apiSettleDomain}/settle/settle_output_vat_invoice/${paramObj.code}/get`;
  HTTP.get(apiUrl, paramObj, function (res, err) {
    success(res, err);
  });
}

/**
 * 获取list配置
 */
function getColumn(success) {
  var res = require('./fieldMetadata/'+ApiConst.fieldMetadataDir+'/settle/outputVatInvoice/list_render_info.json');
 res = JSON.parse(JSON.stringify(res));
    success(res, null);
}

/**
 * 获取search配置
 */
function getSearch(cb) {
  var success = require('./fieldMetadata/'+ApiConst.fieldMetadataDir+'/settle/outputVatInvoice/search_render_info.json');
 success = JSON.parse(JSON.stringify(success));
    cb(success, null);
}

/**
 * 获取详情配置
 */
function getDetail(callback) {
  var success = require('./fieldMetadata/'+ApiConst.fieldMetadataDir+'/settle/outputVatInvoice/detail_render_info.json');
 success = JSON.parse(JSON.stringify(success));
    callback(success, null);
}

/**
 * export
 * @param callback
 */
function exportCsv(paramObj, callback) {
  const apiUrl = `${apiSettleDomain}/export/settle_output_vat_invoice`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 下载错误数据的CSV文件
 */
function downloadErrorData(paramObj, callback) {
  const apiUrl = `${apiSettleDomain}/generator/settle_output_vat_invoice`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 下载CSV模板
 */
function downloadTemplate(paramObj, callback) {
  const apiUrl = `${apiSettleDomain}/download/template/settle_output_vat_invoice`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 连云港发送  長短 與 短途 在 type 中 去區分
 */
function addLyg(paramObj, success) {
  const apiUrl = `${apiSettleDomain}/settle/custom_lyg_bill_invoice/add`;
  HTTP.post(apiUrl, paramObj, (response, err) => {
    success(response, err);
  });
}

/**
 * 连云港发送 POST /settle/settle_output_vat_invoice/{code}/sendstatus
 */
function sendLyg(code, paramObj, success) {
  const apiUrl = `${apiSettleDomain}/settle/settle_output_vat_invoice/${code}/sendstatus`;
  HTTP.post(apiUrl, paramObj, (response, err) => {
    success(response, err);
  });
}


// 连云港发送 by robot
function sendLygByRobot(paramObj, success) {
  const apiUrl = `${ApiConst.BaseDomain}/smartz/call?bizEventNo=addBill`;
  // const apiUrl = `http://192.168.10.180:8007/call?bizEventNo=addBill`; // 调试api
  HTTP.post(apiUrl, paramObj, (response, err) => {
    success(response, err);
  });
}


export {sendLygByRobot, add, edit, list, deleted, invoiced, audit, get, getColumn, getSearch, getDetail, exportCsv, downloadErrorData, downloadTemplate,addLyg,sendLyg };
