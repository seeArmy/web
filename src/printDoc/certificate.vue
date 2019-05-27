/**
* id.vue
* 代开证明打印
* Created by cc on 18/12/3.
*/
<template>
  <div class="print-doc print-certificate">
    <span class="print-now no-print" @click="print" title="点击打印">点击打印</span>
    <h1 class="print-tit">证明</h1>
    <p></p>
    <p class="content">兹有<strong class="underline">{{ userInfo.fullName }}</strong>同志（身份证<strong class="underline">{{ userInfo.identityNumber }}</strong>）为本公司提供相关运输劳务，本司需支付其运费共计
      <input type="number" v-model="totalAmount" class="txtbox inline-txtbox no-print" placeholder="请输入运费">
      <strong class="underline for-print">{{ totalAmount }}</strong>元，特此证明。</p>
    <p class="right"></p>
    <p class="right"><span class="year">{{ year }}</span>年<span class="month">{{ month }}</span>月<span class="day">{{ day }}</span>日</p>
  </div>
</template>

<script type="text/ecmascript-6">
import { getParamsFromURL, moneyFormat } from '../../api/Utils';
import { get, getImage } from '../../api/DriverMemberService';

export default {
  name: 'certificate',
  components: {
  },
  props: {
  },
  data() {
    return {
      userCode: getParamsFromURL(window.location.search).userCode,
      paymentAmount: getParamsFromURL(window.location.search).paymentAmount,
      totalAmount: null,
      userInfo: {},
      year: '',
      month: '',
      day: ''
    }
  },
  computed: {
    amountText() {
      let text = '';
      text = '¥' + moneyFormat(Number(this.paymentAmount));
      return text;
    }
  },
  methods: {
    print() {
      window.print();
    }
  },
  created() {
    // 获取日期
    const date = new Date();
    this.year = date.getFullYear();
    this.month = date.getMonth() + 1;
    this.day = date.getDate();
    // 获取司机信息
    get({code: this.userCode}, (success, error) => {
      if (success) {
        const data = success.content;
        console.log('get user info is', data);
        this.userInfo = data;
      }
    });
  },
  mounted() {
  }
};

</script>

<style lang="scss" rel="stylesheet/scss">
@import './print.scss';
</style>
