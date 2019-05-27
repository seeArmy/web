import * as HTTP from './httpUtil';
var ApiConst = require('./ApiConst');
const axios = require('axios'),
  baseDomain = ApiConst.BaseDomain,
  apiWayBillDomain = ApiConst.apiWayBillDomain;

axios.defaults.withCredentials = true;

import { checkFileExist } from './Utils';

function get(moduleName, businessObjectName, code, callback) {
  const apiUrl = `${baseDomain}/${moduleName}/${businessObjectName}/print_document/${code}/get`;
  HTTP.get(apiUrl, {}, (response, err) => {
    callback(response, err);
  });
}

function add(moduleName, businessObjectName, template, callback) {
  const apiUrl = `${baseDomain}/${moduleName}/${businessObjectName}/print_document/add`;
  HTTP.post(apiUrl, template, (response, err) => {
    callback(response, err);
  });
}

function edit(moduleName, businessObjectName, code, template, callback) {
  const apiUrl = `${baseDomain}/${moduleName}/${businessObjectName}/print_document/${code}/edit`;
  HTTP.post(apiUrl, template, (response, err) => {
    callback(response, err);
  });
}

function remove(moduleName, businessObjectName, code, callback) {
  const apiUrl = `${baseDomain}/${moduleName}/${businessObjectName}/print_document/${code}/delete`;
  HTTP.post(apiUrl, {}, (response, err) => {
    callback(response, err);
  });
}

function list(moduleName, businessObjectName, queryParams, callback) {
  const apiUrl = `${baseDomain}/${moduleName}/${businessObjectName}/print_document/list`;
  HTTP.get(apiUrl, queryParams, (response, err) => {
    callback(response, err);
  });
}

function getBusinessObjectDetailRenderList(moduleName, businessObjectName, callback) {
  /*const apiUrl = `${baseDomain}/${moduleName}/detail_render_info/${businessObjectName}/list`;
  HTTP.get(apiUrl, {}, (response, err) => {
    callback(response, err);
  });*/
  var success = require('./fieldMetadata/'+ApiConst.fieldMetadataDir+'/'+moduleName+'/'+businessObjectName+'/detail_render_info.json');

 success = JSON.parse(JSON.stringify(success));
  callback(success,null);
}

