/**
* trustDeed.vue
* 打印委托单
* Created by cc on 18/12/3.
*/
<template>
  <div class="print-doc print-trust-deed">
    <div class="logo">
      <img src="./logo-medium.png" alt="">
    </div>
      <span class="print-now no-print" @click="print" title="点击打印">点击打印</span>
      <h1 class="print-tit">{{ logisticsInfo.carrierOrgFullName }}</h1>
      <h2 class="print-tit">委托运输委托单</h2>
      <table class="nb-table">
        <tr>
          <th width="150">委托日期</th>
          <td width="400">{{ logisticsInfo.createTimeText }}</td>
          <th width="150">委托单编号</th>
          <td>{{ logisticsInfo.logisticsNo }}</td>
        </tr>
        <tr>
          <th>委托单位</th>
          <td>{{ logisticsInfo.clientOrgFullName }}</td>
          <th>承运单位</th>
          <td>{{ logisticsInfo.carrierOrgFullName }}</td>
        </tr>
        <tr>
          <th>委托总重量</th>
          <td>{{ logisticsInfo.goodsWeight }} 吨</td>
          <th>需求车次</th>
          <td>{{ logisticsInfo.truckQty }} 车</td>
        </tr>
        <tr>
          <th>委托运费单价</th>
          <td colspan="3">{{ logisticsInfo.clientFreightPrice }} {{ logisticsInfo.clientFreightPriceUnitText }}</td>
        </tr>
      </table>
      <table class="print-table bg-th">
        <tr>
          <th width="150">收货单位</th>
          <td width="400">{{ logisticsInfo.unloadingOrgName }}</td>
          <th width="150">收货人</th>
          <td>{{ logisticsInfo.unloadingUserFullName }}</td>
        </tr>
        <tr>
          <th>收货地址</th>
          <td>{{ logisticsInfo.unloadingFullAddress }}</td>
          <th>联系电话</th>
          <td>{{ logisticsInfo.unloadingUserPhone }}</td>
        </tr>
        <tr>
          <th>发货地址</th>
          <td>{{ logisticsInfo.loadingFullAddress }}</td>
          <th>运输方式</th>
          <td>{{ logisticsInfo.businessTypeText }}</td>
        </tr>
      </table>
      <table class="print-table">
        <thead>
          <tr>
            <th>序号</th>
            <th>商品名称</th>
            <th>材质</th>
            <th>规格</th>
            <th>单位</th>
            <th>数量</th>
            <th>重量</th>
            <th>货物单价</th>
          </tr>
        </thead>
        <tbody>
<!--           <tr>
            <td>1</td>
            <td>{{ logisticsInfo.goodsName }}</td>
            <td></td>
            <td></td>
            <td>{{ logisticsInfo.meterageTypeText }}</td>
            <td></td>
            <td></td>
            <td>{{ logisticsInfo.goodsPrice }} {{ logisticsInfo.goodsPriceUnitText }}</td>
          </tr> -->

          <tr v-for='(item,index) in listDataManifest'>
            <td>{{index+1}}</td>
            <td>{{ item.goodsName }}</td>
            <td></td>
            <td></td>
            <td>{{ item.meterageTypeText }}</td>
            <td>{{ item.goodsNumText }}</td>
            <td>{{ item.goodsWeightText }}</td>
            <td>{{ item.goodsPriceUnitText }}</td>
          </tr>


          <tr>
            <td>备注</td>
            <td colspan="7"></td>
          </tr>
        </tbody>
      </table>
      <div class="footer">
        <p class="cprt">
          <span>制单人<strong>{{ logisticsInfo.carrierOrgFullName }}</strong></span>
          <span>委托单位盖章</span>
          <span>承运单位盖章</span>
        </p>
        <p class="tc">最终结算运费以实际完成量为准，计划运输时间与实际运输时间有偏差以实际运输时间为准</p>
      </div>
    </div>
</template>
<script type="text/ecmascript-6">
import { getParamsFromURL,showMessageUtil } from '../../api/Utils';
import { get } from '../../api/LogisticsService';
import { getManifestList } from '../../api/LogisticsService';
import { get as getOrgInfo } from '../../api/OrgManagementService';
import { province, city, county } from '../../api/DataSourceService';

