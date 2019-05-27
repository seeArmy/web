<template>
  <div class="truck-map-page">
    <header class="header clearfix">
      <h1 class="page-title fl">车辆定位</h1>
    </header>
    <div class="content">
      <div class="mc-list fl">
        <div class="ml-hd clearfix">
          <el-form>
            <el-form-item>
              <el-input class="txtbox" type="text" @keyup.enter.native="searchFilterTrucks" v-model="searchTruckLicenseNo" placeholder="请输入车牌号"></el-input>
              <input style="display: none"/>
              <el-button type="primary" @click="searchFilterTrucks">搜索</el-button>

              <el-select class='select-tag' v-model="tagCurrent" clearable placeholder="请选择分组">
                <el-option
                  v-for="item in listTag"
                  :key="item.tag"
                  :label="item.tag"
                  :value="item.tag">
                </el-option>
              </el-select>
              <el-button type="primary" @click="resetSearch">重置</el-button>

            </el-form-item>
          </el-form>
        </div>
        <div class="ml-bd">
          <ul class="map-truck-list" id='map-truck-list'>
            <li v-for="(truck, index) in trucks" :key="truck.truckLicenseNo" @click="truckSelect(truck)">
              <span class="sequence">{{index + 1}}</span>
              <p class="truck-id" :truck-license="truck.truckLicenseNo">
                <span class="running-status fr" v-if="truck.locateStatus">
                  <strong :class="truck.locateStatusClassName">{{truck.locateStatusName}}</strong>
                  <!--<strong class="green">{{toStatusText(truck.truckLicenseNo)}}</strong>-->
                </span>
                <a title="车辆详情" :href="`/truck/add.html?code=${truck.code}&editable=false`" class="truck_detail" target="_blank">
                  {{truck.truckLicenseNo}}
                </a>
                <span class="el-tag el-tag--primary" v-if="truck.showTag">{{truck.showTag}}</span>
                <span v-if="truck.locateSource" class="el-tag el-tag--grey" :title="truck.locateSourceName">{{truck.locateSourceName}}</span>
              </p>
              <p class="truck-info">{{truck.truckModelName}}，{{truck.truckLength}}{{truck.truckLengthUnitName}}，{{truck.regTonnage}}{{truck.regTonnageUnitName}}</p>
            </li>
          </ul>
        </div>
        <div class="ml-ft">
          <el-pagination small class="pagination inline" layout="prev, pager, next, total"
                         :total="pagination.totalCount" :page-sizes="pagination.pageSizes"
                         :page-size="pagination.pageSize" @size-change="pageSizeChange"
                         @current-change="pageIndexChange"></el-pagination>
        </div>
      </div>
      <div class="fold" @click="toggleLeft"></div>
      <div class="mc-cont">
        <div class="status-text"><span class="org">{{refreshInterval}}s</span>后刷新</div>
        <!-- map-wrapper -->
        <baidu-map @ready="mapReady" class="map" :center="center" :zoom="zoom" @zoomend="zoomend" :map-click="false" :scroll-wheel-zoom="true">
          <bm-navigation anchor="BMAP_ANCHOR_TOP_LEFT"></bm-navigation>
          <bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-map-type>
          <bm-marker v-for="markerPoint in markerPoints" :key="markerPoint.handle" :rotation="markerPoint.rotation"
                     :position="markerPoint.point" :dragging="false" @click="openMarkerInfoWindow(markerPoint)" :icon="markerPoint.truckIcon">
            <bm-info-window :show="markerPoint.show" :autoPan="true"
                            @close="closeMarkerInfoWindow(markerPoint)" :close-on-click="true">
              <!--<p v-html="markerPoint.message"></p>-->
              <div class='rl-map-info'>
                <div class='map-header'>
                  <span class="status fr" :class="markerPoint.truck.locateStatusClassName">{{markerPoint.truck.locateStatusName}}</span>
                  <a class="truck_detail blue" :href="`/truck/add.html?code=${markerPoint.truck.code}&editable=false`" target="_blank">{{markerPoint.handle}}</a>
                  <span v-if="markerPoint.truck.showTag" class='el-tag el-tag--primary'>{{markerPoint.truck.showTag}}</span>
                  <span v-if="markerPoint.truck.locateSource" class="el-tag el-tag--grey" :title="markerPoint.truck.locateSourceName">{{markerPoint.truck.locateSourceName}}</span>
                </div>
                <div class='map-content'>
                  <ul class="to-list">
                    <li><em class="truck-role">主</em>{{markerPoint.truck.driverFullName}}</li>
                    <li class="copilot"><em class="truck-role">副</em>{{markerPoint.truck.viceDriverFullName}}</li>
                  </ul>
                  <div class="to-list carDetail">
                    <p><span class="tit">车型：</span>{{markerPoint.truck.truckModelName}}</p>
                    <p><span class="tit">速度:</span>{{ markerPoint.speed }} km/h</p>
                    <p><span class="tit">方向:</span>{{ markerPoint.directionDec }}</p>
                    <p><span class="tit">车辆位置:</span><span class="gold">{{markerPoint.truck.truckAddress}}</span></p>
                    <p><span class="tit">定位时间:</span>{{markerPoint.recordTime}}</p>
                  </div>
                </div>
                <div class='map-footer'>
                  <a class="btn-grey" target="_blank" :href="`/truck/add.html?code=${markerPoint.truck.code}&editable=false`">车辆详情</a>
                  <a class="btn-grey" target="_blank" :href="`/truck/truck-gps.html?truckLicenseNo=${markerPoint.handle}&queryNow=true`">车辆轨迹</a>
                </div>
              </div>
            </bm-info-window>
          </bm-marker>
        </baidu-map>
      </div>
    </div>
  </div>
