<template>
  <tr>
    <slot></slot>
  </tr>
</template>
<script type="text/ecmascript-6">
//  import Vue from 'vue';

  export default {
    name: 'eleTr',
    componentName: 'eleTr',
    provide: {
      eventBus: null
    },
    data() {
      return {
        elementCount: 0,
        elementLoadedCount: 0,
        elementChildren: []
      };
    },
    methods: {
      dispatchEvent(target, event, data) {

        debugger

//        console.log('dispatch event', event, 'to', target, 'data', data);
        this.elementChildren.forEach((ele) => {
          if (ele.fieldName === target) {
            ele.element.$emit(event, data);
          }
        });
      },
      getElementByField(field) {
        const ele = this.elementChildren.find(ele => ele.fieldName === field);
        if (ele) {
          return ele.element;
        }
        return null;
      },
      mountedDone() {
        this.elementChildren.forEach((ele) => {
          ele.element.init();
        });
        this.$emit('formMounted', this);
      }
    },
    created() {
      const self = this;
      /* eslint-disable no-underscore-dangle */
      self._provided.eventBus = this;
      self.eventBus = self._provided.eventBus;
//      this.eventBus = new Vue();
//      console.log('created root eventBus', this.eventBus);
      this.eventBus.$on('eleCreated', (ele, fieldName) => {
        const field = fieldName ? fieldName : ele.configData.field;
        this.elementChildren.push({fieldName: field, element: ele});
      });
      this.eventBus.$on('eleMounted', () => {
        this.elementLoadedCount += 1;
        if (this.elementLoadedCount === this.elementChildren.length) {
          this.mountedDone();
        }
      });
    }
  };
</script>
