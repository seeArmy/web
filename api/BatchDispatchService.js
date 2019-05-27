/**
 * Created by cc on 2018/7/30.
 */

import * as HTTP from './httpUtil';

const ApiConst = require('./ApiConst');
const apiWayBillDomain = ApiConst.apiWayBillDomain;

/**
 * 添加合约
 * @param logisticsCode-订单编码
 * @param mainTruckCode-主车编码
 * @param scheduleType-调车模式
 */
function add(paramObj, callback) {
  const apiUrl = `${apiWayBillDomain}/waybill/batch/add`;
  HTTP.post(apiUrl, paramObj, (res, error) => {
    callback(res, error);
  });
}

/**
 * 获取table头部数据
 * @param callback
 */
function getColumn(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/transport/batchDispatch/list_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}

/**
 * 获取serach数据
 * @param callback
 */
function getSearch(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/transport/batchDispatch/search_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}


export { add, getColumn, getSearch };
