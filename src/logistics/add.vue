/** * add.vue * Created by cc on 17/8/10. */
<template>
  <div>
    <!-- 订单详情 页面 -->
    <div class="form-page">
      <ele-form ref="form" :domainObject="domainObject" :configUrl="configUrl" :listUrl="listUrl" :listTitle="listTitle" :getInfo="getInfo" :addFun="addFun" :editFun="editFun" :editable="editable" :isEdit="isEdit" @formMounted="formMounted" @formReady="formReady" @editSuccess="editSuccess" @submitDone="submitDone" :objectName="objectName" label-width="100px" :inline="false" :folder="folder">
        <layout :isEdit="isEdit" :editable="editable" :objectName="objectName" :clientDetailColumns="clientDetailColumns" :domainObject='domainObject' :showInTab="showInTab">
          <div v-for="field in fields" :slot="field.fieldConfigCode" v-if="checkPms(field)">
            <el-form-item :label="field.showName" :required="field.required ==='true'">
              <ele-block :field="field" :domainObject="domainObject" :editable="editable" :uploadUrl="uploadUrl" :inputKey="inputKey"></ele-block>
            </el-form-item>
          </div>
          <el-button type="primary" v-check-permission="'logistics.edit'" v-if='status' v-show="!editable && isEdit" @click="editForm()" slot="buttonEdit">编辑</el-button>
          <el-button v-show="editable && isEdit" @click="cancelEdit()" slot="buttonCancel">取消编辑</el-button>
          <el-button v-show="editable && isEdit && tplName === 'eleLogisticsPrice'" @click="submitForm('form')" slot="buttonSave">保存</el-button>
          <el-button v-show="!editable && isEdit" @click="changeLog()" slot="buttonChangeLog">{{ objectName }}变更记录</el-button>
          <template v-show='editable && !isEdit' v-if="!(tplName === 'eleLogisticsPrice' && code)">
            <el-button type="primary" @click="submitForm('form')" size="large" slot="buttonSubmit" :disabled="btnDisabled">提交</el-button>
            <el-button @click="resetForm('form')" size="large" slot="buttonReset" :disabled="btnDisabled">重置</el-button>
          </template>
          <el-button class='fr' v-show="editable" @click="syncRouterInfo()" slot="syncModule">信息同步到线路</el-button>
          <!-- 货单表格 start -->
          <div slot='manifestModule'>
            <eleManifestList ref='eleManifest' v-if="showManifestList" :showTopTab='showManifestListTop' :isEdit='isEdit' :editable='editable' @hasValueChange='hasValueChange' :getColumn='getColumnManifest' :listData='listDataManifest' :editableFields=editableFields @query="query" @eleManifestMounted='eleManifestMounted' @fieldChange='fieldChange' :listFieldsCheckNumber='listFieldsCheckNumber' :loadingMode='loadingMode'>
            </eleManifestList>
          </div>
          <!-- 货单表格 end   -->
          <!-- 凭证记录 START -->
          <evidence slot="tabEvidence" :domainObject="domainObject" :uploadUrl="uploadUrl" :editable="editable"></evidence>
          <!-- 凭证记录 END -->
          <!-- 运单记录 start ============ -->
          <div slot="tabWaybill">
            <waybill-statistics-msg type='logistics' v-if='modelWaybillStatistics' :modelWaybillStatistics='modelWaybillStatistics'></waybill-statistics-msg>
            <waybill :showRecycle='false' :showminiSearch='false' :showBatchFixPrice='false' :isFormLogistics='true' :selectable="false" :operatable="false" :customColumn="customColumnWaybill" :removeCustomColumnMark='true' :isAdvanced="false" :params="params" :needPage="true" :needMore="false"></waybill>
          </div>
          <!-- 运单记录  end ============ -->
          <rates-change-list slot="tabPriceChangeLog" :code="code"></rates-change-list>
          <logs slot="tabChangeLog" :selectable="false" :operatable="false" :domain="uploadUrl" :type="logType" :code="code" :isAdvanced="false" :params="params" :needPage="true"></logs>
        </layout>
      </ele-form>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
