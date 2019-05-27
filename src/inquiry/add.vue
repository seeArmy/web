/**
* add.vue
* 发布询价单
*/
<template>
  <div>
    <div class="form-page">
      <ele-form :domainObject="domainObject" ref="form" :configUrl="configUrl" :listUrl="listUrl" :listTitle="listTitle" :getInfo="getInfo" :addFun="addFun" :editFun="editFun" :editable="editable" :isEdit="isEdit" @formReady="formReady" @formMounted="formMounted" @editSuccess="editSuccess" @submitDone="submitDone" :objectName="objectName" label-width="100px" :inline="false" :folder="folder">
        <layout :isEdit="isEdit" :editable="editable" :objectName="objectName" :domainObject='domainObject' :clientDetailColumns="clientDetailColumns">
          <div v-for="field in fields" :slot="field.fieldConfigCode">
            <el-form-item :label="field.showName" :required="field.required ==='true'">
              <ele-block :field="field" :domainObject="domainObject" :editable="editable" :uploadUrl="uploadUrl" :inputKey="inputKey"></ele-block>
            </el-form-item>
          </div>
          <el-button v-show='editable && !isEdit' type="primary" @click="submitForm('form')" size="large" slot="buttonSubmit" :disabled="btnDisabled">提交</el-button>
          <el-button v-show='editable && !isEdit' @click="resetForm()" size="large" slot="buttonReset" :disabled="btnDisabled">重置</el-button>
          <!-- 发布范围 -->
          <assign-publish ref="assignPublish" slot="assignPublish" v-show="showRange" :editable="editable" :orgNameData="orgNameData"></assign-publish>
          <!-- 剩余版块 -->
          <remnant :remnantObj="remnantObj" slot="remnant"></remnant>
          <!-- 报价记录 -->
          <quoteRecord ref='quoteRecord' slot="tabQuoteRecord" :inquiryInfo="domainObject" :code="code" :params="params" :isAdvanced="true" :needPage="true" v-if="status" @surplus="surplus">
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
import { add, get } from '../../api/InquiryService';
import { selfs } from '../../api/OrgService';
import assignPublish from './assignPublish.vue';
import remnant from './remnant.vue';
import quoteRecord from './quoteRecord/list.vue';
import ApiConst from '../../api/ApiConst';
import { getParamsFromURL, dateFormat, dealWithUrlClientDetail, dealWithUrlRouteDetail } from '../../api/Utils';


