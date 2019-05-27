/**
* eleDate.vue
* Created by dsky on 17/6/20.
*/
<template>
  <div class="block">
    <el-form-item :prop="configData.field" :rules="rules" v-if="!isList && editable">
      <el-date-picker
        v-if="editable"
        :type="dateFormat"
        v-model="model"
        @change="handleChange"
        placeholder="选择日期"
        :class="configData.field"
        :format="configData.format"
        :readonly="configData.readonly === 'TRUE'">
      </el-date-picker>
    </el-form-item>
    <template v-if="isList && editable">
      <el-date-picker
        :type="dateFormat"
        v-model="model"
        @change="handleChange"
        placeholder="选择日期"
        :class="configData.field"
        :format="configData.format"
        :readonly="configData.readonly === 'TRUE'">
      </el-date-picker>
    </template>
    <span v-if="editable === false">{{ dateText }}</span>
  </div>
</template>

<script type="text/ecmascript-6">
  import { dealInputKey } from '../../../api/Utils';

  export default {
    name: 'eleDate',
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
      return {
        dateFormat: 'date',
        model: '',
        sync: true,
        dateText: ''
      };
    },
//    computed: {
//      text() {
//        return this.domainObject[this.configData.field];
//      }
//    },
    mounted() {
      if (!this.isList) {
        if (this.eventBus) {
          this.eventBus.$emit('eleMounted', this);
        } else {
          // 如果不在ele-form下使用此控件需要手动调用init方法
          this.init();
        }
      }

      this.$watch(`domainObject.${this.configData.field}`, (val) => {
        if (val) {
          this.dateText = this.getDateText();
          // 处理日期控件带出值不显示问题
          this.model = this.domainObject[this.configData.field];
        }
      });
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
      }
      this.dateFormat = this.configData.format ? 'datetime' : 'date';
      this.model = this.domainObject[this.configData.field];
      // const event = new Event('loadEleDone');
      // document.dispatchEvent(event);
      this.dateText = this.getDateText();
      if (!this.isList) {
        this.$watch('editable', (newVal, oldVal) => {
          console.log('编辑状态改变', newVal, oldVal);
          this.editable ? '' : this.dateText = this.getDateText();
        });
      }
    },
    methods: {
      getDateText() {
        const fmt = this.configData.format;
        var field = this.domainObject[this.configData.field];
//        console.log('格式化为：', fmt);
        if(field==null){
            return "";
        }
        field=field.toString()
        switch(fmt) {
          case 'yyyy':
            return field ? field.substring(0, 4) : '';
            break;
          case 'yyyy-MM':
            return field ? field.substring(0, 7) : '';
            break;
          case 'yyyy-MM-dd':
            return field ? field.substring(0, 10) : '';
            break;
          default:
            return field;
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
      handleChange(val) {
        console.log('changed', val, 'model', this.model);
        this.sync = false;
        // this.$set()
        // this.domainObject[this.configData.field] = val;
        this.$set(this.domainObject,this.configData.field,val);
        this.$watch(`domainObject.${this.configData.field}`, (newVal, oldVal) => {
          if(null == newVal){
            this.model = newVal;
          }
          if (this.sync) {
            this.model = newVal;
          } else {
            this.sync = true;
          }
        });
      },
      init() {
        console.log('field', this.configData.field, 'value', this.model);
        this.$watch(`domainObject.${this.configData.field}`, (val) => {
          if (this.sync) {
            this.model = val;
          } else {
            this.sync = true;
          }
        });
      }
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
</style>
