<template>
<listLayout :deleteFun="deleteFun" :getColumn="getColumn" :getList="cashflowLst" :getSearch="getSearch" :objectName="objectName" :editUrl="editUrl" :addUrl="addUrl" :importUrl="''"
:showExportButton="false"
:showImportButton="false"
:dispatchDelete="false"
:showDownloadTemplate="false"
:operatable="false"
:extraParams="extraParams"
:showexport-btn="true"
:export-disabled="exportBtnLoading"
v-on:exportMyCsv="handleExportCsv"
>
</listLayout>
</template>

<script type="text/ecmascript-6">
import listLayout from '../layout/list/listLayout.vue';
import { getMoneyFlowForCompany as cashflowLst } from '../../api/virtualAccount'
import { getParamsFromURL } from '../../api/Utils'
import { downloadCsv } from '@/utils/downloadFile';

  export default {
    name: 'company-cash-come-in',
    components: {
      'listLayout': listLayout
    },
    data: () => {
      return {
        objectName: '企业会员出入金记录',
        cashflowLst,
        addUrl: '',
        editUrl: '',
        extraParams: {
          // auid: getParamsFromURL(window.location.search).auid || '',
          code: getParamsFromURL(window.location.search).code || '',
        },
        exportBtnLoading: false
      }
    },
    methods: {
      handleExportCsv(params) {
        this.exportBtnLoading = true
        const api = 'pay/virtualAccount/export/moneyFlowForCompany'
        downloadCsv(api, params,(success, error) => {
          if(success) {
            this.exportBtnLoading = false
          }
          if(error) {
            this.$message({
              type: 'error',
              message: 'ops,you have some trouble',
              duration: 3000
            });
            this.exportBtnLoading = false
          }})
      },
      getColumn(cb){
        const result = {
          "code": 200,
          "content": [{
            "showName": "账户名",
            "elementCode": "text",
            "extraParams": "{\"field1\":\"accountName\",\"placeholder1\":\"x\"}",
            "fieldConfigCode": "accountName"
            },{
              "showName": "交易金额",
              "elementCode": "text",
              "extraParams": "{\"field1\":\"transferAmount\",\"placeholder1\":\"x\"}",
              "fieldConfigCode": "transferAmount"
            },{
              "showName": "出入金",
              "elementCode": "select",
              "extraParams": "{\"field1\":\"balanceOfPaymentsType\",\"optionsValue1\":[\"2\",\"1\",\"0\"],\"options1\":[\"出金\",\"入金\",\"全部\"]\}",
              "fieldConfigCode": "balanceOfPaymentsType"
            },{
              "showName": "交易类型",
              "elementCode": "select",
              "extraParams": "{\"field1\":\"transactionType\",\"optionsValue1\":[\"10\",\"11\",\"12\",\"13\",\"14\",\"15\",\"16\",\"17\",\"18\",\"19\",\"20\",\"22\"],\"options1\":[\"提现\",\"手工出入\",\"消费\",\"银行手续费\",\"转账\",\"平台手续费\",\"自动出入金\",\"支付运单\",\"撤销运单支付\",\"运费服务费\",\"取消支付运费服务费\",\"云平台扣收提现手续费\"]\}",
              "fieldConfigCode": "transactionType"
            },{
              "showName": "交易用途",
              "elementCode": "select",
              "extraParams": "{\"field1\":\"detailType\",\"optionsValue1\":[\"1401\",\"1402\",\"1701\",\"1702\",\"1901\",\"1801\",\"1802\",\"2001\",\"1001\",\"1002\",\"1003\",\"1004\",\"1005\",\"1006\",\"1601\",\"1101\",\"1602\",\"2201\",\"2202\"],\"options1\":[\"核心企业转账\",\"核心企业撤消转账\",\"委托人运单支付\",\"核心企业运单支付\",\"运单服务费支付\",\"核心企业撤销运单支付\",\"委托人撤销运单支付\",\"撤销运单服务费支付\",\"提现\",\"核心企业提现手续费\",\"提现主体提现手续费\",\"提现失败回冲\",\"提现失败核心企业手续费回冲\",\"提现失败提现主体手续费回冲\",\"自动平账\",\"手工平帐\",\"收付直通车扣收手续费\",\"云平台扣收提现手续费\",\"云平台退还提现手续费\"]\}",
              "fieldConfigCode": "detailType"
            },{
              "showName": "交易对手",
              "elementCode": "text",
              "extraParams": "{\"field1\":\"oppositeAccountName\",\"placeholder1\":\"x\"}",
              "fieldConfigCode": "oppositeAccountName"
            },{
              "showName": "交易时间",
              "elementCode": "text",
              "extraParams": "{\"field1\":\"transferTime\",\"placeholder1\":\"x\"}",
              "fieldConfigCode": "transferTime"
            }]
        }
        cb (result,null)
      },
      getList({}, cb) {
        const ret = {
          "code": 200,
          "content":[{
            "accountName":"11211",
            "accountMount":"111111",
            "recentRecord":'xxxsaxsaxsa',
            "recentTime":"新A",
            "recentTime":"2018-01-10",
            "time":"2018-01-10",
            "phone":"130000000",
          },{
            "accountName":"11211",
            "accountMount":"111111",
            "recentRecord":'xxxsaxsaxsa',
            "recentTime":"新A",
            "recentTime":"2018-01-10",
            "time":"2018-01-10",
            "phone":"130000000",
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
              "showName": "账户名",
              "elementCode": "text",
              "extraParams": "{\"field1\":\"accountName\",\"placeholder1\":\"输入账户名\"}",
              "fieldConfigCode": "accountName"
            },{
              "showName": "出入金",
              "elementCode": "select",
              "extraParams": "{\"field1\":\"balanceOfPaymentsType\",\"optionsValue1\":[\"2\",\"1\",\"\"],\"options1\":[\"出金\",\"入金\",\"全部\"]\}",
              "fieldConfigCode": "balanceOfPaymentsType"
            },{
              "showName": "出入金金额",
              "elementCode": "text",
              "extraParams": "{\"field1\":\"money\",\"placeholder1\":\"输入金额\"}",
              "fieldConfigCode": "money"
            },{
              "showName": "起始时间",
              "elementCode": "date",
              "extraParams": {"field1":"beginTime","detailLinkVisiable":"false","format1": "yyyy-MM-dd"},
              "fieldConfigCode": "beginTime"
            },{
              "showName": "截止时间",
              "elementCode": "date",
              "extraParams": {"field1":"endTime","detailLinkVisiable":"false","format1": "yyyy-MM-dd"},
              "fieldConfigCode": "endTime"
            }]
        }
        cb(ret, null)
      },
    },
    created() {

    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
</style>

