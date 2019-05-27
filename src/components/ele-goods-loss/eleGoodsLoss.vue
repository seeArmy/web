/**
* eleQuote.vue
* Created by
*/
<template>
  <!-- 合理货差系数 -->
  <div>
    <!-- {{domainObject[selectkey]}} -->
   <div class="innerblock selectGood">

    <ele-radio :editable="editable" :configData="radioData" :domainObject="domainObject" @change="changeHandle" :rules="radioDataRule"></ele-radio>

    <ele-input :editable="editable" :configData="inputData" :domainObject="domainObject" :rules="inputDataRule"></ele-input>

    <!-- <ele-select ref="select" :editable="editable" :configData="autoData" :domainObject="domainObject" :rules="autoDataRule"></ele-select> -->

    <el-form-item :prop="selectkey" :rules="autoDataRule" v-if="editable">
     <el-select
     v-if="!isList && editable"
     :disabled="autoData.readonly === 'TRUE'"
     v-model="domainObject[selectkey]"
     @change="handleSelect"
     ref="select"
     placeholder="请选择">
     <el-option
     v-for="item in selectData"
     :key="item.id"
     :label="item.value"
     :value="item.id">
     <span style="float: left">{{ item.label }}</span>
     <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
   </el-option>
 </el-select>

</el-form-item>


<!-- <span v-if="editable === false">{{text}}</span> -->
<span v-if="editable === false">{{text}}</span>
</div>
</div>
</template>

<script type="text/ecmascript-6">

import { dealInputKey } from '../../../api/Utils';


