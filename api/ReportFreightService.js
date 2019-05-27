/**
 * ReportFreightService.js
 * Created by cc on 18/3/12.
 */

import * as utils from './Utils';
import * as HTTP from './httpUtil';

const axios = require('axios');
var ApiConst = require('./ApiConst');
//const apiWayBillDomain = ApiConst.apiWayBillDomain;
const apiWayBillDomain = ApiConst.apiWayBillDomain;

const code = {
  success: 200
};
axios.defaults.withCredentials = true;

// 获取列表数据
function list(paramObj, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/broker_report_capital_flow/list`;
  HTTP.get(apiUrl, paramObj, (res, err) => {
    cb(res, err);
  });
}

// 获取列表数据
function listPlatform(paramObj, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/broker_report_capital_flow/platform/list`;
  HTTP.get(apiUrl, paramObj, (res, err) => {
    cb(res, err);
  });
}


// 获取列表操作
function getAction(paramObj, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/broker_report_capital_flow/action/list`;
  HTTP.post(apiUrl, {
    'waybillCodeList': paramObj.join(',')
  }, (res, err) => {
    cb(res, err);
  });
}


// 获取头部搜索字段配置
function getSearch(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/waybill/reportFreight/search_render_info.json`)
  success = JSON.parse(JSON.stringify(success));
  cb(success);
}

// 删除数据
function deleteList(paramObj, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/broker_report_capital_flow/${paramObj.code}/delete`;
  HTTP.post(apiUrl, {}, (res, err) => {
    cb(res, err);
  });
}


// 获取列表显示字段
function getColumn(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/waybill/reportFreight/list_render_info.json`)
  success = JSON.parse(JSON.stringify(success));
  cb(success);
}

/**
 * 获取伙伴详情
 * @param callback
 */
function getDetail(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/waybill/reportFreight/detail_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}



// 添加
function add(paramObj, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/broker_report_capital_flow/add`;
  HTTP.post(apiUrl, paramObj, (response, err) => {
    cb(response, err);
  });
}
// 获取信息
function get(paramObj, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/broker_report_capital_flow/${paramObj.code}/get`;
  HTTP.get(apiUrl, {}, (res, err) => {
    cb(res, err);
  });
}
//编辑
function edit(code, paramObj, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/broker_report_capital_flow/${code}/edit`;
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
  const apiUrl = `${apiWayBillDomain}/export/custom/reportFreight`;
  /*var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/waybill/reportFreight/list_render_info.json`);
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
  const apiUrl = `${apiWayBillDomain}/generator/reportFreight`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 下载CSV模板
 */
function downloadTemplate(paramObj, callback) {
  var ret = {
    code: 200,
    content: {
      url: "/static/uploadTemplate/上报运费导入模板.xls"
    }
  }
  callback(ret, null)
}

/**
 * 上报资金流水
 */
function reportFreight(paramObj, callback) {
  const apiUrl = `${ApiConst.apiWayBillDomain}/waybill/broker_report_capital_flow/${paramObj.code}/report`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 上报资金流水校验
 */
function validateFreight(paramObj, callback) {
  const apiUrl = `${ApiConst.apiWayBillDomain}/waybill/broker_report_capital_flow/${paramObj.code}/validate`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

export {
  listPlatform,
  executeAction,
  executeActionWithRecordCode,
  list,
  getAction,
  getSearch,
  deleteList,
  getColumn,
  add,
  edit,
  get,
  exportCsv,
  downloadErrorData,
  downloadTemplate,
  reportFreight,
  validateFreight,
  getDetail
};