/**
* id.vue
* 代开申报打印
* Created by cc on 18/12/3.
*/
<template>
  <div class="print-doc print-declaration">
    <span class="print-now no-print" @click="print" title="点击打印">点击打印</span>
    <h1 class="print-tit">代开增值税发票缴纳税款申报单</h1>
    <h2>代开人声明：</h2>
    <p>本次缴纳税款申报单提供的开票信息真实、完整、准确，符合有关法律、法规。</p>
    <p>现申请代开
      <span class="check-item"><input type="checkbox" id="special"><label for="special">增值税专用发票</label></span>
      <span class="check-item"><input type="checkbox" id="normal"><label for="normal">增值税普通发票</label></span>。
    </p>
    <p class="right"><strong class="signature sig-top">代开人（签章）：{{ userInfo.fullName }}</strong><span class="year"></span>年<span class="month"></span>月<span class="day"></span>日</p>
    <table class="print-table">
      <tbody>
        <!-- 购买方信息 -->
        <tr>
          <th rowspan="3" width="80">购买方<br>信息</th>
          <th width="100">名称</th>
          <td colspan="3" width="360">{{ orgInfo.orgFullName }}</td>
          <th width="100">纳税人识别号</th>
          <td colspan="3" width="360">{{ orgInfo.taxNumber }}</td>
        </tr>
        <tr>
          <th>地址</th>
          <td colspan="3">{{ detailAddress }}</td>
          <th>开户银行</th>
          <td colspan="3">{{ orgInfo.bankName }}</td>
        </tr>
        <tr>
          <th>电话</th>
          <td colspan="3">{{ orgInfo.linkmanPhone }}</td>
          <th>银行账号</th>
          <td colspan="3">{{ orgInfo.bankAccountNo }}</td>
        </tr>
        <!-- 销售方信息 -->
        <tr>
          <th rowspan="3">销售方<br>信息</th>
          <th>名称</th>
          <td colspan="3">{{ userInfo.fullName }}</td>
          <th>纳税人识别号</th>
          <td colspan="3">{{ userInfo.identityNumber }}</td>
        </tr>
        <tr>
          <th>地址</th>
          <td colspan="3"><input type="text" v-model="idAddress" class="txtbox no-print" placeholder="请输入身份证上的地址"><span class="for-print">{{ idAddress }}</span></td>
          <th>开户银行</th>
          <td colspan="3"></td>
        </tr>
        <tr>
          <th>电话</th>
          <td colspan="3">{{ userInfo.phone }}</td>
          <th>银行账号</th>
          <td colspan="3"></td>
        </tr>
        <!-- 代开人类型 -->
        <tr>
          <th colspan="2">代开人类型</th>
          <td colspan="7">
            <span class="check-item"><input type="checkbox" id="human"><label for="human">自然人</label></span>
            <span class="check-item"><input type="checkbox" id="other"><label for="other">其他纳税人</label></span>
          </td>
        </tr>
        <!-- 减免税标识 -->
        <tr>
          <th colspan="2">减免税标识（代开普通发票，符合条件填写）</th>
          <td colspan="7">
            <span class="check-item"><input type="checkbox" id="labelYes"><label for="labelYes">是</label></span>
            <span class="check-item"><input type="checkbox" id="labelNo"><label for="labelNo">否</label></span>
          </td>
        </tr>
        <tr>
          <th colspan="2">减免税种</th>
          <th colspan="4">减免税类型</th>
          <th colspan="3">减免原因</th>
        </tr>
        <tr>
          <td colspan="2">
            &nbsp;
          </td>
          <td colspan="4"></td>
          <td colspan="3"></td>
        </tr>
        <!-- 货物 -->
        <tr>
          <th colspan="2">货物或应税<br>劳务、服务名称</th>
          <th>规格型号<br>（服务类型）</th>
          <th width="100">计量单位</th>
          <th>数量</th>
          <th width="100">单价</th>
          <th width="100">不含税销售额</th>
          <th width="100">征收率</th>
          <th width="100">税额</th>
        </tr>
        <tr>
          <td colspan="2">运输费</td>
          <td></td>
          <td>次</td>
          <td>1</td>
          <td><!-- {{ paymentAmount }} --></td>
          <td><!-- {{ paymentAmount }} --></td>
          <td><!-- <input type="number" v-model="taxRate" class="txtbox inline-txtbox no-print" placeholder="请输入税率" @keyup="cal">
            <span class="for-print">{{ taxRate }}</span> --><span class="right pct">%</span></td>
          <td><!-- {{ taxAmount }} --></td>
        </tr>
        <!-- 价税合计 -->
        <tr>
          <th colspan="2">价税合计（大写）</th>
          <td colspan="3">
            {{ amountInWords }}
          </td>
          <th colspan="2">价税合计（小写）</th>
          <td colspan="3">
            <input type="number" v-model="totalAmount" class="txtbox no-print" placeholder="请输入价税合计" @keyup="cal">
            <span class="for-print">{{ totalAmount }}</span>
            <!-- {{ totalAmountText }} -->
          </td>
        </tr>
        <!-- 减免税费 -->
        <tr>
          <th colspan="2">减免税（费）额</th>
          <td colspan="7">

          </td>
        </tr>
        <!-- 应补税额 -->
        <tr>
          <th colspan="2">应补税额</th>
          <td colspan="7">

          </td>
        </tr>
        <!-- 备注 -->
        <tr>
          <th colspan="2">备注</th>
          <td colspan="7">

          </td>
        </tr>
        <!-- 是否为异地代开 -->
        <tr>
          <th colspan="2">是否为异地代开</th>
          <td colspan="7">
            <span class="check-item"><input type="checkbox" id="remoteYes"><label for="remoteYes">是</label></span>
            <span class="check-item"><input type="checkbox" id="remoteNo"><label for="remoteNo">否</label></span>
          </td>
        </tr>
        <!-- 受理税务机关 -->
        <tr>
          <th colspan="2" rowspan="2">受理<br>税务<br>机关</th>
          <td colspan="7">
            <div class="print-multi">
              <p>税务机关税款征收岗位</p>
              <p>税收完税凭证号：</p>
              <p class="right"><span class="signature">（签字）</span><span class="year"></span>年<span class="month"></span>月<span class="day"></span>日</p>
            </div>
          </td>
        </tr>
        <tr>
          <td colspan="7">
            <div class="print-multi">
              <p>税务机关代开发票岗位</p>
              <p>发票代码：</p>
              <p>发票号码：</p>
              <p class="right"><span class="signature">（签字）</span><span class="year"></span>年<span class="month"></span>月<span class="day"></span>日</p>
            </div>
          </td>
        </tr>
        <!-- 经办人 -->
        <tr>
          <th colspan="2">经办人</th>
          <td colspan="7">
            <div class="print-multi">
              <p>经核对，所开发票与申报单内容一致。</p>
              <p class="right"><span class="signature">经办人（签字）：</span></p>
              <p class="right"><span class="year"></span>年<span class="month"></span>月<span class="day"></span>日</p>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script type="text/ecmascript-6">
