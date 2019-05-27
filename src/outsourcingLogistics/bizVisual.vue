/** 
* bizVisual.vue 
* 订单监控 
* Created by cc on 19/3/6. 
*/
<template>
  <div class="biz-visual">
    <!-- top section -->
    <div class="top-section">
      <h1 class="page-title fl">订单监控</h1>
      <span class="page-refresh fr" id="pageRefresh" title="点击刷新当前页面">
        <i class="ico-refresh"></i>刷新
      </span>
    </div>
    <!-- logistics section -->
    <div class="logistics-section">
      <ul class="fm-list">
        <li>
          <span class="fm-tit">
            订单号：
          </span>
          <span class="fm-cont">
            <a :href="`/outsourcingLogistics/add.html?code=${logisticsData.code}&editable=false`" target="_blank" class="blue">
            {{ logisticsData.logisticsNo }}</a>
          </span>
        </li>
        <li>
          <span class="fm-tit">
            客户：
          </span>
          <span class="fm-cont">
            <!-- <a :href="`/partner/add.html?orgCode=${logisticsData.platformClientOrgCode}&editable=false`" target="_blank" class="blue"> -->
            {{ logisticsData.clientOrgName }}
            <!-- </a> -->
          </span>
        </li>
        <li>
          <span class="fm-tit">
            线路名称：
          </span>
          <span class="fm-cont">
            <!-- <a :href="`/route/add.html?code=${logisticsData.routeCode}&editable=false`" target="_blank" class="blue"> -->
            {{ logisticsData.routeName }}
            <!-- </a> -->
          </span>
        </li>
        <li>
          <span class="fm-tit">
            货物：
          </span>
          <span class="fm-cont">
            {{ logisticsData.goodsName }}，{{ logisticsGoodsInfo }}，{{ logisticsData.truckQty }}车
          </span>
        </li>
        <li>
          <span class="fm-tit">
            订单状态：
          </span>
          <span class="fm-cont">
            {{ logisticsStatusText }}
            <ele-status :value="logisticsData.logisticsStatus" :configData="logisticsConfigData"></ele-status>
          </span>
        </li>
        <li v-if="showDispatch">
          <span class="fm-tit">
            派车完成：
          </span>
          <span class="fm-cont">
            <ele-progress :percent="dispatchPercent"></ele-progress>
          </span>
        </li>
        <li>
          <span class="fm-tit">
            发货完成：
          </span>
          <span class="fm-cont">
            <ele-progress :percent="loadingPercent"></ele-progress>
          </span>
        </li>
        <li>
          <span class="fm-tit">
            收货完成：
          </span>
          <span class="fm-cont">
            <ele-progress :percent="unloadingPercent"></ele-progress>
          </span>
        </li>
        <li class="col2">
          <span class="fm-tit">
            订单进度流：
          </span>
          <div class="fm-cont">
            <div class="line-progress" :class="logisticsData.logisticsStatus">
              <div class="line-block line-start">
                <span class="line-status">待发货</span>
                <span class="line-dot"></span>
                <span class="line-text">{{ waitingNum }} 车</span>
              </div>
              <div class="line-block line-middle">
                <span class="line-status">运输中</span>
                <span class="line-dot"></span>
                <span class="line-text">{{ doingNum }} 车</span>
              </div>
              <div class="line-block line-end">
                <span class="line-status">运输完成</span>
                <span class="line-dot"></span>
                <span class="line-text">{{ finishNum }} 车</span>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <!-- map section -->
    <div class="map-section">
      <baidu-map @ready="mapReady" class="map" :center="center" :zoom="zoom" :map-click="false" :scroll-wheel-zoom="true">
        <bm-navigation anchor="BMAP_ANCHOR_TOP_LEFT"></bm-navigation>
        <bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-map-type>
        <!-- 路线 -->
        <bm-driving
          v-if="showLine"
          :start="startAddress"
          :startCity="startCity"
          :end="endAddress"
          :endCity="endCity"
          :auto-viewport="true"
          policy="BMAP_DRIVING_POLICY_LEAST_DISTANCE"
          :panel="false">
        </bm-driving>
        <!-- 车辆图标 -->
        <!--
        <bm-marker
          v-for="markerPoint in markerPoints"
          :key="markerPoint.handle"
          :rotation="markerPoint.rotation"
          :position="markerPoint.point"
          :dragging="false"
          @click="openMarkerInfoWindow(markerPoint, 'fromTruck')"
          :icon="markerPoint.truckIcon">
          车辆信息弹窗
          <bm-info-window 
            :show="markerPoint.show"
            :autoPan="true"
            @close="closeMarkerInfoWindow(markerPoint)" 
            :close-on-click="true">
            车辆信息
            <div class='rl-map-info'>
              头部
              <div class='map-header'>
                <span class="status fr">异常</span>
                <a class="truck-detail blue" :href="`/truck/add.html?truckCode=${markerPoint.truck.platformTruckCode}&editable=false`" target="_blank">
                {{ markerPoint.truck.truckLicenseNo }}
                </a> - 
                <a class="truck-detail blue" :href="`/trailer/add.html?code=${markerPoint.truck.trailerTruckCode}&editable=false`" target="_blank">
                {{ markerPoint.truck.trailerTruckLicenseNo }}
                </a>
                <span class="el-tag el-tag--grey" >{{ markerPoint.source === 'mobile' ? '手机' : 'GPS' }}</span>
              </div>
              内容
              <div class='map-content'>
                <ul class="to-list">
                  <li><em class="truck-role">主</em>{{ markerPoint.truck.driverFullName }}，{{ markerPoint.truck.driverPhone }}</li>
                  <li class="copilot" v-show="!markerPoint.showWaybill"><em class="truck-role">副</em>{{ markerPoint.truck.viceDriverFullName }}，{{ markerPoint.truck.viceDriverPhone }}</li>
                </ul>
                <ul class="wb-list" v-show="markerPoint.showWaybill">
                  <li>
                    <span class="tit">运单号：</span>
                    <a class="blue" :href="`/outsourcingWaybill/add.html?code=${markerPoint.truck.code}&editable=false`" target="_blank">{{ markerPoint.truck.waybillNo }}</a>
                  </li>
                </ul>
                <div class="to-list carDetail">
                  <p><span class="tit">车型：</span>{{ markerPoint.truck.truckModelName }}，{{ markerPoint.truck.truckLength }} {{ markerPoint.truck.truckLengthUnitText }}，{{ markerPoint.truck.regTonnage }} {{ markerPoint.truck.regTonnageUnitText }}</p>
                  <p><span class="tit">速度:</span>{{ markerPoint.speed }} km/h</p>
                  <p><span class="tit">方向:</span>{{ markerPoint.directionDec }}</p>
                  <p><span class="tit">车辆位置:</span><span class="gold">{{ markerPoint.truck.address }}</span></p>
                  <p><span class="tit">定位时间:</span>{{ markerPoint.recordTime }}</p>
                </div>
              </div>
              底部
              <div class='map-footer'>
                <a class="btn-grey" target="_blank" href="#">车辆详情</a>
                <a class="btn-grey" target="_blank" :href="`/truck/truck-gps.html?truckLicenseNo=${markerPoint.handle}&queryNow=true`">车辆轨迹</a>
              </div>
            </div>
          </bm-info-window>
        </bm-marker>
        -->
      </baidu-map>
    </div>
    <!-- waybill section -->
    <div class="waybill-section">
      <div class="waybill-search">
        <div class="search-hd" @click="fold">
          <span class="search fr">搜索</span>
          <h2>运单列表</h2>
        </div>
        <div class="search-bd" v-show="showSearch">
          <form action="">
            <ul class="fm-list">
              <li>
                <label for="waybillNo" class="fm-tit">运单号：</label>
                <input v-model="searchParams.waybillNo" type="text" class="txtbox" id="waybillNo" placeholder="请输入运单号">
              </li>
              <li>
                <label for="truckLicenseNo" class="fm-tit">车牌号：</label>
                <input v-model="searchParams.truckLicenseNo" type="text" class="txtbox" id="truckLicenseNo" placeholder="请输入车牌号">
              </li>
              <li>
                <label for="driver" class="fm-tit">主驾司机：</label>
                <input v-model="searchParams.driverFullName" type="text" class="txtbox" id="driver" placeholder="请输入主驾司机">
              </li>
              <li class="tc">
                <button type="button" class="btn btn-primary" @click="searchWaybill('submit')">搜索</button>
                <button type="reset" class="btn btn-default" @click="searchWaybill('reset')">重置</button>
              </li>
            </ul>
          </form>
        </div>
      </div>
      <div class="waybill-list">
        <!-- 循环输出运单列表卡片式 -->
        <div class="card-list" :class="[waybill.isActive ? 'actived' : '']" v-for="(waybill, index) in waybillData" :key="waybill.id" @click="openTruckPop(waybill, 'fromWaybill')">
          <div class="cl-hd">
            <span class="fl index">{{index+1}}</span>
            <span class="fr">{{ waybill.createTime }}</span>
            <!-- <a :href="`/outsourcingWaybill/add.html?code=${waybill.code}&editable=false`" target="_blank" class="blue"> -->
            <span>{{ waybill.waybillNo }}</span>
            <!-- 运输中和运输完成的运单才有查看轨迹 -->
            <span class="view-gps" v-if="waybill.waybillStatus === 'going' || waybill.waybillStatus === 'finish'">
              <a :href="`/truck/truck-gps.html?truckLicenseNo=${waybill.truckLicenseNo}&waybillStatus=${waybill.waybillStatus}&loadingTime=${waybill.loadingTime}&unloadingTime=${waybill.unloadingTime}&driverFullName=${waybill.driverFullName}&driverPhone=${waybill.driverPhone}&goodsName=${waybill.goodsName}&loadingProvinceCode=${waybill.loadingProvinceCode}&loadingCityCode=${waybill.loadingCityCode}&unloadingProvinceCode=${waybill.unloadingProvinceCode}&unloadingCityCode=${waybill.unloadingCityCode}`" target="_blank" class="blue">
                查看轨迹
              </a>
            </span>
            <!-- </a> -->
          </div>
          <div class="cl-bd">
            <p>
              <span class="fr">
                <strong>{{ waybill.waybillStatusText }}</strong>
                <ele-status :value="waybill.waybillStatus" :configData="waybillConfigData"></ele-status>
              </span>
              <!-- <a :href="`/truck/add.html?truckCode=${waybill.platformTruckCode}&editable=false`" target="_blank" class="blue a-index"> -->
                {{ waybill.truckLicenseNo }}
              <!-- </a> -->
            </p>
            <div class="cl-info">
              <p>
                <span class="fr">{{ waybill.goodsName }}</span>
                <!-- <a :href="`/driver/add.html?userCode=${waybill.platformDriverCode}&editable=false`" target="_blank" class="blue"> -->
                  {{ waybill.driverFullName }}
                <!-- </a> -->
                <span class="tel">{{ waybill.driverPhone }}</span>
              </p>
              <p class="grey">
                <template v-if="waybill.loadingGoodsWeight">
                  发货：{{ waybill.loadingGoodsWeight }}吨，{{ waybill.loadingTime }}
                </template>
                <template v-else>
                  发货：-
                </template>
              </p>
              <p class="grey">
                <template v-if="waybill.loadingGoodsWeight">
                  收货：{{ waybill.unloadingGoodsWeight }}吨，{{ waybill.unloadingTime }}
                </template>
                <template v-else>
                  收货：-
                </template>
              </p>
            </div>
            <p class="tr">
              <span class="pi">派</span>
              {{ waybill.originalConsignOrgName }}
            </p>
          </div>
        </div>
      </div>
      <div class="waybill-page">
        <el-pagination
          v-if="showPage"
          @current-change="handleCurrentChange"
          :page-size="pageObj.size"
          layout="total, prev, pager, next"
          :total="pageTotal">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import eleProgress from '@/components/ele-progress/eleProgress.vue';
