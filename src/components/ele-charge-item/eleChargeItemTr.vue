<!-- 费用科目单行 -->
<template>
  <tr>
    <td class="fix-col">
      {{ indexMark + 1 }}
    </td>
    <td class="fix-col">
      <div class="opr-control" v-if="domainObject.settleStatus !== 'pass'">
        <div v-show="!editable">
          <!-- 无单项支付通道 -->
          <el-button @click="handle('editRow', list, indexMark)" v-if="showEdit">修改</el-button>
          <!-- 现金支付通道 -->
          <el-button @click="handle('createRow', list, indexMark)" v-if="showCreate">创建</el-button>
          <el-button @click="handle('applyRow', list, indexMark)" v-if="showApply">申请</el-button>
          <el-button @click="handle('auditRow', list, indexMark)" v-if="showAudit">审核</el-button>
          <el-button @click="handle('modifyRow', list, indexMark)" v-if="showModify">修改</el-button>
          <el-button @click="handle('payOnlineRow', list, indexMark)" v-if="showOnline">线上支付</el-button>
          <el-button @click="handle('payOfflineRow', list, indexMark)" v-if="showOffline">线下支付</el-button>
          <el-button @click="handle('repulseRow', list, indexMark)" v-if="showRepulse">打回</el-button>
          <el-button @click="handle('withdrawRow', list, indexMark)" v-if="showWithdraw">撤回支付</el-button>
        </div>
        <div v-show="editable">
          <el-button class="half-btn" @click="handle('clearRow', list, indexMark)" title="清空此行文本框" :disabled="disableControl(list)">清</el-button>
          <el-button class="half-btn" @click="handle('addRow', list, indexMark)" title="新增一行" v-show="isRoot">+</el-button>
          <el-button class="half-btn" @click="handle('delRow', list, indexMark)" title="删除此行" v-show="!isRoot">-</el-button>
        </div>
      </div>
    </td>
    <td v-for="(column, index) in columnsData" :class="{'fix-col': column.extraParams[0].freeze }" :key="index">
      <template v-if="column.fieldConfigCode === 'chargeAmounts'">
        <el-form :ref="['checkForm' + index]" :model="list">
          <ele-block :field="column" :domainObject="list" :editable="isIncludeEditableFields(column.fieldConfigCode) && statusControl(list, column.fieldConfigCode)" :uploadUrl="uploadUrl" :isList="false" :class="addLabel(list, column.fieldConfigCode)" :title="addTitle(list, column.fieldConfigCode)" v-if="isShow(column.fieldConfigCode)"></ele-block>
        </el-form>
      </template>
      <template v-else>
        <ele-block :field="column" :domainObject="list" :editable="isIncludeEditableFields(column.fieldConfigCode) && statusControl(list, column.fieldConfigCode)" :uploadUrl="uploadUrl" :isList="false" :class="addLabel(list, column.fieldConfigCode)" :title="addTitle(list, column.fieldConfigCode)" v-if="isShow(column.fieldConfigCode)"></ele-block>
      </template>
    </td>
  </tr>
</template>
<script type="text/ecmascript-6">
import eleBlock from '../ele-block/eleBlock.vue';

