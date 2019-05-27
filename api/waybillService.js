/**
 * waybillService.js
 * Created by dsky on 17/7/5.
 */

import * as utils from './Utils';
import * as HTTP from './httpUtil';

const axios = require('axios');
var ApiConst = require('./ApiConst');
const apiWayBillDomain = ApiConst.apiWayBillDomain,
  apiPersonDomain = ApiConst.apiPersonDomain,
  apiPlatformDomain = ApiConst.apiPlatformDomain,
  BaseDomain = ApiConst.BaseDomain;
const code = {
  success: 200
};
axios.defaults.withCredentials = true;

// 获取列表数据
function list(paramObj, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/list`;
  HTTP.get(apiUrl, paramObj, (res, err) => {
    cb(res, err);
  });
}

// 获取列表数据 新的 依据 订单列表  GET /waybill/logistics/client/waybill/list
function listByLogisticsCode(paramObj, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/logistics/client/waybill/list`;
  HTTP.get(apiUrl, paramObj, (res, err) => {
    cb(res, err);
  });
}

// 订单监控右侧运单列表
function getWaybillList(paramObj, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/logistics/carrier/waybill/list`;
  HTTP.get(apiUrl, paramObj, (res, err) => {
    cb(res, err);
  });
}

// 外包订单监控右侧运单列表
function getWaybillListOutsourcing(paramObj, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/outsourcing_list`;
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
function getSearch(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/waybill/waybill/search_render_info.json`)
  success = JSON.parse(JSON.stringify(success));
  cb(success);
}

function createUploadWaybill(code, cb) {
  var apiUrl = `${apiWayBillDomain}/waybill/broker_report/${code}/append`;
  HTTP.get(apiUrl, {}, (response, err) => {
    cb(response, err);
  });
}

function createUnsettleUploadWaybill(code, cb) {
  var apiUrl = `${apiWayBillDomain}/waybill/broker_report/unsettle/${code}/append`;
  HTTP.get(apiUrl, {}, (response, err) => {
    cb(response, err);
  });
}
// 获取费用列表头部搜索字段配置
function getSettleSearch(callback) {
  let success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/waybill/settle/search_render_info.json`);
  success = JSON.parse(JSON.stringify(success));
  console.log('单车结算列表搜索配置为', success);
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
function getColumn(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/waybill/waybill/list_render_info.json`)
  success = JSON.parse(JSON.stringify(success));
  cb(success);
}


// 获取详情显示字段
function getDetail(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/waybill/waybill/detail_render_info.json`)
  success = JSON.parse(JSON.stringify(success));
  cb(success);
}

// 获取单车结算详情显示字段
function getSettleDetail(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/waybill/settle/detail_render_info.json`)
  success = JSON.parse(JSON.stringify(success));
  cb(success);
}

// 获取费用列表显示字段
function getSettleColumn(callback) {
  let success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/waybill/settle/list_render_info.json`);
  success = JSON.parse(JSON.stringify(success));
  console.log('单车结算列表配置为', success);
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

// 添加
function add(paramObj, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/add`;
  HTTP.post(apiUrl, paramObj, (response, err) => {
    cb(response, err);
  });
}

// 订单派车
function dispatch(paramObj, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/manifest/add`;
  HTTP.post(apiUrl, paramObj, (response, err) => {
    cb(response, err);
  });
}

