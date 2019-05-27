<template>
<div id="circle" style="height:inherit;">
  <el-row style="height:inherit;">
  <el-row class="circle-line">
    <el-col :span="8"  v-for="(item, index) in fields" :key="index">
      <div :class="`s-ring--out ${item.lineclass}`">
        <div :class="`s-ring--in ${item.lineclass}`">
          <div :class="`s-ring ${item.lineclass}`">
            <span class="num">{{ fetchData[item.prop] || 0}}{{item.unit}}</span>
            <span class="info">{{ item.name }}</span>
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
  <el-row class="percent">
    完成率&nbsp;&nbsp;&nbsp;&nbsp;
    <el-progress type="circle" :percentage="fetchData['completeRate']" color="#8e71c7"></el-progress>
  </el-row>
  </el-row>
</div>
</template>

<script>
export default {
  name: 'circle',
  props: {
    fetchData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      fields: [
        { name: '订单数', unit: '', prop: 'orderNum', lineclass: 'r1' },
        { name: '发车需求量', unit: '', prop: 'carNum', lineclass: 'r1' },
        { name: '发货吨位', unit: '吨', prop: 'goodsWeight', lineclass: 'r1' },
        { name: '发货方数', unit: '方', prop: 'goodsCube', lineclass: 'r2' },
        { name: '发货件数', unit: '件', prop: 'goodsNum', lineclass: 'r2' },
        { name: '订单金额', unit: '', prop: 'orderTotalFreight', lineclass: 'r2' },
      ]
    }
  }
}
</script>


