/**
 * PlatformWaybillService.js
 * Created by cc on 18/5/23.
 */

import * as utils from './Utils';
import * as HTTP from './httpUtil';

const axios = require('axios');
var ApiConst= require('./ApiConst');
const apiWayBillDomain = ApiConst.apiWayBillDomain;
const code = {
  success: 200
};
axios.defaults.withCredentials = true;

// 获取列表数据
function list(paramObj, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/platform/list`;
  HTTP.get(apiUrl, paramObj, (res, err) => {
    cb(res, err);
  });
}

// 获取列表数据 新的 依据 订单列表  GET /waybill/logistics/client/waybill/list
function listByLogisticsCode (paramObj, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/logistics/client/waybill/list`;
  HTTP.get(apiUrl, paramObj, (res, err) => {
    cb(res, err);
  });
}

// 获取列表数据 新的 依据 订单列表  GET /waybill/logistics/client/waybill/list
function getWaybillList (paramObj, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/logistics/carrier/waybill/list`;
  HTTP.get(apiUrl, paramObj, (res, err) => {
    cb(res, err);
  });
}


// 获取费用列表数据
function settleList(paramObj, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill_settle/list`;
  HTTP.get(apiUrl, paramObj, (res, err) => {
    cb(res, err);
  });
}

// 获取列表操作
function getAction(paramObj, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/action/list`;
  HTTP.post(apiUrl, { 'businessCodeList': paramObj.join(',') }, (res, err) => {
    cb(res, err);
  });
}

// 获取订单车辆列表
function getLogisticsTruckList(paramObj, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/logistics/${paramObj.code}/list`;
  HTTP.get(apiUrl, {}, (res, err) => {
    cb(res, err);
  });
}

// 获取头部搜索字段配置
function getSearch(callback) {
  let success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/platform/waybill/search_render_info.json`);
      success = JSON.parse(JSON.stringify(success));
  console.log('运单列表搜索配置为', success);
  const tempObj = {
      code: 200,
      content: []
    },
    data = success.content,
    complianceCheck = JSON.parse(localStorage.getItem('appInfo')).complianceCheck; // 合规状态
  // 如果是TRUE，则需要显示合规字段，如果是FALSE，则不显示
  if (complianceCheck === 'FALSE') {
    data.forEach((val) => {
      if (val.fieldConfigCode !== 'complianceStatus') {
        tempObj.content.push(val);
      }
    });
    console.log('不显示合规状态列表搜索配置为', tempObj);
    callback(tempObj);
  } else {
    callback(success);
  }
}

function createUploadWaybill(code,cb){
  var apiUrl = `${apiWayBillDomain}/waybill/broker_report/${code}/append`;
  HTTP.get(apiUrl,{}, (response, err) => {
    cb(response, err);
  });
}
// 获取费用列表头部搜索字段配置
function getSettleSearch(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/platform/settle/search_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    cb(success);
}

// 删除数据
function deleteList(paramObj, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/${paramObj.code}/delete`;
  HTTP.post(apiUrl, {}, (res, err) => {
    cb(res, err);
  });
}

// 删除费用列表数据
function deleteSettleList(paramObj, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill_settle/${paramObj.code}/delete`;
  HTTP.post(apiUrl, {}, (res, err) => {
    cb(res, err);
  });
}

// 获取列表显示字段
function getColumn(callback) {
  let success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/platform/waybill/list_render_info.json`);
      success = JSON.parse(JSON.stringify(success));
  console.log('运单列表配置为', success);
  const tempObj = {
      code: 200,
      content: []
    },
    data = success.content,
    complianceCheck = JSON.parse(localStorage.getItem('appInfo')).complianceCheck; // 合规状态
  // 如果是TRUE，则需要显示合规字段，如果是FALSE，则不显示
  if (complianceCheck === 'FALSE') {
    data.forEach((val) => {
      if (val.fieldConfigCode !== 'complianceStatus' && val.fieldConfigCode !== 'complianceDescription') {
        tempObj.content.push(val);
      }
    });
    console.log('不显示合规状态列表配置为', tempObj);
    callback(tempObj);
  } else {
    callback(success);
  }
}

// 获取详情显示字段
function getDetail(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/platform/waybill/detail_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    cb(success);
}

// 获取费用列表显示字段
function getSettleColumn(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/platform/settle/list_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    cb(success);
}

// 添加
function add(paramObj, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/add`;
  HTTP.post(apiUrl, paramObj, (response, err) => {
    cb(response, err);
  });
}
// 获取信息
function get(paramObj, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/${paramObj.code}/info`;
  HTTP.get(apiUrl, {}, (res, err) => {
    cb(res, err);
  });
}
//编辑
function edit(code, paramObj, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/${code}/edit`;
  HTTP.post(apiUrl, paramObj, (response, err) => {
    cb(response, err);
  });
}

//编辑
function editPlatformWaybill(code, paramObj, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/platform/${code}/edit`;
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
  const apiUrl = `${apiWayBillDomain}/waybill/${waybillCode}/execute/${actionCode}/record/${actionRecordCode}`;
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
  const apiUrl = `${apiWayBillDomain}/waybill/${waybillCode}/execute/${actionCode}`;
  HTTP.post(apiUrl, params, (response, err) => {
    cb(response, err);
  });
}

