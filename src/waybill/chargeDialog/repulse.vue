<!-- 货单列表打回弹框 -->
/**
* offline.vue
* Created by cc on 19/5/7.
*/
<template>
  <el-dialog :title="title" :visible.sync="dialogRevocation.visible" size="small" class="pay-dialog" :close="closePayDialog">
    <el-row>
      <el-col :span="24">
        打回备注：
        <el-input type="text" v-model="dialogRevocation.comment" style="width:300px" />
      </el-col>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closePayDialog">取消</el-button>
      <el-button type="primary" @click="netRevocation" :disabled="dialogActionDisable">确定</el-button>
    </span>
  </el-dialog>
</template>
<script type="text/ecmascript-6">

import { paybillRepulse } from '../../../api/waybillService';

export default {
  data() {
    return {
      title: '',
      action: '',
      dialogActionDisable: false,
      dialogRevocation: {
        visible: false,
        model: {},
        comment: '',
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
      this.dialogRevocation.comment = '';
      this.title = title;
      this.action = action;
      this.dialogRevocation.model = model;
      this.dialogRevocation.visible = true;
    },
    closePayDialog() {
      this.dialogRevocation.model = {};
      this.dialogRevocation.visible = false;
      this.dialogRevocation.comment = '';
    },
    netRevocation() {
      if (this.dialogRevocation.comment == '') {
        this.$message.warning("请填写备注！");
        return false;
      }
      this.dialogActionDisable = true;
      paybillRepulse({
        code: this.dialogRevocation.model.chargeItemPaybillCode,
        paybillApproveDescription: this.dialogRevocation.comment
      }, (data, err) => {
        this.dialogActionDisable = false;
        if (data) {
          this.closePayDialog();
          this.$message.success("操作成功");
          this.refresh();
        } else {
          if (err.content) {
            this.$message.error("操作失败：" + err.content);
          } else {
            this.$message.error("操作失败");
          }
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
.pay-dialog h3 {
  font-size: 18px;
  text-align: center;
  margin: 20px 0px;
}

.pay-dialog h3 b {
  color: red;
}

.pay-dialog .el-col {
  padding: 10px;
}
</style>
