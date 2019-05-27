<template>
  <div id="driverPayment" class="form-page">
    <div class="page-header clearfix">
      <h2 class="page-title fl">
       确认支付
      </h2>
      <span class="page-refresh fr" id="pageRefresh">
        <i class="ico-refresh"></i>刷新
      </span>
      <div class="hd-opr fr">
      </div>
    </div>
    <div id="tmp-wrap"></div>
    <el-row v-if="confirmPay">
      <div class="block block-box">
        <h2 class="page-title">支付信息</h2>
        <h2>支付单位: <big>{{ nowPayeeName }}</big></h2>
        <h2>待支付的付款单共<big class="page-title">{{ tableData.length }}</big>笔。累计付款金额：<big class="page-title">{{ totalPay | toThousandslsFilter }}</big>元</h2>
        <el-table :data="tableData" style="width: 100%" v-if="confirmPay">
          <el-table-column type="index" label="序号" width="100"> </el-table-column>
          <!-- <el-table-column v-for="(item, index) in tableField" :key="index" :prop="item.prop" :label="item.label"></el-table-column> -->
        <el-table-column v-for="(field, index) in tableField" :key="index" :label="field.label" min-width="120">
          <template scope="scope">
            <d-select v-if="field.options" :options="field.options" v-model="scope.row[field.prop]" :editable="false"/>
            <span v-else>{{ scope.row[field.prop] }}</span>
          </template>
        </el-table-column>
        </el-table>
        <div class="text-fr" v-if="confirmPay">
          <h2>总计：<big class="page-title">{{ totalPay | toThousandslsFilter }}</big>元</h2>
          <!-- <el-button type="" size="large" @click="handlecancle">返回列表</el-button> -->
          <el-button type="primary" size="large" @click="handleconfirmPay" :disabled="btnPayment">付款</el-button>
        </div>
      </div>
    </el-row>
    <!-- <pay-validation v-if="!confirmPay" :orderLst="tableData"></pay-validation> -->
    <pay-mode v-if="!confirmPay" :orderLst="tableData" :totalPay="totalPay"></pay-mode>
  </div>
</template>

<script>
import { getCompanyAcountInfo } from '../../../api/virtualAccount'
import payValidation from './payValidation'
import payMode from './payMode'
import dSelect from '../../components/ele-select'
import { transformInfo } from '../../../api/PlatformService';
import Decimal from "decimal.js";

  export default {
    name: 'payment-confirm',
    props: {
      tableData: {
        type: Array,
        default() {
          return []
        }
      }
    },
    components: {
      payValidation,
      dSelect,
      payMode
    },
    data() {
      return {
        tableField: [
          { prop: 'paybillNo', label: '单车付款单号', width:'180' },
          { prop: 'waybillNo', label: '所属运单', width:'200' },
          { prop: 'payeeType', label: '收款人类型', width:'200', options: {1: '组织', 2: '司机'} },
          { prop: 'payeeName', label: '收款人', width:'100' },
          { prop: 'platformPayeeCode', label: '收款用户ID', width:'180' },
          { prop: 'paymentAmount', label: '金额', width:'180' },
        ],
        totalAmount: 0,
        confirmPay: true,
        nowPayeeName: '',
        btnPayment: false,
        theme: true,
      }
    },
    computed: {
      totalPay() {
        var amount = 0
        this.tableData.forEach(element => {
          // amount += element.paymentAmount
          amount = new Decimal(element.paymentAmount || 0).plus(amount).toNumber()
        });
        return amount
        // return this.tableData.length > 1 ? this.tableData.reduce((a,b)=>(a.paymentAmount || 0)+(b.paymentAmount || 0)) : (this.tableData[0].paymentAmount || 0)
      }
    },
    methods: {
      loadingTotalAmount() {
        const o = this.tableData[0];
        this.nowPayeeName = o.payerName
      },
      handleconfirmPay() {
        this.confirmPay = false;
      },
      handlecancle() {

      }
    },
    created() {
      if (this.theme) {
        document.querySelector('body').classList.add('theme-blue');
      }
    },
    mounted() {
      setTimeout(() => {
        this.loadingTotalAmount()
      },600)
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
@import "../../assets/sass/base.scss";
#driverPayment {
  .block {
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 20px;
    h2 {
      font-size: 130%;
      line-height: 30px;
    }
    .text-fr {
      text-align: right;
    }
  }
}

</style>
