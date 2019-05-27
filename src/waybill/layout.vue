<template>
  <div class="custom-page fix-input-page ishn" id='page_waybill_layout'>
    <div class="page-header clearfix">
      <h2 class="page-title fl">
        {{ isEdit ? ( editable ? '编辑' + objectName : objectName + '详情' ): ( '新建' + objectName) }}
      </h2>
      <div class="hd-opr fr">
        <slot name="buttonEdit"></slot>
        <slot name="buttonCancel"></slot>
        <slot name="buttonSave"></slot>
        <!--<slot name="buttonChangeLog"></slot>-->
      </div>
      <span id="pageRefresh" class="page-refresh fr"><i class="ico-refresh"></i>刷新</span>
    </div>
    <!-- mode-select -->
    <div class="mode-select" :class="[disableModeSelect ? 'disabled' : '']" v-if="!disableModeSelect">
      <div class="el-row">
        <div class="el-col-24">
          <slot name="scheduleType"></slot>
          <span class="tip-info" v-show="domainObject.scheduleType === 'self'">您选择的是<strong class="org">“自助调车模式”</strong>，您需要自己跟司机结算。</span>
          <span class="tip-info" v-show="domainObject.scheduleType === 'platform'">您选择的是<strong class="org">“委托调车模式”</strong>，您可委托平台跟司机结算。</span>
        </div>
      </div>
    </div>
    <div class="section" v-if="!reOrder">
      <h2 class="tmp-title">车辆司机</h2>
      <div class="el-row">
        <div class="el-col el-col-8 sepline">
          <slot name="truckLicenseNo"></slot>
        </div>
        <div class="el-col el-col-8 sepline">
          <slot name="trailerTruckLicenseNo"></slot>
        </div>
          <div class="clearfix clear">
            <div class="el-col-24">
              <div class="el-col el-col-12 el-normal">
                <slot name="driverFullName"></slot>
              </div>
              <div class="el-col el-col-12">
                <slot name="driverPhone"></slot>
              </div>
              <div class="el-col el-col-12">
                <slot name="driverLicenseNo"></slot>
              </div>

            </div>
          </div>

      </div>
    </div>
    <!-- 1 -->
    <div class="section">
      <h2 class="tmp-title">
        基本信息
      </h2>
      <div class="el-row basic-info">
        <div class="el-col el-col-6" v-show="showAddFields">
          <slot name="waybillNo"></slot>
        </div>
        <div class="el-col el-col-12" v-show="showAddFields">
          <slot name="logisticsCode"></slot>
        </div>
        <div class="el-col el-col-6" v-show="showAddFields">
          <slot name="freightNo"></slot>
        </div>
        <div class="el-col el-col-6" :class="showAddFieldsDFXW ? '' : 'sepline'">
          <slot name="waybillStatus"></slot>
        </div>
        <div class="el-col el-col-6" :class="showAddFieldsDFXW ? '' : 'sepline'">
          <slot name="settleStatus"></slot>
        </div>
        <div class="el-col el-col-6" :class="showAddFieldsDFXW ? '' : 'sepline'">
          <slot name="reportStatus"></slot>
        </div>
        <!-- 打印状态 -->
        <div class="el-col el-col-6" :class="showAddFieldsDFXW ? '' : 'sepline'">
          <slot name="dispatchPrintStatus"></slot>
        </div>
        <!--salesType  -->
        <div class="el-col el-col-24 sepline" v-if='showAddFieldsDFXW'>
          <slot name="salesType"></slot>
        </div>
        <div class="highlight-bg clearfix clear">
          <div class="el-col el-col-12">
            <slot name="clientOrg"></slot>
          </div>
          <div class="el-col el-col-12">
            <slot name="carrierOrg"></slot>
          </div>
          <!-- 运价 -->
          <div class="el-col el-col-12">
            <slot name="clientFreightPrice"></slot>
          </div>
          <div class="el-col el-col-12">
            <slot name="driverPrice"></slot>
          </div>
          <div class="el-col el-col-12">
            <slot name="clientSettleMethod"></slot>
          </div>
          <div class="el-col el-col-12">
            <slot name="settleMethod"></slot>
          </div>
          <div class="el-col el-col-24 el-long">
            <slot name="ratesDescription"></slot>
          </div>
          <!-- <div class="el-col el-col-6" v-show="editable">
            暂时先注释
            <slot name="ratesCode"></slot>
          </div> -->
        </div>
        <!--         <div class="el-col el-col-6 top-line">
          <slot name="businessType"></slot>
        </div> -->
        <div class="el-col-24 top-line">
          <slot name="goodsType"></slot>
        </div>
        <!--         <div class="el-col el-col-6 top-line">
          <slot name="goodsName"></slot>
        </div> -->
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
        <div class="el-col el-col-24">
          <slot name="route"></slot>
        </div>
        <div class="el-col el-col-12">
          <slot name="standardDistance"></slot>
        </div>
        <div class="el-col el-col-12">
          <slot name="businessType"></slot>
        </div>
        <div class="light-bg clearfix clear">
          <div class="el-col el-col-12 el-long">
            <slot name="loadingOrgName"></slot>
          </div>
          <div class="el-col el-col-12 el-long">
            <slot name="unloadingOrgName"></slot>
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
          <div class="el-col el-col-12">
            <slot name="loadingArea"></slot>
          </div>
          <div class="el-col el-col-12">
            <slot name="unloadingArea"></slot>
          </div>
          <div class="el-col el-col-12 el-long el-col-auto">
            <slot name="loadingAddr"></slot>
          </div>
          <div class="el-col el-col-12 el-long el-col-auto">
            <slot name="unloadingAddr"></slot>
          </div>
          <!-- 是否同步更新 -->
          <div class="el-col el-col-24 hide-tit" v-show="editable" v-if="checkPms">
            <slot name="isUpdate"></slot>
          </div>
        </div>
        <!--         <div class="el-col el-col-24 top-line">
          <slot name="waybillTagList"></slot>
        </div> -->
      </div>
      <template v-if="clientDetailColumns.length > 0">
        <h2 class="tmp-title">
            扩展信息
        </h2>
        <div class="el-row">
          <div class="el-col el-col-6" v-for="field in clientDetailColumns" :class='field'>
            <slot :name="field"></slot>
          </div>
        </div>
      </template>
      <div v-if='showSettleConfigValue' class="tmp-title item-toggle-header clearfix" title="点击展开收起费用科目设定" @click="toggleShow()">
        <h2 class="fl">
                费用科目设定
            </h2>
        <span class="fr">
          <i :class="[defaultShow ? 'el-icon-caret-bottom' : 'el-icon-caret-right']"></i>
        </span>
      </div>
      <div class="fee-info" v-show="defaultShow">
        <!-- <div class="clearfix clear sepline">
          <div class="el-col el-col-8">
            <slot name="settleConfigValue1"></slot>
          </div>
          <div class="el-col el-col-8">
            <slot name="settleConfigValue2"></slot>
          </div>
          <div class="el-col el-col-8">
            <slot name="settleConfigValue3"></slot>
          </div>
        </div> -->
        <div v-if="isEdit" class='slotChargeList'>
          <slot name="slotChargeList"></slot>
        </div>
      </div>
      <!-- 货单列表 start =========================== -->
      <!--       <div v-if="isEdit && renderInvoiceList" class="tmp-title item-toggle-header clearfix" title="点击展开收起货单信息" @click="showInvoiceList = !showInvoiceList">
        <h2 class="fl">
          货单信息
        </h2>
        <span class="fr">
          <i :class="[showInvoiceList ? 'el-icon-caret-bottom' : 'el-icon-caret-right']"></i>
        </span>
      </div>
      <div class="fee-info" v-show="showInvoiceList">
        <div v-if="isEdit" class='slotChargeList'>
          <slot name="slotInvoiceList"></slot>
        </div>
      </div> -->
      <template v-if='isShowEleManifestList'>
        <h2 class="tmp-title">
            货物信息
        </h2>
        <div class="fee-info">
          <slot name="manifestModule"></slot>
        </div>
      </template>
      <div class="manifestmodulefotter clearfix clear">
        <!-- 无车承运上报货物类型 -->
        <div class="el-col el-col-12 label-width-auto">
          <slot name="reportCargoTypeClassificationCode"></slot>
        </div>
        <!-- 无车承运上报货物名称 -->
        <div class="el-col el-col-12 label-width-auto">
          <slot name="goodsName"></slot>
        </div>
      </div>
      <!-- 货单列表 end =========================== -->
    </div>
    <div class="section" v-if="reOrder">
      <div v-if="showLoadingUnloading" class="re_de_goods">
        <!-- <h2 class="tmp-title">收发货</h2> -->
        <div class="el-row small-img-upload">
          <div class="el-col el-col-12">
            <slot name="loadingTime"></slot>
          </div>
          <div class="el-col el-col-12">
            <slot name="loadingInputUserFullName"></slot>
          </div>
          <div class="el-col el-col-12 bottom_line">
            <slot name="loadingAttachment"></slot>
          </div>
          <div class="el-col el-col-12 show-gps-icon bottom_line">
            <slot name="loadingLocation"></slot>
          </div>
          <div class="el-col el-col-12">
            <slot name="unloadingTime"></slot>
          </div>
          <div class="el-col el-col-12">
            <slot name="unloadingInputUserFullName"></slot>
          </div>
          <div class="el-col el-col-12">
            <slot name="unloadingAttachment"></slot>
          </div>
          <div class="el-col el-col-12 show-gps-icon">
            <slot name="unloadingLocation"></slot>
          </div>
        </div>
      </div>
      <h2 class="tmp-title">车辆司机</h2>
      <div class="el-row">
        <div class="el-col el-col-8 sepline">
          <slot name="truckLicenseNo"></slot>
        </div>
        <div class="el-col el-col-8 sepline">
          <slot name="trailerTruckLicenseNo"></slot>
        </div>
          <div class="clearfix clear">
            <div class="el-col-24">
              <div class="el-col el-col-12 el-normal">
                <slot name="driverFullName"></slot>
              </div>
              <div class="el-col el-col-12">
                <slot name="driverPhone"></slot>
              </div>
              <div class="el-col el-col-12">
                <slot name="driverLicenseNo"></slot>
              </div>
            </div>
          </div>
      </div>
    </div>
    <div v-if="showAccount">
      <h2 class="tmp-title">收款账户</h2>
      <!-- 标准 布局配置 start  -->
      <div class="el-row bank-account">
        <div class="el-col el-col-12 el-col-auto">
          <!-- <h3 class="tit">主驾</h3> -->
          <!-- 主驾收款人 -->
          <div class="el-col el-col-24 el-normal">
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
          <!-- <h3 class="tit">副驾</h3> -->
          <!-- 副驾收款人 -->
          <div class="el-col el-col-24 el-normal">
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
    <div>
      <h2 class="tmp-title">其它信息</h2>
      <div class="el-row other-info">
        <template v-if="showLogisticsReference">
          <slot name="logisticsReference"></slot>
        </template>
        <div class="el-col el-col-12">
          <slot name="departDate"></slot>
        </div>
        <div class="el-col el-col-12">
          <slot name="returnDate"></slot>
        </div>
        <div class="el-col el-col-12">
          <slot name="goodsWeight"></slot>
        </div>
        <div class="el-col el-col-12">
          <slot name="goodsVolume"></slot>
        </div>
        <div class="el-col el-col-24">
          <slot name="goodsNum"></slot>
        </div>
        <div class="el-col el-col-24 el-col-description">
          <slot name="description"></slot>
        </div>

        <!-- 运单取消原因 -->
        <div class="el-col el-col-12 el-col-description" v-show="isEdit">
          <slot name="cancelReason"></slot>
        </div>
        <!-- 运单取消操作人 -->
        <div class="el-col el-col-12" v-show="isEdit">
          <slot name="cancelExecuteUserFullName"></slot>
        </div>
        <!-- 运单取消时间 -->
        <div class="el-col el-col-24" v-show="isEdit">
          <slot name="cancelExecuteTime"></slot>
        </div>
        <!-- 协议 -->
        <div class="el-col el-col-24" v-show="domainObject.scheduleType === 'platform'">
          <slot name="agree"></slot>
        </div>
      </div>
    </div>
    <el-tabs type="border-card" v-if="isEdit">
      <!--<el-tab-pane label="凭证记录">-->
      <!--<slot name="tabVoucherList"></slot>-->
      <!--</el-tab-pane>-->
      <el-tab-pane label="评价">
        <slot name="tabEvaluate"></slot>
      </el-tab-pane>
      <el-tab-pane label="变更记录">
        <slot name="tabChangeLog"></slot>
      </el-tab-pane>
    </el-tabs>
    <div class="form-button" v-show='editable || !isEdit'>
      <slot name="buttonSubmit"></slot>
      <slot name="buttonReset"></slot>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import { get as routeGet } from '../../api/RouteService';
