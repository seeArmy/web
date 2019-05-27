/** * add.vue * Created by cc on 17/8/10. */
<template>
  <div>
    <!-- 发布货源页面 -->
    <div class="form-page">
      <ele-form :domainObject="domainObject" ref="form" :configUrl="configUrl" :listUrl="listUrl" :listTitle="listTitle" :getInfo="getInfo" :addFun="addFun" :editFun="editFun" :editable="editable" :isEdit="isEdit" @formReady="formReady" @formMounted="formMounted" @editSuccess="editSuccess" @submitDone="submitDone" :objectName="objectName" label-width="100px" :inline="false" :folder="folder">
        <layout :isShowTag='isShowTag' :isEdit="isEdit" :editable="editable" :objectName="objectName" :domainObject='domainObject' :disableModeSelect="disableModeSelect" :clientDetailColumns="clientDetailColumns">
          <div v-for="field in fields" :slot="field.fieldConfigCode" v-if="checkPms(field)">
            <el-form-item :label="field.showName" :required="field.required ==='true'">
              <ele-block :field="field" :domainObject="domainObject" :editable="editable" :uploadUrl="uploadUrl" :inputKey="inputKey"></ele-block>
            </el-form-item>
          </div>
          <!-- 货单表格 start -->
          <div slot='manifestModule'>
            <eleManifestList ref='eleManifest' v-if="showManifestList" :showTopTab='showManifestListTop' :isEdit='isEdit' :editable='editable' @hasValueChange='hasValueChange' :getColumn='getColumnManifest' :listData='listDataManifest' :editableFields=editableFields @query="query" @eleManifestMounted='eleManifestMounted' @fieldChange='fieldChange' :listFieldsCheckNumber='listFieldsCheckNumber' :loadingMode='loadingMode'>
            </eleManifestList>
          </div>
          <!-- <el-button type="primary" v-show="!editable && isEdit" @click="editForm()" slot="buttonEdit">编辑</el-button>
        <el-button v-show="editable && isEdit" @click="cancelEdit()" slot="buttonCancel">取消编辑</el-button>
        <el-button v-show="editable && isEdit" @click="submitForm()" slot="buttonSave">保存</el-button> -->
          <!--   <div slot="publishRules">
          <el-form-item class="check-required">
            <el-checkbox v-model="ruleForm.agree">同意《<a :href="appInfo.publishfreightUrl" class="blue" target="_blank">{{ appInfo.publishfreightRules }}</a>》</el-checkbox>
          </el-form-item>
        </div>

        <div class="link" slot="publishRulesLink">
            点击查看《<a :href="appInfo.publishfreightUrl" class="blue" target="_blank">{{ appInfo.publishfreightRules }}</a>》
        </div> -->
          <div class="agree-box" slot="agree" v-if='editable'>
            <el-checkbox v-model="agree" v-if="editable">同意<a :href="agreementUrl" class="blue" target="_blank">《{{agreementName}}》（点击查看）</a></el-checkbox>
            <span v-else>已同意<a :href="agreementUrl" class="blue" target="_blank">《{{agreementName}}》（点击查看）</a></span>
          </div>
          <el-button v-show='editable && !isEdit' type="primary" @click="submitForm('form')" size="large" slot="buttonSubmit" :disabled="btnDisabled">提交</el-button>
          <el-button v-show='editable && !isEdit' @click="resetForm()" size="large" slot="buttonReset" :disabled="btnDisabled">重置</el-button>
           <el-button class='fr' v-show="editable" @click="syncRouterInfo()" slot="syncModule">信息同步到线路</el-button>
          <acceptRecord ref='acceptRecord' slot="tabAcceptRecord" :selectable="true" :code="code" :isAdvanced="true" :needPage="true" :params="acceptParams" @sendCarBatch='sendCarBatch'>
          </acceptRecord>
          <!--    <logs slot="tabChangeLog" :selectable="false" :operatable="false"
      :domain="uploadUrl" :type="logType" :code="code" :isAdvanced="false"
      :params="changeLogParams" :needPage="true">
    </logs> -->
        </layout>
      </ele-form>
      <el-dialog title="委托调车合作协议" :visible.sync="dialogVisible" size="large" :title="agreementNameTan">
        <div class="rules-frame">
          <iframe :src="agreementUrlTan" frameborder="0" scrolling="auto" class="rule-frame"></iframe>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">再考虑一下</el-button>
          <el-button type="primary" @click="confirmSubmit()" :disabled="btnDisabled">同意提交</el-button>
        </span>
      </el-dialog>
      <!-- 派车提示 -->
      <el-dialog title="派车提示" :visible.sync="dialogVisibleSendCar" size="large" class='dialog_send'>
        <p class="dialog_des_title">您当前选择的调车模式是 <span>{{domainObject.scheduleType === 'platform' ? '委托调车' : '自助调车'}} </span></p>
        <!-- 只选择了一个 -->
        <div v-if='modelSendCar.len == 1'>
          <p class="dialog_des_titile_mid">{{domainObject.scheduleType === 'platform' ? '确定给平台推荐的以下车辆和司机派车吗？' : '确定给以下车辆和司机派车吗？'}} </p>
          <p class="dialog_des_titile_mid"><span class="truck_no">{{modelSendCar.model.truckLicenseNo}}</span><span class="name">{{modelSendCar.model.driverFullName}}</span><span class="phone">{{modelSendCar.model.driverPhone}}</span></p>
        </div>
        <!-- 选择了多个 -->
        <div v-if='modelSendCar.len > 1'>
          <p class="dialog_des_titile_mid">共选中 <span class="num">{{modelSendCar.len}}</span>组平台推荐的车辆和司机</p>
          <p class="dialog_des_titile_mid">确定给这些车辆和司机派车吗？</p>
        </div>
        <!-- 委托平台 的模式下 的样式 str -->
        <div v-if="domainObject.scheduleType === 'platform'">
          <p> 点击“确定”后，您跟平台之间的委托派车协议将立即生效，同时平台将发出派车邀约给司机。</p>
          <!-- 去除委托调车客户服务协议 7-24 需求 by zhang -->
          <!--   <div class="agree-box">
            <el-checkbox v-model="agreeSendCar">同意<a :href="agreementUrl3" class="blue" target="_blank">《{{agreementName3}}》（点击查看）</a></el-checkbox>
          </div> -->
        </div>
        <!-- 同时把车辆司机添加到我的车辆库 start -->
        <div class="agreeTruck">
          <el-checkbox v-model="agreeTruck">同时把车辆司机添加到我的车辆库</el-checkbox>
        </div>
        <!-- 同时把车辆司机添加到我的车辆库 end -->
        <!-- 委托平台 的模式下 的样式 end -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisibleSendCar = false">取消</el-button>
          <el-button type="primary" @click="confirmSendCar()" :disabled="disabledSendCar">确定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import layout from './layout.vue';

