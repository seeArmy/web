/**
* list.vue
* 付款详情的应收应付列表
* Created by zhuyi on 17/7/21.
*/
<template>
  <div>
    <div class="top-btns" v-if="submitData.payableBillStatus === 'accept' && submitData.payStatus !== 'all'">
      <!-- <el-button @click="addReceiveDialog">
        添加付款
      </el-button> -->
      <el-button @click="onClickVbkp">确认付款</el-button>
    </div>
    <el-table
      v-if="paramKey==='paymentCode'"
      :data="list"
      stripe
      style="width: 100%">
      <el-table-column
        label="应付账单号"
        width="220"
        prop="billNo"
        align="center">
        <template scope="scope">
          <a href="javascript:;" class="blue" :data-link="['/settleBillPayable/create.html?code=' + list[scope.$index].billCode + '&editable=false']" data-title="应付账单详情" title="查看应付账单详情">{{ list[scope.$index].billNo }}</a>
        </template>
      </el-table-column>
      <el-table-column prop="carrierOrgName" label="账单收款方" align="center"></el-table-column>
      <el-table-column prop="payableAmount" label="账单应付金额" align="center"></el-table-column>
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
        label="付款资金流水号"
        width="220"
        prop="serialNumber"
        align="center">
      </el-table-column>
      <el-table-column prop="carrierOrgName" label="收款方" align="center"></el-table-column>
      <el-table-column prop="settlingMethod" label="支付方式" align="center"></el-table-column>
      <el-table-column prop="allocationAmount" label="付费分摊金额" align="center"></el-table-column>
      <el-table-column prop="amount" label="流水金额" align="center"></el-table-column>
      <el-table-column prop="operateTime" label="付款时间" align="center"></el-table-column>
      <el-table-column prop="logTime" label="流水记录时间" align="center"></el-table-column>
      <el-table-column prop="description" label="备注" align="center"></el-table-column>
    </el-table>
    <el-dialog :title="dialog.title"
               :visible.sync="dialog.isShow"
               size="large">
      <div class="vbkp-top">
        <span class="label">
          付款资金流水号
        </span>
        <span class="value">
          <input type="text" placeholder="请输入完整的收款资金流水号" v-model="dialog.search.serialNumber">
        </span>
        <span class="sb">
          <el-button :disabled="searchBtnStatus" @click="onSearch">匹配</el-button>
        </span>
        <span class="status">{{statusText}}</span>
      </div>
      <div class="result-table">
        <el-table
          :data="resultList"
          stripe
          style="width: 100%">
          <el-table-column
            label="付款资金流水号"
            width="220"
            prop="serialNumber"
            align="center">
          </el-table-column>
          <el-table-column prop="carrierOrgName" label="付款方" align="center"></el-table-column>
          <el-table-column prop="settlingMethod" label="支付方式" align="center"></el-table-column>
          <el-table-column prop="amount" label="流水金额" align="center"></el-table-column>
          <el-table-column prop="allocationAmount" label="剩余未分摊金额" align="center"></el-table-column>
          <el-table-column prop="operateTime" label="付款时间" align="center"></el-table-column>
          <el-table-column prop="description" label="备注" align="center"></el-table-column>
        </el-table>
      </div>
      <div class="vbkp-form">
        <div class="vbkp-form-item">
          <span class="label">
            收款分摊金额
          </span>
          <span class="value">
            <input type="text" v-model="dialog.data.allocationAmount">元
          </span>
        </div>
        <div class="vbkp-form-item">
          <span class="label">
            分摊备注
          </span>
          <span class="value">
            <input type="text" v-model="dialog.data.description">
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
  } from '../../api/Utils';

  import {
    settlePaymentRelationList,
    settlePayableActualReceiptLogGetNew,
    settlePaymentRelationAdd
  } from '../../api/SettleBillService';

  export default {
    name: 'payment-relation-list',
    components: {},
    props: {
      paramKey: {
        type: String,
        'default': 'paymentCode'
      },
      submitData: {
        type: Object,
        default() {
          return {};
        }
      }
    },
    data: () => {
      return {
        list: [],
        params: {
          code: getParamsFromURL(window.location.search).code
        },
        statusText: '',
        resultList: [],
        searchBtnStatus: false,
        dialog: {
          isShow: false,
          title: '确认付款',
          search: {
            serialNumber: ''
          },
          data: {
            billCode: getParamsFromURL(window.location.search).code,
            paymentCode: '',
            allocationAmount: '',
            description: ''
          }
        }
      };
    },
    methods: {
      onGetList() {
        settlePaymentRelationList({
          [this.paramKey]: this.params.code,
          size: 20,
          page: 1
        }, (res, err) => {
          if (err) {
            this.$message.error(err.content);
          }
          if (res) {
            this.list = res.content;
            console.log('settlePaymentRelationList:', res.content);
          }
        });
      },
      onClickVbkp() {
        this.dialog.isShow = true;
      },
      onVbkpSubmit() {
        console.log('提交的数据：', this.dialog.data);
        settlePaymentRelationAdd(this.dialog.data, (res, err) => {
          if (err) {
            this.$message.error(err.content);
          }
          if (res) {
            this.$message.info('确认成功');
            this.dialog.isShow = false;
            this.searchBtnStatus = false;
          }
        });
      },
      onSearch() {
//        this.$message.info(`您输入的编号是：${this.dialog.search.serialNumber}`);
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
              this.dialog.data.paymentCode = res.content.code;
              this.statusText = '匹配成功';
            } else {
              this.statusText = '没有匹配到数据';
            }
          }
        });
      },
      addReceiveDialog() {
        this.$emit('addReceiveDialog');
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
  }

  .vbkp-top {
    margin-bottom: 20px;
  }

  .status {
    margin-left: 20px;
  }

  .vbkp-form {
    margin-top: 20px;
    margin-bottom: 10px;
  }

  .vbkp-top,
  .vbkp-form {
    input {
      outline: none;
      border: 1px solid #ccc;
    }
  }

  .top-btns {
    text-align: right;
  }
</style>
