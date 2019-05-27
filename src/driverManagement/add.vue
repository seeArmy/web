/**
* add.vue
* Created by myy on 18/4/17.
*/
<template>
  <div>
    <div class="form-page">
      <ele-form :domainObject="domainObject" ref="domainObject" :folder='folder' :configUrl="configUrl" :listUrl="listUrl" :listTitle="listTitle" :getInfo="getInfo" :addFun="addFun" :editFun="editFun" :editable="editable" :isEdit="isEdit" @formReady="formReady" @editSuccess="editSuccess" @submitDone="submitDone" @formMounted="formMounted" :objectName="objectName" label-width="100px" :inline="false">
        <layout :clientDetailColumns='clientDetailColumns' :isEdit="isEdit" :editable="editable" :objectName="objectName" :companyData="companyData">
          <div v-for="field in fields" :key="field.fieldConfigCode" :slot="field.fieldConfigCode">
            <el-form-item :label="field.showName" :required="field.required ==='true'">
              <ele-block :field="field" :domainObject="domainObject" :editable="editable" :uploadUrl="uploadUrl" :inputKey="inputKey"></ele-block>
            </el-form-item>
          </div>
          <el-button type="primary" v-show="unVerify" @click="verify(domainObject.code)" slot="buttonVerify">提交认证</el-button>
          <el-button type="primary" v-show="!editable && isEdit" @click="editForm('domainObject')" slot="buttonEdit">编辑</el-button>
          <el-button v-show="editable && isEdit" @click="cancelEdit('domainObject')" slot="buttonCancel">取消编辑</el-button>
          <el-button v-show="editable && isEdit" @click="submitForm('domainObject')" slot="buttonCancel">保存</el-button>
          <!-- <el-button v-show="!editable && isEdit" @click="changeLog()" slot="buttonChangeLog">{{ objectName }}变更记录</el-button>
        <el-button v-show='editable && !isEdit' type="primary" @click="submitForm('domainObject')" size="large" slot="buttonSubmit" :disabled="btnDisabled">提交</el-button>
        <el-button v-show='editable && !isEdit' @click="resetForm('domainObject')" size="large" slot="buttonReset" :disabled="btnDisabled">重置</el-button> -->
          <!-- 认证信息 -->
          <verify-form slot="verifyForm" ref="verifyForm" :isEdit="isEdit" :editable="editable" :canEdit="canEdit" :objectName="objectName" :domainObject="domainObject" :fields="fields" :inputKey="inputKey" :uploadUrl="uploadUrl" v-if="status" @showMatch="showMatch">
          </verify-form>
          <!-- 平台账号信息 -->
          <account-info slot="accountInfo" :code="code" :domainObject="domainObject" v-if="code">
          </account-info>
          <!-- 变更记录 -->
          <logs slot="tabChangeLog" :selectable="false" :operatable="false" :domain="uploadUrl" :type="logType" :code="code" :isAdvanced="false" :params="changeLogParams" :needPage="true"></logs>
        </layout>
      </ele-form>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
/* eslint-disable import/no-unresolved */
import eleForm from '../components/ele-form/eleForm.vue';
import eleBlock from '../components/ele-block/eleBlock.vue';
import layout from './layout.vue';
import logs from '../logs/list.vue';
import verifyForm from './verifyForm.vue';
import accountInfo from './accountInfo.vue';

import ApiConst from '../../api/ApiConst';
import { removeClass } from '../../api/classUtil';
import { getParamsFromURL, urlRedirect } from '../../api/Utils';

import { add, edit, get, editBank, verify, getDetail } from '../../api/DriverMemberService';
import { joinCompany } from '../../api/EmployeeManagementService';
import { getAccountInfo } from '../../api/DriverService';

