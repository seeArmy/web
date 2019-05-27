/**
* taxInfo.vue
* Created by cc on 17/12/6.
*/
<template>
  <div class="tax-info">
    <el-table :data="tableData" border style="width: 100%" resizable="false">
      <el-table-column prop="vatType" label="税目类型" width="110">
        <template scope="scope">
          <div v-if="editable">
            <el-select v-model="tableData[scope.$index].vatType" placeholder="请选择">
              <el-option
                :key="'transport'"
                :label="'运输费'"
                :value="'transport'">
              </el-option>
              <el-option
                :key="'agency'"
                :label="'代理费'"
                :value="'agency'">
              </el-option>
            </el-select>
          </div>
          <span v-else>
            {{ tableData[0].vatType === 'transport' ? '运输费' : '代理费' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="vatCategory" label="货物或服务" width="110">
        <template scope="scope">
          <div v-if="editable">
            <el-input v-model="tableData[scope.$index].vatCategory"></el-input>
          </div>
          <span v-else>
            {{ tableData[0].vatCategory }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="vatModel" label="规格型号">
        <template scope="scope">
          <div v-if="editable">
            <el-input v-model="tableData[scope.$index].vatModel"></el-input>
          </div>
          <span v-else>
            {{ tableData[0].vatModel }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="vatUnitName" label="单位">
        <template scope="scope">
          <div v-if="editable">
            <el-input v-model="tableData[scope.$index].vatUnitName"></el-input>
          </div>
          <span v-else>
            {{ tableData[0].vatUnitName }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="vatNumber" label="数量">
        <template scope="scope">
          <div v-if="editable">
            <el-input type="number" v-model="tableData[scope.$index].vatNumber" :readonly="true"></el-input>
          </div>
          <span v-else>
            {{ tableData[0].vatNumber }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="vatPriceType" label="单价类型" width="110">
        <template scope="scope">
          <div v-if="editable">
            <el-select v-model="tableData[scope.$index].vatPriceType" placeholder="请选择" @change="computeAmount">
              <el-option
                :key="'include'"
                :label="'含税'"
                :value="'include'">
              </el-option>
              <el-option
                :key="'exclude'"
                :label="'不含税'"
                :value="'exclude'">
              </el-option>
            </el-select>
          </div>
          <span v-else>
            {{ tableData[0].vatPriceType === 'include' ? '含税' : '不含税' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="vatPrice" label="单价">
        <template scope="scope">
          <div v-if="editable">
            <el-input type="number" v-model="tableData[scope.$index].vatPrice" @change="computeNum"></el-input>
          </div>
          <span v-else>
            {{ tableData[0].vatPrice }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="vatAmount" label="金额">
        <template scope="scope">
          <div v-if="editable">
            <el-input type="number" v-model="tableData[scope.$index].vatAmount" @change="computeNum"></el-input>
          </div>
          <span v-else>
            {{ tableData[0].vatAmount }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="vatTaxRate" label="税率" width="110">
        <template scope="scope">
          <div v-if="editable">
            <div class="pr">
              <el-input type="number" v-model="tableData[scope.$index].vatTaxRate" @change="computeAmount"></el-input>
              <span class="unit">%</span>
            </div>
          </div>
          <span v-else>
            {{ tableData[0].vatTaxRate}} %
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="vatTaxAmount" label="税额" width="110">
        <template scope="scope">
          <div v-if="editable">
            <el-input type="number" v-model="tableData[scope.$index].vatTaxAmount" :readonly="true"></el-input>
          </div>
          <span v-else>
            {{ tableData[0].vatTaxAmount }}
          </span>
        </template>
      </el-table-column>
    </el-table>
    <div class="column clearfix">
      <div class="col-tit">
        <strong class="red">合计：</strong>
      </div>
      <div class="col-cont">
        <span class="no-tax">（不含税金额）：{{ tableData[0].excludeTaxAmount }}</span>
        <span class="tax">{{ tableData[0].vatTaxAmount }}</span>
      </div>
    </div>
    <div class="column clearfix">
      <div class="col-tit">
        <strong class="red">价税合计（大写）：</strong>
      </div>
      <div class="col-cont">
        <span class="upper fl">
          <strong>{{ tableData[0].capitalizedTotalAmount }}</strong>
        </span>
        <span class="lower">
          <strong class="red">（小写）{{ tableData[0].totalAmount }}</strong>
        </span>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
/* eslint-disable no-mixed-operators */
import { convertMoney } from '../../../api/Utils';

export default {
  name: 'taxInfo',
  props: {
    domainObject: Object,
    editable: Boolean
  },
  data() {
    return {
      tableData: [{
        editable: false,
        vatType: 'transport',
        vatCategory: '',
        vatModel: '',
        vatUnitName: '',
        vatNumber: '',
        vatPriceType: 'include',
        vatPrice: '',
        vatAmount: '',
        vatTaxRate: '',
        vatTaxAmount: '',
        excludeTaxAmount: '',
        capitalizedTotalAmount: '',
        totalAmount: ''
      }]
    };
  },
  computed: {
    // tableData() {
    //   const tableData = [{
    //     vatType: 'transport',
    //     vatCategory: '',
    //     vatModel: '',
    //     vatUnitName: '',
    //     vatNumber: '',
    //     vatPriceType: 'include',
    //     vatPrice: '',
    //     vatAmount: '',
    //     vatTaxRate: '',
    //     vatTaxAmount: '',
    //     excludeTaxAmount: '',
    //     capitalizedTotalAmount: '',
    //     totalAmount: ''
    //   }];
    //   Object.keys(tableData[0]).forEach((key) => {
    //     if (this.domainObject[key]) {
    //       tableData[0][key] = this.domainObject[key];
    //     }
    //   });
    //   return tableData;
    // }
  },
  methods: {
    computeNum() {
      const price = Number(this.tableData[0].vatPrice),
        amount = Number(this.tableData[0].vatAmount),
        taxRate = this.tableData[0].vatTaxRate;
      if (price && amount && price > 0) {
        this.tableData[0].vatNumber = (amount / price).toFixed(2);
      } else {
        this.tableData[0].vatNumber = '';
      }
      if (amount && taxRate) {
        this.computeAmount();
      }
    },
    computeAmount() {
      const type = this.tableData[0].vatPriceType,
        amount = Number(this.tableData[0].vatAmount),
        taxRate = Number(this.tableData[0].vatTaxRate);
      if (amount && taxRate) {
        switch (type) {
          case 'include':
            this.tableData[0].vatTaxAmount = Number(amount * taxRate / (100 + taxRate)).toFixed(2);
            this.tableData[0].excludeTaxAmount = Number(amount / (1 + taxRate / 100)).toFixed(2);
            this.tableData[0].totalAmount = (Number(this.tableData[0].excludeTaxAmount) + Number(this.tableData[0].vatTaxAmount)).toFixed(2);
            this.tableData[0].capitalizedTotalAmount = convertMoney(this.tableData[0].totalAmount);
            break;
          case 'exclude':
            this.tableData[0].vatTaxAmount = Number(amount * taxRate / 100).toFixed(2);
            this.tableData[0].excludeTaxAmount = amount.toFixed(2);
            this.tableData[0].totalAmount = (Number(this.tableData[0].excludeTaxAmount) + Number(this.tableData[0].vatTaxAmount)).toFixed(2);
            this.tableData[0].capitalizedTotalAmount = convertMoney(this.tableData[0].totalAmount);
            break;
          default:
            break;
        }
      }
    }
  },
  watch: {
  },
  created() {
    this.$nextTick(() => {
      if (this.domainObject) {
        const tempObj = this.tableData[0];
        Object.keys(tempObj).forEach((key) => {
          // console.log('key', key, 'value', this.domainObject[key]);
          tempObj[key] = this.domainObject[key];
        });
        this.$set(this.tableData, 0, tempObj);
      }
      console.log('this editable is', this.editable);
      console.log('this domainObject is', this.domainObject);
    });
  }
};
</script>

<style lang="scss" rel="stylesheet/scss">
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
}
input[type="number"] {
    -moz-appearance: textfield;
}
.tax-info {
  padding: 20px;
  .el-table {
    .cell {
      padding: 0 10px;
    }
  }
  .el-select {
    width: 90px !important;
  }
}
.el-table_1_column_5 .el-input__inner[readonly], .el-table_1_column_10 .el-input__inner[readonly] {
  cursor: not-allowed;
  background-color: #f6f6f6;
}
.column {
  height: 40px;
  line-height: 39px;
  font-size: 14px;
  border-left: solid 1px #ddd;
  .col-tit {
    float: left;
    width: 224px;
    border-right: solid 1px #ddd;
    border-bottom: solid 1px #ddd;
    .red {
      margin-left: 20px;
    }
  }
  .col-cont {
    text-align: right;
    margin-left: 224px;
    padding-left: 20px;
    padding-right: 20px;
    border-right: solid 1px #ddd;
    border-bottom: solid 1px #ddd;
  }
  .lower {
    display: inline-block;
    vertical-align: top;
    margin-right: 150px;
  }
  .tax {
    display: inline-block;
    vertical-align: top;
    width: 220px;
  }
}
.pr {
  position: relative;
}
.unit {
  position: absolute;
  top: 0;
  right: 5px;
  bottom: 0;
  color: #999;
}
</style>
