/** * list.vue * 单项付款审核列表 * Created by zhuyi on 17/7/21. */
<template>
  <div>
    <ele-list :selectable="selectable" :operatable="operatable" :showExportButton="showExportButton" @query="query" @ready="onReady" @action="action" @more="more" @exportData="exportData" :total="total" :loading="loading" :list-data="listData" ref="eleList" :customColumn="customColumn" :params="params" :needPage="needPage" :needMore="needMore" :needAdd="false" :showDownloadTemplate="false" :showImportButton="false" :isAdvanced="isAdvanced" :deleteFun="deleteFun" :add="add" :downloadErrorData="downloadErrorData" :downloadTemplate="downloadTemplate" :importUrl="importUrl" :editUrl="editUrl" :getColumn="getColumn" :getList="getList" :exportCsv="exportCsv" :getSearch="getSearch" :getAction="getAction" :objectName="objectName" :exportParams='exportParams'>
      <template slot="funArea">
        <!-- <el-button v-if="pageStatus == 'apply'" type="default" @click="batchApply">批量申请</el-button> -->
      </template>
    </ele-list>
      <!-- commonOpr dialog -->
    <commonOpr ref="commonOpr" :domainObject="domainObject" @refresh="handleRefresh"></commonOpr>

    <el-dialog :title="actionDialogTitle" :visible.sync="actionDialogVisible" size="large">
      <component ref="waybillAction" :is="currentDialogComponent" @success="dialogSuccess" @fail="dialogFail" @close="dialogClose" :type="type" :actionType="actionType" :actionDomain="actionDomain" :id="currentWaybillCode" :action="currentActionCode" :actionExecuteFun="actionExecuteFun" :isDialog="true"></component>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogClose">取 消</el-button>
        <el-button type="primary" @click="dialogSubmit">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="单车付款审核提示" :visible.sync="payDialog.visible" v-if="payDialog.visible" size="small" class="pay-dialog" :close="closePayDialog">
      <!-- <h3>审核<b>{{payDialog.model.truckLicenseNo}}</b>单车付款</h3> -->
      <el-row>
        <el-col :span="12">
          运单号：{{payDialog.model.waybillNo}}
        </el-col>
        <el-col :span="12">
          车牌号：{{payDialog.model.truckLicenseNo}}
        </el-col>
        <el-col :span="12">
          关联付款单：{{payDialog.model.paybillNo}}
        </el-col>
        <el-col :span="12">
          付款状态：{{payDialog.model.waybillNo}}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          费用名称：{{payDialog.model.chargeItemName}}
        </el-col>
        <el-col :span="24">
          数量：{{payDialog.model.chargeItemNumberExpression  }}
        </el-col>
        <el-col :span="24">
          单价：{{payDialog.model.chargeItemPriceExpression  }}
        </el-col>
        <el-col :span="24">
          金额：{{payDialog.model.chargeItemAmountsExpression}}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          审核结果：
          <el-radio label="accept" v-model="payDialog.approveResult">审核通过</el-radio>
          <el-radio label="reject" v-model="payDialog.approveResult">审核未通过</el-radio>
        </el-col>
        <el-col :span="24">
          审核备注：
          <el-input type="text" v-model="payDialog.comment" style="width:300px" />
        </el-col>
        <el-col :span="24" v-if="payDialog.showTip">
          <p><b class="red">{{ payDialog.showMessage }}</b></p>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closePayDialog">取消</el-button>
        <el-button @click="approvePay" :disabled="dialogActionDisable">确定</el-button>
      </span>
    </el-dialog>
    <!-- 司机申请付款列表 -->
    <el-dialog title="单车付款申请提示" :visible.sync="dialogApply.visible" size="small" class="pay-dialog" :close="closePayDialog">
      <template v-if=dialogApply.listBatch.length>
        <el-row>
          <el-col :span="24">
            您共申请了{{dialogApply.listBatch.length}}个
          </el-col>
        </el-row>
      </template>
      <template v-else>
        <el-row>
          <el-col :span="12">
            车牌号：<span class="text_light">{{dialogApply.model.truckLicenseNo}}</span>
          </el-col>
          <el-col :span="12">
            调车模式：<span class="text_light">{{dialogApply.model.scheduleType == 'platform' ? '委托调车' :'自助调车'}}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            运单号：{{dialogApply.model.waybillNo}}
          </el-col>
          <el-col :span="12">
            <span class="link" @click='gotoPageWaybillSettle(dialogApply.model)'>查看单车结算</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            应付司机劳务费：&yen{{dialogApply.model.settleDriverRealPayment}}
          </el-col>
          <el-col :span="12">
            交易费：{{dialogApply.model.settleTradingConfigAmount}}
          </el-col>
        </el-row>
      </template>
      <p class="p_middle">确定申请该笔单车付款吗？</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closePayDialog">取消</el-button>
        <el-button @click="netApply" :disabled="dialogActionDisable">确定</el-button>
      </span>
    </el-dialog>
    <!-- 打回弹框 -->
    <el-dialog title="司机付款打回提示" :visible.sync="dialogRevocation.visible" size="small" class="pay-dialog" :close="closePayDialog">
      <el-row>
        <el-col :span="24">
          打回备注：
          <el-input type="text" v-model="dialogRevocation.comment" style="width:300px" />
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closePayDialog">取消</el-button>
        <el-button @click="netRevocation" :disabled="dialogActionDisable">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script type="text/ecmascript-6">
