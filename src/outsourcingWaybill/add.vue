/**
* add.vue 运单页面 外包
* Created by cc on 17/8/10.
*/
<template>
  <div>
    <div class="form-page">
      <ele-form :domainObject="domainObject" ref="form" :configUrl="configUrl" :listUrl="listUrl" :listTitle="listTitle" :getInfo="getInfo" :addFun="addFun" :editFun="editFun" :editable="editable" :isEdit="isEdit" @formReady="formReady" @editSuccess="editSuccess" @submitDone="submitDone" @formMounted="formMounted" :objectName="objectName" label-width="100px" :inline="false" :folder="folder">
        <layout :domainObject="domainObject" :isEdit="isEdit" :editable="editable" :objectName="objectName" :showLoadingUnloading="showLoadingUnloading" :disableModeSelect="disableModeSelect" :clientDetailColumns="clientDetailColumns">
          <div v-for="field in fields" :slot="field.fieldConfigCode">
            <el-form-item :label="field.showName" :required="field.required ==='true'">
              <ele-block :field="field" :domainObject="domainObject" :editable="editable" :uploadUrl="uploadUrl" :inputKey="inputKey"></ele-block>
            </el-form-item>
          </div>
          <!-- <el-button type="primary" v-check-permission="'waybill.edit'" v-show="!editable && isEdit && domainObject.settleStatus !== 'pass'" @click="editForm()" slot="buttonEdit">编辑</el-button> -->
          <el-button v-show="editable && isEdit" @click="cancelEdit()" slot="buttonCancel">取消编辑</el-button>
          <el-button v-show="editable && isEdit" @click="submitForm('form')" slot="buttonSave">保存</el-button>
          <!--<el-button v-show="!editable && isEdit" @click="changeLog()" slot="buttonChangeLog">{{ objectName }}变更记录</el-button>-->

          <!-- 货单表格 start -->
          <div slot='manifestModule'>
            <eleManifestList ref='eleManifest' v-if="showManifestList" :showTopTab='showManifestListTop' :isEdit='isEdit' :editable='editable' @hasValueChange='hasValueChange' :getColumn='getColumnManifest' :listData='listDataManifest' :editableFields=editableFields @query="query" @eleManifestMounted='eleManifestMounted' @fieldChange='fieldChange' :loadingMode='loadingMode'>
            </eleManifestList>
          </div>
          <!-- 货单表格 end   -->

          <div class="agree-box" slot="agree">
            <el-checkbox v-model="agree" v-if="editable">同意<a :href="agreementUrl" class="blue" target="_blank">《{{agreementName}}》（点击查看）</a></el-checkbox>
            <span v-else>已同意<a :href="agreementUrl" class="blue" target="_blank">《{{agreementName}}》（点击查看）</a></span>
          </div>
          <el-button v-show='editable && !isEdit' type="primary" @click="submitForm('form')" size="large" slot="buttonSubmit" :disabled="btnDisabled">提交</el-button>
          <el-button v-show='editable && !isEdit' @click="resetForm()" size="large" slot="buttonReset" :disabled="btnDisabled">重置</el-button>
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
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import layout from './layout.vue';

import eleBlock from '../components/ele-block/eleBlock.vue';
import eleForm from '../components/ele-form/eleForm.vue';
import chargeList from '../waybill/chargeList.vue';
import voucherList from '../waybill/voucherList.vue';

import * as waybillService from '../../api/waybillService';
import * as LogisticsService from '../../api/LogisticsService';
import * as LbsService from '../../api/LbsService';

import { get as truckGet } from '../../api/TruckService';

import { get as routeGet } from '../../api/RouteService';
import { getParamsFromURL, showMessageUtil, deepClone, getGoodsCategoryVal, getMeterageTypeByGoodsCategoryCode, getGoodsCategoryByKey, urlRedirect } from '../../api/Utils';

import { get as getOutsourcing, getDetail } from '../../api/OutsourcingWaybillService';

import ApiConst from '../../api/ApiConst';
import * as utils from '../../api/Utils';
import logs from '../logs/list.vue';
import '../components/vueDirectives';
import eleManifestList from '../components/ele-manifest-list/eleManifestList.vue';
import {getColumnManifestSingle, getColumnManifestMultiple, getManifestList} from '../../api/waybillService';
// 当时从 订单列表 点击直接派车进来的时候，提交运单的时候   接口需要改变一下
let addFuncWayBill = utils.getParamsFromURL(window.location.search).logisticsCode ? waybillService.add_and_notify : waybillService.add;

