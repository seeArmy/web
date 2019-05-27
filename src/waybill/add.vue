/** * add.vue 运单页面 * Created by cc on 17/8/10. */
<template>
  <div>
    <div class="form-page">
      <ele-form :domainObject="domainObject" ref="form" :configUrl="configUrl" :listUrl="listUrl" :listTitle="listTitle" :getInfo="getInfo" :addFun="addFun" :editFun="editFun" :editable="editable" :isEdit="isEdit" @formReady="formReady" @editSuccess="editSuccess" @submitDone="submitDone" @formMounted="formMounted" :objectName="objectName" label-width="100px" :inline="false" :folder="folder">
        <layout :domainObject="domainObject" :isEdit="isEdit" :editable="editable" :objectName="objectName" :showLoadingUnloading="showLoadingUnloading" :disableModeSelect="disableModeSelect" :clientDetailColumns="clientDetailColumns" :fromDispatch="fromDispatch">
          <div v-for="field in fields" :slot="field.fieldConfigCode" v-if="checkPms(field)">
            <el-form-item :label="field.showName" :required="field.required ==='true'">
              <ele-block :field="field" :domainObject="domainObject" :editable="editable" :uploadUrl="uploadUrl" :inputKey="inputKey"></ele-block>
            </el-form-item>
          </div>
          <el-button type="primary" v-check-permission="'waybill.edit'" v-show="!editable && isEdit && domainObject.settleStatus !== 'pass'" @click="editForm()" slot="buttonEdit">编辑</el-button>
          <el-button v-show="editable && isEdit" @click="cancelEdit()" slot="buttonCancel">取消编辑</el-button>
          <el-button v-show="editable && isEdit" @click="submitForm('form')" slot="buttonSave">保存</el-button>
          <!--<el-button v-show="!editable && isEdit" @click="changeLog()" slot="buttonChangeLog">{{ objectName }}变更记录</el-button>-->
          <div class="agree-box" slot="agree">
            <!-- 去除委托调车客户服务协议 7-24 需求 by zhang -->
            <!-- <el-checkbox v-model="agree" v-if="editable">同意<a :href="agreementUrl" class="blue" target="_blank">《{{agreementName}}》（点击查看）</a></el-checkbox>
            <span v-if="!editable">已同意<a :href="agreementUrl" class="blue" target="_blank">《{{agreementName}}》（点击查看）</a></span> -->
            <br>
            <br>
            <span v-if="!editable">已同意<a :href="driverAgreementUrl" class="blue" target="_blank">《{{driverAgreementName}}》（点击查看）</a></span>
          </div>
          <el-button v-show='editable && !isEdit' type="primary" @click="submitForm('form')" size="large" slot="buttonSubmit" :disabled="btnDisabled">提交</el-button>
          <el-button v-show='editable && !isEdit' @click="resetForm()" size="large" slot="buttonReset" :disabled="btnDisabled">重置</el-button>
          <!-- <charge-list :uploadUrl="uploadUrl" :domainObject="domainObject" :waybillCode="code" :editable="editable" :showBtn="true" slot="slotChargeList" :isWaybill="true">
          </charge-list> -->
          <!--           <invoice-list slot="slotInvoiceList" :waybill-code="code" v-if="showInvoiceList"></invoice-list> -->

          <!-- 费用科目 start -->
          <div slot="slotChargeList">
            <eleChargeItem ref="eleChargeItem" :isEdit='isEdit' :editable='editable' :defaultEdit="false" :uploadUrl="uploadUrl" :getColumn="getColumnChargeItem" :listData="listDataChargeItem" @queryChargeItem="queryChargeItem" @submitChargeRecord="submitChargeRecord" @cancelChargeSubmit="cancelChargeSubmit" @chargeAction="handleChargeAction" @chargeItemSingleListValueChange="chargeItemSingleListValueChange" :domainObject="domainObject"></eleChargeItem>
          </div>
          <!-- 费用科目 end -->

          <!-- 货单表格 start -->
          <div slot='manifestModule'>
            <eleManifestList ref='eleManifest' v-if="showManifestList" :showTopTab='showManifestListTop' :isEdit='isEdit' :editable='editable' @hasValueChange='hasValueChange' :getColumn='getColumnManifest' :listData='listDataManifest' :editableFields=editableFields @query="query" @eleManifestMounted='eleManifestMounted' @fieldChange='fieldChange' :loadingMode='loadingMode'>
            </eleManifestList>
          </div>
          <!-- 货单表格 end   -->
          <logs slot="tabChangeLog" :selectable="false" :operatable="false" :domain="uploadUrl" :type="logType" :code="code" :isAdvanced="false" :params="changeLogParams" :needPage="true">
          </logs>
          <!--<voucher-list slot="tabVoucherList" :waybill-code="code" :upload-url="uploadUrl"></voucher-list>-->
          <evaluate slot="tabEvaluate" :evaluateObject="evaluateObject" :domainObject="domainObject"></evaluate>
          <logisticsReference ref="logisticsReference" slot="logisticsReference" :domainObject="logisticsReferenceObject" v-if="showLogisticsReference"></logisticsReference>
        </layout>
      </ele-form>
      <!-- dialog -->
      <el-dialog :title="agreementName" :visible.sync="dialogVisible" size="large">
        <div class="rules-frame">
          <iframe :src="agreementUrl" frameborder="0" scrolling="auto" class="rule-frame"></iframe>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">再考虑一下</el-button>
          <el-button type="primary" @click="confirmSubmit()" :disabled="btnDisabled">同意提交</el-button>
        </span>
      </el-dialog>
      <!-- commonOpr dialog -->
      <commonOpr ref="commonOpr" :domainObject="domainObject" @refresh="handleRefresh"></commonOpr>
      <!-- offline dialog -->
      <offline ref="offline" :domainObject="domainObject" @refresh="handleRefresh"></offline>
      <!-- repulse dialog -->
      <repulse ref="repulse" :domainObject="domainObject" @refresh="handleRefresh"></repulse>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import layout from './layout.vue';
import eleBlock from '../components/ele-block/eleBlock.vue';
import eleForm from '../components/ele-form/eleForm.vue';
import chargeList from './chargeList.vue';
import invoiceList from './invoiceList.vue';
import voucherList from './voucherList.vue';
import logisticsReference from './logisticsReference.vue';

import commonOpr from './chargeDialog/commonOpr.vue';
import offline from './chargeDialog/offline.vue';
import repulse from './chargeDialog/repulse.vue';

import evaluate from './evaluate.vue';

import * as waybillService from '../../api/waybillService';
import * as LogisticsService from '../../api/LogisticsService';
import * as LbsService from '../../api/LbsService';
import { get as getOrgManager } from '../../api/OrgManagementService';
import { get as routeGet } from '../../api/RouteService';

import { get as truckGet } from '../../api/TruckService';
import { selfs } from '../../api/OrgService';

import ApiConst from '../../api/ApiConst';
import * as utils from '../../api/Utils';
import { getParamsFromURL, showMessageUtil, deepClone, getGoodsCategoryVal, getMeterageTypeByGoodsCategoryCode, getGoodsCategoryByKey, urlRedirect, checkPermission } from '../../api/Utils';


import logs from '../logs/list.vue';
import '../components/vueDirectives';
import eleManifestList from '../components/ele-manifest-list/eleManifestList.vue';
import { get as getDriverDetail } from '../../api/DriverService';
import Decimal from "decimal.js";


import eleChargeItem from '../components/ele-charge-item/eleChargeItem.vue';

