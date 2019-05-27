/**
* bankInfo.vue
* Created by cc on 17/11/30.
*/
<template>
  <div class="block eleFanceRdius">
 <!--    <span v-if="domainObject[configData.field]" v-bind:class="text | filterClass()" class="has">{{text}}</span> -->
    <!-- <span v-else class="no">{{text}}</span> -->
    <span v-bind:class="text | filterClass()">{{text}}</span>
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
  filters:{
    filterClass(val){
      if('已设置' === val) {return 'green'}
      else {return 'red'};
    },

  },
  computed: {
    text() {
      // 发货围栏
      let code1 = '';
      let code2 = '';
      if('loadingFanceRedius' === this.configData.field){
        code1 = 'loadingFanceRedius';
        code2 = 'loadingAreaRedius';
      }
      if('unloadingFanceRedius' === this.configData.field){
        code1 = 'unloadingFanceRedius';
        code2 = 'unloadingAreaRedius';
      }
      if( (code1 && this.domainObject[code1]) || (code2 && this.domainObject[code2])){
         return '已设置';
       }else{
        return '未设置'
       }
    }
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

</style>
