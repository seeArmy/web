/**
* list.vue
* 菜单列表
* Created by zhuyi on 17/7/21.
*/
<template>
<div id="template" :class="{ 'theme-blue': theme }">
<!-- S:browser-tip -->
<div class="browser-tip">
    <p>您的浏览器版本过低，页面可能无法正常显示。请立即<a href="http://browsehappy.com" target="_blank">升级浏览器</a>。</p>
    <span class="close-browser">【点击关闭】</span>
</div>
<!-- E:browser -->

<!-- S:header -->
<header class="header">
    <!-- logo -->
    <div class="logo fl">
        <img :src="platformLogoUrl" class="platform-logo" alt="" v-if="platformLogoUrl">
        <h1 class="platform-name" v-if="platformName">{{ platformName }}</h1>
        <!-- <h1 class="org-name fl"></h1> -->
    </div>
    <!-- login-info -->
    <div class="login-info fr">
        <message-box />
        <span class="org-fullname" v-if="!theme">{{ orgFullName }}</span>
        <!-- <span class="switch-org" @click="doSwitchOrg">切换组织</span> -->
        <span class="user-role"></span> [<a href="javascript:;" class="logOut">退出</a>]<!--  | <a href="http://www.rltx.com" target="_blank">融链官网</a> -->
    </div>
    <!-- nav -->
    <nav class="top-nav">
        <ul class="top-nav-list" id="J_topNavList">
        </ul>
    </nav>
</header>

<!-- S:content -->
<div class="content">
    <!-- nav -->
    <nav class="nav" id="sideList">
        <h2 class="nav-title" id="navTitleName">业务管理</h2>
        <div id='J_template'>
        </div>
    </nav>
    <!-- fold -->
    <div class="fold" id="hideSide">
    </div>
    <!-- main -->
    <main class="main">
        <!-- page-tab -->
        <div class="page-tab">
            <div class="page-opr fr">
                <span class="full-screen" id="fullScreen">全屏</span>
            </div>
            <div class="tab-wrap">
                <span class="preview">&lt;</span>
                <span class="next">&gt;</span>
                <div class="tab-scroll">
                    <ul class="page-tab-list" id="tabList">
                        <li data-url="/menu/index.html" class="page-tab-item active" title="首页">
                            <span class="ellipsis page-tab-ellipsis-name">首页</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <!-- page-wrapper -->
        <div class="page-wrapper" id="iframeContent">
            <!-- page iframe -->
            <iframe src="/menu/index.html" data-url='/menu/index.html' allowtransparency="true" frameborder="0" name="" class="iframe"></iframe>
        </div>
    </main>
</div>
<!-- E:content -->
</div>
</template>

<script type="text/ecmascript-6">
/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
import { get } from '../../api/OrgService';
// import { list, deleted } from '../../api/MessageService';
import { switchOrg } from '../../api/EmployeeService';
import { getAll, driverPrice, goodsPrice, carrierPrice} from '../../api/DataSourceService';
import { toggleClass, hasClass, removeClass } from '../../api/classUtil';
import { post } from '../../api/httpUtil';
var apiConst = require('../../api/ApiConst');

import { setTimeout } from 'timers';
import { types } from 'util';
import MessageBox from '../message/components/msgBox'

