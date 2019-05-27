/**
* elePop.vue
* Created by dsky on 17/6/27.
*/
<template>
  <div class="block">
    <!-- <el-button @click="dialogOpen" type="primary" v-if="editable">选择</el-button> -->
    <div v-if="!editable">
      <template v-if="domainObject.viceDriverCode && domainObject.viceDriverFullName">
        <a href="javascript:;" class="blue" :data-link="'/driver/add.html?code=' + domainObject.viceDriverCode + '&editable=false'" data-title="司机详情">
          {{ domainObject.viceDriverFullName }}
        </a>
        <span v-if="domainObject.viceDriverPhone">, {{ domainObject.viceDriverPhone }}</span>
        <el-button type="text" @click="removeDriver">去除</el-button>
        <span>|</span>
        <el-button type="text" @click="dialogOpen">更换</el-button>
      </template>

      <template v-else-if="domainObject.viceDriverFullName">
        {{ domainObject.viceDriverFullName }}
        <span v-if="domainObject.viceDriverPhone">, {{ domainObject.viceDriverPhone }}</span>
        <el-button type="text" @click="removeDriver">去除</el-button>
        <span>|</span>
        <el-button type="text" @click="dialogOpen">更换</el-button>
      </template>

      <template v-else>
        <el-button type="text" @click="dialogOpen">添加</el-button>
      </template>
    </div>
    <ele-pop-select ref="dialog" :configData="driverData" :handleSelect="handleSelect"
                    :editable="editable" :domainObject="domainObject">
    </ele-pop-select>
  </div>
</template>

<script type="text/ecmascript-6">
import elePopSelect from '../../components/ele-pop-select/elePopSelect.vue';
import { edit } from '../../../api/TransportService';

export default {
  name: 'elePop',
  props: {
    driverData: null,
    editable: {
      type: Boolean,
      'default': false
    },
    isList: {
      type: Boolean,
      'default': false
    },
    domainObject: Object
  },
  components: {
    'ele-pop-select': elePopSelect
  },
  methods: {
    init() {},
    removeDriver() {

      this.$msgbox({
        title: '确认',
        message: `确认要去除吗？`,
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            // 点击确定
          const model = Object.assign({}, this.domainObject);
          delete model.actionMenuList;
          delete model.checked;
          model.viceDriverCode = '';
          model.viceDriverPhone = '';
          model.viceDriverFullName = '';
          model.viceDriverLicenseNo = '';
          model.viceDriverPayeeBankAccountName = '';
          model.viceDriverPayeeBankName = '';
          model.viceDriverPayeeBankAccountNo = '';
          this.updateData(model.code, model,done);
          } else {
            done();
          }
        }
      }).then(() => {
      });

    },
    updateData(code, obj,done) {
      edit(code, obj, (success, error) => {
         if(done){done();} //点击确认 将 弹框取消
        if (success) {

          // 需求 start===============================================================
          // 需求：当添加挂车 或则 移除之后 ，需要保存当前页面的搜索条件，保留当前页面
          // 思路：如果是 list 页面，向上寻找 eleList 组件，调用 eleList组件的 dispatchQueryEventSavePage
          let parent = this.$parent;
          if (parent && this.isList) {
            while (parent && parent.$options && parent.$options._componentTag !== 'ele-list') {
              parent = parent.$parent;
            }
          }
          if(parent && parent.dispatchQueryEventSavePage){
            parent.dispatchQueryEventSavePage();
          }else{
                 window.location.reload();
          }
          // 需求 end===============================================================

        } else {
          console.log('update vice driver error', error);
          this.$message({
            type: 'error',
            showClose: true,
            message: error.content,
            duration: 5000
          });
        }
      });
    },
    dialogOpen() {
      this.$refs.dialog.select();
    },
    handleSelect(data) {
      const model = Object.assign({}, this.domainObject);
      delete model.actionMenuList;
      delete model.checked;
      console.log('oldVersion', model, 'selected', data);
      model.viceDriverCode = data.code;
      model.viceDriverCertStatus = data.certStatus;
      model.viceDriverPhone = data.phone;
      model.viceDriverFullName = data.fullName;
      model.viceDriverLicenseNo = data.driverLicenseNo;
      model.viceDriverPayeeBankAccountName = data.bankAccountName;
      model.viceDriverPayeeBankName = data.bankName;
      model.viceDriverPayeeBankAccountNo = data.bankAccountNo;
      this.updateData(model.code, model);
    }
  },
  mounted() {
    this.$refs.dialog.$el.parentNode.removeChild(this.$refs.dialog.$el);
    document.body.appendChild(this.$refs.dialog.$el);
  },
  created() {},
  beforeCreate() {}
};
</script>

<style lang="scss" rel="stylesheet/scss">
@import "../../assets/sass/rl-table.scss";
.el-dialog__body {
  .fix-table-wrap {
    padding: 10px;
    box-sizing: border-box;
    .rl-fix-table {
      margin: 0;
    }
    .pagination {
      padding-left: 0;
    }
  }
  .text-c {
    text-align: center;
  }
  .text-r {
    text-align: right;
  }
  .el-form-item__label {
    text-align: right !important;
  }
}
</style>
