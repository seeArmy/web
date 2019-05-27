<template>
  <div class="custom-page">
    <!-- 1 -->
    <div class="section">
      <h2 class="tmp-title">
        银行账户信息<span class="org" v-if="!bankCanEdit">（注：当前司机激活状态为{{ text }}，此版块信息不可编辑）</span>
      </h2>
      <div class="el-row">
        <!-- 银行户名 -->
        <div class='el-col el-col-6'>
          <slot name="bankAccountName"></slot>
        </div>
        <!-- 开户行 -->
        <div class='el-col el-col-6'>
          <slot name="bankName"></slot>
        </div>
        <!-- 银行账号 -->
        <div class='el-col el-col-6'>
          <slot name="bankAccountNo"></slot>
        </div>
        <!-- 银行描述 -->
        <div class='el-col el-col-6'>
          <slot name="bankAccountDescription"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      domainObject: Object,
      isEdit: Boolean,
      editable: Boolean,
      objectName: '',
      bankCanEdit: {
        type: Boolean,
        'default': true
      }
    },
    computed: {
      text() {
        let text = '';
        if (this.domainObject.userStatus === 'activated') {
          text = '已激活';
        } else {
          text = '未激活';
        }
        return text;
      }
    },
    mounted() {
      console.log('layout mounted', this.$slots);
    },
    created() {
      // console.log('123');
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
.el-col-adjust {
  .el-form-item__label {
    width: 124px !important;
  }
  .el-form-item__content {
    margin-left: 124px !important;
    .el-form-item__content {
      margin-left: 0 !important;
    }
  }
  .el-date-editor {
    width: 150px !important;
  }
}
</style>
