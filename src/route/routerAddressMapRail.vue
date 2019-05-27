<template>
  <el-dialog title="电子围栏" class='map-dialog' :visible.sync="dialogVisibleMap" size="large" @open="dialogOpen" @close="dialogClose">
    <div class="page_router_address_map">
      <div class="header">
        <span class="span_text" v-if='!modelLocation.editable && modelLocation.isEdit'>{{text_radius}}</span>
        <el-row v-else>
          <el-col :span="12" v-for="(item, key, index) in modelRali" v-bind:key="item.id">
            <div>
              <el-row>
                <el-col :span="4">
                  <span>{{item.name}}</span>
                </el-col>
                <el-col :span="10">
                  <el-input type='number' v-model="item.radius" placeholder="请输入内容"></el-input>
                </el-col>
                <el-col :span="10">
                  <span style="margin-left:10px">{{item.unitCode === 'metre' ? '米' : ''}}</span>
                  <!--                   <el-select disabled v-model="item.unitCode" placeholder="请选择">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select> -->
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </div>
      <baidu-map class="pop-map" :auto-viewport="true" :center="center" :zoom="zoom" @ready="handler" :scroll-wheel-zoom='true'>
        <!-- 第一个圈 -->
        <bm-circle :center="center" :auto-viewport="true" :radius="radius1" :stroke-color="color1" :stroke-opacity="0.5" :stroke-weight="2" @lineupdate="updateCirclePath" strokeOpacity='strokeOpacity1' strokeStyle='dashed'></bm-circle>
        <!-- 第二个圈 -->
        <bm-circle :center="center" :radius="radius2" :stroke-color="color2" :stroke-opacity="0.5" :stroke-weight="2" @lineupdate="updateCirclePath" strokeOpacity='strokeOpacity2' strokeStyle='dashed'></bm-circle>
        <bm-marker @click='mapClick' :position="center">
        </bm-marker>
      </baidu-map>
    </div>
    <div slot="footer" class="dialog-footer">
      <div class="page_footer">
        <div class="left">
          <span class="location_current">当前地图位置</span>
          <span class="location_text">{{modelLocation.realAddress}}</span>
          <span class="location_lat_lag">{{center.lng}}&nbsp&nbsp&nbsp{{center.lat}}</span>
        </div>
        <div class="right">
          <el-button @click="dialogClose">取 消</el-button>
          <el-button v-if='modelLocation.editable || !modelLocation.isEdit' type="primary" @click="dialogSubmit">确 定</el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script type="text/ecmascript-6">
