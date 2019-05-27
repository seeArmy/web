/** * config.vue * 报表配置 * Created by CC on 18/6/21. */
<template>
  <div>
    <!-- 报表配置页面载入中： {{ url }} -->
    <div class="el-loading-mask is-fullscreen" style="z-index: 2000;">
      <div class="el-loading-spinner">
        <svg viewBox="25 25 50 50" class="circular">
          <circle cx="50" cy="50" r="20" fill="none" class="path"></circle>
        </svg>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import * as ApiConst from '../../api/ApiConst';

export default {
  name: 'config',
  components: {},
  props: {},
  data() {
    return {
      loading: false,
      url: ''
    };
  },
  methods: {},
  created() {
    // let newUrl = window.location.host;
    // if(window.parent.location){
    //   newUrl = window.location.host;
    // }
    // console.log('默认网址为：', newUrl);
    // newUrl = newUrl.replace(/.*?\./, '//rlreport.');
    // console.log('替换后网址为：', newUrl);

    const appInfo = JSON.parse(localStorage.getItem('appInfo'));
    let newUrl = appInfo.reportDomain;

    newUrl += '/reportapp/report/config/list?pageSize=10';
    console.log('最终网址为：', newUrl);
    this.url = newUrl;
    window.location = this.url;
  },
  mounted() {}
};

</script>
<style lang="scss" rel="stylesheet/scss">
.el-loading-spinner .path {
  stroke: #f48400;
}

</style>
