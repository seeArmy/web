<template>
  <div class="custom-page freight">
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
      <span id="pageRefresh" class="page-refresh fr"><i class="ico-refresh"></i>刷新
      </span>
    </div>
    <div class="mode-select" :class="[disableModeSelect ? 'disabled' : '']" v-if="!disableModeSelect">
      <div class="el-row ">
        <div class="el-col-24 sepline">
          <slot name="scheduleType"></slot>
          <span class="tip-info" v-show="domainObject.scheduleType === 'self'">您选择的是<strong class="org">“自助调车模式”</strong>，您需要自己跟司机结算。</span>
          <span class="tip-info" v-show="domainObject.scheduleType === 'platform'">您选择的是<strong class="org">“委托调车模式”</strong>，您可委托平台跟司机结算。</span>
        </div>
      </div>
    </div>
    <!-- 1 -->
    <div class="section">
      <h2 class="tmp-title">
        基本信息
      </h2>
      <div class="el-row">
        <!-- 货源编号 -->
        <div class="el-col el-col-8" v-show="isEdit">
          <slot name="freightNo"></slot>
        </div>
        <!-- 状态 -->
        <div class="el-col el-col-12" v-show="isEdit">
          <slot name="status"></slot>
        </div>
        <!--订单号  -->
        <div class="el-col el-col-8 sepline" id='logisticsNo'>
          <slot name="logisticsNo"></slot>
        </div>
        <!-- 货源托运方  -->
        <div class="el-col el-col-8 sepline">
          <slot name="clientOrg"></slot>
        </div>
         <!-- 运单生成方式 （新增） -->
        <div class="el-col el-col-8 sepline">
          <slot name="dispatchMode"></slot>
        </div>
        <!-- 表格 货单模块 start  ==================================== -->
        <div>
          <slot name="manifestModule"></slot>
        </div>
        <!-- 表格 end    ==================================== -->
        <div class="manifestmodulefotter clearfix clear">
          <!-- 无车承运上报国际货物类型 -->
          <div class="el-col el-col-8 label-width-auto">
            <slot name="cargoTypeClassificationCode"></slot>
          </div>
          <!-- 无车承运上报货物总称 -->
          <div class="el-col el-col-8 label-width-auto">
            <slot name="goodsName"></slot>
          </div>
          <!-- 需求车次 -->
          <div class="el-col el-col-8">
            <slot name="truckQty"></slot>
          </div>
        </div>
        <!-- 发布范围 -->
        <div class="el-col el-col-24">
          <!-- <slot name="releaseRange"></slot> -->
        </div>
        <!-- 货量进度 -->
        <div class="el-col el-col-6 sepline goodsPercent" v-show='isEdit'>
          <!-- <slot name="goodsPercent"></slot> -->
          <span class="el-form-item__label">货量进度:</span>
          <ele-progress :percent="goodsPercent"></ele-progress>
        </div>
        <div class="el-col el-col-6 sepline pro" v-show='isEdit'>
          <span>{{goodsnum}}{{meterageType}}/{{goodssum}}{{meterageType}}</span>
          <span>(实际发货量/货源总货量)</span>
        </div>
        <!-- 车次进度 -->
        <div class="el-col el-col-6 sepline trainNumberPercent" v-show='isEdit'>
             <!-- <slot name="trainNumberPercent"></slot> -->
          <span class="el-form-item__label">车次进度:</span>
          <ele-progress :percent="trainNumberPercent"></ele-progress>
        </div>
        <div class="el-col el-col-6 sepline pro" v-show='isEdit'>
          <span>{{domainObject.waybillSum}}车/{{domainObject.truckQty}}车</span>
          <span>(已派有效车次/需求车次)</span>
        </div>
         <!-- 车型要求 -->
        <div class="el-col el-col-6">
          <slot name="truckModelRequire"></slot>
        </div>
        <!-- 车长要求 -->
        <div class="el-col el-col-24 el-col-auto sepline">
          <slot name="truckLengthRequire"></slot>
        </div>
        <!-- 是否同步更新 -->
        <div class="clearfix clear" v-if='editable'>
          <slot name="syncModule"></slot>
        </div>
          <!-- 线路名称  -->
        <div class="el-col el-col-24 ">
          <slot name="route"></slot>
        </div>
         <!-- 业务类型 -->
        <div class="el-col el-col-12 sepline">
          <slot name="businessTypeCode"></slot>
        </div>
          <!-- 标准运距  -->
        <div class="el-col el-col-12 sepline">
          <slot name="standardDistance"></slot>
        </div>
        <div class="light-bg clearfix clear">
          <!-- 发货单位 -->
          <div class="el-col el-col-12">
            <slot name="loadingOrg"></slot>
          </div>
          <!-- 收货单位 -->
          <div class="el-col el-col-12">
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
          <div class="el-col el-col-12 el-col-auto">
            <slot name="loadingAddress"></slot>
          </div>
          <!-- 收货地址 -->
          <div class="el-col el-col-12 el-col-auto">
            <slot name="unloadingAddress"></slot>
          </div>
        </div>
      </div>
      <div class="highlight-bg clearfix clear">
          <!-- 客户运价 -->
          <div class="el-col el-col-12">
            <slot name="clientFreightPrice"></slot>
          </div>
          <!-- 报价类型 -->
          <div class="el-col el-col-12">
            <slot name="quotePrice"></slot>
          </div>
          <!-- 客户结算方式 -->
          <div class="el-col el-col-12 ">
            <slot name="clientSettleMethod"></slot>
          </div>
          <!-- 司机结算方式  -->
          <div class="el-col el-col-12 ">
            <slot name="settleMethod"></slot>
          </div>
          <!-- 运价备注  -->
          <div class="el-col el-col-24 ">
            <slot name="ratesDescription"></slot>
          </div>
      </div>

        <!-- 货物类型 -->
        <!-- <div class="el-col el-col-6">
          <slot name="cargoTypeClassificationCode"></slot>
        </div> -->
        <!-- 货物名称 -->
        <!-- <div class="el-col el-col-6">
          <slot name="goodsName"></slot>
        </div> -->
        <!-- 货物单价 -->
        <!-- <div class="el-col el-col-6">
          <slot name="goodsPrice"></slot>
        </div> -->
        <!-- 计量标准 -->
        <!-- <div class="el-col el-col-6 sepline">
          <slot name="meterageType"></slot>
        </div> -->
        <!-- 合理货差系数 -->
        <!-- <div class="el-col el-col-18 sepline">
          <slot name="freightLoss"></slot>
        </div> -->
        <!-- 货物重量 -->
        <!-- <div class="el-col el-col-6">
          <slot name="goodsWeight"></slot>
        </div> -->
        <!-- 货物体积 -->
        <!-- <div class="el-col el-col-6">
          <slot name="goodsVolume"></slot>
        </div> -->
        <!-- 货物数量 -->
        <!-- <div class="el-col el-col-12">
          <slot name="goodsAmount"></slot>
        </div> -->
        <!-- 需求车次 -->
        <!-- <div class="el-col el-col-6">
          <slot name="truckQty"></slot>
        </div> -->
      <!-- 扩展信息 start -->
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
      <!-- 扩展信息 end -->
      <h2 class="tmp-title">
        其他信息
      </h2>
      <div class="el-row">
        <!-- 联系人 -->
        <div class="el-col el-col-6">
          <slot name="contactUserFullName"></slot>
        </div>
        <!-- 联系电话 -->
        <div class="el-col el-col-6">
          <slot name="contactPhone"></slot>
        </div>
        <!-- 货源有效期 -->
        <div class="el-col el-col-12">
          <slot name="freightEndTime"></slot>
        </div>
        <!-- 备注 -->
        <div class="el-col el-col-24 el-col-description">
          <slot name="description"></slot>
        </div>
        <!-- <div class="el-col el-col-6" v-show="isEdit && !editable">
          <slot name="publishUserFullName"></slot>
        </div>
        <div class="el-col el-col-6" v-show="isEdit && !editable">
          <slot name="publishTime"></slot>
        </div> -->
        <!-- 发布货源协议，新增和编辑显示 -->
        <div class="el-col el-col-24" v-show="editable || !isEdit">
          <slot name="publishRules"></slot>
        </div>
        <!-- 发布货源协议，详情显示 -->
        <div class="el-col el-col-24" v-show="isEdit && !editable">
          <slot name="publishRulesLink"></slot>
        </div>
        <!-- 协议 -->
        <!--         <div class="el-col el-col-24">
          <slot name="agree"></slot>
        </div> -->
      </div>
      <!-- tag start ================= -->
      <div class="el-row">
        <!-- 发布范围 -->
        <div class="el-col el-col-24">
          <slot name="releaseRange"></slot>
        </div>
        <div class="el-col el-col-24 el-col-auto" v-if='isShowTag'>
          <slot name="truckTagList"></slot>
        </div>
      </div>
      <div class="el-row">
        <!-- 协议 -->
        <div class="el-col el-col-24">
          <slot name="agree"></slot>
        </div>
      </div>
      <!-- tag end ================= -->
    </div>
      <span class="blue el-checkbox__label el-dialog-span" v-on:click="showQRcode" >货源二维码查看</span>
    <!-- tabs -->
    <el-tabs type="border-card" v-if="isEdit">
      <el-tab-pane label="接单记录" id="tabAcceptRecord">
        <slot name="tabAcceptRecord"></slot>
      </el-tab-pane>
      <!--  <el-tab-pane label="变更记录">
        <slot name="tabChangeLog"></slot>
      </el-tab-pane> -->
    </el-tabs>
      <el-dialog title="货源二维码查看" :visible.sync="centerDialogVisible" width="30%" center>
        <img src='../assets/huanneng-erweima.png' alt="" class="img-center">
        <p class='el-dialog-p'>客户: {{domainObject.clientOrgName}}</p>
        <p class='el-dialog-p'>货物: {{domainObject.goodsName}}</p>
        <p class='el-dialog-p' v-if='this.city.name'>运输路线: {{this.city.name}}{{this.county.name}}->{{this.city1.name}}{{this.county1.name}}</p><p v-else>运输线路:</p>
        <p class='el-dialog-p' v-if='domainObject.freightNo'>货源号: {{domainObject.freightNo}}</p><p v-else>货源号:(待生成)</p>
        <img :src="codeImg"  alt="" width="200px" height="200px" v-if='this.domainObject.code' class="img-center">
        <div v-else style='width:300px;height:300px;display: block;margin: 0 auto;'><div class="qrcode"><span>货源小程序二维码待生成</span></div></div>
        <p style='text-align:center;margin-top: 20px;'>微信扫一扫或长按图片识别二维码抢货</p>
      </el-dialog>
    <div class="form-button" v-show='editable || !isEdit'>
      <slot name="buttonSubmit"></slot>
      <slot name="buttonReset"></slot>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import { apiOrgDomain} from '../../api/ApiConst'
