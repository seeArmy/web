<template>
<listLayout :deleteFun="deleteFun" :getColumn="getColumn" :getList="lst" :getSearch="getSearch" :objectName="objectName" :editUrl="editUrl" :addUrl="addUrl" :importUrl="''"
:showExportButton="false"
:showImportButton="false"
:dispatchDelete="false"
:showDownloadTemplate="false"
:operatable="false"
:isAdvanced="false"
:extraParams="extraParams"
>
</listLayout>
</template>

<script type="text/ecmascript-6">
import listLayout from '../../layout/list/listLayout.vue';
import { getCoreWithdrawRecode as lst } from '../../../api/virtualAccount'
import { getParamsFromURL } from '../../../api/Utils'

  export default {
    name: 'company-cash-come-in',
    components: {
      'listLayout': listLayout
    },
    data: () => {
      return {
        objectName: '核心企业提现记录',
        lst,
        addUrl: '',
        editUrl: '',
        extraParams: {
        }
      }
    },
    methods: {
      getColumn(cb){
        const result = {
          "code": 200,
          "content": [{
            "showName": "提现金额",
            "elementCode": "text",
            "extraParams": "{\"field1\":\"withdrawCashAmount\",\"placeholder1\":\"x\"}",
            "fieldConfigCode": "withdrawCashAmount"
            },{
              "showName": "提现时间",
              "elementCode": "text",
              "extraParams": "{\"field1\":\"withdrawCashTime\",\"placeholder1\":\"x\"}",
              "fieldConfigCode": "withdrawCashTime"
            },{
              "showName": "操作员",
               "elementCode": "text",
              "extraParams": "{\"field1\":\"operator\",\"placeholder1\":\"x\"}",
              "fieldConfigCode": "operator"
            }]
        }
        cb (result,null)
      },
      getList({}, cb) {
        const ret = {
          "code": 200,
          "content":[{}],
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
          "content": [{}]
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

