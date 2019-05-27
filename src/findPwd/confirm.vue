<template>
  <div id="template" :class="{ 'theme-blue': theme }">
    <!-- top -->
<!--     <div class="topbar">
      <div class="inner">
        <span class="hotline fr"><i class="ico-tel"></i>24小时客服热线：<strong class="tel">{{ appInfo.hotline }}</strong></span>
      </div>
    </div> -->
    <loginHeader :appInfo = 'appInfo'></loginHeader>
    <!-- logreg page -->
    <div class="logreg">
      <!-- header -->
      <header class="header">
        <div class="inner clearfix">
          <h1 class="logo fl" :style="appInfo.logoUrl ? {backgroundImage: 'url(' + appInfo.logoUrl + ')', width: appInfo.logoWidth, height: appInfo.logoHeight} : {margin: '20px 0'}">{{ appInfo.appName }}</h1>
        </div>
      </header>
      <!-- logreg -->
      <div class="logregfm">
        <div class="inner clearfix">
          <!-- register form -->
          <div class="regform">
            <div class="reghd clearfix">
              <h2 class="logtit fl">找回密码<em>FIND YOUR PASSWORD</em></h2><p class="lognow fr">记起密码了？直接去 <a href="/login/login.html">登录</a></p>
            </div>
            <div class="steps">
              <ul>
                <li class="step1 focus">1、确认账号</li>
                <li class="step2">2、重置密码</li>
                <li class="step3">3、完成</li>
              </ul>
            </div>
            <div class="regbd">
              <div id="userForm">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="reg-form formlist">
                  <el-form-item label="手机号" prop="loginAccount">
                    <el-row>
                      <el-col :span="9">
                        <el-input v-model='ruleForm.loginAccount' placeholder="请输入手机号码" name="loginAccount" id="loginAccount"></el-input>
                      </el-col>
                      <el-col :span="15">
                        <el-button type="primary" @click="getCode()" v-if="isShow===true" id="getValiCode" :disabled="isDisable">获取验证码</el-button>
                        <el-button type="default" disabled v-if="isShow===false">还剩<strong id="number" class="org">60</strong>秒</el-button>
                      </el-col>
                    </el-row>
                  </el-form-item>
                  <el-form-item label="验证码" prop="verifyCode">
                    <el-input v-model='ruleForm.verifyCode' placeholder="请输入验证码" name="verifyCode" id="verifyCode"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button class="el-next" type="primary" @click="submitForm('ruleForm')" :disabled="btnDisabled">下一步</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
    <!-- footer -->
    <loginFooter :appInfo = 'appInfo'></loginFooter>
<!--     <footer class="footer">
        <p>
            为了您可以更好的使用{{ appInfo.appName }}系统，请使用 Chrome(谷歌) 浏览器<br>
            为了能够浏览或下载{{ appInfo.appName }}系统内的文档，您需要在浏览器设置中允许来自{{ appInfo.appDomain }} 的弹出窗口。
        </p>
        <p class="copyright">
            &copy; Copyright {{ years }} {{ appInfo.company }} All Rights Reserved. <a href="http://www.miitbeian.gov.cn" target="_balnk"> {{ appInfo.ICP }} </a> <br> <span v-if="powerBy">Powered by <a href="http://www.rltx.com" target="_blank">融链天下</a></span>
        </p>
    </footer> -->
  </div>
</template>

