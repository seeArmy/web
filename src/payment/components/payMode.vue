<template>
<div id="payMode">
<el-row class="">
  <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane label="链金师支付平台" name="pay__1">
      <component :is="'pay-ljs'"
        :orderLst="orderLst"
        :totalPay="totalPay"
      />
    </el-tab-pane>
    <el-tab-pane label="工商银行支付" name="pay__2" v-if="showIcbcPay">
      <component :is="'pay-icbc'" :orderLst="orderLst" :totalPay="totalPay" />
    </el-tab-pane>
    <el-tab-pane label="包商银行支付" name="pay__bsb" v-if="showBSBPay">
      <component :is="'pay-bsb'" :orderLst="orderLst" :totalPay="totalPay" />
    </el-tab-pane>
  </el-tabs>
</el-row>
</div>
</template>

<script>
import PayICBC from './payICBC'
import PayLJS from './payLJS'
import PayBSB from './payBSB'


export default {
  props:{
    orderLst:{
      type: Array,
      default() {
        return []
      }
    },
    totalPay: {
      type: Number,
      default: 0
    }
  },
  components: {
    'pay-ljs': PayLJS,
    'pay-icbc': PayICBC,
    'pay-bsb': PayBSB
  },
  data() {
    return {
      activeName: 'pay__1',
      showIcbcPay: JSON.parse(localStorage.getItem('appInfo')).icbcPay === 'TRUE',
      showBSBPay:  JSON.parse(localStorage.getItem('appInfo')).baoshangPay === 'TRUE',
    };
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event);
    },
  },
  created() {

  }
};
</script>

<style lang="scss" rel="stylesheet/scss">
@import "../../assets/sass/base.scss";

#payMode {
  .el-tabs--card>.el-tabs__header .el-tabs__item.is-active,.el-tabs__content {
    background-color: #fff5ea;
  }
  .el-tabs__header {
    margin-bottom: 0px;
  }
}


</style>