// 添加（小程序通知）
function add_and_notify(paramObj, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/add_and_notify`;
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
      const fieldCheckArray = ['chargeItemNumberUnitCode', 'chargeItemNumberUnitName', 'chargeAmountsUnitCode', 'chargeAmountsUnitName'];
      fieldCheckArray.forEach((v) => {
        if (!value[v]) {
          value[v] = '';
        }
      });
      Object.keys(value).forEach((key) => {
        if (value[key] instanceof Array && value[key].length > 1) {
          value[key] = value[key].join(':');
        }
        if (key in obj) {
          obj[key] += ',' + value[key];
          console.log('key is11111111', key, obj[key], '================data value key is', value[key]);
        } else {
          obj[key] = value[key];
          console.log('key is22222222', key, obj[key], '================data value key is', value[key]);
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

// 单车结算多货物计算接口
function calculateAmount(code, model, record, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/${code}/settle/calculate`;
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

function saveManifestSettle(paramObj, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/${paramObj.code}/waybill_manifest/settle`;
  HTTP.post(apiUrl, paramObj, (response, err) => {
    cb(response, err);
  });
}

function batchManifestSettle(paramObj, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/${paramObj.code}/waybill_manifest/batch/settle`;
  HTTP.post(apiUrl, paramObj, (response, err) => {
    cb(response, err);
  });
}

/**
 * export
 * @param callback
 */
function exportCsv(paramObj, callback) {
  const apiUrl = `${apiWayBillDomain}/export/custom/waybill`;
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
  const apiUrl = `${apiWayBillDomain}/waybill/paybill/${params.code}/payForS`;
  HTTP.post(apiUrl, params, (res, err) => {
    callback(res, err);
  });
}

function revokePay(params, callback) {
  const apiUrl = `${apiWayBillDomain}/waybill/paybill/${params.code}/pay/revokeForS`;
  HTTP.post(apiUrl, params, (res, err) => {
    callback(res, err);
  });
}

function approvePayment(params, callback) {
  const apiUrl = `${apiWayBillDomain}/waybill/paybill/${params.code}/approveForS`;
  HTTP.post(apiUrl, params, (res, err) => {
    callback(res, err);
  });
}

function waybillLst(paramObj, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/waybillListForS`;
  HTTP.get(apiUrl, paramObj, (res, err) => {
    cb(res, err);
  });
}

// 批量跟换 收款人
function batchFixPayee(paramObj, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/update_driver_bank_info`;
  HTTP.post(apiUrl, paramObj, (response, err) => {
    cb(response, err);
  });
}

// 撤回结算新接口
function undoSettle(paramObj, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill_settle/${paramObj.code}/undoSettle`;
  HTTP.post(apiUrl, paramObj, (response, err) => {
    cb(response, err);
  });
}


// 生成上报运费
function creatReportCapitalFlow(code, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/broker_report_capital_flow/${code}/append`;
  HTTP.post(apiUrl, {}, (res, err) => {
    cb(res, err);
  });
}

function ICBCpay(params, callback) {
  const apiUrl = `${apiWayBillDomain}/waybill/paybill/onlineICBCPay`;
  HTTP.post(apiUrl, params, (res, err) => {
    callback(res, err);
  });
}

function BSBpay(params, callback) {
  const apiUrl = `${apiWayBillDomain}/waybill/paybill/onlineBSBPay`;
  HTTP.post(apiUrl, params, (res, err) => {
    callback(res, err);
  });
}

/**
 * 申报运单
 */
function declareWaybill(paramObj, cb) {
  const apiUrl = `${BaseDomain}/smartz/call`;
  HTTP.post(apiUrl, paramObj, (response, err) => {
    cb(response, err);
  });
}

/**
 * 获取磅房数据
 */
function getWaybillLoadingWeight(paramsObj, cb) {
  const apiUrl = `${BaseDomain}/smartz/call`;
  HTTP.get(apiUrl, paramsObj, (res, err) => {
    cb(res, err);
  });
}


/**
 * 线上支付-撤销
 */
function cancelOnlinePay(paramObj, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/paybill/cancelOnlinePay`;
  HTTP.post(apiUrl, paramObj, (res, err) => {
    cb(res, err);
  });
}

// 恢复运单
function recover(paramObj, callback) {
  const apiUrl = `${apiWayBillDomain}/waybill/recover`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}


// 获取头部搜索字段配置  运单回收站
function getSearchRecycle(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/waybill/recycle/search_render_info.json`)
  success = JSON.parse(JSON.stringify(success));
  cb(success);
}

// 获取列表搜索字段配置  运单回收站
function getColumnRecycle(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/waybill/recycle/list_render_info.json`)
  success = JSON.parse(JSON.stringify(success));
  cb(success);
}

// 批量修改价格
function editPrice(paramObj, callback) {
  const apiUrl = `${apiWayBillDomain}/waybill/editPrice`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

// 批量修改价格(外包运单列表)
function editPriceOutsourcing(paramObj, callback) {
  const apiUrl = `${apiWayBillDomain}/waybill/outsourcing/editPrice`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

// 评价项目定义配置
function evaConfig(callback) {
  const apiUrl = `${apiPlatformDomain}/platform_config/platform_evaluation_settings/list`;
  HTTP.get(apiUrl, {}, (success, error) => {
    callback(success, error);
  });
}

// 新增评价
function evaAdd(paramObj, callback) {
  const apiUrl = `${apiPersonDomain}/member/member_evaluation_record/add`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

// 获取运单评价信息
function getEvaInfo(waybillCode, callback) {
  const apiUrl = `${apiPersonDomain}/member/member_evaluation_record/${waybillCode}/get`;
  HTTP.get(apiUrl, {}, (success, error) => {
    callback(success, error);
  });
}

// 获取车辆弹窗信息
function getPopWaybillList(paramObj, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/logistics/waybill/list`;
  HTTP.get(apiUrl, paramObj, (res, err) => {
    cb(res, err);
  });
}

