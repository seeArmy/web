import {
  addClass,
  removeClass,
  toggleClass
} from './classUtil';
import PublicArea from './PublicArea';
import * as DataSourceService from './DataSourceService';

import { get as getPartnerDetail } from './PartnerService';
import { get as getRouteDetail } from './RouteService';

import Vue from 'vue';


function filterwaybillStatus(success) {
  return success;
}


// list str = ,  或则 @@  ，随便你自己定义
// rentun obj 
function transformListToObjByStr(list, str_link) {
  if (!list || !str_link) {
    return null;
  }
  // 1. 获取所有 的key 
  // 2. 拼接 
  let obj_all = {};
  let keys_all = {};
  list.forEach(item => {
    Object.keys(item).forEach(key => {
      if (!keys_all[key] && key != 'undefined' && key != 'null') { // 如果 此key 在 keys_all 中还不存在，那么放进去，如果存在，不做任何操作
        keys_all[key] = true;
      }
    })
  })
  Object.keys(keys_all).forEach(key => {
    list.forEach((item, index) => {
      // 如果当前 这一列 存在 此 key 
      const val = item[key] ? item[key] : '';
      if (index == 0) {
        obj_all[key] = val;
      } else {
        obj_all[key] += (str_link + val);
      }
    })
  })
  return obj_all;
}


function formatDateInDoamin(domainObject) {
  if (!domainObject) return null;
  Object.keys(domainObject).forEach(key => {
    let val = domainObject[key];
    if (val instanceof Date) {
      domainObject[key] = dateFormat(val);
    }
  })
  return domainObject
}

/**
 * 封装Get请求
 * @param url 请求的URL
 * @param successCallback 成功回调函数
 * @param errorCallback 失败回调函数
 */
function get(url, successCallback, errorCallback) {
  axios.get(url).then((res) => {
    const data = res.data;
    successCallback(data.content, data.total);
  }).catch((err) => {
    console.error(err);
    errorCallback(err);
  });
}

const axios = require('axios'),
  ApiConst = require('./ApiConst'),
  TRUCK_MODEL_DATA = require('./TruckModelData').list,
  PAGE_SIZE = 10,
  area = require('./area.json'),
  // defineUrl = `${ApiConst.orgConfigUrl}/element_type/define`,
  // typeUrl = `${ApiConst.orgConfigUrl}/element_type/info`,
  LOCAL_CACHE = {};
axios.defaults.withCredentials = true;





function getGoodsCategoryVal(key, needNet) {
  // return 'hhhhh';
  // 需要网络请求 做缓存
  // if(needNet){
  // },
  //从缓存中去拿
  if (!key) { return null };
  if (localStorage.getItem('goodsCategory--')) {
    let data = JSON.parse(localStorage.getItem('goodsCategory--'));
    for (var i = 0; i < data.length; i++) {
      let item = data[i];
      if (item.id === key) {
        return item.value;
        break;
      }
    }
  }
}
// 通过 goodsCategoryCode 获取计量标准
function getMeterageTypeByGoodsCategoryCode(key) {
  //从缓存中去拿
  if (!key) { return null };
  if (localStorage.getItem('goodsCategory--')) {
    let data = JSON.parse(localStorage.getItem('goodsCategory--'));
    for (var i = 0; i < data.length; i++) {
      let item = data[i];
      if (item.id === key) {
        return item.data.meterageType;
        break;
      }
    }
  }
}

// 通过传入的 key 对应的值，获取 obj
function getGoodsCategoryByKey(key, val) {
  //从缓存中去拿
  if (!key) { return null };
  if (localStorage.getItem('goodsCategory--')) {
    let data = JSON.parse(localStorage.getItem('goodsCategory--'));
    for (var i = 0; i < data.length; i++) {
      let item = data[i];
      if (val === item.data[key]) {
        return item.data;
        break;
      }
    }
  }
}

// 通过传入的 key 对应的值，获取 obj
function saveGoodsName() {
  let key = 'goodsName--';
  let url = `${ApiConst.apiLineDomain}/resource/resource_goods/list`;
  get(url, (data) => {
    const len = data.length,
      autoData = [];
    for (let i = 0; i < len; i += 1) {
      autoData.push({
        'id': data[i].code,
        'value': data[i].goodsName,
        'name': data[i].goodsName,
        'data': data[i]
      });
    };
    localStorage.setItem(key, autoData);
    // callback(autoData,null)
  })
  // //从缓存中去拿
  // if (localStorage.getItem('goodsCategory--')) {
  //   let data = JSON.parse(localStorage.getItem('goodsCategory--'));
  //   for (var i = 0; i < data.length; i++) {
  //     let item = data[i];
  //     if (val === item.data[key]) {
  //       return item.data;
  //       break;
  //     }
  //   }
  // }
}



