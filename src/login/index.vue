/**
* login.vue
* 登录
* Created by cc on 18/4/16.
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
        <div class="inner clearfix login-bg" :style="appInfo.background ? {backgroundImage: 'url(' + appInfo.background + ')'} : ''">
          <!-- login form -->
          <div class="logform fl">
            <h2 class="logtit">用户登录<em>USER LOGIN</em></h2>
            <fieldset>
              <legend>用户登录表单</legend>
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="loglist">
                  <el-form-item prop="loginAccount">
                    <el-input v-model='ruleForm.loginAccount' placeholder="请输入用户名" name="loginAccount" id="loginAccount"></el-input>
                  </el-form-item>
                  <el-form-item prop="password">
                    <el-input type="password" v-model='ruleForm.password' placeholder="请输入密码" name="password" id="password"></el-input>
                    <a href="/findPwd/confirm.html" class="forget-pwd">忘记密码？</a>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="login('ruleForm')">登录</el-button>
                  </el-form-item>
                </el-form>
            </fieldset>
          </div>
          <!-- <div class="regrec fr">
              <h2>XX物流平台</h2>
              <p>——中国领先的物流服务整合平台</p>
              <p>随时随地，找货无忧！</p>
              <p>立刻注册，享受更多车源货源信息服务！</p>
              <a href="/register/user.html" class="el-button el-button--line">免费注册企业账号</a>
              <a href="/register/personal.html" class="el-button el-button--line" style="margin-top: 43px;">账号激活</a>
          </div> -->
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
import { login, webapp ,otherapp} from '../../api/LoginService';
import loginHeader from '../login/loginHeader.vue'
import loginFooter from '../login/loginFooter.vue'

export default {
  name: 'LoginList',
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
        ICP: '',
        tradeRulesName: '',
        tradeRulesUrl: '',
        registrationName: '',
        registrationUrl: '',
        specialTipsName: '',
        specialTipsUrl: '',
        clientAgreementName: '',
        clientAgreementUrl: '',
        driverAgreementName: '',
        driverAgreementUrl: '',
        registrationFunction: '',
        coreOrgName: '',
        coreOrgFullName: '',
        coreOrgCode: '',
        defaultOrgType: null,
        defaultScheduleType: '',
        enableScheduleType: '',
        contractName: '',
        contractUrl: '',
        reportLocation: '',
        complianceCheck: '',
        certControl: '',
        reportDomain: '',
        projectName: '',
        priceMode: '',
        icbcPay: '',
        showMatch: '',
        platformLogoUrl: '',
        platformName: ''
      },
      ruleForm: {
        loginAccount: '',
        password: ''
      },
      rules: {
        loginAccount: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      theme: ''
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
    login(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          login(this.ruleForm.loginAccount, this.ruleForm.password, this.loginCallback);
        } else {
          return false;
        }
      });
    },
    loginCallback(response, err) {
      if (err !== null) {
        this.$message.error(err.content);
        return false;
      }
      if (response.code === 200) {
        if (response.content.loginAccount) {
          const resObj = response.content,
            userInfo = {
              'orgCode': resObj.orgCode,
              'orgFullName': resObj.orgFullName,
              'userFullName': resObj.userFullName,
              'loginAccount': resObj.loginAccount
            },
            userInfoObj = JSON.stringify(userInfo);
          localStorage.setItem('userPermissions', response.content.permissionCodeList);
          localStorage.setItem('userInfo', userInfoObj);
           // console.log(resObj);
          window.location.href = '/menu/menu.html';
        } else {
          this.$message.error(response.content.message);
        }
      }
    }

  },
  beforeCreate() {
    webapp((success, error) => {
      if (error || success.code !== 200) {
        this.$message({
          type: 'error',
          message: error.content,
          duration: 5000
        });
      }
      if (success) {
        const data = success.content || {};
        localStorage.setItem('webappConfig',JSON.stringify(data));
        this.appInfo.appName = data['webapp.appName'] || '融链天下';
        this.appInfo.logoUrl = data['webapp.logoUrl'];
        this.appInfo.logoWidth = data['webapp.logoWidth'];
        this.appInfo.logoHeight = data['webapp.logoHeight'];
        this.appInfo.hotline = data['webapp.hotline'] || '021-20534899';
        this.appInfo.background = data['webapp.background'];
        this.appInfo.appDomain = data['webapp.appDomain'] || 'member.rltx.com';
        this.appInfo.company = data['webapp.company'] || '上海融链科技有限公司';
        this.appInfo.ICP = data['webapp.ICP'] || '沪ICP备15012288号-1';
        this.appInfo.tradeRulesName = data['webapp.tradeRulesName'] || '融链天下平台交易规则';
        this.appInfo.tradeRulesUrl = data['webapp.tradeRulesUrl'] || 'http://download2.rltx.com/yfb-xieyi/tradeRulesName.htm';
        this.appInfo.registrationName = data['webapp.statement.registrationName'] || '平台注册服务协议';
        this.appInfo.registrationUrl = data['webapp.statement.registrationUrl'] || 'http://download2.rltx.com/yfb-xieyi/registration.htm';
        this.appInfo.specialTipsName = data['webapp.specialTipsName'] || '特别提示';
        this.appInfo.specialTipsUrl = data['webapp.specialTipsUrl'] || 'http://download2.rltx.com/yfb-xieyi/publishfreightRules.htm';
        this.appInfo.clientAgreementName = data['webapp.clientAgreementName'] || '委托调车客户服务协议';
        this.appInfo.clientAgreementUrl = data['webapp.clientAgreementUrl'] || 'http://download2.rltx.com/yfb-xieyi/clientAgreement.html';
        this.appInfo.driverAgreementName = data['webapp.driverAgreementName'] || '委托调车司机承运协议';
        this.appInfo.driverAgreementUrl = data['webapp.driverAgreementUrl'] || 'http://download2.rltx.com/yfb-xieyi/driverAgreement.html';
        this.appInfo.registrationFunction = data['webapp.registrationFunction'] || 'false';
        this.appInfo.coreOrgName = data['coreOrgName'] || '';
        this.appInfo.coreOrgFullName = data['coreOrgFullName'] || '';
        this.appInfo.coreOrgCode = data['coreOrgCode'] || '';
        this.appInfo.defaultOrgType = data['webapp.defaultOrgType'] || '';
        this.appInfo.defaultScheduleType = data['webapp.defaultScheduleType'] || '';
        this.appInfo.enableScheduleType = data['webapp.enableScheduleType'] || 'TRUE';
        this.appInfo.contractName = data['webapp.contractName'] || '';
        this.appInfo.contractUrl = data['webapp.contractUrl'] || '';
        this.appInfo.reportLocation = data['webapp.reportLocation'] || '';
        this.appInfo.complianceCheck = data['webapp.complianceCheck'] || '';
        this.appInfo.reportDomain = data['webapp.reportDomain'] || '';
        this.appInfo.projectName = data['webapp.projectName'] || '';
        this.appInfo.priceMode = data['webapp.priceMode'] || '';
        this.appInfo.icbcPay = data['webapp.icbcPay'] || '';
        this.appInfo.showMatch = data['webapp.showMatch'] || ''; // 中交兴路是否显示匹配车辆信息
        this.appInfo.platformLogoUrl = data['webapp.platformLogoUrl'] || ''; // 平台LOGO标识
        this.appInfo.platformName = data['webapp.platformName'] || ''; // 平台名称
        this.appInfo.baoshangPay = data['webapp.baoshangPay'] || ''; // 包商pay

        // this.appInfo.needAuthc = data['webapp.dispatch.need.authc'] || ''; //

        this.theme = true;
        if (this.theme) {
          document.querySelector('body').classList.add('theme-blue');
        }
        localStorage.setItem('appInfo',JSON.stringify(this.appInfo));
      }
    });
    otherapp((success,error)=>{
      if(success){
        const data = success.content || {};
        localStorage.setItem('otherappConfig',JSON.stringify(data));
      }
    })
  },
  created() {
    var url = localStorage.getItem('domain_url');
    localStorage.clear();
    if(url) {
      localStorage.setItem('domain_url', url)
    }
    if (window.location.href !== window.top.location.href) {
      window.top.location.href = window.location.href;
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../assets/sass/base.scss";
  @import "login.scss";

  .el-input__inner {
    width: 300px;
    height: 36px;
    padding-left: 38px;
    border-radius: 3px;
  }

  .el-button {
    width: 300px;
    height: 34px;
    line-height: 32px !important;
    font-size: 16px;
    margin-left: 0 !important;
  }

  .forget-pwd {
    position: absolute;
    z-index: 20;
    right: 5px;
    top: 40px;
    font-size: 12px;
    color: #999;
    &:hover {
      color: #f48400;
    }
  }
</style>
