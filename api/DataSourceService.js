/**
 * ResourceService.js
 * Created by dsky on 17/7/7.
 */

// import * as waybillService from './waybillService';
import { objToParamStr } from './Utils.js';
import * as RateService from './rateService.js';
import LongTransportDataSource from "./LongTransportDataSource";
import FreightDataSource from "./FreightDataSource";
import CustomOrgDataSource from "./CustomOrgDataSource";
import PersonBankAccountDataSource from "./PersonBankAccountDataSource";
import * as PrintTemplateService from './PrintTemplateService';



// import { getColumn as PartnergetColumn, getSearch as PartnergetSearch } from './PartnerService';
// import { getColumn as RoutegetColumn, getSearch as RoutegetSearch } from './RouteService';
// import { getColumn as LogisticsgetColumn, getSearch as LogisticsgetSearch } from './LogisticsService';
// import { getColumn as TruckgetColumn, getSearch as TruckgetSearch } from './TruckService';
// import { getColumn as TrailergetColumn, getSearch as TrailergetSearch } from './TrailerService';
const axios = require('axios'),
  ApiConst = require('./ApiConst'),
  TRUCK_MODEL_DATA = require('./TruckModelData').list,
  PAGE_SIZE = 10000,
  area = require('./area.json'),
  // defineUrl = `${ApiConst.orgConfigUrl}/element_type/define`,
  // typeUrl = `${ApiConst.orgConfigUrl}/element_type/info`,
  LOCAL_CACHE = {};

axios.defaults.withCredentials = true;

/**
 * 封装Get请求
 * @param url 请求的URL
 * @param successCallback 成功回调函数
 * @param errorCallback 失败回调函数
 */
function get(url, successCallback, errorCallback) {
  axios.get(url).then((res) => {
    const data = res.data;
    successCallback(data.content, data.total);
  }).catch((err) => {
    console.error(err);
    errorCallback(err);
  });
}

function post(url, param, successCallback, errorCallback) {
  axios.post(url, param).then((res) => {
    const data = res.data;
    successCallback(data.content);
  }).catch((err) => {
    console.error(err);
    errorCallback(err);
  });
}

//
const dataSourcesObj = {};

/**
 * 车型数据源
 * @param params <p>
 *                  keyword => 关键词
 *               </p>
 * @param callback
 */
const truckModel = dataSourcesObj.truckModel = {
  getData(params, callback) {
    callback(TRUCK_MODEL_DATA, null);
  },
  getDetailUrl(code, objectName) {
    return null;
  }
};


/**
 * 计量单位数据源
 * @param type
 * @param keyword
 * @param callback
 */
function measureUnit(type, codeUnitType, keyword, callback) {
  // console.log('type in LOCAL_CACHE', type, LOCAL_CACHE, (type in LOCAL_CACHE));
  const realType = `${type}|${codeUnitType}`;
  if (!(realType in LOCAL_CACHE)) {
    LOCAL_CACHE[realType] = [callback];
    let url = `${ApiConst.apiOrgConfigDomain}/measure_unit/${type}/get`;
    if (codeUnitType) {
      url += `?codeUnitType=${codeUnitType}`;
    }
    get(url, (data) => {
      const len = data.length,
        autoData = [];
      for (let i = 0; i < len; i += 1) {
        autoData.push({
          'id': data[i].code,
          'value': data[i].codeName,
          'name': data[i].codeName,
          'data': data[i]
        });
      }
      // console.log('set cache for', type, LOCAL_CACHE);
      // callback(autoData, null);
      if (LOCAL_CACHE[realType].length) {
        LOCAL_CACHE[realType].forEach((cb) => {
          cb(autoData, null);
        });
      }
      delete LOCAL_CACHE[realType];
    }, (err) => {
      console.error(err);
      // callback(null, err);
      if (LOCAL_CACHE[realType].length) {
        LOCAL_CACHE[realType].forEach((cb) => {
          cb(null, err);
        });
      }
      delete LOCAL_CACHE[realType];
    });
  } else {
    LOCAL_CACHE[realType].push(callback);
    // callback(LOCAL_CACHE[type], null);
  }
}

/**
 * 车辆尺寸单位数据源
 * @param params <p>
 *                  keyword => 关键词
 *                  codeUnitType => 单位类型 ton、truck、cube
 *               </p>
 * @param callback
 */
const truckSize = dataSourcesObj.truckSize = {
  getData(params, callback) {
    measureUnit('truck.size', params.codeUnitType, params.keyword, callback);
  },
  getDetailUrl(code, objectName) {
    return null;
  }
};

/**
 * 轮胎纹深单位数据源
 * @param params <p>
 *                  keyword => 关键词
 *                  codeUnitType => 单位类型 mm
 *               </p>
 * @param callback
 */
const tyrewrinklesNumber = dataSourcesObj.tyrewrinklesNumber = {
  getData(params, callback) {
    measureUnit('tyrewrinkles.number', params.codeUnitType, params.keyword, callback);
  },
  getDetailUrl(code, objectName) {
    return null;
  }
};

/**
 * 车辆载重单位数据源
 * @param params <p>
 *                  keyword => 关键词
 *                  codeUnitType => 单位类型 ton、truck、cube
 *               </p>
 * @param callback
 */
const truckCarry = dataSourcesObj.truckCarry = {
  getData(params, callback) {
    measureUnit('truck.carry', params.codeUnitType, params.keyword, callback);
  },
  getDetailUrl(code, objectName) {
    return null;
  }
};

/**
 * 车辆容积单位数据源
 * @param params <p>
 *                  keyword => 关键词
 *                  codeUnitType => 单位类型 ton、truck、cube
 *               </p>
 * @param callback
 */
const truckCubage = dataSourcesObj.truckCubage = {
  getData(params, callback) {
    measureUnit('truck.cubage', params.codeUnitType, params.keyword, callback);
  },
  getDetailUrl(code, objectName) {
    return null;
  }
};

/**
 * 司机运价单位数据源
 * @param params <p>
 *                  keyword => 关键词
 *                  codeUnitType => 单位类型 ton、truck、cube
 *               </p>
 * @param callback
 */
const driverPrice = dataSourcesObj.driverPrice = {
  getData(params, callback) {
    measureUnit('driver.price', params.codeUnitType, params.keyword, callback);
  },
  getDetailUrl(code, objectName) {
    return null;
  }
};

// 货物分类
const goodsCategory = dataSourcesObj.goodsCategory = {
  getData(params, callback) {
    let url = `${ApiConst.apiLineDomain}/resource/resource_goods_category/list`;
       
    get(url, (data) => {

      const len = data.length,
        autoData = [];
      for (let i = 0; i < len; i += 1) {
        autoData.push({
          'id': data[i].code,
          'value': data[i].goodsCategoryName,
          'name': data[i].goodsCategoryName,
          'data': data[i]
        });
      };
      callback(autoData,null)
    })
  },
  getDetailUrl(code, objectName) {
    return null;
  }
};


/**
 * 标准时长单位数据源
 * @param params <p>
 *                  keyword => 关键词
 *                  codeUnitType => 单位类型 ton、truck、cube
 *               </p>
 * @param callback
 */
const routeDuration = dataSourcesObj.routeDuration = {
  getData(params, callback) {
    measureUnit('route.duration', params.codeUnitType, params.keyword, callback);
  },
  getDetailUrl(code, objectName) {
    return null;
  }
};

/**
 * 货物单价单位数据源
 * @param params <p>
 *                  keyword => 关键词
 *                  codeUnitType => 单位类型 ton、truck、cube
 *               </p>
 * @param callback
 */
const goodsPrice = dataSourcesObj.goodsPrice = {
  getData(params, callback) {
    let codeUnitType = params.codeUnitType;
    if (codeUnitType === 'truck') {
      codeUnitType = undefined;
    }
    measureUnit('goods.price', codeUnitType, params.keyword, callback);
  },
  getDetailUrl(code, objectName) {
    return null;
  }
};

/**
 * 承运价单位数据源
 * @param params <p>
 *                  keyword => 关键词
 *                  codeUnitType => 单位类型 ton、truck、cube
 *               </p>
 * @param callback
 */
const carrierPrice = dataSourcesObj.carrierPrice = {
  getData(params, callback) {
    measureUnit('carrier.price', params.codeUnitType, params.keyword, callback);
  },
  getDetailUrl(code, objectName) {
    return null;
  }
};

/**
 * 货物数量单位数据源
 * @param params <p>
 *                  keyword => 关键词
 *                  codeUnitType => 单位类型 ton、truck、cube
 *               </p>
 * @param callback
 */
const goodsNumber = dataSourcesObj.goodsNumber = {
  getData(params, callback) {
    measureUnit('goods.number', params.codeUnitType, params.keyword, callback);
  },
  getDetailUrl(code, objectName) {
    return null;
  }
};

/**
 * 货量单位数据源
 * @param params <p>
 *                  keyword => 关键词
 *                  codeUnitType => 单位类型 ton、truck、cube
 *               </p>
 * @param callback
 */
const goodsVolume = dataSourcesObj.goodsVolume = {
  getData(params, callback) {
    measureUnit('goods.volume', params.codeUnitType, params.keyword, callback);
  },
  getDetailUrl(code, objectName) {
    return null;
  }
};

/**
 * 货物重量单位数据源
 * @param params <p>
 *                  keyword => 关键词
 *                  codeUnitType => 单位类型 ton、truck、cube
 *               </p>
 * @param callback
 */
const goodsWeight = dataSourcesObj.goodsWeight = {
  getData(params, callback) {
    measureUnit('goods.weight', params.codeUnitType, params.keyword, callback);
  },
  getDetailUrl(code, objectName) {
    return null;
  }
};

/**
 * 合理货差系数单位数据源
 * @param params <p>
 *                  keyword => 关键词
 *                  codeUnitType => 单位类型 ton、truck、cube
 *               </p>
 * @param callback
 */
const goodsLossRation = dataSourcesObj.goodsLossRation = {
  getData(params, callback) {
    measureUnit('goods.loss.ration', null, params.keyword, callback);
  },
  getDetailUrl(code, objectName) {
    return null;
  }
};

/**
 * 合理货差单位数据源
 * @param params <p>
 *                  keyword => 关键词
 *                  codeUnitType => 单位类型 ton、truck、cube
 *               </p>
 * @param callback
 */
const goodsLoss = dataSourcesObj.goodsLoss = {
  getData(params, callback) {
    let codeUnitType = params.codeUnitType;
    if (codeUnitType === 'truck') {
      codeUnitType = undefined;
    }
    measureUnit('goods.loss', codeUnitType, params.keyword, callback);
  },
  getDetailUrl(code, objectName) {
    return null;
  }
};

/**
 * 标准运距单位数据源
 * @param params <p>
 *                  keyword => 关键词
 *                  codeUnitType => 单位类型 ton、truck、cube
 *               </p>
 * @param callback
 */
const standardDistance = dataSourcesObj.standardDistance = {
  getData(params, callback) {
    measureUnit('standard.distance', params.codeUnitType, params.keyword, callback);
  },
  getDetailUrl(code, objectName) {
    return null;
  }
};

/**
 * 费用科目数量单位数据源
 * @param params <p>
 *                  keyword => 关键词
 *                  codeUnitType => 单位类型 ton、truck、cube
 *               </p>
 * @param callback
 */
const chargeItemNumber = dataSourcesObj.chargeItemNumber = {
  getData(params, callback) {
    measureUnit('settle.volume.unit', params.codeUnitType, params.keyword, callback);
  },
  getDetailUrl(code, objectName) {
    return null;
  }
};

/**
 * 费用科目价格单位数据源
 * @param params <p>
 *                  keyword => 关键词
 *                  codeUnitType => 单位类型 ton、truck、cube
 *               </p>
 * @param callback
 */
