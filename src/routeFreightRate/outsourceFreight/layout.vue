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

    <div class="section">
      <div class="el-row basic-info">
        <!-- 客户运价单号 -->
        <div class="el-col el-col-24" v-show="isEdit">
          <slot name="ratesSystemNo"></slot>
        </div>
        <!-- 客户 -->
        <div class="el-col el-col-12 ">
          <slot name="partnerName"></slot>
        </div>
        <!-- 线路 -->
        <div class="el-col el-col-12 ">
          <slot name="route"></slot>
        </div>
        <!-- 发货单位 -->
        <div class="el-col el-col-12 ">
          <slot name="loadingOrgName"></slot>
        </div>
        <!-- 收货单位 -->
        <div class="el-col el-col-12 ">
          <slot name="unloadingOrgName"></slot>
        </div>
        <!-- 货物名称 -->
        <div class="el-col el-col-12 ">
          <slot name="goodsName"></slot>
        </div>
        <!-- 货物分类 -->
        <div class="el-col el-col-12 ">
          <slot name="goodsCategoryName"></slot>
        </div>
        <!-- 计量标准 -->
        <div class="el-col el-col-12 ">
          <slot name="meterageType"></slot>
        </div>
        <!-- 运价 -->
        <div class="el-col el-col-12 ">
          <slot name="freightPrice"></slot>
        </div>
        <!-- 结算方式 -->
        <div class="el-col el-col-12 ">
          <slot name="clientSettleMethod"></slot>
        </div>
        <!-- 运价开始时间 -->
        <div class="el-col el-col-12 ">
          <slot name="effectiveStartDate"></slot>
        </div>
        <!-- 运价截止时间 -->
        <div class="el-col el-col-12 ">
          <slot name="effectiveEndDate"></slot>
        </div>
        <!-- 审核状态 -->
        <div class="el-col el-col-12" v-show="isEdit">
          <slot name="ratesApproveStatus"></slot>
        </div>
        <!-- 备注 -->
        <div class="el-col el-col-12 ">
          <slot name="description"></slot>
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
import * as utils from '../../../api/Utils';
  export default {
    props: {
      isEdit: Boolean,
      editable: Boolean,
      addMode: Boolean,
      objectName: '',
      domainObjectNew: Object,
      domainObject:Object,
    },
    data(){
      return {
        isWaybill:false
      }
    },
    mounted() {
      let waybillCode = utils.getParamsFromURL(window.location.search).waybillCode;
      this.isWaybill =  !waybillCode? false : true;
    },
    created() {   
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../../assets/sass/base.scss";

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
<style scoped>
 .title{
    font-size: 14px;
    color: #48576a;
    padding-left: 9px;
 }
</style>

