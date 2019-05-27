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
              <h2 class="logtit fl">注册与激活<em>REGISTRATION & ACTIVATION</em></h2><p class="lognow fr">已有账号？直接去 <a href="/login/login.html">登录</a></p>
            </div>
            <div class="steps">
              <ul>
                <li class="step1">1、填写个人信息</li>
                <li class="step2 sibg">2、填写公司信息</li>
                <li class="step3 focus">3、注册成功</li>
              </ul>
            </div>
            <div id="regSuccess">
              <div class="init" v-show="isShow===true">
                <h3 class="init-tit"><span class="loading"></span>功能初始化中，请稍后……</h3>
                <ol class="init-list" id="initText">
                  <li v-for="(item,index) in initText" class="hide">
                    {{index}}、{{item}}
                    <div class="init-progress">
                      <!-- <div :class="['init-run amd-' + index]"></div> -->
                      <div class="init-run"></div>
                    </div>
                  </li>
                </ol>
              </div>
              <div class="regbd" v-show="isShow===false">
                <!-- register feedback -->
                <div class="reg-feedback clearfix">
                  <!-- result 1 -->
                  <div class="reg-result bg-green tc">
                    <i class="ico-success"></i>
                    <h3 class="reg-tit green">恭喜您，已成功注册公司！！</h3>
                  </div>
                  <!-- wel-section -->
                  <div class="wel-section">
                    <p class="tc">欢迎加入，您的用户名是：<strong class="org" id="userName"></strong>，公司名称是：<strong class="org" id="orgName"></strong>。</p>
                    <p class="tc">系统将会在 <strong class="red" id="number">5</strong> 秒后自动跳转至登录页面</p>
                    <p class="tc">
                      <a href="/menu/menu.html" class="btn-highlight">进入会员中心</a>
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

  import * as initService from '../../api/initService';
  import * as classUtil from '../../api/classUtil';
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
        runTime: 10500,
        initText: [],
        number: 0,
        counter: 0,
        flag: true,
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
      showSuccess() {
        initService.get((success, error) => {
          if (success) {
            const content = success.content,
              userInfo = {
                'orgCode': content.orgCode,
                'orgFullName': content.orgName,
                'userFullName': content.fullName,
                'loginAccount': content.phone
              },
              userInfoObj = JSON.stringify(userInfo);
            localStorage.setItem('userInfo', userInfoObj);
            document.querySelector('#userName').innerHTML = content.phone;
            document.querySelector('#orgName').innerHTML = content.orgName;
            this.isShow = false;
            this.timeCount(5);
          }
          if (error) {
            console.log(error);
          }
        });
      },
      timer() {
        window.setInterval(() => {
          this.counter += 1;
          const list = document.querySelectorAll('#initText li'),
            preIndex = this.counter - 1,
            preLi = list[preIndex],
            nextIndex = 8 + this.counter,
            nextLi = list[nextIndex];
          // console.log(preIndex, nextIndex);
          if (this.flag) {
            list.forEach((key, index) => {
              if (index < 9) {
                classUtil.removeClass(key, 'hide');
              }
            });
            this.flag = false;
          }
          if (nextIndex < this.initText.length) {
            classUtil.removeClass(nextLi, 'hide');
          }
          if (preIndex < this.initText.length - 9) {
            classUtil.addClass(preLi, 'hide');
          }
          if (preIndex === this.initText.length - 6) {
            this.showSuccess();
          }
          // console.log(this.counter);
          // console.log(this.initText);
        }, 1000);
        // window.setTimeout(this.showSuccess, this.runTime);
      },
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

      this.initText = ['司机', '人员', '伙伴', '公司', '组织', '车辆', '挂车', '设备', '组织配置', '运单', '货单', '结算', '订单', '运力', '权限', '线路', '运价', '车辆轮胎', '保险记录', '维修记录', '保养记录', '违章记录', '事故记录', '轮胎巡检', '待办提醒', '货源'];
      this.timer();
    },
    mounted() {
      // this.timer();
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../assets/sass/base.scss";
  @import "register";
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
