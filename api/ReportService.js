import * as HTTP from './httpUtil';

var ApiConst = require('./ApiConst');
const apiDomain = require('./ApiConst').apiReportDomain;

/**
 * 获取云图汇总
 */
function screenSummary(paramObj, callback) {
  const apiUrl = `${apiDomain}/report/screen/summary`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}
/**
 * 获取云图平台车辆，平台司机汇总
 */
function screenPlatformInfoSummary(paramObj, callback) {
  const apiUrl = `${apiDomain}/report/screen/platformInfoSummary`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 获取云图线路列表
 */
function screenLineSummary(paramObj, callback) {
  const apiUrl = `${apiDomain}/report/screen/line_summary`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 获取云图货物列表
 */
function screenGoodsSummary(paramObj, callback) {
  const apiUrl = `${apiDomain}/report/screen/goods_summary`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 获取收发货直播
 */
function screenTransportLive(paramObj, callback) {
  const apiUrl = `${apiDomain}/report/screen/transport_live`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}


// 获取销项统计统计搜索字段配置
function getOutputSummarySearch(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/report/outputSummary/search_render_info.json`);
 success = JSON.parse(JSON.stringify(success));
    cb(success);
}

// 获取销项统计统计列表显示字段
function getOutputSummaryColumn(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/report/outputSummary/list_render_info.json`);
 success = JSON.parse(JSON.stringify(success));
    cb(success);
}

// 获取销项统计统计列表数据
function getOutputSummaryList(paramObj, cb) {
  const apiUrl = `${apiDomain}/report/output_statistics/list`;
  HTTP.get(apiUrl, paramObj, (res, err) => {
    cb(res, err);
  });
}

// 导出销项统计统计列表数据
function exportOutputSummaryCsv(paramObj, callback) {
  const apiUrl = `${apiDomain}/export/custom/outputSummary`;
  HTTP.postJson(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

// 获取进项统计统计搜索字段配置
function getInputSummarySearch(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/report/inputSummary/search_render_info.json`);
 success = JSON.parse(JSON.stringify(success));
    cb(success);
}

// 获取进项统计统计列表显示字段
function getInputSummaryColumn(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/report/inputSummary/list_render_info.json`);
 success = JSON.parse(JSON.stringify(success));
    cb(success);
}

// 获取进项统计统计列表数据
function getInputSummaryList(paramObj, cb) {
  const apiUrl = `${apiDomain}/report/input_statistics/list`;
  HTTP.get(apiUrl, paramObj, (res, err) => {
    cb(res, err);
  });
}

// gateway-qlh.rltx.xyz/{module_code}/export/custom/{type}
// 导出进项统计统计列表数据
function exportInputSummaryCsv(paramObj, callback) {
  const apiUrl = `${apiDomain}/export/custom/inputSummary`;
  HTTP.postJson(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

// 获取进销表搜索字段配置
function getIOSummarySearch(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/report/ioSummary/search_render_info.json`);
 success = JSON.parse(JSON.stringify(success));
    cb(success);
}

// 获取进销表列表显示字段
function getIOSummaryColumn(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/report/ioSummary/list_render_info.json`);
 success = JSON.parse(JSON.stringify(success));
    cb(success);
}

// 获取进销表列表数据
function getIOSummaryList(paramObj, cb) {
  const apiUrl = `${apiDomain}/report/input_output_statistics/list`;
  HTTP.get(apiUrl, paramObj, (res, err) => {
    cb(res, err);
  });
}

// 导出进销表列表数据
function exportIOSummaryCsv(paramObj, callback) {
  const apiUrl = `${apiDomain}/export/custom/ioSummary`;
  HTTP.postJson(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

// 司机结算流水


function getDriverSettleStreamSearch(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/report/driverSettleStream/search_render_info.json`);
 success = JSON.parse(JSON.stringify(success));
    cb(success);
}


function getDriverSettleStreamColumn(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/report/driverSettleStream/list_render_info.json`);
 success = JSON.parse(JSON.stringify(success));
    cb(success);
}

function getDriverSettleStreamList(paramObj, cb) {
  const apiUrl = `${apiDomain}/report/driver_settle/list`;
  HTTP.get(apiUrl, paramObj, (res, err) => {
    cb(res, err);
  });
}

function exportDriverSettleStreamSummaryCsv(paramObj, callback) {
  const apiUrl = `${apiDomain}/report/export/driverSettle`;
  HTTP.postJson(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}


// 司机结算集合列表


function getDriverSettleCollectionSearch(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/report/driverSettleCollection/search_render_info.json`);
 success = JSON.parse(JSON.stringify(success));
    cb(success);
}


function getDriverSettleCollectionColumn(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/report/driverSettleCollection/list_render_info.json`);
 success = JSON.parse(JSON.stringify(success));
    cb(success);
}

function getDriverSettleCollectionList(paramObj, cb) {
  const apiUrl = `${apiDomain}/report/driver_settle_total/list`;
  HTTP.get(apiUrl, paramObj, (res, err) => {
    cb(res, err);
  });
}

function exportDriverSettleCollectionSummaryCsv(paramObj, callback) {
  const apiUrl = `${apiDomain}/report/export/truckSummaryTotal`;
  HTTP.postJson(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}





export {

  getDriverSettleStreamSearch,
  getDriverSettleStreamColumn,
  getDriverSettleStreamList,
  exportDriverSettleStreamSummaryCsv,


  getDriverSettleCollectionSearch,
  getDriverSettleCollectionColumn,
  getDriverSettleCollectionList,
  exportDriverSettleCollectionSummaryCsv,

  screenSummary,
  screenPlatformInfoSummary,
  screenLineSummary,
  screenGoodsSummary,
  screenTransportLive,
  getOutputSummarySearch,
  getOutputSummaryColumn,
  getOutputSummaryList,
  exportOutputSummaryCsv,
  getInputSummarySearch,
  getInputSummaryColumn,
  getInputSummaryList,
  exportInputSummaryCsv,
  getIOSummarySearch,
  getIOSummaryColumn,
  getIOSummaryList,
  exportIOSummaryCsv
};
