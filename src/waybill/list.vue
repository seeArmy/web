/**
* list.vue
* 运单列表
* Created by zhuyi on 17/7/21.
*/
<template>
  <div id="waybillList">
    <ele-list :selectable="selectable" :operatable="operatable" @query="query" @ready="query" @action="action" @more="more" @exportData="exportData" :total="total" :loading="loading" :list-data="listData" ref="eleList" :customColumn="customColumn" :removeCustomColumn='removeCustomColumn' :params="params" :needPage="needPage" :needMore="needMore" :isAdvanced="isAdvanced" :deleteFun="deleteFun" :add="add" :downloadErrorData="downloadErrorData" :downloadTemplate="downloadTemplate" :importUrl="importUrl" :editUrl="editUrl" :getColumn="getColumn" :getList="getList" :exportCsv="exportCsv" :getSearch="getSearch" :getAction="getAction" :showImportButton="permission && showImportButton" :needAdd="permission" :showCustomBtn='showCustomBtn' customBtnName="批量修改收款人" :showDownloadTemplate='showDownloadTemplate' @customBtnClick='customBtnClick' :objectName="objectName" :getImportColumn="getImportColumn" :folder="folder" v-if="showNow">
      <span slot="funArea">
                <el-button v-if="showBatchFixPrice" v-check-permission="'waybill.updatePrice'" @click="batchFixPrice">批量修改运价</el-button>
              </span>
      <span slot="topRightFun" v-if="showRecycle" class="recycle-bin" @click="recycleList">
                <i class="el-icon-delete2"></i> 回收站
              </span>
    </ele-list>
    <el-dialog :title="actionDialogTitle" :visible.sync="actionDialogVisible" size="large" :class="isMap" v-if="actionDialogVisible">
      <component ref="waybillAction" :is="currentDialogComponent" @success="dialogSuccess" @fail="dialogFail" @close="dialogClose" :type="type" :actionType="actionType" :actionDomain="actionDomain" :id="currentWaybillCode" :action="currentActionCode" :actionExecuteFun="actionExecuteFun" :isDialog="true"></component>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogClose">取 消</el-button>
        <el-button type="primary" @click="dialogSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 取消运单 -->
    <el-dialog title="取消原因" :visible.sync="cancelDialog.visible">
      <el-row class="dialog-content-section">
        <el-col class="el-col-auto" :span="24">
          <span><el-input type="textarea" v-model="cancelDialog.domainObject.cancelReason" placeholder="请输入取消原因，最多200个字符" :rows="10" :autosize="{ minRows: 10 }" maxlength="200"></el-input></span>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog.visible=false">取消</el-button>
        <el-button type="primary" @click="doCancel">确认</el-button>
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


    <!-- 批量修改客户运价的的弹框 start  -->
    <el-dialog title="批量修改运价" :visible.sync="dialogVisiblePrice.visiable" size="large" class='fix_price_dialog' @close="cancelFixPrice">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="客户运价" class='dia_item'>
          <el-input type='number' v-model="modelFixPrice.domainObject.clientFreightPrice" placeholder="请输入客户运价"></el-input>
          <el-select v-model="modelFixPrice.domainObject.clientFreightPriceUnitCode" placeholder="请选择">
            <el-option v-for="item in modelFixPrice.options[meterageTypeTemp]" :key="item.id" :label="item.value" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="司机运价" class='dia_item'>
          <el-input type='number' :disabled="disabledDriverPrice" v-model="modelFixPrice.domainObject.driverPrice" placeholder="请输入客户运价"></el-input>
          <el-select v-model="modelFixPrice.domainObject.driverPriceUnitCode" :disabled="disabledDriverPrice" placeholder="请选择">
            <el-option v-for="item in modelFixPrice.options[meterageTypeTemp]" :key="item.id" :label="item.value" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="remark">备注：运价不填时，默  认不修改</div>
      <!--       <ele-form :domainObject="modelFixPrice.domainObject" ref="form"  @formMounted="formMounted"  label-width="100px" :inline="false">
          <div v-for="field in modelFixPrice.fields">
            <el-form-item :label="field.showName" :required="field.required ==='true'">
              <ele-block :field="field" :domainObject="modelFixPrice.domainObject" :editable="editable" :uploadUrl="uploadUrl" :inputKey="inputKey"></ele-block>
            </el-form-item>
          </div>
        </ele-form> -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelFixPrice">取 消</el-button>
        <el-button type="primary" @click="submitFixPrice">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 批量修改客户运价的的弹框 end  -->
    <!-- 标准版打印派车单 -->
    <pop-print-waybill ref="printWaybillDialog"></pop-print-waybill>
    <lyg-pop-print-waybill ref="lygPrintWaybillDialog"></lyg-pop-print-waybill>
    <loading-action ref="loadingActionDialog" @refresh="refresh"></loading-action>
    <!-- 新版收发货弹框  start =================================================== -->
    <waybillManifest ref="waybillManifest" @refresh="refresh"></waybillManifest>
    <!-- 新版收发货弹框  end =================================================== -->
    <!-- 修改运力 -->
    <change-transport ref="changeTransportDialog" @refresh="refresh"></change-transport>


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
        <el-col :span="12">
          <label>运单号：</label>
          <span>{{reportDialog.domainObject.waybillNo}}</span>
        </el-col>
        <el-col :span="12">
          <label>预装货量：</label>
          <span><input type="number" class="txtbox el-input__inner" v-model="reportDialog.domainObject.goodsWeight" placeholder="请输入预装货量" title="请输入0~1000之间的数字，小数点最多2位"></span>
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
      <el-row class="dialog-content-section">
        <el-col :span="24">
          <label>备注：</label>
          <span><textarea class="txtbox el-input__inner remark-txtbox" v-model="reportDialog.domainObject.description" placeholder="请输入备注信息，最多200个字符" maxlength="200"></textarea></span>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="reportDialog.visiable=false">取消</el-button>
        <el-button type="primary" @click="handleReportDialogSubmit">确认</el-button>
      </div>
    </el-dialog>
    <!-- 评价司机 -->
    <el-dialog title="评价司机" :visible.sync="rateDialog.visiable" size="large" id="rateSection">
      <el-row class="dialog-content-section">
        <el-col :span="10">
          <h3 class="tit">运单信息：</h3>
          <ul class="text-list">
            <li>
              <span class="tl-tit">运单号：</span>
              <span class="tl-cont">{{rateDialog.domainObject.waybillNo}}</span>
            </li>
            <li>
              <span class="tl-tit">客户：</span>
              <span class="tl-cont"><a href="javascript:;" :data-link="`/partner/add.html?orgCode=${rateDialog.domainObject.platformClientOrgCode}&editable=false`" data-title="伙伴详情" title="查看伙伴详情" class="blue">{{rateDialog.domainObject.clientOrgName}}</a></span>
            </li>
            <li>
              <span class="tl-tit">线路名称：</span>
              <span class="tl-cont"><a href="javascript:;" :data-link="`/route/add.html?code=${rateDialog.domainObject.routeCode}&editable=false`" data-title="线路详情" title="查看线路详情" class="blue">{{rateDialog.domainObject.routeName}}</a></span>
            </li>
            <li>
              <span class="tl-tit">货物名称：</span>
              <span class="tl-cont">{{rateDialog.domainObject.goodsName}}</span>
            </li>
            <li>
              <span class="tl-tit">车牌号：</span>
              <span class="tl-cont"><a href="javascript:;" :data-link="`/truck/add.html?truckCode=${rateDialog.domainObject.platformTruckCode}&editable=false`" data-title="车辆详情" title="查看车辆详情" class="blue">{{rateDialog.domainObject.truckLicenseNo}}</a></span>
            </li>
            <li>
              <span class="tl-tit">司机：</span>
              <span class="tl-cont"><a href="javascript:;" :data-link="`/driver/add.html?userCode=${rateDialog.domainObject.platformDriverCode}&editable=false`" data-title="司机详情" title="查看司机详情" class="blue">{{rateDialog.domainObject.driverFullName}}</a></span>
            </li>
            <li>
              <span class="tl-tit">手机号：</span>
              <span class="tl-cont">{{rateDialog.domainObject.driverPhone}}</span>
            </li>
          </ul>
        </el-col>
        <el-col :span="14">
          <h3 class="tit">评价结果：</h3>
          <div class="rate-wrap">
            <ul class="rate-list">
              <li v-for="(item,index) in rateDialog.config" :key="item.id">
                <span class="rl-tit">{{item.evalutionDimension}}：</span>
                <div class="star">
                  <el-rate v-model="item.star" @change="starChange(index)"></el-rate>
                </div>
                <span class="tip">{{item.evalutionDescription}}</span>
              </li>
            </ul>
          </div>
          <div class="rate-info">
            <ul class="rate-list">
              <li>
                <span class="rl-tit">评价得分：</span>
                <div class="score">
                  <strong class="org">{{ rateDialog.score }}</strong>
                </div>
                <span class="tip">注：根据以上四个评价维度综合自动计算出得分。</span>
              </li>
              <li class="rl-text">
                <span class="rl-tit">评价内容：</span>
                <div class="rate-description">
                  <el-input type="textarea" v-model="rateDialog.description" placeholder="请输入评价内容，最多100个字" :maxlength="100"></el-input>
                </div>
              </li>
            </ul>
          </div>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="rateDialog.visiable=false">取消</el-button>
        <el-button type="primary" @click="handleRateDialogSubmit">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script type="text/ecmascript-6">
