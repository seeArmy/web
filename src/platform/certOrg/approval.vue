<template>
  <div>
    <div class="form-page">
      <ele-form :domainObject="domainObject" ref="form" :folder='folder'
                :configUrl="configUrl" :listUrl="listUrl" :listTitle="listTitle"
                :getInfo="getInfo" :addFun="addFun" :editFun="editFun"
                :editable="editable" :isEdit="isEdit"
                @formReady="formReady" @formMounted="formMounted" @editSuccess="editSuccess" @submitDone="submitDone"
                :objectName="objectName"
                label-width="100px" :inline="false">
        <layout :isEdit="isEdit" :clientDetailColumns='clientDetailColumns' :editable="editable" :objectName="objectName" :isShow="isShow" :canEdit="canEdit" :domainObject="domainObject">
          <div v-for="field in fields" :slot="field.fieldConfigCode">
            <el-form-item :label="field.showName" :required="field.required ==='true'">
              <ele-block :field="field" :domainObject="domainObject" :editable="editable && canEdit" :uploadUrl="uploadUrl" :inputKey="inputKey"></ele-block>
            </el-form-item>
          </div>

          <el-button type="primary" v-show="!editable && isEdit" @click="editForm()" slot="buttonEdit">编辑</el-button>
          <el-button v-show="editable && isEdit" @click="cancelEdit()" slot="buttonCancel">取消编辑</el-button>
          <el-button v-show="editable && isEdit" @click="submitForm()" slot="buttonSave">保存</el-button>
          <!--<el-button v-show="!editable && isEdit" @click="changeLog()" slot="buttonChangeLog">{{ objectName }}变更记录</el-button>-->

          <!-- <el-button v-show='editable && !isEdit' type="primary" @click="submitForm()" size="large" slot="buttonSubmit" :disabled="btnDisabled">提交</el-button> -->
          <el-button v-if="showBtn" @click="dialogFormVisible = true" size="large" :disabled="btnDisabled" slot="buttonFail">认证不通过</el-button>
          <el-button v-if="showBtn" type="primary" @click="handleApprovalSuccess()" size="large" :disabled="btnDisabled" slot="buttonPass">认证通过</el-button>

        </layout>
      </ele-form>

      <el-dialog title="认证不通过" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="备注">
            <el-input type="textarea" v-model="form.auditDescription" placeholder="请输入内容" :rows="10" :autosize="{ minRows: 10 }"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleApprovalFail()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import layout from './layout.vue';

  import eleBlock from '../../components/ele-block/eleBlock.vue';
  import eleForm from '../../components/ele-form/eleForm.vue';
  import { certOrgApproval, certOrgInfo ,getDetailCertOrg } from '../../../api/PlatformService';

  import ApiConst from '../../../api/ApiConst';
  import { getParamsFromURL } from '../../../api/Utils';
  import {freightForwarderJsMixin} from '../../common/freight-forwarder-js-mixin';

  export default {
    components: {
      'ele-form': eleForm,
      'ele-block': eleBlock,
      layout
    },
    mixins: [freightForwarderJsMixin],
    data() {
      return {
        objectName: '组织认证',
        configUrl: `${ApiConst.apiPlatformDomain}/detail_render_info/certOrg/list`,
        domainObject: {},
        addFun: Function,
        editFun: Function,
        getInfo: certOrgInfo,
        approvalFun: certOrgApproval,
        uploadUrl: ApiConst.apiPlatformDomain,
        logType: 'certOrg',
        listUrl: '/platform/cert_org/list.html',
        listTitle: '组织认证列表',
        status: false,
        code: '',
        fields: [],
        isEdit: false, // 控制编辑添加按钮
        editable: true, // 控制页面状态
        btnDisabled: false,
        params: {
          code: getParamsFromURL(window.location.search).code
        },
        loading: true,
        imageUrl: '',
        dialogFormVisible: false,
        form: {
          auditDescription: ''
        },
        isShow: getParamsFromURL(window.location.search).isShow === 'true',
        orgCode: getParamsFromURL(window.location.search).orgCode,
        projectName: JSON.parse(localStorage.getItem('appInfo')).projectName,
        showBtn: false,
        canEdit: true,
        folder: 'platform/certOrg',
         defaultDetailColumns: [],
         actualDetailColumns:[],
         clientDetailColumns:[]
      };
    },
    methods: {
      loadData(orgCode, callback) {
        const paramObj = {
          orgCode: orgCode
        };
        this.getInfo(paramObj, (success, error) => {
          if (error || success.code !== 200) {
            this.$message({
              type: 'error',
              message: error.content,
              duration: 5000
            });
            return false;
          }
          if (success) {
            const data = success.content;
            Object.keys(data).forEach((key) => {
              // this.$set(this.domainObject, key, data[key]);
              if (key === 'orgType') {
                data[key] ? (this.domainObject[key] = data[key].toString()) : (this.domainObject[key] = null);
              } else {
                this.domainObject[key] = data[key];
              }
            });
            this.showBtn = this.domainObject.certStatus === 'authenticating';
            callback();
          }
        });
      },
      formReady(formData) {
        this.loadData(this.orgCode, ()=> {
        console.log('formReady', formData);
          this.inputKey = formData.paramData.inputKey;
          this.fields = formData.paramData.field;
          this.isEdit = formData.isEdit;
          this.editable = formData.editable;
          this.code = formData.code;
          // this.editable = this.domainObject.certStatus !== 'authenticated';
          this.$nextTick(()=>{
              this.commonLogicOrgType();
          })
        });
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
        getDetailCertOrg((success) => {
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
      editForm() {
        this.editable = true;
      },
      cancelEdit() {
        this.$refs.form.resetForm();
        this.editable = false;
      },
      validFile() {
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
            console.log('approval error');
          }
        });
      },
      handleApprovalSuccess() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            if (this.validFile()) {
              delete this.domainObject.certStatus;
              const paramObj = Object.assign(this.domainObject, { 'certStatus': 'authenticated' });
              certOrgApproval(paramObj, (success, error) => {
                if (error || success.code !== 200) {
                  this.$message({
                    type: 'error',
                    message: error.content,
                    duration: 5000
                  });
                  this.btnDisabled = false;
                  return false;
                }
                if (success) {
                  this.$message({
                    type: 'success',
                    message: '提交成功',
                    duration: 1000
                  });
                  this.$set(this.domainObject, 'certStatus', 'authenticated');
                  // 修改状态文字
                  document.querySelectorAll('.el-col')[3].querySelector('span').innerHTML='已认证';
                  this.showBtn = false;
                  this.editable = false;
                  // setTimeout(() => {
                  //   window.location.reload();
                  // }, 1000);
                }
              });

            } else {
              console.log('validFile error');
            }

          } else {
            console.log('valid error');
          }
        });
      },
      handleApprovalFail() {
        this.$refs.form.validate((valid) => {
          // 审核不通过不需要验证  by chen 4/23
          valid = true;
          if (valid) {
            if (this.validFile()) {
              delete this.domainObject.certStatus;
              const paramObj = Object.assign(this.domainObject, { 'certStatus': 'failed', 'auditDescription': this.form.auditDescription });
              certOrgApproval(paramObj, (success, error) => {
                if (error || success.code !== 200) {
                  this.$message({
                    type: 'error',
                    message: error.content,
                    duration: 5000
                  });
                  this.btnDisabled = false;
                  this.dialogFormVisible = false;
                  return false;
                }
                if (success) {
                  this.$message({
                    type: 'success',
                    message: '提交成功',
                    duration: 1000
                  });
                  this.$set(this.domainObject, 'certStatus', 'failed');
                  // 修改状态文字
                  document.querySelectorAll('.el-col')[3].querySelector('span').innerHTML='认证失败';
                  this.showBtn = false;
                  this.editable = false;
                  this.dialogFormVisible = false;
                  // setTimeout(() => {
                  //   window.location.reload();
                  // }, 1000);
                }
              });

            } else {
              console.log('validFile error');
            }

          } else {

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
    },
    created() {
      // this.loadData(this.orgCode);
    }
  };
</script>
<style lang="scss" rel="stylesheet/scss">
</style>