export default {
  name: 'trustDeed',
  components: {},
  props: {},
  data() {
    return {
      logisticsCode: getParamsFromURL(window.location.search).logisticsCode,
      logisticsInfo: {},
      listDataManifest: []
    };
  },
  methods: {
    netGetManifestList(logisticsCode) {
      let self = this;
      getManifestList({ code: logisticsCode }, (success, error) => {
        if (success && success.content) {
          this.listDataManifest = success.content;
          // 单位 goodsPriceUnitText  数量  重量 货物单价 goodsPriceUnitText
          this.listDataManifest.forEach(data => {

            const meterageTypeText = this.getUnitText(data.meterageType) || '';
            self.$set(data, 'meterageTypeText', meterageTypeText);

            const goodsPriceUnitText = `${data.goodsPrice} ${this.getUnitText(data.goodsPriceUnitCode)}` || '';
            self.$set(data, 'goodsPriceUnitText', goodsPriceUnitText);

            const goodsNumText = `${data.goodsNum ? data.goodsNum : '' }件`;
            self.$set(data, 'goodsNumText', goodsNumText);

            const goodsWeightText = `${data.goodsWeight ? data.goodsWeight : ''}吨`;
            self.$set(data, 'goodsWeightText', goodsWeightText);
          })
        }
        if (error) { showMessageUtil('warning', error.content, 2000) };
      })
    },
    print() {
      window.print();
    },
    getTimeText(time) {
      const tm = new Date(time);
      let text = '';
      text = tm.getFullYear() + '年' + (tm.getMonth() + 1) + '月' + tm.getDate() + '日';
      return text;
    },
    getUnitText(code) {
      switch (code) {
        case 'ton':
          return '吨';
        case 'cube':
          return '方';
        case 'item':
          return '件';
        case 'yuanperton':
          return '元/吨';
        case 'yuanpercube':
          return '元/方';
        case 'yuanperitem':
          return '元/件';
        case 'yuanpertruck':
          return '元/车';
        case '1002996':
          return '干线普货运输';
        case '1003997':
          return '城市配送';
        case '1003998':
          return '农村配送';
        case '1002998':
          return '集装箱运输';
        case '1003999':
          return '其他';
        default:
          return '';
      }
    },
    getAddressText(provinceCode, cityCode, countyCode, address) {
      let text = '';
      province.getData({}, (success) => {
        console.log('province is ', success);
        success.forEach((val) => {
          if (val.id === provinceCode) {
            text += val.name;
          }
        });
      });
      city.getData({ keyword: provinceCode }, (success) => {
        console.log('city is ', success);
        success.forEach((val) => {
          if (val.id === cityCode) {
            text += val.name;
          }
        });
      });
      county.getData({ keyword: cityCode }, (success) => {
        console.log('county is ', success);
        success.forEach((val) => {
          if (val.id === countyCode) {
            text += val.name;
          }
        });
      });
      console.log('getAddressText is', text);
      text += address;
      return text;
    },
    getOrgFullName(orgCode, field) {
      getOrgInfo({ code: orgCode }, (success, error) => {
        if (success) {
          const data = success.content;
          this.$set(this.logisticsInfo, field, data['orgFullName']);
        }
      });
    }
  },
  created() {
    this.netGetManifestList(this.logisticsCode);
    get({ code: this.logisticsCode }, (success, error) => {
      if (success) {
        const data = success.content;
        console.log('get user info is', data);
        this.logisticsInfo = data;
        // 承运方
        this.getOrgFullName(data.platformCarrierOrgCode, 'carrierOrgFullName');
        // 委托方
        this.getOrgFullName(data.platformClientOrgCode, 'clientOrgFullName');
        // 委托日期
        this.logisticsInfo.createTimeText = this.getTimeText(data.createTime);
        // 发货详细地址
        this.logisticsInfo.loadingFullAddress = this.getAddressText(data.loadingProvinceCode, data.loadingCityCode, data.loadingCountyCode, data.loadingAddress);
        // 收货详细地址
        this.logisticsInfo.unloadingFullAddress = this.getAddressText(data.unloadingProvinceCode, data.unloadingCityCode, data.unloadingCountyCode, data.unloadingAddress);
        // 运输方式
        this.logisticsInfo.businessTypeText = this.getUnitText(data.businessTypeCode);
        // 单位
        this.logisticsInfo.meterageTypeText = this.getUnitText(data.meterageType);
        // 货物单价单位
        this.logisticsInfo.goodsPriceUnitText = this.getUnitText(data.goodsPriceUnitCode);
        // 委托运费单价单位
        this.logisticsInfo.clientFreightPriceUnitText = this.getUnitText(data.clientFreightPriceUnitCode);
      }
    });
  },
  mounted() {}
};

</script>
<style lang="scss" rel="stylesheet/scss">
@import './print.scss';

</style>
