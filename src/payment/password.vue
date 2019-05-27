<template>
  <div id="accountpreview" class="form-page">
    <div class="page-header clearfix">
      <h2 class="page-title fl">
       设置交易密码
      </h2>
      <span class="page-refresh fr" id="pageRefresh">
        <i class="ico-refresh"></i>刷新
      </span>
      <div class="hd-opr fr">
      </div>
    </div>
    <div id="tmp-wrap"></div>
    <el-row v-loading.fullscreen.lock="loading" element-loading-text="加载中">
      <el-form :model="domainObject" ref="pwdForm" label-width="150px" :inline="true" >
        <div class="block block-box" style="padding: 30px">
          <el-col :span="24">
            <el-form-item label="手机号"
            prop="mobile"
            :rules="[
              { required: true, message: '请输入手机号', trigger: 'blur' },
            ]">
              <el-input v-model="domainObject.mobile" placeholder="请输入手机号" :disabled="true"/>
            </el-form-item>
          </el-col>

          <el-col :span="24">
          <el-form-item label="验证码"
          prop="verifyCode"
          :rules="[
            { required: true, message: '请输入验证码', trigger: 'blur' },
          ]">
            <el-input v-model="domainObject.verifyCode" placeholder="请输入验证码" />
          </el-form-item>
            <el-button type="primary" @click="handlefetchSMSCode" :disabled="disabledfetchcode" :readonly="disabledfetchcode">获取验证码<template v-if="timelimit > 0">({{ timelimit }}秒)</template></el-button>

          </el-col>

          <el-col :span="24">
          <el-form-item label="交易密码"
          prop="newPassword"
          :rules="[
            { required: true, message: '请输入交易密码', trigger: 'blur' },
          ]">
            <el-input type="password" auto-complete="off" v-model="domainObject.newPassword" placeholder="请输入交易密码" />
          </el-form-item>
          </el-col>

          <el-col :span="24">
          <el-form-item label="确认交易密码"
          prop="password2"
          :rules="[
            { required: true, message: '请输入确认交易密码', trigger: 'blur' },
            { validator: validatePass2, trigger: 'blur' }
          ]">
            <el-input type="password" auto-complete="off" v-model="domainObject.password2" placeholder="请输入确认交易密码" />
          </el-form-item>
          </el-col>

          <el-col :span="24" class="el-col-button">
            <el-form-item>
              <el-button type="primary" size="large" @click="handleSubmit('pwdForm')" :disabled="disabledBtn" :loading="disabledBtn">确认修改</el-button>
            </el-form-item>
          </el-col>

        </div>
      </el-form>
    </el-row>





  </div>
</template>

<script type="text/ecmascript-6">
import { modify, fetchCode } from '../../api/paymemberService';
import { setTimeout } from 'timers';

export default {
  name: 'payment-password',
  data() {

    return {
      domainObject: {},
      domainFormObject: {},
      loading: false,
      timelimit: 0,
      disabledfetchcode: false,
      disabledBtn: false,
      theme: true
    }
  },
  methods: {
    timeclock() {
      if(this.timelimit > 0) {
        this.disabledfetchcode = true
        setTimeout(() => {
          this.timeclock()
          this.timelimit --
        }, 1000)
      } else {
        this.disabledfetchcode = false
      }
    },
    validatePass2 (rule, value, callback){
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.domainObject.newPassword) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    },
    handlefetchSMSCode() {
      if(!this.domainObject.mobile) {
        this.$message({
          type: 'error',
          message: '手机号不能为空',
          duration: 3000
        });
        return
      }
      const params = {
        mobile: this.domainObject.mobile
      }
      fetchCode(params,(success,err) => {
        if(success && success.code === 200) {
          this.$message({
            type: 'success',
            message: '发送成功',
            duration: 3000
          })
          this.timelimit = 20
          this.timeclock()
        }
        if(err) {
          this.$message({
            type: 'error',
            message: err.content,
            duration: 5000
          });
        }
      })
    },
    handleSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.disabledBtn = true
          const params = {
            verifyCode: this.domainObject.verifyCode,
            phone: this.domainObject.mobile,
            newPassword: this.domainObject.newPassword
          }
          modify(params,(success,err) => {
            if(success && success.code === 200) {
              this.$message({
                type: 'success',
                message: '修改成功',
                duration: 3000
              })
              this.$set(this.domainObject, 'verifyCode', '')
              this.$set(this.domainObject, 'newPassword', '')
              this.$set(this.domainObject, 'password2', '')
              this.disabledBtn = false
            }
            if(err) {
              this.$message({
                type: 'error',
                message: err.content,
                duration: 5000
              })
              this.disabledBtn = false
            }
          })
        }
      });
    }
  },
  created() {
    if (this.theme) {
      document.querySelector('body').classList.add('theme-blue');
    }
  },
  mounted() {
    const loginuser = JSON.parse(localStorage.getItem('userInfo')) || {}
    if(loginuser.loginAccount) {
      this.$set(this.domainObject, 'mobile', loginuser.loginAccount)
    }
  }
}
</script>


<style lang="scss" rel="stylesheet/scss">
@import "../assets/sass/base.scss";
</style>
