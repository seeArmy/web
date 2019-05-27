/**
* eleAutocomplete.vue
* Created by dsky on 17/6/20.
*/
<template>
  <div class="block">
    <el-form-item :prop="this.configData.field" :rules="rules" v-if="!isList && editable">
      <el-select
        v-model="domainObject[configData.field]"
        :placeholder="placeholder"
        clearable
        @change="handleSelect"
        v-if="editable"
        :disabled="configData.readonly === 'TRUE'">
        <el-option
          v-for="item in selectData"
          :key="item.id"
          :label="item.value"
          :value="item.id">
          <span style="float: left">{{ item.label }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
        </el-option>
      </el-select>
    </el-form-item>
    <template v-if="isList && editable">
      <el-select
        v-model="domainObject[configData.field]"
        :placeholder="placeholder"
        clearable
        @change="handleSelect">
        <el-option
          v-for="item in selectData"
          :key="item.id"
          :label="item.value"
          :value="item.id"
          :disabled="configData.readonly === 'TRUE'">
          <span style="float: left">{{ item.label }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
        </el-option>
      </el-select>
    </template>
    <span v-if="editable === false">{{text}}</span>
  </div>
</template>

<script type="text/ecmascript-6">
  import * as DataSourceService from '../../../api/DataSourceService';
  import * as utils from '../../../api/Utils';
  import PublicArea from '../../../api/PublicArea';

  const merge = require('webpack-merge');

  export default {
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
        selectData: [],
        state: '',
        ready: false,
        text: '',
        timeout: null,
        params: {},
        initValue: null
      };
    },
    computed:{
      placeholder(){
        if(this.configData.hasOwnProperty('placeholder')) return this.configData.placeholder;
        return '请选择';
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
        this.$emit('change', this.domainObject[this.configData.field]);
      },
      loadData(cb) {
        if (this.configData && this.configData.options && this.configData.optionsValue) {
          const optionValues = this.configData.optionsValue,
            optionLabels = this.configData.options,
            optionArray = [];
          for (let i = 0; i < optionValues.length; i += 1) {
            optionArray.push({ 'value': optionLabels[i], 'id': optionValues[i], 'data': { id: optionValues[i], value: optionLabels[i]} });
          }
          cb(optionArray);
        } else if (this.configData.datasource) {
          const dataSources = this.configData.datasource.split(',');
          if (DataSourceService[dataSources[0]]) {
            DataSourceService.getAll(dataSources, this.params, cb);
          }
        } else {
          cb(null);
        }
      },
      dataReady(options) {
        this.selectData = options;
        this.ready = true;
        this.refreshSelect();
      },
      handleSelect(item) {
        if (item) {
          const outputKey = this.configData.outputKey,
            selectedOption = this.selectData.find(option => option.id === item);
          console.log('config', this.configData, 'options', this.selectData, 'item', item);
          this.text = selectedOption.value;
          // this.domainObject[this.configData.field] = item;
          if (outputKey && this.selectData) {
            if (outputKey && selectedOption.data) {
              console.log('output', outputKey, selectedOption.data);
              PublicArea.set(outputKey, selectedOption.data);
            }
          }
        }
        this.$emit('change', item);
      },
      refreshSelect() {
        // console.log('refreshSelect====',this.selectData);
        // bug 不知道为什么 会出现 [null] 的情况
        // if(!this.selectData[0]){
        //   this.selectData = [];
        // }
        // console.log('field', this.configData.field, 'value', this.domainObject[this.configData.field], 'options', this.selectData);
        if (this.selectData) {
          let founded = false;
          this.selectData.forEach((value) => {
            if (value.id === (this.domainObject[this.configData.field] +'')) {
              this.text = value.value;
              founded = true;
            }
          });
          if (!founded) {
            this.domainObject[this.configData.field] = null;
            // 清除select时，删除对应的UnitName
            // this.domainObject[`${this.configData.outputKey}UnitName`] = null;
            // console.log('父级元素是==========', this.$parent);
            if (this.$parent.$parent.$children[1]) {
              this.domainObject[this.$parent.$parent.$children[1].field.field] = null;
            }
            // 详情页状态切换显示文字清空
            this.text = null;
          }
//          if (!founded && this.editable && !this.isList) {
//            this.domainObject[this.configData.field] = this.selectData[0].id;
//          }
        }
      },
      onRefresh(params) {
        //只是为了解决 运单中 单位的问题 带不出的问题 ，可能会存在bug
        // if(this.editable === false){
        //   return;
        // }


        console.log('onRefresh====');

//        console.log('field', this.configData.field, 'on refresh', params);
        if (params.datasource) {
          let datasource,
            result;
          datasource = params.datasource;

          /* eslint-disable no-cond-assign */
          while ((result = /\.([a-z])/.exec(datasource)) !== null) {
            datasource = datasource.replace(result[0], result[1].toUpperCase());
          }
          this.configData.datasource = datasource;
        }
        this.params = merge(this.params, params);
        this.loadData(this.dataReady);
      }
    },
    mounted() {
      // const urlParams = utils.getParamsFromURL(window.location.search);
//      this.domainObject[this.configData.field] = this.initValue;
      if (!this.isList) {
        if (this.eventBus) {
          this.eventBus.$emit('eleMounted', this);
          this.eventBus.$emit('emitEleSelect', this.configData.field, this.text);
        }
      } else {
        // if(this.configData.default) this.domainObject[this.configData.field] = this.configData.default;
          // 单有默认值 ，并且 本身没有值的时候，才会赋默认值
        if(this.configData.default) {
          this.domainObject[this.configData.field] = this.domainObject[this.configData.field] || this.configData.default;
        }
      }
      //default
       // bug描述：当第一次登陆进来,或则 退出账号，再次进来，那么 创建订单 中 计量标准 默认是 吨 ，但是 货物单价里面 没有根据 计量标准来 筛选下拉框。
       // 原因： this.loadData(this.dataReady) 以前在 created 中调用，此时 data 中的 params里面的值还没有拿到
       // 解决：1.延时执行(不是太好) 2.在created的时候 watch params，当值变化的时候，再次调用this.loadData(this.dataReady) --（比较耗费性能，因为 selected 是基础控件，用的地方很多，在计量标准的radio改变的时候，会触发到 里面的onRefresh方法）
       // 此bug 只在 初次登录才会出现，因此先暂时选择 延时加载的办法


       // let self = this;
       // setTimeout(function(){
       //  self.loadData(self.dataReady);
       // },500)

    },
    created() {
      if (!this.isList) {
        if (this.eventBus) {
          this.eventBus.$emit('eleCreated', this);
        }
      }
      this.initValue = this.domainObject[this.configData.field] === null || isNaN(this.domainObject[this.configData.field]) ?
        this.domainObject[this.configData.field] : this.domainObject[this.configData.field].toString();
//      this.domainObject[this.configData.field] = null;
//      console.log('field', this.configData.field, 'value', this.domainObject[this.configData.field]);
      if (!this.isList) {
        if (this.configData.inputKey) {
          utils.dealInputKey(this.configData.inputKey, (inputFieldKey, outData) => {
            this.domainObject[this.configData.field] = outData[inputFieldKey];
          });
        }
        if (this.configData.event && this.configData.event !== '' && this.eventBus) {
          let event = this.configData.event.replace(new RegExp('current', 'g'), '_ele');
          event = event.replace(new RegExp('rns\\[', 'g'), '_form.dispatchEvent(');
          event = event.replace(new RegExp('\\]\\.\\$emit\\(', 'g'), ', ');
          console.log('field', this.configData.field, 'select event', event);
          /* eslint-disable no-new-func */
          const listenerDefine = new Function('_ele', '_form', event);
          listenerDefine(this, this.eventBus);
        }
      }
      if (!this.isList) {
        this.$on('refresh', this.onRefresh);

        this.$watch(`domainObject.${this.configData.field}`, (val, oldval) => {
          console.log('检测到select值变更', this.configData.field,val, oldval);
//          if (this.editable === false) {
            this.refreshSelect();
//          }
        });

      }
      this.loadData(this.dataReady);

      // 监听 radio 切换
       // 监听外界的事件 radio change 事件
      // this.eventBus.$on('radioChanged',(type,val)=>{
        // console.log('radioChanged===',"type",type,"val",val);
        // if(type == 'meterageType') {
        //   this.codeUnitType = val;
        //   this.changeHandle(this.domainObject.goodsLossMethod,true);
        // }
     // });

    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
</style>
