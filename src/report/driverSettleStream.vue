/** * list.vue * 司机列表 * Created by zhuyi on 17/7/21. */
<template>
  <!-- 司机列表页面 -->
  <div>
    <ele-list :selectable="selectable" :operatable="operatable" @query="query" @ready="query" @action="action" @more="more" @exportData="exportData" :total="total" :loading="loading" :list-data="listData" ref="eleList" :customColumn="customColumn" :params="params" :needPage="needPage" :isAdvanced="isAdvanced" :isPlatformCode="isPlatformCode" :editUrl="editUrl" :getColumn="getColumn" :getList="getList" :exportCsv="exportCsv" :getSearch="getSearch" :needAdd='false' :showImportButton='false' :showDownloadTemplate='false' :objectName="objectName">
    </ele-list>
  </div>
</template>
<script type="text/ecmascript-6">
import eleList from '../components/ele-list/eleList.vue';
import { urlRedirect, checkPermission, dateFormat } from '../../api/Utils';
import { getDriverSettleStreamColumn as getColumn, getDriverSettleStreamList as list, getDriverSettleStreamSearch as getSearch, exportDriverSettleStreamSummaryCsv as exportCsv } from '../../api/ReportService';
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
    isPlatformCode: {
      type: Boolean,
      'default': true
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
    needPage: {
      type: Boolean,
      'default': true
    },
    params: {
      type: Object,
      'default': function() {
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
      objectName: '司机结算流水',
      addUrl: '/driver/add.html',
      editUrl: '/driver/add.html',
      listUrl: '/driver/list.html',
      exportCsv,
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
      const fromTime = new Date(searchParams.inBeginTime),
        toTime = new Date(searchParams.inEndTime);
      // 检查时间 是否查过3个月
      if (toTime - fromTime > 86400000 * 93) {
        this.$message({
          type: 'warning',
          message: '开始时间和结束时间必须在93天内',
          duration: 3000
        });
        return;
      }
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
            actionList.push({ key: 'show', name: '查看运单详情' });
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
    let start = dateFormat(new Date(new Date().getTime() - 86400000 * 30), 'yyyy-MM-dd HH-mm-ss');
    let end = dateFormat(new Date(new Date().getTime()), 'yyyy-MM-dd HH-mm-ss');
    // 默认 提前一个月
    this.$refs.eleList.searchModel.inBeginTime = start;
    this.$refs.eleList.searchModel.inEndTime = end;
    this.$nextTick(() => {
      this.$refs.eleList.dispatchQueryEvent();
    });
  }
};

</script>
<style lang="scss" rel="stylesheet/scss">


</style>
