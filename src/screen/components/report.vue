<template>
<div id="report" style="height:inherit;">
  <el-row :gutter="10" style="padding:5%">
  <el-col :span="12">
    <div class="report-block">
      <div class="report-block__title success">
        <div class="check-style-circle">
          <div class="check-style-unequal-width"></div>
        </div>
        上报成功
      </div>
      <div class="report-block__info success">
        <span><b> {{ fetchData.sucessWaybillNum || 0 }}</b> 单</span>
        <span><b>{{ fetchData.reportAmount || 0 }} </b> 元</span>
        <span><b>{{ fetchData.reportWeight || 0 }} </b> 吨</span>
      </div>
    </div>
  </el-col>
  <el-col :span="12">
    <div class="report-block">
      <div class="report-block__title fail">
        <div class="check-style-circle">
          <div class="check-style-cross-width"></div>
        </div>
        上报失败
      </div>
      <div class="report-block__info fail">
        <span><b> {{ fetchData.failWaybillNum || 0 }}</b> 单</span>
      </div>
    </div>
  </el-col>
  </el-row>
</div>
</template>

<script>
export default {
  name: 'repot',
  props: {
    fetchData: {
      type: Object,
      default() {
        return {}
      }
    }
  }
}
</script>
