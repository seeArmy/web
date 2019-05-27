/**
 * Created by cc on 2018/09/10.
 */

import * as HTTP from './httpUtil';

const apiDomain = require('./ApiConst').apiPlatformDomain;
const fieldMetadataDir = require('./ApiConst').fieldMetadataDir;
import { getParamsFromURL } from '../api/Utils';

/**
 * 添加
 */
function add(paramObj, callback) {
  const apiUrl = `${apiDomain}/platform_config/platform_config_business_relations/submit`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 列表
 */
function list(paramObj, callback) {
  const apiUrl = `${apiDomain}/platform_config/platform_config_business_relations/list`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 删除
 */
function deleted(paramObj, callback) {
  const apiUrl = `${apiDomain}//platform_config/platform_config_business_relations/${paramObj.code}/delete`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

export { add, list, deleted };
