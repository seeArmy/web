/**
* add.vue 司机详情页面
* Created by cc on 17/8/10.
*/
<template>
  <div class="diver-add">
    <div class="form-page">
      <ele-form :domainObject="domainObject" ref="form" :configUrl="configUrl" :listUrl="listUrl" :listTitle="listTitle" :getInfo="getInfo" :addFun="addFun" :editFun="editFun" :editable="editable" :isEdit="isEdit" @formReady="formReady" @formMounted="formMounted" @editSuccess="editSuccess" @submitDone="submitDone" :objectName="objectName" label-width="100px" :inline="false" :folder="folder">
        <layout :isEdit="isEdit" :editable="editable" :objectName="objectName" :clientDetailColumns="clientDetailColumns">
          <!-- 档案信息 -->
          <div v-for="field in fields" :key="field.fieldConfigCode" :slot="field.fieldConfigCode">
            <el-form-item :label="field.showName" :required="field.required ==='true'">
              <ele-block :field="field" :domainObject="domainObject" :editable="editable" :uploadUrl="uploadUrl" :inputKey="inputKey"></ele-block>
            </el-form-item>
          </div>
          <!-- 操作按钮 -->
          <el-button type="primary" v-show="unVerify && !editable" @click="verify(domainObject.code)" slot="buttonVerify">提交认证</el-button>
          <el-button v-show="editable" @click="clearDriveEntrust()" slot="clearDriveEntrust">清除委托人</el-button>
          <el-button type="primary" v-show="!editable && isEdit" @click="editForm('form')" slot="buttonEdit">编辑</el-button>
          <el-button v-show="editable && isEdit" @click="cancelEdit('form')" slot="buttonCancel">取消编辑</el-button>
          <el-button v-show="editable && isEdit" @click="submitForm('form')" slot="buttonCancel">保存</el-button>


          <el-button class="submitAndVerify" v-show='editable && !isEdit' v-if="showSubmit" type="primary" @click="submitForm('form')" size="large" slot="buttonSubmit" :disabled="btnDisabled">提交</el-button>

          <el-button v-show='editable && !isEdit' v-if="showSubmitVerify" type="primary" @click="submitAndVerify()" size="large" slot="buttonSubmit" :disabled="btnDisabled">提交并认证</el-button>


          <el-button v-show='editable && !isEdit' @click="resetForm('form')" size="large" slot="buttonReset" :disabled="btnDisabled">重置</el-button>
          <!-- 认证信息 -->
          <verify-form slot="verifyForm" ref="verifyForm" :isEdit="isEdit" :editable="editable" :canEdit="canEdit" :objectName="objectName" :domainObject="domainObject" :fields="fields" :inputKey="inputKey" :uploadUrl="uploadUrl" v-if="status" @showMatch="showMatch">
          </verify-form>
          <!-- 银行账户信息 -->
          <bank-form slot="bankForm" ref="bankForm" :isEdit="isEdit" :editable="editable" :bankCanEdit="bankCanEdit" :objectName="objectName" :domainObject="domainObject" :fields="fields" :inputKey="inputKey" :uploadUrl="uploadUrl" v-if="status">
          </bank-form>
          <!-- 平台账号信息 -->
          <account-info slot="accountInfo" :code="code" :getInfo="getAccountInfo" v-if="code">
          </account-info>
          <!-- 银行账户信息 -->
          <!-- <bank-info slot="bankInfo" :code="params.driverCode" :getInfo="getInfo" v-if="params.driverCode">
          </bank-info> -->
          <!-- 银行账户信息 -->
          <!-- <account-list slot="accountList" :selectable="false" :chooseBankFun="chooseBankFun" :customColumn="customColumnAccount" :isAdvanced="true" :params="bankAccountParams" :bankAccountCode="bankAccountCode" :needPage="false" v-if="bankAccountParams.personCode"></account-list> -->
          <!-- 司机评价列表 -->
          <evaluate-list slot="tabEvaluate" :params="evaParams" v-if="evaStatus"></evaluate-list>
          <!-- 变更记录 -->
          <logs slot="logs" :selectable="false" :operatable="false" :domain="uploadUrl" :type="logType" :code="code" :isAdvanced="false" :params="params" :needPage="true" v-if="showChangeData"></logs>
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
import verifyForm from './verifyForm.vue';
import bankForm from './bankForm.vue';
import accountInfo from './accountInfo.vue';
// import accountList from './account-list.vue';
// import bankInfo from '../components/ele-bank-info/bankInfo.vue';

