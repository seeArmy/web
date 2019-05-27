/**
* eleNumber.vue
* Created by dsky on 17/6/19.
*/
<template>
  <div class="block">
    <el-form-item v-if="!isList && editable" :prop="this.configData.field" :rules="rules">
      <el-input
        v-model.number="domainObject[configData.field]"
        :name="configData.field"
        :class="configData.field"
        :maxlength="configData.maxLength"
        :readonly="configData.readonly===true"
        :placeholder="placeholder"
        @focus="handleFocus"
        @change="handleChange"
        :disabled="configData.readonly==='readonly'"></el-input>
    </el-form-item>
    <template v-if="isList && editable">
      <el-input
        v-model.number="domainObject[configData.field]"
        :name="configData.field"
        :class="configData.field"
        :maxlength="configData.maxLength"
        :readonly="configData.readonly===true"
        :placeholder="placeholder"
        @focus="handleFocus"
        @change="handleChange"
        :disabled="configData.readonly==='readonly'"></el-input>
    </template>
    <span v-if="editable === false">{{text}}</span>
  </div>
</template>

<script type="text/ecmascript-6">
  import { dealInputKey } from '../../../api/Utils';

  const pattern = /-?\d+\.\d+|-?\d+\.|-?\d+|-/;

  export default {
    name: 'eleNumber',
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
    mounted() {
      if (!this.isList) {
        if (this.eventBus) {
          this.eventBus.$emit('eleMounted', this);
          this.eventBus.$emit('emitEleNumber', this.configData.field, this.text);
        }
      }
    },
    created() {
      if (!this.isList) {
        if (this.eventBus) {
          this.eventBus.$emit('eleCreated', this);
        }
      }
      // console.log(this.configData.field);
      this.configData.maxLength = this.configData.maxLength ? Number(this.configData.maxLength) : 1000;
      if (!this.isList) {
        if (this.configData.inputKey) {
          dealInputKey(this.configData.inputKey, (inputFieldKey, outData) => {
            this.domainObject[this.configData.field] = outData[inputFieldKey];
          });
        }
      }
      // const event = new Event('loadEleDone');
      // document.dispatchEvent(event);
    },
    computed: {
      placeholder(){
        if(this.configData.hasOwnProperty('placeholder')) return this.configData.placeholder;
        return '请填写数字';
      },
      text() {
        if (this.domainObject && this.configData && this.configData.field in this.domainObject) {
          return this.domainObject[this.configData.field];
        }
        return '';
      }
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
      handleFocus() {
//        this.$forceUpdate();
      },
      handleChange(val) {
        // console.log('num ...111',JSON.stringify(this.domainObject));
        const obj = pattern.exec(val);
        let text = '';
        if (obj) {
          text = obj.join('');
        }
        this.$nextTick(() => {
          this.domainObject[this.configData.field] = text;
        });
        // console.log('num ...222',JSON.stringify(this.domainObject));
      }
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
</style>
