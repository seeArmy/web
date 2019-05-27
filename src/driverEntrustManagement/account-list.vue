/**
* list.vue
* 银行列表
* Created by myy on 18/4/18.
*/
<template>
  <div>
    <ele-list :selectable="selectable" :operatable="operatable"
              :showImportButton="false" :showDownloadTemplate="false" :showExportButton="false"
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
  import { getColumn, list, getSearch, deleted, exportCsv, add, downloadErrorData, downloadTemplate } from '../../api/PlatformBankAccountService';
  import * as ApiConst from '../../api/ApiConst';

  export default {
    name: 'PlatformBankAccountList',
    components: {
      'ele-list': eleList
    },
    props: {
      selectable: {
        type: Boolean,
        'default': false
      },
      operatable: {
        type: Boolean,
        'default': false
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
      },
      bankAccountCode: '',
      addFrom: '',
      chooseBankFun: Function
    },
    data: () => {
      return {
        listData: [],
        total: 0,
        loading: true,
        getColumn,
        getList: list,
        getSearch,
        objectName: '银行账户',
        addUrl: '/driverManagement/account-add.html',
        editUrl: '/driverManagement/account-add.html',
        listUrl: '/driverManagement/account.html',
        deleteFun: deleted,
        exportCsv,
        add,
        downloadErrorData,
        importUrl: `${ApiConst.apiPlatformDomain}/import/custom/account`,
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
      showError(text) {
        this.$message({
          type: 'error',
          showClose: true,
          message: text,
          duration: 5000
        });
        return false;
      },
      doChoose(model) {
        // console.log('this model is', model);

        const paramObj = {
          code: this.params.personCode,
          bankAccountName: model.bankAccountName,
          bankName: model.bankName,
          bankAccountNo: model.bankAccountNo,
          bankAccountCode: model.code,
          bankAccountDescription: model.description
        };
        this.chooseBankFun(paramObj, (success, error) => {
          if (error || success.code !== 200) {
            this.showError(error.content);
          }
          if (success) {
            this.$message({
              type: 'success',
              message: '选用成功',
              duration: 1000
            });
            console.log('model', model);
            model.actionMenuList.forEach((val, index) => {
              if (val.key === 'choose') {
                model.actionMenuList.splice(index, 1);
                console.log('new model', model);
                return false;
              }
            });
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }
        });
      },
      doRemove(model) {
        const self = this;
        this.$msgbox({
          title: '确认',
          message: `确认要删除${model.bankAccountName}的${model.bankName}账户${model.bankAccountNo}吗？`,
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
            this.openWindow(`${this.editUrl}?objectName=${this.objectName}&personCode=${this.params.personCode}`, `新建${this.objectName}`);
            break;
          case 'choose':
            this.doChoose(model);
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
              if (this.bankAccountCode !== data.code) {
                actionList.push({ key: 'choose', name: '选中' });
              }
              actionList.push({ key: 'edit', name: '编辑' });
              actionList.push({ key: 'remove', name: '删除' });
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
