<template>
  <div class="custom-page ishn" id="page_layout_cert_truck">
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
      <span id="pageRefresh" class="page-refresh fr"><i class="ico-refresh"></i>刷新
      </span>
    </div>
    <!-- 1 -->
    <div class="section">
      <div class="el-row basic-info">
        <div class="el-col-13 voucher-preview" v-if="isShow" id="voucherPreview">
          <slot name="showImage"></slot>
        </div>
        <div :class="isShow ? 'el-col-11 page-info hide-delete' : 'el-col-24 page-info hide-delete'">
          <h3 class="tit">车辆认证</h3>
          <!-- sec1 行驶证 -->
          <div class="el-row sec1 sep-line">
            <div class="el-col-10 el-col-vertical">
              <slot name="drivingLicenseRecourseCode"></slot>
            </div>
            <div class="el-col-14">
              <div class="el-col-24">
                <slot name="truckLicenseNo"></slot>
              </div>
              <div class="el-col-24">
                <slot name="truckLicenseType"></slot>
              </div>
              <div class="el-col-24">
                <slot name="isTrailer"></slot>
              </div>
              <div class="el-col-24">
                <slot name="truckModelCode"></slot>
              </div>
              <div class="el-col-24 select-short">
                <slot name="truckLength"></slot>
              </div>
              <div class="el-col-24 select-short">
                <slot name="truckTotalWeight"></slot>
              </div>
              <div class="el-col-24 select-short">
                <slot name="regTonnage"></slot>
              </div>
              <div class="el-col-24 select-short">
                <slot name="truckTowWeight"></slot>
              </div>
              <div class="el-col-24" v-if='showTruckEngineNo'>
                <slot name="truckEngineNo"></slot>
              </div>
              <div class="el-col-24">
                <slot name="drivingLicenseExpirationDate"></slot>
              </div>
            </div>
          </div>
          <!-- sec2 运输证 -->
          <div class="el-row sec2 sep-line">
            <div class="el-col-10 el-col-vertical">
              <slot name="transportLicenseRecourseCode"></slot>
            </div>
            <div class="el-col-14">
              <div class="el-col-24">
                <slot name="transportLicenseNo"></slot>
              </div>
              <div class="el-col-24">
                <slot name="truckOwner"></slot>
              </div>
              <!-- 经营许可证 -->
              <div class="el-col-24">
                <slot name="vehiclePermitNumber"></slot>
              </div>
              <div class="el-col-24">
                <slot name="operateLicenseNo"></slot>
              </div>
              <div class="el-col-24">
                <slot name="transportLicenseExpirationDate"></slot>
              </div>
              <div class="el-col-24 networkStatus">
                <slot name="networkStatus"></slot>
              </div>
            </div>
          </div>
          <!-- sec3 交强险保单 -->
          <!--    <div class="el-row sec2 sep-line">
              <div class="el-col-10 el-col-vertical">
                <slot name="tciResourceCode"></slot>
              </div>
              <div class="el-col-14">
                <div class="el-col-24">
                  <slot name="tciNo"></slot>
                </div>
                <div class="el-col-24">
                  <slot name="tciCompany"></slot>
                </div>
                <div class="el-col-24">
                  <slot name="tciExpirationDate"></slot>
                </div>
              </div>
            </div> -->
          <!-- sec3 商业险保单 -->
          <div class="el-row sec3 sep-line">
            <!--  <div class="el-col-10 el-col-vertical">
                <slot name="vicResourceCode"></slot>
              </div> -->
            <!--  <div class="el-col-14">
                <div class="el-col-24">
                  <slot name="vicNo"></slot>
                </div>
                <div class="el-col-24">
                  <slot name="vicCompany"></slot>
                </div>
                <div class="el-col-24">
                  <slot name="vicExpirationDate"></slot>
                </div>
              </div> -->
          </div>
          <!-- audit-result -->
          <div class="el-row audit-result">
            <div class="el-col-24">
              <slot name="certStatus"></slot>
            </div>
            <div class="el-col-24 el-col-description">
              <slot name="auditDescription"></slot>
            </div>
          </div>
          <!-- by -->
          <div class="el-row audit-by" v-show='!editable'>
            <div class="el-col-24">
              <slot name="requestOrgFullname"></slot>
            </div>
            <div class="el-col-24">
              <slot name="requestUserFullname"></slot>
            </div>
          </div>
          <div class="el-row audit-by" v-show='!editable'>
            <div class="el-col-24">
              <slot name="requestTime"></slot>
            </div>
          </div>
          <!-- form-button -->
          <div class="form-button" v-show='editable || !isEdit' v-if="isShow">
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
import {freightForwarderJsMixin} from '../../common/freight-forwarder-js-mixin';
export default {
  props: {
    isShow: {
      type: Boolean,
      'default': true
    },
    isEdit: Boolean,
    editable: Boolean,
    objectName: '',
    domainObject: Object,
  },
  mixins: [freightForwarderJsMixin],
  computed: {
    showTruckEngineNo() {
      if (this.domainObject) {
        if (this.domainObject.isTrailer !== undefined && this.domainObject.isTrailer !== null) {
          if (this.domainObject.isTrailer === 'false') {
            return true;
          }
        }
      }
      return false;
    },
    title() {
      if (this.isEdit) {
        return this.editable ? `${this.objectName}` : `${this.objectName}详情`;
      }
      return `${this.objectName}`;
    }
  },
  data() {
    return {
      isshowMatch: '',
      projectName: JSON.parse(localStorage.getItem('appInfo')).projectName
    }
  }
};

</script>
<style lang="scss" rel="stylesheet/scss">
@import "../../assets/sass/base.scss";

#page_layout_cert_truck {
  .networkStatus {
    position: relative;
    .ico-robotic {
      left: 250px;
    }
  }
  .select-short {
    .el-select {
      width: 80px;
    }
  }
}


.ishn {

  .el-upload.el-upload--picture-card,
  .el-upload-list__item-status-label,
  .del-btn {
    display: none !important;
  }
}

.hide-delete {
  .el-upload-list__item-delete {
    display: none !important;
  }
}

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
  height: 900px;
  background-color: #f6f6f6;
}

.page-info {
  height: 900px;
  border: solid 1px #ddd;

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

  .el-upload.el-upload--picture-card,
  .el-upload-list--picture-card .el-upload-list__item {
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

// 小屏 ....
@media (max-width: 1366px) {
  .form-button {
    .el-button--large {
      min-width: 120px !important;
    }
  }

  .form-page .innerblock .el-date-editor {
    width: 140px !important;
  }

  .complex-control-2 {
    .el-input {
      width: 60px;
    }

    .el-select {
      width: 74px !important;
    }
  }
}

</style>
