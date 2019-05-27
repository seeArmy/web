/** * list.vue * 运单列表 * Created by zhuyi on 17/7/21. */
<template>
  <div id="waybillBrokerList">
    <ele-list :selectable="selectable" :operatable="operatable" :showImportButton="false" :showDownloadTemplate="false" :showExportButton="true" :needAdd="false" @query="query" @ready="query" @action="action" @more="more" @exportData="exportData" :total="total" :loading="loading" :list-data="listData" ref="eleList" :customColumn="customColumn" :params="params" :needPage="needPage" :needMore="needMore" :isAdvanced="isAdvanced" :deleteFun="deleteFun" :add="add" :downloadErrorData="downloadErrorData" :downloadTemplate="downloadTemplate" :importUrl="importUrl" :editUrl="editUrl" :getColumn="getColumn" :getList="getList" :exportCsv="exportCsv" :getSearch="getSearch" :getAction="getAction" :objectName="objectName" :folder="folder">
      <template slot="funArea">
        <el-button v-check-permission="'uploadWaybillPlatform.add'" @click="batchCreateUploadWaybill">创建上报运单</el-button>
        <el-button v-check-permission="'otherUploadWaybillPlatform.add'" @click="batchCreateUnsettleUploadWaybill">创建上报运单</el-button>
        <el-button v-check-permission="'uploadCapitalflowPlatform.add'" @click="batchCreatReportCapitalFlow">创建上报运费</el-button>
      </template>
    </ele-list>
    <!-- 标准版打印派车单 -->
    <pop-print-waybill ref="printWaybillDialog"></pop-print-waybill>
    <lyg-pop-print-waybill ref="lygPrintWaybillDialog"></lyg-pop-print-waybill>
  </div>
</template>
<script type="text/ecmascript-6">
import eleList from '../../components/ele-list/eleList.vue';
import { urlRedirect, checkPermission } from '../../../api/Utils';
import { getColumnPlatformWaybill as getColumn, list, getSearchPlatformWaybill as getSearch, deleteList, getAction, executeAction, exportCsv, add, downloadErrorData, downloadTemplate, getWaybillList } from '../../../api/PlatformWaybillService';
import * as SettleBillService from '../../../api/PlatformSettleBillService';
import * as ApiConst from '../../../api/ApiConst';
// import { checkPermission } from '../../../api/Utils';
import { createUploadWaybill, createUnsettleUploadWaybill, creatReportCapitalFlow } from '../../../api/waybillService';
import '../../components/vueDirectives';

import popPrintWaybill from './popPrintWaybill.vue';
import lygPopPrintWaybill from './lygPopPrintWaybill.vue';

