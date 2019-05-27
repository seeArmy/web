<template>
  <div class="custom-page truckLayout">
    <div class="page-header clearfix">
      <h2 class="page-title fl">
        {{ isEdit ? ( editable ? '编辑' + objectName : objectName + '详情' ): ( '新建' + objectName) }}
      </h2>
      <div class="truck-location fl" v-if="isEdit && hasLocation">
        车辆定位：
        <span class="el-tag el-tag--primary">GPS</span>
        <span class="address">{{truckAddress}}</span>
        <a :href="truckGpsUrl" class="blue" target="_blank">点击查看&gt;&gt;</a>
      </div>
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
      <h2 class="tmp-title">
        认证信息<span class="org" v-if="!canEdit">（注：当前车辆认证状态为{{ text }}，此版块信息不可编辑）</span>
      </h2>
      <div class="el-row col-ident">
        <!-- 车牌号 -->
        <div class="el-col el-col-6">
          <!-- <div class="el-col el-col-18"> -->
            <slot name="truckLicenseNo"></slot>
          <!-- </div> -->
          <!-- <div class="el-col el-col-6" v-show='editable'>
            <slot name="truckLicenseNoMatch"></slot>
          </div> -->
          <!-- <slot name="truckLicenseNo"></slot> -->
        </div>
        <!-- 牌照类型 -->
        <div class="el-col el-col-6">
          <slot name="truckLicenseType"></slot>
        </div>
        <!-- 认证状态 -->
        <div class="el-col el-col-6">
          <slot name="certStatus"></slot>
        </div>
        <!-- 车辆种类 -->
        <div class='el-col el-col-6'>
          <slot name="isTrailer"></slot>
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
        <div class="el-col el-col-6">
          <!-- <slot name="truckEngineNo"></slot> -->
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
        <!--车辆所有人  -->
        <div class="el-col el-col-24">
          <slot name="truckOwner"></slot>
        </div>
        <!-- 车辆经营范围 truck_biz_scope-->
        <div class="el-col el-col-24 el-col-description">
          <slot name="truckBizScope"></slot>
        </div>
        <!-- end -->
      </div>
      <template v-if="clientDetailColumns.length > 0">
        <h2 class="tmp-title">
              扩展信息
          </h2>
        <div class="el-row col-ident col-custom">
          <div class="el-col el-col-6" v-for="field in clientDetailColumns">
            <slot :name="field"></slot>
          </div>
        </div>
      </template>
    </div>
    <!-- 2 -->
    <div class="section" v-if="additionalShow">
      <h2 class="tmp-title">
        附加信息
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
        <!-- 总质量 -->
        <div class="el-col el-col-6">
          <slot name="truckTotalWeight"></slot>
        </div>
        <!-- 准牵引总质量 新加 truck_tow_weight-->
        <div class="el-col el-col-6">
          <slot name="truckTowWeight"></slot>
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
    </div>
    <!-- 3 -->
    <div class="section">
      <h2 class="tmp-title">
        备注信息
      </h2>
      <div class="el-row">
        <!-- 备注 -->
        <div class="el-col el-col-24 el-col-description">
          <slot name="description"></slot>
        </div>
        <div class="el-col el-col-24 el-col-auto">
          <slot name="truckTag"></slot>
        </div>
        <!-- end -->
      </div>
    </div>
    <!-- 4 -->
<!--     <div class="section" v-if="isEdit">
      <h2 class="tmp-title">
        司机信息
      </h2>
      <slot name="driverInfo"></slot>
    </div> -->
    <!-- 5 -->
    <div class="section" v-if="isEdit">
      <!-- <h2 class="tmp-title">
        最后信息
      </h2> -->
      <div class="el-row" v-show="isEdit && !editable">
        <!-- 创建人 -->
        <div class="el-col el-col-6">
          <slot name="creatorUser"></slot>
        </div>
        <!-- 创建时间 -->
        <div class="el-col el-col-6">
          <slot name="createTime"></slot>
        </div>
        <!-- 修改人 -->
        <div class="el-col el-col-6">
          <slot name="updateUser"></slot>
        </div>
        <!-- 修改时间 -->
        <div class="el-col el-col-6">
          <slot name="updateTime"></slot>
        </div>
        <!-- end -->
      </div>
    </div>
    <div class="form-button" v-show='editable || !isEdit'>
      <slot name="buttonSubmit"></slot>
      <slot name="buttonReset"></slot>
    </div>
    <!-- tab panel -->
    <div class="tab-panel" v-if="isEdit">
      <slot name="moreRecords"></slot>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
/* eslint-disable no-var */
/* eslint-disable vars-on-top */
import * as utils from '../../api/Utils';
import * as TruckService from '../../api/TruckService';
import * as LbsService from '../../api/LbsService';
import LbsLib from '../LbsLib';

export default {
  props: {
    isEdit: Boolean,
    editable: Boolean,
    objectName: '',
    truckLicenseNo: '',
    domainObject: Object,
    clientDetailColumns: Array
  },
  data() {
    return {
      projectName: JSON.parse(localStorage.getItem('appInfo')).projectName,
      truckAddress: '',
      truckGpsUrl: '',
      hasLocation: false
    };
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
    },
    canEdit() {
      let mark = true;
      if (this.domainObject && this.domainObject.certStatus) {
        mark = this.domainObject.certStatus === 'unauthenticated' || this.domainObject.certStatus === 'failed';
      }
      return mark;
    },
    additionalShow() {
      return false;
    },
    showAddFields() {
      let mark = true; // 默认显示
      if(!this.isEdit){
        mark = false;
      }
      return mark;
    }
  },
  filters: {
    getTruckGpsUrl(truckNo) {
      var url = `/truck/truck-gps.html?truckLicenseNo=${truckNo}`;
      console.log(url);
      return url;
    }
  },
  created() {
    // console.log('123');
    const params = utils.getParamsFromURL(window.location.search);
    this.code = params.code;
    console.log(this.code);

    if (this.code) {
      TruckService.get({
        code: this.code
      }, (truckSuccess, err) => {
        const truckLicenseNo = truckSuccess.content.truckLicenseNo;
        console.log(this.truckGpsUrl);

        LbsService.getPosition({
            truckLicenseNo
          },
          (lbsSuccess, lbsErr) => {
            if (lbsSuccess.content.length > 0) {
              const item = lbsSuccess.content[0];
              LbsService.getAddress({
                type: 0,
                lat: item.lat,
                lng: item.lng
              }, (addressSuccess, addressError) => {
                this.truckAddress = addressSuccess.content.address || '';
                this.truckGpsUrl = `/truck/truck-gps.html?truckLicenseNo=${truckLicenseNo}`;
                this.hasLocation = true;
              });
            }
          });
      });
    }
  }
};
// scaffold

</script>
<style lang="scss" rel="stylesheet/scss">
@import "../assets/sass/base.scss";

.col-custom {
  .el-col:nth-child(3),
  {
    width: 50% !important;
  }
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

.bug_class_fix {
  .el-form-item {
    .el-form-item__label {
      width: 120px !important;
    }
  }
}



.section {
  .el-row {
    padding-bottom: 0 !important;
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

.truckLayout {

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


// 有几行 字数太长 此处做处理 end -spe

</style>
