import { getDataFromApi, getColumnsFromApi, getListDataFromApi } from './AbstractDataSource';

const ApiConst = require('./ApiConst');

export default {
  getObjectName() {
    return '车源';
  },
  getDetailUrl() {
    return '/truckLong/add.html?dt=long';
  },
  getEditUrl() {
    return '/truckLong/add.html?dt=long';
  },
  getAddUrl() {
    return '/truckLong/add.html?dt=long';
  },
  getData(params, callback) {
    params.mainTruckCertStatus = 'authenticated';
    params.driverCertStatus = 'authenticated';
    params.transportTag = '长途车辆';
    getDataFromApi(`${ApiConst.apiTransportDomain}/transport/list`, params, callback);
  },
  getColumns(cb) {
    const filter = ['mainTruck', 'driver', 'driverPhone'];
    var success = require('./fieldMetadata/'+ApiConst.fieldMetadataDir+'/transport/transport/detail_render_info.json');
 success = JSON.parse(JSON.stringify(success));
    getColumnsFromApi(success, filter, cb);
  },
  getSearch(cb) {
    var success = require('./fieldMetadata/'+ApiConst.fieldMetadataDir+'/transport/transport/search_render_info.json');
 success = JSON.parse(JSON.stringify(success));
    const filter = ['mainTruck', 'driverPhone'];
    getColumnsFromApi(success , filter, cb);
  },
  getListData(paramsObj, callback) {
    const url = `${ApiConst.apiTransportDomain}/transport/list`;
    paramsObj.mainTruckCertStatus = 'authenticated';
    paramsObj.driverCertStatus = 'authenticated';
    paramsObj.transportTag = '长途车辆';
    getListDataFromApi(url, paramsObj, callback);
  }
};
