/**
 * Created by zhuyi on 17/5/2.
 */
// const config = require('../config');
// const url = process.env.NODE_ENV === "development"?config.dev.url:config.build.url;

const domainUrl = process.env.rltx;
var domain = (window.rltx && window.rltx.domainUrl) ? window.rltx.domainUrl : domainUrl;
var domainwxUrl = (window.rltx && window.rltx.wx) ? window.rltx.wx : process.env.WS;
if(window.rltx && window.rltx.domainUrl == '/') {
  domain = window.location.origin
  domainwxUrl = window.location.origin
}

const Observer = require('../src/common/observer.js')

let fieldMetadataDir = 'master';
// 目前配置都是取master目录
// if (localStorage.getItem('orgType')==='2') {
//   fieldMetadataDir = 'motorcade';
// }
// 登录
module.exports = {

  env:process.env.NODE_ENV,
  ws: domainwxUrl,

  apiDomain: `${domain}/account`,
// 组织
  apiOrgDomain: `${domain}/org`,
// 组织配置
  apiOrgConfigDomain: `${domain}/org-config`,
// 车
  apiTruckDomain: `${domain}/truck`,
// 挂车
  apiTrailerDomain: `${domain}/trailer`,
// 设备
  apiLbsDomain: `${domain}/lbs`,
// 设备绑定
  apiOprLbsDomain: `${domain}/opr-lbs`,
// 人
  apiPersonDomain: `${domain}/person`,
// 平台
  apiPlatformDomain: `${domain}/platform`,
// 组织列表
// 线路
  apiLineDomain: `${domain}/resource`,
// 资源
  apiResourceDomain: `${domain}/resource`,
// 权限
  apiPermissionDomain: `${domain}/permission`,
// 运力
  apiTransportDomain: `${domain}/transport`,
// 订单
  apiLogisticsDomain: `${domain}/logistics`,
// 货源
  apiFreightDomain: `${domain}/freight`,
// 消息
  apiMessageDomain: `${domain}/message`,
//
  gatewayDomain: `${domain}`,
  // settle
  apiSettleDomain: `${domain}/settle`,

  apiAccountDomain: `${domain}/account`,
// 通用地址
//   url: 'http://member.rltx.xyz:3458',
// 运单
  apiWayBillDomain: `${domain}/waybill`,
  apiWaybillBrokerDomain: `${domain}/waybillBroker`,
  apiRegisterDomain: `${domain}/account`,
  apiCompanyDomain: `${domain}/org`,
// 维保
  apiMaintenaceDomain: `${domain}/maintenance`,
// 报表
  apiReportDomain: `${domain}/report`,
  menu: `${domain}/permission`,
  apiInquiryDomain: `${domain}/inquiry`,
// 版本
  apiDiverApiDomain: `${domain}/driver-api`,
// 基础地址
  BaseDomain: `${domain}`,
  fieldMetadataDir:fieldMetadataDir,
  // 江苏无车承运人
  apiShipmentDomain: `${domain}`,
  //建华线路运价
  routeFreightRate:`${domain}/routeFreightRate`,
};
