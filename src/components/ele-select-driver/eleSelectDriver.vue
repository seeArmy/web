/**
* elePop.vue
* Created by dsky on 17/6/27.
*/
<template>
  <div class="block">
    <!-- <el-button @click="dialogOpen" type="primary" v-if="editable">选择</el-button> -->
    <div v-if="!editable">
      <template v-if="domainObject.driverCode && domainObject.driverFullName">
        <a href="javascript:;" class="blue" :data-link="'/driver/add.html?code=' + domainObject.driverCode + '&editable=false'" data-title="司机详情">
          {{ domainObject.driverFullName }}
        </a>
        <span v-if="domainObject.driverPhone">, {{ domainObject.driverPhone }}</span>
        <el-button type="text" @click="removeDriver">去除</el-button>
        <span>|</span>
        <el-button type="text" @click="dialogOpen">更换</el-button>
      </template>

      <template v-else-if="domainObject.driverFullName">
        {{ domainObject.driverFullName }}
        <span v-if="domainObject.driverPhone">, {{ domainObject.driverPhone }}</span>
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
import { edit } from '../../../api/TransportService';
import elePopSelect from '../../components/ele-pop-select/elePopSelect.vue';

export default {
  name: 'elePop',
  inject: ['eventBus'],
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
    handleSelect(data) {
      const model = Object.assign({}, this.domainObject);
      delete model.actionMenuList;
      delete model.checked;
      console.log('oldVersion', model, 'selected', data);
      model.driverCode = data.code;
      model.driverCertStatus = data.certStatus;
      model.driverPhone = data.phone;
      model.driverFullName = data.fullName;
      model.driverLicenseNo = data.driverLicenseNo;
      model.identityNumber = data.identityNumber;
      model.driverPayeeBankAccountName = data.bankAccountName;
      model.driverPayeeBankName = data.bankName;
      model.driverPayeeBankAccountNo = data.bankAccountNo;
      model.payeeTel = data.payeeTel;
      this.updateData(model.code, model);
    },
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
          model.driverCode = '';
          model.driverCertStatus = '';
          model.driverPhone = '';
          model.driverFullName = '';
          model.driverLicenseNo = '';
          model.identityNumber = '';
          model.driverPayeeBankAccountName = '';
          model.driverPayeeBankName = '';
          model.driverPayeeBankAccountNo = '';
          model.payeeTel = '';
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
          console.log('update driver error', error);
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
