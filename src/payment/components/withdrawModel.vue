<template>
<el-dialog
  id="withdrawDialog"
  :title="dialogTitle"
  :visible.sync="dialogVisible"
  width="60%">
  <div id="">
    <el-row>
      <el-form :model="domainObject" ref="domainObject" label-width="150px" :inline="false" :label-position="'right'" >
        <el-col :span="24" v-for="(item, index) in formFields" :key="index" v-if="type === 1">
          <el-form-item :label="item.label">
            <span>{{ domainObject[item.prop] || '0' }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="提现额度">
            <el-input v-model="domainObject.withdrawPersonLimit" placeholder="请输入额度"></el-input> (每笔提现额度)
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button @click="handleSubmit" :disabled="disabledBtn">确 认</el-button>
  </span>
</el-dialog>
</template>

<script type="text/ecmascript-6">
import { updateMemberWithdrawLimit } from '../../../api/PayMember'

export default {
  name: 'withdraw-desposit',
  props: {
    refreshLst: Function
  },
  data() {
    return {
      domainObject: {
        withdrawPersonLimit: 2000000
      },
      dialogTitle: '',
      dialogVisible: false,
      formFields: [
        { label:'账户名', prop: 'accountName'},
        { label:'账户余额', prop: 'amount'},
        { label:'手机号', prop: 'linkmanPhone'},
        // { label:'提现额度', prop: 'limit'},
      ],
      type: 0,
      batchLst: [],
      disabledBtn: false
    }
  },
  methods: {
    batchInit(lst) {
      this.dialogTitle = '提现额度设置（批量）'
      this.type = 0
      this.batchLst = lst
      this.dialogVisible = true
      this.disabledBtn = false
    },
    init(row) {
      this.dialogTitle = '提现额度设置（单次）'
      this.type = 1
      Object.keys(row).forEach((key) => {
        this.domainObject[key] = row[key]
      })
      this.dialogVisible = true
    },
    updateSingle() {
      //TODO
      this.disabledBtn = true
      const o = {
        code: this.domainObject.code,
        withdrawPersonLimit: this.domainObject.withdrawPersonLimit
      }
      updateMemberWithdrawLimit(o, (success, error) => {
        if (error || success.code !== 200) {
          this.$message({
            type: 'error',
            message: error.content,
            duration: 5000
          });
          this.disabledBtn = false
          return false;
        }
        if (success) {
          this.dialogVisible = false
          this.refreshLst()
          this.domainObject = {}
          this.$message({
            type: 'success',
            message: '提交成功',
            duration: 5000
          });
        }
        this.disabledBtn = false
      });
    },
    updateBatch() {
      //TODO
      this.disabledBtn = true
      const m = this.batchLst.length
      var cnt = 0
      this.batchLst.forEach((item) => {
        const o = {
          code: item.code,
          withdrawPersonLimit: this.domainObject.withdrawPersonLimit
        }
        updateMemberWithdrawLimit(o, (success, error) => {
          if(success && success.code === 200) {
            cnt++
          }
        })
      })
      //handle async result
      this.dialogVisible = false
      this.disabledBtn = false
      this.refreshLst()
      // if(cnt === m) {
      //   this.$message({
      //     type: 'success',
      //     message: `修改成功${cnt}个`,
      //     duration: 5000
      //   });
      // }
    },
    handleSubmit() {
      if(this.type === 1) {
        this.updateSingle()
      } else {
        this.updateBatch()
      }
    }
  }
}
</script>


