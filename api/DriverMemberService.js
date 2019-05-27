/**
 * Created by myy on 2018/4/17.
 */

import * as utils from './Utils';
import * as HTTP from './httpUtil';

const ApiConst = require('./ApiConst');
const apiDomain = ApiConst.apiOrgDomain;
const apiPlatformDomain = ApiConst.apiPlatformDomain;

/**
 * 添加司机
 */
function add(paramObj, callback) {
    const apiUrl = `${apiPlatformDomain}/person/driver/add`;
    HTTP.post(apiUrl, paramObj, (success, error) => {
        callback(success, error);
    });
}

/**
 * 编辑司机
 */
function edit(code, paramObj, callback) {
    const apiUrl = `${apiPlatformDomain}/platform/driver/edit`;
    HTTP.post(apiUrl, paramObj, (response, err) => {
        callback(response, err);
    });
}

function editBank(paramObj, success) {
    const apiUrl = `${apiPlatformDomain}/platform/driver/${paramObj.code}/editBank`;
    HTTP.post(apiUrl, paramObj, (response, err) => {
        success(response, err);
    });
}

/**
 * 获取司机列表
 */
function list(paramObj, callback) {
    const apiUrl = `${apiPlatformDomain}/platform/driver/manager/list`;
    HTTP.get(apiUrl, paramObj, (response, err) => {
        callback(response, err);
    });
}

/**
 * 获取table头部数据
 * @param callback
 */
function getColumn(callback) {
    var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/platform/driver/list_render_info.json`)
    success = JSON.parse(JSON.stringify(success));
    callback(success);
}

/**
 * 获取serach数据
 * @param callback
 */
function getSearch(callback) {
    var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/platform/driver/search_render_info.json`)
    success = JSON.parse(JSON.stringify(success));
    callback(success);
}

/**
 * 根据code获取司机详情
 * @param paramObj        参数对象
 *         partnerOrgCode
 * @param callback
 */
function get(paramObj, callback) {
    const apiUrl = `${apiPlatformDomain}/platform/driver/${paramObj.code}/get`;
    HTTP.get(apiUrl, {}, (success, error) => {
        callback(success, error);
    });
}

/**
 * 删除司机
 * @param paramObj          参数对象
 *         partnerOrgCode    编码
 * @param callback          回调
 */
function deleted(paramObj, callback) {
    const apiUrl = `${ApiConst.apiPlatformDomain}/platform/driver/${paramObj.code}/delete`;
    HTTP.post(apiUrl, {}, (success, error) => {
        callback(success, error);
    });
}

/**
 * export
 * @param callback
 */
function exportCsv(paramObj, callback) {
    const apiUrl = `${ApiConst.apiPlatformDomain}/export/custom/platformDriver`;
    HTTP.postJson(apiUrl, paramObj, (success, error) => {
        callback(success, error);
    });
}

/**
 * 下载错误数据的CSV文件
 */
function downloadErrorData(paramObj, callback) {
    const apiUrl = `${ApiConst.apiPlatformDomain}/generator/driver`;
    HTTP.post(apiUrl, paramObj, (success, error) => {
        callback(success, error);
    });
}

/**
 * 下载CSV模板
 */
function downloadTemplate(paramObj, callback) {
    const apiUrl = `${ApiConst.apiPlatformDomain}/download/template/driver`;
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
    const apiUrl = `${ApiConst.apiPlatformDomain}/person/driver/${code}/verify`;
    HTTP.post(apiUrl, {}, (success, error) => {
        callback(success, error);
    });
}

/**
 * 拉入黑名单
 */
function blacklist(paramObj, cb) {
    const apiUrl = `${apiDomain}/platform/user/manager/${paramObj.code}/blacklist`;
    HTTP.post(apiUrl, paramObj, (success, error) => {
        cb(success, error);
    });
}


// ================================== 司机委托收款 的API start
function getColumnDriverEntrust(callback) {
    var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/platform/driverEntrust/list_render_info.json`)
    success = JSON.parse(JSON.stringify(success));
    callback(success);
}

function getSearchDriverEntrust(callback) {
    var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/platform/driverEntrust/search_render_info.json`)
    success = JSON.parse(JSON.stringify(success));
    callback(success);
}

function listDriverEntrust(paramObj, callback) {
    const apiUrl = `${apiPlatformDomain}/platform/driver/authorize/list`;
    HTTP.get(apiUrl, paramObj, (response, err) => {
        callback(response, err);
    });
}

function getDriverEntrust(paramObj, callback) {
    const apiUrl = `${apiPlatformDomain}/platform/employee/${paramObj.userCode}/get`;
    HTTP.get(apiUrl, {}, (success, error) => {
        callback(success, error);
    });
}
// ================================== 司机委托收款 的API end
// 
// 
// 获取详情显示字段
function getDetail(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/platform/driver/detail_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    cb(success);
}


function getImage(paramObj, callback) {
    const apiUrl = `${apiPlatformDomain}/fw/image/${paramObj.resourceCode}/get`;
    HTTP.get(apiUrl, {}, (success, error) => {
        callback(success, error);
    });
}


export {getDetail,getColumnDriverEntrust,getSearchDriverEntrust,listDriverEntrust,getDriverEntrust, add, edit, list, getColumn, getSearch, get, editBank, deleted, exportCsv, downloadErrorData, downloadTemplate, verify, blacklist,
        getImage };
