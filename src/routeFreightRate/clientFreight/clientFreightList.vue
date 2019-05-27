/**
* list.vue
* 运单列表
* Created by zhuyi on 17/7/21.
*/
<template>
  <div id="clientFreightList">
    <ele-list :selectable="selectable" :operatable="operatable" @query="query" @ready="query" @action="action" @more="more" @exportData="exportData" :total="total" :loading="loading" :list-data="listData" ref="eleList" :customColumn="customColumn" :removeCustomColumn='removeCustomColumn' :params="params" :needPage="needPage" :needMore="needMore" :isAdvanced="isAdvanced"   :importUrl="importUrl" :editUrl="editUrl" :getColumn="getColumn" :getList="getList" :getSearch="getSearch"  :showImportButton="permission && showImportButton" :needAdd="permission" :showCustomBtn='showCustomBtn' customBtnName="批量修改收款人" :showDownloadTemplate='showDownloadTemplate' :objectName="objectName"  :folder="folder" :showExportButton='false'>
    <span slot="funArea">
      <el-button @click="batchApplica" >批量申请</el-button>
    </span>
    <span slot="funArea">
      <el-button @click="batchAudit" >批量审核</el-button>
    </span>
    </ele-list>
    <!-- 申请运价弹框 start-->
    <el-dialog title="申请运价" :visible.sync="dialogVisible.apply" width="30%" center>
    <p class='underline'>客户运价单号：{{tempDomainObject.ratesSystemNo}}</p>
    <p class='text_center'>确定申请审核这笔客户运价单吗？</p>
    <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible.apply = false">取 消</el-button>
        <el-button type="primary" @click="apply()">确 定</el-button>
    </span>
    </el-dialog>
    <!-- 申请运价弹框 end-->

    <!-- 批量审核运价 start-->
    <el-dialog title="批量审核运价" :visible.sync="dialogVisible.batchApplicatio" width="30%" center class='batchApplicatioa' ref='batchApplicatio' >
    <p style='margin: 20px 0 10px;'>共选中{{checkNum}}条，您确定申请审核这些客户运价单吗？</p>
    <p style='margin-bottom: 10px;'>审核结果:  <el-radio v-model="batchApplicatio.ratesApproveStatus" label="accept">审核通过</el-radio>
                 <el-radio v-model="batchApplicatio.ratesApproveStatus" label="reject">审核不通过</el-radio></p>
    <p>审核备注:<el-input
                    type="textarea"
                    placeholder="请输入审核备注"
                    v-model="batchApplicatio.ratesApproveDescription"
                    maxlength="100"
                    show-word-limit
                    ></el-input>
                    </p>    
    <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible.batchApplicatio = false">取 消</el-button>
        <el-button type="primary" @click="batchAuditColse()">确 定</el-button>
    </span>
    </el-dialog>
    <!-- 批量审核运价 end-->

    <!-- 审核运价 start-->
    <el-dialog title="审核运价" :visible.sync="dialogVisible.check" width="30%" center class='check'>
    <p class='underline'>客户运价单号：{{tempDomainObject.ratesSystemNo}}</p>
    <p style='margin: 20px 0;'>审核结果: <el-radio v-model="checkDomainObject.ratesApproveStatus" label="accept">审核通过</el-radio>
                 <el-radio v-model="checkDomainObject.ratesApproveStatus" label="reject">审核不通过</el-radio></p>
    <p>审核备注:  <el-input
                    type="textarea"
                    placeholder="请输入审核备注"
                    v-model="checkDomainObject.ratesApproveDescription"
                    maxlength="100"
                    show-word-limit
                    ></el-input>
                    </p>             
    <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible.check = false">取 消</el-button>
        <el-button type="primary" @click="check()">确 定</el-button>
    </span>
    </el-dialog>
    <!-- 审核运价 end-->
    
    <!-- 批量审核运价 start-->
    <el-dialog title="批量审核运价" :visible.sync="centerDialogVisible" width="30%" center>
    <span>客户运价单号：{{}}</span>
    <span>确定申请审核这笔客户运价单吗？</span>
    <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
    </span>
    </el-dialog>
    <!-- 批量审核运价 end-->

    <!-- 结束运价 start-->
    <el-dialog title="结束运价" :visible.sync="dialogVisible.end" width="30%" center>
    <p class='underline'>客户运价单号：{{tempDomainObject.ratesSystemNo}}</p>
    <p class='text_center'>确定结束这笔审核通过的正常运价吗？</p>
    <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible.end = false">取 消</el-button>
        <el-button type="primary" @click="end()">确 定</el-button>
    </span>
    </el-dialog>
    <!-- 结束运价 end-->
    
     <!-- 删除运价 start-->
    <el-dialog title="删除运价" :visible.sync="dialogVisible.remove" width="30%" center>
    <p class='underline'>客户运价单号：{{tempDomainObject.ratesSystemNo}}</p>
    <p class='text_center'>确定删除这笔运价吗？</p>
    <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible.remove = false">取 消</el-button>
        <el-button type="primary" @click="remove()">确 定</el-button>
    </span>
    </el-dialog>
    <!-- 删除运价 end-->

  </div>
