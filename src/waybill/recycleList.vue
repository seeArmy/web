/**
* list.vue
* 运单回收站列表
* Created by zhuyi on 17/7/21.
*/
<template>
  <div>
    <ele-list :selectable="false" :operatable="true" :showImportButton="false" :showDownloadTemplate="false"
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
              :showExportButton='false'
              :downloadErrorData="downloadErrorData"
              :downloadTemplate="downloadTemplate"
              :importUrl="importUrl"
              :editUrl="editUrl"
              :getColumn="getColumn"
              :getList="getList"
              :exportCsv="exportCsv"
              :getSearch="getSearch"
              :getAction="getAction"
              :needAdd="false"
              :showCustomBtn='false'
              customBtnName="批量修改收款人"
              @customBtnClick ='customBtnClick'
              :objectName="objectName"
              :getImportColumn="getImportColumn"
              :folder="folder"
              v-if="showNow"
              >
              <!-- <span slot="topRightFun" class="recycle-bin" @click="recycleList">
                <i class="el-icon-delete2"></i> 回收站
              </span> -->
    </ele-list>
    <el-dialog :title="actionDialogTitle" :visible.sync="actionDialogVisible" size="large" :class="isMap">
      <component ref="waybillAction" :is="currentDialogComponent"
                 @success="dialogSuccess" @fail="dialogFail" @close="dialogClose"
                 :type="type" :actionType="actionType" :actionDomain="actionDomain"
                 :id="currentWaybillCode" :action="currentActionCode" :actionExecuteFun="actionExecuteFun"
                 :isDialog="true"></component>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogClose">取 消</el-button>
        <el-button type="primary" @click="dialogSubmit">确 定</el-button>
      </div>
    </el-dialog>


    <!-- 批量修改收款人的弹框 -->
    <el-dialog title="请选择收款人" :visible.sync="dialogVisible.payeeFirst" size="large" class='payee'>

      <fix-payee v-if='dialogVisible.payeeFirst' ref='fixPayee'></fix-payee>

   <!--    <el-input>123</el-input>
      <el-button @click="dialogClose">选择</el-button> -->

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible.payeeFirst = false">取 消</el-button>
        <el-button type="primary" @click="dialogSubmitPayee">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 标准版打印派车单 -->
    <pop-print-waybill ref="printWaybillDialog"></pop-print-waybill>

    <lyg-pop-print-waybill ref="lygPrintWaybillDialog"></lyg-pop-print-waybill>

    <loading-action ref="loadingActionDialog" @refresh="refresh"></loading-action>

    <el-dialog title="提示" :visible.sync="reportDialog.visiable" size="large">
      <h3 class="dialog-content-title">是否提交<b>{{reportDialog.domainObject.truckLicenseNo}}</b>的业务申报？</h3>
      <el-row class="dialog-content-section">
        <el-col :span="24">
          <label>订单号：</label>
          <span>{{reportDialog.domainObject.logisticsNo}}</span>
        </el-col>
      </el-row>
      <el-row class="dialog-content-section">
        <el-col :span="24">
          <label>委托号：</label>
          <span>{{reportDialog.domainObject.logisticsExternalNo1}}</span>
        </el-col>
      </el-row>
      <el-row class="dialog-content-section">
        <el-col :span="24">
          <label>运单号：</label>
          <span>{{reportDialog.domainObject.waybillNo}}</span>
        </el-col>
      </el-row>
      <el-row class="dialog-content-section">
        <el-col :span="12">
          <label>车牌号：</label>
          <span>{{reportDialog.domainObject.truckLicenseNo}}</span>
        </el-col>
        <el-col :span="12">
          <label>车队：</label>
          <span>{{reportDialog.domainObject.fleetOrgName}}</span>
        </el-col>
      </el-row>
      <el-row class="dialog-content-section">
        <el-col :span="12">
          <label>司机：</label>
          <span>{{reportDialog.domainObject.driverFullName}}</span>
        </el-col>
        <el-col :span="12">
          <label>手机号：</label>
          <span>{{reportDialog.domainObject.driverPhone}}</span>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="reportDialog.visiable=false">取消</el-button>
        <el-button type="primary" @click="handleReportDialogSubmit">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  // import eleList from '../components/ele-list/eleList.vue';
  import eleList from '@/components/v3/ele-table/eleList.vue';
  import { urlRedirect,checkPermission } from '../../api/Utils';
  import {recover,getColumnRecycle as getColumn, list, getSearchRecycle as getSearch, deleteList, getAction, executeAction, exportCsv, add, downloadErrorData, downloadTemplate ,getWaybillList, batchFixPayee ,getDetail, declareWaybill } from '../../api/waybillService';
  import * as ApiConst from '../../api/ApiConst';
  import eleAction from '../components/ele-action/eleAction.vue';
  import eleWaybillPopMap from '../components/ele-pop-map/eleWaybillPopMap.vue';
  import popPrintWaybill from './popPrintWaybill.vue';
  import lygPopPrintWaybill from './lygPopPrintWaybill.vue';
  import LoadingAction from './loadingAction.vue';
  import FixPayee from './fixPayee.vue';
  import '../components/vueDirectives';
  import { list as listOutsourcingWaybill } from '../../api/OutsourcingWaybillService';
  import { selfs } from '../../api/OrgService';
  const actionExcludeFilter = ['settle', 'undoSettle', 'undoPayConfirm', 'removeWaybill'];

  export default {
    name: 'waybillList',
    components: {
      'ele-list': eleList,
      'ele-waybill-pop-map': eleWaybillPopMap,
      'ele-action': eleAction,
      'pop-print-waybill': popPrintWaybill,
      'lyg-pop-print-waybill': lygPopPrintWaybill,
      'loading-action': LoadingAction,
      'fix-payee':FixPayee,
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
        'default': function () {
          return {};
        }
      },
      //是否 是被订单中引用，是，那么网路请求不一样
      isFormLogistics: {
        type: Boolean,
        'default': false
      },
      // 如果从 订单里面来，并且还是 外包订单 来的，那么网络请求需要改变，这个比上个更加权重中
      isFormLogisticsOutsourcing: {
        type: Boolean,
        'default': false
      },
    },
    data: () => {
      return {
        dialogVisible:{
          payeeFirst :false,
          modelFirst:{}
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
        objectName: '运单回收站',
        addUrl: '/waybill/add.html',
        editUrl: '/waybill/add.html',
        recycleUrl: '/waybill/recycleList.html',
        listUrl: '/waybill/list.html',
        actionUrl: 'waybill/action.html',
        deleteFun: deleteList,
        getAction,
        exportCsv,
        add,
        downloadErrorData,
        importUrl: `${ApiConst.apiWayBillDomain}/import/custom/waybill`,
        popWaybillTruckMap: true,
        permission:true,
        showImportButton: true,
        downloadTemplate,
        isMap: '',
        showNow: false,
        getImportColumn: getDetail,
        folder: 'waybill/recycle',
        showCustomBtn:false,
        reportDialog: {
          actionCode: '',
          visiable: false,
          domainObject: {},
        }
      };
    },
    methods: {
      recycleList() {
        this.openWindow(`${this.recycleUrl}`, '运单回收站列表');
      },
      handleReportDialogSubmit() {
        // truckLicenseType  01 大型车，颜色黄色，02，小型车，颜色蓝色，运单上字段名称为licensePlateTypeCode
        const truckLicenseType = this.reportDialog.domainObject.licensePlateTypeCode;
        let color = '';
        if (truckLicenseType === '01') {
          color = '黄';
        } else if (truckLicenseType === '02') {
          color = '蓝';
        } else {
          color = '其他颜色';
        }
        const params = {
           bizEventNo: 'insertIport',
           waybillNo: this.reportDialog.domainObject.waybillNo, // 运单号
           ticket: this.reportDialog.domainObject.waybillExternalNo1, // 小票号
           consign: this.reportDialog.domainObject.logisticsExternalNo1, //必填，委托号
           drivephone: this.reportDialog.domainObject.driverPhone, //必填，手机号
           truck: this.reportDialog.domainObject.truckLicenseNo + color, // 必填，车号+颜色
           amount: this.reportDialog.domainObject.loadingGoodsNum, //预装件数
           weight: this.reportDialog.domainObject.loadingGoodsWeight //预装重量
         };
        declareWaybill(params, (success, error) => {
          if (success) {
            var ret = success;
            if(ret.success) {
              this.$alert('操作成功！', '提示', {
                confirmButtonText: '确定',
                type: 'success',
                callback: () => {
                  window.location.reload();
                }
              });
            } else {
              const msg = ret.message || '调用业务申报接口报错，请联系管理员。';
              this.$alert(msg, '提示', {
                confirmButtonText: '确定',
                type: 'error',
                callback: () => {
                  window.location.reload();
                }
              });
            }
          }
          if (error) {
            this.$message({
              type: 'warning',
              message: error.message,
              duration: 3000
            });
          }
        });
      },
      // 点击收款人确认 
      dialogSubmitPayee(){
        // 拿到数据
       // let obj =  this.$refs.fixPayee.domainObject;
       // 网络请求
        this.netPayee();
      },
      // 网络请求 批量跟换 收款人
      netPayee(){
        let arr = [];
        this.listData.forEach( item =>{
          if(item.checked && item.settleStatus != 'pass'){
            arr.push(item);
          }
        })
        if(arr.length<1){
          this.$message({
                    type: 'warning',
                    message: `请选择结算未通过的运单`,
                    duration: 1000
                  });
          return;
        }
        let all_count = arr.length;
        let succ_count = 0;
        let fail_count = 0;
        for(let i=0;i<arr.length;i++){
          let obj = arr[i];
          let  params = this.$refs.fixPayee.domainObject;
          params.code = obj.code;
          this.loading = true;
        batchFixPayee(params, (success, error) => {
            if (error || success.code !== 200) {
              fail_count++;
              // this.$message({
              //   type: 'error',
              //   message: error.content,
              //   duration: 5000
              // });
              // this.loading = false;
              // return false;
            }
            if (success) {
              succ_count ++;
              // this.loading = false;
              // window.location.href = success.content.url;
            }
            if(all_count == succ_count + fail_count){
              this.dialogVisible.payeeFirst = false;
              this.loading = false;
              this.$message({
                    type: 'success',
                    message: `批量修改${all_count}条运单收款人，成功${succ_count}条，失败${fail_count}条。`,
                    duration: 3000
                  });
              setTimeout(function(){
                 window.location.reload();
               },3000)
            }
          });
        }
      },
      // 批量修改 收款人 回调按钮
      customBtnClick(){
        let arr = [];
        this.listData.forEach( item =>{
          if(item.checked && item.settleStatus != 'pass'){
            arr.push(item);
          }
        })
        if(arr.length<1){
            this.$message({
                    type: 'warning',
                    message: `请选择结算未通过的运单`,
                    duration: 1000
                  });
          return;
        }
        this.dialogVisible.payeeFirst = true;

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
          case 'edit':
            this.openWindow(`${this.editUrl}?code=${model.code}&objectName=${this.objectName}`, `编辑${this.objectName}`);
            break;
          case 'remove':
            this.doRemove(model);
            break;
          case 'bizReport':
            this.reportDialog.visiable = true;
            this.reportDialog.domainObject = model;
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
          case 'loading':
          case 'loadingInput':
            this.$refs.loadingActionDialog.open(model, command, menu.name);
            break;
          case 'unloading':
          case 'unloadingInput':
            this.$refs.loadingActionDialog.open(model, command, menu.name);
            break;
          case 'printDispatchBill':
            this.$refs.printWaybillDialog.open(model, 'waybill', 'smallticketprintstatus', model.code);
            break;
          case 'lygPrintDispatchBill':
            this.$refs.lygPrintWaybillDialog.open(model, 'waybill', 'dispatchPrintStatus', model.code);
            break;
          case 'cancel':
            this.doSubmitSettle(menu.key, menu.name, model);
            break;
          default: {
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
        if( true == this.isFormLogistics){
          this.getList = getWaybillList;
        }
        if( true == this.isFormLogisticsOutsourcing){
          this.getList = listOutsourcingWaybill;
        }
        Object.assign(searchParams, this.params, { 'deleted': true});
        searchParams.deleted = true;
        const self = this;
        this.total = 0;
        this.loading = true;
        this.listData = [];
        this.getList(searchParams, (success, error) => {
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
    },
    created() {
       this.permission = checkPermission("waybill.add");
       this.showCustomBtn = checkPermission("waybill.updatePayee");
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
.el-dialog__body {
  .complex-control-2 {
    .innerblock {
      width: 110px;
    }
  }
  .form-page .el-row .el-col-12:nth-child(6n), .form-page .el-row .el-col-12:nth-child(6n-1) {
    margin-bottom: 0;
    border-bottom: 0;
  }
  .dialog-content-title {font-size:18px; padding:20px;text-align: center;border-bottom:1px dashed #ccc;}
  .dialog-content-title b {color:red}
  .dialog-content-section {margin:10px;}
  .dialog-content-section label {display:inline-block;width:80px;}
}

.v-modal {
  z-index: 1000 !important;
}

.payee-page {
  .el-dialog--large {
    position: fixed;
    top: 0 !important;
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