function getBusinessObject(paramObj,moduleName, type, code, callback) {
  // const apiUrl = `${baseDomain}/${moduleName}/export/${type}/code/${code}`;
  // HTTP.get(apiUrl, {}, (response, err) => {
  //   callback(response, err);
  // });


    const apiUrl = `${baseDomain}/${moduleName}/export/${type}/code/${code}`;
  HTTP.postJson(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

function getResource(moduleName, resourceCode, callback) {
  const apiUrl = `${baseDomain}/${moduleName}/fw/image/${resourceCode}/get`;
  HTTP.get(apiUrl, {}, (response, err) => {
    callback(response, err);
  });
}

function getUploadUrl(moduleName) {
  // return `${baseDomain}/${moduleName}/fw/image/update`; //在ele-file-uploader 里面直接在后面统一加了 fw/image/update
   return `${baseDomain}/${moduleName}`;
}

function getColumn(callback) {
  const columnsData = [
    {
      showName: '模板名称',
      fieldConfigCode: 'templateName',
      elementCode: 'label',
      extraParams: '{"field1":"name","required":"true","detailLinkVisiable":"true","maxLength1":"50","placeholder1":"请输入模板名称"}'
    },
    {
      showName: '操作人',
      fieldConfigCode: 'updateUsername',
      elementCode: 'label',
      extraParams: '{"field1":"updateUsername","required":"false","detailLinkVisiable":"false"}'
    },
    {
      showName: '调整时间',
      fieldConfigCode: 'updateTime',
      elementCode: 'label',
      extraParams: '{"field1":"updateTime","format1":"yyyy-MM-dd HH:mm:ss","required":"false","detailLinkVisiable":"false"}'
    }
  ];
  callback({ content: columnsData });
}
// function updatePrintStatus(paramsObj, callback) {
//   const apiUrl = `${baseDomain}/waybill/execute/${paramsObj.code}/waybillUpdatePrintStatus`;
//   HTTP.post(apiUrl, paramsObj, (response, err) => {
//     callback(response, err);
//   });
// }
// 跟新状态  打印小票
function updatePrintStatus(paramsObj,code, callback) {
  const apiUrl = `${baseDomain}/waybill/waybill/${code}/execute/waybillUpdatePrintStatus`;
  HTTP.post(apiUrl, paramsObj, (response, err) => {
    callback(response, err);
  });
}

// 跟新状态  派车单
function updatePrintStatusPrintDispatchBill(paramsObj,code, callback) {
  const apiUrl = `${baseDomain}/waybill/waybill/${code}/execute/printDispatchBill`;
  HTTP.post(apiUrl, paramsObj, (response, err) => {
    callback(response, err);
  });
}

// 更新连云港小票信息
function updateWaybillSmallTicket(paramsObj, callback){
  const apiUrl = `${apiWayBillDomain}/waybill/${paramsObj.code}/execute/waybillUpdateExternalNo`;
  HTTP.post(apiUrl, paramsObj, (response, err) => {
    callback(response, err);
  });
}

function getSearch(callback) {
  const columnsData = [
    {
      showName: '模板名称',
      fieldConfigCode: 'templateName',
      elementCode: 'text',
      extraParams: '{"field1":"name","required":"true","detailLinkVisiable":"true","maxLength1":"50","placeholder1":"请输入模板名称"}'
    }
  ];
  callback({ content: columnsData });
}

// 大小b 的 API start  ====================
function listDocumentRelation(moduleName, businessObjectName, queryParams, callback) {
  const apiUrl = `${baseDomain}/${moduleName}/${businessObjectName}/waybill_print_document_relation/list`;
  HTTP.get(apiUrl, queryParams, (response, err) => {
    callback(response, err);
  });
}

function removeDocumentRelation(moduleName, businessObjectName, code, callback) {
  const apiUrl = `${baseDomain}/${moduleName}/${businessObjectName}/waybill_print_document_relation/${code}/delete`;
  HTTP.post(apiUrl, {}, (response, err) => {
    callback(response, err);
  });
}

function addDocumentRelation(moduleName, businessObjectName, template, callback) {
  const apiUrl = `${baseDomain}/${moduleName}/${businessObjectName}/waybill_print_document_relation/add`;
  HTTP.post(apiUrl, template, (response, err) => {
    callback(response, err);
  });
}

function getDocumentRelation(moduleName, businessObjectName, code, callback) {
  const apiUrl = `${baseDomain}/${moduleName}/${businessObjectName}/waybill_print_document_relation/${code}/get`;
  HTTP.get(apiUrl, {}, (response, err) => {
    callback(response, err);
  });
}
// 大小b 的 API end  ====================
// 
// detail_render_info.json
function getDetail(moduleName, businessObjectName, callback) {
  /*const apiUrl = `${baseDomain}/${moduleName}/detail_render_info/${businessObjectName}/list`;
  HTTP.get(apiUrl, {}, (response, err) => {
    callback(response, err);
  });*/
  var success = require('./fieldMetadata/'+ApiConst.fieldMetadataDir+'/'+moduleName+'/'+businessObjectName+'/detail_render_info.json');


 success = JSON.parse(JSON.stringify(success));
  callback(success,null);
}


export { updatePrintStatusPrintDispatchBill,getDetail,getDocumentRelation,addDocumentRelation,listDocumentRelation,removeDocumentRelation, get, add, edit, remove, list, getBusinessObject, getBusinessObjectDetailRenderList, getResource, getColumn, getSearch, getUploadUrl, updatePrintStatus, updateWaybillSmallTicket};