import * as area from '../../api/DataSourceService'
import successVue from '../findPwd/success.vue'
import eleProgress from '../components/ele-progress/eleProgress.vue';
export default {
  components: {
    'ele-progress': eleProgress,
  },
  props: {
    domainObject: Object,
    isEdit: Boolean,
    isShowTag: Boolean,
    editable: Boolean,
    objectName: '',
    disableModeSelect: {
      type: Boolean,
      'default': false
    },
    clientDetailColumns: Array
  },
  computed:{
    goodsPercent(){
      return this.domainObject.goodsPercent || 0;
    },
    trainNumberPercent(){
      return this.domainObject.trainNumberPercent || 0;
    },
    goodsnum(){
      let val;
      switch(this.domainObject.meterageType){
        case 'ton':
            val =  this.domainObject.goodsTonSum || 0;
          return val;
        case 'cube':
            val =  this.domainObject.goodsCubeSum || 0;
          return val;
        case 'item':
            val =  this.domainObject.goodsItemSum || 0;
          return val;
      }
    },
    goodssum(){
      // let val;
      // switch(this.domainObject.meterageType){
      //   case 'ton':
      //       val =  this.domainObject.tempGoodsWeight || 0;
      //     return val;
      //   case 'cube':
      //       val =  this.domainObject.tempGoodsVolume || 0;
      //     return val;
      //   case 'item':
      //       val =  this.domainObject.tempGoodsNum || 0;
      //     return val;
      return this.domainObject.getSum/2 || 0;
      // }
    },
    meterageType(){
      switch(this.domainObject.meterageType){
        case 'ton':
          return '吨';
        case 'cube':
          return '方';
        case 'item':
          return '件';
      }
    }
  },
   data() {
      return {
        projectName: JSON.parse(localStorage.getItem('appInfo')).projectName || '',
        centerDialogVisible:false,
        codeImg:'',
        province:'',
        province1:'',
        city:'',
        city1:'',
        county:'',
        county1:'',
        platformLogoUrl:''
      }
    },
  methods:{
    showQRcode(){
        const url = `${apiOrgDomain}/freight/generate_qr_code/string?code=${this.domainObject.code}`
        this.codeImg = url;
        const self = this;
        this.centerDialogVisible = true;
       if(!self.domainObject.loadingProvinceCode || !self.domainObject.unloadingProvinceCode) return false;
        area.province.getData({},(success)=>{
          if(success){
            self.province = success.find(option => option.id == self.domainObject.loadingProvinceCode);
            self.province1 = success.find(option => option.id == self.domainObject.unloadingProvinceCode);
            if(self.province){
              area.city.getData({keyword:self.province.id},(success)=>{
              if(success){
                  self.city = success.find(option => option.id == self.domainObject.loadingCityCode);
                  if(self.city){
                      area.county.getData({keyword:self.city.id},(success)=>{
                        if(success){
                         self.county = success.find(option => option.id == self.domainObject.loadingCountyCode);
                        }
                      })
                  }

                }
              });
            }
            if(self.province1){
               area.city.getData({keyword:self.province1.id},(success)=>{
              if(success){
                self.city1= success.find(option => option.id == self.domainObject.unloadingCityCode);
                if(self.city1){
                      area.county.getData({keyword:self.city1.id},(success)=>{
                        if(success){
                         self.county1 = success.find(option => option.id == self.domainObject.unloadingCountyCode);
                        }
                      })
                  }
                }
              });
            }
          }
        })
        this.centerDialogVisible = true;
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
.freight{
  .img-center{
    display: block;
    margin: 0 auto;
  }
  .el-dialog-p{
    margin : 10px 0 ;
  }
  .el-dialog-span{
    margin-bottom: 5px;
    display: inline-block;
  }
  .el-dialog__body{
    max-height:100% !important;
    min-height: auto;
    padding: 10px 20px 50px !important;
  }
  .el-dialog--small {
    width: 400px;
  }
  //订单号不可点击
  #logisticsNo{
    .el-input.is-disabled .el-input__inner {
      border: none !important;
      width: auto;
    }
    .page_ele_pop_select{
      display: none;
    }
  }

  .qrcode{
    width: 200px;
    height: 200px;
    border: 1px dashed black;
    border-radius: 100%;
    text-align: center;
    line-height: 200px;
    margin: 20px auto 0;
  }
  .el-form-item__content .el-form-item__error{
    right: 0 !important;
  }
  .goodsPercent{
    .innerblock{
        width:60%;
      }
  }
  .trainNumberPercent{
    .innerblock{
        width:60%;
      }
  }
  .pro span{
    vertical-align: sub;
  }
  .progress{
    width: 50%;
  }
}
.blue{
    margin-left: 20px;
    color: #0178be;
    cursor: pointer;
}
.manifestmodulefotter {
    background-color: #E6E6E6;
    margin-bottom: 10px;
    padding-top: 10px;
    border-top: 1px dashed #C6C6C6;
  }
.clear {
  clear: both;
}

.light-bg {
  padding-top: 10px;
  margin-bottom: 10px;
  background-color: #f8f8f8;
}

.highlight-bg {
  padding-top: 10px;
  margin-bottom: 10px;
  background-color: #fff5c0;
  padding-left: 20px;
}

.top-line {
  box-sizing: content-box;
  padding-top: 10px;
  border-top: solid 1px #ddd;
}

.mode-select {
  margin-bottom: -30px;

  .el-row {
    padding-bottom: 0 !important;

    .sepline {
      border-bottom: dashed 1px #ddd !important;
    }
  }

  .el-col-24 {
    position: relative;

    .tip-info {
      position: absolute;
      top: 5px;
      left: 330px;
      color: #999;
      font-size: 14px;
    }
  }
}

.mode-select.disabled {
  position: relative;

  &::before {
    content: '';
    position: absolute;
    z-index: 20;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(255, 255, 255, .3);
    cursor: not-allowed;
  }
}

.agree-box {
  padding: 20px 10px;
}

.rule-frame {
  width: 100%;
  height: 300px;
}

.form-button {
  text-align: center;
  padding: 20px;
}

.el-form-item__label {
  font-size: 13px;
}

.link {
  padding-top: 10px;
  margin-left: 10px;
  font-size: 14px;
}

.check-required {
  position: relative;

  &::before {
    position: absolute;
    top: 9px;
    left: 90px;
    content: '*';
    color: #ff4949;
  }
}

.el-col-length {
  height: 79px !important;
}

// .el-col-12:nth-child(6n), .el-col-12:nth-child(6n-1) {
//  margin-bottom: 0 !important;
//  border-bottom: 0 !important;
// }
.el-tab-pane {
  .advance-search {
    display: none;
  }

  .list-wrap {
    .page-header {
      display: none;
    }

    #advanceSearch {
      display: none;
    }

    .fix-table-wrap {
      height: auto !important;
    }
  }
}

.el-col-24 .el-checkbox-group {

  // width: 520px;
  .el-checkbox {
    width: 76px;
    margin-right: 10px;
  }

  .el-checkbox+.el-checkbox {
    margin-left: 0;
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