const chargeItemPrice = dataSourcesObj.chargeItemPrice = {
  getData(params, callback) {
    measureUnit('goods.price', params.codeUnitType, params.keyword, callback);
  },
  getDetailUrl(code, objectName) {
    return null;
  }
};

/**
 * 结算货量单位数据源
 * @param params <p>
 *                  keyword => 关键词
 *                  codeUnitType => 单位类型 ton、truck、cube
 *               </p>
 * @param callback
 */
const settleVolumeUnit = dataSourcesObj.settleVolumeUnit = {
  getData(params, callback) {
    measureUnit('settle.volume.unit', params.codeUnitType, params.keyword, callback);
  },
  getDetailUrl(code, objectName) {
    return null;
  }
};

/**
 * 费用科目金额单位数据源
 * @param params <p>
 *                  keyword => 关键词
 *                  codeUnitType => 单位类型 ton、truck、cube
 *               </p>
 * @param callback
 */
const chargeItemAmount = dataSourcesObj.chargeItemAmount = {
  getData(params, callback) {
    measureUnit('price.unit', params.codeUnitType, params.keyword, callback);
  },
  getDetailUrl(code, objectName) {
    return null;
  }
};

function _getConfig(urlData, filter, cb) {
  const configData = [];
  urlData.content.forEach((val) => {
    if (filter.indexOf(val.fieldConfigCode) > -1) {
      configData.push(val);
    }
  });
  cb({ content: configData }, null);
}

function _getListData(url, cb) {
  get(url, (data, total) => {
    cb({ content: data, total: total }, null);
  }, (err) => {
    cb(null, err);
  });
}

function _getDetailData(params, url, cb) {
  get(url, (data) => {
    cb(data, null);
  }, (err) => {
    cb(null, err);
  });
}

// goodsNameAutocomplete
const goodsName = dataSourcesObj.goodsName = {
  getData(params, callback) {
    let url = `${ApiConst.apiLineDomain}/resource/resource_goods/list?size=${PAGE_SIZE}&keyword=${params.keyword}`;
    get(url, (data) => {
      const len = data.length,
        autoData = [];
      for (let i = 0; i < len; i += 1) {
        autoData.push({
          'id': data[i].code,
          'value': `${data[i].goodsName ? data[i].goodsName : '-'}`,
          'name': `${data[i].goodsName ? data[i].goodsName : data[i].code}`,
          'data': data[i]
        });
      }
      callback(autoData, null);
    }, (err) => {
      console.error(err);
      callback(null, err);
    });
  }
};

/**
 * 车辆数据源
 * @param params <p>
 *                  keyword => 关键词
 *               </p>
 * @param callback
 */
const truck = dataSourcesObj.truck = {
  getData(params, callback) {
    const url = `${ApiConst.apiTruckDomain}/truck/list?size=${PAGE_SIZE}&keyword=${params.keyword}`;
    // console.log('test', { 'keyword': keyword, 'size': PAGE_SIZE });
    get(url, (data) => {
      const len = data.length,
        autoData = [];
      for (let i = 0; i < len; i += 1) {
        autoData.push({
          'id': data[i].code,
          'value': `${data[i].truckLicenseNo ? data[i].truckLicenseNo : '-'}`,
          'name': `${data[i].truckLicenseNo ? data[i].truckLicenseNo : data[i].code}`,
          'data': data[i]
        });
      }
      callback(autoData, null);
    }, (err) => {
      console.error(err);
      callback(null, err);
    });
  },
  getObjectName() {
    return '车辆';
  },
  getDetailUrl(code, objectName) {
    // return `/truck/add.html?code=${code}&editable=false&objectName=${encodeURIComponent(objectName)}`;
    return '/truck/add.html';
  },
  getEditUrl(code, objectName) {
    // return `/truck/add.html?code=${code}&editable=true&objectName=${encodeURIComponent(objectName)}`;
    return '/truck/add.html';
  },
  getAddUrl(objectName) {
    // return `/truck/add.html?objectName=${encodeURIComponent(objectName)}`;
    return '/truck/add.html';
  },
  getColumns(cb) {
    const filter = ['truckLicenseNo'];
    var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/truck/truck/list_render_info.json`)
    success = JSON.parse(JSON.stringify(success));

    _getConfig(success, filter, cb);
  },
  getSearch(cb) {
    const filter = ['truckLicenseNo'];
    var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/truck/truck/search_render_info.json`)
    success = JSON.parse(JSON.stringify(success));
    _getConfig(success, filter, cb); // fix-it|
  },
  getListData(paramsObj, callback) {
    const url = `${ApiConst.apiTruckDomain}/truck/list?${objToParamStr(paramsObj)}`;
    _getListData(url, callback);
  },
  getDetailData(paramsObj, callback) {
    const url = `${ApiConst.apiTruckDomain}/truck/null/get?truckCode=${paramsObj.truckCode}`;
    _getDetailData(paramsObj, url, callback);
  }
};

/**
 * 挂车数据源
 * @param params <p>
 *                  keyword => 关键词
 *               </p>
 * @param callback
 */
const trailer = dataSourcesObj.trailer = {
  getData(params, callback) {
    const url = `${ApiConst.apiTruckDomain}/trailer/list?size=${PAGE_SIZE}&keyword=${params.keyword}`;
    get(url, (data) => {
      const len = data.length,
        autoData = [];
      for (let i = 0; i < len; i += 1) {
        autoData.push({
          'id': data[i].code,
          'value': `${data[i].truckLicenseNo ? data[i].truckLicenseNo : '-'}`,
          'name': `${data[i].truckLicenseNo ? data[i].truckLicenseNo : data[i].code}`,
          'data': data[i]
        });
      }
      callback(autoData, null);
    }, (err) => {
      console.error(err);
      callback(null, err);
    });
  },
  getObjectName() {
    return '挂车';
  },
  getDetailUrl(code, objectName) {
    // return `/trailer/add.html?code=${code}&editable=false&objectName=${encodeURIComponent(objectName)}`;
    return '/trailer/add.html';
  },
  getEditUrl(code, objectName) {
    // return `/trailer/add.html?code=${code}&editable=true&objectName=${encodeURIComponent(objectName)}`;
    return '/trailer/add.html';
  },
  getAddUrl(objectName) {
    // return `/trailer/add.html?objectName=${encodeURIComponent(objectName)}`;
    return '/trailer/add.html';
  },
  getColumns(cb) {
    const config = ['truckLicenseNo','certStatus'];
    var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/truck/trailer/list_render_info.json`)
    success = JSON.parse(JSON.stringify(success));
    _getConfig(success, config, cb); // fix-it|
  },
  getSearch(cb) {
    const config = ['truckLicenseNo'];
    var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/truck/trailer/search_render_info.json`)
    success = JSON.parse(JSON.stringify(success));
    _getConfig(success, config, cb); // fix-it|
  },
  getListData(paramsObj, callback) {
    const url = `${ApiConst.apiTruckDomain}/trailer/list?${objToParamStr(paramsObj)}`;
    _getListData(url, callback);
  },
  getDetailData(paramsObj, callback) {
    const url = `${ApiConst.apiTruckDomain}/trailer/null/get?truckCode=${paramsObj.truckCode}`;
    _getDetailData(paramsObj, url, callback);
  }
};
/**
 * 所有车辆数据源，不分主挂车
 * @type {{getData: (function(*, *)), getObjectName: (function()), getDetailUrl: (function(*, *)), getEditUrl: (function(*, *)), getAddUrl: (function(*)), getColumns: (function(*=)), getSearch: (function(*=)), getListData: (function(*=, *=))}}
 */
const allTruck = dataSourcesObj.allTruck = {
  getData(params, callback) {
    const url = `${ApiConst.apiTruckDomain}/truck/all/list?size=${PAGE_SIZE}&keyword=${params.keyword}`;
    // console.log('test', { 'keyword': keyword, 'size': PAGE_SIZE });
    get(url, (data) => {
      const len = data.length,
        autoData = [];
      for (let i = 0; i < len; i += 1) {
        autoData.push({
          'id': data[i].code,
          'value': `${data[i].truckLicenseNo ? data[i].truckLicenseNo : '-'}`,
          'name': `${data[i].truckLicenseNo ? data[i].truckLicenseNo : data[i].code}`,
          'data': data[i]
        });
      }
      callback(autoData, null);
    }, (err) => {
      console.error(err);
      callback(null, err);
    });
  },
  getObjectName() {
    return '车辆';
  },
  getDetailUrl(code, objectName, object) {
    if (object && object.isTrailer) {
      return '/trailer/add.html';
    }
    // return `/truck/add.html?code=${code}&editable=false&objectName=${encodeURIComponent(objectName)}`;
    return '/truck/add.html';
  },
  getEditUrl(code, objectName, object) {
    if (object && object.isTrailer) {
      return '/trailer/add.html';
    }
    // return `/truck/add.html?code=${code}&editable=true&objectName=${encodeURIComponent(objectName)}`;
    return '/truck/add.html';
  },
  getAddUrl(objectName) {
    // return `/truck/add.html?objectName=${encodeURIComponent(objectName)}`;
    return '/truck/add.html';
  },
  getColumns(cb) {
    const filter = ['truckLicenseNo'];
    var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/truck/truck/list_render_info.json`)
    success = JSON.parse(JSON.stringify(success));
    _getConfig(success, filter, cb); // fix-it|
  },
  getSearch(cb) {
    const filter = ['truckLicenseNo'];
    var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/truck/truck/search_render_info.json`)
    success = JSON.parse(JSON.stringify(success));
    _getConfig(success, filter, cb); // fix-it|
  },
  getListData(paramsObj, callback) {
    const url = `${ApiConst.apiTruckDomain}/truck/all/list?${objToParamStr(paramsObj)}`;
    _getListData(url, callback);
  }
};

/**
 * 司机数据源
 * @param params <p>
 *                  keyword => 关键词
 *               </p>
 * @param callback
 */
const driver = dataSourcesObj.driver = {
  getData(params, callback) {
    const url = `${ApiConst.apiPersonDomain}/person/driver/list?size=${PAGE_SIZE}&keyword=${params.keyword}`;
    get(url, (data) => {
      const len = data.length,
        autoData = [];
      for (let i = 0; i < len; i += 1) {
        autoData.push({
          'id': data[i].code,
          'value': `${data[i].fullName ? data[i].fullName : '-'} - ${data[i].phone ? data[i].phone : '-'}`,
          'name': `${data[i].fullName ? data[i].fullName : data[i].code}`,
          'data': data[i]
        });
      }
      callback(autoData, null);
    }, (err) => {
      console.error(err);
      callback(null, err);
    });
  },
  getDetailUrl(code, objectName) {
    // return `/driver/add.html?code=${code}&editable=false&objectName=${encodeURIComponent(objectName)}`;
    return '/driver/add.html';
  },
  getAddUrl(objectName) {
    // return `/driver/add.html?objectName=${encodeURIComponent(objectName)}`;
    return '/driver/add.html';
  },
  getEditUrl(code, objectName) {
    return '/driver/add.html';
  },
  getObjectName() {
    return '司机';
  },
  getSearch(cb) {
    const filter = ['fullName'];
    var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/person/driver/search_render_info.json`)
    success = JSON.parse(JSON.stringify(success));
    _getConfig(success, filter, cb); // fix-it|
  },
  getColumns(cb) {
    const filter = ['fullName','certStatus', 'phone', 'userTag'];
    var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/person/driver/list_render_info.json`)
    success = JSON.parse(JSON.stringify(success));
    _getConfig(success, filter, cb); // fix-it|
  },
  getListData(paramsObj, callback) {
    const url = `${ApiConst.apiPersonDomain}/person/driver/list?${objToParamStr(paramsObj)}`;
    _getListData(url, callback);
  },
  getDetailData(paramsObj, callback) {
    const url = `${ApiConst.apiPersonDomain}/person/driver/null/get?userCode=${paramsObj.userCode}`;
    _getDetailData(paramsObj, url, callback);
  }
};

