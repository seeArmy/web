<template>
  <div class="custom-page" id="inquiryPage">
    <div class="page-header clearfix">
      <h2 class="page-title fl">
        {{ isEdit ? ( editable ? '编辑' + objectName : objectName + '详情' ): (objectName) }}
      </h2>
      <div class="hd-opr fr">
        <slot name="buttonEdit"></slot>
        <slot name="buttonCancel"></slot>
        <slot name="buttonSave"></slot>
        <!-- <slot name="buttonChangeLog"></slot> -->
      </div>
      <span id="pageRefresh" class="page-refresh fr"><i class="ico-refresh"></i>刷新
      </span>
    </div>
    <!-- 1 -->
    <div class="section">
      <h2 class="tmp-title">
        基本信息
      </h2>
      <div class="el-row">
        <!-- 询价单号 -->
        <div class="el-col el-col-6">
          <slot name="rfqNo"></slot>
        </div>
        <!-- 询价单状态 -->
        <div class="el-col el-col-6">
          <slot name="rfqStatus"></slot>
        </div>
        <!-- 发布范围 -->
        <div class="el-col el-col-12">
          <slot name="releaseRange"></slot>
        </div>
        <!-- 来源订单 -->
        <!--      <div class="el-col el-col-6 sepline">
          <slot name="logisticsNo"></slot>
        </div> -->
        <!-- 托运客户  -->
        <div class="el-col el-col-6 sepline" id="clientOrg">
          <slot name="clientOrg"></slot>
        </div>
        <!-- 结算方式  -->
        <div class="el-col el-col-18 sepline">
          <slot name="settleMethod"></slot>
        </div>
        <!-- 业务类型 -->
        <div class="el-col el-col-6">
          <slot name="businessTypeCode"></slot>
        </div>
        <!-- 货物类型 -->
        <div class="el-col el-col-6">
          <slot name="cargoTypeClassificationCode"></slot>
        </div>
        <!-- 货物名称 -->
        <div class="el-col el-col-6">
          <slot name="goodsName"></slot>
        </div>
        <!-- 货物单价 -->
        <div class="el-col el-col-6">
          <slot name="goodsPrice"></slot>
        </div>
        <!-- 计量标准 -->
        <div class="el-col el-col-6 sepline">
          <slot name="meterageType"></slot>
        </div>
        <!-- 合理货差系数 -->
        <div class="el-col el-col-18 sepline">
          <slot name="freightLoss"></slot>
        </div>
        <!-- 计划总重量 -->
        <div class="el-col el-col-6">
          <slot name="goodsWeight"></slot>
        </div>
        <!-- 计划总体积 -->
        <div class="el-col el-col-6">
          <slot name="goodsVolume"></slot>
        </div>
        <!-- 计划总数量 -->
        <div class="el-col el-col-6">
          <slot name="goodsNum"></slot>
        </div>
        <!-- 需求车次 -->
        <div class="el-col el-col-6">
          <slot name="truckQty"></slot>
        </div>
        <div class="highlight-bg clearfix clear">
          <!-- 客户运价 -->
          <!--          <div class="el-col el-col-6">
            <slot name="clientFreightPrice"></slot>
          </div> -->
          <!-- 报价类型 -->
          <div class="el-col el-col-18">
            <slot name="quotePrice"></slot>
          </div>
        </div>
      </div>
      <h2 class="tmp-title">
        线路信息
      </h2>
      <div class="el-row">
        <!-- 线路名称  -->
        <div class="el-col el-col-24">
          <slot name="route"></slot>
        </div>
        <div class="light-bg clearfix clear">
          <!-- 发货单位 -->
          <div class="el-col el-col-12">
            <slot name="loadingOrg"></slot>
          </div>
          <!-- 收货单位 -->
          <div class="el-col el-col-12">
            <slot name="unloadingOrg"></slot>
          </div>
          <!-- 发货地 -->
          <div class="el-col el-col-12">
            <slot name="loadingArea"></slot>
          </div>
          <!-- 收货地 -->
          <div class="el-col el-col-12">
            <slot name="unloadingArea"></slot>
          </div>
          <!-- 发货地址 -->
          <div class="el-col el-col-12">
            <slot name="loadingAddress"></slot>
          </div>
          <!-- 收货地址 -->
          <div class="el-col el-col-12">
            <slot name="unloadingAddress"></slot>
          </div>
          <!-- 发货联系人 -->
          <div class="el-col el-col-12">
            <slot name="loadingUserFullName"></slot>
          </div>
          <!-- 收货联系人 -->
          <div class="el-col el-col-12">
            <slot name="unloadingUserFullName"></slot>
          </div>
          <!-- 发货联系电话 -->
          <div class="el-col el-col-12">
            <slot name="loadingUserPhone"></slot>
          </div>
          <!-- 收货联系电话 -->
          <div class="el-col el-col-12">
            <slot name="unloadingUserPhone"></slot>
          </div>
        </div>
      </div>
      <!-- 扩展信息 start -->
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
      <!-- 扩展信息 end -->
      <h2 class="tmp-title">
        其他信息
      </h2>
      <div class="el-row">
        <!-- 询价联系人 -->
        <div class="el-col el-col-6">
          <slot name="frqLinkman"></slot>
        </div>
        <!-- 询价联系电话 -->
        <div class="el-col el-col-6">
          <slot name="frqLinkmanPhone"></slot>
        </div>
        <!-- 报价截止日期 -->
        <div class="el-col el-col-12">
          <slot name="frqEndTime"></slot>
        </div>
        <!-- 备注 -->
        <div class="el-col el-col-24 el-col-description">
          <slot name="description"></slot>
        </div>
      </div>
      <!-- 计划信息 start =========== -->
      <div class="el-row">
        <!-- 计划信息 end =========== -->
        <!-- 剩余版块 -->
        <slot name="remnant"></slot>
        <!-- 抢单报价 -->
        <div class="quotedPrice">
          <slot name="quotedPrice"></slot>
        </div>
      </div>
    </div>
    <!-- tabs -->
    <el-tabs type="border-card">
      <el-tab-pane label="抢单报价记录" id="tabQuoteRecord">
        <slot name="tabQuoteRecord"></slot>
      </el-tab-pane>
      <!--  <el-tab-pane label="变更记录">
        <slot name="tabChangeLog"></slot>
      </el-tab-pane> -->
    </el-tabs>
    <div class="form-button" v-show='editable || !isEdit'>
      <slot name="buttonSubmit"></slot>
      <slot name="buttonReset"></slot>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  props: {
    domainObject: Object,
    isEdit: Boolean,
    editable: Boolean,
    objectName: '',
    clientDetailColumns: Array
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
@import "../assets/sass/base.scss";

#inquiryPage {
  .el-row {
    padding-bottom: 10px;
    border-bottom: solid 1px #ddd;
  }

  .quotedPrice {
    text-align: center;
    margin-top: 10px;
  }

  // page 页面影藏
  #tabQuoteRecord {
    .pagination {
      display: none;
    }

    .el-dialog--large {
      width: 95%;
    }
  }


}

