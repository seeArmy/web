/** * add.vue * 询价单报价 */
<template>
  <div>
    <div class="form-page">
      <ele-form :domainObject="domainObject" ref="form" :configUrl="configUrl" :listUrl="listUrl" :listTitle="listTitle" :getInfo="getInfo" :addFun="addFun" :editable="editable" :isEdit="isEdit" @formReady="formReady" @formMounted="formMounted" @editSuccess="editSuccess" @submitDone="submitDone" :objectName="objectName" label-width="100px" :inline="false" :folder="folder">
        <layout :isEdit="isEdit" :editable="editable" :objectName="objectName" :domainObject='domainObject' :clientDetailColumns="clientDetailColumns">
          <div v-for="field in fields" :slot="field.fieldConfigCode">
            <el-form-item :label="field.showName" :required="field.required ==='true'">
              <ele-block :field="field" :domainObject="domainObject" :editable="editable" :uploadUrl="uploadUrl" :inputKey="inputKey"></ele-block>
            </el-form-item>
          </div>
          <el-button v-if="domainObject.rfqStatus && domainObject.rfqStatus==='enquirying' " @click="doQuotedPrice" type="primary" size="large" slot="quotedPrice" :disabled="btnDisabled">{{nameEnquirying}}</el-button>
          <!-- 剩余版块 -->
          <!-- <remnant :remnantObj="remnantObj" slot="remnant"></remnant> -->
          <!-- 报价记录 -->
          <quoteRecord @eventRecord='eventRecord' ref='quoteRecord' slot="tabQuoteRecord" :code="code" :isAdvanced="true" :needPage="true" :domainObject='domainObject' @surplus="surplus">
          </quoteRecord>
        </layout>
      </ele-form>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import layout from './layout.vue';

import eleBlock from '../components/ele-block/eleBlock.vue';
import eleForm from '../components/ele-form/eleForm.vue';
import { add, get } from '../../api/QuoteService';

import { selfs } from '../../api/OrgService';

import remnant from './remnant.vue';
import quoteRecord from './quoteRecord/list.vue';

import ApiConst from '../../api/ApiConst';
import { getParamsFromURL, dateFormat } from '../../api/Utils';


export default {
  components: {
    'ele-form': eleForm,
    'ele-block': eleBlock,
    layout,
    remnant,
    quoteRecord
  },
  computed: {
    nameEnquirying(){
      if(this.pendCount && this.pendCount>0){
        return '再次报价'
      }
      return '立即报价'
    }
  },
  data() {
    return {
      pendCount:0,
      objectName: '询价单报价',
      configUrl: `${ApiConst.apiInquiryDomain}/detail_render_info/inquiry/list`,
      domainObject: {},
      addFun: add,
      // editFun: edit,
      getInfo: get,
      uploadUrl: ApiConst.apiLogisticsDomain,
      logType: 'inquiry',
      listUrl: '/inquiry/list.html',
      listTitle: '发出的询价',
      code: '',
      fields: [],
      isEdit: false, // 控制编辑添加按钮
      editable: true, // 控制页面状态
      btnDisabled: false,
      loading: true,
      folder: '',
      defaultDetailColumns: [],
      actualDetailColumns: [],
      clientDetailColumns: [],
      remnantObj: {
        remnantWeight: 0,
        remnantVolume: 0,
        remnantNumber: 0,
        remnantQuantity: 0
      }
    };
  },
  methods: {
  surplus(acceptObj) {
      this.remnantObj.remnantWeight -= acceptObj.weight;
      this.remnantObj.remnantVolume -= acceptObj.volume;
      this.remnantObj.remnantNumber -= acceptObj.number;
      this.remnantObj.remnantQuantity -= acceptObj.quantity;
    },
    // 抢单报价
    doQuotedPrice() {
       this.$refs.quoteRecord.dialogVisible = true;
      // 一系列检查
      // add(this.domainObject, (success, error) => {
      //   this.btnDisabled = false;
      //   if (error || success.code !== 200) {
      //     this.$message({
      //       type: 'error',
      //       showClose: true,
      //       message: error.content,
      //       duration: 5000
      //     });
      //   }
      //   if (success) {
      //     this.$message({
      //       type: 'success',
      //       showClose: true,
      //       message: '抢单成功',
      //       duration: 5000
      //     });
      //     window.location.reload();
      //   }
      // });
    },
    setDefaultVal() {
      // 默认给托运客户赋值当前组织
      const localStorage = window.localStorage;
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      this.domainObject.clientOrgName = userInfo.orgFullName;
      this.domainObject.clientOrgCode = userInfo.orgCode;
      this.domainObject.platformClientOrgCode = userInfo.orgCode;
      // 报价截止时间显示后一天 
      const dateTomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
        dateFmtText = dateFormat(dateTomorrow, 'yyyy-MM-dd HH-mm-ss');
      this.$set(this.domainObject, 'frqEndTime', dateFmtText);
    },
    formReady(formData) {
      this.inputKey = formData.paramData.inputKey;
      this.fields = formData.paramData.field;
      this.isEdit = formData.isEdit;
      this.editable = formData.editable;
      this.code = formData.code;
      const params = getParamsFromURL(window.location.search),
        self = this;

        // 剩余版块默认等于详情信息中的计划数量
      this.remnantObj.remnantWeight += Number(this.domainObject.goodsWeight) || 0;
      this.remnantObj.remnantWeight += Number(this.domainObject.goodsVolume) || 0;
      this.remnantObj.remnantWeight += Number(this.domainObject.goodsNum) || 0;
      this.remnantObj.remnantWeight += Number(this.domainObject.truckQty) || 0;



      // 订单列表-发布询价
      if (params.logisticsCode) {
        LogisticsService.get({
          code: params.logisticsCode
        }, (success) => {
          if (success) {
            self.$refs.form.dispatchEvent('logisticsCode', 'select', success.content);
          }
        });
      } else if (params.originalCode) { // 复制新建
        // 复制新建 不用 执行 meterageType ton  直接 什么也不执行
        // console.log('复制新建 ...',this.domainObject);
      } else {
        // 新建页面，手动set计量标准为吨
        if (!this.isEdit) {
          this.$set(this.domainObject, 'meterageType', 'item');
          setTimeout(() => {
            this.$set(this.domainObject, 'meterageType', 'ton');
          }, 500)
        }
      }
    },
    formMounted() {
      // 新建页面设置默认值
      if (!this.isEdit) {
        this.setDefaultVal();
      }
    },
    editForm() {
      this.editable = true;
    },
    cancelEdit() {
      this.$refs.form.resetForm();
      this.editable = false;
    },
    submitForm(formName) {
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
    },
    // get record count
    eventRecord(total){
      this.pendCount  = 0;
      if(total && total>0){
        this.pendCount = total;
      }
    }
  },
  mounted() {}
};

</script>
<style lang="scss" rel="stylesheet/scss">


</style>