// import eleList from '../components/ele-list/eleList.vue';
import eleList from '@/components/v3/ele-table/eleList.vue';
import { urlRedirect, checkPermission, showMessageUtil } from '../../api/Utils';
import { getColumn, list, getSearch, deleteList, getAction, executeAction, exportCsv, add, downloadErrorData, downloadTemplate, getWaybillList, batchFixPayee, getDetail, declareWaybill, editPrice, evaConfig, evaAdd } from '../../api/waybillService';
import * as ApiConst from '../../api/ApiConst';
import eleAction from '../components/ele-action/eleAction.vue';
import waybillManifest from './waybillManifest.vue';
import eleWaybillPopMap from '../components/ele-pop-map/eleWaybillPopMap.vue';
import popPrintWaybill from './popPrintWaybill.vue';
import lygPopPrintWaybill from './lygPopPrintWaybill.vue';
import LoadingAction from './loadingAction.vue';
import changeTransport from './changeTransport.vue';
import FixPayee from './fixPayee.vue';
import '../components/vueDirectives';
import { list as listOutsourcingWaybill } from '../../api/OutsourcingWaybillService';
import { selfs } from '../../api/OrgService';
import { get as getOrgManager } from '../../api/OrgManagementService';
import Decimal from "decimal.js";


// import rate from './rate.vue';

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
    'fix-payee': FixPayee,
    'change-transport':changeTransport,
    waybillManifest
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
  computed: {
    // disabledDriverPrice(){
    //   if(this.dataOrgManager && this.dataOrgManager.settleTradingConfigUnitCode){
    //     return true;
    //   }
    //   return false;
    // }

  },
  data: () => {
    return {
      showDownloadTemplate:true,
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
      objectName: '运单',
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
      permission: true,
      showImportButton: true,
      downloadTemplate,
      isMap: '',
      showNow: false,
      getImportColumn: getDetail,
      folder: 'waybill/waybill',
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
      dataOrgManager: null
    };
  },
  methods: {
    checkWeight() {
      console.log('checkWeight now');
      const pattern = new RegExp(/^(?:0\.\d{1,2}|[1-9]\d{0,2}(?:\.\d{1,2})?|1000)$/);
      if (this.reportDialog.domainObject.goodsWeight && !pattern.test(this.reportDialog.domainObject.goodsWeight)) {
        this.$message({
          type: 'warning',
          message: '请输入合理的预装货量数值（0~1000之间的数字，小数点最多2位）！',
          duration: 3000
        });
        return false;
      } else {
        return true;
      }
    },
    getEvaConfig() {
      evaConfig((success, error) => {
        if (success) {
          const data = success.content;
          console.log('evaluate config list is', data);
          console.table(data);
          data.forEach((val) => {
            val.star = 0;
            this.rateDialog.config.push(val);
          });
        }
      });
    },
    starChange(index) {
      console.log('star changed now', index, 'star is', this.rateDialog.config[index].star, 'percent is', this.rateDialog.config[index].evalutionWeightCoefficient);
      this.calculateScore();
    },
    calculateScore() {
      let score = 0;
      this.rateDialog.config.forEach((val) => {
        score += val.star * Number(val.evalutionWeightCoefficient) / 100;
      });
      console.log('score is', score);
      this.rateDialog.score = score.toFixed(1);
    },
    handleRateDialogSubmit() {
      console.log('submit rate now');
      for (let i = 0; i < this.rateDialog.config.length; i++) {
        if (this.rateDialog.config[i].star === 0) {
          this.$message({
            type: 'warning',
            message: `请为${this.rateDialog.config[i].name}评分，并确保全部选项都已评分！`,
            duration: 3000
          });
          return false;
        }
      }
      const scoreJson = {};
      this.rateDialog.config.forEach((val) => {
        scoreJson[val.evalutionDimension] = val.star;
      });
      console.log('scoreJson is', scoreJson);
      // 提交参数
      const paramsObj = {
        waybillCode: this.rateDialog.domainObject.code, // 运单编码
        waybillNo: this.rateDialog.domainObject.waybillNo, // 运单号
        platformTruckCode: this.rateDialog.domainObject.platformTruckCode, // 车辆平台级编码
        truckCode: this.rateDialog.domainObject.truckCode, // 车辆code
        truckLicenseNo: this.rateDialog.domainObject.truckLicenseNo, // 车牌号
        platformUserCode: this.rateDialog.domainObject.platformDriverCode, // 司机平台级编码
        // userCode: this.rateDialog.domainObject.driverCode, // 司机code
        userFullName: this.rateDialog.domainObject.driverFullName, // 司机姓名
        evaluationScore: this.rateDialog.score, // 评价总分
        evalutionDimensionRecord: JSON.stringify(scoreJson), // 维度评分json
        description: this.rateDialog.description // 评价描述
      };
      // 新增评论
      evaAdd(paramsObj, (success, error) => {
        if (error || success.code !== 200) {
          this.$message({
            type: 'error',
            message: error.content,
            duration: 3000
          });
          return false;
        }
        if (success) {
          this.$message({
            type: 'success',
            message: '评价成功！',
            duration: 3000
          });
          this.closeRateDialog();
        }
      });
    },
    resetRate() {
      this.rateDialog.config.forEach((val) => {
        val.star = 0; // 评分清零
      });
      this.rateDialog.score = 0; // 总分清零
      this.rateDialog.description = ''; // 评价清空
    },
    closeRateDialog() {
      this.rateDialog.visiable = false;
      this.resetRate();
      this.$refs.eleList.dispatchQueryEventSavePage(); // 刷新列表保留当前页码
    },
    cancelFixPrice() {
      this.dialogVisiblePrice.visiable = false;
      let model = this.modelFixPrice.domainObject;
      let key;
      for (key in model) { model[key] = undefined; }
      this.dataOrgManager = null;
    },

    // 批量修改运价 提交
    submitFixPrice() {
      const cli_price = this.modelFixPrice.domainObject.clientFreightPrice,
        cli_unitCode = this.modelFixPrice.domainObject.clientFreightPriceUnitCode,
        dir_price = this.modelFixPrice.domainObject.driverPrice,
        dir_unitCode = this.modelFixPrice.domainObject.driverPriceUnitCode;

      if (!cli_price && !cli_unitCode && !dir_price && !dir_unitCode) {
        this.dialogVisiblePrice.visiable = false;
        return;
      }
      // 检验填入的格式
      const arr_price = [{ val: cli_price, msg: '客户运价不超过13位(最多4位小数)' }, { val: cli_price, msg: '司机运价不超过13位(最多4位小数)' }];
      arr_price.forEach(item => {
        var reg = /^[0-9]{1,10}(\.[0-9]{0,4})?$/;
        if (item.val && !reg.test(item.val)) {
          showMessageUtil('warning', item.msg, 1000);
          return;
        }
      })
      //价格和单位 只要有同一个填写，就必须两个都填写
      let warningModel = {};
      if ((cli_price && !cli_unitCode) || (!cli_price && cli_unitCode)) { warningModel = { mark: true, msg: '请检查客户运价，运价和单位必须都填写' } }
      if ((dir_price && !dir_unitCode) || (!dir_price && dir_unitCode)) { warningModel = { mark: true, msg: '请检查司机运价，运价和单位必须都填写' } }
      if (warningModel.mark) { showMessageUtil('warning', warningModel.msg, 1000); return }

      let arr = [];
      this.listData.forEach(item => {
        if (item.checked) { arr.push(item); }
      })
      if (arr.length < 1) {
        showMessageUtil('warning', '请选择运单', 1000);
        return;
      }
      let all_count = arr.length;
      let succ_count = 0;
      let fail_count = 0;
      for (let i = 0; i < arr.length; i++) {
        let obj = arr[i];
        let params = {};
        params.code = obj.code;
        if (this.modelFixPrice.domainObject.clientFreightPrice) {
          params.clientFreightPrice = this.modelFixPrice.domainObject.clientFreightPrice;
          params.clientFreightPriceUnitCode = this.modelFixPrice.domainObject.clientFreightPriceUnitCode;
        }
        if (this.modelFixPrice.domainObject.driverPrice) {
          params.driverPrice = this.modelFixPrice.domainObject.driverPrice;
          params.driverPriceUnitCode = this.modelFixPrice.domainObject.driverPriceUnitCode;
        }

        this.loading = true;
        editPrice(params, (success, error) => {
          if (error || success.code !== 200) {
            fail_count++;
          }
          if (success) {
            succ_count++;
          }
          if (all_count == succ_count + fail_count) {
            this.dialogVisible.payeeFirst = false;
            this.loading = false;
            const msg = `批量修改价格，共${all_count}条运单，成功${succ_count}条，失败${fail_count}条。`;
            showMessageUtil('success', msg, 3000);
            this.dialogVisiblePrice.visiable = false;
            setTimeout(function() {
              window.location.reload();
            }, 3000)
          }
        });
      }
    },
    // 批量修改 运价
    batchFixPrice() {
      //1.单车已经结算  不能修改 2.客户必须是 同一个  需要全部满足  settleStatus = pass 计量标准必须一致
      let listSelected = [];
      let clientOrgName = undefined; // 客户
      let meterageTypeTemp = undefined; // 选中的计量标准
      // let error = { settleStatusMark: false, clientOrgNameMark: false };
      let error = { mark: false, msg: '' };
      let meterageType = null;
      for (let i = 0; i < this.listData.length; i++) {
        let item = this.listData[i];
        if (item.checked) {
          if (!clientOrgName) { clientOrgName = item.clientOrgName; }
          if (clientOrgName !== item.clientOrgName) {
            error.mark = true;
            error.msg = '选择修改的运单必须是同一个客户';
          }
          if (!meterageTypeTemp) {
            meterageTypeTemp = item.meterageType;
            this.meterageTypeTemp = meterageTypeTemp
          }
          if (meterageTypeTemp !== item.meterageType) {
            error.mark = true;
            error.msg = '选择修改的运单必须计量标准一致'
          }
          if (item.settleStatus == 'pass') {
            error.mark = true;
            error.msg = '选择修改的运单中 单车已结算的不能修改运价';
          }
          listSelected.push(item);
        }
      }
      if (listSelected.length < 1) {
        error.mark = true;
        error.msg = '请至少选择一个运单';
      }
      if (error.mark) {
        showMessageUtil('warning', error.msg, 3000);
      } else {
        const appInfo = JSON.parse(localStorage.getItem('appInfo'));
        let self = this;
        if (appInfo.priceMode == 'auto') {
          this.netGetOrgManager(listSelected[0].platformClientOrgCode, mark => {
            if (mark) {
              self.dialogVisiblePrice.visiable = true;
            }
          })
        } else {
          self.dialogVisiblePrice.visiable = true;
        }
      }
    },
    recycleList() {
      this.openWindow(`${this.recycleUrl}`, '运单回收站列表');
    },
    handleReportDialogSubmit() {
      if (this.checkWeight()) {
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
          weight: this.reportDialog.domainObject.goodsWeight, //预装重量
          remark: this.reportDialog.domainObject.description //备注
        };
        declareWaybill(params, (success, error) => {
          if (success) {
            var ret = success;
            if (ret.success) {
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
      }
    },
    // 点击收款人确认
    dialogSubmitPayee() {
      // 拿到数据
      // let obj =  this.$refs.fixPayee.domainObject;
      // 网络请求
      this.netPayee();
    },
    // 网络请求 批量跟换 收款人
    netPayee() {
      let arr = [];
      this.listData.forEach(item => {
        if (item.checked && item.settleStatus != 'pass') {
          arr.push(item);
        }
      })
      if (arr.length < 1) {
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
      for (let i = 0; i < arr.length; i++) {
        let obj = arr[i];
        let params = this.$refs.fixPayee.domainObject;
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
            succ_count++;
            // this.loading = false;
            // window.location.href = success.content.url;
          }
          if (all_count == succ_count + fail_count) {
            this.dialogVisible.payeeFirst = false;
            this.loading = false;
            this.$message({
              type: 'success',
              message: `批量修改${all_count}条运单收款人，成功${succ_count}条，失败${fail_count}条。`,
              duration: 3000
            });
            setTimeout(function() {
              window.location.reload();
            }, 3000)
          }
        });
      }
    },
    // 批量修改 收款人 回调按钮
    customBtnClick() {
      let arr = [];
      this.listData.forEach(item => {
        if (item.checked && item.settleStatus != 'pass') {
          arr.push(item);
        }
      })
      if (arr.length < 1) {
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
        case 'rateDriver':
          this.resetRate();
          this.rateDialog.visiable = true;
          this.rateDialog.domainObject = model;
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
          window.open(`/truck/truck-gps.html?truckLicenseNo=${model.truckLicenseNo}&waybillStatus=${model.waybillStatus}&loadingTime=${model.loadingTime}&unloadingTime=${model.unloadingTime}&driverFullName=${model.driverFullName}&driverPhone=${model.driverPhone}&goodsName=${model.goodsName}&loadingProvinceCode=${model.loadingProvinceCode}&loadingCityCode=${model.loadingCityCode}&unloadingProvinceCode=${model.unloadingProvinceCode}&unloadingCityCode=${model.unloadingCityCode}`);
          break;
        case 'loading':
        case 'loadingInput':
          // if(model.loadingMode === 'single'){
          //      this.$refs.loadingActionDialog.open(model, command, menu.name);
          // }
          // if(model.loadingMode === 'multiple'){
          //      this.$refs.waybillManifest.open(model, command, menu.name);
          // }

          this.$refs.waybillManifest.open(model, command, menu.name);

          break;
        case 'unloading':
        case 'unloadingInput':
          // if(model.loadingMode === 'single'){
          //      this.$refs.loadingActionDialog.open(model, command, menu.name);
          // }
          // if(model.loadingMode === 'multiple'){
          //      this.$refs.waybillManifest.open(model, command, menu.name);
          // }

          this.$refs.waybillManifest.open(model, command, menu.name);
          break;
          case 'changeTransport':
          this.$refs.changeTransportDialog.open(model, command, menu.name);
          break;

        case 'printDispatchBill':
          this.$refs.printWaybillDialog.open(model, 'waybill', 'smallticketprintstatus', model.code);
          break;
        case 'lygPrintDispatchBill':
          this.$refs.lygPrintWaybillDialog.open(model, 'waybill', 'dispatchPrintStatus', model.code);
          break;
        case 'cancel':
          this.cancelDialog.domainObject.code = model.code;
          this.cancelDialog.domainObject.cancelReason = '';
          this.cancelDialog.visible = true;
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
      this.removeCustomColumn.push('driverConfirmStatus');
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
      if (true == this.isFormLogistics) {
        this.getList = getWaybillList;
      }
      if (true == this.isFormLogisticsOutsourcing) {
        this.getList = listOutsourcingWaybill;
      }
      console.log('searchParams', searchParams);

      // Object.assign(searchParams, this.params);
      // 备注：bug 订单详情中waybill 列表，默认传进来的 params（size=10）,当点击分页的时候 searchParams(size=50),
      // Object.assign(obj1,obj2),遇到相同的key ，会以 后面的obj2 为主，所以 分页不起作用，永远都是 size=10
      searchParams = Object.assign(this.params, searchParams);

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
          success.content.forEach((data) => {
            codeList.push(data.code);
          });
          getAction(codeList, (response) => {
            success.content.forEach((row) => {
              const actionList = [];
              if (response && response.content && response.content[row.code]) {
                response.content[row.code].forEach((action) => {
                  if (!actionExcludeFilter.find(a => a === action.actionCode)) {
                    actionList.push({ key: action.actionCode, name: action.actionName, action });
                  }
                });
              }
              // 运输中和运输完成的运单，并且有查看轨迹的权限，新增查看轨迹操作
              if ((row.waybillStatus === 'going' || row.waybillStatus === 'finish') && checkPermission('waybill.historyLocation')) {
                actionList.push({ key: 'viewTrajectory', name: '查看轨迹' });
              }

              if('unloading' === row.waybillStatus && checkPermission("waybill.transport.edit")){
                actionList.push({ key: 'changeTransport', name: '修改运力' });
              }

              row.actionMenuList = actionList;
            });
            self.listData = success.content;
            this.loading = false;
          });
        }
      });
    },
    setConfigFun(){
     this.showImportButton = false;
     this.showDownloadTemplate = false;
    },
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
        this.setConfigFun();
      });
    } else {
      this.showNow = true;
      this.setConfigFun();
    }



  },
  created() {
    this.permission = checkPermission("waybill.add");
    this.showCustomBtn = checkPermission("waybill.updatePayee");
    this.dealWithBsicInfoForHanNeng();
    this.dealWithFixPrice();
    this.getEvaConfig();
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

#waybillList {
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
