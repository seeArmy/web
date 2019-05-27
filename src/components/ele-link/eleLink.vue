<template>
  <div class="block">
    <span @click="onClick(item)" v-for="item in textArray" class="file-download blue">{{ item }}</span>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name: 'eleLink',
    inject: ['eventBus'],
    props: {
      isList: Boolean,
      configData: Object,
      editable: {
        type: Boolean,
        'default': true
      },
      domainObject: Object,
      rules: Array
    },
    computed: {
      textArray() {
        if (this.domainObject && this.configData && 'field' in this.configData && this.configData.field in this.domainObject) {
          const valArray = this.domainObject[this.configData.field].split('@@@@');
          return valArray;
        }
        return this.configData.default ? this.configData.default : '';
      }
    },
    methods: {
      init() {},
      onClick(item) {
        this.$emit('click', this.domainObject, item);
      }
    },
    mounted() {
      if (!this.isList) {
        if (this.eventBus) {
          this.eventBus.$emit('eleMounted', this);
        }
      }
    },
    created() {
      if (!this.isList) {
        if (this.eventBus) {
          this.eventBus.$emit('eleCreated', this);
        }
      }
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  .file-download {
    display: block;
    margin-right: 20px;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
</style>