#clientOrg {
  .complex-control-4 {
    .innerblock {
      width: 100%;
      margin-right: 0;
    }

    .el-autocomplete {
      display: block;
    }

    .el-autocomplete[readonly]::before {
      cursor: default;
    }

    .el-input {
      width: 100%;
    }

    .el-input__inner {
      padding: 0;
      border: none 0;
    }
  }

  .el-button--default {
    display: none;
  }
}

.clear {
  clear: both;
}

.light-bg {
  padding-top: 10px;
  margin-bottom: 10px;
  background-color: #f8f8f8;
}

.highlight-bg {
  padding-top: 10px;
  margin-bottom: 10px;
  background-color: #fff5c0;
}

.top-line {
  box-sizing: content-box;
  padding-top: 10px;
  border-top: solid 1px #ddd;
}

.form-button {
  text-align: center;
  padding: 20px;
}

.el-form-item__label {
  font-size: 13px;
}

.link {
  padding-top: 10px;
  margin-left: 10px;
  font-size: 14px;
}

.check-required {
  position: relative;

  &::before {
    position: absolute;
    top: 9px;
    left: 90px;
    content: '*';
    color: #ff4949;
  }
}

.el-col-length {
  height: 79px !important;
}

// .el-col-12:nth-child(6n), .el-col-12:nth-child(6n-1) {
//  margin-bottom: 0 !important;
//  border-bottom: 0 !important;
// }
.el-tab-pane {
  .advance-search {
    display: none;
  }

  .list-wrap {
    .page-header {
      display: none;
    }

    #advanceSearch {
      display: none;
    }

    .fix-table-wrap {
      height: auto !important;
    }
  }
}

.el-col-24 .el-checkbox-group {

  // width: 520px;
  .el-checkbox {
    width: 76px;
    margin-right: 10px;
  }

  .el-checkbox+.el-checkbox {
    margin-left: 0;
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

  .form-page .innerblock .el-date-editor {
    width: 165px !important;
  }
}

</style>
