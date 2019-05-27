/**
 * menu.js
 * Created by zhangyc on 17/6/7.
 */

import Vue from 'vue';
import { Message, MessageBox, Dialog, Select, Option, Button } from 'element-ui';
import { getMenu } from '../../api/menu';
import { addClass, removeClass, toggleClass, hasClass } from '../../api/classUtil';
import menuFrame from './menu.vue';
import * as loginService from '../../api/LoginService';
var apiConst = require('../../api/ApiConst');


Vue.use(Dialog);
Vue.use(Select);
Vue.use(Option);
Vue.use(Button);

Vue.prototype.$message = Message;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox;
Vue.prototype.$notify = Message

/* eslint-disable no-new */
/* eslint-disable no-unused-vars */
const userInfo = localStorage.getItem('userInfo'),
  vm = new Vue({
    el: '#app',
    template: '<menuFrame />',
    components: { menuFrame },
    computed: {},
    mounted() {
    }
  }),
  orgConfigUrl = apiConst.apiOrgConfigDomain,
 /* defineUrl = `${orgConfigUrl}/element_type/define`,
  typeUrl = `${orgConfigUrl}/element_type/info`,*/
  axios = require('axios');

window.rns = {};

if (userInfo) {
  const userInfoObj = JSON.parse(userInfo),
    orgFullName = userInfoObj.orgFullName,
    userFullName = userInfoObj.userFullName || userInfoObj.loginAccount;
    // 解决bug,先显示了全称，后显示了 简称 此时还没有拿到 orgName,所以不显示，最下面有赋值
  // document.querySelector('.org-name').innerHTML = orgName;
  document.querySelector('.user-role').innerHTML = userFullName;
  console.log('orgName ...',userInfoObj);
} else {
  // window.location.href = '/login/login.html';
}


// 展示tab和iframe
function selectTabAndIframe(link) {
  const tabList = document.getElementById('tabList').getElementsByTagName('li'),
    iframes = document.getElementById('iframeContent').getElementsByTagName('iframe'),
    navItemLiList = document.querySelectorAll('.nav-list-itemli');
  for (let i = tabList.length - 1; i >= 0; i--) {
    if (tabList[i].getAttribute('data-url') === link) {
      addClass(tabList[i], 'active');
    } else {
      removeClass(tabList[i], 'active');
    }
  }
  for (let k = iframes.length - 1; k >= 0; k--) {
    if (iframes[k].getAttribute('data-url') === link) {
      removeClass(iframes[k], 'hide');
    } else {
      addClass(iframes[k], 'hide');
    }
  }
  for (let j = navItemLiList.length - 1; j >= 0; j--) {
    if (navItemLiList[j].getAttribute('data-link') === link) {
      addClass(navItemLiList[j], 'active');
    } else {
      removeClass(navItemLiList[j], 'active');
    }
  }
}

// 获取上部和左侧的列表
getMenu((response, error) => {
  const JtopNavList = document.getElementById('J_topNavList'),
    Jtemplate = document.getElementById('J_template'),
    tagName = 'J_tagBox',
    res = response.content;
  let hideList = null,
    firstList = null;
  for (let k = 0, len = res.length; k < len; k++) {
    // 顶级菜单
    if (!res[k].parentResourceCode) {
      // 生成列表头部列表
      const span = document.createElement('li'),
        TagBox = document.createElement('div');
      span.className = 'topTab';
      span.innerHTML = res[k].resourceName;
      span.setAttribute('code', res[k].code);
      JtopNavList.appendChild(span);
      if (k > 5) {
        document.querySelector(".top-nav").classList.add('top-nav-adaptive');
      }
      // 生成虚拟模板
      // TagBox.id = tagName + res[k].resourceCode;
      TagBox.id = tagName + res[k].code;
      TagBox.setAttribute('nodelevel', '1');
      TagBox.className = 'tabBox hide';
      Jtemplate.appendChild(TagBox);
      // 二三级菜单
    } else {
      const queryString = tagName + res[k].parentResourceCode,
        appendUl = document.createElement('ul'),
        appendUlLi = document.createElement('li'),
        appendUlLiA = document.createElement('a'),
        appendUlLiSpan = document.createElement('span');
      let targetBox = document.getElementById(queryString),
        nodelevel = null;
      nodelevel = targetBox.getAttribute('nodelevel');
      appendUl.className = 'nav-list';
      appendUl.id = tagName + res[k].code;
      appendUlLiSpan.innerHTML = res[k].resourceName;
      // 二层结构
      if (nodelevel === '1') {
        appendUlLiSpan.className = 'nav-name';
      } else {
        appendUlLiSpan.className = 'nav-list-itemli';
        targetBox = targetBox.getElementsByTagName('li')[0];
      }
      if (res[k].path && res[k].resourceName) {
        const index = res[k].path.indexOf('?target=_blank');
        if (index > -1) {
          appendUlLiA.setAttribute('href', res[k].path.slice(0, index));
          appendUlLiA.setAttribute('title', res[k].resourceName);
          appendUlLiA.setAttribute('target', '_blank');
          appendUlLiA.appendChild(appendUlLiSpan);
          appendUlLi.appendChild(appendUlLiA);
        } else {
          appendUlLi.setAttribute('data-link', res[k].path);
          appendUlLiSpan.setAttribute('id', res[k].path);
          appendUlLi.setAttribute('data-title', res[k].resourceName);
          appendUlLi.appendChild(appendUlLiSpan);
        }
      } else {
        appendUlLi.appendChild(appendUlLiSpan);
      }
      appendUl.appendChild(appendUlLi);
      targetBox.appendChild(appendUl);
    }
  }
  hideList = document.querySelectorAll('.tabBox');
  firstList = hideList[0];
  removeClass(firstList, 'hide');
  addClass(document.querySelector('.topTab'), 'active');

  if (JtopNavList.firstElementChild) {
    JtopNavList.firstElementChild.click();
  }
  // console.log(error);
});

