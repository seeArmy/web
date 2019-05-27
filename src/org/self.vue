/** * add.vue * Created by cc on 17/12/1. */
<template>
  <div>
    <div class="form-page">
      <ele-form :domainObject="domainObject" ref="form" :configUrl="configUrl" :listUrl="listUrl" :listTitle="listTitle" :getInfo="getInfo" :addFun="addFun" :editFun="editFun" :editable="editable" :isEdit="isEdit" @formReady="formReady" @editSuccess="editSuccess" @submitDone="submitDone" :objectName="objectName" @formMounted='formMounted' label-width="100px" :inline="false" :folder="folder">
        <layout :isEdit="isEdit" :editable="editable" :objectName="objectName" :canEdit="canEdit" :domainObject="domainObject" :clientDetailColumns="clientDetailColumns">
          <div v-for="field in fields" :slot="field.fieldConfigCode">
            <el-form-item :label="field.showName" :required="field.required ==='true'">
              <ele-block :field="field" :domainObject="domainObject" :editable="editable && canEdit" :uploadUrl="uploadUrl" :inputKey="inputKey"></ele-block>
            </el-form-item>
          </div>
          <el-button type="primary" v-show="!editable && (domainObject.certStatus == 'unauthenticated' || domainObject.certStatus == 'failed')" @click="verifyCompany" slot="buttonVerify">提交认证</el-button>
          <el-button type="primary" v-show="!editable && (domainObject.certStatus == 'unauthenticated' || domainObject.certStatus == 'failed')" @click="editForm()" slot="buttonEdit">编辑</el-button>
          <el-button v-show="editable && isEdit" @click="cancelEdit()" slot="buttonCancel">取消编辑</el-button>
          <el-button v-show="editable && isEdit" @click="submitForm()" slot="buttonSave">保存</el-button>
          <!--<el-button v-show="!editable && isEdit" @click="changeLog()" slot="buttonChangeLog">{{ objectName }}变更记录</el-button>-->
          <el-button v-show='editable && !isEdit' type="primary" @click="submitForm()" size="large" slot="buttonSubmit" :disabled="btnDisabled">提交</el-button>
          <el-button v-show='editable && !isEdit' @click="resetForm()" size="large" slot="buttonReset" :disabled="btnDisabled">重置</el-button>
          <bank-info slot="bankInfo" :code="params.orgCode" :getInfo="getInfo">
          </bank-info>
          <bank-account slot="tabBankAccount" :selectable="false" :chooseBankFun="chooseBankFun" :customColumn="customColumnBankAccount" :addFrom="addFrom" :isAdvanced="true" :params="params" :bankAccountCode="bankAccountCode" :needPage="false">
          </bank-account>
          <logs slot="tabChangeLog" :selectable="false" :operatable="false" :domain="uploadUrl" :type="logType" :code="params.orgCode" :isAdvanced="false" :params="changeLogParams" :needPage="true">
          </logs>
        </layout>
      </ele-form>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import layout from './layout.vue';

import eleBlock from '../components/ele-block/eleBlock.vue';
import eleForm from '../components/ele-form/eleForm.vue';
import { edit as companyEdit, get as companyGet, editBank, verify, getDetail } from '../../api/OrgService';

import bankInfo from '../components/ele-bank-info/bankInfo.vue';
import bankAccount from '../bankAccount/list.vue';
import logs from '../logs/list.vue';

import ApiConst from '../../api/ApiConst';
import {freightForwarderJsMixin} from '../common/freight-forwarder-js-mixin';
import { showMessageUtil } from '../../api/Utils';

