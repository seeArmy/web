/**
* group.vue
* Created by cc on 18/10/30.
*/
<template>
  <div class="group-section">
    <div class="group-head clearfix">
      <div class="gh-left fl">
        <span :class="allActive ? 'group-category actived' : 'group-category'" @click="switchCategory('all')">全部分组</span>
        <span :class="allActive ? 'group-category' : 'group-category actived'" @click="switchCategory('none')">未分组</span>
      </div>
      <div class="gh-right fr">
        <el-button @click="showGroupDialog('add')">添加分组</el-button>
        <el-button @click="collapsing" v-show="allActive">{{ btnText }}<span :class="showMore ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"></span></el-button>
      </div>
    </div>
    <div class="group-content" v-show="allActive && showMore">
      <ul class="gc-list">
        <li v-for="(group, index) in tagData" :key="index" :class="{actived: group.isActive}" @click="filterData(group)">
          {{ group.name }}
          <span class="el-icon-edit" title="点击编辑分组" @click.stop="showGroupDialog('edit', group)"></span>
          <span class="el-icon-delete" title="点击删除分组" @click.stop="deleteGroup(group)"></span>
        </li>
      </ul>
    </div>
    <!-- dialog -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      size="tiny">
      <el-form ref="dialogForm" :model="dialogForm" :rules="rules" :inline="true" label-width="80px" class="dialog-form">
        <el-form-item label="分组" prop="groupName">
          <el-input v-model="dialogForm.groupName" placeholder="请输入分组名称"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitDialogForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">

export default {
  name: 'group',
  props: {
    tagData: Array,
    addFun: Function,
    editFun: Function,
    deleteFun: Function
  },
  data() {
    const checkGroupName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入分组名称'));
      } else {
        // 分组名称只能输入中文、英文、数字
        const reg = new RegExp("^[A-Za-z0-9\u4e00-\u9fa5]+$");
        if (!reg.test(value)) {
          callback(new Error('仅支持输入中文、英文、数字'));
        } else {
          callback();
        }
      }
    };
    return {
      allActive: true,
      btnText: '展开分组',
      showMore: false,
      dialogVisible: false,
      dialogForm: {
        oldName: '',
        groupName: ''
      },
      rules: {
        groupName: [{
          validator: checkGroupName, trigger: 'change'
        }]
      },
      dialogTitle: ''
    };
  },
  computed: {
  },
  methods: {
    switchCategory(type) {
      const param = {
        'all': {
          orgTag_noGroup: ''
        },
        'none': {
          orgTag_noGroup: '1'
        }
      };
      this.allActive = type === 'all';
      this.$emit('filterData', param[type]);
    },
    collapsing() {
      if (this.showMore) {
        this.showMore = false;
        this.btnText = '展开分组';
        this.$emit('getHeight');
      } else {
        this.showMore = true;
        this.btnText = '收起分组';
        this.$emit('getHeight');
      }
    },
    filterData(group) {
      const params = {
        'actived': {
          orgTag: group.name
        },
        'inactived': {
          orgTag: ''
        }
      };
      if (!group.isActive) {
        this.tagData.forEach((val) => {
          if (val.isActive) {
            val.isActive = false;
          }
        });
        group.isActive = true;
        this.$emit('filterData', params['actived']);
      } else {
        group.isActive = false;
        this.$emit('filterData', params['inactived']);
      }
    },
    showGroupDialog(type, group) {
      console.log('type is', type, 'group is', group);
      this.dialogTitle = type === 'add' ? '添加分组' : '编辑分组';
      this.dialogForm.oldName = type === 'add' ? '' : group.name;
      this.dialogForm.groupName = type === 'add' ? '' : group.name;
      this.dialogVisible = true;
      this.$nextTick(() => {
        if (type === 'add') {
          // 每次打开添加分组弹窗，重置清除校验错误信息
          this.$refs.dialogForm.resetFields();
        }
      });
    },
    submitDialogForm() {
      console.log('submitDialogForm now');
      const isAdd = this.dialogTitle === '添加分组',
       params = {
        'add': {
          tag: this.dialogForm.groupName
        },
        'edit': {
          oldTag:  this.dialogForm.oldName,
          tag: this.dialogForm.groupName
        }
       };
      this.$refs.dialogForm.validate((valid) => {
        if (valid) {
          console.log('submit now');
          this[isAdd ? 'addFun' : 'editFun'](isAdd ? params['add'] : params['edit'], (success, error) => {
            if (error) {
              const msg = isAdd ? '添加失败' : '编辑失败';
              this.$message({
                type: 'error',
                message: `${msg}${error.content}`,
                duration: 3000
              });
              this.dialogVisible = false;
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            }
            if (success) {
              const msg = isAdd ? '添加成功' : '编辑成功';
              this.$message({
                type: 'success',
                message: msg,
                duration: 3000
              });
              this.dialogVisible = false;
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            }
          });
        } else {
          console.log('submit error');
        }
      });
    },
    deleteGroup(group) {
      const h = this.$createElement;
      this.$msgbox({
        title: '删除分组',
        message: h('div', null, [
          h('h3', { style: 'font-weight: 700; margin-bottom: 10px; text-align: center' }, '确定删除该分组吗？'),
          h('p', null, '该分组删除后，所有贴有该分组标签的组织会被去除该分组标签，但保留其它分组标签。')
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = '执行中...';
            const params = {
              tag: group.name
            };
            this.deleteFun(params, (success, error) => {
              if (error) {
                this.$message({
                  type: 'error',
                  message: error.content,
                  duration: 3000
                });
                done();
                instance.confirmButtonLoading = false;
              }
              if (success) {
                this.$message({
                  type: 'success',
                  message: '删除成功',
                  duration: 3000
                });
                done();
                instance.confirmButtonLoading = false;
              }
            });
          } else {
            done();
          }
        }
      }).then(() => {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      });
    }
  },
  watch: {
  },
  created() {
  }
};
</script>

<style lang="scss" rel="stylesheet/scss">
.group-section {
  padding: 5px 10px;
  border-bottom: solid 1px #e5e9ef;
  background-color: #f8f8f8;
  .gh-left {
    line-height: 24px;
    .group-category {
      display: inline-block;
      vertical-align: middle;
      padding: 0 10px;
      margin-right: 5px;
      border: solid 1px transparent;
      cursor: pointer;
      &:hover,&.actived {
        border-color: #ddd;
        background-color: #fff;
      }
    }
  }
  .gh-right {
    [class^='el-icon'] {
      margin-left: 5px;
    }
  }
  .group-content {
    padding-top: 5px;
    margin-top: 5px;
    border-top: solid 1px #ddd;
  }
  .gc-list {
    li {
      position: relative;
      display: inline-block;
      line-height: 24px;
      padding: 0 5px 0 10px;
      margin-right: 10px;
      border: solid 1px transparent;
      cursor: pointer;
      [class^='el-icon'] {
        display: inline-block;
        vertical-align: middle;
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        opacity: 0;
        color: #999;
      }
      &:hover,&.actived {
        border-color: #ddd;
        background-color: #fff;
        [class^='el-icon'] {
          opacity: 1;
        }
      }
    }
  }
  .dialog-form {
    padding: 27px 0 20px;
  }
}
</style>
