<template>
  <div class="custom-page truckManageMentLayout">
    <div class="page-header clearfix">
      <h2 class="page-title fl">
        {{ isEdit ? ( editable ? '编辑' + objectName : objectName + '详情' ): ( '新建' + objectName) }}
      </h2>
      <div class="hd-opr fr">
        <slot name="buttonEdit"></slot>
        <slot name="buttonCanvel"></slot>
        <slot name="buttonSave"></slot>
        <!-- <slot name="buttonChangeLog"></slot> -->
      </div>
      <span id="pageRefresh" class="page-refresh fr"><i class="ico-refresh"></i>刷新
      </span>
    </div>
    <!-- 1 -->
    <div class="section">
      <h2 class="tmp-title">
            认证信息
        </h2>
      <div class="el-row col-ident">
        <!-- 车牌号 -->
        <div class="el-col el-col-6">
          <slot name="truckLicenseNo"></slot>
        </div>
        <!-- 牌照类型 -->
        <div class="el-col el-col-6">
          <slot name="truckLicenseType"></slot>
        </div>
        <!-- 认证状态 -->
        <div class="el-col el-col-6">
          <slot name="certStatus"></slot>
        </div>
        <!--车辆所有人  -->
        <div class="el-col el-col-6">
          <slot name="truckOwner"></slot>
        </div>
        <!--车辆照片 truck_picture_resource_code -->
        <div class="el-col el-col-6">
          <slot name="truckPictureResourceCode"></slot>
        </div>
        <!-- 车型 -->
        <div class="el-col el-col-6">
          <slot name="truckModelCode"></slot>
        </div>
        <!-- 车长 -->
        <div class="el-col el-col-6">
          <slot name="truckLength"></slot>
        </div>
        <!-- 载重 -->
        <div class="el-col el-col-6">
          <slot name="regTonnage"></slot>
        </div>
        <!-- 行驶证附件 driving_license_recourse_code -->
        <div class="el-col el-col-6">
          <slot name="drivingLicenseRecourseCode"></slot>
        </div>
        <!-- 车辆识别代号 truck_identify_code-->
        <div class="el-col el-col-6">
          <slot name="truckIdentifyCode"></slot>
        </div>
        <!-- 发动机号码 truck_engine_no -->
        <div class="el-col el-col-6" v-if='showTruckEngineNo'>
          <slot name="truckEngineNo"></slot>
        </div>
        <!-- 行驶证过期日期 driving_license_expiration_date -->
        <div class="el-col el-col-6 col-spe">
          <slot name="drivingLicenseExpirationDate"></slot>
        </div>
        <!-- 运输证附件 transport_license_recourse_code-->
        <div class="el-col el-col-6">
          <slot name="transportLicenseRecourseCode"></slot>
        </div>
        <!-- 道路运输证号 -->
        <div class="el-col el-col-6">
          <slot name="transportLicenseNo"></slot>
        </div>
        <!--运输经营许可证  -->
        <div class="el-col el-col-6 col-spe">
          <slot name="vehiclePermitNumber"></slot>
        </div>
        <!-- 运输证过期日期 transport_license_expiration_date-->
        <div class="el-col el-col-6 col-spe">
          <slot name="transportLicenseExpirationDate"></slot>
        </div>
        <!-- 车辆经营范围 truck_biz_scope-->
        <div class="el-col el-col-6">
          <slot name="truckBizScope"></slot>
        </div>
        <!-- -->
        <div class="el-col el-col-6">
          <slot name="isTrailer"></slot>
        </div>
        <!-- 总质量 -->
        <div class="el-col el-col-6">
          <slot name="truckTotalWeight"></slot>
        </div>
        <!-- 准牵引总质量 新加 truck_tow_weight-->
        <div class="el-col el-col-6">
          <slot name="truckTowWeight"></slot>
        </div>
        <div class="el-col-6 networkStatus">
          <slot name="networkStatus"></slot>
          <span @click='commonRoboticNetworkStatus' class="ico-robotic"></span>
        </div>

        <!-- end -->
      </div>
    </div>
    <div class="section">
      <h2 class="tmp-title">
        扩展信息
      </h2>
      <div class="el-row">
        <div class="el-col el-col-6">
          <slot name="truckBrand"></slot>
        </div>
        <!--联系人 truck_linkman -->
        <div class="el-col el-col-6">
          <slot name="truckLinkman"></slot>
        </div>
        <!--联系手机号  -->
        <div class="el-col el-col-6">
          <slot name="truckFixedMobile"></slot>
        </div>
        <!-- 车宽 -->
        <div class="el-col el-col-6">
          <slot name="truckWidth"></slot>
        </div>
        <!-- 车高 -->
        <div class="el-col el-col-6">
          <slot name="truckHeight"></slot>
        </div>
        <!-- 容积 -->
        <div class="el-col el-col-6">
          <slot name="cubage"></slot>
        </div>
        <!-- 动力类型 -->
        <div class="el-col el-col-6">
          <slot name="powerType"></slot>
        </div>
        <!--整备质量  -->
        <div class="el-col el-col-6">
          <slot name="truckCurbWeight"></slot>
        </div>
        <!--注册日期  -->
        <div class="el-col el-col-6">
          <slot name="truckRegisterDate"></slot>
        </div>
        <!-- end -->
      </div>
      <template v-if="clientDetailColumns.length > 0">
        <h2 class="tmp-title">
              扩展信息
          </h2>
        <div class="el-row">
          <div class="el-col el-col-6" v-for="field in clientDetailColumns" :key="field" :id='field'>
            <slot :name="field"></slot>
          </div>
        </div>
      </template>
    </div>
    <div class="section">
      <h2 class="tmp-title">
        加入的公司
      </h2>
      <div class="el-row join-company">
        <ul class="jc-list">
          <li v-for="company in companyData" :key="company.code">
            {{ company.orgFullName }}
          </li>
        </ul>
      </div>
    </div>
    <!-- tabs -->
    <el-tabs type="border-card" v-if="isEdit">
      <el-tab-pane label="变更记录">
        <slot name="tabChangeLog"></slot>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script type="text/ecmascript-6">