/**
 * 伙伴数据源
 * @param params <p>
 *                  keyword => 关键词
 *               </p>
 * @param callback
 */
const partner = dataSourcesObj.partner = {
  getData(params, callback) {
    const url = `${ApiConst.apiOrgDomain}/partner/list?size=${PAGE_SIZE}&keyword=${params.keyword}`;
    get(url, (data) => {
      const len = data.length,
        autoData = [];
      for (let i = 0; i < len; i += 1) {
        autoData.push({
          'id': data[i].code,
          'value': `${data[i].orgName ? data[i].orgName : '-'}(${data[i].linkmanFullName ? data[i].linkmanFullName : '-'})`,
          'name': `${data[i].orgName ? data[i].orgName : data[i].code}`,
          'data': data[i]
        });
      }
      callback(autoData, null);
    }, (err) => {
      console.error(err);
      callback(null, err);
    });
  },
  getObjectName() {
    return '伙伴';
  },
  getDetailUrl(code, objectName) {
    // return `/partner/add.html?code=${code}&editable=false&objectName=${encodeURIComponent(objectName)}`;
    return '/partner/add.html';
  },
  getEditUrl(code, objectName) {
    // return `/partner/add.html?code=${code}&editable=true&objectName=${encodeURIComponent(objectName)}`;
    return '/partner/add.html';
  },
  getAddUrl(objectName) {
    // return `/partner/add.html?objectName=${encodeURIComponent(objectName)}`;
    return '/partner/add.html';
  },
  getColumns(cb) {
    const filter = ['orgName', 'certStatus'];
    var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/org/partner/list_render_info.json`)
    success = JSON.parse(JSON.stringify(success));
    _getConfig(success, filter, cb); // fix-it|
  },
  getSearch(cb) {
    const filter = ['orgName'];
    var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/org/partner/search_render_info.json`)
    success = JSON.parse(JSON.stringify(success));
    _getConfig(success, filter, cb); // fix-it|
  },
  getListData(paramsObj, callback) {
    const url = `${ApiConst.apiOrgDomain}/partner/list?${objToParamStr(paramsObj)}`;
    _getListData(url, callback);
  },
  getDetailData(paramsObj, callback) {
    const url = `${ApiConst.apiOrgDomain}/partner/null/get?orgCode=${paramsObj.orgCode}`;
    _getDetailData(paramsObj, url, callback);
  }
};

// 货物名称 的数据源
const popGoods = dataSourcesObj.popGoods = {
  getData(params, callback) {
    const url = `${ApiConst.apiResourceDomain}/resource/resource_goods/list?size=${PAGE_SIZE}&keyword=${params.keyword}`;
    get(url, (data) => {
      const len = data.length,
        autoData = [];
      for (let i = 0; i < len; i += 1) {
        autoData.push({
          'id': data[i].code,
          'value': data[i].goodsName,
          'name': data[i].goodsName,
          'data': data[i]
        });
      }
      callback(autoData, null);
    }, (err) => {
      console.error(err);
      callback(null, err);
    });
  },
  getObjectName() {
    return '货物名称';
  },
  getDetailUrl(code, objectName) {
    return '/resourceGoods/add.html';
  },
  getEditUrl(code, objectName) {
    return '/resourceGoods/add.html';
  },
  getAddUrl(objectName) {
    return '/resourceGoods/add.html';
  },
  getColumns(cb) {
    const filter = ['goodsSystemNo', 'goodsNo','goodsName','goodsCategoryName','goodsCategoryGb','meterageType','goodsPrice','creatorUser','createTime'];
    var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/resource/resourceGoods/list_render_info.json`)
    success = JSON.parse(JSON.stringify(success));
    _getConfig(success, filter, cb); // fix-it|
  },
  getSearch(cb) {
    const filter = ['goodsSystemNo','goodsName'];
    var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/resource/resourceGoods/search_render_info.json`)
    success = JSON.parse(JSON.stringify(success));
    _getConfig(success, filter, cb); 
  },
  getListData(paramsObj, callback) {
    const url = `${ApiConst.apiResourceDomain}/resource/resource_goods/list?${objToParamStr(paramsObj)}`;
    _getListData(url, callback);
  },
  getDetailData(paramsObj, callback) {
    const url = `${ApiConst.apiResourceDomain}/resource/resource_goods/${paramsObj.code}/get?code=${paramsObj.code}`;
    _getDetailData(paramsObj, url, callback);
  }
};

// 货物名称 的数据源
const popGoodsCategory = dataSourcesObj.popGoodsCategory = {
  getData(params, callback) {
    const url = `${ApiConst.apiResourceDomain}/resource/resource_goods_category/list?size=${PAGE_SIZE}&keyword=${params.keyword}`;
    get(url, (data) => {
      const len = data.length,
        autoData = [];
      for (let i = 0; i < len; i += 1) {
        autoData.push({
          'id': data[i].code,
          'value': data[i].goodsCategoryName,
          'name': data[i].goodsCategoryName,
          'data': data[i]
        });
      }
      callback(autoData, null);
    }, (err) => {
      console.error(err);
      callback(null, err);
    });
  },
  getObjectName() {
    return '货物分类';
  },
  getDetailUrl(code, objectName) {
    return '/resourceGoodsCategory/add.html';
  },
  getEditUrl(code, objectName) {
    return '/resourceGoodsCategory/add.html';
  },
  getAddUrl(objectName) {
    return '/resourceGoodsCategory/add.html';
  },
  getColumns(cb) {
    const filter = ['goodsCategorySystemNo', 'goodsCategoryNo','goodsCategoryName','goodsCategoryGb','meterageType','creatorUser','createTime'];
    var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/resource/resourceGoodsCategory/list_render_info.json`)
    success = JSON.parse(JSON.stringify(success));
    _getConfig(success, filter, cb); // fix-it|
  },
  getSearch(cb) {
    const filter = ['goodsCategoryNo','goodsCategoryName'];
    var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/resource/resourceGoodsCategory/search_render_info.json`)
    success = JSON.parse(JSON.stringify(success));
    _getConfig(success, filter, cb); 
  },
  getListData(paramsObj, callback) {
    const url = `${ApiConst.apiResourceDomain}/resource/resource_goods_category/list?${objToParamStr(paramsObj)}`;
    _getListData(url, callback);
  },
  getDetailData(paramsObj, callback) {
    const url = `${ApiConst.apiResourceDomain}/resource/resource_goods_category/${paramsObj.code}/get?code=${paramsObj.code}`;
    _getDetailData(paramsObj, url, callback);
  }
};
/**
 * 公司数据源
 * @param params <p>
 *                  keyword => 关键词
 *               </p>
 * @param callback
 */
const company = dataSourcesObj.company = {
  getData(params, callback) {
    const url = `${ApiConst.apiPlatformDomain}/cert_org/org/list?size=${PAGE_SIZE}&keyword=${params.keyword}`;
    get(url, (data) => {
      const len = data.length,
        autoData = [];
      for (let i = 0; i < len; i += 1) {
        autoData.push({
          'id': data[i].code,
          'value': `${data[i].ownerOrgName ? data[i].ownerOrgName : '-'}(${data[i].linkmanFullName ? data[i].linkmanFullName : '-'})`,
          'name': `${data[i].ownerOrgName ? data[i].ownerOrgName : data[i].code}`,
          'data': data[i]
        });
      }
      callback(autoData, null);
    }, (err) => {
      console.error(err);
      callback(null, err);
    });
  },
  getObjectName() {
    return '公司';
  },
  getDetailUrl(code, objectName) {
    // return `/partner/add.html?code=${code}&editable=false&objectName=${encodeURIComponent(objectName)}`;
    return '/orgManagement/add.html';
  },
  getEditUrl(code, objectName) {
    // return `/partner/add.html?code=${code}&editable=true&objectName=${encodeURIComponent(objectName)}`;
    return '/orgManagement/add.html';
  },
  getAddUrl(objectName) {
    // return `/partner/add.html?objectName=${encodeURIComponent(objectName)}`;
    return '/orgManagement/add.html';
  },
  getColumns(cb) {
    const success = {
      code: 200,
      content: [{
        showName: '公司名称',
        fieldConfigCode: 'orgFullName',
        elementCode: 'label',
        extraParams: '{"field1":"orgFullName","field2":"orgCode","field3":"pop"}'
      }]
    };
    cb(success);
    return success;
  },
  getSearch(cb) {
    const success = {
      code: 200,
      content: [{
        showName: '公司名称',
        fieldConfigCode: 'orgName',
        elementCode: 'text',
        extraParams: '{"field1":"orgName", "placeholder1":"请输入公司名称"}'
      }]
    };
    cb(success);
    return success;
  },
  getListData(paramsObj, callback) {
    const url = `${ApiConst.apiPlatformDomain}/cert_org/org/list?${objToParamStr(paramsObj)}`;
    _getListData(url, callback);
  }
};

/**
 * 组织数据源
 * @param params <p>
 *                  keyword => 关键词
 *               </p>
 * @param callback
 */
const orgManager = dataSourcesObj.orgManager = {
  getData(params, callback) {
    const url = `${ApiConst.apiPlatformDomain}/org/manager/list?size=${PAGE_SIZE}&keyword=${params.keyword}`;
    get(url, (data) => {
      const len = data.length,
        autoData = [];
      for (let i = 0; i < len; i += 1) {
        autoData.push({
          'id': data[i].code,
          'value': `${data[i].ownerOrgName ? data[i].ownerOrgName : '-'}(${data[i].linkmanFullName ? data[i].linkmanFullName : '-'})`,
          'name': `${data[i].ownerOrgName ? data[i].ownerOrgName : data[i].code}`,
          'data': data[i]
        });
      }
      callback(autoData, null);
    }, (err) => {
      console.error(err);
      callback(null, err);
    });
  },
  getObjectName() {
    return '公司';
  },
  getDetailUrl(code, objectName) {
    // return `/partner/add.html?code=${code}&editable=false&objectName=${encodeURIComponent(objectName)}`;
    return '/orgManagement/add.html';
  },
  getEditUrl(code, objectName) {
    // return `/partner/add.html?code=${code}&editable=true&objectName=${encodeURIComponent(objectName)}`;
    return '/orgManagement/add.html';
  },
  getAddUrl(objectName) {
    // return `/partner/add.html?objectName=${encodeURIComponent(objectName)}`;
    return '/orgManagement/add.html';
  },
  getColumns(cb) {
    const success = {
      code: 200,
      content: [{
          showName: '公司名称',
          fieldConfigCode: 'orgFullName',
          elementCode: 'label',
          extraParams: '{"field1":"orgFullName","field2":"orgCode","field3":"pop"}'
        },
        {
          showName: '认证状态',
          elementCode: 'select',
          extraParams: '{"field1":"certStatus","default1":"unauthenticated","optionsValue1":["unauthenticated","authenticating","authenticated","failed"],"options1":["未认证","认证中","已认证","认证失败"]}',
          fieldConfigCode: 'certStatus'
        }
      ]
    };
    cb(success);
    return success;
  },
  getSearch(cb) {
    const success = {
      code: 200,
      content: [{
        showName: '公司名称',
        fieldConfigCode: 'orgFullName',
        elementCode: 'text',
        extraParams: '{"field1":"orgFullName", "placeholder1":"请输入公司名称"}'
      }]
    };
    cb(success);
    return success;
  },
  getListData(paramsObj, callback) {
    const url = `${ApiConst.apiPlatformDomain}/org/manager/list?${objToParamStr(paramsObj)}`;
    _getListData(url, callback);
  }
};

/**
 * 银行账户数据源
 * @param params <p>
 *                  keyword => 关键词
 *               </p>
 * @param callback
 */