import Slider from "../components/slider/index";
import * as utils from '../../api/Utils';
export default {
  components: { Slider },
  props: {
    domainObject: Object,
    isEdit: Boolean,
    editable: Boolean,
    addMode: Boolean,
    objectName: '',
    showLoadingUnloading: Boolean,
    disableModeSelect: {
      type: Boolean,
      'default': false
    },
    fromDispatch: {
      type: Boolean,
      'default': false
    },
    clientDetailColumns: Array
  },
  data() {
    return {
      defaultShow: true,
      projectName: '',
      checkPms: true,
      showInvoiceList: true, //默认显示货单信息
    }
  },
  computed: {
    // 是否显示 货单列表   新建不显示
    isShowEleManifestList() {
      const searchObj = utils.getParamsFromURL(window.location.search);
      const code = searchObj.code || searchObj.logisticsCode || searchObj.originalCode || '';
      return Boolean(code);
    },
    showSettleConfigValue() {
      return false;
    },
    showAddFieldsDFXW() {
      return false;
    },
    //是否展示订单参考信息 显示字段
    showLogisticsReference() {
      const logisticsCode = utils.getParamsFromURL(window.location.search).logisticsCode;
      if (logisticsCode) {
        return true;
      }
      return false;
    },
    showAddFields() {
      let mark = true; // 默认显示
      if (!this.isEdit) {
        mark = false;
      }
      return mark;
    },
    showAccount() {
      return false;
    },
    reOrder() {
      let mark = true; // 默认显示
      if (this.fromDispatch) {
        mark = false;
      }
      return mark;
    },
    renderInvoiceList() {
      // 是否显示货单
      if (JSON.parse(localStorage.getItem('webappConfig'))['webapp.showManifest'] === 'TRUE') {
        return true;
      }
      return false;
    }
  },
  methods: {
    checkPmsNow() {
      console.log('check pms now');
      if (this.domainObject.routeCode) {
        const paramsObj = {
          code: this.domainObject.routeCode
        };
        routeGet(paramsObj, (success, error) => {
          if (error) {
            this.checkPms = false;
          }
          if (success) {
            this.checkPms = true;
          }
        });
      }
    },
    toggleShow() {
      if (this.defaultShow) {
        this.defaultShow = false;
      } else {
        this.defaultShow = true;
      }
    },
    toggleShowInvoice() {
      this.showInvoiceList = !this.showInvoiceList;
    },
    setProjectNamelocal() {
      const localStorage = window.localStorage;
      this.projectName = JSON.parse(localStorage.getItem('appInfo')).projectName || '';
    },
  },
  mounted() {
    console.log('layout mounted', this.$slots);
    // 设置 projectName
    this.setProjectNamelocal();
    const self = this;
    setTimeout(() => {
      self.checkPmsNow();
    }, 500);
  },
  created() {
    console.log('123========================', this.disableModeSelect);
    const localStorage = window.localStorage;
    this.projectName = JSON.parse(localStorage.getItem('appInfo')).projectName || '';

    // 是否显示货单
    if (JSON.parse(localStorage.getItem('webappConfig'))['webapp.showManifest'] === 'TRUE') {
      this.showInvoiceList = true;
    }
  }
};

