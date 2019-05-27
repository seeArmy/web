<template>
  <div>
    <ele-form :domainObject="domainObject" ref="form" :listUrl="listUrl" :listTitle="listTitle" @formMounted="formMounted" :configUrl="configUrl" :getInfo="getInfo" :addFun="addFun" :editFun="editFun" :editable="editable" :isEdit="isEdit" @formReady="formReady" @editSuccess="editSuccess" @submitDone="submitDone" :objectName="objectName" label-width="100px" :inline="false">
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
        <detailTable ref='detailTable' :domainObject='domainObject' :editable='editable' slot='table'></detailTable>
      </layout>
    </ele-form>
  </div>
</template>
<script type="text/ecmascript-6">
import { urlRedirect } from '../../api/Utils';
import { removeClass } from '../../api/classUtil';
import ApiConst from '../../api/ApiConst';
import { edit, add, get } from '../../api/ChargeItemService';
import layout from './layout.vue';
import detailTable from './table/detailTable.vue'
import eleBlock from '../components/ele-block/eleBlock.vue';
import eleForm from '../components/ele-form/eleForm.vue';

// 引入tab跳转
require('../public.js');

const axios = require('axios');

export default {
  data() {
    return {
      objectName: '费用科目配置',
      domainObject: {},
      uploadUrl: `${ApiConst.apiPlatformDomain}`,
      configUrl: `${ApiConst.apiPlatformDomain}/detail_render_info/chargeItem/list`,
      addFun: add,
      editFun: edit,
      getInfo: get,
      logType: 'chargeItem',
      listUrl: '/chargeItem/list.html',
      listTitle: '费用科目配置列表',
      fields: [],
      isEdit: false, // 控制编辑添加按钮
      editable: false, // 控制页面状态
      loading: true,
      code: '',
      getData: {},
      btnDisabled: false
    };
  },
  components: {
    layout,
    detailTable,
    'ele-form': eleForm,
    'ele-block': eleBlock,
  },
  methods: {
    formMounted(form) {},
    formReady(formData) {
      console.log('formReady', formData);
      this.inputKey = formData.paramData.inputKey;
      this.fields = formData.paramData.field;
      this.isEdit = formData.isEdit;
      this.editable = formData.editable;
      this.code = formData.code;
      if (this.code) {
        formData.paramData.field.forEach((v) => {
          if (v.fieldConfigCode == 'code') {
            v.extraParams[0].readonly = 'readonly';
          }
        });
      }
      // 新建页面默认设置元
      if (!this.isEdit) {
        this.$set(this.domainObject, 'chargeItemAmountsUnitCode', 'yuan');
        this.$set(this.domainObject, 'chargeItemAmountsUnitName', '元');
      }
      if (this.domainObject.code) {
        this.$refs['detailTable'].setData();
      }
      this.dealWithPaymentChannel(this.domainObject.paymentChannel);
    },
    dealWithPaymentChannel(val) {
      if (!this.editable) return;
      let el = this.$refs.form.getElementByField('paymentApproveType');
      if (val == 'none') {
        if (el && el.configData) {
          this.$set(el.configData, 'disabled', true);
          this.domainObject.paymentApproveType = 'none';
        }
      }
      if (val == 'cash') {
        if (el && el.configData) {
          this.$set(el.configData, 'disabled', false);
          if(this.domainObject.paymentApproveType == 'none'){
            this.domainObject.paymentApproveType = '';
          }

          if(el.setValIsControl){
            el.setValIsControl(true,{i:2,v:true})
          }
        }
      }
    },
    editForm() {
      this.editable = true;
      this.$nextTick(()=>{
        this.dealWithPaymentChannel(this.domainObject.paymentChannel)
      })
    },
    cancelEdit() {
      this.$refs.form.resetForm();
      this.editable = false;
    },
    submitForm() {
      if (!this.$refs['detailTable'].checkRules()) return; // 内部校验

      let objData = this.$refs['detailTable'].objData;
      this.domainObject = Object.assign(this.domainObject, objData);
      // 检验 规则
      this.btnDisabled = true;
      this.$refs.form.submitForm();
    },
    editSuccess() {
      this.editable = false;
    },
    submitDone() {
      this.btnDisabled = false;
    },
    isArray(val) {
      if (typeof Array.isArray === 'function') {
        return Array.isArray(val);
      }
      return Object.prototype.toString.call(val) === '[object Array]';
    },
  },
  mounted() {
    this.$watch(`domainObject.paymentChannel`, (val) => {
      this.dealWithPaymentChannel(val);
    })
  }
};

</script>
<style lang="scss" rel="stylesheet/scss">
@import "../assets/sass/base.scss";

.form-page {
  .tableImg {
    width: 146px;
    height: 146px;
    border: solid 1px #c0ccda;
    border-radius: 6px;
  }

  .disabled_custom {
    position: relative;
    opacity:.7;
    &::before {
    position:absolute;
    top:0;
    right:0;
    bottom:0;
    left:0;
    content: '';
    cursor:not-allowed;
    }
  }

}

</style>
