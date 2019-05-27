<template>
  <div id="accountOperation" class="form-page">
    <div class="page-header clearfix">
      <h2 class="page-title fl">
       {{ pageName[`${step}`] }}
      </h2>
      <span class="page-refresh fr" id="pageRefresh">
        <i class="ico-refresh"></i>刷新
      </span>
      <div class="hd-opr fr">
      </div>
    </div>
    <div id="tmp-wrap"></div>
    <el-row v-loading.fullscreen.lock="loading" element-loading-text="加载中">
      <transition name="el-fade-in-linear">
        <div class="block block-box">
          <el-form :model="domainObject" ref="domainObject" label-width="150px" :inline="false" :label-position="'right'" :rules="rules2">
          <el-row>
            <!-- <el-form-item label="转出账户"> -->
            <el-form-item label="核心企业账户">
              <!-- <el-input v-model="domainObject.name"></el-input> -->
              <span>{{ appName }}</span>
            </el-form-item>
            <el-form-item label="账户余额">
              <!-- <el-input v-model="domainObject.name"></el-input> -->
              <span>{{ domainObject.coreSubAccountAmount | toThousandslsFilter}} 元</span>
              &nbsp;&nbsp;
              <span><small>余 ( {{ amount1 | toThousandslsFilter}} )</small></span>
            </el-form-item>
            <!-- <el-form-item label="收款账户" class="content-width" -->
            <el-form-item label="客户账户" class="content-width"
              prop="accountName"
              :rules="[
                { required: true, message: '请选择收款账户', trigger: 'blur' },
              ]">
              <span>{{ domainObject['accountName'] }} （
                余额：{{ amount2 | toThousandslsFilter}} ）</span>

              <!-- <el-select v-if="!readySubmit" v-model="domainObject['accountName']" placeholder="请选择收款账户">
                <el-option
                  v-for="item in accountOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <span v-else>{{ domainObject['accountName'] }}</span> -->
            </el-form-item>
            <el-form-item label="转账类型" class="content-width"
              prop="transferType"
              :rules="[
                { required: true, message: '请选择转账类型', trigger: 'blur' },
              ]">
              <el-select v-if="!readySubmit" v-model="domainObject['transferType']" placeholder="请选择收款账户" @change="handleTransfer">
                <el-option
                  v-for="item in [{ label:'转出', value: '1' },{ label:'转入', value: '2' }]"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <span v-else>{{ domainObject['transferType'] | transferTypeName }}</span>
            </el-form-item>

            <el-form-item label="转账金额"  class="content-width"
              prop="num">
              <!-- <el-input v-model="domainObject.num"></el-input> -->
              <!-- <el-input-number v-if="!readySubmit" v-model="domainObject.num" :step="0.01" :max="domainObject['transferType'] == '1' ? (domainObject.coreSubAccountAmount || 0) : companyAmount" :min="0"></el-input-number> -->
              <el-input v-if="!readySubmit" v-model="domainObject.num"></el-input>
              <span v-else>{{ domainObject.num | toThousandslsFilter }}</span>
            </el-form-item>
            <!-- <el-form-item label="通知收款人" class="content-width" -->
            <el-form-item label="通知联系人" class="content-width"
              v-if="!readySubmit"
              prop="phone"
              :rules="[
                { required: false, message: '请输入通知收款人', trigger: 'blur' },
              ]">
              <el-input v-model="domainObject.phone" placeholder="输入手机号" id="recevicePhone" name="recevicePhone"></el-input>
              <!-- <span v-else>{{ domainObject.phone }}</span> -->
            </el-form-item>
            <el-form-item label="请输入验证码" class="content-width"
              v-if="readySubmit && !accountTransferMemoRes"
              prop="vcode"
              :rules="[
                { required: true, message: '请输入验证码', trigger: 'blur' },
              ]">
              <el-input v-model="domainObject.vcode" placeholder="请输入验证码" id="vcode" name="vcode"></el-input>
              <span v-if="time120 > 0">({{time120}}秒后重发)</span>
              <a href="javascript:;" v-else @click="resendCode">重发</a>
            </el-form-item>
            <el-form-item label="支付密码" class="content-width"
              v-if="sendingSuccess && !accountTransferMemoRes"
              prop="payPassword"
              :rules="[
                { required: true, message: '请输入支付密码', trigger: 'blur' },
              ]">
              <el-input v-model="domainObject.payPassword" placeholder="请输入支付密码" type="password"></el-input>
              <!-- <span v-else>{{ domainObject.phone }}</span> -->
            </el-form-item>
            <el-form-item label="备注" v-if="!readySubmit">
              <el-input  type="textarea" v-model="domainObject.remark" placeholder="100字以内"></el-input>
            </el-form-item>
            <el-col :span="24">
              <el-tag type="success" v-show="accountTransferMemoRes">{{ accountTransferMemoRes }}</el-tag>
              <el-tag type="success" v-if="readySubmit && !accountTransferMemoRes && sendingSuccess">已将验证码发送至{{ domainObject.operatorPhone }}手机号上，请查收</el-tag>
            </el-col>

            <el-col :span="24" class="el-col-button">
              <el-form-item v-show="!loading">
                <el-button v-show="step === 1" size="large" @click="closeMe">取消</el-button>
                <el-button v-show="step === 2" type="primary" @click="lastStep()" size="large" :disabled="btnDisabled">上一步</el-button>
                <el-button v-show="step === 1 || step === 2" type="primary" @click="submitForm('domainObject')" size="large" :disabled="btnDisabled">确认</el-button>
                <el-button v-show="step === 3" type="primary" @click="closeMe" size="large" :disabled="btnDisabled">关闭</el-button>
              </el-form-item>
            </el-col>
          </el-row>

          </el-form>

        </div>
      </transition>
    </el-row>


    <transition name="el-fade-in-linear">
      <!-- <el-row v-show="step === 2">
      </el-row> -->
    </transition>

  </div>
