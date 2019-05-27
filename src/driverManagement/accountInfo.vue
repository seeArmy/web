/**
* AccountInfo.vue
* Created by cc on 17/11/30.
*/
<template>
  <div class="section">
    <h2 class="tmp-title">
        平台账号信息
    </h2>
    <ul class="account-info el-row">
      <li class="el-col-6">登录账号：{{ domainObject.loginAccount }}</li>
      <li class="el-col-6">账号激活状态：{{ domainObject.userStatus === 'activated' ? '已激活' : '未激活' }}</li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">

export default {
  name: 'accountInfo',
  props: {
    code: '',
    domainObject: Object,
    getInfo: Function
  },
  data() {
    return {
      accountObj: {
        loginAccount: '',
        userStatus: ''
      }
    };
  },
  computed: {
  },
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
    getAccountInfo() {
      if (this.code) {
        const params = {
          size: 20,
          page: 1,
          userCode: this.code
        };
        this.getInfo(params, (success, error) => {
          if (error || success.code !== 200) {
            this.showError(error.content);
          }
          if (success) {
            const result = success.content[0] || {};
            if (result.loginAccount) {
              this.accountObj.loginAccount = result.loginAccount;
            }
            if (result.userStatus) {
              this.accountObj.userStatus = result.userStatus;
            }
          }
        });
      }
    }
  },
  watch: {
  },
  created() {
    // this.getAccountInfo();
  }
};
</script>

<style lang="scss" rel="stylesheet/scss">
.account-info {
  margin: 20px;
  font-size: 13px;
  background-color: #fffbe8;
  border: solid 1px #eae5ce;
}
</style>
