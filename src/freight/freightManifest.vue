<!-- 货源调整弹框 -->
/**
* action.vue
* Created by dsky on 17/7/6.
*/
<template>
  <ele-dialog ref="dialog" id='page_freight_manifest' :title="title" @submit="handleDone" @cancel="handleCancel" class="huaneng_un_loading_input" :isButtonText='true' >
    <!-- 头部数据 -->
    <el-row class='el_header'>
      <el-col :span="8"><span class="el_label">货源号：</span><span class="el_value">{{domainObject.freightNo}}</span></el-col>
      <el-col :span="8"><span class="el_label">客户：</span><span class="el_value">{{domainObject.clientOrgName}}</span></el-col>
      <el-col :span="8"><span class="el_label">状态：</span><span class="el_value"> 
        <el-select v-model="formData.status" placeholder="请输入">
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select></span></el-col>
    </el-row>
    <div class="form-page loading-action">
      <eleManifestList ref='eleManifest' :selectable='true'  :isEdit='isEdit' :editable='true' :getColumn='getColumnManifest' :listData='listDataManifest' :editableFields="editableFields" @query="query" v-if="status">
      </eleManifestList>
    </div>
    <!-- 尾部数据 -->
    <el-row class='el_footer'>
        <el-col :span="8">
          <span class="el_label" >国际货物类型:</span>
          <span class="el_value" >{{cargoTypeClassificationCode}}</span>
        </el-col>
        <el-col :span="8">
          <span class="el_label" >货物名称:</span>
          <span class="el_value" >{{domainObject.goodsName}}</span>
        </el-col>
        <el-col :span="8">
          <span class="el_label" >需求车次:</span>
          <span class="el_value" >
            <el-input
              placeholder="请输入内容"
              v-model="formData.truckQty">
            </el-input>
            </span>车
        </el-col>
      <el-col :span="12">
        <span class="el_label" :class="{'el-required' : isRequired}">客户运价:</span>
        <span class="el_value">
          <el-input
            placeholder="请输入内容"
            v-model="formData.clientFreightPrice">
          </el-input>
          <el-select v-model="formData.clientFreightPriceUnitCode" placeholder="请输入">
            <el-option
              v-for="item in goodsPriceOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </span>
      </el-col>
      <el-col :span="12">
        <span class="el_label" :class="{'el-required' : isRequired}">司机报价类型:</span>
        <span >
          <el-radio :disabled='disabledQuote' v-model="formData.quoteType" label="quote">司机报价</el-radio>
          <el-radio v-model="formData.quoteType" label="price">一口价</el-radio>
        </span>
        <span  v-if="formData.quoteType=='quote'">
          <el-select v-model="formData.quotePriceUnitCode" placeholder="请输入">
            <el-option
              v-for="item in clientFreightPriceOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </span>
        <span  v-else>
          <el-input
            placeholder="请输入报价"
            v-model="formData.quotePrice" style='width:12%'>
          </el-input>
           <el-select v-model="formData.quotePriceUnitCode" placeholder="请输入">
            <el-option
              v-for="item in goodsPriceUnitOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </span>
      </el-col>
      <el-col :span="12">
        <span class="el_label" :class="{'el-required' : isRequired}">客户结算方式:</span>
        <span >
          <el-select v-model="formData.clientSettleMethod" placeholder="请输入">
            <el-option
              v-for="item in clientSettleMethodOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </span>
      </el-col>
      <el-col :span="12">
        <span class="el_label" :class="{'el-required' : isRequired}">司机结算方式:</span>
        <span class="el_value ">
          <el-select v-model="formData.settleMethod" placeholder="请输入">
            <el-option
              v-for="item in SettleMethodOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </span>
      </el-col>
       <el-col :span="24">
        <span class="el_label" style="margin-left: 7px;">运价备注:</span>
        <span class="el_value ">
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="formData.ratesDescription">
          </el-input>
        </span>
      </el-col>
      <el-col :span="24">
        <span class="el_label" :class="{'el-required' : isRequired}">货源有效期:</span>
        <span class="el_value ">
          <el-date-picker
          v-model="formData.freightEndTime"
          type="datetime"
          placeholder="选择日期"
          ></el-date-picker>
        </span>
      </el-col>
    </el-row>
  </ele-dialog>