export default {
  name: 'eleTr',
  components: {
    'ele-block': eleBlock
  },
  props: {
    domainObject: Object,
    columnsData: Array,
    list: Object,
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
    isRoot: {
      type: Boolean,
      'default': true
    },
    editableFields: Array, // 可编辑字段
    hideFields: Array, // 隐藏字段
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
        this.$emit('chargeItemSingleListValueChange', this.indexMark, this.list);
      },
      deep:true
    }
  },
  computed: {
    showEdit() {
      // 无单项支付通道
      return this.list.paymentChannel === 'none';
    },
    showCreate() {
      // 现金支付通道，并且支付状态为待创建
      return this.list.paymentChannel === 'cash' && this.list.chargeItemPaybillStatus === 'uncreated';
    },
    showApply() {
      // 现金支付通道，并且支付状态为待申请
      return this.list.paymentChannel === 'cash' && this.list.chargeItemPaybillStatus === 'ready';
    },
    showAudit() {
      // 现金支付通道，并且支付状态为待审核
      return this.list.paymentChannel === 'cash' && this.list.chargeItemPaybillStatus === 'approvePend';
    },
    showModify() {
      // 现金支付通道，并且支付状态为待申请
      return this.list.paymentChannel === 'cash' && this.list.chargeItemPaybillStatus === 'ready';
    },
    showOnline() {
      // 现金支付通道，并且支付状态为待支付或支付失败
      return this.list.paymentChannel === 'cash' && (this.list.chargeItemPaybillStatus === 'pend' || this.list.chargeItemPaybillStatus === 'failed');
    },
    showOffline() {
      // 现金支付通道，并且支付状态为待支付或支付失败
      return this.list.paymentChannel === 'cash' && (this.list.chargeItemPaybillStatus === 'pend' || this.list.chargeItemPaybillStatus === 'failed');
    },
    showRepulse() {
      // 现金支付通道，并且支付状态为待支付或支付失败
      return this.list.paymentChannel === 'cash' && (this.list.chargeItemPaybillStatus === 'pend' || this.list.chargeItemPaybillStatus === 'failed');
    },
    showWithdraw() {
      // 现金支付通道，并且支付状态为已支付，只有线下支付的才能撤回支付
      return this.list.paymentChannel === 'cash' && this.list.chargeItemPaybillStatus === 'paid' && this.list.chargeItemPaybillPayChannel === 'offline';
    },
  },
  methods: {
    //验证
    formValidate(cb) {
      console.log('formValidate in eletr', this.$refs);
      let isSuccess = true;
      let count = 0;
      let keys = Object.keys(this.$refs);
      for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        let form = this.$refs[key];
        form[0].validate(flag => {
          count ++;
          if (!flag) {
            isSuccess = false;
          }
          if (count == keys.length) {
            cb(isSuccess);
          }
        })
      }
    },
    // #### 组件逻辑 
    // 是否包含传入的数组
    isIncludeEditableFields(field){
      if (this.editableFields && this.editableFields.length > 0) {
        return this.editable && this.editableFields.includes(field);
      }
      return this.editable;
    },
    isShow(field){
      return !(this.hideFields.includes(field));
    },
    statusControl(list, field) {
      let result = true;
      // 只有待创建的才能修改，其他状态均不能修改
      if (list.chargeItemPaybillStatus && list.chargeItemPaybillStatus !== 'uncreated') {
        result = false;
      }
      return result;
    },
    disableControl(list) {
      let result = false;
      // 只有待创建的才能清空，其他状态均不能清空
      if (list.chargeItemPaybillStatus && list.chargeItemPaybillStatus !== 'uncreated') {
        result = true;
      }
      return result;
    },
    addLabel(list, field) {
      let className = '';
      if (field === 'chargeItemName') {
        if (list.paymentChannel === 'cash') {
          className = 'show-label';
          if (list.chargeItemPaybillPayChannel) {
            if (list.chargeItemPaybillPayChannel === 'offline') {
              if (list.chargeItemPaybillStatus === 'paid') {
                className += ' org-label';
              }
            } else {
              className += ' green-label'; // 不为offline的全部都是线上支付
            }
          }
        }
      }
      return className;
    },
    addTitle(list, field) {
      let text = '';
      if (field === 'chargeItemName') {
        if (list.paymentChannel === 'cash') {
          text = '未支付';
          if (list.chargeItemPaybillPayChannel) {
            if (list.chargeItemPaybillPayChannel === 'offline') {
              if (list.chargeItemPaybillStatus === 'paid') {
                text = '线下已支付';
              } else {
                text = '支付失败';
              }
            } else {
              text = '线上已支付'; // 不为offline的全部都是线上支付
            }
          }
        }
      }
      return text;
    },
    handle(action, list, index) {
      this.$emit('chargeAction', action, list, index);
    }
  },
  created() {
  },
  mounted() {
    this.$nextTick(()=>{
      this.$emit('eleTrMounted');
    })
  }
};

</script>
<style lang="scss" rel="stylesheet/scss">
.rl-fix-table .half-btn {
  width: 30px;
  padding: 0 !important;
  text-align: center;
}
.show-label {
  position: relative;
  .block {
    ::after {
      position: absolute;
      top: 2px;
      right: -38px;
      width: 28px;
      height: 16px;
      line-height: 16px;
      text-align: center;
      content: 'Pay';
      border: solid 1px #999;
      border-radius: 3px;
      background-color: #bbb;
      color: #fff;
      font-size: 12px;
    }
  }
}
.green-label {
  .block {
    ::after {
      border-color: #00a05a;
      background-color: #67d178;
    }
  }
}
.org-label {
  .block {
    ::after {
      border-color: #e0ab67;
      background-color: #fdaf4a;
    }
  }
}
</style>