</template>

<script>
  import * as TruckService from '../../api/TruckService';
  import * as LbsService from '../../api/LbsService';
  import * as DataSourceService from '../../api/DataSourceService';
  import * as TransportService from '../../api/TransportService';
  import * as Utils from '../../api/Utils';
  import LbsLib from '../LbsLib';

  export default {
    name: 'truck-map',
    data() {
      return {
        tagCurrent:'',
        listTag:[],
        map: null,
        initDataReady: false,
        timer: null,
        refreshInterval: 30,
        truckType: null,
        zoom: 8,
        firstLoad: true,
        center: {
          lng: 121.494337,
          lat: 31.22753
        },
        pagination: {
          totalCount: 0,
          pageSizes: [5, 10, 20, 50, 100],
          pageSize: 100,
          pageIndex: 1
        },
        truckLocations: [],
        truckModelOptions: [],
        unitOptions: [],
        trucks: [],
        trucksObj: {},
        markerPoints: [],
        markerPointsObj: new Map(),
        truckIcon: {
          url: '../static/img/truck_alarm.png',
          size: {
            width: 22,
            height: 48
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
        info: {
          show: false,
          title: '',
          message: '',
          position: {
            lng: 0,
            lat: 0
          }
        },
        searchTruckLicenseNo: '',
        theme: true
      };
    },
    methods: {
      netGetTagList(){
        TransportService.tagList((success,error)=>{
          if(success && success.content){
            this.listTag = success.content;
          }
          if(error){   Utils.showMessageUtil('error',error.content,2000);}
        })
      },
      mapReady({
        map
      }) {
        this.map = map;
        console.log('map ready');
        if (this.initDataReady) {
          this.onInit();
        }
      },
      zoomend(e) {
        console.log('map zoom end now', e);
        this.zoom = e.target.getZoom();
      },
      searchFilterTrucks() {
        this.pagination.pageIndex = 1;
//        this.pagination.pageSize = 10;
        this.searchTrucks();
      },
      // 重置
      resetSearch(){
        this.searchTruckLicenseNo = '';
        this.tagCurrent = '';
        this.searchFilterTrucks();
      },
      pageSizeChange(size) {
        this.pagination.pageSize = size;
        this.searchTrucks();
      },
      pageIndexChange(index) {
        this.pagination.pageIndex = index;
        this.searchTrucks();
      },
      toggleLeft() {},
      attachTruckPropertyName(truck) {
        truck.truckModelName = this.toModelText(truck.truckModelCode);
        truck.truckLengthUnitName = this.toUnitText(truck.truckLengthUnitCode);
        truck.regTonnageUnitName = this.toUnitText(truck.regTonnageUnitCode);
        truck.truckTypeName = null;
        truck.firstTagName = null;
        if (truck.truckType) {
          truck.truckTypeName = truck.truckType === 1 ? '自有' : '外请';
        }
        if (truck.truckTag && truck.truckTag.length) {
          truck.firstTagName = truck.truckTag[0];
        }
        truck.showTag = truck.truckTypeName ? truck.truckTypeName : truck.firstTagName;
        return truck;
      },
      assignTruckLocation(truck) {
        truck.locateStatusName = '';
        truck.locateStatus = 0;
        truck.locateStatusClassName = '';
        truck.locateSourceName = '';
        truck.locateSource = null;
        return truck;
      },
      attachTruckLocation(truck, location) {
        truck.locateSource = location.source;
        truck.locateSourceName = location.source === 'mobile' ? '手机' : 'GPS';
        truck.locateStatus = location.status;
        if (location.status) {
          truck.locateStatusName = location.status == 1 ? '行驶中' : (location.status == 2 ? '静止' : '异常');
          truck.locateStatusClassName = location.status == 1 ? 'green' : (location.status == 2 ? 'grey' : 'red');
        }
        return truck;
      },
      onInit() {
        if (this.map) {
//          console.log('setViewport', this.markerPoints);
          this.initDataReady = false;
          const markers = [];
          this.markerPoints.forEach((item) => {
            markers.push(item.point);
          });
          if (this.firstLoad) {
            this.map.setViewport(markers);
            this.firstLoad = false;
          }

        }
      },
      onDataReady() {
        if (!this.initDataReady) {
          this.initDataReady = true;
          this.onInit();
        }
        this.refreshInterval = 30;
        this.timer = setInterval(this.refreshTick, 1000);
      },
      refreshTick() {
        if (this.refreshInterval) {
          this.refreshInterval --;
        } else {
          clearInterval(this.timer);
          const truckLicenseNos = Object.keys(this.trucksObj);
          const truckLicenseNosStr = truckLicenseNos.join(',');
          this.getTruckLocation(truckLicenseNosStr, this.onDataReady);
        }
      },
      getTruckLocation(truckLicenseNosStr, callback) {
        console.log('truckLicenseNosStr', truckLicenseNosStr);
        if (!truckLicenseNosStr || truckLicenseNosStr.length === 0) {
          if (callback) {
            callback();
          }
        }
        LbsService.getPosition({
          truckLicenseNo: truckLicenseNosStr
        }, (result) => {
          if (result) {
            this.truckLocations = result.content;
            console.log('车辆GPS数据：', this.truckLocations);
//            this.truckHandles = result.content.map(a => a.handle);
            this.markerPoints = result.content.map((a) => {
              const truck = this.findTruck(a.handle);
              this.attachTruckLocation(truck, a);
              // 车辆图标
              let icon = null;
              switch(a.status) {
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
              }
              return {
                truck,
                truckIcon: icon,
                handle: a.handle,
                point: LbsLib.transformPoint({
                  lng: a.lng,
                  lat: a.lat
                }),
                show: false,
                infoWindow: 'hello',
                rotation: a.direction ? a.direction : 0,
                directionDec: a.direction ? LbsLib.getDirection(a.direction) : '', // 方向
                status: a.status,
                type: a.type,
                createTime: a.createTime,
                stopTime: a.stopTime,
                recordTime: a.recordTime,
                source: a.source,
                speed: a.speed || 0 // 速度
              };
            });
            this.markerPointsObj = new Map();
            this.markerPoints.forEach((item) => {
              this.markerPointsObj.set(item.handle, item);
            });
          }
          if (callback) {
            callback();
          }
        });
      },
      searchTrucks(callback) {
        if (this.timer) {
          this.refreshInterval = 30;
          // clearInterval(this.timer);
        }
        this.trucks = [];
        this.trucksObj = [];
        TruckService.list({
          truckType: this.truckType,
          truckLicenseNo: this.searchTruckLicenseNo,
          size: this.pagination.pageSize,
          page: this.pagination.pageIndex,
          truckTag:this.tagCurrent,
        }, (success) => {
          if (success) {
            success.content.forEach((item) => {
              this.trucksObj[item.truckLicenseNo] = item;
              this.attachTruckPropertyName(item);
              this.assignTruckLocation(item);
            });
            this.trucks = success.content;
            this.pagination.totalCount = success.total;
            if (success.content.length > 0) {
              const truckLicenseNos = Object.keys(this.trucksObj);
              const truckLicenseNosStr = truckLicenseNos.join(',');
              this.getTruckLocation(truckLicenseNosStr, callback);
            }
          }

        });
      },
      openMarkerInfoWindow(marker) {
        const truck = this.findTruck(marker.handle);
        this.$set(truck, 'driverFullName', '');
        this.$set(truck, 'viceDriverFullName', '');

        TransportService.list({ 'mainTruckCode': truck.code, 'page': 1, 'size': 1 }, (rep) => {
          console.log('transport', rep);
          if (rep && rep.content && rep.total) {
            this.$set(truck, 'driverFullName', rep.content[0].driverFullName);
            this.$set(truck, 'viceDriverFullName', rep.content[0].viceDriverFullName);
//                        truck.driverFullName = rep.content[0].driverFullName;
//                        truck.viceDriverFullName = rep.content[0].viceDriverFullName;
          }
        });

        this.$set(truck, 'truckAddress', '');
        LbsService.getAddress({
          type: 1,
          lat: marker.point.lat,
          lng: marker.point.lng
        }, (addressSuccess) => {
          if (addressSuccess) {
            this.$set(truck, 'truckAddress', addressSuccess.content.address || '');
//            truck.truckAddress = addressSuccess.content.address || '';
          }
        });
        marker.show = true;
      },
      closeMarkerInfoWindow(marker) {
        marker.show = false;
      },
      truckSelect(truck) {
        console.log(truck.truckLicenseNo)
        if (this.markerPointsObj.has(truck.truckLicenseNo)) {
          console.log(truck)
          this.center = this.markerPointsObj.get(truck.truckLicenseNo).point;
          this.openMarkerInfoWindow(this.markerPointsObj.get(truck.truckLicenseNo));
        }
      },
      findTruck(truckLicenseNo) {
        const truck = this.trucks.find(t => t.truckLicenseNo === truckLicenseNo);
        return truck;
      },
      toModelText(modelCode) {
//        console.log('modelCode', modelCode);
        const model = this.truckModelOptions.find(option => option.id === modelCode);
        if (model) {
          return model.name;
        }
        return '-';
      },
      toUnitText(unitCode) {
//        console.log('unitCode', unitCode);
        const model = this.unitOptions.find(option => option.id === unitCode);
        if (model) {
          return model.name;
        }
        return '-';
      },
      popInfoWindow(marker) {
        this.truckSelect(this.trucksObj[marker.handle]);
      }
    },
    beforeCreate() {
    },
    created() {
      this.netGetTagList();
      if (this.theme) {
        document.querySelector('body').classList.add('theme-blue');
      }
      DataSourceService.truckModel.getData({}, (options) => {
        this.truckModelOptions = options;
        console.log('truckModelOptions', this.truckModelOptions);
      });
      DataSourceService.getAll(['truckSize', 'truckCarry'], {}, (options) => {
        this.unitOptions = options;
        console.log('unitOptions', this.unitOptions);
        this.searchTrucks(this.onDataReady);
      });
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import './truck-map.scss';
</style>

