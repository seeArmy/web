<template>
<div id="payMode_ICBC">
<el-row class="">
    <div class="block">
      <h2 class="title-warning" v-show="warnMsg">校验结果：{{ warnMsg }}</h2>
      <el-form :model="domainObject" ref="verifyForm" label-width="150px" :inline="false" :label-position="'left'" >
        <div class="block">
          <el-row v-if="!processing">
          <el-form-item label="付款金额">
            <span><big class="page-title">{{ totalPay | toThousandslsFilter }}</big>元</span>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="domainObject.phone" placeholder="请输入手机号" readonly="readonly" disabled="disabled" id="phone" name="phone"></el-input>
            <span v-if="time120 > 0">({{time120}}秒后重发)</span>
            <a v-else href="javascript:;" @click="sendingVerifyCode">获取验证码</a>
          </el-form-item>
          <el-form-item label="验证码">
            <el-input id="validateCode" v-model="domainObject.validate" placeholder="请输入手机验证码" @blur="querySearch" name="validateCode"></el-input>
            <i class="el-icon-circle-check text-green" v-if="isValidate === 'success'"></i>
            <i class="el-icon-circle-close text-red" v-if="isValidate === 'error'"></i>
          </el-form-item>
          <!-- <el-form-item label="支付密码">
            <el-input type="password" v-model="domainObject.password" placeholder="请输入支付密码"></el-input>
          </el-form-item> -->
          <el-col :span="24" class="el-col-button">
            <el-form-item>
              <el-button type="danger" size="large" @click="payMentSubmit">确认付款</el-button>
            </el-form-item>
          </el-col>
          </el-row>
          <el-row v-if="processing && processIndex!= processLength">
            <el-col :span="24">
              <div class="progress">
                <span class="text-fr">已处理成功数 / 处理总条数</span>
                <div class="progress__bar">
                  <div class="progress__line" :style="{ width: `${processIndex / processLength * 100}%` }"></div>
                </div>
                <span>{{ processIndex }} / {{ processLength }}</span>
                <span><big>正在付款，请耐心等待！</big></span>
              </div>
            </el-col>
          </el-row>
          <el-row v-if="processing && processIndex === processLength">
            <h2 class="text-center" v-if="isfailed"><i class="el-icon-circle-close text-red"></i>&nbsp;&nbsp;本次付款<big class="page-title">{{ successAmount | toThousandslsFilter }}</big>元，提交失败！</h2>
            <h2 class="text-center" v-else><i class="el-icon-circle-check text-green"></i>&nbsp;&nbsp;本次付款<big class="page-title">{{ successAmount | toThousandslsFilter }}</big>元，提交成功！</h2>
            <el-table :data="processRes">
              <el-table-column type="index" label="序号"> </el-table-column>
              <el-table-column v-for="(item, index) in tableField" :key="index" :label="item.label">
                <template scope="scope">
                  <span :class="{ 'text-red': !scope.row['status']}">{{scope.row[item.prop]}}</span>
                </template>
              </el-table-column>
            </el-table>
            <el-col :span="24" class="el-col-button">
              <el-form-item>
                <el-button v-if="processIndex === processLength" type="primary" size="large" @click="closeMe">确认关闭</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </div>
</el-row>
</div>
</template>

<script>
import { sendAddBankCardVerifyCode as sendVerifyCode, checkVerificationCode } from '../../../api/TradeService'
import { ICBCpay as onlinePay } from '../../../api/waybillService';
import { closeCurrentWindow } from '../../../api/Utils'

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
  data() {
    return {
      activeName: 'pay__2',
      warnMsg: '',
      domainObject: {},
      time120: 0,
      processing: false,
      barWidth: 0,
      processLength: 0,
      processIndex: 0,
      processRes: [],
      tableField: [
        { prop: 'statusMsg', label: '处理结果', width:'180' },
        { prop: 'paybillNo', label: '单车付款单号', width:'180' },
        { prop: 'waybillNo', label: '所属运单', width:'200' },
        { prop: 'payeeName', label: '收款人', width:'100' },
        { prop: 'platformPayeeCode', label: '收款用户ID', width:'180' },
        { prop: 'paymentAmount', label: '金额', width:'180' },
      ],
      isValidate: '',
      successAmount: 0,
      isfailed: false
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    querySearch(e) {
      const verifyCode = this.domainObject.validate
      if(verifyCode) {
        checkVerificationCode({'verificationCode': verifyCode}, (success, err) => {
          if (success && success.code === 200) {
            this.isValidate = 'success'
            this.warnMsg = ''
          }
          if(err) {
            this.isValidate = 'error'
            this.warnMsg = err.content
          }
        })
      }
    },
    payMentSubmit() {
      //TODO
      if(this.isValidate === 'success') {
        this.processing = true
        this.processLength = this.orderLst.length;
        this.processIndex = 0;
        this.handlePayment()
      }
    },
    handlePayment() {
      if(this.processIndex != this.processLength) {
        const params = {
          code: this.orderLst[this.processIndex].code,
          // payPassword: this.domainObject.password
        }
        onlinePay(params, (success, err) => {
          if (success && success.code === 200) {
            const o = this.orderLst[this.processIndex];
            o.status = true
            o.statusMsg = '付款成功'
            this.successAmount = this.successAmount + o.paymentAmount
            this.processRes.push(o)
          }
          if(err) {
            const o = this.orderLst[this.processIndex];
            o.status = false
            o.statusMsg = `付款失败, ${err.content}`
            this.processRes.push(o)
            this.isfailed = true
          }
          this.processIndex ++
          this.handlePayment()
        })
      }
    },
    countdownClock() {
      this.time120 = 120
      const m = setInterval(() => {
        if(this.time120 === 0) {
          clearInterval(m)
        } else {
          this.time120 --
        }
      },1000)
    },
    sendingVerifyCode() {
      if(this.domainObject.phone) {
        this.countdownClock()
        this.sendingSuccess = false;
        const params = {
          mobile: this.domainObject.phone
        }
        sendVerifyCode(params, (success, err) => {
          if (success && success.code === 200) {
            this.sendingSuccess = true;
          }
        })
      }
    },
    closeMe() {
      const iframes = window.top.document.getElementsByTagName('iframe')
      for(let i = 0; i < iframes.length; i ++) {
        if(iframes[i].dataset.url === '/payment/driverPayment.html') {
          iframes[i].contentWindow.location.reload(true);
          break
        }
      }
      closeCurrentWindow()
    }
  },
  created() {
    const userInfo = window.localStorage.getItem('userInfo')
    if(userInfo) {
      const o = JSON.parse(userInfo)
      this.domainObject.phone = o.loginAccount
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss">
@import "../../assets/sass/base.scss";

#payMode_ICBC {
  .el-tabs--card>.el-tabs__header .el-tabs__item.is-active,.el-tabs__content {
    background-color: #fff5ea;
  }
  .el-tabs__header {
    margin-bottom: 0px;
  }
  .text-red {
    color: $red;
  }
  .text-green {
    color: $green
  }
  .text-center {
    text-align: center
  }
  .el-input {
    width: 50%;
  }
  .title-warning {
    color: $red;
  }
  .progress {
    text-fr {
      text-align: right;
    }
    span {
      margin-bottom: 20px;
      display: block;
      text-align: center;
      font-size: 120%;
    }
    &__bar {
      height: 20px;
      border: 1px solid $green;
    }
    &__line {
      height: 20px;
      background-color: $green;
    }
  }
}


</style>