<script type="text/ecmascript-6">

  import * as FindPwdService from '../../api/FindPwdService';
  import loginHeader from '../login/loginHeader.vue'
  import loginFooter from '../login/loginFooter.vue'

  export default {
    components:{
      loginHeader,
      loginFooter
    },
    data() {
      const checkPhone = (rule, value, callback) => {
          const reg = /^1\d{10}$/;
          if (value.length === 11) {
            if (reg.test(value) === false) {
              callback(new Error('请输入正确的手机号'));
              this.isDisable = true;
            } else {
              const paramObj = {
                loginAccount: value
              };
              // console.log(this.isPhone);
              FindPwdService.checkUser(paramObj, (success, error) => {
                if (error) {
                  callback();
                  this.isDisable = false;
                }
                if (success) {
                  // callback(new Error(error.content));
                  callback(new Error('该号码尚未注册！'));
                  this.isDisable = true;
                }
              });
            }
          } else {
            // callback(new Error('请输入正确的手机号'));
            this.isDisable = true;
          }
        },
        checkValicode = (rule, value, callback) => {
          const phoneNumber = this.ruleForm.loginAccount,
            paramObj = {
              mobilePhone: phoneNumber,
              verificationCode: value
            };
          FindPwdService.checkValiCode(paramObj, (success, error) => {
            if (success) {
              const result = success.content.status;
              if (result === false) {
                callback(new Error('请输入正确的验证码'));
              } else {
                callback();
              }
            }
            if (error) {
              console.log(error);
            }
          });
        };
      return {
        appInfo: {
          appName: '',
          logoUrl: '',
          logoWidth: '',
          logoHeight: '',
          hotline: '',
          background: '',
          appDomain: '',
          company: '',
          ICP: ''
        },
        ruleForm: {
          loginAccount: '',
          verifyCode: ''
        },
        rules: {
          loginAccount: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { validator: checkPhone, trigger: 'change' },
            { validator: checkPhone, trigger: 'blur' }
          ],
          verifyCode: [
            { required: true, message: '请输入验证码', trigger: 'blur' },
            { validator: checkValicode, trigger: 'blur' }
          ]
        },
        isShow: true,
        isDisable: true,
        btnDisabled: false,
        theme: true
      };
    },
    computed: {
      years() {
        const start = JSON.parse(localStorage.getItem('webappConfig'))['webapp.copyright.start.time'] || '2019',
          end = new Date().getFullYear();
        let text = '';
        text = start == end ? `${start}` : `${start}-${end}`;
        return text;
      },
      powerBy() {
        let result = true;
        if (JSON.parse(localStorage.getItem('webappConfig'))['webapp.powered.company'] === 'FALSE') {
          result = false;
        }
        return result;
      }
    },
    methods: {
      getCode() {
        const loginAccount = this.ruleForm.loginAccount;
        if (loginAccount) {
          this.isDisable = true;
          this.isShow = false;
          this.timeCount(60);
          const paramObj = {
            mobilePhone: loginAccount
          };
          FindPwdService.getValiCode(paramObj, (success, error) => {
            if (error || success.code !== 200) {
              this.$message({
                type: 'error',
                message: error.content || '验证码发送失败',
                duration: 5000
              });
              return false;
            }
            if (success) {
              console.log('success');
            }
          });
        } else {
          return false;
        }
      },
      timeCount(time) {
        window.setTimeout(() => {
          let t = time;
          t -= 1;
          if (t === 0) {
            this.isShow = true;
            if (this.ruleForm.loginAccount) {
              this.isDisable = false;
            }
          } else {
            document.querySelector('#number').innerHTML = t;
            this.timeCount(t);
          }
        }, 1000);
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.btnDisabled = true;
            const accountObj = {
                mobilePhone: this.ruleForm.loginAccount,
                verificationCode: this.ruleForm.verifyCode
              },
              accountString = JSON.stringify(accountObj);
            localStorage.setItem('account', accountString);
            window.location.href = '/findPwd/reset.html';
          } else {
            return false;
          }
        });
      }
    },
    created() {
      const lsObj = JSON.parse(localStorage.getItem('appInfo'));
      this.appInfo.appName = lsObj.appName;
      this.appInfo.logoUrl = lsObj.logoUrl;
      this.appInfo.logoWidth = lsObj.logoWidth;
      this.appInfo.logoHeight = lsObj.logoHeight;
      this.appInfo.background = lsObj.background;
      this.appInfo.hotline = lsObj.hotline;
      this.appInfo.appDomain = lsObj.appDomain;
      this.appInfo.company = lsObj.company;
      this.appInfo.ICP = lsObj.ICP;
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../assets/sass/base.scss";
  @import "findPwd.scss";

  .formlist {
    margin: 50px;
  }

  .el-form-item {
    margin-bottom: 20px;
  }

  .el-input__inner {
    width: 260px;
    height: 28px;
    border-radius: 3px;
  }

  .el-button {
    height: 28px;
    line-height: 1;
  }

  .el-next {
    width: 260px;
    height: 30px;
  }
</style>
