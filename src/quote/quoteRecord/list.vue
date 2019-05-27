/** * list.vue * 抢单报价记录列表 */
<template>
  <div>
    <ele-list :selectable="selectable" :operatable="operatable" :showImportButton="false" :showDownloadTemplate="false" :showExportButton="false" @query="query" @ready="query" @action="action" @more="more" :autoRefresh="false" :autoRefreshTimer="30" :total="total" :loading="loading" :list-data="listData" ref="eleList" :customColumn="customColumn" :params="params" :needPage="needPage" :isAdvanced="isAdvanced" :editUrl="editUrl" :getColumn="getColumn" :getList="getList" :getSearch="getSearch">
      <template slot="funArea">
        <!-- 
        <el-button @click="batchPlaceOrder">批量下单</el-button>
        <el-button @click="batchIgnore">批量忽略</el-button> -->
        <el-button @click="batchCancelMulti">批量取消</el-button>
      </template>
    </ele-list>
    <!-- 下单弹窗 -->
    <el-dialog title="抢单报价提示" :visible.sync="dialogVisible" size="large">
      <div class="place-order">
        <p class="tips">确定抢单报价吗？</p>
        <p class="grey">请确认您的报价：</p>
        <div v-if='domainObject' class="header-order clearfix">
          <div class="fl">
            <span>报价类型：{{domainObject.quoteType == 'quote' ? '承运方报价' : '一口价'}}</span>
          </div>
          <div class="fr">
            <span class="request">承运方运价：</span>
            <template v-if="domainObject.quoteType == 'quote'">
              <input type="text" class="txt-box mini-input" v-model="domainObject.quotePrice">
              <span>{{ quotePriceUnitCodeCmp}}</span>
            </template>
            <template v-else>
              <span>{{domainObject.quotePrice}}</span>
              <span>{{ quotePriceUnitCodeCmp}}</span>
            </template>
          </div>
        </div>
        <div class="item-list">
          <table class="rl-fix-table table-bordered">
            <thead>
              <tr>
                <th>请求重量</th>
                <th>请求体积</th>
                <th>请求数量</th>
                <th>请求车次</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div class="pr">
                    <input type="text" class="txt-box" v-model="acceptObj.weight">
                    <span class="unit-text">吨</span>
                  </div>
                </td>
                <td>
                  <div class="pr">
                    <input type="text" class="txt-box" v-model="acceptObj.volume">
                    <span class="unit-text">方</span>
                  </div>
                </td>
                <td>
                  <div class="pr">
                    <input type="text" class="txt-box" v-model="acceptObj.number">
                    <span class="unit-text">件</span>
                  </div>
                </td>
                <td>
                  <div class="pr">
                    <input type="text" class="txt-box" v-model="acceptObj.quantity">
                    <span class="unit-text">车</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <!-- 显示 -->
          <table class="rl-fix-table table-bordered down_table">
            <thead>
              <tr>
                <th>计划重量剩余</th>
                <th>计划体积剩余</th>
                <th>计划数量剩余</th>
                <th>需求车次剩余</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div class="pr">
                    <span>{{domainObject.remainderGoodsNum ? domainObject.remainderGoodsWeight : 0 }}</span>
                  </div>
                </td>
                <td>
                  <div class="pr">
                    <span>{{domainObject.remainderGoodsNum ? domainObject.remainderGoodsVolume : 0 }}</span>
                  </div>
                </td>
                <td>
                  <div class="pr">
                    <span>{{domainObject.remainderGoodsNum ? domainObject.remainderGoodsNum : 0 }}</span>
                  </div>
                </td>
                <td>
                  <div class="pr">
                    <span>{{domainObject.remainderGoodsNum ? domainObject.remainderTruckQty : 0 }}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <p class="grey p-bottom">注：以上分配重量、分配体积、分配数量和分配车次仅供客户参考，实际以客户分配为准。</p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmSubmit" :disabled="btnDisabled">确定</el-button>
      </span>
    </el-dialog>
    <!-- 取消的弹窗 -->
    <el-dialog title="取消" :visible.sync="dialogVisibleCancel" size="large">
      <div class="place-order">
        <p class="tips">{{cancelText}}</p>
        <p class="tips">取消后，如果需要重新抢单或报价，请再次点击“立即报价”按钮。</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="clearCancelData">取消</el-button>
        <el-button type="primary" @click="confirmSubmitCancel" :disabled="btnDisabled">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script type="text/ecmascript-6">
