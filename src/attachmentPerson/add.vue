/**
* detail.vue
* Created by cc on 17/8/10.
*/
<template>
  <div id="template" class="form-page">
    <div class="page-header clearfix">
      <h2 class="page-title fl">
        {{ isEdit ? ( editable ? '编辑' + objectName : objectName + '详情' ): ( '新建' + objectName) }}
      </h2>
      <div class="hd-opr fr">
        <el-button type="primary" v-show="!editable && isEdit" @click="editPage()">编辑</el-button>
        <el-button v-show="editable && isEdit" @click="cancelEdit()">取消编辑</el-button>
        <el-button v-show="!editable && isEdit" @click="changeLog()">{{ objectName }}变更记录</el-button>
      </div>
    </div>
    <div id="tmp-wrap"></div>
    <el-row v-loading.fullscreen.lock="loading" element-loading-text="加载中">
      <el-form :model="domainObject" ref="domainObject" label-width="140px" :inline="false">
        <el-col :span="12" v-for="field in fields" :key="field.fieldConfigCode" :class="field.area">
          <el-form-item :label="field.showName" :required="field.required ==='true'" >
            <ele-block  :field="field" :domainObject="domainObject" :inputKey="inputKey" :editable="editable" :uploadUrl="uploadUrl"></ele-block>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-show='editable || !isEdit' class="el-col-button">
          <el-form-item v-show="!loading">
            <el-button type="primary" @click="submitForm('domainObject')" size="large" :disabled="btnDisabled">提交</el-button>
            <el-button @click="resetForm('domainObject')" size="large">重置</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>

