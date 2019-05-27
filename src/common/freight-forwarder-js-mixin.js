/*jshint esversion:6 */

import * as HTTP from '../../api/httpUtil'
import {showMessageUtil} from '../../api/Utils'
var ApiConst= require('../../api/ApiConst');

export const freightForwarderJsMixin = {
  created() {},
  data() {
    return {};
  },
  computed: {
    comonProjectName() {
      return JSON.parse(localStorage.getItem('appInfo')).projectName;
    }
  },
  methods: {
    //  item in fieldsCondition1 is only deal with the fields's rules for verifying
    //  item in fieldsCondition2 is only deal with showing or hidding the  an asterisk(*) in the mandatory fields

    // 处理 车型 的逻辑
    // 车辆认证页面中增加判断逻辑：
    // 1.当“车型”为“牵引车”的时候，“总质量”和“核定载质量”不可填写，而“准牵引总质量”可以填写且必填；
    // 2.当“车型”不为“牵引车”的时候，“总质量”和“核定载质量”可以填写且必填，而“准牵引总质量”不可填写
    commonLogicTruckModelCode() {
      const listProject = [];
      if (listProject.indexOf(this.comonProjectName) < 0) {
        return;
      }
      let self = this;
      this.$watch(`domainObject.truckModelCode`, (val) => {
        intrinsicMethods(val);
      })
      intrinsicMethods(this.domainObject.truckModelCode);
      // 内部方法 
      function intrinsicMethods(val) {
        let fieldsCondition1, fieldsCondition2 = null;
        if ('Q00' == val) { // 牵引车
          // truckTotalWeight 总质量  regTonnage 核定载质量  不可填写
          // truckTowWeight 准牵引总质量 可填写且必填
          fieldsCondition1 = {
            'truckTotalWeight': { 'readonly': 'readonly', 'required': 'false' },
            'regTonnage': { 'readonly': 'readonly', 'required': 'false' },
            'truckTowWeight': { 'readonly': '', 'required': 'true' },

            // 必填处理
            'truckTowWeightUnitCode': { 'readonly': 'FALSE','required': 'true' }, // 准牵引总质量 单位
            'truckTotalWeightUnitCode': { 'readonly': 'TRUE','required': 'false' },
            'regTonnageUnitCode': { 'readonly': 'TRUE','required': 'false' },// 核定载质量
            // 车长：单位都放出，都可以编辑     
            'truckLengthUnitCode': { 'readonly': '','required': 'false' }
          };
          // 专门 处理 required 的处理，因为通过 js 修改 与 上面的修改配置 逻辑不一样，所以 当修改 required 特殊处理
          fieldsCondition2 = {
            'truckTowWeight': 'true',
            'truckTotalWeight': 'false',
            'regTonnage': 'false'
          };
        } else {
          //1.“总质量”和“核定载质量”可以填写且必填
          //2.而“准牵引总质量”不可填写。
          fieldsCondition1 = {
            'truckTotalWeight': { 'readonly': '', 'required': 'true' },
            'regTonnage': { 'readonly': '', 'required': 'true' },
            'truckTowWeight': { 'readonly': 'readonly', 'required': 'false' },

            // 必填处理
            'truckTowWeightUnitCode': { 'readonly': 'TRUE','required': 'false' },  // 准牵引总质量 单位
            'truckTotalWeightUnitCode': { 'readonly': 'FLASE','required': 'true' }, // 总质量单位
            'regTonnageUnitCode': { 'readonly': 'FLASE','required': 'true' },// 核定载质量
            // 车长：单位都放出，都可以编辑     
            'truckLengthUnitCode': { 'readonly': '','required': 'false' }
          };
          fieldsCondition2 = {
            'truckTowWeight': 'false',
            'truckTotalWeight': 'true',
            'regTonnage': 'true'
          };
        }
        self.privateMethodHandleCompontConfig(fieldsCondition1,fieldsCondition2);
      }
    },
    // this is private method , you must use only in this file
    // deal with compont  form-item change and blur event verify
    // eg: when you fix one compont's isrequired , the change event will not take effect
    // eg: /partner/add.html?objectName=伙伴    
    privateMethodHandleBlur(el, key, val,type) {
      if (!el || key != 'required' || !val) return;
      if (el.$children && el.$children.length > 0) {
        let el_item = 'select' == type ? el : el.$children[0];
        if (val == 'true') {
          el_item.$on('el.form.blur', el_item.onFieldBlur)
          el_item.$on('el.form.change', el_item.onFieldChange)
        } else if (val == 'false') {
          // 去除 显示的 检验不同过的字段
          el_item.validateState = '';
          el_item.validateMessage = '';
          el_item.validateDisabled = false;
        }
      }
    },
    privateMethodHandleCompontConfig(fieldsCondition1,fieldsCondition2) {
      let self = this;
      if (fieldsCondition2) {
        self.fields.forEach(block => {
          Object.keys(fieldsCondition2).forEach(filed => {
            if (block.fieldConfigCode == filed) {
              block.required = fieldsCondition2[filed]
            }
          })
        })
      }
      if (fieldsCondition1) {
        Object.keys(fieldsCondition1).forEach(field => {
          let el = self.$refs.form.getElementByField(field);
          if (el && el.configData) {
            const condition = fieldsCondition1[field];
            Object.keys(condition).forEach((key) => {
              const value = condition[key];
              self.$set(el.configData, key, value);
              self.privateMethodHandleBlur(el, key, value);
            })
          }
          // 省市区特殊处理
          if (['province', 'city', 'county'].indexOf(field) >= 0) {
            let condition = fieldsCondition1[field];
            Object.keys(condition).forEach((key) => {
              let value = condition[key];

              if (el && el.selectAreaData) {
                let target = null;
                el.selectAreaData.forEach((area) => {
                  if (area.field == field) {
                    target = area;
                  }
                })
                if (target) {
                  self.$set(target, key, value);
                  // self.privateMethodHandleBlur(target, key, value);
                  self.privateMethodHandleBlur(el.$children[0], key, value,'select');
                  self.privateMethodHandleBlur(el.$children[1], key, value,'select');
                  self.privateMethodHandleBlur(el.$children[2], key, value,'select');
                }
              }
            })
          }
        })
      }
    },

    // 处理 组织类型 的逻辑  : 当组织类型是承运方的时候，“许可证号码”和“所在地区”必填
    // 页面 transportCertificate         province  city  county
    // 平台管理/认证管理/组织认证   platform/cert_org/approval
    // 平台管理/会员管理/组织管理   orgManagement/add
    // 资源库/伙伴管理/伙伴列表    partner/add
    // 资源库/伙伴管理/伙伴列表  
    // 账户设置/公司/公司信息      org/self
    commonLogicOrgType() {

      const listProject = [];
      if (listProject.indexOf(this.comonProjectName) < 0) {
        return;
      }
      let self = this;
      this.$watch(`domainObject.orgType`, (val) => {
        intrinsicMethods(val);
      })
      intrinsicMethods(this.domainObject.orgType);
      // 内部方法 
      function intrinsicMethods(val) {
        let fieldsCondition1, fieldsCondition2 = null;
        if ('2' == val) { // 承运方
          // “许可证号码”和“所在地区”必填
          // 专门 处理 required 的处理，因为通过 js 修改 与 上面的修改配置 逻辑不一样，所以 当修改 required 特殊处理

          fieldsCondition1 = {
            // 必填处理
            'transportCertificate': { 'required': 'true' },
            'province': { 'required': 'true' },
            'city': { 'required': 'true' },
            'county': { 'required': 'true' }
          };
          fieldsCondition2 = {
            'transportCertificate': 'true',
            'orgArea': 'true'
          };
        } else {
          fieldsCondition1 = {
            // 必填处理
            'transportCertificate': { 'required': 'false' },
            'province': { 'required': 'false' },
            'city': { 'required': 'false' },
            'county': { 'required': 'false' }
          };
          //1.“许可证号码”和“所在地区”非必填
          fieldsCondition2 = {
            'transportCertificate': 'false',
            'orgArea': 'false'
          };
        }
        self.privateMethodHandleCompontConfig(fieldsCondition1,fieldsCondition2);
      }
    },
    // 处理waybill 中 waybillStatus 改变对应的逻辑
    // 编辑运单时，如果运单状态为“运输完成”，发货重量及单位、收货重量及单位、发货时间和收货时间必填。（运单为其它状态时，无需判断此逻辑）
    commonLogicWaybillStatus() {
      const listProject = [];
      if (listProject.indexOf(this.comonProjectName) < 0) {
        return;
      }
      let self = this;
      this.$watch(`domainObject.waybillStatus`, (val) => {
        intrinsicMethods(val);
      })
      intrinsicMethods(this.domainObject.waybillStatus);

      // 内部方法 
      function intrinsicMethods(val) {
        let fieldsCondition1, fieldsCondition2 = null;
        if ('finish' == val) { // 承运方
          // 发货重量及单位、收货重量及单位、发货时间和收货时间必填
          // 专门 处理 required 的处理，因为通过 js 修改 与 上面的修改配置 逻辑不一样，所以 当修改 required 特殊处理

          fieldsCondition1 = {
            'loadingGoodsWeight': { 'required': 'true' },
            'loadingGoodsWeightUnitCode': { 'required': 'true' },
            'unloadingGoodsWeight': { 'required': 'true' },
            'unloadingGoodsWeightUnitCode': { 'required': 'true' },
            'loadingTime': { 'required': 'true' },
            'unloadingTime': { 'required': 'true' }
          };
          fieldsCondition2 = {
            'loadingGoodsWeight': 'true',
            'unloadingGoodsWeight': 'true',
            'loadingTime': 'true',
            'unloadingTime': 'true'
          };
        } else {
          fieldsCondition1 = {
            'loadingGoodsWeight': { 'required': 'false' },
            'loadingGoodsWeightUnitCode': { 'required': 'false' },
            'unloadingGoodsWeight': { 'required': 'false' },
            'unloadingGoodsWeightUnitCode': { 'required': 'false' },
            'loadingTime': { 'required': 'false' },
            'unloadingTime': { 'required': 'false' }
          };
          //1.发货重量及单位、收货重量及单位、发货时 非必填
          fieldsCondition2 = {
            'loadingGoodsWeight': 'false',
            'unloadingGoodsWeight': 'false',
            'loadingTime': 'false',
            'unloadingTime': 'false'
          };
        }
       self.privateMethodHandleCompontConfig(fieldsCondition1,fieldsCondition2);
      }
    },
    // ------------------------  动态调用小智 车辆入网状态 --------------------
    commonRoboticNetworkStatus(){
      const self = this;
      if(!this.domainObject.truckLicenseNo){
        showMessageUtil('warning','车牌号为空',3000)
        return;
      }
      const paramObj = {'vclN':this.domainObject.truckLicenseNo}
      const apiUrl = `${ApiConst.BaseDomain}/smartz/sinoiov/checkTruckExist `;
      HTTP.post(apiUrl, paramObj, (success, error) => {
        if(success && success.content){
          const map = {
            'yes':'normal',
            'no':'abnormal'
          }
          self.domainObject['networkStatus'] = map[success.content['result']] || 'none';
        }
      });
    }
  }
}