// 获取外包订单监控车辆弹窗信息
function getPopWaybillListOutsourcing(paramObj, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/logistics/outsourcing_waybill/list`;
  HTTP.get(apiUrl, paramObj, (res, err) => {
    cb(res, err);
  });
}

// start   ========================== invoiceList
// 获取列表显示字段
function getColumnInvoiceList(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/waybill/invoiceList/list_render_info.json`);
  success = JSON.parse(JSON.stringify(success));
  cb(success);
}

// 获取 list
function getListInvoiceList(paramObj, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/waybill_manifest/list`;
  HTTP.get(apiUrl, paramObj, (res, err) => {
    cb(res, err);
  });
}

// 提交数据
function saveInvoiceList(waybillCode, list, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/${waybillCode}/waybill_manifest/operate`;
  let obj = {},
    postList = [];
  if (list.length) {
    for (let i = 0; i < list.length; i++) {
      const value = list[i];
      let b = false;
      Object.keys(value).forEach((key) => {
        if (value[key]) {
          b = true;
        }
      });
      if (b) {
        postList.push(value);
      }
    }
  }

  postList.forEach((value) => {
    // 删除无关数据
    delete value['id'];
    delete value['disabled'];
    delete value['deleted'];
    delete value['remark'];
    delete value['moduleCode'];
    delete value['creatorUserCode'];
    delete value['creatorUsername'];
    delete value['createTime'];
    delete value['updateUserCode'];
    delete value['updateUsername'];
    delete value['updateTime'];
    delete value['ip'];
    delete value['ownerUserCode'];
    delete value['ownerOrgCode'];
    delete value['ownerOrgName'];
    delete value['synchronousId'];
    Object.keys(value).forEach((key) => {
      if (key in obj) {
        obj[key] += ',' + value[key];
      } else {
        obj[key] = value[key];
      }
    });
  });
  HTTP.post(apiUrl, obj, (res, err) => {
    cb(res, err);
  });
}

// api manifestList  start

function getColumnManifestList(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/waybill/manifestList/list_render_info.json`)
  success = JSON.parse(JSON.stringify(success));
  cb(success);
}


function getSearchManifestList(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/waybill/manifestList/search_render_info.json`)
  success = JSON.parse(JSON.stringify(success));
  cb(success);
}

// 获取列表数据
function getListManifestList(paramObj, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/waybill_manifest/listForWeb`;
  HTTP.get(apiUrl, paramObj, (res, err) => {
    cb(res, err);
  });
}

function exportCsvManifestList(paramObj, callback) {
  const apiUrl = `${apiWayBillDomain}/export/custom/manifest`;
  HTTP.postJson(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}
// api manifestList  end
// 
// 
//编辑
function changeCapacity(paramObj, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/changeCapacity`;
  HTTP.post(apiUrl, paramObj, (response, err) => {
    cb(response, err);
  });
}

// 获取运单统计信息
function getTotal(paramObj, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/count`;
  HTTP.get(apiUrl, paramObj, (response, err) => {
    cb(response, err);
  });
}


// ######  弹框  #######################################################
function getColumnManifestLoading(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/waybill/manifestlonding/list_render_info.json`)
  success = JSON.parse(JSON.stringify(success));
  cb(success);
}

function getColumnManifestUnloading(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/waybill/manifestunlonding/list_render_info.json`)
  success = JSON.parse(JSON.stringify(success));
  cb(success);
}

// 获取货单信息
function getManifestList(paramObj, callback) {
  const url = `${apiWayBillDomain}/waybill/waybill_manifest/list?waybillCode=${paramObj.code}`;
  HTTP.get(url, {}, (success, error) => {
    callback(success, error);
  });
}

// 获取单车结算货单信息
function getManifestListSettle(paramObj, callback) {
  const url = `${apiWayBillDomain}/waybill/waybill_manifest/settle/list`;
  HTTP.get(url, paramObj, (success, error) => {
    callback(success, error);
  });
}

// 货单发货
function loadingLoading(domainObject, paramObj, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/${domainObject.code}/waybill_manifest/loading`;

  let obj = {};
  let keys = ['code', 'loadingGoodsNum', 'loadingGoodsNumUnitCode', 'loadingGoodsWeight', 'loadingGoodsWeightUnitCode', 'loadingGoodsVolume', 'loadingGoodsVolumeUnitCode', 'loadingDescription'];

  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    if (!obj.hasOwnProperty(key)) {
      obj[key] = '';
    }
    for (let j = 0; j < paramObj.length; j++) {
      let item = paramObj[j];
      if (0 == j) {
        obj[key] = item[key] || '';
      } else {
        const val = item[key] || '';
        obj[key] += `,${val}`
        // obj[key] += `,${item[key]}`
      }
    }
  }
  obj.loadingTime = domainObject.loadingTime;
  obj.loadingAttachment = domainObject.loadingAttachment;

  HTTP.post(apiUrl, obj, (res, err) => {
    cb(res, err);
  });
}

