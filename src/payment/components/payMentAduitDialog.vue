<template>
  <el-dialog id="paymentAuditDialog" :title="'单车付款审核提示'" :visible.sync="dialogVisible" width="30%">
    <div id="">
      <el-row>
        <h2 class="center">审核<big class="page-title">{{ dialogObj.truckLicenseNo }}</big>单车付款</h2>
        <el-form :model="dialogObj" ref="domainObject" label-width="150px" :inline="false" :label-position="'right'">
          <el-col :span="24">
            <el-form-item label="运单号">
              <span>{{ dialogObj.waybillNo }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="应付司机劳务费">
              <span>¥ <big class="page-title">{{ dialogObj.settleDriverRealPayment | toThousandslsFilter }}</big>元</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="交易费">
              <span>¥ <big class="page-title">{{ dialogObj.settleTradingConfigAmount | toThousandslsFilter }}</big>元</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="审核结果">
              <el-radio v-model="paybillApproveStatus" label="accept">审核通过</el-radio>
              <el-radio v-model="paybillApproveStatus" label="reject">审核不通过</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="remark"></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </div>
    <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">关 闭</el-button>
    <el-button type="primary" @click="handleSingleSubmit()">确认</el-button>
  </span>
  </el-dialog>
</template>
<script>
import { approvePayment } from '../../../api/waybillService'

export default {
  props: {

  },
  data() {
    return {
      // domainObject: {},
      dialogObj: {},
      dialogVisible: false,
      handleLst: [],
      paybillApproveStatus: '',
      amount: 0,
      remark: '',
      successRet: [],
      errRet: []
    };
  },
  methods: {

    handleSubmit() {
      const errRet = [],
        successRet = [];
      this.handleLst.forEach(lst => {
        const params = {
          code: lst.code,
          paybillApproveStatus: this.paybillApproveStatus,
          paybillApproveDescription: this.remark
        }
        approvePayment(params, (success, error) => {
          if (success && success.code === 200) {
            successRet.push(lst.code)
          } else {
            errRet.push(lst.code)
          }
          if (error) {
            this.$message({
              type: 'error',
              message: error.content,
              duration: 3000
            });
          }
        })
      })

      if (errRet.length > 0) {
        //error
      } else {
        this.dialogVisible = false
      }
      this.dialogVisible = false
      this.$emit('loadinglst')
    },
    handleSingleSubmit() {
      if (this.paybillApproveStatus.length < 1) {
        this.$message({
          type: 'warning',
          message: `请选择审核结果`,
          duration: 3000
        });
        return;
      }
      const params = {
        code: this.dialogObj.code,
        paybillApproveStatus: this.paybillApproveStatus,
        paybillApproveDescription: this.remark
      }
      approvePayment(params, (success, error) => {
        if (success && success.code === 200) {
          this.$message({
            type: 'success',
            message: '审核成功',
            duration: 3000
          });
          this.dialogVisible = false
          this.$emit('loadinglst')
        }
        if (error) {
          this.$message({
            type: 'error',
            message: error.content,
            duration: 3000
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
    approvedlst(list) {
      this.handleLst = list
      this.amount = 0
      list.forEach(element => {
        this.amount = this.amount + element.settleDriverPayment
      });
      this.dialogVisible = true
    },
    init(row) {
      this.dialogObj = row
      console.log('row', row)
      this.dialogVisible = true
    }
  }
};

</script>
<style lang="scss" rel="stylesheet/scss">


</style>
