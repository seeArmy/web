<template>
  <div>
    <ele-print-config moduleName="waybill" businessObjectName="waybill"
                      objectName="打印模板" listUrl="/waybill/print/list.html" :businessObjectList="businessObjectList">

    </ele-print-config>
  </div>
</template>

<script type="text/ecmascript-6">
  import elePrintConfig from '../../print/elePrintConfig.vue';

  export default {
    name: 'wayBillPrintAdd',
    components: {
      'ele-print-config': elePrintConfig
    },
    data() {
      return {
        businessObjectList: [
          { value: 'waybill.waybill', label: '运单' }
        ]
      };
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../../assets/sass/base.scss";

</style>
