<template>
  <div class="custom-page layout-dirver">
    <div class="page-header clearfix">
      <h2 class="page-title fl">
        {{ isEdit ? ( editable ? '编辑' + objectName : objectName + '详情' ): ( '新建' + objectName) }}
      </h2>
      <div class="hd-opr fr">
        <slot name="buttonVerify"></slot>
        <slot name="buttonEdit"></slot>
        <slot name="buttonCancel"></slot>
        <slot name="buttonSave"></slot>
      </div>
      <span id="pageRefresh" class="page-refresh fr"><i class="ico-refresh"></i>刷新
      </span>
    </div>
    <div class="section">
      <!-- 认证信息 -->
      <div class="verify-info">
        <slot name="verifyForm"></slot>
        <slot name="bankForm" v-if="hide"></slot>
        <template v-if="clientDetailColumns.length > 0">
          <h2 class="tmp-title">
                扩展信息
            </h2>
            <div class="el-row verifySection">
              <div class="el-col el-col-6" v-for="field in clientDetailColumns">
                <slot :name="field"></slot>
              </div>
            </div>
        </template>
      </div>
      <!-- 平台账号信息 -->
      <div v-show="isEdit">
        <slot name="accountInfo"></slot>
      </div>
      <!-- 档案信息 -->
      <h2 class="tmp-title" v-if="hide">档案信息</h2>
      <div class="el-row" v-if="hide">
        <div class='el-col el-col-6'>
          <slot name="maritalStatus"></slot>
        </div>
        <div class='el-col el-col-6'>
          <slot name="politicalStatus"></slot>
        </div>
        <div class='el-col el-col-6'>
          <slot name="nativePlace"></slot>
        </div>
        <div class='el-col el-col-6'>
          <slot name="registedResidence"></slot>
        </div>
        <div class='el-col el-col-6'>
          <slot name="identityCardAddress"></slot>
        </div>
        <div class='el-col el-col-6'>
          <slot name="currentResidence"></slot>
        </div>
        <div class='el-col el-col-6'>
          <slot name="education"></slot>
        </div>
        <div class='el-col el-col-6'>
          <slot name="schoolOfGraduation"></slot>
        </div>
        <div class='el-col el-col-6'>
          <slot name="major"></slot>
        </div>
        <div class='el-col el-col-6'>
          <slot name="startDateOfFirstJob"></slot>
        </div>
        <div class='el-col el-col-6'>
          <slot name="employmentDate"></slot>
        </div>
        <div class='el-col el-col-6'>
          <slot name="emergencyContactPerson"></slot>
        </div>
        <div class='el-col el-col-6'>
          <slot name="emergencyContactPhone"></slot>
        </div>
        <div class='el-col el-col-6'>
          <slot name="fuelCardNo"></slot>
        </div>
        <div class='el-col el-col-24 el-col-description'>
          <slot name="description"></slot>
        </div>
        <div class='el-col el-col-24'>
          <slot name="userTag"></slot>
        </div>
        <div class="el-col el-col-6" v-show="isEdit && !editable">
          <slot name="creatorUser"></slot>
        </div>
        <div class="el-col el-col-6" v-show="isEdit && !editable">
          <slot name="createTime"></slot>
        </div>
        <div class="el-col el-col-6" v-show="isEdit && !editable">
          <slot name="updateUser"></slot>
        </div>
        <div class="el-col el-col-6" v-show="isEdit && !editable">
          <slot name="updateTime"></slot>
        </div>
      </div>
       <h2 class="tmp-title">委托收款信息</h2>
      <div class="el-row">
        <div class='el-col el-col-8'>
          <slot name="authorizePayeeFullName"></slot>
        </div>
        <div class='el-col el-col-8 authorizePayeePhone'>
          <slot name="authorizePayeePhone"></slot>
        </div>
        <div class='el-col el-col-8 voucher el-col-auto' id='driveEntrust'>
          <slot name="authorizeResourceCode"></slot>
        </div>
        <div class='el-col el-col-24'>
           <slot name="clearDriveEntrust"></slot>
          <!-- <el-button @click="clearDrive()" v-if="editable">清除委托人</el-button> -->
        </div>
      </div>

      <h2 class="tmp-title" v-if="!hide">其他信息</h2>
      <div class="el-row" v-if="!hide">
        <div class='el-col el-col-24 el-col-auto'>
          <slot name="userTag"></slot>
        </div>
      </div>
      <!-- 银行账户信息 -->
      <!-- <div v-show="isEdit">
        <slot name="bankInfo"></slot>
      </div> -->
    </div>
    <!-- 按钮 -->
    <div class="form-button" v-show='editable || !isEdit'>
      <slot name="buttonSubmit"></slot>
      <slot name="buttonReset"></slot>
    </div>
    <!-- tab -->
    <el-tabs type="border-card" v-if="isEdit">
      <!-- <el-tab-pane label="银行账户">
        <slot name="accountList"></slot>
      </el-tab-pane> -->
      <el-tab-pane label="评价记录">
        <slot name="tabEvaluate"></slot>
      </el-tab-pane>
      <el-tab-pane label="变更记录">
        <slot name="logs"></slot>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    isEdit: Boolean,
    editable: Boolean,
    objectName: '',
    clientDetailColumns: Array
  },
  data() {
    return {
    };
  },
  computed: {
    hide() {
      let mark = false; 
      return mark;
    }
  },
  methods:{
    clearDriveEntrust(){

    }
  },
  created() {
  }
};
</script>

<style lang="scss" rel="stylesheet/scss">
@import "../assets/sass/base.scss";

.layout-dirver{
  .authorizePayeePhone {
    .el-form-item__label {
      padding-left: 0px;
    }
  }
}

.voucher {
  height: 100px;
  margin-bottom: 20px;
  // background-color: #f6f6f6;
  overflow: hidden;
  // .el-form-item__label {
  //   display: none !important;
  // }
  // .el-form-item__content {
  //   margin: 0 10px !important;
  // }
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
  .file{
    .el-upload-list__item {
      width:  48px !important;
    }

  }
}

.bug_class_fix{
  .el-form-item{
    .el-form-item__label{
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
// .el-col-6 {
//   .el-form-item__content {
//     white-space: nowrap;
//     overflow: hidden;
//   }
// }
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
  .page-title, #pageRefresh, .hd-opr .innerblock, .hd-opr .el-button--default, .opr-button {
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
