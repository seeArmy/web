/**
* eleStatus.vue
* Created by cc on 18/11/26.
*/
<template>
  <span class="ele-status" :class="value" :data-from="configData.fieldConfigCode" v-if="value !== 'cancel'" :title="getTitle(value)">
    <span class="es-item" v-for="(item, index) in statusData[configData.fieldConfigCode]"></span>
  </span>
  <span class="ele-status" :class="value" :data-from="configData.fieldConfigCode" :title="configData.fieldConfigCode === 'logisticsStatus' ? '订单取消' : '运单取消'" v-else>
  </span>
</template>

<script type="text/ecmascript-6">

  export default {
    name: 'eleStatus',
    inject: ['eventBus'],
    props: {
      value: String,
      isList: Boolean,
      configData: Object,
      editable: {
        type: Boolean,
        'default': true
      },
      domainObject: Object
    },
    data() {
      return {
        statusData: {
          'logisticsStatus': {
            'todo': '待执行',
            'doing': '执行中',
            'finish': '订单完成'
          },
          'waybillStatus': {
            'unloading': '待发货',
            'going': '运输中',
            'finish': '运输完成'
          }
        }
      };
    },
    methods: {
      getTitle(val) {
        switch(val) {
          case 'todo':
            return '待执行';
          case 'doing':
            return '执行中';
          case 'finish':
            return this.configData.fieldConfigCode === 'logisticsStatus' ? '订单完成' : '运输完成';
          case 'unloading':
            return '待发货';
          case 'going':
            return '运输中';
          case 'arrive':
            return '已到收货点';
        }
      },
      form() {
        let parent = this.$parent;
        if (parent) {
          while (parent && parent.$options && parent.$options.componentName !== 'eleForm') {
            parent = parent.$parent;
          }
          return parent;
        }
        return null;
      },
      init() {

      },
    },
    mounted() {
      if (this.eventBus) {
        this.eventBus.$emit('eleMounted', this);
      }
    },
    created() {
      console.log('this configData is', this.configData);
      if (this.eventBus) {
        this.eventBus.$emit('eleCreated', this);
      }
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
.ele-status {
  + [isList = 'true'] {
    display: none;
  }
  .es-item {
    display: inline-block;
    vertical-align: middle;
    width: 20px;
    height: 20px;
    margin-right: 2px;
    border: solid 1px #ddd;
  }
}
  .todo,.unloading {
    .es-item:first-child {
      background-color: #1cba6a;
      border-color: #1cba6a;
    }
  }
  .doing,.going,.arrive {
    .es-item:first-child, .es-item:nth-child(2) {
      background-color: #1cba6a;
      border-color: #1cba6a;
    }
  }
  .finish {
    .es-item:first-child,.es-item:nth-child(2),.es-item:nth-child(3) {
      background-color: #1cba6a;
      border-color: #1cba6a;
    }

  }
  .cancel {
    position: relative;
    display: inline-block;
    vertical-align: middle;
    width: 60px;
    height: 20px;
    margin-top: -1px;
    &::after {
      content: '';
      position: absolute;
      top: 8px;
      left: 10%;
      width: 80%;
      height: 1px;
      background-color: #eee;
    }
  }
  [data-from = 'waybillStatus'] {
    .es-item {
      border-radius: 100%;
    }
  }
</style>