import eleRadio from '../ele-radio/eleRadio.vue';
import eleInput from '../ele-input/eleInput.vue';
import eleSelect from '../ele-select/eleSelect.vue';
import * as DataSourceService from '../../../api/DataSourceService';
export default {
  name: 'eleGood',
  inject: ['eventBus'],
  data() {
    return {
      radioData: {},
      inputData: {},
      autoData: {},
      isQuote: true,
      text: '',
      radioDataRule: [],
      inputDataRule: [],
      autoDataRule: [],
      selectkey:'goodsLossUnitCode',
      selectData:[],
      codeUnitType:"",
      text: '',
      rules:[]
    };
  },
  props: {
    isList: Boolean,
    quoteData: Array,
    // 是否可以编辑
    editable: {
      type: Boolean,
      'default': true
    },
    domainObject: Object
  },
  components: {
    'ele-radio': eleRadio,
    'ele-input': eleInput,
    'ele-select': eleSelect
  },
  watch:{
    selectData(curVal,oldVal){
      const self = this;
      curVal.forEach(function (item) {
        if(self.domainObject[self.selectkey] == item.id) self.text = item.value;
      })
    }
  },
  created() {
      const validate = (rule, value, callback) => {
        if (this.inputData.checkRule && value) {
          if (new RegExp(`^${this.inputData.checkRule}$`).test(value)) {
            callback();
          } else {
            callback(new Error(this.inputData.checkMsg || ''));
          }
        } else {
          callback();
        }
      };
      // 拿到参数 ...  分别是 radio input
      this.radioData = this.quoteData[0];
      this.inputData = this.quoteData[1];
      this.autoData = this.quoteData[2];
      // console.log('goodsLoss111111111', this.quoteData);
      // console.log('this.radioData 222222222', this.radioData);
      // console.log('this.inputData 333333333', this.inputData);
      // console.log('this.autoData  444444444', this.autoData);
      if (!this.isList) {
        if (this.radioData.required === 'true') {
          this.radioDataRule.push({required: true, trigger: 'change', message: '不能为空'});
        }
        if (this.inputData.required === 'true') {
          this.inputDataRule.push({required: true, trigger: 'blur', message: '不能为空'});
        }
        // 合理货差系数新增正则匹配校验
        this.inputDataRule.push({validator: validate, trigger: 'blur'});

        if (this.autoData.required === 'true') {
          this.autoDataRule.push({required: true, trigger: 'change', message: '不能为空'});
        }
         // 如果 中间的 input 有值，那么就需要验证  goodsLoss
         if(this.domainObject &&　this.domainObject.goodsLoss　&&　this.domainObject.goodsLoss.length>0){
            this.autoDataRule.push({required: true, trigger: 'change', message: '不能为空'});
          }
      };

      this.selectkey = this.autoData.field;  // 此处为 goodsLossUnitCode
      this.changeHandle(this.domainObject.goodsLossMethod,true);
      const self = this;

      this.selectData.forEach(function (item) {
        if(self.domainObject[self.selectkey] == item.id) self.text = item.value;
      })

      // 监听外界的事件 radio change 事件
     //  this.eventBus.$on('radioChanged',(type,val)=>{
     //    if(type == 'meterageType') {
     //      this.codeUnitType = val;
     //      this.changeHandle(this.domainObject.goodsLossMethod,true);
     //    }
     // });
      // 注册事件，在eventBus 里面注册自己，后面 发事件的时候才会接收得到
      if (!this.isList) {
        if (this.eventBus) {
          this.eventBus.$emit('eleCreated', this, this.autoData.field);
          console.log('eleCreated ...autoData',this.autoData);
        }
      }
      this.$on('refresh', this.refreshDate);
       if (this.autoData.inputKey) {
          dealInputKey(this.autoData.inputKey, (inputFieldKey, outData) => {

             this.$set(self.domainObject, this.selectkey, outData[inputFieldKey]);

            // this.domainObject[this.autoData.field] = outData[inputFieldKey];
            console.log('dealInputKey finished ...',JSON.stringify(this.domainObject),this.autoData.field, outData);
          });
        }
    },
    mounted(){
      if (!this.isList) {
        if (this.eventBus) {
          this.eventBus.$emit('eleMounted', this);
        }
      }
      // console.log('数据为====',this.domainObject,this.selectData);

      // this.$on('refresh', this.showMsg);
    },
    methods: {
      init(){
        this.$watch(`domainObject.goodsLoss`, (val) => {
         if(val && val.length>0){
          this.autoDataRule.push({required: true, trigger: 'change', message: '不能为空'});
         }
         else {
           if (this.autoData.required === 'true') return;
           this.autoDataRule = [];
         }
        });
      },
      refreshDate(){
       this.codeUnitType = this.domainObject.meterageType;
       this.changeHandle(this.domainObject.goodsLossMethod,true);
     },
     showMsg(){

     },
      // 获取 radio 的 optionsValue 的array
      getRadioText() {
        let modelValue = this.domainObject[this.radioData.field];
        if (modelValue !== null && typeof modelValue !== 'undefined' && this.radioData.optionsValue) {
          modelValue = modelValue.toString();
          for (let i = 0, len = this.radioData.optionsValue.length; i < len; i += 1) {
            if (modelValue === this.radioData.optionsValue[i].toString()) {
              modelValue = this.radioData.options[i];
              break;
            }
          }
        }
        return modelValue;
      },
      getInputText() {
        return this.domainObject[this.inputData.field];
      },
      getSelectText() {
        return this.$refs.select.getText();
      },
      handleSelect(item){
        console.log('item===',item);
        const self = this;
        this.selectData.forEach(function (val_data) {
          if(val_data.id == item) self.text = val_data.value;
          console.log('text===',self.text);
        });
      },
      // 切换 radio 之后 需要判断 后面的 select 是否需要改变
      checkoutChangeGoodsLossUnitCode(){
        // 如果 select 的值存在，需要检查 在 selectData 里面是否存在？
        if(this.domainObject.goodsLossUnitCode){
          let exist = false;
          let item =   this.domainObject.goodsLossUnitCode;
          this.selectData.forEach(function (val_data) {
            if(val_data.id == item) exist = true;
          });
          if(!exist) this.domainObject.goodsLossUnitCode = '';
        }
      },
      setDefultSelectData(){
        if(this.selectData.length ==1){   //如果只有一个选项的时候
           this.domainObject.goodsLossUnitCode = this.selectData[0].id;
        }
      },
      changeHandle(val,isFirst) {
        // 1. 增
          // if(!isFirst) this.domainObject.goodsLossUnitCode = '';
          if (val === 'goods.loss.ration') {  // 按系数  percent
             DataSourceService.goodsLossRation.getData({ codeUnitType: this.codeUnitType  }, (dataSource) => {  // percent
              this.selectData = dataSource;
              this.setDefultSelectData();
              this.checkoutChangeGoodsLossUnitCode();
            });
             // this.domainObject.goodsLossUnitCode = 'percent';
          } else {    // ton
              DataSourceService.goodsLoss.getData({ codeUnitType:this.codeUnitType  }, (dataSource) => {  // ton

                this.selectData = dataSource;
                // console.log('selectData ...',this.selectData);
                // console.log('dataSource ...',dataSource);
                this.setDefultSelectData();
                this.checkoutChangeGoodsLossUnitCode();
              // this.domainObject.goodsLossUnitCode = 'ton';
            });
            }
          // 配置 text
          const self = this;
          this.selectData.forEach(function (item) {
            if(self.domainObject[self.selectkey] == item.id) self.text = item.value;
          })
          // console.log("text ====",this.text);
        }
      }
    };
    </script>

    <style lang="scss" rel="stylesheet/scss">
    .selectGood {
      .el-form-item {
        display: inline-block;
      }
      .block {
        display: inline-block;
        margin-left: 6px;
      }
      .el-input {
        // width: 90px !important;
      }
    }
    </style>
