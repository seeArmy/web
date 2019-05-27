/**
* list.vue 
* 外包订单确认列表 
* Created by cc on 18/5/7.
*/
<template>
  <div>
    <ele-list :selectable="selectable" :needAdd='false' :showImportButton="false" :showDownloadTemplate="false" :operatable="operatable" @query="query" @ready="query" @action="action" @more="more" @exportData="exportData" :total="total" :loading="loading" :list-data="listData" ref="eleList" :customColumn="customColumn" :params="params" :needPage="needPage" :isAdvanced="isAdvanced" :deleteFun="deleteFun" :add="add" :downloadErrorData="downloadErrorData" :downloadTemplate="downloadTemplate" :importUrl="importUrl" :editUrl="editUrl" :getColumn="getColumn" :getList="getList" :exportCsv="exportCsv" :getSearch="getSearch" @uploadSuccess='uploadSuccess' :objectName="objectName" :exportParams='exportParams' :folder="folder" :customListName="'外包订单确认列表'">
      <span slot="funArea">
        <el-button @click="batchSend">批量确认发送</el-button>
      </span>
    </ele-list>
    <el-dialog :title="actionDialogTitle" :visible.sync="actionDialogVisible" size="large" :class="isMap">
      <component ref="logisticsAction" :is="currentDialogComponent" :page='pageMap' :size="sizeMap" @success="dialogSuccess" @fail="dialogFail" @close="dialogClose" :type="type" :actionType="actionType" :actionDomain="actionDomain" :id="currentCode" :action="currentActionCode" :actionExecuteFun="actionExecuteFun" :isDialog="true"></component>
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
import { urlRedirect } from '../../api/Utils';
import { getColumnConfirm, getAction, list, getSearchConfirm, deleted, exportCsv, add, downloadErrorData, downloadTemplate, addAction as executeAction, edit, batchConfirmSend } from '../../api/OutsourcingLogisticsService';

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
      getColumn: getColumnConfirm,
      getList: list,
      getSearch: getSearchConfirm,
      objectName: '发出的订单',
      addUrl: '/outsourcingLogistics/add.html',
      editUrl: '/outsourcingLogistics/add.html',
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
      exportParams:null,
      folder: 'logistics/outsourcingConfirm'
    };
  },
  methods: {
    batchSend() {
      const data = this.listData,
        codeList = [];
      let total = this.total,
        selected = 0;
      // 列表没数据
      if (total = 0) {
        this.$message({
          type: 'warning',
          message: '没有选中的记录！',
          duration: 3000
        });
        return false;
      } else {
        data.forEach((val) => {
          // 订单状态为待发送或已拒接才有确认发送操作
          if (val.checked && (val.logisticsStatus === 'ready' || val.logisticsStatus === 'reject')) {
            selected += 1;
            codeList.push(val.code);
          }
        });
        // 选中有效记录条数
        if (selected > 0) {
          const self = this;
          this.$msgbox({
            title: '提示',
            message: `共选中${selected}条符合的记录，确认发送吗？`,
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            beforeClose: (action, instance, done) => {
              if (action === 'confirm') {
                instance.confirmButtonLoading = true;
                instance.confirmButtonText = '执行中...';
                // 批量确认发送
                let sucNum = 0, errNum = 0;
                for (let i = 0; i < selected; i++) {
                  executeAction(codeList[i], 'logisticsPend', null, null, (success, error) => {
                    if (error || success.code !== 200) {
                      errNum += 1;
                    }
                    if (success) {
                      sucNum += 1;
                    }
                    if ((sucNum + errNum) === selected) {
                      const info = `批量确认发送共${selected}条数据，成功${sucNum}条，失败${errNum}条！`;
                      self.$message({
                        type: 'warning',
                        message: info,
                        duration: 3000
                      });
                      instance.confirmButtonLoading = false;
                      done();
                    }
                  });
                }
              } else {
                done();
              }
            }
          }).then(() => {
            setTimeout(() => {
              window.location.reload();
            }, 3000);
          });
        } else {
          this.$message({
            type: 'warning',
            message: '没有选中有效的记录（订单状态为待我方发送或对方已拒接）！',
            duration: 3000
          });
          return false;
        }
      }
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
        case 'logisticsPend':
          this.doSubmitSettle(menu.key, menu.name, model);
          break;
        case 'map':
          this.isMap = 'map-dialog';
          this.actionDialogTitle = menu.name;
          this.actionDialogVisible = true;
          this.currentCode = model.code;
          this.currentActionCode = menu.key;
          this.currentDialogComponent = 'ele-logistic-pop-map';
          //            this.openWindow(`/truck/truck-gps.html?truckLicenseNo=${model.truckLicenseNo}&objectName=${this.objectName}`, '车辆轨迹');
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
        getColumnConfirm((success) => {
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
      // 业务逻辑：
      // 此列表 只展示 logisticsStatus 为 ready,pend,reject 这三种，所以 请求 默认就这三个，不支持 这三种之外的状态请求
      // logisticsStatus 合并对象，当搜索框里面有 'ready,pend,reject' 任何一项，那么就用那一项
      const st = searchParams.logisticsStatus;
      if(st &&  'ready,pend,reject'.indexOf(st)>= 0){
         Object.assign(searchParams, this.params);
      }else{
        Object.assign(searchParams, this.params, { logisticsStatus: 'ready,pend,reject' });
      }
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
            // 待发送、已拒接操作
            if (data.logisticsStatus === 'ready' || data.logisticsStatus === 'reject') {
              actionList.push({ key: 'logisticsPend', name: '确认发送' });
              actionList.push({ key: 'edit', name: '编辑' });
              actionList.push({ key: 'remove', name: '删除' });
            }
            data.actionMenuList = actionList;
          });
          self.listData = success.content;
          this.loading = false;
          //console.log('parent.listData', self.listData);
        }
      });
    }
  },
  mounted(){
  }
};

</script>
<style lang="scss" rel="stylesheet/scss">

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
