<template>
<pay-ment-confirm :table-data="tableData"></pay-ment-confirm>
</template>

<script type="text/ecmascript-6">
import payMentConfirm from './components/payMentDefault.vue'
import { getPaycart } from './components/utils'

export default {
  name: 'payment',
  components: {
    payMentConfirm
  },
  data: () => {
    return {
      tableData: []
    }
  },
  methods: {

  },
  mounted() {
    this.tableData = getPaycart()
  },
  created() {
  }
};
</script>

<style lang="scss" rel="stylesheet/scss">
</style>

