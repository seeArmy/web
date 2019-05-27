<template>
  <div id="join-page" :class="{ 'theme-blue': theme }">
    <!-- top -->
    <loginHeader :appInfo = 'appInfo'></loginHeader>
<!--     <div class="topbar">
      <div class="inner">
        <span class="hotline fr"><i class="ico-tel"></i>24小时客服热线：<strong class="tel">{{ appInfo.hotline }}</strong></span>
      </div>
    </div>    -->
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
                <li class="step1 sibg">1、填写个人信息</li>
                <li class="step2 focus">2、填写公司信息</li>
                <li class="step3">3、注册成功</li>
              </ul>
            </div>
            <div class="regbd">
              <!-- register feedback -->
              <div class="reg-feedback clearfix">
                <!-- result 1 -->
                <div class="reg-result bg-green tc">
                  <i class="ico-success"></i>
                  <h3 class="reg-tit green">您已成功注册个人信息，请选择注册新公司或加入公司！</h3>
                </div>
                <!-- join-section -->
                <div class="join-section">
                  <p class="tab">
                    <span :class="{ active: isShow }" @click="tab(0)">注册新公司</span>
                    <span :class="{ active: !isShow }" @click="tab(1)">加入到已存在公司</span>
                  </p>
                  <company-form v-show="isShow"></company-form>
                  <join-form v-show="!isShow"></join-form>
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
  import joinForm from './joinForm.vue';
  import companyForm from './companyForm.vue';
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
        isShow: true,
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
    components: {
      'company-form': companyForm,
      'join-form': joinForm
    },
    methods: {
      tab(index) {
        if (index === 0) {
          this.isShow = true;
        } else {
          this.isShow = false;
        }
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
  @import "register";

  .join-section {
    .topbar, .header, .reghd, .steps, .reg-result, .footer {
      display: none !important;
    }
    .logreg {
      background: none;
    }
    .logregfm .inner {
      width: auto;
      padding: 0;
      border: 0;
      min-height: auto;
    }
    .regbd {
      height: 230px;
    }
    .formlist {
      height: 200px;
    }
    .el-form-item__content .el-form-item__error {
      right: 289px !important;
    }
    #joinForm .el-form-item__error {
      right: 389px !important;
    }
  }

  .light {
    font-size: 12px;
  }

  .el-input__inner {
    width: 260px;
    height: 28px;
    border-radius: 3px;
  }

  .el-col-6 {
    .el-input__inner {
      width: 160px;
    }
  }

  .el-col-10 {
    .el-input__inner {
      width: 270px;
    }
  }
  .el-button {
    height: 28px;
    line-height: 1;
  }
</style>
