/** * add.vue * Created by cc on 17/8/10. */
<template>
  <div>
    <!-- 外包 页面 -->
    <div class="form-page">
      <ele-form ref="form" :domainObject="domainObject" :configUrl="configUrl" :listUrl="listUrl" :listTitle="listTitle" :getInfo="getInfo" :addFun="addFun" :editFun="editFun" :editable="editable" :isEdit="isEdit" @formMounted="formMounted" @formReady="formReady" @editSuccess="editSuccess" @submitDone="submitDone" :objectName="objectName" label-width="100px" :inline="false" :folder="folder">
        <layout :isEdit="isEdit" :editable="editable" :objectName="objectName" :domainObject="domainObject" :clientDetailColumns="clientDetailColumns">
          <div v-for="field in fields" :slot="field.fieldConfigCode">
            <el-form-item :label="field.showName" :required="field.required ==='true'">
              <ele-block :field="field" :domainObject="domainObject" :editable="editable" :uploadUrl="uploadUrl" :inputKey="inputKey"></ele-block>
            </el-form-item>
          </div>
          <el-button type="primary" v-show="!editable && isEdit" @click="editForm()" slot="buttonEdit">编辑</el-button>
          <el-button v-show="editable && isEdit" @click="cancelEdit()" slot="buttonCancel">取消编辑</el-button>
          <el-button v-show="editable && isEdit && tplName === 'eleLogisticsPrice'" @click="submitForm('form')" slot="buttonSave">保存</el-button>
          <el-button v-show="!editable && isEdit" @click="changeLog()" slot="buttonChangeLog">{{ objectName }}变更记录</el-button>
          <template v-show='editable && !isEdit' v-if="!(tplName === 'eleLogisticsPrice' && code)">
            <el-button type="primary" @click="submitForm('form')" size="large" slot="buttonSubmit" :disabled="btnDisabled">提交</el-button>
            <el-button @click="resetForm('form')" size="large" slot="buttonReset" :disabled="btnDisabled">重置</el-button>
          </template>
          <!-- 凭证记录 START -->
          <evidence slot="tabEvidence" :domainObject="domainObject" :uploadUrl="uploadUrl" :editable="editable"></evidence>
          <!-- 凭证记录 END -->
          <!-- 货单表格 start -->
          <div slot='manifestModule'>
            <eleManifestList ref='eleManifest' v-if="showManifestList" :showTopTab='showManifestListTop' :isEdit='isEdit' :editable='editable' @hasValueChange='hasValueChange' :getColumn='getColumnManifest' :listData='listDataManifest' :editableFields=editableFields @query="query" @eleManifestMounted='eleManifestMounted' @fieldChange='fieldChange' :loadingMode='loadingMode'>
            </eleManifestList>
          </div>
          <el-button class='fr' v-show="editable" @click="syncRouterInfo()" slot="syncModule">信息同步到线路</el-button>
          <!-- 货单表格 end   -->
          <!-- 运单记录 start ============ -->
          <div slot="tabWaybill">
            <waybill-statistics-msg :modelWaybillStatistics='modelWaybillStatistics'></waybill-statistics-msg>
            <waybill slot="tabWaybill" :showminiSearch='false' :showRecycle='false' :showBatchFixPrice='false' :isFormLogistics='true' :isFormLogisticsOutsourcing='true' :selectable="false" :operatable="false" :customColumn="customColumnWaybill" :isAdvanced="false" :params="params" :needPage="true" :needMore="false"></waybill>
          </div>
          <!-- 运单记录  end ============ -->
          <rates-change-list slot="tabPriceChangeLog" :code="code"></rates-change-list>
          <logs slot="tabChangeLog" :selectable="false" :operatable="false" :domain="uploadUrl" :type="logType" :code="code" :isAdvanced="false" :params="params" :needPage="true"></logs>
          <logisticsReference slot="logisticsReference" v-if="showLogisticsReference"></logisticsReference>
        </layout>
      </ele-form>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import ratesChangeList from './ratesList.vue';
import eleForm from '../components/ele-form/eleForm.vue';
import layout from './layout.vue';
import evidence from './evidence.vue';

import { add, edit, get, getDetail,addLogistics,editLogistics } from '../../api/OutsourcingLogisticsService';
import { selfs } from '../../api/OrgService';
import { get as routeGet } from '../../api/RouteService';
import eleBlock from '../components/ele-block/eleBlock.vue';
import eleLogisticsPrice from './eleLogisticsPrice.vue';
import { getParamsFromURL, showMessageUtil, deepClone, getGoodsCategoryVal, getMeterageTypeByGoodsCategoryCode, getGoodsCategoryByKey, urlRedirect } from '../../api/Utils';
import waybill from '../outsourcingWaybill/list.vue';
import logs from '../logs/list.vue';
import waybillStatisticsMsg from '../logistics/waybillStatisticsMsg.vue';
import logisticsReference from '../outsourcingLogistics/logisticsReference.vue';

