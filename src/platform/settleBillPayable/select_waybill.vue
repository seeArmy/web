<template xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <div id="list" class="list-page">
    <div class="list-wrap">
      <div class="page-header clearfix">
        <h2 class="page-title fl" v-if="params.billCode != null">编辑应付平台账单-选择运单</h2>
        <h2 class="page-title fl" v-else>创建应付平台账单-选择运单</h2>
        <span class="ml20" v-if="params.billCode != null">账单号：<strong class="ft16">{{ billNo }}</strong></span>
        <span class="ml20">当前选择客户：<strong class="ft16">{{ params.clientOrgName }}</strong></span>
      </div>
      <el-tabs type="border-card" v-model="pickedTab">
        <el-tab-pane label="待选运单" name="unselect">
          <v-unselect-table :params="params" @selected="selected" ref="unselectTable"></v-unselect-table>
        </el-tab-pane>
        <el-tab-pane :label="`已选运单(${selectedNum})`" name="selected">
          <v-selected-table :params="params" @unselect="unselect" ref="selectedTable"></v-selected-table>
        </el-tab-pane>
      </el-tabs>
      <div class="form-button">
        <!--统计数据  -->
        <el-row class="row_st">
          <el-col :span="8">
            <span>应付小计总额：{{statisticalBill.paymentSubtotalAmount}}元</span>
          </el-col>
          <el-col :span="8">
            <span>发货重量合计：{{statisticalBill.totalLoadingWeight}}吨</span>
          </el-col>
          <el-col :span="8">
            <span>收货重量合计：{{statisticalBill.totalUnloadingWeight}}吨</span>
          </el-col>
        </el-row>
        <a class="el-button el-button--primary el-button--large" :href="`/platform/settleBillPayable/create.html?code=${params.billCode}`" v-if="params.billCode != null && selectedNum">开始编辑</a>
        <a class="el-button el-button--primary el-button--large" :href="`/platform/settleBillPayable/create.html?clientOrgCode=${clientOrgCode}&clientOrgName=${params.clientOrgName}&platformClientOrgCode=${platformClientOrgCode}`" v-else-if="params.billCode == null && selectedNum">开始创建</a>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable no-unused-vars */

import { settlePayableTempWaybillCopy, settlePayableTempTableDelete, settlePayableGet, settlePayableSelectSelectedWaybillList, settlePayableClearSelectedWaybill, settlePayableStatisticalBill } from '../../../api/PlatformSettleBillService';
import { getParamsFromURL } from '../../../api/Utils';
import unselectTable from './table/unselect_table.vue';
import selectedTable from './table/selected_table.vue';