const actionExcludeFilter = ['settle', 'undoSettle', 'undoPayConfirm', 'removeWaybill'];
export default {
  name: 'waybillList',
  components: {
    'ele-list': eleList,
    'pop-print-waybill': popPrintWaybill,
    'lyg-pop-print-waybill': lygPopPrintWaybill
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
    params: {
      type: Object,
      'default': function() {
        return {};
      }
    },
    //是否 是被订单中引用，是，那么网路请求不一样
    isFormLogistics: {
      type: Boolean,
      'default': false
    },
  },
  data: () => {
    return {
      // 合规的弹框
      dialogControl: {
        visible: false,
        num: 0,
        status: null,
        btnDisabled: false,
        codes: [],
        des: ''
      },
      listData: [],
      total: 0,
      loading: true,
      getColumn,
      actionDialogTitle: 'Dialog',
      actionDialogVisible: false,
      type: 'waybill',
      actionType: 'waybill',
      actionDomain: `${ApiConst.apiWayBillDomain}`,
      actionExecuteFun: executeAction,
      currentWaybillCode: '',
      currentActionCode: '',
      currentDialogComponent: '',
      getList: list,
      getSearch,
      objectName: '平台运单',
      addUrl: '/waybillBroker/platformWaybill/add.html',
      editUrl: '/waybillBroker/platformWaybill/add.html',
      listUrl: '/waybillBroker/platformWaybill/list.html',
      actionUrl: '/platformWaybill/action.html',
      deleteFun: deleteList,
      getAction,
      exportCsv,
      add,
      downloadErrorData,
      importUrl: `${ApiConst.apiWayBillDomain}/import/custom/waybill`,
      popWaybillTruckMap: true,
      permission: true,
      downloadTemplate,
      isMap: '',
      exportParams: null,
      projectName: '',
      folder: 'waybillBroker/platformWaybill',
    };
  },
  methods: {
    // 创建上报运单记录
    batchCreateUploadWaybill() {
      const checkedArr = [],
        errMsg = [];
      let sucNum = 0,
        errNum = 0;
      // 获取符合条件的数据
      this.listData.forEach(item => {
        if (item.checked && item.reportStatus == 'uncreated') {
          checkedArr.push(item);
        }
      });
      // 判断是否勾选
      if (checkedArr.length == 0) {
        this.$message({
          type: 'warning',
          message: '请选择待生成的运单',
          duration: 3000
        });
        return false;
      } else {
        const h = this.$createElement;
        this.$msgbox({
          title: '消息',
          message: h('p', null, [h('span', null, `只有单车结算通过的运单才可以创建上报运单记录，确定提交？`)]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '执行中...';
              const total = checkedArr.length;
              for (let i = 0; i < total; i++) {
                console.log('i is', i, 'list data is', checkedArr[i]);
                createUploadWaybill(checkedArr[i].code, (success, error) => {
                  if (error) {
                    errMsg.push({waybillNo: checkedArr[i].waybillNo, msg: error.content});
                    errNum ++;
                  } else {
                    sucNum ++;
                  }
                  if (sucNum + errNum === total) {
                    window.localStorage.setItem('ErrorMsg', JSON.stringify(errMsg));
                    console.log('upload finished, error msg1 is', errMsg);
                    this.loading = false;
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
          this.$msgbox({
            title: '结果',
            message: h('p', null, [h('span', null, `提交成功，共生成成功${sucNum}条，失败${errNum}条！`),
              h('a', { attrs: { href: '/waybillBroker/platformWaybill/result.html', target: '_blank', class: 'blue' } }, `查看错误信息`)]),
            showConfirmButton: false,
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '关闭',
          }).catch(() => {
            setTimeout(() => {
              // window.location.reload();
              this.$refs.eleList.dispatchQueryEventSavePage();
            }, 1000);
          });
          
        });
      }
    },
    // 创建未结算运单上报运单记录
    batchCreateUnsettleUploadWaybill() {
      const checkedArr = [],
        errMsg = [];
      let sucNum = 0,
        errNum = 0;
      // 获取符合条件的数据
      this.listData.forEach(item => {
        if (item.checked && item.reportStatus == 'uncreated') {
          checkedArr.push(item);
        }
      });
      // 判断是否勾选
      if (checkedArr.length == 0) {
        this.$message({
          type: 'warning',
          message: '请选择待生成的运单',
          duration: 3000
        });
        return false;
      } else {
        const h = this.$createElement;
        this.$msgbox({
          title: '消息',
          message: h('p', null, [h('span', null, `只有运输完成的运单才可以创建上报运单记录，确定提交？`)]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '执行中...';
              const total = checkedArr.length;
              for (let i = 0; i < total; i++) {
                console.log('i is', i, 'list data is', checkedArr[i]);
                createUnsettleUploadWaybill(checkedArr[i].code, (success, error) => {
                  if (error) {
                    errMsg.push({waybillNo: checkedArr[i].waybillNo, msg: error.content});
                    errNum ++;
                  } else {
                    sucNum ++;
                  }
                  if (sucNum + errNum === total) {
                    window.localStorage.setItem('ErrorMsg', JSON.stringify(errMsg));
                    console.log('upload finished, error msg2 is', errMsg);
                    this.loading = false;
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
          this.$msgbox({
            title: '结果',
            message: h('p', null, [h('span', null, `提交成功，共生成成功${sucNum}条，失败${errNum}条！`),
              h('a', { attrs: { href: '/waybillBroker/platformWaybill/result.html', target: '_blank', class: 'blue' } }, `查看错误信息`)]),
            showConfirmButton: false,
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '关闭',
          }).catch(() => {
            setTimeout(() => {
              // window.location.reload();
              this.$refs.eleList.dispatchQueryEventSavePage();
            }, 1000);
          });
          
        });
      }
    },
    // 批量生成运费记录
    batchCreatReportCapitalFlow() {
      const checkedArr = [],
        errMsg = [];
      let sucNum = 0,
        errNum = 0;
      // 获取符合条件的数据
      this.listData.forEach(item => {
        if (item.checked && item.reportCapitalStatus == 'uncreated') {
          checkedArr.push(item);
        }
      });
      // 判断是否勾选
      if (checkedArr.length == 0) {
        this.$message({
          type: 'warning',
          message: '请选择待生成的运单',
          duration: 3000
        });
        return false;
      } else {
        const h = this.$createElement;
        this.$msgbox({
          title: '消息',
          message: h('p', null, [h('span', null, `只有单车付款完成的运单才可以创建上报运费记录，确定提交吗？`)]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '执行中...';
              const total = checkedArr.length;
              for (let i = 0; i < total; i++) {
                console.log('i is', i, 'list data is', checkedArr[i]);
                creatReportCapitalFlow(checkedArr[i].code, (success, error) => {
                  if (error) {
                    errMsg.push({waybillNo: checkedArr[i].waybillNo, msg: error.content});
                    errNum ++;
                  } else {
                    sucNum ++;
                  }
                  if (sucNum + errNum === total) {
                    window.localStorage.setItem('ErrorMsg', JSON.stringify(errMsg));
                    console.log('upload finished, error msg2 is', errMsg);
                    this.loading = false;
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
          this.$msgbox({
            title: '结果',
            message: h('p', null, [h('span', null, `提交成功，共生成成功${sucNum}条，失败${errNum}条！`),
              h('a', { attrs: { href: '/waybillBroker/platformWaybill/result.html?tp=fee', target: '_blank', class: 'blue' } }, `查看错误信息`)]),
            showConfirmButton: false,
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '关闭',
          }).catch(() => {
            setTimeout(() => {
              // window.location.reload();
               this.$refs.eleList.dispatchQueryEventSavePage();
            }, 1000);
          });
          
        });
      }
    },
    openWindow(url, title) {
      urlRedirect(url, title);
    },
    more(model) {
      //        console.log('more', `${this.listUrl}?objectName=${this.objectName}&${this.toParameterArray(model).join('&')}`);
      this.openWindow(`${this.listUrl}?objectName=${this.objectName}&${this.toParameterArray(model).join('&')}`, `${this.objectName}列表`);
    },
    dialogSubmit() {
      this.$refs.waybillAction.execute();
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
      this.currentWaybillCode = null;
      this.currentActionCode = null;
    },
    doRemove(model) {
      const self = this;
      this.$msgbox({
        title: '确认',
        message: `确认要删除${this.objectName} ${model.waybillNo} 吗？`,
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = '执行中...';
            deleteList({ code: model.code }, (success, error) => {
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
        case 'map':
          this.isMap = 'map-dialog';
          this.actionDialogTitle = menu.name;
          this.actionDialogVisible = true;
          this.currentWaybillCode = model.code;
          this.currentActionCode = menu.key;
          this.currentDialogComponent = 'ele-waybill-pop-map';
          //            this.openWindow(`/truck/truck-gps.html?truckLicenseNo=${model.truckLicenseNo}&objectName=${this.objectName}`, '车辆轨迹');
          break;
        case 'viewTrajectory':
          // this.openWindow(`/truck/truck-gps.html?truckLicenseNo=${model.truckLicenseNo}&waybillStatus=${model.waybillStatus}&loadingTime=${model.loadingTime}&unloadingTime=${model.unloadingTime}`, `车辆轨迹`);
          // const url = menu.action.actionMethodParameter; // 轨迹页面URL/truck/truck-gps.html
          window.open(`/truck/truck-gps.html?truckLicenseNo=${model.truckLicenseNo}&waybillStatus=${model.waybillStatus}&loadingTime=${model.loadingTime}&unloadingTime=${model.unloadingTime}`);
          break;
        case 'loading':
        case 'loadingInput':
          this.$refs.loadingActionDialog.open(model, command, menu.name);
          break;
        case 'unloading':
        case 'unloadingInput':
          this.$refs.loadingActionDialog.open(model, command, menu.name);
          break;
        case 'printDispatchBill':
          this.$refs.printWaybillDialog.open(model, 'waybill', 'dispatchPrintStatus', model.code);
          break;
        case 'lygPrintDispatchBill':
          this.$refs.lygPrintWaybillDialog.open(model, 'waybill', 'dispatchPrintStatus', model.code);
          break;
        case 'cancel':
          this.doSubmitSettle(menu.key, menu.name, model);
          break;
        case 'addCraneOrder':
          this.openWindow(`/crane/craneSignListAdd.html?editable=true&objectName=吊车单&waybillCode=${model.code}`, `委托派单`);
          break;
        default:
          {
            console.log('execute method:', model.code, menu);
            const method = menu.action.actionMethod;
            if (method === 'link') {
              const methodParam = menu.action.actionMethodParameter;
              this.openWindow(`${methodParam}${methodParam.indexOf('?') > 0 ? '&' : '?'}code=${model.code}`, `${menu.action.actionName}`);
            } else if (method === 'pop') {
              this.actionDialogTitle = menu.name;
              this.actionDialogVisible = true;
              this.currentWaybillCode = model.code;
              this.currentActionCode = menu.key;
              this.currentDialogComponent = 'ele-action';
            } else {
              console.error('unknow action', command);
            }
          }
      }
    },
    refresh() {
      this.$refs.eleList.dispatchQueryEvent();
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
      Object.assign(searchParams, this.params);
      if (searchParams.waybillStatus == 'unloading' || searchParams.waybillStatus == 'going' || searchParams.waybillStatus == 'finish') {} else {
        searchParams.waybillStatus = 'unloading,going,finish';
      }

      this.exportParams = searchParams;
      console.log('query', searchParams);
      const self = this;
      this.total = 0;
      this.loading = true;
      this.listData = [];
      this.getList(searchParams, (success, error) => {
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
          this.loading = false;
          success.content.forEach((row) => {
            const actionList = [];
            // 拥有新建吊车单权限时新增操作
            if (row.craneOrderStatus !== 'dispatched' && checkPermission('crane.order.add')) {
              actionList.push({ key: 'addCraneOrder', name: '派吊车' });
            }
            actionList.push({ key: 'printDispatchBill', name: '打印派车单' });
            // 运输中和运输完成的运单，并且有查看轨迹的权限，新增查看轨迹操作
            if ((row.waybillStatus === 'going' || row.waybillStatus === 'finish') && checkPermission('waybill.historyLocation')) {
              actionList.push({ key: 'viewTrajectory', name: '查看轨迹' });
            }
            // 平台运单列表，单车结算状态不为结算通过的，新增编辑操作
            if (row.settleStatus !== 'pass') {
              actionList.push({ key: 'edit', name: '编辑' });
            }
            row.actionMenuList = actionList;
          })
          this.listData = success.content;
        }
      });
    }
  },
  created() {

    const localStorage = window.localStorage;
    this.projectName = JSON.parse(localStorage.getItem('appInfo')).projectName || '';

  },
  mounted() {
    // this.$refs.eleList.searchModel.waybillStatus = 'unloading,going,finish';
  }
};

</script>
<style lang="scss" rel="stylesheet/scss">
#waybillBrokerList {
  #miniSearch {
    .el-select {
      width: 120px;
    }
  }
}

.dialogControl {
  p.p_tit {
    text-align: center;
    margin-bottom: 20px;
    margin-top: 20px;
  }
  .el-textarea__inner {
    height: 60px !important;
  }
}

.col-bottom {
  margin-bottom: 10px;
}

.el-dialog__body {
  .complex-control-2 {
    .innerblock {
      width: 110px;
    }
  }
  .form-page .el-row .el-col-12:nth-child(6n),
  .form-page .el-row .el-col-12:nth-child(6n-1) {
    margin-bottom: 0;
    border-bottom: 0;
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
