/* jshint esversion:6 */
import * as HTTP from './httpUtil';
var ApiConst= require('./ApiConst');

const axios = require('axios'),
  apiBase = require('./ApiConst').BaseDomain,
  ctrl = 'pay/ljsConfig'

axios.defaults.withCredentials = true;

export function add(paramObj, callback) {
  const apiUrl = `${apiBase}/${ctrl}/addLjsConfig`;
  HTTP.post(apiUrl, paramObj, (response, err) => {
    callback(response, err);
  });
}

export function list(paramObj, callback) {
  const apiUrl = `${apiBase}/${ctrl}/getLjsConfigPage`;
  HTTP.post(apiUrl, paramObj, (response, err) => {
    callback(response, err);
  });
}

export function update(paramObj, callback) {
  const apiUrl = `${apiBase}/${ctrl}/updateLjsConfig`;
  HTTP.post(apiUrl, paramObj, (response, err) => {
    callback(response, err);
  });
}

export function doActive(paramObj, callback) {
  const apiUrl = `${apiBase}/${ctrl}/doActiveLjsConfig`
  HTTP.post(apiUrl, paramObj, (response, err) => {
    callback(response, err);
  });
}
