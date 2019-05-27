/**
* list.vue
* 收款详情的应收应付列表
* Created by zhuyi on 17/7/21.
*/
<template>
  <div>
    <div class="top-btns" v-if="submitData.receivableBillStatus === 'accept' && submitData.receivableStatus !== 'all' && submitData.payableBillStatus !== 'reject'">
      <el-button @click="onClickVbkp">确认收款</el-button>
    </div>
    <el-table
      v-if="paramKey==='receiptCode'"
      :data="list"
      stripe
      style="width: 100%">
      <el-table-column
        label="应收账单号"
        width="220"
        prop="billNo"
        align="center">
        <template scope="scope">
          <a href="javascript:;" class="blue" :data-link="['/settleBillReceivable/create.html?code=' + list[scope.$index].billCode + '&editable=false']" data-title="应收账单详情" title="查看应收账单详情">{{ list[scope.$index].billNo }}</a>
        </template>
      </el-table-column>
      <el-table-column prop="clientOrgName" label="账单收款方" align="center"></el-table-column>
      <el-table-column prop="receivableAmount" label="账单应收金额" align="center"></el-table-column>
      <el-table-column prop="allocationAmount" label="本次流水分摊金额" align="center"></el-table-column>
      <el-table-column prop="createTime" label="分摊时间" align="center"></el-table-column>
      <el-table-column prop="description" label="分摊备注" align="center"></el-table-column>
    </el-table>
    <el-table
      v-if="paramKey==='billCode'"
      :data="list"
      stripe
      style="width: 100%">
      <el-table-column
        label="收款资金流水号"
        width="220"
        prop="serialNumber"
        align="center">
      </el-table-column>
      <el-table-column prop="clientOrgName" label="付款方" align="center"></el-table-column>
      <el-table-column prop="settlingMethod" label="支付方式" align="center"></el-table-column>
      <el-table-column prop="allocationAmount" label="收款分摊金额" align="center"></el-table-column>
      <el-table-column prop="amount" label="流水金额" align="center"></el-table-column>
      <el-table-column prop="operateTime" label="收款时间" align="center"></el-table-column>
      <el-table-column prop="logTime" label="流水记录时间" align="center"></el-table-column>
      <el-table-column prop="description" label="备注" align="center"></el-table-column>
    </el-table>
    <el-dialog :title="dialog.title"
               :visible.sync="dialog.isShow"
               size="large">
      <div class="vbkp-top">
        <strong class="org">*</strong> 收款资金流水号：
        <span class="dialog-txtbox"><el-input v-model="dialog.search.serialNumber" placeholder="请输入完整的收款资金流水号"></el-input></span>
        <el-button :disabled="searchBtnStatus" @click="onSearch">匹配</el-button>
        <span class="status org">{{statusText}}</span>
      </div>
      <div class="result-table">
        <el-table
          :data="resultList"
          stripe
          style="width: 100%">
          <el-table-column
            label="收款资金流水号"
            width="220"
            prop="serialNumber"
            align="center">
          </el-table-column>
          <el-table-column prop="clientOrgName" label="付款方" align="center"></el-table-column>
          <el-table-column prop="settlingMethod" label="支付方式" align="center"></el-table-column>
          <el-table-column prop="amount" label="流水金额" align="center"></el-table-column>
          <el-table-column prop="remainderAmount" label="剩余未分摊金额" align="center"></el-table-column>
          <el-table-column prop="operateTime" label="收款时间" align="center"></el-table-column>
          <el-table-column prop="description" label="备注" align="center"></el-table-column>
        </el-table>
      </div>
      <div class="vbkp-form">
        <div class="vbkp-form-item">
            <strong class="org">*</strong> 收款分摊金额：
            <span class="dialog-txtbox">
              <el-input type="number" v-model="dialog.data.allocationAmount" placeholder="请输入收款分摊金额"></el-input>
            </span>
            <span class="txt-unit">元</span>
        </div>
        <div class="vbkp-form-item">
            分摊备注：
            <span class="dialog-txtbox">
              <el-input v-model="dialog.data.description" placeholder="请输入分摊备注"></el-input>
            </span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog.isShow = false">取 消</el-button>
        <el-button type="primary" :disabled="searchBtnStatus" @click="onVbkpSubmit">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  import {
    getParamsFromURL
  } from '../../../api/Utils';

  import {
    settleReceiptRelationList,
    settlePayableActualReceiptLogGetNew,
    settleReceiptRelationAdd
  } from '../../../api/PlatformSettleBillService';

  export default {
    name: 'receipt-relation-list',
    props: {
      showBtn: {
        type: Boolean,
        'default': true
      },
      submitData: {
        type: Object,
        default() {
          return {};
        }
      },
      paramKey: {
        type: String,
        'default': 'receiptCode'
      }
    },
    components: {},
    data: () => {
      return {
        statusText: '',
        resultList: [],
        list: [],
        params: {
          code: getParamsFromURL(window.location.search).code
        },
        searchBtnStatus: false,
        dialog: {
          isShow: false,
          title: '确认收款',
          search: {
            serialNumber: ''
          },
          data: {
            billCode: getParamsFromURL(window.location.search).code,
            receiptCode: '',
            allocationAmount: '',
            description: ''
          }
        }
      };
    },
    methods: {
      onGetList() {
        settleReceiptRelationList({
          [this.paramKey]: this.params.code,
          size: 20,
          page: 1
        }, (res, err) => {
          if (err) {
            this.$message.error(err.content);
          }
          if (res) {
            this.list = res.content;
            console.log('receipt-relation-list:', res.content);
          }
        });
      },
      onClickVbkp() {
        this.dialog.isShow = true;
      },
      onVbkpSubmit() {
        if (!this.dialog.search.serialNumber) {
          this.$message({
            type: 'warning',
            message: '请输入完整的收款资金流水号进行匹配！',
            duration: 3000
          });
          return false;
        } else if (this.statusText === '匹配错误') {
          this.$message({
            type: 'warning',
            message: '请输入正确的收款资金流水号进行匹配！',
            duration: 3000
          });
          return false;
        } else {
          if (!this.dialog.data.allocationAmount) {
            this.$message({
              type: 'warning',
              message: '请输入收款分摊金额！',
              duration: 3000
            });
            return false;
          } else {
            console.log('提交的数据：', this.dialog.data);
            settleReceiptRelationAdd(this.dialog.data, (res, err) => {
              if (err) {
                this.$message.error(err.content);
              }
              if (res) {
                this.$message.info('确认成功');
                this.dialog.isShow = false;
                this.searchBtnStatus = false;
              }
            });
          }
        }
      },
      onSearch() {
        if (!this.dialog.search.serialNumber) {
          this.$message({
            type: 'warning',
            message: '请输入完整的收款资金流水号进行匹配！',
            duration: 3000
          });
          return false;
        } else {
          this.resultList = [];
          this.statusText = '正在匹配';
          this.searchBtnStatus = true;
          settlePayableActualReceiptLogGetNew({
            serialNumber: this.dialog.search.serialNumber
          }, (res, err) => {
            if (err) {
              this.searchBtnStatus = false;
              this.$message.error(err.content);
              this.statusText = '匹配错误';
            }
            if (res) {
              if (res.content && res.content.code) {
                this.searchBtnStatus = false;
                console.log('匹配结果', res.content);
                this.resultList.push(res.content);
                this.dialog.data.receiptCode = res.content.code;
                this.statusText = '匹配成功';
              } else {
                this.statusText = '没有匹配到数据';
              }
            }
          });
        }
      },
      onUpdateParams() {
        this.statusText = '';
        console.log('onUpdateParams');
      },
      init() {
        this.onUpdateParams();
//        this.onClickVbkp();
        this.onGetList();
      }
    },
    created() {
      this.init();
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  .vbkp-form-item {
    display: inline-block;
    margin-right: 20px;
  }

  .vbkp-top {
    margin-bottom: 10px;
  }
  .dialog-txtbox {
    .el-input {
      display: inline-block;
      vertical-align: middle;
      width: 240px;
    }
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none !important;
      margin: 0;
    }
  }
  .status{
    margin-left:20px;
  }
  .vbkp-form{
    margin-top: 20px;
    margin-bottom: 10px;
  }
  .txt-unit {
    margin-left: 5px;
  }
  .vbkp-top,
  .vbkp-form{
    input{
      outline: none;
      border: 1px solid #ccc;
    }
  }
  .top-btns{
    margin-bottom: 10px;
    text-align: right;
  }
</style>

