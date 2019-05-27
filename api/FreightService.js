import * as utils from './Utils';
import * as HTTP from './httpUtil';

const ApiConst = require('./ApiConst');
const apiDomain = ApiConst.apiOrgDomain;
const BaseDomain = ApiConst.BaseDomain;
const apiFreightDomain = ApiConst.apiFreightDomain;

/**
 * 添加货源
 */
function add(paramObj, callback) {
  const apiUrl = `${apiFreightDomain}/freight/add`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 编辑货源
 */
function edit(code, paramObj, callback) {
  const apiUrl = `${apiFreightDomain}/freight/${code}/edit`;
  HTTP.post(apiUrl, paramObj, (response, err) => {
    callback(response, err);
  });
}

//添加业务动作
function addAction(code, actionCode, paramObj, nullArray, callback) {
  const apiUrl = `${apiFreightDomain}/freight/${code}/execute/${actionCode}`;
  HTTP.postJson(apiUrl, { 'params': paramObj }, (success, error) => {
    callback(success, error);
  });
}

/**
 * 刷新货源
 */
function refresh(code, paramObj, callback) {
  const apiUrl = `${apiFreightDomain}/freight/${code}/refresh`;
  HTTP.post(apiUrl, paramObj, (response, err) => {
    callback(response, err);
  });
}

/**
 * 结束发布
 */
function close(code, paramObj, callback) {
  const apiUrl = `${apiFreightDomain}/freight/${code}/close`;
  HTTP.post(apiUrl, paramObj, (response, err) => {
    callback(response, err);
  });
}

/**
 * 获取货源列表
 */
function list(paramObj, callback) {
  const apiUrl = `${apiFreightDomain}/freight/list`;
  HTTP.get(apiUrl, paramObj, (response, err) => {
    callback(response, err);
  });
}

/**
 * 获取table头部数据
 * @param callback
 */
function getColumn(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/freight/freight/list_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}

/**
 * 获取serach数据
 * @param callback
 */
function getSearch(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/freight/freight/search_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}

/**
 * 根据伙伴编码获取车辆详情
 * @param paramObj        参数对象
 *         partnerOrgCode
 * @param callback
 */
function get(paramObj, callback) {
  const apiUrl = `${apiFreightDomain}/freight/${paramObj.code}/get`;
  HTTP.get(apiUrl, {}, (success, error) => {
    callback(success, error);
  });
}

/**
 * 删除车辆
 * @param paramObj          参数对象
 *         partnerOrgCode    编码
 * @param callback          回调
 */
function deleted(paramObj, callback) {
  const apiUrl = `${ApiConst.apiFreightDomain}/freight/${paramObj.code}/delete`;
  HTTP.post(apiUrl, {}, (success, error) => {
    callback(success, error);
  });
}

/**
 * export
 * @param callback
 */
function exportCsv(paramObj, callback) {
  const apiUrl = `${apiFreightDomain}/export/freight`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 下载错误数据的CSV文件
 */
function downloadErrorData(paramObj, callback) {
  const apiUrl = `${apiFreightDomain}/generator/freight`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 下载CSV模板
 */
function downloadTemplate(paramObj, callback) {
  const apiUrl = `${apiFreightDomain}/download/template/freight`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 获取个人账户信息
 */
function getPersonInfo(paramObj, callback) {
  const apiUrl = `${ApiConst.apiPersonDomain}/person/self/info`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}


// 获取详情显示字段
function getDetail(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/freight/freight/detail_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    cb(success);
}

// 恢复运单
function recover(paramObj, callback) {
  const apiUrl = `${apiFreightDomain}/freight/recover`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

// 获取头部搜索字段配置  运单回收站
function getSearchRecycle(cb) {
   var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/freight/recycle/search_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    cb(success);
}

// 获取头部搜索字段配置  运单回收站
function getColumnRecycle(cb) {
   var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/freight/recycle/list_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    cb(success);
}

// ###   new logist start =======================================
function getColumnManifestSingle(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/freight/manifestList/single/list_render_info.json`)
  success = JSON.parse(JSON.stringify(success));
  cb(success);
}
function getColumnManifestMultiple(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/freight/manifestList/multiple/list_render_info.json`)
  success = JSON.parse(JSON.stringify(success));
  cb(success);
}
// 获取货单信息
function getManifestList(paramObj, callback) {
  const url = `${apiFreightDomain}/freight/freight_manifest/${paramObj.code}/get`;
  HTTP.get(url, {}, (success, error) => {
    callback(success, error);
  });
}


// 新建 订单
//waybill：domainObject的json字符串（map类型） domainObject
//manifest：货单的json字符串（map类型）paramObj
function addFreight( domainObject, list, cb) {
  const link = '@@';
  let paramsObjFinal = {};
  // 处理货物 -------------------------------------------------
 let obj = utils.transformListToObjByStr(list,link);
  // 处理货物 -------------------------------------------------
  domainObject = utils.formatDateInDoamin(domainObject);
  paramsObjFinal[' freight'] = JSON.stringify(domainObject) ;
  if(!obj){
    paramsObjFinal['manifest'] = '{}';
  }else{
     paramsObjFinal['manifest'] = JSON.stringify(obj);
  }

  const apiUrl = `${apiFreightDomain}/freight/manifest/add`;
  HTTP.post(apiUrl, paramsObjFinal, (res, err) => {
    cb(res, err);
  });
}

// 编辑 订单
//waybill：domainObject的json字符串（map类型） domainObject
//manifest：货单的json字符串（map类型）paramObj
function editFreight( domainObject, list, cb) {
  const link = '@@';
  let paramsObjFinal = {};
  // 处理货物 -------------------------------------------------
 let obj = utils.transformListToObjByStr(list,link);
  // 处理货物 -------------------------------------------------
    domainObject = utils.formatDateInDoamin(domainObject);
  paramsObjFinal[' freight'] = JSON.stringify(domainObject);
   if(!obj){
    paramsObjFinal['manifest'] = '{}';
  }else{
     paramsObjFinal['manifest'] = JSON.stringify(obj);
  }

  const apiUrl = `${apiFreightDomain}/freight/manifest/edit`;
  HTTP.post(apiUrl, paramsObjFinal, (res, err) => {
    cb(res, err);
  });
}
//获取发货量和车次
function getWaybillProgressByFreightCode(paramObj, callback) {
  const url = `${BaseDomain}/waybill/waybill/getWaybillProgressByFreightCode`;
  HTTP.get(url, paramObj, (success, error) => {
    callback(success, error);
  });
}
export {getSearchRecycle,getColumnRecycle,recover,getDetail, add, edit, addAction, refresh, close, list, getColumn, getSearch, get, deleted, exportCsv, downloadErrorData, downloadTemplate ,getPersonInfo ,getColumnManifestSingle,getColumnManifestMultiple,
  addFreight,editFreight,getManifestList,getWaybillProgressByFreightCode
};