// 收缩左侧三级菜单
document.querySelector('#sideList').addEventListener('click', (event) => {
  const target = event.target;
  if (hasClass(target, 'nav-name')) {
    target.parentNode.querySelectorAll('ul').forEach((item) => {
      toggleClass(item, 'hide');
    });
  }
});

// 计算tab宽度
function calTab() {
  const wrapWidth = document.querySelector('.tab-wrap').offsetWidth,
    element = document.querySelectorAll('#tabList li');
  let tabWidth = 0;
  Object.keys(element).forEach((index) => {
    const liWidth = element[index].offsetWidth + 2;
    tabWidth += liWidth;
  });
  // console.log(wrapWidth, tabWidth);
  document.querySelector('#tabList').style.width = `${tabWidth}px`;
  if (tabWidth > wrapWidth) {
    // console.log('success');
    addClass(document.querySelector('.tab-wrap'), 'is-scroll');
    const scrollWidth = document.querySelector('.tab-scroll').offsetWidth,
      x = tabWidth - scrollWidth;
    document.querySelector('#tabList').style.marginLeft = `${-x}px`;
  } else {
    removeClass(document.querySelector('.tab-wrap'), 'is-scroll');
    document.querySelector('#tabList').removeAttribute('style');
  }
}

calTab();

// 往前翻页
function preview() {
  const scrollWidth = document.querySelector('.tab-scroll').offsetWidth,
    ulWidth = parseInt(document.querySelector('#tabList').style.width, 10);
  let x = parseInt(document.querySelector('#tabList').style.marginLeft, 10);
  // console.log(scrollWidth, ulWidth, x);
  if (x < 0) {
    x += 100;
    if (x > 0) {
      x = 0;
      document.querySelector('#tabList').style.marginLeft = `${x}px`;
    } else {
      document.querySelector('#tabList').style.marginLeft = `${x}px`;
    }
  } else {
    return false;
  }
}

document.querySelector('.preview').addEventListener('click', preview);

// 往后翻页
function next() {
  const scrollWidth = document.querySelector('.tab-scroll').offsetWidth,
    ulWidth = parseInt(document.querySelector('#tabList').style.width, 10),
    overWidth = ulWidth - scrollWidth;
  let x = parseInt(document.querySelector('#tabList').style.marginLeft, 10);
  // console.log(scrollWidth, ulWidth, x);
  if (x > -overWidth) {
    x -= 100;
    if (x < -overWidth) {
      x = -overWidth;
      document.querySelector('#tabList').style.marginLeft = `${x}px`;
    } else {
      document.querySelector('#tabList').style.marginLeft = `${x}px`;
    }
  } else {
    return false;
  }
}

document.querySelector('.next').addEventListener('click', next);

// 收缩左侧菜单栏
document.querySelector('#hideSide').onclick = () => {
  toggleClass(document.querySelector('.content'), 'collapse');
};

// 全屏显示页面
document.querySelector('#fullScreen').onclick = () => {
  const body = document.querySelector('body'),
    self = document.querySelector('#fullScreen');
  toggleClass(body, 'fullscreen');
  if (hasClass(body, 'fullscreen')) {
    self.innerHTML = '退出全屏';
  } else {
    self.innerHTML = '全屏';
  }
  calTab();
};

