
import * as HTTP from './httpUtil';

var ApiConst= require('./ApiConst');
const apiDomain =ApiConst.apiShipmentDomain;

/**
 * 获取托运人信息列表
 */
function getShipperList(paramObj, callback) {
  const apiUrl = `${apiDomain}/broker/js/shipperInfo/list`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}
/**
 * 获取托运人table头部数据
 * @param callback
 */
function getShipperColumn(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/shipment/shipper/list_render_info.json`);
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}

/**
 * 获取托运人serach数据
 * @param callback
 */
function getShipperSearch(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/shipment/shipper/search_render_info.json`);
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}


/**
 * 获取实际承运人信息列表
 */
function getCarrierList(paramObj, callback) {
  const apiUrl = `${apiDomain}/broker/js/carrierInfo/list`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}
/**
 * 获取实际承运人table头部数据
 * @param callback
 */
function getCarrierColumn(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/shipment/carrier/list_render_info.json`);
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}

/**
 * 获取实际承运人serach数据
 * @param callback
 */
function getCarrierSearch(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/shipment/carrier/search_render_info.json`);
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}


/**
 * 获取车辆基础信息列表
 */
function getVehicebaseList(paramObj, callback) {
  const apiUrl = `${apiDomain}/broker/js/vehicleInfo/list`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}
/**
 * 获取车辆基础信息table头部数据
 * @param callback
 */
function getVehicebaseColumn(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/shipment/vehicebase/list_render_info.json`);
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}

/**
 * 获取车辆基础信息serach数据
 * @param callback
 */
function getVehicebaseSearch(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/shipment/vehicebase/search_render_info.json`);
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}



/**
 * 获取驾驶员基础信息列表
 */
function getDriverInfoList(paramObj, callback) {
  const apiUrl = `${apiDomain}/broker/js/driverInfo/list`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}
/**
 * 获取驾驶员基础信息table头部数据
 * @param callback
 */
function getDriverInfoColumn(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/shipment/driver/list_render_info.json`);
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}

/**
 * 获取驾驶员基础信息serach数据
 * @param callback
 */
function getDriverInfoSearch(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/shipment/driver/search_render_info.json`);
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}


/**
 * 获取货源信息列表列表
 */
function getSourceGoodsInfoList(paramObj, callback) {
  const apiUrl = `${apiDomain}/broker/js/sourceGoodsInfo/list`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}
/**
 * 获取货源信息列表table头部数据
 * @param callback
 */
function getSourceGoodsInfoColumn(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/shipment/sourcegood/list_render_info.json`);
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}

/**
 * 获取货源信息列表serach数据
 * @param callback
 */
function getSourceGoodsInfoSearch(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/shipment/sourcegood/search_render_info.json`);
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}


/**
 * 获取运单列表
 */
function getWaybillList(paramObj, callback) {
  const apiUrl = `${apiDomain}/broker/js/shippingNoteInfo/list`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}
/**
 * 获取运单列表table头部数据
 * @param callback
 */
function getWaybillColumn(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/shipment/waybill/list_render_info.json`);
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}

/**
 * 获取运单列表serach数据
 * @param callback
 */
function getWaybillSearch(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/shipment/waybill/search_render_info.json`);
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}

/**
 * 获取派车单信息列表
 */
function getDispatchingList(paramObj, callback) {
  const apiUrl = `${apiDomain}/broker/js/jobOrderInfo/list`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}
/**
 * 获取派车单信息列表table头部数据
 * @param callback
 */
function getDispatchingColumn(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/shipment/dispatching/list_render_info.json`);
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}

/**
 * 获取派车单信息列表serach数据
 * @param callback
 */
function getDispatchingSearch(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/shipment/dispatching/search_render_info.json`);
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}


/**
 * 获取回执单信息列表
 */
function getReceiptList(paramObj, callback) {
  const apiUrl = `${apiDomain}/broker/js/receiptInfo/list`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}
/**
 * 获取回执单信息列表table头部数据
 * @param callback
 */
function getReceiptColumn(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/shipment/receipt/list_render_info.json`);
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}

/**
 * 获取回执单信息列表serach数据
 * @param callback
 */
function getReceiptSearch(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/shipment/receipt/search_render_info.json`);
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}


/**
 * 获取车载货物信息列表
 */
function getVehiclegoodsList(paramObj, callback) {
  const apiUrl = `${apiDomain}/broker/js/goodsOfVehicle/list`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}
/**
 * 获取车载货物信息列表table头部数据
 * @param callback
 */
function getVehiclegoodsColumn(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/shipment/vehiclegoods/list_render_info.json`);
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}

/**
 * 获取车载货物信息列表serach数据
 * @param callback
 */
function getVehiclegoodsSearch(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/shipment/vehiclegoods/search_render_info.json`);
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}



/**
 * 获取资金流水列表列表
 */
function getCapitalList(paramObj, callback) {
  const apiUrl = `${apiDomain}/broker/js/capitalFlow/list`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}
