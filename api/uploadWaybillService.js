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
  const apiUrl = `${apiWayBillDomain}/waybill/broker_report/list`;
  HTTP.get(apiUrl, paramObj, (res, err) => {
    cb(res, err);
  });
}

// 获取列表数据
function listPlatform(paramObj, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/broker_report/platform/list
`;
  HTTP.get(apiUrl, paramObj, (res, err) => {
    cb(res, err);
  });
}


// 获取列表操作
function getAction(paramObj, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/broker_report/action/list`;
  HTTP.post(apiUrl, { 'waybillCodeList': paramObj.join(',') }, (res, err) => {
    cb(res, err);
  });
}


// 获取头部搜索字段配置
function getSearch(cb) {
  let success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/waybill/uploadWaybill/search_render_info.json`);
      success = JSON.parse(JSON.stringify(success));
  console.log('上报运单搜索配置为', success);
  const tempObj = {
      code: 200,
      content: []
    },
    data = success.content,
    reportLocation = JSON.parse(localStorage.getItem('appInfo')).reportLocation;
  if (reportLocation === 'shanghai') {
    data.forEach((val) => {
      if (val.fieldConfigCode !== 'truckValidateStatus' ) {
        tempObj.content.push(val);
      }
    });
    console.log('上报运单搜索配置为shanghai', tempObj);
    cb(tempObj);
  } else {
    cb(success);
  }
}

// 删除数据
function deleteList(paramObj, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/broker_report/${paramObj.code}/delete`;
  HTTP.post(apiUrl, {}, (res, err) => {
    cb(res, err);
  });
}


// 获取列表显示字段
function getColumn(cb) {
  let success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/waybill/uploadWaybill/list_render_info.json`);
      success = JSON.parse(JSON.stringify(success));
  console.log('上报运单列表配置为', success);
  const tempObj = {
      code: 200,
      content: []
    },
    data = success.content,
    reportLocation = JSON.parse(localStorage.getItem('appInfo')).reportLocation;
  if (reportLocation === 'shanghai') {
    data.forEach((val) => {
      if (val.fieldConfigCode !== 'truckValidateTime' && val.fieldConfigCode !== 'truckValidateStatus' ) {
        tempObj.content.push(val);
      }
    });
    console.log('上报运单列表配置为shanghai', tempObj);
    cb(tempObj);
  } else {
    cb(success);
  }
}

// 添加
function add(paramObj, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/broker_report/add`;
  HTTP.post(apiUrl, paramObj, (response, err) => {
    cb(response, err);
  });
}
// 获取信息
function get(paramObj, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/broker_report/${paramObj.code}/get`;
  HTTP.get(apiUrl, {}, (res, err) => {
    cb(res, err);
  });
}
//编辑
function edit(code, paramObj, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/broker_report/${code}/edit`;
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
  const apiUrl = `${apiWayBillDomain}/waybill/broker_report/${waybillCode}/execute/${actionCode}/record/${actionRecordCode}`;
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
  const apiUrl = `${apiWayBillDomain}/waybill/broker_report/${waybillCode}/execute/${actionCode}`;
  HTTP.post(apiUrl, params, (response, err) => {
    cb(response, err);
  });
}


/**
 * export
 * @param callback
 */
function exportCsv(paramObj, callback) {
  const apiUrl = `${apiWayBillDomain}/export/custom/platformUploadWaybill`;
  /*var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/waybill/uploadWaybill/list_render_info.json`);
  var strJson = JSON.stringify(success);
  paramObj['listJson']=strJson*/
  HTTP.postJson(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 下载错误数据的CSV文件
 */
function downloadErrorData(paramObj, callback) {
  const apiUrl = `${apiWayBillDomain}/generator/uploadWaybill`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 下载CSV模板
 */
function downloadTemplate(paramObj, callback) {
  var ret={
    code:200,
    content:{url:"/static/uploadTemplate/uploadWaybillTemplate.xlsx"}
  }
  callback(ret,null)
}
function uploadWaybill(code,callback){
  const apiUrl = `${ApiConst.apiWayBillDomain}/reportByCode`;
  HTTP.post(apiUrl, {code:code}, (success, error) => {
    callback(success, error);
  });
}
function validWaybill(code,callback){
  const apiUrl = `${ApiConst.apiWayBillDomain}/validate`;
  HTTP.post(apiUrl, {code:code}, (success, error) => {
    callback(success, error);
  });
}

/**
 * 获取伙伴详情
 * @param callback
 */
function getDetail(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/waybill/uploadWaybill/detail_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}

export {getDetail, listPlatform, executeAction, executeActionWithRecordCode, list,  getAction,
  getSearch,  deleteList,  getColumn,  add, edit, get, exportCsv, downloadErrorData, downloadTemplate,uploadWaybill,validWaybill};
