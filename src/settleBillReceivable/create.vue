<template>
  <div class="sellte-revice-container">
    <div class="list-wrap" v-show="!tips.status">
      <!--标题-->
      <div class="page-header clearfix">
        <h2 class="page-title fl">
          {{params.billCode && !readonly ? '编辑' : !readonly ? '创建' : ''}}应收账单{{readonly ? '详情' : ''}}
        </h2>
        <div class="hd-opr fr">
          <el-button v-if="!readonly" @click="onBack">返回到选择运单</el-button>
          <template v-if="readonly">
            <el-button @click="applyApprove" v-if="showApplyApprove">提交审核</el-button>
            <el-button @click="revokeApply" v-if="showRevokeApply">撤回提交审核</el-button>
            <el-button @click="revokeConfirm" v-if="showRevokeConfirm">审核账单</el-button>
            <el-button @click="invoice" v-check-permission="'settleBillReceivable.makeInvoice'" v-if="showInvoice">记录开票</el-button>
            <el-button @click="sendBill" v-if="showSendBill">发送账单</el-button>
            <el-button @click="destroy" v-if="showDestroy">作废账单</el-button>
            <el-button @click='onEditForm' v-if="showEdit">编辑账单</el-button>
          </template>
        </div>
        <span id="pageRefresh" class="page-refresh fr"><i class="ico-refresh"></i>刷新</span>
      </div>
      <!--收付方信息-->
      <create-title :readonly='readonly' :params="params" :showData="showData" :submitData='submitData'></create-title>
      <!--账单明细模块-->
      <div class="list-container">
        <div class="list-title">账单明细</div>
        <div class="hr"></div>
        <!--         <div class="search-form">
          <v-table-search ref="tableSearch" @reset="onReset" @submit="onSearch" :searchFields="searchParams" :isMin='false' :searchModel="searchData"></v-table-search>
        </div>
    }
 -->
        <el-form :inline="true" :model="searchData" ref="searchModel" class="demo-form-inline">
          <el-row class="search-form">
            <el-col :span="8" :class="searchField.fieldConfigCode" v-for="(searchField, index) in searchFields" :key="searchField.fieldConfigCode">
              <el-form-item :label="searchField.showName">
                <ele-block :field="searchField" :domainObject="searchData"></ele-block>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="search-button">
            <el-button type="primary" @click="onSearch"><i class="el-icon-search"></i> 待选内搜索</el-button>
            <el-button @click="resetForm">重置条件</el-button>
            <el-button type="text" @click="showMore">{{ isMini ? '展开查询条件' : '收起查询条件' }}</el-button>
          </div>
        </el-form>
        <div class="tabel-action-btn-container">
          <table-action-btn @onClickBtn="onTableActionBtnClick" :readonly="readonly" :list="batchBtnList"></table-action-btn>
        </div>
        <table-list @onSelectionChange="onSelectionChange" @onSave="onTableCellSave" :readonly="readonly" :editFields="editFields" :fixedFields="fixedFields" :hiddenFields="hiddenFields" :batchFields="batchFields" :list="list" :btnList="btnList" :fields="fields" :formatterFields='formatterFields' :listLinkConfigCode='listLinkConfigCode' :listPicLinkConfigCode='listPicLinkConfigCode'></table-list>
        <table-page @change="onChange" :page='params.page' :pageSize='params.size' :total='page_info.total'></table-page>
      </div>
      <!--整单核算-->
      <create-computed ref="CreateComputed" @onSubmit="onSubmit" @onCancel="onCancel" :readonly="readonly" :params="params" :submitData="submitData"></create-computed>
      <!-- 详情页面中需要的标签信息 -->
      <el-tabs type="border-card" v-if="readonly">
        <el-tab-pane label="账单审核记录">
          <div class='tr'>
            <el-button @click="applyApprove" v-if="submitData.receivableBillStatus==='none'">提交审核</el-button>
            <el-button @click="revokeApply" v-if="submitData.receivableBillStatus==='pend'">撤回提交审核</el-button>
            <el-button @click="revokeConfirm" v-if="submitData.receivableBillStatus==='pend'">审核账单</el-button>
            <!-- <el-button @click="revokeApprove" v-if="submitData.receivableBillStatus==='accept'">撤回审核</el-button> -->
          </div>
          <!-- 审核记录 -->
          <create-approve ref='CreateApproveList' :history="history"></create-approve>
        </el-tab-pane>
        <el-tab-pane label="销项发票记录">
          <invoice :code="code" :domainObject="submitData" v-if="invoiceShow"></invoice>
        </el-tab-pane>
        <el-tab-pane label="收款资金流水">
          <!-- <div class='tr'>
            <el-button @click="addReceiveDialog" v-if="submitData.receivableBillStatus==='accept' && submitData.receivableStatus!=='all'">添加收款</el-button>
          </div> -->
          <!-- 应收 -->
          <receipt-relation-list paramKey="billCode" :submitData='submitData'></receipt-relation-list>
        </el-tab-pane>
        <el-tab-pane label="变更记录">
          <logs :selectable="false" :operatable="false" :domain="uploadUrl" :type="logType" :code="code" :isAdvanced="false" :params="changeLogParams" :needPage="true">
          </logs>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 表单页面，列表批量操作弹框 -->
    <create-dialog @onBatchSubmit="onBatchSubmit" :batchCodeList="batchCodeList" :dialog="dialog" :params="params"></create-dialog>
    <!-- 详情页面，审核弹框确认 -->
    <approve-dialog @onSuccess='revokeSuccess' @onFail='revokeFail' :revoke="revoke_dialog"></approve-dialog>
    <!-- 详情页面，添加收款弹框 -->
    <create-receive-dialog @onSuccess='addReceive' :dialog='receive_dialog'></create-receive-dialog>
    <!-- 添加或者页面，修改成功之后的提示 -->
    <create-status :tips="tips" v-show="tips.status"></create-status>
  </div>
</template>
<script>
import TableActionBtn from './create/table-action-btn.vue';
import TableList from './create/table-list.vue';
import VTableSearch from '../components/ele-list/eleMinTableSearch.vue';
import TablePage from '../components/ele-list/elePage.vue';
import logs from '../logs/list.vue';
import invoice from './invoice.vue';

import eleBlock from '../components/ele-block/eleBlock.vue';
import '../components/vueDirectives';

import ApiConst from '../../api/ApiConst';
// 只适用于本页面的组件
import CreateComputed from './create_computed.vue';
//  标题栏
import CreateTitle from './create_title.vue';
// 点击表格上面的按钮弹出的组件
import CreateDialog from './create_dialog.vue';
//  添加或修改成功之后的提示组件
import CreateStatus from './create_status.vue';
// 审核记录
import CreateApprove from './create_approve.vue';
//  应收列表
import ReceiptRelationList from './receipt_relation_list.vue';
// 审核弹框确认
import ApproveDialog from './approve_dialog.vue';
// 添加收款弹框
import CreateReceiveDialog from './create_receive_dialog.vue';
import {
  getParam,
  getParamsFromURL,
  checkFileExist
} from '../../api/Utils';
import * as SettleBillService from '../../api/SettleBillService';
const axios = require('axios');

import {
  // goodsNumber,
  // goodsVolume,
  // goodsWeight,
  carrierPrice,
  goodsPrice,
  chargeItemNumber,
  getAll
} from '../../api/DataSourceService';


// import * as ApiConst from '../../api/ApiConst';

