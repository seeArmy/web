/**
* list.vue
*  我的报价 列表
*/
<template>
  <div>
    <ele-list :selectable="selectable" :operatable="operatable" :customAdd="true" :customAddName="customAddName"
              :showImportButton="false" :showDownloadTemplate="false" :showExportButton="true"
              @query="query" @ready="query" @action="action" @more="more" @exportData="exportData"
              :autoRefresh="false" :autoRefreshTimer="30"
              :total="total" :loading="loading"
              :list-data="listData"
              ref="eleList"
              :customColumn="customColumn"
              :params="params"
              :needPage="needPage"
              :isAdvanced="isAdvanced"
              :add="add"
              :downloadErrorData="downloadErrorData"
              :downloadTemplate="downloadTemplate"
              :importUrl="importUrl"
              :editUrl="editUrl"
              :getColumn="getColumn"
              :getList="getList"
              :exportCsv="exportCsv"
              :getSearch="getSearch"
              :needAdd='false'
              :objectName="objectName">
    </ele-list>
  </div>
</template>

<script type="text/ecmascript-6">
  import eleList from '../components/ele-list/eleList.vue';
  import { urlRedirect } from '../../api/Utils';
  import { cancel ,getColumn, list, getSearch, exportCsv, add, downloadErrorData, downloadTemplate } from '../../api/QuoteService';
  import * as ApiConst from '../../api/ApiConst';

  export default {
    name: 'inquiryList',
    components: {
      'ele-list': eleList
    },
    props: {
      selectable: {
        type: Boolean,
        'default': true
      },
      operatable: {
        type: Boolean,
        'default': true
      },
      customColumn: Array,
      isAdvanced: {
        type: Boolean,
        'default': true
      },
      needPage: {
        type: Boolean,
        'default': true
      },
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
        getColumn,
        getList: list,
        getSearch,
        objectName: '我的报价',
        customAddName: '我的报价',
        addUrl: '/quote/add.html',
        editUrl: '/quote/add.html',
        listUrl: '/quote/list.html',
        logisticsUrl:'/logistics/add.html',
        exportCsv,
        add,
        downloadErrorData,
        importUrl: ``,
        downloadTemplate,
      };
    },
    methods: {
      openWindow(url, title) {
        urlRedirect(url, title);
      },
      more(model) {
        this.openWindow(`${this.listUrl}?objectName=${this.objectName}&${this.toParameterArray(model).join('&')}`, `${this.objectName}列表`);
      },
      doCancel(model) {
        const self = this;
        this.$msgbox({
          title: '确认',
          message: `确认要取消吗？`,
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '执行中...';
              cancel({ code: model.code }, (success, error) => {
                if (success) {
                  this.$message({
                    type: 'success',
                    message: '取消成功',
                    duration: 1000
                  });
                  done();
                  instance.confirmButtonLoading = false;
                }
                if (error) {
                  this.$message({
                    type: 'warning',
                    message: `${error}`,
                    duration: 1000
                  });
                  instance.confirmButtonLoading = false;
                  done();
                }
              });
            } else {
              done();
            }
          }
        }).then(() => {
          self.$refs.eleList.dispatchQueryEvent();
        });
      },
      toParameterArray(model) {
        const params = [];
        Object.keys(model).forEach((key) => {
          params.push(`${key}=${encodeURIComponent(model[key])}`);
        });
        return params;
      },
      action(command, menu, model) {
        console.log('action command', command, 'menu', menu, 'model', model);
        switch (command) {
          case 'checkLogistics':
            this.openWindow(`${this.logisticsUrl}?code=${model.logisticsCode}&objectName=${this.objectName}&editable=false`, `订单详情`);
            break;
          case 'cancel':
            this.doCancel(model);
            break;
          default:
            break;
        }
      },
      exportData(params) {
        const dataTotal = this.total;
        if (dataTotal > 10000) {
          this.$message({
            type: 'warning',
            message: '导出条数超过10000条限制，不可导出！',
            duration: 3000
          });
        } else {
          this.loading = true;
          params.size = dataTotal;
          exportCsv(params, (success, error) => {
            if (error || success.code !== 200) {
              this.$message({
                type: 'error',
                message: error.content,
                duration: 5000
              });
              this.loading = false;
              return false;
            }
            if (success) {
              this.loading = false;
              window.location.href = success.content.url;
            }
          });
        }
      },
      query(searchParams) {
        console.log('searchParams', searchParams);
        Object.assign(searchParams, this.params);
        console.log('query', searchParams);
        const self = this;
        this.total = 0;
        this.loading = true;
        self.listData = [];
        list(searchParams, (success, error) => {
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
              //取消  --- 已下单待承运方接单
              if(data.quoteStatus == 'pend'){
                  actionList.push({ key: 'cancel', name: '取消' });
              }
              //查看订单  --- 承运方已接单
              if(data.quoteStatus == 'carrierReceived'){
                 actionList.push({ key: 'checkLogistics', name: '查看订单' });
              }
              data.actionMenuList = actionList;
            });
            self.listData = success.content;
            this.loading = false;
            console.log('parent.listData', self.listData);
          }
        });
      }
    },
    created() {

    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
</style>

