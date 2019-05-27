/** * add.vue * Created by cc on 17/8/10. */
<template>
  <!-- 新建客户 页面 -->
  <div>
    <div class="form-page page_custom_partner">
      <ele-form v-if='publicPage' :publicPage='publicPage' :domainObject="domainObject" ref="form" :configUrl="configUrl" :listUrl="listUrl" :listTitle="listTitle" :getInfo="getInfo" :addFun="addFun" :editFun="editFun" :editable="editable" :isEdit="isEdit" @formReady="formReady" @formMounted="formMounted" @editSuccess="editSuccess" @submitDone="submitDone" :objectName="objectName" label-width="100px" :inline="false" :folder="folder">
        <layout :isEdit="isEdit" :editable="editable" :objectName="objectName" :isReadOnly="isReadOnly" :clientDetailColumns="clientDetailColumns">
          <div v-for="field in fields" :slot="field.fieldConfigCode">
            <el-form-item :label="field.showName" :required="field.required ==='true'">
              <ele-block :field="field" :domainObject="domainObject" :editable="editable" :uploadUrl="uploadUrl" :inputKey="inputKey"></ele-block>
            </el-form-item>
          </div>
          <el-button type="primary" v-show="!editable && (domainObject.certStatus == 'unauthenticated' || domainObject.certStatus == 'failed')" @click="verifyPartnerAll(domainObject.code)" slot="buttonVerify">提交认证</el-button>
          <el-button type="primary" v-show="!editable && isEdit" @click="editForm()" slot="buttonEdit">编辑</el-button>
          <el-button v-show="editable && isEdit" @click="cancelEdit()" slot="buttonCancel">取消编辑</el-button>
          <el-button v-show="editable && isEdit" @click="submitForm()" slot="buttonSave">保存</el-button>
          <!--<el-button v-show="!editable && isEdit" @click="changeLog()" slot="buttonChangeLog">{{ objectName }}变更记录</el-button>-->
          <el-button v-show='editable && !isEdit' type="primary" @click="submitForm()" size="large" slot="buttonSubmit" :disabled="btnDisabled">提交</el-button>
          <el-button class="submitAndVerify" v-show='editable && !isEdit' v-if="showSubmitVerify" type="primary" @click="doSubmitAndVerify()" size="large" slot="buttonSubmit" :disabled="btnDisabled">提交并认证</el-button>
          <el-button v-show='editable && !isEdit' @click="resetForm()" size="large" slot="buttonReset" :disabled="btnDisabled">重置</el-button>
          <!-- 认证信息 -->
          <verify-form slot="verifyForm" ref="verifyForm" :isEdit="isEdit" :editable="editable" :isReadOnly="isReadOnly" :canEdit="canEdit" :objectName="objectName" :domainObject="domainObject" :fields="fields" :inputKey="inputKey" :uploadUrl="uploadUrl" v-if="status" @showObtains="showObtains">
          </verify-form>
          <bank-info slot="bankInfo" :code="params.orgCode" :getInfo="getInfo" v-if="showBankInfo">
          </bank-info>
          <!-- 这是以前认证附件 单独用写的组件 后来改为json 配置 -->
          <bank-account slot="tabBankAccount" :selectable="false" v-if="params.orgCode && params.orgCode.length>0" :chooseBankFun="chooseBankFun" :customColumn="customColumnBankAccount" :addFrom="addFrom" :isAdvanced="true" :params="params" :bankAccountCode="bankAccountCode" :needPage="false">
          </bank-account>
          <!-- 附件 -->
          <!--  <attachment slot="tabAttachment" :value1="attachment_par.attachmentIssuanceDate" 
      :value2="attachment_par.attachmentExpirationDate" 
      :imageUrl="attachment_par.url" 
      @verify = "verify"></attachment> -->
          <!-- <attachment slot="tabAttachment" :attchmentObj="attachment_par" @verify = "verify"></attachment> -->
          <logs slot="tabChangeLog" :selectable="false" :operatable="false" v-if="changeLogParams.orgCode && changeLogParams.orgCode.length>0" :domain="uploadUrl" :type="logType" :code="params.orgCode" :isAdvanced="false" :params="changeLogParams" :needPage="true">
          </logs>
        </layout>
      </ele-form>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import layout from './layout.vue';