import { get as getWaybill } from '../../api/waybillService';
import { getPosition } from '../../api/LbsService';
import LbsLib from '../LbsLib';
import BaiduMap from 'vue-baidu-map';
import { showMessageUtil } from '../../api/Utils';
export default {
  props: {
    id: String,
    action: String,
    isDialog: Boolean,
    defaultIcon: {
      type: Object,
      'default': null
    },
    dialogVisibleMap: {
      type: Boolean,
      'default': false
    },
    modelLocation: {
      type: Object,
      'default': function() {
        return {
          editable: true,
          code: '',
          isEdit: false,
          lat: 0,
          log: 0,
          type: '',
          fanceRedius: 0,
          fanceRediusUnitCode: '',
          fanceRediusArea: '',
          fanceRediusUnitCodeArea: '',
          realAddress: ''
        };
      }
    }
  },
  watch: {
    'modelRali': {
      handler: function(newValue, oldValue) {
        this.calculateRadius();
      },
      deep: true,
    }
  },
  computed: {
    text_radius() {
      let self = this;
      let text1 = this.modelLocation.fanceRediusUnitCode === 'kilometre' ? '公里' : '米';
      let text2 = this.modelLocation.fanceRediusUnitCodeArea === 'kilometre' ? '公里' : '米';
      let text_all = '';

      if (this.modelLocation.fanceRedius) {
        text_all = `围栏半径:  ${this.modelLocation.fanceRedius} ${text1}`;
      }

      if (this.modelLocation.fanceRediusArea) {
        text_all = `${text_all} 区域半径: ${this.modelLocation.fanceRediusArea} ${text2}`;
      }
      return text_all;
    }
  },
  data() {
    return {
      color1: '#00CC33',
      color2: '#FF9900',
      radius1: 0,
      radius2: 0,
      strokeOpacity1: 1,
      strokeOpacity2: 1,
      modelRali: [{
          name: "围栏半径",
          radius: 0,
          unitCode: ''
        },
        {
          name: "区域半径",
          radius: 0,
          unitCode: ''
        }
      ],
      value: '',
      // options: [{
      //   value: 'kilometre',
      //   label: '公里'
      // }, {
      //   value: 'metre',
      //   label: '米'
      // }],
      options: [{
        value: 'metre',
        label: '米'
      }],
      zoom: 15,
      center: {
        lng: 121.494337,
        lat: 31.22753
      },
      dialogVisible: false,
      showMarker: false,
      showPolyline: false,
      code: '',
      markers: [],
      truckIcon: {
        url: '/static/gps/img/car.png',
        size: {
          width: 36,
          height: 16
        },
        opts: {
          anchor: {
            width: 18,
            height: 8
          }
        }
      }
    };
  },
  methods: {
    // 计算半径
    calculateRadius() {
      if (this.modelRali[0].unitCode === 'kilometre') { //公里
        this.radius1 = this.modelRali[0].radius * 1000;
      }
      if (this.modelRali[0].unitCode === 'metre') { //公里
        this.radius1 = this.modelRali[0].radius;
      }

      if (this.modelRali[1].unitCode === 'kilometre') { //公里
        this.radius2 = this.modelRali[1].radius * 1000;
      }
      if (this.modelRali[1].unitCode === 'metre') { //公里
        this.radius2 = this.modelRali[1].radius;
      }
    },
    mapReady({ map }) {
      this.map = map;
      this.initData();
    },
    // 1.将 值全部放进 本地data
    initData() {
      this.center.lat = this.modelLocation.lat;
      this.center.lng = this.modelLocation.lng;
      if (this.modelLocation.fanceRedius && this.modelLocation.fanceRediusUnitCode) {
        this.modelRali[0].radius = this.modelLocation.fanceRedius;
        this.modelRali[0].unitCode = this.modelLocation.fanceRediusUnitCode;
      }
      if (this.modelLocation.fanceRediusArea && this.modelLocation.fanceRediusUnitCodeArea) {
        this.modelRali[1].radius = this.modelLocation.fanceRediusArea;
        this.modelRali[1].unitCode = this.modelLocation.fanceRediusUnitCodeArea;
      }
      this.modelRali[0].unitCode = 'metre';
      this.modelRali[1].unitCode = 'metre';
    },
    execute() {
      this.$emit('close');
    },
    dialogOpen() {
      this.dialogVisible = true;
    },
    dialogClose() {
      this.dialogVisible = false;
      this.$emit('dialogClose');
    },
    dialogSubmit() {
      let model = {};
      model.type = this.modelLocation.type;
      model.modelRali = this.modelRali;
      // 检验区域半径必须大于等于围栏半径
      const
           rad0 = model.modelRali[0].radius,
           rad1 = model.modelRali[1].radius,
           unit0 = model.modelRali[0].unitCode,
           unit1 = model.modelRali[1].unitCode;
      if(Number(rad0)>Number(rad1)){ showMessageUtil('warning',`区域半径必须大于等于围栏半径`,2000); return;  }
      if ((unit0) || (unit1) && model.type) {  // 0 也可以设置。默认就是 0
          model.modelRali[0].radius = rad0.toString();
          model.modelRali[1].radius = rad1.toString();
        this.$emit('dialogSubmit', model);
      } else {
        showMessageUtil('warning',`请选择位置`,2000);
      }
    },
  },
  created() {
    this.initData();
  }
};

