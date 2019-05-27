<!-- 弹框选择搜索人 -->
<template>
  <div class="payee-page">
     <ele-form :domainObject="domainObject" ref="form"
                :configUrl="configUrl" :listUrl="listUrl" :listTitle="listTitle"
                :getInfo="getInfo" :addFun="addFun" :editFun="editFun"
                :editable="editable" :isEdit="isEdit"
                @formReady="formReady" @editSuccess="editSuccess" @submitDone="submitDone" @formMounted="formMounted"
                :objectName="objectName"
                label-width="100px" :inline="false">
        <layout :domainObject="domainObject" :isEdit="isEdit" :editable="editable" :objectName="objectName" :showLoadingUnloading="showLoadingUnloading" :disableModeSelect="disableModeSelect">
          <div v-for="field in fields" :slot="field.fieldConfigCode">
            <el-form-item :label="field.showName" :required="field.required ==='true'">
              <ele-block :field="field" :domainObject="domainObject" :editable="editable" :uploadUrl="uploadUrl" :inputKey="inputKey"></ele-block>
            </el-form-item>
          </div>
        </layout>
      </ele-form>
  </div>
</template>
<script type="text/ecmascript-6">

  import layout from './layoutPayee.vue';
  import eleBlock from '../components/ele-block/eleBlock.vue';
  import eleForm from '../components/ele-form/eleForm.vue';
  import chargeList from './chargeList.vue';
  import voucherList from './voucherList.vue';

  import * as waybillService from '../../api/waybillService';
  import * as LogisticsService from '../../api/LogisticsService';
  import * as LbsService from '../../api/LbsService';

  import { get as truckGet } from '../../api/TruckService';

  import ApiConst from '../../api/ApiConst';
  import * as utils from '../../api/Utils';
  import logs from '../logs/list.vue';
  import '../components/vueDirectives';

  // 当时从 订单列表 点击直接派车进来的时候，提交运单的时候   接口需要改变一下
  let addFuncWayBill = utils.getParamsFromURL(window.location.search).logisticsCode ? waybillService.add_and_notify : waybillService.add;

  export default {
    components: {
      'ele-form': eleForm,
      'layout': layout,
      'logs': logs,
      'charge-list': chargeList,
      'voucher-list': voucherList,
      'ele-block': eleBlock
    },
    data() {
      return {
        // data 中很多的字段是 复制过来的，有的时候 是只是为了不 报错，所以只是删了一部分
        objectName: '运单',
        configUrl: `${ApiConst.apiWayBillDomain}/detail_render_info/fixPayee/list`,
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
        agree: false,
        agreementName: '',
        agreementUrl: '',
        dialogVisible: false,
        disableModeSelect: ''
      };
    },
    methods: {
      // 设置 selected
      setSelected(){
        this.$refs.form.getElementByField('payeeDriverCode').selectedCode = null;
      },
      showLocation(longtitude, latitude, field) {
      },
      formMounted(form) {
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
    },
    created(){

    }
  };
</script>