export default {
  components: {
    'ele-form': eleForm,
    'ele-block': eleBlock,
    layout,
    logs,
    'bank-info': bankInfo,
    'bank-account': bankAccount
  },
  mixins: [freightForwarderJsMixin],
  data() {
    return {
      objectName: '公司',
      configUrl: `${ApiConst.apiOrgDomain}/detail_render_info/company/list`,
      domainObject: {},
      addFun: Function,
      editFun: companyEdit,
      getInfo: companyGet,
      chooseBankFun: editBank,
      uploadUrl: ApiConst.apiOrgDomain,
      logType: 'partner',
      listUrl: '',
      listTitle: '',
      status: false,
      code: '',
      fields: [],
      isEdit: false, // 控制编辑添加按钮
      editable: true, // 控制页面状态
      btnDisabled: false,
      customColumnBankAccount: ['bankAccountName', 'bankName', 'bankAccountNo', 'creatorUsername', 'createTime', 'updateUsername', 'updateTime'],
      addFrom: 'company',
      params: {
        orgCode: JSON.parse(localStorage.getItem('userInfo')).orgCode,
        size: 10
      },
      bankAccountCode: '',
      changeLogParams: {
        code: JSON.parse(localStorage.getItem('userInfo')).orgCode,
        size: 10
      },
      projectName: JSON.parse(localStorage.getItem('appInfo')).projectName,
      loading: true,
      canEdit: true,
      folder: 'org/company',
      defaultDetailColumns: [],
      actualDetailColumns: [],
      clientDetailColumns: []
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
      // 认证中和认证通过，不可以编辑认证信息版块
      if (formData.model.certStatus) {
        this.canEdit = formData.model.certStatus === 'unauthenticated' || this.domainObject.certStatus === 'failed';
      }
          this.$nextTick(()=>{
              this.commonLogicOrgType();
          })
      // this.commonLogicOrgType();
    },
    formMounted(form) {

      // 承运方
      if (this.domainObject.orgType === '2') {
        document.querySelectorAll('.el-col')[6].querySelector('.el-form-item').classList.add('is-required');
        document.querySelectorAll('.el-col')[9].querySelector('.el-form-item').classList.add('is-required');
      }
      // 托运方
      if (this.domainObject.orgType === '3') {
        document.querySelectorAll('.el-col')[6].querySelector('.el-form-item').classList.add('is-required');
      }


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
    /**
     * 当orgtype 有值的时候，那么就是已经激活，此刻不允许改变 orgTpye
     * @return {[type]} [description]
     */
    dealWithOrgType() {
      if (this.domainObject.orgType) {
        let el = this.$refs.form.getElementByField('orgType');
        if (el.configData) {
          this.$set(el.configData, 'readonly', 'TRUE')
        }
      }
    },
    valid() {
      // 承运方
      if (this.domainObject.orgType === '2') {
        if (!this.domainObject.businessLicenseResourceCode) {
          this.$message({
            type: 'warning',
            message: '营业执照附件为必填选项，请上传营业执照附件！',
            duration: 3000
          });
          return false;
        }
        if (!this.domainObject.transportCertificateResourceCode) {
          this.$message({
            type: 'warning',
            message: '道路运输经营许可证附件为必填选项，请上传道路运输经营许可证附件！',
            duration: 3000
          });
          return false;
        }
        return true;
      }
      // 托运方
      if (this.domainObject.orgType === '3') {
        if (!this.domainObject.businessLicenseResourceCode) {
          this.$message({
            type: 'warning',
            message: '营业执照附件为必填选项，请上传营业执照附件！',
            duration: 3000
          });
          return false;
        }
        return true;
      }
      return true;
      
    },
    // transportCertificate 许可证号码 province city county
    verifyCompany() {

      if (this.valid()) {
        verify({}, (success, error) => {
          if (error || success.code !== 200) {
            this.$message({
              type: 'error',
              showClose: true,
              message: error.content,
              duration: 5000
            });
            return false;
          }
          if (success) {
            window.location.reload();
          }
        });
      } else {
        console.log('veify error');
      }
    },
    editForm() {
      this.editable = true;
    },
    cancelEdit() {
      this.$refs.form.resetForm();
      this.editable = false;
    },
    submitForm() {
      if (this.valid()) {
        this.btnDisabled = true;
        this.$refs.form.submitForm();
        this.btnDisabled = false;
      } else {
        console.log('submit error');
      }
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
  }
};

</script>
