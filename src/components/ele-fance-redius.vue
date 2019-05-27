/**
* bankInfo.vue
* Created by cc on 17/11/30.
*/
<template>
  <div class="section">
    {{domainObject}}
    <!--     <h2 class="tmp-title">
        银行账户信息
    </h2>
    <ul class="bank-info el-row">
      <li class="el-col-6">银行户名：{{ bankInfoObj.bankAccountName }}</li>
      <li class="el-col-6">开户行：{{ bankInfoObj.bankName }}</li>
      <li class="el-col-6">银行账号：{{ bankInfoObj.bankAccountNo }}</li>
      <li class="el-col-6">描述：{{ bankInfoObj.bankAccountDescription }}</li>
    </ul> -->
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  name: 'bankInfo',
  props: {
    isList: Boolean,
    configData: Object,
    editable: {
      type: Boolean,
      'default': true
    },
    domainObject: Object,
    rules: Array
  },
  data() {
    return {
      bankInfoObj: {}
    };
  },
  computed: {},
  methods: {
    showError(text) {
      this.$message({
        type: 'error',
        showClose: true,
        message: text,
        duration: 5000
      });
      return false;
    },
    getBankInfo() {
      if (this.code) {
        const params = {
          code: this.code
        };
        this.getInfo(params, (success, error) => {
          if (error || success.code !== 200) {
            this.showError(error.content);
          }
          if (success) {
            this.bankInfoObj = success.content;
          }
        });
      }
    }
  },
  watch: {},
  created() {
    this.getBankInfo();
  }
};

</script>
<style lang="scss" rel="stylesheet/scss">
.bank-info {
  margin: 20px;
  font-size: 13px;
  background-color: #fffbe8;
  border: solid 1px #eae5ce;
}

</style>
