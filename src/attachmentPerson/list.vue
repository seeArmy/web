<template>
  <div>
    <div>
    </div>
    <ele-list :selectable="selectable" :operatable="operatable"
              @query="query" @ready="query" @action="action" @more="more" @exportData="exportData"
              :total="total" :loading="loading"
              :list-data="listData"
              ref="eleList"
              :customColumn="customColumn"
              :params="params"
              :needPage="needPage"
              :needMore="needMore"
              :isAdvanced="isAdvanced"
              :deleteFun="deleteFun"
              :add="add"
              :downloadErrorData="downloadErrorData"
              :downloadTemplate="downloadTemplate"
              :importUrl="importUrl"
              :uploadUrl="uploadUrl"
              :editUrl="editUrl"
              :getColumn="getColumnPerson"
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
  import { getColumn, list, getSearch, deleted, exportCsv, add, downloadErrorData, downloadTemplate,listPerson,getColumnPerson,deletedPerson } from '../../api/AttachmentService';
  import * as ApiConst from '../../api/ApiConst';

  export default {
    name: 'accidentList',
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
      needMore: {
        type: Boolean,
        'default': false
      },
      parentTruckInfo: {},
      params: {}
    },
    data: () => {
      return {
        listData: [],
        total: 0,
        loading: true,
        getColumnPerson,
        getList: listPerson,
        getSearch,
        objectName: '证照',
        addUrl: '/attachmentPerson/add.html',
        editUrl: '/attachmentPerson/add.html',
        listUrl: '/attachmentPerson/list.html',
        deleteFun: deleted,
        exportCsv,
        add,
        downloadErrorData,
        importUrl: `${ApiConst.apiTruckDomain}/import/custom/attachment`,
        uploadUrl: `${ApiConst.apiTruckDomain}`,
        downloadTemplate
      };
    },
    methods: {
      openWindow(url, title) {
        urlRedirect(url, title);
      },
      more(model) {
        this.openWindow(`${this.listUrl}?objectName=${this.objectName}&${this.toParameterArray(model).join('&')}`, `${this.objectName}列表`);
      },
      doRemove(model) {
        const self = this;
        this.$msgbox({
          title: '确认',
          message: `确认要删除此${this.objectName}记录吗？`,
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '执行中...';
              deletedPerson({ code: model.code }, (success, error) => {
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
        // console.log(this.editUrl, this.params);
        // return;
        switch (command) {
          case 'add':
            this.openWindow(`${this.editUrl}?objectName=${this.objectName}&truckLicenseNo=${this.parentTruckInfo.truckLicenseNo}&truckCode=${this.parentTruckInfo.code}&userCode=${this.parentTruckInfo.userCode}&fullName=${this.parentTruckInfo.fullName}`, `新建${this.objectName}`);
            break;
          case 'edit':
            this.openWindow(`${this.editUrl}?code=${model.code}&objectName=${this.objectName}&userCode=${this.parentTruckInfo.userCode}&fullName=${this.parentTruckInfo.fullName}`, `编辑${this.objectName}`);
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
        Object.assign(searchParams, this.params);
        // var searchParams_copy = Object.assign(searchParams,{'userCode':this.params.driverCode})
        const self = this;
        this.total = 0;
        this.loading = true;
        self.listData = [];

        listPerson(searchParams, (success, error) => {

        // list(searchParams, (success, error) => {
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
              actionList.push({ key: 'edit', name: '编辑' });
              actionList.push({ key: 'remove', name: '删除' });
              data.actionMenuList = actionList;
            });
            self.listData = success.content;
            this.loading = false;
          }
        });
      }
    },
    created() {
      console.log(this.customColumn);
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
.rl-fix-table td .el-dialog__header {
  display: block !important;
}
</style>

