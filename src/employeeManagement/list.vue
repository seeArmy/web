/**
* list.vue
* 员工会员列表
* Created by myy on 18/4/17.
*/
<template>
  <!-- 司机列表页面 -->
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
              :needAdd="needAdd"
              :deleteFun="deleteFun"
              :add="add"
              :showImportButton= 'false'
              :showDownloadTemplate = 'false'
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
  import { urlRedirect, checkPermission } from '../../api/Utils';
  import { getColumn, list, getSearch, deleted, closeAccount, blacklist, exportCsv, add, downloadErrorData, downloadTemplate } from '../../api/EmployeeManagementService';
  import * as ApiConst from '../../api/ApiConst';

  export default {
    name: 'driverList',
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
      needAdd: {
        type: Boolean,
        'default': false
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
        objectName: '员工会员',
        addUrl: '/employeeManagement/add.html',
        editUrl: '/employeeManagement/add.html',
        listUrl: '/employeeManagement/list.html',
        deleteFun: deleted,
        exportCsv,
        add,
        downloadErrorData,
        importUrl: `${ApiConst.apiPlatformDomain}/import/custom/driver`,
        downloadTemplate
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
      doRemove(model) {
        const self = this;
        this.$msgbox({
          title: '确认',
          message: `确认要删除${this.objectName} ${model.fullName} 吗？`,
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
      doCloseAccount(model) {
        const self = this;
        const  h = this.$createElement;
        this.$msgbox({
          title: '确认',
          message: h('p', { style: 'text-align: center' }, [
            h('span', { style: 'font-weight: 700' }, '该会员销户后，登录账号将被删除，但档案会保留。'),
            h('span', { style: 'color: #f48400; display: block; margin-top: 10px;' }, '确定注销该会员登录账户吗？')
          ]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '执行中...';
              closeAccount({ phone: model.phone }, (success, error) => {
                if (success) {
                  this.$message({
                    type: 'success',
                    message: '销户成功',
                    duration: 1000
                  });
                  done();
                  instance.confirmButtonLoading = false;
                }
                if (error) {
                  this.$message({
                    type: 'warning',
                    message: `${error.content}`,
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
      doBlacklist(model, type) {
        const self = this;
        const  h = this.$createElement,
          tip1 = type === 1 ? '该会员拉入黑名单后，登录账号将被限制登入平台。' : '该会员解除黑名单后，登录账号可再次登入平台。',
          tip2 = type === 1 ? '确定将该会员拉入黑名单吗？' : '确定将该会员解除黑名单吗？',
          tip3 = type === 1 ? '拉入黑名单成功' : '解除黑名单成功';
        this.$msgbox({
          title: '确认',
          message: h('p', { style: 'text-align: center' }, [
            h('span', { style: 'font-weight: 700' }, tip1),
            h('span', { style: 'color: #f48400; display: block; margin-top: 10px;' }, tip2)
          ]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '执行中...';
              blacklist({ code: model.userCode, blacklistFlag: type }, (success, error) => {
                if (success) {
                  this.$message({
                    type: 'success',
                    message: tip3,
                    duration: 1000
                  });
                  done();
                  instance.confirmButtonLoading = false;
                }
                if (error) {
                  this.$message({
                    type: 'warning',
                    message: `${error.content}`,
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
          case 'closeAccount':
            this.doCloseAccount(model);
            break;
          case 'blacklist':
            this.doBlacklist(model, 1);
            break;
          case 'undoBlacklist':
            this.doBlacklist(model, 0);
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
              // 员工会员管理，未激活或已激活，可编辑
              if (data.userStatus === 'inactivated' || data.userStatus === 'activated') {
                actionList.push({ key: 'edit', name: '编辑' });
              }
              // 已激活，可销户、拉黑
              if (data.userStatus === 'activated') {
                actionList.push({ key: 'closeAccount', name: '销户' });
                // 未拉黑
                if (data.blacklistFlag === 0 || !data.blacklistFlag) {
                  actionList.push({ key: 'blacklist', name: '拉黑' });
                }
                // 已拉黑
                if (data.blacklistFlag === 1) {
                  actionList.push({ key: 'undoBlacklist', name: '解除拉黑' });
                }
              }
              // 已销户，无操作
              if (data.userStatus === 'closed') {
              }

              // if (checkPermission("driver.delete") && data.userStatus === 'inactivated') {
              //   actionList.push({ key: 'remove', name: '删除' });
              // }

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

    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
</style>