import eleManifestList from '../components/ele-manifest-list/eleManifestList.vue';
import { update as updateRoute } from '../../api/RouteService';
import { get as getLogisticsInfo, getWaybillStatistics, getColumnManifestSingle, getColumnManifestMultiple, getManifestList, getRates } from '../../api/LogisticsService';

import ApiConst from '../../api/ApiConst';

// 引入tab跳转
require('../public.js');

export default {
  components: {
    logs,
    layout,
    waybill,
    evidence,
    eleManifestList,
    logisticsReference,
    eleLogisticsPrice,
    'ele-form': eleForm,
    'ele-block': eleBlock,
    'rates-change-list': ratesChangeList,
    'waybill-statistics-msg':waybillStatisticsMsg
  },
  data() {
    return {
      objectName: '外包订单',
      listDataManifest: [],
      listDataManifestSingle: [],
      listDataManifestMultiple: [],
      editableFields: [],
      showManifestList: true,
      getColumnManifest: getColumnManifestSingle,
      showManifestListTop: false,
      manifestListCode: null, //货单的code
      temListDataManifest: [], // 临时存放 listData
      loadingMode:'multiple',



      configUrl: `${ApiConst.apiLogisticsDomain}/detail_render_info/outsourcing/list`,
      folder: 'logistics/outsourcing',
      tplName: 'eleLogisticsPrice',
      domainObject: {},
      addFun: add,
      editFun: edit,
      getInfo: get,
      uploadUrl: ApiConst.apiLogisticsDomain,
      logType: 'logisticsOutsourcing',
      listUrl: '/outsourcingLogistics/confirm.html',
      listTitle: '外包订单确认列表',
      fields: [],
      isEdit: false, // 控制编辑添加按钮
      editable: true, // 控制页面状态
      loading: true,
      code: '',
      getData: {},
      btnDisabled: false,
      customColumnWaybill: ['waybillNo', 'waybillStatus1', 'waybillStatus', 'truckLicenseNo', 'trailerTruckLicenseNo', 'driverFullName', 'loadingTime', 'unloadingTime', 'loadingGoodsWeight', 'unloadingGoodsWeight', 'createTime'],
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
      modelWaybillStatistics: {
        shuntedNum: 0,
        loadingNum: 0,
        goingNum: 0,
        arriveNum: 0,
        unloadingNum: 0,
      },
      showLogisticsReference: false,
      projectName: ''
    };
  },
  watch: {
    // 'domainObject.meterageType': function(newVal, oldVal) {
    //   if (this.editable) {
    //     var str = ''
    //     switch (newVal) {
    //       case 'ton':
    //         str = 'yuanperton'
    //         break;
    //       case 'cube':
    //         str = 'yuanpercube'
    //         break;
    //       case 'item':
    //         str = 'yuanperitem'
    //         break;
    //       default:
    //         break;
    //     }
    //     this.$set(this.domainObject, 'goodsPriceUnitCode', str)
    //     // this.$set(this.domainObject,'driverReferPriceUnitCode', str)
    //     this.$set(this.domainObject, 'clientFreightPriceUnitCode', str)
    //   }
    // },
  },
  methods: {
    ruleRecombinationData(key1,key2,nameTip){
      const val1 = this.domainObject[key1],
            val2 = this.domainObject[key2];
      if((val1 && !val2) || (val2 && !val1)){
        showMessageUtil('warning', `请检查${nameTip}，填写不完全`, 2000)
        return false;
      }
      return true;
    },
    fieldChange(key, indexMark) {},
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
        if(meterageType){
          const map = {'ton':['goodsWeight','货物重量'],'cube':['goodsVolume','货物体积'],'item':['goodsNum','货物数量']};
          const arr = map[meterageType];
          const key = arr[0];
          if(!item[key]){
            msg = `请填写${arr[1]}`;
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

    //下面是新的 =====================================================
    query() {
      let self = this;
      let logisticsCode = getParamsFromURL(window.location.search).code ||  getParamsFromURL(window.location.search).originalCode || '';
      if (logisticsCode) { //详情
        this.netGetManifestList(logisticsCode)
      } else { //新建
        if (this.listDataManifest.length < 1) {
          this.$nextTick(() => { 
            if(this.$refs['eleManifest'] && this.$refs['eleManifest'].addRow){
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
        // mode = this.domainObject.loadingMode;
        mode = 'multiple';
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
      const map = { code: 'routeCode', routeName: 'routeName', standardDistance: 'standardDistance', loadingOrgName: 'loadingOrgName', loadingLinkmanFullName: 'loadingUserFullName', loadingContact: 'loadingUserPhone', loadingProvinceCode: 'loadingProvinceCode', loadingCityCode: 'loadingCityCode', loadingCountyCode: 'loadingCountyCode', loadingAddress: 'loadingAddress', unloadingOrgName: 'unloadingOrgName', unloadingLinkmanFullName: 'unloadingUserFullName', unloadingContact: 'unloadingUserPhone', unloadingProvinceCode: 'unloadingProvinceCode', unloadingCityCode: 'unloadingCityCode', unloadingCountyCode: 'unloadingCountyCode', unloadingAddress: 'unloadingAddress',businessTypeCode:'businessTypeCode' };
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
      if (!logisticsCode) { return; }
      getManifestList({ code: logisticsCode }, (success, error) => {
        if (success && success.content) {
          this.listDataManifest = success.content;
          // 复制新建 需要 把code 去除
          if(getParamsFromURL(window.location.search).originalCode){
            this.listDataManifest.forEach(item=>{
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
    //新建logistics
    credtedLogistics() {
      if (!this.checkRulesInEleManifest()) { return; } //表格检验是否通过
      if (!this.ruleRecombinationData('clientFreightPrice','clientFreightPriceUnitCode','外包运价')) { return; } //检验复合控件是否填写 规范
      //1.校验 表单
      //2.提交 logistics 数据 拿到 code
      //3.提交 货单的信息
      const self = this;
      this.$refs['form'].$refs.form.validate((valid) => {
        if (valid) {
          let net = this.isEdit ? editLogistics : addLogistics;
          // ####### 外包订单中 需要给初始值 logisticsStatus = 'ready',订单中不需要。订单创建完就是 todo
          if(!this.isEdit){
            this.domainObject.logisticsStatus  = 'ready';
          }
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
    dealWithRouteBoard() {
      const logisticsOutsourceCode = getParamsFromURL(window.location.search).logisticsOutsourceCode;
      if (!logisticsOutsourceCode) { return; }
      const
        self = this,
        listCode = ['routeCode', 'loadingOrgName', 'loadingUserFullName', 'loadingUserPhone', 'loadingAddress', 'unloadingOrgName', 'unloadingUserFullName', 'unloadingUserPhone', 'unloadingAddress', 'isUpdate', 'meterageType'];
      this.$nextTick(() => {
        listCode.forEach(item => {
          let el = this.$refs.form.getElementByField(item);
          if (el && el.configData) {
            const val = el.configData.controlType === 'text' ? 'readonly' : 'TRUE';
            self.$set(el.configData, 'readonly', val);
          }

          if (el && el.configData && item === 'meterageType') {
            self.$set(el.configData, 'disabled', true);
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
    // 转包过来，客户运价的单位不可以修改
    dealWithUnitCodeFormLogistics() {
      const
        self = this,
        code = getParamsFromURL(window.location.search).logisticsOutsourceCode;
      if (!code) { return; }
      this.$nextTick(() => {
        let el = self.$refs.form.getElementByField('clientFreightPriceUnitCode');
        if (el.configData) {
          self.$set(el.configData, 'readonly', 'TRUE');
        }
      });
    },
    getDataWaybillStatistics() {
      let par = { logisticsCode: getParamsFromURL(window.location.search).code };
      if (!this.isEdit) {
        return;
      }
      getWaybillStatistics(par, (success, error) => {
        if (success && success.content) {
          this.modelWaybillStatistics.shuntedNum = success.content.shuntedNum;
          this.modelWaybillStatistics.loadingNum = success.content.loadingNum;
          this.modelWaybillStatistics.goingNum = success.content.goingNum;
          this.modelWaybillStatistics.arriveNum = success.content.arriveNum;
          this.modelWaybillStatistics.unloadingNum = success.content.unloadingNum;

        }
      })
    },
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
    formReady(formData) {
      this.$nextTick(() => {
        this.syncMeterageType();
      })
      if (this.domainObject.routeCode) {
        // 获取线路信息
        const paramsObj = {
          code: this.domainObject.routeCode
        };
        routeGet(paramsObj, (success, error) => {
          if (error) {
            console.log('线路信息提示：', error.content)
            // this.$message({
            //   type: 'warning',
            //   message: error.content,
            //   duration: 3000
            // });
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
      this.setDefaultVal();
      this.getDataWaybillStatistics();
      this.dealWithRouteBoard();
      this.dealWithMeterageTypeByOriginalCode();
      this.dealWithUnitCodeFormLogistics();
      // 处理运价
      this.$watch('domainObject.routeCode', (val) => {
        if (val) {
          this.dealWithRates(val);
        }
      });
    },
    // 处理计量标准 的切换    新建ok 复制新建 也ok
    dealWithMeterageTypeByOriginalCode() {
      let self = this;
      this.$nextTick(() => {
        let ele_meterageType = self.$refs.form.getElementByField('meterageType');
        ele_meterageType.$emit('change', self.domainObject['meterageType']);
      });
    },

    formMounted(form) {
      const params = getParamsFromURL(window.location.search).originalCode || getParamsFromURL(window.location.search).logisticsOutsourceCode;
      // 复制新建外包订单，忽略询价单号，报价单号
      if (getParamsFromURL(window.location.search).originalCode) {
        const copyIgnoreFields = ['rfqCode', 'rfqNo', 'quoteCode', 'quoteNo'];
        copyIgnoreFields.forEach((v) => {
          this.$set(this.domainObject, v, null);
        });
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
        console.log('beforeSubmit', model);
      } else {
        model.ratesCode = this.$refs.eleLogisticsPrice.selectRate;
      }
    },
    editForm() {
      this.editable = true;
      this.dealWithMeterageTypeByOriginalCode();

    },
    cancelEdit() {
      this.$refs.form.resetForm();
      this.editable = false;
    },
    confirmSubmit() {
      // // 货物单价的校验
      // if (this.domainObject.goodsPrice && !this.domainObject.goodsPriceUnitCode) {
      //   showMessageUtil('货物单价必须填写');
      //   return;
      // }
      // // 客户运价 与 司机运价 的计量标准 的校验
      // if (this.domainObject.clientFreightPrice && !this.domainObject.clientFreightPriceUnitCode) {
      //   // this.showError('客户运价单位必须填写');
      //   showMessageUtil('warning', '请选择"客户运价"单位', 3000);
      //   return;
      // }
      // this.btnDisabled = true;
      // this.$refs.form.submitForm();
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
        showMessageUtil('warning', '请选择"外包运价"单位', 3000);
        return;
      }
      // 检验 司机运价
      if (this.domainObject.driverPrice && !this.domainObject.driverPriceUnitCode) {
        showMessageUtil('warning', '请检查司机运价 单位', 3000);
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
    // 默认给 托运客户 赋值 当前组织，只有 在创建的时候的才赋值，若是编辑页面则不用
    setDefaultVal() {
      const localStorage = window.localStorage;
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      console.log('userInfo ...', userInfo);
      this.domainObject.clientOrgName = userInfo.orgFullName;
      this.domainObject.clientOrgCode = userInfo.orgCode;
      this.domainObject.platformClientOrgCode = userInfo.orgCode;
    },
    dealWithRates(code) {
      return false;
    }
  },
  created() {
    this.projectName = JSON.parse(localStorage.getItem('appInfo')).projectName;
  },
  mounted() {
    const self = this,
      logisticsOutsourceCode = getParamsFromURL(window.location.search).logisticsOutsourceCode,
      initKeys = ['code', 'logisticsNo', 'routeName', 'routeCode', 'businessTypeCode', 'cargoTypeClassificationCode', 'goodsName', 'meterageType', 'goodsWeight', 'goodsVolume', 'goodsNum', 'truckQty', 'goodsPrice', 'goodsPriceUnitCode', 'goodsLossMethod', 'goodsLoss', 'goodsLossUnitCode', 'settleMethod', 'description', 'loadingOrgName', 'loadingProvinceCode', 'loadingCityCode', 'loadingCountyCode', 'loadingAddress', 'loadingUserFullName', 'loadingUserPhone', 'unloadingOrgName', 'unloadingProvinceCode', 'unloadingCityCode', 'unloadingCountyCode', 'unloadingAddress', 'unloadingUserFullName', 'unloadingUserPhone', 'logisticsExternalNo1', 'terminalCompany', 'shippingAgent', 'shipName', 'voyage', 'commissionType', 'shippingMark', 'ladingBill', 'processingTime', 'supplyOrgName', 'supplyOrgCode', 'platformSupplyOrgCode', 'logisticsPlanStartTime', 'logisticsPlanEndTime', 'clientFreightPriceUnitCode'];
    if (logisticsOutsourceCode) {
      getLogisticsInfo({ code: logisticsOutsourceCode }, (success, error) => {
        if (error || success.code !== 200) {
          this.$message({
            type: 'error',
            message: error.content,
            duration: 5000
          });
          return false;
        }
        if (success) {
          const data = success.content;
          console.log('logistics info is', data);
          Object.keys(data).forEach((key) => {
            if (initKeys.includes(key)) {
              if (key === 'code') {
                this.$set(self.domainObject, 'parentLogisticsCode', data[key]);
              } else if (key === 'logisticsNo') {
                this.$set(self.domainObject, 'parentLogisticsNo', data[key]);
              } else {
                this.$set(self.domainObject, key, data[key]);
              }
            }
          });
          setTimeout(() => {
            this.$set(self.domainObject, 'goodsPriceUnitCode', data.goodsPriceUnitCode);
          }, 500);
        }
      });
    }
    self.showLogisticsReference = true;

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