function deepClone(source) {
  return JSON.parse(JSON.stringify(source));
}
// 提示信息的简写
function showMessageUtil(type = 'warning', msg = '', duration = 3000) {
  Vue.prototype.$message({
    type: type,
    message: msg,
    duration: duration
  });
}

// 比较两个时间的大小 date1 > date2 =>   >  =  <
function compareTime(date1, date2) {
  if (date1 && date2) {
    const d1 = (date1 instanceof Date) ? date1 : new Date(Date.parse(date1)),
      d2 = (date2 instanceof Date) ? date2 : new Date(Date.parse(date2));
    if (!d1 || !d2) { return null };
    if (d1 > d2) { return '>' } else if (d1 < d2) { return '<' } else { return '=' }
  }
  return null;
}

// 处理跳转链接 托运客户
function dealWithUrlClientDetail(orgCode, code) {
  return new Promise((resolve, reject) => {
    getPartnerDetail({ code: code, orgCode: orgCode }, (success, error) => {
      if (success) {
        resolve();
      }
      if (error) {
        reject();
      }
    })
  })
}

// 处理跳转链接 线路
function dealWithUrlRouteDetail(routeCode, code) {
  return new Promise((resolve, reject) => {
    getRouteDetail({ code: code, routeCode: routeCode }, (success, error) => {
      if (success) {
        resolve();
      }
      if (error) {
        reject();
      }
    })
  })
}



//判断下载模板的excel 是否存在
function checkFileExist(fileurl) {
  var xmlhttp;
  //判断浏览器是否支持ActiveX控件
  if (window.ActiveXObject) {
    //支持-通过ActiveXObject的一个新实例来创建XMLHttpRequest对象
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  } else if (window.XMLHttpRequest) {
    //不支持
    xmlhttp = new XMLHttpRequest()
  }
  //var xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  xmlhttp.open("GET", fileurl, false);
  xmlhttp.send();
  if (xmlhttp.readyState == 4) {
    if (xmlhttp.status == 200) {
      return true;
    } else if (xmlhttp.status == 404) {
      return false; //url不存在
    } else {
      return false; //其他状态
    }
  }
}

/**
 * 根据传入的单位code，返回对应的单位名称
 * @param unitCode 单位code
 * @param key DataSourceService对象上绑定的类型，如司机运价，key就是：driverPrice
 * @returns Promis对象，如果需要获取多个，Promise.all([getDataSourceName(),getDataSourceName()]).then后拿到的是数组，顺序和传入的方法一致，如果是获取单个，getDataSourceName().then即可，拿到的就是名称
 */
function getDataSourceName(unitCode, key) {
  return new Promise((resolve, reject) => {
    DataSourceService[key].getData({}, (success, error) => {
      console.log('getDataSourceName api cancel', success, error);
      if (success) {
        let text = '';
        success.forEach((val) => {
          if (val.data.code === unitCode) {
            text = val.data.codeName;
          }
        });
        if (text) {
          resolve(text);
        } else {
          // reject('没有匹配到code name');
        }
      }
      if (error) {
        reject(error);
      }
    });
  });
}


/**
 * 参数对象转换为字符串
 * @param params
 */
function formatData(value) {
  return value < 10 ? '0' + value : value;
}

function objToParamStr(paramObj) {
  let paramStr = '';

  function getValue() {
    for (const key of Object.keys(paramObj)) {
      if (paramObj[key] && !Array.isArray(paramObj[key]) || (Array.isArray(paramObj[key]) && paramObj[key].length) || paramObj[key] === false) {
        if (paramObj[key] instanceof Date) { // check type is Date
          const year = paramObj[key].getFullYear(),
            month = formatData(paramObj[key].getMonth() + 1),
            day = formatData(paramObj[key].getDate()),
            hour = formatData(paramObj[key].getHours()),
            minute = formatData(paramObj[key].getMinutes()),
            second = formatData(paramObj[key].getSeconds()),
            str = '-',
            pot = ':';
          paramObj[key] = year + str + month + str + day + ' ' + hour + pot + minute + pot + second;
        }
        paramStr += '&';
        paramStr += key;
        paramStr += '=';
        paramStr += encodeURIComponent(paramObj[key]);
      }
    }
    return paramStr;
  }
  paramStr = getValue();
  return paramStr.substring(1);
}


