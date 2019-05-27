<script src="../../../api/httpUtil.js"></script>/** * eleAutocomplete.vue * Created by dsky on 17/6/20. */
<template>
  <div class="block">
    <el-form-item :prop="this.configData.field" :rules="rules" v-if="!isList && editable">
      <el-autocomplete v-if="editable" v-model="domainObject[configData.field]" :readonly="configData.readonly === 'TRUE'" :disabled="configData.readonly === 'readonly' || configData.readonly === 'TRUE'" :fetch-suggestions="querySearchAsync" :placeholder="configData.placeholder" ref="auto" @select="handleSelect">
      </el-autocomplete>
    </el-form-item>
    <template v-if="isList && editable">
      <el-autocomplete v-model="domainObject[configData.field]" :readonly="configData.readonly === 'TRUE'"  :disabled="configData.readonly === 'readonly'" :fetch-suggestions="querySearchAsync" :placeholder="configData.placeholder" ref="auto" @select="handleSelect">
      </el-autocomplete>
    </template>
    <span v-if="editable === false">
      <template v-if="detailUrl">
        <span v-if=" configData.isShowLink === 'off' ">{{domainObject[configData.field]}}</span>
        <a v-else href="javascript:;" class="blue" :data-link="detailUrl" :data-title="`${objectName}详情`" title="查看详情">
          {{domainObject[configData.field]}}
        </a>
      </template>
      <template v-else>
        {{domainObject[configData.field]}}
      </template>
    </span>
  </div>
</template>
<script type="text/ecmascript-6">
import * as DataSourceService from '../../../api/DataSourceService';
import { dealInputKey } from '../../../api/Utils';
import PublicArea from '../../../api/PublicArea';

