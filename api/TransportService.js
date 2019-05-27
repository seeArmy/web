/**
 * 运力服务
 * Created by zyc on 2017/7/6.
 */

import * as HTTP from './httpUtil';
var ApiConst= require('./ApiConst');
const apiDomain = ApiConst.apiTransportDomain;

/**
 * 添加运力
 */
function add(paramObj, callback) {
  const apiUrl = `${apiDomain}/transport/add`;
  // axios.post(apiUrl, utils.objToParamStr(paramObj), {
  //   headers: {
  //     'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  //   }
  // }).then((res) => {
  //   const response = res.data;
  //   // console.log(response);
  //   if (callback && response.code === code.success) {
  //     callback(response, null);
  //   } else {
  //     console.error('error code: ' + response.code);
  //     console.error('error url: ' + url);
  //     console.error('error message: ' + response.content);
  //     callback(null, response);
  //     // alert(response.content);
  //     return false;
  //   }
  // }).catch((err) => {
  //   console.error('url:',apiUrl,'paramObj:',paramObj);
  //   console.error(err);
  // });
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  })
}

/**
 * 编辑运力
 */
function edit(code, paramObj, callback) {
  const apiUrl = `${apiDomain}/transport/${code}/edit`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 获取运力列表
 */
function list(paramObj, callback) {
  const apiUrl = `${apiDomain}/transport/list`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}


/**
 * 删除运力
 */
function deleted(paramObj, callback) {
  const apiUrl = `${apiDomain}/transport/${paramObj.code}/delete`;
  HTTP.get(apiUrl, {}, (success, error) => {
    callback(success, error);
  });
}

/**
 * 根据伙伴编码获取伙伴详情
 * @param paramObj        参数对象
 *         transportOrgCode
 * @param callback
 */
function get(paramObj, callback) {
  const apiUrl = `${apiDomain}/transport/${paramObj.code}/get`;
  HTTP.get(apiUrl, {}, (success, error) => {
    callback(success, error);
  });
}
/**
 * 获取table头部数据
 * @param callback
 */
function getColumn(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/transport/transport/list_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}

/**
 * 获取serach数据
 * @param callback
 */
function getSearch(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/transport/transport/search_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}

/**
 * 获取伙伴详情
 * @param callback
 */
function getDetail(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/transport/transport/detail_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}

/**
 * export
 * @param callback
 */
function exportCsv(paramObj, callback) {
  const apiUrl = `${ApiConst.apiTruckDomain}/export/custom/transport`;
  HTTP.postJson(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 下载错误数据的CSV文件
 */
function downloadErrorData(paramObj, callback) {
  const apiUrl = `${ApiConst.apiTruckDomain}/generator/truck`;
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

/**
 * 下载CSV模板
 */
function downloadTemplate(paramObj, callback) {
  const apiUrl = `${ApiConst.apiTruckDomain}/download/template/truck`;
  HTTP.get(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

// 切换 主驾 和副驾 只需要传递 code 即可
// POST /transport/change/main_vice_driver/{code}
function mainViceDriver(paramObj, callback) {
  const apiUrl = `${apiDomain}/transport/change/main_vice_driver/${paramObj.code}`;
  HTTP.post(apiUrl, {}, (success, error) => {
    callback(success, error);
  });
}

/**
 * 获取标签列表
 */
function tagList(callback) {
  const apiUrl = `${ApiConst.apiTruckDomain}/tag_info/truck/list`
  HTTP.get(apiUrl, {}, (success, error) => {
    callback(success, error);
  });
}

// 添加标签
function addTag(paramObj, callback) {
  const apiUrl = `${ApiConst.apiTruckDomain}/tag_info/truck/add`
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

// 编辑标签
function editTag(paramObj, callback) {
  const apiUrl = `${ApiConst.apiTruckDomain}/tag_info/truck/edit`
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

// 删除标签
function deleteTag(paramObj, callback) {
  const apiUrl = `${ApiConst.apiTruckDomain}/tag_info/truck/delete`
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

// 分享运力
function shareTransport(paramObj, callback) {
  const apiUrl = `${ApiConst.apiTransportDomain}/transport/share`
  HTTP.post(apiUrl, paramObj, (success, error) => {
    callback(success, error);
  });
}

export {shareTransport,mainViceDriver, add, edit, list, deleted, get, getColumn, getSearch, getDetail, exportCsv, downloadErrorData, downloadTemplate,
  tagList, addTag, editTag, deleteTag };