const bankAccount = dataSourcesObj.bankAccount = {
  getData(params, callback) {
    const url = `${ApiConst.apiOrgDomain}/org/bank/account/list?size=${PAGE_SIZE}&keyword=${params.keyword}`;
    get(url, (data) => {
      const len = data.length,
        autoData = [];
      for (let i = 0; i < len; i += 1) {
        autoData.push({
          'id': data[i].code,
          'value': `${data[i].bankName ? data[i].bankName : '-'}(${data[i].bankAccountNo ? data[i].bankAccountNo : '-'})`,
          'name': `${data[i].bankAccountName ? data[i].bankAccountName : data[i].code}`,
          'data': data[i]
        });
      }
      callback(autoData, null);
    }, (err) => {
      console.error(err);
      callback(null, err);
    });
  },
  getObjectName() {
    return '银行账户';
  },
  getDetailUrl(code, objectName) {
    // return `/partner/add.html?code=${code}&editable=false&objectName=${encodeURIComponent(objectName)}`;
    return '/bankAccount/add.html';
  },
  getEditUrl(code, objectName) {
    // return `/partner/add.html?code=${code}&editable=true&objectName=${encodeURIComponent(objectName)}`;
    return '/bankAccount/add.html';
  },
  getAddUrl(objectName) {
    // return `/partner/add.html?objectName=${encodeURIComponent(objectName)}`;
    return '/bankAccount/add.html';
  },
  getColumns(cb) {
    const success = {
      code: 200,
      content: [{
          showName: '银行户名',
          fieldConfigCode: 'bankAccountName',
          elementCode: 'label',
          extraParams: '{"field1": "bankAccountName", "required": "false"}'
        },
        {
          showName: '开户行',
          fieldConfigCode: 'bankName',
          elementCode: 'label',
          extraParams: '{"field1": "bankName", "required": "false"}'
        },
        {
          showName: '银行账号',
          fieldConfigCode: 'bankAccountNo',
          elementCode: 'text',
          extraParams: '{"field1": "bankAccountNo", "required": "true", "detailLinkVisiable":"true"}'
        },
        {
          showName: '描述',
          fieldConfigCode: 'description',
          elementCode: 'label',
          extraParams: '{"field1": "description", "required": "false"}'
        },
        {
          showName: '创建人',
          fieldConfigCode: 'creatorUsername',
          elementCode: 'label',
          extraParams: '{"field1": "creatorUsername", "required": "false"}'
        },
        {
          showName: '创建时间',
          fieldConfigCode: 'createTime',
          elementCode: 'label',
          extraParams: '{"field1": "createTime", "required": "false"}'
        },
        {
          showName: '修改人',
          fieldConfigCode: 'updateUsername',
          elementCode: 'label',
          extraParams: '{"field1": "updateUsername", "required": "false"}'
        },
        {
          showName: '修改时间',
          fieldConfigCode: 'updateTime',
          elementCode: 'label',
          extraParams: '{"field1": "updateTime", "required": "false"}'
        }
      ]
    };
    cb(success);
    return success;
  },
  getSearch(cb) {
    const success = {
      code: 200,
      content: [{
        showName: '银行账号',
        fieldConfigCode: 'bankAccountNo',
        elementCode: 'text',
        extraParams: '{"field1": "bankAccountNo", "placeholder1":"请输入银行账号"}'
      }]
    };
    cb(success);
    return success;
  },
  getListData(paramsObj, callback) {
    const url = `${ApiConst.apiOrgDomain}/org/bank/account/list?${objToParamStr(paramsObj)}`;
    _getListData(url, callback);
  }
};

/**
 * 运单数据源
 * @param params <p>
 *                  keyword => 关键词
 *               </p>
 * @param callback
 */
const waybill = dataSourcesObj.waybill = {
  getData(params, callback) {
    const url = `${ApiConst.apiWayBillDomain}/waybill/list?size=${PAGE_SIZE}&keyword=${params.keyword}`;
    get(url, (data) => {
      const len = data.length,
        autoData = [];
      for (let i = 0; i < len; i += 1) {
        autoData.push({
          'id': data[i].code,
          'value': `${data[i].waybillNo ? data[i].waybillNo : ''}-${data[i].goodsName ? data[i].goodsName : ''}-${data[i].routeName ? data[i].routeName : ''}`,
          'name': `${data[i].waybillNo ? data[i].waybillNo : data[i].code}`,
          'data': data[i]
        });
      }

      callback(autoData, null);
    }, (err) => {
      console.error(err);
      callback(null, err);
    });
  },
  getDetailUrl(code, objectName) {
    return '/waybill/add.html';
    // return `/waybill/add.html?code=${code}&editable=false&objectName=${encodeURIComponent(objectName)}`;
  },
  getObjectName() {
    return '运单';
  },
  getDetailUrl(code, objectName) {
    console.log
    // return `/partner/add.html?code=${code}&editable=false&objectName=${encodeURIComponent(objectName)}`;
    return '/waybill/add.html';
  },
  getEditUrl(code, objectName) {
    // return `/partner/add.html?code=${code}&editable=true&objectName=${encodeURIComponent(objectName)}`;
    return '/waybill/add.html';
  },
  getAddUrl(objectName) {
    // return `/partner/add.html?objectName=${encodeURIComponent(objectName)}`;
    return '/waybill/add.html';
  },
  getColumns(cb) {
    const filter = ['waybillNo', 'goodsName'];
    var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/waybill/waybill/list_render_info.json`)
    success = JSON.parse(JSON.stringify(success));
    _getConfig(success, filter, cb); // fix-it|
  },
  getSearch(cb) {
    const filter = ['waybillNo'];
    var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/waybill/waybill/search_render_info.json`)
    success = JSON.parse(JSON.stringify(success));
    _getConfig(success, filter, cb); // fix-it|
  },
  getListData(paramsObj, callback) {
    const url = `${ApiConst.apiWayBillDomain}/waybill/list?${objToParamStr(paramsObj)}`;
    _getListData(url, callback);
  }
};


/**
 * 询价单数据源    只是用了一下链接 ，所以李阿敏waybill 是没有用的
 * @param params <p>
 *                  keyword => 关键词
 *               </p>
 * @param callback
 */
const quote = dataSourcesObj.quote = {
  getData(params, callback) {
    const url = `${ApiConst.apiWayBillDomain}/waybill/list?size=${PAGE_SIZE}&keyword=${params.keyword}`;
    get(url, (data) => {
      const len = data.length,
        autoData = [];
      for (let i = 0; i < len; i += 1) {
        autoData.push({
          'id': data[i].code,
          'value': `${data[i].waybillNo ? data[i].waybillNo : ''}-${data[i].goodsName ? data[i].goodsName : ''}-${data[i].routeName ? data[i].routeName : ''}`,
          'name': `${data[i].waybillNo ? data[i].waybillNo : data[i].code}`,
          'data': data[i]
        });
      }

      callback(autoData, null);
    }, (err) => {
      console.error(err);
      callback(null, err);
    });
  },
  getDetailUrl(code, objectName) {
    return '/quote/add.html';
  },
  getObjectName() {
    return '询价单报价';
  },
  getDetailUrl(code, objectName) {
    return '/quote/add.html';
  },
  getEditUrl(code, objectName) {
    return '/quote/add.html';
  },
  getAddUrl(objectName) {
    return '/quote/add.html';
  },
  getColumns(cb) {
    const filter = ['waybillNo', 'goodsName'];
    var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/waybill/waybill/list_render_info.json`)
    success = JSON.parse(JSON.stringify(success));
    _getConfig(success, filter, cb); // fix-it|
  },
  getSearch(cb) {
    const filter = ['waybillNo'];
    var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/waybill/waybill/search_render_info.json`)
    success = JSON.parse(JSON.stringify(success));
    _getConfig(success, filter, cb); // fix-it|
  },
  getListData(paramsObj, callback) {
    const url = `${ApiConst.apiWayBillDomain}/waybill/list?${objToParamStr(paramsObj)}`;
    _getListData(url, callback);
  }
};


/**
 * 线路数据源
 * @param params <p>
 *                  keyword => 关键词
 *               </p>
 * @param callback
 */
const route = dataSourcesObj.route = {
  getData(params, callback) {
    const url = `${ApiConst.apiLineDomain}/resource/route/list?size=${PAGE_SIZE}&keyword=${params.keyword}`;
    get(url, (data) => {
      const len = data.length,
        autoData = [];
      for (let i = 0; i < len; i += 1) {
        autoData.push({
          'id': data[i].code,
          'value': `${data[i].routeName ? data[i].routeName : '-'}`,
          'name': `${data[i].routeName ? data[i].routeName : data[i].code}`,
          'data': data[i]
        });
      }
      callback(autoData, null);
    }, (err) => {
      console.error(err);
      callback(null, err);
    });
  },
  getObjectName() {
    return '线路';
  },
  getDetailUrl(code, objectName) {
    // return `/route/add.html?code=${code}&editable=false&objectName=${encodeURIComponent(objectName)}`;
    return '/route/add.html';
  },
  getEditUrl(code, objectName) {
    // return `/route/add.html?code=${code}&editable=true&objectName=${encodeURIComponent(objectName)}`;
    return '/route/add.html';
  },
  getAddUrl(objectName) {
    // return `/route/add.html?objectName=${encodeURIComponent(objectName)}`;
    return '/route/add.html';
  },
  getColumns(cb) {
    const filter = ['routeName', 'loadingOrg', 'unloadingOrg'];
    var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/resource/route/list_render_info.json`)
    success = JSON.parse(JSON.stringify(success));
    _getConfig(success, filter, cb); // fix-it|
  },
  getSearch(cb) {
    const filter = ['routeName'];
    var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/resource/route/search_render_info.json`)
    success = JSON.parse(JSON.stringify(success));
    _getConfig(success, filter, cb); // fix-it|
  },
  getListData(paramsObj, callback) {
    const url = `${ApiConst.apiResourceDomain}/resource/route/list?${objToParamStr(paramsObj)}`;
    _getListData(url, callback);
  },
  getDetailData(paramsObj, callback) {
    const url = `${ApiConst.apiLineDomain}/resource/route/${paramsObj.code}/info`;
    _getDetailData(paramsObj, url, callback);
  }
};
/**
 * 运价数据源
 * @param params <p>
 *                  keyword => 关键词
 *               </p>
 * @param callback
 */
const rates = dataSourcesObj.rates = {
  getData(params, callback) {
    const url = `${ApiConst.apiLineDomain}/resource/rates/list?size=${PAGE_SIZE}&keyword=${params.keyword}`;
    get(url, (data) => {
      const len = data.length,
        autoData = [];
      for (let i = 0; i < len; i += 1) {
        autoData.push({
          'id': data[i].code,
          'value': `${data[i].ratesName ? data[i].ratesName : '-'}(${data[i].routeName ? data[i].routeName : '-'})`,
          'name': `${data[i].ratesName ? data[i].ratesName : data[i].code}`,
          'data': data[i]
        });
      }
      callback(autoData, null);
    }, (err) => {
      console.error(err);
      callback(null, err);
    });
  },
  getObjectName() {
    return '运价';
  },
  getDetailUrl(code, objectName) {
    // return `/rates/add.html?code=${code}&editable=false&objectName=${encodeURIComponent(objectName)}`;
    return '/rates/add.html';
  },
  getEditUrl(code, objectName) {
    // return `/rates/add.html?code={code}&editable=true&objectName=${encodeURIComponent(objectName)}`;
    return '/rates/add.html';
  },
  getAddUrl(objectName) {
    // return `/rates/add.html?objectName=${encodeURIComponent(objectName)}`;
    return '/rates/add.html';
  },
  getColumns(cb) {
    const filter = ['goodsUnitPrice', 'clientFreightPrice', 'driverReferencePrice', 'description', 'createTime'];
    // const filter = ['goodsName', 'goodsUnitPrice', 'clientFreightPrice', 'driverReferencePrice', 'goodsLossMethod', 'createTime'];
    var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/resource/rates/detail_render_info.json`)
    success = JSON.parse(JSON.stringify(success));
    _getConfig(success, filter, cb); // fix-it|
  },
  getSearch(cb) {
    const filter = ['goodsName'];
    var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/resource/rates/search_render_info.json`)
    success = JSON.parse(JSON.stringify(success));
    _getConfig(success, filter, cb); // fix-it|
  },
  getListData(paramsObj, callback) {
    // const url = `${ApiConst.apiResourceDomain}/resource/rates/list?${objToParamStr(paramsObj)}`;
    // _getListData(url, callback);
    RateService.list(paramsObj, callback);
  }
};

