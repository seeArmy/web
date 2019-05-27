/*jshint esversion:6 */
import * as HTTP from './httpUtil';
const apiDomain = require('./ApiConst').gatewayDomain,
  ctrl = 'report/report/bigScreen'

export function bsService({params, action}, callback) {
  const apiUrl = `${apiDomain}/${ctrl}/${action}`;
  HTTP.post(apiUrl, params, (res, error) => {
    callback(res, error);
  });
}

