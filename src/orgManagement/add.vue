<template>
  <div>
    <div class="form-page">
      <ele-form :domainObject="domainObject" ref="form" :configUrl="configUrl" :listUrl="listUrl" :listTitle="listTitle" :getInfo="getInfo" :addFun="addFun" :editFun="editFun" :editable="editable" :isEdit="isEdit" @formReady="formReady" @formMounted="formMounted" @editSuccess="editSuccess" @submitDone="submitDone" :objectName="objectName" label-width="100px" :inline="false" :folder="folder">
        <layout :isEdit="isEdit" :editable="editable" :objectName="objectName" :clientDetailColumns="clientDetailColumns" :canEdit="canEdit" :domainObject="domainObject">
          <div v-for="field in fields" :slot="field.fieldConfigCode">
            <el-form-item :label="field.showName" :required="field.required ==='true'">
              <ele-block :field="field" :domainObject="domainObject" :editable="editable && canEdit" :uploadUrl="uploadUrl" :inputKey="inputKey"></ele-block>
            </el-form-item>
          </div>
          <el-button type="primary" v-show="!editable && isEdit" @click="editForm()" slot="buttonEdit">编辑</el-button>
          <el-button v-show="editable && isEdit" @click="cancelEdit()" slot="buttonCancel">取消编辑</el-button>
          <el-button v-show="editable && isEdit" @click="submitForm()" slot="buttonSave">保存</el-button>
          <el-button v-show='editable && !isEdit' type="primary" @click="submitForm()" size="large" slot="buttonSubmit" :disabled="btnDisabled">提交</el-button>
          <el-button v-show='editable && !isEdit' @click="resetForm()" size="large" slot="buttonReset" :disabled="btnDisabled">重置</el-button>
          <logs slot="tabChangeLog" :selectable="false" :operatable="false" :domain="uploadUrl" :type="logType" :code="code" :isAdvanced="false" :params="changeLogParams" :needPage="true"></logs>
        </layout>
      </ele-form>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import layout from './layout.vue';
import logs from '../logs/list.vue';

import eleBlock from '../components/ele-block/eleBlock.vue';
import eleForm from '../components/ele-form/eleForm.vue';
import { add, edit, get, getDetail } from '../../api/OrgManagementService';

import ApiConst from '../../api/ApiConst';
import { getParamsFromURL } from '../../api/Utils';
import {freightForwarderJsMixin} from '../common/freight-forwarder-js-mixin';

// 引入tab跳转
require('../public.js');

export default {
  components: {
    'ele-form': eleForm,
    'ele-block': eleBlock,
    layout,
    logs
  },
  mixins: [freightForwarderJsMixin],
  data() {
    return {
      objectName: '组织管理',
      configUrl: `${ApiConst.apiPlatformDomain}/detail_render_info/org/list`,
      folder: 'platform/org',
      domainObject: {},
      addFun: add,
      editFun: edit,
      getInfo: get,
      uploadUrl: ApiConst.apiPlatformDomain,
      logType: 'platformOrg',
      listUrl: '/orgManagement/list.html',
      listTitle: '组织管理列表',
      code: '',
      fields: [],
      isEdit: false, // 控制编辑添加按钮
      editable: true, // 控制页面状态
      btnDisabled: false,
      changeLogParams: {
        code: getParamsFromURL(window.location.search).code,
        size: 10
      },
      projectName: JSON.parse(localStorage.getItem('appInfo')).projectName,
      defaultDetailColumns: [],
      actualDetailColumns: [],
      clientDetailColumns: [],
      canEdit: true
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
      this.$nextTick(()=>{
          this.commonLogicOrgType();
      })
      // 认证中和认证通过，不可以编辑认证信息版块
      // if (formData.model.certStatus) {
      //   this.canEdit = formData.model.certStatus === 'unauthenticated' || this.domainObject.certStatus === 'failed';
      // }
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
      this.dealWithOrgType();
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
    },

    /**
     * 当公司激活状态为未激活，才可以修改组织类型
     * @return {[type]} [description]
     */
    dealWithOrgType() {
      // 公司激活状态为未激活，才可以修改组织类型
      let el = this.$refs.form.getElementByField('orgType');
      if (this.domainObject.orgStatus === 'inactivated') {
        this.$set(el.configData, 'readonly', 'FALSE');
      } else {
        this.$set(el.configData, 'readonly', 'TRUE');
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
      this.$refs.form.validate((valid) => {
        if (valid) {
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
          }
          this.btnDisabled = true;
          this.$refs.form.submitForm();
          this.btnDisabled = false;
        } else {
          console.log('submit error');
        }
      });
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
