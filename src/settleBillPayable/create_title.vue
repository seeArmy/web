<template>
  <div>
    <div v-if="readonly || params.billCode">
       <div class='view-item'>
        <div class="item">账单编号：{{submitData.billNo}}</span></div>
      </div>
      <div class='view-item'>
        <div class="item">账单状态：{{waybillStatus()}}</span></div>
        <div class="item">付款状态：
          <span v-if="readonly">{{payStatus()}}</span>
          <select v-if="!readonly" v-model="submitData.payStatus">
            <option :value="item.value" v-for="(item,index) in payStatusSelect.list" :key='index'>{{item.label}}</option>
          </select>
        </div>
      </div>
    </div>
    <div class="view-item">
      <div class="item">收款方： <span class="userinfo-name">{{params.carrierOrgName}}</span> <span class="userinfo-tip">[承运商]</span>
      </div>
      <div class="item">付款方：<span class="userinfo-name">{{showData.selfName}}</span> <span
        class="userinfo-tip">[本公司]</span>
      </div>
    </div>
  </div>
  
</template>

<script>
  export default {
    name: 'create_title',
    data() {
      return {
        payStatusSelect: {
          list: [{
            value: 'none',
            label: '未付款'
          }, {
            value: 'part',
            label: '部分付款'
          }, {
            value: 'all',
            label: '全部付款'
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
        return formats[this.submitData.payableBillStatus];
      },
      payStatus() {
        const formats = {
          none: '未付款',
          part: '部分付款',
          all: '全部付款'
        };
        return formats[this.submitData.payStatus];
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
