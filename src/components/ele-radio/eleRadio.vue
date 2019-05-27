/**
* eleRadio.vue
* Created by dsky on 17/6/19.
*/
<template>
  <div class="block">
    <el-form-item v-if="!isList && editable" :prop="this.configData.field" :rules="rules" :id="`radio-${configData.field}`">
      <el-radio-group v-if="editable" v-model="domainObject[configData.field]" @change="changeHandle">
        <el-radio :disabled=' index | disabledVal(isControl,controlObj,configData)'  :label="value" v-for="(value, index) in configData.optionsValue" :key="value">
          {{configData.options[index]}}
        </el-radio>
      </el-radio-group>
    </el-form-item>
    <template v-if="isList && editable">
      <el-radio-group v-model="domainObject[configData.field]" @change="changeHandle">
        <el-radio :disabled=' index | disabledVal(isControl,controlObj,configData)' :label="value" v-for="(value, index) in configData.optionsValue" :key="value">
          {{configData.options[index]}}
        </el-radio>
      </el-radio-group>
    </template>
    <span v-if="editable === false">{{text}}</span>
  </div>
</template>

<script type="text/ecmascript-6">
  import { dealInputKey } from '../../../api/Utils';

  export default {
    name: 'eleRadio',
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
    data() {
      return{
        isControl:false,
        controlObj:null
      }
    },
    filters: {
      disabledVal: function(index,isControl,controlObj,configData) {
        if(isControl){
          if(controlObj && controlObj.hasOwnProperty('i') && controlObj.hasOwnProperty('v')){
            if(index == controlObj['i']){
              return controlObj['v'];
            }
          }
        }
        return configData.disabled;
      },
    },
    computed: {
      text() {
        let modelValue = this.domainObject[this.configData.field];
        if (modelValue !== null && typeof modelValue !== 'undefined' && this.configData.optionsValue) {
          modelValue = modelValue.toString();
          for (let i = 0, len = this.configData.optionsValue.length; i < len; i += 1) {
            if (modelValue === this.configData.optionsValue[i].toString()) {
              modelValue = this.configData.options[i];
              break;
            }
          }
        }
        return modelValue;
      }
    },
    mounted() {
      const modelValue = this.domainObject[this.configData.field];
      if (modelValue !== null && typeof modelValue !== 'undefined' && this.configData.optionsValue) {
        const strValue = `${modelValue}`;
        for (let i = 0, len = this.configData.optionsValue.length; i < len; i += 1) {
          if (strValue === this.configData.optionsValue[i].toString()) {
            this.$set(this.domainObject, this.configData.field, this.configData.optionsValue[i]);
            break;
          }
        }
      }
      if (!this.isList) {
        if (this.eventBus) {
          this.eventBus.$emit('eleMounted', this);
          this.eventBus.$emit('radioChanged',this.configData.field,this.domainObject[this.configData.field])
        }
      }
    },
    methods: {
      setValIsControl(isControl,controlObj){
        this.isControl = isControl;
        this.controlObj = controlObj;

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
//        console.log('field', this.configData.field, 'init change', this.domainObject[this.configData.field]);
        this.$emit('change', this.domainObject[this.configData.field]);
      },
      changeHandle(val) {
//        console.log('field', this.configData.field, 'change', val);
        this.$emit('change', val);
        console.log(' radio change ...');
        // this.eventBus.$emit('radioChanged',val)
        this.eventBus.$emit('radioChanged',this.configData.field,val)
      }
    },
    created() {
      if (!this.isList) {
        if (this.eventBus) {
          this.eventBus.$emit('eleCreated', this);
        }
//      window.rns[this.configData.field] = this;
        if (this.configData.inputKey) {
          dealInputKey(this.configData.inputKey, (inputFieldKey, outData) => {
            this.domainObject[this.configData.field] = outData[inputFieldKey];
          });
        }
        if (this.configData.event && this.configData.event !== '' && this.eventBus) {
          let event = this.configData.event.replace(new RegExp('current', 'g'), '_ele');
          event = event.replace(new RegExp('rns\\[', 'g'), '_form.dispatchEvent(');
          event = event.replace(new RegExp('\\]\\.\\$emit\\(', 'g'), ', ');
          console.log('event... ',event);
          try {
            /* eslint-disable no-new-func */
            const listenerDefine = new Function('_ele', '_form', event);
            listenerDefine(this, this.eventBus);
          } catch (e) {
            console.error('ele-radio bind event failed', JSON.stringify(this.configData), 'error', e);
          }
//        (0, eval)(event);
        }
      }
      // const event = new Event('loadEleDone');
      // document.dispatchEvent(event);
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
</style>
