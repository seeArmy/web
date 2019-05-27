/** * list.vue * 外包订单列表 * Created by cc on 18/5/7. */
<template>
  <div id="logisticsList">
    <ele-list :selectable="selectable" :needAdd="false" :showImportButton="false" :showDownloadTemplate="false" :operatable="operatable" @query="query" @ready="query" @action="action" @more="more" @exportData="exportData" :total="total" :loading="loading" :list-data="listData" ref="eleList" :customColumn="customColumn" :params="params" :needPage="needPage" :isAdvanced="isAdvanced" :deleteFun="deleteFun" :add="add" :downloadErrorData="downloadErrorData" :downloadTemplate="downloadTemplate" :importUrl="importUrl" :editUrl="editUrl" :getColumn="getColumn" :getList="getList" :exportCsv="exportCsv" :getSearch="getSearch" @uploadSuccess='uploadSuccess' :exportParams='exportParams' :objectName="objectName" :isShowSerialNumber='true' :folder="folder">
    <span slot="topRightFun" class="recycle-bin" @click="recycleList">
      <i class="el-icon-delete2"></i> 回收站
    </span>
    </ele-list>
    <el-dialog :title="actionDialogTitle" :visible.sync="actionDialogVisible" size="large" :class="isMap" v-if="actionDialogVisible">
      <component ref="logisticsAction" :is="currentDialogComponent" :isLogistics='isLogistics' :page='pageMap' :size="sizeMap" @success="dialogSuccess" @fail="dialogFail" @close="dialogClose" :type="type" :actionType="actionType" :actionDomain="actionDomain" :id="currentCode" :action="currentActionCode" :actionExecuteFun="actionExecuteFun" :isDialog="true" :dialogData="dialogData"></component>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogClose">取 消</el-button>
        <el-button type="primary" @click="dialogSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script type="text/ecmascript-6">
import eleList from '../components/ele-list/eleList.vue';
import eleLogisticPopMap from '../components/ele-pop-map/eleLogisticPopMap.vue';
import { urlRedirect,checkPermission } from '../../api/Utils';
import { getColumn, getAction, list, getSearch, deleted, exportCsv, add, downloadErrorData, downloadTemplate, addAction as executeAction, edit } from '../../api/OutsourcingLogisticsService';

import ApiConst from '../../api/ApiConst';
import eleAction from '../components/ele-action/eleAction.vue';

export default {
  name: 'OutSourcingLogisticsList',
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
      objectName: '外包订单',
      addUrl: '/outsourcingLogistics/add.html',
      editUrl: '/outsourcingLogistics/add.html',
      recycleUrl: '/outsourcingLogistics/recycleList.html',
      dispatch: true,
      dispatchUrl: '/waybill/add.html',
      deleteFun: deleted,
      exportCsv,
      add,
      popTruckMap: true,
      downloadErrorData,
      importUrl: `${ApiConst.apiLogisticsDomain}/import/custom/outsourcingLogistics`,
      downloadTemplate,
      pageMap: 1,
      sizeMap: 10,
      isMap: '',
      exportParams: null,
      folder: 'logistics/outsourcing',
      dialogData: null,
      isLogistics:false
    };
  },
  methods: {
    recycleList() {
      this.openWindow(`${this.recycleUrl}`, '外包订单回收站列表');
    },
    openWindow(url, title) {
      urlRedirect(url, title);
    },
    more(model) {
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
    doRemove(model) {
      const self = this;
      this.$msgbox({
        title: '确认',
        message: `确认要删除${this.objectName} ${model.logisticsNo} 吗？`,
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
    action(command, menu, model) {
      console.log('command===', command);
      console.log('action command', command, 'menu', menu, 'model', model);
      switch (command) {
        case 'add':
          this.openWindow(`${this.editUrl}?objectName=${this.objectName}`, `新建${this.objectName}`);
          break;
        case 'copy':
          this.openWindow(`${this.editUrl}?originalCode=${model.code}&objectName=${this.objectName}`, `复制新建${this.objectName}`);
          break;
        case 'edit':
          this.openWindow(`${this.editUrl}?code=${model.code}&objectName=${this.objectName}`, `编辑${this.objectName}`);
          break;
        case 'dispatch':
          this.openWindow(`${this.dispatchUrl}?logisticsCode=${model.code}`, '派车');
          break;
        case 'remove':
          this.doRemove(model);
          break;
        case 'logisticsFinish':
              this.doSubmitSettle(menu.key, menu.name, model);
             break;
        case 'logisticsPend':
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
          //            this.openWindow(`/truck/truck-gps.html?truckLicenseNo=${model.truckLicenseNo}&objectName=${this.objectName}`, '车辆轨迹');
          break;
        case 'bizVisual':
          window.open(`/outsourcingLogistics/bizVisual.html?code=${model.code}`);
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
        getColumn((success) => {
          const paramsObj = {
            params: params,
            configList: success.content
          };
          exportCsv(paramsObj, (success, error) => {
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

      if(!searchParams.logisticsStatus || searchParams.logisticsStatus.length<1){
         Object.assign(searchParams, this.params, { logisticsStatus: 'todo,doing,finish' });
      }
      // 外包订单列表默认查询，待执行、执行中、订单完成数据

      this.exportParams = searchParams;
      console.log('query', searchParams);
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
        if (success) {
          this.total = success.total;
          success.content.forEach((data) => {
            const actionList = [];
            // 外包订单列表，编辑操作放出 BY XLD 2018年9月26日16:03:05
            actionList.push({ key: 'edit', name: '编辑' });
            // 待发送、已拒接操作
            if (data.logisticsStatus === 'ready' || data.logisticsStatus === 'reject') {
              actionList.push({ key: 'logisticsPend', name: '确认发送' });
              actionList.push({ key: 'remove', name: '删除' });
            }
            // 待执行、执行中操作
            if (data.logisticsStatus === 'todo' || data.logisticsStatus === 'doing') {
              actionList.push({ key: 'map', name: '查看位置' });
            }
            actionList.push({ key: 'copy', name: '复制新建' });

            if (checkPermission('logistics2.finish') && data.logisticsStatus === 'doing'){
              actionList.push({ key: 'logisticsFinish', name: '确认完成' });
            }

            if (checkPermission('logistics.view')) {
               actionList.push({ key: 'bizVisual', name: '订单监控' });
            }

            data.actionMenuList = actionList;
          });
          self.listData = success.content;
          this.loading = false;
        }
      });
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

#logisticsList {
  .el-dialog--large {
    transform: none;
    margin-left: -35%;
  }
}

.map-dialog {
  .el-dialog--large {
    top: 5% !important;
    bottom: 5%;
    width: 90%;
    margin-left: -45% !important;
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
