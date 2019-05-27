/**
 * pathConfig.js
 * Created by zyc on 17/8/14.
 */

/**
 * chunks 编译打包的chunks
 * templatePath 文件模板目录
 * filePath dev文件目录
 * outputPath build打包输出目录
 * urlPath dev环境游览器访问路径
 * 默认会根据chunks来生成配置，如chunks为'config/add'，生成配置如下
 * {
    chunks: 'config/add',
    templatePath: 'template/config/add.html',
    filePath: './src/config/add.js',
    outputPath: '/config/add.html',
    urlPath: 'config/add.html'
  }
 * 如果需要自己单独配置，在config里面修改对应的配置, 但是chunks必填
 * 如下
 * {
    'chunks':'employee/add',
    'filePath': './src/employee/add/add.js'
   },
 * 如果不需要修改，只需要写个chunks
 * [
     {
       'chunks':'employee/list',
       'filePath': './src/employee/list/list.js'
     },
     'driver/add'
   ]
 * 运行dev环境 npm run dev item group , group是我们定义的对应的组, 例如帐号就是account, 如果想运行多组织，就用npm run dev item account/person 这种方式, 不填默认运行所有
 * 运行build环境, npm run build test/dev group , group是我们定义的对应的组, 例如帐号就是account, 如果想运行多组织，就用npm run dev item account/person 这种方式, 不填默认build所有
 */
