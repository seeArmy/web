/** * add.vue * Created by cc on 17/8/10. */
<template>
  <div>
    <div class="form-page">
      <ele-form :domainObject="domainObject" ref="form" :configUrl="configUrl" :listUrl="listUrl" :listTitle="listTitle" :getInfo="getInfo" :addFun="addFun" :editFun="editFun" :editable="editable" :isEdit="isEdit" @formReady="formReady" @formMounted="formMounted" @editSuccess="editSuccess" @submitDone="submitDone" :objectName="objectName" label-width="100px" :inline="false">
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

import * as uploadWaybillService from '../../api/uploadWaybillService';

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
      objectName: '上报运单',
      configUrl: `${ApiConst.apiWayBillDomain}/detail_render_info/uploadWaybillPlatform/list`,
      domainObject: {},
      addFun: uploadWaybillService.add,
      editFun: uploadWaybillService.edit,
      getInfo: uploadWaybillService.get,
      uploadUrl: ApiConst.apiWayBillDomain,
      logType: 'waybill',
      listUrl: '/uploadWaybill/list.html',
      listTitle: '运单列表',
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
      console.log('formReady', formData);
      this.inputKey = formData.paramData.inputKey;
      this.fields = formData.paramData.field;
      this.isEdit = formData.isEdit;
      this.editable = formData.editable;
      this.code = formData.code;
      const params = utils.getParamsFromURL(window.location.search);

      // shanghai  必填
      const appInfo = JSON.parse(localStorage.getItem('appInfo'));
      if (appInfo.reportLocation == 'shanghai') {
        const listKey = ['owner', 'consignor', 'consignee', 'nameOfPerson', 'telephonNumber', 'vehiclePermitNumber', 'qualificationCertificateNumber', 'placeOfLoading', 'goodsReceiptPlace'];
        formData.paramData.field.forEach((v) => {
          let keyFind = listKey.find(item => item == v.fieldConfigCode);
          if (keyFind) {
            v.required = 'true';
            v.extraParams.forEach((ex) => {
              ex.required = 'true';
            });
          }
        });
      }
    },
    formMounted() {
      // shanghai  必填
      // const appInfo = JSON.parse(localStorage.getItem('appInfo'));
      // if (appInfo.reportLocation == 'shanghai') {
      //   const listKey = ['owner', 'consignor', 'consignee', 'trailerVehiclePlateNumber', 'nameOfPerson', 'telephonNumber', 'vehiclePermitNumber', 'qualificationCertificateNumber', 'placeOfLoading', 'goodsReceiptPlace'];
      //   listKey.forEach((key) => {
      //     let dom = this.$refs.form.getElementByField(key).$parent;
      //     console.log('dom=====================', dom);
      //     this.$set(dom.field, 'required', 'true');
      //     console.log('dom.field=====================', dom.field);
      //     dom.initValRules();
      //   });
      // }
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
  },
  mounted() {

  }
};

</script>
