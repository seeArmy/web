import { objToParamStr } from './Utils';

const axios = require('axios');

axios.defaults.withCredentials = true;


/**
 * 封装Get请求
 * @param url 请求的URL
 * @param successCallback 成功回调函数
 * @param errorCallback 失败回调函数
 */
function get(url, successCallback, errorCallback) {
  axios.get(url).then((res) => {
    const data = res.data;
    successCallback(data.content, data.total);
  }).catch((err) => {
    console.error(err);
    errorCallback(err);
  });
}
function post(url, param, successCallback, errorCallback) {
  axios.post(url, param).then((res) => {
    const data = res.data;
    successCallback(data.content);
  }).catch((err) => {
    console.error(err);
    errorCallback(err);
  });
}
function getFilterConfig(urlData, filter, cb) {
  const configData = [];

  urlData.content.forEach((val) => {
      if (filter.indexOf(val.fieldConfigCode) > -1) {
        configData.push(val);
      }
    });
    cb({ content: configData }, null);

}
function toFullUrl(url, paramsObj) {
  return `${url}?${objToParamStr(paramsObj)}`;
}
function toAutoCompleteModel(data) {
  return { id: data.code, value: data, name: data, data };
}
function getColumnsFromApi(urlData, filter, cb) {
  getFilterConfig(urlData, filter, cb);
}
function getListDataFromApi(url, paramsObj, callback) {
  const urlWithParams = toFullUrl(url, paramsObj);
  get(urlWithParams, (data, total) => {
    callback({ content: data, total }, null);
  }, (err) => {
    callback(null, err);
  });
}
function getDataFromApi(url, params, callback) {
  const urlWithParams = toFullUrl(url, params);
  get(urlWithParams, (data) => {
    const len = data.length,
      autoData = [];
    for (let i = 0; i < len; i += 1) {
      autoData.push(toAutoCompleteModel(data[i]));
    }
    callback(autoData, null);
  }, (err) => {
    console.error(err);
    callback(null, err);
  });
}

export { get, post, getListDataFromApi, getColumnsFromApi, getDataFromApi, getFilterConfig, toAutoCompleteModel, toFullUrl };
