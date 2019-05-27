<template>
  <div class="custom-page">
    <!-- 1 -->
    <div class="section">
      <h2 class="tmp-title">
        认证信息
      </h2>
      <div class="el-row">
        <div class="el-col el-col-24 el-col-auto">
          <slot name="headPictureResourceCode"></slot>
        </div>
        <div class='el-col el-col-6'>
          <slot name="fullName"></slot>
        </div>
        <div class='el-col el-col-6'>
          <div class="el-col el-col-18">
            <slot name="phone"></slot>
          </div>
          <div class="el-col el-col-6">
            <slot name="driverMatch"></slot>
          </div>
        </div>
        <!-- <div class="el-col el-col-6 is-required">
          <slot name="userType"></slot>
        </div> -->
        <div class='el-col el-col-6'>
          <slot name="gender"></slot>
        </div>
        <!-- 认证状态 -->
        <div class='el-col el-col-6'>
          <slot name="certStatus"></slot>
        </div>
        <!-- 身份证 -->
        <div class='el-col el-col-6'>
          <slot name="identityResourceCode"></slot>
        </div>
        <div class='el-col el-col-6'>
          <slot name="identityNumber"></slot>
        </div>
        <div class='el-col el-col-6 el-col-adjust'>
          <slot name="identityExpirationDate"></slot>
        </div>
        <!-- 驾驶证 -->
        <div class='el-col el-col-6'>
          <slot name="driverLicenseResourceCode"></slot>
        </div>
        <div class='el-col el-col-6'>
          <slot name="driverLicenseAcceptType"></slot>
        </div>
        <div class='el-col el-col-6 el-col-adjust'>
          <slot name="driverLicenseExpirationDate"></slot>
        </div>
        <div class='el-col el-col-6'>
          <slot name="driverLicenseNo"></slot>
        </div>
        <!-- 资格证 -->
        <div class='el-col el-col-6'>
          <slot name="qualificationCertificateResourceCode"></slot>
        </div>
        <div class='el-col el-col-6'>
          <slot name="qualificationCertificateNumber"></slot>
        </div>
        <div class='el-col el-col-12 el-col-adjust'>
          <slot name="qualificationCertificateExpirationDate"></slot>
        </div>
      </div>
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
      canEdit: {
        type: Boolean,
        'default': true
      }
    },
    computed: {
      text() {
        let text = '';
        if (this.domainObject.certStatus === 'authenticating') {
          text = '认证中';
        }
        if (this.domainObject.certStatus === 'authenticated') {
          text = '已认证';
        }
        return text;
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
  .is-required {
    .el-form-item__label:before {
      position: absolute;
      top: 7px;
      left: 0;
      content: '*';
      color: #ff4949;
      margin-right: 4px;
    }
  }
.el-col-adjust {
  .el-form-item__label {
    width: 124px !important;
  }
  .el-form-item__content {
    margin-left: 124px !important;
    .el-form-item__content {
      margin-left: 0 !important;
    }
  }
  .el-date-editor {
    width: 150px !important;
  }
}
</style>
