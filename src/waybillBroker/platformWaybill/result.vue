/**
* result.vue
* 错误信息
* Created by cc on 19/3/25.
*/
<template>
<div id="result">
  <div class="page-header">
    <h2 class="page-title">上报错误信息</h2>
  </div>
  <ul class="result-list">
    <li v-for="(msg, index) in msgs" :key="index">
      <span class="seq">{{ index + 1 }}</span>运单号<strong class="blue">{{ msg.waybillNo }}</strong>创建上报{{ typeText }}失败，原因是<strong class="red">{{ msg.msg }}。</strong>
    </li>
  </ul>
</div>
</template>

<script type="text/ecmascript-6">
import { getParamsFromURL } from '../../../api/Utils';

export default {
  name: 'result',
  components: {
  },
  props: {
  },
  computed: {
    typeText() {
      let text = '运单';
      if (getParamsFromURL(window.location.search).tp === 'fee') {
        text = '运费';
      }
      return text;
    }
  },
  data: () => {
    return {
      msgs: JSON.parse(window.localStorage.getItem('ErrorMsg')) || []
    };
  },
  methods: {
  },
  created() {
  },
  mounted() {
  }
};
</script>

<style lang="scss" rel="stylesheet/scss">
@import "../../assets/sass/base.scss";
#result {
  .result-list {
    font-size: 14px;
    padding: 20px 0;
  }
  li {
    padding: 10px 40px;
    line-height: 1.4;
    border-bottom: dashed 1px #ddd;
    .seq {
      float: left;
      margin-left: -40px;
      display: inline-block;
      width: 40px;
      text-align: center;
    }
    strong {
      font-weight: 700;
      margin: 0 5px;
    }
  }
}
</style>
