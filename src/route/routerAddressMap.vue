<template>
  <el-dialog title="标记地图位置" class='map-dialog' :visible.sync="dialogVisibleMap" size="large" @open="dialogOpen" @close="dialogClose">
    <div class="page_router_address_map">
      <div class="page_header" v-if='modelLocation.editable || !modelLocation.isEdit'>
        <div class="content">
          <div class="left">
            <el-select disabled v-model="modelLocation.province" placeholder="请选择省" @change="provinceChange">
              <el-option v-for="item in listProvince" :key="item.id" :label="item.value" :value="item.id" name="province">
              </el-option>
            </el-select>
            <el-select disabled v-model="modelLocation.city" placeholder="请选择市" @change="cityChange">
              <el-option v-for="item in listCity" :key="item.id" :label="item.value" :value="item.id" name="province">
              </el-option>
              </el-option>
            </el-select>
          </div>
          <div class="middle">
            <el-input class="header_input" v-model="modelLocation.address" placeholder="请输入内容"></el-input>
          </div>
          <div class="right">
            <div class="header_btn">
              <el-button @click="search()">搜索</el-button>
              <el-button @click="clearData()">清除</el-button>
            </div>
          </div>
        </div>
      </div>
      <baidu-map class="pop-map" v-bind:class="modelLocation | filterClass()" :auto-viewport="true" :center="center" :zoom="zoom" @ready="handler" :scroll-wheel-zoom='true' @zoomend="zoomend">
        <bm-local-search v-if='mapSearch' @markersset='markersset' @infohtmlset='infohtmlset' @resultshtmlset='resultshtmlset' @searchcomplete='searchcomplete' :panel='false' :keyword="keyword" :auto-viewport="true" :selectFirstResult="true" :location="location" :forceLocal='false'></bm-local-search>
        <bm-marker @click='mapClick' :position="center" :dragging="true" @dragend="dragMarker">
        </bm-marker>
      </baidu-map>
    </div>
    <div slot="footer" class="dialog-footer">
      <div class="page_footer">
        <div class="left">
          <span class="location_current">当前地图位置</span>
          <span v-if='realAddress' class="location_text">{{realAddress}}</span>
          <span v-if='center.lng && center.lat' class="location_lat_lag">{{center.lng}}&nbsp&nbsp&nbsp{{center.lat}}</span>
        </div>
        <div class="right">
          <el-button v-if='modelLocation.editable || !modelLocation.isEdit' type="primary" @click="dialogSubmit">保 存</el-button>
          <el-button @click="dialogClose">取 消</el-button>
        </div>
      </div>
    </div>
    </div>
  </el-dialog>
</template>
<script type="text/ecmascript-6">
import { get as getWaybill } from '../../api/waybillService';
import * as DataSourceService from '../../api/DataSourceService';
import { getPosition } from '../../api/LbsService';
import LbsLib from '../LbsLib';
import BaiduMap from 'vue-baidu-map';
import { showMessageUtil } from '../../api/Utils';