// compontent
import layout from './layout.vue';
import logs from '../logs/list.vue';
import evidence from './evidence.vue';
import waybill from '../waybill/list.vue';
import ratesChangeList from './ratesList.vue';
import eleForm from '../components/ele-form/eleForm.vue';
import eleBlock from '../components/ele-block/eleBlock.vue';
import waybillStatisticsMsg from './waybillStatisticsMsg.vue';
import eleManifestList from '../components/ele-manifest-list/eleManifestList.vue';
import eleLogisticsPrice from '../components/ele-logistics-price/eleLogisticsPrice.vue';
// api   
import { selfs } from '../../api/OrgService';
import { get as routeGet } from '../../api/RouteService';
import { get as getOrgManager } from '../../api/OrgManagementService';
import { update as updateRoute } from '../../api/RouteService';
import { add, edit, get, getFixation, getOutsourcing, getDetail, getWaybillStatisticsDispatched, getColumnManifestSingle, getColumnManifestMultiple,  getManifestList,addLogistics,editLogistics, getRates } from '../../api/LogisticsService';

// methods
import { getParamsFromURL, showMessageUtil, deepClone, getGoodsCategoryVal, getMeterageTypeByGoodsCategoryCode, getGoodsCategoryByKey, urlRedirect, checkPermission } from '../../api/Utils';

import ApiConst from '../../api/ApiConst';
import Decimal from "decimal.js";
import '../components/vueDirectives';

let isFormOutsourcingWaybill = getParamsFromURL(window.location.search).formOutsourcingWaybill ? true : false;
// 引入tab跳转
require('../public.js');

