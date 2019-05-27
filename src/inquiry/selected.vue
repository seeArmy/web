/**
* logisticsInfo.vue
* Created by cc on 18/7/30.
*/
<template>
  <div>
    <div class="table-opr clearfix">
      <el-button @click="removeSelected">移除</el-button>
      <el-button @click="clearSelected">清空</el-button>
    </div>
    <div class="fix-table-wrap selected-table-wrap">
      <table class="rl-fix-table table-bordered">
        <thead>
          <tr>
            <th class="fix-hd fix-col">
              <input type="checkbox" class="ck-all" v-model="batchSelect" @change="selectAll">
            </th>
            <th class="fix-hd">询价对象名称</th>
            <th class="fix-hd">业务联系人</th>
            <th class="fix-hd">联系电话</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(list,index) in selData" :key="index" :class="{active : list.isChecked}" @click="selectRow(list)" v-if="selData.length > 0">
            <td class="fix-col">
              <span class="ck-mask">
                <input type="checkbox" class="ck-single" v-model="list.isChecked">
              </span>
            </td>
            <td>
              {{ list.orgName }}
            </td>
            <td>
              {{ list.linkmanFullName }}
            </td>
            <td>
              {{ list.linkmanPhone }}
            </td>
          </tr>
          <tr v-else>
            <td colspan="6">
              <p>当前已选询价对象为空，请在左侧待选承运商库中选择询价对象。</p>
            </td>
          </tr>
        </tbody>
      </table> 
    </div>
  </div>
</template>

<script type="text/ecmascript-6">

export default {
  name: 'selected',
  props: {
    selectedData: Array
  },
  data() {
    return {
      batchSelect: false,
      selData: [],
      selCount: 0,
      tempDeleted: []
    };
  },
  methods: {
    removeSelected() {
      this.tempDeleted = [];
      this.selData.forEach((val) => {
        if (val.isChecked) {
          this.selCount += 1;
          delete val.isChecked;
          this.tempDeleted.push(val.code);
        }
      });
      if (this.selCount === 0) {
        this.$message({
          type: 'warning',
          message: `请至少勾选一个你想要移除的询价对象！`,
          duration: 5000
        });
        return false;
      } else {
        console.log('当前删除的数据有', this.tempDeleted);
        this.selData = this.selData.filter((v) => !this.tempDeleted.includes(v.code));
        this.batchSelect = false;
        this.$emit('selectedChanged', this.selData);
      }
    },
    clearSelected() {
      const  h = this.$createElement;
      this.$msgbox({
        title: '消息',
        message: h('p', null, [h('span', null, '确认清空当前全部已选询价对象吗？ ')]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = '执行中...';
            this.selData = [];
            this.batchSelect = false;
            this.$emit('selectedChanged', this.selData);
            done();
            setTimeout(() => {
              instance.confirmButtonLoading = false;
            }, 300);
          } else {
            done();
          }
        }
      }).then(() => {
        // setTimeout(() => {
        //   window.location.reload();
        // }, 1000);
      });
    },
    selectAll() {
      console.log('batchSelect', this.batchSelect);
      this.selData.forEach((item) => {
        this.$set(item, 'isChecked', this.batchSelect);
      });
    },
    selectRow(row) {
      console.log('click row', row.isChecked);
      if (!row.rowDisabled) {
        let ckNum = 0;
        this.$set(row, 'isChecked', !row.isChecked);
        this.selData.forEach((item) => {
          if (item.isChecked) {
            ckNum += 1;
          }
        });
        this.batchSelect = ckNum === this.selData.length;
      } else {
        this.$message({
          type: 'warning',
          message: '该列不可编辑！',
          duration: 3000
        });
      }
    },
    handleChange(val) {
      console.log('number changed', val);
      // selData不是实时同步
      setTimeout(() => {
        this.$emit('selectedChanged', this.selData);
      }, 500);
    }
  },
  watch: {
    selectedData: {
      deep: true,
      handler(newVal, oldVal) {
        if (newVal) {
          console.log('selected子控件检测到selectedData已选数据变更', newVal);
          this.selData = newVal;
        }
      }
    }
  },
  created() {
  }
};
</script>

<style lang="scss" rel="stylesheet/scss">
.selected-table-wrap {
  height: 298px;
}
.el-input-number--small {
  width: 88px;
  height: 22px;
  overflow: hidden;
  vertical-align: middle;
  margin-top: -3px;
  .el-input-number__increase, .el-input-number__decrease {
    width: 22px;
    line-height: 22px;
  }
  .el-input--small .el-input__inner {
    width: 88px !important;
    padding: 0 22px;
    height: 22px;
    text-align: center;
  }
  .el-input-number__decrease {
    left: 1px;
    right: auto;
    border-left: 0;
    border-right: 1px solid #bfcbd9;
  }
  .el-input-number__increase {
    right: 1px;
  }
}
</style>