export default {
  components: {
    'v-unselect-table': unselectTable,
    'v-selected-table': selectedTable
  },
  props: {},
  data() {
    return {
      pickedTab: 'unselect',
      params: {
        billCode: '',
        clientOrgName: ''
      },
      clientOrgCode: '',
      platformClientOrgCode: '',
      billNo: '',
      selectedNum: 0,
      isBack: false,
      statisticalBill: {
        paymentSubtotalAmount: '', // 应付小计
        totalLoadingWeight: '', // 发货
        totalUnloadingWeight: '', // 收货
      }
    };
  },
  methods: {
    netWorkStatisticalBill() {
      let data = {};
      if (this.params.billCode) {
        data = { billCode: this.params.billCode };
      }
      settlePayableStatisticalBill(data, (success, error) => {
        this.statisticalBill.paymentSubtotalAmount = 0;
        this.statisticalBill.totalLoadingWeight = 0;
        this.statisticalBill.totalUnloadingWeight = 0;
        if (success && success.content) {
          this.statisticalBill.paymentSubtotalAmount = success.content.paymentSubtotalAmount;
          this.statisticalBill.totalLoadingWeight = success.content.totalLoadingWeight;
          this.statisticalBill.totalUnloadingWeight = success.content.totalUnloadingWeight;
        }
      });
    },
    selected() {
      this.$refs.selectedTable.getData();
      this.querySelectedNum();
    },
    unselect() {
      this.$refs.unselectTable.getData();
      this.querySelectedNum();
    },
    querySelectedNum() {
      this.netWorkStatisticalBill();
      const that = this;
      settlePayableSelectSelectedWaybillList({ clientOrgName: that.params.clientOrgName, billCode: that.params.billCode, page: 1, size: 10 }, (success, error) => {
        if (success) {
          that.selectedNum = success.total;
        }
      });
    },
    doCheck() {
      if (!this.selectedNum) {
        this.$message({
          type: 'error',
          message: '请添加运单后操作！',
          duration: 1000
        });
        return false;
      }
      return true;
    }
  },
  mounted() {
    this.netWorkStatisticalBill();
    // 逻辑：
    // 新建页面: 没有billCode , 需要调用 全部清除的 接口
    // 编辑页面: 有billCode ,需要调用 copy 接口
    // isBack 是否是点击返回来到页面，true ，并不清除数据
    const that = this,
      billCode = getParamsFromURL(window.location.search).billCode;
    that.params.billCode = billCode;
    this.isBack = getParamsFromURL(window.location.search).isBack;

    if (billCode != null) {
      settlePayableGet(billCode, (success, error) => {
        if (error) {
          this.$message({
            type: 'error',
            message: '查询账单错误！',
            duration: 1000
          });
          return;
        }
        if (success) {
          const bill = success.content;
          that.clientOrgCode = bill.payerOrgCode;
          that.params.clientOrgName = bill.payerOrgName;
          that.billNo = bill.billNo;
          that.pickedTab = 'selected';

          if (this.isBack) {
            that.$refs.selectedTable.getData();
            that.$refs.unselectTable.getData();
            that.querySelectedNum();
          } else {
            settlePayableTempWaybillCopy(billCode, (s, e) => {
              that.$refs.selectedTable.getData();
              that.$refs.unselectTable.getData();
              that.querySelectedNum();
            });
          }
        }
      });
    } else {
      // 清空接口
      let self = this;
      if (this.isBack) {
        self.$refs.selectedTable.getData();
        self.$refs.unselectTable.getData();
        self.querySelectedNum();

        const clientOrgCode = getParamsFromURL(window.location.search).orgCode,
          platformClientOrgCode = getParamsFromURL(window.location.search).platformOrgCode,
          clientOrgName = getParamsFromURL(window.location.search).orgName;
        that.params.clientOrgName = clientOrgName;
        that.clientOrgCode = clientOrgCode;
        that.platformClientOrgCode = platformClientOrgCode;


      } else {

        const clientOrgCode = getParamsFromURL(window.location.search).orgCode,
          platformClientOrgCode = getParamsFromURL(window.location.search).platformOrgCode,
          clientOrgName = getParamsFromURL(window.location.search).orgName;
        that.params.clientOrgName = clientOrgName;
        that.clientOrgCode = clientOrgCode;
        that.platformClientOrgCode = platformClientOrgCode;


        settlePayableClearSelectedWaybill({}, (success, error) => {
          if (error) {
            this.$message({
              type: 'error',
              message: '清空失败',
              duration: 1000
            });
          }
          if (success) {
            self.$refs.selectedTable.getData();
            self.$refs.unselectTable.getData();
            self.querySelectedNum();
          }
        })
      }
    }

  },
  created() {
     let platformClientOrgCode = getParamsFromURL(window.location.search).platformOrgCode;
     let  clientOrgName = getParamsFromURL(window.location.search).orgName;
     if(platformClientOrgCode){
      this.params['platformClientOrgCode'] = platformClientOrgCode;
      // this.params['platformClientOrgCode'] = platformClientOrgCode;
     }
     if(clientOrgName){
        this.params['clientOrgName'] = clientOrgName;
     }
  }
};

</script>
<style lang="scss">
@import "../../assets/sass/rl-fixed-table.min.scss";
@import "../../assets/sass/base.scss";
body {
  overflow: auto !important;
}

.row_st {
  margin-bottom: 20px;
  margin-top: 40px;
}

.el-tabs--border-card>.el-tabs__content {
  padding: 10px 0 !important;
}

.complex-control-3 {
  .innerblock:nth-child(2) {
    margin-right: 10px;
  }
}

.list-opr-choose {
  padding: 6px 10px;
  border-style: solid;
  border-width: 1px 0;
  border-color: #ddd;
}

.loc-left {
  .el-button {
    width: 220px;
    text-align: center;
  }
  .check-all {
    margin-left: 20px;
    input {
      vertical-align: middle;
    }
  }
}

</style>