export default {
  components: {
    'ele-form': eleForm,
    eleBlock,
    'verify-form': verifyForm,
    'account-info': accountInfo,
    layout,
    logs
  },
  data() {
    return {
      objectName: '司机',
      code: '',
      configUrl: '',
      domainObject: {},
      editable: true,
      isEdit: false,
      btnDisabled: false,
      unVerify: false,
      fieldConfig: Array,
      fields: Array,
      inputKey: Array,
      addFun: add,
      editFun: edit,
      getInfo: get,
      getAccountInfo: getAccountInfo,
      chooseBankFun: editBank,
      uploadUrl: ApiConst.apiPlatformDomain,
      params: {
        driverCode: getParamsFromURL(window.location.search).code,
        size: 10
      },
      bankAccountCode: '',
      bankAccountParams: {
        personCode: getParamsFromURL(window.location.search).code,
        size: 10
      },
      logType: 'platformDriver',
      listUrl: '/driverManagement/list.html',
      listTitle: '司机会员管理',
      truckInfo: { truckLicenseNo: null, code: null, userCode: null },
      status: false,
      canEdit: true,
      changeLogParams: {
        code: getParamsFromURL(window.location.search).code,
        size: 10
      },
      companyData: [],
      defaultDetailColumns: [],
      actualDetailColumns: [],
      clientDetailColumns: [],
      folder: 'platform/driver',
    };
  },
  methods: {
    formReady(formData) {
      console.log('formReady', formData);
      this.inputKey = formData.paramData.inputKey;
      this.fields = formData.paramData.field;
      this.isEdit = formData.isEdit;
      this.editable = formData.editable;
      this.code = formData.code;
      this.bankAccountCode = this.domainObject.bankAccountCode;
      this.unVerify = (this.domainObject.certStatus === 'unauthenticated' || this.domainObject.certStatus === 'failed');

      // 认证信息版块显示与编辑
      this.status = true;
      // 认证中和认证通过，不可以编辑认证信息版块
      if (formData.model.certStatus) {
        this.canEdit = formData.model.certStatus === 'unauthenticated' || this.domainObject.certStatus === 'failed';
      }
      console.log('can edit is', this.canEdit);

      this.truckInfo.truckLicenseNo = formData.model.phone;
      this.truckInfo.code = formData.model.code;
      this.truckInfo.userCode = formData.model.code;
      this.truckInfo.fullName = this.domainObject.fullName;

      this.params.userCode = formData.model.code;
      this.params.truckLicenseNo = this.domainObject;


      // if (this.domainObject.userType === "3") {
      //   console.log('have both user and driver identity', this.domainObject.userType);
      //   this.$set(this.domainObject, 'userType', "1,2");
      // }

      // 根据userCode获取加入的公司列表
      if (this.domainObject.code) {
        joinCompany({ userCode: this.domainObject.code }, (success, error) => {
          if (error || success.code !== 200) {
            this.$message({
              type: 'error',
              message: `${error.content}`,
              duration: 3000
            });
            return false;
          }
          if (success) {
            this.companyData = success.content;
          }
        })
      }
    },
    formMounted(form) {

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

      this.dealWithBankInfoFormat();
      // 司机状态已激活，手机号码不可修改——BY zhangzhi 2018年8月30日
      if (this.domainObject.userStatus === 'activated') {
        const ele = form.getElementByField('phone');
        if (ele.configData) {
          this.$set(ele.configData, 'readonly', 'readonly');
        }
      }
    },
    // 处理银行 信息 输入时 去除 全部空格
    dealWithBankInfoFormat() {
      let keys = ['bankAccountName', 'bankName', 'bankAccountNo'];
      for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        this.$watch(`domainObject.${key}`, (val) => {
          if (val) {
            this.domainObject[key] = val.replace(/[ ]/g, "");
          }
        })
      }
    },
    editSuccess() {
      this.editable = false;
    },
    submitDone() {
      this.btnDisabled = false;
    },
    loadFinish() {
      const keys = Object.keys(window.rns);
      keys.forEach((key) => {
        window.rns[key].init();
      });
    },
    editForm() {
      console.log('edit from');
      this.editable = true;
      this.isEdit = true;
    },
    cancelEdit() {
      this.$refs.domainObject.resetForm();
      this.editable = false;
      this.isEdit = true;
    },
    changeLog() {
      const url = `/logs/list.html?domain=${this.uploadUrl}&type=${this.logType}&code=${this.code}`,
        title = `${this.objectName}变更记录`;
      urlRedirect(url, title);
    },
    isArray(val) {
      if (typeof Array.isArray === 'function') {
        return Array.isArray(val);
      }
      return Object.prototype.toString.call(val) === '[object Array]';
    },
    submitForm(formName) {
      if (!this.domainObject.qualificationCertificateNumber) {
        this.$message({
          type: 'warning',
          message: '从业资格证号为必填项！',
          duration: 3000
        });
        return false;
      }
      let self = this;
      this.$refs.domainObject.validate((valid)=>{
        if(valid){
          self.$refs.verifyForm.$refs['verifyForm'].validate((va)=>{
            if(va){
                self.btnDisabled = true;
                self.$refs[formName].submitForm();
                self.btnDisabled = false;
            }
          })
        }
      })

    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    verify(code) {
      verify(code, (success, error) => {
        if (error) {
          this.$message({
            type: 'error',
            message: `提交认证失败：${error.content}`,
            duration: 5000
          });
        }
        if (success) {
          const certStatus = success.content.certStatus;
          if (certStatus) {
            this.$message({
              type: 'success',
              message: '提交成功',
              duration: 5000
            });
            this.domainObject.certStatus = certStatus;
            this.unVerify = false;
          } else {
            this.$message({
              type: 'error',
              message: `提交认证失败：${success.content.error}`,
              duration: 5000
            });
          }
        }
      });
    },
    showMatch(content) {
      const data = content || {},
        fieldArray = ['headPictureResourceCode', 'fullName', 'gender', 'certStatus', 'identityResourceCode', 'identityNumber', 'identityExpirationDate', 'driverLicenseResourceCode', 'driverLicenseAcceptType', 'driverLicenseExpirationDate', 'driverLicenseNo', 'qualificationCertificateResourceCode', 'qualificationCertificateNumber', 'qualificationCertificateExpirationDate'];
      console.log('driverMatch result is ', data);
      Object.keys(data).forEach((key) => {
        if (fieldArray.includes(key)) {
          this.$set(this.domainObject, key, data[key]);
        }
      });
    }
  },
  created() {
    const driverUrl = ApiConst.apiPlatformDomain,
      configUrl = `${driverUrl}/detail_render_info/driver/list`;
    this.configUrl = configUrl;
  }
};

</script>
