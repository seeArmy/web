<template>
<div>
<listLayout :deleteFun="deleteFun" :getColumn="getColumn" :getList="driverFundsLst" :getSearch="getSearch" :objectName="objectName" :editUrl="editUrl" :addUrl="addUrl" :importUrl="''"
:showExportButton="false"
:showImportButton="false"
:dispatchDelete="false"
:showDownloadTemplate="false"
:operatable="true"
:actionLst="operationSelector"
:showBatchWithdrawBtn="false"
v-on:queryDetail="handleQueryDetail"
v-on:withdraw="handleWithdrawDesposition"
v-on:withdrawBatch="handleWithdrawBatch"
ref="fundslistlayout"
:showexport-btn="true"
:export-disabled="exportBtnLoading"
v-on:exportMyCsv="handleExportCsv"
>
</listLayout>
<withdraw-model ref="withdrawmodel" :refreshLst="refreshLst"/>
</div>
</template>

<script type="text/ecmascript-6">
  import listLayout from '../layout/list/listLayout.vue'
  import WithdrawModel from './components/withdrawModel.vue'
  import { getMemberInfoList as driverFundsLst } from '../../api/virtualAccount'
  import { urlRedirect } from '../../api/Utils';
import { downloadCsv } from '@/utils/downloadFile';

  export default {
    name: 'driver-funds-list',
    components: {
      'listLayout': listLayout,
      WithdrawModel
    },
    data: () => {
      return {
        objectName: '司机会员资金账户查询',
        driverFundsLst,
        addUrl: '',
        editUrl: '',
        operationSelector: [
          { name: '查询明细', actionUrl: 'queryDetail'},
          { name: '提现额度', actionUrl: 'withdraw'},
        ],
        exportBtnLoading: false
      }
    },
    methods: {
      handleExportCsv(params) {
        this.exportBtnLoading = true
        const api = 'pay/virtualAccount/export/memberInfoList'
        downloadCsv(api, params,(success, error) => {
          if(success) {
            this.exportBtnLoading = false
          }
        })
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
              "showName": "账户余额",
              "elementCode": "text",
              "extraParams": "{\"field1\":\"amount\",\"placeholder1\":\"x\"}",
              "fieldConfigCode": "amount"
            },{
              "showName": "提现限额",
              "elementCode": "text",
              "extraParams": "{\"field1\":\"withdrawPersonLimit\",\"placeholder1\":\"x\"}",
              "fieldConfigCode": "withdrawPersonLimit"
            },{
              "showName": "最近更新日期",
              "elementCode": "text",
              "extraParams": "{\"field1\":\"updateTime\",\"placeholder1\":\"x\"}",
              "fieldConfigCode": "updateTime"
            },{
              "showName": "手机号",
              "elementCode": "text",
              "extraParams": "{\"field1\":\"linkmanPhone\",\"placeholder1\":\"输入手机号\"}",
              "fieldConfigCode": "linkmanPhone"
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
              "extraParams": "{\"field1\":\"fullName\",\"placeholder1\":\"输入账户名\"}",
              "fieldConfigCode": "fullName"
            },{
              "showName": "手机号",
              "elementCode": "text",
              "extraParams": "{\"field1\":\"phone\",\"placeholder1\":\"输入手机号\"}",
              "fieldConfigCode": "phone"
            }]
        }
        cb(ret, null)
      },
      handleQueryDetail(row) {
        const url = `/payment/driverAccountComeInLog.html?auid=${row.auid}&code=${row.code}`
        urlRedirect(url, `${row.accountName}会员出入金记录`);
      },
      handleWithdrawDesposition(row) {
        this.$refs['withdrawmodel'].init(row)
      },
      handleWithdrawBatch(lst) {
        this.$refs['withdrawmodel'].batchInit(lst)
      },
      refreshLst() {
        this.$refs['fundslistlayout'].getData()
      }
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
</style>