/**
 * 过滤对象中空值数据
 * @param paramObj
 */
function objToObj(paramObj) {
  const paramNewObj = {};

  function getObj() {
    for (const key of Object.keys(paramObj)) {
      if (paramObj[key]) {
        paramNewObj[key] = paramObj[key];
      }
    }
    return paramNewObj;
  }
  return getObj();
}

/**
 * 获取匹配字段
 */
function getParam(parConfig, eleDefine, eleInfo) {
  if (!eleDefine || !eleInfo) {
    alert('您还未登录，请先登录')
    console.error('您还未登录，请先登录')
    throw '您还未登录，请先登录';
  }

  const parConfigData = parConfig.data.content,
    eleDefineData = eleDefine.data.content,
    eleInfoData = eleInfo.data.content,
    fields = [],
    inputFields = [];
  if (!parConfigData || !parConfigData.length) {
    return false;
  }
  parConfigData.forEach((value, index) => {
    if (!eleDefineData[value.elementCode]) {
      console.error(`error, fieldConfigCode: ${value.fieldConfigCode} can not find elementInfoCodes`);
      return false;
    }
    if (!value.extraParams) {
      console.error(`error, fieldConfigCode: ${value.fieldConfigCode} can not find extraParams`);
      return false;
    }
    let extraParams = value.extraParams;
    if (typeof value.extraParams === 'string') { // 兼容后面可配置对象形式的params.
      try {
        extraParams = JSON.parse(value.extraParams);
      } catch (error) {
        console.error(value.extraParams, 'is not json, ', 'fieldConfigCode is', value.fieldConfigCode);
        return false;
      }
    }
    // new
    if (value.extendParams && typeof value.extraParams === 'string') {
      try {
        value.extendParams = JSON.parse(value.extendParams);
      } catch (error) {
        console.error(value.extendParams, 'is not json, ', 'fieldConfigCode is', value.fieldConfigCode);
        return false;
      }
    }

    const elementCode = value.elementCode,
      fieldConfigCode = value.fieldConfigCode,
      elementInfoCodes = eleDefineData[elementCode].elementInfoCodes,
      event = eleDefineData[elementCode].event,
      len = elementInfoCodes.length;
    value.extraParams = [];
    for (let i = 0; i < len; i++) {
      value.extraParams[i] = {};
      if ('required' in extraParams) {
        value.required = extraParams.required;
        value.extraParams[i].required = extraParams.required;
      }
      if ('requiredList' in extraParams) {
        value.requiredList = extraParams.requiredList;
        value.extraParams[i].requiredList = extraParams.requiredList;
      }
      if ('detailLinkVisiable' in extraParams) {
        value.detailLinkVisiable = extraParams.detailLinkVisiable;
      }
      if ('area' in extraParams) {
        value.area = extraParams.area;
      }
      if ('dialogPreview' in extraParams) {
        value.dialogPreview = extraParams.dialogPreview;
        value.extraParams[i].dialogPreview = extraParams.dialogPreview;
      }
      if ('transparent' in extraParams) {
        value.transparent = extraParams.transparent;
        value.extraParams[i].transparent = extraParams.transparent;
      }
      if ('hide' in extraParams) {
        value.hide = extraParams.hide;
        value.extraParams[i].hide = extraParams.hide;
      }
      if ('permissionCode' in extraParams) {
        value.permissionCode = extraParams.permissionCode;
        value.extraParams[i].permissionCode = extraParams.permissionCode;
      }
    }
    for (let i = 1; i < len + 1; i++) {
      if (!extraParams) {
        console.error(`error, extraParams in fieldConfigCode: ${fieldConfigCode} is ${extraParams}`);
        return false;
      }
      Object.keys(extraParams).forEach((key) => {
        if (key.indexOf(i) > 0) {
          const param = key.replace(i, '');
          value.extraParams[i - 1][param] = extraParams[key];
        }
      });
      if (value.extraParams[i - 1]['inputKey']) {
        const inputKey = value.extraParams[i - 1]['inputKey'],
          index = inputKey.indexOf('.'),
          len = inputKey.length;
        inputFields.push({
          key: inputKey.slice(0, index),
          name: inputKey.slice(index + 1, len),
          field: value.extraParams[i - 1]['field']
        });
      }
      Object.keys(eleInfoData[elementInfoCodes[i - 1]]).forEach((key) => {
        value.extraParams[i - 1][key] = eleInfoData[elementInfoCodes[i - 1]][key];
      });
      //              self.requestList.push(value.extraParams[i - 1]);
      const type = value.extraParams[i - 1].controlType;
      if (type === 'checkbox' || type === 'radio') {
        value.extraParams[i - 1].value = [];
      } else if (type === 'select') {
        value.extraParams[i - 1].value = '';
        value.extraParams[i - 1].text = '';
      } else {
        value.extraParams[i - 1].value = '';
      }
      // value.extraParams[i - 1].showName = value.showName;
    }
    value.event = event;
    fields.push(value);
  });
  return {
    field: fields,
    inputKey: inputFields
  };
}

