<template>
  <div class="custom-page layout_partner">
    <div class="page-header clearfix">
      <h2 class="page-title fl">
        {{ isEdit ? ( editable ? '编辑' + objectName : objectName + '详情' ): ( '新建' + objectName) }}
      </h2>
      <div class="hd-opr fr">
        <slot name="buttonVerify"></slot>
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
      <!-- 认证信息 -->
      <div class="verify-info">
        <slot name="verifyForm"></slot>
      </div>
      <template v-if="clientDetailColumns.length > 0">
        <h2 class="tmp-title">
              扩展信息
          </h2>
        <div class="el-row">
          <div class="el-col el-col-8 el-col-adjust-large" v-for="field in clientDetailColumns">
            <slot :name="field"></slot>
          </div>
        </div>
      </template>
      <h2 class="tmp-title">
            档案信息
      </h2>
      <div class="el-row">
        <!-- 进项税率 -->
        <div class="el-col el-col-6">
          <slot name="inputTaxRate"></slot>
        </div>
        <!-- 销项税率 -->
        <div class="el-col el-col-6">
          <slot name="outputTaxRate"></slot>
        </div>
        <!-- 备注 -->
        <div class="el-col el-col-18 el-col-description">
          <slot name="description"></slot>
        </div>
        <!-- 标签 -->
        <div class="el-col el-col-24 fix_bug_tag">
          <slot name="orgTag"></slot>
        </div>
      </div>
      <!-- 去除 固定科目结算方式设置 信息快显示  需求 4-18  -->
<!--       <h2 class="tmp-title" v-if='showSettleConfigValue'>
            固定科目结算方式设置
      </h2>
      <div class="el-row" v-if='showSettleConfigValue'>
        <div class="el-col el-col-8 el-col-adjust">
          <slot name="settleConfigValue1"></slot>
        </div>
        <div class="el-col el-col-8 el-col-adjust">
          <slot name="settleConfigValue2"></slot>
        </div>
        <div class="el-col el-col-8 el-col-adjust">
          <slot name="settleConfigValue3"></slot>
        </div>
      </div> -->
      <div v-show="isEdit">
        <slot name="bankInfo"></slot>
      </div>
    </div>
    <!-- tabs -->
    <el-tabs type="border-card" v-if="isEdit">
      <el-tab-pane label="账户信息">
        <slot name="tabBankAccount"></slot>
      </el-tab-pane>
      <!-- <el-tab-pane label="认证附件">
        <slot name="tabAttachment"></slot>
        <slot name="attachmentResourceCode"></slot>
        <slot name="attachmentIssuanceDate"></slot>
        <slot name="attachmentExpirationDate"></slot>


      </el-tab-pane> -->
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
export default {
  props: {
    isEdit: Boolean,
    editable: Boolean,
    objectName: '',
    isReadOnly: {
      type: Boolean,
      'default': false
    },
    clientDetailColumns: Array
  },
  data() {
    return {
      projectName: ''
    }
  },
  computed: {
    showSettleConfigValue() {
      return false;
    }
  },
  mounted() {
    console.log('layout mounted', this.$slots);
  },
  created() {
    // console.log('123');
    const localStorage = window.localStorage;
    this.projectName = JSON.parse(localStorage.getItem('appInfo')).projectName || '';
  },
  methods: {

  }
};

</script>
<style lang="scss" rel="stylesheet/scss">
@import "../assets/sass/base.scss";

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

.readOnly {
  .el-input {
    position: relative;
    height: 24px;
    &::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      border: solid 1px #fff;
      cursor: not-allowed;
    }
  }
}

// 主要是修复Ui 的bug
.layout_partner {
  .form-button {
    .el-button {
      width: auto !important;
    }
  }
  .hd-opr {
    .el-button {
      width: auto !important;
    }
  }
  .fix_bug_tag {
    .el-button {
      width: auto !important;
    }
  }
  .list-page {
    .el-button {
      width: auto !important;
    }
  } // 修改图片格式样式 --start  把下面包裹在layout_partner 里面 8-2
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
    width: 36px!important;
    height: 36px!important;
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
  } // 修改图片格式样式 ---end
}

.list-page {
  height: auto !important;
  .fix-table-wrap {
    height: auto !important;
    max-height: 607px;
    .rl-fix-table {
      margin-left: 0 !important;
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

.el-col-adjust-large {
  .el-form-item__label {
    width: 130px !important;
  }
  .el-form-item__content {
    margin-left: 130px !important;
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

.form-page .el-row .el-col-12:nth-child(6n),
.form-page .el-row .el-col-12:nth-child(6n-1) {
  margin-bottom: 0 !important;
  border-bottom: 0 !important;
}

.el-tab-pane {
  .page-title,
  #pageRefresh,
  .hd-opr .innerblock,
  .hd-opr .el-button--default,
  .opr-button {
    display: none;
  }
  .list-page .page-header {
    padding: 0;
    border-bottom: 0;
  }
}



//行间距-start
.el-col {
  margin-bottom: 10px;
}

//行间距-end
.el-bottom {
  margin-bottom: 0px;
}

.getSelect {
  position: relative;
}

.obtains {
  width: 28px;
  height: 20px;
  cursor: pointer;
  text-align: center;
  border-radius: 4px;
  line-height: 20px;
  border: 1px solid #ccc;

  padding: 0 5px;
  position: absolute;
  left: 280px;
  top: 0px;
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
