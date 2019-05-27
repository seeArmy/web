<template>
  <div id='layout-outlogist-add' class="custom-page outsourcingLogisticslayout fix-input-page ishn" >
    <div class="page-header clearfix">
      <h2 class="page-title fl">
        {{ isEdit ? ( editable ? '编辑' + objectName : objectName + '详情' ): ( '新建' + objectName) }}
      </h2>
      <div class="hd-opr fr">
        <slot name="buttonEdit"></slot>
        <slot name="buttonCancel"></slot>
        <slot name="buttonSave"></slot>
        <!--<slot name="buttonChangeLog"></slot>-->
      </div>
      <span id="pageRefresh" class="page-refresh fr"><i class="ico-refresh"></i>刷新</span>
    </div>
    <!-- 1 -->
    <div class="section">
      <h2 class="tmp-title">
      	    基本信息
        </h2>
      <div class="el-row">

        <!-- 新建的样式  !isEdit-->
        <template v-if='!isEdit'>
          <div class="base-info bi-new">
            <!-- 线下订单编号 -->
            <div class="el-col el-col-12">
              <slot name="logisticsExternalNo1"></slot>
            </div>
            <!-- 承运方 -->
            <div class="el-col el-col-12">
              <slot name="carrierOrgCode"></slot>
            </div>
            <!-- 客户合约 -->
            <div class="el-col el-col-23 sepline">
              <slot name="clientContract"></slot>
            </div>
            <!-- 货物装车模式 -->
<!--             <div class="el-col el-col-12 sepline">
              <slot name="loadingMode"></slot>
            </div> -->
          </div>
        </template>
        <!-- 详情+编辑的样式 -->
        <template v-else>
          <div class="base-info bi-detail">
            <!-- 订单号 -->
            <div class="el-col el-col-8">
              <slot name="logisticsNo"></slot>
            </div>
            <!-- 线下订单编号 -->
            <div class="el-col el-col-8">
              <slot name="logisticsExternalNo1"></slot>
            </div>
            <!-- 订单状态 -->
            <div class="el-col el-col-8">
              <slot name="logisticsStatus"></slot>
            </div>
            <!-- 托运客户 -->
            <div class="el-col el-col-8 sepline">
              <slot name="clientOrg"></slot>
            </div>
            <!-- 承运方 -->
            <div class="el-col el-col-8 sepline">
              <slot name="carrierOrgCode"></slot>
            </div>
            <!-- 客户合约 -->
            <div class="el-col el-col-8 sepline">
              <slot name="clientContract"></slot>
            </div>
            <!-- 货物装车模式 -->
<!--             <div class="el-col el-col-24 sepline">
              <slot name="loadingMode"></slot>
            </div> -->
          </div>
        </template>

        <!-- 表格 货单模块 start  ==================================== -->
        <div>
          <slot name="manifestModule"></slot>
        </div>
        <!-- 表格 end    ==================================== -->

        <div class="manifestmodulefotter clearfix clear">
          <!-- 无车承运上报货物类型 -->
          <div class="el-col el-col-8 label-width-auto">
            <slot name="cargoTypeClassificationCode"></slot>
          </div>
          <!-- 无车承运上报货物名称 -->
          <div class="el-col el-col-8 label-width-auto">
            <slot name="goodsName"></slot>
          </div>
          <!-- 需求车次 -->
          <div class="el-col el-col-8">
            <slot name="truckQty"></slot>
          </div>
        </div>

        <!-- 线路版块  start ========================== -->
        <!-- 线路名称 -->
        <div class="light-bg clearfix clear">
          <!-- 是否同步更新 -->
          <div class="clearfix clear" v-if='editable'>
            <slot name="syncModule"></slot>
          </div>
          <!-- 线路 -->
          <div class="el-col el-col-24 sepline-route">
            <slot name="route"></slot>
          </div>
          <!-- 运输业务类型 -->
          <div class="el-col el-col-12 sepline-route">
            <slot name="businessTypeCode"></slot>
          </div>
          <!-- 运输业务类型 -->
          <div class="el-col el-col-12">
            <slot name="standardDistance"></slot>
          </div>
          <!-- 发货单位 -->
          <div class="el-col el-col-12 el-long">
            <slot name="loadingOrg"></slot>
          </div>
          <!-- 收货单位 -->
          <div class="el-col el-col-12 el-long">
            <slot name="unloadingOrg"></slot>
          </div>
          <!-- 发货联系人 -->
          <div class="el-col el-col-12">
            <slot name="loadingUserFullName"></slot>
          </div>
          <!-- 收货联系人 -->
          <div class="el-col el-col-12">
            <slot name="unloadingUserFullName"></slot>
          </div>
          <!-- 发货联系电话 -->
          <div class="el-col el-col-12">
            <slot name="loadingUserPhone"></slot>
          </div>
          <!-- 收货联系电话 -->
          <div class="el-col el-col-12">
            <slot name="unloadingUserPhone"></slot>
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
          <div class="el-col el-col-12 el-long el-col-auto">
            <slot name="loadingAddress"></slot>
          </div>
          <!-- 收货地址 -->
          <div class="el-col el-col-12 el-long el-col-auto">
            <slot name="unloadingAddress"></slot>
          </div>
        </div>
        <!-- 线路版块  end ========================== -->

        <!-- 价格  start ========================== -->
        <div class="highlight-bg clearfix clear">
          <!-- 外包运价 -->
          <div class="el-col el-col-12">
            <slot name="clientFreightPrice"></slot>
          </div>
          <!-- 外包结算方式 -->
          <div class="el-col el-col-12">
            <slot name="clientSettleMethod"></slot>
          </div>
          <!-- 运价备注 -->
          <div class="el-col el-col-24">
            <slot name="ratesDescription"></slot>
          </div>
        </div>
        <div class="el-col el-col-12">
          <slot name="logisticsPlanStartTime"></slot>
        </div>
        <div class="el-col el-col-12">
          <slot name="logisticsPlanEndTime"></slot>
        </div>
        <!-- 订单备注 -->
        <div class="el-col el-col-24 description">
          <slot name="description"></slot>
        </div>
        <!-- 价格  end   ========================== -->
      </div>
      <template v-if="clientDetailColumns.length > 0">
        <h2 class="tmp-title">
	      	    扩展信息
	        </h2>
        <div class="el-row">
          <div v-if=" calculateFieldShow(field) " class="el-col el-col-6" v-for="field in clientDetailColumns" :id='field'>
            <slot :name="field"></slot>
          </div>
        </div>
      </template>
      <div>
        <slot name="logisticsPrice"></slot>
      </div>
    </div>
    <!-- tab 栏目 start ================================================== -->
    <el-tabs type="border-card" v-if="isEdit">
      <el-tab-pane label="运单记录">
        <slot name="tabWaybill"></slot>
      </el-tab-pane>
      <el-tab-pane label="凭证记录" v-if="showImgTab">
        <slot name="tabEvidence"></slot>
      </el-tab-pane>
      <el-tab-pane label="调价记录">
        <slot name="tabPriceChangeLog"></slot>
      </el-tab-pane>
      <el-tab-pane label="变更记录">
        <slot name="tabChangeLog"></slot>
      </el-tab-pane>
    </el-tabs>
    <!-- tab 栏目 end ================================================== -->
    <div class="form-button" v-show='editable || !isEdit'>
      <slot name="buttonSubmit"></slot>
      <slot name="buttonReset"></slot>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import { get as routeGet } from '../../api/RouteService';

