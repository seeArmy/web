<template>
  <div class="waybill_statistics_msg">
    <template v-if="type === 'logistics'">
      <table class="rl-fix-table table-bordered">
        <thead>
          <tr>
            <th v-for="item in modelWaybillStatistics[0]">{{item.label}}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="obj in modelWaybillStatistics">
            <td v-for="stat in obj">
              <div class="pr">
                <span class="unit-text">{{stat.val}}</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </template>
    <template v-else>
      <table class="rl-fix-table table-bordered">
        <thead>
          <tr>
            <th>运单数</th>
            <th>待发货运单数</th>
            <th>运输中运单数</th>
            <th v-if="showArrive">已到收货点运单数</th>
            <th v-if="showArrive">已签收运单数</th>
            <th v-if="!showArrive">运输完成运单数</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div class="pr">
                <!-- <input type="text" class="txt-box" v-model="acceptObj.weight"> -->
                <span class="unit-text">{{modelWaybillStatistics.shuntedNum}}</span>
              </div>
            </td>
            <td>
              <div class="pr">
                <!-- <input type="text" class="txt-box" v-model="acceptObj.volume"> -->
                <span class="unit-text">{{modelWaybillStatistics.loadingNum}}</span>
              </div>
            </td>
            <td>
              <div class="pr">
                <!-- <input type="text" class="txt-box" v-model="acceptObj.number"> -->
                <span class="unit-text">{{modelWaybillStatistics.goingNum}}</span>
              </div>
            </td>
            <td v-if="showArrive">
              <div class="pr">
                <!-- <input type="text" class="txt-box" v-model="acceptObj.number"> -->
                <span class="unit-text">{{modelWaybillStatistics.arriveNum}}</span>
              </div>
            </td>
            <td>
              <div class="pr">
                <!-- <input type="text" class="txt-box" v-model="acceptObj.quantity"> -->
                <span class="unit-text">{{modelWaybillStatistics.unloadingNum}}</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </template>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  name: 'waybillStatisticsMsg',
  props: {
    type: {
      type: String,
      'default': 'outsourcingLogistics'
    },
    modelWaybillStatistics: {
      type: Object,
      'default': {
        shuntedNum: 0,
        loadingNum: 0,
        goingNum: 0,
        unloadingNum: 0
      }
    },
    getWaybillStatistics: {
      type: Function,
      'default': null
    },
  },
  data: () => {
    return {
      showArrive: false
    }
  },
  methods: {},
  created() {
    if (this.getData) {}
  },
};

</script>
<style lang="scss" rel="stylesheet/scss">
.waybill_statistics_msg {
  font-size: 14px;
  text-align: center;

  th {
    text-align: center;
    padding-top: 2px;
  }
}

</style>
