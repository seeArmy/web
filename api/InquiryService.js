import * as utils from './Utils';
import * as HTTP from './httpUtil';

const ApiConst = require('./ApiConst');
const apiDomain = ApiConst.apiLogisticsDomain;

/**
 * 添加
 */
function add(paramObj, callback) {
  const apiUrl = `${apiDomain}/logistics/rfq/add`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 结束发布
 */
function close(paramObj, callback) {
  const apiUrl = `${apiDomain}/logistics/rfq/close`;
  HTTP.post(apiUrl, paramObj, (response, err) => {
    callback(response, err);
  });
}

/**
 * 忽略
 */
function ignore( paramObj, callback) {
  const apiUrl = `${apiDomain}/logistics/quote/ignore`;
  HTTP.post(apiUrl, paramObj, (response, err) => {
    callback(response, err);
  });
}

/**
 * 获取列表
 */
function list(paramObj, callback) {
  const apiUrl = `${apiDomain}/logistics/rfq/list`;
  HTTP.get(apiUrl, paramObj, (response, err) => {
    callback(response, err);
  });
}

/**
 * 获取询价单详情报价记录列表
 */
function quoteList(paramObj, callback) {
  const apiUrl = `${apiDomain}/logistics/quote/all/list`;
  HTTP.get(apiUrl, paramObj, (response, err) => {
    callback(response, err);
  });
}

/**
 * 获取table头部数据
 * @param callback
 */
function getColumn(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/inquiry/inquiry/list_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}

/**
 * 获取table头部数据
 * @param callback
 */
function getQuoteColumn(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/inquiry/quoteRecord/list_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}

/**
 * 获取serach数据
 * @param callback
 */
function getSearch(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/inquiry/inquiry/search_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}

/**
 * 获取serach数据
 * @param callback
 */
function getQuoteSearch(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/inquiry/quoteRecord/search_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}


// 获取详情显示字段
function getDetail(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/inquiry/inquiry/detail_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    cb(success);
}


/**
 * 根据编码获取详情
 * @param paramObj        参数对象
 *         partnerOrgCode
 * @param callback
 */
function get(paramObj, callback) {
  const apiUrl = `${apiDomain}/logistics/rfq/get`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * export
 * @param callback
 */
function exportCsv(paramObj, callback) {
  const apiUrl = `${apiDomain}/export/custom/rfq`;
  HTTP.postJson(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 下载错误数据的CSV文件
 */
function downloadErrorData(paramObj, callback) {
  const apiUrl = `${apiDomain}/generator/rfq`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 下载CSV模板
 */
function downloadTemplate(paramObj, callback) {
  const apiUrl = `${apiDomain}/download/template/rfq`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

export {add, close, ignore, list, quoteList, getColumn, getQuoteColumn, getSearch, getQuoteSearch, getDetail, get, exportCsv, downloadErrorData, downloadTemplate };
