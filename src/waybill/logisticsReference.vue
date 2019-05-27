<!--订单参考信息-->
<template>
  <div class="highlight-bg clearfix clear reference waybill_logistics_reference">
    <!-- 原订单参考信息： -->
    <div class="el-col el-col-24">
      <div class="el-form-item">
        <label class="el-form-item__label" style="width: 100px;">原订单参考信息</label>
      </div>
    </div>
    <div v-for="field in fields" class="el-col el-col-12">
      <el-form-item :label="field.showName">
        <ele-block :field="field" :domainObject="domainObject" :editable="editable" :uploadUrl="uploadUrl" :inputKey="inputKey"></ele-block>
      </el-form-item>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import * as utils from '../../api/Utils';
import eleBlock from '../components/ele-block/eleBlock.vue';
import { getResidueNum } from '../../api/LogisticsService';

export default {
  components: {
    'ele-block': eleBlock
  },
  props: {
    // domainObject: null
  },
  data() {
    return {
      editable: false,
      uploadUrl: null,
      inputKey: null,
      fields: [],
      domainObject: {logisticsPlanStartTime:'',logisticsPlanEndTime:'',goodsWeight:'',goodsWeightUnitCode:'',remainGoodsWeight:'',remainGoodsWeightUnitCode:'',goodsNum:'',goodsNumUnitCode:'',remainGoodsNum:'',remainGoodsNumUnitCode:'',goodsVolume:'',goodsVolumeUnitCode:'',remainGoodsVolume:'',remainGoodsVolumeUnitCode:''}
    };
  },
  methods: {},
  created() {

    const logisticsCode = utils.getParamsFromURL(window.location.search).logisticsCode;
    if (logisticsCode) {
      getResidueNum(logisticsCode, (success, error) => {
        if (success) {
          this.domainObject = success.content;
        }
      });
    }

  },
  mounted() {
    const self = this,
      eleConfig = {
        data: {
          content: [{
              showName: "计划开始时间",
              elementCode: "label",
              extraParams: '{"field1":"logisticsPlanStartTime"}',
              fieldConfigCode: "logisticsPlanStartTime"
            },
            {
              showName: "计划结束时间",
              elementCode: "label",
              extraParams: '{"field1":"logisticsPlanEndTime"}',
              fieldConfigCode: "logisticsPlanStartTime"
            },
            {
              showName: "订单计划重量",
              elementCode: "goodsWeight",
              extraParams: '{"field1":"goodsWeight","field2":"goodsWeightUnitCode","required":"false","detailLinkVisiable":"false"}',
              fieldConfigCode: "goodsWeight"
            },
            {
              showName: "订单剩余计划重量",
              elementCode: "goodsWeight",
              extraParams: '{"field1":"remainGoodsWeight","field2":"remainGoodsWeightUnitCode","required":"false","detailLinkVisiable":"false"}',
              fieldConfigCode: "remainGoodsWeight"
            },
            {
              showName: "订单计划体积",
              elementCode: "goodsVolume",
              extraParams: '{"field1":"goodsVolume","field2":"goodsVolumeUnitCode","required":"false","detailLinkVisiable":"false"}',
              fieldConfigCode: "goodsVolume"
            }, {
              showName: "订单剩余计划体积",
              elementCode: "goodsVolume",
              extraParams: '{"field1":"remainGoodsVolume","field2":"remainGoodsVolumeUnitCode","required":"false","detailLinkVisiable":"false"}',
              fieldConfigCode: "remainGoodsVolume"
            },
            {
              showName: "订单计划数量",
              elementCode: "goodsNum",
              extraParams: '{"field1":"goodsNum","field2":"goodsNumUnitCode","required":"false","detailLinkVisiable":"false"}',
              fieldConfigCode: "goodsNum"
            },
            {
              showName: "订单剩余计划数量",
              elementCode: "goodsNum",
              extraParams: '{"field1":"remainGoodsNum","field2":"remainGoodsNumUnitCode","required":"false","detailLinkVisiable":"false"}',
              fieldConfigCode: "remainGoodsNum"
            }
          ]
        }
      },
      eleDefine = JSON.parse(localStorage.getItem('eleDefine')),
      eleInfo = JSON.parse(localStorage.getItem('eleInfo'));

    self.fields = utils.getParam(eleConfig, eleDefine, eleInfo).field;

  }
};

</script>
<style lang="scss" rel="stylesheet/scss">
.reference {
  margin-bottom: 10px;
}

.waybill_logistics_reference {
  .el-form-item__label {
    width: 130px !important;
  }
}

</style>