/**
 * 订单数据源
 * @param params <p>
 *                  keyword => 关键词
 *               </p>
 * @param callback
 */
const logistics = dataSourcesObj.logistics = {
  getData(params, callback) {
    const url = `${ApiConst.apiLogisticsDomain}/logistics/list?size=${PAGE_SIZE}&keyword=${params.keyword}`;
    get(url, (data) => {
      const len = data.length,
        autoData = [];
      for (let i = 0; i < len; i += 1) {
        autoData.push({
          'id': data[i].code,
          'value': `${data[i].clientOrgName ? data[i].clientOrgName : '-'} - ${data[i].logisticsNo ? data[i].logisticsNo : '-'}`,
          'name': `${data[i].logisticsNo ? data[i].logisticsNo : data[i].code}`,
          'data': data[i]
        });
      }
      callback(autoData, null);
    }, (err) => {
      console.error(err);
      callback(null, err);
    });
  },
  getObjectName() {
    return '订单';
  },
  getDetailUrl(code, objectName) {
    // return `/logistics/add.html?code=${code}&editable=false&objectName=${encodeURIComponent(objectName)}`;
    return '/logistics/add.html';
  },
  getEditUrl(code, objectName) {
    // return `/logistics/add.html?code=${code}&editable=true&objectName=${encodeURIComponent(objectName)}`;
    return '/logistics/add.html';
  },
  getAddUrl(objectName) {
    // return `/logistics/add.html?objectName=${encodeURIComponent(objectName)}`;
    return '/logistics/add.html';
  },
  getColumns(cb) {
    const filter = ['logisticsNo', 'clientOrg', 'route', 'goodsName', 'goodsWeight'];
    var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/logistics/logistics/list_render_info.json`)
    success = JSON.parse(JSON.stringify(success));
    _getConfig(success, filter, cb); // fix-it|
  },
  getSearch(cb) {
    const filter = ['logisticsNo', 'clientOrg'];
    var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/logistics/logistics/search_render_info.json`)
    success = JSON.parse(JSON.stringify(success));
    _getConfig(success, filter, cb); // fix-it|
  },
  getListData(paramsObj, callback) {
    const url = `${ApiConst.apiLogisticsDomain}/logistics/list?${objToParamStr(paramsObj)}`;
    _getListData(url, callback);
  },
  getDetailData(paramsObj, callback) {
    const url = `${ApiConst.apiLogisticsDomain}/logistics/${paramsObj.code}/get`;
    _getDetailData(paramsObj, url, callback);
  }
};

/**
 * 外包订单数据源
 * @param params <p>
 *                  keyword => 关键词
 *               </p>
 * @param callback
 */
const outsourcingLogistics = dataSourcesObj.outsourcingLogistics = {
  getData(params, callback) {
    const url = `${ApiConst.apiLogisticsDomain}/outsourcing_logistics/list?size=${PAGE_SIZE}&keyword=${params.keyword}`;
    get(url, (data) => {
      const len = data.length,
        autoData = [];
      for (let i = 0; i < len; i += 1) {
        autoData.push({
          'id': data[i].code,
          'value': `${data[i].clientOrgName ? data[i].clientOrgName : '-'} - ${data[i].logisticsNo ? data[i].logisticsNo : '-'}`,
          'name': `${data[i].logisticsNo ? data[i].logisticsNo : data[i].code}`,
          'data': data[i]
        });
      }
      callback(autoData, null);
    }, (err) => {
      console.error(err);
      callback(null, err);
    });
  },
  getObjectName() {
    return '外包订单';
  },
  getDetailUrl(code, objectName) {
    return '/outsourcingLogistics/add.html';
  },
  getEditUrl(code, objectName) {
    return '/outsourcingLogistics/add.html';
  },
  getAddUrl(objectName) {
    return '/outsourcingLogistics/add.html';
  },
  getColumns(cb) {
    const filter = ['logisticsNo', 'clientOrg', 'route', 'goodsName', 'goodsWeight'];
    var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/logistics/outsourcing/list_render_info.json`)
    success = JSON.parse(JSON.stringify(success));
    _getConfig(success, filter, cb); // fix-it|
  },
  getSearch(cb) {
    const filter = ['logisticsNo', 'clientOrg'];
    var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/logistics/outsourcing/search_render_info.json`)
    success = JSON.parse(JSON.stringify(success));
    _getConfig(success, filter, cb); // fix-it|
  },
  getListData(paramsObj, callback) {
    const url = `${ApiConst.apiLogisticsDomain}/outsourcing_logistics/list?${objToParamStr(paramsObj)}`;
    _getListData(url, callback);
  }
};


/**
 * 合约据源
 * @param params <p>
 *                  keyword => 关键词
 *               </p>
 * @param callback
 */
const transportContract = dataSourcesObj.transportContract = {
  getData(params, callback) {
    const url = `${ApiConst.apiLogisticsDomain}/contract/list?size=${PAGE_SIZE}&keyword=${params.keyword}`;
    get(url, (data) => {
      const len = data.length,
        autoData = [];
      for (let i = 0; i < len; i += 1) {
        autoData.push({
          'id': data[i].code,
          'value': `${data[i].clientOrgName ? data[i].clientOrgName : '-'} - ${data[i].contractNo ? data[i].contractNo : '-'}`,
          'name': `${data[i].contractNo ? data[i].contractNo : data[i].code}`,
          'data': data[i]
        });
      }
      callback(autoData, null);
    }, (err) => {
      console.error(err);
      callback(null, err);
    });
  },
  getObjectName() {
    return '合约';
  },
  getDetailUrl(code, objectName) {
    // return `/logistics_contract/add.html?code=${code}&editable=false&objectName=${encodeURIComponent(objectName)}`;
    return '/contract/add.html';
  },
  getEditUrl(code, objectName) {
    // return `/logistics_contract/add.html?code=${code}&editable=true&objectName=${encodeURIComponent(objectName)}`;
    return '/contract/add.html';
  },
  getAddUrl(objectName) {
    // return `/logistics_contract/add.html?objectName=${encodeURIComponent(objectName)}`;
    return '/contract/add.html';
  },
  getColumns(cb) {
    const filter = ['contractNo', 'contractName', 'contractExpiryDate'];
    var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/logistics/contract/list_render_info.json`)
    success = JSON.parse(JSON.stringify(success));
    _getConfig(success, filter, cb); // fix-it|
  },
  getSearch(cb) {
    const filter = ['contractNo', 'contractName'];
    var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/logistics/contract/search_render_info.json`)
    success = JSON.parse(JSON.stringify(success));
    _getConfig(success, filter, cb); // fix-it|
  },
  getListData(paramsObj, callback) {
    const url = `${ApiConst.apiLogisticsDomain}/logistics_contract/list?${objToParamStr(paramsObj)}`;
    _getListData(url, callback);
  },
  getDetailData(paramsObj, callback) {
    const url = `${ApiConst.apiLogisticsDomain}/logistics_contract/${paramsObj.code}/get`;
    _getDetailData(paramsObj, url, callback);
  }
};


/**
 * 员工合同数据源
 * @param params <p>
 *                  keyword => 关键词
 *               </p>
 * @param callback
 */
const employeeContract = dataSourcesObj.employeeContract = {
  getData(params, callback) {
    const url = `${ApiConst.apiPersonDomain}/member/person_contract_info/list?size=${PAGE_SIZE}&keyword=${params.keyword}`;
    get(url, (data) => {
      const len = data.length,
        autoData = [];
      for (let i = 0; i < len; i += 1) {
        autoData.push({
          'id': data[i].code,
          'value': `${data[i].clientOrgName ? data[i].clientOrgName : '-'} - ${data[i].contractNo ? data[i].contractNo : '-'}`,
          'name': `${data[i].contractNo ? data[i].contractNo : data[i].code}`,
          'data': data[i]
        });
      }
      callback(autoData, null);
    }, (err) => {
      console.error(err);
      callback(null, err);
    });
  },
  getObjectName() {
    return '员工合同';
  },
  getDetailUrl(code, objectName) {
    return '/personContract/add.html';
  },
  getEditUrl(code, objectName) {
    return '/personContract/add.html';
  },
  getAddUrl(objectName) {
    return '/personContract/add.html';
  },
  getColumns(cb) {
    const filter = ['contractName', 'baseSalary', 'accruedExpense', 'agencyFee', 'commission', 'relayFee', 'enableAllowances'];
    var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/person/contract/list_render_info.json`);
    success = JSON.parse(JSON.stringify(success));
    _getConfig(success, filter, cb); // fix-it|
  },
  getSearch(cb) {
    const filter = ['contractName', 'baseSalary'];
    var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/person/contract/search_render_info.json`);
    success = JSON.parse(JSON.stringify(success));
    _getConfig(success, filter, cb); // fix-it|
  },
  getListData(paramsObj, callback) {
    const url = `${ApiConst.apiPersonDomain}/member/person_contract_info/list?${objToParamStr(paramsObj)}`;
    _getListData(url, callback);
  }
};


/**
 * 省据源
 * @param params <p>
 *                  keyword => 关键词
 *               </p>
 * @param callback
 */
const province = dataSourcesObj.province = {
  getData(params, callback) {
    const autoData = [];
    area.forEach((data) => {
      autoData.push({
        'id': `${data.code}`,
        'value': data.name,
        'name': data.name,
        'data': data.name
      });
    });
    callback(autoData, null);
  },
  getDetailUrl(code, objectName) {
    return null;
  }
};

/**
 * 市据源
 * @param params <p>
 *                  keyword => 关键词
 *               </p>
 * @param callback
 */
const city = dataSourcesObj.city = {
  getData(params, callback) {
    const autoData = [];
    for (let i = 0; i < area.length; i++) {
      const province = area[i];
      if (province.code == params.keyword) {
        const citys = province.citys;
        citys.forEach((data) => {
          autoData.push({
            'id': `${data.code}`,
            'value': data.name,
            'name': data.name,
            'data': data.name
          });
        });
        break;
      }
    }
    callback(autoData, null);
  },
  getDetailUrl(code, objectName) {
    return null;
  }
};
/**
 * 区据源
 * @param params <p>
 *                  keyword => 关键词
 *               </p>
 * @param callback
 */
const county = dataSourcesObj.county = {
  getData(params, callback) {
    const autoData = [];
    for (let i = 0; i < area.length; i++) {
      const province = area[i];
      const citys = province.citys;
      for (let j = 0; j < citys.length; j++) {
        const city = citys[j];
        if (city.code == params.keyword) {
          const areas = city.county;
          areas.forEach((data) => {
            autoData.push({
              'id': `${data.code}`,
              'value': data.name,
              'name': data.name,
              'data': data.name
            });
          });
          break;
        }
      }
    }
    callback(autoData, null);
  },
  getDetailUrl(code, objectName) {
    return null;
  }
};
/**
 * 运力数据源
 * @param params <p>
 *                  keyword => 关键词
 *               </p>
 * @param callback
 */
