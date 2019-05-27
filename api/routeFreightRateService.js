
import * as HTTP from './httpUtil';

var ApiConst= require('./ApiConst');
const apiDomain = ApiConst.apiResourceDomain;

/**
 * 获取客户运价table头部数据
 * @param callback
 */
function getClientFreightColumn(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/routeFreightRate/clientFreight/list_render_info.json`);
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}

/**
 * 获取客户运价serach数据
 * @param callback
 */
function getClientFreightSearch(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/routeFreightRate/clientFreight/search_render_info.json`);
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}


/**
 * 获取客户运价列表
 */
function getClientFreightList(paramObj, callback) {
  const apiUrl = `${apiDomain}/resource/resource_rates/list`;
  paramObj.ratesType = 'client';
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 结束运价
 */
function endClientFreightList(paramObj, callback) {
  const apiUrl = `${apiDomain}/resource/resource_rates/endRates`;
  HTTP.post(apiUrl,{code:paramObj.code}, (success, error) => {
    callback(success, error);
  });
}

/**
 * 删除运价
 */
function removeClientFreightList(paramObj, callback) {
  const apiUrl = `${apiDomain}/resource/resource_rates/${paramObj.code}/delete `;
  HTTP.post(apiUrl, {code:paramObj.code}, (success, error) => {
    callback(success, error);
  });
}
/**
 * 申请运价
 */
function applyClientFreightList(paramObj, callback) {
  const apiUrl = `${apiDomain}/resource/resource_rates/applyRates`;
  HTTP.post(apiUrl, {code:paramObj.code}, (success, error) => {
    callback(success, error);
  });
}
/**
 * 审核运价
 */
function checkClientFreightList(paramObj, callback) {
  const apiUrl = `${apiDomain}/resource/resource_rates/approveRates`;
  HTTP.post(apiUrl,paramObj, (success, error) => {
    callback(success, error);
  });
}
/**
 * 获取运价详情
 */
function getClientFreightDetail(paramObj, callback) {
  const apiUrl = `${apiDomain}/resource/resource_rates/${paramObj.code}/get`;
  paramObj.ratesType = 'client';
  HTTP.get(apiUrl,paramObj, (success, error) => {
    callback(success, error);
  });
}
/**
 * 新增运价详情
 */
function addClientFreightDetail(paramObj, callback) {
  const apiUrl = `${apiDomain}/resource/resource_rates/add`;
  paramObj.ratesType = 'client';
  HTTP.post(apiUrl,paramObj, (success, error) => {
    callback(success, error);
  });
}
/**
 * 编辑运价详情
 */
function editClientFreightDetail(code,paramObj, callback) {
  const apiUrl = `${apiDomain}/resource/resource_rates/edit`;
  paramObj.ratesType = 'client';
  HTTP.post(apiUrl,paramObj, (success, error) => {
    callback(success, error);
  });
}




/**
 * 获取外包详情
 */
function getOutsourcingDetail(paramObj, callback) {
  const apiUrl = `${apiDomain}/resource/resource_rates/${paramObj.code}/get`;
  paramObj.ratesType = 'outsourcing';
  HTTP.get(apiUrl,paramObj, (success, error) => {
    callback(success, error);
  });
}
/**
 * 新增外包运价详情
 */
function addOutsourcingDetail(paramObj, callback) {
  const apiUrl = `${apiDomain}/resource/resource_rates/add`;
  paramObj.ratesType = 'outsourcing';
  HTTP.post(apiUrl,paramObj, (success, error) => {
    callback(success, error);
  });
}
/**
 * 编辑外包详情
 */
function editOutsourcingDetail(code,paramObj, callback) {
  const apiUrl = `${apiDomain}/resource/resource_rates/edit`;
  paramObj.ratesType = 'outsourcing';
  HTTP.post(apiUrl,paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 获取外包运价table头部数据
 * @param callback
 */
function getOutsourcingColumn(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/routeFreightRate/outsourceFreight/list_render_info.json`);
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}

/**
 * 获取外包运价serach数据
 * @param callback
 */
function getOutsourcingSearch(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/routeFreightRate/outsourceFreight/search_render_info.json`);
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}


/**
 * 获取外包运价列表
 */
function getOutsourcingList(paramObj, callback) {
  const apiUrl = `${apiDomain}/resource/resource_rates/list`;
  paramObj.ratesType = 'outsourcing';
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 结束运价
 */
function endOutsourcingList(paramObj, callback) {
  const apiUrl = `${apiDomain}/resource/resource_rates/endRates`;
  HTTP.post(apiUrl,{code:paramObj.code}, (success, error) => {
    callback(success, error);
  });
}

/**
 * 删除运价
 */
function removeOutsourcingList(paramObj, callback) {
  const apiUrl = `${apiDomain}/resource/resource_rates/${paramObj.code}/delete `;
  HTTP.post(apiUrl, {code:paramObj.code}, (success, error) => {
    callback(success, error);
  });
}
/**
 * 申请运价
 */
function applyOutsourcingList(paramObj, callback) {
  const apiUrl = `${apiDomain}/resource/resource_rates/applyRates`;
  HTTP.post(apiUrl, {code:paramObj.code}, (success, error) => {
    callback(success, error);
  });
}
/**
 * 审核运价
 */
function checkutsourcingList(paramObj, callback) {
  const apiUrl = `${apiDomain}/resource/resource_rates/approveRates`;
  HTTP.post(apiUrl,paramObj, (success, error) => {
    callback(success, error);
  });
}


export { getClientFreightColumn, getClientFreightSearch,getClientFreightList,removeClientFreightList,applyClientFreightList,checkClientFreightList,getClientFreightDetail,addClientFreightDetail,editClientFreightDetail,endClientFreightList,
         getOutsourcingDetail,addOutsourcingDetail,editOutsourcingDetail,getOutsourcingColumn,getOutsourcingSearch,getOutsourcingList,endOutsourcingList,removeOutsourcingList,applyOutsourcingList,checkutsourcingList
};
