<template>
  <div>
    <div class="form-page">

      <el-form :inline="true" ref="form" :rules="rules" :model="templateModel" label-width="100px">
        <div class="block">
          <div class="el-row">
            <div class="el-col el-col-24">
              <el-form-item label="模板名称" prop="name">
                <el-input
                  v-model="templateModel.name"
                  placeholder="请输入模板名称"></el-input>
              </el-form-item>
            </div>
            <div class="el-col el-col-24">
              <el-form-item label="模板对象" prop="documentCode">
                <el-select v-model="templateModel.documentCode" placeholder="请选择" @change="onBusinessObjectChanged">
                  <el-option
                    v-for="item in businessObjectList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="el-col el-col-24 el-col-auto el-col-field">
              <el-form-item label="打印字段" prop="fields">
                  <el-checkbox-group v-model="checkedFields">
                    <el-checkbox v-for="field in businessObjectFieldList"
                                 :label="field.fieldConfigCode" :key="field.fieldConfigCode">
                      {{field.showName}}
                    </el-checkbox>
                  </el-checkbox-group>
              </el-form-item>
            </div>
            <div class="el-col el-col-24 el-col-auto el-col-field">
              <el-form-item label="二维码字段" prop="fields">
                <el-radio-group v-model="templateModel.qrcodeField">
                  <el-radio v-for="field in businessObjectFieldList"
                            :key="field.fieldConfigCode"
                            :label="field.fieldConfigCode">{{field.showName}}</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
            <div class="el-col el-col-24">
              <el-form-item label="模板规格" prop="bgPicHeight">
                <el-input
                  class="spec-input"
                  v-model="templateModel.bgPicHeight"
                  placeholder="请输入单据长度(mm)"></el-input>
              </el-form-item>
              <el-form-item prop="bgPicWidth">
                <el-input
                  class="spec-input"
                  v-model="templateModel.bgPicWidth"
                  placeholder="请输入单据宽度(mm)"></el-input>
              </el-form-item>
            </div>
            <div class="el-col el-col-24 el-col-auto">
              <el-form-item prop="bgPicResourceCode" label="单据图片">
                <ele-file-upload
                  :maxLength="1"
                  :domainObject="templateModel"
                  :configData="attachmentConfigData"
                  :action="uploadUrl"
                  :uploadUrl='uploadUrl'
                  :beforeUpload="beforeUpload"
                  :file-list="fileList"
                  list-type="picture-card"
                  with-credentials
                  :on-success="handleAvatarSuccess"
                  :on-remove="handleRemove">
                </ele-file-upload>
              </el-form-item>
            </div>
          </div>
        </div>
      </el-form>
      <div class="form-button">
        <el-button v-show="editable" type="primary" @click="desgin()" size="large" :disabled="btnDisabled">设计模板</el-button>
        <el-button v-show="editable" type="primary" @click="preview()" size="large" :disabled="btnDisabled">预览模板</el-button>
        <el-button v-show="editable" type="primary" @click="submitForm()" size="large" :disabled="btnDisabled">保存模板</el-button>
        <el-button v-show="editable" @click="resetForm()" size="large" :disabled="btnDisabled">重置</el-button>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import * as PrintTemplateService from '../../api/PrintTemplateService';
  import * as RenderService from '../../api/RenderService';
  import * as PrintTemplateHelper from './PrintTemplateHelper';
  import { getParamsFromURL, urlRedirect } from '../../api/Utils';
  import eleFileUpload from '../components/ele-file-upload/eleFileUpload.vue';

  export default {
    name: 'elePrintConfig',
    components: {
      'ele-file-upload': eleFileUpload
    },
    props: {
      moduleName: String,
      businessObjectName: String,
      objectName: String,
      listUrl: String,
      businessObjectList: Array
    },
    data() {
      return {
        businessObjectFieldList: [],
        checkedFields: [],
        templateModel: {
          code: null,
          bgPicResourceCode: null,
          documentCode: null,
          name: null,
          bgPicHeight: null,
          bgPicWidth: null,
          qrcodeField: null
        },
        isEdit: false,
        btnDisabled: false,
        editable: true,
        code: null,
        uploadUrl: null,
        imageUrl: null,
        fileList: [],
        rules: {
          name: [
            { required: true, message: '请输入模板名称', trigger: 'blur' }
          ]
        },
        attachmentConfigData: { field: 'bgPicResourceCode', controlType: 'file' },
        theme: true
      };
    },
    methods: {
      errorTip(error) {
        this.$message({
          type: 'error',
          message: error.content,
          duration: 5000
        });
      },
      addSuccessTip() {
        this.$confirm(`恭喜您,新建${this.objectName}成功！ 是否继续新建${this.objectName}?`, '提示', {
          confirmButtonText: '继续新建',
          cancelButtonText: `返回${this.objectName}列表`,
          type: 'success',
          customClass: 'confirm-dialog'
        }).then(() => {
          window.location.reload();
        }).catch(() => {
          urlRedirect(this.listUrl, `${this.objectName}列表`);
        });
      },
      editSuccessTip() {
        this.$message({
          type: 'success',
          message: '提交成功',
          duration: 1000
        });
      },
      loadBusinessObjectFields() {
        if (this.templateModel.documentCode) {
          const businessObject = this.templateModel.documentCode.split('.');
          console.log('found', businessObject);
          this.checkedFields = [];
          this.businessObjectFieldList = [];
          PrintTemplateService.getBusinessObjectDetailRenderList(businessObject[0], businessObject[1], (success, error) => {
            if (error) {
              console.error('get detail render error', error);
            } else {
              console.log('success', success);
              RenderService.getRenderList(success, this.onRenderConfigDataReady);
            }
          });
        }
      },
      onBusinessObjectChanged(value) {
        if (!this.isInit) {
          console.log('value', value, 'onBusinessObjectChanged', this.templateModel);
          this.loadBusinessObjectFields();
        }
      },
      onRenderConfigDataReady(renderConfigData, error) {
        if (error) {
          console.error('get detail render error', error);
        } else {
          renderConfigData.field.forEach((field) => {
            this.businessObjectFieldList.push(field);
          });
          if (this.isInit) {
            const templateFields = this.templateModel.fields.split(',');
            this.$nextTick(() => {
              templateFields.forEach((fieldName) => {
                this.checkedFields.push(fieldName);
              });
            });
            this.isInit = false;
          }
        }
      },
      resetForm() {
        this.$refs.form.resetFields();
      },
      doSubmit() {
        this.btnDisabled = true;
        this.templateModel.fields = this.checkedFields.join(',');
        if (this.isEdit) {
          PrintTemplateService.edit(this.moduleName, this.businessObjectName, this.code, this.templateModel, this.onSubmitDone);
        } else {
          PrintTemplateService.add(this.moduleName, this.businessObjectName, this.templateModel, this.onSubmitDone);
        }
      },
      submitForm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.doSubmit();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      onSubmitDone(success, error) {
        if (error) {
          this.errorTip(error);
        } else if (this.isEdit) {
          this.editSuccessTip();
//          this.editable = false;
        } else {
          this.addSuccessTip();
        }
        this.btnDisabled = false;
      },
      getImageUrl() {
        PrintTemplateService.getResource(this.moduleName, this.templateModel.bgPicResourceCode, (success, error) => {
          if (error) {
            console.error('get resource error', error);
          } else {
            this.imageUrl = success.content.thumbnailList[0].url;
            this.fileList = [{ url: success.content.thumbnailList[0].url }];
          }
        });
      },
      onDesginFinish(context) {
        this.templateModel.context = context;
        console.log('templateModel', this.templateModel);
      },
      desgin() {
        const selected = this.businessObjectFieldList.filter(item => this.checkedFields.find(code => item.fieldConfigCode === code));
        PrintTemplateHelper.designTemplate(this.templateModel.bgPicWidth, this.templateModel.bgPicHeight, selected, this.imageUrl, this.templateModel.context, this.templateModel.qrcodeField, this.onDesginFinish);
      },
      preview() {
        const selected = this.businessObjectFieldList.filter(item => this.checkedFields.find(code => item.fieldConfigCode === code));
        PrintTemplateHelper.previewDocument(selected, this.imageUrl, this.templateModel.context, this.templateModel.qrcodeField);
      },
      beforeUpload() {},
      handleAvatarSuccess(res) {
//        this.templateModel.bgPicResourceCode = res.content.resourceCode;
        this.imageUrl = res.content.thumbnailList[0].url;
        this.fileList = [{ url: res.content.thumbnailList[0].url }];
      },
      handleRemove() {
        this.templateModel.bgPicResourceCode = null;
        this.imageUrl = null;
        this.fileList = [];
      }
    },
    created() {
      if (this.theme) {
        document.querySelector('body').classList.add('theme-blue');
      }
      this.uploadUrl = PrintTemplateService.getUploadUrl(this.moduleName);
      const params = getParamsFromURL(window.location.search);
      if (params.code) {
        this.code = params.code;
        this.isEdit = true;
        PrintTemplateService.get(this.moduleName, this.businessObjectName, this.code, (success, error) => {
          if (error) {
            console.error('get template error', error);
          } else {
            if (!success.content.qrcodeField) {
              success.content.qrcodeField = null;
            }
            this.templateModel = success.content;
            if (this.templateModel.bgPicResourceCode && this.templateModel.bgPicResourceCode.length > 0) {
              this.getImageUrl();
            }
            this.isInit = true;
            this.loadBusinessObjectFields();
          }
        });
      }
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
.form-page {
  .el-select {
    width: 174px;
  }
}
.el-col-field {
  .el-form-item {
    display: block;
    margin-right: 0;
    padding-left: 100px;
    .el-form-item__label {
      float: left;
      margin-left: -100px;
    }
    .el-form-item__content {
      display: block;
      width: 100%;
    }
  }
}
.el-checkbox-group {
  padding: 10px;
  border: solid 1px #ddd;
  .el-checkbox {
    width: 120px;
    margin-right: 10px;
    +.el-checkbox {
      margin-left: 0;
    }
  }
}
.el-radio-group {
  display: block;
  padding: 10px;
  border: solid 1px #ddd;
  .el-radio {
    width: 120px;
    margin-right: 10px;
    line-height: 24px;
    +.el-radio {
      margin-left: 0;
    }
  }
}
</style>
