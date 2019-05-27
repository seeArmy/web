<!--订单参考信息-->
<template>
  <div class="highlight-bg clearfix clear reference">
    <!-- 原订单参考信息： -->
    <div class="el-col el-col-24 sepline">
      <div class="el-form-item">
        <label class="el-form-item__label" style="width: 100px;">原订单参考信息</label>
      </div>
    </div>
    <div v-for="field in fields" class="el-col el-col-6">
      <el-form-item :label="field.showName">
        <ele-block :field="field" :domainObject="domainObject" :editable="editable" :uploadUrl="uploadUrl" :inputKey="inputKey"></ele-block>
      </el-form-item>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import * as utils from '../../api/Utils';
  import { getResidueNum } from '../../api/LogisticsService';
  import eleBlock from '../components/ele-block/eleBlock.vue';

  export default {
    components: {
      'ele-block': eleBlock
    },
    props: {
    },
    data() {
      return {
        editable: false,
        uploadUrl: null,
        inputKey: null,
        fields: [],
        domainObject: {}
      };
    },
    methods: {
    },
    created() {

    },
    mounted() {
      const self = this,
        logisticsCode = utils.getParamsFromURL(window.location.search).logisticsOutsourceCode,
        eleConfig =
          {
            data:
              {
              content:
                [
                  {
                    showName: "剩余分配重量",
                    elementCode: "goodsWeight",
                    extraParams: '{"field1":"remainGoodsWeight","field2":"goodsWeightUnitCode","required":"false","detailLinkVisiable":"false"}',
                    fieldConfigCode: "remainGoodsWeight"
                  },
                  {
                    showName: "剩余分配数量",
                    elementCode: "goodsNum",
                    extraParams: '{"field1":"remainGoodsNum","field2":"goodsNumUnitCode","required":"false","detailLinkVisiable":"false"}',
                    fieldConfigCode: "remainGoodsNum"
                  },
                  {
                    showName: "剩余分配体积",
                    elementCode: "goodsVolume",
                    extraParams: '{"field1":"remainGoodsVolume","field2":"goodsVolumeUnitCode","required":"false","detailLinkVisiable":"false"}',
                    fieldConfigCode: "remainGoodsVolume"
                  },
                  {
                    showName: "剩余分配车次",
                    elementCode: "truckQty",
                    extraParams: '{"field1":"remainTruckQty","default2":"车","required":"false","detailLinkVisiable":"false"}',
                    fieldConfigCode: "remainTruckQty"
                  }
                ]
              }
          },
        eleDefine = JSON.parse(localStorage.getItem('eleDefine')),
        eleInfo = JSON.parse(localStorage.getItem('eleInfo'));

      self.fields = utils.getParam(eleConfig, eleDefine, eleInfo).field;
      console.log("fields", self.fields);

      if (logisticsCode) {
        getResidueNum(logisticsCode, (success, error) => {
          if (success) {
            self.domainObject = success.content;
          }
        });
      }
    }
  };
</script>


<style lang="scss" rel="stylesheet/scss">
  .reference {
    .el-col-6 {
      width: 25%;
    }
    .el-col-24 {
      width: 100%;
    }
  }
</style>