import {freightForwarderJsMixin} from '../common/freight-forwarder-js-mixin';
export default {
  props: {
    isEdit: Boolean,
    editable: Boolean,
    objectName: '',
    companyData: Array,
    domainObject:Object,
    clientDetailColumns: Array,
  },
  mixins: [freightForwarderJsMixin],
  computed:{
    showTruckEngineNo(){
      if(this.domainObject){
        if(this.domainObject.isTrailer !== undefined && this.domainObject.isTrailer !== null ){
          if(this.domainObject.isTrailer === 'false'){
            return true;
          }
        }
      }
      return false;
    }
  },
  mounted() {
    console.log('layout mounted', this.$slots);
  },
  created() {
  }
};

</script>
<style lang="scss" rel="stylesheet/scss">
@import "../assets/sass/base.scss";

.jc-list {
  li {
    padding-left: 10px;
    font-size: 14px;
    margin-bottom: 10px;
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

.contract-desp {
  .el-input__inner {
    width: 458px;
  }
}

.el-col-description {
  height: 247px !important;
  .el-textarea__inner {
    height: 240px !important;
  }
}

@media (max-width: 1366px) {
  .form-page .innerblock {
    margin-right: 6px !important;
  }
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

.truckManageMentLayout {

  .networkStatus {
    position: relative;
    .ico-robotic {
      left: 250px;
    }
  }

  //  图片处理 css
  // 修改图片格式样式 --start
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
  }

  // 修改图片格式样式 ---end
}



//行间距-start
// .el-col{
//   margin-bottom: 20px;
// }
.col-ident {
  .el-col {
    margin-bottom: 20px;
  }
}

//行间距-end
// 有几行 字数太长 此处做处理 str -spe
.col-spe {
  .el-form-item {
    .el-form-item__label {
      margin-right: 20px !important;
    }
    .el-form-item__content {
      .el-date-editor {
        width: 150px !important;
      }
      .el-input {
        width: 150px;
      }
    }
  }
}

</style>