import eleList from '../components/ele-list/eleList.vue';
import { urlRedirect, getParamsFromURL } from '../../api/Utils';
import {
  getColumn,
  list,
  getSearch,
  deleteList,
  getAction,
  executeAction,
  exportPaybill as exportCsv,
  add,
  downloadErrorData,
  downloadTemplate,
  approvePaybill,
  getSearchApproveApply,
  getSearchApproveAudit,
  getColumnApprove,
  createUploadWaybill,
  revocationPaybill,
  applyWaybill,
  getSearchItemPaybillApply,
  getColumnSeItemPaybillApply,
  getSearchItemPaybillAudit,
  getColumnSeItemPaybillAudit
} from '../../api/PaybillService';
import { list as waybillList, getChargeItem } from '../../api/waybillService';
import * as ApiConst from '../../api/ApiConst';
import eleAction from '../components/ele-action/eleAction.vue';
import eleWaybillPopMap from '../components/ele-pop-map/eleWaybillPopMap.vue';
// 接口换新的
import { settleList } from '../../api/waybillService';
import commonOpr from '../waybill/chargeDialog/commonOpr.vue';
// pageStatus : 
// apply 单项付款申请列表
// audit 单项付款审核列表  paybillPayType ： self 自助  platform 平台委托
// 默认配置为 pageStatus = apply 单项付款申请列表
const pageStatus = getParamsFromURL(window.location.search).status;
const paybillPayType = getParamsFromURL(window.location.search).paybillPayType;

