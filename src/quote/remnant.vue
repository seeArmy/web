/**
* remnant.vue
* Created by cc on 18/8/17.
*/
<template>
  <div class="section">
    <ul class="remnant-info el-row">
      <li class="el-col-6">计划重量剩余：{{ remnantObj.remnantWeight }} 吨</li>
      <li class="el-col-6">计划体积剩余：{{ remnantObj.remnantVolume }} 方</li>
      <li class="el-col-6">计划数量剩余：{{ remnantObj.remnantNumber }} 件</li>
      <li class="el-col-6">需求车次剩余：{{ remnantObj.remnantQuantity }} 车</li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">

export default {
  name: 'remnant',
  props: {
    remnantObj: Object
  },
  data() {
    return {
    };
  },
  computed: {
  },
  methods: {
  },
  watch: {
  },
  created() {
  }
};
</script>

<style lang="scss" rel="stylesheet/scss">
.remnant-info {
  padding: 10px !important;
  margin: 20px;
  font-size: 13px;
  background-color: #fff5c0;
  border-bottom: 0 !important;
}
</style>