// 货单收货
function unloadingLoading(domainObject, paramObj, cb) {
  let self = this;

  let obj = {};
  let keys = ['code', 'unloadingGoodsNum', 'unloadingGoodsNumUnitCode', 'unloadingGoodsWeight', 'unloadingGoodsWeightUnitCode', 'unloadingGoodsVolume', 'unloadingGoodsVolumeUnitCode', 'unloadingDescription'];

  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    if (!obj.hasOwnProperty(key)) {
      obj[key] = '';
    }
    for (let j = 0; j < paramObj.length; j++) {
      let item = paramObj[j];
      if (0 == j) {
        // obj[key] = item[key]
        obj[key] = item[key] || '';
      } else {
        const val = item[key] || '';
        obj[key] += `,${val}`;
        // obj[key] += `,${item[key]}`
      }
    }
  }

  obj.unloadingTime = domainObject.unloadingTime;
  obj.unloadingAttachment = domainObject.unloadingAttachment;

  const apiUrl = `${apiWayBillDomain}/waybill/${domainObject.code}/waybill_manifest/unloading`;
  HTTP.post(apiUrl, obj, (res, err) => {
    cb(res, err);
  });
}

// ###   new waybill 货源 start =======================================
function getColumnManifestSingle(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/waybill/manifestList1/single/list_render_info.json`)
  success = JSON.parse(JSON.stringify(success));
  cb(success);
}

function getColumnManifestMultiple(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/waybill/manifestList1/multiple/list_render_info.json`)
  success = JSON.parse(JSON.stringify(success));
  cb(success);
}

// 获取货单信息
// function getManifestList(paramObj, callback) {
//   const url = `${apiLogisticsDomain}/waybill/waybill_manifest/${paramObj.code}/get`;
//   HTTP.get(url, {}, (success, error) => {
//     callback(success, error);
//   });
// }

// 批量修改订单下所有货单记录
function editManifestList(code, list, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/${code}/waybill_manifest/operate`;

  let obj = {},
    postList = [];
  if (list.length) {
    for (let i = 0; i < list.length; i++) {
      const value = list[i];
      let b = false;
      Object.keys(value).forEach((key) => {
        if (value[key]) {
          b = true;
        }
      });
      if (b) {
        postList.push(value);
      }
    }
  }

  postList.forEach((value) => {
    Object.keys(value).forEach((key) => {
      if (key in obj) {
        let val = value[key] ? value[key] : '';
        obj[key] += ',' + val;
      } else {
        let val = value[key] ? value[key] : '';
        obj[key] = val;
      }
    });
  });
  HTTP.post(apiUrl, obj, (res, err) => {
    cb(res, err);
  });

  // HTTP.postJson(apiUrl, paramObj, (response, err) => {
  //   cb(response, err);
  // });
}

// 修改单车结算页面货单列表信息
function editManifestListSettle(code, obj, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/${code}/waybill_manifest/settle/operate`;
  HTTP.post(apiUrl, obj, (res, err) => {
    cb(res, err);
  });
}

// 实时计算单条货单数据
function calSingleManifest(paramsObj, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/waybill_manifest/settle/calculate`;
  HTTP.post(apiUrl, paramsObj, (res, err) => {
    cb(res, err);
  });
}

// ###   new waybill 货源 end =======================================

function getColumnManifestSettle(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/waybill/manifestListSettle/multiple/list_render_info.json`)
  success = JSON.parse(JSON.stringify(success));
  cb(success);
}

