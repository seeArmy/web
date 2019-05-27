<template>
  <div class="fix-table-wrap detail_table">
    <table class="rl-fix-table table-bordered">
      <thead>
        <tr>
          <th class="fix-hd fix-col">变量</th>
          <th class="fix-hd fix-col">来源方式</th>
          <th class="fix-hd fix-col">数据计算（固定值/公式）</th>
          <th class="fix-hd fix-col">单位</th>
          <th class="fix-hd fix-col">精度控制</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th class="fix-col">数量</th>
          <th class="fix-col">
            <com-select :editable="editable" :configData="formData.chargeItemNumberResource.configData" :domainObject="objData" :selectData='selectData1'></com-select>
          </th>
          <th class="fix-col">
            <com-input :editable="editable" v-if=' objData.chargeItemNumberResource == "fixed" ' :configData="formData.chargeItemNumberExpression.configData" :domainObject="objData"></com-input>
          </th>
          <th class="fix-col">
            <com-select v-if=' objData.chargeItemNumberResource == "fixed" || objData.chargeItemNumberResource == "input" ' :editable="editable" :configData="formData.chargeItemNumberUnitCode.configData" :domainObject="objData" :selectData='selectData3'></com-select>
          </th>
          <th class="fix-col"></th>
        </tr>
        <tr>
          <th class="fix-col">单价</th>
          <th class="fix-col">
            <com-select :editable="editable" :configData="formData.chargeItemPriceResource.configData" :domainObject="objData" :selectData='selectData1'></com-select>
          </th>
          <th class="fix-col">
            <com-input v-if=' objData.chargeItemPriceResource == "fixed" ' :editable="editable" :configData="formData.chargeItemPriceExpression.configData" :domainObject="objData"></com-input>
          </th>
          <th class="fix-col">
            <com-select v-if=' objData.chargeItemPriceResource == "fixed" || objData.chargeItemPriceResource == "input" ' :editable="editable" :configData="formData.chargeItemPriceUnitCode.configData" :domainObject="objData" :selectData='selectData4'></com-select>
          </th>
          <th class="fix-col"></th>
        </tr>
        <tr>
          <th class="fix-col">金额</th>
          <th class="fix-col">
            <com-select :editable="editable" :configData="formData.chargeItemAmountsResource.configData" :domainObject="objData" :selectData='selectData2'></com-select>
          </th>
          <th class="fix-col">
            <com-input v-if=' objData.chargeItemAmountsResource == "fixed" ' :editable="editable" :configData="formData.chargeItemAmountsExpression.configData" :domainObject="objData"></com-input>
          </th>
          <th class="fix-col">
            <com-select 
            v-if=' objData.chargeItemAmountsResource == "fixed" || objData.chargeItemAmountsResource == "input" || objData.chargeItemAmountsResource == "standard" '
            :editable="editable" :configData="formData.chargeItemAmountsUnitCode.configData" :domainObject="objData" :selectData='selectData5'></com-select>
          </th>
          <th class="fix-col">
            <!-- 直接输入 -->
            <template v-if='objData.chargeItemAmountsResource == "input" '>
              支持输入位<com-select :editable="editable" :configData="formData.chargeItemAmountsPrecision.configData" :domainObject="objData" :selectData='selectData6'></com-select>小数
            </template>
            <template v-if=' objData.chargeItemAmountsResource == "standard" '>
              <com-select :editable="editable" :configData="formData.chargeItemAmountsRule.configData" :domainObject="objData" :selectData='selectData7'></com-select>
              <com-select :editable="editable" :configData="formData.chargeItemAmountsPrecision.configData" :domainObject="objData" :selectData='selectData6'></com-select>小数
            </template>
          </th>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script type="text/ecmascript-6">
