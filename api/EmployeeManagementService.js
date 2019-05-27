/**
 * 员工会员管理
 * Created by myy on 2018/4/16.
 */

import * as utils from './Utils';

const axios = require('axios');
var ApiConst = require('./ApiConst');
const apiDomain = ApiConst.apiPlatformDomain,
    apiPermissionDomain = ApiConst.apiPermissionDomain,
    apiOrgDomain = ApiConst.apiOrgDomain;
axios.defaults.withCredentials = true;

import * as HTTP from './httpUtil';

/**
 * 获取员工管理列表
 * @param mark          检索
 * @param page          页码
 * @param size          页长
 * @param callback      回调
 */
function list(paramObj, cb) {
    const apiUrl = `${apiDomain}/platform/employee/manager/list`;
    HTTP.get(apiUrl, paramObj, (response, error) => {
        cb(response, error);
    });
}

// /**
//  * 获取人员管理部门关系列表
//  * @param mark          检索
//  * @param page          页码
//  * @param size          页长
//  * @param callback      回调
//  */
// function personDeptRelationList(paramObj, cb) {
//     const apiUrl = `${apiDomain}/employee/dept/relation/list`;
//     HTTP.get(apiUrl, paramObj, (response, error) => {
//         cb(response, error);
//     });
// }

/**
 * 获取table头部数据
 * @param callback
 */
function getColumn(cb) {
    var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/platform/employee/list_render_info.json`)
    success = JSON.parse(JSON.stringify(success));
    cb(success);
}

/**
 * 获取search数据
 * @param callback
 */
function getSearch(cb) {
    var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/platform/employee/search_render_info.json`)
    success = JSON.parse(JSON.stringify(success));
    cb(success);
}


/**
 * 创建人员
 * @param paramObj
 *         code      用户编码
 *         fullName      真实姓名（跟身份证一致）
 *         deptCode      部门编码
 *         phone         手机号码
 *         userType      1.非司机用户 2.司机用户
 *         positionName  岗位名称
 *         roleCode      角色code
 *         userTag       标签列表
 * @param callback       回调
 */
function add(paramObj, cb) {
    const apiUrl = `${apiDomain}/employee/add`;
    HTTP.post(apiUrl, paramObj, (res, error) => {
        cb(res, error);
    });
}

/**
 * 编辑员工会员
 * @param paramObj     参数对象
 *         code      用户对象
 *         fullName      真实姓名（跟身份证一致）
 *         userType      类型
 *         deptCode      部门
 *         positionName  主营业务
 *         roleCode      角色
 *         userTag       标签
 *         phone         手机号
 * @param callback
 */
function edit(code,paramObj, cb) {
    const apiUrl = `${apiDomain}/platform/employee/edit`;
    HTTP.post(apiUrl, paramObj, (res, error) => {
        cb(res, error);
    });
}


/**
 * 删除员工(离职)
 * @param paramObj
 *         code
 * @param callback
 */
function deleted(paramObj, cb) {
    const apiUrl = `${apiDomain}/platform/employee/${paramObj.code}/delete`;
    HTTP.post(apiUrl, paramObj, (success, error) => {
        cb(success, error);
    });
}

/**
 * 销户
 * @param paramObj
 *         code
 * @param callback
 */
function closeAccount(paramObj, cb) {
    const apiUrl = `${apiDomain}/account/close_account`;
    HTTP.post(apiUrl, paramObj, (success, error) => {
        cb(success, error);
    });
}

/**
 * 拉黑
 * @param paramObj
 *         code
 * @param callback
 */
function blacklist(paramObj, cb) {
    const apiUrl = `${apiDomain}/platform/user/manager/${paramObj.code}/blacklist`;
    HTTP.post(apiUrl, paramObj, (success, error) => {
        cb(success, error);
    });
}



/**
 * 员工会员详情
 * @param paramObj  参数对象
 *         code  编码
 * @param callback  回调
 */
function get(paramObj, cb) {
    const apiUrl = `${apiDomain}/platform/employee/${paramObj.code}/get`;
    HTTP.get(apiUrl, paramObj, (res, error) => {
        cb(res, error);
    });
}

/**
 * export
 * @param callback
 */
function exportCsv(paramObj, callback) {
    const apiUrl = `${apiDomain}/export/custom/platformEmployee`;
    HTTP.postJson(apiUrl, paramObj, (success, error) => {
        callback(success, error);
    });
}

/**
 * 下载错误数据的CSV文件
 */
function downloadErrorData(paramObj, callback) {
    const apiUrl = `${apiDomain}/generator/employee`;
    HTTP.post(apiUrl, paramObj, (success, error) => {
        callback(success, error);
    });
}

/**
 * 下载CSV模板
 */
function downloadTemplate(paramObj, callback) {
    const apiUrl = `${apiDomain}/download/template/employee`;
    HTTP.get(apiUrl, paramObj, (success, error) => {
        callback(success, error);
    });
}

/**
 * 获取公司
 * @param mark          检索
 * @param page          页码
 * @param size          页长
 * @param callback      回调
 */
function joinCompany(paramObj, cb) {
  const apiUrl = `${apiOrgDomain}/org/join_list`;
  HTTP.get(apiUrl, paramObj, (response, error) => {
    cb(response, error);
  });
}

export { list, getColumn, getSearch, add, edit, deleted, closeAccount, blacklist, get, exportCsv, downloadErrorData, downloadTemplate, joinCompany };
