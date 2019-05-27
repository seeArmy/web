<template>
  <div class="custom-page">
    <div class="page-header clearfix">
      <h2 class="page-title fl">
        {{ isEdit ? ( editable ? '编辑' + objectName : objectName + '详情' ): ( '新建' + objectName) }}
      </h2>
      <div class="hd-opr fr">
        <!-- <slot name="buttonEdit"></slot>
        <slot name="buttonCancel"></slot>
        <slot name="buttonSave"></slot> -->
        <!-- <slot name="buttonChangeLog"></slot> -->
      </div>
      <span id="pageRefresh" class="page-refresh fr"><i class="ico-refresh"></i>刷新</span>
    </div>
    <!-- mode-select -->
    <div class="mode-select">
      <div class="el-row">
        <div class="el-col-24">
          <slot name="scheduleType"></slot>
          <span class="tip-info" v-show="domainObject.scheduleType === 'self'">您选择的是<strong class="org">“自助调车模式”</strong>，您需要自己跟司机结算。</span>
          <span class="tip-info" v-show="domainObject.scheduleType === 'platform'">您选择的是<strong class="org">“委托调车模式”</strong>，您可委托平台跟司机结算。</span>
        </div>
      </div>
    </div>
    <!-- 1 -->
    <div class="section">
      <h2 class="tmp-title">
        基本信息
      </h2>
      <div class="el-row basic-info">
        <div class="el-col el-col-6">
          <slot name="waybillNo"></slot>
        </div>
        <div class="el-col el-col-6">
          <slot name="logisticsCode"></slot>
        </div>
        <div class="el-col el-col-12">
          <slot name="freightNo"></slot>
        </div>
        <div class="el-col el-col-6 sepline">
          <slot name="waybillStatus"></slot>
        </div>
        <div class="el-col el-col-6 sepline">
          <slot name="settleStatus"></slot>
        </div>
        <div class="el-col el-col-12 sepline">
          <slot name="reportStatus"></slot>
        </div>
        <div class="highlight-bg clearfix clear">
          <div class="el-col el-col-6">
            <slot name="clientOrg"></slot>
          </div>
          <div class="el-col el-col-6">
            <slot name="carrierOrg"></slot>
          </div>
          <div class="el-col el-col-12">
            <slot name="settleMethod"></slot>
          </div>
          <!-- 运价 -->
          <div class="el-col el-col-6">
            <slot name="clientFreightPrice"></slot>
          </div>
          <div class="el-col el-col-6">
            <slot name="driverPrice"></slot>
          </div>
          <div :class="[editable ? 'el-col el-col-6' : 'el-col el-col-12']">
            <slot name="ratesDescription"></slot>
          </div>
          <div class="el-col el-col-6" v-show="editable">
            <!-- 暂时先注释 -->
            <!-- <slot name="ratesCode"></slot> -->
          </div>
        </div>
        <div class="el-col el-col-6 top-line">
          <slot name="businessType"></slot>
        </div>
        <div class="el-col el-col-6 top-line">
          <slot name="goodsType"></slot>
        </div>
        <div class="el-col el-col-6 top-line">
          <slot name="goodsName"></slot>
        </div>
        <div class="el-col el-col-6 top-line">
          <slot name="goodsPrice"></slot>
        </div>
        <div class="el-col el-col-6 sepline">
          <slot name="meterageType"></slot>
        </div>
        <div class="el-col el-col-18 sepline">
          <slot name="freightLoss"></slot>
        </div>

        <!-- <div class="el-col el-col-8 sepline" v-show="!editable">
          <slot name="clientFreightPrice"></slot>
        </div>
        <div class="el-col el-col-8 sepline" v-show="!editable">
          <slot name="driverPrice"></slot>
        </div>
        <div class="el-col el-col-8 sepline" v-show="!editable">
          <slot name="ratesDescription"></slot>
        </div> -->
        <!-- 线路名称 -->
        <div class="el-col el-col-6">
          <slot name="route"></slot>
        </div>
        <div class="el-col el-col-18">
          <slot name="standardDistance"></slot>
        </div>
        <div class="light-bg clearfix clear">
          <div class="el-col el-col-12">
            <slot name="loadingOrgName"></slot>
          </div>
          <div class="el-col el-col-12">
            <slot name="unloadingOrgName"></slot>
          </div>
          <div class="el-col el-col-12">
            <slot name="loadingArea"></slot>
          </div>
          <div class="el-col el-col-12">
            <slot name="unloadingArea"></slot>
          </div>
          <div class="el-col el-col-12">
            <slot name="loadingAddr"></slot>
          </div>
          <div class="el-col el-col-12">
            <slot name="unloadingAddr"></slot>
          </div>
          <div class="el-col el-col-12">
            <slot name="loadingUserFullName"></slot>
          </div>
          <div class="el-col el-col-12">
            <slot name="unloadingUserFullName"></slot>
          </div>
          <div class="el-col el-col-12">
            <slot name="loadingUserPhone"></slot>
          </div>
          <div class="el-col el-col-12">
            <slot name="unloadingUserPhone"></slot>
          </div>
        </div>

        <div class="el-col el-col-24 top-line">
          <slot name="waybillTagList"></slot>
        </div>
      </div>


      <template v-if="clientDetailColumns.length > 0">
        <h2 class="tmp-title">
            扩展信息
        </h2>
        <div class="el-row">
          <div class="el-col el-col-6" v-for="field in clientDetailColumns">
            <slot :name="field"></slot>
          </div>
        </div>
      </template>

      <div class="tmp-title item-toggle-header clearfix" title="点击展开收起费用科目设定" @click="toggleShow()">
        <h2 class="fl">
                费用科目设定
            </h2>
        <span class="fr">
          <i :class="[defaultShow ? 'el-icon-caret-bottom' : 'el-icon-caret-right']"></i>
        </span>
      </div>
      <div class="fee-info" v-show="defaultShow">
        <div class="clearfix clear sepline">
          <div class="el-col el-col-8">
            <slot name="settleConfigValue1"></slot>
          </div>
          <div class="el-col el-col-8">
            <slot name="settleConfigValue2"></slot>
          </div>
          <div class="el-col el-col-8">
            <slot name="settleConfigValue3"></slot>
          </div>
        </div>
        <div v-if="isEdit" class='slotChargeList'>
          <slot name="slotChargeList"></slot>
        </div>
      </div>
    </div>
    <div class="section">
      <h2 class="tmp-title">车辆司机</h2>
      <div class="el-row">
        <div class="el-col el-col-8 sepline">
          <slot name="truckLicenseNo"></slot>
        </div>
        <div class="el-col el-col-8 sepline">
          <slot name="trailerTruckLicenseNo"></slot>
        </div>
        <div class="el-col el-col-8 sepline">
          <slot name="truckPowerType"></slot>
        </div>
        
          <div class="clearfix clear">
            <div class="el-col-24">
              <div class="el-col el-col-12">
                <slot name="driverFullName"></slot>
              </div>
              <div class="el-col el-col-12">
                <slot name="driverPhone"></slot>
              </div>
              <div class="el-col el-col-12">
                <slot name="driverLicenseNo"></slot>
              </div>
              <div class='el-col el-col-12'>
                <slot name="driverFuelCardNo"></slot>
              </div>
            </div>
          </div>

      </div>
    </div>
    <div v-if="showAccount">
      <h2 class="tmp-title">收款账户</h2>
      <div class="el-row bank-account">
        <div class="el-col el-col-12 el-col-auto">
          <h3 class="tit">主驾</h3>
          <!-- 主驾收款人 -->
          <div class="el-col el-col-24">
            <slot name="payeeDriverFullName"></slot>
          </div>
          <!-- 主驾开户行 -->
          <div class="el-col el-col-24">
            <slot name="driverPayeeBankName"></slot>
          </div>
          <!-- 主驾银行户名 -->
          <div class="el-col el-col-24">
            <slot name="driverPayeeBankAccountName"></slot>
          </div>
          <!-- 主驾银行账号 -->
          <div class="el-col el-col-24">
            <slot name="driverPayeeBankAccountNo"></slot>
          </div>
          <!-- 主驾银行账号备注 -->
          <div class="el-col el-col-24">
            <slot name="driverPayeeBankAccountDescription"></slot>
          </div>
        </div>
        <div class="el-col el-col-12 el-col-auto">
          <h3 class="tit">副驾</h3>
          <!-- 副驾收款人 -->
          <div class="el-col el-col-24">
            <slot name="payeeViceDriverFullName"></slot>
          </div>
          <!-- 副驾开户行 -->
          <div class="el-col el-col-24">
            <slot name="viceDriverPayeeBankName"></slot>
          </div>
          <!-- 副驾银行户名 -->
          <div class="el-col el-col-24">
            <slot name="viceDriverPayeeBankAccountName"></slot>
          </div>
          <!-- 副驾银行账号 -->
          <div class="el-col el-col-24">
            <slot name="viceDriverPayeeBankAccountNo"></slot>
          </div>
          <!-- 副驾银行账号备注 -->
          <div class="el-col el-col-24">
            <slot name="viceDriverPayeeBankAccountDescription"></slot>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showLoadingUnloading" >
      <h2 class="tmp-title">收发货</h2>
      <div class="el-row loading-info small-img-upload">
        <div class="el-col el-col-12 el-col-auto">
          <h3 class="tit">发货</h3>
          <div class="el-col el-col-24">
            <slot name="loadingGoodsWeight"></slot>
          </div>
          <div class="el-col el-col-24">
            <slot name="loadingGoodsVolume"></slot>
          </div>
          <div class="el-col el-col-24">
            <slot name="loadingGoodsNum"></slot>
          </div>
          <div class="el-col el-col-24">
            <slot name="loadingTime"></slot>
          </div>
          <div class="el-col el-col-24 el-col-auto">
            <slot name="loadingAttachment"></slot>
          </div>
          <!-- 发货位置 -->
          <div class="el-col el-col-24 el-col-auto show-gps-icon">
            <slot name="loadingLocation"></slot>
          </div>
        </div>
        <div class="el-col el-col-12 el-col-auto">
          <h3 class="tit">收货</h3>
          <div class="el-col el-col-24">
            <slot name="unloadingGoodsWeight"></slot>
          </div>
          <div class="el-col el-col-24">
            <slot name="unloadingGoodsVolume"></slot>
          </div>
          <div class="el-col el-col-24">
            <slot name="unloadingGoodsNum"></slot>
          </div>
          <div class="el-col el-col-24">
            <slot name="unloadingTime"></slot>
          </div>
          <div class="el-col el-col-24 el-col-auto">
            <slot name="unloadingAttachment"></slot>
          </div>
          <!-- 收货位置 -->
          <div class="el-col el-col-24 el-col-auto show-gps-icon">
            <slot name="unloadingLocation"></slot>
          </div>
        </div>
      </div>
    </div>
    <div>
      <h2 class="tmp-title">其它信息</h2>
      <div class="el-row other-info">
        <div class="el-col el-col-12">
          <slot name="departDate"></slot>
        </div>
        <div class="el-col el-col-12">
          <slot name="returnDate"></slot>
        </div>
        <div class="el-col el-col-12" v-if="showAccount">
          <slot name="departMileage"></slot>
        </div>
        <div class="el-col el-col-12" v-if="showAccount">
          <slot name="returnMileage"></slot>
        </div>
        <div class="el-col el-col-24 el-col-description">
          <slot name="description"></slot>
        </div>
        <div class="el-col el-col-12 el-col-adjust" v-show="!editable">
          <slot name="originalConsignOrg"></slot>
        </div>
        <div class="el-col el-col-12 el-col-adjust" v-show="!editable">
          <slot name="consignOrg"></slot>
        </div>
        <!-- 协议 -->
        <div class="el-col el-col-24" v-show="domainObject.scheduleType === 'platform'">
          <slot name="agree"></slot>
        </div>
      </div>
    </div>
    <el-tabs type="border-card" v-if="isEdit">
      <!-- <el-tab-pane label="凭证记录">
        <slot name="tabVoucherList"></slot>
      </el-tab-pane> -->
      <el-tab-pane label="变更记录">
        <slot name="tabChangeLog"></slot>
      </el-tab-pane>
    </el-tabs>
    <!-- <div class="form-button" v-show='editable || !isEdit'>
      <slot name="buttonSubmit"></slot>
      <slot name="buttonReset"></slot>
    </div> -->
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      domainObject: Object,
      isEdit: Boolean,
      editable: Boolean,
      addMode: Boolean,
      objectName: '',
      clientDetailColumns: Array,
      showLoadingUnloading: Boolean
    },
    data() {
      return {
        defaultShow: true,
        projectName: JSON.parse(localStorage.getItem('appInfo')).projectName
      }
    },
    computed: {
      showAccount() {
        return false;
      }
    },
    methods: {
      toggleShow() {
        if (this.defaultShow) {
          this.defaultShow = false;
        } else {
          this.defaultShow = true;
        }
      }
    },
    mounted() {
      console.log('layout mounted', this.$slots);
    },
    created() {
      // console.log('123');
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../../assets/sass/base.scss";
  .item-toggle-header {
    cursor: pointer;
    &:hover {
      background-color: #eee !important;
    }
    .fl {
      font-weight: 700;
    }
  }
  .clear {
    clear: both;
  }

  .light-bg {
    padding-top: 10px;
    background-color: #f8f8f8;
  }

  .highlight-bg {
    padding-top: 10px;
    background-color: #fff5c0;
  }

  .top-line {
    box-sizing: content-box;
    margin-top: 15px;
    padding-top: 15px;
    border-top: solid 1px #ddd;
  }

  .solid-box {
    border: solid 1px #ddd;
  }

  .fee-info {
    margin: 20px;
  }

  .mode-select {
    .el-row {
      padding-bottom: 0 !important;
    }
    .el-col-24 {
      position: relative;
      .tip-info {
        position: absolute;
        top: 5px;
        left: 330px;
        color: #999;
        font-size: 14px;
      }
    }
  }
  .agree-box {
    padding: 20px 10px;
    font-size: 14px;
  }
  .rule-frame {
    width: 100%;
    height: 300px;
  }
  .show-gps-icon {
    .complex-control-1 {
      &::before {
        content: '';
        display: inline-block;
        vertical-align: middle;
        width: 24px;
        height: 24px;
        margin-right: 5px;
        background: url(./gps.png) no-repeat 0 0;
        background-size: 24px 24px;
      }
    }
  }
  .el-col-adjust {
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
  .form-button {
    text-align: center;
    padding: 20px;
  }
  .el-form-item__label {
    font-size: 13px;
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
  .basic-info {
    padding-bottom: 0 !important;
  }
  .bank-account {
    .tit {
      padding-left: 10px;
      margin-bottom: 10px;
      font-size: 14px;
      font-weight: 700;
    }
    .el-input {
      width: 320px;
    }
  }
  .loading-info, .fee-info {
    .tit {
      padding-left: 10px;
      margin-bottom: 10px;
      font-size: 14px;
      font-weight: 700;
    }
  }
  .el-tabs {
    margin-top: 20px;
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
      width: auto !important;
      margin-right: 3px !important;
    }
    .form-page .innerblock .el-date-editor {
      width: 165px !important;
    }
  }
</style>
