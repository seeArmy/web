<template>
<pay-ment-confirm :table-data="tableData2"></pay-ment-confirm>
</template>

<script type="text/ecmascript-6">
import payMentConfirm from '../payment/components/payMentConfirm.vue'
import { getPaycart } from '../payment/components/utils'

export default {
  name: 'payOrder',
  components: {
    payMentConfirm
  },
  data: () => {
    return {
      tableData2: []
    }
  },
  methods: {

  },
  mounted() {
    this.tableData2 = getPaycart()
  },
  created() {
  }
};
</script>

