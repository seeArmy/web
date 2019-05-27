/**
 * waybillService.js
 * Created by dsky on 17/7/5.
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
  const apiUrl = `${apiWayBillDomain}/waybill/list`;
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
  HTTP.post(apiUrl, { 'waybillCodeList': paramObj.join(',') }, (res, err) => {
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

// 获取费用列表头部搜索字段配置
function getSettleSearch(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/waybill/settle/search_render_info.json`)
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
function getColumn(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/waybill/waybill/list_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    cb(success);
}

// 获取费用列表显示字段
function getSettleColumn(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/waybill/settle/list_render_info.json`)
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
  const apiUrl = `${apiWayBillDomain}/export/waybill`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
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

// 获取订单新运价
// get /custom/custom_logic_new_rate/{code}/get
function customLogisticsNewRateGet(paramObj, cb) {
  const apiUrl = `${apiDomain}/custom/custom_logic_new_rate/${paramObj.code}/get`;
  HTTP.get(apiUrl, paramObj, (res, err) => {
    cb(res, err);
  });
}

function getFormFields(paramObj, callback) {
  const success = {
    code: 200,
    content: [
        //   {
      //     showName: '账单状态', elementCode: 'select', extraParams: '{"field1":"billStatus","optionsValue1":["none","pend","accept","reject","destroy"],"options1":["待提交审核","待审核","审核通过","审核不通过","已作废"]}', fieldConfigCode: 'billStatus'
      //   },
      // {
      //   showName: '创建时间', elementCode: 'dateRange', extraParams: '{"field1":"from_createTime","field3":"to_createTime","format1":"yyyy-MM-dd","format3":"yyyy-MM-dd","default2":"到"}', fieldConfigCode: 'createTime'
      // },
      {
        showName: '订单号', elementCode: 'text', extraParams: '{"field1":"waybillNo","area":"base","required":"true","detailLinkVisiable":"true"}', fieldConfigCode: 'waybillNo'
      },
      {
        showName: '委托号', elementCode: 'text', extraParams: '{"field1":"billName"}', fieldConfigCode: '委托号'
      },
      {
        showName: '找车单子号', elementCode: 'text', extraParams: '{"field1":"billNo"}', fieldConfigCode: '找车单子号'
      },
      {
        showName: '找车单状态', elementCode: 'select', extraParams: '{"field1":"billStatus","optionsValue1":["none","pend","accept","reject","destroy"],"options1":["待提交审核","待审核","审核通过","审核不通过","已作废"]}', fieldConfigCode: 'billStatus'
      },
      {
        showName: '码头公司', elementCode: 'text', extraParams: '{"field1":"码头公司"}', fieldConfigCode: '码头公司'
      },
      {
        showName: '货代', elementCode: 'text', extraParams: '{"field1":"订单号"}', fieldConfigCode: '货代'
      },
      {
        showName: '船名', elementCode: 'text', extraParams: '{"field1":"船名"}', fieldConfigCode: '船名'
      },
      {
        showName: '航次', elementCode: 'text', extraParams: '{"field1":"航次"}', fieldConfigCode: '航次'
      },
      {
        showName: '类型', elementCode: 'text', extraParams: '{"field1":"类型"}', fieldConfigCode: '类型'
      },
      {
        showName: '唛头', elementCode: 'text', extraParams: '{"field1":"唛头"}', fieldConfigCode: '唛头'
      },
      {
        showName: '提单', elementCode: 'text', extraParams: '{"field1":"提单"}', fieldConfigCode: '提单'
      },
      {
        showName: '办理时间', elementCode: 'dateRange', extraParams: '{"field1":"from_createTime","field3":"to_createTime","format1":"yyyy-MM-dd","format3":"yyyy-MM-dd","default2":"到"}', fieldConfigCode: 'createTime'
      },
      {
        showName: '货种', elementCode: 'text', extraParams: '{"field1":"货种"}', fieldConfigCode: '货种'
      },
      {
        showName: '计划重量', elementCode: 'text', extraParams: '{"field1":"计划重量"}', fieldConfigCode: '计划重量'
      },
      {
        showName: '计划体积', elementCode: 'text', extraParams: '{"field1":"计划体积"}', fieldConfigCode: '计划体积'
      },
      {
        showName: '计划数量', elementCode: 'text', extraParams: '{"field1":"计划数量"}', fieldConfigCode: '计划数量'
      },
      {
        showName: '专线', elementCode: 'text', extraParams: '{"field1":"专线"}', fieldConfigCode: '专线'
      },
      {
        showName: '订单委托方', elementCode: 'text', extraParams: '{"field1":"订单委托方"}', fieldConfigCode: '订单委托方'
      },
      {
        showName: '供货方', elementCode: 'text', extraParams: '{"field1":"供货方"}', fieldConfigCode: '供货方'
      },
      {
        showName: '找车委托方', elementCode: 'text', extraParams: '{"field1":"找车委托方"}', fieldConfigCode: '找车委托方'
      },
      {
        showName: '结算方式', elementCode: 'text', extraParams: '{"field1":"结算方式"}', fieldConfigCode: '结算方式'
      },
      {
        showName: '支付方式', elementCode: 'text', extraParams: '{"field1":"支付方式"}', fieldConfigCode: '支付方式'
      },
      {
        showName: '货品', elementCode: 'text', extraParams: '{"field1":"货品"}', fieldConfigCode: '货品'
      },
      {
        showName: '货品单价', elementCode: 'text', extraParams: '{"field1":"货品单价"}', fieldConfigCode: '货品单价'
      },
      {
        showName: '合理货差系数', elementCode: 'text', extraParams: '{"field1":"合理货差系数"}', fieldConfigCode: '合理货差系数'
      },
      {
        showName: '需求车次', elementCode: 'text', extraParams: '{"field1":"需求车次"}', fieldConfigCode: '需求车次'
      },
      {
        showName: '找车截止时间', elementCode: 'text', extraParams: '{"field1":"找车截止时间"}', fieldConfigCode: '找车截止时间'
      },
      {
        showName: '发货方', elementCode: 'text', extraParams: '{"field1":"发货方"}', fieldConfigCode: '发货方'
      },
      {
        showName: '发货地', elementCode: 'text', extraParams: '{"field1":"发货地"}', fieldConfigCode: '发货地'
      },
      {
        showName: '发货地址', elementCode: 'text', extraParams: '{"field1":"发货地址"}', fieldConfigCode: '发货地址'
      },
      {
        showName: '收货方', elementCode: 'text', extraParams: '{"field1":"收货方"}', fieldConfigCode: '收货方'
      },
      {
        showName: '收货地', elementCode: 'text', extraParams: '{"field1":"收货地"}', fieldConfigCode: '收货地'
      },
      {
        showName: '收货地址', elementCode: 'text', extraParams: '{"field1":"收货地址"}', fieldConfigCode: '收货地址'
      },
      {
        showName: '备注', elementCode: 'text', extraParams: '{"field1":"备注"}', fieldConfigCode: '备注'
      },
      {
        showName: '找车单附件', elementCode: 'text', extraParams: '{"field1":"找车单附件"}', fieldConfigCode: '找车单附件'
      }
    ]
  };
  callback(success);
}

export {
  executeAction, executeActionWithRecordCode, list, settleList, getAction, getActionRecord, getActionRecordWithParams,
  getSearch, getSettleSearch, deleteList, deleteSettleList, getColumn, getSettleColumn, add, edit, get, addAction,
  getCharge, getChargeDefine, getSettleList, addSettle, editSettle, getSettleAction, getDriverList, addDriver, addRecord, getTotalAmount,
  saveSettle, exportCsv, downloadErrorData, downloadTemplate, waybillReport, validateTruckLicenseNo, getLogisticsTruckList,
  getImgUrl, deleteActionRecord, getFormFields,customLogisticsNewRateGet
};
