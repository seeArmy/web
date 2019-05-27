<template>
<el-popover
  placement="bottom"
  width="400"
  trigger="click">
  <el-row>
    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选({{checkedColumns.length}}/{{columnData.length}})</el-checkbox>
    <div style="margin: 15px 0;"></div>
    <el-checkbox-group v-model="checkedColumns" @change="handleCheckedColumnsChange">
      <el-checkbox v-for="(column, index) in columnData" :label="column.fieldConfigCode" :key="index">{{column.showName}}</el-checkbox>
    </el-checkbox-group>
  </el-row>
  <span slot="reference"><i class="el-icon-setting"></i></span>
</el-popover>

</template>

<script>
import { Popover } from 'element-ui';
import { getCustomColumn, updateCustomColumn, clearCustonColumn } from './utils'


export default {
  name: 'table-column-setting',
  components: {
    'el-popover': Popover
  },
  props: {
    columnData: {
      type: Array,
      default() {
        return []
      }
    },
    columnret: {
      type: Array,
      default() {
        return []
      }
    },
  },
  data() {
    return {
      checkAll: false,
      checkedColumns: [],
      isIndeterminate: true
    };
  },
  methods: {
    handleCheckAllChange(val) {
      this.checkedColumns = []
      if(this.checkAll) {
        this.columnData.forEach(element => {
          this.checkedColumns.push(element.fieldConfigCode)
        });
        clearCustonColumn()
      }
      this.isIndeterminate = false
      this.$emit('update:columnret', this.checkedColumns)
    },
    handleCheckedColumnsChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.columnData.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.columnData.length;
      updateCustomColumn(value)
      this.$emit('update:columnret', value)
    },
    loadCheckStatus() {
      const status = getCustomColumn()
      if(!status || status.length === 0) {
        this.columnData.forEach(element => {
          this.checkedColumns.push(element.fieldConfigCode)
        });
        this.checkAll = true
        this.isIndeterminate = false
      } else {
        this.checkedColumns = status
      }
      // console.log('this.checkedColumns', this.checkedColumns, 'status', status)
      this.$emit('update:columnret', this.checkedColumns)
    }
  },
  mounted() {
    setTimeout(() => {
      this.loadCheckStatus()
    }, 300);
  },
  created() {
    // this.loadCheckStatus()

  }
}
</script>

<style lang="scss" scoped>
.el-checkbox-group {
  .el-checkbox {
    margin-bottom: 10px;
  }
  .el-checkbox:first-child {
    margin-left: 15px;
  }
}
span i {
  color: #999;
}

span i:hover {
  color: #5e5e5e;
}
</style>

