<template>
  <div class="custom-page">
    <div class="page-header clearfix">
      <h2 class="page-title fl">
        {{ title }}
      </h2>
      <div class="hd-opr fr">
        <!-- <slot name="buttonEdit" v-show="isEdit && !editable"></slot>
        <slot name="buttonCancel" v-show="isEdit && editable"></slot>
        <slot name="buttonSave" v-show="isEdit && editable"></slot> -->
        <!--<slot name="buttonChangeLog"></slot>-->
      </div>
      <span id="pageRefresh" class="page-refresh fr"><i class="ico-refresh"></i>刷新</span>
    </div>
    <!-- 用户code匹配 -->
    <div class="section">
      <slot name="userMatch"></slot>
    </div>
    <!-- 1 -->
    <div class="section">
      <div class="el-row basic-info">
        <div class="el-col-13 voucher-preview" id="voucherPreview">
            <slot name="showImage"></slot>
          </div>
          <div class="el-col-11 page-info">
            <!-- 司机认证 -->
            <!-- <h3 class="tit">司机认证</h3> -->
            <slot name="certPerson"></slot>
            <!-- 车辆认证 -->
            <!-- <h3 class="tit">车辆认证</h3> -->
            <slot name="certTruck"></slot>
            <!-- form-button -->
            <div class="form-button" v-show='editable || !isEdit'>
              <slot name="buttonApproval"></slot>
              <!-- <slot name="buttonSubmit"></slot> -->
              <slot name="buttonReset"></slot>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      isEdit: Boolean,
      editable: Boolean,
      objectName: String
    },
    computed: {
      title() {
        if (this.isEdit) {
          return this.editable ? `编辑${this.objectName}` : `${this.objectName}详情`;
        }
        return `${this.objectName}`;
      }
    },
    mounted() {
      console.log('layout mounted', this.$slots);
    },
    created() {
      console.log('child created $slots', this.$slots);
      // console.log('123');
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../../assets/sass/base.scss";
  .form-page {
    .tit {
      clear: both;
      padding: 10px;
      font-size: 14px;
      font-weight: 700;
      background-color: #f9fafc;
    }
  }
  .voucher-preview {
  height: 1360px !important;
  background-color: #f6f6f6;
  }
  .page-info {
    height: 1360px !important;
    border: solid 1px #ddd;
    .page-header {
      display: none !important;
    }
    .section {
      margin-top: 0;
    }
    .basic-info {
      padding: 0 !important;
    }
    .page-info {
      height: auto !important;
      border: 0;
    }
    .sep-line {
      border-bottom: dashed 1px #ddd;
    }
    .el-form-item__label {
      width: 130px !important;
      font-size: 13px;
    }
    .el-form-item__content {
      margin-left: 130px !important;
      .el-form-item__content {
        margin-left: 0 !important;
      }
    }
  .el-upload-list--picture-card .el-upload-list__item-actions span+span {
    margin-left: 10px;
  }
  .el-upload.el-upload--picture-card, .el-upload-list--picture-card .el-upload-list__item {
    width: 58px !important;
    height: 58px !important;
    line-height: 58px !important;
    margin-bottom: 0 !important;
  }
  .el-upload-list__item.is-success .el-upload-list__item-status-label {
    line-height: 24px !important;
  }
  }
  .audit-result {
    padding: 20px 20px 13px !important;
    background-color: #f6f6f6;
  }
  .el-col-vertical {
    .el-form-item__label {
      float: none;
    }
    .el-form-item__content {
      margin-top: 20px;
      margin-left: 10px !important;
    }
  }
  .form-button {
    .el-button {
      margin: 0 10px;
    }
  }
</style>
