/**
* eleCheckbox.vue
* Created by dsky on 17/6/19.
*/
<template>
  <div class="block">
    <el-form-item :prop="this.configData.field" :rules="rules" v-if="!isList && editable">
      <el-checkbox-group
        v-model="configData.value">
        <el-checkbox @change="checkChange"
          :label="configData.optionsValue[index]"
          v-for="(value, index) in configData.optionsValue"
          :disabled="configData.readonly === 'TRUE'"
          :key="value">{{configData.options[index]}}</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <template v-if="isList && editable">
      <el-checkbox-group
        v-model="configData.value">
        <el-checkbox
          :label="configData.optionsValue[index]"
          v-for="(value, index) in configData.optionsValue"
          :disabled="configData.readonly === 'TRUE'"
          :key="value">{{configData.options[index]}}</el-checkbox>
      </el-checkbox-group>
    </template>
    <span v-if="editable === false">{{text}}</span>
  </div>
</template>

<script type="text/ecmascript-6">
  import { dealInputKey } from '../../../api/Utils';

  export default {
    name: 'eleCheckbox',
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
      text() {
        // console.log('this.domainObject is', this.domainObject);
        // console.log('domainObject[field]', this.domainObject[this.configData.field]);
        // console.log('this.configData is', this.configData);
        const modelValue = this.domainObject[this.configData.field], // (4.2,7.7,....)
          optionValue = this.configData.optionsValue, // [4.2,7.7...]
          optionText = this.configData.options; //[4.2米，7.7米 ...]
        let text = '';
        if (modelValue && (modelValue.length > 1 || modelValue.indexOf(',') > -1)) {
          const valArray = Array.isArray(modelValue) ? modelValue : modelValue.split(','),
            textArray = [];
          valArray.forEach((val, index) => {
            if (optionValue.indexOf(val) > -1) {
              textArray.push(optionText[optionValue.indexOf(val)]);
            }
          });
          text = textArray.join('，');
          return text;
        }
        optionValue.forEach((val, index) => {
          if (val === modelValue[0]) {
            text = optionText[index];
          }
        });
        return text;
      }
    },
    methods: {
      isArray(val) {
        if (typeof Array.isArray === 'function') {
          return Array.isArray(val);
        }
        return Object.prototype.toString.call(val) === '[object Array]';
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
      checkChange() {
        this.domainObject[this.configData.field] = this.configData.value;
      },
      init() {

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
      const checkList = this.domainObject[this.configData.field];
      if (!this.isList) {
        if (this.eventBus) {
          this.eventBus.$emit('eleCreated', this);
        }
      }
      if (checkList && !this.isArray(checkList)) {
        this.configData.value = checkList.split(',');
        // console.log('checkbox group is', checkList);
      }
      if (!this.isList) {
        if (this.configData.inputKey) {
          dealInputKey(this.configData.inputKey, (inputFieldKey, outData) => {
            this.domainObject[this.configData.field] = outData[inputFieldKey];
          });
        }
      }
      // const event = new Event('loadEleDone');
      // document.dispatchEvent(event);
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
</style>
