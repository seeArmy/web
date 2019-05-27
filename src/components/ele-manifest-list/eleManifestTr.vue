<!-- 货单列表 -->
<template>
  <tr>
    <!-- left checkbox start    =====================   -->
    <td class="fix-col" v-if="editable && selectable">
      <input type="checkbox" class="ck-single" v-model="list.checked" @click.native="selectRow(list)">
    </td>
    <!-- left checkbox end        =====================   -->
    <td v-show="editable && operatable" class="fix-col">
      <el-button @click="delRow(index)">删除</el-button>
    </td>
    <td v-for="(column,index) in columnsData" :class="{ 'fix-col': column.extraParams[0].freeze }" :key="index">
      <ele-block :field="column" :domainObject="list" :editable="isIncludeEditableFields(column.fieldConfigCode)" :uploadUrl="uploadUrl" :isList="false"></ele-block>
    </td>
  </tr>
</template>
<script type="text/ecmascript-6">
import eleBlock from '../ele-block/eleBlock.vue';
import '../vueDirectives';
import * as util from '../../../api/Utils';
const axios = require('axios');
export default {
  name: 'manifestTr',
  components: {
    'ele-block': eleBlock
  },
  props: {
    columnsData: Array,
    list: Object,
    selectable: { // 默认有勾选框
      type: Boolean,
      'default': true
    },
    // 是否显示 删除 按钮
    operatable: {
      type: Boolean,
      'default': false
    },
    indexMark: {
      type: Number,
      'default': 0
    },
    isEdit: {
      type: Boolean,
      'default': true
    },
    editable: {
      type: Boolean,
      'default': true
    },
    editableFields: Array,
    uploadUrl: String
  },
  data() {
    return {
      projectName: JSON.parse(localStorage.getItem('appInfo')).projectName || ''
    };
  },
  watch:{
    'list': {
      handler:function() {
        console.log('deep watch effect single list object has changed.....');
        this.$emit('singleListValueChange', this.indexMark, this.list);
      },
      deep:true
    },
    'list.goodsName': {
      handler:function() {
        // console.log('deep watch effect   goodsName');
        this.$emit('fieldChange','goodsName',this.indexMark);
      },
      deep:true
    },
    'list.goodsCategory': {
      handler:function() {
        // console.log('deep watch effect goodsCategory');
        this.$emit('fieldChange','goodsCategory',this.indexMark);
      },
      deep:true
    },
    'list.meterageType': {
      handler:function() {
        // console.log('deep watch effect meterageType');
        this.$emit('fieldChange','meterageType',this.indexMark);
      },
      deep:true
    }
  },
  methods: {
    // #### 组件逻辑 
    // 是否包含传入的数组
    isIncludeEditableFields(field){
      if(this.editableFields && this.editableFields.length>0){
        return this.editable && this.editableFields.includes(field);
      }
      return this.editable;
    },
    // 点击 checkbox  
    selectRow(row) {
      console.log('click row', row.checked);
      if (!row.rowDisabled) {
        let ckNum = 0;
        if ('FALSE' != row.checkboxStatus) { // 只有在 checked 配置了显示 才会生效
          this.$set(row, 'checked', !row.checked);
        }
        this.listData.forEach((item) => {
          if (item.checked) {
            ckNum += 1;
          }
        });
        this.batchSelect = ckNum === this.listData.length;
      } else {
        this.$message({
          type: 'warning',
          message: '该列不可编辑！',
          duration: 3000
        });
      }
    },
    delRow(index) {
      this.listData.splice(index, 1);
    },
  },
  created() {
  },
  mounted() {
    this.$nextTick(()=>{
      this.$emit('eleManifestTrMounted');
    })
  }
};

</script>
<style lang="scss" rel="stylesheet/scss">
</style>
