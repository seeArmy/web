/**
 * Created by cc on 2017/10/30.
 */

import * as HTTP from './httpUtil';

const apiConst = require('./ApiConst');
const apiDomain = apiConst.apiMessageDomain,
  apiBase = apiConst.BaseDomain

/**
 * 获取列表
 */
function list(paramObj, callback) {
  const apiUrl = `${apiDomain}/message/list`;
  // console.log(apiUrl);
  HTTP.get(apiUrl, paramObj, (response, err) => {
    callback(response, err);
  });
}

/**
 * 删除
 */
function deleted(paramObj, callback) {
  const apiUrl = `${apiDomain}/message/delete/${paramObj.id}`;
  HTTP.post(apiUrl, {}, (success, error) => {
    callback(success, error);
  });
}

function msgStatus(paramObj, callback) {
  const apiUrl = `${apiBase}/platform/member/message_info/${paramObj.id}/${paramObj.status}/get`;
  HTTP.get(apiUrl, {}, (success, error) => {
    callback(success, error);
  });
}

function msgLst(paramObj, callback) {
  const apiUrl = `${apiBase}/platform/member/message_list/get`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

function msgTotalList(paramObj, callback) {
  const apiUrl = `${apiBase}/platform/member/message_list/getTotalNum`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

export { list, deleted, msgLst, msgStatus, msgTotalList };
