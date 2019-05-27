/**
* list.vue
* 发出的询价列表
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
              :deleteFun="deleteFun"
              :add="add"
              :downloadErrorData="downloadErrorData"
              :downloadTemplate="downloadTemplate"
              :importUrl="importUrl"
              :editUrl="editUrl"
              :getColumn="getColumn"
              :getList="getList"
              :exportCsv="exportCsv"
              :getSearch="getSearch"
              :folder="folder"
              :objectName="objectName">
    </ele-list>
  </div>
</template>

<script type="text/ecmascript-6">
  import eleList from '../components/ele-list/eleList.vue';
  import { urlRedirect } from '../../api/Utils';
  import { getColumn, list, getSearch, exportCsv, add, downloadErrorData, downloadTemplate, close } from '../../api/InquiryService';
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
        objectName: '发出的询价',
        customAddName: '发布询价单',
        addUrl: '/inquiry/add.html',
        editUrl: '/inquiry/add.html',
        listUrl: '/inquiry/list.html',
        deleteFun: Function,
        exportCsv,
        add,
        downloadErrorData,
        importUrl: ``,
        downloadTemplate,
        folder: ''
      };
    },
    methods: {
      openWindow(url, title) {
        urlRedirect(url, title);
      },
      more(model) {
//        console.log('more', `${this.listUrl}?objectName=${this.objectName}&${this.toParameterArray(model).join('&')}`);
        this.openWindow(`${this.listUrl}?objectName=${this.objectName}&${this.toParameterArray(model).join('&')}`, `${this.objectName}列表`);
      },
      doClose(model) {
        const self = this;
        this.$msgbox({
          title: '确认',
          message: `确认要结束该询价单吗？`,
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '执行中...';
              close({ code: model.code }, (success, error) => {
                if (success) {
                  this.$message({
                    type: 'success',
                    message: '结束询价成功',
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
          case 'add':
            this.openWindow(`${this.addUrl}?objectName=${this.objectName}`, `${this.customAddName}`);
            break;
          case 'sendTruck':
            this.openWindow(`${this.editUrl}?code=${model.code}&editable=false`, `去下单`);
            break;
          case 'recreate':
            this.openWindow(`${this.addUrl}?originalCode=${model.code}&objectName=${this.objectName}&copy=true`, `复制新建${this.objectName}`);
            break;
          case 'close':
            this.doClose(model);
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
              // actionList.push({ key: 'edit', name: '编辑' });
              // 询价中
              if (data.rfqStatus === 'enquirying') {
                actionList.push({ key: 'sendTruck', name: '去下单' });
                actionList.push({ key: 'recreate', name: '复制新建' });
                actionList.push({ key: 'close', name: '结束询价' });
              } else {
                // 结束询价
                // 待处理抢单数如果大于0，则不管询价状态如何都显示去下单
                if (data.pendCount > 0) {
                  actionList.push({ key: 'sendTruck', name: '去下单' });
                }
                actionList.push({ key: 'recreate', name: '复制新建' });
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

