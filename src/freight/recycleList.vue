/**
* list.vue
* 货源回收列表
*/
<template>
  <div>
    <ele-list :selectable="selectable" :operatable="operatable" :customAdd="true" :customAddName="customAddName"
              :showImportButton="false" :showDownloadTemplate="false" :showExportButton="false"
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
              :needAdd="false"
              :objectName="objectName">
    </ele-list>
    <el-dialog :title="actionDialogTitle" :visible.sync="actionDialogVisible" size="large">
      <component ref="freightAction" :is="currentDialogComponent"
                 @success="dialogSuccess" @fail="dialogFail" @close="dialogClose"
                 :type="type" :actionType="actionType" :actionDomain="actionDomain"
                 :id="currentCode" :action="currentActionCode" :actionExecuteFun="actionExecuteFun"
                 :isDialog="true"></component>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogClose">取 消</el-button>
        <el-button type="primary" @click="dialogSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  import eleList from '../components/ele-list/eleList.vue';
  import { urlRedirect } from '../../api/Utils';
  import {recover,getColumnRecycle as getColumn, list,getSearchRecycle as getSearch, deleted, exportCsv, add, refresh, close, downloadErrorData, downloadTemplate, addAction as executeAction } from '../../api/FreightService';
  import * as ApiConst from '../../api/ApiConst';
  import eleAction from '../components/ele-action/eleAction.vue';

  export default {
    name: 'freightList',
    components: {
      'ele-list': eleList,
      'ele-action': eleAction
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
        actionDialogTitle: 'Dialog',
        actionDialogVisible: false,
        type: 'freight',
        actionType: 'freight',
        actionDomain: `${ApiConst.apiFreightDomain}`,
        actionExecuteFun: executeAction,
        currentCode: null,
        currentActionCode: null,
        currentDialogComponent: '',
        getColumn,
        getList: list,
        getSearch,
        objectName: '货源回收',
        customAddName: '发布货源',
        addUrl: '/freight/add.html',
        editUrl: '/freight/add.html',
        listUrl: '/freight/list.html',
        sendTruckUrl: '/freightAcceptRecord/list.html',
        deleteFun: deleted,
        exportCsv,
        add,
        refreshFreightFun: refresh,
        closeFreightFun: close,
        downloadErrorData,
        importUrl: `${ApiConst.apiFreightDomain}/import/custom/freight`,
        downloadTemplate,
        folder: 'freight/recycle',
      };
    },
    methods: {
      openWindow(url, title) {
        urlRedirect(url, title);
      },
      more(model) {
        this.openWindow(`${this.listUrl}?objectName=${this.objectName}&${this.toParameterArray(model).join('&')}`, `${this.objectName}列表`);
      },
      dialogSubmit() {
        this.$refs.freightAction.execute();
      },
      dialogSuccess() {
        this.dialogClose();
        this.$refs.eleList.dispatchQueryEvent();
      },
      dialogFail() {
        console.log('dialog execute failed');
      },
      dialogClose() {
        this.actionDialogVisible = false;
        this.currentDialogComponent = null;
      },
      handleRefresh(model) {
        const paramObj = {
            code: model.code
          },
          h = this.$createElement;
        this.$msgbox({
          title: '消息',
          message: h('p', null, [h('span', null, '确认刷新吗？ ')]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '执行中...';
              this.refreshFreightFun(paramObj.code, {}, (success, error) => {
                if (success) {
                  this.$message({
                    type: 'success',
                    message: '刷新成功',
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
          this.$refs.eleList.dispatchQueryEvent();
        });
      },
      handleClose(model) {
        const paramObj = {
            code: model.code
          },
          h = this.$createElement;
        this.$msgbox({
          title: '消息',
          message: h('p', null, [h('span', null, '确认关闭吗？ ')]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '执行中...';
              this.closeFreightFun(paramObj.code, {}, (success, error) => {
                if (success) {
                  this.$message({
                    type: 'success',
                    message: '关闭成功',
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
          this.$refs.eleList.dispatchQueryEvent();
        });
      },
      doRemove(model) {
        const self = this;
        this.$msgbox({
          title: '确认',
          message: `确认要删除${this.objectName} ${model.freightNo} 吗？`,
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
      doRecover(model){
        const self = this;
        this.$msgbox({
          title: '确认',
          message: `确认要恢复吗？`,
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '执行中...';
              recover({ code: model.code }, (success, error) => {
                if (success) {
                  this.$message({
                    type: 'success',
                    message: '恢复成功',
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
      action(command, menu, model) {
        console.log('action command', command, 'menu', menu, 'model', model);
        switch (command) {
        case 'recover':
          this.doRecover(model);
          break;
          case 'add':
            this.openWindow(`${this.editUrl}?objectName=${this.objectName}`, `新建${this.objectName}`);
            break;
          case 'edit':
            this.openWindow(`${this.editUrl}?code=${model.code}&objectName=${this.objectName}`, `编辑${this.objectName}`);
            break;
          case 'sendTruck':
            this.openWindow(`${this.editUrl}?code=${model.code}&editable=false&goto=tabAcceptRecord`, '去派车');
            break;
          case 'recreate':
            this.openWindow(`${this.addUrl}?originalCode=${model.code}&objectName=${this.objectName}&copy=true`, `复制新建${this.objectName}`);
            break;
          case 'refresh':
            this.handleRefresh(model);
            break;
          case 'close':
            this.handleClose(model);
            break;
          case 'remove':
            this.doRemove(model);
            break;
          default:
            this.actionDialogTitle = menu.name;
            this.actionDialogVisible = true;
            this.currentCode = model.code;
            this.currentActionCode = menu.key;
            this.currentDialogComponent = 'ele-action';
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
        Object.assign(searchParams, this.params);
        searchParams.deleted = true;
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
              actionList.push({ key: 'recover', name: '恢复' });
              data.actionMenuList = actionList;
            });
            self.listData = success.content;
            this.loading = false;
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

