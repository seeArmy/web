<template>
  <div>
    <div class="computed-component">
      <div class="list-title self-title">基本信息</div>
      <hr class="hr">
      <el-row class="view-item">
        <el-col :span="8">
          应收账单号:{{submitData.billNo}}
        </el-col>
        <el-col :span="8">
          账单状态：{{waybillStatus()}}
        </el-col>
        <el-col :span="8">
          开票状态：{{ submitData.invoiced === 'yes' ? '已开票' : '未开票' }}
        </el-col>
        <el-col :span="8">
          收款方： <span class="userinfo-name">{{showData.selfName}}</span> <span class="userinfo-tip">[本公司]</span>
        </el-col>
        <el-col :span="8">
          付款方：<span class="userinfo-name">{{params.clientOrgName}}</span> <span class="userinfo-tip">[客户]</span>
        </el-col>
      </el-row>
    </div>
  </div>

</template>

<script>
  export default {
    name: 'create_title',
    data() {
      return {
        receivableStatusSelect: {
          list: [{
            value: 'none',
            label: '未收款'
          }, {
            value: 'part',
            label: '部分收款'
          }, {
            value: 'all',
            label: '全部收款'
          }]
        }
      };
    },
    props: {
      params: {
        type: Object,
        default() {
          return {};
        }
      },
      showData: {
        type: Object,
        default() {
          return {};
        }
      },
      submitData: {
        type: Object,
        default() {
          return {};
        }
      },
      readonly: {
        type: Boolean,
        'default': false
      }
    },
    methods: {
      waybillStatus() {
        const formats = {
          none: '待提交审核',
          pend: '待审核',
          accept: '审核通过',
          reject: '审核不通过',
          destroy: '已作废'
        };
        return formats[this.submitData.receivableBillStatus];
      },
      receivableStatus() {
        const formats = {
          none: '未收款',
          part: '部分收款',
          all: '全部收款'
        };
        return formats[this.submitData.receivableStatus];
      },
      init() {

      }
    },
    mounted() {
      this.init();
    },
    watch: {
      $route() {
        this.init();
      }
    }
  };
</script>

<style lang="scss">
  .view-item{
    width: 100%;
    display: inline-block;
    line-height: 24px;

    .item{
      width: 400px;
      display: inline;
      float: left;
    }
  }
</style>