export default {
  inject: ['eventBus'],
  props: {
    isList: Boolean,
    configData: Object,
    domainObject: Object,
    editable: {
      type: Boolean,
      'default': true
    },
    inputKey: Array,
    rules: Array
  },
  data() {
    return {
      autoComplete: [],
      code: '',
      platformClientOrgCode: undefined,
      objectName: '',
      isDetail: false,
      detailUrl: '',
      //        state: '',
      timeout: null
    };
  },
  watch: {
    // 'editable': function(newVal, oldVal) {
    //   console.log('autocomplete status changed, newVal is', newVal, 'oldVal is', oldVal);
    //   if (!newVal) {
    //     console.log('newVal is', newVal);
    //     const dataSources = this.configData.datasource.split(','),
    //       url = DataSourceService[dataSources[0]].getDetailUrl(this.code, this.objectName);
    //     this.detailUrl = `${url}${url.indexOf('?') !== -1 ? '&' : '?'}code=${this.code}&editable=false`;
    //   }
    // }
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
    loadAll() {
      return this.autoComplete;
    },
    querySearchAsync(query, cb) {
      let queryString = query,
        params = {};
      if (this.configData.maxLength && this.editable) {
        if (this.domainObject[this.configData.field] && this.domainObject[this.configData.field].length > this.configData.maxLength) {
          queryString = queryString.substring(0, this.configData.maxLength);
          this.domainObject[this.configData.field] = queryString;
          this.$refs.auto.$refs.input.setCurrentValue(queryString);
        }
      }
      //        console.log(this.configData.datasource);
      // const key = this.$parent.$parent.$children[1].field.field,
      //   dataSources = this.configData.datasource.split(',');

      let key = '';
      if(this.$parent && this.$parent.$parent && this.$parent.$parent.$children && this.$parent.$parent.$children[1]){
         key = this.$parent.$parent.$children[1].field.field
      }

      const dataSources = this.configData.datasource.split(',');

      if (queryString) {
        params = { keyword: queryString };
      } else {
        params = { keyword: '' };
      }
      DataSourceService.getAll(dataSources, params, (success) => {
        if (success) {
          const autoComplete = success;
          let results = queryString ? autoComplete.filter(this.createStateFilter(queryString)) : autoComplete;
          if (!results.length) {
            this.domainObject[key] = '';
            results = [{ 'value': '暂无数据', 'id': null }];
          }
          cb(results);
        }
      });
    },
    createStateFilter(queryString) {
      return state => state.value.indexOf(queryString) >= 0;
    },
    handleSelect(item) {
      // TODO 输出多个属性
      //        (0, eval)(`vm.$children[0].domainObject.${this.configData.field} = "${item.value}"`);
      this.domainObject[this.configData.field] = item.name;
      /*        this.$nextTick(() => {
              });*/
      if (this.configData.outputKey) {
        const outputKey = this.configData.outputKey;
        PublicArea.set(outputKey, item.data);
      }
    },
    returnObjName(val) {
      switch (val) {
        case 'truck':
          this.objectName = '车辆';
          break;
        case 'trailer':
          this.objectName = '挂车';
          break;
        case 'driver':
          this.objectName = '司机';
          break;
        case 'partner':
          this.objectName = '伙伴';
          break;
        case 'waybill':
          this.objectName = '运单';
          break;
        case 'route':
          this.objectName = '线路';
          break;
        case 'rates':
          this.objectName = '运价';
          break;
        case 'logistics':
          this.objectName = '订单';
          break;
        case 'outsourcingLogistics':
          this.objectName = '外包订单';
          break;
        case 'transport':
          this.objectName = '车辆';
          break;
        case 'tyre':
          this.objectName = '轮胎';
          break;
        case 'quote':
          this.objectName = '询价单报价';
          break;
        default:
          this.objectName = '';
      }
    },
    showDetail() {
      // console.log('children is', this.$parent.$parent.$children);
      const dataSources = this.configData.datasource.split(','),
        ls = JSON.parse(localStorage.getItem('userInfo')),
        lsOrgCode = ls.orgCode;
      if (this.$parent.$parent.$children.length > 3) {
        this.platformClientOrgCode = this.domainObject[this.$parent.$parent.$children[3].field.field];
        let codeName = this.$parent.$parent.$children[3].field.field;
        if ('platformClientOrgCode' == codeName || 'platformCarrierOrgCode' == codeName || 'platformPayerOrgCode' == codeName || 'platformPayeeOrgCode' == codeName || 'platformOwnerOrgCode' == codeName || 'platformOriginalConsignOrgCode' == codeName || 'platformConsignOrgCode' == codeName) {
          codeName = 'orgCode';
        } else if ('platformTruckCode' == codeName || 'platformTrailerTruckCode' == codeName) {
          codeName = 'truckCode';
        } else if ('platformDriverCode' == codeName || 'platformViceDriverCode' == codeName || 'payeePlatformDriverCode' ==codeName || 'payeePlatformViceDriverCode' == codeName || 'platformUserCode' == codeName) {
          codeName = 'userCode';
        }
        else if ('platformTruckCode' == codeName ) {
          codeName = 'truckCode';
        }
        else if ('platformLoadingOrgCode' == codeName || 'platformUnloadingOrgCode' == codeName) {
          codeName = 'orgCode';
        }
        //委托收款人 跳转
        else if ('authorizePayeePlatformCode' == codeName) {
          codeName = 'userCode';
        }




        if (this.$parent.$parent.$children[1]) {
          this.code = this.domainObject[this.$parent.$parent.$children[1].field.field]; // 通过父元素拿相邻元素的CODE
        }

        if (codeName && this.platformClientOrgCode && this.platformClientOrgCode !== lsOrgCode) {
          this.returnObjName(this.configData.datasource);
          this.isDetail = true;
          const url = DataSourceService[dataSources[0]].getDetailUrl(this.code, this.objectName);
          // console.log('url123 ...',url,dataSources[0],this.code);
          this.detailUrl = `${url}${url.indexOf('?') !== -1 ? '&' : '?'}${codeName}=${this.platformClientOrgCode}&editable=false`;
           // console.log('detailUrl111 ...',this.detailUrl,this.configData);

           // 在从运单外包列表 里面的 来源订单 点击进去 订单详情，在url 上添加参数 defaulUrlParm:formOutsourcingWaybill
            if(this.configData.defaulUrlParm){
              // 说明需要 在url 上添加特殊参数
              this.detailUrl = `${this.detailUrl}&${this.configData.defaulUrlParm}=true`;
            }
        }
        return;
      }

      if (this.$parent.$parent.$children[1]) {
        this.code = this.domainObject[this.$parent.$parent.$children[1].field.field]; // 通过父元素拿相邻元素的CODE

        console.log('code ....', this.code);

        if (this.code) {
          this.returnObjName(this.configData.datasource);
          this.isDetail = true;
          const url = DataSourceService[dataSources[0]].getDetailUrl(this.code, this.objectName);
          this.detailUrl = `${url}${url.indexOf('?') !== -1 ? '&' : '?'}code=${this.code}&editable=false`;
          // console.log('detailUrl222 ...',this.detailUrl,this.configData);
              // 在从运单外包列表 里面的 来源订单 点击进去 订单详情，在url 上添加参数 defaulUrlParm:formOutsourcingWaybill
            if(this.configData.defaulUrlParm){
              // 说明需要 在url 上添加特殊参数
              this.detailUrl = `${this.detailUrl}&${this.configData.defaulUrlParm}=true`;
            }
        }



      }

    }
  },
  mounted() {
    if (!this.isList) {
      if (this.eventBus) {
        this.eventBus.$emit('eleMounted', this);
      }
    }
    if (!this.isList) {
      this.$nextTick(() => {
        if (this.configData.inputKey) {
          dealInputKey(this.configData.inputKey, (inputFieldKey, outData) => {
            this.domainObject[this.configData.field] = outData[inputFieldKey];
          });
        }
      });

    }
  },
  created() {
    const dataSources = this.configData.datasource.split(',');
    if (!this.isList) {
      if (this.eventBus) {
        this.eventBus.$emit('eleCreated', this);
      }
      // console.log('ele-autocomplete configData: ', this.configData);
      // console.log('this text ', this.domainObject[this.configData.field]);
      this.$on('select', function(item) {
        this.handleSelect(item);
      });
    }
    // console.log('autocomplete');
    // const dataSources = this.configData.datasource.split(',');
    // document.dispatchEvent(event);
    if (this.configData.controlType === 'autocomplete' && !DataSourceService[dataSources[0]]) {
      //        console.error(`error, ${this.configData.field} in DataSourceService is not find`);
      return false;
    }
    // console.log('configData', this.configData);
    // if (!this.isList) {
    //   if (this.configData.inputKey) {
    //     dealInputKey(this.configData.inputKey, (inputFieldKey, outData) => {
    //       this.domainObject[this.configData.field] = outData[inputFieldKey];
    //     });
    //   }
    // }
    // console.log('this.configData', this.configData);
    // console.log('this.domainObject', this.domainObject);
    // 详情页跳转
    this.$nextTick(() => {
      this.showDetail();
    });
    // 如果值发生改变，详情链接重新生成
    this.$watch(`domainObject.${this.configData.field}`, (newVal, oldVal) => {
      console.log('autocomplete value changed, newVal is', newVal, 'oldVal is', oldVal);
      if (newVal) {
        this.showDetail();
      }
    });
  }
};

</script>
<style lang="scss" rel="stylesheet/scss">
.el-autocomplete[readonly] {
  position: relative;
  &::before {
    content: '';
    position: absolute;
    z-index: 20;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    cursor: not-allowed;
  }
}

</style>
