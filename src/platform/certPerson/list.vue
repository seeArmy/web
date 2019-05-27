<!-- 司机认证 -->
<template>
  <div id="driverVerify">
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
              :objectName="objectName"
              :miniSearchNum="3">
    </ele-list>
  </div>
</template>


<script type="text/ecmascript-6">
/* eslint-disable object-shorthand */

import eleList from '../../components/ele-list/eleList.vue';
import { urlRedirect } from '../../../api/Utils';
import { certPersonSearch, certPersonColumn, certPersonList, certPersonRevokeApprove } from '../../../api/PlatformService';

export default {
  name: 'certPersonList',
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
      getColumn: certPersonColumn,
      getList: certPersonList,
      getSearch: certPersonSearch,
      objectName: '司机认证',
      addUrl: '/platform/cert_person/approval.html',
      editUrl: '/platform/cert_person/approval.html',
      listUrl: '/platform/cert_person/list.html',
      deleteFun: Function,
      exportCsv: Function,
      add: Function,
      downloadErrorData: Function,
      importUrl: null,
      downloadTemplate: Function
    };
  },
  methods: {
    openWindow(url, title) {
      urlRedirect(url, title);
    },
    more(model) {
      this.openWindow(`${this.listUrl}?objectName=${this.objectName}&${this.toParameterArray(model).join('&')}`, `${this.objectName}列表`);
    },
    onReady(searchModel) {
    },
    doReject(row) {
      const h = this.$createElement,
        self = this;
      this.$msgbox({
        title: '消息',
        message: h('p', null, [
          h('span', null, '您确认打回司机认证吗？')
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = '执行中...';
            certPersonRevokeApprove(row.userCode, (success, error) => {
              if (success) {
                this.$message({
                  type: 'success',
                  message: '操作成功',
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
        case 'verify':
          this.openWindow(`${this.editUrl}?code=${model.userCode}&isShow=true`, `${this.objectName}`);
          break;
        case 'view':
          this.openWindow(`${this.editUrl}?code=${model.userCode}&editable=false`, `${this.objectName}`);
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
        }
      });
    }
  },
  created() {
  },
  mounted() {
    this.$refs.eleList.searchModel.certStatus = 'authenticating';
    this.$nextTick(() => {
      this.$refs.eleList.dispatchQueryEvent();
    });
  }
};

</script>
<style lang="scss" rel="stylesheet/scss">
#driverVerify {
  #miniSearch {
    .el-input__inner {
      width: 168px;
    }
  }
}
</style>
