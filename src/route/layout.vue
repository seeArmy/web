<template>
  <div class="custom-page page_route_layout">
    <div class="page-header clearfix">
      <h2 class="page-title fl">
        {{ isEdit ? ( editable ? '编辑' + objectName : objectName + '详情' ): ( '新建' + objectName) }}
      </h2>
      <div class="hd-opr fr">
        <slot name="buttonEdit"></slot>
        <slot name="buttonCancel"></slot>
        <slot name="buttonSave"></slot>
        <!-- <slot name="buttonChangeLog"></slot> -->
      </div>
    </div>
    <div class="section">
      <!-- <h2 class="tmp-title">
          线路信息
      </h2> -->
      <div class="el-row">
        <div class="el-col el-col-12 long-input">
          <slot name="routeName"></slot>
        </div>
        <div class="el-col el-col-12">
          <slot name="businessTypeCode"></slot>
        </div>
        <!-- 标准运距 -->
        <div class="el-col el-col-12">
          <slot name="standardDistance"></slot>
        </div>
        <!-- 标准时长 -->
        <div class="el-col el-col-12">
          <slot name="standardTime"></slot>
        </div>
        <div class="light-bg clearfix clear">
          <!-- 发货单位 -->
          <div class="el-col el-col-12 long-input">
            <slot name="loadingOrg"></slot>
          </div>
          <!-- 收货单位 -->
          <div class="el-col el-col-12 long-input">
            <slot name="unloadingOrg"></slot>
          </div>
          <!-- 发货联系人 -->
          <div class="el-col el-col-12 long-input">
            <slot name="loadingLinkmanFullName"></slot>
          </div>
          <!-- 收货联系人 -->
          <div class="el-col el-col-12 long-input">
            <slot name="unloadingLinkmanFullName"></slot>
          </div>
          <!-- 发货联系电话 -->
          <div class="el-col el-col-12 long-input">
            <slot name="loadingContact"></slot>
          </div>
          <!-- 收货联系电话 -->
          <div class="el-col el-col-12 long-input">
            <slot name="unloadingContact"></slot>
          </div>
          <!-- 发货地 -->
          <div class="el-col el-col-12">
            <slot name="loadingArea"></slot>
          </div>
          <!-- 收货地 -->
          <div class="el-col el-col-12">
            <slot name="unloadingArea"></slot>
          </div>
          <!-- 发货地址 -->
          <div class="el-col el-col-12 address">
            <slot name="loadingAddress"></slot>
            <slot name="loadingAddressMap"></slot>
            <!-- <span slot="loadingAddressMap" @click='showAddress' class="show-gps-icon"></span> -->
          </div>
          <!-- 收货地址 -->
          <div class="el-col el-col-12 address">
            <slot name="unloadingAddress"></slot>
            <slot name="unloadingAddressMap"></slot>
          </div>
          <!-- 电子围栏 start-->
          <div class="el-col el-col-12 fanceRediusMap">
            <slot name="loadingFanceRedius"></slot>
            <slot name="loadingFanceRediusMap"></slot>
          </div>
          <div class="el-col el-col-12 fanceRediusMap">
            <slot name="unloadingFanceRedius"></slot>
            <slot name="unloadingFanceRediusMap"></slot>
          </div>
          <!-- 电子围栏 end-->
        </div>
        <!-- 备注 -->
        <div class="el-col el-col-24 el-col-description">
          <slot name="description"></slot>
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
    <!-- tabs -->
    <el-tabs type="border-card" slot="moreRecords" v-if="isEdit">
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
<script>
import * as utils from '../../api/Utils';

export default {
  props: {
    isEdit: Boolean,
    editable: Boolean,
    objectName: '',
    fields: {
      type: Array,
      'default': []
    },
    clientDetailColumns: Array
  },
  methods: {
    //显示地图
    showAddress() {

    },
  },
  created() {
    const params = utils.getParamsFromURL(window.location.search);
    this.code = params.code;
  }
};

</script>
<style lang="scss" rel="stylesheet/scss">
@import "../assets/sass/base.scss";

.theme-blue {
  .page_route_layout {
    .long-input {
      .el-input__inner {
        width: 362px;
      }
    }
  }
}


.page_route_layout {
  .complex-control-2 .el-select {
    width: 100px !important;
  }

  .address {
    position: relative;

    .el-input {
      width: 239px;
    }

    .select-address-map {
      position: absolute;
      top: 0;
      left: 344px;
    }

    .ll-status {
      margin-right: 5px;
    }

    .show-gps-icon {
      cursor: pointer;
      display: inline-block;
      width: 24px;
      height: 24px;
      background: url(./gps.png) no-repeat 0 0;
      background-size: 24px 24px;
      position: absolute;
      top: 0;
      left: 300px;
    }

    .show-gps-icon-color {
      background: url(./gps_red.png) no-repeat 0 0;
      background-size: 24px 24px;
    }
  }

  .fanceRediusMap {
    position: relative;

    .show-radius {
      cursor: pointer;
      display: inline-block;
      width: 50px;
      height: 24px;
      position: absolute;
      top: 0;
      left: 290px;
      text-align: center;
      line-height: 24px;
    }

    .show-radius-color {
      border: 1px solid #f48400;
      border-radius: 3px;
    }
  }
}

.theme-blue {
  .show-radius-color {
    border-color: #0054a7 !important;
  }
}


.clear {
  clear: both;
}

.light-bg {
  padding-top: 10px;
  margin-bottom: 10px;
  background-color: #f8f8f8;
}

.form-page {
  .innerblock {
    margin-right: 6px !important;
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

  .complex-control-4 {
    .el-input {
      width: 83px;
    }
  }

  .form-page .innerblock .el-date-editor {
    width: 165px !important;
  }
}

</style>