<script type="text/ecmascript-6">

  import eleBlock from '../components/ele-block/eleBlock.vue';
  import { urlRedirect, getParamsFromURL, getParam, NumtoStr as numtoStr } from '../../api/Utils';
  import { removeClass } from '../../api/classUtil';
  import ApiConst from '../../api/ApiConst';
  import { edit, add, get ,addPerson,getPerson,editPerson } from '../../api/AttachmentService';

  // 引入tab跳转
  require('../public.js');

  const axios = require('axios');

  export default {
    data() {
      return {
        objectName: '司机证照',
        domainObject: {},
        uploadUrl: `${ApiConst.apiPersonDomain}`,
        logType: '',
        listUrl: '/attachmentPerson/list.html',
        listTitle: '司机证照列表',
        fields: [],
        isEdit: false, // 控制编辑添加按钮
        editable: true, // 控制页面状态
        loading: true,
        code: '',
        getData: {},
        btnDisabled: false
      };
    },
    components: {
      'ele-block': eleBlock
    },
    mounted() {
      // 根据证件类型修改字段label.
      const fieldHeaderMapping = {
          '身份证': ['身份证号码','证件过期日期'], //  行驶证
          '驾驶证': ['档案编号','证件过期日期'], //  驾驶证
          '从业资格证': ['从业资格证号','证件过期日期'], //  驾驶证
        },
        fieldIndex = {
          attachmentNo: 0,
          attachmentExpirationDate: 1
        },
        params = getParamsFromURL(window.location.search);
      this.$watch('domainObject.attachmentName', (val) => {
        if (val != null) {
          const header = fieldHeaderMapping[val];  // 新字段头。
          if (header != null) {
            this.fields.forEach((item) => {
              const index = fieldIndex[item.fieldConfigCode];
              if (index != null) {
                //console.log('-----------------------------', item.showName);
                item.showName = header[index];
                item.extraParams[0].placeholder = `请输入${item.showName}`;
              }
            });
          }
        }
      });
    },
    methods: {

      loadFinish() {
//        console.log('load finish');
        const keys = Object.keys(window.rns);
//        console.log(keys);
        keys.forEach((key) => {
//          console.log(key);
          window.rns[key].init();
        });
      },
      editPage() {
        this.editable = true;
      },
      cancelEdit() {
        this.resetForm('domainObject');
        this.editable = false;
      },
      changeLog() {
        const url = `/logs/list.html?domain=${this.uploadUrl}&type=${this.logType}&code=${this.code}`,
          title = `${this.objectName}变更记录`;
//        console.log(url, title);
        urlRedirect(url, title);
      },
      isArray(val) {
        if (typeof Array.isArray === 'function') {
          return Array.isArray(val);
        }
        return Object.prototype.toString.call(val) === '[object Array]';
      },
      // 点击提交
      submitForm(formName) {
        const self = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            self.btnDisabled = true;
            if (this.isEdit) {
              // 编辑 person
             let params = getParamsFromURL(window.location.search);
             self.domainObject.userCode = params.userCode

              editPerson(this.code, this.domainObject, (success, error) => {
                if (error || success.code !== 200) {
                  this.$message({
                    type: 'error',
                    message: error.content,
                    duration: 5000
                  });
                  self.btnDisabled = false;
                  return false;
                }
                if (success) {
                  this.$message({
                    type: 'success',
                    message: '提交成功',
                    duration: 1000
                  });
                  self.btnDisabled = false;
                  self.isEdit = true;
                  self.editable = false;
                }
              });
            } else {
              // 新建 person
              let params  = getParamsFromURL(window.location.search);
              self.domainObject.userCode = params.userCode
               console.log('params',params);
              addPerson(this.domainObject, (success, error) => {
                if (error || success.code !== 200) {
                  this.$message({
                    type: 'error',
                    showClose: true,
                    message: error.content,
                    duration: 5000
                  });
                  self.btnDisabled = false;
                  return false;
                }
                if (success) {
                  this.code=success.content.code;
                  this.domainObject.code = success.content.code;
                  this.isEdit=true;
                  this.editable=true;
                  self.btnDisabled = false;

                  this.$confirm('恭喜您,新建成功!, 是否继续?', '提示', {
                    confirmButtonText: '继续添加',
                    cancelButtonText: '关闭',
                    type: 'warning'
                  }).then(() => {
                    window.location.reload();
                  }).catch(() => {

                  });

                }
              });
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        if (document.querySelector('.avatar-uploader')) {
          const imglist = document.querySelector('.avatar-uploader .el-upload-list').querySelectorAll('li'),
            uploadCard = document.querySelector('.avatar-uploader .el-upload--picture-card');
          if (imglist.length > 0) {
            document.querySelector('.avatar-uploader .el-upload-list').innerHTML = '';
            removeClass(uploadCard, 'hide');
          }
        }
        this.$refs[formName].resetFields();
      }
    },
    created() {

      document.addEventListener('loadDone', this.loadFinish, false);



      const self = this,
      // 解析 url 中的 字段
        params = getParamsFromURL(window.location.search),
        urlCode = params.code,
        urlEditable = params.editable,
        orgConfigUrl = ApiConst.apiOrgConfigDomain,
        // 获取element type deine
        defineUrl = `${orgConfigUrl}/element_type/define`,
        // 获取element type info
        typeUrl = `${orgConfigUrl}/element_type/info`;
      // console.log(this.configUrl);
      function elementDefine() {
        return axios({
          method: 'get',
          url: defineUrl,
          headers: { 'Accept': 'application/json' }
        });
      }
      function elementInfo() {
        return axios({
          method: 'get',
          url: typeUrl,
          headers: { 'Accept': 'application/json' }
        });
      }
      //   先从partnerConfig拿到数据，然后根据拿到的elementCode匹配element_type_define里面的组合信息，然后再到element_type_info里面拿到对应的数据
      // axios.all 执行多个并发请求
      axios.all([elementDefine(), elementInfo()]).then(axios.spread((eleDefine, eleInfo) => {
          const eleConfig = {
              code: 200,
              data: {
                content: [
                  // {
                  //   showName: '司机',
                  //   fieldConfigCode: 'truckLicenseNo',
                  //   elementCode: 'selectTruck',
                  //   extraParams: '{"field1":"truckLicenseNo","field2":"truckCode","required":"true","maxLength1":"20","placeholder1":"请输入车牌号","outputKey1":"truck","inputKey2":"truck.code"}'
                  // },
                  {
                    showName: '司机',
                    fieldConfigCode: 'truckLicenseNo',
                    elementCode: 'text',
                    // extraParams: '{"field1":"truckLicenseNo","placeholder1":"请输入司机姓名","required":"true"}'
                     extraParams: '{"field1":"truckLicenseNo","placeholder1":"请输入司机姓名","required":"true","readonly1":"readonly"}'
                  },
                  {
                    showName: '证照名称',
                    fieldConfigCode: 'attachmentName',
                    elementCode: 'select',
                    extraParams: '{"field1": "attachmentName", "required": "false","placeholder1":"请选择证照类型","optionsValue1":["身份证","驾驶证","从业资格证"],"options1":["身份证","驾驶证","从业资格证"]}'
                  },
                  {
                    showName: '档案编号',
                    fieldConfigCode: 'attachmentNo',
                    elementCode: 'text',
                    extraParams: '{"field1": "attachmentNo", "placeholder1":"请输入强交险单号"}'
                  },
                  {
                    showName: '发证机关',
                    fieldConfigCode: 'description',
                    elementCode: 'text',
                    extraParams: '{"field1": "description", "placeholder1":"请输入发证机关"}'
                  },
                  {
                    showName: '发证日期',
                    fieldConfigCode: 'attachmentIssuanceDate',
                    elementCode: 'date',
                    extraParams: '{"field1":"attachmentIssuanceDate","format1":"yyyy-MM-dd","required":"false"}'
                  },
                  {
                    showName: '到期日期',
                    fieldConfigCode: 'attachmentExpirationDate',
                    elementCode: 'date',
                    extraParams: '{"field1":"attachmentExpirationDate","format1":"yyyy-MM-dd","required":"false"}'
                  },
                  {
                    showName: '提醒日期',
                    fieldConfigCode: 'attachmentRemindDate',
                    elementCode: 'date',
                    extraParams: '{"field1":"attachmentRemindDate","format1":"yyyy-MM-dd","required":"false"}'
                  },
                  {
                    showName: '相关附件',
                    fieldConfigCode: 'attachmentResourceCode',
                    elementCode: 'file',
                    extraParams: '{"field1": "attachmentResourceCode", "required": "false", "maxLength1": 2, "dialogPreview": "TRUE"}'
                  }
                ]
              }
            },

            paramData = getParam(eleConfig, eleDefine, eleInfo);
         console.log('eleDefine====',eleDefine,'eleInfo====',eleInfo,'eleConfig====',eleConfig);
         console.log('paramData 处理完之后的数据====',paramData);

          self.inputKey = paramData.inputKey;
          let count = 0,
            len = 0;
          function cb() {
            count += 1;
            if (count === len) {
              const event = new Event('loadDone');
              document.dispatchEvent(event);
            }
          }

          if (urlCode || urlEditable) {
            const paramObj = {
              code: urlCode
            };
            // console.log(urlCode, urlEditable);
            self.code = urlCode;
            self.isEdit = true;

            // self.editable = urlEditable === 'true';
            getPerson(paramObj, (success) => {



              if (!self.code && success.content.code) {
                self.code = success.content.code;
              }

              Object.keys(success.content).forEach((key) => {
                // console.log('key is', key, 'value is', success.content[key]);
                if (self.isArray(success.content[key])) {
                  self.$set(self.domainObject, key, success.content[key]);
                } else {
                  self.$set(self.domainObject, key, numtoStr(success.content[key]));
                }
              });
              // console.log('domainObject is', self.domainObject);
              paramData.field.forEach((field) => {
                field.extraParams.forEach((property) => {
                  if (!(property.field in self.domainObject)) {
                    if (property.default) {
                      self.$set(self.domainObject, property.field, property.default);
                    } else {
                      self.$set(self.domainObject, property.field, null);
                    }
                  }
                  len += 1;
                });
              });
              // self.$set(self.domainObject, 'attachmentResourceCode', ':');
              self.fields = paramData.field;
              self.loading = false;
              document.addEventListener('loadEleDone', cb, false);
            });
          } else {
            // 新建进来 走这边
            paramData.field.forEach((field) => {
              field.extraParams.forEach((property) => {
                if (property.default) {
                  self.$set(self.domainObject, property.field, property.default);
                } else {
                  self.$set(self.domainObject, property.field, null);
                }
                len += 1;
              });
            });
            // 通过url 带过来的参数 在此处 需要 放到 里面
            // self.$set(self.domainObject, 'truckCode', params.truckCode);
            // self.$set(self.domainObject, 'truckLicenseNo', params.truckLicenseNo);

            self.fields = paramData.field;
            self.loading = false;
            self.editable = true;
            document.addEventListener('loadEleDone', cb, false);
          }
          let params = getParamsFromURL(window.location.search);
          // self.$set(self.domainObject, 'truckLicenseNo',params.fullName);

          self.domainObject.truckLicenseNo = params.fullName;
          console.log('len===',len);
          console.log('domainObject',self.domainObject);
        })
      );
    }
  };
</script>
<style lang="scss" rel="stylesheet/scss">
  @import "../assets/sass/base.scss";
  .form-page {
    .tableImg {
      width: 146px;
      height: 146px;
      border: solid 1px #c0ccda;
      border-radius: 6px;
    }
    .el-row .el-col-12:nth-child(8) {
      height: auto;
    }
  }
</style>