export default {
  components: {
    'ele-form': eleForm,
    'ele-block': eleBlock,
    layout,
    'assign-publish': assignPublish,
    remnant,
    quoteRecord
  },
  computed: {

  },
  data() {
    return {
      objectName: '发布询价单',
      configUrl: `${ApiConst.apiInquiryDomain}/detail_render_info/inquiry/list`,
      domainObject: {},
      addFun: add,
      editFun: Function,
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
        weight: 0,
        volume: 0,
        number: 0,
        quantity: 0
      },
      params: {
        rfqCode: ''
      },
      status: false,
      showRange: false,
      orgNameData: []
    };
  },
  watch: {
    'domainObject.releaseRange': function(newVal, oldVal) {
      if (newVal === 'designated') {
        console.log('releaseRange change and new value is', newVal);
        this.showRange = true;
      } else {
        console.log('releaseRange change and new value is', newVal);
        this.showRange = false;
      }
    }
  },
  methods: {
    surplus(acceptObj) {

      this.remnantObj.weight = this.domainObject.remainderGoodsWeight;
      this.remnantObj.volume = this.domainObject.remainderGoodsVolume;
      this.remnantObj.number = this.domainObject.remainderGoodsNum;
      this.remnantObj.quantity = this.domainObject.remainderTruckQty;


      // this.remnantObj.weight -= acceptObj.weight;
      // this.remnantObj.volume -= acceptObj.volume;
      // this.remnantObj.number -= acceptObj.number;
      // this.remnantObj.quantity -= acceptObj.quantity;
    },
    setDefaultOrg() {
      // 默认给托运客户赋值当前组织
      const localStorage = window.localStorage;
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      this.domainObject.clientOrgName = userInfo.orgFullName;
      this.domainObject.clientOrgCode = userInfo.orgCode;
      this.domainObject.platformClientOrgCode = userInfo.orgCode;
    },
    setDefaultTime() {
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
      this.params.rfqCode = formData.code;
      this.status = true;
      const params = getParamsFromURL(window.location.search),
        self = this;
      // 剩余版块默认等于详情信息中的计划数量
      // this.remnantObj.weight += Number(this.domainObject.goodsWeight) || 0;
      // this.remnantObj.volume += Number(this.domainObject.goodsVolume) || 0;
      // this.remnantObj.number += Number(this.domainObject.goodsNum) || 0;
      // this.remnantObj.quantity += Number(this.domainObject.truckQty) || 0;


      this.remnantObj.weight = this.domainObject.remainderGoodsWeight;
      this.remnantObj.volume = this.domainObject.remainderGoodsVolume;
      this.remnantObj.number = this.domainObject.remainderGoodsNum;
      this.remnantObj.quantity = this.domainObject.remainderTruckQty;


      // 询价单状态rfqStatus 复制新建的时候，状态改为询价中enquirying
      if (getParamsFromURL(window.location.search).originalCode) {
        this.$set(this.domainObject, 'rfqNo', null);
        this.$set(this.domainObject, 'rfqStatus', 'enquirying');
        // 报价截止时间显示后一天
        const dateTomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
          dateFmtText = dateFormat(dateTomorrow, 'yyyy-MM-dd HH-mm-ss');
        this.$set(this.domainObject, 'frqEndTime', dateFmtText);
      }
      this.orgNameData = this.domainObject.scopes;
      this.dealWithMeterageTypeByOriginalCode();
    },
    formMounted(form) {
      // 新建页面设置默认值
      if (!this.isEdit) {
        this.setDefaultOrg();
        this.setDefaultTime();
      }
    },
    // 处理计量标准 的切换    新建ok 复制新建 也ok
    dealWithMeterageTypeByOriginalCode() {
      let self = this;

      this.$nextTick(()=>{
        let ele_meterageType = self.$refs.form.getElementByField('meterageType');
        ele_meterageType.$emit('change', self.domainObject['meterageType']);
      })

      // setTimeout(function() {
      //   let ele_meterageType = self.$refs.form.getElementByField('meterageType');
      //   ele_meterageType.$emit('change', self.domainObject['meterageType']);
      // }, 1000)
    },
    editForm() {
      this.editable = true;
    },
    cancelEdit() {
      this.$refs.form.resetForm();
      this.editable = false;
    },
    submitForm(formName) {
      // 发布范围
      let codes = [];
      if (this.domainObject.releaseRange === 'designated') {
        this.$refs.assignPublish.selectedData.forEach((val) => {
          codes.push(val.orgCode);
        });
        this.$set(this.domainObject, 'scopes', codes.join(','));
        if (!this.domainObject.scopes) {
          this.$message({
            type: 'warning',
            message: '您当前选择的询价范围是指定发布，请选择至少一个询价对象！',
            duration: 3000
          });
          return false;
        }
      }
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
    // 处理跳转链接 托运客户
    dealWithUrlClientOrgName(orgCode, code) {
      return new Promise((resolve, reject) => {
        getPartnerDetail({ code: code, orgCode: orgCode }, (success, error) => {
          if (success) {
            resolve();
          }
          if (error) {
            reject();
          }
        })
      })
    },
    // 处理跳转链接 线路
    dealWithUrlRouteDetail(routeCode, code) {
      return new Promise((resolve, reject) => {
        getRouteDetail({ code: code, routeCode: routeCode }, (success, error) => {
          if (success) {
            resolve();
          }
          if (error) {
            reject();
          }
        })
      })
    },
    dealWithUrl() {
      let self = this;
      dealWithUrlClientDetail(this.domainObject.platformClientOrgCode, this.domainObject.clientOrgCode).then(() => {
        //蔡成功 就不需要改变
      }).catch(() => {
        // 去掉 链接
        let el = self.$refs.form.getElementByField('clientOrgCode');
        self.$set(el, 'detailUrl', '');
      })
      this.dealWithUrlRouteDetail(null, this.domainObject.routeCode).then(() => {
        //蔡成功 就不需要改变
      }).catch(() => {
        // 去掉 链接
        let el = self.$refs.form.getElementByField('routeCode');
        self.$set(el, 'detailUrl', '');
      })
    },
  },
  mounted() {
    // this.dealWithUrl();
    // 根据来源订单code带出信息
    this.$nextTick(() => {
      const logisticsCode = getParamsFromURL(window.location.search).logisticsCode;
      if (logisticsCode) {
        this.$refs.form.getElementByField('logisticsCode').$emit('selectCode', { code: logisticsCode });
      }
    });
    this.$watch('domainObject.clientOrgName', (val) => {
      if (!val) {
        this.setDefaultOrg();
      }
    });
  }
};

</script>
<style lang="scss" rel="stylesheet/scss">
</style>
