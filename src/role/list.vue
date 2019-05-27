<template>
  <div class="main">
    <!-- role-permission-config -->
    <div class="role-permission-config">
      <div class="page-header clearfix">
        <h2 class="page-title fl">
          角色权限管理
        </h2>
        <!-- <span class="page-refresh fr" id="pageRefresh">
          <i class="ico-refresh"></i>刷新
        </span> -->
      </div>
      <div class="page-content clearfix">
        <!-- role-aside -->
        <div class="role-aside fl">
          <div class="hd-opr">
            <el-button type="primary" size="small" @click.stop="dialogVisible = true"><i class="el-icon-plus"></i> 新增角色</el-button>
            <el-button size="small" @click="editRole"><i class="el-icon-edit"></i> 编辑</el-button>
            <el-button size="small" @click.stop="deletedRole"><i class="el-icon-delete"></i> 删除</el-button>
          </div>
          <div class="role-tree" id="roleTree">
            <el-radio-group v-model="radioValue" @change="changeHandle">
              <el-radio v-for="item in roleList" :label="item.code" :key="item.code">{{ item.roleName }}</el-radio>
            </el-radio-group>
          </div>
        </div>
        <!-- permission-content -->
        <div class="permission-content">
          <div class="hd-opr clearfix">
            <h3 class="tit fl">权限配置</h3>
            <el-button type="primary" size="small" class="fr" @click="savePermissionEdit">保存</el-button>
          </div>
          <div class="permission-tree" id="permissionTree">
            <el-tree ref="tree" :data="treeData"
              @node-click='handleNodeClick'
              show-checkbox
              node-key="permissCode"
              :default-expand-all="expandAll"
              :props="defaultProps">
            </el-tree>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      title="新增角色"
      :visible.sync="dialogVisible"
      size="tiny"
      :before-close="handleClose">
      <div class="dialog-form">
        <div class="dialog-form-item required">
          <span>角色名称：</span>
          <input type="text" id="roleName" placeholder="角色名称不能为空" class="el-input__inner" />
        </div>
        <div class="dialog-form-item">
          <span>角色描述： </span>
          <textarea id="roleDesc" class="el-textarea__inner"></textarea>
          <!-- <input type="text" id="roleDesc"/> -->
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="编辑角色"
      :visible.sync="dialogVisible1"
      size="tiny"
      :before-close="handleClose">
      <div class="dialog-form">
        <div class="dialog-form-item required">
          <span>角色名称：</span>
          <input type="text" id="editRoleName" v-model="editRoleName" placeholder="角色名称不能为空" class="el-input__inner" />
        </div>
        <div class="dialog-form-item">
          <span>角色描述： </span>
          <textarea id="editRoleDesc" v-model="editRoleDesc" class="el-textarea__inner"></textarea>
          <!-- <input type="text" id="editRoleDesc" v-model="editRoleDesc" /> -->
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submitEdit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  import * as roleService from '../../api/RoleService';
  import * as HTTP from '../../api/httpUtil';
  import * as apiConst from '../../api/ApiConst';

  export default {
    name: 'RoleList',
    data: () => {
      return {
        radioValue: '',
        roleList: [],
        dialogVisible: false,
        dialogVisible1: false,
        editRoleName: '',
        editRoleDesc: '',
        treeData: [],
        expandAll: true,
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        theme: true
      };
    },
    components: {
    },
    methods: {
      adaptHeight() {
        const winHeight = window.innerHeight,
          pageHeader = document.querySelectorAll('.page-header')[0].offsetHeight,
          oprHeight = document.querySelectorAll('.hd-opr')[0].offsetHeight,
          treeHeight = winHeight - pageHeader - oprHeight - 2;
        document.querySelector('#roleTree').style.height = `${treeHeight}px`;
        document.querySelector('#permissionTree').style.height = `${treeHeight}px`;
      },
      handleNodeClick(data) {
        console.log(data.permissCode);
      },
      handleClose() {
        this.dialogVisible = false;
        this.dialogVisible1 = false;
        this.editRoleDesc = '';
        document.getElementById('roleDesc').value = '';
        document.getElementById('roleName').value = '';
        this.$message('操作已终止');
      },

      getMemberList() {
        roleService.getMember((success) => {
          this.roleList = success.content;
          // console.log('角色列表数据为', this.roleList);
        });
      },
      getPermissionList() {
        roleService.getPermissionList((success, error) => {
          if (error || success.code !== 200) {
            this.$message({
              type: 'error',
              message: error.content,
              duration: 5000
            });
          }
          if (success) {
            /*var que= success.content.concat([]);
            while(que.length>0){
              var val = que.pop();
              val.label= val.label+" "+val.permissCode
              if(val.children){
                que.push(...val.children);
              }
            }*/
            this.treeData= success.content;
          }
        });
      },
      checkTreeNode(data) {
        var checkedTreeArray = [];
        // 遍历树形
        var que= [].concat(data);

        while(que.length>0){
            var val = que.pop();
            if(val.checked=="1"){
              checkedTreeArray.push(val.permissCode);
            }
            if(val.children){
             que.push(...val.children);
            }
        }

        console.log(`checked keys:${checkedTreeArray}`)
        this.$refs.tree.setCheckedKeys(checkedTreeArray);
      },
      addRole() {
        const url = `${apiConst.apiPermissionDomain}/permission/role/add`,
          Obj = {
            roleName: document.getElementById('roleName').value,
            roleDesc: document.getElementById('roleDesc').value
          };
        if (Obj.roleName === '' || Obj.roleName.length > 20) {
          this.$message({
            message: '角色名称必选且不能超过20个字符',
            type: 'warning'
          });
          return false;
        }
        if (Obj.roleDesc.length > 50) {
          this.$message({
            message: '角色描述不能超过50个字符',
            type: 'warning'
          });
          return false;
        }
        HTTP.post(url, Obj, (success) => {
          if (success) {
            this.$message({
              message: '恭喜你，角色添加成功',
              type: 'success'
            });
            roleService.getMember((suc) => {
              this.roleList = suc.content;
            });
          }
        });
        this.dialogVisible = false;
        document.getElementById('roleName').value = '';
        document.getElementById('roleDesc').value = '';
      },
      deletedRole() {
        if (this.radioValue) {
          const code = this.radioValue,
            url = `${apiConst.apiPermissionDomain}/permission/role/${code}/delete`;
          this.$confirm('一旦删除该角色，绑定该角色的用户将无法使用该角色对应的功能和相关操作，请谨慎处理。', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            HTTP.post(url, {}, (success) => {
              if (success) {
                this.$message({
                  message: '角色删除成功',
                  type: 'success'
                });
                this.getMemberList();
              }
              this.dialogVisible = false;
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        } else {
          this.$message({
            message: '请选择一个要删除的角色',
            type: 'warning'
          });
        }
      },
      editRole() {
        if (this.radioValue) {
          this.dialogVisible1 = true;
          for (let i = 0, len = this.roleList.length; i < len; i++) {
            const element = this.roleList[i];
            if (element.code === this.radioValue) {
              this.editRoleName = element.roleName;
              this.editRoleDesc = element.description;
              break;
            }
          }
        } else {
          this.$message({
            message: '请选择一个要编辑的角色',
            type: 'warning'
          });
        }
      },
      submitEdit() {
        const paramObj = {
          code: this.radioValue,
          roleName: this.editRoleName,
          roleDesc: this.editRoleDesc||'',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        };
        if (paramObj.roleName === '' || paramObj.roleName.length > 20) {
          this.$message({
            message: '角色名称必选且不能超过20个字符',
            type: 'warning'
          });
          return false;
        }
        if (paramObj.roleDesc.length > 50) {
          this.$message({
            message: '角色描述不能超过50个字符',
            type: 'warning'
          });
          return false;
        }
        roleService.editUserInfo(paramObj, (success, error) => {
          if (success) {
            this.$message({
              message: '角色编辑成功',
              type: 'success'
            });
            this.dialogVisible1 = false;
            this.getMemberList();
          }
          if (error) {
            this.$message.error('角色编辑失败');
          }
        });
      },
      getPermissionCodeList() {
        var data = this.$refs.tree.getCheckedNodes();
        var tempCheckArray=[];
        if (data) {
          data.forEach((val) => {
            if (val.permissCode) {
              tempCheckArray.push(val.permissCode);
            }
          });
          return tempCheckArray;
        }
      },
      savePermissionEdit() {
         const obj = {
            roleCode: this.radioValue,
            permissionCodeList: this.getPermissionCodeList()
          };
        // console.log(obj);
        if (this.radioValue) {
          roleService.savePermissionEdit(obj, (success, error) => {
            if (success) {
              this.$message({
                message: '修改权限成功',
                type: 'success'
              });
            }
            if (error) {
              this.$message.error('修改权限失败');
            }
          });
        } else {
          this.$message({
            message: '请选择一个要编辑的角色',
            type: 'warning'
          });
        }
      },
      changeHandle(value) {
        roleService.getRolePermission({ code: value }, (success, error) => {
          if (error || success.code !== 200) {
            this.$message({
              type: 'error',
              message: error.content,
              duration: 5000
            });
          }
          if (success) {
            //this.treeData = success.content;
            this.checkTreeNode(success.content);
          }
        });
      }
    },
    created() {
      if (this.theme) {
        document.querySelector('body').classList.add('theme-blue');
      }
      // 检测高度
      this.$nextTick(() => {
        this.adaptHeight();
        window.onresize = () => {
          this.adaptHeight();
        };
      });
    },
    mounted() {
      this.getMemberList();
      this.getPermissionList();
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../assets/sass/base.scss";
  @import "./role";
</style>