function addAction(paramObj, tableList, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/${paramObj.code}/execute/${paramObj.actionCode}`;
  HTTP.post(apiUrl, { 'params': paramObj, 'chargeRecordList': tableList }, (response, err) => {
    cb(response, err);
  });
}
function getChargeDefine(code, cb) {
  //GET /waybill/{code}/accounting/charge/define/list
  const apiUrl = `${apiWayBillDomain}/waybill/${code}/accounting/charge/define/list`;
  HTTP.get(apiUrl, {}, (res, err) => {
    cb(res, err);
  });
}
function getCharge(code, action, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/${code}/accounting/charge/record/list?actionCode=${action}`;
  HTTP.get(apiUrl, {}, (res, err) => {
    cb(res, err);
  });
}
function getActionRecord(code, actionCode, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/${code}/action/record/list?actionCode=${actionCode}`;
  HTTP.get(apiUrl, {}, (res, err) => {
    cb(res, err);
  });
}
function getActionRecordWithParams(code, paramObj, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/${code}/action/record/list`;
  HTTP.get(apiUrl, paramObj, (res, err) => {
    cb(res, err);
  });
}
function deleteActionRecord(code, actionCode, actionRecordCode, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/${code}/del/${actionCode}/record/${actionRecordCode}`;
  HTTP.post(apiUrl, {}, (res, err) => {
    cb(res, err);
  });
}
// 运单结算费用记录
function getSettleList(code, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/${code}/accounting/charge/record/list`;
  HTTP.get(apiUrl, {}, (res, err) => {
    cb(res, err);
  });
}
// 运单行车记录
function getDriverList(code, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/${code}/driving/record/list`;
  HTTP.get(apiUrl, {}, (res, err) => {
    cb(res, err);
  });
}
function addSettle(settle, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/update/settle/info`;
  HTTP.post(apiUrl, settle, (response, err) => {
    cb(response, err);
  });
}
function editSettle(code, settle, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/update/settle/info`;
  settle.code = code;
  HTTP.post(apiUrl, settle, (response, err) => {
    cb(response, err);
  });
}
function addDriver(code, settle, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/${code}/update/driving/record`;
  let obj = {};
  settle.forEach((value) => {
    Object.keys(value).forEach((key) => {
      if (key in obj) {
        obj[key] += ',' + value[key];
      } else {
        obj[key] = value[key];
      }
    });
  });
  obj.code = code;
  HTTP.post(apiUrl, obj, (response, err) => {
    cb(response, err);
  });
}
function addRecord(code, settle, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/${code}/update/accounting/charge/record`;
  let obj = {},
    settleData = [];
  settle.forEach(val => {
    if (val.chargeAmounts) {
      settleData.push(val);
    }
  });
  if (settleData.length) {
    settleData.forEach((value) => {
      Object.keys(value).forEach((key) => {
        if (value[key] instanceof Array && value[key].length > 1) {
          value[key] = value[key].join(':');
        }
        if (key in obj) {
          obj[key] += ',' + value[key];
        } else {
          obj[key] = value[key];
        }
      });
    });
  }
  HTTP.post(apiUrl, obj, (response, err) => {
    cb(response, err);
  });
}
// 运单业务动作操作记录列表
function getSettleAction(code, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/${code}/action/record/list`;
  HTTP.get(apiUrl, {}, (res, err) => {
    cb(res, err);
  });
}

// 获取运费总金额
function getTotalAmount(code, model, record, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/${code}/calculate`;
  let obj = {},
    recordData = [];
  if (record && model) {
    Object.keys(model).forEach((key) => {
      if (key) {
        // console.log('key: ', key);
        obj[key] = model[key];
      }
    });
    record.forEach(val => {
      if (!isNaN(val.chargeAmounts)) {
        recordData.push(val);
      }
    });
    if (recordData.length) {
      recordData.forEach((value) => {
        Object.keys(value).forEach((key) => {
          if (key in obj) {
            obj[key] += ',' + value[key];
          } else {
            obj[key] = value[key];
          }
        });
      });
    }
  }
  HTTP.post(apiUrl, obj, (response, err) => {
    cb(response, err);
  });
}

function saveSettle(paramObj, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/${paramObj.code}/settle`;
  HTTP.post(apiUrl, paramObj, (response, err) => {
    cb(response, err);
  });
}

/**
 * export
 * @param callback
 */