import evaluateList from './evaluate/list.vue';

import logs from '../logs/list.vue';

import ApiConst from '../../api/ApiConst';
import { removeClass } from '../../api/classUtil';
import { getParamsFromURL, urlRedirect } from '../../api/Utils';

import { add, edit, get, getColumnDetail, editBank, verify, getAccountInfo } from '../../api/DriverService';

export default {
  components: {
    'ele-form': eleForm,
    eleBlock,
    'verify-form': verifyForm,
    'bank-form': bankForm,
    'account-info': accountInfo,
    'evaluate-list': evaluateList,
    // accountList,
    logs,
    // 'bank-info': bankInfo,
    layout
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
      uploadUrl: ApiConst.apiPersonDomain,
      params: {
        driverCode: getParamsFromURL(window.location.search).code,
        size: 10
      },
      evaParams: {
        platformUserCode: '', // 司机平台级code
        size: 10
      },
      bankAccountCode: '',
      bankAccountParams: {
        personCode: getParamsFromURL(window.location.search).code,
        size: 10
      },
      logType: 'driver',
      listUrl: '/driver/list.html',
      listTitle: '司机管理',
      customColumnAccount: ['bankAccountName', 'bankName', 'bankAccountNo', 'description'],
      truckInfo: { truckLicenseNo: null, code: null, userCode: null },
      showChangeData: false,
      status: false,
      canEdit: true,
      bankCanEdit: true,
      folder: 'person/driver',
      defaultDetailColumns: [],
      actualDetailColumns: [],
      clientDetailColumns: [],
      matchUserObj: {
        phone: '',
        userCode: ''
      },
      projectName: JSON.parse(localStorage.getItem('appInfo')).projectName,
      evaStatus: false
    };
  },
  watch: {
    editable(newVal, oldVal) {
      if (!newVal) {
        if (!this.domainObject.authorizeResourceCode) {
          let ele = this.$refs.form.getElementByField('authorizeResourceCode');
          if (ele) {
            this.$set(ele, 'attachmentList', [])
          }
        }
      }
    }
  },
  computed: {
    showSubmit() {
      let defaultShow = true;
        // 认证中和认证通过，显示提交按钮
        if (this.domainObject.certStatus === 'authenticating' || this.domainObject.certStatus === 'authenticated') {
          defaultShow = true;
        } else {
            defaultShow = false;
        }
      return defaultShow;
    },
    showSubmitVerify() {
      let defaultShow = true;
      // 认证中和认证通过，不显示提交认证按钮
      if (this.domainObject.certStatus === 'authenticating' || this.domainObject.certStatus === 'authenticated') {
        defaultShow = false;
      } else {
        defaultShow = true;
      }
      return defaultShow;
    }
  },
  methods: {
    // 清除委托人
    clearDriveEntrust() {
      let listKey = ['authorizePayeeFullName', 'authorizePayeeCode', 'authorizePayeePlatformCode', 'authorizePayeePhone', 'authorizeResourceCode'];
      let self = this;

      if (document.querySelector('#driveEntrust')) {
        const imglist = document.querySelector('#driveEntrust .el-upload-list').querySelectorAll('li'),
          uploadCard = document.querySelector('#driveEntrust .el-upload--picture-card');
        if (imglist.length > 0) {
          document.querySelector('#driveEntrust .el-upload-list').innerHTML = '';
          removeClass(uploadCard, 'hide');
        }
        // 影藏 editable 情况下
        //  authorizeResourceCode
        // let ele =   this.$refs.form.getElementByField('authorizeResourceCode');
        // if(ele){
        //  this.$set(ele,'attachmentList',[])
        // }
      }
      listKey.forEach(item => {
        self.$set(self.domainObject, item, '');
      });
    },
    // 提交并认证
    submitAndVerify() {
      let self = this;
      //1. 验证 内容  验证表单 是 异步的
      this.submitForm('form', (mark) => {
        console.log('验证过了 ...',mark);
        if(!mark){
          return;
        }
        //2. 提交
        //表单验证
        self.$refs.form.$refs.form.validate((valid) => {
          self.addFun(self.domainObject, (success, error) => {
            console.log('disabled = false.')
            self.btnDisabled = false;
            if (error || success.code !== 200) {
              this.$message({
                type: 'error',
                showClose: true,
                message: error.content,
                duration: 5000
              });
            }
            if (success && success.content) {
              //3. 验证
              self.verify(success.content.code, true);
            }
          });
        })
      })
    },
    formReady(formData) {
      console.log('formReady', formData);
      this.inputKey = formData.paramData.inputKey;
      this.fields = formData.paramData.field;
      this.isEdit = formData.isEdit;
      this.editable = formData.editable;
      this.bankAccountCode = this.domainObject.bankAccountCode;
      this.unVerify = (this.domainObject.certStatus === 'unauthenticated' || this.domainObject.certStatus === 'failed');

      // 认证信息版块显示与编辑
      this.status = true;
      // 认证中和认证通过，不可以编辑认证信息版块
      if (formData.model.certStatus) {
        this.canEdit = formData.model.certStatus === 'unauthenticated' || this.domainObject.certStatus === 'failed';
      }
      // 司机未激活才可编辑银行账户信息
      if (formData.model.certStatus) {
        this.bankCanEdit = formData.model.userStatus !== 'activated';
      }
      console.log('can edit is', this.canEdit);
      console.log('bankcan edit is', this.bankCanEdit);

      this.truckInfo.truckLicenseNo = formData.model.phone;
      this.truckInfo.code = formData.model.code;
      this.truckInfo.userCode = formData.model.code;
      this.truckInfo.fullName = this.domainObject.fullName;

      // 司机银行信息显示
      this.params.driverCode = this.domainObject.code;

      // 银行账户信息传参personCode为司机的code
      this.bankAccountParams.personCode = this.domainObject.code;

      // 变更记录信息传参code为司机的code
      this.code = this.domainObject.code;

      // 司机司机评价记录code为司机平台级code
      this.evaParams.platformUserCode = this.domainObject.userCode;
      this.evaStatus = true;
      if (this.code) {
        console.log('changeLog code is ', this.code);
        this.showChangeData = true;
      }
    },
    formMounted(form) {
      // 获取动态字段名称
      getColumnDetail((success) => {
        const data = success.content;
        console.log('详情默认配置', data);
        data.forEach((val) => {
          this.defaultDetailColumns.push(val.fieldConfigCode);
        });
        this.fields.forEach((val) => {
          this.actualDetailColumns.push(val.fieldConfigCode);
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
    },
    /**
     * 处理银行 信息 输入时 去除 全部空格
     */
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
      this.$refs.form.resetForm();
      this.editable = false;
      this.isEdit = true;
      this.$refs['verifyForm'].$refs['verifyForm'].resetFields();
      this.$refs['bankForm'].$refs['verifyForm'].resetFields();
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
    submitForm(formName, cb) {
      console.log('匹配到的手机号码信息为', this.matchUserObj);
      // 如果最终提交的手机号码跟上一次匹配的手机号码不一致，则删除上次匹配的userCode
      if (this.domainObject.phone !== this.matchUserObj.phone) {
        this.$set(this.domainObject, 'userCode', null);
      }
      this.$refs.verifyForm.$refs.verifyForm.validate((valid) => {
        if (valid) {
          
          if (!this.domainObject.driverLicenseResourceCode) {
            this.$message({
              type: 'warning',
              message: '驾驶证附件为必填选项，请上传驾驶证附件！',
              duration: 3000
            });
            if (!!cb) cb(false);
            return false;
          }

          console.log('driver add validate success');
          if (!!cb) {
            cb(true);
          } else {
            this.$refs[formName].submitForm();
          }
        } else {
          console.log('driver add validate error');
          if (!!cb) cb(false);
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetForm();
      this.$refs['verifyForm'].$refs['verifyForm'].resetFields();
      this.$refs['bankForm'].$refs['verifyForm'].resetFields();
    },
    verify(code, type) {
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
            if (type) {
              this.showPage();
            }
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
    showPage() {
      let self = this;
      this.$confirm(`恭喜您,新建并认证${self.objectName}成功！ 是否继续新建${self.objectName}?`, '提示', {
        confirmButtonText: '继续新建',
        cancelButtonText: `返回${self.objectName}列表`,
        type: 'success',
        customClass: 'confirm-dialog'
      }).then(() => {
        window.location.reload();
      }).catch(() => {
        let url = this.listUrl;
        const qindex = url.indexOf('?'),
          title = this.listTitle;
        if (qindex > -1 && !lsType) {
          url = url.substring(0, qindex);
        }
        urlRedirect(url, title);
      });

    },
    showMatch(content) {
      const data = content || {},
        fieldArray = ['headPictureResourceCode', 'fullName', 'gender', 'certStatus', 'identityResourceCode', 'identityNumber', 'identityExpirationDate', 'driverLicenseResourceCode', 'driverLicenseAcceptType', 'driverLicenseExpirationDate', 'driverLicenseNo', 'qualificationCertificateResourceCode', 'qualificationCertificateNumber', 'qualificationCertificateExpirationDate', 'bankAccountName', 'bankName', 'bankAccountNo', 'bankAccountDescription'];
      console.log('driverMatch result is ', data);
      Object.keys(data).forEach((key) => {
        if (fieldArray.includes(key)) {
          this.$set(this.domainObject, key, data[key]);
        }
      });
      // 记录匹配到的用户手机号码和userCode
      this.$set(this.matchUserObj, 'userCode', data.code);
      this.$set(this.matchUserObj, 'phone', this.domainObject.phone);
      // 匹配到的code，作为userCode一起提交
      if (data.code) {
        this.$set(this.domainObject, 'userCode', data.code);
      }
      // 匹配到的认证结果为认证中和已认证，则不可编辑
      if (data.certStatus) {
        this.canEdit = data.certStatus === 'unauthenticated' || data.certStatus === 'failed';
      }
      // 匹配到的司机激活状态为已激活，则不可编辑
      if (data.userStatus) {
        this.bankCanEdit = data.userStatus !== 'activated';
      }
    }
  },
  created() {
    const driverUrl = ApiConst.apiPersonDomain,
      configUrl = `${driverUrl}/detail_render_info/driver/list`;
    this.configUrl = configUrl;
  },
  mounted() {
    const self = this;
    window.matchDriverInfoNow = function() {
      console.log('matchDriverInfoNow');
      self.$refs.verifyForm.driverMatch();
    }
    // 失焦匹配信息
    setTimeout(() => {
      const ele = document.getElementsByName('phone')[0];
      if (ele) {
        ele.setAttribute('onblur', 'matchDriverInfoNow()');
      }
    }, 1000);
  }
};

</script>
<style lang="scss" rel="stylesheet/scss">
.diver-add {
  .submitAndVerify {
    margin-right: 3px;
  }
}

</style>
