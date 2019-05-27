import axios from 'axios';
import * as apiConst from './ApiConst';
import * as HTTP from './httpUtil';
import * as utils from './Utils';

function getPosition(paramObj, callback) {
    const url = `${apiConst.BaseDomain}/lbs/lbs/location/current`;
    HTTP.post(url, paramObj, (success, error) => {
        callback(success, error);
    });
}

function getAddress(paramObj, callback) {
    const url = `${apiConst.BaseDomain}/lbs/lbs/get/address?type=${paramObj.type}&lat=${paramObj.lat}&lng=${paramObj.lng}`;
    HTTP.get(url, {}, (success, error) => {
        callback(success, error);
    });
}

function getHistoryLocation(paramObj, callback) {
    const url = `${apiConst.BaseDomain}/lbs/lbs/location/history/${paramObj.truckLicenseNo}`;
    HTTP.get(url, paramObj, (success, error) => {
        callback(success, error);
    });
}

// 实时库搜索轨迹
function getHistoryLocationRealtime(paramObj, callback) {
    const url = `${apiConst.BaseDomain}/smartz/call`;
    HTTP.get(url, paramObj, (success, error) => {
        callback(success, error);
    });
}

// 实时位置查询
function liveLocation(paramObj, callback) {
  const apiUrl = `${apiConst.gatewayDomain}/smartz/call`,
    query = Object.assign(paramObj, { bizEventNo: 'huaNengGetLastPosZJ'});
  HTTP.post(apiUrl, query, (success, error) => {
    callback(success, error);
  });
}

export { getPosition, getAddress, getHistoryLocation, getHistoryLocationRealtime, liveLocation };
