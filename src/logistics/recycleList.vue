/** 
* list.vue 
* 订单列表 
* Created by zhuyi on 17/7/21. 
*/
<template>
  <div>
    <ele-list :selectable="false" :operatable="true" :showExportButton='false' :showImportButton="false" :showDownloadTemplate="false" @query="query" @ready="query" @action="action" @more="more" @exportData="exportData" :total="total" :loading="loading" :list-data="listData" ref="eleList" :customColumn="customColumn" :params="params" :needPage="needPage" :needAdd="false" :isAdvanced="isAdvanced" :deleteFun="deleteFun" :add="add" :downloadErrorData="downloadErrorData" :downloadTemplate="downloadTemplate" :importUrl="importUrl" :editUrl="editUrl" :getColumn="getColumn" :getList="getList" :exportCsv="exportCsv" :getSearch="getSearch" @uploadSuccess='uploadSuccess' :objectName="objectName" :getImportColumn="getImportColumn" :folder="folder" v-if="showNow">
    <!-- <span slot="topRightFun" class="recycle-bin" @click="recycleList">
      <i class="el-icon-delete2"></i> 回收站
    </span> -->
    </ele-list>
    <el-dialog :title="actionDialogTitle" :visible.sync="actionDialogVisible" size="large" :class="isMap">
      <component ref="logisticsAction" :is="currentDialogComponent" :page='pageMap' :size="sizeMap" @success="dialogSuccess" @fail="dialogFail" @close="dialogClose" :type="type" :actionType="actionType" :actionDomain="actionDomain" :id="currentCode" :action="currentActionCode" :actionExecuteFun="actionExecuteFun" :isDialog="true" :dialogData="dialogData"></component>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogClose">取 消</el-button>
        <el-button type="primary" @click="dialogSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script type="text/ecmascript-6">
// import eleList from '../components/ele-list/eleList.vue';
import eleList from '@/components/v3/ele-table/eleList.vue';
import eleLogisticPopMap from '../components/ele-pop-map/eleLogisticPopMap.vue';
import { urlRedirect } from '../../api/Utils';
import { recoverLogistics as recover , getDetail, getColumnRecycle as getColumn, getAction, list, getSearch, deleted, exportCsv, add, downloadErrorData, downloadTemplate, addAction as executeAction, edit } from '../../api/LogisticsService';
import { selfs } from '../../api/OrgService';

import ApiConst from '../../api/ApiConst';
import eleAction from '../components/ele-action/eleAction.vue';

