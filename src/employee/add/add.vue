/**
* add.vue
* Created by dsky on 17/7/6.
*/
<template>
  <div class="form-page">
    <ele-form :domainObject="domainObject" ref="form"
              :configUrl="configUrl" :listUrl="listUrl" :listTitle="listTitle"
              :getInfo="getInfo" :addFun="addFun" :editFun="editFun"
              :editable="editable" :isEdit="isEdit"
              @formReady="formReady" @formMounted="formMounted" @addSuccess="addSuccess" @editSuccess="editSuccess" @submitDone="submitDone"
              :objectName="objectName"
              label-width="100px" :inline="false">
      <layout :isEdit="isEdit" :editable="editable" :objectName="objectName">
        <div v-for="field in fields" :slot="field.fieldConfigCode">
          <el-form-item :label="field.showName" :required="field.required ==='true'">
            <ele-block :field="field" :domainObject="domainObject" :editable="editable" :uploadUrl="uploadUrl" :inputKey="inputKey"></ele-block>
          </el-form-item>
        </div>
        <!--<el-col :span="24">-->
        <!--<h2>角色</h2>-->
        <!--</el-col>-->
        <el-col :span="24" slot="roleList" class="el-col-auto">
          <el-checkbox-group v-model="checkList" v-if="editable">
            <el-col :span="4" v-for="item in showRoleList" :key="item.code">
              <el-checkbox :label="item.code" :disabled="item.showtype">{{ item.roleName }}</el-checkbox>
            </el-col>
          </el-checkbox-group>
          <span class="fl" v-else>{{roleText}}</span>
        </el-col>
        <!--<el-col :span="24">-->
        <!--<h2>部门</h2>-->
        <!--</el-col>-->
        <el-col :span="24" slot="deptList">
          <div  v-if="editable">
            <span style="color:red">*</span>
            <dpTreeSelect v-model="checkDeptList"/>
          </div>
          <span class="fl" v-else>{{deptText}}</span>
        </el-col>

        <el-button type="primary" v-show="!editable && isEdit" @click="editForm()" slot="buttonEdit" :disabled="btnDisabled">编辑</el-button>
        <el-button v-show="editable && isEdit" @click="cancelEdit()" slot="buttonCancel" :disabled="btnDisabled">取消编辑</el-button>
        <el-button v-show="editable && isEdit" @click="submitForm()" slot="buttonSave" :disabled="btnDisabled">保存</el-button>
        <!--<el-button v-show="!editable && isEdit" @click="changeLog()" slot="buttonChangeLog">{{ objectName }}变更记录</el-button>-->

        <el-button v-show='editable && !isEdit' type="primary" @click="submitForm()" size="large" slot="buttonSubmit" :disabled="btnDisabled">提交</el-button>
        <el-button v-show='editable && !isEdit' @click="resetForm()" size="large" slot="buttonReset" :disabled="btnDisabled">重置</el-button>

        <el-button v-show="!isEdit || editable" slot="userMatch" @click="userMatch" class="el-button--line"><i class="el-icon-search"></i>匹配</el-button>

      </layout>
    </ele-form>
    <el-tabs type="border-card" v-if="isEdit">
      <el-tab-pane label="变更记录">
        <logs :selectable="false" :operatable="false"
              :domain="uploadUrl" :type="logType" :code="code" :isAdvanced="false"
              :params="changeLogParams" :needPage="true">
        </logs>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/ecmascript-6">
  import eleBlock from '../../components/ele-block/eleBlock.vue';
  import eleForm from '../../components/ele-form/eleForm.vue';
  import layout from './layout.vue';
  import logs from '../../logs/list.vue';
  import ApiConst from '../../../api/ApiConst';
  /* eslint-disable no-unused-vars */
  import { edit as employeeEdit, editRole as employeeEditRole, add as employeeAdd, get as employeeGet, getDept as employeeGetDept, getRole as employeeGetRole } from '../../../api/EmployeeService';
  import { matchDriverByPhone } from '../../../api/DriverManagementService';

  import { urlRedirect, getParamsFromURL, getParam } from '../../../api/Utils';

  import { get as httpGet } from '../../../api/httpUtil';
  import dpTreeSelect from '../../components/ele-treeselect/eleDPTreeSelect.vue';

  export default {
    data() {
      return {
        fields: [],
        inputKey: [],
        loading: true,
        isEdit: false, // 控制编辑添加按钮
        editable: false, // 控制页面状态
        btnDisabled: false,
        logType: 'employee',
        changeLogParams: {
          code: getParamsFromURL(window.location.search).code,
          size: 10
        },
        code: '',
        domainObject: {},
        getData: {},
        initData: {},
        // 获取伙伴字段配置
        configUrl: `${ApiConst.apiPersonDomain}/detail_render_info/employee/list`,
        getInfo: employeeGet,
        addFun: employeeAdd,
        editFun: employeeEdit,
        listUrl: '/employee/list.html',
        listTitle: '组织结构',
        objectName: '人员',
        // 显示权限列表，我能看见的权限列表，编辑情况下改角色能看到的权限列表
        showRoleList: [],
        myRoleList: [],
        thisRoleList: [],
        checkList: [],
        deptList: [],
        checkDeptList: '',
        uploadUrl: `${ApiConst.apiPersonDomain}`,
        roleText: '',
        paramObj2: {},
        deptText: '',
        btnDisable: false,
        depTreeData: []
      };
    },
    components: {
      'dpTreeSelect': dpTreeSelect,
      'ele-block': eleBlock,
      'ele-form': eleForm,
      layout,
      logs
    },
    methods: {
      disablePhone() {
        const el = this.$refs.form.getElementByField('phone');
        if (el.configData) {
          this.$set(el.configData,'readonly','readonly');
        }
      },
      formReady(formData) {
        this.inputKey = formData.paramData.inputKey;
        this.fields = formData.paramData.field;
        this.isEdit = formData.isEdit;
        this.editable = formData.editable;
        this.code = formData.code;
        if (this.isEdit) {
          // 获取部门信息
          if (this.domainObject.deptCode) {
            employeeGetDept({ code: this.domainObject.deptCode }, (respond) => {
              this.deptText = respond.content.deptName;
            });
          }
          this.checkDeptList = this.domainObject.deptCode;

          // 获取角色列表
          employeeGetRole({ userCode: this.domainObject.code }, (success) => {
            const roleArr = [];
            success.content.forEach((value) => {
              roleArr.push(value.roleName);
              this.checkList.push(value.code);
            });
            this.roleText = roleArr.join('，');
          });
        }
        this.loading = false;
      },
      formMounted(form) {
        // 如果账号已激活，则不能修改手机号码
        if (this.domainObject.userStatus === 'activated') {
          this.disablePhone();
        }
      },
      editForm() {
        this.editable = true;
      },
      cancelEdit() {
        this.$refs.form.resetForm();
        this.editable = false;
      },
      submitForm() {
        this.btnDisabled = true;
        if(!this.checkDeptList || this.checkDeptList==''){
          this.btnDisabled = false;
          alert("请选择部门");
          return false;
        }
        this.domainObject.deptCode = this.checkDeptList;
        this.$refs.form.submitForm();
        this.btnDisabled = false;
      },
      resetForm() {
        this.$refs.form.resetForm();
      },
      updateRole() {
        employeeEditRole({
          userCode: this.domainObject.code,
          roleCodes: this.checkList.length > 0 ? this.checkList.join(',') : ''
        }, (success) => {
          if (success) {
            this.setRoleName(this.checkList);
          }
        });
      },
      addSuccess(model) {
        this.domainObject.code = model.code;
        this.updateRole();
      },
      editSuccess() {
        this.updateRole();
        this.setDeptName(this.checkDeptList);
        this.editable = false;
      },
      submitDone() {
        this.btnDisabled = false;
      },
      changeLog() {
        const url = `/logs/list.html?domain=${this.uploadUrl}&type=employee&code=${this.code}`,
          title = '人员变更记录';
//        console.log(url, title);
        urlRedirect(url, title);
      },
      setRoleName(codes) {
        const roleArr = [];
        if (codes.length === 0) {
          this.roleText = '';
        } else {
          codes.forEach((value1) => {
            this.showRoleList.forEach((value2) => {
              if (value1 === value2.code) {
                roleArr.push(value2.roleName);
              }
            });
          });
          this.roleText = roleArr.join('，');
        }
      },
      setDeptName(code) {
        this.deptList.forEach((value) => {
          if (code === value.code) {
            this.deptText = value.deptName;
          }
        });
      },
      showError(text) {
        this.$message({
          type: 'error',
          showClose: true,
          message: text,
          duration: 5000
        });
        return false;
      },
      userMatch() {
        if (this.domainObject.phone) {
          const params = {
            phone: this.domainObject.phone
          };
          matchDriverByPhone(params, (success, error) => {
            // if (error || success.code !== 200) {
            //   if (error.code === 404) {
            //     this.showError('未匹配到信息！');
            //   } else {
            //     this.showError(error.content);
            //   }
            // }
            if (success) {
              const data = success.content,
                fieldArray = [ 'fullName', 'userStatus', 'gender', 'identityNumber', 'politicalStatus', 'maritalStatus', 'nativePlace', 'registedResidence', 'identityCardAddress', 'currentResidence', 'emergencyContactPerson', 'emergencyContactPhone', 'education', 'major', 'startDateOfFirstJob', 'employmentDate'];
              console.log('userMatch result is ', data);
              Object.keys(data).forEach((key) => {
                if (fieldArray.includes(key)) {
                  this.$set(this.domainObject, key, data[key]);
                }
              });
              // 已激活的不能修改手机号
              const el = this.$refs.form.getElementByField('phone');
              if (this.domainObject.userStatus === 'activated') {
                this.$set(el.configData, 'readonly', 'readonly');
              }
            }
          });
        }
      }
    },
    created() {
      // 获取权限列表,部门角色列表
      const myRoleUrl = `${ApiConst.apiPermissionDomain}/permission/user/role/list/self`,
        myDeptUrl = `${ApiConst.apiOrgDomain}/dept/self/list`;

      // 获取部门
      httpGet(myDeptUrl, {}, (suc) => {
        this.deptList = suc.content;
        // this.deptText = suc.content[0].deptName;
        // this.checkDeptList = suc.content[0].code;
      });

      httpGet(myRoleUrl, {}, (suc) => {
        this.myRoleList = suc.content;
        const roleArray = [];
        this.myRoleList.forEach((value) => {
          roleArray.push(value.roleName);
        });
        this.showRoleList = this.myRoleList;
      });
    },
    mounted() {
      const self = this;
      window.matchEmployeeNow = function() {
        console.log('matchEmployeeNow');
        self.userMatch();
      }
      // 失焦匹配信息
      setTimeout(() => {
        const ele = document.getElementsByName('phone')[0];
        if (ele) {
          ele.setAttribute('onblur', 'matchEmployeeNow()');
        }
      }, 1000);
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../../assets/sass/base.scss";
  .el-checkbox-group .el-col-4{
    text-align: left;
  }

  .el-col h2 {
    text-align: left;
    font-size: 16px;
    padding: 10px 0;
    color: #f48400;
  }

  .el-radio-group {
    width: 100%;
    text-align: left;
  }
</style>