// 收发货中
//waybill：domainObject的json字符串（map类型） domainObject
//manifest：货单的json字符串（map类型）paramObj
function submitManifestFinal(action, domainObject, paramObj, cb) {
    const link = '@@';

  let paramsObjFinal = {};
  // 处理 货物
  let obj = {};
  // 发货的时候需要提交的 字段
  let keys = ['code', 'loadingGoodsNum', 'loadingGoodsNumUnitCode', 'loadingGoodsWeight', 'loadingGoodsWeightUnitCode', 'loadingGoodsVolume', 'loadingGoodsVolumeUnitCode', 'loadingDescription'];
  // 收货需要提交的字段
  if ('unloading' == action || 'unloadingInput' == action) {
    keys = ['code', 'unloadingGoodsNum', 'unloadingGoodsNumUnitCode', 'unloadingGoodsWeight', 'unloadingGoodsWeightUnitCode', 'unloadingGoodsVolume', 'unloadingGoodsVolumeUnitCode', 'unloadingDescription'];
  }
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    if (!obj.hasOwnProperty(key)) {
      obj[key] = '';
    }
    for (let j = 0; j < paramObj.length; j++) {
      let item = paramObj[j];
      if (0 == j) {
        obj[key] = item[key] || '';
      } else {
        const val = item[key] || '';
        obj[key] += `${link}${val}`
        // obj[key] += `,${item[key]}`
      }
    }
  }
  paramsObjFinal['waybill'] = JSON.stringify(domainObject);
  if(!obj){
    paramsObjFinal['manifest'] = '{}';
  }else{
     paramsObjFinal['manifest'] = JSON.stringify(obj);
  }

  const apiUrl = `${apiWayBillDomain}/waybill/manifest/${action}`;
  HTTP.post(apiUrl, paramsObjFinal, (res, err) => {
    cb(res, err);
  });

}

// 新建 运单
//waybill：domainObject的json字符串（map类型） domainObject
//manifest：货单的json字符串（map类型）paramObj
function addWaybill( domainObject, list, cb) {
  const link = '@@';

  let paramsObjFinal = {};
  // 处理货物 -------------------------------------------------
  let obj = utils.transformListToObjByStr(list,link);
  // 处理货物 -------------------------------------------------
  domainObject = utils.formatDateInDoamin(domainObject);
  paramsObjFinal['waybill'] = JSON.stringify(domainObject) ;
  if(!obj){
    paramsObjFinal['manifest'] = '{}';
  }else{
     paramsObjFinal['manifest'] = JSON.stringify(obj);
  }

  const apiUrl = `${apiWayBillDomain}/waybill/manifest/add`;
  HTTP.post(apiUrl, paramsObjFinal, (res, err) => {
    cb(res, err);
  });
}

// 编辑 运单
//waybill：domainObject的json字符串（map类型） domainObject
//manifest：货单的json字符串（map类型）paramObj
function editWaybill( domainObject, list, cb) {
    const link = '@@';

  let paramsObjFinal = {};
  // 处理货物 -------------------------------------------------
  let obj = utils.transformListToObjByStr(list,link);
  // 处理货物 -------------------------------------------------
    domainObject = utils.formatDateInDoamin(domainObject);
  paramsObjFinal['waybill'] = JSON.stringify(domainObject);
  if(!obj){
    paramsObjFinal['manifest'] = '{}';
  }else{
     paramsObjFinal['manifest'] = JSON.stringify(obj);
  }

  const apiUrl = `${apiWayBillDomain}/waybill/manifest/edit`;
  HTTP.post(apiUrl, paramsObjFinal, (res, err) => {
    cb(res, err);
  });
}

