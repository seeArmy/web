
<template>
    <!--<el-dialog title="地图展示" :visible.sync="dialogVisible" size="large" @open="dialogOpen" @close="dialogClose">-->
      <div>
        <baidu-map class="pop-map" :zoom="zoom" :center="center" @ready="mapReady" :scroll-wheel-zoom="true">
          <div class="logistics-statistics">
            <ul class="ls-list clearfix">
              <li>已派数：<strong class="ls-num">{{ shuntedNum }}</strong>次</li>
              <li>待装货数：<strong class="ls-num">{{ loadingNum }}</strong>次</li>
              <li>运输中数：<strong class="ls-num">{{ goingNum }}</strong>次</li>
              <li>
                <span>已卸数：</span>
                <strong class="ls-num">{{ unloadingNum }}</strong>次
              </li>
            </ul>
          </div>
          <bm-navigation anchor="BMAP_ANCHOR_TOP_LEFT"></bm-navigation>
          <bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-map-type>
          <bm-marker @click="openMarkerInfoWindow(marker)" :show="showMarker" v-for="marker in markers" :key="marker.id"  :position="marker.position" :icon="marker.icon" :rotation="marker.rotation" :dragging="marker.dragging">
            <bm-label :content="marker.handle" :labelStyle="{padding: '0 6px', color: 'red', fontSize : '12px', borderColor: '#999', borderRadius: '3px', color: '#333', marginLeft: '6px', top: '-20px', transform: 'translateX(-50%)'}"></bm-label>
              <bm-info-window :show="marker.show" :autoPan="true"
                            @close="closeMarkerInfoWindow(marker)" :close-on-click="true">
              <div class='rl-map-info'>
                <div class='map-header'>
                  <span class="status fr" :class="marker.status">{{marker.locateStatusName}}</span>
                  <a class="truck_detail blue" :href="`/truck/add.html?code=${marker.code}&editable=false`" target="_blank">{{marker.handle}}</a>
                  <span v-if="marker.showTag" class='el-tag el-tag--primary'>{{marker.showTag}}</span>
                  <span v-if="marker.source" class="el-tag el-tag--grey" :title="marker.source">{{marker.source}}</span>
                </div>
                <div class='map-content'>
                  <ul class="to-list">
                    <li><em class="truck-role">主</em>{{marker.driverFullName}}</li>
                    <!-- <li class="copilot"><em class="truck-role">副</em>{{marker.viceDriverFullName}}</li> -->
                  </ul>
                  <div class="to-list carDetail">
                    <p><span class="tit">车辆状态：</span>{{marker.truckStatusText}}</p>
                    <p><span class="tit">车型：</span>{{marker.truckModelName}}</p>
                    <p><span class="tit">速度:</span>{{ marker.speed }} km/h</p>
                    <p><span class="tit">方向:</span>{{ marker.directionDec }}</p>
                    <p><span class="tit">车辆位置:</span><span class="gold">{{marker.truckAddress}}</span></p>
                    <p><span class="tit">定位时间:</span>{{marker.recordTime}}</p>
                  </div>
                </div>
                <div class='map-footer'>
                  <a class="btn-grey" target="_blank" :href="`/truck/add.html?code=${marker.code}&editable=false`">车辆详情</a>
                  <!-- <a class="btn-grey" target="_blank" :href="`/truck/truck-gps.html?truckLicenseNo=${marker.handle}&queryNow=true`">车辆轨迹</a> -->
                </div>
              </div>
            </bm-info-window>
          </bm-marker>
          <!-- <bm-polyline :show="showPolyline" v-for="line in polylines" :key="line.id" :stoke-color="line.stroke.color" :stroke-opacity="line.stroke.opacity" :stroke-weight="line.stroke.weight"></bm-polyline> -->
        </baidu-map>
      </div>
    <!--</el-dialog>-->
</template>

<script type="text/ecmascript-6">
// import Vue from 'vue';
import { getLogisticsTruckList, getWaybillList, getPopWaybillList,getPopWaybillListOutsourcing} from '../../../api/waybillService';
import { getPosition } from '../../../api/LbsService';
import LbsLib from '../../LbsLib';
import * as TransportService from '../../../api/TransportService';
import * as LbsService from '../../../api/LbsService';
import * as DataSourceService from '../../../api/DataSourceService';
// import BaiduMap from 'vue-baidu-map';

// Vue.use(BaiduMap, {
//  ak: '0splGL787be69VgsOZX2t3vMvw016i0F'
// });

