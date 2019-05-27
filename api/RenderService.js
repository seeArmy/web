import * as HTTP from './httpUtil';
import { getParam } from './Utils';

const axios = require('axios');

axios.defaults.withCredentials = true;

function getRenderList(renderConfigResponse, callback) {
  const localStorage = window.localStorage,
    eleDefine = JSON.parse(localStorage.getItem('eleDefine')),
    eleInfo = JSON.parse(localStorage.getItem('eleInfo')),
    renderConfigData = getParam({ data: renderConfigResponse }, eleDefine, eleInfo);
  callback(renderConfigData, null);
}

function getRenderListByUrl(configUrl, callback) {
  HTTP.get(configUrl, {}, (success, error) => {
    console.log('error', error, 'success', success);
    if (error) {
      callback(null, error);
    } else {
      getRenderList(success, callback);
    }
  });
}

export { getRenderListByUrl, getRenderList };