</template>
<script type="text/ecmascript-6">
import eleBlock from '../components/ele-block/eleBlock.vue';
import ApiConst from '../../api/ApiConst';
import {  executeAction, getColumnManifestSingle,getManifestList,editFreight } from '../../api/FreightService';
import { showMessageUtil,compareTime,dateFormat } from '../../api/Utils';
import eleManifestList from '../components/ele-manifest-list/eleManifestList.vue';
import eleDialog from '../components/ele-dialog/eleDialog.vue';
import { switchOrg } from '../../api/EmployeeService';

const axios = require('axios'),
  waybillUrl = ApiConst.apiWayBillDomain;

function elementConfig(code, action) {
  return axios({
    method: 'get',
    url: `${waybillUrl}/waybill/${code}/action/${action}/render/list`,
    headers: { 'Accept': 'application/json' }
  });
}
export default {
  data() {
    return {
      disabledQuote:false,
      time: '',
      dateFormat: 'yyyy-MM-dd HH:mm:ss',  
      getColumnManifest: getColumnManifestSingle,
      listDataManifest: [],
      attachmentConfig: { field: 'loadingAttachment', controlType: 'file' },
      uploadUrl: ApiConst.apiWayBillDomain,
      fieldTime: '',
      editableFields: ['goodsName','goodsNum','goodsCategory','goodsAmount','goodsWeight','goodsVolume','goodsPrice','goodsLossMethod','description'],
      domainObject: {},
      inputKey: [],
      fields: [],
      loading: true,
      code: '',
      tableData: [],
      copyData: [],
      isEdit: true,
      isAction: false,
      uploadUrl: ApiConst.apiWayBillDomain,
      status: false,
      isRequired: true ,
      actionCodes: ['loading', 'loadingInput', 'unloading', 'unloadingInput'],
      // 将 原来的 收发货时间 存在这边，在点击 提交的时候，需要校验 ，收货时间 小于 发货时间
      tempTime:{'loadingTime':'','unloadingTime':''},
      statusOptions:[{value:'pushling',label:'发布中'},{value:'finished',label:'已结束'}],
      goodsPriceOptions: [{ value: "yuanperton", label: "元/吨" }, { value: "yuanpertruck", label: "元/车"},{ value: "yuanperitem", label: "元/件" },{ value: "yuanpercube", label: "元/方" }],
      clientFreightPriceOptions: [{ value: "yuanperton", label: "元/吨" }, { value: "yuanpertruck", label: "元/车"},{ value: "yuanperitem", label: "元/件" },{ value: "yuanpercube", label: "元/方" }],
      goodsPriceUnitOptions: [{ value: "yuanperton", label: "元/吨" }, { value: "yuanpertruck", label: "元/车"},{ value: "yuanperitem", label: "元/件" },{ value: "yuanpercube", label: "元/方" }],
      clientSettleMethodOptions:[
        { value: "loadingweight",label: "按发货货量" }, 
        { value: "unloadingweight",label: "按收货货量"},
        { value: "smaller",label: "发货与收货两者取小"},
        { value: "bigger",label: "发货与收货两者取大"},
        { value: "trucknumber",label: "按车次"}
      ],
      SettleMethodOptions:[
        { value: "loadingweight",label: "按发货货量" }, 
        { value: "unloadingweight",label: "按收货货量"},
        { value: "smaller",label: "发货与收货两者取小"},
        { value: "bigger",label: "发货与收货两者取大"},
        { value: "trucknumber",label: "按车次"}
      ],
      formData:{
        status:'',
        truckQty:'',
        clientFreightPrice:'',
        clientFreightPriceUnitCode:'',
        quoteType:'',
        quotePrice:'',
        quotePriceUnitCode:'',
        clientSettleMethod:'',
        settleMethod:'',
        ratesDescription:'',
        freightEndTime:'',
      }
      
    };
  },
  props: {
    id: '',
    action: '',
    isDialog: {
      type: Boolean,
      'default': false
    }
  },
  components: {
    'ele-block': eleBlock,
    'ele-dialog': eleDialog,
    eleManifestList,
  },
 computed: {
    cargoTypeClassificationCode() {
      switch(this.domainObject.cargoTypeClassificationCode){
        case '90':
          return '电子产品';
        case '92':
          return '商品汽车';
        case '93':
          return '冷藏货物';  
        case '94':
          return '大宗货物';
        case '95':
          return '快速消费品';
        case '96':
          return '农产品';
        case '999':
          return '其他';        
      }
    }
  },
  methods: {
    open(model, action, actionName) {
      // 初始化
      Object.keys(this.domainObject).forEach((key) => {
        this.$set(this.domainObject, key, null);
      });

      const initKeys = ['code', 'freightNo', 'clientOrgName', 'status', 'cargoTypeClassificationCode', 'goodsName','truckQty','clientFreightPrice','clientFreightPriceUnitCode','quoteType','quotePrice','goodsPriceUnitCode','clientSettleMethod','freightEndTime','ratesDescription','settleMethod','quotePriceUnitCode','dispatchMode'];
      initKeys.forEach((v) => {
        this.$set(this.domainObject, v, model[v]);
      });
      this.formData.quoteType = this.domainObject.quoteType;
      this.formData.truckQty = this.domainObject.truckQty;
      this.formData.clientFreightPrice = this.domainObject.clientFreightPrice;
      this.formData.clientFreightPriceUnitCode = this.domainObject.clientFreightPriceUnitCode;
      this.formData.quotePrice = this.domainObject.quotePrice;
      this.formData.quotePriceUnitCode = this.domainObject.quotePriceUnitCode;
      // this.goodsPriceUnitCode = this.domainObject.goodsPriceUnitCode;
      this.formData.clientSettleMethod = this.domainObject.clientSettleMethod;
      this.formData.settleMethod = this.domainObject.settleMethod;
      this.formData.ratesDescription = this.domainObject.ratesDescription;
      this.formData.freightEndTime = this.domainObject.freightEndTime;

      this.formData.status = this.domainObject.status;
      this.title = actionName;
      this.waybill = model;
      this.smallTicket = '';
      if (model.waybillExternalNo1) {
        this.smallTicket = model.waybillExternalNo1;
      }

      this.status = true;
      this.$nextTick(()=>{
          this.$refs.dialog.open();
           this.disabledQuote = 'auto' == model.dispatchMode ? true : false;
      });
    },
    valid() {
      let result = true;
      if(!this.formData.clientFreightPrice || !this.formData.clientFreightPriceUnitCode){
          this.$message({
            type: 'warning',
            message: `请填写客户运价！`,
            duration: 3000
          });
          return false;
      }
      
      if(!this.formData.clientSettleMethod){
          this.$message({
            type: 'warning',
            message: `请选择客户结算方式！`,
            duration: 3000
          });
          return false;
      }
      if(!this.formData.settleMethod){
          this.$message({
            type: 'warning',
            message: `请选择司机结算方式！`,
            duration: 3000
          });
          return false;
      }
      if(!this.formData.freightEndTime){
          this.$message({
            type: 'warning',
            message: `请填写货源有效期！`,
            duration: 3000
          });
          return false;
      }
      if(this.formData.quoteType == 'price'){
        if(!this.formData.quotePrice || !this.formData.quotePriceUnitCode){
          this.$message({
            type: 'warning',
            message: `请填写司机报价！`,
            duration: 3000
          });
          return false;
        }  
      }else{
        if(!this.formData.quotePriceUnitCode){
          this.$message({
            type: 'warning',
            message: `请填写司机报价！`,
            duration: 3000
          });
          return false;
        } 
      }
      return result;
    },
    // 时间的校验，货源有效期大于当前时间
    checkTime(){
      let result = true;

        let timeNow = new Date(); 
        if ('<' === compareTime(this.formData.freightEndTime, timeNow)){
          result = false;
          showMessageUtil('warning', '货源有效期小于当前时间', 2000);
        }
      return result;
    },
    // 货源调整中 数量 重量 体积调整必填不必填根据 计量标准单位来校验
    checkMeterageType(){
      let flag = true,
      msg = '';
      if(this.listDataManifest.length>0){
       let  meterageType = this.listDataManifest[0].meterageType;
        if(!meterageType) flag = false;
        if(meterageType == 'ton'){
          this.listDataManifest.forEach(item=>{
            if(!item.goodsWeight) {
              flag = false;
              msg = '重量'
            }
            if(!item.goodsPrice || !item.goodsPriceUnitCode) {
              flag = false;
              msg = '货物单价'
            }
          })
        }else if(meterageType == 'item'){
          this.listDataManifest.forEach(item=>{
            if(!item.goodsNum){
              flag = false;
              msg = '数量'
            } 
            if(!item.goodsPrice || !item.goodsPriceUnitCode) {
              flag = false;
              msg = '货物单价'
            }
          })
        }else if(meterageType == 'cube'){
          this.listDataManifest.forEach(item=>{
            if(!item.goodsVolume) {
              flag = false;
              msg = '体积';
            }
            if(!item.goodsPrice || !item.goodsPriceUnitCode) {
              flag = false;
              msg = '货物单价'
            }
          })
        }
        if(!flag){
          showMessageUtil('warning', `请填写${msg}`, 2000);
        }
      }
      return flag;
    },
    syncOptionsByMeterageType(meterageType){
      if('ton' == meterageType){
        //客户运价
       let ops = [{ value: "yuanperton", label: "元/吨" }, { value: "yuanpertruck", label: "元/车"}];
        this.goodsPriceOptions = ops;
        this.clientFreightPriceOptions = ops;
        this.goodsPriceUnitOptions = ops;

      }else if('item' == meterageType){
         let ops = [{ value: "yuanperitem", label: "元/件" }, { value: "yuanpertruck", label: "元/车"}];
        this.goodsPriceOptions = ops;
        this.clientFreightPriceOptions = ops;
        this.goodsPriceUnitOptions = ops;

      }else if('cube' == meterageType){
        let ops =  [{ value: "yuanpercube", label: "元/方" }, { value: "yuanpertruck", label: "元/车"}];
        this.goodsPriceOptions = ops;
        this.clientFreightPriceOptions = ops;
        this.goodsPriceUnitOptions = ops;
      }
    },
    // 每次都检查 计量标准 
    syncMeterageType() {
      let self = this;
      let meterageType = null,
        mode = 'multiple';
      if ('single' === mode) {
        // 取第一个
        let list0 = this.listDataManifest[0];
        meterageType = list0['meterageType'];
      }
      if ('multiple' === mode) {
        //多个的时候 去拿 数据
        let list0 = this.listDataManifest[0];
        meterageType = list0['meterageType'];
      }
      // 客户运价 + 司机运价 根据 计量标准 改变 options
      self.syncOptionsByMeterageType(meterageType);

      this.listDataManifest.forEach((list, index) => {
        const refName = `tr${index}`,
          complexEl = self.$refs['eleManifest'].$refs[refName];
        if (complexEl && complexEl.length > 0) {
          let listCh = complexEl[0].$children;
          let child = null;
          for (let i = 0; i < listCh.length; i++) {
            let item = listCh[i];
            if (item.field && item.field.fieldConfigCode && item.field.fieldConfigCode === 'goodsPrice') {
              child = item;
              break;
            }
          }
          if (child) {
            // 每一行 都按照 自己的
            let meterageTypeIndex = list['meterageType'];
            // let list0 = this.listDataManifest[0];
            // meterageType = list0['meterageType'];
            child.$children[1].$children[0].onRefresh({ codeUnitType: meterageTypeIndex });
          }

          // 当合理货差系数 是按量的时候 执行 计量标准
          if (list.goodsLossMethod === 'goods.loss') {
            let childLoss = null;
            for (let i = 0; i < listCh.length; i++) {
              let item = listCh[i];
              if (item.field && item.field.fieldConfigCode && item.field.fieldConfigCode === 'freightLoss') {
                childLoss = item;
                break;
              }
            }
            if (childLoss) {
              let meterageTypeIndex = list['meterageType'];
              childLoss.$children[0].onRefrshSelect({ codeUnitType: meterageTypeIndex });
            }
          }
        }
      })
    },
    handleDone() { 
      // 检验时间
      if(!this.checkTime()){
        return;
      }
      if(!this.checkMeterageType()){
        return;
      }
      if (!this.valid()) {
        // this.$message({
        //   type: 'warning',
        //   message: '请输入完整的信息',
        //   duration: 3000
        // });
        console.log('valid failed please check the form and make sure that all the required fields were filled correctly');
        return false;
      } else {
        const self = this,
        h = this.$createElement;
        this.$msgbox({
          title: '消息',
          message: h('p', null, [
            h('span', null, '确认提交吗？ ')
          ]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '执行中...';
              this.netSubmitManifestFinal(instance,done,(success,error)=>{
                if (success) {
                  self.submitCallback(instance, done, success, null);
                }
                if(error){
                  self.submitCallback(instance, done, null, error);
                }
              })
            } else {
              done();
            }
          }
        }).then(() => {});
      }
    },
    submitCallback(instance, done, success, error) {
      if (success) {
        this.$message({
          type: 'success',
          message: '提交成功',
          duration: 1000
        });
        instance.confirmButtonLoading = false;
        done();
        if (!this.isDialog) {
          // this.resetForm(formName);
        }
        this.$emit('success');
        this.refresh();
      }
      if (error) {
        this.$message({
          type: 'error',
          message: `${error.content}`,
          duration: 3000
        });
        instance.confirmButtonLoading = false;
        instance.confirmButtonText = '确定';
        done();
        console.error(error);
        this.$emit('fail');
        this.refresh();
      }
    },
    handleCancel() {
      this.$refs.dialog.close();
    },
    refresh() {
      this.$refs.dialog.close();
      this.$emit('refresh', this);
    },
    netSubmitManifestFinal(instance, done, callback){ 
      this.formData.code = this.domainObject.code;
      this.formData.freightEndTime = dateFormat(this.formData.freightEndTime);
      let domainObject = JSON.parse(JSON.stringify(this.formData));
      editFreight(domainObject,this.listDataManifest,(success,error)=>{
        if (success) {
          callback(success,error);
        }
        if (error) { 
          showMessageUtil('warning', error.content, 2000) ;
            instance.confirmButtonLoading = false;
            instance.confirmButtonText = '确定';
            done();
        };
      })
    },

    // 网络请求：获取货单信息
    netGetManifestList() {
      let code = this.domainObject.code;
      if (!code) { return; }
      getManifestList({ code: code }, (success, error) => {
        if (success && success.content) {
          const data = success.content;
          this.listDataManifest = data;
          this.$nextTick(()=>{
            this.syncMeterageType();
          })
        }
        if (error) { showMessageUtil('warning', error.content, 2000) };
      })
    },
    query() {
      this.netGetManifestList();
    },
  },
  mounted() {
    //更改弹框提交文字
    let buttonText = document.querySelector('.el-button el-button--primary');
    buttonText.innerHTML = '保存';
  },
  created() {
    let buttonText = document.querySelector('.el-button el-button--primary');
    buttonText.innerHTML = '保存';
  }
};

