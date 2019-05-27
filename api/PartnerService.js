/**
 * Created by baipf on 2017/5/18.
 */

import * as utils from './Utils';

const axios = require('axios');
axios.defaults.withCredentials = true;
import * as HTTP from './httpUtil';
var ApiConst= require('./ApiConst');
const apiDomain = ApiConst.apiOrgDomain;
const apiPlatDomain = ApiConst.apiPlatformDomain;

const apiBase = ApiConst.BaseDomain;




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
function add(paramObj, success) {
  const apiUrl = `${apiDomain}/partner/add`;
  HTTP.post(apiUrl, paramObj, (response, err) => {
    success(response, err);
  });
}

/**
 * 编辑伙伴
 * @param partnerOrgCode    编码
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
 * @param callback
 */
function edit(code, paramObj, success) {
  const apiUrl = `${apiDomain}/partner/${code}/edit`;
  HTTP.post(apiUrl, paramObj, (response, err) => {
    success(response, err);
  });
}

function editBank(paramObj, success) {
  const apiUrl = `${apiDomain}/partner/${paramObj.code}/editBank`;
  HTTP.post(apiUrl, paramObj, (response, err) => {
    success(response, err);
  });
}


/**
 * 拒绝伙伴邀请
 * @param paramObj  参数对象
 *         id        邀请id
 * @param callback  回调
 */
function inviteCancel(paramObj, callback) {
  const apiUrl = `${apiDomain}/partner/invite/${paramObj.id}/cancel`;
  // console.log(apiUrl);
  axios.post(apiUrl).then(function (response) {
    // console.log(response);
    callback(response, null);
  }).catch(function (err) {
    callback(null, err);
  });
}

/**
 * 同意伙伴邀请
 * @param paramObj  参数对象
 *         id        邀请id
 * @param callback  回调
 */
function inviteConfirm(paramObj, callback) {
  const apiUrl = `${apiDomain}/partner/invite/${paramObj.id}/confirm`;
  // console.log(apiUrl);
  axios.post(apiUrl).then(function (response) {
    // console.log(response);
    callback(response, null);
  }).catch(function (err) {
    callback(null, err);
  });
}

/**
 * 查询待确认伙伴列表
 * @param type      other-待对方确认，owner-待我确认
 * @param page      页码
 * @param size      页长
 * @param callback  回调
 */
function inviteRecordList(paramObj, callback) {
  const apiUrl = `${apiDomain}/partner/invite_record/list/${paramObj.type}`;
  // console.log(apiUrl);
  axios.get(apiUrl, { params: utils.objToObj(paramObj) }).then(function (response) {
    // console.log(response);
    callback(response, null);
  }).catch(function (err) {
    callback(null, err);
  });
}

/**
 * 获取伙伴列表
 * @param partnerName   伙伴名称
 * @param orgTagList    标签列表
 * @param mark          检索
 * @param page          页码
 * @param size          页长
 * @param callback      回调
 */
function list(paramsObj, success) {
  const apiUrl = `${apiDomain}/partner/list`;
  HTTP.get(apiUrl, paramsObj, (response, err) => {
    success(response, err);
  });
}

/**
 * 获取伙伴字段配置列表
 * @param paramObj  参数对象
 *         orgCode   组织
 * @param callback  回调
 */
function fieldConfigList(paramObj, callback) {
  const apiUrl = `${apiDomain}/partner/partner_field_config/list/${paramObj.orgCode}`;
  // console.log(apiUrl);
  // axios.get(apiUrl).then(function (response) {
  //   // console.log(response);
  //   callback(response, null);
  // }).catch(function (err) {
  //   callback(null, err);
  // });
  HTTP.get(apiUrl, {}, (response, err) => {
    success(response, err);
  });
}

/**
 * 删除伙伴
 * @param paramObj          参数对象
 *         partnerOrgCode    编码
 * @param callback          回调
 */
function deleted(paramObj, success) {
  const apiUrl = `${apiDomain}/partner/${paramObj.code}/delete`;
  HTTP.post(apiUrl, {}, (response, err) => {
    success(response, err);
  });
}
/**
 * 匹配公司详情
 */
