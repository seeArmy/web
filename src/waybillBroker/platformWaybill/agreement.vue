/**
* agreement.vue  协议内容
* Created by cc on 18/5/21.
*/
<template>
  <div>
    <h2>甲方：{{ firstParty }}</h2>
    <h2>乙方：{{ secondParty }}</h2>
    <p>测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容</p>
  </div>
</template>

<script type="text/ecmascript-6">

  import { getParamsFromURL } from '../../api/Utils';

  export default {
    components: {
    },
    data() {
      return {
        firstParty: getParamsFromURL(window.location.search).firstParty,
        secondParty: getParamsFromURL(window.location.search).secondParty
      };
    },
    methods: {
    },
    created() {

    }
  };
</script>