export default {
  props: {
    id: String,
    action: String,
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
          lat: 0,
          lng: 0,
          type: '',
          editable: true,
          isEdit: false,

          address: '', // loadingAddress  unloadingAddress
          realCity: '',
          realAddress: '',
          province: '',
          city: '',

        };
      }
    }
  },
  filters: {
    filterClass(model) {
      if (model.isEdit && !model.editable) {
        return 'pop-map-short';
      } else {
        return '';
      }
    }
  },
  data() {
    return {
      markSetting: {
        hasSet: false, // 是否已经设置过，暂时未 用到
        hasChange: false //是否修改过位置
      },
      listProvince: [],
      listCity: [],
      province: '',
      city: '',

      realAddress: '',
      radius1: 500,
      radius2: 600,
      strokeOpacity1: 1,
      strokeOpacity2: 1,
      location: '',
      // keyword: '北京中关村皇冠假日酒店',
      // 桃林路777号
      keyword: '',
      mapSearch: true,
      zoom: 3,
      center: {
        lng: 0,
        lat: 0
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
      },
      addressObj: {}
    };
  },
  methods: {
    // {pois: Array}  标注添加完成后的回调函数。
    markersset(e) {
      console.log('markersset now', e);
      if(e.length<1){
          this.getPointByAddress(this.location);
      }
    },
    // {container: HTMLElement} 结果列表添加完成后的回调函数。
    resultshtmlset(e) {
      console.log('resultshtmlset now', e);
    },
    // {results: [LocalResult]} 检索完成后的回调函数。如果是多关键字检索，回调函数参数返回一个LocalResult的数组，数组中的结果顺序和检索中多关键字数组中顺序一致
    searchcomplete(e) {
      console.log('searchcomplete now', e);
    },
    mapClick(e) {
      console.log('mapClick now', e);
    },
    dialogClose(e) {
      console.log('dialogClose now', e);
    },
    zoomend(e) {
      console.log('map zoom end now', e);
      this.zoom = e.target.getZoom();
    },
    dragMarker(data) {
      console.log('dragMarker end now', data);
      this.center = data.point;
      this.getLocation(data.point);
      this.markSetting.hasChange = true;
    },
    getLocation(point) {
      const gc = new BMap.Geocoder();
      gc.getLocation(point, (success) => {
        console.log('get location success is ', success);
        this.addressObj = success;
        this.realAddress = success.address;
      });
    },
    initData() {
      // 1.查看是否有 经纬度  有的话直接显示 
      //  ---- 有，  直接显示坐标
      //  -----没有  将 address 带入并查询
      //  2.相关的值带入
      //  ----- 如果有 realAddress 直接带入 
      //  ----- 
      if (this.modelLocation.lat && this.modelLocation.lng) {
        this.center.lat = this.modelLocation.lat;
        this.center.lng = this.modelLocation.lng;
        this.mapSearch = false;
        this.markSetting.hasSet = true; // 服务器已经设置过地址
      }
      if (this.modelLocation.realAddress) {
        this.realAddress = this.modelLocation.realAddress
      }
    },
    // 点击图标之后 获取了 坐标
    // {poi: LocalResultPoi}  标注气泡内容创建后的回调函数。
    infohtmlset(event) {
      console.log('infohtmlset ...', event);
      this.center = event.point;
      this.mapSearch = false;
      // this.realAddress = event.address;
      this.getLocation(event.point);
    },
    handler({ BMap, map }) {
      console.log(BMap, map)
      // this.center.lng = 116.404
      // this.center.lat = 39.915
      this.zoom = 15;
      this.initData();
    },
    // 点击搜索
    search() {
      if (this.modelLocation.address) {
        // this.center = this.modelLocation.address; // TODO 此处需要加上 city
        this.mapSearch = true;
        this.keyword = this.modelLocation.address;
        this.markSetting.hasChange = true;
      }
    },
    // 清除数据
    clearData() {
      this.modelLocation.address = '';
    },
    mapReady({ map }) {
      this.map = map;
      this.initData();
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
      model.lat = this.center.lat;
      model.lng = this.center.lng;
      model.realAddress = this.realAddress;
      model.type = this.modelLocation.type;
      //检查
      if (!model.lat || !model.lng || !model.realAddress || !model.type) {
        showMessageUtil('warning', `请选择位置`, 2000);
        return;
      }
      // 1.如果之前已经设置过，&& 没有改变过，不检验
      // 2.只要 有改变 就检查 addressObj 的两个值（主要是为了避免没有选择到精确的位置）
      if (this.markSetting.hasChange) { //只要有改变 需要检查

        // let obj = this.addressObj.addressComponents;
        // if (!obj || !obj.street || !obj.streetNumber) {
        //   showMessageUtil('warning', `请选择正确的详细地址`, 2000);
        //   return;
        // }
        this.$emit('dialogSubmit', model);
        // this.$emit('syncAddress', this.addressObj, model.type);
      } else {
        this.dialogClose(); // 什么都没有改，相当于点击取消
      }
    },
    showDialog(code) {},
    indexOf(value, array) {
      for (let i = 0, j = array.length; i < j; i += 1) {
        if (array[i].id === value) {
          return i;
        }
      }
      return -1;
    },
    cityChange(item) {
      const index = self.indexOf(item, self.listCity);
      if (index < 0) {
        self.modelLocation.city = '';
      } else {
        this.location = self.listCity[index].value;
      }
    },
    provinceChange(item) {
      let self = this;
      DataSourceService.city.getData({ keyword: item }, (dataSource) => {
        self.listCity = dataSource;
        const index = self.indexOf(self.modelLocation.city, self.listCity);
        if (index < 0) {
          self.modelLocation.city = '';
        } else {
          self.modelLocation.city = self.listCity[index].id;
          // self.city = self.listCity[index].value; // TODO
          this.location = self.listCity[index].value;
        }
      });
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
          self.center = point;
        }
      },city);
    },
  },
  mounted() {
    if (!this.modelLocation.lat && !this.modelLocation.lng) {
      this.search();
    }
  },
  created() {
    this.initData();
    let self = this;
    DataSourceService.province.getData('', (dataSource) => {
      self.listProvince = dataSource;
      if (self.modelLocation.province) {
        self.provinceChange(self.modelLocation.province);
      }
    });
  }
};

</script>
<style lang="scss" rel="stylesheet/scss">
@import "../assets/sass/rl-table.scss";

.page_router_address_map {
  .page_header {
    .content {
      overflow: hidden;
      margin: 0;
      padding: 0;
      padding-top: 5px;
      padding-bottom: 5px;
      background: #efefef;
      padding-left: 5px;
      margin-bottom: 5px;
    }

    .left {
      float: left;
      width: 250px;
    }

    .right {
      float: right;
      width: 200px;

    }

    .middle {
      width: calc(100% - 450px);
      float: left;
    }
  }
}


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
    height: 44px;
    background: #efefef;

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
      font-size: 16px;
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