document.addEventListener('click', (event) => {
  // 打开iframe
  const target = event.target,
    // 是否存在data-link
    targetLink = target.getAttribute('data-link') || target.parentNode.getAttribute('data-link') || '',
    targetTitle = target.getAttribute('data-title') || target.parentNode.getAttribute('data-title') || '',
    iframeContent = document.querySelector('#iframeContent');
  // 头部一级菜单
  if (target.className.indexOf('topTab') > -1) {
    const code = target.getAttribute('code'),
      sideBox = document.querySelectorAll('.tabBox'),
      targetName = '#J_tagBox',
      queryString = targetName + code,
      targetBox = document.querySelector(queryString),
      topTabList = document.querySelectorAll('.topTab'),
      thisName = target.innerHTML;
    document.getElementById('navTitleName').innerHTML = thisName;
    // topTabList.forEach((element) => {
    //   removeClass(element, 'active');
    // });
    for (let i = 0; i < topTabList.length; i += 1) {
      removeClass(topTabList[i], 'active');
    }
    addClass(target, 'active');
    // sideBox.forEach((element) => {
    //   addClass(element, 'hide');
    // });
    for (let i = 0; i < sideBox.length; i += 1) {
      addClass(sideBox[i], 'hide');
    }

    removeClass(targetBox, 'hide');
  }

  // 查看是否含有data-link和data-title
  if (targetLink && targetTitle) {
    if (targetLink === 'undefined') {
      return false;
    }
    const iframeList = iframeContent.getElementsByTagName('iframe'),
      newIframe = document.createElement('iframe'),
      tabList = document.querySelector('#tabList');
    // 是否已经存在相同iframe
    let sameFlag = false;
    for (let i = iframeList.length - 1; i >= 0; i--) {
      if (iframeList[i].getAttribute('data-url') === targetLink) {
        // 存在相同的iframe
        removeClass(iframeList[i], 'hide');
        sameFlag = true;
        break;
      }
    }
    if (!sameFlag) {
      const tab = document.createElement('li'),
        span1 = document.createElement('span'),
        span2 = document.createElement('span');
      // tab.className = 'col-md-3 mark';
      tab.setAttribute('data-url', targetLink);
      tab.className = 'page-tab-item';
      span1.className = 'ellipsis page-tab-ellipsis-name';
      span1.innerHTML = targetTitle;
      span2.className = 'page-tab-close';
      span2.innerHTML = 'x';
      tab.appendChild(span1);
      tab.appendChild(span2);
      tabList.appendChild(tab);
      for (let j = iframeList.length - 1; j >= 0; j--) {
        removeClass(iframeList[j], 'active');
      }
      newIframe.src = targetLink;
      newIframe.setAttribute('data-url', targetLink);
      newIframe.className = 'iframe';
      iframeContent.appendChild(newIframe);
      calTab();
    }

    // 显示选中的toptab和iframe
    selectTabAndIframe(targetLink);
  }

  // tab删除
  if (target.className.indexOf('page-tab-close') > -1) {
    // 获取删除的tab，tab对应的url，iframes的列表
    const parentNode = target.parentNode,
      url = parentNode.getAttribute('data-url'),
      iframes = document.querySelector('#iframeContent').getElementsByTagName('iframe'),
      preivousUrl = parentNode.previousElementSibling.getAttribute('data-url');
    parentNode.remove();
    for (let i = iframes.length - 1; i >= 0; i--) {
      const thisUrl = iframes[i].getAttribute('data-url');
      // 获取需要删除的iframe
      if (url === thisUrl) {
        iframes[i].remove();
        break;
      }
    }
    selectTabAndIframe(preivousUrl);
    calTab();
  }

  // tab点击切换
  if (target.className.indexOf('page-tab-ellipsis-name') > -1) {
    const targetUrl = target.parentNode.getAttribute('data-url');
    // 显示选中的toptab和iframe
    selectTabAndIframe(targetUrl);
  }
});

/**
 * 登出回调
 * @param response
 * @param err
 */
function loginOutCallback(response, err) {
  localStorage.removeItem('userInfo');
  // console.log(response);
  if (err !== null) {
    console.log(err);
  }
  window.location.href = '/login/login.html';
}

/**
 * 登出
 */
function logout() {
  loginService.logout(loginOutCallback);
}
document.querySelector('.logOut').addEventListener('click', logout, false);
/*
var eleDefine=require("../../api/fieldMetadata/eleDefine.json");
var eleInfo=require("../../api/fieldMetadata/eleInfo.json");
*/


var eleDefine=require("../../api/fieldMetadata/"+apiConst.fieldMetadataDir+"/eleDefine.json");   //   ./fieldMetadata/master/ele...
var eleInfo=require("../../api/fieldMetadata/"+apiConst.fieldMetadataDir+"/eleInfo.json");
/*
 defineUrl = `${orgConfigUrl}/element_type/define`,
 typeUrl = `${orgConfigUrl}/element_type/info`,
 */
localStorage.setItem('eleDefine', JSON.stringify(eleDefine));
localStorage.setItem('eleInfo', JSON.stringify(eleInfo));
window.addEventListener('beforeunload', () => {
  window.localStorage.removeItem('eleInfo');
  window.localStorage.removeItem('eleDefine');
});

// var orgService = require("../../api/OrgService.js");
// orgService.get({},ret=>{
//   localStorage.setItem('orgInfo', JSON.stringify(ret));
//   localStorage.setItem('orgType', ret.content.orgType);   //1核心企业，2车队。为不同的组织使用不同的配置做基础。


//   let userInfo = JSON.parse(localStorage.getItem('userInfo'));
//   userInfo.orgName = ret.content.orgName;
//   userInfo.orgFullName = ret.content.orgFullName;
//   document.querySelector('.org-name').innerHTML = userInfo.orgName;
//   let userInfoObj = JSON.stringify(userInfo);
//    localStorage.setItem('userInfo', userInfoObj);
// })
