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
import { getParamsFromURL } from '../../api/Utils';

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
    const params = getParamsFromURL(window.location.search);
    if (params.reportCode) {
      const appInfo = JSON.parse(localStorage.getItem('appInfo'));
      let newUrl = appInfo.reportDomain;
      this.url = `${newUrl}/report/list/${params.reportCode}`;
      console.log('最终网址为：', this.url);
      window.location = this.url;
    }
  },
  mounted() {}
};

</script>
<style lang="scss" rel="stylesheet/scss">
.el-loading-spinner .path {
  stroke: #f48400;
}

</style>
