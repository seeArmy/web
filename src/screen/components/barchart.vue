<template>
<div id="bc" style="height:100%">
  <div :id="chartId"></div>
</div>
</template>

<script>
import G2 from '@antv/g2'
export default {
  name: 'bc-status',
  props: {
    chartId: {
      type: String,
      default: 'bc-' + new Date().getTime()
    }
  },
  data() {
    return {
      chart: null,
    }
  },
  beforeDestroy() {
    this.chart = null
  },
  methods: {
    init(fetchdata) {
      const cdata = fetchdata.list || []
      if(!this.chart) {
        this.chart = new G2.Chart({
          container: this.chartId,
          forceFit: true,
          height: this.$el.clientHeight,
          padding: ['60','50']
        })
      }

      this.chart.source(cdata)
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
      })
      this.chart.axis('value', {
        label: {
          textStyle: {
            fill: '#ffffff'
          }
        },
        tickLine: {
          alignWithLabel: false,
          length: 0
        }
      })
      this.chart.interval().position('xData*value').color('dataType').adjust([{
        type: 'dodge',
        marginRatio: 1 / 32
      }])
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