export default {
  components: {
    MessageBox
  },
  filters: {
    subContent(txt) {
      const sublen = 60
      if(txt.length > sublen) {
        return `${txt.substr(0, sublen)}...`
      }
      return txt
    }
  },
  data() {
    return {
      paramObj: {
        sendStatus: 1,
        currentPage: 1,
        pageSize: 10
      },
      isDev:apiConst.env==='dev',
      msgTotal: 0,
      msgList: [],
      orgFullName: '',
      theme: true,
      platformLogoUrl: JSON.parse(localStorage.getItem('appInfo')).platformLogoUrl,
      platformName: JSON.parse(localStorage.getItem('appInfo')).platformName,
      dialogVisible: false
    };
  },
  methods: {
    doSwitchOrg() {
      const self = this;
        const  h = this.$createElement;
        this.$msgbox({
          title: '确认',
          message: h('p', { style: 'text-align: center' }, [
            h('span', { style: 'font-weight: 700' }, '您确认切换所属公司组织吗？'),
            h('span', { style: 'color: #f48400; display: block; margin-top: 10px;' }, '确认后，您将自动退出当前登录组织，再次登录需选择您想要切换的公司组织。')
          ]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '执行中...';
              switchOrg({}, (success, error) => {
                if (error || success.code !== 200) {
                  this.$message({
                    type: 'warning',
                    message: `${error.content}`,
                    duration: 1000
                  });
                }
                if (success) {
                  console.log('switchOrg success, now quit login and pls login again');
                  document.querySelector('.logOut').click();
                }
              });
            } else {
              done();
            }
          }
        }).then(() => {
          // document.querySelector('.logOut').click();
        });
    },
    initAccount(){
      if(confirm('初始化账号将执行后台clear、init接口,确定初始化账号吗？')){
        post(apiConst.BaseDomain+'/platform/config/clear',{},function(success,error){
            if(success){
                alert('清除成功,3秒后执行初始化操作。')
                setTimeout(function(){
                  post(apiConst.BaseDomain+'/platform/config/init',{},function(s,e){
                     if(s){
                         setTimeout(function(){alert('初始化成功,请退出重新登录')},3000);
                     }else{
                       alert('初始化失败');
                     }
                  });
                },3000)
            }else{
                alert('初始化失败');
            }
        })
      }
    },
    getMsg() {
      this.msgList = [];
      list(this.paramObj, (success) => {
        if(success.total){
          this.msgTotal = success.total;
          success.content.forEach((val) => {
            const message = {};
            message.id = val.messageId;
            message.content = JSON.parse(val.messageBody).data;
            this.msgList.push(message);
          });
          // this.msgList = success.list;
        }
      });
    },
    getUnit() {
      // const unit = ['ton', 'cube', 'item'];
      // unit.forEach((val) => {
      //   driverPrice.getData({codeUnitType: val}, (success, error) => {
      //     if (error || success.code !== 200) {
      //       console.log('driverPrice error is', error);
      //     }
      //     if (success) {
      //       console.log('driverPrice val and data is=========', val, success);
      //     }
      //   });
      //   goodsPrice.getData({codeUnitType: val}, (success, error) => {
      //     if (error || success.code !== 200) {
      //       console.log('goodsPrice error is', error);
      //     }
      //     if (success) {
      //       console.log('goodsPrice val and data is=========', val, success);
      //     }
      //   });
      //   carrierPrice.getData({codeUnitType: val}, (success, error) => {
      //     if (error || success.code !== 200) {
      //       console.log('carrierPrice error is', error);
      //     }
      //     if (success) {
      //       console.log('carrierPrice val and data is=========', val, success);
      //     }
      //   });
      // });
      const unit = ['ton', 'cube', 'item'],
        dataArray = ['driverPrice', 'goodsPrice', 'carrierPrice'];
      unit.forEach((val) => {
        getAll(dataArray, {codeUnitType: val}, (success, error)=> {
          console.log('11111111111111111111');
        });
      });

      // saveGoodsName();
      // console.log('yyyyyyy');


      getAll(dataArray,{},(success,error)=>{
        console.log('成功 。。。。');
      })

        let listKey = ['goodsVolume','goodsWeight','goodsNumber', 'goodsLoss', 'goodsLossRation'];
         getAll(listKey,{},(success,error)=>{
        console.log('成功 。。。。11111');
      })
    },
    delMessage(item) {
      const paramObj = {
        id: item.id
      };
      deleted(paramObj, (success, error) => {
        if (success) {
          this.$message({
            type: 'success',
            message: '删除成功',
            duration: 1000
          });
          // this.msgTotal -= 1;
          this.getMsg();
        }
        if (error) {
          this.$message({
            type: 'warning',
            message: `${error}`,
            duration: 1000
          });
        }
      });
    },
    changeProjectName(val){
      let par =  JSON.parse(localStorage.getItem('appInfo'));
      par.projectName = val;
      let accountString = JSON.stringify(par);
      localStorage.setItem('appInfo', accountString);
    }
  },
  mounted(){
    this.valueProjectName = JSON.parse(localStorage.getItem('appInfo')).projectName;
  },
  created() {
    // this.getMsg();
    this.getUnit();
    // 获取当前组织信息
    get({}, (success, error) => {
      if (error || success.code !== 200) {
        this.$message({
          type: 'error',
          message: error.content,
          duration: 3000
        });
        return false;
      }
      if (success) {
        const data = success.content;
        this.orgFullName = data.orgFullName;
        localStorage.setItem('orgInfo', JSON.stringify(success));
        localStorage.setItem('orgType', data.orgType);   //1核心企业，2车队。为不同的组织使用不同的配置做基础。
        // 重写userinfo存储的信息
        let userInfo = JSON.parse(localStorage.getItem('userInfo'));
        userInfo.orgName = data.orgName;
        userInfo.orgFullName = data.orgFullName;
        let userInfoObj = JSON.stringify(userInfo);
        localStorage.setItem('userInfo', userInfoObj);
      }
    });
  }
};
</script>

