/** * add.vue 运单页面 * Created by cc on 17/8/10. */
<template>
  <div>
    <div class="form-page">
      <ele-form :domainObject="domainObject" ref="form" :configUrl="configUrl" :listUrl="listUrl" :listTitle="listTitle" :getInfo="getInfo" :addFun="addFun" :editFun="editFun" :editable="editable" :isEdit="isEdit" @formReady="formReady" @editSuccess="editSuccess" @submitDone="submitDone" @formMounted="formMounted" :objectName="objectName" label-width="100px" :inline="false" :folder="folder">
        <layout :domainObject="domainObject" :isEdit="isEdit" :editable="editable" :objectName="objectName" :showLoadingUnloading="showLoadingUnloading" :clientDetailColumns="clientDetailColumns">
          <div v-for="field in fields" :slot="field.fieldConfigCode">
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
          <charge-list :uploadUrl="uploadUrl" :domainObject="domainObject" :waybillCode="code" :editable="editable" :showBtn="true" slot="slotChargeList">
          </charge-list>

          <logs slot="tabChangeLog" :selectable="false" :operatable="false"
                :domain="uploadUrl" :type="logType" :code="code" :isAdvanced="false"
                :params="changeLogParams" :needPage="true">
          </logs>


        </layout>
      </ele-form>
      <!-- dialog -->
      <el-dialog title="委托调车合作协议" :visible.sync="dialogVisible" size="large">
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

import eleBlock from '../../components/ele-block/eleBlock.vue';
import eleForm from '../../components/ele-form/eleForm.vue';
import chargeList from './chargeList.vue';

import * as waybillService from '../../../api/PlatformWaybillService';
import * as LogisticsService from '../../../api/LogisticsService';
import * as LbsService from '../../../api/LbsService';

import { get as getFullName } from '../../../api/OrgManagementService';

import ApiConst from '../../../api/ApiConst';
import * as utils from '../../../api/Utils';
import logs from '../../logs/list.vue';
import '../../components/vueDirectives';

