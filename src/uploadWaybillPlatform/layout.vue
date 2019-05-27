<template>
  <div class="custom-page">
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
    <!-- 1 -->
    <div class="section">
      <h2 class="tmp-title">
        基本信息
      </h2>
      <div class="el-row basic-info">
        <div class="el-col el-col-6">
          <slot name="shippingNoteNumber"></slot>
        </div>
        <div class="el-col el-col-6">
          <slot name="originalDocumentNumber"></slot>
        </div>
        <div class="el-col el-col-6">
          <slot name="vehicleNumber"></slot>
        </div>
        <div class="el-col el-col-6">
          <slot name="businessTypeCode"></slot>
        </div>
        <div class="el-col el-col-6">
          <slot name="cargoTypeClassificationCode"></slot>
        </div>
        <div class="el-col el-col-6 ">
          <slot name="licensePlateTypeCode"></slot>
        </div>
        <div class="el-col el-col-6 ">
          <slot name="vehicleClassificationCode"></slot>
        </div>
        <div class="el-col el-col-6 ">
          <slot name="vehicleTonnage"></slot>
        </div>
        <!-- 运价 -->
        <div class="el-col el-col-6">
          <slot name="descriptionOfGoods"></slot>
        </div>
        <div class="el-col el-col-6">
          <slot name="goodsItemGrossWeight"></slot>
        </div>
        <div class="el-col el-col-6">
          <slot name="despatchActualDateTime"></slot>
        </div>
        <div class="el-col el-col-6">
          <slot name="goodsReceiptDateTime"></slot>
        </div>
        <div class="el-col el-col-6">
          <slot name="totalMonetaryAmount"></slot>
        </div>
        <div class="el-col el-col-6">
          <slot name="roadTransportCertificateNumber"></slot>
        </div>
        <div class="el-col el-col-6">
          <slot name="consignmentDateTime"></slot>
        </div>
        <div class="el-col el-col-12 ">
          <slot name="consignorCountrySubdivisionCode"></slot>
        </div>
        <div class="el-col el-col-12 ">
          <slot name="consigneeCountrySubdivisionCode"></slot>
        </div>
        <div class="el-col el-col-6 ">
          <slot name="owner"></slot>
        </div>
        <div class="el-col el-col-6 ">
          <slot name="consignor"></slot>
        </div>
        <div class="el-col el-col-6">
          <slot name="personalIdentityDocument"></slot>
        </div>
        <div class="el-col el-col-6">
          <slot name="consignee"></slot>
        </div>
        <div class="el-col el-col-6">
          <slot name="trailerVehiclePlateNumber"></slot>
        </div>
        <div class="el-col el-col-6">
          <slot name="cube"></slot>
        </div>
        <div class="el-col el-col-6">
          <slot name="totalNumberOfPackages"></slot>
        </div>

        <div class="el-col el-col-6">
          <slot name="nameOfPerson"></slot>
        </div>
        <div class="el-col el-col-6">
          <slot name="telephonNumber"></slot>
        </div>

        <div class="el-col el-col-6">
          <slot name="vehiclePermitNumber"></slot>
        </div>
        <div class="el-col el-col-6">
          <slot name="qualificationCertificateNumber"></slot>
        </div>
        <div class="el-col el-col-6 ">
          <slot name="placeOfLoading"></slot>
        </div>
        <div class="el-col el-col-6 ">
          <slot name="goodsReceiptPlace"></slot>
        </div>
        <div class="el-col el-col-24 ">
        </div>
        <div class="el-col el-col-12 el-col-description">
          <slot name="reportRemark"></slot>
        </div>
        <div class="el-col el-col-12 el-col-description">
          <slot name="freeText"></slot>
        </div>
        <div class="el-col el-col-12">
          <slot name="ownerOrgName"></slot>
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

  .el-col-6:nth-child(6n), .el-col-6:nth-child(6n-1) {
    margin-bottom: 0 !important;
    border-bottom: 0 !important;
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
  }
</style>
