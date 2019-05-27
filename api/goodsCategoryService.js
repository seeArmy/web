/**
 * Created by cc on 2017/6/30.
 */

import * as utils from './Utils';
import * as HTTP from './httpUtil';

const ApiConst = require('./ApiConst'),
  apiDomain = ApiConst.apiLineDomain;


function ratesList(paramObj, cb) {
  const apiUrl = `${apiDomain}/resource/rates/logistics_change_log/${paramObj.code}/list`;
  HTTP.get(apiUrl, paramObj, (response, error) => {
    cb(response, error);
  });
}
function getLogisticRatesColumn(cb) {
  const columnsData = [
    {
      showName: '序号',
      fieldConfigCode: 'xuhao',
      elementCode: 'label',
      extraParams: '{"field1":"xuhao","required":"false","detailLinkVisiable":"false"}'
    },
    {
      showName: '客户运价',
      fieldConfigCode: 'clientFreightRate',
      elementCode: 'clientFreightPrice',
      extraParams: '{"field1":"clientFreightRate","field2":"clientFreightRateUnitCode","checkRule1":"[0-9]{1,10}(\\\\.[0-9]{0,2})?","checkMsg1":"不超过13位（最多2位小数）","required":"true","detailLinkVisiable":"false","maxLength1":"13","placeholder1":"请输入客户运价"}'
    },
    {
      showName: '司机运价',
      fieldConfigCode: 'driverReferencePrice',
      elementCode: 'driverPrice',
      extraParams: '{"field1":"driverReferencePrice","field2":"driverReferencePriceUnitCode","checkRule1":"[0-9]{1,10}(\\\\.[0-9]{0,2})?","checkMsg1":"不超过13位（最多2位小数）","required":"false","detailLinkVisiable":"false","maxLength1":"13","placeholder1":"请输入司机运价"}'
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
  cb({content:columnsData});
}

function getOutsourcingLogisticRatesColumn(cb) {
  const columnsData = [
    {
      showName: '序号',
      fieldConfigCode: 'sequence',
      elementCode: 'label',
      extraParams: '{"field1":"sequence","required":"false","detailLinkVisiable":"false"}'
    },
    {
      showName: '外包运价',
      fieldConfigCode: 'clientFreightRate',
      elementCode: 'clientFreightPrice',
      extraParams: '{"field1":"clientFreightRate","field2":"clientFreightRateUnitCode","checkRule1":"[0-9]{1,10}(\\\\.[0-9]{0,2})?","checkMsg1":"不超过13位（最多2位小数）","required":"true","detailLinkVisiable":"false","maxLength1":"13","placeholder1":"请输入外包运价"}'
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
  cb({content:columnsData});
}




/**
 * 添加运价
 * @param partnerName       简称
 * @param callback          回调
 */
function add(paramObj, cb) {
  const apiUrl = `${apiDomain}/resource/rates/add`;
  HTTP.post(apiUrl, paramObj, (res, error) => {
    cb(res, error);
  });
}

/**
 * 编辑运价
 * @param partnerName       简称
 * @param callback          回调
 */
function edit(code, paramObj, cb) {
  const apiUrl = `${apiDomain}/resource/rates/${code}/edit`;
  HTTP.post(apiUrl, paramObj, (res, error) => {
    cb(res, error);
  });
}

/**
 * 根据运价编码获取运价详情
 * @param paramObj        参数对象
 *        code
 * @param callback
 */
function get(paramObj, cb) {
  const apiUrl = `${apiDomain}/resource/rates/${paramObj.code}/info`;
  HTTP.get(apiUrl, paramObj, (res, error) => {
    cb(res, error);
  });
}

/**
 * export
 * @param callback
 */
function exportCsv(paramObj, callback) {
  const apiUrl = `${apiDomain}/export/custom/rates`;
  HTTP.postJson(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 下载错误数据的CSV文件
 */
function downloadErrorData(paramObj, callback) {
  const apiUrl = `${apiDomain}/generator/rates`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 下载CSV模板
 */
function downloadTemplate(paramObj, callback) {
  const apiUrl = `${apiDomain}/download/template/rates`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}


// =======================================================================

/**
 * 获取列表
 */
function listGoodsCategory(paramObj, cb) {
  const apiUrl = `${apiDomain}/resource/resource_goods_category/list`;
  HTTP.get(apiUrl, paramObj, (response, error) => {
    cb(response, error);
  });
}

/**
 * 获取列表
 */
function listGoods(paramObj, cb) {
  const apiUrl = `${apiDomain}/resource/resource_goods/list`;
  HTTP.get(apiUrl, paramObj, (response, error) => {
    cb(response, error);
  });
}

/**
 * 获取table头部数据
 * @param callback
 */
function getColumnGoodsCategory(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/resource/resourceGoodsCategory/list_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    cb(success);
}

/**
 * 获取search数据
 * @param callback
 */
function getSearchGoodsCategory(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/resource/resourceGoodsCategory/search_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    cb(success);
}

/**
 * 获取table头部数据
 * @param callback
 */
function getColumnGoods(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/resource/resourceGoods/list_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    cb(success);
}

/**
 * 获取search数据
 * @param callback
 */
function getSearchGoods(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/resource/resourceGoods/search_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    cb(success);
}


function deletedGoodsCategory(paramObj, cb) {
  const apiUrl = `${apiDomain}/resource/resource_goods_category/${paramObj.code}/delete`;
  HTTP.post(apiUrl, {}, (success, error) => {
    cb(success, error);
  });
}

function deletedGoods(paramObj, cb) {
  const apiUrl = `${apiDomain}/resource/resource_goods/${paramObj.code}/delete`;
  HTTP.post(apiUrl, {}, (success, error) => {
    cb(success, error);
  });
}

function addGoods(paramObj, cb) {
  const apiUrl = `${apiDomain}/resource/resource_goods/add`;
  HTTP.post(apiUrl, paramObj, (res, error) => {
    cb(res, error);
  });
}

function addGoodsCategory(paramObj, cb) {
  const apiUrl = `${apiDomain}/resource/resource_goods_category/add`;
  HTTP.post(apiUrl, paramObj, (res, error) => {
    cb(res, error);
  });
}

function editGoodsCategory(code, paramObj, cb) {
  const apiUrl = `${apiDomain}/resource/resource_goods_category/edit`;
  HTTP.post(apiUrl, paramObj, (res, error) => {
    cb(res, error);
  });
}

function editGoods(code, paramObj, cb) {
  const apiUrl = `${apiDomain}/resource/resource_goods/edit`;
  HTTP.post(apiUrl, paramObj, (res, error) => {
    cb(res, error);
  });
}

function getGoods(paramObj, cb) {
  const apiUrl = `${apiDomain}/resource/resource_goods/${paramObj.code}/get`;
  HTTP.get(apiUrl, paramObj, (res, error) => {
    cb(res, error);
  });
}

function getGoodsCategory(paramObj, cb) {
  const apiUrl = `${apiDomain}/resource/resource_goods_category/${paramObj.code}/get`;
  HTTP.get(apiUrl, paramObj, (res, error) => {
    cb(res, error);
  });
}


export {getGoodsCategory,getGoods,editGoodsCategory,editGoods,addGoods,addGoodsCategory,deletedGoods,deletedGoodsCategory,getColumnGoods,getSearchGoods,listGoods,getColumnGoodsCategory,getSearchGoodsCategory, listGoodsCategory, ratesList, getColumn, getLogisticRatesColumn, getOutsourcingLogisticRatesColumn, getSearch, deleted, add, edit, get, exportCsv, downloadErrorData, downloadTemplate };