export default {
  name: 'eleWaybillPopMap',
  props: {
    id: {
      type: String,
      'default': ''
    },
    page: {
      type: Number,
      'default': 1
    },
    size: {
      type: Number,
      'default': 10
    },
    defaultIcon: {
      type: Object,
      'default': null
    },
    dialogData: {
      type: Object,
      'default': null
    },
    isDialog: Boolean,
    isLogistics:Boolean
    // ,
    // dialogVisible: {
    //   type: Boolean,
    //   'default': false
    // }
  },
  data() {
    return {
      zoom: 4,
      center: {
        lng: 108.953098279,
        lat: 34.2777998978
      },
      dialogVisible: false,
      showMarker: false,
      showPolyline: false,
      code: '',
      markers: [],
      truckIcon: {
        url: '/static/gps/img/truck_default.png',
        size: {
          width: 22,
          height: 48
        },
        opts: {
          anchor: {
            width: 11,
            height: 24
          }
        }
      },
      truckNormalIcon: {
        url: '../static/gps/img/truck_normal.png',
        size: {
          width: 22,
          height: 48
        }
      },
      truckAlarmIcon: {
        url: '../static/gps/img/truck_alarm.png',
        size: {
          width: 22,
          height: 48
        }
      },
      truckStaticIcon: {
        url: '../static/gps/img/truck_static.png',
        size: {
          width: 22,
          height: 48
        }
      },
      truckDefaultIcon: {
        url: '../static/gps/img/truck_default.png',
        size: {
          width: 22,
          height: 48
        }
      },
      markers:[],
      truck:[],
      truckModelOptions:[],
      trucks: [],
      projectName: JSON.parse(localStorage.getItem('appInfo')).projectName
    };
  },
  computed: {
    shuntedNum() {
      let num = 0;
      if (this.dialogData.shuntedNum) {
        num = this.dialogData.shuntedNum;
      }
      return num;
    },
    loadingNum() {
      let num = 0;
      if (this.dialogData.loadingNum) {
        num = this.dialogData.loadingNum;
      }
      return num;
    },
    goingNum() {
      let num = 0;
      if (this.dialogData.goingNum) {
        num = this.dialogData.goingNum;
      }
      return num;
    },
    arriveNum() {
      let num = 0;
      if (this.dialogData.arriveNum) {
        num = this.dialogData.arriveNum;
      }
      return num;
    },
    unloadingNum() {
      let num = 0;
      if (this.dialogData.unloadingNum) {
        num = this.dialogData.unloadingNum;
      }
      return num;
    }
  },
  methods: {
    mapReady({ map }) {
      this.map = map;
      this.refresh();
    },
    execute() {
      this.$emit('close');
    },
    refresh() {
      const boundry = [];
      this.getData();
      this.markers.forEach((a) => {
        boundry.push({
          lng: a.position.lng,
          lat: a.position.lat
        });
      });

      if (boundry.length > 0) {
        this.map.setViewport(boundry);
      }
    },
    dialogOpen() {
      this.dialogVisible = true;
    },
    dialogClose() {
      this.dialogVisible = false;
    },
    attachTruckLocation(location) {
      location.source = location.source === 'mobile' ? '手机' : 'GPS';
        // marker.locateStatus = location.status;
        if (location.status) {
          location.locateStatusName = location.status == 1 ? '行驶中' : (location.status == 2 ? '静止' : '异常');
          location.status = location.status == 1 ? 'green' : (location.status == 2 ? 'grey' : 'red');
          // location.truckStatusText = this.calculateStatus(LbsLib.fmtTime(location.recordTime));
        }
      return location;
    },
    // 计算车辆状态
    calculateStatus(date1) {
      const d1 = (date1 instanceof Date) ? date1 : new Date(Date.parse(date1)),
        d2 = new Date(); // 当前时间
      if ((d2 - d1) >  60 * 60 * 1000) {
        return '离线';
      } else {
        return '在线';
      }
    },
    findTruck(truckLicenseNo) {
        const truck = this.trucks.find(t => t.truckLicenseNo === truckLicenseNo);
        return truck;
    },
    getData() {
      if (this.id) {
        (this.isLogistics == true ? getPopWaybillList : getPopWaybillListOutsourcing)({ logisticsCode: this.id ,size:this.page,size:this.size }, (success) => {
          if (success && success.content.length) {
            // console.log(JSON.stringify(success));
            this.trucks = success.content
            let truckLicenseNos = '';
            success.content.forEach((a) => {
              truckLicenseNos += `${a.truckLicenseNo},`;
            });

            getPosition({
              truckLicenseNo: truckLicenseNos
            }, (result) => {
              if (result) {
                this.markers.length = 0;
                result.content.forEach((a) => {
                  const truck = this.findTruck(a.handle);
                  this.attachTruckLocation(a);
                  // 车辆图标
                  let icon = null;
                  switch (a.status) {
                    case 1:
                      icon = this.truckNormalIcon; // 正常绿色
                      break;
                    case 2:
                      icon = this.truckStaticIcon; // 静止灰色
                      break;
                    case 3:
                      icon = this.truckAlarmIcon; // 异常红色
                      break;
                    default:
                      icon = this.truckDefaultIcon; //默认蓝色
                      break;
                  };
                  const truckStatusText = this.calculateStatus(a.recordTime);
                  if (truckStatusText == '离线') {
                    icon = this.truckStaticIcon; // 静止灰色
                  }
                  this.markers.push({
                    handle: a.handle,
                    rotation: a.direction,
                    position: LbsLib.transformPoint({ lng: a.lng, lat: a.lat }),
                    status: a.status,
                    type: a.type,
                    icon: icon,
                    show: false,
                    infoWindow: 'hello',
                    rotation: a.direction ? a.direction : 0,
                    directionDec: a.direction ? LbsLib.getDirection(a.direction) : '北方', // 方向
                    createTime: a.createTime,
                    stopTime: a.stopTime,
                    recordTime: a.recordTime,
                    source: a.source,
                    speed: a.speed || 0 ,// 速度
                    locateStatusName:a.locateStatusName,
                    recordTime: a.recordTime,
                    truckStatusText: truckStatusText,
                    truck: truck
                  });
                  console.log('this.markers',this.markers)
                  this.center = this.markers[this.markers.length - 1].position;
                });
              }
            });
          }
        });
      }

    },

    showDialog(code) {
      this.id = code;
      this.refresh();
      this.dialogOpen();
    },
      toModelText(modelCode) {
        const model = this.truckModelOptions.find(option => option.id === modelCode);
        if (model) {
          return model.name;
        }
        return '-';
      },
      openMarkerInfoWindow(marker) {
      this.$set(marker, 'driverFullName', '');
      this.$set(marker, 'viceDriverFullName', '');
      const truck = this.findTruck(marker.handle);
      TransportService.list({ 'platformMainTruckCode': truck.platformTruckCode, 'page': 1, 'size': 1 }, (rep) => {
        console.log('transport', rep);
        if (rep && rep.content && rep.total) {
          this.$set(marker, 'driverFullName', rep.content[0].driverFullName);
          this.$set(marker, 'viceDriverFullName', rep.content[0].viceDriverFullName);
          this.$set(marker, 'code', rep.content[0].mainTruckCode);
          rep.content[0].truckModelCode = this.toModelText(rep.content[0].truckModelCode);
          this.$set(marker, 'truckModelName', rep.content[0].truckModelCode);
        }
      });

      this.$set(marker, 'truckAddress', '');
      LbsService.getAddress({
        type: 1,
        lat: marker.position.lat,
        lng: marker.position.lng
      }, (addressSuccess) => {
        if (addressSuccess) {
          this.$set(marker, 'truckAddress', addressSuccess.content.address || '');
        }
        // this.marker['truck'] = this.truck;
      });
      marker.show = true;
      },
      closeMarkerInfoWindow(marker) {
        marker.show = false;
      },
  },
  created() {
    // this.refresh();
    DataSourceService.truckModel.getData({}, (options) => {
        this.truckModelOptions = options;
        console.log('truckModelOptions', this.truckModelOptions);
    });
  }
};
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../../assets/sass/rl-table.scss";
  @import "../../truck/truck-map.scss";
  .el-dialog__body {
    .logistics-statistics {
      padding: 10px;
      position: absolute;
      top: -48px;
      left: 70px;
      right: 60px;
      opacity: .9;
      .ls-list {
        font-size: 0;
        li {
          display: inline-block;
          padding-right: 20px;
          margin-right: 20px;
          font-size: 14px;
          border-right: solid 1px #ddd;
        }
      }
      .ls-num {
        font-size: 16px;
        font-weight: 700;
        color: #f48400;
      }
    }
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
  .pop-map {
  color: #666;
  font-size: 12px;
  line-height: 22px;
  a {
    color: #666;
  }
  .red {
    color: $red;
  }
  .green {
    color: $green;
  }
  .blue {
    color: $blue;
  }
  .select-tag{
    margin-top: 6px;
  }
}
</style>
