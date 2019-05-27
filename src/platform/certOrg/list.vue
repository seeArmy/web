<!-- 组织认证列表 -->
<template>
  <div>
    <ele-list :selectable="selectable" :operatable="operatable"
              :showImportButton="false" :showDownloadTemplate="false" :showExportButton="false" :needAdd="false"
              @query="query" @ready="onReady" @action="action" @more="more" @exportData="exportData"
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
              :folder='folder'
              :objectName="objectName">
    </ele-list>
  </div>
</template>

<script type="text/ecmascript-6">
  import eleList from '../../components/ele-list/eleList.vue';
  import { urlRedirect } from '../../../api/Utils';
  import { certOrgColumn, certOrgList, certOrgSearch, certOrgRevokeApprove } from '../../../api/PlatformService';
  import * as ApiConst from '../../../api/ApiConst';

  export default {
    name: 'certOrgList',
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
    data() {
      return {
        listData: [],
        total: 0,
        loading: true,
        getColumn: certOrgColumn,
        getList: certOrgList,
        getSearch: certOrgSearch,
        objectName: '组织认证',
        addUrl: '/platform/cert_org/approval.html',
        editUrl: '/platform/cert_org/approval.html',
        listUrl: '/platform/cert_org/list.html',
        deleteFun: Function,
        exportCsv: Function,
        add: Function,
        downloadErrorData: Function,
        importUrl: null,
        downloadTemplate: Function,
        folder:'platform/certOrg'
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
      onReady(searchModel) {
      },
      doRemove(model) {
        const self = this;
        this.$msgbox({
          title: '确认',
          message: `确认要删除${this.objectName} ${model.orgName} 吗？`,
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
      doReject(model) {
        const self = this;
        this.$msgbox({
          title: '确认',
          message: `确认要打回${model.orgFullName}的认证吗？`,
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '执行中...';
              certOrgRevokeApprove(model.orgCode, (success, error) => {
                if (success) {
                  this.$message({
                    type: 'success',
                    message: '打回成功',
                    duration: 1000
                  });
                  done();
                  instance.confirmButtonLoading = false;
                  // setTimeout(() => {
                  //   window.location.reload();
                  // }, 1000);
                }
                if (error) {
                  this.$message({
                    type: 'warning',
                    message: `${error}`,
                    duration: 1000
                  });
                  instance.confirmButtonLoading = false;
                  done();
                  // setTimeout(() => {
                  //   window.location.reload();
                  // }, 1000);
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
          case 'verify':
            this.openWindow(`${this.editUrl}?code=${model.code}&orgCode=${model.orgCode}&isShow=true`, `${this.objectName}`);
            break;
          case 'view':
            this.openWindow(`${this.editUrl}?code=${model.code}&orgCode=${model.orgCode}&editable=false`, `${this.objectName}`);
            break;
          case 'reject':
            this.doReject(model);
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
            success.content.forEach((data) => {
              const actionList = [];
              // 待审核才能去认证操作
              if (data.certStatus === 'authenticating') {
                actionList.push({ key: 'verify', name: '认证' });
              }
              // 认证通过增加打回操作
              if (data.certStatus === 'authenticated') {
                actionList.push({ key: 'reject', name: '打回' });
              }
              // 已认证，认证失败加上查看详情
              if (data.certStatus === 'authenticated' || data.certStatus === 'failed') {
                actionList.push({ key: 'view', name: '查看详情' });
              }
              data.actionMenuList = actionList;
            });
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
    mounted() {
      // this.$refs.eleList.searchModel.certStatus = 'authenticating';
      this.$nextTick(() => {
        this.$refs.eleList.setSearchModelDefault({ 'certStatus': 'authenticating' });
        this.$refs.eleList.dispatchQueryEvent();
      });
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
</style>