export default {
  name: 'waybillList',
  components: {
    commonOpr,
    'ele-list': eleList,
    'ele-waybill-pop-map': eleWaybillPopMap,
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
  data: () => {
    return {
      domainObject:{},
      exportParams: null,
      dialogActionDisable: false,
      payDialog: {
        visible: false,
        model: {},
        comment: '',
        approveResult: '',
        showTip: false,
        showMessage: ''
      },
      dialogApply: {
        visible: false,
        model: {},
        comment: '',
        approveResult: '',
        listBatch: []
      },
      //打回弹框
      dialogRevocation: {
        visible: false,
        model: {},
        comment: '',
      },
      listData: [],
      total: 0,
      loading: true,
      getColumn: getColumnSeItemPaybillApply,
      actionDialogTitle: 'Dialog',
      actionDialogVisible: false,
      type: 'paybill',
      actionType: 'paybill',
      actionDomain: `${ApiConst.apiWayBillDomain}`,
      actionExecuteFun: executeAction,
      currentWaybillCode: '',
      currentActionCode: '',
      currentDialogComponent: '',
      getList: list,
      getSearch: getSearchItemPaybillApply,
      objectName: '',
      addUrl: '/paybill/add.html',
      editUrl: '/paybill/add.html',
      listUrl: '/paybill/list.html',
      actionUrl: 'paybill/action.html',
      deleteFun: deleteList,
      getAction,
      exportCsv,
      add,
      downloadErrorData,
      importUrl: `${ApiConst.apiWayBillDomain}/import/custom/paybill`,
      popWaybillTruckMap: true,
      downloadTemplate,
      showExportButton: true,
      pageStatus,
    };
  },
  methods: {

    payAudit(model) {
      this.payDialog.showTip = false;
      this.payDialog.showMessage = '';
      console.log('open audit now and model is', model);
      if (model.platformTruckCode && model.platformDriverCode && model.loadingGoodsWeight && model.unloadingGoodsWeight) {
        const paramsObj = {
          platformTruckCode: model.platformTruckCode,
          platformDriverCode: model.platformDriverCode,
          loadingGoodsWeight: model.loadingGoodsWeight,
          unloadingGoodsWeight: model.unloadingGoodsWeight,
          size: 1,
          page: 1
        };
        waybillList(paramsObj, (success, error) => {
          if (success && success.total && success.total > 1) {
            this.payDialog.showTip = true;
            this.payDialog.showMessage = '（注：已有相似运单，请确认后再审核。）';
          }
        });
      }
    },
    // 批量申请
    batchApply() {
      this.dialogApply.listBatch = [];
      let list = [];
      this.listData.forEach(item => {
        if (item.checked && (item.settlePaymentApproveStatus == 'ready' || item.settlePaymentApproveStatus == 'reject')) {
          list.push(item);
        }
      })
      if (list.length < 1) {
        this.$message({
          type: 'warning',
          message: `请选择符合条件的选项`,
          duration: 1000
        });
        return;
      } else {
        this.dialogApply.listBatch = list;
        this.dialogApply.visible = true;
      }
    },
    onReady() {},
    closePayDialog() {
      this.payDialog.visible = false;
      this.payDialog.model = {};
      this.payDialog.comment = '';
      this.payDialog.approveResult = '';
      this.payDialog.showTip = false;
      this.payDialog.showMessage = '';

      this.dialogRevocation.visible = false;
      this.dialogRevocation.model = {};
      this.dialogRevocation.comment = '';


      this.dialogApply.visible = false;
      this.payDialog.model = {};

    },
    approvePay() {
      let self = this;
      if (this.payDialog.approveResult == '') {
        alert('请选择审核结果');
        return false;
      }
      this.dialogActionDisable = true;
      approvePaybill(this.payDialog.model.code, {
        code: this.payDialog.model.code,
        paybillApproveStatus: this.payDialog.approveResult,
        paybillApproveDescription: this.payDialog.comment
      }, (data, err) => {
        this.dialogActionDisable = false;
        if (data) {
          this.closePayDialog();
          this.$message.success("操作成功");
          // window.location.reload();
          self.$refs.eleList.dispatchQueryEventSavePage(); //保留页数
        } else {
          if (err.content) {
            this.$message.error("操作失败：" + err.content);
          } else {
            this.$message.error("操作失败");
          }
        }
      })
    },
    //申请付款
    netApply() {
      if (this.dialogApply.listBatch.length > 0) { // 代表是批量
        this.dialogApply.visible = false;
        let numAll = this.dialogApply.listBatch.length;
        let numSuccess = 0;
        let numFail = 0;
        for (let i = 0; i < numAll; i++) {
          let item = this.dialogApply.listBatch[i];
          applyWaybill(item.code, (success, error) => {
            if (error) {
              numFail++;
            }
            if (success && success.code === 200) {
              numSuccess++;
              // 重新加载
            }
            if (numAll == numFail + numSuccess) {
              this.$message({
                type: 'warning',
                message: `共请求了${numAll}条数据，成功了${numSuccess}条数据,失败了${numFail}条数据`,
                duration: 5000
              });
              setTimeout(() => {
                window.location.reload();
              }, 5000)
            }
          })
        }
      } else { // 单个
        if (!this.dialogApply.model.code) {
          return;
        }
        this.dialogApply.visible = false;
        applyWaybill(this.dialogApply.model.code, (success, error) => {
          if (error) {
            this.$message({
              type: 'error',
              message: err.content,
              duration: 5000
            });
          }
          if (success && success.code === 200) {
            // 重新加载
            window.location.reload();
          }
        })
      }
    },
    // 打回网络请求
    netRevocation() {
      if (this.dialogRevocation.comment == '') {
        alert('请填写备注');
        return false;
      }
      this.dialogActionDisable = true;
      revocationPaybill(this.dialogRevocation.model.code, {
        code: this.dialogRevocation.model.code,
        paybillApproveDescription: this.dialogRevocation.comment
      }, (data, err) => {
        this.dialogActionDisable = false;
        if (data) {
          this.closePayDialog();
          this.$message.success("操作成功");
          window.location.reload();
        } else {
          if (err.content) {
            this.$message.error("操作失败：" + err.content);
          } else {
            this.$message.error("操作失败");
          }
        }
      })
    },
    openWindow(url, title) {
      urlRedirect(url, title);
    },
    more(model) {
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
        message: `确认要删除${this.objectName}吗？`,
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
    netGetChargeItem(command, menu, model){
      
      // let parm = {code:model.chargeItemCode};

      getChargeItem(model.chargeItemCode,(success,error)=>{
        if(success && success.content){
          this.doModifyRow(command, menu, model,success.content);
          console.log('------------  success.content',success.content);
        }
      })
    },

    doModifyRow(command, menu, model,content){
      let obj = content;
       delete content.code;
       delete content.chargeAmounts;
      let obj_data = Object.assign(obj,model),
      editableFields = [];
      const keyFields = [{ 'chargeItemNumberResource': 'chargeItemNumber' }, { 'chargeItemPriceResource': 'chargeItemPrice' }, { 'chargeItemAmountsResource': 'chargeAmounts' }];

      keyFields.forEach(item=>{
        Object.keys(item).forEach(k=>{
          if(obj_data[k] && obj_data[k] === 'input'){
            editableFields.push(item[k]);
          }
        })
      })
      let checkRule = '',
      checkMsg = ''
      // 处理列表校验
      if ('chargeItemAmountsPrecision' in obj_data) {
        let v = obj_data.chargeItemAmountsPrecision;
        switch(v) {
          case 0:
            checkRule = '[0-9]{1,10}';
            checkMsg = '请输入不超过15位的整数';
            break;
          case 1:
            checkRule = '[0-9]{1,10}(\\.[0-9]{0,1})?';
            checkMsg = '不超过15位（最多1位小数）';
            break;
          case 2:
            checkRule = '[0-9]{1,10}(\\.[0-9]{0,2})?';
            checkMsg = '不超过15位（最多2位小数）';
            break;
        }
      }
      this.$refs.commonOpr.open(command, obj_data, 0, '修改', editableFields,checkRule,checkMsg);

    },
    toParameterArray(model) {
      const params = [];
      Object.keys(model).forEach((key) => {
        params.push(`${key}=${encodeURIComponent(model[key])}`);
      });
      return params;
    },
    action(command, menu, model) {
      this.domainObject = model;
      console.log('action command', command, 'menu', menu, 'model', model);

      let obj = {};

      let obj_data = Object.assign(model,obj),
      editableFields = [];
      const keyFields = [{ 'chargeItemNumberResource': 'chargeItemNumber' }, { 'chargeItemPriceResource': 'chargeItemPrice' }, { 'chargeItemAmountsResource': 'chargeAmounts' }];

      keyFields.forEach(item=>{
        Object.keys(item).forEach(k=>{
          if(obj_data[k] && obj_data[k] === 'input'){
            editableFields.push(item[k]);
          }
        })
      })

      let checkRule = '',
      checkMsg = ''
      // 处理列表校验
      if ('chargeItemAmountsPrecision' in obj_data) {
        let v = obj_data.chargeItemAmountsPrecision;
        switch(v) {
          case 0:
            checkRule = '[0-9]{1,10}';
            checkMsg = '请输入不超过15位的整数';
            break;
          case 1:
            checkRule = '[0-9]{1,10}(\\\\.[0-9]{0,1})?';
            checkMsg = '不超过15位（最多1位小数）';
            break;
          case 2:
            checkRule = '[0-9]{1,10}(\\\\.[0-9]{0,2})?';
            checkMsg = '不超过15位（最多2位小数）';
            break;
        }
      }

      switch (command) {
        case 'applyRow':
          this.$refs.commonOpr.open(command, obj_data, 0, '申请支付');
          break;
        case 'modifyRow':
          this.netGetChargeItem(command, menu, model);
          // this.$refs.commonOpr.open(command, obj_data, 0, '修改', editableFields,checkRule,checkMsg);
          break;
        case 'auditRow':
          this.$refs.commonOpr.open(command, obj_data, 0, '审核支付');
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
        case 'map':
          this.actionDialogTitle = menu.name;
          this.actionDialogVisible = true;
          this.currentWaybillCode = model.code;
          this.currentActionCode = menu.key;
          this.currentDialogComponent = 'ele-waybill-pop-map';
          break;
          // 点击审核 
        case 'approve':
          this.payAudit(model);
          this.payDialog.model = model;
          this.payDialog.visible = true;
          break;
          // 点击打回
        case 'revocation':
          this.dialogRevocation.model = model;
          this.dialogRevocation.visible = true;
          this.initPayDialog();
          break;
        case 'viewSettle':
          this.openWindow(`/waybill/settle.html?code=${model.code}&editable=false&objectName=单车结算`, `单车结算详情`);
          break;
          // 申请中 的申请 操作
        case 'apply':
          this.dialogApply.visible = true;
          this.dialogApply.model = model;
          this.dialogApply.listBatch = [];
          break;
        default:
          this.actionDialogTitle = menu.name;
          this.actionDialogVisible = true;
          this.currentWaybillCode = model.code;
          this.currentActionCode = menu.key;
          this.currentDialogComponent = 'ele-action';
          break;
      }
    },
    gotoPageWaybillSettle(model) {
      if (model && model.code) {
        this.openWindow(`/waybill/settle.html?code=${model.code}&editable=false&objectName=单车结算`, `单车结算详情`);
      }
    },
    // 弹框出现之前，分情况初始化 一些数据
    initPayDialog() {
      this.dialogRevocation.comment = "";
    },
    exportData(searchParams) {
      searchParams = this.handelSearchParams(searchParams);
      const dataTotal = this.total;
      if (dataTotal > 10000) {
        this.$message({
          type: 'warning',
          message: '导出条数超过10000条限制，不可导出！',
          duration: 3000
        });
      } else {
        this.loading = true;
        searchParams.size = dataTotal;
        this.getColumn((success) => {
          const paramsObj = {
            params: searchParams,
            configList: success.content
          };
          // paramsObj["params"].obj = 'ioSummary';
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
    handelSearchParams(searchParams, type) {
      if (type == 'query') {
        Object.assign(searchParams, this.params);
      }
      searchParams['paybillType'] = 'item';
      if (pageStatus == 'apply') {
        // if(!searchParams['paybillApproveStatus']){
        //   searchParams['paybillApproveStatus'] = 'ready';
        // }
      } else if('audit' == pageStatus) {
        if(!searchParams['paybillApproveStatus']){
             searchParams['paybillApproveStatus'] = 'pend';
           }
          if('self' == paybillPayType){
           searchParams['paybillPayType'] = 'self';
          }else if('platform' == paybillPayType){
            searchParams['paybillPayType'] = 'platform';
          }
      }
      return searchParams;
    },
    // 配置相关
    handleConfig(){
      // pageStatus : 
      // apply 单项付款申请列表
      // audit 单项付款审核列表  paybillPayType ： self 自助  platform 平台委托
      // 默认配置为 pageStatus = apply 单项付款申请列表
        if('apply' == pageStatus){
          this.getSearch = getSearchItemPaybillApply;
          this.getColumn = getColumnSeItemPaybillApply;
          this.objectName = '单项付款申请';

        }else if('audit' == pageStatus){
          this.getSearch = getSearchItemPaybillAudit;
          this.getColumn = getColumnSeItemPaybillAudit;

          if('self' == paybillPayType){
            this.objectName = '单项付款审核';
          }else if('platform' == paybillPayType){
            this.objectName = '单项付款审核';
          }
        }
    },
    init(){
      this.handleConfig();
    },
    handleRefresh(){
      this.$refs.eleList.dispatchQueryEventSavePage(); //保留页数
    },
    query(searchParams) {
      const self = this;
      this.total = 0;
      this.loading = true;
      this.listData = [];
      searchParams = this.handelSearchParams(searchParams, 'query');
      this.exportParams = searchParams;
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
          success.content.forEach((row) => {
            const actionList = [];
            const st = row.paybillApproveStatus;

            // actionList.push({ key: 'applyRow', name: '申请' });
            // actionList.push({ key: 'modifyRow', name: '修改' });
            // actionList.push({ key: 'auditRow', name: '审核' });

            if (pageStatus == 'apply') {
                // 审核状态为 拒绝的时候 不加任何操作 需求 772
                if(st == 'ready'){
                  actionList.push({ key: 'applyRow', name: '申请' });
                  actionList.push({ key: 'modifyRow', name: '修改' });
                }
            }
            if (pageStatus == 'audit') {
                if(st == 'pend'){
                  actionList.push({ key: 'auditRow', name: '审核' });
                }
            }
            row.actionMenuList = actionList;
          });
          self.listData = success.content;
          this.loading = false;
        }
      });
    }
  },
  created() {
    this.init();
  },
  mounted() {
    if (pageStatus == 'apply') {
      // this.$refs.eleList.searchModel.paybillApproveStatus = 'ready';
    } else {
      this.$refs.eleList.searchModel.paybillApproveStatus = 'pend';
    }
    this.$nextTick(() => {
      this.$refs.eleList.dispatchQueryEvent();
    });
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

  .form-page .el-row .el-col-12:nth-child(6n),
  .form-page .el-row .el-col-12:nth-child(6n-1) {
    margin-bottom: 0;
    border-bottom: 0;
  }
}

.pay-dialog h3 {
  font-size: 18px;
  text-align: center;
  margin: 20px 0px;
}

.pay-dialog h3 b {
  color: red;
}

.pay-dialog .el-col {
  padding: 10px;
}

.pay-dialog {
  .text_light {
    color: #f48400;
  }

  p.p_middle {
    text-align: center;
    padding-top: 20px; // border-top: 1px solid #efefef;
  }

  .link {
    color: #0178be;
    cursor: pointer;
  }
}

</style>
