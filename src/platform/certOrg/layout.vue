<template>
  <div class="custom-page platform_certorg_layout ishn">
    <div class="page-header clearfix">
      <h2 class="page-title fl">
        {{ title }}
      </h2>
      <div class="hd-opr fr">
        <!-- <slot name="buttonEdit"></slot>
        <slot name="buttonCancel"></slot>
        <slot name="buttonSave"></slot> -->
        <!-- <slot name="buttonChangeLog"></slot> -->
      </div>
      <!-- <span id="pageRefresh" class="page-refresh fr"><i class="ico-refresh"></i>刷新 -->
      </span>
    </div>
    <!-- 1 -->
    <div class="section">
      <h2 class="tmp-title">
            认证信息<!-- <span class="org" v-if="!canEdit">（注：当前公司认证状态为{{ text }}，此版块信息不可编辑）</span> -->
        </h2>
      <div class="el-row">
        <!-- 公司全称 -->
        <div class="el-col el-col-8">
          <slot name="orgFullName"></slot>
        </div>
        <!-- 客户简称 -->
        <div class="el-col el-col-8">
          <slot name="orgName"></slot>
        </div>
        <!-- 组织类型 在认证的情况下不能修改 激活的状态下不能修改 -->
        <div class="el-col el-col-8">
          <slot name="orgType"></slot>
        </div>
        <!-- 认证状态 -->
        <div class="el-col el-col-8">
          <slot name="certStatus"></slot>
        </div>
        <!-- 纳税人识别号 -->
        <div class="el-col el-col-8">
          <slot name="orgTaxNumber"></slot>
        </div>
        <!-- 纳税人类别 -->
        <div class="el-col el-col-8">
          <slot name="taxType"></slot>
        </div>
        <!-- 营业执照附件 -->
        <div class="el-col el-col-8">
          <slot name="businessLicenseResourceCode"></slot>
        </div>
        <!-- 信用代码 -->
        <div :class="hideFields ? 'el-col el-col-8' : 'el-col el-col-16'">
          <slot name="creditCode"></slot>
        </div>
        <!-- 执照过期日期 -->
        <div class="el-col el-col-8" v-show="hideFields">
          <slot name="businessLicenseExpirationDate"></slot>
        </div>
        <!-- 运输许可证附件 -->
        <div class="el-col el-col-8 el-col-transportCertificateResourceCode">
          <slot name="transportCertificateResourceCode"></slot>
        </div>
        <!-- 许可证号码 -->
        <div class="el-col el-col-8">
          <slot name="transportCertificate"></slot>
        </div>
        <!-- 证件过期日期 -->
        <div class="el-col el-col-8">
          <slot name="transportCertificateExpirationDate"></slot>
        </div>
        <!-- 法人代表身份证附件 -->
        <div class="el-col el-col-8 el-col-legalPersonResourceCode">
          <slot name="legalPersonResourceCode"></slot>
        </div>
        <!-- 法人代表姓名 -->
        <div class="el-col el-col-8">
          <slot name="legalPersonName"></slot>
        </div>
        <!-- 法人代表身份证号 -->
        <div class="el-col el-col-8 el-col-legalPersonIdentityNumber">
          <slot name="legalPersonIdentityNumber"></slot>
        </div>
        <!-- 外部编码 -->
        <div class="el-col el-col-8">
          <slot name="orgExternalNo"></slot>
        </div>
        <!-- 业务联系人 -->
        <div class="el-col el-col-8">
          <slot name="linkmanFullName"></slot>
        </div>
        <!-- 联系电话 -->
        <div class="el-col el-col-8">
          <slot name="linkmanPhone"></slot>
        </div>
        <!-- 所在地 -->
        <div class="el-col el-col-16 el-bottom">
          <slot name="orgArea"></slot>
        </div>
        <!--详细地址  -->
        <div class="el-col el-col-8 el-bottom">
          <slot name="orgAddress"></slot>
        </div>
      </div>
    </div>
    <!-- 2 -->
    <div class="section">
      <h2 class="tmp-title">
            结算设置
        </h2>
      <div class="el-row">
        <!-- 交易费 -->
        <div class="el-col el-col-8 el-bottom">
          <slot name="settleTradingConfigValue"></slot>
        </div>
        <!-- 运杂费标准 -->
        <div class="el-col el-col-8 el-bottom settleConfigValue4">
          <slot name="settleConfigValue4"></slot>
        </div>
        <!-- 代理人 -->
        <div class="el-col el-col-8 el-bottom">
          <slot name="businessAgent"></slot>
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
    </div>
    <div class="form-button" v-if="isShow">
      <slot name="buttonFail"></slot>
      <slot name="buttonPass"></slot>
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
    },
    isShow: {
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
    title() {
      if (this.isEdit) {
        return this.editable ? `${this.objectName}` : `${this.objectName}`;
      }
      return `${this.objectName}`;
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
    },
    hideFields() {
      return false;
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

.ishn {

  .el-upload.el-upload--picture-card,
  .el-upload-list__item-status-label,
  .del-btn,
  .el-upload-list__item-delete {
    display: none !important;
  }

  .el-upload-list__item-preview {
    float: none !important;
  }
}

.el-col-transportCertificateResourceCode {
  .el-form-item__label {
    width: 166px !important;
  }

  .el-form-item__content {
    margin-left: 166px !important;

    .el-form-item__content {
      margin-left: 0 !important;
    }
  }
}

.el-col-legalPersonResourceCode {
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

.el-col-legalPersonIdentityNumber {
  .el-form-item__label {
    width: 126px !important;
  }

  .el-form-item__content {
    margin-left: 126px !important;

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

.el-textarea__inner {
  min-width: auto !important;
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

.platform_certorg_layout {

  .settleConfigValue4 {
    position: relative;

    .among {
      position: absolute;
      top: 5px;
      left: -20px;
    }
  }



  .el-row {
    height: 45px !important;
    // 修改图片格式样式 --start
  }

  .el-upload--picture-card {
    width: 36px;
    height: 36px;
    line-height: 44px;
  }

  .el-upload-list--picture-card .el-upload-list__item {
    width: 36px;
    height: 36px;
  }

  .el-upload-list--picture-card .el-upload-list__item-status-label {
    width: 33px;
    height: 21px;
  }

  .el-upload-list__item-preview {
    float: left;
    margin-left: -3px;
  }

  .file-component .el-upload-list__item-delete {
    float: right;
    margin-right: 0px;
  }

  .el-upload-list--picture-card .el-upload-list__item-actions .el-upload-list__item-delete {
    position: absolute;
    font-size: 10px;
    line-height: 36px;
    right: 3px;
  }

  .file-list-item {
    width: 36px !important;
    height: 36px !important;

  }

  .file-list-item .pre-mask {
    line-height: 36px;
  }

  .el-icon-upload-success .el-icon-check {
    font-size: 10px;
  }

  .el-icon-view {
    font-size: 15px;
    vertical-align: top;
    margin-top: 10px;
    padding: 0 5px;
  }

  .el-icon-delete2 {
    position: relative;
    left: 3px;
  }

  // 修改图片格式样式 ---end

}


//行间距-start
.el-col {
  margin-bottom: 10px;
}

//行间距-end

</style>