export default {
  components: {
    logs,
    layout,
    waybill,
    evidence,
    eleManifestList,
    eleLogisticsPrice,
    'ele-form': eleForm,
    'ele-block': eleBlock,
    'rates-change-list': ratesChangeList,
    'waybill-statistics-msg': waybillStatisticsMsg
  },
  data() {
    return {
      objectName: '订单',
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
      // mode:''
      configUrl: `${ApiConst.apiLogisticsDomain}/detail_render_info/logistics/list`,
      folder: 'logistics/logistics',
      tplName: 'eleLogisticsPrice',
      domainObject: {},
      addFun: add,
      editFun: edit,
      getInfo: isFormOutsourcingWaybill ? getOutsourcing : get,
      uploadUrl: ApiConst.apiLogisticsDomain,
      logType: 'logistics',
      listUrl: '/logistics/list.html',
      listTitle: '订单管理',
      fields: [],
      isEdit: false, // 控制编辑添加按钮
      editable: true, // 控制页面状态
      loading: true,
      code: '',
      getData: {},
      btnDisabled: false,
      // listFieldsCheckNumber:['goodsNum','goodsWeight','goodsVolume'],
      listFieldsCheckNumber: [],
      customColumnWaybill: ['waybillNo', 'waybillStatus1', 'waybillStatus', 'truckLicenseNo', 'trailerTruckLicenseNo', 'clientFreightPriceUnitCode', 'loadingTime', 'unloadingTime', 'loadingGoodsWeight', 'unloadingGoodsWeight', 'createTime'],
      params: {
        logisticsCode: getParamsFromURL(window.location.search).code,
        size: 10
      },
      isAdvanced: {
        type: Boolean,
        'default': true
      },
      needPage: {
        type: Boolean,
        'default': true
      },
      columnsData: [],
      listData: [],
      pageSize: 20,
      page: 1,
      total: null,
      defaultDetailColumns: [],
      actualDetailColumns: [],
      clientDetailColumns: [],
      dataOrgManager: null,
      copyDomainObject: null,
      modelWaybillStatistics: null,
      showInTab: getParamsFromURL(window.location.search).showInTab === 'true',
      isFirstLoad: true,
      projectName: JSON.parse(localStorage.getItem('appInfo')).projectName
    };
  },
  created() {
    this.$watch(`domainObject`, (val) => {
      // 只要code 有，那么就说明 不是新建 ===> 托运客户 要隐藏
      if (val.code && val.code.leng > 0) {
        this.changeClientOrgCode();
      }
    })
    this.detalWithListFieldsCheckNumber();
  },
  mounted() {

    const appInfo = JSON.parse(localStorage.getItem('appInfo'));
    if (appInfo.priceMode == 'auto') {
      this.$watch(`domainObject.platformClientOrgCode`, (val) => {
        this.netGetOrgManager();
      })
      //监听客户运价   ,计算数据
      this.$watch(`domainObject.clientFreightPrice`, (val) => {
        this.dealWithClientFreightPrice();
      })
      this.$watch(`domainObject.clientFreightPriceUnitCode`, (val) => {
        this.domainObject.driverReferPriceUnitCode = this.domainObject.clientFreightPriceUnitCode;
      })
    }
    // ######################### 监控 ###########################
    // this.$nextTick(()=>{
    //    this.syncMeterageType();
    // })
    // this.dealWithLoadingMode(this.domainObject.loadingMode);
    this.dealWithLoadingMode('multiple');
    this.$watch('domainObject.loadingMode', (val) => {
      this.dealWithLoadingMode(val);
      this.$nextTick(() => {
        this.syncMeterageType();
      })
    });
  },
  computed: {
    // 订单状态，主要是订单确认列表 跳转 详情的时候 ，需要通过 订单状态 ，取消编辑按钮，以及运价的 显示
    status() {
      let mark = true;
      if (this.domainObject.logisticsStatus) {
        if ('ready' == this.domainObject.logisticsStatus || 'pend' == this.domainObject.logisticsStatus || 'reject' == this.domainObject.logisticsStatus)
          mark = false;
      }
      return mark;
    }
  },
  methods: {
    dealWithRates(code) {
      return false;
    },
    checkPms(field) {
      let result = true;
      if (field.permissionCode) {
        result = checkPermission(field.permissionCode);
      }
      return result;
    },
    detalWithListFieldsCheckNumber() {
      let val1 = /^\d{1,10}\.?\d{0,2}$/;
      this.listFieldsCheckNumber = [{ 'goodsNum': val1 }, { 'goodsWeight': val1 }, { 'goodsVolume': val1 }];
    },
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
    fieldChange(key, indexMark) {
      // if('goodsName' === key){
      //   // 修改对应 indexMark 的 货物分类 
      //   this.fixGoodsCategory(indexMark);
      // }
      // if('goodsCategory' === key){
      //    // 修改对应 indexMark 的 计量标准 
      //    this.fixMeterageType(indexMark);
      // }
      // if('meterageType' === key){
      //     // 执行第一条 的 meterageType
      //     // 修改对应 indexMark 的 计量标准 
      //     this.syncMeterageType();
      // }
    },
    // //通过 goodsName 获取 goodsCategory
    // fixGoodsCategory(indexMark){
    //   let list = this.listDataManifest[indexMark];
    //   let  obj = getGoodsCategoryByKey('goodsName',list['goodsName']);
    //   if(obj){
    //      this.$set(list,'goodsCategory',obj.code);
    //   }
    // },
    // //通过 goodsCategory 获取 meterageType
    // fixMeterageType(indexMark){
    //   let list = this.listDataManifest[indexMark];
    //   let  obj = getGoodsCategoryByKey('code',list['goodsCategory']);
    //   if(obj){
    //      this.$set(list,'goodsCategory',val.goodsCategory);
    //   }
    // },
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
        // 校验规则：3/7   计量单位是吨的货单，货量中的重量必填，计量单位是方的货单，货量中的体积必填；计量单位是件的货单，货量中的件数必填。
        if (meterageType) {
          const map = { 'ton': ['goodsWeight', '货物重量'], 'cube': ['goodsVolume', '货物体积'], 'item': ['goodsNum', '货物数量'] };
          const arr = map[meterageType];
          const key = arr[0];
          if (!item[key]) {
            msg = `请填写${arr[1]}`;
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
    // // 检查计量标准 是否 一致
    // checkRulesMeterageType(){
    //   let mark = true,
    //       msg  = '';
    // },
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
    // list date 有变化
    // 检测第一行的 货物分类有没有变化，有变化，那么就拿到货物总称 上面
    hasValueChange(list) {


      // var val1 = null,
      //   val2 = null;
      // if (this.temListDataManifest.length > 0 && this.temListDataManifest[0]['goodsCategory']) {
      //   val1 = this.temListDataManifest[0]['goodsCategory'];
      // }
      // if (list.length > 0 && list[0]['goodsCategory']) {
      //   val2 = list[0]['goodsCategory'];
      // }
      // if (val2 && (val2 !== val1)) {
      //   this.$set(this.domainObject, 'goodsName', val2)
      // }
      // 
      // changeKeys('goodsCategory','goodsName');
      // changeKeys('goodsCategoryGb','cargoTypeClassificationCode');
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
            // let list0 = this.listDataManifest[0];
            // meterageType = list0['meterageType'];
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
      const map = { code: 'routeCode', routeName: 'routeName', standardDistance: 'standardDistance', loadingOrgName: 'loadingOrgName', loadingLinkmanFullName: 'loadingUserFullName', loadingContact: 'loadingUserPhone', loadingProvinceCode: 'loadingProvinceCode', loadingCityCode: 'loadingCityCode', loadingCountyCode: 'loadingCountyCode', loadingAddress: 'loadingAddress', unloadingOrgName: 'unloadingOrgName', unloadingLinkmanFullName: 'unloadingUserFullName', unloadingContact: 'unloadingUserPhone', unloadingProvinceCode: 'unloadingProvinceCode', unloadingCityCode: 'unloadingCityCode', unloadingCountyCode: 'unloadingCountyCode', unloadingAddress: 'unloadingAddress' ,businessTypeCode:'businessTypeCode'};
      let paramObj = {};
      Object.keys(map).forEach(key => {
        paramObj[key] = self.domainObject[map[key]];
      })
      updateRoute(paramObj, (success, error) => {
        if (error) { showMessageUtil('warning', error.content, 2000) };
        if (success) { showMessageUtil('success', '同步线路信息成功', 2000) };
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
          // 复制新建 需要 把code 去除
          if (getParamsFromURL(window.location.search).originalCode) {
            this.listDataManifest.forEach(item => {
              item.code = null;
              item.id = null;
            })
          }
          this.$nextTick(() => {
            if (this.$refs['eleManifest'] && this.$refs['eleManifest'].setColumnsDataMonitor) {
              this.$refs['eleManifest'].setColumnsDataMonitor();
            }
          })
        }
        if (error) { showMessageUtil('warning', error.content, 2000) };
      })
    },
    // 网络请求：批量修改货单信息
    // netEditManifestList(code) {
    //   let self = this;
    //   let paramObj = this.listDataManifest;
    //   editManifestList(code, paramObj, (success, error) => {
    //     if (error || success.code !== 200) {
    //       showMessageUtil('warning', error.content, 2000);
    //     }
    //     if (success) {
    //       if (this.isEdit) { // 编辑
    //         showMessageUtil('success', '提交成功', 2000);
    //         this.editable = false;
    //         this.btnDisabled = false;
    //       } else { //新建
    //         this.$confirm(`恭喜您,新建${self.objectName}成功！ 是否继续新建${self.objectName}?`, '提示', {
    //           confirmButtonText: '继续新建',
    //           cancelButtonText: `返回${self.objectName}列表`,
    //           type: 'success',
    //           customClass: 'confirm-dialog'
    //         }).then(() => {
    //           window.location.reload();
    //         }).catch(() => {
    //           let url = this.listUrl;
    //           const qindex = url.indexOf('?'),
    //             title = this.listTitle;
    //           if (qindex > -1 && !lsType) {
    //             url = url.substring(0, qindex);
    //           }
    //           urlRedirect(url, title);
    //         });
    //       }
    //     }
    //   })
    // },
    //新建logistics
    credtedLogistics() {
      if (!this.checkRulesInEleManifest()) { return; } //表格检验是否通过
      if (!this.ruleRecombinationData('clientFreightPrice', 'clientFreightPriceUnitCode', '客户运价')) { return; } //检验复合控件是否填写 规范
      if (!this.ruleRecombinationData('driverReferPrice', 'driverReferPriceUnitCode', '司机运价')) { return; } //检验复合控件是否填写 规范
      //1.校验 表单
      //2.提交 logistics 数据 拿到 code
      //3.提交 货单的信息
      const self = this;
      this.$refs['form'].$refs.form.validate((valid) => {
        if (valid) {
          let net = this.isEdit ? editLogistics : addLogistics;
          if(this.$refs['eleManifest']){
              //统计数据写入 domainObject中
            const cacFields = this.$refs['eleManifest'].$refs['pageSubtotal'].cacFields;
            // 'goodsWeight','goodsVolume','goodsNum' 这三个参数 在 domainObject 和 manifestList 一样的
            cacFields.forEach(item => {
              if (self.domainObject.hasOwnProperty(item.field)) {
                self.domainObject[item.field] = item.total;
              }
            })
          }
          self.btnDisabled = true;
          net(self.domainObject,self.listDataManifest, (success, error) => {
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
    // ========================================================= 以上为新的

    getDataWaybillStatistics() {
      let par = { logisticsCode: getParamsFromURL(window.location.search).code };
      if (!this.isEdit) {
        return;
      }
      getWaybillStatisticsDispatched(par, (success, error) => {
        this.modelWaybillStatistics = [];
        let self = this;
        if (success && success.content) {
          let content = success.content;
          content.forEach(con => {
            let fields = [{ key: 'ownerType', label: '派车模式', val: '' }, { key: 'totalFinishTruck', label: '运输完成车次', val: '' }, { key: 'totalGoingTruck', label: '运输中车次', val: '' }, { key: 'totalLoadingTruck', label: '待发货车次', val: '' }, { key: 'totalTruck', label: '已派车数', val: '' }],
              options = { 'owner': '自营派车', 'outsourcing': '外包派车' };
            fields.forEach(item => {
              if ('ownerType' === item.key) {
                item.val = options[con[item.key]];
              } else {
                item.val = con[item.key];
              }
            })
            self.modelWaybillStatistics.push(fields);
            console.log();
          })
        }
      })
    },
    dealWithClientFreightPrice() {
      if (!this.dataOrgManager) {
        return;
      }
      if (this.dataOrgManager.settleTradingConfigUnitCode == '%') {
        let num = Decimal(this.dataOrgManager.settleTradingConfigValue).div(100).toNumber();
        let num1 = Decimal(1).sub(num).toNumber();
        let finNum = Decimal(this.domainObject.clientFreightPrice).mul(Decimal(num1));
        this.domainObject.driverReferPrice = Math.floor(finNum * 100) / 100;
      } else if (this.dataOrgManager.settleTradingConfigUnitCode == 'yuan') {
        let finNum = this.domainObject.clientFreightPrice - this.dataOrgManager.settleTradingConfigValue;
        this.domainObject.driverReferPrice = Math.floor(finNum * 100) / 100;
      }
    },
    netGetOrgManager() {
      this.dataOrgManager = null;
      getOrgManager({ code: this.domainObject.platformClientOrgCode }, (success, error) => {
        if (success) {
          this.dataOrgManager = success.content;
        }
      });
    },
    // 如果是编辑页面 那么禁用托运客户
    changeClientOrgCode() {
      if (this.domainObject.code && this.domainObject.code.length > 0) {
        let el = this.$refs.form.getElementByField('clientOrgCode');
        if (el.configData) {
          el.configData.readonly = 'TRUE';
        }
      }
    },
    // // 时间格式修改
    // formatDateInDoamin(){
    //   Object.keys(this.domainObject).forEach(key=>{
    //     let val = this.domainObject[key];
    //      if (this.fieldTime instanceof Date){
    //        this.domainObject[key]  = dateFormat(val);
    //      }
    //   })
    // },
    getExtraParams(type) {
      switch (type) {
        case 'eleLogisticsPrice':
          return Object.assign(this.$refs.eleLogisticsPrice.priceModel, {
            ratesCode: this.$refs.eleLogisticsPrice.selectRate,
            logisticsRatesCode: this.$refs.eleLogisticsPrice.rateArray
          });
        default:
          return {};
      }
    },
    handleMeterageType(){
      // 新建订单打开，手动set计量标准为吨
      const params = getParamsFromURL(window.location.search).originalCode;
      if (!this.isEdit) {
        // 主要是为了 下拉框 的选项 随着计量标准 走
          const self = this;
        this.$nextTick(() => {
          let keysFileld = ['clientFreightPriceUnitCode', 'driverReferPriceUnitCode'];
          keysFileld.forEach(key => {
            let el = self.$refs.form.getElementByField(key);
            if (el && el.onRefresh) {
              el.onRefresh({ codeUnitType: this.domainObject.meterageType });
            }
          })
        })
      }
    },
    formReady(formData) {
      this.handleMeterageType();

      if (this.domainObject.routeCode) {
        // 获取线路信息
        const paramsObj = {
          code: this.domainObject.routeCode
        };
        routeGet(paramsObj, (success, error) => {
          if (error) {
            const dom = this.$refs.form.getElementByField('routeName');
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
      this.dealWithCustomFields();
      this.setDefaultVal();
      this.getDataWaybillStatistics();
      this.dealWithForHN();
      // 如果是编辑进来 ，那么需要 复制domaobject
      if (getParamsFromURL(window.location.search).code) {
        this.copyDomainObject = JSON.stringify(this.domainObject);
      }

      // 处理运价
      this.$watch('domainObject.routeCode', (val) => {
        if (val) {
          this.dealWithRates(val);
        }
      });
      
    },
    dealWithForHN(){
      if(getParamsFromURL(window.location.search).originalCode){
        this.domainObject.consignStartTime = null;
        this.domainObject.consignEndTime = null;
      }
    },
    dealWithCustomFields() {
      // 获取动态字段名称
      getDetail((success) => {
        const data = success.content;
        console.log('详情默认配置', data);
        data.forEach((val) => {
          this.defaultDetailColumns.push(val.fieldConfigCode);
        });
        console.log('详情实际配置', this.fields);
        this.fields.forEach((val) => {
          if (!val.extraParams[0].isShow) {
            this.actualDetailColumns.push(val.fieldConfigCode);
          }
        });
        console.log('详情默认显示字段为', this.defaultDetailColumns);
        console.log('详情实际显示字段为', this.actualDetailColumns);
        this.actualDetailColumns.forEach((val) => {
          if (!this.defaultDetailColumns.includes(val)) {
            this.clientDetailColumns.push(val);
          }
        });
        console.log('详情动态显示字段为', this.clientDetailColumns);
      });
    },
    formMounted(form) {
      if (this.isFirstLoad) {
        this.isFirstLoad = false;
      }
      this.changeClientOrgCode();
      if (this.domainObject.platformClientOrgCode) {
        if (form.getElementByField('clientContractCode')) {
          form.getElementByField('clientContractCode').$emit('refresh', { platformClientOrgCode: this.domainObject.platformClientOrgCode });
        }
      } else {}
      // 选择运价弹窗增加额外查询条件 platformCarrierOrgCode  clientOrgCode   model = > 弹框的 选择出来的model
      const ele_clientOrgCode = form.getElementByField('clientOrgCode');
      if (ele_clientOrgCode) {
        ele_clientOrgCode.$on('change', (model) => {
          const ele_clientContractCode = form.getElementByField('clientContractCode');
          if (ele_clientContractCode) {
            ele_clientContractCode.$emit('refresh', { platformClientOrgCode: model.orgCode });
          }
        });
      }
      // 新建订单打开，手动set计量标准为吨
      const params = getParamsFromURL(window.location.search).originalCode;

      const appInfo = JSON.parse(localStorage.getItem('appInfo'));
      if (appInfo.priceMode == 'auto') {
        // 把司机运价变成 readonly 变成不可以编辑
        let el = this.$refs.form.getElementByField('driverReferPrice');
        if (el.configData) {
          this.$set(el.configData, 'readonly', 'readonly')
          // el.configData.readonly = 'readonly';
        }
        // 有bug 第二个 没有起到作用
        let el2 = this.$refs.form.getElementByField('driverReferPriceUnitCode');
        if (el2.configData) {
          el2.configData.readonly = 'TRUE';
        }
      }

    },
    onLogisticsPriceChange(model) {
      this.domainObject.clientFreightPrice = model.clientFreightRate;
      this.domainObject.clientFreightPriceUnitCode = model.clientFreightRateUnitCode;
      this.domainObject.driverReferPrice = model.driverReferencePrice;
      this.domainObject.driverReferPriceUnitCode = model.driverReferencePriceUnitCode;
      this.domainObject.ratesDescription = model.description;
    },
    beforeSubmit(model) {
      if (!this.isEdit) {
        model.logisticsRatesCode = this.$refs.eleLogisticsPrice.rateArray;
        model.ratesCode = this.$refs.eleLogisticsPrice.selectRate;
      } else {
        model.ratesCode = this.$refs.eleLogisticsPrice.selectRate;
      }
    },
    editForm() {
      this.editable = true;
      // 存储 之前的值
      this.copyDomainObject = JSON.stringify(this.domainObject);
      // setTimeout(() => {
      //   let el = this.$refs.form.getElementByField('clientFreightPriceUnitCode');
      //   el.onRefresh({ codeUnitType: this.domainObject.meterageType });
      //   let el1 = this.$refs.form.getElementByField('goodsPriceUnitCode');
      //   el1.onRefresh({ codeUnitType: this.domainObject.meterageType });
      //   let el2 = this.$refs.form.getElementByField('driverReferPriceUnitCode');
      //   el2.onRefresh({ codeUnitType: this.domainObject.meterageType });
      // }, 500)
    },
    cancelEdit() {
      let self = this;
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
    // 检查复合组件中是否两个都填写了
    // 检查规则，只有在 两个中的一个 没有填写，才会 false
    checkComposite(arg1, arg2) {
      if (arg1 && !arg2) {
        return false;
      }
      if (!arg1 && arg2) {
        return false;
      }
      return true;
    },
    confirmSubmit() {
      this.credtedLogistics();
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
    // 校验表单 与 价格单位的检查
    validForm(formName) {
      // 检验 货物单价
      if (this.domainObject.goodsPrice && !this.domainObject.goodsPriceUnitCode) {
        showMessageUtil('warning', '请检查货物单价单位', 3000);
        return;
      }
      // 检验 客户运价
      if (this.domainObject.clientFreightPrice && !this.domainObject.clientFreightPriceUnitCode) {
        showMessageUtil('warning', '请选择"客户运价"单位', 3000);
        return;
      }
      // 检验 司机运价
      if (this.domainObject.driverReferPrice && !this.domainObject.driverReferPriceUnitCode) {
        showMessageUtil('warning', '请选择"司机运价"单位', 3000);
        return;
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.confirmSubmit();
        } else {
          return false;
        }
      });
    },
    submitForm(formName) {
      let self = this;
      // 检验 公司认证 与否 是否 可以 开展业务
      this.checkCertControl().then(function(flag) {
        self.validForm(formName);
      }).catch(function(argument) {
        console.log('验证失败 ....', argument)
      })
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
    showError(text) {
      this.$message({
        type: 'error',
        showClose: true,
        message: text,
        duration: 5000
      });
      return false;
    },
    // 默认给 承运方 赋值 当前组织，只有 在创建的时候的才赋值，若是编辑页面则不用
    setDefaultVal() {
      const orgInfo = JSON.parse(localStorage.getItem('orgInfo')).content;
      this.domainObject.carrierOrgName = orgInfo.orgName; // 改为带简称
      this.domainObject.carrierOrgCode = orgInfo.code;
      this.domainObject.platformCarrierOrgCode = orgInfo.code;
      this.domainObject.transcompany = orgInfo.orgExternalNo; // 默认带出承运方编码
    }
  }
};

</script>
<style lang="scss" rel="stylesheet/scss">
.list-page {
  height: auto !important;

  .fix-table-wrap {
    height: auto !important;
    max-height: 607px;

    .rl-fix-table {
      margin-left: 0 !important;
    }
  }
}

</style>