function exportCsv(paramObj, callback) {
  const apiUrl = `${apiWayBillDomain}/export/custom/waybillPlatform`;
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

/**
 * 下载CSV模板
 */
function downloadTemplate(paramObj, callback) {
  const apiUrl = `${apiWayBillDomain}/download/template/waybill`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 运单上报
 * @param paramObj
 * @param cb
 */
function waybillReport(paramObj, cb) {
  const apiUrl = `${apiWayBillDomain}/report`;
  HTTP.post(apiUrl, paramObj, (response, err) => {
    cb(response, err);
  });
}

/**
 * 校验车牌
 * @param paramObj
 * @param cb
 */
function validateTruckLicenseNo(paramObj, cb) {
  const apiUrl = `${apiWayBillDomain}/validateTruckLicenseNo`;
  HTTP.post(apiUrl, paramObj, (response, err) => {
    cb(response, err);
  });
}

// 获取图片url
function getImgUrl(resourceCode, callback) {
  const apiUrl = `${apiWayBillDomain}/fw/image/${resourceCode}/get`,
    paramObj = {
      resourceCode
    };
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

function listForS(params, callback) {
  const apiUrl = `${apiWayBillDomain}/waybill/paybill/listForS`;
  HTTP.get(apiUrl, params, (res, err) => {
    callback(res, err);
  });
}

function onlinePay(params, callback) {
  const apiUrl = `${apiWayBillDomain}/waybill/paybill/onlinePay`;
  HTTP.post(apiUrl, params, (res, err) => {
    callback(res, err);
  });
}

function pay(params, callback) {
  const apiUrl = `${apiWayBillDomain}/waybill/paybill/${params.code}/pay`;
  HTTP.post(apiUrl, params, (res, err) => {
    callback(res, err);
  });
}

function revokePay(params, callback) {
  const apiUrl = `${apiWayBillDomain}/waybill/paybill/${params.code}/pay/revoke`;
  HTTP.post(apiUrl, params, (res, err) => {
    callback(res, err);
  });
}


// waybillBroker/platformWaybill/list 中的字段
function getColumnPlatformWaybill(callback) {
 //  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/waybillBroker/platformWaybill/list_render_info.json`)
 // success = JSON.parse(JSON.stringify(success));
 //    cb(success);

       var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/waybillBroker/platformWaybill/list_render_info.json`)
      success = JSON.parse(JSON.stringify(success));
  console.log('运单列表配置为', success);
  const tempObj = {
      code: 200,
      content: []
    },
    data = success.content,
    complianceCheck = JSON.parse(localStorage.getItem('appInfo')).complianceCheck; // 合规状态
  // 如果是TRUE，则需要显示合规字段，如果是FALSE，则不显示
  if (complianceCheck === 'FALSE') {
    data.forEach((val) => {
      if (val.fieldConfigCode !== 'complianceStatus' && val.fieldConfigCode !== 'complianceDescription') {
        tempObj.content.push(val);
      }
    });
    console.log('不显示合规状态列表配置为', tempObj);
    callback(tempObj);
  } else {
    callback(success);
  }
}

// waybillBroker/platformWaybill/list 中的字段 search
function getSearchPlatformWaybill(callback) {
 //  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/waybillBroker/platformWaybill/search_render_info.json`)
 // success = JSON.parse(JSON.stringify(success));
 //    cb(success);
 //    
var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/waybillBroker/platformWaybill/search_render_info.json`)
      success = JSON.parse(JSON.stringify(success));
  console.log('运单列表搜索配置为', success);
  const tempObj = {
      code: 200,
      content: []
    },
    data = success.content,
    complianceCheck = JSON.parse(localStorage.getItem('appInfo')).complianceCheck; // 合规状态
  // 如果是TRUE，则需要显示合规字段，如果是FALSE，则不显示
  if (complianceCheck === 'FALSE') {
    data.forEach((val) => {
      if (val.fieldConfigCode !== 'complianceStatus') {
        tempObj.content.push(val);
      }
    });
    console.log('不显示合规状态列表搜索配置为', tempObj);
    callback(tempObj);
  } else {
    callback(success);
  }
}


export {getSearchPlatformWaybill, createUploadWaybill,executeAction, executeActionWithRecordCode, list, settleList, getAction, getActionRecord, getActionRecordWithParams,
  getSearch, getSettleSearch, deleteList, deleteSettleList, getColumn, getDetail, getSettleColumn, add, edit, editPlatformWaybill, get, addAction,
  getCharge, getChargeDefine, getSettleList, addSettle, editSettle, getSettleAction, getDriverList, addDriver, addRecord, getTotalAmount,
  saveSettle, exportCsv, downloadErrorData, downloadTemplate, waybillReport, validateTruckLicenseNo, getLogisticsTruckList,
  getImgUrl, deleteActionRecord ,listByLogisticsCode, getWaybillList, listForS, onlinePay, pay, revokePay ,getColumnPlatformWaybill };