<style lang="scss" rel="stylesheet/scss">
  @import './menu.css';
  @import "../assets/sass/base.scss";
  #template {
    .isDev{
      position: absolute;
      z-index: 9999;
      width: 100px;
      right: 66px;
      top: 68px;
      .version {
        position:absolute;
        left:-66px;
        top:6px;
        width:50px;
        height:100%
      }
    }
  }
  .logo {
    height: 50px;
    line-height: 50px;
    margin: 5px 5px 5px 0;
  }
  .platform-logo {
    display: inline-block;
    vertical-align: middle;
    margin-right: 5px;
    max-width: 158px;
    max-height: 50px;
  }
  .platform-name {
    display: inline-block;
    vertical-align: middle;
    font-size: 24px;
    font-weight: 700;
    color: #333;
  }
  .header {
    z-index: 200;
  }
  .login-info {
    margin-top: 10px;
  }
  .nav-title {
    font-weight: 700;
  }
  .nav-list li a {
    display: inline-block;
    width: 105px;
    color: #000;
    &:hover {
        color: #f48400;
        text-decoration: none;
    }
  }
  .top-nav-adaptive {
    left:  17%;
    .topTab {
      padding:  0 15px;
    }
  }
  .message {
    position: relative;
    display: inline-block;
    vertical-align: middle;
    margin-right: 5px;
    .msg-icon {
        position: relative;
        display: inline-block;
        width: 12px;
        height: 10px;
        margin-right: 5px;
        border: solid 1px #515356;
        border-top-left-radius: 2px;
        border-top-right-radius: 2px;
        opacity: .8;
        cursor:pointer;
        &:before, &:after {
            content: '';
            position: absolute;
            top: 2px;
            width: 0;
            height: 0;
            border-style: solid;
            border-width: 6px 6px 0;
            border-color: #515356 transparent;
        }
        &:after {
            top: 1px;
            border-width: 6px 6px 0;
            border-color: #f9fafc transparent;
        }
        .msg-number {
            position: absolute;
            z-index: 20;
            top: -12px;
            right: -6px;
            padding: 2px 3px;
            border-radius: 4px;
            font-weight: 700;
            color: #fff;
            background-color: #a00303;
        }
        &:hover {
            opacity: 1;
        }
    }
  }

  .switch-wrap {
    text-align: center;
    padding: 30px;
    p {
      margin-bottom: 10px;
    }
  }
  .switch-org {
    display: inline-block;
    vertical-align: middle;
    padding: 3px;
    margin: -2px 3px 0;
    background-color: #fff;
    border: solid 1px #ddd;
    border-radius: 3px;
    cursor: pointer;
    &:hover {
      background-color: #666;
      border-color: #666;
      color: #fff;
    }
  }
  @media (min-width: 1400px) {
    .top-nav-adaptive {
      left: 21%;
      .topTab {
        padding:  0 25px;
      }
    }
  }
</style>