/**
 * 获取资金流水列表table头部数据
 * @param callback
 */
function getCapitalColumn(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/shipment/capital/list_render_info.json`);
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}

/**
 * 获取资金流水列表serach数据
 * @param callback
 */
function getCapitalSearch(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/shipment/capital/search_render_info.json`);
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}


/**
 * 获取合同列表
 */
function getContractList(paramObj, callback) {
  const apiUrl = `${apiDomain}/broker/js/contractInfo/list`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}
/**
 * 获取合同列表table头部数据
 * @param callback
 */
function getContractColumn(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/shipment/contract/list_render_info.json`);
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}

/**
 * 获取合同列表serach数据
 * @param callback
 */
function getContractSearch(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/shipment/contract/search_render_info.json`);
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}


/**
 * 下载错误数据的CSV文件
 */
function downloadErrorData(paramObj, callback) {
  const apiUrl = `${apiDomain}/generator/accident`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 托运人信息列表export
 * @param callback
 */
function exportShipperCsv(paramObj, callback) {
  const apiUrl = `${apiDomain}/broker/js/export/exportShipperInfoList`;
  HTTP.get(apiUrl,paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 实际承运人信息列表export
 * @param callback
 */
function exportCarrierInfoCsv(paramObj, callback) {
  const apiUrl = `${apiDomain}/broker/js/export/exportCarrierInfoList`;
  HTTP.postJson(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 车辆基础信息列表export
 * @param callback
 */
function exportVehicleInfoCsv(paramObj, callback) {
  const apiUrl = `${apiDomain}/broker/js/export/exportVehicleInfoList`;
  HTTP.postJson(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 驾驶员基础信息列表export
 * @param callback
 */
function exportDriverCsv(paramObj, callback) {
  const apiUrl = `${apiDomain}/broker/js/export/exportDriverInfoList`;
  HTTP.postJson(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 货源信息列表export
 * @param callback
 */
function exportSourceGoodsInfoCsv(paramObj, callback) {
  const apiUrl = `${apiDomain}/broker/js/export/exportSourceGoodsInfoList`;
  HTTP.postJson(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 运单列表export
 * @param callback
 */
function exportShippingNoteInfoCsv(paramObj, callback) {
  const apiUrl = `${apiDomain}/broker/js/export/exportShippingNoteInfoList`;
  HTTP.postJson(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 派车单信息列表export
 * @param callback
 */
function exportJobOrderInfoCsv(paramObj, callback) {
  const apiUrl = `${apiDomain}/broker/js/export/exportJobOrderInfoList`;
  HTTP.postJson(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 回执单信息列表export
 * @param callback
 */
function exportReceiptInfoCsv(paramObj, callback) {
  const apiUrl = `${apiDomain}/broker/js/export/exportReceiptInfoList`;
  HTTP.postJson(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 车载货物信息列表export
 * @param callback
 */
function exportGoodsOfVehicleCsv(paramObj, callback) {
  const apiUrl = `${apiDomain}/broker/js/export/exportGoodsOfVehicleList`;
  HTTP.postJson(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 资金流水列表export
 * @param callback
 */
function exportCapitalFlowCsv(paramObj, callback) {
  const apiUrl = `${apiDomain}/broker/js/export/exportCapitalFlowList`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}


/**
 * 合同列表export
 * @param callback
 */
function exportContractCsv(paramObj, callback) {
  const apiUrl = `${apiDomain}/broker/js/export/exportContractInfoList`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

export {
//托运人信息列表
getShipperColumn, getShipperSearch,getShipperList,exportShipperCsv,
//实际承运人信息列表
getCarrierList,getCarrierColumn,getCarrierSearch,exportCarrierInfoCsv,
//车辆基础信息列表
getVehicebaseList,getVehicebaseColumn,getVehicebaseSearch,exportVehicleInfoCsv,
//驾驶员基础信息列表
getDriverInfoList,getDriverInfoColumn,getDriverInfoSearch,exportDriverCsv,
//货源信息列表
getSourceGoodsInfoList,getSourceGoodsInfoColumn,getSourceGoodsInfoSearch,exportSourceGoodsInfoCsv,
//运单列表
getWaybillList,getWaybillColumn,getWaybillSearch,exportShippingNoteInfoCsv,
//派车单信息列表
getDispatchingList,getDispatchingColumn,getDispatchingSearch,exportJobOrderInfoCsv,
//回执单信息列表
getReceiptList,getReceiptColumn,getReceiptSearch,exportReceiptInfoCsv,
//车载货物信息列表
getVehiclegoodsList,getVehiclegoodsColumn,getVehiclegoodsSearch,exportGoodsOfVehicleCsv,
//资金流水列表
getCapitalList,getCapitalColumn,getCapitalSearch,exportCapitalFlowCsv,
//合同信息列表
getContractList,getContractColumn,getContractSearch,exportContractCsv

};