import eleList from '../../components/ele-list/eleList.vue';
import { urlRedirect, getParamsFromURL } from '../../../api/Utils';
import { getQuoteColumn, getQuoteSearch, ignore } from '../../../api/InquiryService';
import { cancel, add, quoteListMy as quoteList } from '../../../api/QuoteService';
import * as ApiConst from '../../../api/ApiConst';

export default {
  name: 'quoteList',
  components: {
    'ele-list': eleList
  },
  props: {
    inquiryInfo: Object,
    selectable: {
      type: Boolean,
      'default': true
    },
    operatable: {
      type: Boolean,
      'default': true
    },
    customColumn: Array,
    isAdvanced: {
      type: Boolean,
      'default': true
    },
    needPage: {
      type: Boolean,
      'default': true
    },
    params: {
      type: Object,
      'default': function() {
        return {};
      }
    },
    domainObject: {
      type: Object,
      'default': function() {
        return null;
      }
    },
  },
  computed: {
    cancelText() {
      if (this.cancelNum == 1) {
        return '确定取消该抢单或报价吗？';
      }
      if (this.cancelNum > 1) {
        return `共选中${this.cancelNum}条，确定取消该抢单或报价吗？`;
      }
      return '';
    },
    quotePriceUnitCodeCmp() {
      let domainObject = this.domainObject;
      let val = '';
      if (domainObject && domainObject.quotePriceUnitCode) {
        if (domainObject.quotePriceUnitCode == 'yuanperton') {
          val = '元/吨';
        }
        if (domainObject.quotePriceUnitCode == 'yuanperitem') {
          val = '元/件';
        }
        if (domainObject.quotePriceUnitCode == 'yuanpercube') {
          val = '元/方';
        }
        if (domainObject.quotePriceUnitCode == 'yuanpertruck') {
          val = '元/车';
        }


      }
      return val;
    }
  },
  data: () => {
    return {
      listData: [],
      total: 0,
      loading: true,
      getColumn: getQuoteColumn,
      getList: quoteList,
      getSearch: getQuoteSearch,
      objectName: '抢单报价记录',
      addUrl: '/inquiry/add.html',
      editUrl: '/inquiry/add.html',
      listUrl: '/inquiry/list.html',
      outsourcingLogisticsUrl: '/outsourcingLogistics/add.html',
      dialogVisible: false,
      btnDisabled: false,
      items: [],
      acceptObj: {
        weight: '',
        volume: '',
        number: '',
        quantity: ''
      },
      modelAcceptObj: {
        weight: 0,
        volume: 0,
        number: 0,
        quantity: 0
      },

      logisticsUrl: '/logistics/add.html',
      cancelNum: 0,
      modelCancel: null,
      cancelCodes: [],
      dialogVisibleCancel: false
    };
  },
  methods: {
    batchCancelMulti() {
      if (this.checkoutMultiCancel()) {
        this.dialogVisibleCancel = true;
      }
    },
    // 取消
    clearCancelData() {
      this.cancelNum = 0;
      this.modelCancel = 0;
      this.dialogVisibleCancel = false;
    },
    openWindow(url, title) {
      urlRedirect(url, title);
    },
    more(model) {
      this.openWindow(`${this.listUrl}?objectName=${this.objectName}&${this.toParameterArray(model).join('&')}`, `${this.objectName}列表`);
    },
    placeOrder() {
      this.dialogVisible = true;
    },
    batchCancel(model) {
      let ckNum = 0,
        sucNum = 0,
        errNum = 0;
      let cancelCodes = [];
      // 单个取消
      if (model && model.code) {
        ckNum++;
        cancelCodes.push(model.code);
      } else {
        // 批量取消
        cancelCodes = this.cancelCodes;
        ckNum = cancelCodes.length;
      }
      this.dialogVisibleCancel = false;
      cancelCodes.forEach((val) => {
        cancel({ code: val }, (success, error) => {
          if (error || success.code !== 200) {
            errNum++;
          }
          if (success) {
            sucNum++;
          }
          if (errNum + sucNum === ckNum) {
            this.dialogVisibleCancel = true;
            let msg = '';
            if (model) {
              msg = sucNum == 1 ? '取消成功' : '取消失败';
            } else {
              msg = `批量取消${ckNum}条，成功${sucNum}条，失败${errNum}条！`;
            }
            this.$message({
              type: 'success',
              message: msg,
              duration: 3000
            });
            setTimeout(() => {
              window.location.reload();
            }, 3000)
          }
        });
      });
    },
    confirmSubmit() {
      console.log('弹窗提交数据为', this.items);
      const totalNum = this.items.length;
      let sucNum = 0,
        errNum = 0;

      // let objPar = JSON.parse(JSON.stringify(this.domainObject));
      // objPar.requestGoodsWeight = this.acceptObj.weight;
      // objPar.requestGoodsVolume = this.acceptObj.volume;
      // objPar.requestGoodsNum = this.acceptObj.number;
      // objPar.requestTruckQty = this.acceptObj.quantity;
      // objPar.parentLogisticsCode = this.domainObject.logisticsCode;
      // objPar.parentLogisticsNo = this.domainObject.logisticsNo;

      // objPar.rfqCode = this.domainObject.code;

      // delete objPar.code;
      // delete objPar.quoteNo;
      // delete objPar.id;
      // delete objPar.logisticsCode;
      // delete objPar.logisticsNo;

      // delete objPar.goodsWeight;
      // delete objPar.goodsVolume;
      // delete objPar.truckQty;
      // delete objPar.goodsNum;


      let objPar = {};
      objPar.requestGoodsWeight = this.acceptObj.weight;
      objPar.requestGoodsVolume = this.acceptObj.volume;
      objPar.requestGoodsNum = this.acceptObj.number;
      objPar.requestTruckQty = this.acceptObj.quantity;



      objPar.rfqCode = this.domainObject.code;
      objPar.rfqNo = this.domainObject.rfqNo;
      objPar.parentLogisticsCode = this.domainObject.logisticsCode;
      objPar.parentLogisticsNo = this.domainObject.logisticsNo;


      objPar.platformClientOrgCode = this.domainObject.platformClientOrgCode;
      objPar.settleMethod = this.domainObject.settleMethod;
      objPar.businessTypeCode = this.domainObject.businessTypeCode;
      objPar.cargoTypeClassificationCode = this.domainObject.cargoTypeClassificationCode;
      objPar.goodsName = this.domainObject.goodsName;
      objPar.goodsPrice = this.domainObject.goodsPrice;
      objPar.goodsPriceUnitCode = this.domainObject.goodsPriceUnitCode;
      objPar.meterageType = this.domainObject.meterageType;
      objPar.goodsLoss = this.domainObject.goodsLoss;
      objPar.goodsLossMethod = this.domainObject.goodsLossMethod;
      objPar.goodsLossUnitCode = this.domainObject.goodsLossUnitCode;
      objPar.quotePrice = this.domainObject.quotePrice;
      objPar.quoteType = this.domainObject.quoteType;
      objPar.quotePriceUnitCode = this.domainObject.quotePriceUnitCode;
      objPar.routeCode = this.domainObject.routeCode;
      objPar.routeName = this.domainObject.routeName;
      objPar.loadingProvinceCode = this.domainObject.loadingProvinceCode;
      objPar.loadingCityCode = this.domainObject.loadingCityCode;
      objPar.loadingCountyCode = this.domainObject.loadingCountyCode;
      objPar.loadingAddress = this.domainObject.loadingAddress;
      objPar.loadingOrgName = this.domainObject.loadingOrgName;
      objPar.loadingUserFullName = this.domainObject.loadingUserFullName;
      objPar.loadingUserPhone = this.domainObject.loadingUserPhone;
      objPar.unloadingProvinceCode = this.domainObject.unloadingProvinceCode;

      objPar.clientOrgCode = this.domainObject.clientOrgCode;
      objPar.clientOrgName = this.domainObject.clientOrgName;


      objPar.unloadingCityCode = this.domainObject.unloadingCityCode;
      objPar.unloadingAddress = this.domainObject.unloadingAddress;
      objPar.unloadingOrgName = this.domainObject.unloadingOrgName;
      objPar.unloadingUserFullName = this.domainObject.unloadingUserFullName;
      objPar.unloadingUserPhone = this.domainObject.unloadingUserPhone



      if (!objPar.quotePrice || objPar.quotePrice < 1) {
        this.$message({
          type: 'error',
          message: `请检查承运方价格`,
          duration: 3000
        });
        return;
      }
      add(objPar, (success, error) => {
        if (success) {
          this.$message({
            type: 'success',
            message: `报价成功！`,
            duration: 3000
          });
          this.dialogVisible = false;
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        }
        if (error) {
          this.$message({
            type: 'error',
            message: error.content,
            duration: 3000
          });
        }
      });
      // });
    },
    toParameterArray(model) {
      const params = [];
      Object.keys(model).forEach((key) => {
        params.push(`${key}=${encodeURIComponent(model[key])}`);
      });
      return params;
    },
    getUnitText(code) {
      switch (code) {
        case 'yuanperton':
          return '元/吨';
        case 'yuanpercube':
          return '元/方';
        case 'yuanperitem':
          return '元/件';
        case 'yuanpertruck':
          return '元/车';
        default:
          return '元/吨';
      }
    },
    action(command, menu, model) {
      console.log('action command', command, 'menu', menu, 'model', model);
      switch (command) {
        case 'checkLogistics':
          this.openWindow(`${this.logisticsUrl}?code=${model.logisticsCode}&objectName=${this.objectName}&editable=false`, `订单详情`);
          break;
        case 'cancel':
          // this.batchCancel(model);
          this.dealWithCancel(model);
          break;
        default:
          break;
      }
    },
    confirmSubmitCancel() {
      if (this.modelCancel) { // 单个
        this.batchCancel(this.modelCancel);
      } else {
        // 做个判断 是否 
        if (this.checkoutMultiCancel) { // 多选的
          this.batchCancel();
        }
      }
    },
    // 处理  
    dealWithCancel(model) {
      this.modelCancel = model;
      this.cancelNum = 1;
      this.dialogVisibleCancel = true;
    },
    checkoutMultiCancel() {
      // 勾选 的 中 能取消的
      this.cancelCodes = [];
      let self = this;
      this.listData.forEach((val) => {
        if (val.checked && val.quoteStatus == 'pend') {
          self.cancelCodes.push(val.code);
        }
      });
      if (self.cancelCodes.length < 1) {
        this.$message({
          type: 'warning',
          message: '请至少选择一条需要批量取消，且下单状态为“待下单”的记录！',
          duration: 5000
        });
        return false;
      }
      this.cancelNum = self.cancelCodes.length;
      return true;
    },
    query(searchParams) {
      console.log('searchParams', searchParams);
      Object.assign(searchParams, this.params);
      console.log('query', searchParams);
      const self = this;
      this.total = 0;
      this.loading = true;
      self.listData = [];
      let rfqCode = getParamsFromURL(window.location.search).code;
      searchParams.rfqCode = rfqCode;
      searchParams.size = 100;

      quoteList(searchParams, (success, error) => {
        if (error) {
          this.$message({
            type: 'error',
            message: error.content,
            duration: 5000
          });
        }
        if (success) {
          this.total = success.total;
          this.$emit('eventRecord', this.total);
          success.content.forEach((data) => {
            data.platformOwnerOrgCode = data.ownerOrgCode; // 承运方平台级编码等于承运方编码
            const actionList = [];

            //取消  --- 已下单待承运方接单
            if (data.quoteStatus == 'pend') {
              actionList.push({ key: 'cancel', name: '取消' });
            }
            //查看订单  --- 承运方已接单
            if (data.quoteStatus == 'carrierReceived') {
              actionList.push({ key: 'checkLogistics', name: '查看订单' });
            }
            // 已下单 计算数量
            if (data.quoteStatus === 'carrierReceived') {
              // 计算承运方已接单状态的，分配重量，分配体积，分配数量，分配车次
              this.modelAcceptObj.weight += Number(data.goodsWeight) || 0;
              this.modelAcceptObj.volume += Number(data.goodsVolume) || 0;
              this.modelAcceptObj.number += Number(data.goodsNum) || 0;
              this.modelAcceptObj.quantity += Number(data.truckQty) || 0;
            }
            data.actionMenuList = actionList;
          });
          this.$emit('surplus', this.modelAcceptObj);
          self.listData = success.content;
          this.loading = false;
          console.log('acceptObj is', self.modelAcceptObj);
          console.log('parent.listData', self.listData);
        }
      });
    }
  },
  created() {

  }
};

</script>
<style lang="scss" rel="stylesheet/scss">
.down_table {
  margin-top: 20px !important;
  div {
    text-align: center;
  }
}

.place-order {
  .header-order {
    margin-bottom: 20px;
    margin-top: 20px;

    .fr {
      margin-right: 300px;
      margin-top: 4px;
    }

    .request:before {
      content: "*";
      color: red;
    }
  }

  .p-bottom {
    margin-top: 100px;
  }

  .tips {
    padding: 20px;
    text-align: center;
    font-size: 16px;
  }

  .item-list {
    margin-top: 10px;
    min-height: 200px;
    max-height: 400px;
  }

  .pr {
    position: relative;
  }

  .mini-input {
    width: 100px !important;
  }

  .txt-box {
    width: 90%;
    padding: 0 10px;
    height: 22px;
    line-height: 22px;
    border: solid 1px #dadada;

    &:focus {
      color: #f48400;
      background-color: #fef7f0;
      border: solid 1px #f48400;
      box-shadow: 0 0 3px #ffcb8e;
    }
  }

  .unit-text {
    position: absolute;
    top: 5px;
    right: 10px;
    color: #ccc;
  }
}

</style>
