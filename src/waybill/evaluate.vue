<template>
  <div class="evaluate">
    <div class="clearfix" v-if="evaluateObject.evaluationScore">
      <div class="eva-table fl">
        <table class="rl-fix-table table-bordered">
            <thead>
              <tr>
                <th>评价维度</th>
                <th>维度得分</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, key) in tableObject">
                <td>{{ key }}</td>
                <td>{{ item }}</td>
              </tr>
            </tbody>
          </table>
      </div>
      <div class="eva-info fl">
        <ul class="text-list">
          <li>
            <span class="tl-tit">评价状态：</span>
            <span class="tl-cont">{{ domainObject.consignEvaluation === 'done' ? '已评价' : '未评价' }}</span>
          </li>
          <li>
            <span class="tl-tit">评价得分：</span>
            <span class="tl-cont"><strong class="org">{{ score }}</strong></span>
          </li>
          <li>
            <span class="tl-tit">评价内容：</span>
            <span class="tl-cont">{{ evaluateObject.description }}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="notice" v-else>
      <p>注：该运单尚未对司机进行评价，您可在运单列表中对运单状态为<span class="org">运输完成</span>的运单进行评价司机操作。</p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'evaluate',
  props: {
    domainObject: Object,
    evaluateObject: Object
  },
  data() {
    return {
      tableObject: {}
    }
  },
  computed: {
    score() {
      if (this.evaluateObject.evaluationScore) {
        return this.evaluateObject.evaluationScore.toFixed(1);
      }
    }
  },
  methods: {
  },
  created() {
    if (this.evaluateObject.evalutionDimensionRecord) {
      this.tableObject = JSON.parse(this.evaluateObject.evalutionDimensionRecord);
    }
    
  }
}
</script>

<style lang="scss" rel="stylesheet/scss">
.evaluate {
  margin: 30px 0;
  line-height: 1.5;
  font-size: 14px;
}
.eva-table {
  line-height: 2;
  width: 200px;
  text-align: center;
  th {
    font-weight: 700;
    text-align: center;
  }
}
.eva-info {
  margin-left: 60px;
}

.text-list {
  li {
    margin-bottom: 15px;
  }
  .tl-tit {
    display: inline-block;
    vertical-align: middle;
    width: 80px;
    font-weight: 700;
  }
  .tl-cont {
    display: inline-block;
    vertical-align: middle;
    width: 700px;
  }
  .org {
    font-weight: 700;
    font-size: 24px;
  }
}
.notice {
  color: #999;
}
</style>