import comSelect from './comSelect.vue'/* */
import comInput from './comInput.vue'
import { showMessageUtil } from '../../../api/Utils';
export default {
  components: {
    'com-select': comSelect,
    'com-input': comInput
  },
  props: {
    domainObject: {
      type: Object,
      'default': function() {}
    },
    editable: {
      type: Boolean,
      'default': true
    }
  },
  watch: {
    'objData.chargeItemNumberResource': {
      handler(newVal, oldVal) {
        if (newVal == 'none') {
          // this.objData.chargeItemNumberExpression = '';
          // this.objData.chargeItemNumberUnitCode = '';
          // this.objData.chargeItemNumberUnitName = '';
          const pre = 'Number',keys = ['Expression','UnitCode','UnitName'];
          this.resetItems(pre,keys)
        }
        if (newVal == 'input') {
          // this.objData.chargeItemNumberExpression = '';
          const pre = 'Number',keys = ['Expression'];
          this.resetItems(pre,keys)
        }
      }
    },
    'objData.chargeItemPriceResource': {
      handler(newVal, oldVal) {
        if (newVal == 'none') {
          // this.objData.chargeItemPriceExpression = '';
          // this.objData.chargeItemPriceUnitCode = '';
          // this.objData.chargeItemPriceUnitName = '';
          const pre = 'Price',keys = ['Expression','UnitCode','UnitName'];
          this.resetItems(pre,keys)
        }
        if (newVal == 'input') {
          // this.objData.chargeItemPriceExpression = '';
          const pre = 'Price',keys = ['Expression'];
          this.resetItems(pre,keys)
        }
      }
    },
    'objData.chargeItemAmountsResource': {
      handler(newVal, oldVal) {
        if (newVal == 'none') {
          // this.objData.chargeItemAmountsExpression = '';
          // this.objData.chargeItemAmountsUnitCode = '';
          // this.objData.chargeItemAmountsUnitName = '';
          // this.objData.chargeItemAmountsPrecision = '';
          // this.objData.chargeItemAmountsRule = '';

          const pre = 'Amounts',keys = ['Expression','UnitCode','UnitName','Precision','Rule'];
          this.resetItems(pre,keys)

        }
        if (newVal == 'input') {
          // this.objData.chargeItemAmountsExpression = '';
          // this.objData.chargeItemAmountsPrecision = '';
          // this.objData.chargeItemAmountsRule = '';

          // const pre = 'Amounts',keys = ['Expression','Precision','Rule'];
          const pre = 'Amounts',keys = ['Expression','Rule'];
          this.resetItems(pre,keys)
        }
        if (newVal == 'fixed') {
          // this.objData.chargeItemAmountsPrecision = '';
          // this.objData.chargeItemAmountsRule = '';

          const pre = 'Amounts',keys = ['Precision','Rule'];
          this.resetItems(pre,keys)
        }
        if (newVal == 'standard') {
          // this.objData.chargeItemAmountsExpression = '';
          const pre = 'Amounts',keys = ['Expression'];
          this.resetItems(pre,keys)
        }
      }
    }
  },
  data() {
    return {
      objData: {
        chargeItemNumberResource: '',
        chargeItemNumberExpression: '',
        chargeItemNumberUnitCode: '',
        chargeItemNumberUnitName: '',

        chargeItemPriceResource: '',
        chargeItemPriceExpression: '',
        chargeItemPriceUnitCode: '',
        chargeItemPriceUnitName: '',

        chargeItemAmountsResource: '',
        chargeItemAmountsExpression: '',
        chargeItemAmountsUnitCode: '',
        chargeItemAmountsUnitName: '',
        chargeItemAmountsPrecision: '',
        chargeItemAmountsRule: ''

      },
      selectData1: [{ id: 'none', value: '无', label: '无' }, { id: 'input', value: '直接输入', label: '直接输入' }, { id: 'fixed', value: '固定值', label: '固定值' }],
      selectData2: [{ id: 'input', value: '直接输入', label: '直接输入' }, { id: 'fixed', value: '固定值', label: '固定值' }, { id: 'standard', value: '数量*单价', label: '数量*单价' }],

      selectData3: [{ id: 'item', value: '件', label: '件' }, { id: 'litre', value: '升', label: '升' }, { id: 'kg', value: '千克', label: '千克' }, { id: 'ton', value: '吨', label: '吨' }, { id: 'km', value: '公里', label: '公里' }],

      selectData4: [{ id: 'yuanperitem', value: '元/件', label: '元/件' }, { id: 'yuanperlitre', value: '元/升', label: '元/升' }, { id: 'yuanperkg', value: '元/千克', label: '元/千克' }, { id: 'yuanperton', value: '元/吨', label: '元/吨' }, { id: 'yuanperkm', value: '元/公里', label: '元/公里' }],

      selectData5: [{ id: 'yuan', value: '元', label: '元' }],
      selectData6: [{ id: '0', value: '0', label: '0' }, { id: '1', value: '1', label: '1' }, { id: '2', value: '2', label: '2' }],
      selectData7: [{ id: 'up', value: '向上取整', label: '向上取整' }, { id: 'down', value: '向下取整', label: '向下取整' }, { id: 'halfup', value: '四舍五入', label: '四舍五入' }],

      formData: {
        chargeItemNumberResource: {
          configData: { "field": "chargeItemNumberResource" },
        },
        chargeItemNumberExpression: {
          configData: { "field": "chargeItemNumberExpression" },
        },
        chargeItemNumberUnitCode: {
          configData: { "field": "chargeItemNumberUnitCode", "unitName": "chargeItemNumberUnitName" },
        },
        chargeItemPriceResource: {
          configData: { "field": "chargeItemPriceResource" },
        },
        chargeItemPriceUnitCode: {
          configData: { "field": "chargeItemPriceUnitCode", "unitName": "chargeItemPriceUnitName" },
        },
        chargeItemAmountsResource: {
          configData: { "field": "chargeItemAmountsResource" },
        },
        chargeItemAmountsUnitCode: {
          configData: { "field": "chargeItemAmountsUnitCode", "unitName": "chargeItemAmountsUnitName" },
        },
        chargeItemAmountsPrecision: {
          configData: { "field": "chargeItemAmountsPrecision" },
        },
        chargeItemPriceExpression: {
          configData: { "field": "chargeItemPriceExpression" },
        },
        chargeItemAmountsExpression: {
          configData: { "field": "chargeItemAmountsExpression" },
        },
        chargeItemAmountsRule: {
          configData: { "field": "chargeItemAmountsRule" },
        }
      }
    }
  },
  methods: {
    resetItems(pre='',list){
      if(!this.editable) return;
      const self = this;
      if(list && list.length>0){
        list.forEach(key=>{
          let new_key = `chargeItem${pre}${key}`;
          if(self.objData.hasOwnProperty(new_key)){
              self.objData[new_key] = '';
          }
        })
      }
    },
    setData() {
      let self = this;
      Object.keys(self.objData).forEach(key=>{
        if(self.domainObject.hasOwnProperty(key)){
          self.objData[key] = self.domainObject[key];
        }
      })
      console.log('=====',self.objData);

      // this.objData = Object.assign(this.objData, this.domainObject)
    },
    //校验
    checkRules() {
      let res = true,
        ruleList = ['Number', 'Price', 'Amounts'],
        ruleMsg = ['数量', '单价', '金额'],
        fm = this.objData;

      for (let i = 0; i < ruleList.length; i++) {
        let item = ruleList[i];
        let key = fm[`chargeItem${item}Resource`];
        // 三个来源方式 必填校验
        if(!key){
          showMessageUtil('warning', `${ruleMsg[i]}来源方式 必须填写`,
            2000);
          return false;
        }
        if (key == 'input' || key == 'fixed') {
          if (!fm[`chargeItem${item}UnitCode`]) {
            showMessageUtil('warning', `${ruleMsg[i]}项目中 单位必须填写`,
              2000);
            return false;
          }
          if(key == 'input' && item == 'Amounts'){
            if (!fm[`chargeItem${item}Precision`]) {
              showMessageUtil('warning', `${ruleMsg[i]}项目中 规则必须填写`,
                2000);
              return false;
            }
          }
        }
        if (key == 'fixed') {
          if (!fm[`chargeItem${item}Expression`]) {
            showMessageUtil('warning', `${ruleMsg[i]}项目中 固定值必须填写`,
              2000);
            return false;
          }
        }
        if (key == 'standard') {
          if (!fm[`chargeItem${item}UnitCode`]) {
            showMessageUtil('warning', `${ruleMsg[i]}项目中 单位必须填写`,
              2000);
            return false;
          }
          if (!fm[`chargeItem${item}Precision`] || !fm[`chargeItem${item}Rule`]) {
            showMessageUtil('warning', `${ruleMsg[i]}项目中 规则必须填写5`,
              2000);
            return false;
          }
        }
      }
      return res;
    }
  }
};

</script>
<style lang="scss" rel="stylesheet/scss">
@import "../../assets/sass/rl-table.scss";
@import "../../assets/sass/base.scss";

.detail_table {
  margin-left: 20px !important;
  width: calc(100% - 40px) !important;
}

</style>