</script>
<style lang="scss" rel="stylesheet/scss">
@import "../assets/sass/base.scss";

#page_freight_manifest {
    .el-dialog--large {
      width: 80%;
    }
    .el-date-editor.el-input {
      width: 193px !important;
    }
    .el-required::before {
      content: '*';
      display: inline-block;
      margin-right: 3px;
      color: #f00;
    }
 
  
}

#page_freight_manifest {
.el-col{
    margin: 3px 0;
  }
.el-dialog__body{
  max-height:100%;
}
.el-dialog__body .complex-control-2 .innerblock{
        width: auto;
}
  .el_header {
    background-color: #E4E4E4;
    height: 54px;
    padding-top: 20px;
    margin-bottom: 2px;
    padding-left: 15px;
    

    .el_label {
      display: inline-block;
      width: auto;
    }
  }
  .el_footer_head{
    margin-bottom: 20px;
  }
  .el-textarea{
    vertical-align: middle !important;
  }
  .el_footer {
    background-color: #E4E4E4;
    height: auto;
    padding-top: 18px;
    // margin-top: 2px;
    padding-left: 15px;
    padding-bottom: 15px;
    .file {
      position: relative;
      top: -14px;
      .el-upload.el-upload--picture-card,
      .el-upload-list--picture-card .el-upload-list__item,
      .imgShow img {
        width: 60px;
        height: 60px;
        line-height: 60px;
      }

      .el-upload-list__item-actions {
        font-size: 18px;
      }

      .el-upload-list__item-delete {
        margin-left: 5px;
      }

      .el-upload-list--picture-card .el-upload-list__item-status-label {
        right: -18px;
        i {
          position: relative;
          margin-top: 0;
          left: -2px;
          top: -10px;
        }
      }

      .el-upload--picture-card i {
        font-size: 18px;
      }

      .el-dialog__header {
        border-bottom: none;
      }
    }

    .el-input {
      width: auto;
    }

    .el_value {
      display: inline-block;
      width: auto;
    }
    .el_label {
      display: inline-block;
      width: auto;
      // vertical-align: top;
      margin-top: 5px;
    }
  }
}



.el-icon-plus,
.el-icon-minus {
  cursor: pointer;
}

.el-table {
  .el-input {
    width: 100px;
    margin-right: 5px;
  }
}

.waybill-action .el-col-12 {
  height: auto !important;
}

</style>