export default {
  name: 'create',
  components: {
    TableActionBtn,
    TableList,
    TablePage,
    logs,
    invoice,
    VTableSearch,
    CreateComputed,
    CreateTitle,
    CreateDialog,
    CreateStatus,
    CreateApprove,
    ReceiptRelationList,
    ApproveDialog,
    CreateReceiveDialog,
    eleBlock
  },
  data() {
    return {
      listLinkConfigCode: ['logisticsNo', 'waybillNo'],
      listPicLinkConfigCode: ['loadingAttachment', 'unloadingAttachment'],
      miniFields: [],
      allFields: [],
      isMini: true,
      searchFields: [],

      folder: 'settle/receivableSelWaybill',
      carrierPriceData: [],
      goodsPriceData: [],
      goodsLossData: [],
      chargeItemNumberData: [],
      history: {
        actualReceiptLogList: {
          list: []
        },
        approveList: {
          list: []
        }
      },
      readonly: false,
      showApplyApprove: false, // 提交审核按钮
      showRevokeApply: false, // 撤回提交审核按钮
      showRevokeConfirm: false, //审核账单按钮
      showInvoice: false, // 记录开票按钮
      showSendBill: false, // 发送账单按钮
      showDestroy: false, //作废按钮
      showEdit: false, // 编辑按钮
      uploadUrl: ApiConst.apiSettleDomain,
      logType: 'settle',
      code: getParamsFromURL(window.location.search).code,
      changeLogParams: {
        code: getParamsFromURL(window.location.search).code,
        size: 10
      },
      invoiceShow: false,
      tips: {
        status: false,
        type: 'add',
        billCode: '',
        billNo: ''
      },
      showData: {
        selfName: ''
      },
      receive_dialog: {
        show: false,
        data: {
          billCode: '',
          clientOrgCode: '',
          clientOrgName: '',
          billNo: '',
          billName: '',
          unreceivedAmount: '',
          receivableAmount: '',
          receivedAmount: '',
          settlingMethod: '现金',
          amount: '',
          operateTime: new Date(),
          description: ''
        }
      },
      revoke_dialog: {
        show: false
      },
      // 表格上面的按钮点击弹框组件用的参数
      dialog: {
        show: false,
        title: '', // 标题
        value: '', // 字段的value
        key: '', //  字段的key
        selectList: [], // 如果该字段是下拉类型，这里配置下拉列表信息
        checkbox: false //  是否需要显示全选按钮
      },
      // 当前登录信息
      userinfo: {},
      // 批量选择时，把获取的每行的ID存储到这里
      batchCodeList: [],
      // 表格上面的按钮配置
      batchBtnList: [{
          text: '移除',
          key: 'remove'
        }, {
          text: '调整结算方式',
          key: 'settleMethod'
        }, {
          text: '调整每单定额',
          key: 'adjustmentQuota'
        }, {
          text: '调整运价税型',
          key: 'ratesTaxType'
        }, {
          text: '调整客户税率',
          key: 'taxRate'
        },
        // {
        //   text: '调整货物单价',
        //   key: 'goodsPrice'
        // }, 
        {
          text: '导出运单明细',
          key: 'export'
        }
      ],
      // 搜索配置
      searchParams: [],
      // 搜索参数
      searchData: {},
      // 上一次搜索参数
      searchDataPrev: {},
      // 运单列表
      list: [],
      page_info: {
        total: 0
      },
      // 运单列表字段
      fields: [],
      // 表格批量选择时，表格组件内部会根据这里面配置的字段，组装出对应的数据
      batchFields: ['code', 'waybillNo'],
      // 表格操作列自定义按钮
      btnList: [{
        text: '移除',
        type: 'text',
        attrs: {
          size: 'large'
        },
        fn: ({
          data
        }) => {
          // console.log(data);
          this.$msgbox({
            title: '提示',
            message: `您确认把运单${data.waybillNo}移出吗？移出后该运单将不在已选运单列表中。`,
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            beforeClose: (action, instance, done) => {
              if (action === 'confirm') {
                this.tableCellActions.remove({
                  codeList: data.code,
                  clientOrgName: data.clientOrgName,
                  billCode: ''
                }, ({
                  code
                } = {}) => {
                  done();
                  // console.log(code);
                  if (code === 200) {
                    this.onGetList();
                    this.$refs.CreateComputed.onUpdateStatis();
                    this.$message.success('移除成功');
                  }
                });
              } else {
                done();
              }
            }
          });
        }
      }],
      // 表格需要固定的列配置
      fixedFields: {
        left: ['logisticsNo', 'waybillNo']
      },
      // 列表需要隐藏的列字段名
      hiddenFields: ['meterageType'],
      // 表格需要编辑的列配置
      editFieldsTemp: {
        settleMethod: {
          component: 'TableCellSelect',
          list: [{
            label: '按发货货量',
            value: 'loadingweight'
          }, {
            label: '按收货货量',
            value: 'unloadingweight'
          }, {
            label: '发货与收货两者取小',
            value: 'smaller'
          }, {
            label: '发货与收货两者取大',
            value: 'bigger'
          }],
          formatter: {
            loadingweight: '按发货货量',
            unloadingweight: '按收货货量',
            smaller: '发货与收货两者取小',
            bigger: '发货与收货两者取大'
          }
        }
      },
      editFields: {
        settleMethod: {
          component: 'TableCellDefault',
          list: [{
            label: '按发货货量',
            value: 'loadingweight'
          }, {
            label: '按收货货量',
            value: 'unloadingweight'
          }, {
            label: '发货与收货两者取小',
            value: 'smaller'
          }, {
            label: '发货与收货两者取大',
            value: 'bigger'
          }],
          formatter: {
            loadingweight: '按发货货量',
            unloadingweight: '按收货货量',
            smaller: '发货与收货两者取小',
            bigger: '发货与收货两者取大'
          }
        },
        adjustmentQuota: {
          component: 'TableCellDefault',
          cancelReset: true
        },
        adjustmentProportion: {
          component: 'TableCellDefault'
        },
        ratesTaxType: {
          component: 'TableCellDefault',
          list: [{
            label: '含税运价',
            value: 'include'
          }, {
            label: '不含税运价',
            value: 'exclude'
          }],
          formatter: {
            include: '含税运价',
            exclude: '不含税运价'
          }
        },
        taxRate: {
          component: 'TableCellDefault'
        },
        description: {
          component: 'TableCellDefault'
        }
      },
      formatterFields: {
        waybillStatus(value, field) {
          let formats = {
            finish: '已完成',
            unloading: '待装货',
            going: '运输中',
            cancel: '运单取消'
          };
          return formats[value[field.fieldConfigCode]];
        },
        // 装货重量
        loadingGoodsWeight(value, field) {
          return `${value[field.fieldConfigCode]}吨`;
        },
        // 装货体积
        loadingGoodsVolume(value, field) {
          return `${value[field.fieldConfigCode]}方`;
        },
        // 装货数量
        loadingGoodsNum(value, field) {
          return `${value[field.fieldConfigCode]}件`;
        },
        //  结算方式
        settleMethod(value, field) {
          const formats = {
            loadingweight: '按发货货量',
            unloadingweight: '按收货货量',
            smaller: '发货与收货两者取小',
            bigger: '发货与收货两者取大'
          };
          return formats[value[field.fieldConfigCode]];
        },
        // unloadingGoodsWeight 重量
        unloadingGoodsWeight(value, field) {
          return `${value[field.fieldConfigCode]}吨`;
        },
        // unloadingGoodsVolume 卸货体积
        unloadingGoodsVolume(value, field) {
          return `${value[field.fieldConfigCode]}方`;
        },
        // unloadingGoodsNum  卸货数量
        unloadingGoodsNum(value, field) {
          return `${value[field.fieldConfigCode]}件`;
        },
        // goodsPrice 货物单价
        goodsPrice(value, field) {
          const dwKey = `${field.fieldConfigCode}UnitCodeAsyncValue` || '',
            dwValue = `${value[dwKey]}` || '';
          return `${value[field.fieldConfigCode]}${dwValue}`;
        },
        // totalFee 应收核算运费
        totalFee(value, field) {
          return `￥${value[field.fieldConfigCode]}`;
        },
        // adjustmentQuota  "应收调整定额"
        adjustmentQuota(value, field) {
          return `￥${value[field.fieldConfigCode]}`;
        },
        // adjustmentProportion "应收调整比例"
        adjustmentProportion(value, field) {
          return `${value[field.fieldConfigCode]}%`;
        },
        // "adjustmentProportionAmount" "应收调整比例金额"
        adjustmentProportionAmount(value, field) {
          return `￥${value[field.fieldConfigCode]}`;
        },
        // "freightSubtotal"  "应收运费小计"
        freightSubtotal(value, field) {
          return `￥${value[field.fieldConfigCode]}`;
        },
        // "ratesTaxType"  "运价税型"
        ratesTaxType(value, field) {
          const formats = {
            include: '含税运价',
            exclude: '不含税运价'
          };
          return formats[value[field.fieldConfigCode]];
        },
        // "taxRate"  "客户税率"
        taxRate(value, field) {
          return `${value[field.fieldConfigCode]}%`;
        },
        // "taxFreightSubtotal" "含税应收运费小计"
        taxFreightSubtotal(value, field) {
          return `￥${value[field.fieldConfigCode]}`;
        },
        // 客户运价
        clientFreightPrice(value, field) {
          const dwKey = `${field.fieldConfigCode}UnitCodeAsyncValue` || '',
            dwValue = `${value[dwKey]}` || '';
          return `${value[field.fieldConfigCode]}${dwValue}`;
        },
        // 合理细差
        goodsLoss(value, field) {
          const dwKey = `${field.fieldConfigCode}UnitCodeAsyncValue` || '',
            dwValue = `${value[dwKey]}` || '';
          return `${value[field.fieldConfigCode]}${dwValue}`;
        },
        actualGoodsLoss(value, field) {
          const dwKey = `${field.fieldConfigCode}UnitCodeAsyncValue` || '',
            dwValue = `${value[dwKey]}` || '';
          return `${value[field.fieldConfigCode]}${dwValue}`;
        },
        settleGoodsLossVolume(value, field) {
          const dwKey = `${field.fieldConfigCode}UnitCodeAsyncValue` || '',
            dwValue = `${value[dwKey]}` || '';
          return `${value[field.fieldConfigCode]}${dwValue}`;
        },
        lossDeduction(value, field) {
          return `￥${value[field.fieldConfigCode]}`;
        },
        deductWaterAmount(value, field) {
          return `￥${value[field.fieldConfigCode]}`; // 扣水金额
        },
        deductWater(value, field) {
          return `${value[field.fieldConfigCode]}吨`; // 扣水重量
        }
      },
      layoutFields: {},
      // 调整各种类型的接口全部以类型为key的形式定义，在调用的时候直接调用此对象[类型]即可
      tableCellActions: {
        // 调整每单定额
        adjustmentQuota: (data, cb) => {
          SettleBillService.settleReceivableWaybillAdjustQuota(data, cb);
        },
        // 调整每单比例
        adjustmentProportion: (data, cb) => {
          SettleBillService.settleReceivableWaybillAdjustRatio(data, cb);
        },
        // 调整客户税率
        taxRate: (data, cb) => {
          SettleBillService.settleReceivableWaybillAdjustTaxRates(data, cb);
        },
        // 调整货物单价 url 需要调整 ？？？
        goodsPrice: (data, cb) => {
          SettleBillService.settleReceivableWaybillAdjustGoodsPrice(data, cb);
        },
        // 编辑备注描述
        description: (data, cb) => {
          SettleBillService.settleReceivableWaybillEditDescription(data, cb);
        },
        // 调整结算方式
        settleMethod: (data, cb) => {
          SettleBillService.settleReceivableWaybillAdjustSettleMethod(data, cb);
        },
        // 调整运价税型
        ratesTaxType: (data, cb) => {
          SettleBillService.settleReceivableWaybillAdjustTaxType(data, cb);
        },
        // 移除
        remove: (data, cb) => {
          SettleBillService.settleReceivableWaybillRemove(data, cb);
        }
      },
      updateParams: {},
      // 初始化时会更新这些参数
      params: {
        clientOrgCode: '',
        platformClientOrgCode: '',
        clientOrgName: '',
        size: 20,
        page: 1,
        billCode: ''
      },
      //        字段注释
      //            adjustQuota (number, optional): 调整定额 ,
      //            adjustRatio (number, optional): 调整比例 ,
      //            billAdjustFee (number, optional): 整单调整费 ,
      //            confirmedLossDeduction (number, optional): 货差扣款 ,
      //            subtotal (number, optional): 运费小计 ,
      //            taxSubtotal (number, optional): 含税运费小计
      //        ==============
      //            lossDeductionAmount 客户货差扣款总额
      //            receivableAdjustmentQuotaAmount 应收调整定额总额
      //            receivableAdjustmentProportionAmount 应收调整比例金额总额
      //            taxReceivableFreightSubtotalAmount 含税应收运费小计总额
      //            receivableFreightSubtotalAmount 应收运费小计总额
      //        billName (required) 账单名称
      //        payerOrgCode (required) 付款方组织编码
      //        payerOrgName (required) 付款方名称
      //          adjustmentWay 调整方式 quota 按整单定额调整 scale 按整单比例调整
      //          entireSingleAdjustmentRoportion 整单调整比例
      //          receivableEntireSingleAdjustment 应收整单调整
      //          adjustmentDescription 调整备注
      //          receivableAmount 应收金额
      //          cashPlanSettleAmount 现金计划结算金额
      //          bankTransferPlanSettleAmount 银行转账计划结算金额
      //          oilCardPlanSettleAmount 油卡计划结算金额
      //          gasCardPlanSettleAmount 气卡计划结算金额
      //          bankDraftPlanSettleAmount 银行汇票计划结算金额
      //          businessDraftPlanSettleAmount 商业汇票计划结算金额
      // 添加和修改需要给后台提交的数据
      submitData: {
        adjustmentDescription: '',
        adjustmentWay: 'quota',
        bankDraftPlanSettleAmount: 0,
        bankTransferPlanSettleAmount: 0,
        billName: '',
        billNo: '',
        receivableBillStatus: '',
        businessDraftPlanSettleAmount: 0,
        cashPlanSettleAmount: 0,
        code: '',
        creatorUsername: '',
        entireSingleAdjustmentRoportion: 0,
        gasCardPlanSettleAmount: 0,
        invoiced: 'no',
        lossDeductionAmount: 0,
        oilCardPlanSettleAmount: 0,
        payerOrgCode: '',
        platformPayerOrgCode: '',
        payerOrgName: '',
        adjustmentProportionAmount: 0, // 调整比例金额总额
        adjustmentQuotaAmount: 0, // 调整定额总额
        receivableAmount: 0,
        entireSingleAdjustment: 0, // 整单调整比例
        freightSubtotalAmount: 0, // 应收运费小计总额
        receivableStatus: '',
        receivedAmount: 0,
        taxFreightSubtotalAmount: 0, //含税运费小计总额
        unreceivedAmount: 0,
        updateUsername: '',
        agencyPrice: '', // 代理价
        agencyFeeAdjustment: '' // 代理费调整

      },
      theme: true
    };
  },
  methods: {
    showMore() {
      this.isMini = !this.isMini;
      this.searchFields = this.isMini ? this.miniFields : this.allFields;
    },
    /**
     * 处理账单明细下面搜索栏展示的数据
     * @return {[type]} [description]
     */
    dealWithFieldMin() {
      this.allFields = this.searchParams;
      // this.miniFields = this.searchParams.slice(0, 3); // min 的时候显示几个
      this.miniFields = this.searchParams.slice(0, 0);
      this.searchFields = this.miniFields;
      console.log('dealWithFieldMin ...', this.searchFields);
    },
    resetForm() {
      // this.$refs.form.resetForm();
      const keyArray = Object.keys(this.searchData);
      keyArray.forEach((element) => {
        this.searchData[element] = null;
      });
      this.onGetList();
    },
    /**
     * 运单列表批量选择事件
     * @param code 当前点击行的code
     */
    onSelectionChange({
      code
    } = {}) {
      // console.log('create->onSelectionChange:', code);
      this.batchCodeList = code;
    },

    /**
     * 表格上面的一排按钮点击之后，会弹框，可以批量操作，操作完之后点击确定会触发此方法
     * @param btn 当前点击的按钮配置信息
     */
    onBatchSubmit(data) {
      this.onUpdateActionByType(this.dialog.key, data).then(() => {
        this.$message.success(`批量操作 ${this.dialog.title} 成功`);
        this.onGetList();
        this.$refs.CreateComputed.onUpdateStatis();
      });
    },

    /**
     * 表格上面的一排按钮点击事件
     * @param btn 当前点击的按钮配置信息
     */
    onTableActionBtnClick({
      btn
    }) {
      if (btn.key !== 'export') {
        if (!this.batchCodeList.length) {
          this.$message.warning('请选择至少一条数据！');
        } else {
          // 如果 是 修改货物运价 那么 货物单价的 单位必须一致  batchGoodsPrice

          // if (btn.key === 'goodsPrice') {
          //   let mark = false;
          //   let code = '';
          //   let self = this;
          //   this.batchCodeList.forEach(item => {
          //     // 拿到对应 那个 单子对象
          //     let target = null;
          //     for (let i = 0; i < self.list.length; i++) {
          //       let obj = self.list[i];
          //       if (obj.code == item) {
          //         target = obj;
          //         break;
          //       }
          //     }
          //     if (target) {
          //       if (!code) code = target.goodsPriceUnitCode;
          //       if (code !== target.goodsPriceUnitCode) mark = true;
          //     }
          //   })
          //   // this.list.forEach(item => {
          //   //   if (!code) code = item.goodsPriceUnitCode;
          //   //   if (code !== item.goodsPriceUnitCode) mark = true;
          //   // })

          //   if (mark) {
          //     this.$message.warning('货物单价不一致！');
          //     return;
          //   }
          // }

          this.dialog.checkbox = false;
          this.dialog.title = btn.text;
          this.dialog.show = true;
          this.dialog.value = '';
          this.dialog.key = btn.key;
          if (this.editFields[btn.key]) {
            this.dialog.selectList = this.editFields[btn.key].list || [];
          }
        }
      } else {
        // console.log(btn);
        const params = {
          page: 1,
          size: 6000
        };
        if (this.params.billCode) {
          params.billCode = this.params.billCode;
          if (this.readonly) {
            params.tableType = 'contrast';
          }
        } else {
          params.clientOrgName = this.params.clientOrgName;
        }
        // 获取列表字段配置
        SettleBillService.settleReceivableSelectedWaybillColumns((success) => {
          if (success) {
            const paramsObj = {
              params: params,
              configList: success.content
            };
            // 导出
            SettleBillService.settleReceivableSelWaybillExportCsv(paramsObj, (success, error) => {
              if (error) {
                this.$message.error(error.content);
              }
              if (success) {
                console.log(success);
                window.location.href = success.content.url;
              }
            });
          }
        });
      }
    },

    /**
     * 表格中的所有保存事件
     * @param oldData 修改之前的数据对象
     * @param newData 修改之后的数据对象
     * @param index   行索引
     * @param field   当前数据的字段信息对象
     */
    onTableCellSave({
      oldData,
      newData,
      field
    }) {
      //  code: oldData.code,
      this.updateParams = {};
      // console.log('field.fieldConfigCode outer :', field.fieldConfigCode);
      if (field.fieldConfigCode === 'description') {
        // console.log('field.fieldConfigCode inner :', field.fieldConfigCode);
        // console.log('oldData.code before :', oldData.code);
        this.updateParams.code = oldData.code;
        // console.log('this.updateParams.code after :', this.updateParams.code);
      } else {
        this.updateParams.codeList = oldData.code;
      }
      if (this.params.billCode) {
        this.updateParams.billCode = this.params.billCode;
      } else {
        this.updateParams.clientOrgName = this.params.clientOrgName;
      }
      if (this.tableCellActions[field.fieldConfigCode]) {
        if (typeof this.tableCellActions[field.fieldConfigCode] === 'function') {
          this.updateParams[field.fieldConfigCode] = newData[field.fieldConfigCode];
          console.log('this.updateParams:', this.updateParams);
          this.onUpdateActionByType(field.fieldConfigCode, this.updateParams).then(() => {
            this.$message.success('操作成功');
            this.onGetList();
            // oldData[field.fieldConfigCode] = newData[field.fieldConfigCode];
            this.$refs.CreateComputed.onUpdateStatis();
          }).catch((msg) => {
            this.$message.error(msg);
          });
        }
      } else {
        this.$message.error('没有定义对应的操作，可能是新增的需求');
      }
    },
    onUpdateActionByType(type, data) {
      console.log('this.updateParams->data:', data);
      return new Promise((resolve, reject) => {
        this.tableCellActions[type](data, (success, error) => {
          if (success) {
            // console.log(`action->${type}:`, success.code, success.content);
            resolve(success.content);
          } else {
            this.$message.error(error.content);
            reject(error.content);
          }
        });
      });
    },
    addReceiveDialog() {
      // console.log('添加收款弹框');
      Object.keys(this.receive_dialog.data).forEach((key) => {
        if (key !== 'settlingMethod' && key !== 'operateTime') {
          this.receive_dialog.data[key] = this.submitData[key] || this.params[key];
        }
      });
      this.receive_dialog.show = true;
    },
    addReceive() {
      // console.log('添加收款弹框点击确定', this.receive_dialog.data);
      const params = {
        billCode: this.receive_dialog.data.billCode,
        clientOrgCode: this.receive_dialog.data.clientOrgCode,
        clientOrgName: this.receive_dialog.data.clientOrgName,
        billNo: this.receive_dialog.data.billNo,
        billName: this.receive_dialog.data.billName,
        settlingMethod: this.receive_dialog.data.settlingMethod,
        amount: this.receive_dialog.data.amount,
        operateTime: this.receive_dialog.data.operateTime,
        description: this.receive_dialog.data.description
      };
      SettleBillService.settleReceivableActualReceiptLogAdd(params, (success, error) => {
        if (success) {
          this.$message({
            type: 'success',
            message: '保存成功！',
            duration: 1000
          });
          this.onGetView();
          this.$refs.CreateReceiveLogList.query({
            billCode: this.params.billCode,
            size: 20,
            page: 1
          });
        }
        if (error) {
          this.$message({
            type: 'error',
            message: error.content,
            duration: 1000
          });
        }
        this.receive_dialog.show = false;
      });
    },
    invoice() {
      const code = this.params.billCode;
      this.$msgbox({
        title: '提示',
        message: '您确认已经开票了吗？',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = '执行中...';
            SettleBillService.settleReceivableInvoice(code, (success, error) => {
              if (error) {
                this.$message({
                  type: 'error',
                  message: error.content,
                  duration: 1000
                });
              }
              if (success) {
                this.$message({
                  type: 'success',
                  message: '确认开票成功！',
                  duration: 1000
                });
                this.submitData.invoiced = 'yes';
                instance.confirmButtonLoading = false;
                done();
              }
              // 操作完毕刷新
              setTimeout(() => {
                window.location.reload();
              }, 3000);
            });
          } else {
            done();
          }
        }
      });
    },
    destroy() {
      const code = this.params.billCode;
      this.$msgbox({
        title: '提示',
        message: '您确认要作废这笔账单吗？账单作废后将归到"已作废"类别，并不可再编辑。',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = '执行中...';
            SettleBillService.settleReceivableCancel(code, (success) => {
              if (success) {
                this.$message({
                  type: 'success',
                  message: '作废账单成功！',
                  duration: 1000
                });
                instance.confirmButtonLoading = false;
                done();
              }
              // 操作完毕刷新
              setTimeout(() => {
                window.location.reload();
              }, 3000);
            });
          } else {
            done();
          }
        }
      });
    },
    revokeSuccess({
      data
    }) {
      console.log('审核通过', data);
      this.$msgbox({
        title: '提示',
        message: '您确认审核通过这笔账单吗？',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = '执行中...';
            SettleBillService.settleReceivableApprove(this.params.billCode, {
              receivableBillStatus: 'accept',
              approveRemark: data.approveRemark
            }, (success, error) => {
              if (error) {
                this.$message({
                  type: 'error',
                  message: error.content,
                  duration: 1000
                });
              }
              if (success) {
                this.submitData.receivableBillStatus = 'accept';
                this.$message({
                  type: 'success',
                  message: '审核通过成功！',
                  duration: 1000
                });
                this.onGetApproveList();
                this.revoke_dialog.show = false;
                instance.confirmButtonLoading = false;
                done();
              }
              // 操作完毕刷新
              setTimeout(() => {
                window.location.reload();
              }, 3000);
            });
          } else {
            done();
          }
        }
      });
    },
    revokeFail({
      data
    }) {
      console.log('审核失败', data);
      this.$msgbox({
        title: '提示',
        message: '您确认审核不通过这笔账单吗？',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = '执行中...';
            SettleBillService.settleReceivableApprove(this.params.billCode, {
              receivableBillStatus: 'reject',
              approveRemark: data.approveRemark
            }, (success, error) => {
              if (error) {
                this.$message({
                  type: 'error',
                  message: error.content,
                  duration: 1000
                });
              }
              if (success) {
                this.submitData.receivableBillStatus = 'reject';
                this.$message({
                  type: 'success',
                  message: '审核不通过操作成功！',
                  duration: 1000
                });
                this.onGetApproveList();
                this.revoke_dialog.show = false;
                instance.confirmButtonLoading = false;
                done();
              }
              // 操作完毕刷新
              setTimeout(() => {
                window.location.reload();
              }, 3000);
            });
          } else {
            done();
          }
        }
      });
    },
    revokeConfirm() {
      console.log('revokeConfirm');
      this.revoke_dialog.show = true;
    },
    revokeApprove() {
      const code = this.params.billCode;
      this.$msgbox({
        title: '提示',
        message: '您确认要撤回审核这笔账单吗？账单将回到"待审核"状态。',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = '执行中...';
            SettleBillService.settleReceivableRevokeApprove(code, (success, error) => {
              if (error) {
                this.$message({
                  type: 'error',
                  message: error.content,
                  duration: 1000
                });
              }
              if (success) {
                this.$message({
                  type: 'success',
                  message: '撤回提交审核成功！',
                  duration: 1000
                });
                this.submitData.receivableBillStatus = 'pend';
                instance.confirmButtonLoading = false;
                done();
              }
              // 操作完毕刷新
              setTimeout(() => {
                window.location.reload();
              }, 3000);
            });
          } else {
            done();
          }
        }
      });
    },
    applyApprove() {
      const code = this.params.billCode;
      this.$msgbox({
        title: '提示',
        message: '您确认提交审核这笔账单吗？',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = '执行中...';
            SettleBillService.settleReceivableApplyApprove(code, (success, error) => {
              if (error) {
                this.$message({
                  type: 'error',
                  message: error.content,
                  duration: 1000
                });
              }
              if (success) {
                this.$message({
                  type: 'success',
                  message: '提交审核成功',
                  duration: 1000
                });
                this.submitData.receivableBillStatus = 'pend';
                instance.confirmButtonLoading = false;
                done();
              }
              // 操作完毕刷新
              setTimeout(() => {
                window.location.reload();
              }, 3000);
            });
          } else {
            done();
          }
        }
      });
    },
    revokeApply() {
      const code = this.params.billCode;
      this.$msgbox({
        title: '提示',
        message: '您确认要撤回提交审核这笔账单吗？账单将回到"待提交审核"状态，并可以编辑。',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = '执行中...';
            SettleBillService.settleReceivableRevokeApplyApprove(code, (success, error) => {
              if (error) {
                this.$message({
                  type: 'error',
                  message: error.content,
                  duration: 1000
                });
              }
              if (success) {
                this.$message({
                  type: 'success',
                  message: '撤回提交审核成功！',
                  duration: 1000
                });
                this.submitData.receivableBillStatus = 'none';
                instance.confirmButtonLoading = false;
                done();
              }
              // 操作完毕刷新
              setTimeout(() => {
                window.location.reload();
              }, 3000);
            });
          } else {
            done();
          }
        }
      });
    },
    sendBill() {
      const code = this.params.billCode;
      this.$msgbox({
        title: '提示',
        message: '您确认发送账单给客户吗？',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = '执行中...';
            SettleBillService.settleReceivableSendBill(code, (success, error) => {
              if (error) {
                this.$message({
                  type: 'success',
                  message: error.content,
                  duration: 1000
                });
              }
              if (success) {
                this.$message({
                  type: 'success',
                  message: '发送账单成功！',
                  duration: 1000
                });
                this.$set(this.submitData, 'clientConfirmStatus', 'pend');
                // this.submitData.clientConfirmStatus = 'pend';
                console.log('new submitData is', this.submitData);
                console.log('new submitData clientConfirmStatus is', this.submitData.clientConfirmStatus);
                instance.confirmButtonLoading = false;
                done();
              }
              // 操作完毕刷新
              setTimeout(() => {
                window.location.reload();
              }, 3000);
            });
          } else {
            done();
          }
        }
      });
    },
    onChange(page, size, type) {
      console.log('onChange-page-size:', page, size);
      type === 'pageChange' ? (this.params.page = 1) : (this.params.page = page);
      // this.params.page = page;
      this.params.size = size;
      this.onGetList();
    },
    /**
     * 获取运单列表
     * @returns {Promise}
     */
    onGetList() {
      Object.assign(this.searchData, this.params);
      return new Promise((resolve, reject) => {
        /**
         * 详情页面和添加编辑页面，获取运单列表的接口不一样
         */
        SettleBillService[this.readonly ? 'settleReceivableSelectContractWaybillList' : 'settleReceivableSelectSelectedWaybillList'](this.searchData, (success, error) => {
          if (success) {
            if (success.content.length === 0) {
              this.$message.warning('没有查询到符合条件的记录！');
            }
            success.content.forEach((item) => {
              // clientFreightPrice 客户税率单位
              if (item.clientFreightPrice && item.clientFreightPriceUnitCode) {
                this.carrierPriceData.forEach((uc) => {
                  if (uc.id === item.clientFreightPriceUnitCode) {
                    item.clientFreightPriceUnitCodeAsyncValue = uc.name;
                  }
                });
              }
              // goodsLoss  合理货差系数
              if (item.goodsLoss && item.goodsLossUnitCode) {
                this.goodsLossData.forEach((uc) => {
                  if (uc.id === item.goodsLossUnitCode) {
                    item.goodsLossUnitCodeAsyncValue = uc.name;
                  }
                });
              }
              // actualGoodsLoss  实际货差
              if (item.actualGoodsLoss && item.meterageType) {
                // this.goodsLossData.forEach((uc) => {
                //   if (uc.id === item.meterageType) {
                //     item.actualGoodsLossUnitCodeAsyncValue = uc.name;
                //   }
                // });
                this.fields.forEach((field) => {
                  if (field.fieldConfigCode === 'meterageType') {
                    console.log('meterageType', field);
                    const typeIndex = field.extraParams[0].optionsValue.indexOf(item.meterageType);
                    if (typeIndex !== -1) {
                      item.actualGoodsLossUnitCodeAsyncValue = field.extraParams[0].options[typeIndex];
                    }
                  }
                });
              }
              // settleGoodsLossVolume  货差超标量
              if (item.settleGoodsLossVolume && item.meterageType) {
                // this.goodsLossData.forEach((uc) => {
                //   if (uc.id === item.meterageType) {
                //     item.settleGoodsLossVolumeUnitCodeAsyncValue = uc.name;
                //   }
                // });
                this.fields.forEach((field) => {
                  if (field.fieldConfigCode === 'meterageType') {
                    console.log('meterageType', field);
                    const typeIndex = field.extraParams[0].optionsValue.indexOf(item.meterageType);
                    if (typeIndex !== -1) {
                      item.settleGoodsLossVolumeUnitCodeAsyncValue = field.extraParams[0].options[typeIndex];
                    }
                  }
                });
              }
              // goodsPrice 货物单价
              if (item.goodsPrice && item.goodsPriceUnitCode) {
                // this.goodsLossData.forEach((uc) => {
                //   if (uc.id === item.meterageType) {
                //     item.goodsPriceUnitCodeAsyncValue = uc.name;
                //   }
                // });
                this.goodsPriceData.forEach((uc) => {
                  if (uc.id === item.goodsPriceUnitCode) item.goodsPriceUnitCodeAsyncValue = uc.name;
                });
              }
              // 动态判断是否可编辑
              if (item.settleMethod === 'trucknumber') {
                item.settleMethodUnitCodeAsyncEdit = true;
              }
            });
            console.log('this.goodsLossData', this.goodsLossData);
            console.log('this.carrierPriceData', this.carrierPriceData);
            console.log('onGetList:', success.content);
            this.list = success.content;
            this.page_info.total = success.total;
            resolve(success.content);
          } else {
            this.$message.error(error.content);
            reject(error.content);
          }
        });
      });
    },

    /**
     * 获取账单详情
     * @returns {Promise}
     */
    onGetView() {
      return new Promise((resolve, reject) => {
        SettleBillService.settleReceivableGet(this.params.billCode, (success, error) => {
          if (success) {
            resolve(success.content);
          } else {
            this.$message.error(error.content);
            reject(error.content);
          }
        });
      });
    },

    /**
     * 获取运单列表字段
     * @returns {Promise}
     */
    onGetFields() {

      return new Promise((resolve, reject) => {

        let self = this;
        // 如果是配置了项目名字
        const localStorage = window.localStorage,
          projectName = JSON.parse(localStorage.getItem('appInfo')).projectName || '';
        // 查看static 文件 是否存在
        let markExist = false;
        if (projectName && self.folder) {
          let path = `../../static/projects/${projectName}/${self.folder}/list_render_info.json`;
          markExist = checkFileExist(path);
        }

        if (projectName && self.folder && markExist) {

          const folder = self.folder, // 获取配置文件目录名称
            time = (new Date()).getTime(),
            searchPath = `../../static/projects/${projectName}/${folder}/list_render_info.json?t=${time}`;
          // 获取搜索字段配置
          axios.get(searchPath).then((res) => {

            let code = res.data.code;
            let content = res.data.content;
            if (200 === res.data.code) {
              const eleDefine = JSON.parse(localStorage.getItem('eleDefine')),
                eleInfo = JSON.parse(localStorage.getItem('eleInfo'));
              let params = {};
              params = getParam({
                data: {
                  'content': content
                }
              }, eleDefine, eleInfo);

              params.field.forEach((field) => {
                console.log(field);
              });
              this.fields = content;
              resolve();
            }
          }).catch(error => {
            this.$message.error(content);
            reject();
          })
        } else {
          SettleBillService.settleReceivableSelectedWaybillColumns((success, error) => {
            const eleDefine = JSON.parse(localStorage.getItem('eleDefine')),
              eleInfo = JSON.parse(localStorage.getItem('eleInfo'));
            let params = {};
            params = getParam({
              data: {
                content: success.content
              }
            }, eleDefine, eleInfo);
            // console.log('onGetFields:getParam', params);
            if (success) {
              params.field.forEach((field) => {
                console.log(field);
              });
              this.fields = success.content;
              resolve();
            } else {
              this.$message.error(error.content);
              reject();
            }
          });
        }
      });
    },

    /**
     * 获取运单列表搜索配置
     * @returns {Promise}
     */
    onGetSearchFields() {

      let self = this;
      // 如果是配置了项目名字
      const localStorage = window.localStorage,
        projectName = JSON.parse(localStorage.getItem('appInfo')).projectName || '';
      // 查看static 文件 是否存在
      let markExist = false;
      if (projectName && self.folder) {
        let path = `../../static/projects/${projectName}/${self.folder}/search_render_info.json`;
        markExist = checkFileExist(path);
      }

      if (projectName && self.folder && markExist) {
        const folder = self.folder, // 获取配置文件目录名称
          time = (new Date()).getTime(),
          searchPath = `../../static/projects/${projectName}/${folder}/search_render_info.json?t=${time}`;
        // 获取搜索字段配置
        axios.get(searchPath).then((res) => {

          let code = res.data.code;
          let content = res.data.content;
          if (200 === res.data.code) {
            const eleDefine = JSON.parse(localStorage.getItem('eleDefine')),
              eleInfo = JSON.parse(localStorage.getItem('eleInfo'));
            let params = {};
            params = getParam({
              data: {
                content
              }
            }, eleDefine, eleInfo);
            this.searchParams = params.field;
            this.searchParams.forEach((ele) => {
              this.$set(this.searchData, ele.fieldConfigCode, null);
            });

            this.dealWithFieldMin();
          }
        }).catch(error => {
          this.$message.error(content);
        })

      } else {

        SettleBillService.settleReceivableSelectedWaybillSearch(({
          code,
          content
        }) => {
          if (code === 200) {
            // console.log('onGetSearchFields:', code, content);
            const eleDefine = JSON.parse(localStorage.getItem('eleDefine')),
              eleInfo = JSON.parse(localStorage.getItem('eleInfo'));
            let params = {};
            params = getParam({
              data: {
                content
              }
            }, eleDefine, eleInfo);
            // console.log(params);
            this.searchParams = params.field;
            this.searchParams.forEach((ele) => {
              //              console.log(ele.fieldConfigCode);
              this.$set(this.searchData, ele.fieldConfigCode, null);
            });

            this.dealWithFieldMin();
          } else {
            this.$message.error(content);
          }
        });
      }

    },
    onBack() {
      // window.history.back();
      const path = '/settleBillReceivable/select_waybill.html?',
        query = this.params.billCode ? `billCode=${this.params.billCode}` : `orgCode=${this.params.clientOrgCode}&orgName=${this.params.clientOrgName}&platformOrgCode=${this.params.platformClientOrgCode}`;
      window.location.href = path + query;
    },

    /**
     * 运单列表搜索
     * @returns {Promise}
     */
    onSearch() {
      this.searchDataPrev = Object.assign({}, this.searchData);
      this.onGetList();
    },

    /**
     * 获取运单重置
     * @returns {Promise}
     */
    onReset() {
      // const data = this.$refs.tableSearch.searchModel;
      // Object.keys(data).forEach((key) => {
      //   this.$set(data, key, null);
      // });
      this.searchDataPrev = Object.assign({}, this.searchData);
      this.onGetList();
    },
    onCancel() {
      this.$message.info('取消');
    },

    /**
     * 编辑账单
     */
    onEditForm() {
      // console.log('onEditForm,this.params', this.params);
      // this.readonly = false;
      window.location.href = `/settleBillReceivable/select_waybill.html?billCode=${this.params.billCode}`;
    },

    /**
     * 添加和修改应收账单信息
     * @returns {Promise}
     */
    onSubmit() {
      // fix 新建返回后 platformPayerOrgCode 丢失
      // this.submitData.platformPayerOrgCode = this.submitData.payerOrgCode;


      // console.log('this.submitData', this.submitData);
      return new Promise((resolve, reject) => {
        if (!this.params.billCode) {
          SettleBillService.settleReceivableAdd(this.submitData, (success, error) => {
            if (success) {
              this.tips.status = true;
              this.tips.type = 'add';
              this.tips.billCode = success.content.code;
              this.tips.billNo = success.content.billNo;
              resolve(success.content, 'add');
            } else {
              this.$message.error(error.content);
              reject(error.content, 'add');
            }
          });
        } else {
          const tempData = Object.assign({}, this.submitData);
          tempData.code = this.params.billCode;
          delete tempData.billNo;
          delete tempData.createTime;
          delete tempData.updateTime;
          delete tempData.updateUsername;
          delete tempData.creatorUsername;
          console.log('settleReceivableEdit tempData:', tempData);
          SettleBillService.settleReceivableEdit(this.params.billCode, tempData, (success, error) => {
            if (success) {
              this.tips.status = true;
              this.tips.type = 'edit';
              this.tips.billCode = this.params.billCode;
              this.tips.billNo = this.submitData.billNo;
              resolve(success.content, 'edit');
            } else {
              this.$message.error(error.content);
              reject(error.content, 'edit');
            }
          });
        }
      });
    },
    //      onGetActualReceiptLogList() {
    //        SettleBillService.settleReceivableActualReceiptLogList({
    //          page: this.params.page || 1,
    //          size: this.params.size || 12,
    //          billCode: this.params.billCode
    //        }, ({
    //              code, content
    //            }) => {
    //          if (code === 200) {
    //            console.log('create_history->onGetActualReceiptLogList', content);
    //            this.history.actualReceiptLogList.list = content;
    //          } else {
    //            this.$message.error(content);
    //          }
    //        });
    //      },

    /**
     * 获取审核记录列表
     * @returns {Promise}
     */
    onGetApproveList() {
      SettleBillService.settleReceivableApproveList({
        page: this.params.page || 1,
        size: this.params.size || 12,
        billCode: this.params.billCode
      }, ({
        code,
        content
      }) => {
        if (code === 200) {
          // console.log('create_history->onGetApproveList', content);
          this.history.approveList.list = content;
        } else {
          this.$message.error(content);
        }
      });
    },

    /**
     * 初始化更新参数，此方法执行之后，将会知道当前页面是属于添加还是编辑或者详情
     * @returns {Promise}
     */
    onUpdateParams() {
      const date = new Date(),
        paramsObj = getParamsFromURL(window.location.search),
        userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
      console.log('url params', paramsObj);
      console.log('window.location.href', window.location.href);
      this.showData.selfName = userInfo.orgFullName;
      if (paramsObj.code) {
        this.readonly = false;
        // console.log('billcode：', paramsObj.code);
        this.params.billCode = paramsObj.code;
        this.onGetView().then((content) => {
          // console.log('onUpdateParams->content:', content);
          this.submitData = Object.assign(this.submitData, content);
          this.params.clientOrgName = this.submitData.payerOrgName;
          this.params.clientOrgCode = this.submitData.payerOrgCode;
          this.params.platformClientOrgCode = this.submitData.platformPayerOrgCode;
          // sumitData 获取数据之后，显示销项发票组件内容
          this.invoiceShow = true;
          if (this.readonly) {
            this.$refs.CreateComputed.onComputedWill().onComputedEnd();
          }
          // 显示详情页面按钮操作
          this.showButtons();
        });
      } else {
        this.readonly = false;
        this.params.clientOrgCode = paramsObj.clientOrgCode;
        this.params.platformClientOrgCode = paramsObj.platformClientOrgCode;
        this.params.clientOrgName = paramsObj.clientOrgName;
        this.submitData.billName = this.params.clientOrgName + date.getFullYear() + (date.getMonth() + 1) + date.getDate();
        this.submitData.payerOrgName = this.params.clientOrgName;
        this.submitData.payerOrgCode = this.params.clientOrgCode;
        this.submitData.platformPayerOrgCode = this.params.platformClientOrgCode;
      }
      if (paramsObj.editable) {
        this.readonly = true;
        //          this.onGetActualReceiptLogList();
        this.onGetApproveList();
      }
      // console.log('onUpdateParams->this.userInfo:', userInfo);
    },
    onGetCarrierPriceData() {
      return new Promise((resolve, reject) => {
        carrierPrice.getData({}, (res) => {
          if (res) {
            this.carrierPriceData = res;
            resolve();
          } else {
            reject();
          }
        });
      });
    },
    onGetGoodsPriceData() {
      return new Promise((resolve, reject) => {
        goodsPrice.getData({}, (res) => {
          if (res) {
            this.goodsPriceData = res;
            resolve();
          } else {
            reject();
          }
        });
      });
    },
    onGoodsLossData() {
      return new Promise((resolve, reject) => {
        getAll(['goodsLoss', 'goodsLossRation'], {}, (res) => {
          if (res) {
            this.goodsLossData = res;
            resolve();
          } else {
            reject();
          }
        });
      });
    },
    // chargeItemNumber
    onChargeItemNumberData() {
      return new Promise((resolve, reject) => {
        chargeItemNumber.getData({}, (res) => {
          if (res) {
            this.chargeItemNumberData = res;
            resolve();
          } else {
            reject();
          }
        });
      });
    },
    init() {
      this.onUpdateParams();
      this.onGetCarrierPriceData().then(() => {
        this.onGoodsLossData().then(() => {
          this.onGetGoodsPriceData().then(() => {
            this.onGetFields().then(() => {
              this.onGetList();
            });
            this.onGetSearchFields();
            if (!this.readonly) {
              this.$refs.CreateComputed.onUpdateStatis();
            }
          });
        });
      });
      // console.log('this.readonly', this.readonly);
      // console.log('this.$refs', this.$refs);
      // this.$nextTick(() => {
      //   console.log('this.$refs.CreateReceiveLogList', this.$refs.CreateReceiveLogList);
      //   this.$refs.CreateReceiveLogList.query({
      //     billCode: this.params.billCode,
      //     size: 20,
      //     page: 1
      //   });
      // });

      // console.log('goodsNumber', goodsNumber);
      // console.log('goodsVolume', goodsVolume);
      // console.log('goodsWeight', goodsWeight);

      // goodsNumber.getData({}, (res1) => {
      //   console.log('goodsNumber.getData', res1);
      //   goodsVolume.getData({}, (res2) => {
      //     console.log('goodsVolume.getData', res2);
      //     goodsWeight.getData({}, (res3) => {
      //       console.log('goodsWeight.getData', res3);
      //       carrierPrice.getData({}, (res4) => {
      //         console.log('carrierPrice.getData', res4);
      //       });
      //     });
      //   });
      // });
    },
    showButtons() {
      console.log('page mounted and data is', this.submitData);
      // 账单状态 receivableBillStatus（none/pend/accept/reject/destroy/待提交审核/待审核/审核通过/审核不通过/已作废）
      // 发送状态 billAffirmStatus（none/pend/未发送/已发送）
      // 对方确认状态 payableBillStatus（none/pend/accept/reject/destroy/待对方确认/待审核/对方确认通过/对方确认不通/已作废）
      // 开票状态 invoiced（yes/no/已开票/未开票）
      // 收款状态 receivableStatus（none/part/all/未收款/部分收款/全部收款）

      // 账单为待提交审核 或 审核不通过
      if (this.submitData.receivableBillStatus === 'none' || this.submitData.receivableBillStatus === 'reject') {
        this.showApplyApprove = true; // 提交审核
        this.showEdit = true; // 编辑账单
        this.showDestroy = true; // 作废账单
      }

      // 账单为待审核
      if (this.submitData.receivableBillStatus === 'pend') {
        this.showRevokeConfirm = true; // 审核账单
        this.showRevokeApply = true; // 撤回提交审核
      }

      // 账单为审核通过
      if (this.submitData.receivableBillStatus === 'accept') {
        // 未发送
        if (this.submitData.billAffirmStatus === 'none') {
          this.showSendBill = true; // 发送账单
          // 开票状态未完成
          if (this.submitData.invoiced === 'no') {
            this.showInvoice = true; // 确认开票
          }
        }
        // 已发送
        if (this.submitData.billAffirmStatus === 'pend') {
          // 对方确认状态为待对方确认 或对方确认通过
          if (this.submitData.payableBillStatus === 'none' || this.submitData.payableBillStatus === 'accept') {
            // 开票状态未完成
            if (this.submitData.invoiced === 'no') {
              this.showInvoice = true; // 确认开票
            }
          }
          // 对方确认不通过
          if (this.submitData.payableBillStatus === 'reject') {
            this.showDestroy = true; // 作废账单
          }
        }
      }
      // 账单为已作废
      if (this.submitData.receivableBillStatus === 'destroy') {
        // 没有操作
      }
    }
  },
  created() {
    if (this.theme) {
      document.querySelector('body').classList.add('theme-blue');
    }
  },
  mounted() {
    this.init();
  },
  watch: {
    $route() {
      this.init();
    }
  }
};

