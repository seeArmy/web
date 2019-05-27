/**
* userMatch.vue
* Created by cc on 17/12/12.
*/
<template>
  <div class="user-match">
    <el-form :model="userObject" label-width="140px" :inline="true">
      <el-form-item label="名片二维码编号">
        <el-input v-model="userObject.codes" :autofocus="true" placeholder="请用扫码枪扫描司机端或小程序二维码后带入" @keyup.enter.native="userMatch"></el-input>
        <input type="text" style="display:none;"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="userMatch">搜索</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
// import { transformInfo } from '../../../api/PlatformService';

export default {
  name: 'userMatch',
  props: {
  },
  data() {
    return {
      userObject: {
        codes: '' // 扫码枪出来人员code和车辆code，eg. 336088825057601552,336089937194084372
      }
    };
  },
  computed: {
  },
  methods: {
    userMatch() {
      if (this.userObject.codes) {
        // transformInfo(this.userObject, (success, error) => {
        //   if (error || success.code !== 200) {
        //     this.$message({
        //       type: 'error',
        //       message: error.content,
        //       duration: 5000
        //     });
        //     return false;
        //   }
        //   if (success) {
        //     const result = success.content;
        //     this.$emit('loadUser', result);
        //     this.userObject.codes = '';
        //   }
        // });
        this.$emit('loadUser', this.userObject.codes);
        this.userObject.codes = '';
      } else {
        this.$message({
          type: 'warning',
          message: '请用扫码枪扫描司机端或小程序二维码！',
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
.user-match {
  margin: 30px 20px 0;
  padding: 20px 20px 13px;
  background-color: #f6f6f6;
  border: solid 1px #ddd;
}
  .user-match .el-input__inner{
    width: 300px;
    ime-mode:disabled;
  }
</style>