const configList = {
  // 登录，menu，注册
  account: ['login/login', 'login/index', 'menu/index', 'menu/menu', 'register/user', 'register/org', 'register/enterprise', 'register/company', 'register/join', 'register/success', 'register/wait', 'register/personal', 'register/activation',
    'findPwd/confirm', 'findPwd/reset', 'findPwd/success'
  ],
  // 人员，司机， 个人信息
  person: [
    'person/info', 'driver/add', 'driver/list', 'driver/account-add', 'driver/account-list',
    'personContract/add', 'personContract/list', 'attendance/add', 'attendance/list',
    { 'chunks': 'employee/add', 'filePath': './src/employee/add/add.js' },
    { 'chunks': 'employee/list', 'filePath': './src/employee/list/list.js' }
  ],
  // 伙伴，公司信息, 安全设置, 会员认证
  org: ['org/self', 'partner/add','partnerPublic/add', 'partner/list', 'safe/cert', 'safe/verify', 'safe/safe', 'bankAccount/add', 'bankAccount/list'],
  // 挂车，车辆，车辆定位
  truck: ['trailer/add', 'trailer/list', 'truck/add', 'truck/list', 'truck/detail', 'car/car', 'attachment/add', 'attachment/list',
    // { 'chunks': 'truck/truck-map', 'filePath': './src/truck/truck-map' }
    'truck/truck-map',
    'truck/truck-gps',
    'truck/truck-pos',
    'truck/truck-search',
    'attachmentPerson/add', 'attachmentPerson/list',
    'attachmentPlatform/add', 'attachmentPlatform/list',
    'truckLicenseManagement/list'
  ],
  // 运单，货单，付款单
  waybill: ['waybill/action', 'waybill/settle', 'waybill/list', 'waybill/recycleList', 'waybill/add', 'waybill/settleList', 'waybill/report', 'waybill/agreement', 'waybillNew/add', 'outsourcingWaybill/list', 'outsourcingWaybill/recycleList', 'outsourcingWaybill/add','waybill/manifestList',
    // 'sebillreceivable/list',
    // 'sebillreceivable/presebillreceivable',
    // 'sebillreceivable/create',
    // 'sebillreceivable/receivablelist',
    // 'sebillreceivable/receivableedit',
    // 'sebillreceivable/optionresult',
    // 'sebillreceivable/receivabledetail',
    // { 'chunks': 'settleBillReceivable/create', 'filePath': './src/settleBillReceivable/create', 'outputPath': '/settle_bill_beceivable/create.html', 'urlPath': 'settle_bill_beceivable/create.html' },
    { 'chunks': 'waybill/print/add', 'filePath': './src/waybill/print/add' },
    { 'chunks': 'waybill/print/list', 'filePath': './src/waybill/print/list' },
    { 'chunks': 'waybill/waybillPrintDocumentRelation/list', 'filePath': './src/waybill/waybillPrintDocumentRelation/list' }
  ],
  // 订单
  // logistics: ['logistics/list', 'logistics/recycleList', 'logistics/action', 'logistics/add', 'logistics/bizVisual', 'outsourcingLogistics/list', 'outsourcingLogistics/recycleList','outsourcingLogistics/add','outsourcingLogistics/confirm', 'contract/list', 'contract/add','logisticsAffirm/list','batchDispatch/confirm'],
  logistics: ['logistics/add', 'logistics/subContract', 'logistics/dispatch','outsourcingLogistics/list','outsourcingLogistics/add','logistics/list','logistics/recycleList','logistics/action','logistics/bizVisual','outsourcingLogistics/bizVisual', 'outsourcingLogistics/recycleList','outsourcingLogistics/confirm', 'contract/list', 'contract/add','logisticsAffirm/list','logisticsAssign/list','logisticsConfirm/list','batchDispatch/confirm','insurancePolicy/insurancePolicyList','insurancePolicy/insurancePolicyAdd','page/insurance'],
  // 运力
  transport: ['transport/add', 'transport/list'],
  // 设备
  lbs: ['device/add', 'device/list', 'deviceBind/add', 'deviceBind/list'],
  // 路线，税率
  resource: [
    { 'chunks': 'route/add', 'filePath': './src/route/add/add.js' },
    { 'chunks': 'route/list', 'filePath': './src/route/list/list.js' },
    { 'chunks': 'resourceGoodsCategory/add', 'filePath': './src/resourceGoodsCategory/add/add.js' },
    { 'chunks': 'resourceGoodsCategory/list', 'filePath': './src/resourceGoodsCategory/list/list.js' },
    { 'chunks': 'resourceGoods/add', 'filePath': './src/resourceGoods/add/add.js' },
    { 'chunks': 'resourceGoods/list', 'filePath': './src/resourceGoods/list/list.js' },
    ],
  // 车维, 待办提醒, 违章, 事故, 轮胎, 轮胎巡检
  maintenance: ['maintenance/add', 'maintenance/list', 'remind/list',
    'peccancy/add', 'peccancy/list', 'accident/add', 'accident/list',
    'insurance/add', 'insurance/list', 'care/add', 'care/list',
    { 'chunks': 'tyreInspection/add', 'outputPath': '/tyre_inspection/add.html', 'urlPath': 'tyre_inspection/add.html' },
    { 'chunks': 'tyreInspection/list', 'outputPath': '/tyre_inspection/list.html', 'urlPath': 'tyre_inspection/list.html' },
    'tyre/add', 'tyre/list'],
  // 货源
  freight: ['freight/add', 'freight/list','freight/recycleList',
    { 'chunks': 'freightAcceptRecord/add', 'outputPath': '/freightAcceptRecord/add.html', 'urlPath': 'freightAcceptRecord/add.html' },
    { 'chunks': 'freightAcceptRecord/list', 'outputPath': '/freightAcceptRecord/list.html', 'urlPath': 'freightAcceptRecord/list.html' }],
  // 询报价
  iq: ['inquiry/list', 'inquiry/add','quote/list', 'quote/add','quote/receivedInquiryList'],
  // 企业结算
  settle: ['settleBillReceivable/select_client', 'settleBillReceivable/select_waybill', 'settleBillReceivable/list', 'settleBillReceivable/recycleList', 'settleBillReceivable/receive_log_list',
    'settleBillPayable/select_carrier', 'settleBillPayable/select_waybill', 'settleBillPayable/list', 'settleBillPayable/recycleList',
    'settleBillReceivable/receive_log_list', 'settleBillReceivable/receive_log_add',
    'settleBillPayable/payment_log_list', 'settleBillPayable/payment_log_add', 'settleBillReceivable/create', 'settleBillPayable/create','paybill/order',
    'paybill/list','paybill/approveList','paybill/add','itemPaybill/approveList'
  ],
  // 销项发票列表、进项发票列表
  invoice: ['outputInvoice/list', 'outputInvoice/add', 'inputInvoice/list', 'inputInvoice/add'],
  // 其他
  other: ['logs/list', 'role/list', 'fence/list'],
  // 报表
  report: ['report/screen', 'report/core_screen',
    'report/input_summary', 'report/output_summary', 'report/io_summary',
    'report/config', 'report/library', 'report/detail',
    'report/driverSettleStream','report/driverSettleCollection'],
  // 平台
  platform: [
    { 'chunks': 'platform/certOrg/list', 'outputPath': '/platform/cert_org/list.html', 'urlPath': 'platform/cert_org/list.html' },
    { 'chunks': 'platform/certOrg/approval', 'outputPath': '/platform/cert_org/approval.html', 'urlPath': 'platform/cert_org/approval.html' },
    { 'chunks': 'platform/certPerson/list', 'outputPath': '/platform/cert_person/list.html', 'urlPath': 'platform/cert_person/list.html' },
    { 'chunks': 'platform/certPerson/approval', 'outputPath': '/platform/cert_person/approval.html', 'urlPath': 'platform/cert_person/approval.html' },
    { 'chunks': 'platform/certTruck/list', 'outputPath': '/platform/cert_truck/list.html', 'urlPath': 'platform/cert_truck/list.html' },
    { 'chunks': 'platform/certTruck/approval', 'outputPath': '/platform/cert_truck/approval.html', 'urlPath': 'platform/cert_truck/approval.html' },
    { 'chunks': 'platform/certTransport/transport', 'outputPath': '/platform/cert_transport/transport.html', 'urlPath': 'platform/cert_transport/transport.html' },
    'orgManagement/list', 'orgManagement/add','truckManagement/list', 'truckManagement/add', 'chargeItem/list','driverEntrustManagement/list', 'driverEntrustManagement/add', 'chargeItem/add', 'expression/list', 'expression/add',
    'appVersion/list', 'appVersion/add', 'appConfig/msgReminder', 'driverManagement/list', 'driverManagement/add', 'employeeManagement/list', 'employeeManagement/add', 'platform/waybill/list',
    'platform/waybill/add', 'platform/freight/list','platformLogisticsContract/list',
    'platform/settleBillPayable/select_waybill', 'platform/settleBillPayable/create','platform/settleBillPayable/list','platform/settleBillPayable/recycleList','platform/core/config','platform/reconciliation/list',
    'bizRelation/config','settings/platformSettings','settings/companySettings'
  ],
   waybillBroker:['uploadWaybill/list','uploadWaybill/add','uploadWaybillPlatform/list','uploadWaybillPlatform/add','reportFreight/list','reportFreight/add','reportFreightPlatform/list','reportFreightPlatform/add','waybillBroker/platformWaybill/list','waybillBroker/platformWaybill/add','waybillBroker/platformWaybill/result'],
  // uploadWaybill:['uploadWaybill/list','uploadWaybill/add','uploadWaybillPlatform/list'],
  // reportFreight:['reportFreight/list','reportFreight/add','reportFreightPlatform/list'],
  // demo
  demo: [
    { 'chunks': 'add/add', 'templatePath': 'template/add.html', 'filePath': './src/add/add' }
  ],
  payment: [
    'payment/accountPreview','payment/accountOperation','payment/manageList','payment/accountComeInLog','payment/driverFundsList','payment/driverAccountComeInLog','payment/driverPayment','payment/safety','payment/bizAccountPreview','payment/driverPaymentAudit','payment/index','payment/coreAccountComeInLog','payment/accountComeInLogForb','payment/password'
  ],
  print: [
    'printDoc/id','printDoc/certificate','printDoc/declaration','printDoc/trustDeed'
  ],
  screen: [
    'screen/index'
  ],
  shipment:[
    'shipment/shipperList','shipment/carrierList','shipment/vehicebaseList','shipment/driverList','shipment/sourcegoodList',
    'shipment/waybillList','shipment/dispatchingList','shipment/receiptList','shipment/vehiclegoodsList','shipment/capitalList','shipment/contractList'
  ],
  routeFreightRate:[
    'routeFreightRate/clientFreight/clientFreightList','routeFreightRate/clientFreight/clientFreightAdd',
    'routeFreightRate/outsourceFreight/outsourceFreightList','routeFreightRate/outsourceFreight/outsourceFreightAdd',
  ],
  message: [
    'message/index'
  ]
  // test: [
  //   { 'chunks': 'test/print', 'templatePath': 'template/test/print.html', 'filePath': './src/test/print' }
  // ]
};

