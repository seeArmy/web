<template>
  <div class="custom-page fix-input-page" id='page_outsourcingwaybill_layout ishn'>
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
    <div class="mode-select" :class="[disableModeSelect ? 'disabled' : '']">
      <!-- <div class="el-row"> -->
      <!-- <div class="el-col-24"> -->
      <!-- <slot name="scheduleType"></slot> -->
      <!--   <span class="tip-info" v-show="domainObject.scheduleType === 'self'">您选择的是<strong class="org">“自助调车模式”</strong>，您需要自己跟司机结算。</span>
          <span class="tip-info" v-show="domainObject.scheduleType === 'platform'">您选择的是<strong class="org">“委托调车模式”</strong>，您可委托平台跟司机结算。</span> -->
      <!-- </div> -->
      <!-- </div> -->
    </div>
    <!-- 1 -->
    <div class="section">
      <h2 class="tmp-title">
        基本信息
      </h2>
      <div class="el-row basic-info">
        <!-- 运单号 -->
        <div class="el-col el-col-8" v-show="showAddFields">
          <slot name="waybillNo"></slot>
        </div>
        <!-- 运单状态 -->
        <div class="el-col el-col-8" v-show="showAddFields">
          <slot name="waybillStatus"></slot>
        </div>
        <!-- 来源外包订单 -->
        <div class="el-col el-col-8" v-show="showAddFields">
          <slot name="logisticsCode"></slot>
        </div>
        <!-- 承运商 -->
        <div class="el-col el-col-8">
          <slot name="carrierOrgCode"></slot>
        </div>

        <!-- 客户结算方式 -->
        <div class="el-col el-col-8">
          <slot name="clientSettleMethod"></slot>
        </div>
        <!-- salesType -->
        <div class="el-col el-col-16 sepline" v-if='showAddFieldsDFXW'>
          <slot name="salesType"></slot>
        </div>
        <!-- 外包运价 -->
        <div class="el-col el-col-12">
          <slot name="clientFreightPrice"></slot>
        </div>
        <!--运价备注  -->
        <div class="el-col el-col-23">
          <slot name="ratesDescription"></slot>
        </div>

        <!-- route线路名称 -->
        <div class="el-col el-col-23">
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
        </div>
        <!-- <div class="el-col el-col-24">
          <slot name="waybillTagList"></slot>
        </div> -->
      </div>
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
    <!-- 货单列表 start =========================== -->
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
    <!-- 货单列表 end =========================== -->
    <div class="section">
      <h2 class="tmp-title">车辆司机</h2>
      <div class="el-row">
        <!-- 车牌号 -->
        <div class="el-col el-col-8">
          <slot name="truckLicenseNo"></slot>
        </div>
        <div class="el-col el-col-8">
          <slot name="trailerTruckLicenseNo"></slot>
        </div>
        <div class="clearfix clear">
          <div class="el-col-12">
            <div class="el-col el-col-24 el-normal">
              <slot name="driverFullName"></slot>
            </div>
            <div class="el-col el-col-24">
              <slot name="driverPhone"></slot>
            </div>
            <div class="el-col el-col-24">
              <slot name="driverLicenseNo"></slot>
            </div>
            <div class='el-col el-col-24'>
              <slot name="driverFuelCardNo"></slot>
            </div>
          </div>
          <div class="el-col-12">
            <div class="el-col el-col-24 el-normal">
              <slot name="viceDriverName"></slot>
            </div>
            <div class="el-col el-col-24">
              <slot name="viceDriverPhone"></slot>
            </div>
            <div class="el-col el-col-24">
              <slot name="viceDriverLicenseNo"></slot>
            </div>
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
        <div class="el-col el-col-12" v-show="!editable">
          <slot name="creatorUser"></slot>
        </div>
        <div class="el-col el-col-12" v-show="!editable">
          <slot name="createTime"></slot>
        </div>
        <div class="el-col el-col-12" v-show="!editable">
          <slot name="updateUsername"></slot>
        </div>
      </div>
    </div>
    <div class="form-button" v-show='editable || !isEdit'>
      <slot name="buttonSubmit"></slot>
      <slot name="buttonReset"></slot>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import { getParamsFromURL, showMessageUtil, deepClone, getGoodsCategoryVal, getMeterageTypeByGoodsCategoryCode, getGoodsCategoryByKey, urlRedirect } from '../../api/Utils';
export default {
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
    clientDetailColumns: Array
  },
  data() {
    return {
      projectName: JSON.parse(localStorage.getItem('appInfo')).projectName
    }
  },
  computed: {
    // 是否显示 货单列表   新建不显示
    isShowEleManifestList() {
      const searchObj = getParamsFromURL(window.location.search);
      const code = searchObj.code || searchObj.logisticsCode || searchObj.originalCode || '';
      return Boolean(code);
    },
    showAddFieldsDFXW() {
      return false;
    },
    showAddFields() {
      let mark = true; // 默认显示
      if (!this.isEdit) {
        mark = false;
      }
      return mark;
    }
  },
  mounted() {
    console.log('layout mounted', this.$slots);
  },
  created() {}
};

</script>
<style lang="scss" rel="stylesheet/scss">
@import "../assets/sass/base.scss";

#page_outsourcingwaybill_layout {
  .fee-info {
    margin: 20px;
  }

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

.ishn {

  .el-col-6,
  .el-col-8,
  .el-col-18 {
    width: 50%;
  }

  .basic-info {
    .el-col-24 {
      width: 50%;
    }
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

  .selectGood .block {
    margin-left: 0 !important;
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

.el-col-12:nth-child(6n),
.el-col-12:nth-child(6n-1) {
  margin-bottom: 0 !important;
  border-bottom: 0 !important;
}

.bank-account .el-input {
  width: 320px;
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
