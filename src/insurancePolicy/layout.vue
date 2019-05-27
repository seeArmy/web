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
      <a :href="url" target="_blank" class="blue view-public">查看公共详情</a>
      <div class="el-row basic-info">  
        <!-- 保险单号 -->
        <div class="el-col el-col-12 ">
          <slot name="insurancePolicyNo"></slot>
        </div>
        <!-- 线下保单ID -->
        <div class="el-col el-col-12" :style="{'visibility':(isEdit ? 'visible' : 'hidden')}">
          <slot name="insuranceNo"></slot>
        </div>
        <!-- 保险产品名称 -->
        <div class="el-col el-col-12" >
          <slot name="insuranceProductName"></slot>
        </div>
        <!-- 保险公司名称 -->
        <div class="el-col el-col-12 ">
          <slot name="insuranceCompanyName"></slot>
        </div>
        <!-- 开始时间 -->
        <div class="el-col el-col-12 ">
          <slot name="startTime"></slot>
        </div>
        <!-- 截止时间 -->
        <div class="el-col el-col-12 ">
          <slot name="endTime"></slot>
        </div>
        <!-- 备注 -->
        <div class="el-col el-col-24 ">
          <slot name="description"></slot>
        </div>
          <!-- 保险单文件 -->
        <div class="el-col el-col-12 ">
          <slot name="insuranceAttachment"></slot>
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
import * as utils from '../../api/Utils';
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
        code: utils.getParamsFromURL(window.location.search).code
      }
    },
    computed: {
      url() {
        let url = '';
        url = `/page/insurance.html?code=${this.code}`;
        return url;
      }
    },
    mounted() {
    },
    created() {   
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../assets/sass/base.scss";
  .view-public {
    position: absolute;
    z-index: 9999;
    top: 62px;
    right: 20px;
    font-size: 14px;
  }
  .form-button {
    text-align: center;
    padding: 20px;
    margin-top: 200px;
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

