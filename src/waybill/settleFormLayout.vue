<template>
  <div class="custom-page settle-box">
    <!-- 1 -->
    <div class="section">
      <h2 class="tmp-title">
        结算信息
      </h2>
      <!-- 信息板块 -->
      <div class="info-section el-row">
        <!-- 应付司机结算信息板块 -->
        <div class="el-col" :class="[domainObject.scheduleType === 'self' ? 'el-col-12': 'el-col-8' ]">
          <h3 class="tit">应付司机结算信息</h3>
          <div class="el-col el-col-24">
            <slot name="driverPrice"></slot>
          </div>
          <div class="el-col el-col-24">
            <slot name="settleTotalPayment"></slot>
          </div>
          <div class="el-col el-col-24">
            <slot name="settleAdjustAmount"></slot>
          </div>
          <div class="el-col el-col-24 el-col-settleDriverPayment">
            <slot name="settleDriverPayment"></slot>
          </div>
          <div class="el-col el-col-24 el-col-highlight el-col-settleDriverRealPayment">
            <slot name="settleDriverRealPayment"></slot>
          </div>
        </div>
        <!-- 应付平台结算信息 --> <!-- 仅在平台模式显示 -->
        <div class="el-col el-col-8" v-if="domainObject.scheduleType === 'platform'">
          <h3 class="tit">应付平台结算信息</h3>
          <div class="el-col el-col-24">
            <slot name="settleTradingConfigValue"></slot>
          </div>
          <div class="el-col el-col-24">
            <slot name=""></slot>
          </div>
          <div class="el-col el-col-24">
            <slot name=""></slot>
          </div>
          <div class="el-col el-col-24">
            <slot name=""></slot>
          </div>
          <div class="el-col el-col-24 el-col-highlight el-col-settleConfigAmount3">
            <slot name="settleTradingConfigAmount"></slot>
            <!-- <span class="help-tooltip">
              <el-tooltip class="item" effect="dark" content="当交易费标准是按比例时，交易费=应付司机总费用(不含税)/(1-交易费比例)-应付司机总费用(不含税)" placement="top">
                <span class="help">?</span>
              </el-tooltip>
            </span> -->
          </div>
        </div>
        <!-- 应收客户结算信息 -->
        <div class="el-col" :class="[domainObject.scheduleType === 'self' ? 'el-col-12': 'el-col-8' ]">
          <h3 class="tit">应收客户结算信息</h3>
          <div class="el-col el-col-24">
            <slot name="clientFreightPrice"></slot>
          </div>
          <div class="el-col el-col-24">
            <slot name="settleClientOrgPayeeCalculated"></slot>
          </div>
          <div class="el-col el-col-24">
            <slot name="settleClientOrgPayeeAdjust"></slot>
          </div>
          <div class="el-col el-col-24">
            <slot name=""></slot>
          </div>
          <div class="el-col el-col-24 el-col-highlight el-col-settleClientOrgPayee">
            <slot name="settleClientOrgPayee"></slot>
            <!-- <span class="help-tooltip">
              <el-tooltip class="item" effect="dark" content="应收总费用计算值=客户运价*结算货量-货差扣款+应收调整金额" placement="top">
                <span class="help">?</span>
              </el-tooltip>
            </span> -->
          </div>
        </div>
        <!-- 模式信息板块 -->
        <div class="mode-section clearfix">
          <p v-if="domainObject.scheduleType === 'platform'">
            当前运单的调车模式是<strong class="org">委托调车</strong>，应付司机劳务费和交易费将在付款时从您的平台资金账户中扣除（共扣除<strong class="org">{{ domainObject.settleRealPayment }}</strong>元），其中应付司机劳务费将转账到司机的平台资金账户。
          </p>
          <p v-if="domainObject.scheduleType === 'self'">
            当前运单的调车模式是<strong class="org">自助调车</strong>，无平台交易费，其中应付司机劳务费需要您线下支付给收款人。
          </p>
        </div>
        <!-- 总计板块  -->
        <div class="total-section clearfix">
          <div class="el-col el-col-8 el-col-settleReceiveTotal">
            <slot name="settleReceiveTotal"></slot>
            <!-- <span class="help-tooltip">
              <el-tooltip class="item" effect="dark" content="应收金额小计=应收客户总费用" placement="top">
                <span class="help">?</span>
              </el-tooltip>
            </span> -->
          </div>
          <div class="el-col el-col-8 el-col-settlePayableTotal">
            <slot name="settlePayableTotal"></slot>
            <!-- <span class="help-tooltip">
              <el-tooltip class="item" effect="dark" content="应付金额小计=应付司机总费用（不含税）+交易费" placement="top">
                <span class="help">?</span>
              </el-tooltip>
            </span> -->
          </div>
          <div class="el-col el-col-8 el-col-settleGrossProfit">
            <slot name="settleGrossProfit"></slot>
            <!-- <span class="help-tooltip">
              <el-tooltip class="item" effect="dark" content="单车利润=应收金额小计-应付金额小计" placement="top">
                <span class="help">?</span>
              </el-tooltip>
            </span> -->
          </div>
        </div>
      </div>
    </div>
    <!-- 2 -->
    <!-- <div class="section">
      <h2 class="tmp-title">
        固定科目结算金额
      </h2>
      <div class="el-row">
        <div class="el-col el-col-8">
          <slot name="settleConfigValue1"></slot>
        </div>
        <div class="el-col el-col-8">
          <slot name="settleConfigAmount1"></slot>
        </div>
        <div class="el-col el-col-8">
          <slot name="settleConfigValue2"></slot>
        </div>
        <div class="el-col el-col-8">
          <slot name="settleConfigAmount2"></slot>
        </div>
        <div class="el-col el-col-8">
          <slot name="settleConfigValue3"></slot>
        </div>
        <div class="el-col el-col-8">
          <slot name="settleConfigAmount3"></slot>
        </div>
      </div>
    </div> -->
    <!-- 3 -->
    <div class="section">
      <h2 class="tmp-title">
        收款信息
      </h2>
      <div class="el-row ">
        <div class="el-col el-col-6 width_skrink">
          <slot name="receivePerson"></slot>
        </div>

       <!--  <div class="el-col el-col-6">
          <slot name="payMethod"></slot>
        </div> -->


        <div class="el-col el-col-6">
          <slot name="driverPayeeBankName"></slot>
        </div>
        <div class="el-col el-col-6">
          <slot name="driverPayeeBankAccountName"></slot>
        </div>
        <div class="el-col el-col-6 ">
          <slot name="driverPayeeBankAccountNo"></slot>
        </div>
        <div class="el-col el-col-6 sepline">
          <slot name="payeeDriverPhone"></slot>
        </div>
        <div class="el-col el-col-6 sepline">
          <slot name="driverPayeeBankAccountDescription"></slot>
        </div>
        <div class="el-col el-col-12 sepline">
          <slot name="driverFuelCardNo"></slot>
        </div>
        <div class="el-col el-col-24 el-col-description">
          <slot name="settleReason"></slot>
        </div>
      </div>
    </div>
    <div class="form-button">
      <slot name="buttonSave"></slot>
      <slot name="buttonSubmit"></slot>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      domainObject: Object,
      isEdit: Boolean,
      editable: Boolean,
      addMode: Boolean,
      objectName: ''
    },
    data(){
      return{
        projectName:''
      }
    },
    computed:{
      showEditDeductWater() {
        return false;
      },
      showTip() {
        return true;
      }
    },
    mounted() {
      console.log('layout mounted', this.$slots);
    },
    created() {
      // console.log('123');
       this.projectName = JSON.parse(localStorage.getItem('appInfo')).projectName || '';
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../assets/sass/base.scss";

  // 收款人 input 变小点，适配
  .width_skrink {
    .el-input {
      width: 100px !important;
    }

  }
  
  .settle-box {
    .tmp-title {
      margin-right: 0 !important;
    }
    .el-row {
      padding: 20px 0 !important;
    }
  }


  .info-section {
    margin-top: 20px;
    padding: 0 !important;
    .tit {
      margin-bottom: 7px;
      padding: 14px 10px;
      background-color: transparent;
      border-top: solid 1px #ddd;
      border-bottom: solid 1px #ddd;
    }
    .el-col-8,.el-col-12 {
      border-right: solid 1px #ddd;
      height: auto !important;
      &:nth-child(3) {
        border-right: 0;
      }
    }
    .el-col-12 {
      &:nth-child(2) {
        border-right: 0;
      }
    }
    .total-section {
      .el-col-8 {
        border-right: 0;
      }
    }
    .el-form-item__label {
      width: 180px !important;
    }
    .el-form-item__content {
      margin-left: 180px !important;
      .el-form-item__content {
        margin-left: 0 !important;
      }
    }
    .help-tooltip {
      left: 125px;
    }
    .el-col-settleDriverPayment {
      .help-tooltip {
        left: 160px;
      }
    }
    .el-col-settleDriverRealPayment {
      .help-tooltip {
        left: 112px;
      }
    }
    .el-col-settleConfigAmount3 {
      .help-tooltip {
        left: 62px;
      }
    }
    .el-col-settleClientOrgPayee {
      .help-tooltip {
        left: 112px;
      }
    }
    .el-col-settleReceiveTotal {
      .help-tooltip {
        left: 100px;
      }
    }
    .el-col-settlePayableTotal {
      .help-tooltip {
        left: 100px;
      }
    }
    .el-col-settleGrossProfit {
      .help-tooltip {
        left: 75px;
      }
    }

  }
  .el-col-highlight {
    height: 44px !important;
    padding: 10px 0 7px;
    font-weight: 700;
    border-top: solid 1px #ddd;
    border-bottom: solid 1px #ddd;
    background-color: #fff2b5;
    .help-tooltip {
      top: 12px;
      font-weight: 400;
    }
  }
  .total-section {
    padding: 10px 0 3px;
    background-color: #f6f6f6;
    border: solid 1px #ddd;
  }
  .mode-section {
    clear: both;
    padding: 10px;
    font-size: 14px;
    color: #666;
    line-height: 1.4;
  }


  .form-button {
    text-align: center;
    padding: 20px;
    .el-button {
      margin: 0 20px;
    }
  }
  .el-form-item__label {
    font-size: 13px;
  }
  .el-textarea__inner {
    min-width: auto !important;
  }
  .el-col {
    position: relative;
    height: 34px;
  }
  .block {
    .innerblock {
      &:last-child {
        margin-right: 0;
      }
    }
  }
  .sepline {
    padding-bottom: 10px;
    margin-bottom: 10px;
    border-bottom: solid 1px #ddd;
  }
  .form-page {
    .el-select {
      vertical-align: top !important;
    }
  }
  .el-col-adjust {
    position: relative;
    .el-form-item__label {
      width: 140px !important;
    }
    .el-form-item__content {
      margin-left: 140px !important;
      .el-form-item__content {
        margin-left: 0 !important;
      }
    }
  }
  .el-col-org {
    font-size: 18px;
    font-weight: 700;
    color: #f48400;
    .el-form-item__label {
      width: 120px !important;
    }
    .el-form-item__content {
      margin-left: 120px !important;
      .el-form-item__content {
        margin-left: 0 !important;
      }
    }
  }
  .help-tooltip {
    position: absolute;
    top: 2px;
    left: 76px;
    .help {
      display: inline-block;
      width: 16px;
      height: 16px;
      line-height: 16px;
      text-align: center;
      background-color: #fcfcfc;
      border: solid 1px #ddd;
      border-radius: 3px;
      cursor: pointer;
      &:hover {
        background-color: #fff;
      }
    }
  }
  .el-col-adjust {
    .help-tooltip {
      left: 116px;
    }
  }
  .el-col-driverPrice {
    .el-select {
      &::before {
        content: '';
        position: absolute;
        z-index: 20;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-color: rgba(255, 255, 255, .3);
        cursor: not-allowed;
      }
    }
    .el-select:hover .el-input__inner {
      border-color: #dadada;
    }
  }
  @media (max-width: 1366px) {
    .el-select {
      width: 164px;
    }
    .complex-control-2 {
      .el-input {
        width: 83px;
      }
      .el-select {
        width: 70px !important;
      }
    }
    .form-page .innerblock {
      margin-right: 3px !important;
    }
    .form-page .innerblock .el-date-editor {
      width: 165px !important;
    }
  }
</style>
