/**
* logisticsInfo.vue
* Created by cc on 18/7/30.
*/
<template>
  <div>
    <table class="rl-fix-table table-bordered">
      <thead>
        <tr>
          <th>订单号</th>
          <th>托运客户</th>
          <th>线路</th>
          <th>货物</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <a href="javascript:;" class="blue" :data-link="'/logistics/add.html?code=' + logisticsData.code + '&editable=false'" :data-title="`订单详情`" title="查看详情">
              {{ logisticsData.logisticsNo }}
            </a>
          </td>
          <td>
            <a href="javascript:;" class="blue" :data-link="'/partner/add.html?orgCode=' + logisticsData.platformClientOrgCode + '&editable=false'" :data-title="`伙伴详情`" title="查看详情">
              {{ logisticsData.clientOrgName }}
            </a>
          </td>
          <td>
            {{ logisticsData.routeName }}
          </td>
          <td>
            {{ logisticsData.goodsName }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script type="text/ecmascript-6">

export default {
  name: 'logisticsInfo',
  props: {
    logisticsData: Object
  },
  data() {
    return {
    };
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

</style>