import eleBlock from '../components/ele-block/eleBlock.vue';
import eleForm from '../components/ele-form/eleForm.vue';
import { add as freightAdd, edit as freightEdit, get as freightGet, getPersonInfo ,getColumnManifestMultiple,getColumnManifestSingle,addFreight,editFreight,getWaybillProgressByFreightCode,getManifestList} from '../../api/FreightService';
import * as freightService from '../../api/FreightService';
import { selfs } from '../../api/OrgService';
import { urlRedirect } from '../../api/Utils';
import logs from '../logs/list.vue';
import acceptRecord from '../freightAcceptRecord/list.vue';

import ApiConst from '../../api/ApiConst';
import { getParamsFromURL, dateFormat, showMessageUtil, checkPermission ,deepClone} from '../../api/Utils';

import * as LogisticsService from '../../api/LogisticsService';
import { customLogisticsNewRateGet } from '../../api/CustomService';
import { get as getOrgManager } from '../../api/OrgManagementService';
import { update as updateRoute } from '../../api/RouteService';
import Decimal from "decimal.js";
import eleManifestList from '../components/ele-manifest-list/eleManifestList.vue';
const localStorage = window.localStorage;
const userInfo = JSON.parse(localStorage.getItem('appInfo'));

export default {
  components: {
    'ele-form': eleForm,
    'ele-block': eleBlock,
    layout,
    acceptRecord,
    logs,
    eleManifestList
  },
  computed: {
    modelSendCar() {
      let obj = { len: 0, model: {} };
      if (this.listData.length > 0) {
        this.listData.forEach(item => {
          if (true === item.checked && 'undispatched' == item.driverAcceptStatus) {
            obj.len++;
            obj.model = item;
          }
        });
      }
      return obj;
    }
  },
  data() {
    return {
      isShowTag:false, //默认不显示分组
      objectName: '货源',
      configUrl: `${ApiConst.apiFreightDomain}/detail_render_info/freight/list`,
      domainObject: {},
      addFun: freightAdd,
      editFun: freightEdit,
      getInfo: freightGet,
      uploadUrl: ApiConst.apiFreightDomain,
      logType: 'freight',
      listUrl: '/freight/list.html',
      listTitle: '货源管理',
      status: false,
      code: '',
      'goto': null,
      fields: [],
      isEdit: false, // 控制编辑添加按钮
      editable: true, // 控制页面状态
      btnDisabled: false,
      changeLogParams: {
        code: getParamsFromURL(window.location.search).code,
        size: 10
      },
      acceptParams: {
        freightCode: getParamsFromURL(window.location.search).code
      },
      loading: true,
      ruleForm: {
        agree: false
      },
      appInfo: {
        publishfreightRules: '',
        publishfreightUrl: ''
      },
      agree: false,
      agreementName: '',
      agreementUrl: '',

      agreementNameTan: '',
      agreementUrlTan: '',

      agreementName3: '',
      agreementUrl3: '',

      dialogVisible: false,
      dialogVisibleSendCar: false,
      agreeSendCar: true, //去除委托调车客户服务协议 7-24 需求 by zhang 此处直接给 true，很多地方就不需要修改了
      listData: [],
      userInfo: userInfo,
      disableModeSelect: '',
      disabledSendCar: false,
      dataOrgManager: null,
      agreeTruck: true,
      projectName: JSON.parse(localStorage.getItem('appInfo')).projectName,
      folder: 'freight/freight',
      defaultDetailColumns: [],
      actualDetailColumns: [],
      clientDetailColumns: [],
      truckQtyIndex: 0,
      listDataManifest: [],
      listDataManifestSingle: [],
      listDataManifestMultiple: [],
      editableFields: [],
      getColumnManifest: getColumnManifestSingle,
      showManifestList: true,
      showManifestListTop: false,
      manifestListCode: null, //货单的code
      temListDataManifest: [], // 临时存放 listData
      loadingMode: 'multiple',
      listFieldsCheckNumber: [],
      tempGoodsNum:0,
      tempGoodsWeight:0,
      tempGoodsVolume:0
    };
  },
  watch: {
    'domainObject.dispatchMode': function(newVal, oldVal) {
      const el = document.getElementById('radio-quoteType').getElementsByClassName('el-radio')[0],
        truckEl= this.$refs.form.getElementByField('truckQty');

      if(newVal === 'auto') {
        // this.$refs['form'].mountedDone()
        this.$set(this.domainObject, "quoteType", 'price')
        this.$set(this.fields[this.truckQtyIndex], "required", "true")
        // truckEl.rules.push({type: 'number', required: true, trigger: 'blur', message: '不能为空'})
        this.$nextTick(() => {
          el.childNodes[0].childNodes[1].disabled = true
          el.childNodes[0].className = "el-radio__input is-disabled"
        })
      }
      if(newVal === 'manual') {
        el.childNodes[0].childNodes[1].disabled = false
        el.childNodes[0].className = "el-radio__input"
        this.$set(this.fields[this.truckQtyIndex], "required", "false")
        // truckEl.rules.pop()
      }
    }
  },
  created(){
    this.detalWithListFieldsCheckNumber();
  },
  methods: {
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
    confirmSendCar() {
      if (this.domainObject.scheduleType === 'platform') {
        if (this.agreeSendCar) {
          this.dialogVisibleSendCar = false;
          this.disabledSendCar = true;
          this.$refs.acceptRecord.netWorkSendCar();
          // 如果点击了 同时添加司机 ... 发送网络请求
          if (this.agreeTruck) {
            this.$refs.acceptRecord.netWorkAddTruck();
          }
        } else {
          this.$message({
            type: 'warning',
            message: '请勾选同意委托调车合作协议！',
            duration: 3000
          });
        }
      } else {
        this.disabledSendCar = true;
        this.dialogVisibleSendCar = false;
        // 自助模式
        this.$refs.acceptRecord.netWorkSendCar();
        // 如果点击了 同时添加司机 ... 发送网络请求
        if (this.agreeTruck) {
          this.$refs.acceptRecord.netWorkAddTruck();
        }
      }
    },
    sendCarBatch(list) {
      this.listData = list;
      this.dialogVisibleSendCar = true;
    },
    // 默认给 承运方 赋值 当前组织，只有 在创建的时候的才赋值，若是编辑页面则不用
    setDefaultVal() {
      const localStorage = window.localStorage;
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));

      this.domainObject.carrierOrgName = userInfo.orgFullName;
      this.domainObject.carrierOrgCode = userInfo.orgCode;
      this.domainObject.platformCarrierOrgCode = userInfo.orgCode;

      this.domainObject.clientOrgName = userInfo.orgFullName;
      this.domainObject.clientOrgCode = userInfo.orgCode;
      this.domainObject.platformClientOrgCode = userInfo.orgCode;

    },
    getUnitText(unitCode) {
      return new Promise((resolve, reject) => {
        DataSourceService.driverPrice.getData({}, (success, error) => {
          if (success) {
            let text = '';
            success.forEach((val) => {
              if (val.data.code === unitCode) {
                text = val.data.codeName;
              }
            });
            if (text) {
              resolve(text);
            } else {
              reject('没有匹配到code name');
            }
          }
          if (error) {
            reject(error);
          }
        });
      });
    },
    formReady(formData) {
      this.inputKey = formData.paramData.inputKey;
      this.fields = formData.paramData.field;
      this.isEdit = formData.isEdit;
      this.editable = formData.editable;
      this.code = formData.code;
      // 复制新建的时候，时间为当前时间 往后一天，8/1 by需求
      if (!this.domainObject.freightEndTime || this.domainObject.freightEndTime.length < 1 || getParamsFromURL(window.location.search).originalCode) {
        // 显示后一天
        const date_mu = 86400000;
        const dateMo = new Date(new Date().getTime() + date_mu)
        const dateLater = dateFormat(dateMo, 'yyyy-MM-dd HH-mm-ss');
        this.domainObject.freightEndTime = dateLater;
      }

      // status  pushling 复制新建的时候，状态改为发布中，8/1 by需求
      if (getParamsFromURL(window.location.search).originalCode) {
        this.domainObject.status = 'pushling';
      }

      // 默认带入 发货联系人 与手机
      let code = getParamsFromURL(window.location.search).code;
      // this.setDefaultVal();
      const localStorage = window.localStorage;
      if (!code) {
        // let userInfo = JSON.parse(localStorage.getItem('userInfo'));
        // this.domainObject.contactUserFullName = userInfo.userFullName;
        // this.domainObject.contactPhone = userInfo.loginAccount;
        getPersonInfo({}, (success) => {
          if (200 == success.code) {
            if (success.content.fullName) this.domainObject.contactUserFullName = success.content.fullName;
            if (success.content.phone) this.domainObject.contactPhone = success.content.phone;
          }
        });
      }
      if (formData.model && formData.model.logisticsCode) {
        this.logisticsCode = formData.model.logisticsCode;
      }

      const params = getParamsFromURL(window.location.search),
        self = this;
      if (params.logisticsCode) { // 有详情
        LogisticsService.get({
          code: params.logisticsCode
        }, (success) => {
          if (success) {

            this.$set(this.domainObject,'goodsName',success.content.goodsName);
            this.$set(this.domainObject,'ratesDescription',success.content.ratesDescription);
            this.$set(this.domainObject,'clientSettleMethod',success.content.clientSettleMethod);

            self.$refs.form.dispatchEvent('logisticsCode', 'select', success.content);

            this.netGetManifestList(params.logisticsCode);
            setTimeout(() => {
              if(self.domainObject.quotePrice){
                self.domainObject.quotePrice = self.domainObject.quotePrice * 1;
              }
              // TODO :临时解决问题，订单 发布货源 客户结算方式
              self.$set(self.domainObject,'clientSettleMethod',success.content.clientSettleMethod);
              this.$set(this.domainObject,'goodsName',success.content.goodsName);
            }, 500);

            this.huanengPlugin()
          }
        });
      } else if (params.originalCode) { // 复制新建 货源 ，此处数据全部拿到了
        // 复制新建 不用 执行 meterageType ton  直接 什么也不执行
        // console.log('复制新建 ...',this.domainObject);
        let goodsName = this.domainObject.goodsName;
        setTimeout(() => {
          this.$set(this.domainObject,'goodsName',goodsName);
        }, 500);

      } else {
        // 新建货源的时候打开，手动set计量标准为吨
        if (!this.isEdit) {
          this.$set(this.domainObject, 'meterageType', 'item');
          setTimeout(() => {
            this.$set(this.domainObject, 'meterageType', 'ton');
          }, 500)
        }
      }
      // this.getWaybillProgress(self.domainObject.code);

    },
    getWaybillProgress(code){
      const self = this;
      getWaybillProgressByFreightCode({'freightCode':code},(success,error)=>{
        if(success){
          // self.$set(self.domainObject,'goodsSum',success.content.goodsSum);
              self.$set(self.domainObject,'waybillSum',success.content.waybillSum);
              self.$set(self.domainObject,'goodsTonSum',success.content.goodsTonSum);
              self.$set(self.domainObject,'goodsCubeSum',success.content.goodsCubeSum);
              self.$set(self.domainObject,'goodsItemSum',success.content.goodsItemSum);
              let goodsPercent = 0,
                  trainNumberPercent = 0;
              // if(self.domainObject.goodsNum > 0  ){
              //     goodsPercent = Decimal(success.content.goodsSum || 0).div(self.domainObject.goodsNum).mul(100).toDP(0);

              // }else{
              //     goodsPercent = 0
              // }
              if(self.domainObject.truckQty>0){
                trainNumberPercent = Decimal(success.content.waybillSum || 0).div(self.domainObject.truckQty).mul(100).toDP(0);
              }else{
                trainNumberPercent = 0
              }
              let getSumNum =0;
               getSumNum = self.getSum(self.domainObject.meterageType);
              // self.getSum(self.domainObject.meterageType);
              self.$set(self.domainObject,'getSum',getSumNum);
              goodsPercent = this.getPercent(getSumNum/2,self.domainObject)
              self.$set(self.domainObject,'goodsPercent', parseInt(goodsPercent));
              self.$set(self.domainObject,'trainNumberPercent',parseInt(trainNumberPercent));
        }
      })
    },
    getPercent(item,data){
      let val = 0;
      const self = this;
       switch(data.meterageType) {
          case 'ton':
            data.goodsWeight > 0 ? (val = Decimal(self.domainObject.goodsTonSum || 0).div(item).mul(100).toDP(0)) : val;
            return val;
          case 'cube':
            data.goodsVolume > 0 ? (val = Decimal(self.domainObject.goodsCubeSum || 0).div(item).mul(100).toDP(0)) : val;
            return val;
          case 'item':
            data.goodsNum > 0 ? (val = Decimal(self.domainObject.goodsItemSum || 0).div(item).mul(100).toDP(0)) : val;
            return val;
          default:
            return val;
        }
    },
    getSum(type){
      let val = 0;
      const self = this;
      this.listDataManifest.forEach((item)=>{
        switch(type) {
          case 'ton':
           self.tempGoodsWeight += parseInt(item.goodsWeight);
           val = self.tempGoodsWeight;
            return val;
          case 'cube':
            self.tempGoodsVolume += parseInt(item.goodsVolume);
            val = self.tempGoodsVolume ;
            return val;
          case 'item':
            self.tempGoodsNum = parseInt(item.goodsNum) + parseInt(self.tempGoodsNum);
            val =  self.tempGoodsNum;
            return val;
          default:
          return val;
        }
      })
      return val;
    },
    // 网络请求：获取货单信息
    netGetManifestList(logisticsCode) {
      let self =this;
      let isNeedOp = true;
      // 如果是复制新建 就不需要 赋值
      let originalCode = getParamsFromURL(window.location.search).originalCode ;
      if(originalCode) isNeedOp = false;

      if (!logisticsCode) { return; }
      const isLogistics = getParamsFromURL(window.location.search).logisticsCode;
      (isLogistics ? LogisticsService.getManifestList : getManifestList)({ code: logisticsCode }, (success, error) => {
        if (success && success.content) {
          const listDataManifest = success.content;
          const keys = ['goodsName','meterageType','goodsNum','goodsNumUnitCode','goodsWeight','goodsWeightUnitCode','goodsVolume','goodsVolumeUnitCode','goodsPrice','goodsPriceUnitCode','goodsLossMethod','goodsLoss','goodsLossUnitCode'];
          if(listDataManifest.length>0 && isNeedOp){
            keys.forEach(key=>{
              let val = listDataManifest[0][key] ? listDataManifest[0][key] : null;
              if('goodsNum' ===key){
                  self.$set(self.domainObject, 'goodsAmount', val);
              }else if('goodsNumUnitCode' ===key){
                  self.$set(self.domainObject, 'goodsAmountUnitCode', val);
              }else if('goodsCategory'==key){
                  self.$set(self.domainObject, 'goodsName', val);
              }else if('goodsName'==key){

              }else{
                    self.$set(self.domainObject, key, val);
              }
            })
          }
          self.listDataManifest = success.content;
          this.getWaybillProgress(logisticsCode);

          // 复制新建 需要 把code 去除
          if (getParamsFromURL(window.location.search).originalCode) {
            self.listDataManifest.forEach(item => {
              item.code = null;
              item.id = null;
            })
          }
          self.$nextTick(() => {
            if (self.$refs['eleManifest'] && self.$refs['eleManifest'].setColumnsDataMonitor) {
              self.$refs['eleManifest'].setColumnsDataMonitor();
            }
          })
        }
        if (error) { showMessageUtil('warning', error.content, 2000) };
      })
    },

    //逻辑：当选择 分组的时候，全部清除 tag
    clearAllTags(){
      if(this.isShowTag === false && this.domainObject.truckTagList){
         // this.$set(`this.domainObject`,'truckTagList',[]);
         this.domainObject.truckTagList = [];
      }
    },
    // 逻辑：发布范围 选中 指定范围 显示分组，选中全平台，隐藏分组
    dealWithShowTag(){
      let map = {designated:true,platform:false};
      this.isShowTag = map[this.domainObject.releaseRange] || false;
      this.clearAllTags();
      this.$watch('domainObject.releaseRange',(val)=>{
        this.isShowTag = map[val] || false;
        this.clearAllTags();
      })
    },
    formMounted() {
      this.dealWithShowTag();
      // if (this.goto) {
      //   let url = window.location.href;
      //   url += `#${this.goto}`;
      //   window.location.href = url;
      // }
      this.dealWithFiledReadonlyAndCal();
      this.dealWithJson();
      // 监听 司机报价类型  logisticsCode  originalCode
      //
        let code = getParamsFromURL(window.location.search).code;
        let logisticsCode = getParamsFromURL(window.location.search).logisticsCode;
        let originalCode = getParamsFromURL(window.location.search).originalCode;

      this.$watch(`domainObject.quoteType`, (val) => {
        if(val == 'quote'){ // 如果点击了 司机报价 ，那么 清楚 price 的值
          this.domainObject.quotePrice = '';
        }
      });


      const appInfo = JSON.parse(localStorage.getItem('appInfo'));

      // 调车模式，如果配置了则默认使用配置中的值
      if (!this.isEdit) {
        if (appInfo.defaultScheduleType) {
          console.log('默认调车模式为：', appInfo.defaultScheduleType);
          this.$set(this.domainObject, 'scheduleType', appInfo.defaultScheduleType);
        }
      }
    },
    // 处理 不同厂家的json start ==========
    dealWithJson() {
      // 获取动态字段名称
      freightService.getDetail((success) => {
        const data = success.content;
        console.log('详情默认配置', data);
        data.forEach((val) => {
          this.defaultDetailColumns.push(val.fieldConfigCode);
        });
        var index = 0
        this.fields.forEach((val) => {
          if (!val.extraParams[0].isShow) {
            this.actualDetailColumns.push(val.fieldConfigCode);
          }
          //find truckQty index
          if(val['fieldConfigCode'] === 'truckQty') {
            this.truckQtyIndex = index
            // val['required'] = "true"
          }
          index++
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
    editForm() {
      this.editable = true;
    },
    cancelEdit() {
      this.$refs.form.resetForm();
      this.editable = false;
    },
    validForm(formName) {
      // 添加 司机报价类型 的验证

      // if(this.domainObject.quoteType == 'price'){
      //   if(!this.domainObject.quotePrice || !this.domainObject.quotePriceUnitCode){
      //         this.$message({
      //           type: 'warning',
      //           message: '请检查司机报价',
      //           duration: 3000
      //         });
      //         return false;
      //   }
      // }

      // 添加货物单价两个的验证
      if (this.domainObject.goodsPrice && !this.domainObject.goodsPriceUnitCode) {
        this.$message({
          type: 'warning',
          message: '请检查货物单价单位',
          duration: 3000
        });
        return;
      }
      if (!this.domainObject.goodsPrice && this.domainObject.goodsPriceUnitCode) {
        this.$message({
          type: 'warning',
          message: '请检查货物单价价格',
          duration: 3000
        });
        return;
      }

      // 标准版运单生成方式为自动，则需求车次为必填
      if (this.domainObject.dispatchMode === 'auto') {
        if (!this.domainObject.truckQty) {
          this.$message({
            type: 'warning',
            message: '运单生成方式为自动生成时，需求车次为必填选项！',
            duration: 3000
          });
          return false;
        }
      }




      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 是否平台调车
          if (this.domainObject.scheduleType === 'platform') {
            if (this.agree) {
              this.dialogVisible = true;
            } else {
              this.$message({
                type: 'warning',
                message: '请勾选同意委托调车合作协议！',
                duration: 3000
              });
              return false;
            }
          } else {
            if (this.agree) {
              this.confirmSubmit('self');
            } else {
              this.$message({
                type: 'warning',
                message: '请勾选同意委托调车合作协议！',
                duration: 3000
              });
              return false;
            }
          }
        } else {
          return false;
        }
      });
    },
    submitForm(formName) {
      // 如果选择 指定范围，必须选择一个
      let arg1 = this.domainObject.truckTagList;
      if(this.isShowTag && (!arg1 || arg1.length<1)){
        let msg = '您当前选择的货源发布范围是指定分组，请选择至少一个分组！';
        showMessageUtil('warning',msg,3000);
        return;
      }

      //解决bug 司机运价 验证不通过
      if (this.domainObject.quotePrice) {
        this.domainObject.quotePrice = this.domainObject.quotePrice + '';
      }
      // 客户运价 不能只填写一个，数值和单位 不能只填写其中一项  start ===============================
      const price = this.domainObject.clientFreightPrice,
            priceCode = this.domainObject.clientFreightPriceUnitCode;
      if((price && ! priceCode)||(! price && priceCode)){
        showMessageUtil('warning','客户运价的 "值"与"单位" 不能只填写其中一项',3000);
        return;
      };
      // 客户运价 不能只填写一个，数值和单位 不能只填写其中一项  end ===============================

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
              this.$message({
                type: 'warning',
                message: '公司未认证，不能开展业务，请先提交认证！',
                duration: 3000
              });
              this.btnDisabled = true;
              return false;
            } else {
              this.validForm(formName);
            }
          }
        });
      } else {
        this.validForm(formName);
      }
    },
    confirmSubmit(type) {
      const appInfo = JSON.parse(localStorage.getItem('appInfo')), // 核心组织数据来源
        userInfo = JSON.parse(localStorage.getItem('userInfo')); // 当前企业数据来源
      // 自助调车——运单原始托运方和运单托运方都是当前企业
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

      // 如果是复制新建货源 ，去除 待处理车次 已经车次 已派车次 忽略车次 去除
      let formCopy = getParamsFromURL(window.location.search).copy;
      if (formCopy) {

        let keys = ['pendingNumber', 'acceptTruckNumber', 'dispatchTruckNumber', 'ignoreTruckNumber'];
        let self = this;
        keys.forEach(val => {
          self.domainObject[val] = '';
        })
      }
      // this.btnDisabled = true;
      // this.$refs.form.submitForm();
      this.credtedFreight();

      // 代码
      this.dialogVisible = false;
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
    dealWithClientFreightPrice() {
      if (!this.dataOrgManager) {
        return;
      }
      if (!this.domainObject.clientFreightPrice) {
        this.domainObject.quotePrice = null;
        return;
      }
      if (this.dataOrgManager.settleTradingConfigUnitCode == '%') {


        let num = Decimal(this.dataOrgManager.settleTradingConfigValue).div(100).toNumber();
        let num1 = Decimal(1).sub(num).toNumber();
        let finNum = Decimal(this.domainObject.clientFreightPrice).mul(Decimal(num1)).toNumber();
        this.domainObject.quotePrice = Math.floor(finNum * 100) / 100;




        // let num = parseFloat(this.dataOrgManager.settleTradingConfigValue) / 100;
        // let finNum = this.domainObject.clientFreightPrice * (1 - num);
        // this.domainObject.quotePrice = Math.floor(finNum * 100) / 100;

      } else if (this.dataOrgManager.settleTradingConfigUnitCode == 'yuan') {
        let finNum = this.domainObject.clientFreightPrice - this.dataOrgManager.settleTradingConfigValue;
        this.domainObject.quotePrice = Math.floor(finNum * 100) / 100;
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
    // 处理司机运价 + 客户运价 与 司机运价 计算处理
    dealWithFiledReadonlyAndCal() {

      const appInfo = JSON.parse(localStorage.getItem('appInfo'));

      // 处理客户运价与 司机报价类型之间的 关系 start =====
      if (appInfo.priceMode == 'auto') {
        this.$nextTick(() => {

          if (getParamsFromURL(window.location.search).code) { // 详情
            return;
          }
          console.log('进入nextTick');

          // 把司机运价变成 readonly 变成不可以编辑
          let el = this.$refs.form.getElementByField('quotePrice');
          if (el.configData) {
            // el.configData.readonly = 'TRUE';
            this.$set(el.configData, 'readonly', 'readonly')
          }
          // 有bug 第二个 没有起到作用
          let el2 = this.$refs.form.getElementByField('quotePriceUnitCode');
          if (el2.configData) {
            // el.configData.readonly = 'TRUE';
            this.$set(el2.configData, 'readonly', 'TRUE')
          }
        });

        if (getParamsFromURL(window.location.search).code) { // 详情
          return;
        } else {
          this.$watch(`domainObject.platformClientOrgCode`, (val) => {
            this.netGetOrgManager();
          })
          //监听客户运价   ,计算数据
          this.$watch(`domainObject.clientFreightPrice`, (val) => {
            //只有在一扣价的情况下才会生效
            // if(this.domainObject.quoteType == 'price'){
            this.dealWithClientFreightPrice();
            // }
          })
          this.$watch(`domainObject.clientFreightPriceUnitCode`, (val) => {
            // if(this.domainObject.quoteType == 'price'){
            this.domainObject.quotePriceUnitCode = this.domainObject.clientFreightPriceUnitCode;
            // }
          })

        }

      }
      // 处理客户运价与 司机报价类型之间的 关系 end =====

    },
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
    ruleRecombinationData(key1, key2, nameTip) {
      const val1 = this.domainObject[key1],
        val2 = this.domainObject[key2];
      if ((val1 && !val2) || (val2 && !val1)) {
        showMessageUtil('warning', `请检查${nameTip}，填写不完全`, 2000)
        return false;
      }
      return true;
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
     //新建Freight
    credtedFreight() {
      if (!this.checkRulesInEleManifest()) { return; } //表格检验是否通过
      if (!this.ruleRecombinationData('clientFreightPrice', 'clientFreightPriceUnitCode', '客户运价')) { return; } //检验复合控件是否填写 规范
      if (!this.ruleRecombinationData('driverReferPrice', 'driverReferPriceUnitCode', '司机运价')) { return; } //检验复合控件是否填写 规范
      //1.校验 表单
      //2.提交 Freight 数据 拿到 code
      //3.提交 货单的信息
      const self = this;
      this.$refs['form'].$refs.form.validate((valid) => {
        if (valid) {
          let net = this.isEdit ? editFreight : addFreight;
          if(this.$refs['eleManifest']){
              //统计数据写入 domainObject中
            const cacFields = this.$refs['eleManifest'].$refs['pageSubtotal'].cacFields;
            // 'goodsWeight','goodsVolume','goodsNum' 这三个参数 在 domainObject 和 manifestList 一样的
            cacFields.forEach(item => {
              //把参数key转化为goodsAmount
              if(item.field == 'goodsNum') item.field = 'goodsAmount';
              if (self.domainObject.hasOwnProperty(item.field)) {
                self.domainObject[item.field] = item.total;
              }
            })
          }
          self.btnDisabled = true;
          //把车长转化为字符串
          if(self.domainObject.truckLengthRequire){
              let tempString = self.domainObject.truckLengthRequire;
                  tempString = tempString.join(',');
              self.$set(self.domainObject,'truckLengthRequire',tempString);
          }
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
      if (!this.isEdit) {
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
      }
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
    eleManifestMounted() {
      this.syncMeterageType();
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
      let keysFileld = ['clientFreightPriceUnitCode', 'quotePriceUnitCode'];
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
    huanengPlugin() {
      if(!getParamsFromURL(window.location.search).copy) {
        this.$set(this.domainObject, 'dispatchMode', 'auto')
        this.$set(this.domainObject, 'releaseRange', 'private')
      }
    }
  },
  mounted() {
    this.goto = getParamsFromURL(window.location.search).goto;
    this.$nextTick(() => {
      if (this.goto) {
        let url = window.location;
        url += `#${this.goto}`;
        window.location = url;
      }
    });
    const appInfo = JSON.parse(localStorage.getItem('appInfo'));
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    // this.agreementUrl = `${appInfo.specialTipsUrl}?firstParty=${userInfo.orgFullName}&secondParty=${appInfo.coreOrgName}`;
    this.agreementUrl = `${appInfo.tradeRulesUrl}`;
    this.agreementName = appInfo.tradeRulesName;

    this.agreementUrlTan = `${appInfo.specialTipsUrl}`;
    this.agreementNameTan = appInfo.specialTipsName;


    this.agreementName3 = appInfo.clientAgreementName;
    this.agreementUrl3 = `${appInfo.clientAgreementUrl}?firstParty=${userInfo.orgFullName}&secondParty=${appInfo.coreOrgFullName}`;



    // tradeRulesUrl
    // specialTipsUrl


    // 是否禁用调车模式选择
    if (appInfo.enableScheduleType) {
      this.disableModeSelect = appInfo.enableScheduleType === 'FALSE';
      console.log('是否禁用调车模式选择', this.disableModeSelect);
    }

    // 处理客户运价与 司机报价类型之间的 关系 start =====
    // if (appInfo.priceMode == 'auto') {
    //   this.$nextTick(() => {

    //     if (getParamsFromURL(window.location.search).code) { // 详情
    //       return;
    //     }
    //     console.log('进入nextTick');

    //     // 把司机运价变成 readonly 变成不可以编辑
    //     let el = this.$refs.form.getElementByField('quotePrice');
    //     if (el.configData) {
    //       // el.configData.readonly = 'TRUE';
    //       this.$set(el.configData, 'readonly', 'readonly')
    //     }
    //     // 有bug 第二个 没有起到作用
    //     let el2 = this.$refs.form.getElementByField('quotePriceUnitCode');
    //     if (el2.configData) {
    //       // el.configData.readonly = 'TRUE';
    //       this.$set(el2.configData, 'readonly', 'TRUE')
    //     }
    //   });

    //   if (getParamsFromURL(window.location.search).code) { // 详情
    //     return;
    //   } else {
    //     this.$watch(`domainObject.platformClientOrgCode`, (val) => {
    //       this.netGetOrgManager();
    //     })
    //     //监听客户运价   ,计算数据
    //     this.$watch(`domainObject.clientFreightPrice`, (val) => {
    //       //只有在一扣价的情况下才会生效
    //       // if(this.domainObject.quoteType == 'price'){
    //       this.dealWithClientFreightPrice();
    //       // }
    //     })
    //     this.$watch(`domainObject.clientFreightPriceUnitCode`, (val) => {
    //       // if(this.domainObject.quoteType == 'price'){
    //       this.domainObject.quotePriceUnitCode = this.domainObject.clientFreightPriceUnitCode;
    //       // }
    //     })

    //   }

    // }
    // 处理客户运价与 司机报价类型之间的 关系 end =====
    this.dealWithLoadingMode('multiple');
    this.$watch('domainObject.loadingMode', (val) => {
      this.dealWithLoadingMode(val);
        this.$nextTick(() => {
        this.syncMeterageType();
      })
    })
    //订单号选择框禁选
    // document.querySelector('.page_ele_pop_select').
  }
};

</script>
<style lang="scss" rel="stylesheet/scss">
.agreeTruck {
  margin-left: 10px;
}

.dialog_send {
  p {
    margin-bottom: 20px;
  }
  .dialog_des_title {
    span {
      color: red;
    }
  }
  .dialog_des_titile_mid {
    text-align: center;
    .truck_no,
    .name,
    {
      font-size: 16px;
      color: orange;
      margin-right: 10px;
    }
    .phone {
      font-size: 16px;
    }
    .num {
      color: orange;
    }
  }
}

</style>
