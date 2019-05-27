/**
* list.vue
* 抢单报价记录列表
*/
<template>
  <div>
    <ele-list :selectable="selectable" :operatable="operatable"
              :showImportButton="false" :showDownloadTemplate="false" :showExportButton="false"
              @query="query" @ready="query" @action="action" @more="more"
              :autoRefresh="false" :autoRefreshTimer="30"
              :total="total" :loading="loading"
              :list-data="listData"
              ref="eleList"
              :customColumn="customColumn"
              :params="params"
              :needPage="needPage"
              :isAdvanced="isAdvanced"
              :editUrl="editUrl"
              :getColumn="getColumn"
              :getList="getList"
              :getSearch="getSearch">
              <template slot="funArea">
                <el-button @click="batchPlaceOrder">批量下单</el-button>
                <el-button @click="batchIgnore">批量忽略</el-button>
              </template>
    </ele-list>
    <!-- 下单弹窗 -->
    <el-dialog title="下单提示" :visible.sync="dialogVisible" size="large">
      <div class="place-order">
        <p class="tips">确定给以下承运方下单吗？</p>
        <p class="grey">请输入计划分配给该承运方的订单量：</p>
        <div class="item-list" id="itemList" ref="tableWrap">
          <table class="rl-fix-table table-bordered">
            <thead>
              <tr>
                <th class="fix-hd" :style="{top: `${topDistance}px`}">承运方</th>
                <th class="fix-hd" :style="{top: `${topDistance}px`}">承运方运价</th>
                <th class="fix-hd" :style="{top: `${topDistance}px`}">分配重量</th>
                <th class="fix-hd" :style="{top: `${topDistance}px`}">分配体积</th>
                <th class="fix-hd" :style="{top: `${topDistance}px`}">分配数量</th>
                <th class="fix-hd" :style="{top: `${topDistance}px`}">分配车次</th>
                <th class="fix-hd" :style="{top: `${topDistance}px`}">请求重量</th>
                <th class="fix-hd" :style="{top: `${topDistance}px`}">请求体积</th>
                <th class="fix-hd" :style="{top: `${topDistance}px`}">请求数量</th>
                <th class="fix-hd" :style="{top: `${topDistance}px`}">请求车次</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in items" :key="item.code">
                <td>
                  {{ item.ownerOrgName }}
                </td>
                <td>
                  {{ item.quotePrice }} {{ item.quotePriceUnitCodeText }}
                </td>
                <td>
                  <div class="pr">
                    <input type="text" class="txt-box" v-model="item.goodsWeight">
                    <span class="unit-text">吨</span>
                  </div>
                </td>
                <td>
                  <div class="pr">
                    <input type="text" class="txt-box" v-model="item.goodsVolume">
                    <span class="unit-text">方</span>
                  </div>
                </td>
                <td>
                  <div class="pr">
                    <input type="text" class="txt-box" v-model="item.goodsNum">
                    <span class="unit-text">件</span>
                  </div>
                </td>
                <td>
                  <div class="pr">
                    <input type="text" class="txt-box" v-model="item.truckQty">
                    <span class="unit-text">车</span>
                  </div>
                </td>
                <td>{{ item.requestGoodsWeight }}吨</td>
                <td>{{ item.requestGoodsVolume }}方</td>
                <td>{{ item.requestGoodsNum }}件</td>
                <td>{{ item.requestTruckQty }}车</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmSubmit" :disabled="btnDisabled">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  import eleList from '../../components/ele-list/eleList.vue';
  import { urlRedirect } from '../../../api/Utils';
  import { getQuoteColumn, quoteList, getQuoteSearch, ignore } from '../../../api/InquiryService';
  import { add } from '../../../api/OutsourcingLogisticsService';
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
        'default': function () {
          return {};
        }
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
          weight: 0,
          volume: 0,
          number: 0,
          quantity: 0
        },
        topDistance: 0
      };
    },
    methods: {
      openWindow(url, title) {
        urlRedirect(url, title);
      },
      more(model) {
//        console.log('more', `${this.listUrl}?objectName=${this.objectName}&${this.toParameterArray(model).join('&')}`);
        this.openWindow(`${this.listUrl}?objectName=${this.objectName}&${this.toParameterArray(model).join('&')}`, `${this.objectName}列表`);
      },
      handleScroll() {
        console.log('scrollTop begins');
        if (this.$refs.tableWrap) {
          this.topDistance = this.$refs.tableWrap.scrollTop;
        }
      },
      placeOrder() {
        this.dialogVisible = true;
      },
      batchPlaceOrder() {
        let ckNum = 0;
        this.items = [];
        this.listData.forEach((val) => {
          // 已勾选并且下单状态为待下单
          if (val.checked && val.quoteStatus === 'pend') {
            ckNum ++;
            this.$set(val, 'quotePriceUnitCodeText', this.getUnitText(val.quotePriceUnitCode));
            this.items.push(val);
          }
        });
        if (ckNum === 0) {
          this.$message({
            type: 'warning',
            message: '请至少选择一条需要批量下单，且下单状态为“待下单”的记录！',
            duration: 3000
          });
          return false;
        } else {
          this.dialogVisible = true;
        }
      },
      batchIgnore(model) {
        let ckNum = 0, sucNum = 0, errNum = 0;
        const ignoreCodes = [];
        // 单个忽略
        if (model.code) {
          ckNum ++;
          ignoreCodes.push(model.code);
        } else {
          // 批量忽略
          this.listData.forEach((val) => {
            // 已勾选并且下单状态为待下单
            if (val.checked && val.quoteStatus === 'pend') {
              ckNum ++;
              ignoreCodes.push(val.code);
            }
          });
        }
        if (ckNum === 0) {
          this.$message({
            type: 'warning',
            message: '请至少选择一条需要批量忽略，且下单状态为“待下单”的记录！',
            duration: 3000
          });
          return false;
        } else {
          const self = this,
            msg = ckNum > 1 ? `确认要忽略${ckNum}条报价吗？` : `确认要忽略该条报价吗？`;
          this.$msgbox({
            title: '确认',
            message: `${msg}`,
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            beforeClose: (action, instance, done) => {
              if (action === 'confirm') {
                instance.confirmButtonLoading = true;
                instance.confirmButtonText = '执行中...';
                ignoreCodes.forEach((val) => {
                  ignore({ code: val }, (success, error) => {
                    if (error || success.code !== 200) {
                      errNum ++;
                    }
                    if (success) {
                      sucNum ++;
                    }
                    if (errNum + sucNum === ckNum) {
                      this.$message({
                        type: 'success',
                        message: `批量忽略${ckNum}条，成功${sucNum}条，失败${errNum}条！`,
                        duration: 3000
                      });
                      done();
                      instance.confirmButtonLoading = false;
                    }
                  });
                });
              } else {
                done();
              }
            }
          }).then(() => {
            self.$refs.eleList.dispatchQueryEvent();
          });
        }
      },
      confirmSubmit() {
        console.log('弹窗提交数据为', this.items);
        const totalNum = this.items.length;
        let sucNum = 0, errNum = 0;
        this.items.forEach((val) => {
          const params = {
            // 询价单信息
            goodsName: this.inquiryInfo.goodsName,
            cargoTypeClassificationCode: this.inquiryInfo.cargoTypeClassificationCode,
            businessTypeCode: this.inquiryInfo.businessTypeCode,
            goodsPrice: this.inquiryInfo.goodsPrice,
            goodsPriceUnitCode: this.inquiryInfo.goodsPriceUnitCode,
            loadingProvinceCode: this.inquiryInfo.loadingProvinceCode,
            loadingCityCode: this.inquiryInfo.loadingCityCode,
            loadingCountyCode: this.inquiryInfo.loadingCountyCode,
            loadingAddress: this.inquiryInfo.loadingAddress,
            loadingOrgName: this.inquiryInfo.loadingOrgName,
            loadingUserFullName: this.inquiryInfo.loadingUserFullName,
            loadingUserPhone: this.inquiryInfo.loadingUserPhone,
            unloadingProvinceCode: this.inquiryInfo.unloadingProvinceCode,
            unloadingCityCode: this.inquiryInfo.unloadingCityCode,
            unloadingCountyCode: this.inquiryInfo.unloadingCountyCode,
            unloadingAddress: this.inquiryInfo.unloadingAddress,
            unloadingOrgName: this.inquiryInfo.unloadingOrgName,
            unloadingUserFullName: this.inquiryInfo.unloadingUserFullName,
            unloadingUserPhone: this.inquiryInfo.unloadingUserPhone,
            routeCode: this.inquiryInfo.routeCode,
            routeName: this.inquiryInfo.routeName,
            meterageType: this.inquiryInfo.meterageType,
            goodsLoss: this.inquiryInfo.goodsLoss,
            goodsLossMethod: this.inquiryInfo.goodsLossMethod,
            goodsLossUnitCode: this.inquiryInfo.goodsLossUnitCode,
            settleMethod: this.inquiryInfo.settleMethod,
            // 报价单信息
            rfqCode: val.rfqCode,
            rfqNo: val.rfqNo,
            quoteCode: val.code,
            quoteNo: val.quoteNo,
            parentLogisticsCode: val.parentLogisticsCode,
            parentLogisticsNo: val.parentLogisticsNo,
            platformClientOrgCode: val.platformClientOrgCode,
            clientOrgCode: val.clientOrgCode,
            clientOrgName: val.clientOrgName,
            goodsNum: val.goodsNum,
            goodsNumUnitCode: 'item',
            goodsWeight: val.goodsWeight,
            goodsWeightUnitCode: 'ton',
            goodsVolume: val.goodsVolume,
            goodsVolumeUnitCode: 'cube',
            truckQty: val.truckQty,
            platformCarrierOrgCode: val.ownerOrgCode,
            carrierOrgCode: val.ownerOrgCode,
            carrierOrgName: val.ownerOrgName,
            clientFreightPrice: val.quotePrice,
            clientFreightPriceUnitCode: val.quotePriceUnitCode,
            logisticsStatus: 'pend'
          };
          add(params, (success, error) => {
            if (error || success.code !== 200) {
              errNum ++;
            }
            if (success) {
              sucNum ++;
            }
            if (errNum + sucNum === totalNum) {
              this.$message({
                type: 'success',
                message: `批量下单${totalNum}条，成功${sucNum}条，失败${errNum}条！`,
                duration: 3000
              });
              this.dialogVisible = false;
              setTimeout(() => {
                window.location.reload();
              }, 3000);
            }
          });
        });
      },
      toParameterArray(model) {
        const params = [];
        Object.keys(model).forEach((key) => {
          params.push(`${key}=${encodeURIComponent(model[key])}`);
        });
        return params;
      },
      getUnitText(code) {
        switch(code) {
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
          case 'placeOrder':
            this.items = [];
            this.$set(model, 'quotePriceUnitCodeText', this.getUnitText(model.quotePriceUnitCode));
            this.items.push(model);
            this.placeOrder();
            break;
          case 'ignore':
            this.batchIgnore(model);
            break;
          case 'view':
            this.openWindow(`${this.outsourcingLogisticsUrl}?code=${model.logisticsCode}&editable=false`, `外包订单详情`);
            break;
          default:
            break;
        }
      },
      query(searchParams) {
        console.log('searchParams', searchParams);
        Object.assign(searchParams, this.params);
        console.log('query', searchParams);
        const self = this;
        this.total = 0;
        this.loading = true;
        self.listData = [];
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
            success.content.forEach((data) => {
              data.platformOwnerOrgCode = data.ownerOrgCode; // 承运方平台级编码等于承运方编码
              const actionList = [];
              // actionList.push({ key: 'edit', name: '编辑' });
              // 待下单状态
              if (data.quoteStatus === 'pend') {
                actionList.push({ key: 'placeOrder', name: '下单' });
                actionList.push({ key: 'ignore', name: '忽略' });
              }
              // 承运方已接单
              if (data.quoteStatus === 'carrierReceived') {
                actionList.push({ key: 'view', name: '查看外包订单' });

                // 计算承运方已接单状态的，分配重量，分配体积，分配数量，分配车次
                this.acceptObj.weight += Number(data.goodsWeight) || 0;
                this.acceptObj.volume += Number(data.goodsVolume) || 0;
                this.acceptObj.number += Number(data.goodsNum) || 0;
                this.acceptObj.quantity += Number(data.truckQty) || 0;
              }
              data.actionMenuList = actionList;

            });
            this.$emit('surplus', this.acceptObj);
            self.listData = success.content;
            this.loading = false;
            console.log('acceptObj is', self.acceptObj);
            console.log('parent.listData', self.listData);
          }
        });
      }
    },
    mounted() {
      window.addEventListener('scroll', this.handleScroll, true);
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
.place-order {
  .tips {
    padding: 20px;
    text-align: center;
    font-size: 16px;
  }
  .item-list {
    margin-top: 10px;
    min-height: 200px;
    max-height: 200px;
    overflow: auto;
    .fix-hd {
      line-height: 22px;
    }
  }
  .pr {
    position: relative;
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

