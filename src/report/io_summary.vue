/**
* list.vue
* 进销平衡
* Created by CC on 18/2/28.
*/
<template>
  <div>
    <ele-list :selectable="false" :operatable="false" :footerEnable="true" :ignoreCalColumns="ignoreCalColumns"
              :showImportButton="false" :showDownloadTemplate="false" :showExportButton="true"
              :showBatchBtn1="false" :showBatchBtn2="false"
              :needAdd="false"
              @query="query" @ready="query" @more="more" @exportData="exportData"
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
              :objectName="objectName">
    </ele-list>
  </div>
</template>

<script type="text/ecmascript-6">
  import eleList from '../components/ele-list/eleList.vue';
  import { urlRedirect } from '../../api/Utils';
  import { getIOSummarySearch, getIOSummaryColumn, getIOSummaryList, exportIOSummaryCsv } from '../../api/ReportService';
  import * as ApiConst from '../../api/ApiConst';

  export default {
    name: 'IOSummary',
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
        getColumn: getIOSummaryColumn,
        getList: getIOSummaryList,
        getSearch: getIOSummarySearch,
        objectName: '进销平衡',
        addUrl: null,
        editUrl: null,
        listUrl: null,
        deleteFun: Function,
        exportCsv: exportIOSummaryCsv,
        add: Function,
        downloadErrorData: Function,
        importUrl: '',
        downloadTemplate: Function,
        showDownloadTemplate: false,
        showImportButton: false,
        ignoreCalColumns: []
      };
    },
    methods: {
      getCurrentMonthFirstDay() {
        const date = new Date();
        date.setDate(1);
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        return date;
      },
      getCurrentMonthLastDay() {
        const date = new Date();
        date.setMonth(date.getMonth() + 1);
        date.setDate(0);
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        return date;
      },
      openWindow(url, title) {
        urlRedirect(url, title);
      },
      more(model) {
//        console.log('more', `${this.listUrl}?objectName=${this.objectName}&${this.toParameterArray(model).join('&')}`);
        this.openWindow(`${this.listUrl}?objectName=${this.objectName}&${this.toParameterArray(model).join('&')}`, `${this.objectName}列表`);
      },
      doRemove(model) {
        const self = this;
        this.$msgbox({
          title: '确认',
          message: `确认要删除${this.objectName} ${model.routeName} 吗？`,
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '执行中...';
              deleted({ code: model.code }, (success, error) => {
                if (success) {
                  this.$message({
                    type: 'success',
                    message: '删除成功',
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
            this.openWindow(`${this.editUrl}?objectName=${this.objectName}`, `新建${this.objectName}`);
            break;
          case 'edit':
            this.openWindow(`${this.editUrl}?code=${model.code}&objectName=${this.objectName}`, `编辑${this.objectName}`);
            break;
          case 'remove':
            this.doRemove(model);
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
          getIOSummaryColumn((success) => {
            const paramsObj = {
              params: params,
              configList: success.content
            };
            paramsObj["params"].obj = 'ioSummary';
            exportIOSummaryCsv(paramsObj, (success, error) => {
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
        getIOSummaryList(searchParams, (success, error) => {
          if (error) {
            this.$message({
              type: 'error',
              message: error.content,
              duration: 5000
            });
          }
          if (success) {
            this.total = success.total;
            self.listData = success.content;
            this.loading = false;
//              self.listData.splice(self.listData.length);
            //console.log('parent.listData', self.listData);
          }
        });
      }
    },
    created() {
      
    },
  };
</script>

<style lang="scss" rel="stylesheet/scss">
#miniSearch {
    .complex-control-3 {
      .innerblock:nth-child(2) {
        margin-right: 10px;
      }  
      .el-date-editor {
        width: 128px;
      }
    }
}
</style>

