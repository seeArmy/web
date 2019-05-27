/**
 * Created by zyc on 2017/7/5.
 */
import * as utils from './Utils';
import * as HTTP from './httpUtil';
var ApiConst= require('./ApiConst');
const apiDomain = ApiConst.apiTruckDomain;

/**
 * 添加伙伴
 * @param partnerName       简称
 * @param orgFullName       全称
 * @param linkmanFullName   联系人
 * @param linkmanPhone      联系号码
 * @param county            县
 * @param city              市
 * @param province          省
 * @param address           详细地址
 * @param description       描述
 * @param orgTagList        标签
 * @param callback          回调
 */
function add(paramObj, callback) {
  const apiUrl = `${apiDomain}/truck/add`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 编辑车辆
 */
function edit(code, paramObj, callback) {
  const apiUrl = `${apiDomain}/truck/edit`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 获取车辆列表
 */
function list(paramObj, callback) {
  const apiUrl = `${apiDomain}/truck/list`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 车辆列表 通过平台查找 POST /platform/truck/list
 */
function listPlatform(paramObj, callback) {
  const apiUrl = `${ApiConst.BaseDomain}/platform/platform/truck/list`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
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
  const apiUrl = `${apiDomain}/truck/${paramObj.code}/delete`;
  HTTP.post(apiUrl, {}, (success, error) => {
    callback(success, error);
  });
}

/**
 * 根据车辆编码获取详情
 */
function get(paramObj, callback) {
  const apiUrl = `${apiDomain}/truck/${paramObj.code}/get`;
  HTTP.get(apiUrl, utils.codeNull(paramObj), (success, error) => {
    callback(success, error);
  });
}

/**
 * 获取table头部数据
 * @param callback
 */
function getColumn(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/truck/truck/list_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}



/**
 * 获取serach数据
 * @param callback
 */
function getSearch(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/truck/truck/search_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}

/**
 * 获取车辆详情
 * @param callback
 */
function getDetail(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/truck/truck/detail_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}

/**
 * export
 * @param callback
 */
function exportCsv(paramObj, callback) {
  const apiUrl = `${apiDomain}/export/custom/truck`;
  HTTP.postJson(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 下载错误数据的CSV文件
 */
function downloadErrorData(paramObj, callback) {
  const apiUrl = `${apiDomain}/generator/truck`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 下载CSV模板
 */
function downloadTemplate(paramObj, callback) {
  const apiUrl = `${apiDomain}/download/template/truck`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 申请认证
 * @param code
 * @param callback
 */
function verify(code, callback) {
  const apiUrl = `${apiDomain}/truck/${code}/verify`;
  HTTP.post(apiUrl, {}, (success, error) => {
    callback(success, error);
  });
}

// 车辆挂靠 ，点击 派车 调用
function addTruck(code, callback) {
  const apiUrl = `${apiDomain}/truck/add/${code}`;
  HTTP.post(apiUrl, {}, (success, error) => {
    callback(success, error);
  });
}

// ==========================================  车辆证件管理里面的 （合用）
/**
 * 获取table头部数据
 * @param callback
 */
function getColumnLicense(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/truck/truckLicenseManagement/list_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}


/**
 * 获取serach数据
 * @param callback
 */
function getSearchLicense(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/truck/truckLicenseManagement/search_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}

// 切换 主驾 和副驾 只需要传递 code 即可
// POST /transport/change/main_vice_driver/{code}
function mainViceDriver(paramObj, callback) {
  const apiUrl = `${apiDomain}/transport/change/main_vice_driver/${paramObj.code}`;
  HTTP.post(apiUrl, {}, (success, error) => {
    callback(success, error);
  });
}

function sinoiov(paramObj, callback) {
  // const apiUrl = `${ApiConst.gatewayDomain}/smartz/sinoiov/sinoiovLastLocation`;
  const apiUrl = `${ApiConst.gatewayDomain}/smartz/call`,
    query = Object.assign(paramObj, { bizEventNo :'sinoiovLastLocation'})
  HTTP.post(apiUrl, query, (success, error) => {
    callback(success, error);
  });
}

// 实时位置查询
function liveLocation(paramObj, callback) {
  const apiUrl = `${ApiConst.gatewayDomain}/smartz/call`,
    query = Object.assign(paramObj, { bizEventNo: 'huaNengGetLastPosZJ'});
  HTTP.post(apiUrl, query, (success, error) => {
    callback(success, error);
  });
}

/**
 * 根据关键字获取伙伴信息
 */
function getPartnerlist(queryString, callback) {
   const PAGE_SIZE = 100;
  const apiUrl =  `${ApiConst.apiOrgDomain}/partner/list?size=${PAGE_SIZE}&keyword=${queryString}`;
  HTTP.get(apiUrl,{}, (success, error) => {
    callback(success, error);
  });
}

// 通过车查询 运单
function listWaybillByTruckCode(listCode, callback) {
   let obj = listCode.join(',')
  const apiUrl = `${ApiConst.apiWayBillDomain}/waybill/current/list`;
  HTTP.post(apiUrl, {platformTruckCodeList:obj}, (success, error) => {
    callback(success, error);
  });
}

export {listWaybillByTruckCode,getPartnerlist, mainViceDriver, addTruck, getColumnLicense, getSearchLicense, 
  listPlatform, add, edit, list, deleted, get, getColumn, getSearch, 
  getDetail, exportCsv, downloadErrorData, downloadTemplate, verify, 
  sinoiov, liveLocation };
