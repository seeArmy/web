/**
* waybillMatch.vue
* Created by cc on 17/12/12.
*/
<template>
  <div class="waybill-match">
    <el-form :model="waybillObject" label-width="100px" :inline="true">
      <el-form-item label="运单号">
        <el-input v-model="waybillObject.waybillNo" :autofocus="true" placeholder="扫码枪扫码读入运单号" @keyup.enter.native="waybillMatch"></el-input>
        <input type="text" style="display:none;"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="waybillMatch">搜索</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import { list } from '../../api/waybillService';

export default {
  name: 'waybillMatch',
  props: {
  },
  data() {
    return {
      baseParams: {
        size: 20,
        page: 1
      },
      waybillObject: {
        waybillNo: ''
      }
    };
  },
  computed: {
  },
  methods: {
    waybillMatch() {
      if (this.waybillObject.waybillNo) {
        const paramObj = Object.assign(this.baseParams, this.waybillObject);
        list(paramObj, (success, error) => {
          if (error || success.code !== 200 || success.content.length === 0) {
            this.$message({
              type: 'error',
              message: '没有查询到该运单的信息！',
              duration: 5000
            });
            return false;
          }
          if (success) {
            const result = success.content[0];
            this.$emit('loadWaybill', result);
            this.waybillObject.waybillNo = '';
          }
        });
      } else {
        this.$message({
          type: 'warning',
          message: '请扫码或输入运单号',
          duration: 3000
        });
        return false;
      }
    }
  },
  watch: {
  },
  created() {
  }
};
</script>

<style lang="scss" rel="stylesheet/scss">
.waybill-match {
  margin: 30px 20px 0;
  padding: 20px 20px 13px;
  background-color: #f6f6f6;
  border: solid 1px #ddd;
}
</style>
