<template>
  <div id="template" :class="{ 'theme-blue': theme }">
    <!-- top -->
    <loginHeader :appInfo = 'appInfo'></loginHeader>
 <!--    <div class="topbar">
      <div class="inner">
        <span class="hotline fr"><i class="ico-tel"></i>24小时客服热线：<strong class="tel">{{ appInfo.hotline }}</strong></span>
      </div>
    </div> -->
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
                <li class="step1 sibg">1、确认账号</li>
                <li class="step2 focus">2、重置密码</li>
                <li class="step3">3、完成</li>
              </ul>
            </div>
            <div class="regbd">
              <div id="userForm">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="reg-form formlist">
                  <el-form-item label="密码" prop="password">
                    <el-row>
                      <el-col :span="9">
                        <el-input type="password" v-model='ruleForm.password' placeholder="密码应该在6-20位字符之间" @keyup.native="checkPwd()" name="regPassword" id="regPassword"></el-input>
                      </el-col>
                      <el-col :span="15">
                        <span class="pwdlevel level-weak" v-if="weak">
                          <i class="level pass"></i>
                          <i class="level"></i>
                          <i class="level"></i>
                          <strong class="strength">弱</strong>
                        </span>
                        <span class="pwdlevel level-centre" v-if="centre">
                          <i class="level pass"></i>
                          <i class="level pass"></i>
                          <i class="level"></i>
                          <strong class="strength">中</strong>
                        </span>
                        <span class="pwdlevel level-strong" v-if="strong">
                          <i class="level pass"></i>
                          <i class="level pass"></i>
                          <i class="level pass"></i>
                          <strong class="strength">强</strong>
                        </span>
                      </el-col>
                    </el-row>
                  </el-form-item>
                  <el-form-item label="确认密码" prop="password2">
                    <el-input type="password" v-model='ruleForm.password2' placeholder="再次确认密码" name="regPassword2" id="regPassword2"></el-input>
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
      const comparePass = (rule, value, callback) => {
          if (value !== this.ruleForm.password) {
            callback(new Error('两次输入的密码不一致'));
          } else {
            callback();
          }
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
          password: '',
          password2: ''
        },
        rules: {
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 20, message: '密码应该在6-20位字符之间', trigger: 'blur' }
          ],
          password2: [
            { required: true, message: '请输入确认密码', trigger: 'blur' },
            { validator: comparePass, trigger: 'blur' }
          ]
        },
        isDisable: true,
        weak: false,
        centre: false,
        strong: false,
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
      checkPwd() {
        const pwd = this.ruleForm.password;
        if (pwd.length >= 6) {
          this.pwdlevel(pwd);
        }
        if (pwd.length === 0) {
          this.weak = false;
          this.centre = false;
          this.strong = false;
        }
      },
      pwdlevel(pwd) {
        const regNumber = /\d+/,
          regLowerWords = /[a-z]+/,
          regUpperWords = /[A-Z]+/,
          regSpeChar = /[~!@#$%^&*()_+]/,
          regLen = /\S{12,}/,
          regSame = /^(.)\1{2,}$/;
        let strength = 0;
        if (regNumber.test(pwd)) {
          strength += 10;
        }
        if (regLowerWords.test(pwd)) {
          strength += 10;
        }
        if (regUpperWords.test(pwd)) {
          strength += 10;
        }
        if (regSpeChar.test(pwd)) {
          strength += 10;
        }
        if (regLen.test(pwd)) {
          strength += 10;
        }
        if (regSame.test(pwd)) {
          strength -= 10;
        }
        // console.log(strength);
        switch (strength) {
          case 0:
          case 10:
            this.weak = true;
            this.centre = false;
            this.strong = false;
            break;
          case 20:
            this.weak = true;
            this.centre = false;
            this.strong = false;
            break;
          case 30:
            this.weak = false;
            this.centre = true;
            this.strong = false;
            break;
          case 40:
            this.weak = false;
            this.centre = false;
            this.strong = true;
            break;
          case 50:
            this.weak = false;
            this.centre = false;
            this.strong = true;
            break;
          default:
            this.weak = false;
            this.centre = false;
            this.strong = false;
            break;
        }
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.btnDisabled = true;
            const account = localStorage.getItem('account'),
              accountObj = JSON.parse(account),
              paramObj = {
                newPassword: this.ruleForm.password,
                mobilePhone: accountObj.mobilePhone,
                verificationCode: accountObj.verificationCode
              };
            FindPwdService.resetPwd(paramObj, (success, error) => {
              if (success) {
                localStorage.removeItem('account');
                window.location.href = '/findPwd/success.html';
              }
              if (error) {
                this.btnDisabled = false;
                console.log(error);
              }
            });
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
