/**
 * OutsourcingLogisticsService.js
 * Created by cc on 18/5/7.
 */

import * as HTTP from './httpUtil';
import * as utils from './Utils';

const ApiConst= require('./ApiConst'),
  apiLogisticsDomain = ApiConst.apiLogisticsDomain;

// 获取列表数据
function list(paramObj, cb) {
  const apiUrl = `${apiLogisticsDomain}/outsourcing_logistics/list`;
  HTTP.get(apiUrl, paramObj, (response, err) => {
    cb(response, err);
  });
}

// 获取列表操作
function getAction(paramObj, cb) {
  const apiUrl = `${apiLogisticsDomain}/logistics/action/list`;
  HTTP.post(apiUrl, { 'businessCodeList': paramObj }, (response, err) => {
    cb(response, err);
  });
}

// 获取头部搜索字段配置
function getSearch(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/logistics/outsourcing/search_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    cb(success);
}

// 获取确认列表头部搜索字段配置  
// 说明：json 公用的文件，但是 此处只需要 3 个状态
function getSearchConfirm(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/logistics/outsourcing/search_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
  success.content.forEach(v=>{
    if(v.fieldConfigCode == 'logisticsStatus'){
      v.extraParams = '{"field1":"logisticsStatus","default1":"todo","required":"false","detailLinkVisiable":"false","optionsValue1":["ready","pend","reject"],"options1":["待我方发送","待对方确认","对方已拒接"]}';
    }
  })
    cb(success);
}

// 删除数据
function deleted(paramObj, callback) {
  const apiUrl = `${apiLogisticsDomain}/outsourcing_logistics/${paramObj.code}/delete`;
  HTTP.post(apiUrl, {}, (success, error) => {
    callback(success, error);
  });
}

// 获取列表显示字段
function getColumn(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/logistics/outsourcing/list_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    cb(success);
}

// 获取详情显示字段
function getDetail(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/logistics/outsourcing/detail_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    cb(success);
}

// 获取确认列表显示字段
function getColumnConfirm(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/logistics/outsourcing/list_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    cb(success);
}

// 添加
function add(paramObj, cb) {
  const apiUrl = `${apiLogisticsDomain}/outsourcing_logistics/add`;
  // console.log(apiUrl);
  HTTP.post(apiUrl, paramObj, (response, err) => {
    cb(response, err);
  });
}

// 订单转包新建外包订单
function subContract(paramObj, cb) {
  const apiUrl = `${apiLogisticsDomain}/outsourcing_logistics/manifest/add`;
  // console.log(apiUrl);
  HTTP.post(apiUrl, paramObj, (response, err) => {
    cb(response, err);
  });
}

// 获取信息
function get(paramObj, callback) {
  const url = `${apiLogisticsDomain}/outsourcing_logistics/${paramObj.code}/get`;
  HTTP.get(url, {}, (success, error) => {
    callback(success, error);
  });
}

//编辑
function edit(paramObj, cb) {
  const apiUrl = `${apiLogisticsDomain}/outsourcing_logistics/edit`;
  HTTP.post(apiUrl, paramObj, (response, err) => {
    cb(response, err);
  });
}

//添加业务动作
function addAction(code, actionCode, paramObj, nullArray, callback) {
  const apiUrl = `${apiLogisticsDomain}/logistics/${code}/execute/${actionCode}`;
  HTTP.post(apiUrl, { }, (success, error) => {
    callback(success, error);
  });
}

/**
 * export
 * @param callback
 */