const transport = dataSourcesObj.transport = {
  getData(params, callback) {
    const url = `${ApiConst.apiTransportDomain}/transport/list?size=${PAGE_SIZE}&keyword=${params.keyword}`;
    get(url, (data) => {
      const len = data.length,
        autoData = [];
      for (let i = 0; i < len; i += 1) {
        autoData.push({
          'id': data[i].code,
          'value': `${data[i].mainTruckLicenseNo ? data[i].mainTruckLicenseNo : ''} - ${data[i].driverFullName ? data[i].driverFullName : ''} - ${data[i].trailerTruckLicenseNo ? data[i].trailerTruckLicenseNo : ''} - ${data[i].viceDriverFullName ? data[i].viceDriverFullName : ''}`,
          'name': `${data[i].mainTruckLicenseNo ? data[i].mainTruckLicenseNo : data[i].code}`,
          'data': data[i]
        });
      }
      callback(autoData, null);
    });
  },
  getObjectName() {
    return '车辆';
  },
  getDetailUrl(code, objectName) {
    // return `/transport/add.html?code=${code}&editable=false&objectName=${encodeURIComponent(objectName)}`;
    return '/truck/add.html';
  },
  getEditUrl(code, objectName) {
    // return `/transport/add.html?code=${code}&editable=true&objectName=${encodeURIComponent(objectName)}`;
    return '/truck/add.html';
  },
  getAddUrl(objectName) {
    // return `/transport/add.html?objectName=${encodeURIComponent(objectName)}`;
    return '/truck/add.html';
  },
  getColumns(cb) {
    // transportgetColumn(cb);
    // 车辆来源， 主车编号，挂车编号， 主驾， 主驾手机号，副驾，副驾手机号
    // 目前数据没有‘车辆来源’，暂时跳过
    const filter = ['mainTruck', 'certStatus', 'trailerTruck','trailerTruckCertStatus', 'driver', 'driverCertStatus', 'driverPhone', 'viceDriver', 'viceDriverCertStatus', 'viceDriverPhone', 'mainTruckCertStatus'];
    var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/transport/transport/detail_render_info.json`)
    success = JSON.parse(JSON.stringify(success));
    _getConfig(success, filter, cb); // fix-it|
  },
  getSearch(cb) {
    const filter = ['mainTruckLicenseNo', 'trailerTruckLicenseNo'];
    var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/transport/transport/search_render_info.json`)
    success = JSON.parse(JSON.stringify(success));
    _getConfig(success, filter, cb); // fix-it|
  },
  getListData(paramsObj, callback) {
    const url = `${ApiConst.apiTransportDomain}/transport/list?${objToParamStr(paramsObj)}`;
    _getListData(url, callback);
  },
  getDetailData(paramsObj, callback) {
    const url = `${ApiConst.apiTransportDomain}/transport/${paramsObj.code}/get`;
    _getDetailData(paramsObj, url, callback);
  }
};

/**
 * 轮胎数据源
 * @param params <p>
 *                  keyword => 关键词
 *               </p>
 * @param callback
 */
const tyre = dataSourcesObj.tyre = {
  getData(params, callback) {
    const url = `${ApiConst.apiMaintenaceDomain}/maintenance_tyre_record/list?size=${PAGE_SIZE}&keyword=${params.keyword}`;
    get(url, (data) => {
      const len = data.length,
        autoData = [];
      for (let i = 0; i < len; i += 1) {
        autoData.push({
          'id': data[i].code,
          'value': `${data[i].tyreNo ? data[i].tyreNo : '-'} - ${data[i].truckLicenseNo ? data[i].truckLicenseNo : '-'}`,
          'name': `${data[i].tyreNo ? data[i].tyreNo : data[i].code}`,
          'data': data[i]
        });
      }
      callback(autoData, null);
    });
  },
  getDetailUrl(code, objectName) {
    return `/tyre/add.html?code=${code}&editable=false&objectName=${encodeURIComponent(objectName)}`;
  }
};

/**
 * 车队数据源
 * @param params <p>
 *                  keyword => 关键词
 *               </p>
 * @param callback
 */
const fleet = dataSourcesObj.fleet = {
  getData(params, callback) {
    const url = `${ApiConst.apiOrgDomain}/partner/list?size=${PAGE_SIZE}&orgTag=车队&keyword=${params.keyword}`;
    get(url, (data) => {
      const len = data.length,
        autoData = [];
      for (let i = 0; i < len; i += 1) {
        autoData.push({
          'id': data[i].code,
          'value': `${data[i].orgName ? data[i].orgName : '-'}(${data[i].linkmanFullName ? data[i].linkmanFullName : '-'})`,
          'name': `${data[i].orgName ? data[i].orgName : data[i].code}`,
          'data': data[i]
        });
      }
      callback(autoData, null);
    }, (err) => {
      console.error(err);
      callback(null, err);
    });
  },
  getObjectName() {
    return '车队';
  },
  getDetailUrl(code, objectName) {
    // return `/partner/add.html?code=${code}&editable=false&objectName=${encodeURIComponent(objectName)}`;
    return '/partnerMotorcade/add.html';
  },
  getEditUrl(code, objectName) {
    // return `/partner/add.html?code=${code}&editable=true&objectName=${encodeURIComponent(objectName)}`;
    return '/partnerMotorcade/add.html';
  },
  getAddUrl(objectName) {
    // return `/partner/add.html?objectName=${encodeURIComponent(objectName)}`;
    return '/partnerMotorcade/add.html';
  },
  getColumns(cb) {
    const filter = ['orgName'];
    var success = require('./fieldMetadata/' + ApiConst.fieldMetadataDir + '/custom/fleet/list_render_info.json');
    success = JSON.parse(JSON.stringify(success));
    _getConfig(success, filter, cb);
  },
  getSearch(cb) {
    const filter = ['orgName'];
    var success = require('./fieldMetadata/' + ApiConst.fieldMetadataDir + '/custom/fleet/search_render_info.json');
    success = JSON.parse(JSON.stringify(success));
    _getConfig(success, filter, cb);
  },
  getListData(paramsObj, callback) {
    const url = `${ApiConst.apiOrgDomain}/partner/list?${objToParamStr(paramsObj)}&orgTag=车队`;
    _getListData(url, callback);
  }
};

/**
 * 客户数据源
 * @param params <p>
 *                  keyword => 关键词
 *               </p>
 * @param callback
 */
const client = dataSourcesObj.client = {
  getData(params, callback) {
    const url = `${ApiConst.apiOrgDomain}/partner/list?size=${PAGE_SIZE}&orgTag=客户&keyword=${params.keyword}`;
    get(url, (data) => {
      const len = data.length,
        autoData = [];
      for (let i = 0; i < len; i += 1) {
        autoData.push({
          'id': data[i].code,
          'value': `${data[i].orgName ? data[i].orgName : '-'}(${data[i].linkmanFullName ? data[i].linkmanFullName : '-'})`,
          'name': `${data[i].orgName ? data[i].orgName : data[i].code}`,
          'data': data[i]
        });
      }
      callback(autoData, null);
    }, (err) => {
      console.error(err);
      callback(null, err);
    });
  },
  getObjectName() {
    return '客户';
  },
  getDetailUrl(code, objectName) {
    // return `/partner/add.html?code=${code}&editable=false&objectName=${encodeURIComponent(objectName)}`;
    return '/partnerClient/add.html';
  },
  getEditUrl(code, objectName) {
    // return `/partner/add.html?code=${code}&editable=true&objectName=${encodeURIComponent(objectName)}`;
    return '/partnerClient/add.html';
  },
  getAddUrl(objectName) {
    // return `/partner/add.html?objectName=${encodeURIComponent(objectName)}`;
    return '/partnerClient/add.html';
  },
  getColumns(cb) {
    const filter = ['orgName'];
    var success = require('./fieldMetadata/' + ApiConst.fieldMetadataDir + '/custom/client/list_render_info.json');
    success = JSON.parse(JSON.stringify(success));
    _getConfig(success, filter, cb);
  },
  getSearch(cb) {
    const filter = ['orgName'];
    var success = require('./fieldMetadata/' + ApiConst.fieldMetadataDir + '/custom/client/search_render_info.json');
    success = JSON.parse(JSON.stringify(success));
    _getConfig(success, filter, cb);
  },
  getListData(paramsObj, callback) {
    const url = `${ApiConst.apiOrgDomain}/partner/list?${objToParamStr(paramsObj)}&orgTag=客户`;
    _getListData(url, callback);
  }
};

function getAllListData(sources, params, cb) {
  let data = [],
    count = 0,
    total = 0;
  const len = sources.length;
  //content: data, total: total
  sources.forEach((val) => {
    var source = dataSourcesObj[val];
    if (source == null) throw "数据源不存在：" + val;
    source.getListData(params, (success) => {
      if (success && success.content && success.total) {
        data = data.concat(success.content);
        total += success.total;
      }
      count += 1;
      if (count === len) {
        cb({ content: data, total: total }, null);
      }
    });
  });
}

// 获取对象详情信息
function getAllDetailData(type, obj, cb) {
  // 判断数据源是否存在获取详情方法
  if (dataSourcesObj[type].getDetailData) {
    dataSourcesObj[type].getDetailData(obj, (success) => {
      cb(success);
    });
  } else {
    console.log('get detail function not found');
    cb(null);
  }
}


function getAll(sources, params, cb) {
  let data = [],
    count = 0;
  const len = sources.length,
    cacheArray = ['province', 'city', 'county', 'goodsLossRation', 'goodsLoss', 'standardDistance', 'goodsNumber', 'goodsVolume', 'goodsWeight', 'chargeItemNumber', 'chargeItemPrice', 'chargeItemAmount', 'truckModel', 'truckSize', 'truckCarry', 'truckCubage', 'driverPrice', 'routeDuration', 'goodsPrice', 'carrierPrice','goodsCategory','goodsName'];
  sources.forEach((val) => {
    const key = `${val}-${Object.keys(params)}-${Object.values(params)}`;
    if (localStorage.getItem(key)) {
      data = data.concat(JSON.parse(localStorage.getItem(key)));
      count += 1;
      if (count === len) {
        cb(data, null);
      }
    } else {
      dataSourcesObj[val].getData(params, (success) => {
        // goodsCategory 需要实时的拿数据，所以不需要缓存 && val !== 'goodsCategory'
        if (cacheArray.indexOf(val) > -1 && val !== 'goodsCategory' && val !== 'goodsName') {
          localStorage.setItem(key, JSON.stringify(success));
        }
        data = data.concat(success);
        count += 1;
        if (count === len) {
          cb(data, null);
        }
      });
    }
  });
}

/*
 * 标签数据源
 */

function getTag(apiUrl, type, callback) {
  const url = `${apiUrl}/tag_info/${type}/list`;
  get(url, (data) => {
    console.log('tag data is', data);
    callback(data);
  }, (err) => {
    console.error(err);
  });
}

const orgTag = dataSourcesObj.orgTag = {
  getData(callback) {
    getTag(`${ApiConst.apiOrgDomain}`, 'org', callback);
  }
}

/**
 * 应收账单
 * @param params <p>
 *                  keyword => 关键词
 *               </p>
 * @param callback
 */