</template>
<script type="text/ecmascript-6">
// import eleList from '../components/ele-list/eleList.vue';
import eleList from '../../components/v3/ele-table/eleList.vue';
import { urlRedirect, checkPermission, showMessageUtil } from '../../../api/Utils';
// import { getColumn, list, getSearch, deleteList, getAction, executeAction, exportCsv, add, downloadErrorData, downloadTemplate, getWaybillList, batchFixPayee, getDetail, declareWaybill, editPrice, evaConfig, evaAdd } from '../../api/waybillService';
import { getClientFreightColumn,getClientFreightSearch,getClientFreightList,applyClientFreightList,checkClientFreightList,removeClientFreightList,endClientFreightList} from '../../../api/routeFreightRateService';
import * as ApiConst from '../../../api/ApiConst';
import eleAction from '../../components/ele-action/eleAction.vue';
import '../../components/vueDirectives';
import Decimal from "decimal.js";
import { runInThisContext } from 'vm';
import { chargeItemNumber } from '../../../api/DataSourceService';

// import rate from './rate.vue';

const actionExcludeFilter = ['settle', 'undoSettle', 'undoPayConfirm', 'removeWaybill'];

export default {
  name: 'clientFreightList',
  components: {
    'ele-list': eleList,
    'ele-action': eleAction,
    // 'rate': rate
  },
  props: {
    selectable: {
      type: Boolean,
      'default': true
    },
    showRecycle: {
      type: Boolean,
      'default': true
    },
    showBatchFixPrice: {
      type: Boolean,
      'default': true
    },
    operatable: {
      type: Boolean,
      'default': true
    },
    removeCustomColumnMark: {
      type: Boolean,
      'default': false
    },
    customColumn: Array,
    // 需要移除的 list 元素
    removeCustomColumn: {
      type: Array,
      'default': function() {
        return [];
      }
    },
    isAdvanced: {
      type: Boolean,
      'default': true
    },
    needPage: {
      type: Boolean,
      'default': true
    },
    showminiSearch: {
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
    }
  },
  computed: {
  },
  data: () => {
    return {
      showDownloadTemplate:false,
      meterageTypeTemp: undefined,
      disabledDriverPrice: false,
      dialogVisible: {
        payeeFirst: false,
        modelFirst: {}
      },
      dialogVisiblePrice: {
        visiable: false
      },
      listData: [],
      total: 0,
      loading: true,
      getColumn:getClientFreightColumn,
      actionDialogTitle: 'Dialog',
      actionDialogVisible: false,
      type: 'waybill',
      actionType: 'waybill',
      actionDomain: `${ApiConst.apiWayBillDomain}`,
    //   actionExecuteFun: executeAction,
      currentWaybillCode: '',
      currentActionCode: '',
      currentDialogComponent: '',
      getList:getClientFreightList,
      getSearch:getClientFreightSearch,
      objectName: '客户运价单',
      addUrl: '/routeFreightRate/clientFreight/clientFreightAdd.html',
      editUrl: '/routeFreightRate/clientFreight/clientFreightAdd.html',
      recycleUrl: '',
      listUrl: '',
      actionUrl: '',
      importUrl: ``,
      popWaybillTruckMap: true,
      permission: true,
      showImportButton: false,
      isMap: '',
      folder: '',
      showCustomBtn: false,
      reportDialog: {
        actionCode: '',
        visiable: false,
        domainObject: {},
      },
      rateDialog: {
        config: [],
        score: 0.0,
        description: '',
        visiable: false,
        domainObject: {}
      },
      cancelDialog: {
        visible: false,
        domainObject: {
          code: null,
          cancelReason: ''
        }
      },
      modelFixPrice: {
        options: {
          ton: [{ id: "yuanperton", name: "元/吨", value: "元/吨" }, { id: "yuanpertruck", name: "元/车", value: "元/车" }],
          cube: [{ id: "yuanpercube", name: "元/方", value: "元/方" }, { id: "yuanpertruck", name: "元/车", value: "元/车" }],
          item: [{ id: "yuanperitem", name: "元/件", value: "元/件" }, { id: "yuanpertruck", name: "元/车", value: "元/车" }]
        },
        domainObject: {
          clientFreightPrice: null,
          clientFreightPriceUnitCode: null,
          driverPrice: null,
          driverPriceUnitCode: null
        },
        fields: []
      },
      dataOrgManager: null,
      dialogVisible:{
        batchApplicatio:false,
        batchAudit:false,
        apply:false,
        check:false,
        end:false,
        remove:false
      },
      centerDialogVisible:false,
      tempDomainObject:{},
      checkNum:0,
      checkDomainObject:{
        ratesApproveStatus:null,
        ratesApproveDescription:null
      },//审核运价
      batchApplicatio:{
        ratesApproveStatus:null,
        ratesApproveDescription:null
      }
    };
  },
  methods: {
    clearData(){
      this.checkDomainObject.ratesApproveStatus = ''
      this.checkDomainObject.ratesApproveDescription = ''
      this.batchApplicatio.ratesApproveStatus = ''
      this.batchApplicatio.ratesApproveDescription = ''
    },
    //批量申请
    batchApplica(){
       const that = this,
            list = [],
            arr = [];
        this.listData.forEach((item) => {
          if (item.checked ) {
            list.push(item.code);
            if(item.ratesApproveStatus === 'pend' || item.ratesApproveStatus === 'accept' || item.ratesApproveStatus === 'end'){
              arr.push(item.ratesApproveStatus);
            }
          }   
        });
        if (!list.length) {
          this.$message({
            type: 'warning',
            message: '请选择待申请的运价单',
            duration: 1000
          });
          return;
        }
        if (arr.length > 0 ) {
          this.$message({
            type: 'warning',
            message: '请选择申请未通过的客户运价单！',
            duration: 1000
          });
          return;
        }
        this.$msgbox({
          title: '批量申请运价',
          message: `共选中${list.length}条，确定申请这些客户运价单吗?`,
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '执行中...';
              that.batchApplyNum = list.length;
              list.forEach((item) => {item
                applyClientFreightList({code:item}, (success, error) => {
                  that.batchApplyNum -= 1;
                  if (that.batchApplyNum === 0) {
                    this.$message({
                      type: 'success',
                      message: '批量提交成功',
                      duration: 1000
                    });
                    instance.confirmButtonLoading = false;
                    done();
                    this.$refs.eleList.dispatchQueryEvent();
                  }
                });
              });
            } else {
              done();
            }
          }
        });
        // this.dialogVisible.batchApplicatio=true;
    },
    //批量审核
    batchAudit(){
      this.clearData();
      this.checkNum=0
      const that = this,
            list = [],
            arr = [];
        this.listData.forEach((item) => {
          if (item.checked ) {
            list.push(item.code);
            that.checkNum++;
             if(item.ratesApproveStatus != 'pend' ){
              arr.push(item.ratesApproveStatus);
            }
          }  
        });
        if (!list.length) {
          this.$message({
            type: 'warning',
            message: '请选择待审核的运价单',
            duration: 1000
          });
          return;
        }
        if (arr.length > 0 ) {
          this.$message({
            type: 'warning',
            message: '请选择审核未通过的客户运价单',
            duration: 1000
          });
          return;
        }
        this.dialogVisible.batchApplicatio=true;  
    },
    batchAuditColse(){
      if(!this.batchApplicatio.ratesApproveStatus)  {
        showMessageUtil('warning', `请填写审核结果`, 2000)
          return false;
        }  
      this.checkNum=0
      const that = this,
          list = [];
        this.listData.forEach((item) => {
          if (item.checked ) {
            list.push(item.code);
            that.checkNum++;
          }
        });
        that.batchApplyNum = list.length;
        list.forEach((item) => {
          const params ={};
                params.code = item;
                params.ratesApproveStatus = that.batchApplicatio.ratesApproveStatus;
                params.ratesApproveDescription = that.batchApplicatio.ratesApproveDescription;
          checkClientFreightList(params, (success, error) => {
            that.batchApplyNum -= 1;
            if (that.batchApplyNum === 0) {
              this.$message({
                type: 'success',
                message: '批量提交审核成功',
                duration: 1000
              });
              that.$refs.eleList.dispatchQueryEvent();
            }
          });
        });
        this.dialogVisible.batchApplicatio=false;  
    },
    // 申请运价apply
    apply(){
        applyClientFreightList({code:this.tempDomainObject.code},(success, error) => {
          if (success &&success.code == 200) {
            this.$message({
              type: 'success',
              message: '提交申请成功',
              duration: 1000
            });
            this.$refs.eleList.dispatchQueryEvent();
          }else{
            this.$message({
              type: 'success',
              message: success.content,
              duration: 1000
            });
          }
        });
          this.dialogVisible.apply = false;
    },
    //审核运价
    check(){
      if(!this.checkDomainObject.ratesApproveStatus)  {
        showMessageUtil('warning', `请填写审核结果`, 2000)
        return; 
      } 
      const params = {};
            params.code = this.tempDomainObject.code;
            params.ratesApproveStatus = this.checkDomainObject.ratesApproveStatus;
            params.ratesApproveDescription = this.checkDomainObject.ratesApproveDescription;
      checkClientFreightList(params,(success, error) => {
        if (success && success.code==200) {
          this.$message({
            type: 'success',
            message: '提交审核成功',
            duration: 1000
          });
            this.$refs.eleList.dispatchQueryEvent();
          }else{
            this.$message({
              type: 'success',
              message: success.content,
              duration: 1000
            });
          }
      });
        this.dialogVisible.check = false;
    },
    //结束运价
    end(){
        endClientFreightList({code:this.tempDomainObject.code},(success, error) => {
          if (success && success.code ==200) {
            this.$message({
              type: 'success',
              message: '提交结束成功',
              duration: 1000
            });
            this.$refs.eleList.dispatchQueryEvent();
          }else{
            this.$message({
              type: 'success',
              message: success.content,
              duration: 1000
            });
          }
        });
        this.dialogVisible.end = false;
    },
    //删除运价
    remove(){
        removeClientFreightList({code:this.tempDomainObject.code},(success, error) => {
          if (success && success.code==200) {
            this.$message({
              type: 'success',
              message: '提交删除成功',
              duration: 1000
            });
            this.$refs.eleList.dispatchQueryEvent();
          }else{
            this.$message({
              type: 'success',
              message: success.content,
              duration: 1000
            });
          }  
        });
        this.dialogVisible.remove = false;
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
    doCancel() {
      const self = this;
      this.$msgbox({
        title: '确认',
        message: `确认要取消运单吗？`,
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          self.cancelDialog.visible = false;
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = '执行中...';
            executeAction(self.cancelDialog.domainObject.code, 'cancel', { 'cancelReason': self.cancelDialog.domainObject.cancelReason }, null, (success, error) => {
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
          console.log(`${this.editUrl}?objectName=${this.objectName}`, `新建${this.objectName}`)
          this.openWindow(`${this.editUrl}?objectName=${this.objectName}`, `新建${this.objectName}`);
          break;
        case 'apply':
          this.dialogVisible.apply = true;
          this.tempDomainObject = model;
          console.log('this.tempDomainObject',this.tempDomainObject)
          break;
        case 'remove':
          this.dialogVisible.remove = true;
          this.tempDomainObject = model;
          break;
        case 'check':
          this.dialogVisible.check = true;
          this.tempDomainObject = model;
          this.clearData();
        break;
        case 'end':
          this.dialogVisible.end = true;
          this.tempDomainObject = model;
        break;
        case 'edit':
            console.log(`${this.editUrl}?code=${model.code}&objectName=${this.objectName}`, `编辑${this.objectName}`)
           this.openWindow(`${this.editUrl}?code=${model.code}&objectName=${this.objectName}`, `编辑${this.objectName}`);
        break;
        case 'copyNew':
           // this.openWindow(`${this.editUrl}?code=${model.code}&objectName=${this.objectName}&copy=true`, `复制新建${this.objectName}`);
           this.openWindow(`${this.editUrl}?originalCode=${model.code}&objectName=${this.objectName}`, `复制新建${this.objectName}`);

           
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
    dealWithBsicInfoForHanNeng() {
      if (this.removeCustomColumnMark) { return };
        this.removeCustomColumn.push('clientFreightPrice');
    },
    dealWithFixPrice() {

      let self = this;

      const appInfo = JSON.parse(localStorage.getItem('appInfo'));
      if (appInfo.priceMode == 'auto') {
        this.disabledDriverPrice = true;
      }

      // 司机运价 可能是跟随着 客户运价 变动 而 变动
      //监听客户运价   ,计算数据
      this.$watch(`modelFixPrice.domainObject.clientFreightPrice`, (val) => {
        this.dealWithClientFreightPrice();
      })

      this.$watch(`modelFixPrice.domainObject.clientFreightPriceUnitCode`, (val) => {
        if (!self.dataOrgManager) {
          return;
        }
        // 单位联动
        self.modelFixPrice.domainObject.driverPriceUnitCode = self.modelFixPrice.domainObject.clientFreightPriceUnitCode;
      })

    },
    netGetOrgManager(platformClientOrgCode, cb) {
      this.dataOrgManager = null;
      if (!platformClientOrgCode) {
        this.$message({
          type: 'warning',
          message: '该客户数据出错！',
          duration: 3000
        });
        return;
      }
      getOrgManager({ code: platformClientOrgCode }, (success, error) => {
        if (success) {
          this.dataOrgManager = success.content;
          cb(true);
        }
        if (error) {
          this.$message({
            type: 'error',
            message: error.content,
            duration: 3000
          });
          cb(false)
        }
      });
    },
    dealWithClientFreightPrice() {
      if (!this.dataOrgManager) {
        return;
      }
      if (this.dataOrgManager.settleTradingConfigUnitCode == '%') {
        let num = Decimal(this.dataOrgManager.settleTradingConfigValue).div(100).toNumber();
        let num1 = Decimal(1).sub(num).toNumber();
        let finNum = Decimal(this.modelFixPrice.domainObject.clientFreightPrice).mul(Decimal(num1)).toNumber();
        this.modelFixPrice.domainObject.driverPrice = Math.floor(finNum * 100) / 100;
      } else if (this.dataOrgManager.settleTradingConfigUnitCode == 'yuan') {
        let finNum = this.modelFixPrice.domainObject.clientFreightPrice - this.dataOrgManager.settleTradingConfigValue;
        this.modelFixPrice.domainObject.driverPrice = Math.floor(finNum * 100) / 100;
      }
    },
    query(searchParams) {
      console.log('searchParams', searchParams);
        Object.assign(searchParams, this.params);
        console.log('query', searchParams);
        const self = this;
        this.total = 0;
        this.loading = true;
        this.listData = [];
        getClientFreightList(searchParams, (success, error) => {
          if (error) {
            this.$message({
              type: 'error',
              message: error.content,
              duration: 5000
            });
          }
          if (success) {
            success.content.forEach((item)=>{
              switch(item.ratesApproveStatus){
                case 'ready':
                  item.actionMenuList = [{key:'apply',name:'申请'},{key:'edit',name:'编辑'},{key:'copyNew',name:'复制新建'},{key:'remove',name:'删除'}];
                break
                case 'pend':
                  item.actionMenuList = [{key:'check',name:'审核'},{key:'copyNew',name:'复制新建'}];
                break
                case 'accept':
                  item.actionMenuList = [{key:'copyNew',name:'复制新建'},{key:'end',name:'结束'}];
                break
                case 'reject':
                  item.actionMenuList = [{key:'apply',name:'申请'},{key:'edit',name:'编辑'},{key:'copyNew',name:'复制新建'},{key:'remove',name:'删除'}];
                break
                case 'end':
                  item.actionMenuList = [{key:'copyNew',name:'复制新建'},{key:'remove',name:'删除'}];
                break
              }
            })
            this.total = success.total;
            self.listData = success.content;
            this.loading = false;
          }
        });
    },
 
  },
  mounted() {

  },
  created() {
    // this.permission = checkPermission("waybill.add");
    // this.showCustomBtn = checkPermission("waybill.updatePayee");
    // this.dealWithBsicInfoForHanNeng();
    // this.dealWithFixPrice();
  }
};

</script>
<style lang="scss" rel="stylesheet/scss">
#rateSection {
  .el-dialog--large {
    width: 90%;
    margin-left: -45% !important;
  }

  .dialog-content-section {
    height: 286px;
    margin: 0;
    background-color: #f5f5f5;
  }

  .el-col-10 {
    height: 286px;
    padding: 10px;
    border-right: solid 1px #ddd;
  }

  .el-col-14 {
    height: 286px;
    padding: 10px;
    background-color: #fff;
  }

  .tit {
    font-weight: 700;
  }

  .text-list {
    margin-top: 20px;

    li {
      margin-bottom: 15px;
    }

    .tl-tit {
      display: inline-block;
      vertical-align: middle;
      width: 80px;
    }

    .tl-cont {
      display: inline-block;
      vertical-align: middle;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .rate-wrap {
    margin: 10px 0;
    padding-bottom: 10px;
    border-bottom: dashed 1px #ddd;
  }

  .rate-list {
    li {
      &:last-child {
        margin-bottom: 0;
      }

      margin-bottom: 20px;
      line-height: 20px;

      .rl-tit {
        float: left;
        margin-left: -80px;
      }

      position: relative;
      padding-left: 80px;

      .tip {
        position: absolute;
        top: 0;
        left: 240px;
        color: #999;
        font-size: 12px;
      }
    }

    .rl-text {
      margin-top: -10px;
    }
  }
}

#clientFreightList {
  //修改弹框样式
  .el-dialog--small{
    width: 40%;
  }
  .el-dialog__body{
    height: 140px;
  }
  .underline{
    border-bottom: 1px dashed #ccc;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }
  .text_center{
    text-align: center;
    padding-top: 30px;
  }
  .check{
    .el-dialog__body{
      .el-textarea{
        width: 80%;
        vertical-align: middle;
      }
    }
  }
  .batchApplicatioa{
    .el-dialog__body{
      .el-textarea{
        width: 80%;
        vertical-align: middle;
      }
    }
  }
  .fix_price_dialog {
    .dia_item {
      .el-input {
        width: 100px !important;
      }
    }
  }

  .el-dialog--large {
    transform: none;
    margin-left: -35%;
  }

  .remark {
    margin-left: 10px;
    margin-top: 30px;

  }

  .ishn .loading-action {
    .el-col-auto .el-form-item__label:before {
      content: '*';
      display: inline-block;
      margin-right: 5px;
      line-height: 22px;
      color: red;
    }
  }

  .show_icon_request {
    .el-form-item__label:before {
      content: '*';
      display: inline-block;
      margin-right: 5px;
      line-height: 22px;
      color: red;
    }
  }

  .txtbox {
    width: auto;
  }

  .remark-txtbox {
    padding: 10px;
    vertical-align: middle;
    width: 553px;
    height: 72px;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
    margin: 0;
  }
}

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

  .dialog-content-title {
    font-size: 18px;
    padding: 20px;
    text-align: center;
    border-bottom: 1px dashed #ccc;
  }

  .dialog-content-title b {
    color: red
  }

  .dialog-content-section {
    margin: 10px;
  }

  .rate-description .el-textarea__inner {
    width: 90%;
    height: 48px;
  }

  .dialog-content-section label {
    display: inline-block;
    width: 80px;
  }
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

@media (min-width: 1400px) {
  #rateSection {
    .el-dialog--large {
      width: 70%;
      margin-left: -35% !important;
    }

    .tip {
      left: 300px !important;
    }

  }
}

</style>