// 运单费用科目模块start-------------------
// 费用科目字段配置
function getColumnChargeItem(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/waybill/chargeItem/list_render_info.json`)
  success = JSON.parse(JSON.stringify(success));
  cb(success);
}

// 获取费用科目列表
function getChargeItemList(paramsObj, cb) {
  // const success = {
  //   'code': 200,
  //   'content': [
  //     {
  //       'id': 1,
  //       'code': '2019050912122121',
  //       'paymentChannel': 'none',
  //       'chargeItemName': 'ETC',
  //       'chargeItemNumber': 665,
  //       'chargeItemNumberUnitCode': 'item',
  //       'chargeItemNumberResource': 'none',
  //       'chargeItemPrice': 8888.00,
  //       'chargeItemPriceUnitCode': 'yuanperitem',
  //       'chargeItemPriceResource': 'none',
  //       'chargeAmounts': 999.00,
  //       'chargeAmountsUnitCode': 'yuan',
  //       'chargeItemAmountsResource': 'input',
  //       'chargeItemAmountsPrecision': 0,
  //       'chargeItemPaybillStatus': '',
  //       'attachmentList': 'eaf70a86-031e-48df-8104-85289522eea1',
  //       'chargeItemPaybillNo': '',
  //       'description': 'ETC的备注信息'
  //     },
  //     {
  //       'id': 2,
  //       'code': '2019050912122122',
  //       'paymentChannel': 'none',
  //       'chargeItemName': '运杂费',
  //       'chargeItemNumber': 543,
  //       'chargeItemNumberUnitCode': 'item',
  //       'chargeItemNumberResource': 'input',
  //       'chargeItemPrice': 652.00,
  //       'chargeItemPriceUnitCode': 'yuanperitem',
  //       'chargeItemPriceResource': 'none',
  //       'chargeAmounts': 444.00,
  //       'chargeAmountsUnitCode': 'yuan',
  //       'chargeItemAmountsResource': 'input',
  //       'chargeItemAmountsPrecision': 1,
  //       'chargeItemPaybillStatus': '',
  //       'attachmentList': 'fbb41298-c663-460f-98cf-6822816cf709',
  //       'chargeItemPaybillNo': '',
  //       'description': '运杂费的备注信息'
  //     },
  //     {
  //       'id': 3,
  //       'code': '2019050912122123',
  //       'paymentChannel': 'cash',
  //       'chargeItemName': '奖金',
  //       'chargeItemNumber': 300,
  //       'chargeItemNumberUnitCode': 'item',
  //       'chargeItemNumberResource': 'input',
  //       'chargeItemPrice': 200.00,
  //       'chargeItemPriceUnitCode': 'yuanperitem',
  //       'chargeItemPriceResource': 'input',
  //       'chargeAmounts': 400.00,
  //       'chargeAmountsUnitCode': 'yuan',
  //       'chargeItemAmountsResource': 'input',
  //       'chargeItemAmountsPrecision': 2,
  //       'chargeItemPaybillStatus': 'none',
  //       'attachmentList': 'fbb41298-c663-460f-98cf-6822816cf709',
  //       'chargeItemPaybillNo': '',
  //       'description': '奖金的备注信息'
  //     },
  //     {
  //       'id': 4,
  //       'code': '2019050912122124',
  //       'paymentChannel': 'cash',
  //       'chargeItemName': '奖金',
  //       'chargeItemNumber': 300,
  //       'chargeItemNumberUnitCode': 'item',
  //       'chargeItemPrice': 200.00,
  //       'chargeItemPriceUnitCode': 'yuanperitem',
  //       'chargeAmounts': 400.00,
  //       'chargeAmountsUnitCode': 'yuan',
  //       'chargeItemPaybillStatus': 'apply',
  //       'attachmentList': 'fbb41298-c663-460f-98cf-6822816cf709',
  //       'chargeItemPaybillNo': '20181016P000285',
  //       'chargeItemPaybillCode': '473711722575259826',
  //       'description': '奖金的备注信息'
  //     },
  //     {
  //       'id': 5,
  //       'code': '2019050912122125',
  //       'paymentChannel': 'cash',
  //       'chargeItemName': '奖金',
  //       'chargeItemNumber': 300,
  //       'chargeItemNumberUnitCode': 'item',
  //       'chargeItemPrice': 200.00,
  //       'chargeItemPriceUnitCode': 'yuanperitem',
  //       'chargeAmounts': 400.00,
  //       'chargeAmountsUnitCode': 'yuan',
  //       'chargeItemPaybillStatus': 'approve',
  //       'attachmentList': 'fbb41298-c663-460f-98cf-6822816cf709',
  //       'chargeItemPaybillNo': '20181016P000283',
  //       'chargeItemPaybillCode': '473711720847206574',
  //       'description': '奖金的备注信息'
  //     },
  //     {
  //       'id': 6,
  //       'code': '2019050912122126',
  //       'paymentChannel': 'cash',
  //       'chargeItemName': '奖金',
  //       'chargeItemNumber': 300,
  //       'chargeItemNumberUnitCode': 'item',
  //       'chargeItemPrice': 200.00,
  //       'chargeItemPriceUnitCode': 'yuanperitem',
  //       'chargeAmounts': 400.00,
  //       'chargeAmountsUnitCode': 'yuan',
  //       'chargeItemPaybillStatus': 'approveFailed',
  //       'attachmentList': 'fbb41298-c663-460f-98cf-6822816cf709',
  //       'chargeItemPaybillNo': '20181016P000267',
  //       'chargeItemPaybillCode': '473711710638270606',
  //       'description': '奖金的备注信息'
  //     },
  //     {
  //       'id': 7,
  //       'code': '2019050912122127',
  //       'paymentChannel': 'cash',
  //       'chargeItemName': '奖金',
  //       'chargeItemNumber': 300,
  //       'chargeItemNumberUnitCode': 'item',
  //       'chargeItemPrice': 200.00,
  //       'chargeItemPriceUnitCode': 'yuanperitem',
  //       'chargeAmounts': 400.00,
  //       'chargeAmountsUnitCode': 'yuan',
  //       'chargeItemPaybillStatus': 'pend',
  //       'attachmentList': 'fbb41298-c663-460f-98cf-6822816cf709',
  //       'chargeItemPaybillNo': '20181016P000285',
  //       'chargeItemPaybillCode': '473711722575259826',
  //       'description': '奖金的备注信息'
  //     },
  //     {
  //       'id': 8,
  //       'code': '2019050912122128',
  //       'paymentChannel': 'cash',
  //       'chargeItemName': '预付金',
  //       'chargeItemNumber': 100,
  //       'chargeItemNumberUnitCode': 'item',
  //       'chargeItemPrice': 50.00,
  //       'chargeItemPriceUnitCode': 'yuanperitem',
  //       'chargeAmounts': 300.00,
  //       'chargeAmountsUnitCode': 'yuan',
  //       'chargeItemPaybillStatus': 'paid',
  //       'chargeItemPaybillPayChannel': 'online',
  //       'attachmentList': 'fbb41298-c663-460f-98cf-6822816cf709',
  //       'chargeItemPaybillNo': 'P21902918329832',
  //       'description': '预付金的备注信息'
  //     },
  //     {
  //       'id': 9,
  //       'code': '2019050912122129',
  //       'paymentChannel': 'cash',
  //       'chargeItemName': '货运险',
  //       'chargeItemNumber': 400,
  //       'chargeItemNumberUnitCode': 'item',
  //       'chargeItemPrice': 600.00,
  //       'chargeItemPriceUnitCode': 'yuanperitem',
  //       'chargeAmounts': 800.00,
  //       'chargeAmountsUnitCode': 'yuan',
  //       'chargeItemPaybillStatus': 'paid',
  //       'chargeItemPaybillPayChannel': 'offline',
  //       'attachmentList': 'fbb41298-c663-460f-98cf-6822816cf709',
  //       'chargeItemPaybillNo': 'P21902918329832',
  //       'description': '货运险的备注信息'
  //     },
  //     {
  //       'id': 10,
  //       'code': '2019050912122110',
  //       'paymentChannel': 'cash',
  //       'chargeItemName': '奖金',
  //       'chargeItemNumber': 300,
  //       'chargeItemNumberUnitCode': 'item',
  //       'chargeItemPrice': 200.00,
  //       'chargeItemPriceUnitCode': 'yuanperitem',
  //       'chargeAmounts': 400.00,
  //       'chargeAmountsUnitCode': 'yuan',
  //       'chargeItemPaybillStatus': 'failed',
  //       'attachmentList': 'fbb41298-c663-460f-98cf-6822816cf709',
  //       'chargeItemPaybillNo': '20181016P000267',
  //       'chargeItemPaybillCode': '473711710638270606',
  //       'description': '奖金的备注信息'
  //     }
  //   ]
  // }
  // cb(success);
  const apiUrl = `${apiWayBillDomain}/waybill/waybill_accounting_charge_record/list`;
  HTTP.get(apiUrl, paramsObj, (res, err) => {
    cb(res, err);
  });
}


// 获取 详情
function getChargeItem(code, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/waybill_accounting_charge_record/${code}/get`;
  HTTP.get(apiUrl, {}, (res, err) => {
    cb(res, err);
  });
}