export default {
  components: {
    'ele-form': eleForm,
    'layout': layout,
    'logs': logs,
    'charge-list': chargeList,
    'ele-block': eleBlock
  },
  data() {
    return {
      objectName: '运单',
      configUrl: `${ApiConst.apiWaybillBrokerDomain}/detail_render_info/platformWaybill/list`,
      domainObject: {},
      addFun: waybillService.add,
      editFun: waybillService.editPlatformWaybill,
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
      agree: true,//去除委托调车客户服务协议 7-24 需求 by zhang 此处直接给 true，很多地方就不需要修改了
      agreementUrl: '',
      dialogVisible: false,
      agreementName: '',
      driverAgreementUrl: '',
      driverAgreementName: '',
      folder: 'waybillBroker/platformWaybill',
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
    diasbledEditFields() {
      const defArray = ['scheduleType', 'meterageType', 'logisticsCode','clientOrgCode','routeCode','truckCode','trailerTruckCode','driverCode','viceDriverCode', 'waybillTagList', 'truckPowerType', 'driverPhone', 'viceDriverPhone', 'driverLicenseNo', 'viceDriverLicenseNo', 'driverFuelCardNo', 'payeeDriverCode', 'payeeViceDriverCode', 'driverPayeeBankName', 'driverPayeeBankAccountName', 'driverPayeeBankAccountCode', 'payeeViceDriverCode', 'viceDriverPayeeBankName', 'viceDriverPayeeBankAccountName', 'viceDriverPayeeBankAccountCode','carrierOrgCode', 'departMileage', 'departMileageUnitCode', 'returnMileage', 'returnMileageUnitCode'];
      defArray.forEach((data) => {
        const ele = this.$refs.form.getElementByField(data);
        if (ele) {
          if (data === 'scheduleType' || data === 'meterageType') {
            this.$set(ele.configData, 'disabled', true);
          } else {
            this.$set(ele.configData, 'readonly', (ele.configData.controlType === 'text' || ele.configData.controlType === 'number') ? 'readonly' : 'TRUE');
          }
        }
      });
    },
    formMounted(form) {
      form.getElementByField('truckCode').$on('change', (model) => {
        console.log('truck changed', model);
        if (model.driverCode) {
          form.getElementByField('driverCode').$emit('selectCode', { code: model.driverCode });
        }
        // 监听 副驾驶 
        if (model.viceDriverCode) {
          form.getElementByField('viceDriverCode').$emit('selectCode', { code: model.viceDriverCode });
        }
      });
      form.getElementByField('driverCode').$on('change', (model) => {
        console.log('driver changed', model);
        form.getElementByField('driverPayeeBankAccountNo').$emit('refresh', { personCode: model.code });
      });

      // 选择运价弹窗增加额外查询条件
      form.getElementByField('logisticsCode').$on('change', (model) => {
        console.log('logistics changed=====================1111111111111111111', model);
        form.getElementByField('ratesCode').$emit('refresh', { logisticsCode: model.code });
      });

      if (this.domainObject.logisticsCode && form.getElementByField('ratesCode')) {
        console.log('domainObject logistics changed===================22222222', this.domainObject.logisticsCode);
        form.getElementByField('ratesCode').$emit('refresh', { logisticsCode: this.domainObject.logisticsCode });
      } else {
        const logCode = utils.getParamsFromURL(window.location.search).logisticsCode;
        if (logCode) {
          this.showLoadingUnloading = false;
          LogisticsService.get({ code: logCode }, (success) => {
            if (success) {
              this.$refs.form.dispatchEvent('logisticsCode', 'select', success.content);
            }
          });
        }
      }
      // 运单详情显示发货位置
      if (this.domainObject.loadingAddrLon && this.domainObject.loadingAddrLat) {
        this.showLocation(this.domainObject.loadingAddrLon, this.domainObject.loadingAddrLat, 'loadingLocation');
      }
      // 运单详情显示收货位置
      if (this.domainObject.unloadingAddrLon && this.domainObject.unloadingAddrLat) {
        this.showLocation(this.domainObject.unloadingAddrLon, this.domainObject.unloadingAddrLat, 'unloadingLocation');
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
      }
      const appInfo = JSON.parse(localStorage.getItem('appInfo')),
        userInfo = JSON.parse(localStorage.getItem('userInfo'));
      this.agreementName = appInfo.clientAgreementName;
      this.agreementUrl = `${appInfo.clientAgreementUrl}?firstParty=${this.domainObject.originalConsignOrgName}&secondParty=${appInfo.coreOrgFullName}`;


      this.driverAgreementName = appInfo.driverAgreementName;
      this.driverAgreementUrl = `${appInfo.driverAgreementUrl}?firstParty=${appInfo.coreOrgFullName}&secondParty=${this.domainObject.driverFullName}&idNumber=${this.domainObject.driverIdentityNumber}&phoneNumber=${this.domainObject.driverPhone}`;

      this.getFullName();

      // 获取动态字段名称
      waybillService.getDetail((success) => {
        const data = success.content;
        console.log('详情默认配置', data);
        data.forEach((val) => {
          this.defaultDetailColumns.push(val.fieldConfigCode);
        });
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

      this.diasbledEditFields();
    },
    formReady(formData) {
      console.log('formReady', formData);
      this.inputKey = formData.paramData.inputKey;
      this.fields = formData.paramData.field;
      this.isEdit = formData.isEdit;
      this.editable = formData.editable;
      this.code = formData.code;
      const params = utils.getParamsFromURL(window.location.search),
        self = this;
      // if (params.logisticsCode) {
      //   this.showLoadingUnloading = false;
      //   LogisticsService.get({ code: params.logisticsCode }, (success) => {
      //     if (success) {
      //       self.$refs.form.dispatchEvent('logisticsCode', 'select', success.content);
      //     }
      //   });
      // }
    },
    // 获取全称
    getFullName() {
      if (this.domainObject.platformOriginalConsignOrgCode) {
        let paramObj = { code: this.domainObject.platformOriginalConsignOrgCode };
        getFullName(paramObj, (success, error) => {
          if (success && success.content) {
            if (success.content.orgFullName) {
              const appInfo = JSON.parse(localStorage.getItem('appInfo')),
                userInfo = JSON.parse(localStorage.getItem('userInfo'));
              this.agreementName = appInfo.clientAgreementName;
              this.agreementUrl = `${appInfo.clientAgreementUrl}?firstParty=${success.content.orgFullName}&secondParty=${appInfo.coreOrgFullName}`;
            }
          }
        })
      }
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
          // 是否平台调车
          if (this.domainObject.scheduleType === 'platform') {
            // if (this.agree) {
            //   this.dialogVisible = true;
            // } else {
            //   this.$message({
            //     type: 'warning',
            //     message: '请勾选同意委托调车合作协议！',
            //     duration: 3000
            //   });
            //   return false;
            // }
            // 平台调车
            this.confirmSubmit('platform');
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
      // 自助调车——运单原始托运方和运单托运方都是当前企业
      if (type === 'self') {
        // 运单原始托运方
        this.$set(this.domainObject, 'originalConsignOrgName', userInfo.orgFullName);
        this.$set(this.domainObject, 'originalConsignOrgCode', userInfo.orgCode);
        this.$set(this.domainObject, 'platformOriginalConsignOrgCode', userInfo.orgCode);
        // 托运方
        this.$set(this.domainObject, 'consignOrgName', userInfo.orgFullName);
        this.$set(this.domainObject, 'consignOrgCode', userInfo.orgCode);
        this.$set(this.domainObject, 'platformConsignOrgCode', userInfo.orgCode);
      } else {
        // 委托调车——运单原始托运方是当前企业，运单托运方是核心组织
        // 运单原始托运方
        this.$set(this.domainObject, 'originalConsignOrgName', userInfo.orgFullName);
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
  mounted() {}
};

</script>
