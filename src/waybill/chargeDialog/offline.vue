<!-- 货单列表线下支付弹框 -->
/**
* offline.vue
* Created by cc on 19/5/7.
*/
<template>
  <el-dialog :title="title" :visible.sync="payDialog.visible" size="small" class="pay-dialog" :close="closePayDialog">
    <h3>确认<b>{{ domainObject.truckLicenseNo }}</b>已线下付款<b>{{ payDialog.model.chargeAmounts }}</b>元？</h3>
    <el-row>
      <el-col :span="12">
        单车付款单号：{{ payDialog.model.chargeItemPaybillNo }}
      </el-col>
      <el-col :span="12">
        运单号：{{ domainObject.waybillNo }}
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        银行户名：{{ domainObject.driverPayeeBankAccountName }}
      </el-col>
      <el-col :span="12">
        开户银行：{{ domainObject.driverPayeeBankName }}
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        银行账号：{{ domainObject.driverPayeeBankAccountNo }}
      </el-col>
      <el-col :span="24">
        备注：
        <el-input type="text" v-model="payDialog.comment" style="width:300px" />
      </el-col>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closePayDialog">关闭</el-button>
      <el-button @click="payFailed" :disabled="dialogActionDisable">支付失败</el-button>
      <el-button type="primary" @click="paySuccess" :disabled="dialogActionDisable">确认已付款成功</el-button>
    </span>
  </el-dialog>
</template>
<script type="text/ecmascript-6">

import { paybillOffline } from '../../../api/waybillService';

export default {
  data() {
    return {
      title: '',
      action: '',
      dialogActionDisable: false,
      payDialog: {
        visible: false,
        model: {},
        comment: ''
      }
    };
  },
  props: {
    domainObject: Object
  },
  components: {
  },
  computed: {
  },
  methods: {
    open(action, model, index, title) {
      this.payDialog.comment = '';
      
      this.title = title;
      this.action = action;
      this.payDialog.model = model;
      this.payDialog.visible = true;
    },
    closePayDialog() {
      this.payDialog.model = {};
      this.payDialog.visible = false;
      this.payDialog.comment = '';
    },
    payFailed() {
      this.dialogActionDisable = true;
      paybillOffline({
        code: this.payDialog.model.chargeItemPaybillCode,
        paybillPayStatus: 'failed',
        description: this.payDialog.comment
      }, (data, err) => {
        this.dialogActionDisable = false;
        if (data) {
          this.$message.success("操作成功");
          this.closePayDialog();
          this.refresh();
        } else {
          this.$message.error("操作失败：" + err.content);
        }
      })
    },
    paySuccess() {
      this.dialogActionDisable = true;
      paybillOffline({
        code: this.payDialog.model.chargeItemPaybillCode,
        paybillPayStatus: 'paid',
        description: this.payDialog.comment
      }, (data, err) => {
        this.dialogActionDisable = false;
        if (data) {
          this.$message.success("操作成功");
          this.closePayDialog();
          this.refresh();
        } else {
          this.$message.error("操作失败：" + err.content);
        }
      })
    },
    refresh() {
      this.$emit('refresh', this);
    }
  },
  mounted() {
  },
  created() {}
};

</script>
<style lang="scss" rel="stylesheet/scss">
.pay-dialog .el-row{
  padding: 0 !important;
}

.pay-dialog h3 {
  font-size: 18px;
  text-align: center;
  margin: 20px 0px;
}

.pay-dialog h3 b {
  color: red;
}

.pay-dialog .el-col {
  height: auto !important;
  padding: 10px;
}
</style>
