/**
 *
 */
import * as HTTP from './httpUtil';
import { checkFileExist } from './Utils';
const axios = require('axios');
var ApiConst= require('./ApiConst');
const apiDomain = ApiConst.apiWayBillDomain;

const apiWayBillDomain = ApiConst.apiWayBillDomain;





/**
 * 账单实付记录关系表统计
 * @param {*} paramObj
 * @param {*} callback
 */
function settleReceiptRelationBillCount(paramObj, callback) {
  const url = `${apiDomain}/waybill_broker_bill/settle_bill_receipt_relation/bill/count`;
  HTTP.get(url, paramObj, (success, error) => {
    callback(success, error);
  });
}



/**
 * 付款详情和应付账单详情中的应收列表
 * @param {*} paramObj
 *  @params.receiptCode 收款详情，传入收款记录code
 *  @params.billCode    应付账单详情，传入账单编码
 * @param {*} callback
 */
function settlePaymentRelationList(paramObj, callback) {
  const url = `${apiDomain}/waybill_broker_bill/settle_bill_payment_relation/list`;
  HTTP.get(url, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 根据流水号查询付款记录
 * @param {*} paramObj
 *  @params.serialNumber 付款资金流水号
 * @param {*} callback
 */
function settlePayableActualReceiptLogGetNew(paramObj, callback) {
  const url = `${apiDomain}/waybill_broker_bill/actual_payment_log/get`;
  HTTP.get(url, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 新增账单实付记录关系表
 * @param {*} paramObj
 * @param {*} callback
 */
function settlePaymentRelationAdd(paramObj, callback) {
  const url = `${apiDomain}/waybill_broker_bill/settle_bill_payment_relation/add`;
  HTTP.post(url, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 账单实付记录关系表统计
 * @param {*} paramObj
 * @param {*} callback
 */
function settlePaymentRelationBillCount(paramObj, callback) {
  const url = `${apiDomain}/waybill_broker_bill/settle_bill_payment_relation/bill/count`;
  HTTP.get(url, paramObj, (success, error) => {
    callback(success, error);
  });
}






/**
 *
 * @param {*} callback
 */
function settleActualReceiptColumns(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/platform/settleBillPayable/actualReceipt/list_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
  callback(success);
}




function settlePayableEdit(params, callback) {
  const url = `${apiDomain}/waybill_broker_bill/edit`;
  HTTP.post(url, params, (success, error) => {
    callback(success, error);
  });
}











function settlePayableSelectContractWaybillList(params, callback) {
  const url = `${apiDomain}/waybill_broker_bill/select_contrast_waybill/list`;
  HTTP.get(url, params, callback);
}


// 新 的接口 list  GET /waybill_broker_bill/select_relation_waybill/list 账单已对账运单列表
function settlePayableRelationWaybillList(params, callback) {
  const url = `${apiDomain}/waybill_broker_bill/select_relation_waybill/list`;
  HTTP.get(url, params, callback);
}




function settlePayableSelectCarrierList(params, callback) {
  const url = `${apiDomain}/waybill_broker_bill/select_carrier/list`;
  HTTP.get(url, params, (success, error) => {
    callback(success, error);
  });
}

function settlePayableWaybillColumns(callback) {
  let success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/platform/settleBillPayable/payableWaybill/list_render_info.json`);
      success = JSON.parse(JSON.stringify(success));

// 查看是否是个性需求

 let sub = getJsonProjectList('platform/settleBillPayable/payableWaybill');
 if(sub){
  success = sub;
 }



  console.log('列表配置为', success);
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

function settlePayableWaybillSearch(callback) {
  let success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/platform/settleBillPayable/payableWaybill/search_render_info.json`);
      success = JSON.parse(JSON.stringify(success));

  // 查看是否是个性需求

 let sub = getJsonProjectSearch('platform/settleBillPayable/payableWaybill');
 if(sub){
  success = sub;
 }
  console.log('列表搜索配置为', success);
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

function settlePayableSelectedWaybillColumns(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/platform/settleBillPayable/payableSelWaybill/list_render_info.json`);
      success = JSON.parse(JSON.stringify(success));
  console.log('列表配置为', success);
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

function settlePayableSelectedWaybillSearch(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/platform/settleBillPayable/payableSelWaybill/search_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}



function settleActualPaymentColumns(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/platform/settleBillPayable/actualPayment/list_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
  callback(success);
}

function settlePayableWaybillAdjustQuota(params, callback) {
  const url = `${apiDomain}/waybill_broker_bill/waybill/adjust_quota`;
  HTTP.post(url, params, callback);
}

function settlePayableWaybillAdjustRatio(params, callback) {
  const url = `${apiDomain}/waybill_broker_bill/waybill/adjust_proportion`;
  HTTP.post(url, params, callback);
}

function settlePayableWaybillAdjustSettleMethod(params, callback) {
  const url = `${apiDomain}/waybill_broker_bill/waybill/adjust_settle_method`;
  HTTP.post(url, params, callback);
}

function settlePayableWaybillAdjustTaxRates(params, callback) {
  const url = `${apiDomain}/waybill_broker_bill/waybill/adjust_tax_rate`;
  HTTP.post(url, params, callback);
}

function settlePayableWaybillAdjustTaxType(params, callback) {
  const url = `${apiDomain}/waybill_broker_bill/waybill/adjust_tax_type`;
  HTTP.post(url, params, callback);
}

function settlePayableWaybillEditDescription(params, callback) {
  const url = `${apiDomain}/waybill_broker_bill/waybill/${params.code}/edit_description`;
  HTTP.post(url, { description: params.description, carrierOrgName: params.carrierOrgName, billCode: params.billCode }, callback);
}

function settlePayableTempTableDelete(params, callback) {
  const url = `${apiDomain}/waybill_broker_bill/temp_table/delete`;
  HTTP.post(url, params, callback);
}

function settlePayableActualPaymentLogExportCsv(params, callback) {
  const apiUrl = `${apiDomain}/export/custom/actualPayment`;
  HTTP.postJson(apiUrl, params, (success, error) => {
    callback(success, error);
  });
}

function settlePayableActualPaymentLogDownloadErrorData(params, callback) {
  const apiUrl = `${apiDomain}/generator/actualPayment`;
  HTTP.post(apiUrl, params, (success, error) => {
    callback(success, error);
  });
}

function settlePayableActualPaymentLogDownloadTemplate(params, callback) {
  const apiUrl = `${apiDomain}/download/template/actualPayment`;
  HTTP.get(apiUrl, params, (success, error) => {
    callback(success, error);
  });
}

function settlePayableActualPaymentLogListColumn(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/platform/settleBillPayable/actualPayment/list_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}

function settlePayableActualPaymentLogListSearch(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/platform/settleBillPayable/actualPayment/search_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}

function settlePayableActualPaymentLogList(data, callback) {
  const url = `${apiDomain}/waybill_broker_bill/actual_payment_log/list`;
  HTTP.get(url, data, callback);
}

function settlePayableActualPaymentLogDelete(code, paramObj, callback) {
  const url = `${apiDomain}/waybill_broker_bill/actual_payment_log/${code}/delete`;
  HTTP.post(url, paramObj, (res, error) => {
    callback(res, error);
  });
}

function settlePayableActualPaymentLogConfirm(code, paramObj, callback) {
  const url = `${apiDomain}/waybill_broker_bill/actual_payment_log/${code}/confirm`;
  HTTP.post(url, paramObj, (res, error) => {
    callback(res, error);
  });
}

function settlePayableActualPaymentLogEdit(code, data, callback) {
  const url = `${apiDomain}/waybill_broker_bill/actual_payment_log/${code}/edit`;
  HTTP.post(url, data, callback);
}

function settlePayableActualPaymentLogGet(paramObj, callback) {
  const url = `${apiDomain}/waybill_broker_bill/actual_payment_log/${paramObj.code}/get`;
  HTTP.get(url, {}, callback);
}


// B/b列表查询
function settlePayableList(params, callback) {
  const url = `${apiDomain}/waybill_broker_bill/list`;
  HTTP.get(url, params, callback);
}

// S列表查询
function settlePayableAllList(params, callback) {
  const url = `${apiDomain}/waybill_broker_bill/all/list`;
  HTTP.get(url, params, callback);
}

// 提交审核
function settlePayableApplyApprove(code, callback) {
  const url = `${apiDomain}/waybill_broker_bill/${code}/apply_approve`;
  HTTP.post(url, {}, callback);
}

// 撤回提交审核
function settlePayableRevokeApplyApprove(code, callback) {
  const url = `${apiDomain}/waybill_broker_bill/${code}/revoke_apply_approve`;
  HTTP.post(url, {}, callback);
}

// 审核账单
function settlePayableApprove(code, params, callback) {
  const url = `${apiDomain}/waybill_broker_bill/${code}/approve`;
  HTTP.post(url, params, callback);
}

// 撤回审核
function settlePayableRevokeApprove(code, callback) {
  const url = `${apiDomain}/waybill_broker_bill/${code}/revoke_approve`;
  HTTP.post(url, {}, callback);
}

// 作废账单
function settlePayableCancel(code, callback) {
  const url = `${apiDomain}/waybill_broker_bill/${code}/cancel`;
  HTTP.post(url, {}, callback);
}

// 确认开票
function settlePayableInvoice(code, paramObj, callback) {
  const url = `${apiDomain}/waybill_broker_bill/${code}/invoice`;
  HTTP.post(url, paramObj, callback);
}

// 撤回开票
function settlePayableRevokeInvoice(code, paramObj, callback) {
  const url = `${apiDomain}/waybill_broker_bill/${code}/revoke_invoice`;
  HTTP.post(url, paramObj, callback);
}

// 确认收款
function settlePayableReceived(code, paramObj,callback) {
  const url = `${apiDomain}/waybill_broker_bill/${code}/receive`;
  HTTP.post(url, paramObj, callback);
}

function settlePayableActualPaymentLogAdd(params, callback) {
  const url = `${apiDomain}/waybill_broker_bill/actual_payment_log/add`;
  HTTP.post(url, params, callback);
}

function settlePayableListColumn(callback) {
  let success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/platform/settleBillPayable/payable/list_render_info.json`);
      success = JSON.parse(JSON.stringify(success));
  console.log('应付平台管理列表配置为', success);
  const tempObj = {
      code: 200,
      content: []
    },
    data = success.content,
    orgType = localStorage.getItem('orgType'),
    complianceCheck = JSON.parse(localStorage.getItem('appInfo')).complianceCheck; // 合规状态
  // 如果是S账号（orgType = 1），则显示付款方字段,B（orgType = 3）/b（orgType = 2） 则不显示付款方
  if (orgType !== '1') {
    if (complianceCheck === 'FALSE') {
      data.forEach((val) => {
        // B/b 不显示付款方、合规3个字段
        if (val.fieldConfigCode !== 'payerOrgName' && val.fieldConfigCode !== 'complianceTruck' && val.fieldConfigCode !== 'nonComplianceTruck' && val.fieldConfigCode !== 'pendTruck' ) {
          tempObj.content.push(val);
        }
      });
      console.log('应付平台管理列表B/b配置为', tempObj);
      callback(tempObj);
    } else {
      data.forEach((val) => {
        // B/b 不显示付款方字段
        if (val.fieldConfigCode !== 'payerOrgName') {
          tempObj.content.push(val);
        }
      });
      console.log('应付平台管理列表B/b配置为', tempObj);
      callback(tempObj);
    }
  } else {
    if (complianceCheck === 'FALSE') {
      data.forEach((val) => {
        // S 不显示合规3个字段
        if (val.fieldConfigCode !== 'complianceTruck' && val.fieldConfigCode !== 'nonComplianceTruck' && val.fieldConfigCode !== 'pendTruck' ) {
          tempObj.content.push(val);
        }
      });
      console.log('应付平台管理列表S配置为', tempObj);
      callback(tempObj);
    } else {
      // S显示全部
      callback(success);
    }
  }

}

function settlePayableListSearch(callback) {
  let success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/platform/settleBillPayable/payable/search_render_info.json`);
      success = JSON.parse(JSON.stringify(success));
  console.log('应付平台管理列表搜索配置为', success);
  const tempObj = {
      code: 200,
      content: []
    },
    data = success.content,
    orgType = localStorage.getItem('orgType');
  // 如果是S账号（orgType = 1），则显示付款方字段,不显示B账单状态，B（orgType = 3）/b（orgType = 2） 则不显示付款方，不显示S账单状态
  if (orgType === '1') {
    data.forEach((val) => {
      if (val.fieldConfigCode !== 'billStatusB') {
        tempObj.content.push(val);
      }
    });
    console.log('应付平台管理列表S搜索配置为', tempObj);
    callback(tempObj);
  } else {
    data.forEach((val) => {
      if (val.fieldConfigCode !== 'payerOrgName' && val.fieldConfigCode !== 'billStatusS' ) {
        tempObj.content.push(val);
      }
    });
    console.log('应付平台管理列表B/b搜索配置为', tempObj);
    callback(tempObj);
  }
}


function settlePayableSelectCarrierColumn(callback) {
  callback({
    code: 200,
    content: [
      {
        showName: '承运商', elementCode: 'popSelectPartner', extraParams: '{"field1":"orgName","field2":"orgCode","field3":"orgCode"}', fieldConfigCode: 'orgName'
      },
      {
        showName: '未对账车数', elementCode: 'label', extraParams: '{"field1":"downUnsettleNum"}', fieldConfigCode: 'downUnsettleNum'
      },
      {
        showName: '最近一次对账单创建时间', elementCode: 'label', extraParams: '{"field1":"downLastSettleTime"}', fieldConfigCode: 'downLastSettleTime'
      }
    ]
  });
}

function settlePayableSelectCarrierSearch(callback) {
  callback({
    code: 200,
    content: [
      {
        showName: '客户名称', elementCode: 'text', extraParams: '{"field1":"orgName"}', fieldConfigCode: 'orgName'
      }
    ]
  });
}

function settleOrgStatisticsRefresh(code, callback) {
  const url = `${apiDomain}/waybill_broker_bill/org/${code}/statistics`;
  HTTP.post(url, {}, callback);
}

// 待选运单列表  GET /waybill_broker_bill/select_payable_waybill/list
function settlePaymentWaitSelectList(paramObj, callback) {
  const url = `${apiDomain}/waybill_broker_bill/select_payable_waybill/list`;
  HTTP.get(url, paramObj, (success, error) => {
    callback(success, error);
  });
}


// 已选运单列表  GET /waybill_broker_bill/select_selected_waybill/list
function settlePayableSelectSelectedWaybillList(params, callback) {
   const url = `${apiDomain}/waybill_broker_bill/select_selected_waybill/list`;
  HTTP.get(url, params, callback);
}

//POST /waybill_broker_bill/select_waybill 添加已选运单
function settlePayableSelectWaybill(data, callback) {
  const url = `${apiDomain}/waybill_broker_bill/select_waybill`;
  HTTP.post(url, data, callback);
}

// POST /waybill_broker_bill/clear_selected_waybill  清空全部已选运单
function settlePayableClearSelectedWaybill(params, callback) {
  const url = `${apiDomain}/waybill_broker_bill/clear_selected_waybill`;
  HTTP.post(url, params, callback);
}

// POST /waybill_broker_bill/waybill/remove 移除已选运单
function settlePayableWaybillRemove(params, callback) {
  const url = `${apiDomain}/waybill_broker_bill/waybill/remove`;
  HTTP.post(url, params, callback);
}

// POST /waybill_broker_bill/{billCode}/temp_waybill/copy  复制运单到临时表
function settlePayableTempWaybillCopy(billCode, callback) {
  const url = `${apiDomain}/waybill_broker_bill/${billCode}/temp_waybill/copy`;
  HTTP.post(url, {}, callback);
}

// GET /waybill_broker_bill/{code}/get  账单详情
function settlePayableGet(code, callback) {
  const url = `${apiDomain}/waybill_broker_bill/${code}/get`;
  HTTP.get(url, {}, (success, error) => {
    callback(success, error);
  });
}

/**
 * 应付账单运单列表导出
 * @param {*} params
 * @param {*} callback
 */
function settlePayableSelWaybillExportCsv(params, callback) {
  const apiUrl = `${apiDomain}/export/custom/settlePayableSelWaybill`;
  HTTP.postJson(apiUrl, params, (success, error) => {
    callback(success, error);
  });
}

function settlePayableStatisticalBill(params, callback) {
  const url = `${apiDomain}/waybill_broker_bill/statistical_bill`;
  HTTP.get(url, params, callback);
}


function settlePayableAdd(params, callback) {
  const url = `${apiDomain}/waybill_broker_bill/add`;
  HTTP.post(url, params, (success, error) => {
    callback(success, error);
  });
}

// GET /waybill_broker_bill/log/list  账单操作记录列表
function settlePayableApproveList(params, callback) {
  const url = `${apiDomain}/waybill_broker_bill/log/list`;
  HTTP.get(url, params, callback);
}


// POST /waybill/update_compliance_status  修改合规状态
function settlePayableWaybillupdateComplianceStatus(params, callback) {
  const url = `${apiWayBillDomain}/waybill/update_compliance_status`;
  HTTP.post(url, params, callback);
}

// POST /waybill_broker_bill/{code}/refresh 更新编辑账单车辆统计
function settlePayableWaybillRefresh(code, callback) {
  const url = `${apiDomain}/waybill_broker_bill/${code}/refresh`;
  HTTP.post(url, {}, callback);
}


// 详情 导出
function settlePayableSelWaybillExportCsvBrokerWaybill(params, callback) {
  const apiUrl = `${apiDomain}/export/custom/brokerWaybill`;
  HTTP.postJson(apiUrl, params, (success, error) => {
    callback(success, error);
  });
}
// 新建与编辑导出
function settlePayableSelWaybillExportCsvBrokerWaybillTemp(params, callback) {
  const apiUrl = `${apiDomain}/export/custom/brokerWaybillTemp`;
  HTTP.postJson(apiUrl, params, (success, error) => {
    callback(success, error);
  });
}


function getJsonProjectList(folder) {
  return null;
}

function getJsonProjectSearch(folder) {
  return null;
}

function exportCsvPlatformBrokerBill(params, callback) {
  const apiUrl = `${apiDomain}/export/custom/platformBrokerBill`; // orgtype = 1， 平台级， 不带权限的
  HTTP.postJson(apiUrl, params, (success, error) => {
    callback(success, error);
  });
}

function exportCsvBrokerBill(params, callback) {
  const apiUrl = `${apiDomain}/export/custom/brokerBill`; // 带数据权限的，orgType !== 1
  HTTP.postJson(apiUrl, params, (success, error) => {
    callback(success, error);
  });
}

function getPayableColumnRecycle(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/platform/settleBillPayable/payable/recycleList/list_render_info.json`)
  success = JSON.parse(JSON.stringify(success));
  cb(success);
}

/**
 * 删除
 * @param paramObj          参数对象
 *         partnerOrgCode    编码
 * @param callback          回调
 */
function deleted(paramObj, callback) {
  const apiUrl = `${ApiConst.apiWayBillDomain}/waybill_broker_bill/${paramObj.code}/delete`;
  HTTP.post(apiUrl, {}, (success, error) => {
    callback(success, error);
  });
}

export {
  exportCsvPlatformBrokerBill,
  exportCsvBrokerBill,
  settleReceiptRelationList,
  settleReceiptRelationAdd,
  settleReceiptRelationBillCount,
  settlePaymentRelationList,
  settlePayableActualReceiptLogGetNew,
  settlePaymentRelationAdd,
  settlePaymentRelationBillCount,
  settleActualReceiptColumns,
  settlePayableInvoice,
  settlePayableRevokeInvoice,
  settlePayableSelWaybillExportCsv,
  settlePayableAdd,
  settlePayableEdit,
  settlePayableApproveList,
  settlePayableGet,
  settlePayableSelectSelectedWaybillList,
  settlePayableSelectWaybill,
  settlePayableWaybillRemove,
  settlePayableClearSelectedWaybill,
  settlePayableSelectCarrierColumn,
  settlePayableSelectCarrierSearch,
  settlePayableSelectCarrierList,
  settlePayableSelectContractWaybillList,
  settlePayableWaybillColumns,
  settlePayableWaybillSearch,
  settlePayableSelectedWaybillColumns,
  settlePayableSelectedWaybillSearch,
  settlePayableStatisticalBill,
  settleActualPaymentColumns,
  settlePayableWaybillAdjustQuota,
  settlePayableWaybillAdjustRatio,
  settlePayableWaybillAdjustSettleMethod,
  settlePayableWaybillAdjustTaxRates,
  settlePayableWaybillAdjustTaxType,
  settlePayableWaybillEditDescription,
  settlePayableTempTableDelete,
  settlePayableActualPaymentLogExportCsv,
  settlePayableActualPaymentLogDownloadErrorData,
  settlePayableActualPaymentLogDownloadTemplate,
  settlePayableActualPaymentLogListColumn,
  settlePayableActualPaymentLogListSearch,
  settlePayableActualPaymentLogAdd,
  settlePayableActualPaymentLogList,
  settlePayableActualPaymentLogDelete,
  settlePayableActualPaymentLogConfirm,
  settlePayableActualPaymentLogEdit,
  settlePayableActualPaymentLogGet,
  settlePayableTempWaybillCopy,
  settlePayableListSearch,
  settlePayableListColumn,
  settlePayableList,
  settlePayableAllList,
  settlePayableApplyApprove,
  settlePayableRevokeApplyApprove,
  settlePayableApprove,
  settlePayableRevokeApprove,
  settlePayableCancel,
  settlePayableReceived,
  settleOrgStatisticsRefresh,

  settlePaymentWaitSelectList,
  settlePayableRelationWaybillList,
  settlePayableWaybillupdateComplianceStatus,
  settlePayableWaybillRefresh,
  settlePayableSelWaybillExportCsvBrokerWaybillTemp,
  settlePayableSelWaybillExportCsvBrokerWaybill,
  getPayableColumnRecycle,
  deleted
};
