
import * as HTTP from './httpUtil';

var ApiConst= require('./ApiConst');
const apiDomain =ApiConst.apiPersonDomain;


/**
 * 列表
 */
function list(paramObj, callback) {
  const apiUrl = `${apiDomain}/member/member_evaluation_record/list`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}


/**
 * 获取table头部数据
 * @param callback
 */
function getColumn(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/person/evaluate/list_render_info.json`);
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}

/**
 * 获取serach数据
 * @param callback
 */
function getSearch(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/person/evaluate/search_render_info.json`);
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}


export { list, getColumn, getSearch };
