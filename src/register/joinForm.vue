<template>
  <div id="joinForm">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="reg-form formlist">
      <el-form-item label="公司名称" prop="companyName" class="is-required">
        <el-select v-model="ruleForm.code">
          <el-option :key="x.code" :value="x.code" :label="x.ownerOrgName" v-for="x in listData"></el-option>
        </el-select>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">申请加入</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
  import * as EmployeeService from '../../api/EmployeeService';

  import * as PlatformService from '../../api/PlatformService';

  export default {
    data() {
      return {
        ruleForm: {
          code: ''
        },
        rules: {
          // companyName: [
          //   { required: true, message: '请选择您要加入的公司全称', trigger: 'change' }
          // ]
        },
        paramObj: {},
        listData: [],
        loginAccount: ''
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (!this.ruleForm.code) {
              this.$message({
                type: 'warning',
                message: '请选择您要加入的公司！',
                duration:3000
              });
              return false;
            } else {
              this.btnDisabled = true;
              this.listData.forEach((value) => {
                if (value.code === this.ruleForm.code) {
                  this.paramObj.ownerOrgName = value.ownerOrgName;
                  this.paramObj.ownerOrgCode = value.ownerOrgCode;
                  this.paramObj.fullName = value.fullName;
                  this.paramObj.phone = this.loginAccount;
                }
              });
              PlatformService.setUserInfoCode(this.ruleForm.code, this.paramObj, (success, error) => {
                if (error || success.code !== 200) {
                  this.$message({
                    type: 'error',
                    message: error.content,
                    duration: 5000
                  });
                  this.btnDisabled = false;
                  return false;
                }
                if (success) {
                  const userInfo = {
                      'orgCode': this.paramObj.ownerOrgCode,
                      'orgFullName': this.paramObj.ownerOrgName,
                      'userFullName': this.paramObj.fullName,
                      'loginAccount': this.loginAccount
                    },
                    userInfoObj = JSON.stringify(userInfo);
                  localStorage.setItem('userInfo', userInfoObj);
                  window.location.href = '/menu/menu.html';
                  this.btnDisabled = false;
                }
              });
            }
          } else {
            return false;
          }
        });
      }
    },
    created() {
      this.loginAccount = window.location.search.substr(1).split('=')[1];
      EmployeeService.registerList({ size: 100, phone: this.loginAccount }, (success) => {
        this.listData = success.content;
      });
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
</style>
