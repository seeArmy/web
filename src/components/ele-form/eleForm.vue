<template>
  <el-form :model="domainObject" ref="form" label-width="100px" :inline="inline">
    <slot></slot>
  </el-form>
</template>
<script type="text/ecmascript-6">
import { urlRedirect, getParamsFromURL, getParam, NumtoStr as numtoStr, dealInputKey } from '../../../api/Utils';
import { removeClass } from '../../../api/classUtil';

import PublicArea from '../../../api/PublicArea';


// // 引入robot
// require('../../robot.js');

const axios = require('axios'),
  lsType = getParamsFromURL(window.location.search).dt;

export default {
  name: 'eleForm',
  provide() {
    return {
      eventBus: null
    };
  },
  componentName: 'eleForm',
  props: {
    isList: {
      type: Boolean,
      'default': false
    },
    domainObject: Object,
    objectName: String,
    isEdit: Boolean,
    listUrl: String,
    listTitle: String,
    //      layout: String,
    editable: Boolean,
    configUrl: String,
    inline: Boolean,
    getInfo: Function,
    addFun: Function,
    editFun: Function,
    isAddSuccessTip: {
      type: Boolean,
      'default': true
    },
    folder: String,
    publicPage:{
      type:String,
      'default':''
    }
  },
  data() {
    return {
      elementCount: 0,
      elementLoadedCount: 0,
      elementChildren: [],
      ioArea: {},
      ignoredElements: ['selectArea', 'quoteType', 'tagSelect', 'listDriver', 'listViceDriver', 'listTrailerTruck'],
      robotFields: [],
      theme: true
    };
  },
  methods: {
    getParams(params) {
      const paramsObj = {};
      if (params.code || params.truckCode || params.orgCode || params.userCode) {
        if (params.code) {
          paramsObj.code = params.code;
          if (params.orgCode) {
            paramsObj.orgCode = params.orgCode;
          }
        } else {
          paramsObj.code = 'null';
          if (params.truckCode) {
            paramsObj.truckCode = params.truckCode;
          } else if (params.orgCode) {
            paramsObj.orgCode = params.orgCode;
          } else if (params.userCode) {
            paramsObj.userCode = params.userCode;
          }
        }
        return paramsObj;
      } else {
        return false;
      }

    },
    isArray(val) {
      if (typeof Array.isArray === 'function') {
        return Array.isArray(val);
      }
      return Object.prototype.toString.call(val) === '[object Array]';
    },
    resolveDetail(data, callback) {
      const params = getParamsFromURL(window.location.search),
        urlCode = params.code,
        originalCode = params.originalCode,
        objectName = params.objectName,
        urlEditable = params.editable,
        urlGoto = params.goto,
        self = this,
        paramData = data,
        formData = {};
      data.field.forEach((val) => {
        if (val.extraParams[0].robot === 'TRUE') {
          this.robotFields.push({'field':val.fieldConfigCode, 'robotName': val.extraParams[0].robotName, 'robotField': val.extraParams[0].robotField});
        }
      });
      console.log('robotFields is', this.robotFields);

      formData.paramData = paramData;
      formData.model = {};
      formData.isEdit = false;
      formData.editable = !(urlEditable === 'false');
      formData.urlGoto = urlGoto;
      console.log('formData begins', formData);
      if (self.getParams(params)) {
        let paramObj = {};
        paramObj = self.getParams(params);
        if (paramObj.code) {
          formData.code = paramObj.code;
        }
        formData.isEdit = true;
        self.getInfo(paramObj, (success, error) => {
          if (error) {
            callback(error);
          }
          if (success) {
            Object.keys(success.content).forEach((key) => {
              if (self.isArray(success.content[key])) {
                formData.model[key] = success.content[key];
              } else {
                formData.model[key] = numtoStr(success.content[key]);
              }
            });
            // console.log('domainObject is', self.domainObject);
            paramData.field.forEach((field) => {
              field.extraParams.forEach((property) => {
                if (!(property.field in formData.model)) {
                  // 编辑和详情页面不处理默认值
                  formData.model[property.field] = null;
                  // if (property.default) {
                  //   formData.model[property.field] = formData.model[property.field] || property.default;
                  // } else {
                  //   formData.model[property.field] = null;
                  // }
                }
              });
            });
            callback(null, formData);
          }
        });
      } else if (originalCode) {
        const paramObj = {
          code: originalCode
        };
        formData.isEdit = false;
        self.getInfo(paramObj, (success, error) => {
          if (error) {
            callback(error);
          }
          if (success) {
            Object.keys(success.content).forEach((key) => {
              if (key === 'freightNo' || key === 'code' || key === 'id' || key === 'logisticsStatus' || key === 'carrierOwnerUserFullname' || key === 'carrierOwnerUserCode' || key === 'carrierOwnerPlatformUserCode') {
                if (objectName === '外包订单') {
                  // 外包订单状态改为 待我方发送
                  key === 'logisticsStatus' ? (formData.model[key] = 'ready') : (formData.model[key] = null);
                } else {
                  key === 'logisticsStatus' ? (formData.model[key] = 'todo') : (formData.model[key] = null);
                }
              } else if (self.isArray(success.content[key])) {
                formData.model[key] = success.content[key];
              } else {
                formData.model[key] = numtoStr(success.content[key]);
              }
            });
            paramData.field.forEach((field) => {
              field.extraParams.forEach((property) => {
                if (!(property.field in formData.model)) {
                  // 编辑和详情页面不处理默认值
                  formData.model[property.field] = null;
                  // if (property.default) {
                  //   formData.model[property.field] = formData.model[property.field] || property.default;
                  // } else {
                  //   formData.model[property.field] = null;
                  // }
                }
              });
            });
            callback(null, formData);
          }
        });
      } else {
        paramData.field.forEach((field) => {
          field.extraParams.forEach((property) => {
            // 新建页面处理默认值
            if (property.default) {
              formData.model[property.field] = property.default;
            } else {
              formData.model[property.field] = null;
            }
          });
        });
        callback(null, formData);
      }
    },
     //判断下载模板的excel 是否存在
    checkFileExist(fileurl) {
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
    },

    initForm(callback) {
      const localStorage = window.localStorage,
        projectName = JSON.parse(localStorage.getItem('appInfo')).projectName || '',
        eleDefine = JSON.parse(localStorage.getItem('eleDefine')),
        eleInfo = JSON.parse(localStorage.getItem('eleInfo')),
        self = this;

      let detailJson = null;

      // 根据add.vue页面配置的configUrl，去匹配detail_render_info.json文件目录
      var ApiConst = require('../../../api/ApiConst');
      var pathParts = self.configUrl.replace(/^https?:\/\/.*?\//g, '').split("/");
      console.log('pathParts is ...', pathParts, self.configUrl);
      // 引入详情配置json文件
      var rq = require(`../../../api/fieldMetadata/${ApiConst.fieldMetadataDir}/${pathParts[0]}/${pathParts[2]}/${pathParts[1]}.json`);

      // 查看static 文件 是否存在
      let markExist = false;
      if (projectName && self.folder) {
        let path = `../../../static/projects/${projectName}/${self.folder}/detail_render_info.json`;
        markExist = this.checkFileExist(path);
      }

      // 如果配置了项目名称，则请求新的配置json文件
      if (projectName && self.folder && markExist) {
        const folder = self.folder, // 获取配置文件目录名称
          time = (new Date()).getTime(),
          detailPath = `../../../static/projects/${projectName}/${folder}/detail_render_info.json?t=${time}`;
        // 获取详情字段配置
        function detailConfig() {
          return axios({
            method: 'get',
            url: detailPath,
            headers: { 'Accept': 'application/json' }
          });
        }
        axios.all([detailConfig()])
          .then(axios.spread((detailConfig) => {
            detailJson = detailConfig;
            console.log('详情字段配置为', detailJson);
            // 解析详情字段
            const detailResultData = detailJson.data.content,
              detailParamData = getParam({ data: { content: detailResultData } }, eleDefine, eleInfo);
            // 调用解析字段method
            this.resolveDetail(detailParamData, callback);
          }));
      } else {
        // 没有配置，则默认读取标准配置json文件
        const detailResultData = rq.content,
          detailParamData = getParam({ data: { content: detailResultData } }, eleDefine, eleInfo);
        this.resolveDetail(detailParamData, callback);
      }
    },
    validate(callback) {
      this.$refs.form.validate(callback);
    },
    submitForm() {
      const self = this;
      self.$emit('testSubmit', self.domainObject);
      self.$refs.form.validate((valid) => {
        if (valid) {
          self.btnDisabled = true;
          self.$emit('beforeSubmit', self.domainObject);

          if (this.isEdit) {  // 编辑页面提交
            this.editFun(self.domainObject.code, self.domainObject, (success, error) => {
              self.btnDisabled = false;
              if (error || success.code !== 200) {
                this.$message({
                  type: 'error',
                  message: error.content,
                  duration: 5000
                });
                self.$emit('submitDone');
                return false;
              }
              if (success) {
                this.$message({
                  type: 'success',
                  message: '提交成功',
                  duration: 1000
                });
                self.$emit('editSuccess', success.content);
                //                  document.dispatchEvent(event);
              }
              self.$emit('submitDone');
            });
          } else {  // 新建页面提交
            console.log('domainObject is', self.domainObject);
            this.addFun(self.domainObject, (success, error) => {
              console.log('disabled = false.')
              self.btnDisabled = false;
              if (error || success.code !== 200) {
                this.$message({
                  type: 'error',
                  showClose: true,
                  message: error.content,
                  duration: 5000
                });
                self.$emit('submitDone');
                return false;
              }
              if (success) {
                if (this.isAddSuccessTip) {
                  this.$confirm(`恭喜您,新建${self.objectName}成功！ 是否继续新建${self.objectName}?`, '提示', {
                    confirmButtonText: '继续新建',
                    cancelButtonText: `返回${self.objectName}列表`,
                    type: 'success',
                    customClass: 'confirm-dialog'
                  }).then(() => {
                    window.location.reload();
                  }).catch(() => {
                    let url = this.listUrl;
                    const qindex = url.indexOf('?'),
                      title = this.listTitle;
                    // console.log(url, title);
                    if (qindex > -1 && !lsType) {
                      url = url.substring(0, qindex);
                    }
                    // console.log(url, title);
                    urlRedirect(url, title);
                  });
                }
                self.$emit('addSuccess', success.content);
                //                  document.dispatchEvent(event);
                self.$emit('submitDone');
              }
            });
          }
        } else {
          self.$emit('submitDone');
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm() {
      if (document.querySelector('#pictureResourceCode')) {
        const imglist = document.querySelector('#pictureResourceCode .el-upload-list').querySelectorAll('li'),
          uploadCard = document.querySelector('#pictureResourceCode .el-upload--picture-card');
        if (imglist.length > 0) {
          document.querySelector('#pictureResourceCode .el-upload-list').innerHTML = '';
          removeClass(uploadCard, 'hide');
        }
      }
      this.$refs.form.resetFields();
    },
    dispatchEvent(target, event, data) {
      console.log('dispatch event eleForm', event, 'to', target, 'data', data);
      this.elementChildren.forEach((ele) => {
        if (ele.fieldName === target) {
          ele.element.$emit(event, data);
        }
      });
    },
    getElementByField(field) {
      const ele = this.elementChildren.find(ele => ele.fieldName === field);
      if (ele) {
        return ele.element;
      }
      return null;
    },
    mountedDone() {
      // console.log('elementChildren====',this.elementChildren);
      this.elementChildren.forEach((ele) => {
        ele.element.init();
      });
      console.log('ele-form init done');
      this.$emit('formMounted', this);
    }
  },
  created() {
    if (this.theme) {
      document.querySelector('body').classList.add('theme-blue');
    }
    console.log('domainObject ...', this.domainObject);
    const self = this;
    /* eslint-disable no-underscore-dangle */
    self._provided.eventBus = this;
    self.eventBus = self._provided.eventBus;
    this.eventBus.$on('eleCreated', (ele, fieldName) => {
      const field = fieldName ? fieldName : ele.configData.field;
      console.log('received eleCreated event. field', field, '. element', ele);
      this.elementChildren.push({ fieldName: field, element: ele });
      if (this.ioArea[field]) {
        this.ioArea[field] = null;
      }
    });

    this.eventBus.$on('eleMounted', () => {
      //        console.log('field', ele.configData.field, 'mounted');
      console.log('received eleMounted event. field1111111111');
      this.elementLoadedCount += 1;
      if (this.elementLoadedCount === this.elementChildren.length) {
        Object.keys(this.ioArea).forEach((key) => {
          if (this.ioArea[key]) {
            console.log('add hidden io property', key, this.ioArea[key]);
            dealInputKey(this.ioArea[key], (inputFieldKey, outData) => {
              this.$set(this.domainObject, key, outData[inputFieldKey]);
              // this.domainObject[key] = outData[inputFieldKey];
            });
          }
        });
        console.log('domainObject ...', this.domainObject);
        // this.eventBus.$off('eleMounted');
        // this.eventBus.$off('eleCreated');
        this.mountedDone();
      }
    });

    this.initForm((error, formData) => {
      if (error) {
        if(self.publicPage && getParamsFromURL(window.location.search).orgCode){
          window.location.href = self.publicPage;
        }else{
          console.error('error', error);
          if (error.content === '您无权查看该线路') {
            self.$emit('accessDenied');
          } else {
            self.$message({
              type: 'error',
              message: `${error.content}`,
              duration: 2000
            });
          }
        }
      } else {
        const model = formData.model;
        Object.keys(model).forEach((key) => {
          self.$set(self.domainObject, key, model[key]);
        });
        console.log('form ready', formData);
        formData.paramData.field.forEach((component) => {
          if (!this.ignoredElements.find(item => item === component.elementCode)) {
            component.extraParams.forEach((control) => {
              if (control.inputKey) {
                this.ioArea[control.field] = control.inputKey;
              }
            });
          }
        });

        // 注册机器人
        // robotFields存放当前页面所有配置机器人的字段
        // this.robotFields.push({'field':val.fieldConfigCode, 'robotName': val.extraParams[0].robotName, 'robotField': val.extraParams[0].robotField});
        this.robotFields.forEach((obj) => {
          smartz.reg(obj.robotName, (data) => {
            const widget = self.getElementByField(obj.field);
            console.log('element field is---------', widget);
            console.log('robot data is---------', data);
            // self.$set(self.domainObject, obj.field, data[obj.robotField]);
            if (widget.configData.outputKey) {
              const outputKey = widget.configData.outputKey;
              console.log('output', outputKey, 'value', data);
              PublicArea.set(outputKey, data);
            }
            // 关闭当前弹窗
            widget.dialogVisible = false;
          });
        });

        self.$emit('formReady', formData);
      }
    });
  }
};

</script>