/**
 * deprecated.
 * @return {[type]} [description]
 */
function buildSinglePageModule(){
// 检查是不是以链接形式启动。
  var redirectUrl=process.argv[process.argv.length-1];
  if(redirectUrl.indexOf('.html') != -1){
    redirectUrl= redirectUrl.replace(/http:\/\/.*?\//,'/');
    var trunck = redirectUrl.match(/\/(.*?)\.html/)[1];
    console.log('find url trunck:'+trunck+",other truncks will be disabled.");
    exportsArray = [];
    const pushObj = {
      chunks: trunck,
      templatePath: `template/${trunck}.html`,
      filePath: `./src/${trunck}.js`,
      outputPath: `/${trunck}.html`,
      urlPath: `${trunck}.html`
    }
    exportsArray.push(pushObj);
  }
}
function buildModule(md,collector){
 // 获取到对应的属性
  const pushPropList = configList[md];
  if (pushPropList && pushPropList.length > 0) {
    pushPropList.forEach((ele) => {
      var mycnf =(typeof ele === 'string') && ele.constructor === String ? {chunks:ele} : ele;
      const pushObj = Object.assign({
        chunks: mycnf.chunks,
        templatePath: `template/${mycnf.chunks}.html`,
        filePath: `./src/${mycnf.chunks}.js`,
        outputPath: `/${mycnf.chunks}.html`,
        urlPath: `${mycnf.chunks}.html`
      }, mycnf);
      collector.push(pushObj);
    });
  }
}
/**
 * 获取指定模块名下的模块。
 * @param  String arr [account/person/....]
 * @return {
 *      chunks: mycnf.chunks,
        templatePath: `template/${mycnf.chunks}.html`,
        filePath: `./src/${mycnf.chunks}.js`,
        outputPath: `/${mycnf.chunks}.html`,
        urlPath: `${mycnf.chunks}.html`
  }
 */
function getModules(arr){
  var collector = []
  arr.forEach((element) => {
    buildModule(element,collector);
  });
  return collector;
}
/**
 * 获取所有模块。
 * @return {[type]} [description]
 */
function getAllModules(){
  var collector = []
  Object.keys(configList).forEach((element) => {
    buildModule(element,collector);
  });
  return collector;
}

module.exports = {getModules,getAllModules};
