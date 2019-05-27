<template>
  <div class="custom-page" id="report-freight">
    <div class="page-header clearfix">
      <h2 class="page-title fl">
        {{ isEdit ? ( editable ? '编辑' + objectName : objectName + '详情' ) : ( '新建' + objectName) }}
      </h2>
      <div class="hd-opr fr">
        <slot name="buttonEdit"></slot>
        <slot name="buttonCancel"></slot>
        <slot name="buttonSave"></slot>
        <!--<slot name="buttonChangeLog"></slot>-->
      </div>
      <span id="pageRefresh" class="page-refresh fr"><i class="ico-refresh"></i>刷新</span>
    </div>
    <!-- section 1 -->
    <div class="section">
      <h2 class="tmp-title">
        基本信息
      </h2>
      <div class="el-row basic-info">
        <div class="el-col el-col-6">
          <slot name="code"></slot>
        </div>
        <div class="el-col el-col-6">
          <slot name="shippingNoteNumber"></slot>
        </div>
        <div class="el-col el-col-6">
          <slot name="vehicleNumber"></slot>
        </div>
        <div class="el-col el-col-6">
          <slot name="licensePlateTypeCode"></slot>
        </div>
        <div class="el-col el-col-24 el-col-carrier">
          <slot name="carrier"></slot>
        </div>
        <div class="el-col el-col-24 el-col-description">
          <slot name="description"></slot>
        </div>
      </div>
      <p class="tip-info">
        （请填写完整以下至少一种付款方式）
      </p>
      <!-- 1 -->
      <div class="el-row pay-method">
        <div class="el-col el-col-6">
          <slot name="paymentMeansCode1"></slot>
        </div>
        <div class="el-col el-col-6">
          <slot name="sequenceCode1"></slot>
        </div>
        <div class="el-col el-col-6">
          <slot name="monetaryAmount1"></slot>
        </div>
        <div class="el-col el-col-6">
          <slot name="dateTime1"></slot>
        </div>
        <div class="el-col el-col-24">
          <slot name="bankCode"></slot>
        </div>
      </div>
      <!-- 2 -->
      <div class="el-row pay-method">
        <div class="el-col el-col-6">
          <slot name="paymentMeansCode2"></slot>
        </div>
        <div class="el-col el-col-6">
          <slot name="sequenceCode2"></slot>
        </div>
        <div class="el-col el-col-6">
          <slot name="monetaryAmount2"></slot>
        </div>
        <div class="el-col el-col-6">
          <slot name="dateTime2"></slot>
        </div>
      </div>
      <!-- 3 -->
      <div class="el-row pay-method">
        <div class="el-col el-col-6">
          <slot name="paymentMeansCode3"></slot>
        </div>
        <div class="el-col el-col-6">
          <slot name="sequenceCode3"></slot>
        </div>
        <div class="el-col el-col-6">
          <slot name="monetaryAmount3"></slot>
        </div>
        <div class="el-col el-col-6">
          <slot name="dateTime3"></slot>
        </div>
      </div>
      <!-- 4 -->
      <div class="el-row pay-method">
        <div class="el-col el-col-6">
          <slot name="paymentMeansCode4"></slot>
        </div>
        <div class="el-col el-col-6">
          <slot name="sequenceCode4"></slot>
        </div>
        <div class="el-col el-col-6">
          <slot name="monetaryAmount4"></slot>
        </div>
        <div class="el-col el-col-6">
          <slot name="dateTime4"></slot>
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
  export default {
    props: {
      isEdit: Boolean,
      editable: Boolean,
      addMode: Boolean,
      objectName: ''
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
  #report-freight {
    .innerblock {
      .el-select, .el-date-editor {
        width: 192px !important;
      }
    }
    .tip-info {
      margin: 0 20px 10px;
      color: #f4840;
    }
    .pay-method {
      margin: 0 20px 20px 20px;
      border: solid 1px #ddd;
      background-color: #fcfcfc;
    }
    .el-col-carrier {
      .el-input {
        width: 459px;
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

  .el-col {
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

  .bank-account .el-input {
    width: 320px;
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
      margin-right: 3px !important;
    }
    .form-page .innerblock .el-date-editor {
      width: 165px !important;
    }
    #report-freight {
      .innerblock {
        .el-select, .el-date-editor {
          width: 176px !important;
        }
      }
    }
  }
</style>
