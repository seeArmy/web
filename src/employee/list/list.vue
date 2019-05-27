/**
* list.vue
* 运单列表
* Created by zyc on 17/7/21.
*/
<template>
  <div id="template">
    <div class="page-header clearfix">
      <h2 class="page-title fl">
        人员列表
      </h2>
    </div>
    <div class="page-content clearfix">
      <div class="role-aside fl">
        <div class="hd-opr">
          <el-button type="primary" size="small" @click.stop="showAddDialog"><i class="el-icon-plus"></i> 新增部门 </el-button>
          <el-button size="small" @click="showEditDialog"><i class="el-icon-edit"></i> 编辑</el-button>
          <el-button size="small" @click.stop="deletedDept"><i class="el-icon-delete"></i> 删除</el-button>
        </div>
        <div class="role-tree" id="roleTree">
          <el-tree :data="treeData"
                    node-key="id"
                   :highlight-current="true"
                   :default-expand-all="true"
                   :default-checked-keys="defaultCheckTree"
                   :expand-on-click-node="false"
                   @node-click="handleNodeClick">
          </el-tree>
        </div>
      </div>
      <div class="role-table">
        <employee-table ref="list" :params="extraSearchParamObj" :isHide="true" :deptList="deptList" :deptCodeList="deptCodeList" :selectable="selectable" :operatable="selectable" :showRadioCheck="showRadioCheck" :showColumns="showColumns"></employee-table>
      </div>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible"  size="large"    :before-close="dialogClose">
      <div class="dialog-form">
        <div class="dialog-form-item required">
          <span class="item-title">部门名称：</span>
          <input type="text" v-model="editDeptObj.deptName" id="deptName" placeholder="部门名称不能为空" class="el-input__inner" />
        </div>
        <div class="dialog-form-item required">
          <span class="item-title">上级部门：</span>
          <ele-tree-select :treeData="treeData" v-model="editDeptObj.parentDeptCode"/>
        </div>
        <div class="dialog-form-item">
          <span class="item-title">部门描述： </span>
          <textarea id="description" v-model="editDeptObj.description" class="el-textarea__inner"></textarea>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveDept" :disabled="processing">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script type="text/ecmascript-6">
  import { addDept, editDept, deletedDept, getSelfDept } from '../../../api/OrgService';
  import { hasClass } from '../../../api/classUtil';
  import table from './table.vue';
  import EleTreeSelect from '../../components/ele-treeselect/eleTreeselect.vue';

  export default {
    name: 'employeeList',
    components: {
      'ele-tree-select': EleTreeSelect,
      'employee-table': table
    },
    props: {
      selectable: {
        type: Boolean,
        'default': true
      },
      operatable: {
        type: Boolean,
        'default': true
      },
      showRadioCheck: {
        type: Boolean,
        'default': false
      },
      showColumns: {
        type: Array,
        default () {
          return [];
        }
      }
    },
    data: () => {
      return {
        treeData: [],
        dialogTitle: '',
        dialogVisible: false,
        checkedDept: {},
        editDeptObj: {
          deptName: '',
          description: '',
          code: '',
          parentDeptCode: ''
        },
        extraSearchParamObj: {
           userType: 1
        },
        processing: false,
        isEdit: false,
        deptList:[],
        deptCodeList: [],
        defaultCheckTree: []
      };
    },
    methods: {
      handleNodeClick(data, type) {
        console.log('data为', data);
        this.checkedDept = data;
        if (data.code !== 'org-Name') {
          this.deptCodeList = [];
          // const node = this.getTreeNode(this.treeData, data.code);
          if (type !== 'firstLoad') {
            this.pushDeptCodeList(data);
            this.$set(this.extraSearchParamObj, 'deptCode', data.code);
          }
          // this.$set(this.extraSearchParamObj, 'deptCodeList', this.deptCodeList);
        } else {
          this.$delete(this.extraSearchParamObj, 'deptCode');
        }
        console.log('部门对象和下级code', this.extraSearchParamObj, this.deptCodeList);
        setTimeout(() => {
          this.$refs.list.dispatchQueryEvent();
        }, 500);
      },
      dialogClose() {
        this.dialogVisible = false;
        this.editDeptObj = {};
      },
      showAddDialog() {
        this.dialogTitle = '添加部门';
        this.isEdit = false;
        this.editDeptObj = {};
        this.dialogVisible = true;
      },
      showEditDialog() {
        if (!this.checkedDept.code) {
          this.$message({
            type: 'warning',
            message: '请选择您要编辑的部门'
          });
          return false;
        }
        this.dialogTitle = '编辑部门';
        this.isEdit = true;
        this.editDeptObj = this.checkedDept;
        this.dialogVisible = true;
      },
      saveDept() {
        if (!this.editDeptObj.deptName) {
          this.$message({
            type: 'error',
            message: '请输入部门名称',
            duration: 1000
          });
          return false;
        }
        if (!this.editDeptObj.parentDeptCode) {
          this.$message({
            type: 'error',
            message: '请选择父级部门',
            duration: 1000
          });
          return false;
        }
        const submitData = {
          code: this.editDeptObj.code,
          deptName: this.editDeptObj.deptName,
          description: this.editDeptObj.description,
          parentDeptCode: this.editDeptObj.parentDeptCode
        };
        this.processing = true;
        if (this.isEdit) {
          editDept(submitData, (success, error) => {
            this.processing = false;
            if (error || success.code !== 200) {
              this.$message({ type: 'error', message: error.content, duration: 5000 });
              return false;
            }
            if (success) {
              this.dialogClose();
              this.$message({ message: '编辑部门成功', type: 'success' });
              this.refreshList();
            }
          });
        } else {
          addDept(submitData, (success, error) => {
            this.processing = false;
            if (error || success.code !== 200) {
              this.$message({ type: 'error', message: error.content, duration: 5000 });
              return false;
            }
            if (success) {
              this.dialogClose();
              this.$message({ message: '添加部门成功', type: 'success' });
              this.refreshList();
            }
          });
        }
      },
      deletedDept() {
        if (!this.checkedDept.code) {
          this.$message({
            type: 'warning',
            message: '请选择您要删除的部门'
          });
          return false;
        }
        if (this.checkedDept.code === 'org-Name') {
          this.$message({
            type: 'warning',
            message: '根目录不可以删除'
          });
          return false;
        }
        const personCount = this.$refs.list.total,
          paramObj = {
            code: this.checkedDept.code
          };
        if (personCount > 0) {
          this.$message({
            type: 'warning',
            message: '请将该部门或下级部门人员移出到其他部门，再重新操作！'
          });
          return false;
        }
        this.$confirm('是否确认删除该部门', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deletedDept(paramObj, (success) => {
            if (success) {
              this.$message({
                type: 'success',
                message: '删除成功'
              });
              this.checkedDept = {};
              this.refreshList();
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },

      buildTreeData(jsonArr) {
        const rootNodes = [],
          stack = [],
          buildNode = function (item) {
            return Object.assign({
              id: item.code,
              value: item.code,
              label: item.deptName,
              children: []
            }, item);
          };
        jsonArr.forEach((item) => {
          if (!item.parentDeptCode) {
            const node = buildNode(item);
            rootNodes.push(node);
            stack.push(node);
          }
        });
        while (stack.length > 0) {
          const parentNode = stack.pop();
          jsonArr.forEach((item) => {
            if (item.parentDeptCode === parentNode.code) {
              const child = buildNode(item);
              parentNode.children.push(child);
              stack.push(child);
            }
          });
        }
        return rootNodes;
      },
      getTreeNode(treeData, code) {
        let node = {};
        treeData.forEach((item) => {
          if (item.id === code) {
            node = item;
            return node;
          }
          if (item.children.length > 0) {
            node = this.getTreeNode(item.children, code);
            if (node.id) {
              return node;
            }
          }
        });
        return node;
      },
      pushDeptCodeList(node) {
        this.deptCodeList.push(node.id);
        if (node.children.length > 0) {
          node.children.forEach((item) => {
            this.pushDeptCodeList(item);
          });
        }
      },
      refreshList() {
        // 更新列表方法
        this.treeData = [];
        getSelfDept({}, (success) => {
          if (success) {
            const data = success.content;
            this.treeData = this.buildTreeData(data);
            this.deptList = data;
            this.handleNodeClick(this.treeData[0], 'firstLoad');
          }
        });
      },
      getHeight() {
        const winHeight = window.innerHeight,
          pageHeader = document.querySelectorAll('.page-header')[0].offsetHeight,
          pagination = document.querySelector('.pagination').offsetHeight,
          tableOprHeight = document.querySelector('.table-opr').offsetHeight,
          pageContent = winHeight - pageHeader,
          pageTable = winHeight - pageHeader - pageHeader - tableOprHeight - pagination - 2;
        document.querySelector('.page-content').style.height = `${pageContent}px`;
        document.querySelector('#list').style.height = `${pageContent}px`;
        document.querySelector('#roleTree').style.height = `${pageContent - 35}px`;
        document.querySelector('.advance-search').style.height = `${pageContent}px`;
        document.querySelector('#asBd').style.maxHeight = `${pageContent - 75}px`;
        document.querySelector('.fix-table-wrap').style.height = `${pageTable}px`;
      }
    },
    created() {
      this.refreshList();
    },
    mounted() {
      document.body.addEventListener('click', (event) => {
        const target = event.target;
        // console.log(target);
        if (hasClass(target, 'el-dialog__wrapper')) {
          document.body.removeChild(document.querySelector('.el-select-dropdown:last-child'));
        }
      });
      // 检测高度
      this.$nextTick(() => {
        this.getHeight();
        window.onresize = () => {
          this.getHeight();
        };
      });
    }
  };
</script>
<style lang="scss" rel="stylesheet/scss">
  .page-content {
    background-color: #f6f6f6;
  }
  .el-tree {
    padding: 10px 0px;
    border: none;
    background: transparent;
  }
  .role-aside {
    width: 236px;
  }
  .role-table {
    margin-left: 236px;
  }
  #list {
    background-color: #fff;
    border-left: solid 1px #e6e6e6;
  }
  .layout-content {
    .hd-opr {
      height: 25px;
      padding: 0;
      .tit {
        font-size: 16px;
        line-height: 25px;
      }
    }
    margin-left: 238px;
  }
  .el-form--inline .el-form-item {
    .el-form-item {
      margin-right: 0;
    }
  }
  .mini-search {
    .el-input {
      width: 140px;
    }
  }
  .role-tree{
    overflow: auto;
  }

  .el-dialog__body {
    min-height: auto;
  }

  .dialog-form {
    .dialog-form-item {
      padding-left: 100px;
      margin-bottom: 10px;

      .el-textarea__inner {
        min-width: auto;
        height: 100px;
      }
      &:last-child {
        margin-bottom: 0;
      }
    }
    .item-title{float:left;margin-left:-100px;line-height: 24px;}
    .required {
      .item-title:before {
          content: '*';
          display: inline-block;
          margin-right: 3px;
          color: #f48400;
        }
    }
  }

  .el-radio-group {
    padding: 20px 10px;
    display: block;
    .el-radio {
      display: block;
      margin-left: 0;
      margin-bottom: 10px;
    }
  }

  .el-checkbox-group {
    padding: 20px 10px;
    .el-checkbox {
      margin-left: 0;
      margin-bottom: 10px;
    }
  }

  .role-aside .hd-opr{
    padding: 5px;
  }

  .el-tree-node__content>.el-checkbox {
    display: none;
  }

  .el-tree-node__expand-icon {
    cursor: pointer;
    width: 0;
    height: 0;
    margin-left: 10px;
    border: 8px solid transparent;
    border-right-width: 0;
    border-left-color: #97a8be;
    border-left-width: 10px;
    -ms-transform: rotate(0);
    transform: rotate(0);
    transition: transform .3s ease-in-out;
  }

  .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
    background-color: #f1efe4;
  }
</style>