// 计算tab宽度
function calTab() {
  const topdocument = window.top.document,
    wrapWidth = topdocument.querySelector('.tab-wrap').offsetWidth,
    element = topdocument.querySelectorAll('#tabList li');
  let tabWidth = 0;
  Object.keys(element).forEach((index) => {
    const liWidth = element[index].offsetWidth + 2;
    tabWidth += liWidth;
  });
  // console.log(wrapWidth, tabWidth);
  topdocument.querySelector('#tabList').style.width = `${tabWidth}px`;
  if (tabWidth > wrapWidth) {
    // console.log('success');
    addClass(topdocument.querySelector('.tab-wrap'), 'is-scroll');
    const scrollWidth = topdocument.querySelector('.tab-scroll').offsetWidth,
      x = tabWidth - scrollWidth;
    topdocument.querySelector('#tabList').style.marginLeft = `${-x}px`;
  }
}

// 展示tab和iframe
function selectTabAndIframe(link) {
  const topdocument = window.top.document,
    tabList = topdocument.getElementById('tabList').getElementsByTagName('li'),
    iframes = topdocument.getElementById('iframeContent').getElementsByTagName('iframe'),
    navItemLiList = topdocument.querySelectorAll('.nav-list-itemli');
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

// 获取data-link和data-title生成新的tab和iframe
function urlRedirect(targetLink, targetTitle) {
  if (targetLink && targetTitle) {
    if (targetLink === "undefined") {
      return false;
    }
    const topdocument = window.top.document,
      iframeContent = topdocument.querySelector('#iframeContent'),
      iframeList = iframeContent.getElementsByTagName('iframe'),
      newIframe = document.createElement('iframe'),
      tabList = topdocument.querySelector('#tabList');
    // 是否已经存在相同iframe
    let sameFlag = false;
    for (let i = iframeList.length - 1; i >= 0; i--) {
      if (iframeList[i].getAttribute('data-url') === targetLink) {
        // 存在相同的iframe
        removeClass(iframeList[i], 'hide');
        iframeList[i].src = targetLink;
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
}

// 获取高度
function adaptHeight() {
  if (document.querySelectorAll('.page-header')[0] && document.querySelectorAll('.table-opr')[0] && document.querySelectorAll('.pagination')[0]) {
    const winHeight = window.innerHeight,
      pageHeader = document.querySelectorAll('.page-header')[0].offsetHeight,
      tableOprHeight = document.querySelectorAll('.table-opr')[0].offsetHeight,
      pageHeight = document.querySelectorAll('.pagination')[0].offsetHeight,
      list = document.querySelector('#list'),
      advanceSearch = document.querySelector('.advance-search'),
      asbd = document.querySelector('#asBd');
    let groupHeight = 0;
    if (document.querySelectorAll('.group-section')[0]) {
      groupHeight = document.querySelectorAll('.group-section')[0].offsetHeight;
    }
    console.log('winHeight is', winHeight, 'pageHeader is', pageHeader, 'tableOpr is', tableOprHeight, 'groupHeight is', groupHeight, 'pageHeight is', pageHeight);
    let tableHeight = null;
    tableHeight = winHeight - pageHeader - tableOprHeight - groupHeight - pageHeight - 1;
    list.style.height = winHeight + 'px';
    document.querySelectorAll('.fix-table-wrap')[0].style.height = tableHeight + 'px';
    if (advanceSearch) {
      advanceSearch.style.height = winHeight + 'px';
    }
    if (asbd) {
      asbd.style.maxHeight = winHeight - 75 + 'px';
    }
  }

}

// 生成高度
function changeHeight() {
  if (document.querySelectorAll('.page-header')[0] && document.querySelectorAll('.table-opr')[0] && document.querySelectorAll('.pagination')[0]) {
    const winHeight = window.innerHeight,
      pageHeader = document.querySelectorAll('.page-header')[0].offsetHeight,
      tableOpr = document.querySelectorAll('.table-opr')[0].offsetHeight,
      pagination = document.querySelectorAll('.pagination')[0].offsetHeight,
      unit = 'px',
      realHeight = (winHeight - pageHeader - tableOpr - pagination) + unit;
    document.querySelectorAll('.fix-table-wrap')[0].style.height = realHeight;
  }
}

// 高级搜索
function advanceSearch() {
  const listPage = document.querySelector('#list'),
    miniSearch = document.querySelector('#miniSearch'),
    advanceSearch = document.querySelector('#advanceSearch'),
    asClose = document.querySelector('#asClose');
  // console.log(winHeight,listPage,advanceSearch);
  advanceSearch.addEventListener('click', () => {
    toggleClass(listPage, 'opened');
    toggleClass(miniSearch, 'hide');
  });
  asClose.addEventListener('click', () => {
    toggleClass(listPage, 'opened');
    toggleClass(miniSearch, 'hide');
  });
}

function initTableWidth() {
  const headerDiv = document.querySelectorAll('.el-table__header-wrapper')[0];
  // console.log(headerDiv);
}


/*   通过时间戳生成对应的时间格式
 *   params:zeit 可输入，默认为当前的时间
 *          time 可输入，对应的输出格式
 *   return string
 * */
function dateFormat(zeit, time) {
  var date = zeit ? new Date(zeit) : null;
  if (date !== null) {
    var strYear,
      strMonth,
      strDate,
      strHour,
      strMinute,
      strSecond,
      dateFormat,
      str1 = '-',
      str2 = ':';
    strMonth = formatData(date.getMonth() + 1);
    strDate = formatData(date.getDate());
    strYear = formatData(date.getFullYear());
    strHour = formatData(date.getHours());
    strMinute = formatData(date.getMinutes());
    strSecond = formatData(date.getSeconds());
    switch (time) {
      case 'notime':
        dateFormat = strYear + str1 + strMonth + str1 + strDate;
        break;
      case 'month':
        dateFormat = strYear + str1 + strMonth;
        break;
      case 'day':
        dateFormat = strYear + str1 + strMonth + str1 + strDate;
        break;
      case 'withoutSecond':
        dateFormat = strYear + str1 + strMonth + str1 + strDate + ' ' + strHour + str2 + strMinute;
        break;
      case 'justTime':
        dateFormat = strHour + str2 + strMinute + str2 + strSecond;
        break;
      default:
        dateFormat = strYear + str1 + strMonth + str1 + strDate + ' ' + strHour + str2 + strMinute + str2 + strSecond;
    }
    return dateFormat;
  }
  return null;
}


//返回两位小数并加上千分位，
function moneyFormat(num, back) {
  if (num) {
    return num.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
  }
  if (back === 'null') {
    return null;
  }
  return '0.00';
}
//判断code是否为字符串null
function codeNull(paramObj) {
  let newObj = {};
  for (let k in paramObj) {
    if (k == 'code' && paramObj[k] == 'null') {

    } else {
      newObj[k] = paramObj[k];
    }
  }
  return newObj;
}

//数字转字符串
function NumtoStr(val) {
  return isNaN(val) ? val : val.toString();
}

//获取url键的value
function getUrl(key) {
  const reg = new RegExp(`(^|&)${key}=([^&]*)(&|$)`),
    result = window.location.search.substr(1).match(reg);
  // console.log(result);
  return result ? decodeURI(result[2]) : null;
}

function getParamsFromURL(URL) {
  var paramObject = {};
  var paramStr = URL.substring(1);
  var params = paramStr.split('&');
  for (var i = 0; i < params.length; i++) {
    var pair = params[i].split('=');
    paramObject[pair[0]] = pair[1];
    paramObject[pair[0]] = decodeURI(paramObject[pair[0]]);
  }
  // console.log(paramObject);
  return paramObject;
}

function convertMoney(money) {
  const cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'),
    cnIntRadice = new Array('', '拾', '佰', '仟'),
    cnIntUnits = new Array('', '万', '亿', '兆'),
    cnDecUnits = new Array('角', '分', '毫', '厘'),
    cnInteger = '整',
    cnIntLast = '元',
    maxNum = 999999999999999.9999;
  let integerNum,
    decimalNum,
    chineseStr = '',
    parts;
  if (money === '') {
    return '';
  }
  money = parseFloat(money);
  if (money >= maxNum) {
    return '';
  }
  if (money === 0) {
    chineseStr = cnNums[0] + cnIntLast + cnInteger;
    return chineseStr;
  }
  money = money.toString();
  if (money.indexOf('.') === -1) {
    integerNum = money;
    decimalNum = '';
  } else {
    parts = money.split('.');
    integerNum = parts[0];
    decimalNum = parts[1].substr(0, 4);
  }
  if (parseInt(integerNum, 10) > 0) {
    let zeroCount = 0;
    const IntLen = integerNum.length;
    for (let i = 0; i < IntLen; i++) {
      const n = integerNum.substr(i, 1),
        p = IntLen - i - 1,
        q = p / 4,
        m = p % 4;
      if (n === '0') {
        zeroCount++;
      } else {
        if (zeroCount > 0) {
          chineseStr += cnNums[0];
        }
        zeroCount = 0;
        chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
      }
      if (m === 0 && zeroCount < 4) {
        chineseStr += cnIntUnits[q];
      }
    }
    chineseStr += cnIntLast;
  }
  if (decimalNum !== '') {
    const decLen = decimalNum.length;
    for (let i = 0; i < decLen; i++) {
      const n = decimalNum.substr(i, 1);
      if (n !== '0') {
        chineseStr += cnNums[Number(n)] + cnDecUnits[i];
      }
    }
  }
  if (chineseStr === '') {
    chineseStr += cnNums[0] + cnIntLast + cnInteger;
  } else if (decimalNum === '') {
    chineseStr += cnInteger;
  }
  return chineseStr;
}

function dealInputKey(inputKeys, cb) {
  const inputKeyArray = inputKeys.split(',');
  inputKeyArray.forEach((inputKey) => {
    const inputKeyArr = inputKey.split('.');
    PublicArea.addSetObservers(inputKeyArr[0], (outData) => {
      if (inputKeyArr[1] == 'meterageType') {
        cb(inputKeyArr[1], outData);
      } else {
        setTimeout(() => {
          cb(inputKeyArr[1], outData);
        }, 500)
      }

    });
  });
}
/**
 * 检查是否有权限
 * @param permissionKey 权限key，全局唯一。
 * @returns {boolean}
 */
function checkPermission(permissionKey) {
  var values = localStorage.getItem("userPermissions");
  if (!values) {
    console.log('can not find permissions config from localstorage, function access will be denied.');
    return false;
  }
  var ret = values.split(',').find(item => item === permissionKey) != null;
  console.log('===========check permission, key:' + permissionKey + ", result:" + ret + "==========");
  return ret;
}
/**
 * 检查url，并将不正确的url参数改正，如url?a=1?b=2&c=1 改为 url?a=1&b=2&c=1
 * @param url
 */
function correctUrl(url) {
  var index = 0;
  return url.replace(/\?/g, function() {
    index++;
    return index == 1 ? '?' : '&';
  });
}

function closeCurrentWindow() {
  var tabs = window.top.document.getElementsByClassName('page-tab-close');
  for (var i = 0; i < tabs.length; i++) {
    if (tabs[i].offsetParent.className === 'page-tab-item active') {
      console.log(`closeing window-${i}`)
      tabs[i].click()
      break;
    }
  }
}

export {filterwaybillStatus,transformListToObjByStr, formatDateInDoamin, formatData, saveGoodsName, getGoodsCategoryByKey, getMeterageTypeByGoodsCategoryCode, getGoodsCategoryVal, compareTime, deepClone, showMessageUtil, dealWithUrlClientDetail, dealWithUrlRouteDetail, checkFileExist, checkPermission, objToParamStr, objToObj, getParam, urlRedirect, adaptHeight, changeHeight, advanceSearch, initTableWidth, dateFormat, moneyFormat, NumtoStr, getUrl, getParamsFromURL, convertMoney, dealInputKey, getDataSourceName, correctUrl, codeNull, closeCurrentWindow };
