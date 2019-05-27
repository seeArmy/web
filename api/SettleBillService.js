/**
 *
 */
import * as HTTP from './httpUtil';
import { checkFileExist, filterwaybillStatus } from './Utils';
const axios = require('axios');
var ApiConst= require('./ApiConst');
const apiDomain = ApiConst.apiSettleDomain;


/**
 * 收款详情和应收账单详情中的应收列表
 * @param {*} paramObj
 *  @params.receiptCode 收款详情，传入收款记录code
 *  @params.billCode    应收账单详情，传入账单编码
 * @param {*} callback
 */
function settleReceiptRelationList(paramObj, callback) {
  const url = `${apiDomain}/settle/settle_bill_receipt_relation/list`;
  HTTP.get(url, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 根据流水号查询收款记录
 * @param {*} paramObj
 *  @params.serialNumber 付款资金流水号
 * @param {*} callback
 */
function settleReceivableActualReceiptLogGetNew(paramObj, callback) {
  const url = `${apiDomain}/settle/receivable/actual_receipt_log/get`;
  HTTP.get(url, paramObj, (success, error) => {
    callback(success, error);
  });
}


/**
 * 新增账单实收记录关系表
 * @param {*} paramObj
 * @param {*} callback
 */
function settleReceiptRelationAdd(paramObj, callback) {
  const url = `${apiDomain}/settle/settle_bill_receipt_relation/add`;
  HTTP.post(url, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 账单实付记录关系表统计
 * @param {*} paramObj
 * @param {*} callback
 */
function settleReceiptRelationBillCount(paramObj, callback) {
  const url = `${apiDomain}/settle/settle_bill_receipt_relation/bill/count`;
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
  const url = `${apiDomain}/settle/settle_bill_payment_relation/list`;
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
  const url = `${apiDomain}/settle/payable/actual_payment_log/get`;
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
  const url = `${apiDomain}/settle/settle_bill_payment_relation/add`;
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
  const url = `${apiDomain}/settle/settle_bill_payment_relation/bill/count`;
  HTTP.get(url, paramObj, (success, error) => {
    callback(success, error);
  });
}


/**
 *
 * @param {*} paramObj
 * @param {*} callback
 */
function settleReceivableAdd(paramObj, callback) {
  const url = `${apiDomain}/settle/receivable/add`;
  HTTP.post(url, paramObj, (success, error) => {
    callback(success, error);
  });
}
/**
 * 编辑应收账单
 * @param {*} paramObj
 * @param {*} callback
 */
function settleReceivableEdit(code, paramObj, callback) {
  const url = `${apiDomain}/settle/receivable/${code}/edit`;
  HTTP.post(url, paramObj, (success, error) => {
    callback(success, error);
  });
}
/**
 * 应收账单审核记录列表
 * @param {*} data
 * @param {*} callback
 */
function settleReceivableApproveList(data, callback) {
  const url = `${apiDomain}/settle/receivable/approve/list`;
  HTTP.get(url, data, callback);
}
/**
 * 应收账单详情
 * @param {*} code
 * @param {*} callback
 */
function settleReceivableGet(code, callback) {
  const url = `${apiDomain}/settle/receivable/${code}/get`;
  HTTP.get(url, {}, (success, error) => {
    callback(success, error);
  });
}
/**
 * 获取未选运单
 * @param {*} clientOrgName
 * @param {*} filter
 * @param {*} pagination
 * @param {*} callback
 */
function settleReceivableSelectReceivableWaybillList(params, callback) {
  const url = `${apiDomain}/settle/receivable/select_receivable_waybill/list`;
  HTTP.get(url, params, (success, error) => {
    callback(success, error);
  });
}
/**
 * 获取已选运单
 * @param {*} clientOrgName
 * @param {*} filter
 * @param {*} pagination
 * @param {*} callback
 */
function settleReceivableSelectSelectedWaybillList(params, callback) {
  const url = `${apiDomain}/settle/receivable/select_selected_waybill/list`;
  HTTP.get(url, params, (success, error) => {
    callback(success, error);
  });
}
/**
 * 将所选添加到已选运单
 * @param {*} data
 * @param {*} callback
 */
function settleReceivableSelectWaybill(data, callback) {
  // const url = `${apiDomain}/settle/receivable/select_waybill`; // 标准版，计算亏吨扣款
  const url = `${apiDomain}/settle/receivable/select_waybill_lossDeduction`; // 多货物模式新接口
  HTTP.post(url, data, callback);
}

function settleReceivableSelectContractWaybillList(params, callback) {
  const url = `${apiDomain}/settle/receivable/select_contrast_waybill/list`;
  HTTP.get(url, params, callback);
}

/**
 * 应收账单运单列表导出
 * @param {*} params
 *  @param.page {*}  requied
 *  @param.size {*}  requied
 *
 *  @param.clientOrgName {*}  add required
 *  @param.tableType {contrast} view required
 *  @param.billCode {*}  edit or view required
 * @param {*} callback
 */
function settleReceivableSelWaybillExportCsv(params, callback) {
  const apiUrl = `${apiDomain}/export/custom/receivableSelWaybill`;
  HTTP.postJson(apiUrl, params, (success, error) => {
    callback(success, error);
  });
}
/**
 * 应付账单运单列表导出
 * @param {*} params
 * @param {*} callback
 */
function settlePayableSelWaybillExportCsv(params, callback) {
  const apiUrl = `${apiDomain}/export/custom/payableSelWaybill`;
  HTTP.postJson(apiUrl, params, (success, error) => {
    callback(success, error);
  });
}

/**
 * 发送应收账单
 * @param {*} data
 * @param {*} callback
 */
function settleReceivableSendBill(code, callback) {
  const url = `${apiDomain}/settle/receivable/${code}/send`;
  HTTP.post(url, {}, callback);
}

/**
 * 将所选已选运单到未选
 * @param {*} data
 * @param {*} callback
 */
function settleReceivableWaybillRemove(params, callback) {
  const url = `${apiDomain}/settle/receivable/waybill/remove`;
  HTTP.post(url, params, callback);
}
/**
 * 将所有已选运单到未选
 * @param {Function} callback
 */
function settleReceivableClearSelectedWaybill(params, callback) {
  const url = `${apiDomain}/settle/receivable/clear_selected_waybill`;
  HTTP.post(url, params, callback);
}

/**
 * 获取客户对账列表
 * @param params
 * @param callback
 */
function settleReceivableSelectClientList(params, callback) {
  const url = `${apiDomain}/settle/receivable/select_client/list`;
  HTTP.get(url, params, (success, error) => {
    callback(success, error);
  });
}

/**
 *
 * @param {*} callback
 */
function settleReceivableWaybillColumns(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/settle/receivableWaybill/list_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
 let sub = getJsonProjectList('settle/receivableWaybill')
 if(sub){
 callback(filterwaybillStatus(sub));
 }else{
      callback(filterwaybillStatus(success));
 }
}

/**
 *
 * @param {*} callback
 */
function settleReceivableWaybillSearch(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/settle/receivableWaybill/search_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
 let sub = getJsonProjectSearch('settle/receivableWaybill')
 if(sub){
 callback(filterwaybillStatus(sub));
 }else{
      callback(filterwaybillStatus(success));
 }
}

/**
 *
 * @param {*} callback
 */
function settleReceivableSelectedWaybillColumns(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/settle/receivableSelWaybill/list_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    callback(filterwaybillStatus(success));
}

/**
 *
 * @param {*} callback
 */
function settleReceivableSelectedWaybillSearch(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/settle/receivableSelWaybill/search_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    callback(filterwaybillStatus(success));
}

/**
 * 应收账单统计信息
 * @param {*} clientOrgName
 * @param {*} callback
 */
function settleReceivableStatisticalBill(data, callback) {
  const url = `${apiDomain}/settle/receivable/statistical_bill`;
  HTTP.get(url, data, callback);
}

/**
 *
 * @param {*} callback
 */
function settleActualReceiptColumns(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/settle/actualReceipt/list_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
  callback(filterwaybillStatus(success));
}
/**
 * 调整每单定额
 * @param {*} data
 * @param {*} callback
 */
function settleReceivableWaybillAdjustQuota(data, callback) {
  const url = `${apiDomain}/settle/receivable/waybill/adjust_quota`;
  HTTP.post(url, data, callback);
}
/**
 * 调整每单比例
 * @param {*} data
 * @param {*} callback
 */
function settleReceivableWaybillAdjustRatio(data, callback) {
  const url = `${apiDomain}/settle/receivable/waybill/adjust_proportion`;
  HTTP.post(url, data, callback);
}
/**
 * 调整结算方式
 * @param {*} data
 * @param {*} callback
 */
function settleReceivableWaybillAdjustSettleMethod(data, callback) {
  const url = `${apiDomain}/settle/receivable/waybill/adjust_settle_method`;
  HTTP.post(url, data, callback);
}
/**
 * 调整客户税率
 * @param {*} data
 * @param {*} callback
 */
function settleReceivableWaybillAdjustTaxRates(data, callback) {
  const url = `${apiDomain}/settle/receivable/waybill/adjust_tax_rate`;
  HTTP.post(url, data, callback);
}

/**
 * 调整货物单价
 * @param {*} data
 * @param {*} callback
 */
function settleReceivableWaybillAdjustGoodsPrice(data, callback) {
  const url = `${apiDomain}/settle/receivable/waybill/adjust_goods_price`;
  HTTP.post(url, data, callback);
}
/**
 * 调整运价税型
 * @param {*} data
 * @param {*} callback
 */
function settleReceivableWaybillAdjustTaxType(data, callback) {
  const url = `${apiDomain}/settle/receivable/waybill/adjust_tax_type`;
  HTTP.post(url, data, callback);
}
function settleReceivableWaybillEditDescription(params, callback) {
  const url = `${apiDomain}/settle/receivable/waybill/${params.code}/edit_description`;
  HTTP.post(url, { description: params.description, clientOrgName: params.clientOrgName, billCode: params.billCode }, callback);
}
/**
 * 删除过期临时表
 * @param {*} data
 * @param {*} callback
 */
function settleReceivableTempTableDelete(data, callback) {
  const url = `${apiDomain}/settle/receivable/temp_table/delete`;
  HTTP.post(url, data, callback);
}
/**
 * 导出收款记录
 * @param paramObj
 * @param callback
 */
function settleReceivableActualReceiptLogExportCsv(paramObj, callback) {
  const apiUrl = `${apiDomain}/export/custom/actualReceipt`;
  HTTP.postJson(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}
/**
 * 下载错误数据的CSV文件
 */
function settleReceivableActualReceiptLogDownloadErrorData(paramObj, callback) {
  const apiUrl = `${apiDomain}/generator/actualReceipt`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}
/**
 * 下载CSV模板
 */
function settleReceivableActualReceiptLogDownloadTemplate(paramObj, callback) {
  const apiUrl = `${apiDomain}/download/template/actualReceipt`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}
/**
 * 获取列表渲染配置
 * @param callback
 */
function settleReceivableActualReceiptLogListColumn(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/settle/actualReceipt/list_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    callback(filterwaybillStatus(success));
}
/**
 * 获取检索条件渲染配置
 * @param callback
 */
function settleReceivableActualReceiptLogListSearch(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/settle/actualReceipt/search_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    callback(filterwaybillStatus(success));
}
/**
 * 收款记录列表
 * @param {*} data
 * @param {*} callback
 */
function settleReceivableActualReceiptLogList(data, callback) {
  const url = `${apiDomain}/settle/receivable/actual_receipt_log/list`;
  HTTP.get(url, data, callback);
}
/**
 * 删除收款记录
 * @param code
 * @param callback
 */
function settleReceivableActualReceiptLogDelete(code, paramObj, callback) {
  const url = `${apiDomain}/settle/receivable/actual_receipt_log/${code}/delete`;
  HTTP.post(url, paramObj, (res, error) => {
    callback(res, error);
  });
}
/**
 * 确认收款记录
 * @param code
 * @param callback
 */
function settleReceivableActualReceiptLogConfirm(code, paramObj, callback) {
  const url = `${apiDomain}/settle/receivable/actual_receipt_log/${code}/confirm`;
  HTTP.post(url, paramObj, (res, error) => {
    callback(res, error);
  });
}
/**
 * 编辑收款记录
 * @param {*} code
 * @param {*} data
 * @param {*} callback
 */
function settleReceivableActualReceiptLogEdit(code, data, callback) {
  const url = `${apiDomain}/settle/receivable/actual_receipt_log/${code}/edit`;
  HTTP.post(url, data, callback);
}

/**
 * 收款记录详情
 * @param {*} code
 * @param {*} callback
 */
function settleReceivableActualReceiptLogGet(paramObj, callback) {
  const url = `${apiDomain}/settle/receivable/actual_receipt_log/${paramObj.code}/get`;
  HTTP.get(url, {}, callback);
}

/**
 * 复制结算运单到临时表
 * @param {*} billCode
 * @param {*} callback
 */
function settleReceivableTempWaybillCopy(billCode, callback) {
  const url = `${apiDomain}/settle/receivable/${billCode}/temp_waybill/copy`;
  HTTP.post(url, {}, callback);
}

/**
 * 应收账单列表
 * @param params
 * @param callback
 */
function settleReceivableList(params, callback) {
  const url = `${apiDomain}/settle/receivable/list`;
  HTTP.get(url, params, callback);
}

/**
 * 待审核应收账单提交审核
 * @param {*} code
 * @param {*} callback
 */
function settleReceivableApplyApprove(code, callback) {
  const url = `${apiDomain}/settle/receivable/${code}/apply_approve`;
  HTTP.post(url, {}, callback);
}

/**
 * 撤回提交审核应收账单
 * @param {*} code
 * @param {*} callback
 */
function settleReceivableRevokeApplyApprove(code, callback) {
  const url = `${apiDomain}/settle/receivable/${code}/revoke_apply_approve`;
  HTTP.post(url, {}, callback);
}

/**
 * 审核待审核应收帐单
 * @param {*} code
 * @param {*} params
 * @param {*} callback
 */
function settleReceivableApprove(code, params, callback) {
  const url = `${apiDomain}/settle/receivable/${code}/approve`;
  HTTP.post(url, params, callback);
}

/**
 * 审核待审核应收帐单
 * @param {*} code
 * @param {*} callback
 */
function settleReceivableRevokeApprove(code, callback) {
  const url = `${apiDomain}/settle/receivable/${code}/revoke_approve`;
  HTTP.post(url, {}, callback);
}

/**
 * 作废应收账单
 * @param {*} code
 * @param {*} callback
 */
function settleReceivableCancel(code, callback) {
  const url = `${apiDomain}/settle/receivable/${code}/cancel`;
  HTTP.post(url, {}, callback);
}

/**
 * 记录开票
 * @param {*} code
 * @param {*} callback
 */
function settleReceivableInvoice(code, callback) {
  const url = `${apiDomain}/settle/receivable/${code}/invoice`;
  HTTP.post(url, {}, callback);
}
/**
 * 记录收票
 * @param {*} code
 * @param {*} callback
 */
function settlePayableInvoice(code, callback) {
  const url = `${apiDomain}/settle/payable/${code}/received_invoice`;
  HTTP.post(url, {}, callback);
}

/**
 * 记录开票
 * @param {*} code
 * @param {*} callback
 */
function settleReceivableActualReceiptLogAdd(params, callback) {
  const url = `${apiDomain}/settle/receivable/actual_receipt_log/add`;
  HTTP.post(url, params, callback);
}

/**
 * 获取应收账单列表展示列
 * @param {*} callback
 */
function settleReceivableListColumn(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/settle/receivable/list_render_info.json`);
    success = JSON.parse(JSON.stringify(success));
  callback(filterwaybillStatus(success));
}

function settleReceivableListSearch(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/settle/receivable/search_render_info.json`);
    success = JSON.parse(JSON.stringify(success));
  callback(filterwaybillStatus(success));
}

function settleReceivableSelectClientColumn(callback) {
  callback({
    code: 200,
    content: [
      {
        showName: '客户', elementCode: 'popSelectPartner', extraParams: '{"field1":"orgName","field2":"orgCode","field3":"orgCode"}', fieldConfigCode: 'orgName'
      },
      {
        showName: '未对账车数', elementCode: 'label', extraParams: '{"field1":"upUnsettleNum"}', fieldConfigCode: 'upUnsettleNum'
      },
      {
        showName: '最近一次对账单创建时间', elementCode: 'label', extraParams: '{"field1":"upLastSettleTime"}', fieldConfigCode: 'upLastSettleTime'
      }
    ]
  });
}

function settleReceivableSelectClientSearch(callback) {
  callback({
    code: 200,
    content: [
      {
        showName: '客户名称', elementCode: 'text', extraParams: '{"field1":"orgName"}', fieldConfigCode: 'orgName'
      }
    ]
  });
}

function settlePayableAdd(params, callback) {
  const url = `${apiDomain}/settle/payable/add`;
  HTTP.post(url, params, (success, error) => {
    callback(success, error);
  });
}

function settlePayableEdit(code, params, callback) {
  const url = `${apiDomain}/settle/payable/${code}/edit`;
  HTTP.post(url, params, (success, error) => {
    callback(success, error);
  });
}

function settlePayableApproveList(params, callback) {
  const url = `${apiDomain}/settle/payable/approve/list`;
  HTTP.get(url, params, callback);
}

function settlePayableGet(code, callback) {
  const url = `${apiDomain}/settle/payable/${code}/get`;
  HTTP.get(url, {}, (success, error) => {
    callback(success, error);
  });
}

function settlePayableSelectPayableWaybillList(params, callback) {
  const url = `${apiDomain}/settle/payable/select_payable_waybill/list`;
  HTTP.get(url, params, (success, error) => {
    callback(success, error);
  });
}

function settlePayableSelectSelectedWaybillList(params, callback) {
  const url = `${apiDomain}/settle/payable/select_selected_waybill/list`;
  HTTP.get(url, params, callback);
}

function settlePayableSelectWaybill(data, callback) {
  const url = `${apiDomain}/settle/payable/select_waybill`;
  HTTP.post(url, data, callback);
}

function settlePayableSelectContractWaybillList(params, callback) {
  const url = `${apiDomain}/settle/payable/select_contrast_waybill/list`;
  HTTP.get(url, params, callback);
}

function settlePayableWaybillRemove(params, callback) {
  const url = `${apiDomain}/settle/payable/waybill/remove`;
  HTTP.post(url, params, callback);
}

function settlePayableClearSelectedWaybill(params, callback) {
  const url = `${apiDomain}/settle/payable/clear_selected_waybill`;
  HTTP.post(url, params, callback);
}

function settlePayableSelectCarrierList(params, callback) {
  const url = `${apiDomain}/settle/payable/select_carrier/list`;
  HTTP.get(url, params, (success, error) => {
    callback(success, error);
  });
}

function settlePayableWaybillColumns(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/settle/payableWaybill/list_render_info.json`)
 success = JSON.parse(JSON.stringify(success));

 let sub = getJsonProjectList('settle/payableWaybill')
 if(sub){
 callback(filterwaybillStatus(sub));
 }else{
      callback(filterwaybillStatus(success));
 }
}

function settlePayableWaybillSearch(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/settle/payableWaybill/search_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
 let sub = getJsonProjectSearch('settle/payableWaybill')
 if(sub){
 callback(filterwaybillStatus(sub));
 }else{
      callback(filterwaybillStatus(success));
 }
}

function settlePayableSelectedWaybillColumns(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/settle/payableSelWaybill/list_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    callback(filterwaybillStatus(success));
}

function settlePayableSelectedWaybillSearch(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/settle/payableSelWaybill/search_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    callback(filterwaybillStatus(success));
}

function settlePayableStatisticalBill(params, callback) {
  const url = `${apiDomain}/settle/payable/statistical_bill`;
  HTTP.get(url, params, callback);
}

function settleActualPaymentColumns(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/settle/actualPayment/list_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
  callback(filterwaybillStatus(success));
}

function settlePayableWaybillAdjustQuota(params, callback) {
  const url = `${apiDomain}/settle/payable/waybill/adjust_quota`;
  HTTP.post(url, params, callback);
}

function settlePayableWaybillAdjustRatio(params, callback) {
  const url = `${apiDomain}/settle/payable/waybill/adjust_proportion`;
  HTTP.post(url, params, callback);
}

function settlePayableWaybillAdjustSettleMethod(params, callback) {
  const url = `${apiDomain}/settle/payable/waybill/adjust_settle_method`;
  HTTP.post(url, params, callback);
}

function settlePayableWaybillAdjustTaxRates(params, callback) {
  const url = `${apiDomain}/settle/payable/waybill/adjust_tax_rate`;
  HTTP.post(url, params, callback);
}

function settlePayableWaybillAdjustTaxType(params, callback) {
  const url = `${apiDomain}/settle/payable/waybill/adjust_tax_type`;
  HTTP.post(url, params, callback);
}

function settlePayableWaybillEditDescription(params, callback) {
  const url = `${apiDomain}/settle/payable/waybill/${params.code}/edit_description`;
  HTTP.post(url, { description: params.description, carrierOrgName: params.carrierOrgName, billCode: params.billCode }, callback);
}

function settlePayableTempTableDelete(params, callback) {
  const url = `${apiDomain}/settle/payable/temp_table/delete`;
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
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/settle/actualPayment/list_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    callback(filterwaybillStatus(success));
}

function settlePayableActualPaymentLogListSearch(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/settle/actualPayment/search_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    callback(filterwaybillStatus(success));
}

function settlePayableActualPaymentLogList(data, callback) {
  const url = `${apiDomain}/settle/payable/actual_payment_log/list`;
  HTTP.get(url, data, callback);
}

function settlePayableActualPaymentLogDelete(code, paramObj, callback) {
  const url = `${apiDomain}/settle/payable/actual_payment_log/${code}/delete`;
  HTTP.post(url, paramObj, (res, error) => {
    callback(res, error);
  });
}

function settlePayableActualPaymentLogConfirm(code, paramObj, callback) {
  const url = `${apiDomain}/settle/payable/actual_payment_log/${code}/confirm`;
  HTTP.post(url, paramObj, (res, error) => {
    callback(res, error);
  });
}

function settlePayableActualPaymentLogEdit(code, data, callback) {
  const url = `${apiDomain}/settle/payable/actual_payment_log/${code}/edit`;
  HTTP.post(url, data, callback);
}

function settlePayableActualPaymentLogGet(paramObj, callback) {
  const url = `${apiDomain}/settle/payable/actual_payment_log/${paramObj.code}/get`;
  HTTP.get(url, {}, callback);
}

function settlePayableTempWaybillCopy(billCode, callback) {
  const url = `${apiDomain}/settle/payable/${billCode}/temp_waybill/copy`;
  HTTP.post(url, {}, callback);
}

function settlePayableList(params, callback) {
  const url = `${apiDomain}/settle/payable/list`;
  HTTP.get(url, params, callback);
}

function settlePayableApplyApprove(code, callback) {
  const url = `${apiDomain}/settle/payable/${code}/apply_approve`;
  HTTP.post(url, {}, callback);
}

function settlePayableRevokeApplyApprove(code, callback) {
  const url = `${apiDomain}/settle/payable/${code}/revoke_apply_approve`;
  HTTP.post(url, {}, callback);
}

function settlePayableApprove(code, params, callback) {
  const url = `${apiDomain}/settle/payable/${code}/approve`;
  HTTP.post(url, params, callback);
}

function settlePayableRevokeApprove(code, callback) {
  const url = `${apiDomain}/settle/payable/${code}/revoke_approve`;
  HTTP.post(url, {}, callback);
}

function settlePayableCancel(code, callback) {
  const url = `${apiDomain}/settle/payable/${code}/cancel`;
  HTTP.post(url, {}, callback);
}

function settlePayableReceivedInvoice(code, callback) {
  const url = `${apiDomain}/settle/payable/${code}/received_invoice`;
  HTTP.post(url, {}, callback);
}

function settlePayableActualPaymentLogAdd(params, callback) {
  const url = `${apiDomain}/settle/payable/actual_payment_log/add`;
  HTTP.post(url, params, callback);
}

function settlePayableListColumn(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/settle/payable/list_render_info.json`);
    success = JSON.parse(JSON.stringify(success));
  callback(filterwaybillStatus(success));
}

function settlePayableListSearch(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/settle/payable/search_render_info.json`);
    success = JSON.parse(JSON.stringify(success));
  callback(filterwaybillStatus(success));
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
        showName: '客户名称', elementCode: 'text', extraParams: '{"field1":"orgFullName"}', fieldConfigCode: 'orgFullName'
      }
    ]
  });
}

function settleOrgStatisticsRefresh(code, callback) {
  const url = `${apiDomain}/settle/org/${code}/statistics`;
  HTTP.post(url, {}, callback);
}


// 平台对账 start ====

function getColumnReconciliation(callback) {
  callback({
    code: 200,
    content: [
      {
        showName: '客户', elementCode: 'popSelectPartner', extraParams: '{"field1":"orgFullName","field2":"orgCode","field3":"orgCode"}', fieldConfigCode: 'orgFullName'
      }
    ]
  });
}

function getSearchReconciliation(callback) {
  callback({
    code: 200,
    content: [
      {
        showName: '客户名称', elementCode: 'text', extraParams: '{"field1":"orgFullName"}', fieldConfigCode: 'orgFullName'
      }
    ]
  });
}
 //平台对账 list
function getListReconciliation(params, callback) {
  const url = `${ApiConst.apiOrgDomain}/partner/list/withSelf`;
  HTTP.get(url, params, (success, error) => {
    callback(success, error);
  });
}

// 平台对账 end ====
// 
function getJsonProjectList(folder) {
  return null;
}

function getJsonProjectSearch(folder) {
return null;
}


/**
 * export
 * @param callback
 */
function exportCsv(paramObj, callback) {
  const apiUrl = `${apiDomain}/export/custom/settle`;
  HTTP.postJson(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}


function getRecievableColumnRecycle(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/settle/receivable/recycle/list_render_info.json`)
  success = JSON.parse(JSON.stringify(success));
  cb(filterwaybillStatus(success));
}

function getPayableColumnRecycle(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/settle/payable/recycle/list_render_info.json`)
  success = JSON.parse(JSON.stringify(success));
  cb(filterwaybillStatus(success));
}



export {
  settleReceivableWaybillAdjustGoodsPrice,
  getColumnReconciliation,
  getSearchReconciliation,
  getListReconciliation,
  exportCsv,
  settleReceiptRelationList,
  settleReceivableActualReceiptLogGetNew,
  settleReceiptRelationAdd,
  settleReceiptRelationBillCount,
  settlePaymentRelationList,
  settlePayableActualReceiptLogGetNew,
  settlePaymentRelationAdd,
  settlePaymentRelationBillCount,
  settleReceivableAdd,
  settleReceivableEdit,
  settleReceivableApproveList,
  settleReceivableGet,
  settleReceivableSelectReceivableWaybillList,
  settleReceivableSelectSelectedWaybillList,
  settleReceivableSelectWaybill,
  settleReceivableWaybillRemove,
  settleReceivableClearSelectedWaybill,
  settleReceivableSelectClientColumn,
  settleReceivableSelectClientSearch,
  settleReceivableSelectClientList,
  settleReceivableSelectContractWaybillList,
  settleReceivableWaybillColumns,
  settleReceivableWaybillSearch,
  settleReceivableSelectedWaybillColumns,
  settleReceivableSelectedWaybillSearch,
  settleReceivableStatisticalBill,
  settleActualReceiptColumns,
  settleReceivableWaybillAdjustQuota,
  settleReceivableWaybillAdjustRatio,
  settleReceivableWaybillAdjustSettleMethod,
  settleReceivableWaybillAdjustTaxRates,
  settleReceivableWaybillAdjustTaxType,
  settleReceivableWaybillEditDescription,
  settleReceivableTempTableDelete,
  settleReceivableActualReceiptLogExportCsv,
  settleReceivableActualReceiptLogDownloadErrorData,
  settleReceivableActualReceiptLogDownloadTemplate,
  settleReceivableActualReceiptLogListColumn,
  settleReceivableActualReceiptLogListSearch,
  settleReceivableActualReceiptLogAdd,
  settleReceivableActualReceiptLogList,
  settleReceivableActualReceiptLogDelete,
  settleReceivableActualReceiptLogConfirm,
  settleReceivableActualReceiptLogEdit,
  settleReceivableActualReceiptLogGet,
  settleReceivableTempWaybillCopy,
  settleReceivableListSearch,
  settleReceivableListColumn,
  settleReceivableList,
  settleReceivableApplyApprove,
  settleReceivableRevokeApplyApprove,
  settleReceivableApprove,
  settleReceivableRevokeApprove,
  settleReceivableCancel,
  settleReceivableInvoice,
  settlePayableInvoice,
  settleReceivableSelWaybillExportCsv,
  settleReceivableSendBill,
  settlePayableSelWaybillExportCsv,
  settlePayableAdd,
  settlePayableEdit,
  settlePayableApproveList,
  settlePayableGet,
  settlePayableSelectPayableWaybillList,
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
  settlePayableApplyApprove,
  settlePayableRevokeApplyApprove,
  settlePayableApprove,
  settlePayableRevokeApprove,
  settlePayableCancel,
  settlePayableReceivedInvoice,
  settleOrgStatisticsRefresh,
  getRecievableColumnRecycle,
  getPayableColumnRecycle
};
