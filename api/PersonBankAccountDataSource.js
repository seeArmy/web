import { getDataFromApi, getListDataFromApi } from './AbstractDataSource';
import * as PersonBankAccountService from './PersonBankAccountService';

const ApiConst = require('./ApiConst');

export default {
  getObjectName() {
    return '银行账户';
  },
  getDetailUrl() {
    return '/driver/account-add.html';
  },
  getEditUrl() {
    return '/driver/account-add.html';
  },
  getAddUrl() {
    return '/driver/account-add.html';
  },
  getData(params, callback) {
    getDataFromApi(`${ApiConst.apiPersonDomain}/person/bank/account/list`, params, callback);
  },
  getColumns(cb) {
    PersonBankAccountService.getColumn(cb);
  },
  getSearch(cb) {
    PersonBankAccountService.getSearch(cb);
  },
  getListData(paramsObj, callback) {
    getListDataFromApi(`${ApiConst.apiPersonDomain}/person/bank/account/list`, paramsObj, callback);
  }
};
