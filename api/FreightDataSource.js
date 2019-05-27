import { getDataFromApi, getColumnsFromApi, getListDataFromApi } from './AbstractDataSource';

const ApiConst = require('./ApiConst');

export default {
  getObjectName() {
    return '货源';
  },
  getDetailUrl() {
    return '/freightCustom/add.html';
  },
  getEditUrl() {
    return '/freightCustom/add.html';
  },
  getAddUrl() {
    return '/freightCustom/add.html';
  },
  getData(params, callback) {
    getDataFromApi(`${ApiConst.apiFreightDomain}/freight/list`, params, callback);
  },
  getColumns(cb) {
    const filter = ['truckLicenseNo'];
    var success = require('./fieldMetadata/'+ApiConst.fieldMetadataDir+'/freight/freight/list_render_info.json');
 success = JSON.parse(JSON.stringify(success));
    getColumnsFromApi(success, filter, cb);
  },
  getSearch(cb) {
    const filter = ['truckLicenseNo'];
    var success = require('./fieldMetadata/'+ApiConst.fieldMetadataDir+'/freight/freight/search_render_info.json');
 success = JSON.parse(JSON.stringify(success));
    getColumnsFromApi(success , filter, cb);
  },
  getListData(paramsObj, callback) {
    const url = `${ApiConst.apiFreightDomain}/freight/list`;
    getListDataFromApi(url, paramsObj, callback);
  }
};
