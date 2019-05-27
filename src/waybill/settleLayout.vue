<template>
  <div class="custom-page">
    <div class="page-header clearfix">
      <h2 class="page-title fl">
        {{ title }}
      </h2>
      <div class="hd-opr fr">
        <!-- <slot name="buttonEdit" v-show="isEdit && !editable"></slot>
        <slot name="buttonCancel" v-show="isEdit && editable"></slot>
        <slot name="buttonSave" v-show="isEdit && editable"></slot> -->
        <!--<slot name="buttonChangeLog"></slot>-->
      </div>
      <span id="pageRefresh" class="page-refresh fr"><i class="ico-refresh"></i>刷新</span>
    </div>
    <!-- 运单号匹配 -->
    <div class="section">
      <slot name="waybillMatch"></slot>
    </div>
    <!-- 1 -->
    <div class="section">
      <div class="el-row basic-info" :class="{iswc : showEditClient}">
        <div class="el-col-13 voucher-preview" id="voucherPreview">
          <slot name="showImage"></slot>
        </div>
        <div class="el-col-11 waybill-info">
          <h3 class="tit">运单收发货信息</h3>
          <div class="el-row info">
            <div class="el-col-24">
              <slot name="waybillNo"></slot>
            </div>
            <!-- 显示托运客户，线路名称 -->
            <div class="el-col-24">
              <slot name="clientOrg"></slot>
            </div>
            <div class="el-col-24">
              <slot name="route"></slot>
            </div>
            <!-- <div class="el-col-24" v-show="showEditClient">
              <slot name="clientOrg"></slot>
            </div>
            <div class="el-col-24" v-show="showEditClient">
              <slot name="goodsName"></slot>
            </div> -->
            <div class="el-col-24 hideMeterageType">
              <slot name="meterageType"></slot>
            </div>


            <div class="el-col-12">
              <slot name="truckLicenseNo"></slot>
            </div>
            <div class="el-col-12">
              <slot name="driverFullName"></slot>
            </div>
          </div>
          <div class="voucher hide-delete">
            <div class="el-row">
              <div class="el-col-12">
                <h4 class="tit">发货凭证</h4>
                <!-- <slot name="loadingImage"></slot> -->
                <div class="el-col-24 file">
                  <slot name="loadingAttachment"></slot>
                </div>
              </div>
              <div class="el-col-12">
                <h4 class="tit">收货凭证</h4>
                <!-- <slot name="unloadingImage"></slot> -->
                <div class="el-col-24 file">
                  <slot name="unloadingAttachment"></slot>
                </div>
              </div>
            </div>
          </div>
          <div class="delivery-info">
            <div class="el-row">
              <div class="el-col-12">
                <h4 class="tit">发货</h4>
                <div class="el-col-24">
                  <slot name="loadingGoodsNum"></slot>
                </div>
                <div class="el-col-24">
                  <slot name="loadingGoodsWeight"></slot>
                </div>
                <div class="el-col-24">
                  <slot name="loadingGoodsVolume"></slot>
                </div>
                <div class="el-col-24">
                  <slot name="loadingTime"></slot>
                </div>
              </div>
              <div class="el-col-12">
                <h4 class="tit">收货</h4>
                <div class="el-col-24">
                  <slot name="unloadingGoodsNum"></slot>
                </div>
                <div class="el-col-24">
                  <slot name="unloadingGoodsWeight"></slot>
                </div>
                <div class="el-col-24">
                  <slot name="unloadingGoodsVolume"></slot>
                </div>
                <div class="el-col-24">
                  <slot name="unloadingTime"></slot>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 新增版块 -->
        <div class="ib-wrap">
          <div class="el-col-8">
            <slot name="clientSettleMethod"></slot>
          </div>
          <div class="el-col-8">
            <slot name="settleMethod"></slot>
          </div>
          <div class="el-col-8">
            <slot name="goodsName"></slot>
          </div>
        </div>
      </div>
      <template v-if="clientDetailColumnsFixed.length > 0">
        <h2 class="tmp-title">
              扩展信息
          </h2>
          <div class="el-row">
            <div class="el-col el-col-6" v-for="field in clientDetailColumnsFixed" :class='field'>
              <slot :name="field"></slot>
            </div>
          </div>
      </template>
    </div>
    <!-- 货物清单 -->
    <div class="section">
      <div class="tmp-title item-toggle-header clearfix" title="点击展开收起货物清单" @click="toggleShow()">
        <h2 class="fl">货物清单</h2>
        <span class="fr">
          <i :class="[defaultShow ? 'el-icon-caret-bottom' : 'el-icon-caret-right']"></i>
        </span>
      </div>
      <div class="manifest-box" v-show="defaultShow">
        <slot name="manifestModule"></slot>
      </div>
    </div>
    <!-- 费用信息 -->
    <div class="section">
      <h2 class="tmp-title">费用信息</h2>
      <div class="fee-info">
        <div class="slotChargeList">
          <slot name="slotChargeList"></slot>
        </div>
      </div>
    </div>
    <h2 class="tmp-title" v-if='showSettleConfigValue'>
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
      <div class="el-col el-col-8 el-col-adjust">
        <slot name="settleConfigAmount1"></slot>
      </div>
      <div class="el-col el-col-8 el-col-adjust">
        <slot name="settleConfigAmount2"></slot>
      </div>
      <div class="el-col el-col-8 el-col-adjust">
        <slot name="settleConfigAmount3"></slot>
      </div>
    </div>
    <!--  -->
    <div class="section">
      <slot name="settleForm"></slot>
    </div>
    <el-tabs type="border-card" v-if="isEdit">
      <!-- <el-tab-pane label="凭证记录">
        <slot name="tabVoucherList"></slot>
      </el-tab-pane> -->
      <el-tab-pane label="变更记录">
        <slot name="tabChangeLog"></slot>
      </el-tab-pane>
    </el-tabs>
    <div class="form-button">
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
      objectName: String,
      clientDetailColumns: Array
    },
    data() {
      return {
        defaultShow: true
      }
    },
    computed: {
      //扩展信息需要过滤 扣水 等
      clientDetailColumnsFixed(){
        let list = [];
        let self = this;
        this.clientDetailColumns.forEach(item=>{
          if(item !== 'deductWater' && item !== 'deductWaterAmount'){
            list.push(item);
          }
        })
        return list;
      },
      title() {
        if (this.isEdit) {
          return this.editable ? `${this.objectName}` : `${this.objectName}详情`;
        }
        return `${this.objectName}`;
      },
      showSettleConfigValue() {
        return false;
      },
      showEditClient() {
        return false;
      }
    },
    methods: {
      toggleShow() {
        if (this.defaultShow) {
          this.defaultShow = false;
        } else {
          this.defaultShow = true;
        }
      }
    },
    mounted() {
      console.log('layout mounted', this.$slots);
    },
    created() {
      console.log('child created $slots', this.$slots);
      // console.log('123');
    const localStorage = window.localStorage;
    this.projectName = JSON.parse(localStorage.getItem('appInfo')).projectName || '';
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">

.fee-info {
  margin: 20px;
}

.fuelCompany {
  width: 50% !important;
   .el-autocomplete .el-input {
     width: 338px !important;
   }
}


.hideMeterageType{
  position: fixed;
  left: 0;
  top:0;
  width: 0;
  height: 0;
  overflow: hidden;
  opacity:0;
}



.hide-delete {
  .el-upload-list__item-delete {
    display: none !important;
  }
}
.section {
  margin-top: 0 !important;
  .section {
    margin: 0 20px 10px !important;
  }
  .form-page .tmp-title {
    margin-left: 0;
  }
}
.voucher-preview {
  height: 494px;
  margin-bottom: 20px;
  background-color: #f6f6f6;
}
.waybill-info {
  height: 494px;
  padding: 20px;
  border: solid 1px #ddd;
}
.ib-wrap {
  clear: both;
  padding: 7px 20px 0;
  border: solid 1px #ddd;
  background-color: #f5f5f5;
  &::after {
    content: '';
    display: block;
    clear: both;
    height: 0;
    overflow: hidden;
  }
}
.manifest-box {
  padding: 20px;
}
.iswc {
  .voucher-preview {
    height: 466px;
  }
  .waybill-info {
    height: 466px;
  }
}
.info {
  padding: 10px !important;
}
.tit {
  padding: 7px 10px;
  background-color: #f6f6f6;
  font-size: 14px;
  text-align: center;
}
.delivery-info, .voucher {
  border: dashed 1px #ddd;
  .tit {
    margin-bottom:7px;
    border-bottom: dashed 1px #ddd;
  }
  .el-row {
    padding: 0 !important;
    .el-col-12 {
      border-right: dashed 1px #ddd;
    }
  }
  .el-input {
    width: 130px;
  }
}
.form-page .delivery-info .el-date-editor {
  width: 159px !important;
}
.form-page .el-select {
  width: 174px !important;
}
.form-page .complex-control-2 .el-select {
  width: 105px !important;
}
.voucher {
  height: 100px;
  margin-bottom: 20px;
  background-color: #f6f6f6;
  overflow: hidden;
  .el-form-item__label {
    display: none !important;
  }
  .el-form-item__content {
    margin: 0 10px !important;
  }
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

.item-toggle-header {
  cursor: pointer;

  &:hover {
    background-color: #eee !important;
  }

  .fl {
    font-weight: 700;
  }
}

@media (max-width: 1366px) {
  .waybill-info {
    padding: 2px;
  }
  .form-page .delivery-info {
    .el-form-item__label {
      width: 80px !important;
    }
    .el-form-item__content {
      margin-left: 80px !important;
      .el-form-item__content {
        margin-left: 0 !important;
      }
    }
  }
  .delivery-info .el-input {
    width: 83px !important;
  }
  .form-page .complex-control-2 .el-select, .delivery-info .el-select .el-input {
    width: 75px !important;
  }
  .form-page .el-select {
    width: 164px !important;
  }
  .form-page .delivery-info .innerblock .el-date-editor {
    width: 164px !important;
  }
}
</style>
