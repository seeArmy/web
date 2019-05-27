<template>
  <div class="custom-page layout-driverEntust">
    <div class="page-header clearfix">
      <h2 class="page-title fl">
        {{ isEdit ? ( editable ? '编辑' + objectName : objectName + '详情' ): ( '新建' + objectName) }}
      </h2>
      <div class="hd-opr fr">
        <!-- <slot name="buttonVerify"></slot> -->
        <slot name="buttonEdit"></slot>
        <slot name="buttonCancel"></slot>
        <slot name="buttonSave"></slot>
        <!-- <slot name="buttonChangeLog"></slot> -->
      </div>
      <span id="pageRefresh" class="page-refresh fr"><i class="ico-refresh"></i>刷新
      </span>
    </div>
    <div class="section">
      <!-- 认证信息 -->
      <!--       <div class="verify-info">
        <slot name="verifyForm"></slot>
      </div> -->
      <h2 class="tmp-title">
        基本信息
      </h2>
      <div class="el-row">
        <!-- 银行户名 -->
        <div class='el-col el-col-12'>
          <slot name="fullName"></slot>
        </div>
        <!-- 开户行 -->
        <div class='el-col el-col-12'>
          <slot name="phone"></slot>
        </div>
        <!-- 银行账号 -->
        <div class='el-col el-col-24'>
          <slot name="ownerOrgName"></slot>
        </div>
        <!-- 银行描述 -->
        <div class='el-col el-col-12'>
          <slot name="authorizePayeeFullName"></slot>
        </div>
        <div class='el-col el-col-12 authorizePayeePhone'>
          <slot name="authorizePayeePhone"></slot>
        </div>
      </div>
      <!-- 平台账号信息 -->
      <!--       <div v-show="isEdit">
        <slot name="accountInfo"></slot>
      </div> -->
    </div>
    <div class="section">
      <h2 class="tmp-title">
        附件
      </h2>
      <div class="el-row">
        <!-- 银行户名 -->
        <div class='el-col el-col-6'>
          <slot name="authorizeResourceCode"></slot>
        </div>
      </div>
    </div>
    <!-- tabs -->
    <!--     <el-tabs type="border-card" v-if="isEdit">
      <el-tab-pane label="变更记录">
        <slot name="tabChangeLog"></slot>
      </el-tab-pane>
    </el-tabs> -->
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
    companyData: Array
  },
  data() {
    return {

    };
  },
  created() {}
};

</script>
<style lang="scss" rel="stylesheet/scss">
@import "../assets/sass/base.scss";


.layout-driverEntust{
  .authorizePayeePhone {
    .el-form-item__label {
      padding-left: 0px;
    }
  }
}

.jc-list {
  li {
    padding-left: 10px;
    font-size: 14px;
    margin-bottom: 10px;
  }
}

.bug_class_fix {
  .el-form-item {
    .el-form-item__label {
      width: 120px !important;
    }
  }
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

.el-col-6 {
  .el-form-item__content {
    white-space: nowrap;
    overflow: hidden;
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
