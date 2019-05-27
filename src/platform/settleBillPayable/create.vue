<template>
  <div class="sellte-revice-container" v-loading.fullscreen.lock="loading">
    <div class="list-wrap" v-show="!tips.status">
      <!--标题-->
      <div class="page-header clearfix">
        <h2 class="page-title fl">
          {{params.billCode && !readonly ? '编辑' : !readonly ? '创建' : ''}}{{objectName}}{{readonly ? '详情' : ''}}
        </h2>
        <div class="hd-opr fr">
          <el-button v-if="!readonly" @click="onBack">返回到选择运单</el-button>
          <template v-if="readonly">
            <el-button v-for="item in actionList" v-bind:key="item.key" @click="actionMethod(item.key)">{{item.name}}</el-button>
            <!--<el-button @click="applyApprove" v-if="showApplyApprove">提交审核</el-button>
            <el-button @click="revokeApply" v-if="showRevokeApply">撤回提交审核</el-button>
            <el-button @click="revokeConfirm" v-if="showRevokeConfirm">审核账单</el-button>
            <el-button @click="invoice" v-if="showInvoice">记录开票</el-button>
            <el-button @click="sendBill" v-if="showSendBill">发送账单</el-button>
            <el-button @click="destroy" v-if="showDestroy">作废账单</el-button>
            <el-button @click='onEditForm' v-if="showEdit">编辑账单</el-button> -->
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

        <!-- search bar start ========== -->

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



        <!-- search bar end ========== -->


