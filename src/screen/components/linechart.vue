<template>
<div id="lc" style="height:100%">
  <div :id="chartId"></div>
</div>
</template>

<script>
import G2 from '@antv/g2'
export default {
  name: 'trans-status',
  props: {
    chartId: {
      type: String,
      default: 'l1-' + new Date().getTime()
    }
  },
  data() {
    return {
      chart: null,
    }
  },
  methods: {
    init(fetchdata) {
      const cdata = fetchdata || []
      if(this.chart) {
        document.getElementById(this.chartId).innerHTML = ''
      }
      this.chart = new G2.Chart({
        container: this.chartId,
        forceFit: true,
        height: this.$el.clientHeight,
        padding: 'auto'
      });
      this.chart.source(cdata);
      this.chart.axis('dataTime', {
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

      this.chart.tooltip({
        crosshairs: {
          type: 'line'
        }
      });

      this.chart.legend({
        position: 'top-center',
          textStyle: {
            fill: '#ffffff'
          }
      });

      this.chart.line().position('dataTime*value').color('type').shape('smooth');
      this.chart.point().position('dataTime*value').color('type').size(4).shape('circle').style({
        stroke: '#fff',
        lineWidth: 1
      });
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

