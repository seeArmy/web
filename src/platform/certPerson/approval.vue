/**
* add.vue
* Created by cc on 17/12/18.
*/
<template>
  <div>
    <div class="form-page">
      <ele-form :domainObject="domainObject" ref="form" :configUrl="configUrl" :listUrl="listUrl" :listTitle="listTitle" :getInfo="getInfo" :addFun="addFun" :editFun="editFun" :editable="editable" :isEdit="isEdit" @formReady="formReady" @formMounted="formMounted" @editSuccess="editSuccess" @submitDone="submitDone" :objectName="objectName" label-width="100px" :inline="false" :folder="folder">
        <layout :isEdit="isEdit" :editable="editable" :objectName="objectName" :isShow="isShow" :clientDetailColumns="clientDetailColumns">
          <div v-for="field in fields" :slot="field.fieldConfigCode">
            <el-form-item :label="field.showName" :required="field.required ==='true'">
              <ele-block :field="field" :domainObject="domainObject" :editable="editable" :uploadUrl="uploadUrl" :inputKey="inputKey"></ele-block>
            </el-form-item>
          </div>
          <show-image ref="showImage" slot="showImage" @delImg="delImg" :imageUrl="imageUrl" v-if="isShow"></show-image>
          <el-button type="primary" v-show="!editable && isEdit" @click="editForm()" slot="buttonEdit">编辑</el-button>
          <el-button v-show="editable && isEdit" @click="cancelEdit()" slot="buttonCancel">取消编辑</el-button>
          <el-button v-show="editable && isEdit" @click="submitForm()" slot="buttonSave">保存</el-button>
          <!--<el-button v-show="!editable && isEdit" @click="changeLog()" slot="buttonChangeLog">{{ objectName }}变更记录</el-button>-->
          <!-- <el-button v-show='editable && !isEdit' type="primary" @click="submitForm()" size="large" slot="buttonSubmit" :disabled="btnDisabled">提交</el-button> -->
          <el-button v-show='editable' @click="resetForm()" size="large" slot="buttonReset" :disabled="btnDisabled">重置</el-button>
          <el-button v-show='editable' type="primary" @click="submitApproval()" size="large" slot="buttonApproval" :disabled="btnDisabled">提交保存</el-button>
        </layout>
      </ele-form>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import layout from './layout.vue';
import showImage from './showImage.vue';

import eleBlock from '../../components/ele-block/eleBlock.vue';
import eleForm from '../../components/ele-form/eleForm.vue';
import { certPersonApproval, certPersonInfo, certPersonDetail } from '../../../api/PlatformService';

import ApiConst from '../../../api/ApiConst';
import { getParamsFromURL } from '../../../api/Utils';