import eleStatus from '@/components/ele-status/eleStatus.vue';
import { getParamsFromURL } from '../../api/Utils';
import LbsLib from '../LbsLib';

import Decimal from "decimal.js";

// 引入tab跳转
require('../public.js');

import { province, city, county } from '../../api/DataSourceService';
import { getPosition, getAddress } from '../../api/LbsService';
import { get } from '../../api/OutsourcingLogisticsService';
import { getWaybillListOutsourcing as getWaybillList, getPopWaybillListOutsourcing as getPopWaybillList, getTotal } from '../../api/waybillService';

export default {
  name: 'bizVisual',
  components: {
    'ele-progress': eleProgress,
    'ele-status': eleStatus
  },
  props: {
  },
  data() {
    return {
      code: getParamsFromURL(window.location.search).code,
      logisticsData: {},
      waybillData: [],
      waybillPopData: [],
      searchParams: {
        waybillNo: '',
        truckLicenseNo: '',
        driverFullName: ''
      },
      showPage: false,
      pageObj: {
        page: 1,
        size: 100
      },
      pageTotal: 0,
      truckListData: [],
      firstLoad: true,
      waybillNum: 0,
      waitingNum: 0,
      doingNum: 0,
      arriveNum: 0,
      finishNum: 0,
      loadingPercent: 0,
      unloadingPercent: 0,
      showSearch: false,
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
      center: {
        lng: 121.494337,
        lat: 31.22753
      },
      zoom: 3,
      showLine: false,
      startAddress: null,
      startCity: null,
      endAddress: null,
      endCity: null,
      markerPoints: [],
      theme: true,
      logisticsConfigData: {
        fieldConfigCode: 'logisticsStatus'
      },
      waybillConfigData: {
        fieldConfigCode: 'waybillStatus'
      },
      projectName: JSON.parse(localStorage.getItem('appInfo')).projectName
    };
  },
  computed: {
    logisticsStatusText() {
      switch(this.logisticsData.logisticsStatus) {
        case 'waiting':
        return '待接单';
        case 'todo':
        return '待执行';
        case 'doing':
        return '执行中';
        case 'finish':
        return '订单完成';
        case 'cancel':
        return '订单取消';
        default:
        return '';
      }
    },
    logisticsGoodsInfo() {
      const mt = this.logisticsData.meterageType;
      let text = '';
      switch(mt) {
        case 'ton':
          this.logisticsData.goodsWeight ? (text = this.logisticsData.goodsWeight + '吨') : '吨';
          return text;
        case 'cube':
          this.logisticsData.goodsVolume ? (text = this.logisticsData.goodsVolume + '方') : '方';
          return text;
        case 'item':
          this.logisticsData.goodsNum ? (text = this.logisticsData.goodsNum + '件') : '件';
          return text;
      }
    },
    dispatchPercent() {
      // 有效运单数量（运单状态不为取消状态）/ 订单的需求车次
      // let val = (this.waybillNum / this.logisticsData.truckQty).toFixed(2) * 100;
      let val = 0;
      if (this.logisticsData.truckQty > 0) {
        val = Decimal(this.waybillNum || 0).div(this.logisticsData.truckQty).mul(100).toDP(0);
      }
      return parseInt(val);
      // return 75;
    },
    showDispatch() {
      let result = true;
      if (!this.logisticsData.truckQty || this.dispatchPercent === 0) {
        result = false;
      }
      return result;
    }
    // loadingPercent() {
    //   // 根据计量单位，如吨，有效运单发货重量小计 / 订单的计划重量
    //   // let val = (this.loadingGoodsWeightTotal / this.logisticsData.goodsWeight).toFixed(2) * 100;
    //   let val = 0;
    //   if (this.logisticsData.goodsWeight) {
    //     val = Decimal(this.loadingGoodsWeightTotal || 0).div(this.logisticsData.goodsWeight).mul(100).toDP(0);
    //   }
    //   return parseInt(val);
    //   // return 60;
    // },
    // unloadingPercent() {
    //   // 根据计量单位，如吨，有效运单收货重量小计 / 订单的计划重量
    //   // let val = (this.unloadingGoodsWeightTotal / this.logisticsData.goodsWeight).toFixed(2) * 100;
    //   let val = 0;
    //   if (this.logisticsData.goodsWeight) {
    //     val = Decimal(this.unloadingGoodsWeightTotal || 0).div(this.logisticsData.goodsWeight).mul(100).toDP(0);
    //   }
    //   return parseInt(val);
    //   // return 50;
    // }
  },
  methods: {
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pageObj.page = val;
      this.getWaybillList(this.searchParams);
    },
    mapReady({BMap, map}) {
      console.log(BMap, map);
    },
    fold() {
      if (this.showSearch) {
        this.showSearch = false;
      } else {
        this.showSearch = true;
      }
    },
    getUnitText(val) {
      switch(val) {
        // 运单状态
        case 'unloading':
        return '待发货';
        case 'going':
        return '运输中';
        case 'arrive':
        return '已到收货点';
        case 'finish':
        return '运输完成';
        case 'cancel':
        return '运单取消';
        // 单位
        case 'ton':
        return '吨';
        case 'cube':
        return '方';
        case 'item':
        return '件';
        case 'meter':
        return '米';
        default:
        return '';
      }
    },
    getCityText(provinceCode, cityCode, countyCode, address) {
      let text = '', provinceText = '', cityText = '', countyText = '';
      province.getData({}, (success) => {
        console.log('province is ', success);
        success.forEach((val) => {
          if (val.id === provinceCode) {
            provinceText = val.name;
          }
        });
      });
      city.getData({keyword: provinceCode}, (success) => {
        console.log('city is ', success);
        success.forEach((val) => {
          if (val.id === cityCode) {
            cityText = val.name;
          }
        });
      });
      county.getData({keyword: cityCode}, (success) => {
        console.log('county is ', success);
        success.forEach((val) => {
          if (val.id === countyCode) {
            countyText = val.name;
          }
        });
      });
      // if (address) {
      //   text += address;
      // }
      if (provinceCode && cityCode && !countyCode) {
        text = cityText;
      }
      if (provinceCode && cityCode && countyCode) {
        text = countyText;
      }
      console.log('province city county text is', provinceText, cityText, countyText);
      console.log('get full province city county address text is', text);
      // this.getPointByAddress(cityText, text);
      return text;
    },
    //根据地址获取
    getPointByAddress(city, address) {
      var myGeo = new BMap.Geocoder();
      let self = this;
      myGeo.getPoint(address, function(point) {
        if (point) {
          console.log('get point is', point);
          return point;
        }
      }, city);
    },
    getPercent(data, type) {
      let val = 0;
      // 发货量完成度
      if (type === 'loading') {
        switch(data.meterageType) {
          case 'ton':
            data.goodsWeight > 0 ? (val = Decimal(data.loadingGoodsWeightCount || 0).div(data.goodsWeight).mul(100).toDP(0)) : val;
            return val;
          case 'cube':
            data.goodsVolume > 0 ? (val = Decimal(data.loadingGoodsVolumeCount || 0).div(data.goodsVolume).mul(100).toDP(0)) : val;
            return val;
          case 'item':
            data.goodsNum > 0 ? (val = Decimal(data.loadingGoodsNumCount || 0).div(data.goodsNum).mul(100).toDP(0)) : val;
            return val;
          default:
            return val;
        }
      } else {
        // 收货量完成度
        switch(data.meterageType) {
          case 'ton':
            data.goodsWeight > 0 ? (val = Decimal(data.unloadingGoodsWeightCount || 0).div(data.goodsWeight).mul(100).toDP(0)) : val;
            return val;
          case 'cube':
            data.goodsVolume > 0 ? (val = Decimal(data.unloadingGoodsVolumeCount || 0).div(data.goodsVolume).mul(100).toDP(0)) : val;
            return val;
          case 'item':
            data.goodsNum > 0 ? (val = Decimal(data.unloadingGoodsNumCount || 0).div(data.goodsNum).mul(100).toDP(0)) : val;
            return val;
          default:
            return val;
        }
      }
    },
    getLogisticsInfo() {
      const paramsObj = {
        code: this.code
      };
      // 获取订单信息
      get(paramsObj, (success, error) => {
        if (error || success.code !== 200) {
          this.$message({
            type: 'error',
            message: error.content,
            duration: 3000
          });
          return false;
        }
        if (success) {
          const data = success.content;
          this.logisticsData = data;
          console.log('logistics data is', data);
          this.startAddress = this.getCityText(data.loadingProvinceCode, data.loadingCityCode, data.loadingCountyCode, data.loadingAddress);
          this.startCity = this.getCityText(data.loadingProvinceCode, data.loadingCityCode);
          this.endAddress = this.getCityText(data.unloadingProvinceCode, data.unloadingCityCode, data.unloadingCountyCode, data.unloadingAddress);
          this.endCity = this.getCityText(data.unloadingProvinceCode, data.unloadingCityCode);
          this.showLine = true;

          // 计算发货量完成度——loadingPercent
          // 根据计量单位，如吨，有效运单发货重量小计 / 订单的计划重量
          const loadingPercent = this.getPercent(data, 'loading');
          this.loadingPercent = parseInt(loadingPercent);
          // 计算收货量完成度——unloadingPercent
          // 根据计量单位，如吨，有效运单收货重量小计 / 订单的计划重量
          const unloadingPercent = this.getPercent(data, 'unloading');
          this.unloadingPercent = parseInt(unloadingPercent);
        }
      });
      // 获取订单进度流
      getTotal({logisticsCodeList: this.code}, (success, error) => {
        // if (error || success.code !== 200) {
        //   this.$message({
        //     type: 'error',
        //     message: error.content,
        //     duration: 3000
        //   });
        //   return false;
        // }
        if (success) {
          const data = success.content[0] || {};
          // 统计运单总数
          this.waybillNum = data.shuntedNum ? data.shuntedNum : 0;
          // 待发货
          this.waitingNum = data.loadingNum ? data.loadingNum : 0;
          // 运输中
          this.doingNum = data.goingNum ? data.goingNum : 0;
          // 已到收货点
          this.arriveNum = data.arriveNum ? data.arriveNum : 0;
          // 运输完成
          this.finishNum = data.unloadingNum ? data.unloadingNum : 0;
        }
      })
    },
    getWaybillList(params, from) {
      // 查询默认从第一页
      if (from === 'fromSearch') {
        this.pageObj.page = 1;
      }
      const paramsObj = {
          logisticsCode: this.code
        },
        searchParams = Object.assign({}, paramsObj, params, this.pageObj);
      console.log('查询条件为', searchParams);
      // 获取运单
      getWaybillList(searchParams, (success, error) => {
        if (error || success.code !== 200) {
          this.$message({
            type: 'error',
            message: error.content,
            duration: 3000
          });
          return false;
        }
        if (success) {
          const data = success.content;
          this.pageTotal = success.total;
          this.showPage = true;
          data.forEach((val) => {
            if (val.waybillStatus) {
              val.waybillStatusText = this.getUnitText(val.waybillStatus);
            }
          });
          this.waybillData = data;
          console.log('waybill data is', data);
        }
      });
    },
    searchWaybill(type) {
      if (type === 'submit') {
        this.getWaybillList(this.searchParams, 'fromSearch');
        this.showSearch = false;
      } else {
        Object.keys(this.searchParams).forEach((key) => {
          this.$set(this.searchParams, key, null);
        });
        this.getWaybillList(this.searchParams, 'fromSearch');
        this.showSearch = false;
      }
    },
    getAllWaybillList() {
      const paramsObj = {
          logisticsCode: this.code
        };
      getPopWaybillList(paramsObj, (success, error) => {
        if (error || success.code !== 200) {
          this.$message({
            type: 'error',
            message: error.content,
            duration: 3000
          });
          return false;
        }
        if (success) {
          const data = success.content;
          data.forEach((val) => {
            // 车牌号
            if (!this.truckListData.includes(val.truckLicenseNo)) {
              this.truckListData.push(val.truckLicenseNo);
            }
          });
          this.waybillPopData = data;
          console.log('waybill pop data is', data);
          console.log('this.truckListData is', this.truckListData);
          // const truckCount = this.truckListData.length;
          // if (truckCount > 0) {
          //   // 大于100循环调用
          //   if (truckCount > 100) {
          //     const times = Math.ceil(truckCount / 100);
          //     console.log('总计需要查询次数为', times);
          //     for (let i = 1; i <= times; i++) {
          //       const trucks = this.truckListData.slice((i-1) * 100, 100 * i);
          //       console.log('循环次数为', i, '车辆数据为', trucks);
          //       this.getTruckPosition(trucks);
          //     }
          //   } else {
          //     this.getTruckPosition(this.truckListData);
          //   }
          // }
        }
      });
    },
    getTruckPosition(trucks) {
      // 获取车辆位置信息
      const paramsObj = {
          truckLicenseNo: trucks
        };
      getPosition(paramsObj, (success, error) => {
        if (error || success.code !== 200) {
          this.$message({
            type: 'error',
            // message: `获取车辆定位信息失败，${error.content}`,
             message: `获取车辆定位信息失败`,
            duration: 3000
          });
          return false;
        }
        if (success) {
          const data =  success.content;
          console.log('lbs position is', data);
          // 处理获取到的GPS信息
          // <bm-marker
          //     v-for="markerPoint in markerPoints"
          //     :key="markerPoint.handle"
          //     :rotation="markerPoint.rotation"
          //     :position="markerPoint.point"
          //     :dragging="false"
          //     @click="openMarkerInfoWindow(markerPoint)"
          //     :icon="markerPoint.truckIcon">
          //   </bm-marker>
          data.forEach((val) => {
            // 车辆图标
            let icon = null;
            switch(val.status) {
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
            const obj = {
              truck: {},
              handle: val.handle, // 车牌号
              rotation: val.direction ? val.direction : 0, // 角度
              directionDec: val.direction ? LbsLib.getDirection(val.direction) : '', // 方向
              point: LbsLib.transformPoint({
                lng: val.lng, //经度
                lat: val.lat //维度
              }), // 坐标转换为百度地图经纬度坐标
              truckIcon: icon, // 状态1，车辆正常绿色，状态2，车辆静止灰色，状态3，车辆异常红色
              status: val.status, // 状态
              type: val.type, // 类型（truck或driver车辆或司机）
              recordTime: val.recordTime, // 采集时间
              createTime: val.createTime, // 记录时间
              stopTime: val.stopTime, // 停留时间
              source: val.source, // 数据来源（手机定位，GPS定位）
              speed: val.speed || 0, // 速度
              ownerOrgCode: val.ownerOrgCode, // 所属组织编码
              show: false
            };
            this.markerPoints.push(obj);
          });
          console.log('获取到的全部车辆定位信息为：', this.markerPoints);
        }
      });
    },
    getAllTruckInfo(marker) {
      const allTruckInfo = {};
      // 基础信息，从运单列表取值
      this.waybillPopData.forEach((val) => {
        if (marker.handle === val.truckLicenseNo) {
          allTruckInfo.truckLicenseNo = val.truckLicenseNo; // 车牌号
          allTruckInfo.platformTruckCode = val.platformTruckCode; // 车辆平台级code
          allTruckInfo.trailerTruckLicenseNo = val.trailerTruckLicenseNo; // 挂车牌号
          allTruckInfo.trailerTruckCode = val.trailerTruckCode; // 挂车code
          allTruckInfo.platformTrailerTruckCode = val.platformTrailerTruckCode; // 挂车平台级code
          allTruckInfo.driverFullName = val.driverFullName; // 主驾
          allTruckInfo.platformDriverCode = val.platformDriverCode; // 主驾平台级code
          allTruckInfo.driverPhone = val.driverPhone; // 主驾手机号
          allTruckInfo.viceDriverFullName = val.viceDriverFullName; // 副驾
          allTruckInfo.platformViceDriverCode = val.platformViceDriverCode; // 副驾平台级code
          allTruckInfo.viceDriverPhone = val.viceDriverPhone; // 副驾手机号
          allTruckInfo.waybillNo = val.waybillNo; // 运单
          allTruckInfo.code = val.code; // 运单code
          allTruckInfo.truckModelName = val.truckModelName; // 车型
          allTruckInfo.truckLength = val.truckLength; // 车长
          allTruckInfo.truckLengthUnitCode = val.truckLengthUnitCode; // 车长单位
          allTruckInfo.truckLengthUnitText = this.getUnitText(val.truckLengthUnitCode); // 车长单位
          allTruckInfo.regTonnage = val.regTonnage; // 载重
          allTruckInfo.regTonnageUnitText =  this.getUnitText(val.regTonnageUnitCode); // 载重单位
        }
      });
      // 位置信息，根据接口获取
      getAddress({
        type: 1,
        lat: marker.point.lat,
        lng: marker.point.lng
      }, (addressSuccess) => {
        if (addressSuccess) {
          this.$set(allTruckInfo, 'address', addressSuccess.content.address || '');
        }
      });
      return allTruckInfo;
    },
    openMarkerInfoWindow(mark, from, waybill) {
      if (from === 'fromTruck') {
        mark.showWaybill = false;
      } else {
        mark.showWaybill = true;
      }
      console.log('mark is', mark);
      mark.truck = this.getAllTruckInfo(mark);
      // 找到车辆的点，并将车辆运单号更新为点击的运单号以及链接
      if (from === 'fromWaybill') {
        mark.truck.code = waybill.code;
        mark.truck.waybillNo = waybill.waybillNo;
      }
      mark.show = true;
      // if (from === 'fromWaybill') {
      //   this.waybillData.forEach((val) => {
      //     if(val.truckLicenseNo === mark.handle) {
      //       val.isActive = true;
      //     } else {
      //       val.isActive = false;
      //     }
      //   });
      // }
    },
    openTruckPop(waybill, from) {
      console.log('openTruckPop from waybill ', waybill, from);
      // 先清除全部高亮运单
      this.waybillData.forEach((val) => {
        this.$set(val, 'isActive', false);
      });
      // 激活高亮当前点击运单
      this.$set(waybill, 'isActive', true);
      // 查找百度地图上的车辆点，打开弹窗新信息
      this.markerPoints.forEach((val) => {
        if (waybill.truckLicenseNo === val.handle) {
          this.openMarkerInfoWindow(val, from, waybill);
        }
      });
    },
    closeMarkerInfoWindow(mark) {
      console.log('mark is', mark);
      mark.show = false;
      // 关闭地图弹窗时候，去除右侧运单高亮激活状态
      // this.waybillData.forEach((val) => {
      //   if (mark.handle === val.truckLicenseNo) {
      //     val.isActive = false;
      //   }
      // });
    }
  },
  created() {
    if (this.theme) {
      document.querySelector('body').classList.add('theme-blue');
    }
    this.getLogisticsInfo();
    this.getWaybillList();
    this.getAllWaybillList();
  },
  mounted() {
  }
};

</script>

<style lang="scss" rel="stylesheet/scss">
@import './bizVisual.scss';
</style>