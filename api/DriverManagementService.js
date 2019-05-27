/**
 * Created by cc on 2017/10/24.
 */

import * as HTTP from './httpUtil';

const apiDomain = require('./ApiConst').apiPlatformDomain;


/**
 * 司机管理列表
 */
function list(paramObj, callback) {
  const apiUrl = `${apiDomain}/platform/driver/manager/list`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
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

/**
 * 获取列表字段
 */
function getColumn(callback) {
  const success = {
    code: 200,
    content: [
      {
        showName: '司机姓名',
        fieldConfigCode: 'fullName',
        elementCode: 'label',
        extraParams: '{"field1": "fullName", "required": "false"}'
      },
      {
        showName: '账号状态',
        fieldConfigCode: 'userStatus',
        elementCode: 'select',
        extraParams: '{"field1":"userStatus", "required": "false", "optionsValue1":["inactivated","active"],"options1":["未激活","已激活"]}'
      },
      {
        showName: '手机号',
        fieldConfigCode: 'phone',
        elementCode: 'label',
        extraParams: '{"field1": "phone", "required": "false"}'
      },
      {
        showName: '标签',
        fieldConfigCode: 'userTagList',
        elementCode: 'tag',
        extraParams: '{"field1": "userTagList", "required": "false"}'
      },
      {
        showName: '性别',
        fieldConfigCode: 'gender',
        elementCode: 'radio',
        extraParams: '{"field1": "gender", "required": "false", "optionsValue1":["male","female"],"options1":["男","女"]}'
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
  callback(success);
  return success;
}

/**
 * 获取搜索字段
 */
function getSearch(callback) {
  const success = {
    code: 200,
    content: [
      {
        showName: '司机姓名',
        fieldConfigCode: 'fullName',
        elementCode: 'text',
        extraParams: '{"field1": "fullName", "placeholder1":"请输入司机姓名"}'
      },
      {
        showName: '手机号',
        fieldConfigCode: 'phone',
        elementCode: 'text',
        extraParams: '{"field1": "phone", "placeholder1":"请输入手机号"}'
      }
    ]
  };
  callback(success);
  return success;
}

/**
 * 匹配司机
 */
function matchDriverByPhone(paramObj, callback) {
  const apiUrl = `${apiDomain}/platform/member/user/get`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}


export { list, blacklist, getColumn, getSearch, matchDriverByPhone};
