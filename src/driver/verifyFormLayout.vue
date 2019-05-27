<template>
  <div class="custom-page dirver-verify-form-layout">
    <!-- 1 -->
    <div class="section">
      <h2 class="tmp-title">
        认证信息<span class="org" v-if="!canEdit">（注：当前司机认证状态为{{ text }}，此版块信息不可编辑）</span>
      </h2>
      <div class="el-row">
        <div class="el-col el-col-24 el-col-auto" v-if='showAddFields'>
          <slot name="headPictureResourceCode"></slot>
        </div>
        <div class='el-col el-col-6'>
          <slot name="fullName"></slot>
        </div>
        <div :class="showAddFields ? 'el-col el-col-6' : 'el-col el-col-18'">
          <!-- <div class="el-col el-col-18"> -->
            <slot name="phone"></slot>
          <!-- </div> -->
          <!-- <div class="el-col el-col-6" v-if="!isEdit">
            <slot name="driverMatch"></slot>
          </div> -->
        </div>
        <div class='el-col el-col-6' v-if='showAddFields'>
          <slot name="gender"></slot>
        </div>
        <!-- 认证状态 -->
        <div class='el-col el-col-6' v-if='showAddFields'>
          <slot name="certStatus"></slot>
        </div>
        <!-- 身份证 -->
        <div class='el-col el-col-6'>
          <slot name="identityResourceCode"></slot>
        </div>
        <div :class="showAddFields ? 'el-col el-col-6' : 'el-col el-col-18'">
          <slot name="identityNumber"></slot>
        </div>
        <div class='el-col el-col-12 el-col-adjust' v-if='showAddFields'>
          <slot name="identityExpirationDate"></slot>
        </div>

        <!-- 驾驶证 -->
         <div :class="showAddFields ? 'el-col el-col-6' : 'el-col el-col-24'">
          <slot name="driverLicenseResourceCode"></slot>
        </div>
        <div class='el-col el-col-6' v-if='showAddFields'>
          <slot name="driverLicenseAcceptType"></slot>
        </div>
        <div class='el-col el-col-6 el-col-adjust' v-if='showAddFields'>
          <slot name="driverLicenseExpirationDate"></slot>
        </div>
        <!-- 驾照档案标号 style 调整 -->
        <div class='el-col el-col-6 driverLicenseNo' v-if='showAddFields'>
          <slot name="driverLicenseNo"></slot>
        </div>
        <!-- 资格证 -->
        <div :class="showAddFields ? 'el-col el-col-6' : 'el-col el-col-24'">
          <slot name="qualificationCertificateResourceCode"></slot>
        </div>
        <div class='el-col el-col-6' v-if='showAddFields'>
          <slot name="qualificationCertificateNumber"></slot>
        </div>
        <div class='el-col el-col-12 el-col-adjust' v-if='showAddFields'>
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
  data() {
    return {
      projectName: JSON.parse(localStorage.getItem('appInfo')).projectName
    };
  },
    computed: {
    showAddFields() {
      let mark = true; // 默认显示
      if(!this.isEdit){
        mark = false;
      }
      return mark;
    },
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

.dirver-verify-form-layout{
  .driverLicenseNo {
    .el-form-item__label{
      left: 10px;
    }
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
