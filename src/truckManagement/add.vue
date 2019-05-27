/**
* add.vue
* Created by cc on 17/11/17.
*/
<template>
  <div>
    <div class="form-page">
      <ele-form :domainObject="domainObject" ref="form"
                :configUrl="configUrl" :listUrl="listUrl" :listTitle="listTitle"
                :getInfo="getInfo" :addFun="addFun" :editFun="editFun"
                :editable="editable" :isEdit="isEdit"
                @formReady="formReady" @formMounted="formMounted" @editSuccess="editSuccess" @submitDone="submitDone"
                :objectName="objectName"
                :folder='folder'
                label-width="100px" :inline="false">
        <layout :clientDetailColumns='clientDetailColumns' :domainObject="domainObject" :isEdit="isEdit" :editable="editable" :objectName="objectName" :companyData="companyData">
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

          <logs slot="tabChangeLog" :selectable="false" :operatable="false"
                :domain="uploadUrl" :type="logType" :code="code" :isAdvanced="false"
                :params="changeLogParams" :needPage="true">
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
  import { edit, get, joinCompany } from '../../api/TruckManagementService';
  
  import logs from '../logs/list.vue';

  import ApiConst from '../../api/ApiConst';
  import { getParamsFromURL } from '../../api/Utils';
  import {freightForwarderJsMixin} from '../common/freight-forwarder-js-mixin';

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
        objectName: '车辆',
        configUrl: `${ApiConst.apiPlatformDomain}/detail_render_info/truck/list`,
        domainObject: {},
        editFun: edit,
        getInfo: get,
        uploadUrl: ApiConst.apiPlatformDomain,
        logType: 'platformTruck',
        listUrl: '/truckManagement/list.html',
        listTitle: '车辆列表',
        status: false,
        code: '',
        fields: [],
        isEdit: false, // 控制编辑添加按钮
        editable: true, // 控制页面状态
        btnDisabled: false,
        changeLogParams: {
          code: getParamsFromURL(window.location.search).code,
          size: 10
        },
        loading: true,
        folder: 'platform/truck',
        companyData: [],
        clientDetailColumns: [],
        defaultDetailColumns: [],
        actualDetailColumns: [],
      };
    },
    methods: {
      isShowRobotIcon() {
        const show = JSON.parse(localStorage.getItem('appInfo')).showMatch || true,
          el = this.$refs.form.getElementByField('truckLicenseNo')
        if (show === 'FALSE') {
          this.$set(el.configData, "robot", "FALSE")
        }
      },
      formReady(formData) {
        console.log('formReady', formData);
        this.inputKey = formData.paramData.inputKey;
        this.fields = formData.paramData.field;
        this.isEdit = formData.isEdit;
        this.editable = formData.editable;
        this.code = formData.code;

          this.$nextTick(()=>{
             this.commonLogicTruckModelCode();
          })

        // 根据truckCode获取加入的公司列表
        if (this.domainObject.code) {
          joinCompany({ platformTruckCode: this.domainObject.code }, (success, error) => {
            if (error || success.code !== 200) {
              this.$message({
                type: 'error',
                message: `${error.content}`,
                duration: 3000
              });
              return false;
            }
            if (success) {
              this.companyData = success.content;
            }
          })
        }
      },
      formMounted(form) {
        this.isShowRobotIcon();
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