import { getColumnManifestSingle, getColumnManifestMultiple, getManifestList, addWaybill, editWaybill,
  getColumnChargeItem, getChargeItemList, editChargeItemList, paybillGet, paybillWithdraw, calculateChargeAmount } from '../../api/waybillService';


// 当时从 订单列表 点击直接派车进来的时候，提交运单的时候   接口需要改变一下
let addFuncWayBill = utils.getParamsFromURL(window.location.search).logisticsCode ? waybillService.add_and_notify : waybillService.add;

export default {
  components: {
    'ele-form': eleForm,
    'layout': layout,
    'logs': logs,
    'charge-list': chargeList,
    'invoice-list': invoiceList,
    'voucher-list': voucherList,
    logisticsReference,
    evaluate,
    'ele-block': eleBlock,
    eleManifestList,
    eleChargeItem,
    commonOpr,
    offline,
    repulse
  },
  data() {
    return {
      listDataManifest: [],
      listDataManifestSingle: [],
      listDataManifestMultiple: [],
      editableFields: [],
      showManifestList: true,
      getColumnManifest: getColumnManifestSingle,
      showManifestListTop: false,
      manifestListCode: null, //货单的code
      temListDataManifest: [], // 临时存放 listData
      loadingMode: 'multiple',
      objectName: '运单',
      configUrl: `${ApiConst.apiWayBillDomain}/detail_render_info/waybill/list`,
      domainObject: {},
      addFun: addFuncWayBill,
      editFun: waybillService.edit,
      getInfo: waybillService.get,
      uploadUrl: ApiConst.apiWayBillDomain,
      logType: 'waybill',
      listUrl: '/waybill/list.html',
      listTitle: '运单列表',
      status: false,
      code: '',
      fields: [],
      isEdit: false, // 控制编辑添加按钮
      editable: true, // 控制页面状态
      btnDisabled: false,
      changeLogParams: {
        code: utils.getParamsFromURL(window.location.search).code,
        size: 10
      },
      showLoadingUnloading: true,
      loading: true,
      agree: true, //去除委托调车客户服务协议 7-24 需求 by zhang 此处直接给 true，很多地方就不需要修改了  
      agreementName: '',
      agreementUrl: '',
      dialogVisible: false,
      disableModeSelect: '',
      folder: 'waybill/waybill',
      defaultDetailColumns: [],
      actualDetailColumns: [],
      clientDetailColumns: [],
      dataOrgManager: null,
      copyDomainObject: null,
      driverAgreementUrl: '',
      driverAgreementName: '',
      fromDispatch: utils.getParamsFromURL(window.location.search).logisticsCode ? true : false,
      evaluateObject: {},
      showLogisticsReference: false,
      logisticsReferenceObject: {},
      projectName: '',
      getColumnChargeItem: getColumnChargeItem,
      listDataChargeItem: [],
      listDataChargeItemOriginal: [],
      isFirstLoad: true
    };
  },
  watch: {
    // 'isEdit': function(newVal, oldVal) {
    //   console.log('newVal is', newVal, 'oldVal is', oldVal);
    //   if (newVal) {
    //     this.disableSelectClient();
    //   }
    // }
  },
  computed: {
    // 是否显示 货单列表   新建不显示
    isShowEleManifestList() {
      const searchObj = utils.getParamsFromURL(window.location.search);
      const code = searchObj.code || searchObj.logisticsCode || searchObj.originalCode || '';
      return Boolean(code);
    },
    showInvoiceList() {
      // 是否显示货单
      if (JSON.parse(localStorage.getItem('webappConfig'))['webapp.showManifest'] === 'TRUE') {
        return true;
      }
      return false;
    }
  },
  methods: {
    checkPms(field) {
      let result = true;
      if (field.permissionCode) {
        result = checkPermission(field.permissionCode);
      }
      return result;
    },

    // methods 货单 start     ========================
    ruleRecombinationData(key1, key2, nameTip) {
      const val1 = this.domainObject[key1],
        val2 = this.domainObject[key2];
      if ((val1 && !val2) || (val2 && !val1)) {
        showMessageUtil('warning', `请检查${nameTip}，填写不完全`, 2000)
        return false;
      }
      return true;
    },
    delBatch(arrSave) {
      this.listDataManifestMultiple = arrSave;
    },
    fieldChange(key, indexMark) {},
    // 检验 eleManifest 里面的 必填  货物名称 goodsName
    checkRulesInEleManifest() {
      let mark = true,
        msg = '';
      let keys = ['goodsName', 'meterageType'];
      let meterageType = null;
      for (let i = 0; i < this.listDataManifest.length; i++) {
        let item = this.listDataManifest[i];
        if (!item[keys[0]]) {
          msg = '请检查货物名称，必须填写！';
          mark = false;
          break;
        }
        if (!item[keys[1]]) {
          msg = '请检查计量标准，必须填写！';
          mark = false;
          break;
        }
        if (0 === i) {
          meterageType = item['meterageType'];
        } else {
          if (meterageType !== item['meterageType']) {
            msg = '计量标准必须一致！';
            mark = false;
            break;
          }
        }
        // 检查 每一个 货物单价 的 数值和单位 
        if ((item.goodsPrice && !item.goodsPriceUnitCode) || (!item.goodsPrice && item.goodsPriceUnitCode)) {
          msg = '请检查货单中的 货物单价的值与单位必须填写不正确 ！';
          mark = false;
          break;
        }

      }
      if (!mark) {
        showMessageUtil('warning', msg, 2000)
      }
      return mark;
    },
    eleManifestMounted() {
      this.syncMeterageType();
    },
    dealWithLoadingMode(val) {
      // this.loadingMode = this.domainObject.loadingMode;
      this.loadingMode = 'multiple';

      this.showManifestList = false;
      if (val === 'single') {
        this.getColumnManifest = getColumnManifestSingle;
        this.listDataManifest = this.listDataManifestSingle;
      }
      if (val === 'multiple') {
        this.getColumnManifest = getColumnManifestMultiple;
        this.listDataManifest = this.listDataManifestMultiple;
        this.showManifestListTop = true;
      }
      this.$nextTick(() => {
        this.showManifestList = true;
      })
    },
    query() {
      let self = this;
      let logisticsCode = getParamsFromURL(window.location.search).code || getParamsFromURL(window.location.search).originalCode || '';
      if (logisticsCode) { //详情
        this.netGetManifestList(logisticsCode)
      } else { //新建
        // this.listDataManifest = [];
        if (this.listDataManifest.length < 1) {
          this.$nextTick(() => {
            if (this.$refs['eleManifest'] && this.$refs['eleManifest'].addRow) {
              this.$refs['eleManifest'].addRow();
            }
          })
        }
      }
    },
    queryChargeItem() {
      let self = this;
      let code = getParamsFromURL(window.location.search).code || getParamsFromURL(window.location.search).originalCode || '';
      if (code) { //详情
        this.netGetChargeItem(code);
      } else {
      }
    },
    // list date 有变化
    // 检测第一行的 货物分类有没有变化，有变化，那么就拿到货物总称 上面
    hasValueChange(list) {
      // 仅在新建页面同步
      // if (!this.isEdit) {
        let mapList = [{ key1: 'goodsCategory', key2: 'goodsName' }, { key1: 'goodsCategoryGb', key2: 'cargoTypeClassificationCode' }];

        mapList.forEach((item, index) => {
          // key1  是货物列表里面的字段 key2 是domain 里面的 字段
          const key1 = item.key1,
            key2 = item.key2;
          var val1 = null,
            val2 = null;
          if (this.temListDataManifest.length > 0 && this.temListDataManifest[0][key1]) {
            val1 = this.temListDataManifest[0][key1];
          }
          if (list.length > 0 && list[0][key1]) {
            val2 = list[0][key1];
          }
          if (val2 && (val2 !== val1)) {
            this.$set(this.domainObject, key2, val2)
          }
        })

        this.$nextTick(() => {
          this.syncMeterageType();
        })
        this.temListDataManifest = deepClone(list);
      // }
    
    },
    // 每次都检查 计量标准 
    syncMeterageType() {
      let self = this;
      let meterageType = null,
        mode = 'multiple';
      // mode = this.domainObject.loadingMode;
      if ('single' === mode) {
        // 取第一个
        let list0 = this.listDataManifest[0];
        meterageType = list0['meterageType'];
      }
      if ('multiple' === mode) {
        //多个的时候 去拿 数据
        let list0 = this.listDataManifest[0];
        // meterageType = getMeterageTypeByGoodsCategoryCode(list0['goodsCategory']);
        meterageType = list0['meterageType'];
        list0['meterageType'] = meterageType;
      }
      this.domainObject.meterageType = meterageType;
      // 页面中的需要计量标准的处理  客户运价 司机运价  clientFreightPriceUnitCode driverReferPriceUnitCode
      let keysFileld = ['clientFreightPriceUnitCode', 'driverPriceUnitCode'];
      keysFileld.forEach(key => {
        let el = this.$refs.form.getElementByField(key);
        if (el && el.onRefresh) {
          el.onRefresh({ codeUnitType: meterageType });
        }
      })
      this.listDataManifest.forEach((list, index) => {
        const refName = `tr${index}`,
          complexEl = self.$refs['eleManifest'].$refs[refName];
        if (complexEl && complexEl.length > 0) {
          let listCh = complexEl[0].$children;
          let child = null;
          for (let i = 0; i < listCh.length; i++) {
            let item = listCh[i];
            if (item.field && item.field.fieldConfigCode && item.field.fieldConfigCode === 'goodsPrice') {
              child = item;
              break;
            }
          }
          if (child) {
            // 每一行 都按照 自己的
            let meterageTypeIndex = list['meterageType'];
            child.$children[1].$children[0].onRefresh({ codeUnitType: meterageTypeIndex });
          }

          // 当合理货差系数 是按量的时候 执行 计量标准
          if (list.goodsLossMethod === 'goods.loss') {
            let childLoss = null;
            for (let i = 0; i < listCh.length; i++) {
              let item = listCh[i];
              if (item.field && item.field.fieldConfigCode && item.field.fieldConfigCode === 'freightLoss') {
                childLoss = item;
                break;
              }
            }
            if (childLoss) {
              let meterageTypeIndex = list['meterageType'];
              childLoss.$children[0].onRefrshSelect({ codeUnitType: meterageTypeIndex });
            }
          }
        }
      })
    },
    //同步线路信息到线路里面
    syncRouterInfo() {
      if (!this.domainObject.routeCode) { showMessageUtil('warning', '请选择要修改的线路', 2000); return; }
      const self = this;
      //key： 需要传的key  value：对应的 domainObject 中取值的 key
      const map = { code: 'routeCode', routeName: 'routeName', standardDistance: 'standardDistance', loadingOrgName: 'loadingOrgName', loadingLinkmanFullName: 'loadingLinkmanFullName', loadingContact: 'loadingUserPhone', loadingProvinceCode: 'loadingProvinceCode', loadingCityCode: 'loadingCityCode', loadingCountyCode: 'loadingCountyCode', loadingAddress: 'loadingAddress', unloadingOrgName: 'unloadingOrgName', unloadingLinkmanFullName: 'unloadingUserFullName', unloadingContact: 'unloadingUserPhone', unloadingProvinceCode: 'unloadingProvinceCode', unloadingCityCode: 'unloadingCityCode', unloadingCountyCode: 'unloadingCountyCode', unloadingAddress: 'unloadingAddress', businessTypeCode: 'businessTypeCode' };
      let paramObj = {};
      Object.keys(map).forEach(key => {
        paramObj[key] = self.domainObject[map[key]];
      })
      updateRoute(paramObj, (success, error) => {
        if (error) { showMessageUtil('warning', error.content, 2000) };
        if (success) { showMessageUtil('success', error.content, 2000) };
      })
    },
    // 网络请求：获取货单信息
    netGetManifestList(logisticsCode) {
      // let logisticsCode = getParamsFromURL(window.location.search).code;
      // if (!logisticsCode) { return; }
      if (!logisticsCode) { return; }
      getManifestList({ code: logisticsCode }, (success, error) => {
        if (success && success.content) {
          success.content.forEach((val) => {
            val.goodsNumUnitCode = val.goodsNumUnitCode || 'item';
            val.goodsWeightUnitCode = val.goodsWeightUnitCode || 'ton';
            val.goodsVolumeUnitCode = val.goodsVolumeUnitCode || 'cube';
          });
          this.listDataManifest = success.content;
          this.$nextTick(() => {
            if (this.$refs['eleManifest'] && this.$refs['eleManifest'].setColumnsDataMonitor) {
              this.$refs['eleManifest'].setColumnsDataMonitor();
            }
          })
        }
        if (error) { showMessageUtil('warning', error.content, 2000) };
      })
    },
    // 网络请求：获取费用科目信息
    netGetChargeItem(code) {
      if (!code) { return; }
      getChargeItemList({ waybillCode: code }, (success, error) => {
        if (success && success.content) {
          // this.listDataChargeItem = success.content;
          const tempArray = [];
          success.content.forEach((val, index) => {
            if (!val.chargeItemNumber) { val.chargeItemNumber = null; }
            if (!val.chargeItemPrice) { val.chargeItemPrice = null; }
            if (!val.chargeAmounts) { val.chargeAmounts = null; }
            // 处理列表数据
            const tempObj = {
              domainObject: {},
              editableFields: [],
              hideFields: [],
              checkRule: '',
              checkMsg: '',
              isRoot: !val.isRoot
            };
            tempObj.domainObject = val;
            // 默认可编辑的字段为相关附件及备注
            tempObj.editableFields = ['attachmentList', 'description'];
            const keyFields = [{ 'chargeItemNumberResource': 'chargeItemNumber' }, { 'chargeItemPriceResource': 'chargeItemPrice' }, { 'chargeItemAmountsResource': 'chargeAmounts' }];
            keyFields.forEach((obj) => {
              Object.keys(obj).forEach((k) => {
                if (val[k]) {
                  // 可输入
                  if (val[k] === 'input') {
                    tempObj.editableFields.push(obj[k]);
                  }
                  // 无
                  if (val[k] === 'none') {
                    tempObj.hideFields.push(obj[k]);
                  }
                }
              });
            });
            // 处理列表校验
            if ('chargeItemAmountsPrecision' in val) {
              // [0-9]{1,10}(\\\\.[0-9]{0,2})?
              // [0-9]{1,10}
              let v = val.chargeItemAmountsPrecision;
              switch(v) {
                case 0:
                  tempObj.checkRule = '[0-9]{1,10}';
                  tempObj.checkMsg = '请输入不超过15位的整数';
                  break;
                case 1:
                  tempObj.checkRule = '[0-9]{1,10}(\\.[0-9]{0,1})?';
                  tempObj.checkMsg = '不超过15位（最多1位小数）';
                  break;
                case 2:
                  tempObj.checkRule = '[0-9]{1,10}(\\.[0-9]{0,2})?';
                  tempObj.checkMsg = '不超过15位（最多2位小数）';
                  break;
              }
            }
            tempArray.push(tempObj);
          });
          this.listDataChargeItem = tempArray;
          this.listDataChargeItemOriginal = JSON.parse(JSON.stringify(tempArray));
          setTimeout(() => {
            this.$refs.eleChargeItem.dealWithFields();
          }, 1000);
        }
        if (error) { showMessageUtil('warning', error.content, 2000) };
      })
    },
    handleChargeAction(action, list, index) {
      console.log('page received chargeList action now', action, list, index);
      switch(action) {
        case 'clearRow':
          this.clearRow(list, index);
          break;
        case 'addRow':
          this.addRow(list, index);
          break;
        case 'delRow':
          this.delRow(list, index);
          break;
        case 'editRow':
        case 'modifyRow':
          this.$refs.commonOpr.open(action, list, index, '修改', this.listDataChargeItem[index].editableFields, this.listDataChargeItem[index].checkRule, this.listDataChargeItem[index].checkMsg);
          break;
        case 'createRow':
          this.$refs.commonOpr.open(action, list, index, '创建', this.listDataChargeItem[index].editableFields, this.listDataChargeItem[index].checkRule, this.listDataChargeItem[index].checkMsg);
          break;
        case 'applyRow':
          this.$refs.commonOpr.open(action, list, index, '申请支付');
          break;
        case 'auditRow':
          this.$refs.commonOpr.open(action, list, index, '审核支付');
          break;
        case 'payOnlineRow':
          this.payOnline(list);
          break;
        case 'payOfflineRow':
          this.$refs.offline.open(action, list, index, '线下支付提示');
          break;
        case 'repulseRow':
          this.$refs.repulse.open(action, list, index, '司机付款打回提示');
          break;
        case 'withdrawRow':
          this.withdrawRow(list, index);
          break;
        default:
          console.log('default action is ', action, list, index);
          break;
      }
    },
    chargeItemSingleListValueChange(index, list) {
      console.log('list index is', index, 'list is', list);
      // 金额来源方式为标准计算或者公式获取，才实时计算金额
      if (list.chargeItemAmountsResource && (list.chargeItemAmountsResource === 'standard' || list.chargeItemAmountsResource === 'expression') && list.chargeItemNumber && list.chargeItemPrice) {
        const paramsObj = {
            code: list.code,
            chargeItemNumber: list.chargeItemNumber,
            chargeItemPrice: list.chargeItemPrice
          };
        calculateChargeAmount(paramsObj, (success, error) => {
          if (error) {
            // showMessageUtil('warning', error.content, 3000);
            console.log('calculateChargeAmount error', error);
          }
          if (success) {
            const amount = success.content.result;
            this.listDataChargeItem[index].domainObject.chargeAmounts = amount;
          }
        });
      }
    },
    openWindow(url, title) {
      utils.urlRedirect(url, title);
    },
    handleRefresh() {
      console.log('refresh charge item now');
      this.queryChargeItem();
    },
    syncChargeFullKeys(listData) {
      const newListData = [],
        tempListData = JSON.parse(JSON.stringify(listData)),
        allKeys = [];
      tempListData.forEach((list) => {
        const val = list.domainObject;
        Object.keys(val).forEach((key) => {
          if (val[key] == null || val[key] == 'null') {
            val[key] = '';
          }
          if (!allKeys.includes(key)) {
            allKeys.push(key);
          }
        });
      });
      console.log('allKeys is', allKeys);
      tempListData.forEach((list) => {
        const val = list.domainObject;
        allKeys.forEach((v) => {
          if (v in val) {
            console.log('v is', v, 'val is', val);
          } else {
            val[v] = '';
          }
        });
        newListData.push(val);
      });
      console.log('newListData is', newListData);
      return newListData;
    },
    getChargeListData(listData) {
      const newListData = this.syncChargeFullKeys(listData),
        obj = {},
        ignoreKeys = ['id', 'disabled', 'deleted', 'remark', 'moduleCode', 'creatorUserCode', 'creatorUsername', 'createTime', 'updateUserCode', 'updateUsername', 'updateTime', 'ip', 'ownerUserCode', 'ownerOrgCode', 'ownerOrgName', 'synchronousId'],
        tempNewListData = JSON.parse(JSON.stringify(newListData)),
        waybillCode = utils.getParamsFromURL(window.location.search).code;
      tempNewListData.forEach((list, i) => {
        this.$set(list, 'businessCode', waybillCode); // 业务对象编码
        Object.keys(list).forEach((key) => {
          if (!ignoreKeys.includes(key)) {
            if (key in obj) {
              obj[key] += '@@' + list[key];
            } else {
              obj[key] = list[key] ? list[key] : '';
            }
          }
        });
      });
      console.log('tempNewListData ojb is', obj);
      return obj;
    },
    submitChargeRecord() {
      console.log('subumit record now');
      this.$refs.eleChargeItem.formValidate((valid) => {
        if (valid) {
          const waybillCode = utils.getParamsFromURL(window.location.search).code;
          const paramsObj = this.getChargeListData(this.listDataChargeItem);
          editChargeItemList(waybillCode, paramsObj, (success, error) => {
            if (error) {
              showMessageUtil('warning', error.content, 3000);
            }
            if (success) {
              showMessageUtil('success', '保存成功！', 3000);
              this.$refs.eleChargeItem.statusEditable = false;
              this.handleRefresh();
            }
          });
        } else {
          console.log('subumit record valid failed');
        }
      });
    },
    cancelChargeSubmit() {
      console.log('cancelEdit now');
      this.$refs.eleChargeItem.statusEditable = false;
      this.$nextTick(() => {
        this.listDataChargeItem = JSON.parse(JSON.stringify(this.listDataChargeItemOriginal));
      });
    },
    clearRow(list, index) {
      console.log('clear single row start here and the listData is', list, 'index is', index);
      const fields = this.listDataChargeItem[index].editableFields,
        data = this.listDataChargeItem[index].domainObject;
      Object.keys(data).forEach((k) => {
        if (fields.includes(k) && k !== 'attachmentList') {
          this.$set(data, k, null);
        }
      });
    },
    addRow(list, index) {
      console.log('add single row start here and the listData is', list, 'index is', index);
      const copyObj = JSON.parse(JSON.stringify(this.listDataChargeItem[index])),
        copyDomainObject = copyObj.domainObject;
      copyObj.isRoot = false;
      // 复制新增的移除自动生成的code
      if (copyDomainObject.code) {
        copyDomainObject.code = '';
      }
      // 付款状态默认待创建
      if (copyDomainObject.chargeItemPaybillStatus) {
        copyDomainObject.chargeItemPaybillStatus = 'uncreated';
      }
      // 支付方式默认无
      if (copyDomainObject.chargeItemPaybillPayChannel) {
        copyDomainObject.chargeItemPaybillPayChannel = null;
      }
      // 相关附件清空
      if (copyDomainObject.attachmentList) {
        copyDomainObject.attachmentList = null;
      }
      // 关联付款单号无
      if (copyDomainObject.chargeItemPaybillNo) {
        copyDomainObject.chargeItemPaybillNo = null;
      }
      // 增加标识可删除
      copyDomainObject.isRoot = 'no';
      this.listDataChargeItem.splice(index + 1, 0, copyObj);
    },
    delRow(list, index) {
      console.log('del single row start here and the listData is', list, 'index is', index);
      this.listDataChargeItem.splice(index, 1);
    },
    payOnline(model) {
      const paramsObj = {
        code: model.chargeItemPaybillCode
      };
      paybillGet(paramsObj, (success, error) => {
        if (error) {
          showMessageUtil('warning', error.content, 3000);
        }
        if (success) {
          const data = [];
          data.push(success.content);
          localStorage.setItem('paycart', JSON.stringify(data));
          this.openWindow('/paybill/order.html', '支付账单');
          this.$confirm('请问您支付完成了吗？', '确认', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            this.handleRefresh();
          });
        }
      });
    },
    withdrawRow(list, index) {
      this.$msgbox({
        title: '确认',
        message: `确认要撤回吗？`,
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = '执行中...';
            paybillWithdraw({ code: list.chargeItemPaybillCode }, (success, error) => {
              if (success) {
                this.$message({
                  type: 'success',
                  message: '撤回成功',
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
        this.handleRefresh();
      });
    },
    //新建waybill
    credtedLogistics() {
      //检验复合控件是否填写 规范
      //1.校验 表单
      //2.提交 logistics 数据 拿到 code
      //3.提交 货单的信息
      const self = this;
      this.$refs['form'].$refs.form.validate((valid) => {
        if (valid) {
          let net = self.isEdit ? editWaybill : addWaybill;
          //统计数据写入 domainObject中
          if (this.$refs['eleManifest']) {
            const cacFields = self.$refs['eleManifest'].$refs['pageSubtotal'].cacFields;
            // 'goodsWeight','goodsVolume','goodsNum' 这三个参数 在 domainObject 和 manifestList 一样的
            // const keys = ['goodsWeight','goodsVolume','goodsNum'];
            cacFields.forEach(item => {
              if (self.domainObject.hasOwnProperty(item.field)) {
                let val = item.total;
                self.domainObject[item.field] = val;
              }
            })
          }
          self.btnDisabled = true;
          net(self.domainObject, self.listDataManifest, (success, error) => {
            if (error || success.code !== 200) {
              showMessageUtil('warning', error.content, 2000);
            }
            if (success) {
              if (self.isEdit) { // 编辑
                showMessageUtil('success', '提交成功', 2000);
                self.editable = false;
                self.btnDisabled = false;
              } else { //新建
                self.$confirm(`恭喜您,新建${self.objectName}成功！ 是否继续新建${self.objectName}?`, '提示', {
                  confirmButtonText: '继续新建',
                  cancelButtonText: `返回${self.objectName}列表`,
                  type: 'success',
                  customClass: 'confirm-dialog'
                }).then(() => {
                  window.location.reload();
                }).catch(() => {
                  let url = self.listUrl;
                  const qindex = url.indexOf('?'),
                    title = self.listTitle;
                  if (qindex > -1 && !lsType) {
                    url = url.substring(0, qindex);
                  }
                  urlRedirect(url, title);
                });
              }
            }
          })
        }
      })
    },
    // methods 货单 end       ========================
    dealWithRouteBoard() {
      if (!this.fromDispatch) { return; }
      const
        self = this,
        listCode = ['routeCode', 'loadingOrgName', 'loadingUserFullName', 'loadingUserPhone', 'loadingAddr', 'unloadingOrgName', 'unloadingUserFullName', 'unloadingUserPhone', 'unloadingAddr', 'isUpdate'];
      this.$nextTick(() => {
        listCode.forEach(item => {
          let el = this.$refs.form.getElementByField(item);
          if (el && el.configData) {
            const val = el.configData.controlType === 'text' ? 'readonly' : 'TRUE';
            self.$set(el.configData, 'readonly', val);
          }
        })
        // 省市区需要单独设置
        setProvinceCode('loadingProvinceCode');
        setProvinceCode('unloadingProvinceCode');

        function setProvinceCode(code) {
          let el = self.$refs.form.getElementByField(code);
          for (let i = 0; i < 3; i++) {
            if (el.selectAreaData && el.selectAreaData[i]) {
              self.$set(el.selectAreaData[i], 'readonly', 'TRUE');
            }
          }
        }
      })
    },
    getEvaInfo() {
      const waybillCode = utils.getParamsFromURL(window.location.search).code;
      if (waybillCode) {
        waybillService.getEvaInfo(waybillCode, (success, error) => {
          if (error || success.code !== 200) {
            // this.$message({
            //   type: 'error',
            //   message: error.content,
            //   duration: 3000
            // });
            console.log('get evaluate info failed, and error message is ', error.content);
            return false;
          }
          if (success) {
            const data = success.content || {};
            this.evaluateObject = data;
            console.table(data);
          }
        });
      }
    },
    disableSelect() {
      let clientOrgCode = this.$refs.form.getElementByField('clientOrgCode'),
        logisticsCode = this.$refs.form.getElementByField('logisticsCode');
      if (clientOrgCode.configData) {
        clientOrgCode.configData.readonly = 'TRUE';
      }
      if (logisticsCode.configData) {
        logisticsCode.configData.readonly = 'TRUE';
      }
    },
    getAddress() {
      // 运单详情显示发货位置
      if (this.domainObject.loadingAddrLon && this.domainObject.loadingAddrLat) {
        this.showLocation(this.domainObject.loadingAddrLon, this.domainObject.loadingAddrLat, 'loadingLocation');
      }
      // 运单详情显示收货位置
      if (this.domainObject.unloadingAddrLon && this.domainObject.unloadingAddrLat) {
        this.showLocation(this.domainObject.unloadingAddrLon, this.domainObject.unloadingAddrLat, 'unloadingLocation');
      }
    },
    showLocation(longtitude, latitude, field) {
      const paramObj = {
        type: 1,
        lng: longtitude,
        lat: latitude
      };
      LbsService.getAddress(paramObj, (success, error) => {
        if (success) {
          const address = success.content.address || '';
          this.$set(this.domainObject, field, address);
        }
      });
    },
    dealWithBsicInfoForHanNeng(form) {
      if (utils.getParamsFromURL(window.location.search).logisticsCode) {
        let listKey = ['waybillNo', 'code', 'logisticsNo', 'logisticsCode', 'freightNo', 'freightCode', 'waybillStatus', 'settleStatus', 'reportStatus', 'dispatchPrintStatus', 'clientOrgName', 'clientOrgCode', 'platformClientOrgCode', 'settleMethod', 'reportBusinessTypeCode', 'reportCargoTypeClassificationCode', 'goodsPrice', 'goodsPriceUnitCode', 'meterageType', 'goodsLossMethod', 'goodsLoss', 'goodsLossUnitCode', 'ratesDescription', 'goodsName', 'clientFreightPrice', 'clientFreightPriceUnitCode', 'carrierOrgName', 'carrierOrgCode'];

        // let listKey = ['goodsLossUnitCode'];
        let self = this;
        listKey.forEach(key => {
          let el = self.$refs.form.getElementByField(key);
          if (el && el.configData) {
            // self.$set(el.configData, 'readonly', 'TRUE');  // select
            // self.$set(el.configData, 'disabled', 'true');
            if (el.configData.controlType === 'number' || el.configData.controlType === 'text' || el.configData.controlType === 'label') {
              self.$set(el.configData, 'readonly', 'readonly'); // input
            }
            if (el.configData.controlType === 'select' || el.configData.controlType === 'pop' || el.configData.controlType === 'autocomplete') {
              self.$set(el.configData, 'readonly', 'TRUE'); // select
            }
            if (el.configData.controlType === 'radio') {
              self.$set(el.configData, 'disabled', 'true'); // select
            }
          }
          if (el && el.autoData) {
            if (el.autoData.controlType === 'select') {
              self.$set(el.autoData, 'readonly', 'TRUE'); // select
            }
          }
        });

        self.showLogisticsReference = true;
      }

    },
    formMounted(form) {
      // 处理formMounted多次触发
      if (!this.isFirstLoad) { return false; }
      this.isFirstLoad = false;
      let self = this;
      this.dealWithBsicInfoForHanNeng(form);
      // 逻辑注释 ：
      // 监听 车牌号，单车牌号 变了，那么 触动主驾  与 副驾 的 其他信息的填写(比方说 主驾 驾驶证等...,)
      form.getElementByField('truckCode').$on('change', (model) => {
        console.log('truck changed', model);
        if (model.driverCode) {
          if (form.getElementByField('driverCode')) {
            // 模拟 选择了 某一个 主驾（相当于 主驾弹框  点击了 选择）
            form.getElementByField('driverCode').$emit('selectCode', { code: model.driverCode });
          }
        }
        // 监听 副驾驶
        if (model.viceDriverCode) {
          if (form.getElementByField('viceDriverCode')) {
            form.getElementByField('viceDriverCode').$emit('selectCode', { code: model.viceDriverCode });
          }
        }
        // 选择运力后，需要带出主驾车辆的车型
        if (model.mainTruckCode) {
          truckGet({ code: model.mainTruckCode }, (success, error) => {
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
              console.log('truck data is', data);
              this.$set(this.domainObject, 'licensePlateTypeCode', data.truckLicenseType);
            }
          });
        }
      });
      form.getElementByField('driverCode').$on('change', (model) => {
        if (form.getElementByField('driverPayeeBankAccountNo')) {
          form.getElementByField('driverPayeeBankAccountNo').$emit('refresh', { personCode: model.code });
        }
      });

      // 选择运价弹窗增加额外查询条件
      form.getElementByField('logisticsCode').$on('change', (model) => {
        if (form.getElementByField('ratesCode')) {
          form.getElementByField('ratesCode').$emit('refresh', { logisticsCode: model.code });
        }
      });


      form.getElementByField('driverCode').$on('change', (model) => {
        if (form.getElementByField('driverPayeeBankAccountNo')) {
          form.getElementByField('driverPayeeBankAccountNo').$emit('refresh', { personCode: model.code });
        }
      });

      //监听主驾 的改变，主驾 变了  直接 去 调用 司机的详情 然后填入 主驾
      form.getElementByField('driverCode').$on('change', (model) => {

        //1.查看 model 中是否有 委托 收款人
        //2.如果有 直接 根据 code  查询 detail 中的 数据  (如果没有 委托收款人，不用任何操作)
        //3.拿到数据 填充到 主驾开户行 driverPayeeBankName  主驾银行户名 driverPayeeBankAccountName 主驾银行账户 driverPayeeBankAccountNo driverPayeeBankAccountCode  主驾备注 driverPayeeBankAccountDescription

        if (model.authorizePayeePlatformCode) {
          // 网络请求
          let paramObj = { code: 'null', userCode: model.authorizePayeePlatformCode };
          getDriverDetail(paramObj, (success, error) => {
            if (success && success.content) {
              let keys = ['driverPayeeBankName', 'driverPayeeBankAccountName', 'driverPayeeBankAccountNo', 'driverPayeeBankAccountCode', 'driverPayeeBankAccountDescription'];
              setTimeout(() => {
                self.$set(self.domainObject, 'driverPayeeBankName', success.content['bankName']);
                self.$set(self.domainObject, 'driverPayeeBankAccountName', success.content['bankAccountName']);
                self.$set(self.domainObject, 'driverPayeeBankAccountNo', success.content['bankAccountNo']);
                self.$set(self.domainObject, 'driverPayeeBankAccountCode', success.content['driverPayeeBankAccountCode']);

                self.$set(self.domainObject, 'payeeDriverFullName', success.content['fullName']);
                self.$set(self.domainObject, 'payeeDriverCode', success.content['code']);
                self.$set(self.domainObject, 'payeePlatformDriverCode', success.content['userCode']);
              }, 500);
            }
          })
        }
      });

      if (this.domainObject.logisticsCode) {
        if (form.getElementByField('ratesCode')) {
          form.getElementByField('ratesCode').$emit('refresh', { logisticsCode: this.domainObject.logisticsCode });
        }
      } else {
        const logCode = utils.getParamsFromURL(window.location.search).logisticsCode;
        if (logCode) {
          this.showLoadingUnloading = false;
          LogisticsService.get({ code: logCode }, (success) => {
            if (success) {
              this.logisticsReferenceObject = success.content;
              this.$refs.form.dispatchEvent('logisticsCode', 'select', success.content);
            }
          });
        } 
      }

      // 托运方为当前组织
      // const ls = JSON.parse(localStorage.getItem('userInfo'));
      // this.$set(this.domainObject, 'clientOrgName', ls.orgFullName);
      // this.$set(this.domainObject, 'clientOrgCode', ls.orgCode);
      // this.$set(this.domainObject, 'platformClientOrgCode', ls.orgCode);
      // 新建运单，调车模式，如果配置了则默认使用配置中的值
      if (!this.isEdit) {
        const ls = JSON.parse(localStorage.getItem('appInfo'));
        if (ls.defaultScheduleType) {
          console.log('默认调车模式为：', ls.defaultScheduleType);
          this.$set(this.domainObject, 'scheduleType', ls.defaultScheduleType);
        }
        // 新建运单默认取当前组织的交易费设置
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
            this.$set(this.domainObject, 'settleTradingConfigValue', data.settleTradingConfigValue);
            this.$set(this.domainObject, 'settleTradingConfigUnitCode', data.settleTradingConfigUnitCode);
          }
        });
      }
      // 编辑运单不能修改托运客户、来源订单
      if (this.isEdit) {
        this.disableSelect();
        this.agree = true;
      }
      // 获取动态字段名称
      waybillService.getDetail((success) => {
        const data = success.content;
        data.forEach((val) => {
          this.defaultDetailColumns.push(val.fieldConfigCode);
        });
        this.fields.forEach((val) => {
          if (!val.extraParams[0].isShow) {
            this.actualDetailColumns.push(val.fieldConfigCode);
          }
        });
        this.actualDetailColumns.forEach((val) => {
          if (!this.defaultDetailColumns.includes(val)) {
            this.clientDetailColumns.push(val);
          }
        });
      });

      // 新建运单打开，手动set计量标准为吨
      if (!utils.getParamsFromURL(window.location.search).logisticsCode && !utils.getParamsFromURL(window.location.search).code) {
        if (!this.isEdit) {
          this.$set(this.domainObject, 'meterageType', 'item');
          setTimeout(() => {
            this.$set(this.domainObject, 'meterageType', 'ton');
          }, 500)
        }
      }


      // 处理司机运价与 客户运价的关系  start ======
      const appInfo = JSON.parse(localStorage.getItem('appInfo'));
      console.log('appInfo ...', appInfo);
      if (appInfo.priceMode == 'auto') {
        // this.$nextTick(() => {
        // 把司机运价变成 readonly 变成不可以编辑
        let el = this.$refs.form.getElementByField('driverPrice');
        console.log('el.configData ...', el.configData);
        if (el.configData) {
          this.$set(el.configData, 'readonly', 'readonly');
        }
        // 有bug 第二个 没有起到作用
        let el2 = this.$refs.form.getElementByField('driverPriceUnitCode');
        console.log('el.configData ...', el.configData);
        if (el2.configData) {
          el2.configData.readonly = 'TRUE';
        }
        // });

        this.$watch(`domainObject.platformClientOrgCode`, (val) => {
          this.netGetOrgManager();
        })
        //监听客户运价   ,计算数据
        this.$watch(`domainObject.clientFreightPrice`, (val) => {
          this.dealWithClientFreightPrice();
        })

        this.$watch(`domainObject.clientFreightPriceUnitCode`, (val) => {
          this.domainObject.driverPriceUnitCode = this.domainObject.clientFreightPriceUnitCode;
        })
      }

      this.dealWithBankInfoFormat();

      this.driverAgreementName = appInfo.driverAgreementName;
      this.driverAgreementUrl = `${appInfo.driverAgreementUrl}?firstParty=${appInfo.coreOrgFullName}&secondParty=${this.domainObject.driverFullName}&idNumber=${this.domainObject.driverIdentityNumber}&phoneNumber=${this.domainObject.driverPhone}`;


    },
    formReady(formData) {
      // 获取线路信息
      if (this.domainObject.routeCode) {
        const paramsObj = {
          code: this.domainObject.routeCode
        };
        routeGet(paramsObj, (success, error) => {
          if (error) {
            const dom = this.$refs.form.getElementByField('routeName');
            console.log('dom is ', dom);
            dom.detailUrl = false;
          }
        });
      }
      console.log('formReady', formData);
      this.inputKey = formData.paramData.inputKey;
      this.fields = formData.paramData.field;
      this.isEdit = formData.isEdit;
      this.editable = formData.editable;
      this.code = formData.code;
      // 如果是编辑进来 ，那么需要 复制domaobject
      if (utils.getParamsFromURL(window.location.search).code) {
        this.copyDomainObject = JSON.stringify(this.domainObject);
      }
      this.dealWithRouteBoard();
      this.getAddress();
    },
    editForm() {
      this.editable = true;
      // 存储 之前的值
      this.copyDomainObject = JSON.stringify(this.domainObject);
      setTimeout(() => {
        let el = this.$refs.form.getElementByField('clientFreightPriceUnitCode');
        el.onRefresh({ codeUnitType: this.domainObject.meterageType });

        let el1 = this.$refs.form.getElementByField('goodsPriceUnitCode');
        el1.onRefresh({ codeUnitType: this.domainObject.meterageType });

        let el2 = this.$refs.form.getElementByField('driverPriceUnitCode');
        el2.onRefresh({ codeUnitType: this.domainObject.meterageType });

      }, 500)

    },
    cancelEdit() {
      let self = this;
      // this.$refs.form.resetForm();
      let item = JSON.parse(this.copyDomainObject);
      let obj = JSON.parse(this.copyDomainObject);
      for (let i = 0; i < Object.keys(obj).length; i++) {
        let key = Object.keys(obj)[i];
        if (key == 'meterageType') {
          self.$set(self.domainObject, key, obj[key]);
        } else {
          setTimeout(() => {
            self.$set(self.domainObject, key, obj[key]);
          })
        }
      }
      setTimeout(() => {
        this.editable = false;
      }, 300)

    },
    // 校验表单 与 价格单位的检查
    validForm(formName) {
      // 检验 货物单价
      if (this.domainObject.goodsPrice && !this.domainObject.goodsPriceUnitCode) {
        utils.showMessageUtil('warning', '请检查货物单价单位', 3000);
        return;
      }
      // 检验 客户运价
      if (this.domainObject.clientFreightPrice && !this.domainObject.clientFreightPriceUnitCode) {
        utils.showMessageUtil('warning', '请选择"客户运价"单位', 3000);
        return;
      }
      // 检验 司机运价
      if (this.domainObject.driverPrice && !this.domainObject.driverPriceUnitCode) {
        utils.showMessageUtil('warning', '请选择"司机运价"单位', 3000);
        return;
      }
      //解决bug 货物运价 验证不通过
      if (this.domainObject.goodsPrice) {
        this.domainObject.goodsPrice = this.domainObject.goodsPrice + '';
      }

      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 如果是平台调车，需要判断是否勾选协议
          if (this.domainObject.scheduleType === 'platform') {
            if (this.agree) {
              this.confirmSubmit('platform');
            } else {
              utils.showMessageUtil('warning', '请勾选同意委托调车合作协议！', 3000);
              return false;
            }
          } else {
            // 自助调车
            this.confirmSubmit('self');
          }
        } else {
          return false;
        }
      });
    },
    // 检验 收发货 时间的验证
    checkDateTime() {
      let mark_bc = { mark: false, msg: '' };
      const loadingTime = this.domainObject.loadingTime,
        unloadingTime = this.domainObject.unloadingTime;

      const bc = utils.compareTime(loadingTime, unloadingTime);
      if ('>' === bc) {
        mark_bc.mark = true;
        mark_bc.msg = ' “收货时间”不能早于“发货时间  ”'
      }

      // 如果设置了 不允许 设置未来的时间，则需要检验  start  ==================
      if ('FALSE' === JSON.parse(localStorage.getItem('otherappConfig'))['other.operateTimeLimit']) {
        const now = new Date();

        let msg_time = '';
        [loadingTime, unloadingTime].forEach((time, index) => {
          if ('>' === utils.compareTime(time, now)) {
            mark_bc.mark = true;
            msg_time += index === 1 ? ' “收货时间” ' : ' “发货时间” ';
          }
        })
        if (msg_time) {
          msg_time += '不能选择“未来时间” ';
          mark_bc.msg += msg_time
        };
      }
      // 如果设置了 不允许 设置未来的时间，则需要检验  end  ==================

      if (mark_bc.mark && mark_bc.msg) {
        utils.showMessageUtil('warning', mark_bc.msg, 3000);
        return false;
      };
      return true;
    },
    checkDateTimeunloadingTime() {
      let mark_bc = { mark: false, msg: '' };
      if (this.fromDispatch) {
        const form = this.$refs['logisticsReference'];
        if (form.domainObject && form.domainObject.logisticsPlanStartTime && form.domainObject.logisticsPlanEndTime) {
          const dt1 = new Date(Date.parse(form.domainObject.logisticsPlanStartTime)),
            dt2 = new Date(Date.parse(form.domainObject.logisticsPlanEndTime)),
            departDate = this.domainObject.departDate ? new Date(Date.parse(this.domainObject.departDate)) : '',
            returnDate = this.domainObject.returnDate ? new Date(Date.parse(this.domainObject.returnDate)) : '';

          if (departDate && (departDate <= dt1 || departDate >= dt2) && dt2 >= dt1) {
            mark_bc.mark = true;
            mark_bc.msg = ' “计划发货时间”必须在订单的“计划开始时间”到“计划结束时间”之内 ';
          }
          // 如果第一个 校验不通过，则不校验 下面一个
          if (returnDate && (returnDate <= dt1 || returnDate >= dt2) && dt2 >= dt1 && mark_bc.mark === false) {
            mark_bc.mark = true;
            mark_bc.msg += ' “计划收货时间”必须在订单的“计划开始时间”到“计划结束时间”之内 ';
          }
        }
      }
      if (mark_bc.mark && mark_bc.msg) {
        utils.showMessageUtil('warning', mark_bc.msg, 3000);
        return false;
      };
      return true;
    },
    //检验 公司认证 与否 是否 可以 开展业务
    checkCertControl() {
      return new Promise((resolve, reject) => {
        const certControl = JSON.parse(localStorage.getItem('otherappConfig'))['other.certControl'];
        if (certControl === 'TRUE') {
          selfs((success, error) => {
            if (error || success.code !== 200) {
              this.$message({
                type: 'error',
                message: `${error}`,
                duration: 3000
              });
              reject(false)
            }
            if (success) {
              const data = success.content;
              if (data.certStatus !== 'authenticated') {
                this.$message({
                  type: 'warning',
                  message: '公司未认证，不能开展业务，请先提交认证！',
                  duration: 3000
                });
                this.btnDisabled = true;
                reject(false)
              } else {
                resolve(true)
              }
            }
          });
        } else {
          resolve(true)
        }
      })
    },
    finishCheck() {
      return true;
    },
    submitForm(formName) {
      let self = this;
      if (!this.finishCheck()) { return false; }
      if (!this.checkDateTime()) { return false; }
      if (!this.checkDateTimeunloadingTime()) { return false; }
      // 检验 公司认证 与否 是否 可以 开展业务
      this.checkCertControl().then(function(flag) {
        self.validForm(formName);
      }).catch(function(argument) {
        console.log('验证失败 ....', argument)
      })
      // this.checkCertControl(flag=>{
      //   if(flag){ // 验证通过
      //     if (this.isShowEleManifestList) {
      //     this.credtedLogistics();
      //   } else {
      //     this.validForm(formName);
      //   }
      //   }else{ // 验证失败
      //     return false;
      //   }
      // })
    },

    // submitForm(formName) {
    //   if (!this.checkDateTime()) { return false; }
    //   if (!this.checkDateTimeunloadingTime()) { return false; }
    //   const certControl = JSON.parse(localStorage.getItem('otherappConfig'))['other.certControl'];
    //   if (certControl === 'TRUE') {
    //     selfs((success, error) => {
    //       if (error || success.code !== 200) {
    //         this.$message({
    //           type: 'error',
    //           message: `${error}`,
    //           duration: 3000
    //         });
    //         return false;
    //       }
    //       if (success) {
    //         const data = success.content;
    //         if (data.certStatus !== 'authenticated') {
    //           this.$message({
    //             type: 'warning',
    //             message: '公司未认证，不能开展业务，请先提交认证！',
    //             duration: 3000
    //           });
    //           this.btnDisabled = true;
    //           return false;
    //         } else {
    //           this.validForm(formName);
    //         }
    //       }
    //     });
    //   } else {
    //     this.validForm(formName);
    //   }
    // },
    checkFields(fields) {
      const len = fields.length;
      let pass = 0;
      if (fields) {
        fields.forEach((val) => {
          if (this.domainObject[val[0]] || this.domainObject[val[1]]) {
            (this.domainObject[val[0]] && this.domainObject[val[1]]) ? (pass += 1) : '';
          } else {
            pass += 1;
          }
        });
        return pass;
      }
    },
    // 检验费用科目
    confirmSubmit(type) {
      this.credtedLogistics();
      // 增加固定科目(油气费、保险费、信息费)如果填写了一项，则必须填写完整判断
      // const fields = [
      //   ['settleConfigValue1', 'settleConfigUnitCode1'],
      //   ['settleConfigValue2', 'settleConfigUnitCode2'],
      //   ['settleConfigValue3', 'settleConfigUnitCode3']
      // ];
      // if (this.checkFields(fields) === fields.length) {
      //   const appInfo = JSON.parse(localStorage.getItem('appInfo')), // 核心组织数据来源
      //     userInfo = JSON.parse(localStorage.getItem('userInfo')); // 当前企业数据来源
      //   // this.btnDisabled = true;
      //   // this.$refs.form.submitForm();
      //   this.credtedLogistics();
      // } else {
      //   utils.showMessageUtil('warning', '固定科目结算方式设置(油气费、保险费、信息费)，数值和单位必须同时填写完整！', 3000);
      // }
    },
    resetForm() {
      this.$refs.form.resetForm();
    },
    editSuccess() {
      this.editable = false;
    },
    submitDone() {
      this.btnDisabled = false;
    },
    netGetOrgManager() {
      this.dataOrgManager = null;
      getOrgManager({ code: this.domainObject.platformClientOrgCode }, (success, error) => {
        if (success) {
          this.dataOrgManager = success.content;
        }
      });
    },
    dealWithClientFreightPrice() {
      if (!this.dataOrgManager) {
        return;
      }
      if (this.dataOrgManager.settleTradingConfigUnitCode == '%') {


        // let num = parseFloat(this.dataOrgManager.settleTradingConfigValue) / 100;
        // let finNum = this.domainObject.clientFreightPrice * (1 - num);
        // this.domainObject.driverPrice = Math.floor(finNum * 100) / 100;

        let num = Decimal(this.dataOrgManager.settleTradingConfigValue).div(100).toNumber();
        let num1 = Decimal(1).sub(num).toNumber();
        let finNum = Decimal(this.domainObject.clientFreightPrice).mul(Decimal(num1)).toNumber();
        this.domainObject.driverPrice = Math.floor(finNum * 100) / 100;



      } else if (this.dataOrgManager.settleTradingConfigUnitCode == 'yuan') {
        let finNum = this.domainObject.clientFreightPrice - this.dataOrgManager.settleTradingConfigValue;
        this.domainObject.driverPrice = Math.floor(finNum * 100) / 100;
      }
    },
    // 处理银行 信息 输入时 去除 全部空格
    dealWithBankInfoFormat() {
      let keys = ['driverPayeeBankName', 'viceDriverPayeeBankName', 'viceDriverPayeeBankAccountName', 'driverPayeeBankAccountName', 'viceDriverPayeeBankAccountNo', 'driverPayeeBankAccountNo'];
      for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        this.$watch(`domainObject.${key}`, (val) => {
          if (val) {
            this.domainObject[key] = val.replace(/[ ]/g, "");
          }
        })
      }
    }
  },
  created() {
    this.getEvaInfo();
    this.projectName = JSON.parse(localStorage.getItem('appInfo')).projectName;
  },
  mounted() {
    const appInfo = JSON.parse(localStorage.getItem('appInfo')),
      userInfo = JSON.parse(localStorage.getItem('userInfo'));
    // 是否禁用调车模式选择
    if (appInfo.enableScheduleType) {
      this.disableModeSelect = appInfo.enableScheduleType === 'FALSE';
      console.log('是否禁用调车模式选择', this.disableModeSelect);
    }

    // 处理司机运价与 客户运价的关系  start ======
    if (appInfo.priceMode == 'auto') {

      this.$watch(`domainObject.platformClientOrgCode`, (val) => {
        this.netGetOrgManager();
      })
      //监听客户运价   ,计算数据
      this.$watch(`domainObject.clientFreightPrice`, (val) => {
        this.dealWithClientFreightPrice();
      })

      this.$watch(`domainObject.clientFreightPriceUnitCode`, (val) => {
        this.domainObject.driverPriceUnitCode = this.domainObject.clientFreightPriceUnitCode;
      })
    }
    // end ======
    this.dealWithLoadingMode('multiple');
    this.$watch('domainObject.loadingMode', (val) => {
      this.dealWithLoadingMode(val);
      this.$nextTick(() => {
        this.syncMeterageType();
      })
    })
  }
};

</script>