export default {
  name: 'LogisticsList',
  components: {
    'ele-list': eleList,
    'ele-logistic-pop-map': eleLogisticPopMap,
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
      actionDialogTitle: 'Dialog',
      actionDialogVisible: false,
      type: 'logistics',
      actionType: 'logistics',
      actionDomain: `${ApiConst.apiLogisticsDomain}`,
      actionExecuteFun: executeAction,
      currentCode: null,
      currentActionCode: null,
      currentDialogComponent: '',
      getColumn,
      getList: list,
      getSearch,
      objectName: '订单回收站',
      addUrl: '/logistics/add.html',
      editUrl: '/logistics/add.html',
      outsourcingUrl: '/outsourcingLogistics/add.html',
      dispatch: true,
      dispatchUrl: '/waybill/add.html',
      deleteFun: deleted,
      exportCsv,
      add,
      popTruckMap: true,
      downloadErrorData,
      importUrl: `${ApiConst.apiLogisticsDomain}/import/custom/logistics`,
      downloadTemplate,
      pageMap: 1,
      sizeMap: 10,
      isMap: '',
      showImportButton: false,
      showNow: false,
      getImportColumn: getDetail,
      folder: 'logistics/recycle',
      dialogData: null
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
    dialogSubmit() {
      this.$refs.logisticsAction.execute();
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
    // 导入 订单 统一给 承运方 默认为 当前登录的公司
    uploadSuccess(data) {
      // console.log('data ...', data);
      const localStorage = window.localStorage;
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      data.forEach(item => {
        item.carrierOrgName = userInfo.orgFullName;
        item.carrierOrgCode = userInfo.orgCode;
        item.platformCarrierOrgCode = userInfo.orgCode;
      })
    },
    doSubmitSettle(actionCode, actionName, model) {
      const self = this;
      this.$msgbox({
        title: '确认',
        message: `确认要${actionName}吗？`,
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = '执行中...';
            executeAction(model.code, actionCode, null, null, (success, error) => {
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

      switch (command) {
        case 'recover':
          this.doRecover(model);
          break;
        case 'add':
          this.openWindow(`${this.editUrl}?objectName=${this.objectName}`, `新建${this.objectName}`);
          break;
        case 'logisticsCopy':
          this.openWindow(`${this.editUrl}?originalCode=${model.code}&objectName=${this.objectName}`, `复制新建${this.objectName}`);
          break;
        case 'logisticsEdit':
          this.openWindow(`${this.editUrl}?code=${model.code}&objectName=${this.objectName}`, `编辑${this.objectName}`);
          break;
        case 'dispatch':
          this.openWindow(`${this.dispatchUrl}?logisticsCode=${model.code}`, '派车');
          break;
        case 'logisticsOutsource':
          this.openWindow(`${this.outsourcingUrl}?logisticsOutsourceCode=${model.code}`, '转包订单');
          break;
        case 'logisticsRemove':
          this.doRemove(model);
          break;
        case 'logisticsFinish':
          this.doSubmitSettle(menu.key, menu.name, model);
          break;
        case 'map':
          this.isMap = 'map-dialog';
          this.dialogData = model;
          this.actionDialogTitle = menu.name;
          this.actionDialogVisible = true;
          this.currentCode = model.code;
          this.currentActionCode = menu.key;
          this.currentDialogComponent = 'ele-logistic-pop-map';
          break;
        default:
          {
            const method = menu.action.actionMethod;
            if (method === 'link') {
              const methodParam = menu.action.actionMethodParameter;
              this.openWindow(`${methodParam}?logisticsCode=${model.code}`, `${menu.action.actionName}`);
            } else if (method === 'pop') {
              this.actionDialogTitle = menu.name;
              this.actionDialogVisible = true;
              this.currentCode = model.code;
              this.currentActionCode = menu.key;
              this.currentDialogComponent = 'ele-action';
            } else {
              console.error('unknow action', command);
            }
          }
      }
    },
    //确定完成
    editFunc(command, menu, model) {
      model.logisticsStatus = 'done';
      edit(model.code, model, (success, error) => {
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
      Object.assign(searchParams, this.params, { 'deleted' : true});
      // 如果 订单状态没有值，那么手动加上 所有状态，主要是 后端有很多条件需要，此处 先前端处理
      if (!searchParams.logisticsStatus || searchParams.logisticsStatus.length < 1) {
        searchParams.logisticsStatus = 'waiting,todo,doing,finish,cancel';
      }
      const self = this;
      this.total = 0;
      this.loading = true;
      self.listData = [];
      list(searchParams, (success, error) => {
        this.loading = false;
        if (error) {
          this.$message({
            type: 'error',
            message: error.content,
            duration: 5000
          });
        }
        const codeList = [];
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
  mounted() {

    // 在public 里面 找不到 pageRefresh,
    setTimeout(() => {
      if (document.querySelector('#pageRefresh')) {
        document.querySelector('#pageRefresh').addEventListener('click', () => {
          window.location.reload();
        });
      }
    }, 2000);


    const certControl = JSON.parse(localStorage.getItem('otherappConfig'))['other.certControl'];
    if (certControl === 'TRUE') {
      selfs((success, error) => {
        if (error || success.code !== 200) {
          this.$message({
            type: 'error',
            message: `${error}`,
            duration: 3000
          });
          return false;
        }
        if (success) {
          const data = success.content;
          if (data.certStatus !== 'authenticated') {
            this.showImportButton = false;
          } else {
            this.showImportButton = true;
          }
          this.showNow = true;
        }
      });
    } else {
      this.showNow = true;
    }
  }
};

</script>
<style lang="scss" rel="stylesheet/scss">
.recycle-bin {
  margin-left: 8px;
  padding-left: 7px;
  padding-right: 10px;
  opacity: .8;
  cursor: pointer;
  &:hover {
    opacity: 1;
  }
}
.map-dialog {
  .el-dialog--large {
    top: 5% !important;
    bottom: 5%;
    width: 90%;
    margin-bottom: 0;
  }
  .pop-map {
    position: absolute;
    top: 57px;
    right: 20px;
    bottom: 55px;
    left: 20px;
  }
  .el-dialog__body {
    max-height: none;
  }
  .el-dialog__footer {
    position: absolute;
    right: 20px;
    bottom: 0;
    left: 20px;
    margin: 0;
    box-sizing: border-box;
  }
}

</style>
