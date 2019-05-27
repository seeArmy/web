import { getColumnsFromApi, toAutoCompleteModel } from './AbstractDataSource';

const ApiConst = require('./ApiConst'),
  axios = require('axios');

axios.defaults.withCredentials = true;

function getOrgData(orgFullName, cb) {
  // if (orgFullName) {
    const url = `${ApiConst.apiCustomDomain}/custom/custom_lyg_fleet_info/get?orgFullName=${encodeURIComponent(orgFullName)}`;
    axios.get(url).then((res) => {
      const data = res.data.content;
      if (data) {
        data.code = data.orgNo;
        cb({ content: [data], total: 1 }, null);
      } else {
        cb({ content: [], total: 0 }, null);
      }
    }).catch((err) => {
      console.error(err);
      cb(null, err);
    });
  // } else {
  //   cb({ content: [], total: 0 }, null);
  // }
}

const customOrgColumns = [
  {"showName":"公司全称","elementCode":"text","extraParams":"{\"field1\":\"orgFullName\",\"placeholder1\":\"请输入公司全称\"}","fieldConfigCode":"orgFullName"},
  {"showName":"伙伴简称","elementCode":"text", "extraParams":"{\"field1\":\"orgName\",\"placeholder1\":\"请输入伙伴简称\"}","fieldConfigCode":"orgName"},
  {"showName":"伙伴代码","elementCode":"text", "extraParams":"{\"field1\":\"orgNo\",\"placeholder1\":\"请输入伙伴代码\"}","fieldConfigCode":"orgNo"}
];

export default {
  getObjectName() {
    return '组织';
  },
  getDetailUrl() {
    return '/orgManagementCustom/add.html';
  },
  getEditUrl() {
    return '/orgManagementCustom/add.html';
  },
  getAddUrl() {
    return '/orgManagementCustom/add.html';
  },
  getData(params, callback) {
    getOrgData(params.orgFullName, (success, error) => {
      if (error) {
        callback(null, error);
      } else {
        const result = [];
        success.content.forEach((item) => {
          result.push(toAutoCompleteModel(item));
        });
        callback(result, null);
      }
    });
  },
  getColumns(cb) {
    const result = [];
    customOrgColumns.forEach((item) => {
      result.push(Object.assign({}, item));
    });
    cb({ content: result });
  },
  getSearch(cb) {
    const column = customOrgColumns.find(item => item.fieldConfigCode === 'orgFullName');
    cb({ content: [Object.assign({}, column)] });
  },
  getListData(paramsObj, callback) {
    getOrgData(paramsObj.orgFullName, callback);
  }
};