export default {
  components: {
    'ele-form': eleForm,
    'ele-block': eleBlock,
    layout,
    'show-image': showImage
  },
  props: {
    isShow: {
      type: Boolean,
      'default': true
    }
  },
  data() {
    return {
      objectName: '司机认证',
      configUrl: `${ApiConst.apiPlatformDomain}/detail_render_info/certPerson/list`,
      domainObject: {},
      addFun: Function,
      editFun: Function,
      getInfo: certPersonInfo,
      approvalFun: certPersonApproval,
      uploadUrl: ApiConst.apiPlatformDomain,
      logType: 'certPerson',
      listUrl: '/platform/cert_person/list.html',
      listTitle: '司机认证列表',
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
      imgShowField: '',
      folder: 'platform/certPerson',
      defaultDetailColumns: [],
      actualDetailColumns: [],
      clientDetailColumns: []
    };
  },
  methods: {
    delImg(url) {
      console.log('删除的图片url为', url);
      console.log('字段field为', this.imgShowField);
      // 获取组件显示图片list数据attachmentList
      const imgField = this.$refs.form.getElementByField(this.imgShowField),
        imgArray = imgField.attachmentList;
      console.log('imgField is', imgField, imgArray);
      imgArray.forEach((data, index) => {
        const imgUrl = data.response ? data.response.content.thumbnailList[0].url : data.url;
        if (imgUrl === url) {
          console.log('okay you got me', index, data, imgUrl);
          imgArray.splice(index, 1);
          imgField._onRemove(data, imgArray);
          console.log('del success, new attachmentList is', imgArray);
          console.log('domainObject field is', this.domainObject[this.imgShowField]);
        }
      });
    },
    loadData(driverCode) {
      const paramObj = {
        code: driverCode
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
          const result = success.content;
          Object.keys(result).forEach((key) => {
            this.domainObject[key] = result[key];
          });
        }
      });
    },
    formReady(formData) {
      console.log('formReady', formData);
      this.inputKey = formData.paramData.inputKey;
      this.fields = formData.paramData.field;
      this.isEdit = formData.isEdit;
      this.editable = formData.editable;
      this.code = formData.code;
      this.btnDisabled = this.domainObject.certStatus !== 'authenticating';
    },
    showImage(form, field) {
      console.log('get field is', form.getElementByField(field), field);
      form.getElementByField(field).$on('showImage', (imgData) => {
        console.log('showImage data is', imgData);
        this.imgShowField = field;
        if (this.isShow) {
          this.imageUrl = imgData.content.thumbnailList[0].url;
          this.$refs.showImage.imgDegree = 0;
          this.$refs.showImage.imgScale = 1;
        } else {
          console.log('发出事件到最外层', imgData);
          this.$emit('showImageOutside', imgData, field, 'certPerson');
        }
      });
    },
    previewImage(form, field) {
      form.getElementByField(field).$on('previewImage', (imgData) => {
        console.log('previewImage data is', imgData);
        this.imgShowField = field;
        if (this.isShow) {
          this.imageUrl = imgData.response ? imgData.response.content.thumbnailList[0].url : imgData.url;
          this.$refs.showImage.imgDegree = 0;
          this.$refs.showImage.imgScale = 1;
        } else {
          console.log('发出事件到最外层', imgData);
          this.$emit('previewImageOutside', imgData, field, 'certPerson');
        }
      });
    },
    loadFirst(form, field) {
      form.getElementByField(field).$on('loadFirst', (imgData) => {
        console.log('loadFirst data is', imgData);
        this.imgShowField = field;
        if (this.isShow) {
          this.imageUrl = imgData.url;
          this.$refs.showImage.imgDegree = 0;
          this.$refs.showImage.imgScale = 1;
        } else {
          console.log('发出事件到最外层', imgData);
          this.$emit('loadFirstOutside', imgData, field, 'certPerson');
        }
      });
    },
    formMounted(form) {
      //console.log('<<<<<<<<<<<<<form formMounted------------------');
      this.showImage(form, 'identityResourceCode');
      this.showImage(form, 'driverLicenseResourceCode');
      this.showImage(form, 'qualificationCertificateResourceCode');
      this.previewImage(form, 'identityResourceCode');
      this.previewImage(form, 'driverLicenseResourceCode');
      this.previewImage(form, 'qualificationCertificateResourceCode');
      this.loadFirst(form, 'identityResourceCode');
      this.dealWithShowCertStatus();

      // 获取动态字段名称
      certPersonDetail((success) => {
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
    dealWithShowCertStatus() {
      if (this.editable) {
        return;
      }
      // 拿到配置
      let certStatus = this.$refs.form.getElementByField('certStatus');
      if (certStatus.configData) {
        console.log('certStatus .....', certStatus);
        certStatus.configData.options.push('认证中');
        certStatus.configData.optionsValue.push('authenticating');
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
      this.btnDisabled = true;
      this.$refs.form.submitForm();
      this.btnDisabled = false;
    },
    submitApproval() {
      let self = this;
      this.$refs.form.validate((valid) => {

        // 审核不通过不需要验证  by chen 4/23
        if(self.domainObject.certStatus === 'failed')valid= true;

        if (valid) {
          const result = this.domainObject.certStatus === 'authenticated' || this.domainObject.certStatus === 'failed';
          if (!result) {
            this.$message({
              type: 'warning',
              message: '请选择司机认证结果！',
              duration: 3000
            });
            return false;
          }
          this.btnDisabled = true;
          this.approvalFun(this.domainObject, (success, error) => {
            if (error || success.code !== 200) {
              this.$message({
                type: 'error',
                message: error.content,
                duration: 5000
              });
              return false;
            }
            if (success) {
              const msg = success.content.certStatus === 'authenticated' ? '认证通过' : '认证不通过',
                icon = success.content.certStatus === 'authenticated' ? 'success' : 'warning';
              this.$message({
                type: icon,
                message: msg,
                duration: 5000
              });
              const url = window.location.href + '&editable=false';
              setTimeout(() => {
                window.location = url;
              }, 3000);
            }
          });
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