<!--         <div class="search-form">
          <v-table-search ref="tableSearch" @reset="onReset" @submit="onSearch" :searchFields="searchParams" :isMin='false' :searchModel="searchData"></v-table-search>
        </div> -->


        <!-- 表格上面的操作，现在仅需2个 即可 -->
        <div class="tabel-action-btn-container">
          <table-action-btn @onClickBtn="onTableActionBtnClick" :readonly="readonly" :list="batchBtnList"></table-action-btn>
        </div>
        <table-list @onSelectionChange="onSelectionChange" @onSave="onTableCellSave" :readonly="readonly" :editFields="editFields" :fixedFields="fixedFields" :hiddenFields="hiddenFields" :batchFields="batchFields" :list="list" :btnList="btnList" :fields="fields" :formatterFields='formatterFields'></table-list>
        <table-page @change="onChange" :page='params.page' :pageSize='params.size' :total='page_info.total'></table-page>
      </div>
      <!-- 结算汇总 + 调整结果-->
      <!--整单核算-->
      <create-computed v-if='submitData' ref="CreateComputed" @onSubmit="onSubmit" @onCancel="onCancel" :readonly="readonly" :params="params" :submitData="submitData"></create-computed>
      <!-- 详情页面中需要的标签信息 -->
      <el-tabs type="border-card" v-if="readonly">
        <el-tab-pane label="账单记录">
          <div class='tr'>
            <el-button @click="applyApprove" v-if="submitData.billstatus==='none'">提交审核</el-button>
            <el-button @click="revokeApply" v-if="submitData.billstatus==='pend'">撤回提交审核</el-button>
            <el-button @click="revokeConfirm" v-if="submitData.billstatus==='pend'">审核账单</el-button>
            <!-- <el-button @click="revokeApprove" v-if="submitData.billstatus==='accept'">撤回审核</el-button> -->
          </div>
          <!-- 审核记录 -->
          <create-approve ref='CreateApproveList' :history="history"></create-approve>
        </el-tab-pane>
        <!-- <el-tab-pane label="销项发票记录">
          <invoice :code="code" :domainObject="submitData" v-if="invoiceShow"></invoice>
        </el-tab-pane> -->
        <!-- <el-tab-pane label="收款资金流水">
          <receipt-relation-list paramKey="billCode" :submitData='submitData'></receipt-relation-list>
        </el-tab-pane> -->
        <!-- <el-tab-pane label="变更记录">
          <logs :selectable="false" :operatable="false" :domain="uploadUrl" :type="logType" :code="code" :isAdvanced="false" :params="changeLogParams" :needPage="true">
          </logs>
        </el-tab-pane> -->
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
    <!-- 合规的弹框 -->
    <el-dialog title="运单合规确认" :visible.sync="dialogControl.visible" class="dialogControl">
      <el-row>
        <el-col :span="24">
          <p class="p_tit">共选择{{dialogControl.num}}条运单，确认运单是否合规？</p>
          <br/>
        </el-col>
        <el-col :span="24" class="col-bottom">
          <el-radio-group v-model="dialogControl.status">
            <el-radio label="yes">合规</el-radio>
            <el-radio label="no">不合规</el-radio>
          </el-radio-group>
        </el-col>
        <el-col :span="24">
          <el-col :span="2">
            备注：
          </el-col>
          <el-col :span="22">
            <el-input type="textarea" v-model="dialogControl.des" placeholder="请输入内容"></el-input>
          </el-col>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogControl.visible = false">取消</el-button>
        <el-button @click="netWorkUpdateComplianceStatus" :disabled="dialogControl.btnDisabled">确定</el-button>
      </span>
    </el-dialog>
    <!-- 开票确认的弹框 -->
    <el-dialog title="提示" :visible.sync="dialogInvoice.visible" class="dialogControl">
      <el-row>
        <el-col :span="24">
          <p class="p_tit">确认本账单已开票完成了吗？</p>
          <br/>
        </el-col>
        <el-col :span="24">
          <el-col :span="2">
            备注：
          </el-col>
          <el-col :span="22">
            <el-input type="textarea" v-model="dialogInvoice.des" placeholder="请输入内容" :rows="2" :autosize="{ minRows: 2 }"></el-input>
          </el-col>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogInvoice.visible = false">取消</el-button>
        <el-button @click="netWorkInvoice" :disabled="dialogInvoice.btnDisabled">确定</el-button>
      </span>
    </el-dialog>
    <!-- 撤回开票的弹框 -->
    <el-dialog title="提示" :visible.sync="dialogRevokeInvoice.visible" class="dialogControl">
      <el-row>
        <el-col :span="24">
          <p class="p_tit">确认撤回本账单的开票状态吗？</p>
          <br/>
        </el-col>
        <el-col :span="24">
          <el-col :span="2">
            备注：
          </el-col>
          <el-col :span="22">
            <el-input type="textarea" v-model="dialogRevokeInvoice.des" placeholder="请输入内容"></el-input>
          </el-col>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogRevokeInvoice.visible = false">取消</el-button>
        <el-button @click="netWorkRevokeInvoice" :disabled="dialogRevokeInvoice.btnDisabled">确定</el-button>
      </span>
    </el-dialog>
    <!-- 收款确认的弹框 -->
    <el-dialog title="提示" :visible.sync="dialogReceive.visible" class="dialogControl">
      <el-row>
        <el-col :span="24">
          <p class="p_tit">确认本账单已收款完成了吗？</p>
          <br/>
        </el-col>
        <el-col :span="24">
          <el-col :span="2">
            备注：
          </el-col>
          <el-col :span="22">
            <el-input type="textarea" v-model="dialogReceive.des" placeholder="请输入内容"></el-input>
          </el-col>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogReceive.visible = false">取消</el-button>
        <el-button @click="netWorkReceive" :disabled="dialogReceive.btnDisabled">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import TableActionBtn from './create/table-action-btn.vue';
import TableList from './create/table-list.vue';
import VTableSearch from '../../components/ele-list/eleMinTableSearch.vue';
import TablePage from '../../components/ele-list/elePage.vue';
import logs from '../../logs/list.vue';
import invoice from './invoice.vue';

import ApiConst from '../../../api/ApiConst';
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
import eleBlock from '../../components/ele-block/eleBlock.vue';
import {
  getParam,
  getParamsFromURL,
  checkPermission
} from '../../../api/Utils';
import * as SettleBillService from '../../../api/PlatformSettleBillService';

