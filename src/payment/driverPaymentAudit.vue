<template>
<div>
<listLayout :deleteFun="deleteFun" :getColumn="getColumn" :getList="approvedList" :getSearch="getSearch" :objectName="objectName" :editUrl="editUrl" :addUrl="addUrl" :importUrl="''"
ref="driverPaymentAudit"
:showExportButton="false"
:showImportButton="false"
:dispatchDelete="false"
:showDownloadTemplate="false"
:operatable="true"
:actionLst="operationSelector"
v-on:auditAction="handleAuditAction"
v-on:detailAction="handleDetailAction"
v-if="paymentlistShow"
:extraParams="extraParams"
:exportCsvFunc="exportApproveLstS"
:showexportCsvBtn="true"
:searchModelDefault='searchModelDefault'
>
</listLayout>
<pay-ment-aduit-dialog ref="payMentAduitModal" @loadinglst="loadinglst"></pay-ment-aduit-dialog>
</div>
</template>

<script type="text/ecmascript-6">
  import listLayout from '../layout/list/listLayout.vue';
  import { waybillLst as approvedList } from '../../api/waybillService'
  import PayMentAduitDialog from './components/payMentAduitDialog'
  import { urlRedirect } from '../../api/Utils';
  import { exportApproveLstS } from '../../api/PlatformService'

  export default {
    name: 'driver-payment-list',
    components: {
      'listLayout': listLayout,
      PayMentAduitDialog
    },
    data: () => {
      return {
        objectName: '单车付款审核',
        approvedList,
        addUrl: '',
        editUrl: '/waybill/add.html',
        paymentlistShow: true,
        operationSelector: [
          { name: '审核', actionUrl: 'auditAction', nodisplay:['accept','reject'], nodisplayProp: 'settlePaymentApproveStatus'},
          { name: '单车结算详情', actionUrl: 'detailAction'},
        ],
        tableData: [],
        paymentObject: {},
        extraParams: {
          scheduleType: 'platform'
        },
        exportApproveLstS,
        searchModelDefault:{
          settlePaymentApproveStatus:'pend'
        }
      }
    },
    methods: {
      getColumn(cb){
        const result = {
          "code": 200,
          "content": [{
              "showName": "运单号",
              "elementCode": "text",
              "extraParams": "{\"field1\":\"waybillNo\",\"field2\":\"code\",\"area\":\"base\",\"required\":\"false\",\"detailLinkVisiable\":\"true\"}",
              "fieldConfigCode": "waybillNo"
            },{
              "showName": "审核通道",
              "elementCode": "select",
              "extraParams": "{\"field1\":\"scheduleType\",\"placeholder1\":\"x\",\"optionsValue1\":[\"platform\",\"self\"],\"options1\":[\"委托调车模式\",\"自助调车模式\"]\}",
              "fieldConfigCode": "scheduleType"
            },{
              "showName": "审核状态",
              "elementCode": "select",
              "extraParams": "{\"field1\":\"settlePaymentApproveStatus\",\"optionsValue1\":[\"pend\",\"accept\",\"reject\"],\"options1\":[\"待审核\",\"审核通过\",\"审核不通过\"]\}",
              "fieldConfigCode": "settlePaymentApproveStatus"
            },{
              "showName": "车牌号",
              "elementCode": "text",
              "extraParams": "{\"field1\":\"truckLicenseNo\",\"placeholder1\":\"x\"}",
              "fieldConfigCode": "truckLicenseNo"
            },{
              "showName": "司机",
              "elementCode": "text",
              "extraParams": "{\"field1\":\"driverFullName\",\"placeholder1\":\"x\"}",
              "fieldConfigCode": "driverFullName"
            },{
              "showName": "运单发货日期",
              "elementCode": "text",
              "extraParams": "{\"field1\":\"loadingTime\",\"placeholder1\":\"x\",\"format1\":\"yyyy-MM-dd HH:mm:ss\"}",
              "fieldConfigCode": "loadingTime"
            },{
              "showName": "运单收货日期",
              "elementCode": "text",
              "extraParams": "{\"field1\":\"unloadingTime\",\"placeholder1\":\"x\",\"format1\":\"yyyy-MM-dd HH:mm:ss\"}",
              "fieldConfigCode": "unloadingTime"
            },{
              "showName": "应付司机劳务费",
              "elementCode": "text",
              "extraParams": "{\"field1\":\"settleDriverRealPayment\",\"placeholder1\":\"x\"}",
              "fieldConfigCode": "settleDriverRealPayment"
            },{
              "showName": "交易费",
              "elementCode": "text",
              "extraParams": "{\"field1\":\"settleTradingConfigAmount\",\"placeholder1\":\"x\"}",
              "fieldConfigCode": "settleTradingConfigAmount"
            },{
              "showName": "应收客户总费用",
              "elementCode": "text",
              "extraParams": "{\"field1\":\"settleClientOrgPayee\",\"placeholder1\":\"x\"}",
              "fieldConfigCode": "settleClientOrgPayee"
            },{
              "showName": "应付司机总费用（不含税）",
              "elementCode": "text",
              "extraParams": "{\"field1\":\"settleDriverPayment\",\"placeholder1\":\"x\"}",
              "fieldConfigCode": "settleDriverPayment"
            },{
              "showName": "交易费标准",
              "elementCode": "settleSetting",
              "extraParams": {"field1":"settleTradingConfigValue","field2":"settleTradingConfigUnitCode","checkRule1":"\\d{1,6}\\.?\\d{0,3}","checkMsg1":"请输入合理的值，最多输入三位小数","required":"false","detailLinkVisiable":"false","placeholder1":"请输入交易费","optionsValue2":["%","yuan"],"options2":["%","元"],"inputKey1":"partner.settleConfigValue3,logistics.settleConfigValue3","inputKey2":"partner.settleConfigUnitCode3,logistics.settleConfigUnitCode3"},
              "fieldConfigCode": "settleTradingConfigUnitCode"
            },{
              "showName": "运杂费标准",
              "elementCode": "settleSetting",
              "extraParams": {"field1":"settleConfigValue4","field2":"settleConfigUnitCode4","checkRule1":"\\d{1,6}\\.?\\d{0,3}","checkMsg1":"请输入合理的值，最多输入三位小数","required":"false","detailLinkVisiable":"false","placeholder1":"请输入数字","optionsValue2":["%","yuan"],"options2":["%","元"],"inputKey1":"partner.settleConfigValue4,logistics.settleConfigValue4","inputKey2":"partner.settleConfigUnitCode4,logistics.settleConfigUnitCode4"},
              "fieldConfigCode": "settleConfigValue4"
            },{
              "showName": "单车利润",
              "elementCode": "text",
              "extraParams": "{\"field1\":\"settleGrossProfit\",\"placeholder1\":\"x\"}",
              "fieldConfigCode": "settleGrossProfit"
            },{
              "showName": "付款委托方",
              "elementCode": "text",
              "extraParams": "{\"field1\":\"ownerOrgName\",\"placeholder1\":\"x\"}",
              "fieldConfigCode": "ownerOrgName"
            },{
              "showName": "客户",
              "elementCode": "text",
              "extraParams": "{\"field1\":\"clientOrgName\",\"placeholder1\":\"x\"}",
              "fieldConfigCode": "clientOrgName"
            },{
              "showName": "线路",
              "elementCode": "text",
              "extraParams": "{\"field1\":\"routeName\",\"placeholder1\":\"x\"}",
              "fieldConfigCode": "routeName"
            },{
              "showName": "货物名称",
              "elementCode": "text",
              "extraParams": "{\"field1\":\"goodsName\",\"placeholder1\":\"x\"}",
              "fieldConfigCode": "goodsName"
            },{
              "showName": "计量标准",
              "elementCode": "select",
              "extraParams": "{\"field1\":\"meterageType\",\"optionsValue1\":[\"ton\",\"cube\",\"item\"],\"options1\":[\"吨\",\"方\",\"件\"]\}",
              "fieldConfigCode": "meterageType"
            },{
              "showName": "运单发货重量",
              "elementCode": "goodsWeight",
              "extraParams": "{\"field1\":\"loadingGoodsWeight\",\"field2\":\"loadingGoodsWeightUnitCode\",\"placeholder1\":\"x\"}",
              "fieldConfigCode": "loadingGoodsWeight"
            },{
              "showName": "运单发货体积",
              "elementCode": "goodsVolume",
              "extraParams": "{\"field1\":\"loadingGoodsVolume\",\"field2\":\"loadingGoodsVolumeUnitCode\",\"placeholder1\":\"x\"}",
              "fieldConfigCode": "goodsVolume"
            },{
              "showName": "运单发货数量",
              "elementCode": "goodsNum",
              "extraParams": "{\"field1\":\"loadingGoodsNum\",\"field2\":\"loadingGoodsNumUnitCode\",\"placeholder1\":\"x\"}",
              "fieldConfigCode": "loadingGoodsNum"
            },{
              "showName": "运单收货货量",
              "elementCode": "goodsWeight",
              "extraParams": "{\"field1\":\"unloadingGoodsWeight\",\"field2\":\"unloadingGoodsWeightUnitCode\",\"placeholder1\":\"x\"}",
              "fieldConfigCode": "unloadingGoodsWeight"
            },{
              "showName": "运单收货体积",
              "elementCode": "goodsVolume",
              "extraParams": "{\"field1\":\"unloadingGoodsVolume\",\"field2\":\"unloadingGoodsVolumeUnitCode\",\"placeholder1\":\"x\"}",
              "fieldConfigCode": "unloadingGoodsVolume"
            },{
              "showName": "运单收货数量",
              "elementCode": "goodsNum",
              "extraParams": "{\"field1\":\"unloadingGoodsNum\",\"field2\":\"unloadingGoodsNumUnitCode\",\"placeholder1\":\"x\"}",
              "fieldConfigCode": "unloadingGoodsNum"
            },{
              "showName": "运单实际货差",
              "elementCode": "text",
              "extraParams": "{\"field1\":\"actualGoodsLoss\",\"placeholder1\":\"x\"}",
              "fieldConfigCode": "actualGoodsLoss"
            },{
              "showName": "合理货差系数",
              "elementCode": "goodsLossType",
              "extraParams": "{\"field1\":\"goodsLossMethod\",\"field2\":\"goodsLoss\",\"field3\":\"goodsLossUnitCode\",\"default1\":\"goods.loss\",\"checkRule2\":\"[0-9]{1,10}(\\\\.[0-9]{0,4})?\",\"checkMsg2\":\"不超过15位（最多4位小数）\",\"required1\":\"true\",\"detailLinkVisiable\":\"false\",\"maxLength2\":\"15\",\"placeholder2\":\"请输入合理货差系数\",\"inputKey1\":\"rates.goodsLossMethod\",\"inputKey2\":\"rates.goodsLoss\",\"inputKey3\":\"rates.goodsLossUnitCode\",\"optionsValue1\":[\"goods.loss\",\"goods.loss.ration\"],\"options1\":[\"按量\",\"按系数\"]}",
              "fieldConfigCode": "freightLoss"
            },{
              "showName": "货差超标量",
              "elementCode": "text",
              "extraParams": "{\"field1\":\"settleGoodsLossVolume\",\"placeholder1\":\"x\"}",
              "fieldConfigCode": "settleGoodsLossVolume"
            },{
              "showName": "货品单价",
              "elementCode": "goodsPrice",
              "extraParams": "{\"field1\":\"goodsPrice\",\"field2\":\"goodsPriceUnitCode\",\"placeholder1\":\"x\"}",
              "fieldConfigCode": "goodsPrice"
            },{
              "showName": "货差扣款",
              "elementCode": "text",
              "extraParams": "{\"field1\":\"settleLossDeduction\",\"placeholder1\":\"x\"}",
              "fieldConfigCode": "settleLossDeduction"
            },{
              "showName": "结算货量",
              "elementCode": "text",
              "extraParams": "{\"field1\":\"settleVolume\",\"placeholder1\":\"x\"}",
              "fieldConfigCode": "settleVolume"
            },{
              "showName": "司机运价",
              "elementCode": "text",
              "extraParams": "{\"field1\":\"driverPrice\",\"placeholder1\":\"x\"}",
              "fieldConfigCode": "driverPrice"
            },{
              "showName": "订单号",
              "elementCode": "text",
              "extraParams": "{\"field1\":\"logisticsNo\",\"placeholder1\":\"x\"}",
              "fieldConfigCode": "logisticsNo"
            },{
              "showName": "开户银行",
              "elementCode": "text",
              "extraParams": "{\"field1\":\"driverPayeeBankName\",\"placeholder1\":\"x\"}",
              "fieldConfigCode": "driverPayeeBankName"
            },{
              "showName": "银行户名",
              "elementCode": "text",
              "extraParams": "{\"field1\":\"driverPayeeBankAccountName\",\"placeholder1\":\"x\"}",
              "fieldConfigCode": "driverPayeeBankAccountName"
            },{
              "showName": "银行账户",
              "elementCode": "text",
              "extraParams": "{\"field1\":\"driverPayeeBankAccountNo\",\"placeholder1\":\"x\"}",
              "fieldConfigCode": "driverPayeeBankAccountNo"
            }
          ]
        }
        cb (result,null)
      },
      getList({}, cb) {
        const ret = {
          "code": 200,
          "content":[{
            "paybillNo":"11211",
            "receiverAuid":"111111",
            "status": 1,
            "driverFullName":"1ddda",
            "settleDriverPayment":21341,
          },{
            "paybillNo":"1121ss1",
            "receiverAuid":"111111",
            "status": 1,
            "driverFullName":"1ddda",
            "settleDriverPayment":2123,
          }],
          "total": 2
        }
        cb (ret,null)
      },
      deleteFun() {
        const ret =  {
          "code": 200,
          "content":true
        };
        return (ret,null)
      },
      getSearch(cb) {
        const ret = {
          "code": 200,
          "content": [{
              "showName": "运单号",
              "elementCode": "text",
              "extraParams": "{\"field1\":\"waybillNo\",\"placeholder1\":\"请输入\"}",
              "fieldConfigCode": "waybillNo"
            },{
              "showName": "车牌号",
              "elementCode": "text",
              "extraParams": "{\"field1\":\"truckLicenseNo\",\"placeholder1\":\"请输入\"}",
              "fieldConfigCode": "truckLicenseNo"
            },{
              "showName": "审核状态",
              "elementCode": "select",
              "extraParams": "{\"field1\":\"settlePaymentApproveStatus\",\"optionsValue1\":[\"pend\",\"accept\",\"reject\"],\"options1\":[\"待审核\",\"审核通过\",\"审核不通过\"]\}",
              "fieldConfigCode": "settlePaymentApproveStatus"
            },{
              "showName": "线路",
              "elementCode": "text",
              "extraParams": "{\"field1\":\"routeName\",\"placeholder1\":\"请输入线路\"}",
              "fieldConfigCode": "routeName"
            },{
              "showName": "货物名称",
              "elementCode": "text",
              "extraParams": "{\"field1\":\"goodsName\",\"placeholder1\":\"请输入货物名称\"}",
              "fieldConfigCode": "goodsName"
            },{
              "showName": "收款人",
              "elementCode": "text",
              "extraParams": "{\"field1\":\"driverFullName\",\"placeholder1\":\"请输入\"}",
              "fieldConfigCode": "driverFullName"
            },{
              "showName": "付款委托方",
              "elementCode": "text",
              "extraParams": "{\"field1\":\"clientOrgName\",\"placeholder1\":\"请输入\"}",
              "fieldConfigCode": "clientOrgName"
            },{
            "showName": "发货日期",
            "elementCode": "dateRange",
            "extraParams": "{\"field1\":\"from_loadingTime\",\"field3\":\"to_loadingTime\",\"format1\":\"yyyy-MM-dd\",\"format3\":\"yyyy-MM-dd\",\"placeholder2\":\"到\",\"default2\":\"到\"}",
            "fieldConfigCode": "loadingTime"
            },{
            "showName": "收货日期",
            "elementCode": "dateRange",
            "extraParams": "{\"field1\":\"from_unloadingTime\",\"field3\":\"to_unloadingTime\",\"format1\":\"yyyy-MM-dd\",\"format3\":\"yyyy-MM-dd\",\"placeholder2\":\"到\",\"default2\":\"到\"}",
            "fieldConfigCode": "loadingTime"
            }
            ]
        }
        cb(ret, null)
      },
      handleAuditAction(row) {
        const lst = []
        lst.push(row)
        // this.$refs['payMentAduitModal'].approvedlst(lst)
        this.$refs['payMentAduitModal'].init(row)
      },
      loadinglst() {
        this.$refs['driverPaymentAudit'].getData()
      },
      handleDetailAction(row) {
        urlRedirect(`/waybill/settle.html?code=${row.waybillCode}&editable=false&objectName=单车结算`, '单车结算详情');
      }
    },
     mounted(){
      // this.$refs.driverPaymentAudit.searchModel.settlePaymentApproveStatus = 'pend';
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
</style>

