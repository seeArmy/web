<template>
  <div id="form" :class="{ 'theme-blue': theme }">
    <!-- <p class="tab">
      <span v-bind:class="[isShow === true ? 'active' : '' ]" @click="tab(0)">申请注册公司</span>
      <span v-bind:class="[isShow === false ? 'active' : '' ]" @click="tab(1)">申请成为企业员工</span>
    </p> -->
    <company-form></company-form>
    <!-- <join-form v-if="isShow===false"></join-form> -->
  </div>
</template>

<script type="text/ecmascript-6">

  import companyForm from './companyForm.vue';

  // import joinForm from './joinForm.vue';

  export default {
    data() {
      return {
        // isShow: true,
        theme: true
      };
    },
    components: {
      'company-form': companyForm
      // 'join-form': joinForm
    },
    methods: {
      // tab(index) {
      //   if (index === 0) {
      //     this.isShow = true;
      //   } else {
      //     this.isShow = false;
      //   }
      // }
    }
  };

</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../assets/sass/base.scss";
  @import "register";

  .light {
    font-size: 12px;
  }

  .el-input__inner {
    width: 260px;
    height: 28px;
    border-radius: 3px;
  }

  .el-col-6 {
    .el-input__inner {
      width: 160px;
    }
  }

  .el-col-10 {
    .el-input__inner {
      width: 270px;
    }
  }
  .el-button {
    height: 28px;
    line-height: 1;
  }
</style>
