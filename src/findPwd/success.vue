<template>
  <div id="template" :class="{ 'theme-blue': theme }">
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
              <h2 class="logtit fl">找回密码<em>FIND YOUR PASSWORD</em></h2><p class="lognow fr">记起密码了？直接去 <a href="/login/login.html">登录</a></p>
            </div>
            <div class="steps">
              <ul>
                <li class="step1">1、确认账号</li>
                <li class="step2 sibg">2、重置密码</li>
                <li class="step3 focus">3、完成</li>
              </ul>
            </div>
            <div id="regSuccess">
              <div class="regbd">
                <!-- register feedback -->
                <div class="reg-feedback clearfix">
                  <!-- result 1 -->
                  <div class="reg-result bg-green tc">
                    <i class="ico-success"></i>
                    <h3 class="reg-tit green">恭喜您，密码重置成功！！</h3>
                  </div>
                  <!-- wel-section -->
                  <div class="wel-section">
                    <p class="tc">系统将会在 <strong class="red" id="number">10</strong> 秒后自动跳转至登录页面。</p>
                    <p class="tc">
                      <a href="/login/login.html" class="btn-highlight">立即登录</a>
                    </p>
                  </div>
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
        number: 0,
        counter: 0,
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
      timeCount(time) {
        window.setTimeout(() => {
          let t = time;
          t -= 1;
          if (t === 0) {
            window.location.href = '/login/login.html';
          } else {
            document.querySelector('#number').innerHTML = t;
            this.timeCount(t);
          }
        }, 1000);
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

      this.timeCount(10);
    },
    mounted() {
      // this.timer();
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../assets/sass/base.scss";
  @import "findPwd.scss";
  .wel-section {
    strong {
      font-size: 18px;
      font-weight: 700;
    }
  }
  #userName {
    font-size: 20px;
  }
</style>
