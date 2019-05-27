/**
* eleAutocomplete.vue
* Created by dsky on 17/6/20.
*/
<template>
  <div class="block com_select" v-if='domainObject'>
    <el-select v-if="!isList && editable" v-model="domainObject[configData.field]" :placeholder="placeholder" clearable @change="handleSelect" :disabled="configData.readonly === 'TRUE'">
      <el-option v-for="item in selectData" :key="item.id" :label="item.value" :value="item.id">
        <span style="float: left">{{ item.label }}</span>
      </el-option>
    </el-select>
    <el-select v-if="isList && editable" v-model="domainObject[configData.field]" :placeholder="placeholder" clearable @change="handleSelect">
      <el-option v-for="item in selectData" :key="item.id" :label="item.value" :value="item.id" :disabled="configData.readonly === 'TRUE'">
        <span style="float: left">{{ item.label }}</span>
      </el-option>
    </el-select>
    <span v-if="editable === false">{{text}}</span>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  props: {
    configData: Object,
    editable: {
      type: Boolean,
      'default': true
    },
    domainObject: Object,
    selectData:Array
  },
  data() {
    return {
      isList: false,
    };
  },
  computed: {
    text(){
      let f = this.domainObject[this.configData.field];
      let op = this.selectData.find(option => option.id === f);
      console.log('-----------op',op);
      if(op && op.value ) return op.value;
      return'';
    },
    placeholder() {
      if (this.configData.hasOwnProperty('placeholder')) return this.configData.placeholder;
      return '请选择';
    }
  },
  methods: {
    handleSelect(val){
      console.log('val ...',val);
      if(this.configData.unitName){
        let op = this.selectData.find(option => option.id === val);
        if(op) {
          this.domainObject[this.configData['unitName']] = op.value;
        }
      }
    },
  },
  mounted() {
  },
  created() {}
};

</script>
<style lang="scss" rel="stylesheet/scss">
.com_select{
  display: inline-block !important;
  margin-left: 5px;
  margin-right: 5px;
}
</style>