export default {
  components: {
    'ele-form': eleForm,
    'layout': layout,
    'logs': logs,
    'charge-list': chargeList,
    'voucher-list': voucherList,
    'ele-block': eleBlock,
    eleManifestList
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
      configUrl: `${ApiConst.apiWayBillDomain}/detail_render_info/outsourcing/list`,
      domainObject: {},
      addFun: addFuncWayBill,
      editFun: waybillService.edit,
      getInfo: getOutsourcing,
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
      agree: false,
      agreementName: '',
      agreementUrl: '',
      dialogVisible: false,
      disableModeSelect: '',
      folder: 'waybill/outsourcing',
      defaultDetailColumns: [],
      actualDetailColumns: [],
      clientDetailColumns: []
    };
  },
  watch: {
    // 'editable': function(newVal, oldVal) {
    //   console.log('newVal is', newVal, 'oldVal is', oldVal);
    //   if (newVal) {
    //     this.$nextTick(() => {
    //       this.$refs.form.getElementByField('ratesCode').$emit('refresh', {logisticsCode: this.domainObject.logisticsCode});
    //     });
    //   }
    // }
  },
  methods: {

    // methods 货单 start     ========================
    ruleRecombinationData(key1,key2,nameTip){
      const val1 = this.domainObject[key1],
            val2 = this.domainObject[key2];
      if((val1 && !val2) || (val2 && !val1)){
        showMessageUtil('warning', `请检查${nameTip}，填写不完全`, 2000)
        return false;
      }
      return true;
    },
    delBatch(arrSave) {
      this.listDataManifestMultiple = arrSave;
    },
    fieldChange(key, indexMark){},
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
        if((item.goodsPrice && !item.goodsPriceUnitCode) || (!item.goodsPrice && item.goodsPriceUnitCode) ){
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
      let logisticsCode = getParamsFromURL(window.location.search).code ||  getParamsFromURL(window.location.search).originalCode || '';
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
    // list date 有变化
    // 检测第一行的 货物分类有没有变化，有变化，那么就拿到货物总称 上面
    hasValueChange(list) {

      let mapList = [{key1:'goodsCategory',key2:'goodsName'},{key1:'goodsCategoryGb',key2:'cargoTypeClassificationCode'}];

      mapList.forEach((item ,index)=>{
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
      let keysFileld = ['clientFreightPriceUnitCode', 'driverReferPriceUnitCode'];
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
      const map = { code: 'routeCode', routeName: 'routeName', standardDistance: 'standardDistance', loadingOrgName: 'loadingOrgName', loadingLinkmanFullName: 'loadingLinkmanFullName', loadingContact: 'loadingUserPhone', loadingProvinceCode: 'loadingProvinceCode', loadingCityCode: 'loadingCityCode', loadingCountyCode: 'loadingCountyCode', loadingAddress: 'loadingAddress', unloadingOrgName: 'unloadingOrgName', unloadingLinkmanFullName: 'unloadingUserFullName', unloadingContact: 'unloadingUserPhone', unloadingProvinceCode: 'unloadingProvinceCode', unloadingCityCode: 'unloadingCityCode', unloadingCountyCode: 'unloadingCountyCode', unloadingAddress: 'unloadingAddress',businessTypeCode:'businessTypeCode' };
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
    //新建waybill
    credtedLogistics() {
      // if (!this.checkRulesInEleManifest()) { return; } //表格检验是否通过
      // if (!this.ruleRecombinationData('clientFreightPrice','clientFreightPriceUnitCode','客户运价')) { return; } //检验复合控件是否填写 规范
      // if (!this.ruleRecombinationData('driverReferPrice','driverReferPriceUnitCode','司机运价')) { return; } //检验复合控件是否填写 规范
      //1.校验 表单
      //2.提交 logistics 数据 拿到 code
      //3.提交 货单的信息
      const self = this;
      this.$refs['form'].$refs.form.validate((valid) => {
        if (valid) {
          let net = this.isEdit ? this.editFun : this.addFun;
          //统计数据写入 domainObject中
          const cacFields = this.$refs['eleManifest'].$refs['pageSubtotal'].cacFields;
          // 'goodsWeight','goodsVolume','goodsNum' 这三个参数 在 domainObject 和 manifestList 一样的
          cacFields.forEach(item => {
            if (self.domainObject.hasOwnProperty(item.field)) {
              self.domainObject[item.field] = item.total;
            }
          })
          net(self.domainObject, (success, error) => {
            if (error || success.code !== 200) {
              showMessageUtil('warning', error.content, 2000);
            }
            if (success && success.content && success.content.code) {
              //提交货单的信息
              this.netEditManifestList(success.content.code);
            }
          })
        }
      })
    },
    // methods 货单 end       ========================




    showLocation(longtitude, latitude, field) {
      const paramObj = {
        type: 1,
        lng: longtitude,
        lat: latitude
      };
      LbsService.getAddress(paramObj, (success, error) => {
        if (error || success.code !== 200) {
          this.$message({
            type: 'error',
            message: error.content,
            duration: 5000
          });
          return false;
        }
        if (success) {
          const address = success.content.address || '';
          this.$set(this.domainObject, field, address);
        }
      });
    },
    formMounted(form) {
      // 获取动态字段名称
      getDetail((success) => {
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
      // 运单详情显示发货位置
      if (this.domainObject.loadingAddrLon && this.domainObject.loadingAddrLat) {
        this.showLocation(this.domainObject.loadingAddrLon, this.domainObject.loadingAddrLat, 'loadingLocation');
      }
      // 运单详情显示收货位置
      if (this.domainObject.unloadingAddrLon && this.domainObject.unloadingAddrLat) {
        this.showLocation(this.domainObject.unloadingAddrLon, this.domainObject.unloadingAddrLat, 'unloadingLocation');
      }
      if (!this.isEdit) {
        const ls = JSON.parse(localStorage.getItem('appInfo'));
        if (ls.defaultScheduleType) {
          console.log('默认调车模式为：', ls.defaultScheduleType);
          this.$set(this.domainObject, 'scheduleType', ls.defaultScheduleType);
        }
      }
      // 新建外包运单打开，手动set计量标准为吨
      this.$set(this.domainObject, 'meterageType', 'ton');
    },
    formReady(formData) {
      if (this.domainObject.routeCode) {
        // 获取线路信息
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
    },
    editForm() {
      this.editable = true;
    },
    cancelEdit() {
      this.$refs.form.resetForm();
      this.editable = false;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 如果是平台调车，需要判断是否勾选协议
          if (this.domainObject.scheduleType === 'platform') {
            if (this.agree) {
              this.confirmSubmit('platform');
            } else {
              this.$message({
                type: 'warning',
                message: '请勾选同意委托调车合作协议！',
                duration: 3000
              });
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
    confirmSubmit(type) {
      const appInfo = JSON.parse(localStorage.getItem('appInfo')), // 核心组织数据来源
        userInfo = JSON.parse(localStorage.getItem('userInfo')); // 当前企业数据来源
      // 用简称 
      if (type === 'self') {
        // 运单原始托运方
        this.$set(this.domainObject, 'originalConsignOrgName', userInfo.orgName);
        this.$set(this.domainObject, 'originalConsignOrgCode', userInfo.orgCode);
        this.$set(this.domainObject, 'platformOriginalConsignOrgCode', userInfo.orgCode);
        // 托运方
        this.$set(this.domainObject, 'consignOrgName', userInfo.orgName);
        this.$set(this.domainObject, 'consignOrgCode', userInfo.orgCode);
        this.$set(this.domainObject, 'platformConsignOrgCode', userInfo.orgCode);
      } else {
        // 委托调车——运单原始托运方是当前企业，运单托运方是核心组织
        // 运单原始托运方
        this.$set(this.domainObject, 'originalConsignOrgName', userInfo.orgName);
        this.$set(this.domainObject, 'originalConsignOrgCode', userInfo.orgCode);
        this.$set(this.domainObject, 'platformOriginalConsignOrgCode', userInfo.orgCode);
        // 托运方
        this.$set(this.domainObject, 'consignOrgName', appInfo.coreOrgName);
        this.$set(this.domainObject, 'consignOrgCode', appInfo.coreOrgCode);
        this.$set(this.domainObject, 'platformConsignOrgCode', appInfo.coreOrgCode);
      }
      this.btnDisabled = true;
      this.$refs.form.submitForm();
    },
    resetForm() {
      this.$refs.form.resetForm();
    },
    editSuccess() {
      this.editable = false;
    },
    submitDone() {
      this.btnDisabled = false;
    }
  },
  mounted() {
    const appInfo = JSON.parse(localStorage.getItem('appInfo')),
      userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.agreementName = appInfo.clientAgreementName;
    this.agreementUrl = `${appInfo.clientAgreementUrl}?firstParty=${userInfo.orgFullName}&secondParty=${appInfo.coreOrgFullName}`;
    // 是否禁用调车模式选择
    if (appInfo.enableScheduleType) {
      this.disableModeSelect = appInfo.enableScheduleType === 'FALSE';
      console.log('是否禁用调车模式选择', this.disableModeSelect);
    }
// 货单
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
