<template>
<div id="tb" style="max-height:100%;padding: 5%">
  <div id="s-table" class="fix-table-wrap">
  <table class="rl-fix-table">
    <thead>
      <th>客户名</th>
      <th>线路名称</th>
      <th>待装</th>
      <th>在途</th>
      <th>已卸</th>
      <th>合计</th>
    </thead>
    <transition name="el-fade-in-linear">
    <tbody>
      <tr v-for="(item, i) in fetchData" :key="i">
        <td>{{ item.clientOrgName }}</td>
        <td>{{ item.routeName }}</td>
        <td>{{ item.readyNum }}</td>
        <td>{{ item.transportNum }}</td>
        <td>{{ item.finishNum }}</td>
        <td>{{ item.totalNum }}</td>
      </tr>
    </tbody>
    </transition>
  </table>
  </div>
</div>
</template>

<script>
export default {
  name: 'table',
  props: {
    fetchData: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {

    }
  },
}
</script>

<style lang="scss" scoped>
#s-table {
  &.fix-table-wrap {
    position: relative;
    font-size: 100%;
    width: 100%;
    line-height: 170%;
    overflow: auto;
  }
  .rl-fix-table {
    min-width: 100%;
    white-space: nowrap;
  }
}
</style>