function getList(paramObj, callback) {
  const apiUrl = `${apiPlatDomain}/platform/member/org/get`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 根据伙伴编码获取伙伴详情
 * @param paramObj        参数对象
 *         partnerOrgCode
 * @param callback
 */
function get(paramObj, success) {
  const apiUrl = `${apiDomain}/partner/${paramObj.code}/get`;
  HTTP.get(apiUrl, utils.codeNull(paramObj), function (res, err) {
    success(res, err);
  });
}

/**
 * 获取table头部数据
 * @param callback
 */
function getColumn(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/org/partner/list_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    cb(success);
}

/**
 * 获取serach数据
 * @param callback
 */
function getSearch(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/org/partner/search_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    cb(success);
}

/**
 * 获取table头部数据
 * @param callback
 */
function getInquiryColumn(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/org/partner/inquiry/list_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    cb(success);
}

/**
 * 获取serach数据
 * @param callback
 */
function getInquirySearch(cb) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/org/partner/inquiry/search_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    cb(success);
}


/**
 * 获取伙伴详情
 * @param callback
 */
function getDetail(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/org/partner/detail_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}

/**
 * export
 * @param callback
 */
function exportCsv(paramObj, callback) {
  const apiUrl = `${apiDomain}/export/custom/partner`;
  HTTP.postJson(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 下载错误数据的CSV文件
 */
function downloadErrorData(paramObj, callback) {
  const apiUrl = `${apiDomain}/generator/partner`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 下载CSV模板
 */
function downloadTemplate(paramObj, callback) {
  const apiUrl = `${apiDomain}/download/template/partner`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 提交认证 post post /org_attachment/add 
 */
function addAttachment(paramObj, success) {
  const apiUrl = `${apiDomain}/org_attachment/add `;
  HTTP.post(apiUrl, paramObj, (response, err) => {
    success(response, err);
  });
}

/**
 * 获取附件  get /org_attachment/list 
 */
function getAttachment(paramObj, callback) {
  const apiUrl = `${apiDomain}/org_attachment/list`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}



// get /{module}/fw/image/{resourceCode}/get  获取图片
function getAttachmentUrl(resourceCode, callback) {
  const apiUrl = `${apiDomain}/fw/image/${resourceCode}/get`;
  HTTP.get(apiUrl,{}, (success, error) => {
    callback(success, error);
  });
}

/**
 * edit 编辑 
 */
function editAttachment(paramObj, success) {
  const apiUrl = `${apiDomain}/org_attachment/edit `;
  HTTP.post(apiUrl, paramObj, (response, err) => {
    success(response, err);
  });
}


/**
 * 认证提交  post /partner/{code}/verify 
 */
function verifyPartner(code,paramObj, success) {
  const apiUrl = `${apiDomain}/partner/${code}/verify`;
  HTTP.post(apiUrl, paramObj, (response, err) => {
    success(response, err);
  });
}

/**
 * 根据伙伴编码获取伙伴详情 公共页面的请求
 * @param paramObj        参数对象
 *         partnerOrgCode
 * @param callback
 */
function getPublic(paramObj, success) {
  const apiUrl = `${apiDomain}/partner/getPlatformInfo`;
  HTTP.get(apiUrl, utils.codeNull(paramObj), function (res, err) {
    success(res, err);
  });
}

/**
 * 获取标签列表
 */
function tagList(callback) {
  const apiUrl = `${ApiConst.apiOrgDomain}/tag_info/org/list`
  HTTP.get(apiUrl, {}, (success, error) => {
    callback(success, error);
  });
}

// 添加标签
function addTag(paramObj, callback) {
  const apiUrl = `${ApiConst.apiOrgDomain}/tag_info/org/add`
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

// 编辑标签
function editTag(paramObj, callback) {
  const apiUrl = `${ApiConst.apiOrgDomain}/tag_info/org/edit`
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

// 删除标签
function deleteTag(paramObj, callback) {
  const apiUrl = `${ApiConst.apiOrgDomain}/tag_info/org/delete`
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

export {getPublic, add, edit, editBank, inviteCancel, inviteConfirm, inviteRecordList, list, fieldConfigList, deleted, get, getColumn, getSearch, getInquiryColumn, getInquirySearch, getDetail, exportCsv, downloadErrorData, downloadTemplate, addAttachment, getAttachment, getAttachmentUrl, editAttachment, verifyPartner, getList,
  tagList, addTag, editTag, deleteTag };