</script>
<style lang="scss" rel="stylesheet/scss">
@import "../assets/sass/base.scss";

#page_waybill_layout {
  .re_de_goods {
    margin: 20px;
    padding: 0px !important;
    border: 1px solid #efefef;
    .bottom_line {
      height: 40px !important;
      border-bottom:1px dashed #efefef;
    }
  }

  .manifestmodulefotter {
    background-color: #E6E6E6;
    margin-bottom: 10px;
    padding-top: 10px;
    border-top: 1px dashed #C6C6C6;

    margin-left: 20px;
    margin-right: 20px;
    margin-top: -20px;
  }
}

.fuelCompany {
  width: 50% !important;

  .el-autocomplete .el-input {
    width: 338px !important;
  }
}

.hide-tit {
  .el-form-item__label {
    display: none;
  }

  .el-form-item__content {
    margin-left: 10px !important;

    .el-form-item__content {
      margin-left: 0 !important;
    }
  }
}


.ishn {

  .el-col-6,
  .el-col-8,
  .el-col-18 {
    width: 50%;
  }

  .sepline {
    padding-bottom: 0 !important;
    margin-bottom: 0 !important;
    border-bottom: 0 !important;
  }

  .el-select {
    width: 174px !important;
  }

  .complex-control-2 {
    .el-input {
      width: 174px !important;
    }

    .el-select {
      width: 142px !important;

      .el-input {
        width: 100% !important;
      }
    }
  }

  .el-dialog__body {
    .el-input {
      width: 110px !important;
    }
  }

  .selectGood .block {
    margin-left: 0 !important;
  }
}

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

.mode-select.disabled {
  position: relative;

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

.agree-box {
  padding: 20px 10px;
}

.rule-frame {
  width: 100%;
  height: 300px;
}

.show-gps-icon {
  .el-form-item__label {
    display: none;
  }

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
  box-sizing: content-box;
  padding-bottom: 8px !important;
  margin-bottom: 15px !important;
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

.loading-info,
.fee-info {
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

.fix-input-page {

  .el-col-12 .el-autocomplete .el-input,
  .el-col-12.el-long .el-input {
    width: 338px !important;
  }

  .el-normal .el-autocomplete .el-input {
    width: 174px !important;
  }

  .selectArea .el-select {
    width: 110px !important;
  }

  .goodsWeight {
    .el-form-item__content {
      .goodsWeight {
        @media (max-width: 1366px) {
          width: 80px;
        }
      }
    }
  }
}

@media (max-width: 1366px) {
  .el-select {
    width: 164px;
  }

  .complex-control-2 {
    .el-input {
      width: 118px;
    }

    .el-select {
      width: 90px !important;
    }
  }

  .el-price {
    .el-input {
      width: 100px;
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

.col-des {
  .el-form-item__label {
    width: 130px !important;
  }
}

</style>
