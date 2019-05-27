<template>
<div id="niube" class="screen">
  <el-row class="title">
    <div class="fl" style="display:inline-flex;align-items:center;">
      <el-date-picker
        type="date"
        v-model="queryparams.beginTime"
        placeholder="选择开始月"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd">
      </el-date-picker>
      —
      <el-date-picker
        type="date"
        v-model="queryparams.endTime"
        @change="handleChange"
        placeholder="选择结束月"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd">
      </el-date-picker>
    </div>
    <div class="top-banner"><b>智慧物流大数据云图</b></div>
    <!-- <span>融链智慧物流大数据平台</span> -->
    <div class="fr">{{ clocktime }}</div>
  </el-row>
  <el-row class="row">
    <el-col :md="8" :lg="8" :sm="24">
      <div class="screen-container">
        <div class="screen-container-row h33">
          <div class="screen-container-row-inner">
            <div class="screen-octagon">发运状态</div>
            <div class="screen-a"></div><div class="screen-b"></div><div class="screen-c"></div><div class="screen-d"></div>
            <div class="screen-container-content" id="a1">
              <trans-chart ref="transchart" />
            </div>
            <!-- <div>contentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontent</div> -->
          </div>
        </div>
        <div class="screen-container-row h33">
          <div class="screen-container-row-inner">
            <div class="screen-octagon">日报表趋势</div>
            <div class="screen-a"></div><div class="screen-b"></div><div class="screen-c"></div><div class="screen-d"></div>
            <line-chart :chart-id="'dailyRep'" ref="trenddailychart" />
          </div>
        </div>
        <div class="screen-container-row h33">
          <div class="screen-container-row-inner">
            <div class="screen-octagon">月报表趋势</div>
            <div class="screen-a"></div><div class="screen-b"></div><div class="screen-c"></div><div class="screen-d"></div>
            <line-chart :chart-id="'monthRep'" ref="trendmonthchart" />
          </div>
        </div>
      </div>
    </el-col>
    <el-col :md="8" :lg="8" :sm="24">
      <div class="screen-container">
        <div class="screen-container-row h70">
          <div class="screen-container-row-inner">
            <div class="screen-octagon">业务需求</div>
            <div class="screen-a"></div><div class="screen-b"></div><div class="screen-c"></div><div class="screen-d"></div>
            <screen-circle :fetch-data="bizData" />
          </div>
        </div>
        <div class="screen-container-row h30">
          <div class="screen-container-row-inner">
            <div class="screen-octagon">无车承运人上报监控</div>
            <div class="screen-a"></div><div class="screen-b"></div><div class="screen-c"></div><div class="screen-d"></div>
            <screen-report :fetch-data="repData"/>
          </div>
        </div>
      </div>
    </el-col>
    <el-col :md="8" :lg="8" :sm="24">
      <div class="screen-container">
        <div class="screen-container-row h60">
          <div class="screen-container-row-inner">
            <div class="screen-octagon">线路运营情况管理</div>
            <div class="screen-a"></div><div class="screen-b"></div><div class="screen-c"></div><div class="screen-d"></div>
            <simple-table :fetch-data="routeData" ref="simpletable" />
          </div>
        </div>
        <div class="screen-container-row h40">
          <div class="screen-container-row-inner">
            <div class="screen-octagon">运力状态</div>
            <div class="screen-a"></div><div class="screen-b"></div><div class="screen-c"></div><div class="screen-d"></div>
            <bar-chart ref="barchart" />
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</div>
</template>

<script>
import TransChart from './components/trans'
import LineChart from './components/linechart'
import BarChart from './components/barchart'
import SimpleTable from './components/table'
import ScreenCircle from './components/circle'
import ScreenReport from './components/report'
import { bsService } from '@api/bigscreenService'
import { nowtime } from './utils'
import { setInterval } from 'timers';

export default {
  name: 'big-screen',
  components: {
    TransChart,
    LineChart,
    BarChart,
    SimpleTable,
    ScreenCircle,
    ScreenReport
  },
  data() {
    return {
      queryparams: {
        beginTime: '',
        endTime: ''
      },
      bizData: {},
      routeData: [],
      transData: {},
      repData: {},
      clocktime: 0
    }
  },
  created() {
  },
  methods:{
    handleChange() {
      const differ = new Date(this.queryparams.endTime || 0).getTime() - new Date(this.queryparams.beginTime || 0).getTime()
      if(differ < 0) {
        this.$message({
          type: 'warning',
          message: '结束时间不能小于开始时间',
          duration: 3000
        });
        return
      }

      this.loadScreen()
    },
    loadScreen() {
      this.loadtrans()
      this.loaddataSum()
      this.loadroutestate()
      this.loadRep()
      this.loadTrendDaily()
      this.loadVehicleStatus()
      this.loadTrendMonth()
    },
    loaddataSum() {
      bsService({ params: this.queryparams, action: 'dataSum'}, (success, error) => {
        if(success) {
          const { content } = success
          this.bizData = content
        }
      })
    },
    loadtrans()  {
      bsService({ params: this.queryparams, action: 'transStatus'}, (success, error) => {
        if(success) {
          const { content } = success
          this.$refs['transchart'].init(content)
        }
      })
    },
    loadroutestate() {
      bsService({ params: this.queryparams, action: 'routeTransportState'}, (success, error) => {
        if(success) {
          const { content } = success
          this.routeData = content
        }
      })
    },
    loadRep() {
      bsService({ params: this.queryparams, action: 'brokerReportData'}, (success, error) => {
        if(success) {
          const { content } = success
          this.repData = content
        }
      })
    },
    loadTrendDaily() {
      bsService({ params: this.queryparams, action: 'trendAnalysisDay'}, (success, error) => {
        if(success) {
          const { content } = success
          this.$refs['trenddailychart'].init(content)
        }
      })
    },
    loadTrendMonth() {
      bsService({ params: this.queryparams, action: 'trendAnalysisMonth'}, (success, error) => {
        if(success) {
          const { content } = success
          this.$refs['trendmonthchart'].init(content)
        }
      })
    },
    loadVehicleStatus() {
      bsService({ params: this.queryparams, action: 'vehicleUsageState'}, (success, error) => {
        if(success) {
          const { content } = success
          this.$refs['barchart'].init(content)
        }
      })

    },
    loadClock() {
      setInterval(() => {
        this.clocktime = nowtime()
      },1000)
    }
  },
  mounted() {
    console.log('mounted screen')
    this.loadClock()
    this.loadScreen()
  }
}
</script>