</script>
<style lang="scss" rel="stylesheet/scss">
@import "../assets/sass/rl-table.scss";



.dialog-footer {
  .page_footer {
    overflow: hidden;
    // background: #efefef;
    margin: 0;
    padding: 0;
    padding-top: 5px;
    padding-bottom: 5px;
    background: #efefef;
    padding-left: 5px;
    margin-bottom: 5px;

    .left {
      float: left;
      width: calc(100% - 300px);
      line-height: 34px;
      background-color: #efefef;

      span {
        display: inline-block;
      }

      .location_current {
        color: #333;
        font-size: 14px;
      }

      .location_text {
        margin-left: 5px;

        &:before {
          content: '';
          display: inline-block;
          vertical-align: middle;
          width: 24px;
          height: 24px;
          margin-right: 5px;
          background: url(./gps_red.png) no-repeat 0 0;
          background-size: 24px 24px;
        }
      }

      .location_lat_lag {
        margin-left: 10px;
      }
    }

    .right {
      float: right;
      width: 300px;
      text-align: right;

      button {
        width: 100px;
        height: 34px;
      }
    }
  }
}



.page_router_address_map {

  // 头部箱式  start  ===============
  .header {
    height: 34px;
    background: #efefef;
    line-height: 21px;
    padding-left: 10px;
    margin-bottom: 5px;
    padding-bottom: 5px;


    .span_text {
      display: inline-block;
      line-height: 44px;
      margin-left: 20px;
    }

    .el-row {
      padding: 0;
      padding-top: 5px;
    }

    .header_input {
      input {
        height: 34px !important;
      }
    }

    .header_btn {
      margin-left: 30px;


      button {
        width: 100px;
        height: 34px;
      }
    }
  }

  // 头部箱式  end  ===============
  // .pop-map {
  //   width: 100%;
  //   height: 250px;
  // }
}

// 底部箱式  start  ===============
.dialog-footer {
  .m_footer {
    background-color: #efefef;

    span {
      display: inline-block;
    }

    .location_current {
      color: #333;
      font-size: 14px;
      padding-left: 10px;
    }

    .location_text {
      margin-left: 5px;

      &:before {
        content: '';
        display: inline-block;
        vertical-align: middle;
        width: 24px;
        height: 24px;
        margin-right: 5px;
        background: url(./gps_red.png) no-repeat 0 0;
        background-size: 24px 24px;
      }
    }

    .location_lat_lag {
      margin-left: 10px;
    }
  }

  .el-row {
    padding: 0 !important;
    height: 34px;
    line-height: 34px;
  }

  .header_btn {
    margin-left: 30px;
    text-align: right;

    // padding-top: 5px;
    // padding-bottom: 5px;
    button {
      width: 100px;
      height: 34px;
    }
  }
}

// 底部箱式   end  ===============
// 
.el-dialog__footer {
  text-align: left;
}




.map-dialog {
  .el-dialog--large {
    top: 5% !important;
    bottom: 5%;
    width: 90%;
    margin-left: -45% !important;
    margin-bottom: 0;
    transform: none;
  }

  .pop-map {
    position: absolute;
    // top: 57px;
    top: 100px;
    right: 20px;
    bottom: 55px;
    left: 20px;
  }

  .pop-map-short {
    top: 57px;
  }

  .el-dialog__body {
    max-height: none;
  }

  .el-dialog__footer {
    position: absolute;
    right: 20px;
    bottom: 0;
    left: 20px;
    margin: 0;
    box-sizing: border-box;
  }
}


.el-dialog__body {
  .fix-table-wrap {
    padding: 10px;
    min-height: 300px;
    box-sizing: border-box;

    .rl-fix-table {
      margin: 0;
    }

    .pagination {
      padding-left: 0;
    }

    .pop-map {
      margin: 0;
      position: absolute; // width:100%;
      // min-height:200px;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
  }

  .text-r {
    text-align: right;
  }
}

</style>
