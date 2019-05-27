<template>
<el-dialog
  id="paymentDialog"
  :title="DialogData.title"
  :visible.sync="dialogVisible"
  width="30%">
  <div id="">
    <h1 v-if="DialogData.title == '线下支付提示'" class="center">确认<span class="page-title">{{ domainObject.truckLicenseNo }}</span>已线下付款<span class="page-title">{{ domainObject.paymentAmount | toThousandslsFilter }}</span>元？</h1>
    <h1 v-else class="center">确认取消支付<span class="page-title">{{ domainObject.truckLicenseNo }}</span>的司机费用？</h1>
    <el-row>
        <el-form :model="domainObject" ref="domainObject" label-width="150px" :inline="false" :label-position="'right'" >
          <el-col :span="12" v-for="(item, index) in formFields" :key="index">
            <el-form-item :label="item.label">
              <span>{{ domainObject[item.prop] || '无' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="domainObject.remark" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>

        </el-form>

    </el-row>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">关 闭</el-button>
    <!-- <el-button type="primary" @click="dialogVisible = false">确 定</el-button> -->
    <el-button v-if="DialogData.title == '线下支付提示'" type="primary" @click="handlePay('failed')">支付失败</el-button>
    <el-button v-if="DialogData.title == '线下支付提示'" type="primary" @click="handlePay('paid')">确认已付款成功</el-button>
    <el-button v-if="DialogData.title == '取消支付提示'" type="primary" @click="handlecancelPay">确定取消</el-button>
  </span>
</el-dialog>
</template>

<script>
import { pay, revokePay } from '../../../api/waybillService'

export default {
  props: {
    DialogData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      domainObject: {},
      dialogVisible: false,
      formFields: [
        { label:'运单付款单号', prop: 'paybillNo'},
        { label:'运单号', prop: 'waybillNo'},
        { label:'开户银行', prop: 'payeeBankName'},
        { label:'银行户名', prop: 'payeeBankAccountName'},
        { label:'银行账号', prop: 'payeeBankAccountNo'},
      ]
    };
  },
  methods: {
    handlePay(status) {
      const params = {
        code: this.domainObject.code,
        paybillPayStatus: status,
        description: this.domainObject.remark
      }
      pay(params,(success,err) => {
        if(success && success.code === 200) {
          this.dialogVisible = false
          this.$emit('loadlstAction')
        }
        if(err) {
          this.$message({
            type: 'error',
            message: err.content,
            duration: 5000
          });
        }
      })
    },
    handlecancelPay() {
      const params = {
        code: this.domainObject.code,
        paybillApproveDescription: this.domainObject.remark
      }
      revokePay(params,(success,err) => {
        if(success && success.code === 200) {
          this.dialogVisible = false
          this.$emit('loadlstAction')
        }
        if(err) {
          this.$message({
            type: 'error',
            message: err.content,
            duration: 5000
          });
        }
      })
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    init() {
      this.dialogVisible = true
      this.domainObject = {}
      this.domainObject = this.DialogData.row
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss">


#paymentDialog {
  .center {
    text-align: center
  }

  h1 {
    font-size: 120%;
    margin-bottom: 10px;
    margin-top: 10px
  }
}
</style>