import {
  // goodsNumber,
  // goodsVolume,
  // goodsWeight,
  carrierPrice,
  goodsPrice,
  chargeItemNumber,
  getAll
} from '../../../api/DataSourceService';

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
      objectName: localStorage.getItem('orgType') == '1' ? '应收客户账单管理' : '应付平台账单',
      loading: false,
      miniFields: [],
      allFields: [],
      isMini: true,
      searchFields: [],
      // 合规的弹框
      dialogControl: {
        visible: false,
        num: 0,
        status: null,
        btnDisabled: false,
        codes: [],
        des: ''
      },
      // 开票确认的弹框
      dialogInvoice: {
        visible: false,
        btnDisabled: false,
        des: ''
      },
      // 撤回开票的弹框
      dialogRevokeInvoice: {
        visible: false,
        btnDisabled: false,
        des: ''
      },
      // 确认收款的弹框
      dialogReceive: {
        visible: false,
        btnDisabled: false,
        des: ''
      },
      actionList: [],
      shwBtnList: [],
      carrierPriceData: [],
      goodsPriceData: [],
      goodsLossData: [],
      chargeItemNumberData: [],
      unitData: [],

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
        },
        // {
        //   text: '调整结算方式',
        //   key: 'settleMethod'
        // }, {
        //   text: '调整每单定额',
        //   key: 'adjustmentQuota'
        // },{
        //   text: '调整运价税型',
        //   key: 'ratesTaxType'
        // }, {
        //   text: '调整客户税率',
        //   key: 'taxRate'
        // },
        {
          text: '导出运单明细',
          key: 'export'
        },
        {
          text: '运单合规确认',
          key: 'waybillAffirm'
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

        //  结算方式
        complianceStatus(value, field) {
          const formats = {
            yes: '合规',
            no: '不合规',
            pend: '待确认'
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
        // 货差超标量
        settleGoodsLossVolume(value, field) {
          const dwKey = `${field.fieldConfigCode}UnitCodeAsyncValue` || '',
            dwValue = `${value[dwKey]}` || '';
          return `${value[field.fieldConfigCode]}${dwValue}`;
        },
        // // 实际货差比例
        actualGoodsLossRatio(value, field) {
          return `${value[field.fieldConfigCode]}‰`;
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
        }
      },
      layoutFields: {},
      // 调整各种类型的接口全部以类型为key的形式定义，在调用的时候直接调用此对象[类型]即可
      tableCellActions: {

        // 调整每单定额
        adjustmentQuota: (data, cb) => {
          SettleBillService.settlePayableWaybillAdjustQuota(data, cb);
        },
        // 调整每单比例
        adjustmentProportion: (data, cb) => {
          SettleBillService.settlePayableWaybillAdjustRatio(data, cb);
        },
        // 调整客户税率
        taxRate: (data, cb) => {
          SettleBillService.settlePayableWaybillAdjustTaxRates(data, cb);
        },
        // 编辑备注描述
        description: (data, cb) => {
          SettleBillService.settlePayableWaybillEditDescription(data, cb);
        },
        // 调整结算方式
        settleMethod: (data, cb) => {
          SettleBillService.settlePayableWaybillAdjustSettleMethod(data, cb);
        },
        // 调整运价税型
        ratesTaxType: (data, cb) => {
          SettleBillService.settlePayableWaybillAdjustTaxType(data, cb);
        },
        // 移除
        remove: (data, cb) => {
          if (this.params.billCode) {
            data.billCode = this.params.billCode;
          }
          delete data.clientOrgName;
          SettleBillService.settlePayableWaybillRemove(data, cb);
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
        billstatus: '',
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

        paymentSubtotalAmount: '',
        paymentDriverSubtotalAmount: '',
        paymentTradeSubtotalAmount: '',
        payerMessage: '',
        totalTruck: '',
        complianceTruck: '',
        nonComplianceTruck: '',
        pendTruck: '',
        attachmentResourceCode: '',
        totalLoadingWeight: 0,  // 发货重量合计
        totalLoadingNum: 0,  // 发货数量合计
        totalLoadingVolume: 0,  // 发货体积合计
        totalUnloadingWeight: 0,  // 收货重量合计
        totalUnloadingNum: 0,    // 收货数量合计
        totalUnloadingVolume: 0    // 收货体积合计
      }
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
      this.$refs.form.resetForm();
    },
    // 确认开票
    netWorkInvoice() {
      const code = this.params.billCode;
      SettleBillService.settlePayableInvoice(code, { description: this.dialogInvoice.des }, (success, error) => {
        this.dialogInvoice.visible = false;
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
        }
        // 操作完毕刷新
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      });
    },
    netWorkRevokeInvoice() {
      const code = this.params.billCode;
      SettleBillService.settlePayableRevokeInvoice(code, { description: this.dialogRevokeInvoice.des }, (success, error) => {
        this.dialogRevokeInvoice.visible = false;
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
            message: '撤回开票成功！',
            duration: 1000
          });
        }
        // 操作完毕刷新
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      });
    },
    // 确认收款
    netWorkReceive() {
      const code = this.params.billCode;
      SettleBillService.settlePayableReceived(code, { description: this.dialogReceive.des }, (success, error) => {
        this.dialogReceive.visible = false;
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
            message: '确认收款成功！',
            duration: 1000
          });
        }
        // 操作完毕刷新
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      });
    },
    // 合规状态 网络请求
    netWorkUpdateComplianceStatus() {
      if (this.dialogControl.status == 'yes' || this.dialogControl.status == 'no') {
        let numAll = this.batchCodeList.length;
        let numSuc = 0;
        let numFail = 0;
        this.loading = true;
        for (let i = 0; i < numAll; i++) {
          let item = this.batchCodeList[i];
          let Parma = { code: item, complianceStatus: this.dialogControl.status, complianceDescription: this.dialogControl.des };
          SettleBillService.settlePayableWaybillupdateComplianceStatus(Parma, (success, error) => {
            if (error) {
              numFail++;
            }
            if (success) {
              numSuc++
              // that.$refs.eleList.dispatchQueryEvent();
            }
            if (numAll == numSuc + numFail) {
              this.loading = false;
              this.dialogControl.des = '';
              this.dialogControl.visible = false;
              this.dialogControl.status = null;

              this.$message({
                type: 'success',
                message: `共请求了${numAll}个，成功${numSuc}个, 失败${numFail}个`,
                duration: 1000
              });
              this.netWorkWaybillRefresh();
            }
          });
        }
      }
    },
    // 请求合规后的请求
    netWorkWaybillRefresh() {
      let code = this.params.billCode;
      SettleBillService.settlePayableWaybillRefresh(code, (success, error) => {
        if (error) {
          this.$message({
            type: 'success',
            message: error.content,
            duration: 1000
          });
        }
        if (success) {
          // this.$refs.eleList.dispatchQueryEvent();
          window.location.reload();
        }
      });

    },
    actionMethod(key) {
      switch (key) {
        case 'applyApprove':
          {
            this.applyApprove();
          }
          break;
        case 'onEditForm':
          {
            this.onEditForm();
          }
          break;
        case 'destroy':
          {
            this.destroy();

          }
          break;
        case 'revokeConfirm':
          {
            this.revokeConfirm();
          }
          break;
        case 'receive':
          {
            // this.receive();
            this.dialogReceive.visible = true;
            this.dialogReceive.des = '';
            this.dialogReceive.btnDisabled = false;
          }
          break;
        case 'revokeApply':
          {
            // this.revokeApply();
            this.revokeApprove();
          }
          break;
        case 'invoice':
          {
            // this.invoice();
            // this.netWorkInvoice();
            this.dialogInvoice.visible = true;
            this.dialogInvoice.des = '';
            this.dialogInvoice.btnDisabled = false;
          }
          break;
        case 'revokeInvoice':
          {
            // this.revokeInvoice();
            this.dialogRevokeInvoice.visible = true;
            this.dialogRevokeInvoice.des = '';
            this.dialogRevokeInvoice.btnDisabled = false;
          }
          break;

        default:
          {

          }
      }
    },

    // 撤回开票 需要传入 code
    revokeInvoice(code) {
      code = this.params.billCode;
      const that = this;
      this.$msgbox({
        title: '提示',
        message: '您确认撤回开票吗？',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = '执行中...';
            settlePayableRevokeInvoice(code, (success, error) => {
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
                  message: '撤回开票成功！',
                  duration: 1000
                });
                instance.confirmButtonLoading = false;
                done();
                that.$refs.eleList.dispatchQueryEvent();
              }
            });
          } else {
            done();
          }
        }
      });
    },
    // 确认收款
    receive(code) {
      code = this.params.billCode;
      const that = this;
      this.$msgbox({
        title: '提示',
        message: '您确认已经收款了吗？',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = '执行中...';
            SettleBillService.settlePayableReceived(code, (success, error) => {
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
                  message: '确认收款成功！',
                  duration: 1000
                });
                instance.confirmButtonLoading = false;
                done();
                that.$refs.eleList.dispatchQueryEvent();
              }
            });
          } else {
            done();
          }
        }
      });
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
    // 导出功能  新建 与 编辑
    exportDataBrokerWaybillTemp() {

      let searchData = this.searchData;
      delete searchData.clientOrgCode;
      delete searchData.platformClientOrgCode;
      delete searchData.clientOrgName;

      let params = searchData;
      params.size = this.page_info.total;

      SettleBillService.settlePayableSelectedWaybillColumns((success) => {
        const paramsObj = {
          params: params,
          configList: success.content
        };
        // paramsObj["params"].obj = 'customerSummary';
        SettleBillService.settlePayableSelWaybillExportCsvBrokerWaybillTemp(paramsObj, (success) => {
          window.location.href = success.content.url;
        });
      });
    },
    //导出功能  详情
    exportDataBrokerWaybill() {
      let searchData = this.searchData;
      delete searchData.clientOrgCode;
      delete searchData.platformClientOrgCode;
      delete searchData.clientOrgName;

      let params = searchData;
      params.size = this.page_info.total;

      SettleBillService.settlePayableSelectedWaybillColumns((success) => {
        const paramsObj = {
          params: params,
          configList: success.content
        };
        // paramsObj["params"].obj = 'customerSummary';
        SettleBillService.settlePayableSelWaybillExportCsvBrokerWaybill(paramsObj, (success) => {
          window.location.href = success.content.url;
        });
      });
    },



    /**
     * 表格上面的一排按钮点击事件
     * @param btn 当前点击的按钮配置信息
     */
    onTableActionBtnClick({
      btn
    }) {
      if (btn.key == 'waybillAffirm') {
        if (!this.batchCodeList.length) {
          this.$message.warning('请选择至少一条数据！');
        } else {
          this.dialogControl.num = this.batchCodeList.length;
          this.dialogControl.visible = true;
        }
        return;
      }

      if (btn.key !== 'export') {
        if (!this.batchCodeList.length) {
          this.$message.warning('请选择至少一条数据！');
        } else {
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
        // 导出数据 ...
        if (this.readonly) { //详情
          this.exportDataBrokerWaybill();
        } else {
          this.exportDataBrokerWaybillTemp();
        }

        // const params = {
        //   page: 1,
        //   size: 6000
        // };
        // if (this.params.billCode) {
        //   params.billCode = this.params.billCode;
        //   if (this.readonly) {
        //     params.tableType = 'contrast';
        //   }
        // } else {
        //   params.clientOrgName = this.params.clientOrgName;
        // }
        // console.log('export settlePayableSelWaybillExportCsv request params：', params);
        // SettleBillService.settlePayableSelWaybillExportCsv(params, (success, error) => {
        //   if (error) {
        //     this.$message.error(error.content);
        //   }
        //   if (success) {
        //     console.log(success);
        //     window.location.href = success.content.url;
        //   }
        // });
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
    // 不用了，后面删除
    addReceive() {},
    // 确认开票
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
            SettleBillService.settlePayableInvoice(code, (success, error) => {
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
            SettleBillService.settlePayableCancel(code, (success) => {
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
      // 判断是否配置合规字段
      const complianceCheck = JSON.parse(localStorage.getItem('appInfo')).complianceCheck; // 合规状态
      // 如果是有合规字段
      if (complianceCheck === 'TRUE') {
        // 1.需要确认 全部都是合规的
        let mark = true;
        this.list.forEach(item => {
          if (item.complianceStatus != 'yes') {
            mark = false;
          }
        });
        if (!mark) {
          this.$message({
            type: 'success',
            message: '有不合规的项目，请检查',
            duration: 1000
          });
          return;
        }
      } else {
        console.log('合规字段配置为FALSE，则不需要检查列表的合规字段');
      }
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
            SettleBillService.settlePayableApprove(this.params.billCode, {
              billStatus: 'accept',
              description: data.approveRemark
            }, (success, error) => {
              if (error) {
                this.$message({
                  type: 'error',
                  message: error.content,
                  duration: 1000
                });
              }
              if (success) {
                this.submitData.billstatus = 'accept';
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
            SettleBillService.settlePayableApprove(this.params.billCode, {
              billStatus: 'reject',
              description: data.approveRemark
            }, (success, error) => {
              if (error) {
                this.$message({
                  type: 'error',
                  message: error.content,
                  duration: 1000
                });
              }
              if (success) {
                this.submitData.billstatus = 'reject';
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
            SettleBillService.settlePayableRevokeApprove(code, (success, error) => {
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
                this.submitData.billstatus = 'pend';
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
            SettleBillService.settlePayableApplyApprove(code, (success, error) => {
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
                this.submitData.billstatus = 'pend';
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
            SettleBillService.settlePayableRevokeApplyApprove(code, (success, error) => {
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
                this.submitData.billstatus = 'none';
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
    // 不用了，后面删
    sendBill() {
      // const code = this.params.billCode;
      // this.$msgbox({
      //   title: '提示',
      //   message: '您确认发送账单给客户吗？',
      //   showCancelButton: true,
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   beforeClose: (action, instance, done) => {
      //     if (action === 'confirm') {
      //       instance.confirmButtonLoading = true;
      //       instance.confirmButtonText = '执行中...';
      //       SettleBillService.settlePayableSendBill(code, (success, error) => {
      //         if (error) {
      //           this.$message({
      //             type: 'success',
      //             message: error.content,
      //             duration: 1000
      //           });
      //         }
      //         if (success) {
      //           this.$message({
      //             type: 'success',
      //             message: '发送账单成功！',
      //             duration: 1000
      //           });
      //           this.$set(this.submitData, 'clientConfirmStatus', 'pend');
      //           // this.submitData.clientConfirmStatus = 'pend';
      //           console.log('new submitData is', this.submitData);
      //           console.log('new submitData clientConfirmStatus is', this.submitData.clientConfirmStatus);
      //           instance.confirmButtonLoading = false;
      //           done();
      //         }
      //         // 操作完毕刷新
      //         setTimeout(() => {
      //           window.location.reload();
      //         }, 3000);
      //       });
      //     } else {
      //       done();
      //     }
      //   }
      // });
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
         SettleBillService[this.readonly ? 'settlePayableSelectContractWaybillList' : 'settlePayableSelectSelectedWaybillList'](this.searchData, (success, error) => {
         */
        let searchData = this.searchData;
        delete searchData.clientOrgCode;
        delete searchData.platformClientOrgCode;
        delete searchData.clientOrgName;

        // if (this.readonly) {
        //   // searchData.billCode = this.searchData.billCode;
        // } else {
        //   searchData = this.searchData;
        // }

        SettleBillService[this.readonly ? 'settlePayableRelationWaybillList' : 'settlePayableSelectSelectedWaybillList'](searchData, (success, error) => {
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
                this.goodsLossData.forEach((uc) => {
                  if (uc.id === item.meterageType) {
                    item.actualGoodsLossUnitCodeAsyncValue = uc.name;
                  }
                });

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

              // settleGoodsLossVolume  货差超标量 settleGoodsLossVolume
              if (item.settleGoodsLossVolume && item.meterageType) {
                this.unitData.forEach((uc) => {
                  if (uc.id === item.meterageType) {
                    item.settleGoodsLossVolumeUnitCodeAsyncValue = uc.name;
                  }
                });
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
        SettleBillService.settlePayableGet(this.params.billCode, (success, error) => {
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
        SettleBillService.settlePayableSelectedWaybillColumns((success, error) => {
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
      });
    },

    /**
     * 获取运单列表搜索配置
     * @returns {Promise}
     */
    onGetSearchFields() {
      SettleBillService.settlePayableSelectedWaybillSearch(({
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
            this.dealWithFieldMin();
          });
        } else {
          this.$message.error(content);
        }
      });
    },
    onBack() {
      // window.history.back();
      const path = '/platform/settleBillPayable/select_waybill.html?',
        query = this.params.billCode ? `billCode=${this.params.billCode}` : `orgCode=${this.params.clientOrgCode}&orgName=${this.params.clientOrgName}&platformOrgCode=${this.params.platformClientOrgCode}&isBack=true`;
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
      window.location.href = `/platform/settleBillPayable/select_waybill.html?billCode=${this.params.billCode}`;
    },

    /**
     * 添加和修改应收账单信息
     * @returns {Promise}
     */
    onSubmit() {
      // console.log('this.submitData', this.submitData);
      // 添加
      const appInfo = JSON.parse(localStorage.getItem('appInfo')), // 核心组织数据来源
        userInfo = JSON.parse(localStorage.getItem('userInfo')); // 当前企业数据来源

      //付款方 - 当前组织
      // 付款方现在还是 带进来的 在url 上面拿 7/31 by需求
      // this.submitData.platformPayerOrgCode = userInfo.orgCode;
      // this.submitData.payerOrgCode = userInfo.orgCode;
      // this.submitData.payerOrgName = userInfo.orgFullName;

      // // billCode 是详情的，不用改 ，
      // if(!getParamsFromURL(window.location.search).billCode && !getParamsFromURL(window.location.search).code){ // 新建的时候 才会去地址栏去拿
      //    this.submitData.platformPayerOrgCode = getParamsFromURL(window.location.search).clientOrgCode;
      //   this.submitData.payerOrgCode = getParamsFromURL(window.location.search).clientOrgCode;
      //    this.submitData.payerOrgName = getParamsFromURL(window.location.search).clientOrgName;
      // }

      // console.log('jjjjj ',this.submitData,getParamsFromURL(window.location.search));

      console.log('submitData 1111', this.submitData, getParamsFromURL(window.location.search));

      if (!this.submitData.payerOrgCode) {
        this.submitData.payerOrgCode = getParamsFromURL(window.location.search).clientOrgCode;
      }
      // 此处 要变成
      if (!this.submitData.platformPayerOrgCode) {
        this.submitData.platformPayerOrgCode = getParamsFromURL(window.location.search).platformClientOrgCode;
      }

      if (!this.submitData.payerOrgName) {
        this.submitData.payerOrgName = getParamsFromURL(window.location.search).clientOrgName;
      }

      //收款方 - 平台
      this.submitData.platformPayeeOrgCode = appInfo.coreOrgCode;
      this.submitData.payeeOrgCode = appInfo.coreOrgCode;
      this.submitData.payeeOrgName = appInfo.coreOrgFullName;


      return new Promise((resolve, reject) => {
        if (!this.params.billCode) {
          SettleBillService.settlePayableAdd(this.submitData, (success, error) => {
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
          console.log('settlePayableEdit tempData:', tempData);
          tempData.code = this.params.billCode;

          console.log('canshu ...', this.submitData);

          SettleBillService.settlePayableEdit(tempData, (success, error) => {
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
    //        SettleBillService.settlePayableActualReceiptLogList({
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
      SettleBillService.settlePayableApproveList({
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

      // this.showData.selfName = userInfo.orgFullName;
      // let abc = getParamsFromURL(window.location.search).orgName;
      // let df = paramsObj.clientOrgName;
      // console.log('hahahhah ....',abc,df);
      this.showData.selfName = paramsObj.clientOrgName;

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
          this.setBtnShow();
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
    //吨 方 件
    onUnitData() {
      return new Promise((resolve, reject) => {
        getAll(['goodsNumber', 'goodsVolume', 'goodsWeight'], {}, (res) => {
          if (res) {
            this.unitData = res;
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
          this.onUnitData().then(() => {
            this.onGetGoodsPriceData().then(() => {
              this.onGetFields().then(() => {
                this.onGetList();
              });
              this.onGetSearchFields();
              if (!this.readonly) {
                this.$refs.CreateComputed.onUpdateStatis();
              }
            });
          })
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
    setBtnShow() {
      const actionList = [],
        orgType = localStorage.getItem('orgType');
      // S端（orgType = 1）的权限：
      // 应付平台管理
      // 查看列表  opr.wuche.settleBillPayable
      // 审核账单  opr.wuche.checkSettleBillPayable
      // 撤销审核  opr.wuche.repealCheck
      // 收款确认  opr.wuche.confirmReceipt
      // 开票确认  opr.wuche.confirmInvoice
      // 撤回开票  opr.wuche.repealInvoice

      // B（orgType = 3）/b（orgType = 2）的权限：
      // 创建应付账单  wuche.SettleBillPayable.add
      // 应付平台管理
      // 查看列表  wuche.settleBillPayable.get
      // 编辑账单  wuche.settleBillPayable.edit
      // 作废账单  wuche.settleBillPayable.invalid
      // 提交审核  wuche.settleBillPayable.submit

      let data = this.submitData;
      if (orgType != 1) {
        // 账单状态为待提交审核或审核不通过
        if (data.billStatus === 'none' || data.billStatus === 'reject') {
          // 提交审核
          if (checkPermission("wuche.settleBillPayable.submit")) {
            actionList.push({ key: 'applyApprove', name: '提交审核' });
          }
          // 编辑账单
          if (checkPermission("wuche.settleBillPayable.edit")) {
            actionList.push({ key: 'onEditForm', name: '编辑账单' });
          }
          // 作废账单
          if (checkPermission("wuche.settleBillPayable.invalid")) {
            actionList.push({ key: 'destroy', name: '作废账单' });
          }
        }
      } else {
        // 账单状态为待审核
        if (data.billStatus === 'pend') {
          // 审核账单
          if (checkPermission("opr.wuche.checkSettleBillPayable")) {
            actionList.push({ key: 'revokeConfirm', name: '审核账单' });
          }
        }
        // 账单状态为审核通过
        if (data.billStatus === 'accept') {
          // 未收款
          if (data.receivableStatus === 'none') {
            // 收款确认  新加的
            if (checkPermission("opr.wuche.confirmReceipt")) {
              actionList.push({ key: 'receive', name: '收款确认' });
            }
            // 撤回审核
            if (checkPermission("opr.wuche.repealCheck")) {
              actionList.push({ key: 'revokeApply', name: '撤回审核' });
            }
          }
          // 收款完成且未开票
          if (data.receivableStatus === 'all' && data.invoiced === 'no') {
            // 开票确认
            if (checkPermission("opr.wuche.confirmInvoice")) {
              actionList.push({ key: 'invoice', name: '开票确认' });
            }
          }
          // 收款完成且开票完成
          if (data.receivableStatus === 'all' && data.invoiced === 'yes') {
            // 撤回开票   新加
            if (checkPermission("opr.wuche.repealInvoice")) {
              actionList.push({ key: 'revokeInvoice', name: '撤回开票' });
            }
          }
        }
      }
      this.actionList = actionList;
    },

    showButtons() {
      console.log('page mounted and data is', this.submitData);
      // 账单状态 billstatus（none/pend/accept/reject/destroy/待提交审核/待审核/审核通过/审核不通过/已作废）
      // 发送状态 billAffirmStatus（none/pend/未发送/已发送）
      // 对方确认状态 payableBillStatus（none/pend/accept/reject/destroy/待对方确认/待审核/对方确认通过/对方确认不通/已作废）
      // 开票状态 invoiced（yes/no/已开票/未开票）
      // 收款状态 receivableStatus（none/part/all/未收款/部分收款/全部收款）

      // 账单为待提交审核 或 审核不通过
      if (this.submitData.billstatus === 'none' || this.submitData.billstatus === 'reject') {
        this.showApplyApprove = true; // 提交审核
        this.showEdit = true; // 编辑账单
        this.showDestroy = true; // 作废账单
      }

      // 账单为待审核
      if (this.submitData.billstatus === 'pend') {
        this.showRevokeConfirm = true; // 审核账单
        this.showRevokeApply = true; // 撤回提交审核
      }

      // 账单为审核通过
      if (this.submitData.billstatus === 'accept') {
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
      if (this.submitData.billstatus === 'destroy') {
        // 没有操作
      }
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
@import "../../assets/sass/rl-fixed-table.min.scss";
@import "../../assets/sass/base.scss";

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


// .search-form {
//   .el-form-item {
//     width: 50%;
//     margin-right: 0;
//     .el-form-item {
//       width: 100%;
//       &:last-child {
//         margin-left: 0 !important;
//       }
//     }
//     &:nth-child(4),
//     &:nth-child(5) {
//       width: 50%;
//     }
//     &:last-child {
//       margin-left: 90px;
//     }
//     .el-form-item__label {
//       width: 88px;
//       padding-left: 5px;
//       padding-right: 5px;
//     }
//     .el-date-editor.el-input {
//       width: 174px;
//     }
//     .complex-control-3 {
//       .innerblock {
//         margin-right: 5px;
//       }
//     }
//   }
// }

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