const receivableBill = dataSourcesObj.receivableBill = {
  getData(params, callback) {
    const url = `${ApiConst.apiSettleDomain}/settle/receivable/list?size=${PAGE_SIZE}&keyword=${params.keyword}`;
    get(url, (data) => {
      const len = data.length,
        autoData = [];
      for (let i = 0; i < len; i += 1) {
        autoData.push({
          'id': data[i].code,
          'value': `${data[i].billName ? data[i].billName : '-'}`,
          'name': `${data[i].billName ? data[i].billName : data[i].code}`,
          'data': data[i]
        });
      }
      callback(autoData, null);
    }, (err) => {
      console.error(err);
      callback(null, err);
    });
  },
  getObjectName() {
    return '应收账单';
  },
  getDetailUrl(code, objectName) {
    // return `/route/add.html?code=${code}&editable=false&objectName=${encodeURIComponent(objectName)}`;
    return '/settleBillReceivable/create.html';
  },
  getEditUrl(code, objectName) {
    // return `/route/add.html?code=${code}&editable=true&objectName=${encodeURIComponent(objectName)}`;
    return '/settleBillReceivable/create.html';
  },
  getAddUrl(objectName) {
    // return `/route/add.html?objectName=${encodeURIComponent(objectName)}`;
    return '/settleBillReceivable/create.html';
  },
  getColumns(cb) {
    const success = {
      code: 200,
      content: [
        {
          showName: '付款方名称',
          elementCode: 'label',
          extraParams: '{"field1":"payerOrgName"}',
          fieldConfigCode: 'payerOrgName'
        },
        {
          showName: '账单名称',
          elementCode: 'label',
          extraParams: '{"field1":"billName","detailLinkVisiable":"true"}',
          fieldConfigCode: 'billName'
        },
        {
          showName: '账单编号',
          elementCode: 'label',
          extraParams: '{"field1":"billNo","detailLinkVisiable":"true"}',
          fieldConfigCode: 'billNo'
        },
        {
          showName: '账单状态',
          elementCode: 'label',
          extraParams: '{"field1":"billStatus","optionsValue1":["none","pend","accept","reject","destroy"],"options1":["待提交审核","待审核","审核通过","审核不通过","已作废"]}',
          fieldConfigCode: 'billStatus'
        },
        {
          showName: '收款状态',
          elementCode: 'label',
          extraParams: '{"field1":"receivableStatus","optionsValue1":["none","part","all"],"options1":["未收款","部分收款","全部收款"]}',
          fieldConfigCode: 'receivableStatus'
        },
        {
          showName: '发票信息',
          elementCode: 'label',
          extraParams: '{"field1":"invoiced","optionsValue1":["yes","no"],"options1":["已开票","未开票"]}',
          fieldConfigCode: 'invoiced'
        },
        {
          showName: '未收金额',
          elementCode: 'label',
          extraParams: '{"field1":"unreceivedAmount"}',
          fieldConfigCode: 'unreceivedAmount'
        },
        {
          showName: '应收金额',
          elementCode: 'label',
          extraParams: '{"field1":"receivableAmount"}',
          fieldConfigCode: 'receivableAmount'
        },
        {
          showName: '己收金额',
          elementCode: 'label',
          extraParams: '{"field1":"receivedAmount"}',
          fieldConfigCode: 'receivedAmount'
        },
        {
          showName: '创建人',
          elementCode: 'label',
          extraParams: '{"field1":"creatorUsername"}',
          fieldConfigCode: 'creatorUsername'
        },
        {
          showName: '创建时间',
          elementCode: 'label',
          extraParams: '{"field1":"createTime"}',
          fieldConfigCode: 'createTime'
        },
        {
          showName: '更新人用户名',
          elementCode: 'label',
          extraParams: '{"field1":"updateUsername"}',
          fieldConfigCode: 'updateUsername'
        },
        {
          showName: '更新时间',
          elementCode: 'label',
          extraParams: '{"field1":"updateTime"}',
          fieldConfigCode: 'updateTime'
        }
      ]
    };
    cb(success);
    return success;
  },
  getSearch(cb) {
    const success = {
      code: 200,
      content: [
        {
          showName: '付款方名称',
          elementCode: 'text',
          extraParams: '{"field1":"payerOrgName"}',
          fieldConfigCode: 'payerOrgName'
        },
        {
          showName: '账单名称',
          elementCode: 'text',
          extraParams: '{"field1":"billName"}',
          fieldConfigCode: 'billName'
        }
      ]
    };
    cb(success);
    return success;
  },
  getListData(paramsObj, callback) {
    const url = `${ApiConst.apiSettleDomain}/settle/receivable/list?${objToParamStr(paramsObj)}`;
    _getListData(url, callback);
  }
};

/**
 * 应付账单
 * @param params <p>
 *                  keyword => 关键词
 *               </p>
 * @param callback
 */
const payableBill = dataSourcesObj.payableBill = {
  getData(params, callback) {
    const url = `${ApiConst.apiSettleDomain}/settle/payable/list?size=${PAGE_SIZE}&keyword=${params.keyword}`;
    get(url, (data) => {
      const len = data.length,
        autoData = [];
      for (let i = 0; i < len; i += 1) {
        autoData.push({
          'id': data[i].code,
          'value': `${data[i].billName ? data[i].billName : '-'}`,
          'name': `${data[i].billName ? data[i].billName : data[i].code}`,
          'data': data[i]
        });
      }
      callback(autoData, null);
    }, (err) => {
      console.error(err);
      callback(null, err);
    });
  },
  getObjectName() {
    return '应付账单';
  },
  getDetailUrl(code, objectName) {
    // return `/route/add.html?code=${code}&editable=false&objectName=${encodeURIComponent(objectName)}`;
    return '/settleBillPayable/create.html';
  },
  getEditUrl(code, objectName) {
    // return `/route/add.html?code=${code}&editable=true&objectName=${encodeURIComponent(objectName)}`;
    return '/settleBillPayable/create.html';
  },
  getAddUrl(objectName) {
    // return `/route/add.html?objectName=${encodeURIComponent(objectName)}`;
    return '/settleBillPayable/create.html';
  },
  getColumns(cb) {
    const success = {
      code: 200,
      content: [
        {
          showName: '收款方名称',
          elementCode: 'label',
          extraParams: '{"field1":"payeeOrgName"}',
          fieldConfigCode: 'payeeOrgName'
        },
        {
          showName: '账单名称',
          elementCode: 'label',
          extraParams: '{"field1":"billName","detailLinkVisiable":"true"}',
          fieldConfigCode: 'billName'
        },
        {
          showName: '账单编号',
          elementCode: 'label',
          extraParams: '{"field1":"billNo","detailLinkVisiable":"true"}',
          fieldConfigCode: 'billNo'
        },
        {
          showName: '账单状态',
          elementCode: 'label',
          extraParams: '{"field1":"billStatus","optionsValue1":["none","pend","accept","reject","destroy"],"options1":["待提交审核","待审核","审核通过","审核不通过","已作废"]}',
          fieldConfigCode: 'billStatus'
        },
        {
          showName: '付款状态',
          elementCode: 'label',
          extraParams: '{"field1":"payStatus","optionsValue1":["none","part","all"],"options1":["未付款","部分付款","全部付款"]}',
          fieldConfigCode: 'payStatus'
        },
        {
          showName: '发票信息',
          elementCode: 'label',
          extraParams: '{"field1":"invoiced","optionsValue1":["yes","no"],"options1":["已收票","未收票"]}',
          fieldConfigCode: 'receivedInvoice'
        },
        {
          showName: '未付金额',
          elementCode: 'label',
          extraParams: '{"field1":"unpaidAmount"}',
          fieldConfigCode: 'unpaidAmount'
        },
        {
          showName: '应付金额',
          elementCode: 'label',
          extraParams: '{"field1":"payableAmount"}',
          fieldConfigCode: 'payableAmount'
        },
        {
          showName: '己付金额',
          elementCode: 'label',
          extraParams: '{"field1":"paidAmount"}',
          fieldConfigCode: 'paidAmount'
        },
        {
          showName: '创建人',
          elementCode: 'label',
          extraParams: '{"field1":"creatorUsername"}',
          fieldConfigCode: 'creatorUsername'
        },
        {
          showName: '创建时间',
          elementCode: 'label',
          extraParams: '{"field1":"createTime"}',
          fieldConfigCode: 'createTime'
        },
        {
          showName: '更新人用户名',
          elementCode: 'label',
          extraParams: '{"field1":"updateUsername"}',
          fieldConfigCode: 'updateUsername'
        },
        {
          showName: '更新时间',
          elementCode: 'label',
          extraParams: '{"field1":"updateTime"}',
          fieldConfigCode: 'updateTime'
        }
      ]
    };
    cb(success);
    return success;
  },
  getSearch(cb) {
    const success = {
      code: 200,
      content: [
        {
          showName: '收款方名称',
          elementCode: 'text',
          extraParams: '{"field1":"payeeOrgName"}',
          fieldConfigCode: 'payeeOrgName'
        },
        {
          showName: '账单名称',
          elementCode: 'text',
          extraParams: '{"field1":"billName"}',
          fieldConfigCode: 'billName'
        }
      ]
    };
    cb(success);
    return success;
  },
  getListData(paramsObj, callback) {
    const url = `${ApiConst.apiSettleDomain}/settle/payable/list?${objToParamStr(paramsObj)}`;
    _getListData(url, callback);
  }
};



// 弹框打印配置的 弹框 8-8
const print = dataSourcesObj.print = {
  getData(params, callback) {
    const url = `${ApiConst.apiWayBillDomain}/waybill/print_document/list?size=${PAGE_SIZE}&keyword=${params.keyword}`;
    get(url, (data) => {
      const len = data.length,
        autoData = [];
      for (let i = 0; i < len; i += 1) {
        autoData.push({
          'id': data[i].code,
          'value': `${data[i].orgName ? data[i].orgName : '-'}(${data[i].linkmanFullName ? data[i].linkmanFullName : '-'})`,
          'name': `${data[i].orgName ? data[i].orgName : data[i].code}`,
          'data': data[i]
        });
      }
      callback(autoData, null);
    }, (err) => {
      console.error(err);
      callback(null, err);
    });
  },
  getObjectName() {
    return '套打模板';
  },
  getDetailUrl(code, objectName) {
    // return `/partner/add.html?code=${code}&editable=false&objectName=${encodeURIComponent(objectName)}`;
    return '/partner/add.html';
  },
  getEditUrl(code, objectName) {
    // return `/partner/add.html?code=${code}&editable=true&objectName=${encodeURIComponent(objectName)}`;
    return '/partner/add.html';
  },
  getAddUrl(objectName) {
    // return `/partner/add.html?objectName=${encodeURIComponent(objectName)}`;
    return '/partner/add.html';
  },
  getColumns(cb) {
    const filter = ['templateName', 'updateUsername'];
    var success = {
      code: 200,
      content: [{
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
      ]
    };
    success = JSON.parse(JSON.stringify(success));
    _getConfig(success, filter, cb); // fix-it|
  },
  getSearch(cb) {
    const filter = ['templateName'];
    var success = {
      code: 200,
      content: [{
        showName: '模板名称',
        fieldConfigCode: 'templateName',
        elementCode: 'text',
        extraParams: '{"field1":"name","required":"true","detailLinkVisiable":"true","maxLength1":"50","placeholder1":"请输入模板名称"}'
      }]
    };
    success = JSON.parse(JSON.stringify(success));
    _getConfig(success, filter, cb); // fix-it|
  },

  getListData(paramsObj, callback) {
    const url = `${ApiConst.apiWayBillDomain}/waybill/print_document/list?${objToParamStr(paramsObj)}`;
    _getListData(url, callback);
  }
};

/**
 * 车辆标签
 * @param params <p>
 *                  keyword => 关键词
 *               </p>
 * @param callback
 */
const truckTag = dataSourcesObj.truckTag = {
  getData(params, callback) {
    const url = `${ApiConst.apiTruckDomain}/tag_info/truck/list`;
    get(url, (data) => {
      callback(data, null);
    }, (err) => {
      console.error(err);
      callback(null, err);
    });
  }
};

/**
 * 司机标签
 * @param params <p>
 *                  keyword => 关键词
 *               </p>
 * @param callback
 */
const driverTag = dataSourcesObj.driverTag = {
  getData(params, callback) {
    const url = `${ApiConst.apiPersonDomain}/tag_info/person/list`;
    get(url, (data) => {
      callback(data, null);
    }, (err) => {
      console.error(err);
      callback(null, err);
    });
  }
};

/**
 * 组织标签
 * @param params <p>
 *                  keyword => 关键词
 *               </p>
 * @param callback
 */
const organizationTag = dataSourcesObj.organizationTag = {
  getData(params, callback) {
    const url = `${ApiConst.apiOrgDomain}/tag_info/org/list`;
    get(url, (data) => {
      callback(data, null);
    }, (err) => {
      console.error(err);
      callback(null, err);
    });
  }
};


/**
 * 吊车司机数据源
 * @param params <p>
 *                  keyword => 关键词
 *               </p>
 * @param callback
 */
const craneDriver = dataSourcesObj.craneDriver = {
  getData(params, callback) {
    console.log(111)
    const url = `${ApiConst.apiPersonDomain}/person/crane/driver/list?size=${PAGE_SIZE}&keyword=${params.keyword}`;
    get(url, (data) => {
      const len = data.length,
        autoData = [];
      for (let i = 0; i < len; i += 1) {
        autoData.push({
          'id': data[i].code,
          'value': data[i].code,
          'name': data[i].fullName,
          'data': data[i]
        });
      }
      callback(autoData, null);
    }, (err) => {
      console.error(err);
      callback(null, err);
    });
  },
  getDetailUrl(code, objectName) {
    // return `/driver/add.html?code=${code}&editable=false&objectName=${encodeURIComponent(objectName)}`;
    return '/crane/craneSignListAdd.html';
  },
  getAddUrl(objectName) {
    // return `/driver/add.html?objectName=${encodeURIComponent(objectName)}`;
    return '/crane/craneSignListAdd.html';
  },
  getEditUrl(code, objectName) {
    return '/crane/craneSignListAdd.html';
  },
  getObjectName() {
    return '吊车司机';
  },
  getSearch(cb) {
    const filter = ['fullName'];
    var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/crane/craneDriver/detail_render_info.json`)
    success = JSON.parse(JSON.stringify(success));
    _getConfig(success, filter, cb); // fix-it|
  },
  getColumns(cb) {
    const filter = ['fullName', 'phone', 'identityNumber', 'newTag'];
    var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/crane/craneDriver/detail_render_info.json`)
    success = JSON.parse(JSON.stringify(success));
    _getConfig(success, filter, cb); // fix-it|
  },
  getListData(paramsObj, callback) {
    console.log('getListData')
    const url = `${ApiConst.apiPersonDomain}/person/crane/driver/list?${objToParamStr(paramsObj)}`;
    _getListData(url, callback);
  },
  getDetailData(paramsObj, callback) {
    console.log('getDetailData')
    const url = `${ApiConst.apiPersonDomain}/person/crane/driver/get?userCode=${paramsObj.userCode}`;
    _getDetailData(paramsObj, url, callback);
  }
};