import { getParamsFromURL, moneyFormat, convertMoney } from '../../api/Utils';
import { get, getImage } from '../../api/DriverMemberService';

import { province, city, county } from '../../api/DataSourceService';

import Decimal from "decimal.js";

export default {
  name: 'declaration',
  components: {
  },
  props: {
  },
  data() {
    return {
      userCode: getParamsFromURL(window.location.search).userCode,
      paymentAmount: getParamsFromURL(window.location.search).paymentAmount,
      orgInfo: JSON.parse(localStorage.getItem('orgInfo')).content,
      userInfo: {},
      detailAddress: '',
      taxRate: null,
      taxAmount: null,
      totalAmount: null,
      totalAmountText: '',
      amountInWords: '',
      idAddress: ''
    };
  },
  methods: {
    print() {
      window.print();
    },
    cal() {
      console.log('cal now');
      // this.taxAmount = parseFloat(new Decimal(this.paymentAmount).mul(this.taxRate).div(100).toDP(2, Decimal.ROUND_HALF_UP));
      // this.totalAmount = new Decimal(this.paymentAmount).plus(this.taxAmount).toDP(2, Decimal.ROUND_HALF_UP);
      // this.totalAmountText =  '¥' + moneyFormat(this.totalAmount);
      this.amountInWords = convertMoney(this.totalAmount);
    },
    getAddressText(provinceCode, cityCode, countyCode) {
      let text = '';
      province.getData({}, (success) => {
        console.log('province is ', success);
        success.forEach((val) => {
          if (val.id === provinceCode) {
            text += val.name;
          }
        });
      });
      city.getData({keyword: provinceCode}, (success) => {
        console.log('city is ', success);
        success.forEach((val) => {
          if (val.id === cityCode) {
            text += val.name;
          }
        });
      });
      county.getData({keyword: cityCode}, (success) => {
        console.log('county is ', success);
        success.forEach((val) => {
          if (val.id === countyCode) {
            text += val.name;
          }
        });
      });
      console.log('getAddressText is', text);
      text += this.orgInfo.address;
      return text;
    }
  },
  created() {
    // 获取司机信息
    get({code: this.userCode}, (success, error) => {
      if (success) {
        const data = success.content;
        console.log('get user info is', data);
        this.userInfo = data;
      }
    });
    // 获取购买方详细地址
    this.detailAddress = this.getAddressText(this.orgInfo.province, this.orgInfo.city, this.orgInfo.county);
  },
  mounted() {
  }
};

</script>

<style lang="scss" rel="stylesheet/scss">
@import './print.scss';
</style>