import * as utils from '../../api/Utils';

export default {
  props: {
    domainObject: Object,
    isEdit: Boolean,
    editable: Boolean,
    addMode: Boolean,
    objectName: '',
    clientDetailColumns: Array
  },
  data() {
    return {
      hideFields: ['consignStartTime', 'consignEndTime'],
      projectName: '',
      checkPms: true
    }
  },
  computed: {
    showImgTab() {
      return true;
    }
  },
  methods: {
    calculateFieldShow(field) {
      if (!this.isEdit) {
        return this.hideFields.indexOf(field) < 0 ? true : false;
      }
      return true;
    },
    checkPmsNow() {
      console.log('checkPmsNow ...');
      if (this.domainObject.routeCode) {
        const paramsObj = {  code: this.domainObject.routeCode };
        routeGet(paramsObj, (success, error) => {
          if (error) {this.checkPms = false;}
          if (success) { this.checkPms = true;}
        });
      }
    }
  },
  created() {
    const localStorage = window.localStorage;
    this.projectName = JSON.parse(localStorage.getItem('appInfo')).projectName || '';
  },
  mounted() {
    let self = this;
    this.$nextTick(()=>{  self.checkPmsNow();    });
    this.$watch('domainObject.routeCode',()=>{
      self.checkPmsNow();
    })
  }
};

</script>
<style lang="scss" rel="stylesheet/scss">
@import "../assets/sass/base.scss";


#layout-outlogist-add {
  .description {
    .innerblock {
      width: 100%
    }
  }
  .manifestmodulefotter {
    background-color: #E6E6E6;
    margin-bottom: 10px;
    padding-top: 10px;
    border-top: 1px dashed #C6C6C6;
  }
  .sepline-route {
  border-bottom: solid 1px #F8A200;
  margin-bottom:5px;

}

  //针对前面lable 太长的问题 
  .label-width-auto {
    .el-form-item__label {
      width: auto !important;
    }
  }

  // 基本信息 中 详情与编辑 时  input 拉长
  .bi-detail {
    .el-autocomplete .el-input {
      width: 110px !important;
    }
  }
}






.hide-tit {
  .el-form-item__label {
    display: none;
  }
  .el-form-item__content {
    margin-left: 10px !important;
    .el-form-item__content {
      margin-left: 0 !important;
    }
  }
}


.ishn {
  .el-col-6, .el-col-18, .el-col-24 {
    width: 50%;
  }
  .logisticsExternalNo1 {
    .el-input {
      width: 380px;
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
  .el-col-description {
    width: 100%;
  }
  .sepline {
    padding-bottom: 0 !important;
    margin-bottom: 0 !important;
    border-bottom: 0 !important;
  }
  .el-select {
    width: 174px !important;
  }
  .complex-control-2 {
    .el-input {
      width: 174px !important;
    }
    .el-select {
      width: 142px !important;
      .el-input {
        width: 100% !important;
      }
    }
  }
  .selectGood .block {
    margin-left: 0 !important;
  }
}


.clear {
  clear: both;
}

.light-bg {
  padding-top: 10px;
 background-color: #FFFFCC;
 margin-bottom: 10px;
}

.highlight-bg {
  padding-top: 10px;
  background-color: #FFFFCC;
  margin-bottom: 15px;
  border-left:5px solid #FF9900;
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

.el-col-12.sepline {
  height: 31px !important;
}

.form-page {
  .el-select {
    vertical-align: top !important;
  }
}

.fix-input-page {
  .el-autocomplete .el-input, .el-long .el-input {
    width: 338px !important;
  }
  .selectArea .el-select {
    width: 110px !important;
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
  .form-page .innerblock {
    margin-right: 3px !important;
  }
  .form-page .innerblock .el-date-editor {
    width: 165px !important;
  }
}

</style>
