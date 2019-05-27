<!--approveContentName
:
"审核通过"
approveRemark
:
"通过了。"
approveTime
:
"2017-11-11 17:59:03"
approveUserFullName
:
"奥康"-->
<template>
  <div>
    <el-table
      :data="history.approveList.list"
      border
      style="width: 100%">
      <el-table-column
        prop="createTime"
        label="操作时间"></el-table-column>
        <el-table-column
        prop="ownerOrgName"
        label="操作单位"></el-table-column>
      <el-table-column
        prop="creatorUsername"
        label="操作人"></el-table-column>
      <el-table-column
        prop="operatorName"
        label="操作"></el-table-column>
      <el-table-column
        prop="description"
        label="备注"></el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: 'create_approve',
    data() {
      return {};
    },
    props: {
      history: {
        type: Object,
        default() {
          return {
            actualReceiptLogList: {
              list: []
            },
            approveList: {
              list: []
            }
          };
        }
      }
    },
    methods: {
      init() {
      }
    },
    mounted() {
      this.init();
    },
    watch: {
      $route() {
        this.init();
      }
    }
  };
</script>

<style lang="scss">

</style>
