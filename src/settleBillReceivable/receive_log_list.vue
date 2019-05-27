/**
* list.vue
* 收款记录列表
* Created by zhuyi on 17/7/21.
*/





<template>
  <div>
    <ele-list :selectable="selectable" :operatable="operatable"
              @query="query" @ready="query" @action="action" @more="more" @exportData="exportData"
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
  import {
    urlRedirect
  } from '../../api/Utils';
  import * as SettleBillService from '../../api/SettleBillService';
  import * as ApiConst from '../../api/ApiConst';

  export default {
    name: 'receiveLogList',
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
        getColumn: SettleBillService.settleReceivableActualReceiptLogListColumn,
        getList: SettleBillService.settleReceivableActualReceiptLogList,
        getSearch: SettleBillService.settleReceivableActualReceiptLogListSearch,
        objectName: '收款记录',
        addUrl: '/settleBillReceivable/receive_log_add.html',
        editUrl: '/settleBillReceivable/receive_log_add.html',
        listUrl: '/settleBillReceivable/receive_log_list.html',
        deleteFun: SettleBillService.settleReceivableActualReceiptLogDelete,
        confirmFun: SettleBillService.settleReceivableActualReceiptLogConfirm,
        exportCsv: SettleBillService.settleReceivableActualReceiptLogExportCsv,
        add: SettleBillService.settleReceivableActualReceiptLogAdd,
        downloadErrorData: SettleBillService.settleReceivableActualReceiptLogDownloadErrorData,
        importUrl: `${ApiConst.apiSettleDomain}/import/custom/actualReceipt`,
        downloadTemplate: SettleBillService.settleReceivableActualReceiptLogDownloadTemplate,
        codes: []
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
      doConfirm(model) {
        const self = this;
        this.$msgbox({
          title: '确认',
          message: `您确认所选的收款资金流水${model.serialNumber}无误吗？`,
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '执行中...';
              this.confirmFun(model.code, {
                code: model.code
              }, (success, error) => {
                if (success) {
                  this.$message({
                    type: 'success',
                    message: '确认成功',
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
      doRemove(model) {
        const self = this;
        this.$msgbox({
          title: '确认',
          message: `确认要删除${this.objectName}吗？`,
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '执行中...';
              this.deleteFun(model.code, {
                code: model.code
              }, (success, error) => {
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
          case 'confirm':
            this.doConfirm(model);
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
          this.exportCsv(params, (success, error) => {
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
        this.listData = [];
        this.codes = [];
        this.getList(searchParams, (success, error) => {
          if (error) {
            this.$message({
              type: 'error',
              message: error.content,
              duration: 5000
            });
          }
          if (success) {
            this.total = success.total;
            success.content.forEach((row) => {
              const actionList = [];
              this.codes.push(row.code);
              if (!row.confirmStatus) {
                actionList.push({
                  key: 'confirm',
                  name: '确认'
                });
                actionList.push({
                  key: 'remove',
                  name: '删除'
                });
              }
              row.actionMenuList = actionList;
            });
            console.log('this.codes', this.codes);
            if (this.codes.length) {
              SettleBillService.settleReceiptRelationBillCount({
                receiptCodeList: this.codes.join(',')
              }, (res, err) => {
                if (err) {
                  this.$message.error(err.content);
                }
                if (res) {
                  console.log('收款记录应收统计：', res.content);
                  success.content.forEach((item) => {
                    item.receiptNum = res.content[item.code] || '-';
                  });
                  self.listData = success.content;
                  this.loading = false;
                }
              });
            } else {
              this.loading = false;
            }
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

