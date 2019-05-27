/**
* table.vue
* Created by cc on 17/6/30.
*/
<template>
  <div id="template">
    <!-- top -->
    <loginHeader :appInfo = 'appInfo'></loginHeader>
<!--     <div class="topbar">
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
              <h2 class="logtit fl">注册与激活<em>REGISTRATION & ACTIVATION</em></h2><p class="lognow fr">已有账号？直接去 <a href="/login/login.html">登录</a></p>
            </div>
            <div class="steps">
              <ul>
                <li class="step1 sibg">1、填写信息</li>
                <li class="step2 focus">2、提交激活</li>
                <li class="step3">3、激活成功</li>
              </ul>
            </div>
            <div class="regbd">
              <!-- register feedback -->
              <div class="reg-feedback clearfix">
                <!-- result 1 -->
                <div class="reg-result bg-green tc">
                  <i class="ico-success"></i>
                  <h3 class="reg-tit green">恭喜您，个人信息注册成功！</h3>
                </div>
                <!-- join-section -->
                <div class="join-section">
                  <p class="tc">平台检测到以下公司邀请您成为企业员工，您可以选择一个公司加入：</p>
                  <el-form class="reg-form formlist" label-width="150px">
                    <el-form-item label="公司名称">
                      <el-select v-model="code">
                        <el-option :key="x.code" :value="x.code" :label="x.ownerOrgName" v-for="x in listData"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="onSubmit" :disabled="btnDisabled">接受邀请</el-button>
                    </el-form-item>
                  </el-form>
                  <!-- <div class="block">
                    <el-select v-model="code">
                      <el-option :key="x.code" :value="x.code" :label="x.ownerOrgName" v-for="x in listData"></el-option>
                    </el-select>
                    <el-button type="primary" @click="onSubmit" :disabled="btnDisabled">提交</el-button>
                  </div> -->
                </div>
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

  import * as EmployeeService from '../../api/EmployeeService';
  import * as PlatformService from '../../api/PlatformService';
  import loginHeader from '../login/loginHeader.vue'
  import loginFooter from '../login/loginFooter.vue'

  export default {
    components:{
      loginHeader,
      loginFooter
    },
    data() {
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
        listData: [],
        code: '',
        btnDisabled: false,
        paramObj: {},
        loginAccount: ''
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

      this.loginAccount = window.location.search.substr(1).split('=')[1];
      // console.log(url);
      // console.log(EmployeeService);
      EmployeeService.registerList({ size: 100, phone: this.loginAccount }, (success) => {
        // console.log(success.content);
        this.listData = success.content;
      });
    },
    methods: {
      onSubmit() {
        this.btnDisabled = true;
        // console.log(this.code);
        this.listData.forEach((value) => {
          if (value.code === this.code) {
            this.paramObj.ownerOrgName = value.ownerOrgName;
            this.paramObj.ownerOrgCode = value.ownerOrgCode;
            this.paramObj.fullName = value.fullName;
            this.paramObj.phone = this.loginAccount;
          }
        });
        PlatformService.setUserInfoCode(this.code, this.paramObj, (success, error) => {
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
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../assets/sass/base.scss";
  @import "register";

  .join-section {
    .formlist {
      height: auto;
      margin: 20px 180px;
    }
  }

  .el-input__inner {
    width: 260px;
    height: 28px;
    border-radius: 3px;
  }

  .fake-input {
    position: absolute;
    z-index: -10;
    opacity: 0;
    width: 0;
    height: 0;
    overflow: hidden;
  }

  .el-button {
    height: 28px;
    line-height: 1;
  }
</style>
