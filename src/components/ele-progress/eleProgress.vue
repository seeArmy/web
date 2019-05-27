/**
* eleProgress.vue
* Created by cc on 18/11/26.
*/
<template>
  <span class="progress">
    <span class="progress-highlight" :style="{width: percent + '%'}"></span>
    <span class="progress-text">{{ percent + '%' }}</span>
  </span>
</template>

<script type="text/ecmascript-6">

  export default {
    name: 'eleProgress',
    inject: ['eventBus'],
    props: {
      percent: {
        type: Number,
        'default': 0
      },
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
      };
    },
    methods: {
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
      console.log('this percent is', this.percent);
      if (this.eventBus) {
        this.eventBus.$emit('eleCreated', this);
      }
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
.progress {
  position: relative;
  display: inline-block;
  vertical-align: middle;
  width: 100%;
  height: 20px;
  overflow: hidden;
  background-color: #fff;
  border: solid 1px #ddd;
  + [isList = 'true'] {
    display: none;
  }
  .progress-highlight {
    position: absolute;
    top: 0;
    left: 0;
    height: 20px;
    line-height: 20px;
    text-align: center;
    background-color: #1cba6a;
    transition: width .2s ease-in-out;
  }
  .progress-text {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    line-height: 20px;
    color: #fff;
    text-shadow: 1px 1px 0 #999;
  }
}
</style>