function exportCsv(paramObj, callback) {
  const apiUrl = `${apiLogisticsDomain}/export/custom/outsourcingLogistics`;
  HTTP.postJson(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 下载错误数据的CSV文件
 */
function downloadErrorData(paramObj, callback) {
  const apiUrl = `${apiLogisticsDomain}/generator/outsourcingLogistics`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 下载CSV模板
 */
function downloadTemplate(paramObj, callback) {
  const apiUrl = `${apiLogisticsDomain}/download/template/outsourcingLogistics`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

// 运价关联订单
function rateBindLogistic(paramObj, callback) {
  const apiUrl = `${apiLogisticsDomain}/logistics/rate/${paramObj.code}/${paramObj.ratesCode}/relation`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

// 删除订单运价关联
function deleteLogisticRateRelation(paramObj, callback) {
  const apiUrl = `${apiLogisticsDomain}/logistics/rate/${paramObj.code}/${paramObj.ratesCode}/relation/delete`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

// 运价选中
function rateSelect(paramObj, callback) {
  const apiUrl = `${apiLogisticsDomain}/logistics/rate/${paramObj.code}/edit`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

// 批量确认发送
function batchConfirmSend(paramObj, callback) {
  const apiUrl = `${apiLogisticsDomain}/outsourcing_logistics/batch/send`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}


// 恢复 外包订单 
function recover(paramObj, callback) {
  const apiUrl = `${apiLogisticsDomain}/outsourcing_logistics/recover`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}


// 获取头部搜索字段配置  运单回收站
function getSearchRecycle(cb) {
   var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/logistics/recycleOutsourcing/search_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    cb(success);
}

// 获取头部搜索字段配置  运单回收站
function getColumnRecycle(cb) {
   var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/logistics/recycleOutsourcing/list_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    cb(success);
}

//凭证记录
function change(paramObj, cb) {
  const apiUrl = `${apiLogisticsDomain}/logistics/changeOutsource`;
  HTTP.post(apiUrl, paramObj, (response, err) => {
    cb(response, err);
  });
}

// 新建 订单
//waybill：domainObject的json字符串（map类型） domainObject
//manifest：货单的json字符串（map类型）paramObj
function addLogistics( domainObject, list, cb) {
  const link = '@@';
  let paramsObjFinal = {};
  // 处理货物 -------------------------------------------------
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
        obj[key] += link + val;
      } else {
        let val = value[key] ? value[key] : '';
        obj[key] = val;
      }
    });
  });
  // 处理货物 -------------------------------------------------
  domainObject = utils.formatDateInDoamin(domainObject);
  paramsObjFinal['logistics'] = JSON.stringify(domainObject) ;
  if(postList.length<1){
    paramsObjFinal['manifest'] = '{}';
  }else{
     paramsObjFinal['manifest'] = JSON.stringify(obj);
  }

  const apiUrl = `${apiLogisticsDomain}/outsourcing_logistics/manifest/add`;
  HTTP.post(apiUrl, paramsObjFinal, (res, err) => {
    cb(res, err);
  });
}

// 编辑 订单
//waybill：domainObject的json字符串（map类型） domainObject
//manifest：货单的json字符串（map类型）paramObj
function editLogistics( domainObject, list, cb) {
  const link = '@@';
  let paramsObjFinal = {};
  // 处理货物 -------------------------------------------------
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
        obj[key] += link + val;
      } else {
        let val = value[key] ? value[key] : '';
        obj[key] = val;
      }
    });
  });
  // 处理货物 -------------------------------------------------
    domainObject = utils.formatDateInDoamin(domainObject);
  paramsObjFinal['logistics'] = JSON.stringify(domainObject);
  if(postList.length<1){
    paramsObjFinal['manifest'] = '{}';
  }else{
     paramsObjFinal['manifest'] = JSON.stringify(obj);
  }

  const apiUrl = `${apiLogisticsDomain}/outsourcing_logistics/manifest/edit`;
  HTTP.post(apiUrl, paramsObjFinal, (res, err) => {
    cb(res, err);
  });
}


export { subContract, addLogistics,editLogistics, getSearchRecycle , getColumnRecycle, recover, list, getAction, deleted, getSearch, getSearchConfirm, getColumn, getDetail, getColumnConfirm, add, edit, get, addAction, exportCsv, downloadErrorData, downloadTemplate, rateBindLogistic, deleteLogisticRateRelation, rateSelect, batchConfirmSend, change };
