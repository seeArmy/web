<template>
  <div>
    <ele-list :selectable="false" :operatable="true"
              :showImportButton="false" :showDownloadTemplate="false" :showExportButton="false"
              @query="query" @ready="refreshData" @action="action"
              :total="total" :loading="loading"
              :list-data="listData"
              ref="eleList"
              :isAdvanced="true"
              :needAdd="false"
              :needFullSearch="false"
              :getColumn="getColumn"
              :getList="getList"
              :getSearch="getSearch"
              :footerEnable="false"
              :objectName="objectName">
    </ele-list>
  </div>
</template>

<script type="text/ecmascript-6">
  /* eslint-disable no-unused-vars */

  import eleList from '../components/ele-list/eleList.vue';
  import { urlRedirect } from '../../api/Utils';
  import { settleReceivableSelectClientColumn, settleReceivableSelectClientSearch, settleReceivableSelectClientList, settleOrgStatisticsRefresh } from '../../api/SettleBillService';

  export default {
    name: 'selectClientList',
    components: {
      'ele-list': eleList
    },
    props: {
      params: {
        type: Object,
        'default': function () {
          return {};
        }
      }
    },
    data: () => {
      return {
        listData: [],
        total: 0,
        loading: true,
        getColumn: settleReceivableSelectClientColumn,
        getList: settleReceivableSelectClientList,
        getSearch: settleReceivableSelectClientSearch,
        objectName: '客户对账',
        selectWaybillUrl: '/settleBillReceivable/select_waybill.html'
      };
    },
    methods: {
      openWindow(url, title) {
        urlRedirect(url, title);
      },
      refreshData() {
        const that = this,
          userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
        settleOrgStatisticsRefresh(userInfo.orgCode, (success, error) => {
          that.$refs.eleList.dispatchQueryEvent();
        });
      },
      action(command, menu, model) {
        switch (command) {
          case 'selectWaybill':
            this.openWindow(`${this.selectWaybillUrl}?orgCode=${model.orgCode}&orgName=${model.orgName}&platformOrgCode=${model.platformOrgCode}`, '创建应收账单-选择运单');
            break;
          case 'add':
            this.refreshData();
            break;
          default:
            break;
        }
      },
      query(searchParams) {
        const self = this;
        this.total = 0;
        this.loading = true;
        self.listData = [];
        settleReceivableSelectClientList(searchParams, (success, error) => {
          if (error) {
            this.$message({
              type: 'error',
              message: error.content,
              duration: 5000
            });
          }
          if (success) {
            this.total = success.total;
            success.content.forEach((data) => {
              const actionList = [];
              actionList.push({ key: 'selectWaybill', name: '开始对账' });
              data.actionMenuList = actionList;
            });
            self.listData = success.content;
            this.loading = false;
          }
        });
      }
    },
    created() {
      // const that = this,
      //   userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
      // settleOrgStatisticsRefresh(userInfo.orgCode, (success, error) => {});
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
</style>

