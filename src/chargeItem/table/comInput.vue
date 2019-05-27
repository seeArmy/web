/**
* eleInput.vue
* Created by dsky on 17/6/19.
*/
<template>
  <div class="block">
    <el-input v-if="!isList && editable" v-model="domainObject[configData.field]" :name="configData.field" :placeholder="configData.placeholder" :maxlength="configData.maxLength" :readonly="configData.readonly==='true'" :disabled="configData.readonly==='readonly'"></el-input>
    <el-input v-if="isList && editable" v-model="domainObject[configData.field]" :name="configData.field" :placeholder="configData.placeholder" :maxlength="configData.maxLength" :readonly="configData.readonly==='true'" @focus="handleFocus" :disabled="configData.readonly==='readonly'"></el-input>
    <span v-if="editable === false">{{text}}</span>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  name: 'eleInput',
  props: {
    configData: Object,
    editable: {
      type: Boolean,
      'default': true
    },
    domainObject: Object,
  },
  data() {
    return {
      isList: false,
    }
  },
  computed: {
    text() {
      if (this.domainObject && this.configData && 'field' in this.configData && this.configData.field in this.domainObject) {
        return this.domainObject[this.configData.field];
      }
      return this.configData.default ? this.configData.default : '';
    }
  },
  methods: {},
  mounted() {},
  created() {},
};

</script>
<style lang="scss" rel="stylesheet/scss">
</style>
