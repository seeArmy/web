/**
* add.vue
* Created by cc on 17/12/6.
*/
<template>
  <div>
    <div class="form-page">
      <ele-form :domainObject="domainObject" ref="form"
                :configUrl="configUrl" :listUrl="listUrl" :listTitle="listTitle"
                :getInfo="getInfo" :addFun="addFun" :editFun="editFun"
                :editable="editable" :isEdit="isEdit"
                @formReady="formReady" @formMounted="formMounted" @editSuccess="editSuccess" @beforeSubmit="beforeSubmit" @submitDone="submitDone"
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
          
          <tax-info slot="taxInfo" ref="taxInfo" :domainObject="domainObject" :editable="editable" v-if="showTax"></tax-info>

          <logs slot="tabChangeLog" :selectable="false" :operatable="false"
                :domain="uploadUrl" :type="logType" :code="params.code" :isAdvanced="false"
                :params="changeLogParams" :needPage="true">
          </logs>

        </layout>
      </ele-form>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import layout from './layout.vue';
  import taxInfo from '../components/ele-tax-info/taxInfo.vue';
  import eleBlock from '../components/ele-block/eleBlock.vue';
  import eleForm from '../components/ele-form/eleForm.vue';
  import { add, edit, get } from '../../api/InputInvoiceService';
  import { get as getOrgInfo } from '../../api/PartnerService';
  import { selfs as getSelfInfo } from '../../api/OrgService';

  import logs from '../logs/list.vue';

  import ApiConst from '../../api/ApiConst';
  import { getParamsFromURL } from '../../api/Utils';

  export default {
    components: {
      'ele-form': eleForm,
      'ele-block': eleBlock,
      layout,
      'tax-info': taxInfo,
      logs
    },
    data() {
      return {
        objectName: '进项发票',
        configUrl: `${ApiConst.apiSettleDomain}/detail_render_info/inputVatInvoice/list`,
        domainObject: {},
        addFun: add,
        editFun: edit,
        getInfo: get,
        uploadUrl: ApiConst.apiSettleDomain,
        logType: 'inputVatInvoice',
        listUrl: '/inputInvoice/list.html',
        listTitle: '进项发票列表',
        status: false,
        code: '',
        fields: [],
        isEdit: false, // 控制编辑添加按钮
        editable: true, // 控制页面状态
        btnDisabled: false,
        params: {
          code: getParamsFromURL(window.location.search).code
        },
        changeLogParams: {
          code: getParamsFromURL(window.location.search).code,
          size: 10
        },
        loading: true,
        showTax: false
      };
    },
    methods: {
      formMounted(form) {
        form.getElementByField('billCode').$on('change', (billModel) => {
          const paraObj = {
            // code: billModel.payeeOrgCode
            orgCode: billModel.platformPayeeOrgCode
          };
          getOrgInfo(paraObj, (success, error) => {
            if (error || success.code !== 200) {
              this.$message({
                type: 'error',
                message: error.content,
                duration: 5000
              });
              return false;
            }
            if (success) {
              console.log('partner is', success.content);
              const orgInfo = success.content;
              this.domainObject.payeeOrgTaxNumber = this.domainObject.payeeOrgTaxNumber || orgInfo.taxNumber;
              this.domainObject.payeeOrgAddress = this.domainObject.payeeOrgAddress || orgInfo.address;
              this.domainObject.payeeOrgTelephone = this.domainObject.payeeOrgTelephone || orgInfo.linkmanPhone;
              this.domainObject.payeeOrgBankName = this.domainObject.payeeOrgBankName || orgInfo.bankName;
              this.domainObject.payeeOrgBankAccountNo = this.domainObject.payeeOrgBankAccountNo || orgInfo.bankAccountNo;
            }
          });
        });
        form.getElementByField('payeeOrgCode').$on('change', (model) => {
          console.log('33333',model);
          const paraObj = {
            // code: model.code
            orgCode: model.orgCode
          };
          getOrgInfo(paraObj, (success, error) => {
            if (error || success.code !== 200) {
              this.$message({
                type: 'error',
                message: error.content,
                duration: 5000
              });
              return false;
            }
            if (success) {
              console.log('partner is', success.content);
              const orgInfo = success.content;
              this.domainObject.payeeOrgCode = orgInfo.code;
              this.domainObject.payeeOrgTaxNumber = this.domainObject.payeeOrgTaxNumber || orgInfo.taxNumber;
              this.domainObject.payeeOrgAddress = this.domainObject.payeeOrgAddress || orgInfo.address;
              this.domainObject.payeeOrgTelephone = this.domainObject.payeeOrgTelephone || orgInfo.linkmanPhone;
              this.domainObject.payeeOrgBankName = this.domainObject.payeeOrgBankName || orgInfo.bankName;
              this.domainObject.payeeOrgBankAccountNo = this.domainObject.payeeOrgBankAccountNo || orgInfo.bankAccountNo;
            }
          });
        });
        getSelfInfo((success, error) => {
          // console.log('success and error is', success, error);
          if (error || success.code !== 200) {
            this.$message({
              type: 'error',
              message: error.content,
              duration: 5000
            });
            return false;
          }
          if (success) {
            console.log('self is', success.content);
            const orgInfo = success.content;
            this.domainObject.payerOrgName =this.domainObject.payerOrgName || orgInfo.orgFullName;
            this.domainObject.payerOrgCode =this.domainObject.payerOrgCode || orgInfo.code;
            this.domainObject.payerOrgTaxNumber = this.domainObject.payerOrgTaxNumber || orgInfo.creditCode;
            this.domainObject.payerOrgAddress =this.domainObject.payerOrgAddress || orgInfo.address;
            this.domainObject.payerOrgTelephone =this.domainObject.payerOrgTelephone || orgInfo.linkmanPhone;
            this.domainObject.payerOrgBankName =this.domainObject.payerOrgBankName || orgInfo.bankName;
            this.domainObject.payerOrgBankAccountNo =this.domainObject.payerOrgBankAccountNo || orgInfo.bankAccountNo;
          }
        });
        this.showTax = true;
        // 从应付账单详情带过来的billcode
        if (getParamsFromURL(window.location.search).billCode) {
          form.getElementByField('billCode').$emit('selectCode', { 'code' : getParamsFromURL(window.location.search).billCode });
        }
        // 发票详情页面根据get到的billcode查询账单开票版块信息
        if (this.domainObject.billCode) {
          form.getElementByField('billCode').$emit('selectCode', { 'code' : this.domainObject.billCode });
        }
      },
      formReady(formData) {
        console.log('formReady', formData);
        this.inputKey = formData.paramData.inputKey;
        this.fields = formData.paramData.field;
        this.isEdit = formData.isEdit;
        this.editable = formData.editable;
        this.code = formData.code;
        this.bankAccountCode = this.domainObject.bankAccountCode;
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
      resetForm() {
        this.$refs.form.resetForm();
      },
      editSuccess() {
        this.editable = false;
      },
      beforeSubmit() {
        const extraObj = this.$refs.taxInfo.tableData[0];
        Object.assign(this.domainObject, extraObj);
        console.log('new domainObject is ', this.domainObject);
      },
      submitDone() {
        this.btnDisabled = false;
      }
    }
  };
</script>
