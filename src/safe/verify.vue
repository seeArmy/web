/** * add.vue * Created by cc on 18/5/30. */
<template>
  <div>
    <div class="form-page">
      <ele-form :domainObject="domainObject" ref="form" :configUrl="configUrl" :listUrl="listUrl" :listTitle="listTitle" :getInfo="getInfo" :addFun="addFun" :editFun="editFun" :editable="editable" :isEdit="isEdit" @formReady="formReady" @editSuccess="editSuccess" @submitDone="submitDone" :objectName="objectName" label-width="100px" :inline="false">
        <layout :isEdit="isEdit" :editable="editable" :objectName="objectName" :certStatus="certStatus">
          <div v-for="field in fields" :slot="field.fieldConfigCode">
            <el-form-item :label="field.showName" :required="field.required ==='true'">
              <ele-block :field="field" :domainObject="domainObject" :editable="editable" :uploadUrl="uploadUrl" :inputKey="inputKey"></ele-block>
            </el-form-item>
          </div>
          <el-button type="primary" v-show="!editable && isEdit" @click="editForm()" slot="buttonEdit">编辑</el-button>
          <el-button v-show="editable && isEdit" @click="cancelEdit()" slot="buttonCancel">取消编辑</el-button>
          <el-button v-show="editable && isEdit" @click="submitForm()" slot="buttonSave">保存</el-button>
          <!--<el-button v-show="!editable && isEdit" @click="changeLog()" slot="buttonChangeLog">{{ objectName }}变更记录</el-button>-->
          <el-button v-show='editable && !isEdit' type="primary" @click="submitForm()" size="large" slot="buttonSubmit" :disabled="btnDisabled">提交</el-button>
          <el-button v-show='editable && !isEdit' @click="resetForm()" size="large" slot="buttonReset" :disabled="btnDisabled">重置</el-button>
          <el-button v-show='showVerifyBtn' type="primary" @click="submitVerify()" size="large" slot="buttonVerify" :disabled="btnDisabled">提交认证</el-button>
        </layout>
      </ele-form>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import layout from './layout.vue';

import eleBlock from '../components/ele-block/eleBlock.vue';
import eleForm from '../components/ele-form/eleForm.vue';
import { verify, get } from '../../api/SafeService';

import ApiConst from '../../api/ApiConst';
import {
  getParamsFromURL,
} from '../../api/Utils';

export default {
  components: {
    'ele-form': eleForm,
    'ele-block': eleBlock,
    layout
  },
  data() {
    return {
      objectName: '公司认证',
      configUrl: `${ApiConst.apiOrgDomain}/detail_render_info/verify/list`,
      domainObject: {},
      addFun: Function,
      editFun: Function,
      getInfo: get,
      uploadUrl: ApiConst.apiOrgDomain,
      listUrl: '',
      listTitle: '',
      code: '',
      fields: [],
      isEdit: false, // 控制编辑添加按钮
      editable: true, // 控制页面状态
      btnDisabled: false,
      loading: true,
      certStatus: '',
      showVerifyBtn: true
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
    },
    editForm() {
      this.editable = true;
    },
    cancelEdit() {
      this.$refs.form.resetForm();
      this.editable = false;
    },
    submitForm() {
      this.btnDisabled = true;
      this.$refs.form.submitForm();
    },
    submitVerify() {
      const fromTime = new Date(this.domainObject.businessLicenseIssuanceDate),
        toTime = new Date(this.domainObject.businessLicenseExpirationDate);

      const now = new Date();
      // 2018.7.4 需求，截止时间必须 大于当前时间
      if (  now>toTime  && this.domainObject.businessLicenseExpirationDate ) {
        this.$message({
          type: 'warning',
          message: '营业执照截止时间必须大于当前时间！',
          duration: 3000
        });
        return;
      }

      if (!this.domainObject.businessLicenseResourceCode ) {
        this.$message({
          type: 'warning',
          message: '请上传营业执照！',
          duration: 3000
        });
        return;
      }

      if (toTime <= fromTime  && this.domainObject.businessLicenseExpirationDate && this.domainObject.businessLicenseIssuanceDate) {
        this.$message({
          type: 'warning',
          message: '请选择合理的营业执照有效期范围！',
          duration: 3000
        });
        return false;
      } else {
        this.btnDisabled = true;
        verify(this.domainObject, (success, error) => {
          if (error || success.code !== 200) {
            this.$message({
              type: 'error',
              message: error.content,
              duration: 3000
            });
            return false;
          }
          if (success) {
            this.$message({
              type: 'success',
              message: '提交认证成功！',
              duration: 3000
            });
            setTimeout(() => {
              window.location.reload();
            }, 3000);
          }
        });
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
  },
  mounted() {
    get({}, (success, error) => {
      if (error || success.code !== 200) {
        this.$message({
          type: 'error',
          message: error.content,
          duration: 5000
        });
        return false;
      }
      if (success) {
        const data = success.content,
          loadKeys = ['orgName', 'orgFullName', 'businessLicenseIssuanceDate', 'businessLicenseExpirationDate', 'businessLicenseResourceCode'];
        Object.keys(data).forEach((key) => {
          if (loadKeys.includes(key)) {
            this.$set(this.domainObject, key, data[key]);
          }
        });
        this.certStatus = data.certStatus;
        this.showVerifyBtn = data.certStatus === 'unauthenticated' || data.certStatus === 'failed';
        this.editable = data.certStatus === 'unauthenticated' || data.certStatus === 'failed';
      }
    });
  }
};

</script>