// 批量修改
function editChargeItemList(waybillCode, paramsObj, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/waybill_accounting_charge_record/${waybillCode}/editBatch`;
  HTTP.post(apiUrl, paramsObj, (res, err) => {
    cb(res, err);
  });
}

// 创建操作
function createBill(paramsObj, cb) {
  const apiUrl = `${apiWayBillDomain}/waybill/waybill_accounting_charge_record/${paramsObj.code}/createPayBill`;
  HTTP.post(apiUrl, paramsObj, (res, err) => {
    cb(res, err);
  });
}

// 申请
function paybillRecordApply(paramsObj, callback) {
  const apiUrl = `${apiWayBillDomain}/waybill/paybill/record/${paramsObj.code}/apply`;
  HTTP.post(apiUrl,{}, (res, err) => {
    callback(res, err);
  });
}

// 审核
function paybillRecordApprove(paramsObj, callback) {
  const apiUrl = `${apiWayBillDomain}/waybill/paybill/record/${paramsObj.code}/approve`;
  delete paramsObj.code;
  HTTP.post(apiUrl,paramsObj, (res, err) => {
    callback(res, err);
  });
}

// 修改
function paybillEdit(paramsObj, callback) {
  const apiUrl = `${apiWayBillDomain}/waybill/paybill/${paramsObj.code}/edit`;
  delete paramsObj.code;
  HTTP.post(apiUrl, paramsObj, (res, err) => {
    callback(res, err);
  });
}

// 查询付款单
function paybillGet(paramsObj, callback) {
  const apiUrl = `${apiWayBillDomain}/waybill/paybill/${paramsObj.code}/get`;
  HTTP.get(apiUrl, paramsObj, (res, err) => {
    callback(res, err);
  });
}

// 撤回线下支付
function paybillWithdraw(paramsObj, callback) {
  const apiUrl = `${apiWayBillDomain}/waybill/paybill/pay/retract`;
  HTTP.post(apiUrl, paramsObj, (res, err) => {
    callback(res, err);
  });
}

// 打回支付
function paybillRepulse(paramsObj, callback) {
  const apiUrl = `${apiWayBillDomain}/waybill/paybill/${paramsObj.code}/pay/revoke`;
  HTTP.post(apiUrl, paramsObj, (res, err) => {
    callback(res, err);
  });
}

// 线下付款
function paybillOffline(paramsObj, callback) {
  const apiUrl = `${apiWayBillDomain}/waybill/paybill/${paramsObj.code}/pay`;
  HTTP.post(apiUrl, paramsObj, (res, err) => {
    callback(res, err);
  });
}

// 费用科目实时计算
function calculateChargeAmount(paramsObj, callback) {
  const apiUrl = `${apiWayBillDomain}/waybill/waybill_accounting_charge_record/calculateAmount`;
  HTTP.get(apiUrl, paramsObj, (res, err) => {
    callback(res, err);
  });
}

// 修改费用科目
function chargeItemEdit(paramsObj, callback) {
  const apiUrl = `${apiWayBillDomain}/waybill/waybill_accounting_charge_record/${paramsObj.code}/edit`;
  HTTP.post(apiUrl, paramsObj, (res, err) => {
    callback(res, err);
  });
}

export {
  getChargeItem,
  paybillEdit,
  paybillRecordApply,
  paybillRecordApprove,
  editPriceOutsourcing,
  addWaybill,
  editWaybill,
  submitManifestFinal,
  getColumnManifestSingle,
  getColumnManifestMultiple,
  editManifestList,
  loadingLoading,
  unloadingLoading,
  getManifestList,
  getColumnManifestLoading,
  getColumnManifestUnloading,
  changeCapacity,
  getColumnManifestList,
  getSearchManifestList,
  getListManifestList,
  exportCsvManifestList,
  saveInvoiceList,
  getListInvoiceList,
  getColumnInvoiceList,
  editPrice,
  getColumnRecycle,
  recover,
  creatReportCapitalFlow,
  batchFixPayee,
  add_and_notify,
  createUploadWaybill,
  createUnsettleUploadWaybill,
  executeAction,
  executeActionWithRecordCode,
  list,
  settleList,
  getAction,
  getActionRecord,
  getActionRecordWithParams,
  getSearch,
  getSettleSearch,
  getSearchRecycle,
  deleteList,
  deleteSettleList,
  getColumn,
  getDetail,
  getSettleDetail,
  getSettleColumn,
  add,
  edit,
  editPlatformWaybill,
  get,
  addAction,
  getCharge,
  getChargeDefine,
  getSettleList,
  addSettle,
  editSettle,
  getSettleAction,
  getDriverList,
  addDriver,
  addRecord,
  getTotalAmount,
  saveSettle,
  saveManifestSettle,
  batchManifestSettle,
  exportCsv,
  downloadErrorData,
  downloadTemplate,
  waybillReport,
  validateTruckLicenseNo,
  getLogisticsTruckList,
  getImgUrl,
  deleteActionRecord,
  listByLogisticsCode,
  getWaybillList,
  getWaybillListOutsourcing,
  listForS,
  onlinePay,
  pay,
  revokePay,
  approvePayment,
  waybillLst,
  undoSettle,
  ICBCpay,
  declareWaybill,
  getWaybillLoadingWeight,
  cancelOnlinePay,
  BSBpay,
  evaConfig,
  evaAdd,
  getEvaInfo,
  getPopWaybillList,
  getPopWaybillListOutsourcing,
  getTotal,
  dispatch,
  getColumnManifestSettle,
  getManifestListSettle,
  editManifestListSettle,
  calSingleManifest,
  calculateAmount,
  getColumnChargeItem,
  getChargeItemList,
  editChargeItemList,
  createBill,
  paybillGet,
  paybillWithdraw,
  paybillRepulse,
  paybillOffline,
  calculateChargeAmount,
  chargeItemEdit
};
