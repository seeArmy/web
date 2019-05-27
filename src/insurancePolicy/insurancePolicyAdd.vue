<template>
  <div>
    <div class="form-page">
      <ele-form :domainObject="domainObject" ref="form" :configUrl="configUrl" :listUrl="listUrl" :listTitle="listTitle" :addFun='addFun' :editFun='editFun' :getInfo='getInfo' :editable="editable" :isEdit="isEdit" @formReady="formReady" @editSuccess="editSuccess" @submitDone="submitDone" :objectName="objectName" label-width="100px" :inline="false">
        <layout :isEdit="isEdit" :editable="editable" :objectName="objectName" :domainObject="domainObject">
          <div v-for="field in fields" :key="field.fieldConfigCode" :slot="field.fieldConfigCode">
            <el-form-item :label="field.showName" :required="field.required ==='true'">
              <ele-block :field="field" :domainObject="domainObject" :editable="editable " :uploadUrl="uploadUrl" :inputKey="inputKey"></ele-block>
            </el-form-item>
          </div>
          <el-button type="primary" v-show="!editable && isEdit" @click="editForm()" slot="buttonEdit">编辑</el-button>
          <el-button v-show="editable && isEdit" @click="cancelEdit()" slot="buttonCancel">取消编辑</el-button>
          <el-button v-show="editable && isEdit" @click="submitForm()" slot="buttonSave">保存</el-button>
          <el-button v-show='editable && !isEdit' type="primary" @click="submitForm()" size="large" slot="buttonSubmit" :disabled="btnDisabled">提交</el-button>
          <el-button v-show='editable && !isEdit' @click="resetForm()" size="large" slot="buttonReset" :disabled="btnDisabled">重置</el-button>
        </layout>
      </ele-form>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import layout from './layout.vue';

import eleBlock from '../components/ele-block/eleBlock.vue';
import eleForm from '../components/ele-form/eleForm.vue';

import * as InsurancePolicy from '../../api/insurancePolicyService.';

import ApiConst from '../../api/ApiConst';
import * as utils from '../../api/Utils';
import logs from '../logs/list.vue';

export default {
  components: {
    'ele-form': eleForm,
    'layout': layout,
    'logs': logs,
    'ele-block': eleBlock
  },
  data() {
    return {
      objectName: '线下保单',
      configUrl: `${ApiConst.apiLogisticsDomain}/detail_render_info/InsurancePolicy/list`,
      domainObject: {},
      addFun: InsurancePolicy.add,
      editFun: InsurancePolicy.edit,
      getInfo: InsurancePolicy.get,
      uploadUrl: ApiConst.apiLogisticsDomain,
      logType: 'insurancePolicy',
      listUrl: '/insurancePolicy/insurancePolicyList.html',
      listTitle: '线下保单',
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
      loading: true
    };
  },
 
  methods: {
    formReady(formData) {
      let self = this;
      console.log('formReady', formData);
      this.inputKey = formData.paramData.inputKey;
      this.fields = formData.paramData.field;
      this.isEdit = formData.isEdit;
      this.editable = formData.editable;
      sessionStorage.setItem('editable', this.editable);
      this.code = formData.code;
      const params = utils.getParamsFromURL(window.location.search)
      sessionStorage.setItem('editable', this.editable);
      sessionStorage.setItem('isEdit', this.isEdit);
    
    },

    editForm() {
      this.editable = true;
    },
    cancelEdit() {
      this.$refs.form.resetForm();
      this.editable = false;
    },
    //校验保险单文件必填
    checkInsuranceAttachment() {
      let flag = true;
      if (!this.domainObject.insuranceAttachment) {
        utils.showMessageUtil('warning', '请上传保险单文件', 2000);
        flag = false;
      }
      return flag;
    },
    submitForm() {
      if (!this.checkInsuranceAttachment()) return;
      // this.btnDisabled = true;
      this.$refs.form.submitForm();
    },
    resetForm() {
      this.$refs.form.resetForm();
    },
    editSuccess() {
      this.editable = false;
      sessionStorage.setItem('editable', this.editable);
    },
    submitDone() {
      this.btnDisabled = false;
    },
  },
  mounted() {

  }
};

</script>
