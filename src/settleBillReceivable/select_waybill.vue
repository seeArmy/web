<template xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <div id="list" class="list-page">
    <div class="list-wrap">
      <div class="page-header clearfix">
        <h2 class="page-title fl" v-if="params.billCode != null">编辑应收账单-选择运单</h2>
        <h2 class="page-title fl" v-else>创建应收账单-选择运单</h2>
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
        <a class="el-button el-button--primary el-button--large" :href="`/settleBillReceivable/create.html?code=${params.billCode}`" v-if="params.billCode != null && selectedNum">开始编辑</a>
        <a class="el-button el-button--primary el-button--large" :href="`/settleBillReceivable/create.html?clientOrgCode=${clientOrgCode}&clientOrgName=${params.clientOrgName}&platformClientOrgCode=${platformClientOrgCode}`" v-else-if="params.billCode == null && selectedNum">开始创建</a>
      </div>
    </div>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */

  import { settleReceivableTempWaybillCopy, settleReceivableTempTableDelete, settleReceivableGet, settleReceivableSelectSelectedWaybillList } from '../../api/SettleBillService';
  import { getParamsFromURL } from '../../api/Utils';
  import unselectTable from './table/unselect_table.vue';
  import selectedTable from './table/selected_table.vue';

  export default {
    components: {
      'v-unselect-table': unselectTable,
      'v-selected-table': selectedTable
    },
    props: {
    },
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
        theme: true
      };
    },
    methods: {
      selected() {
        this.$refs.selectedTable.getData();
        this.querySelectedNum();
      },
      unselect() {
        this.$refs.unselectTable.getData();
        this.querySelectedNum();
      },
      querySelectedNum() {
        const that = this;
        settleReceivableSelectSelectedWaybillList({ clientOrgName: that.params.clientOrgName, billCode: that.params.billCode, page: 1, size: 10 }, (success, error) => {
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
    created() {
      if (this.theme) {
        document.querySelector('body').classList.add('theme-blue');
      }
      const that = this,
        billCode = getParamsFromURL(window.location.search).billCode;
      that.params.billCode = billCode;
      if (billCode != null) {
        settleReceivableGet(billCode, (success, error) => {
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
            settleReceivableTempWaybillCopy(billCode, (s, e) => {
              this.$refs.selectedTable.getData();
              this.$refs.unselectTable.getData();
              that.querySelectedNum();
            });
          }
        });
      } else {
        const clientOrgCode = getParamsFromURL(window.location.search).orgCode,
          platformClientOrgCode = getParamsFromURL(window.location.search).platformOrgCode,
          clientOrgName = getParamsFromURL(window.location.search).orgName;
        that.params.clientOrgName = clientOrgName;
        that.clientOrgCode = clientOrgCode;
        that.platformClientOrgCode = platformClientOrgCode;
        settleReceivableTempTableDelete({ clientOrgName, current: false }, (s, e) => {
          that.$refs.selectedTable.getData();
          that.$refs.unselectTable.getData();
          that.querySelectedNum();
        });
      }
    }
  };
</script>

<style lang="scss">
  @import "../assets/sass/rl-fixed-table.min.scss";
  @import "../assets/sass/base.scss";
  body {
    overflow: auto !important;
  }
  .el-tabs--border-card > .el-tabs__content {
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