</template>

<script type="text/ecmascript-6">
import { getCoreRealAccount, getCompanyAcountInfo } from '../../api/virtualAccount'
import { sendAddBankCardVerifyCode as sendVerifyCode, transferMoney } from '../../api/TradeService'
import { getParamsFromURL, closeCurrentWindow } from '../../api/Utils'

export default {
  data() {
    var checkAmount = (rule, value, callback) => {
      // console.log('value', value)
      const pattern =/^[0-9]+([.]\d{1,2})?$/;
      if (value === '') {
        callback(new Error('请输入金额'));
      } else {
        if(isNaN(value)) {
          callback(new Error('请输入数值'));
        }
        if(!pattern.test(value)) {
          callback(new Error('请输入正确数值(例:0.00),最高保留两位小数'));
        }
        if(this.domainObject['transferType'] === '1') {
          if(this.domainObject.coreSubAccountAmount - this.domainObject.num < 0) {
              callback(new Error('账户余额不足'));
          }
        }
        if(this.domainObject['transferType'] === '2') {
          if(this.companyAmount - this.domainObject.num < 0) {
              callback(new Error('收款账户余额不足'));
          }
        }
        if(value < 0) {
          callback(new Error('数值不能小于0'));
        }
        callback();
      }
    };
    return {
      rules2: {
        num: [
          { validator: checkAmount, trigger: 'blur' }
        ]
      },
      step: 1,
      readySubmit: false,
      accountTransferMemoRes: '',
      pageName: {
        1: '出入金管理',
        2: '转账确认',
        3: '转账结果'
      },
      domainObject: {
        accountName: getParamsFromURL(window.location.search).accountName || '',
        realAccountAmount: 0,
        coreSubAccountAmount: 0,
        phone: '',
        operatorPhone: '',
        num: 0,
        transferType: '1'
      },
      loading: false,
      btnDisabled: false,
      accountOptions: [
        { label:'连合智运', value: '连合智运' }
      ],
      time120: 0,
      sendingSuccess: false,
      receiverAuid: '',
      appName: '',
      companyAmount: 0,
      amount1: 0,
      amount2: 0
    }
  },
  watch: {
    'domainObject.num': function(newVal, oldVal) {
      const self = this
      console.log('new', newVal)
      if(newVal!=oldVal) {
        if(newVal >= 0) {
          if(self.domainObject.transferType === '1') {
            self.amount1 = self.domainObject.coreSubAccountAmount - newVal
            self.amount2 = parseFloat(self.companyAmount) + parseFloat(newVal)
          }
          if(self.domainObject.transferType === '2') {
            self.amount1 = parseFloat(self.domainObject.coreSubAccountAmount) + parseFloat(newVal)
            self.amount2 = self.companyAmount - newVal
          }
        }
        if(newVal === '') {
            self.amount1 = self.domainObject.coreSubAccountAmount
            self.amount2 = self.companyAmount
        }
      }
    }
  },
  filters: {
    transferTypeName(val) {
      return val == '1' ? '转出' : '转入'
    }
  },
  methods: {
    handleTransfer() {
      this.domainObject.num = 0
    },
    loadingCompanyAmount() {
      const params = {
        code: getParamsFromURL(window.location.search).code || '',
      }
      getCompanyAcountInfo(params, (success, err) => {
        if (success && success.code === 200) {
          const { content } = success;
          this.companyAmount = content.amount || 0;
          this.amount2 = content.amount || 0;
          this.receiverAuid = content.auid || '';
        }
      })
    },
    init() {
      this.loadingData();
    },
    openWindow() {

    },
    loadingData() {
      const param = {
        // code: 'xx'
      }
      getCoreRealAccount(param, (success, error) => {
        if (success && success.code === 200) {
          const { content } = success;
          this.domainObject.realAccountAmount = content.realAccountAmount
          this.domainObject.coreSubAccountAmount = content.coreSubAccountAmount
          this.amount1 = content.coreSubAccountAmount
          this.appName = content.companyName
        }
        if(error) {
          this.loading = false;
          this.$message({
            type: 'error',
            message: error.content,
            duration: 3000
          });
        }
      })
      // console.log('this.domainobject', this.domainObject)
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
    resendCode() {
      this.countdownClock()
      this.sendingVerifyCode()
    },
    sendingVerifyCode() {
      this.sendingSuccess = false;
      const params = {
        mobile: this.domainObject.operatorPhone
      }
      sendVerifyCode(params, (success, err) => {
        if (success && success.code === 200) {
          this.sendingSuccess = true;
          this.step = 2
        }
      })
    },
    confirmSubmit() {
      const params = {
        mobilePhone: this.domainObject.operatorPhone,
        verificationCode: this.domainObject.vcode,
        receiverTrueName: this.domainObject.accountName,
        receiverPhoneNumber: this.domainObject.phone,
        receiverAmount: this.domainObject.num,
        payPassword: this.domainObject.payPassword,
        remark: this.domainObject.remark,
        receiverAuid: this.receiverAuid,
        transferType: this.domainObject.transferType
      }
      transferMoney(params, (success, err) => {
        if (success && success.code === 200) {
          this.accountTransferMemoRes = '转账成功！！'
          this.step = 3
        }
        if(err) {
          this.$message({
            type: 'error',
            message: err.content,
            duration: 3000
          });
        }
      })
    },
    lastStep() {
      this.step--;
      this.readySubmit = false;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.domainObject.num <= 0) {
            this.$message({
              type: 'error',
              message: '金额请大于0',
              duration: 3000
            });
            return
          }
          this.readySubmit = true
          //start clock
          if(this.step === 1 && this.time120 === 0) {
            this.resendCode()
          }
          if(this.step === 2) {
            //TODO submit && fetch result
            this.confirmSubmit()
          }
        }
      })
    },
    closeMe() {
      closeCurrentWindow()
    }
  },
  mounted() {
    const user = window.localStorage.getItem('userInfo')
    this.domainObject.operatorPhone = JSON.parse(user).loginAccount || 0
    this.init();
    this.loadingCompanyAmount()
  }
}
</script>

<style lang="scss" rel="stylesheet/scss">
@import "../assets/sass/base.scss";

.el-input__inner {
  width: 260px;
}

.el-textarea__inner {
  width: 300px;
  min-height: 100px;
}

.form-page .el-col-button .el-form-item:last-child {
  padding: 0;
  // width: 0;
}

.form-page .el-select {
  width: 260px;
}

#accountOperation {
  .el-input-number {
    width: 258px;
  }
  .el-input-number__decrease, .el-input-number__increase {
    line-height: 22px;
  }
  .content-width .el-form-item__content {
    width: 320px;
  }
}

</style>
