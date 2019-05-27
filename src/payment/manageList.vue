<template>
<listLayout :deleteFun="deleteFun" :getColumn="getColumn" :getList="OrgCashLst" :getSearch="getSearch" :objectName="objectName" :editUrl="editUrl" :addUrl="addUrl" :importUrl="''"
:showExportButton="false"
:showImportButton="false"
:dispatchDelete="false"
:showDownloadTemplate="false"
:actionLst="operationSelector"
v-on:remitAccount="handleremitAccount"
v-on:comeInAccount="handlecomeInAccount"
:showexport-btn="true"
:export-disabled="exportBtnLoading"
v-on:exportMyCsv="handleExportCsv"
>
</listLayout>
</template>

<script type="text/ecmascript-6">
import listLayout from '../layout/list/listLayout.vue';
import { getOrgMemberInfoList as OrgCashLst } from '../../api/virtualAccount'
import { urlRedirect } from '../../api/Utils';
import { downloadCsv } from '@/utils/downloadFile';

  export default {
    name: 'account-manage-list',
    components: {
      'listLayout': listLayout
    },
    data: () => {
      return {
        OrgCashLst,
        objectName: '企业会员资金账户管理',
        addUrl: '',
        editUrl: '',
        operationSelector: [
          { name: '划账', actionUrl: 'remitAccount'},
          { name: '出入金记录', actionUrl: 'comeInAccount'},
        ],
        exportBtnLoading: false
      }
    },
    methods: {
      handleExportCsv(params) {
        this.exportBtnLoading = true
        const api = 'pay/virtualAccount/export/orgMemberInfoList'
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
          }
        })
      },
      handleremitAccount(row) {
        //console.log('row', row)
        const url = `/payment/accountOperation.html?auid=${row.auid}&accountName=${row.accountName}&code=${row.code}`
        urlRedirect(url, `${row.accountName}出入金划账`);
      },
      handlecomeInAccount(row) {
        //console.log('row', row)
        const url = `/payment/accountComeInLog.html?auid=${row.auid}&code=${row.code}`
        urlRedirect(url, `${row.accountName}出入金记录`);
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
              "showName": "最近更新时间",
              "elementCode": "text",
              "extraParams": {"field1":"updateTime","detailLinkVisiable":"false"},
              "fieldConfigCode": "updateTime"
            },{
              "showName": "联系人",
              "elementCode": "text",
              "extraParams": "{\"field1\":\"linkmanFullName\",\"placeholder1\":\"x\"}",
              "fieldConfigCode": "linkmanFullName"
            },{
              "showName": "手机号",
              "elementCode": "text",
              "extraParams": "{\"field1\":\"linkmanPhone\",\"placeholder1\":\"x\"}",
              "fieldConfigCode": "linkmanPhone"
            }]
        }
        cb (result,null)
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
              "extraParams": "{\"field1\":\"orgFullName\",\"placeholder1\":\"输入账户名\"}",
              "fieldConfigCode": "orgFullName"
            },{
              "showName": "联系人",
              "elementCode": "text",
              "extraParams": "{\"field1\":\"linkmanFullName\",\"placeholder1\":\"输入联系人\"}",
              "fieldConfigCode": "linkmanFullName"
            },{
              "showName": "手机号",
              "elementCode": "text",
              "extraParams": "{\"field1\":\"linkmanPhone\",\"placeholder1\":\"输入手机号\"}",
              "fieldConfigCode": "linkmanPhone"
            }]
        }
        cb(ret, null)
      },
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
</style>