</script>
<style lang="scss">
@import "../assets/sass/rl-fixed-table.min.scss";
@import "../assets/sass/base.scss";

.search-form {

  .loadingTime,
  .unloadingTime {
    width: 50%;
  }

  .el-form-item__label {
    font-size: 13px;
    width: 94px;
    padding-left: 0;
  }
}

.search-button {
  padding: 0 10px 10px;
  text-align: right;
}

.form-button {
  text-align: center;
  padding: 20px;
  min-width: 240px;
}

.el-form-item__label {
  font-size: 13px;
}

.el-textarea__inner {
  min-width: auto !important;
}

.description {
  .innerblock {
    display: block !important;
  }

  .el-textarea__inner {
    height: 48px;
  }
}

@media (max-width: 1366px) {
  .el-select {
    width: 164px;
  }

  .complex-control-2 {
    .el-input {
      width: 83px;
    }

    .el-select {
      width: 70px !important;
    }
  }

  .form-page .innerblock .el-date-editor {
    width: 165px !important;
  }
}

.hr {
  clear: both;
  border-top: 1px solid #eee;
}

.title-component {
  line-height: 42px;
  font-size: 16px;
  display: inline-block;
}

.title-btn {
  float: right;
  margin-right: 20px;
  margin-top: 6px;
}