import verifyForm from './verifyForm.vue';
import eleBlock from '../components/ele-block/eleBlock.vue';
import eleForm from '../components/ele-form/eleForm.vue';
import { add as partnerAdd, edit as partnerEdit, get as partnerGet, getList, editBank, addAttachment, getAttachment, getAttachmentUrl, editAttachment, verifyPartner, getDetail } from '../../api/PartnerService';
import bankInfo from '../components/ele-bank-info/bankInfo.vue';
import bankAccount from '../bankAccount/list.vue';
import logs from '../logs/list.vue';

import attachment from './attachment.vue';
import * as utils from '../../api/Utils';
import ApiConst from '../../api/ApiConst';
import { getParamsFromURL } from '../../api/Utils';
import {freightForwarderJsMixin} from '../common/freight-forwarder-js-mixin';

export default {
  components: {
    'ele-form': eleForm,
    'ele-block': eleBlock,
    'verify-form': verifyForm,
    layout,
    logs,
    'bank-info': bankInfo,
    'bank-account': bankAccount,
    attachment
  },
  mixins: [freightForwarderJsMixin],
  data() {
    return {
      publicPage:'',
      objectName: '伙伴',
      configUrl: `${ApiConst.apiOrgDomain}/detail_render_info/partner/list`,
      folder: 'org/partner',
      domainObject: {},
      addFun: partnerAdd,
      editFun: partnerEdit,
      getInfo: partnerGet,
      chooseBankFun: editBank,
      uploadUrl: ApiConst.apiOrgDomain,
      logType: 'partner',
      listUrl: '/partner/list.html',
      listTitle: '伙伴管理',
      status: false,
      code: '',
      canEdit: true,
      fields: [],
      isEdit: false, // 控制编辑添加按钮
      editable: true, // 控制页面状态
      btnDisabled: false,
      customColumnBankAccount: ['bankAccountName', 'bankName', 'bankAccountNo', 'creatorUsername', 'createTime', 'updateUsername', 'updateTime'],
      addFrom: 'company',
      params: {
        orgCode: getParamsFromURL(window.location.search).code
      },
      bankAccountCode: '',
      changeLogParams: {
        orgCode: getParamsFromURL(window.location.search).code,
        size: 10
      },
      //附件参数
      // attachment_par:{
      //   orgCode:'',
      //   attachmentName:'营业执照',
      //   attachmentResourceCode:'',
      //   attachmentIssuanceDate:'',
      //   attachmentExpirationDate:'',
      //   url:'',
      // },
      attachment_par: {
        orgCode: '',
        attachmentName: '营业执照',
        attachmentResourceCode: '',
        value1: '',
        value2: '',
        imageUrl: '',
        code: ''
      },
      loading: true,
      isReadOnly: false,
      showBankInfo: false,
      projectName: JSON.parse(localStorage.getItem('appInfo')).projectName,
      defaultDetailColumns: [],
      actualDetailColumns: [],
      clientDetailColumns: []
    };
  },
   computed: {
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
    //此处 所有数据 都 拿到了
    formReady(formData) {
      console.log('formReady', formData);
      this.inputKey = formData.paramData.inputKey;
      this.fields = formData.paramData.field;
      this.isEdit = formData.isEdit;
      this.editable = formData.editable;
      this.code = formData.code;
      this.bankAccountCode = this.domainObject.bankAccountCode;
      // 认证信息版块显示与编辑
      this.status = true;
      // 认证中和认证通过，不可以编辑认证信息版块
      if (formData.model.certStatus) {
        this.canEdit = formData.model.certStatus === 'unauthenticated' || this.domainObject.certStatus === 'failed';
      }
      console.log(this.canEdit);
      this.isReadOnly = this.domainObject.certStatus === 'authenticating' || this.domainObject.certStatus === 'authenticated';

      this.params.orgCode = this.domainObject.code;
      this.changeLogParams.orgCode = this.domainObject.code;
      this.showBankInfo = true;
      this.$nextTick(()=>{
          this.commonLogicOrgType();
      })
    },
    formMounted(form) {
      form.getElementByField('orgType').$on('change', (model) => {
        if (model === '2') {
          console.log('承运方');
          document.querySelectorAll('.el-col')[6].querySelector('.el-form-item').classList.add('is-required');
          document.querySelectorAll('.el-col')[9].querySelector('.el-form-item').classList.add('is-required');
        } else if (model === '3') {
          console.log('托运方');
          document.querySelectorAll('.el-col')[6].querySelector('.el-form-item').classList.add('is-required');
          document.querySelectorAll('.el-col')[9].querySelector('.el-form-item').classList.remove('is-required');
        } else {
          console.log('运营方');
          document.querySelectorAll('.el-col')[6].querySelector('.el-form-item').classList.remove('is-required');
          document.querySelectorAll('.el-col')[9].querySelector('.el-form-item').classList.remove('is-required');
        }
      });
      
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
        data.forEach((val) => {
          this.defaultDetailColumns.push(val.fieldConfigCode);
        });
        this.fields.forEach((val) => {
          this.actualDetailColumns.push(val.fieldConfigCode);
        });
        this.actualDetailColumns.forEach((val) => {
          if (!this.defaultDetailColumns.includes(val)) {
            this.clientDetailColumns.push(val);
          }
        });
      });
      this.dealWithOrgType();
    },
    /**
     * 未认证或认证失败，并且激活状态为未激活，才可以修改组织类型
     * @return {[type]} [description]
     */
    dealWithOrgType() {
      // 未认证或认证失败，并且激活状态为未激活，才可以修改组织类型
      let el = this.$refs.form.getElementByField('orgType');
      if ((this.domainObject.certStatus === 'unauthenticated' || this.domainObject.certStatus === 'failed') && this.domainObject.orgStatus === 'inactivated') {
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
    checkFields(fields) {
      const len = fields.length;
      let pass = 0;
      if (fields) {
        fields.forEach((val) => {
          if (this.domainObject[val[0]] || this.domainObject[val[1]]) {
            (this.domainObject[val[0]] && this.domainObject[val[1]]) ? (pass += 1) : '';
          } else {
            pass += 1;
          }
        });
        return pass;
      }
    },
    validate() {
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
    submitForm(formName, type) {
      this.$refs.verifyForm.$refs.verifyForm.validate((valid) => {
        if (valid) {
          if (this.validate()) {
            // 增加固定科目(油气费、保险费、信息费)如果填写了一项，则必须填写完整判断
            const fields = [
              ['settleConfigValue1', 'settleConfigUnitCode1'],
              ['settleConfigValue2', 'settleConfigUnitCode2'],
              ['settleConfigValue3', 'settleConfigUnitCode3']
            ];
            if (this.checkFields(fields) === fields.length) {
              this.btnDisabled = true;
              this.$refs.form.submitForm();
              this.btnDisabled = false;
            } else {
              this.$message({
                type: 'warning',
                message: '固定科目结算方式设置(油气费、保险费、信息费)，数值和单位必须同时填写完整！',
                duration: 3000
              });
            }
          }
        } else {
          console.log('partner add validate error');
        }
      });
      // if ('all' === type  ) {
      //   return true;
      // } else {
      //   this.$refs[formName].submitForm();
      // }
    },
    verify(code, type) {
      verifyPartner(code,{},(success, error) => {
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
        utils.urlRedirect(url, title);
      });

    },
    // 提交并认证
    submitAndVerify() {
      let self = this;
      // let pass = this.submitForm('form', 'all');
      // if (!pass) return;
      return new Promise((resolve, reject) => {
        // 验证
        self.$refs.verifyForm.$refs.verifyForm.validate((valid) => {
          if (valid) {
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
                reject();
              }
              if (success && success.content) {
                resolve(success.content.code);
              }
            });
          }else{
            return new Promise((resolve,reject)=>{
              reject();
            })
          }
        })
      })
    },
    
    doSubmitAndVerify() {
      this.submitAndVerify().then((code) => {
        if (code) { this.verify(code, true) }
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
    showObtains() {
      if (this.domainObject.orgFullName) {
        const params = {};
        params.orgFullName = this.domainObject.orgFullName;
        getList(params, (success, error) => {
          // if (error) {
          //   this.$message({
          //     type: 'error',
          //     showClose: true,
          //     message: error.content,
          //     duration: 3000
          //   });
          //   return false;
          // }
          if (success.code === 404) {
            this.$message({
              type: 'error',
              showClose: true,
              message: '公司不存在',
              duration: 3000
            });
            return false;

          } else {
            const companyMessage = success.content || {};
            const fieldArray = ['orgName', 'certStatus', 'taxNumber', 'businessLicenseExpirationDate', 'businessLicenseResourceCode', 'creditCode', 'transportCertificateResourceCode', 'transportCertificate', 'transportCertificateExpirationDate', 'city', 'province', 'county', 'address', 'taxType', 'linkmanFullName', 'linkmanPhone', 'orgExternalNo', 'orgType', 'orgStatus', 'legalPersonName', 'legalPersonIdentityNumber', 'legalPersonResourceCode','orgExternalNo1','orgExternalNo2','orgExternalNo3'];
            Object.keys(companyMessage).forEach((key) => {
              if (fieldArray.includes(key)) {
                if ('orgType' === key) {
                  if (companyMessage[key] > 0) {
                    this.$set(this.domainObject, key, companyMessage[key].toString());
                    let ele_orgType = this.$refs['form'].getElementByField('orgType');
                    if (ele_orgType.configData) {
                       this.$set(ele_orgType.configData,'readonly','TRUE');
                    }
                  }
                } else {
                  this.$set(this.domainObject, key, companyMessage[key]);
                }
              }
            })
            if (this.domainObject.certStatus === 'authenticating' || this.domainObject.certStatus === 'authenticated') {
              // 省市区解析延时处理
              setTimeout(() => {
                this.canEdit = false;
              }, 500);
            }
            if (companyMessage.code) {
              this.domainObject.orgCode = companyMessage.code;
            }

          }
        })
      }
    },
    //提交认证
    verifyPartnerAll(code) {
      if (this.validate()) {
        const obj = {};
        verifyPartner(code, obj, (success, error) => {
          if (error || success.code !== 200) {
            this.$message({
              type: 'error',
              showClose: true,
              message: error.content,
              duration: 3000
            });
            return false;
          }
          if (success) {
            this.$message({
              type: 'success',
              message: '提交认证成功',
              duration: 3000
            });
            setTimeout(() => {
              window.location.reload();
            }, 3000);
          }
        });
      }
    },
  },
  created(){
    this.publicPage = `/partnerPublic/add.html?orgCode=${getParamsFromURL(window.location.search).orgCode}&editable=false`
  },
  mounted() {
    const self = this;
    window.matchOrgNow = function() {
      console.log('matchOrgNow');
      self.showObtains();
    }
    // 失焦匹配信息
    setTimeout(() => {
      const ele = document.getElementsByName('orgFullName')[0];
      if (ele) {
        ele.setAttribute('onblur', 'matchOrgNow()');
      }
    }, 1000);
  }
};

</script>
<style lang="scss" rel="stylesheet/scss">
body {
  .confirm-dialog {
    .el-button {
      width: auto !important;
    }
  }
  .page_custom_partner{
    .submitAndVerify{
      margin-left: 5px !important;
    }
  }
}
</style>
