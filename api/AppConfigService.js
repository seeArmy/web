/**
 * Created by cc on 2018/12/29.
 */

import * as utils from './Utils';

const axios = require('axios');
var ApiConst= require('./ApiConst');
const apiDomain = ApiConst.apiPlatformDomain;
axios.defaults.withCredentials=true;

import * as HTTP from './httpUtil';

/**
 * 添加
 * @param partnerName       简称
 * @param callback          回调
 */
function add(paramObj, cb) {
  const apiUrl = `${apiDomain}/platform_config/platform_schedule_settings/${paramObj.scheduleKey}/edit`;
  HTTP.post(apiUrl, paramObj, (res, error) => {
    cb(res, error);
  });
}

/**
 * 根据线路编码获取线路详情
 * @param paramObj        参数对象
 *        code
 * @param callback
 */
function get(paramObj, cb) {
  const apiUrl = `${apiDomain}/platform_config/platform_schedule_settings/${paramObj.scheduleKey}/get`;
  HTTP.get(apiUrl, paramObj, (res, error) => {
    cb(res, error);
  });
}

export { add, get };