/**
 * 吊车公司数据源
 * @param params <p>
 *                  keyword => 关键词
 *               </p>
 * @param callback
 */
const craneCompany = dataSourcesObj.craneCompany = {
  getData(params, callback) {
    const url = `${ApiConst.apiPersonDomain}/org/partner/crane/list?size=${PAGE_SIZE}&keyword=${params.keyword}`;
    console.log('url',url)
    get(url, (data) => {
      const len = data.length,
        autoData = [];
      for (let i = 0; i < len; i += 1) {
        autoData.push({
          'id': data[i].orgCode,
          'value': data[i].orgCode,
          'name': data[i].orgName,
          'data': data[i]
        });
      }
      callback(autoData, null);
    }, (err) => {
      console.error(err);
      callback(null, err);
    });
  },
  getDetailUrl(code, objectName) {
    // return `/driver/add.html?code=${code}&editable=false&objectName=${encodeURIComponent(objectName)}`;
    return '';
  },
  getAddUrl(objectName) {
    // return `/driver/add.html?objectName=${encodeURIComponent(objectName)}`;
    return '';
  },
  getEditUrl(code, objectName) {
    return '';
  },
  getObjectName() {
    return '吊车公司';
  },
  getSearch(cb) {
    const filter = ['orgFullName'];
    var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/crane/craneCompany/detail_render_info.json`)
    success = JSON.parse(JSON.stringify(success));
    _getConfig(success, filter, cb); // fix-it|
  },
  getColumns(cb) {
    const filter = ['orgFullName','linkmanFullName', 'linkmanPhone', 'newTag'];
    var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/crane/craneCompany/detail_render_info.json`)
    success = JSON.parse(JSON.stringify(success));
    _getConfig(success, filter, cb); // fix-it|
  },
  getListData(paramsObj, callback) {
    const url = `${ApiConst.gatewayDomain}/org/partner/crane/list?${objToParamStr(paramsObj)}`;
    _getListData(url, callback);
  },
  getDetailData(paramsObj, callback) {
    console.log('getDetailData')
    const url = `${ApiConst.gatewayDomain}/org/partner/crane/get?orgCode=${paramsObj.orgCode}`;
    _getDetailData(paramsObj, url, callback);
  }
};


/**
 * 吊车车牌数据源
 * @param params <p>
 *                  keyword => 关键词
 *               </p>
 * @param callback
 */
const craneLicense = dataSourcesObj.craneLicense = {
  getData(params, callback) {
    const url = `${ApiConst.apiPersonDomain}/crane/crane_base_info/list?size=${PAGE_SIZE}&keyword=${params.keyword}`;
    get(url, (data) => {
      const len = data.length,
        autoData = [];
      for (let i = 0; i < len; i += 1) {
        autoData.push({
          'id': data[i].code,
          'value': `${data[i].fullName ? data[i].fullName : '-'} - ${data[i].phone ? data[i].phone : '-'}`,
          'name': `${data[i].fullName ? data[i].fullName : data[i].code}`,
          'data': data[i]
        });
      }
      callback(autoData, null);
    }, (err) => {
      console.error(err);
      callback(null, err);
    });
  },
  getDetailUrl(code, objectName) {
    // return `/driver/add.html?code=${code}&editable=false&objectName=${encodeURIComponent(objectName)}`;
    return '';
  },
  getAddUrl(objectName) {
    // return `/driver/add.html?objectName=${encodeURIComponent(objectName)}`;
    return '';
  },
  getEditUrl(code, objectName) {
    return '';
  },
  getObjectName() {
    return '吊车车牌';
  },
  getSearch(cb) {
    const filter = ['truckLicenseNo'];
    var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/crane/craneList/detail_render_info.json`)
    success = JSON.parse(JSON.stringify(success));
    _getConfig(success, filter, cb); // fix-it|
  },
  getColumns(cb) {
    const filter = ['truckLicenseNo','truckLinkman', 'truckLinkmanPhone', 'newTag'];
    var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/crane/craneList/detail_render_info.json`)
    success = JSON.parse(JSON.stringify(success));
    _getConfig(success, filter, cb); // fix-it|
  },
  getListData(paramsObj, callback) {
    const url = `${ApiConst.gatewayDomain}/crane/crane_base_info/list?${objToParamStr(paramsObj)}`;
    __getListData(url, callback);
  },
  getDetailData(paramsObj, callback) {
    const url = `${ApiConst.gatewayDomain}/crane/crane_base_info/getCraneInfoByTruckCode?truckCode=${paramsObj.truckCode}`;
    _getDetailData(paramsObj, url, callback);
  }
};

/**
 * 吊车详情页分组
 * @param params <p>
 *                  keyword => 关键词
 *               </p>
 * @param callback
 */
const craneTag = dataSourcesObj.craneTag = {
  getData(params, callback) {
    const url = `${ApiConst.apiCrane}/crane_tag_info/list`;
    get(url, (data) => {
      callback(data, null);
    }, (err) => {
      console.error(err);
      callback(null, err);
    });
  }
};

/**
 * 吊车公司详情页分组
 * @param params <p>
 *                  keyword => 关键词
 *               </p>
 * @param callback
 */
const craneCompanyTag = dataSourcesObj.craneCompanyTag = {
  getData(params, callback) {
    const url = `${ApiConst.apiCrane}/crane_partner_tag_info/list`;
    get(url, (data) => {
      callback(data, null);
    }, (err) => {
      console.error(err);
      callback(null, err);
    });
  }
};

/**
 * 吊车司机详情页分组
 * @param params <p>
 *                  keyword => 关键词
 *               </p>
 * @param callback
 */
const craneDriverTag = dataSourcesObj.craneDriverTag = {
  getData(params, callback) {
    const url = `${ApiConst.apiCrane}/crane_driver_tag_info/list`;
    get(url, (data) => {
      callback(data, null);
    }, (err) => {
      console.error(err);
      callback(null, err);
    });
  }
};

// 保单 的数据源
const insurance = dataSourcesObj.insurance = {
  getData(params, callback) {
    const url = `${ApiConst.gatewayDomain}/logistics/logistics/logistics_insurance/list?size=${PAGE_SIZE}&keyword=${params.keyword}`;
    get(url, (data) => {
      const len = data.length,
        autoData = [];
      for (let i = 0; i < len; i += 1) {
        autoData.push({
          'id': data[i].code,
          'value': data[i].insurancePolicyNo,
          'name': data[i].insurancePolicyNo,
          'data': data[i]
        });
      }
      callback(autoData, null);
    }, (err) => {
      console.error(err);
      callback(null, err);
    });
  },
  getObjectName() {
    return '线下保单';
  },
  getDetailUrl(code, objectName) {
    return '/insurancePolicy/insurancePolicyAdd.html';
  },
  getEditUrl(code, objectName) {
    return '/insurancePolicy/insurancePolicyAdd.html';
  },
  getAddUrl(objectName) {
    return '/insurancePolicy/insurancePolicyAdd.html';
  },
  getColumns(cb) {
    const filter = ['insuranceNo', 'insuranceProductName','insuranceCompanyName','insurancePolicyNo','startTime','endTime'];
    var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/logistics/InsurancePolicy/list_render_info.json`)
    success = JSON.parse(JSON.stringify(success));
    _getConfig(success, filter, cb);
  },
  getSearch(cb) {
    const filter = ['insurancePolicyNo'];
    var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/logistics/InsurancePolicy/search_render_info.json`)
    success = JSON.parse(JSON.stringify(success));
    _getConfig(success, filter, cb); 
  },
  getListData(paramsObj, callback) {
    const url = `${ApiConst.gatewayDomain}/logistics/logistics/logistics_insurance/list?${objToParamStr(paramsObj)}`;
    _getListData(url, callback);
  },
  getDetailData(paramsObj, callback) {
    const url = `${ApiConst.gatewayDomain}/logistics/logistics/logistics_insurance/${paramsObj.code}/get?code=${paramsObj.code}`;
    _getDetailData(paramsObj, url, callback);
  }
};

const personBankAccount = dataSourcesObj.personBankAccount = PersonBankAccountDataSource;
const longTransport = dataSourcesObj.longTransport = LongTransportDataSource;
const freight = dataSourcesObj.freight = FreightDataSource;
const customOrg = dataSourcesObj.customOrg = CustomOrgDataSource;
export {
  popGoodsCategory,
  popGoods,
  payableBill,
  receivableBill,
  quote,
  print,
  orgTag,
  customOrg,
  fleet,
  freight,
  longTransport,
  personBankAccount,
  waybill,
  province,
  city,
  county,
  goodsLossRation,
  goodsLoss,
  standardDistance,
  goodsNumber,
  goodsVolume,
  goodsWeight,
  settleVolumeUnit,
  chargeItemNumber,
  chargeItemPrice,
  chargeItemAmount,
  truckModel,
  truckSize,
  truckCarry,
  truckCubage,
  driverPrice,
  routeDuration,
  goodsPrice,
  carrierPrice,
  truck,
  trailer,
  allTruck,
  driver,
  partner,
  company,
  orgManager,
  bankAccount,
  route,
  rates,
  logistics,
  outsourcingLogistics,
  transportContract,
  employeeContract,
  transport,
  tyre,
  getAll,
  client,
  getAllListData,
  getAllDetailData,
  truckTag,
  driverTag,
  organizationTag,
  goodsCategory,
  goodsName,
  craneCompany,
  craneDriver,
  craneTag,
  craneDriverTag,
  craneCompanyTag,
  craneLicense,
  insurance
};
