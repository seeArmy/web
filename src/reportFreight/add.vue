/**
* add.vue
* 上报运费
* Created by cc on 18/3/12.
*/
<template>
  <div>
    <div class="form-page">
      <ele-form :domainObject="domainObject" ref="form"
                :configUrl="configUrl" :listUrl="listUrl" :listTitle="listTitle"
                :getInfo="getInfo" :addFun="addFun" :editFun="editFun"
                :editable="editable" :isEdit="isEdit"
                @formReady="formReady" @editSuccess="editSuccess" @submitDone="submitDone"
                :objectName="objectName"
                label-width="100px" :inline="false">
        <layout :isEdit="isEdit" :editable="editable" :objectName="objectName">
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

        </layout>
      </ele-form>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  import layout from './layout.vue';

  import eleBlock from '../components/ele-block/eleBlock.vue';
  import eleForm from '../components/ele-form/eleForm.vue';

  import * as ReportFreightService from '../../api/ReportFreightService';

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
        objectName: '上报运费',
        configUrl: `${ApiConst.apiWayBillDomain}/detail_render_info/reportFreight/list`,
        domainObject: {},
        addFun: ReportFreightService.add,
        editFun: ReportFreightService.edit,
        getInfo: ReportFreightService.get,
        uploadUrl: ApiConst.apiWayBillDomain,
        logType: 'waybill',
        listUrl: '/reportFreight/list.html',
        listTitle: '上报运费列表',
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
        loading: true,
        sectionObject: {
          p1: {
            valid: false,
            isNull: true
          },
          p2: {
            valid: false,
            isNull: true
          },
          p3: {
            valid: false,
            isNull: true
          },
          p4: {
            valid: false,
            isNull: true
          }
        }
      };
    },
    methods: {
      checkSection(id) {
        if (id === 1) {
          if (this.domainObject[`paymentMeansCode${id}`] || this.domainObject[`sequenceCode${id}`] || this.domainObject[`monetaryAmount${id}`] || this.domainObject[`dateTime${id}`] || this.domainObject["bankCode"]) {
            this.sectionObject.p1.isNull = false;
            if (this.domainObject[`paymentMeansCode${id}`] && this.domainObject[`sequenceCode${id}`] && this.domainObject[`monetaryAmount${id}`] && this.domainObject[`dateTime${id}`] && this.domainObject["bankCode"]) {
              this.sectionObject.p1.valid = true;
            } else {
              this.sectionObject.p1.valid = false;
            }
          } else {
            this.sectionObject.p1.isNull = true;
          }
        } else {
          if (this.domainObject[`paymentMeansCode${id}`] || this.domainObject[`sequenceCode${id}`] || this.domainObject[`monetaryAmount${id}`] || this.domainObject[`dateTime${id}`]) {
            this.sectionObject[`p${id}`].isNull = false;
            if (this.domainObject[`paymentMeansCode${id}`] && this.domainObject[`sequenceCode${id}`] && this.domainObject[`monetaryAmount${id}`] && this.domainObject[`dateTime${id}`]) {
              this.sectionObject[`p${id}`].valid = true;
            } else {
              this.sectionObject[`p${id}`].valid = false;
            }
          } else {
            this.sectionObject[`p${id}`].isNull = true;
          }
        }
      },
      formReady(formData) {
        console.log('formReady', formData);
        this.inputKey = formData.paramData.inputKey;
        this.fields = formData.paramData.field;
        this.isEdit = formData.isEdit;
        this.editable = formData.editable;
        this.code = formData.code;
        const params = utils.getParamsFromURL(window.location.search),
          self = this;

      },
      editForm() {
        this.editable = true;
      },
      cancelEdit() {
        this.$refs.form.resetForm();
        this.editable = false;
      },
      submitForm() {
        this.checkSection(1);
        this.checkSection(2);
        this.checkSection(3);
        this.checkSection(4);
        console.log('表单填写状态为==', this.sectionObject);
        if (!this.sectionObject.p1.valid && !this.sectionObject.p2.valid && !this.sectionObject.p3.valid && !this.sectionObject.p4.valid) {
          this.$message({
            type: 'warning',
            message: '请填写完整至少一种付款方式！',
            duration: 3000
          });
          this.btnDisabled = false;
        } else {
          for (let i=1; i<5; i++) {
            if (!this.sectionObject[`p${i}`].isNull && !this.sectionObject[`p${i}`].valid) {
              this.$message({
                type: 'warning',
                message: `付款方式${i}未填写完整！`,
                duration: 3000
              });
              this.btnDisabled = false;
              return false;
            }
          }
          this.btnDisabled = true;
          this.$refs.form.submitForm();
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

