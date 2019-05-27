<template>
  <div>
    <ele-print-config-list listUrl="/waybill/print/list.html" addUrl="/waybill/print/add.html"
                           editUrl="/waybill/print/add.html"
                           moduleName="waybill" 
                           businessObjectName="waybill"
                           :isPlatform='isPlatform'
                           objectName="运单打印模板"></ele-print-config-list>
  </div>
</template>

<script type="text/ecmascript-6">
  import elePrintConfigList from '../../print/elePrintConfigList.vue';

  export default {
    name: 'wayBillPrintList',
    components: {
      'ele-print-config-list': elePrintConfigList
    },
    data() {
      return {
        isPlatform:false
      };
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">

</style>
