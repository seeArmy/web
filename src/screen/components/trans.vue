<template>
<div id="trans" style="height:100%">
  <div :id="chartId"></div>
</div>
</template>

<script>
import G2 from '@antv/g2'
export default {
  name: 'trans-status',
  data() {
    return {
      chart: null,
      chartId: 'c1-' + new Date().getTime()
    }
  },
  methods: {
    init(fetchdata) {
      const cData = fetchdata.yList || []
      if(!this.chart) {
        this.chart = new G2.Chart({
          container: this.chartId,
          forceFit: true,
          height: this.$el.clientHeight,
          padding: 'auto'
        })
      }

      this.chart.source(cData);
      this.chart.axis('xData', {
        label: {
          textStyle: {
            fill: '#ffffff'
          }
        },
        tickLine: {
          alignWithLabel: false,
          length: 0
        }
      });

      this.chart.axis('value', {
        label: {
          textStyle: {
            fill: '#ffffff'
          }
        }
      })
      this.chart.legend({
        position: 'right-center'
      });
      this.chart.interval().position('xData*value').color('waybillType', ['#40a9ff', '#1890ff', '#096dd9', '#0050b3']).opacity(1);
      this.chart.render();
    }
  },
  mounted() {
    // console.log(this.$el.clientHeight)
    // console.log(this.chartId)
    // this.init()
  },

}
</script>