.userinfo {
  display: inline-block;
  line-height: 42px;

  .item {
    float: left;
    margin-right: 100px;
  }
}

.list-container,
.computed-component,
.computed-base-component,
.computed-change-component,
.will-computed-component {
  border: 1px solid #eee;
  padding: 10px;
  width: 100%;
  height: auto !important;
  margin-bottom: 20px;
  box-sizing: border-box;
}

.list-title {
  color: red;
  line-height: 22px;
}

.sellte-revice-container {
  padding: 10px;
}

.userinfo-name {
  color: #000;
  font-size: 14px;
}

.userinfo-tip {
  color: red;
}

.computed-base-component {
  .title {
    font-size: 15px;
    line-height: 42px;
  }

  .computed-cp-name {
    line-height: 46px;
  }

  .base-list {
    background: #eee;
    padding: 10px;

    .base-li {
      line-height: 24px;
      width: 100%;
      display: inline-block;

      .base-li-label {
        width: 180px;
        display: inline-block;
        float: left;
      }

      &.end {
        .base-li-label {
          font-weight: bold;
        }

        .base-li-value {
          color: red;
        }
      }
    }
  }
}

.computed-change-component {
  .title {
    font-size: 15px;
    line-height: 42px;
  }

  .change-value {
    margin: 16px 0px;
  }
}

.computed-total {
  width: 100%;
  display: inline-block;
  background: #eee;
  padding: 3px;
  font-weight: bold;
  line-height: 32px;
  font-size: 16px;

  .label {
    color: #000;
  }

  .value {
    color: red;
  }
}

.will-computed-total {
  font-size: 14px;
  width: 100%;
  line-height: 32px;
}

.end-total {
  color: #999;
  font-size: 14px;
  line-height: 32px;
}

.hr {
  margin: 10px 0px;
}

.tabel-action-btn-container {
  margin: 10px 0px;

  button {
    margin-right: 10px;
  }
}

.tr {
  text-align: right;
}

</style>
