<template>
  <div class="truck-gps-page">
    <div class="el-loading-mask is-fullscreen" v-if="fullscreenLoading"><div class="el-loading-spinner"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg><p class="el-loading-text">查询中，请稍等……</p></div></div>
    <header class="header clearfix">
      <!-- gps-form -->
      <div class="gps-search fl">
        <el-form label-width="100px" :inline="true">
          <!-- <el-form-item label="车牌号：">
            <el-input v-model="truckLicenseNo" placeholder="请输入车牌号"></el-input>
          </el-form-item> -->
          <!-- <el-form-item label="回放时间：">
            <el-date-picker v-model="dateRange[0]" :default-value="timeDefault1" type="datetime" placeholder="选择开始时间"></el-date-picker>
            <el-date-picker v-model="dateRange[1]" :default-value="timeDefault2" type="datetime" placeholder="选择结束时间"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="query('local')" :disabled="btnDisabled">本地库搜索</el-button>
            <el-button type="primary" @click="query('online')" :disabled="btnDisabled">实时库搜索</el-button>
          </el-form-item> -->
          <el-form-item class="info-list">
            <span class="info-item">车牌号：{{ truckLicenseNo }}</span>
            <span class="info-item">主驾：{{ driverFullName }}</span>
            <span class="info-item">手机号：{{ driverPhone }}</span>
            <span class="info-item">货物总称：{{ goodsName }}</span>
          </el-form-item>
          <el-form-item>
            <el-button @click="lushuPlayback">
              {{lushuIsPlay? "暂停回放": "开始回放" }}
            </el-button>
            <el-button @click="lushuReset">回到起点</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- gps-setting -->
      <div class="gps-setting fr">
        回放速度：
        <el-select v-model="playSpeed" placeholder="请选择" @change="handleSpeedChange">
          <el-option v-for="item in speedList" :key="item.id" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <!-- <el-button @click="setSpeed(0.5)" :type="syncCurrentSpeed(0.5)"> 0.5倍</el-button>
        <el-button @click="setSpeed(1)" :type="syncCurrentSpeed(1)">1倍</el-button>
        <el-button @click="setSpeed(1.5)" :type="syncCurrentSpeed(1.5)">1.5倍</el-button>
        <el-button @click="setSpeed(2)" :type="syncCurrentSpeed(2)">2倍</el-button>
        <el-button type="primary" @click="setSpeed(50)" :type="syncCurrentSpeed(50)">50倍</el-button>
        <el-button @click="setSpeed(100)" :type="syncCurrentSpeed(100)">100倍</el-button> -->
        <el-button type="primary" @click="changeShowTrajectory">轨迹明细</el-button>
        <!-- <el-button type="primary" @click="changeShowTrackChart">速度明细</el-button> -->
      </div>
    </header>

    <div class="trajectory" v-show="showTrajectory">
      <el-table :data="tracePath" height="250" border highlight-current-row style="width: 100%">
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <el-table-column property="recordTime" label="时间" width="180"></el-table-column>
        <el-table-column property="lng" label="经度" width="180"></el-table-column>
        <el-table-column property="lat" label="纬度" width="180"></el-table-column>
        <el-table-column property="speed" label="速度（公里/小时）" width="200"></el-table-column>
        <el-table-column property="direction" label="角度" width="80"></el-table-column>
        <el-table-column property="directionDec" label="方向" width="180"></el-table-column>
        <el-table-column label="位置">
          <template scope="scope">
              <el-button @click.native.prevent="getPointPos(scope.$index, scope.row)" type="text" size="small">
                {{scope.row.posstr}}
              </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="trackChart" v-if="showTrackChart">

      <ve-line :data="chartData" :height="chartset.height" :width="chartset.width"></ve-line>
    </div>

    <div class="map" v-show="true" :class="{'withTable':showTrajectory, 'withChart':showTrackChart}" >
      <baidu-map class="baidu-map" :center="center" @ready="mapReady" :zoom="15" :map-click="false" :scroll-wheel-zoom="true">
        <bm-navigation anchor="BMAP_ANCHOR_TOP_LEFT"></bm-navigation>
        <bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-map-type>
        <bml-lushu ref="lushu" :auto-view="true" :path="wayPointPath"
                   :icon="truckIcon" :play="lushuIsPlay" :z-index="10" :rotation="true"
                   :speed="playbackSpeed" :content="infoWindowContent">
        </bml-lushu>
        <bm-polyline :path="wayPointPath" stroke-color="blue" :stroke-opacity="0.5" :stroke-weight="wayPointWidth">
        </bm-polyline>
        <bm-marker v-for="(wayPoint, index) in gpsWayPoint" :position="wayPoint.point" :key="wayPoint.id" :dragging="false" :icon="wayPoint.icon"
        @mouseover="wayPointMouseOver(wayPoint, index)" @mouseout="wayPointMouseOut(wayPoint, index)"
        @infowindowopen="wayPointWindowOpen(wayPoint, index)"
        @infowindowclose="wayPointWindowClose(wayPoint, index)">
          <bm-info-window :show="wayPoint.show">
            <div v-if="wayPoint.stopTime">
              <p>停留时间：{{wayPoint.stayTime}} 分钟</p>
              <p>开始时间：{{wayPoint.recordTime}}</p>
              <p>停止时间：{{wayPoint.stopTime}}</p>
              <p>位置：{{wayPoint.pos_str}}</p>
            </div>
            <div v-else="wayPoint.stopTime">
              <p>采集时间：{{wayPoint.recordTime}}</p>
              <p>位置：{{wayPoint.pos_str}}</p>
              <p>速度：{{wayPoint.speed}} km/小时</p>
            </div>
          </bm-info-window>
        </bm-marker>
      </baidu-map>
      <!-- 轨迹回放结束弹窗 -->
      <el-dialog title="轨迹回放" :visible.sync="dialogFormVisible" size="tiny">
        <el-form :model="trajectoryData" label-width="120px" class="tradialog">
          <el-form-item label="回放开始时间">
            {{ trajectoryData.startTime }}
          </el-form-item>
          <el-form-item label="回放结束时间">
            {{ trajectoryData.endTime }}
          </el-form-item>
          <el-form-item label="行驶里程">
            {{ trajectoryData.runningMile }}
          </el-form-item>
          <el-form-item label="行驶时间">
            {{ trajectoryData.runningTime }}
          </el-form-item>
          <el-form-item label="平均速度">
            {{ trajectoryData.averageSpeed }}
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="replay()">重新回放</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  /* eslint-disable comma-dangle */
  /* eslint-disable vars-on-top */
  /* eslint-disable arrow-body-style */
  /* eslint-disable no-unused-vars */
  /* eslint-disable spaced-comment */
  /* eslint-disable import/no-unresolved */
  /* eslint-disable one-var */
  /* eslint-disable no-mixed-operators */
  import {
    BmlLushu
  } from 'vue-baidu-map';

  import * as utils from '../../api/Utils';
  import * as TruckService from '../../api/TruckService';
  import * as LbsService from '../../api/LbsService';
  import elePopMap from '../components/ele-pop-map/elePopMap.vue';
  import LbsLib from '../LbsLib';
  import EleDate from "../components/ele-date/eleDate.vue";

  import { province, city } from '../../api/DataSourceService';

  export default {
    name: 'truck-gps',
    components: {
      EleDate,
      BmlLushu,
      'ele-pop-map': elePopMap
    },
    data() {
      return {
        chartset: {
          width: '100%',
          height: '220px'
        },
        btnDisabled: false,
        truckLicenseNo: '',
        driverFullName: '',
        driverPhone: '',
        goodsName: '',
        currentDistance: 0,
        lushuPlayCounter: 0,
        prevPoint: null,
//        dateRange: ['2018-03-05 21:00:00', '2018-03-05 21:05:00'],
        fullscreenLoading: false,
        dateRange: [],
        timeDefault1: utils.dateFormat(new Date(), 'day') + ' 00:00:00',
        timeDefault2: utils.dateFormat(new Date(), 'day') + ' 23:59:59',
        playSpeed: 50,
        speedList: [{
          id: 1,
          label: '0.5倍',
          value: 0.5
        },{
          id: 2,
          label: '1倍',
          value: 1
        },{
          id: 3,
          label: '1.5倍',
          value: 1.5
        },{
          id: 4,
          label: '2倍',
          value: 2
        },{
          id: 5,
          label: '50倍',
          value: 50
        },{
          id: 6,
          label: '100倍',
          value: 100
        }],
        showTrajectory: false,
        showTrackChart: false,
        showDataMap: false,
        playbackSpeed: 5000,
        wayPointPath: [],
        tracePath: [],
        gpsWayPoint: [],
        chartData: {
          columns: ['时间', '速度'],
          rows: []
        },
        wayPointWidth: 2,
        infoWindowContent: '',
        center: {},
        truckIcon: {
          url: '/static/gps/img/car.png',
          size: {
            width: 48,
            height: 22
          },
          opts: {
            anchor: {
              width: 24,
              height: 11
            }
          }
        },
        wayPointIcon: {
          url: '/static/gps/img/blue_dot_8.png',
          size: {
            width: 8,
            height: 8,
          },
          opts: {
            width: 4,
            height: 4,
          },
        },
        startIcon: {
          url: '/static/gps/img/map_start.png',
          size: {
            width: 32,
            height: 32,
          },
          opts: {
            width: 16,
            height: 16,
          },
        },
        endIcon: {
          url: '/static/gps/img/map_finish.png',
          size: {
            width: 32,
            height: 32,
          },
          opts: {
            width: 16,
            height: 16,
          },
        },
        lushuIsPlay: false,
        lushuSpeed: 100,
        dialogFormVisible: false,
        trajectoryData: {
          startTime: '2018-03-05 11:00:00',
          endTime: '2018-03-05 11:35:40',
          runningMile: '2.47公里',
          runningTime: '36分钟',
          averageSpeed: '4.16km/h'
        },
        theme: true
      };
    },
    methods: {
      handleSpeedChange(val) {
        console.log('new speed is ', val, 'playSpeed is', this.playSpeed);
        this.setSpeed(val);
      },
      replay() {
        console.log('lushu replay');
        this.lushuReset();
        this.$nextTick(() => {
          this.dialogFormVisible = false;
        });
//        this.lushuPlayback();
        setTimeout(() => {
          this.lushuPlayback();
        }, 500);
      },
      mapReady({
        BMap,
        map
      }) {
        this.map = map;
        this.initView();
        // this.query();
        // this.getHistoryLocation();
      },
      initView() {
        const params = utils.getParamsFromURL(window.location.search),
          loadingProvinceCode = params.loadingProvinceCode,
          loadingCityCode = params.loadingCityCode,
          unloadingProvinceCode = params.unloadingProvinceCode,
          unloadingCityCode = params.unloadingCityCode,
          loadingText = this.getCityText(loadingProvinceCode, loadingCityCode),
          unloadingText = this.getCityText(unloadingProvinceCode, unloadingCityCode),
          citys = [loadingText, unloadingText],
          points = [], // 经纬度点的集合，默认取发货地和收货地
          myGeo = new BMap.Geocoder(),
          self = this;
        citys.forEach((c) => {
          myGeo.getPoint(c, function(point) {
            if (point) {
              console.log('get ct point is', point);
              points.push(point);
            }
            if (citys.length === points.length) {
              console.log('its time to set viewport now', new Date().getTime());
              self.map.setViewport(points);
            }
          }, c);
        });
        console.log('get all points is', points);
        console.log('this map is', this.map);
      },
      getCityText(provinceCode, cityCode) {
        let text = '';
        province.getData({}, (success) => {
          console.log('province is ', success);
          success.forEach((val) => {
            if (val.id === provinceCode) {
              text += val.name;
            }
          });
        });
        city.getData({keyword: provinceCode}, (success) => {
          console.log('city is ', success);
          success.forEach((val) => {
            if (val.id === cityCode) {
              text += val.name;
            }
          });
        });
        console.log('city text is', text);
        return text;
      },
      //根据地址获取
      getPointByAddress(city, address) {
        if(!city && !address){return};
        city = city ? city : '';
        address = address ? address : city;
        var myGeo = new BMap.Geocoder();
        let self = this;
        myGeo.getPoint(city, function(point) {
          if (point) {
            console.log('point is', point);
          }
        },city);
      },
      lushuPlayback() {
        this.lushuIsPlay = !this.lushuIsPlay;
        if (this.lushuIsPlay) {
          this.prevPoint = null;
          this.$nextTick(() => {
            this.$refs.lushu.$on('stop', this.lushuStop);
            this.$refs.lushu.$on('step', this.lushuStep);
          });
        }
      },
      lushuStop() {
        this.$refs.lushu.$off('step', this.lushuStep);
        this.$refs.lushu.$off('stop', this.lushuStop);
        console.log('lushu stop', this.$refs.lushu);
        this.trajectoryData.startTime = this.tracePath[0].recordTime;
        this.trajectoryData.endTime = this.tracePath[this.tracePath.length - 1].recordTime;
        this.trajectoryData.runningMile = this.currentDistance.toFixed(2) + '公里';
        const mSeconds = Date.parse(this.trajectoryData.endTime) - Date.parse(this.trajectoryData.startTime);
        this.trajectoryData.runningTime = Math.floor((mSeconds) / (60 * 1000)) + '分钟';
        this.trajectoryData.averageSpeed = (this.currentDistance / (mSeconds / (60 * 60 * 1000))).toFixed(2) + 'km/小时';
        this.currentDistance = 0;
        this.lushuPlayCounter = 0;
        this.prevPoint = null;
        this.lushuIsPlay = false;
        this.dialogFormVisible = true;
      },
      lushuReset() {
        this.$refs.lushu.$off('step', this.lushuStep);
        this.$refs.lushu.$off('stop', this.lushuStop);
        this.lushuIsPlay = false;
        this.currentDistance = 0;
        this.lushuPlayCounter = 0;
        this.prevPoint = null;
        if (this.gpsWayPoint) {
          this.wayPointPath.splice(this.wayPointPath.length);
          if (this.wayPointPath.length > 0) {
            this.map.setViewport(this.wayPointPath);
          }
        } else {
          this.$message.error('this.gpsWayPoint is not defined,msg by sls.');
        }
      },
      lushuStep({
        index,
        point,
        rotation
      }) {
//         console.log('lushuStep:', index, point);
        const record = this.tracePath[index];
        //      console.log('lushuStep', index, point, record);
        let distance = 0.0;
        if (this.prevPoint) {
          distance = (LbsLib.distance(this.prevPoint.lat, this.prevPoint.lng, point.lat, point.lng) / 1000);
          this.currentDistance += Math.abs(distance);
          //        console.log('currentDistance', index, this.currentDistance, Math.abs(distance));
          distance = this.currentDistance.toFixed(2);
        }
        this.prevPoint = point;
        this.lushuPlayCounter += 1;
        if (this.lushuPlayCounter === this.tracePath.length) {
//          this.currentDistance = 0;
//          this.lushuPlayCounter = 0;
//          this.prevPoint = null;
          console.log('play end');
        }
        //      this.infoWindowContent = `${JSON.stringify({ index, point, rotation })}`;
        this.infoWindowContent = `<div>
                    <div><span>当前里程：${distance} km</span></div>
                    <div><span>当前速度：${record.speed ? record.speed : 0} km/小时</span></div>
                    <div><span>当前时间：${record.recordTime}</span></div>
                    </div>`;
      },
      setSpeed(val) {
        this.playbackSpeed = 100 * val;
        if (this.lushuIsPlay) {
          this.lushuIsPlay = false;
          this.$nextTick(() => {
            this.lushuIsPlay = true;
          });
        }
      },
      syncCurrentSpeed(val) {
        return this.playbackSpeed === val * 100 ? 'primary' : 'default';
      },
      changeShowTrajectory() {
        this.showTrajectory = !this.showTrajectory;
      },
      changeShowTrackChart() {
        this.showTrackChart = !this.showTrackChart;
      },
      query(type) {
        // type= local 本地库搜索，online 实时库搜索，默认本地搜索
        const qt = type === 'online' ? 'online' : 'local';
        if (this.truckLicenseNo && this.dateRange[0] && this.dateRange[1]) {
          const begin = Date.parse(this.dateRange[0]),
            end = Date.parse(this.dateRange[1]),
            diff = end - begin,
            condition = qt === 'online' ? (diff > 0 && diff <= (1 * 24 * 3600 * 1000)) : (diff > 0 && diff <= (5 * 24 * 3600 * 1000));
          if (condition) {
            this.getHistoryLocation(qt);
            return;
          } else {
            const msg = qt === 'online' ? '只能查询1天内的轨迹数据' : '只能查询5天内的轨迹数据';
            this.$message({
              type: 'warning',
              message: msg,
              duration: 3000
            });
            return;
          }
        } else {
          this.$message({
            type: 'warning',
            message: '请输入车牌号并选择轨迹回放开始时间及结束时间方可查询！',
            duration: 3000
          });
          return;
        }

      },
      getHistoryLocation(type) {
        this.btnDisabled = true;
        this.fullscreenLoading = true;
        const qt = type === 'online' ? 'online' : 'local';
        const params = {
          'local' : {
            truckLicenseNo: this.truckLicenseNo,
            beginTime: this.dateRange[0],
            endTime: this.dateRange[1]
          },
          'online' : {
            bizEventNo: 'sinoiovHisTrackController',
            vclN : this.truckLicenseNo,
            qryBtm: this.dateRange[0],
            qryEtm: this.dateRange[1]
          }
        };
        LbsService[qt === 'local' ? 'getHistoryLocation' : 'getHistoryLocationRealtime'](params[qt], (success, error) => {
          this.btnDisabled = false;
          console.log('getHistoryLocation', success);
          if (success && success.content && success.content.length > 0) {
            const count = success.content.length;
            this.tracePath = success.content.map((a, index) => {
              return {
                createTime: a.createTime,
                direction: a.direction,
                handle: a.handle,
                lat: a.lat,
                lng: a.lng,
                ownerOrgCode: a.ownerOrgCode,
                recordTime: a.recordTime,
                source: a.source,
                speed: a.speed,
                type: a.type,
                directionDec: LbsLib.getDirection(a.direction),
                isLast: index === count - 1,
                posstr: '查看位置'
              };
            });
            this.trackPath = success.content;
            success.content.forEach((a) => {
              this.chartData.rows.push({
                '时间': a.recordTime,
                '速度': a.speed + 'km/小时'
              });
            });
            this.gpsWayPoint = success.content.map((a, index) => {
              let theIcon = index === 0 ? this.startIcon : this.wayPointIcon;
              let stayTime = 0;
              if (index + 1 === count) {
                theIcon = this.endIcon;
              } else if (a.stopTime) {
                theIcon = null;
                stayTime = (Date.parse(a.stopTime) - Date.parse(a.recordTime)) / (1000 * 60);
              }
              return {
                id: index,
                show: false,
                point: {
                  lng: a.lng,
                  lat: a.lat,
                },
                rotation: a.direction,
                handle: a.handle,
                createTime: a.createTime,
                recordTime: a.recordTime,
                stopTime: a.stopTime,
                stayTime: Math.floor(stayTime),
                source: a.source,
                speed: a.speed,
                type: a.type,
                icon: theIcon,
                pos_str: ''
              };
            });
          } else {
            this.$message({
              showClose: true,
              type: 'warning',
              message: `此车未联网！`,
              duration: 0
            });
            this.gpsWayPoint = [];
          }

          // 取消loading
          this.fullscreenLoading = false;

          this.wayPointPath = LbsLib.transformPoints(this.gpsWayPoint.map(a => a.point));
          console.log('this.wayPointPath', this.wayPointPath);
          if (this.wayPointPath && this.wayPointPath.length) {
            this.prevPoint = this.wayPointPath[0];
          }
          if (this.wayPointPath.length > 0) {
            this.map.setViewport(this.wayPointPath);
          }
        });
      },
      wayPointMouseOver(wayPoint, index) {
        //      console.log('marker mouse over', wayPoint);
        wayPoint.show = true;
        if (!wayPoint.pos_str || !wayPoint.pos_str.length) {
          LbsService.getAddress({
            type: 1,
            lng: wayPoint.point.lng,
            lat: wayPoint.point.lat
          }, (success, error) => {
            if (success) {
              wayPoint.pos_str = success.content.address || '获取地址';
            }
          });
        }
      },
      wayPointMouseOut(wayPoint, index) {
        //      console.log('marker mouse out', wayPoint);
        wayPoint.show = false;
      },
      wayPointWindowOpen(wayPoint, index) {
        wayPoint.show = true;
      },
      wayPointWindowClose(wayPoint, index) {
        wayPoint.show = false;
      },
      getPointPos(index, item) {
//        console.log('getPointPos', item);
        LbsService.getAddress({
          type: 0,
          lng: item.lng,
          lat: item.lat
        }, (success, error) => {
          if (success) {
            item.posstr = success.content.address || '获取地址';
          }
        });
      },
      popMapInited({
        ctrl,
        markers
      }) {
        LbsService.getPosition({
          truckLicenseNo: this.truckLicenseNo
        }, (result, error) => {
          if (result) {
            markers.length = 0;
            result.content.forEach((a) => {
              markers.push({
                handle: a.handle,
                rotation: a.direction,
                position: {
                  lng: a.lng,
                  lat: a.lat
                },
                status: a.status,
                type: a.type,
                icon: this.truckIcon
              });
            });
            ctrl.refresh();
          }
        });
      }
    },
    created() {
      if (this.theme) {
        document.querySelector('body').classList.add('theme-blue');
      }
      const params = utils.getParamsFromURL(window.location.search);
      this.truckLicenseNo = params.truckLicenseNo;
      this.driverFullName = params.driverFullName;
      this.driverPhone = params.driverPhone;
      this.goodsName = params.goodsName;
      // 从车辆定位页面过来的默认查询当天轨迹
      if (params.queryNow) {
        const todayStart = new Date(Date.parse(utils.dateFormat(new Date(), 'day') + ' 00:00:00')),
          todayEnd = new Date(Date.parse(utils.dateFormat(new Date(), 'day') + ' 23:59:59'));
        this.dateRange = [todayStart, todayEnd];
      }
      // 从运单页面过来的，运输中going，运输完成finish，发货时间loadingTime，收货时间unloadingTime
      if (params.waybillStatus) {
        const startTime = Date.parse(params.loadingTime),
          endTime = Date.parse(params.unloadingTime),
          now = Date.parse(new Date()); // 获取当前时间
        console.log('当前时间为', now);
        // 运输中，发货时间带入到开始时间，当前时间带入到结束时间；当时间段超过5天，结束时间带入发货时间+5DAY的时间；
        if (params.waybillStatus === 'going') {
          if ((now - startTime) > 0 && (now - startTime) > 5 * 24 * 3600 * 1000) {
            this.dateRange = [utils.dateFormat(startTime), utils.dateFormat(startTime + 5 * 24 * 3600 * 1000)];
          } else {
            this.dateRange = [utils.dateFormat(startTime), utils.dateFormat(now)];
          }
        }
        // 运输完成，发货时间带入到开始时间，收货时间带入到结束时间，当时间段超过5天，结束时间带入发货时间+5DAY的时间；
        if (params.waybillStatus === 'finish') {
          if ((endTime - startTime) > 0 && (endTime - startTime) > 5 * 24 * 3600 * 1000) {
            this.dateRange = [utils.dateFormat(startTime), utils.dateFormat(startTime + 5 * 24 * 3600 * 1000)];
          } else {
            this.dateRange = [utils.dateFormat(startTime), utils.dateFormat(endTime)];
          }
        }
      }

      this.center = {
        lng: 121.494337,
        lat: 31.22753
      };

      //查询轨迹
      if (this.truckLicenseNo && this.dateRange[0] && this.dateRange[1]) {
        this.query();
      }
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import './truck-gps.scss';
  .gps-search {
    .el-form-item__label {
      padding: 0 !important;
      width: auto !important;
    }
    .el-input {
      width: 100px;
    }
    .el-date-editor--datetime {
      width: 180px !important;
    }
  }
  .gps-setting {
    .el-select {
      width: 100px;
    }
  }
  .baidu-map {
    width: 100%;
    height: 100%;
  }

  .trajectory {
    height: 250px;
    z-index: 100;
    position: relative;
  }

  .trackChart {
    height: 200px;
    z-index: 100;
    position: relative;
    background-color: white;
  }

  .map.withTable {
    top: 290px;
  }

  .map.withChart {
    top: 240px;
  }

  .map.withTable.withChart {
    top: 490px!important;
  }

  .el-date-editor--datetimerange input {
    width: 320px;
  }

  .today.start-date,
  .today.end-date {
    color: black!important;
  }
</style>
