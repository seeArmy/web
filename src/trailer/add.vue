/** * add.vue * Created by cc on 17/8/10. */
<template>
  <!-- 新建车辆 与 车辆详情页面 -->
  <div class="truck-add">
    <div class="form-page">
      <ele-form :domainObject="domainObject" ref="form" :configUrl="configUrl" :listUrl="listUrl" :listTitle="listTitle" :getInfo="getInfo" :addFun="addFun" :editFun="editFun" :editable="editable" :isEdit="isEdit" @formReady="formReady" @formMounted="formMounted" @editSuccess="editSuccess" @submitDone="submitDone" :objectName="objectName" label-width="100px" :inline="false" :folder="folder">
        <layout :isEdit="isEdit" :editable="editable" :objectName="objectName" :domainObject="domainObject" :clientDetailColumns="clientDetailColumns">
          <div v-for="field in fields" :key="field.fieldConfigCode" :slot="field.fieldConfigCode">
            <el-form-item :label="field.showName" :required="field.required ==='true'">
              <ele-block :field="field" :domainObject="domainObject" :editable="editable | filterEditble(field.fieldConfigCode,domainObject,listFiledIdent)" :uploadUrl="uploadUrl" :inputKey="inputKey"></ele-block>
            </el-form-item>
          </div>
<!--           <div slot="driverInfo">
            <driver :popData="popData" :seqCode="seqCode"></driver>
          </div> -->
          <el-button type="primary" v-show="unVerify && !editable" @click="verify(domainObject.code)" slot="buttonVerify">提交认证</el-button>
          <el-button type="primary" v-show="!editable && isEdit" @click="editForm()" slot="buttonEdit">编辑</el-button>
          <el-button v-show="editable && isEdit" @click="cancelEdit()" slot="buttonCancel">取消编辑</el-button>
          <el-button v-show="editable && isEdit" @click="submitForm('form')" slot="buttonSave">保存</el-button>
          <el-button v-show="!editable && isEdit" @click="changeLog()" slot="buttonChangeLog">{{ objectName }}变更记录</el-button>
          <el-button class='submitAndVerify' v-show='editable && !isEdit' v-if="showSubmit" type="primary" @click="submitForm('form')" size="large" slot="buttonSubmit" :disabled="btnDisabled">提交</el-button>

          <el-button v-show='editable && !isEdit' v-if="showSubmitVerify" type="primary" @click="doSubmitAndVerify()" size="large" slot="buttonSubmit" :disabled="btnDisabled">提交并认证</el-button>
<!--           <el-button v-show='editable && !isEdit' type="primary" @click="doSubmitAndVerify()" size="large" slot="buttonSubmit" :disabled="btnDisabled">提交并认证</el-button> -->
          
          <el-button v-show='editable && !isEdit' @click="resetForm('form')" size="large" slot="buttonReset" :disabled="btnDisabled">重置</el-button>
          <el-button v-if="!isEdit" v-show="(!isEdit || editable)&&editbleIdent" slot="truckLicenseNoMatch" @click="truckLicenseNoMatch" class="el-button--line"><i class="el-icon-search"></i>匹配</el-button>
        </layout>
      </ele-form>
    </div>
    <el-tabs type="border-card" slot="moreRecords" v-if="isEdit">
<!--       <el-tab-pane label="挂车信息">
        <el-row class="form-page">
          <el-form :model="trailerdomainObject" ref="trailerdomainObject" label-width="100px" :inline="false">
            <el-col :span="6" v-for="field in trailerfields" :key="field.fieldConfigCode">
              <el-form-item :label="field.showName">
                <ele-block :field="field" :domainObject="trailerdomainObject" :editable="trailereditable"></ele-block>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
      </el-tab-pane> -->
<!--       <el-tab-pane label="运单记录">
        <waybill :selectable="false" :operatable="false" :customColumn="customColumnWaybill" :isAdvanced="false" :params="params" :needPage="false" :needMore="true"></waybill>
      </el-tab-pane> -->
      <!--   <el-tab-pane label="认证附件">
        <attachment :selectable="false" :customColumn="customColumnAttachment" :parentTruckInfo="truckInfo" :isAdvanced="true" :params="params" :needPage="false"></attachment>
      </el-tab-pane> -->
      <el-tab-pane label="保险信息">
        <insurance :selectable="false" :customColumn="customColumnInsurance" :isAdvanced="false" :params="params" :needPage="false" :needMore="true"></insurance>
      </el-tab-pane>
      <el-tab-pane label="维修记录">
        <maintenance :selectable="false" :customColumn="customColumnMaintenance" :isAdvanced="false" :params="params" :needPage="false" :needMore="true"></maintenance>
      </el-tab-pane>
      <el-tab-pane label="保养记录">
        <car-care :selectable="false" :customColumn="customColumnCarcare" :isAdvanced="false" :params="params" :needPage="false" :needMore="true"></car-care>
      </el-tab-pane>
      <el-tab-pane label="违章记录">
        <peccancy :selectable="false" :customColumn="customColumnPeccancy" :isAdvanced="false" :params="params" :needPage="false" :needMore="true"></peccancy>
      </el-tab-pane>
      <el-tab-pane label="事故记录">
        <accident :selectable="false" :customColumn="customColumnAccident" :isAdvanced="false" :params="params" :needPage="false" :needMore="true"></accident>
      </el-tab-pane>
      <el-tab-pane label="轮胎清单">
        <tyre :selectable="false" :customColumn="customColumnTyre" :isAdvanced="false" :params="params" :needPage="false" :needMore="true"></tyre>
      </el-tab-pane>
      <el-tab-pane label="轮胎巡检">
        <tyre-inspection :selectable="false" :customColumn="customColumnTyreInspection" :isAdvanced="false" :params="params" :needPage="false" :needMore="true"></tyre-inspection>
      </el-tab-pane>
      <!-- <el-tab-pane label="附件">
        附件
      </el-tab-pane> -->
      <el-tab-pane label="变更记录">
        <logs :selectable="false" :operatable="false" :domain="uploadUrl" :type="logType" :code="code" :isAdvanced="false" :params="params" :needPage="true" v-if="code"></logs>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script type="text/ecmascript-6">
// import detailLayout from '../layout/detail/detailLayout.vue';
import eleForm from '../components/ele-form/eleForm.vue';
import layout from './layout.vue';
// import eleBlock from '../components/ele-block/eleBlock.vue';
import eleBlock from '../components/ele-block/eleBlock.vue';
// import driver from './driver/driver.vue';
import { add as truckAdd, edit as truckEdit, get as truckGet, verify, getDetail } from '../../api/TruckService';
import { listMatch as listtruck } from '../../api/TruckManagementService';
import { list as transportList } from '../../api/TransportService';
import { get as trailerGet } from '../../api/TrailerService';
import maintenance from '../maintenance/list.vue';
import insurance from '../insurance/list.vue';
import carCare from '../care/list.vue';
import peccancy from '../peccancy/list.vue';
import accident from '../accident/list.vue';
import tyre from '../tyre/list.vue';
import tyreInspection from '../tyreInspection/list.vue';
import attachment from '../attachment/list.vue';
import waybill from '../waybill/list.vue';
import logs from '../logs/list.vue';
import ApiConst from '../../api/ApiConst';
import * as TrailerService from '../../api/TrailerService';

import {
  removeClass
} from '../../api/classUtil';
import {
  getParamsFromURL,
  urlRedirect
} from '../../api/Utils';
/* eslint-disable quotes */
export default {
  components: {
    'ele-form': eleForm,
    // 'detailLayout': detailLayout,
    maintenance,
    carCare,
    // driver,
    insurance,
    peccancy,
    accident,
    tyre,
    tyreInspection,
    attachment,
    waybill,
    eleBlock,
    logs,
    layout
  },
  data() {
    return {
      code: '',
      popData: {
        datasource: 'driver',
        mainTruckCode: '',
        mainTruckLicenseNo: '',
        powerType: ''
      },
      seqCode: '',
      objectName: '挂车',
      configUrl: '',
      fieldCount: 0,
      domainObject: {},
      editable: true,
      isEdit: false,
      btnDisabled: false,
      unVerify: false,
      fieldConfig: Array,
      fields: Array,
      inputKey: Array,
      addFun: TrailerService.add,
      editFun: TrailerService.edit,
      getInfo: TrailerService.get,
      uploadUrl: ApiConst.apiTruckDomain,
      logType: 'truck',
      listUrl: '/trailer/list.html',
      listTitle: '挂车列表',
      customColumnWaybill: ['waybillNo', 'waybillStatus', 'trailerTruckLicenseNo', 'driverFullName', 'goodsName', 'loadingTime', 'loadingGoodsWeight', 'unloadingTime', 'unloadingGoodsWeight'],


      customColumnAttachment: ['truckLicenseNo', 'attachmentName', 'attachmentNo', 'attachmentIssuanceDate', 'attachmentExpirationDate', 'description', 'attachmentRemindDate', 'creatorUsername', 'createTime', 'updateUsername', 'updateTime'],


      // customColumnAttachment: ['truckLicenseNo', 'attachmentName', 'attachmentTypeCode', 'attachmentNo', 'attachmentIssuanceDate', 'attachmentExpirationDate', 'attachmentResourceCode', 'description', 'attachmentRemindDate', 'creatorUsername', 'createTime', 'updateUsername', 'updateTime'],


      customColumnInsurance: ['truckLicenseNo', 'insuranceType', 'insuranceCompany', 'insuranceDate', 'expireDate', 'remindDate', 'insuranceAmount', 'insuranceNo', 'premiumAmount', 'attachmentResourceCode1', 'description', 'creatorUsername', 'createTime', 'updateUsername', 'updateTime'],
      customColumnMaintenance: ['truckLicenseNo', 'driverName', 'maintenanceDate', 'maintenanceAddress', 'maintenanceUser', 'maintenanceItem', 'description', 'maintenanceCharge', 'currentMileage', 'attachmentResourceCode1', 'creatorUsername', 'createTime', 'updateUsername', 'updateTime'],
      customColumnCarcare: ['truckLicenseNo', 'driverName', 'careDate', 'careAddress', 'totalAmount', 'currentMileage', 'nextCareMileage', 'nextCareDate', 'remindDate', 'careItemName', 'careItemNumber', 'creatorUsername', 'createTime', 'updateUsername', 'updateTime'],
      customColumnPeccancy: ['truckLicenseNo', 'driverName', 'type', 'ticketNumber', 'peccancyDate', 'peccancyAddress', 'peccancyPoints', 'peccancyFine', 'agencyFee', 'lateFee', 'takeDate', 'creatorUsername', 'createTime', 'updateUsername', 'updateTime'],
      customColumnAccident: ['truckLicenseNo', 'driverName', 'accidentDate', 'accidentAddress', 'description', 'damagesAmount', 'insuranceCompany', 'takeCasePeople', 'actualCompensationAmount', 'gapAmount', 'drivingResponsibility', 'drivingResponsibilityAmount', 'projectPeople', 'endDate', 'creatorUsername', 'createTime', 'updateUsername', 'updateTime'],
      customColumnTyre: ['truckLicenseNo', 'tyreNo', 'tyreBrand', 'purchasePrice', 'onDate', 'onMileage', 'changeTyreNo', 'status', 'offDate', 'offMileage', 'tyreSalvage', 'totalMileage', 'creatorUsername', 'createTime', 'updateUsername', 'updateTime'],
      customColumnTyreInspection: ['truckLicenseNo', 'tyreNo', 'inspectionDate', 'tyreMileage', 'deepWrinkles', 'description', 'creatorUsername', 'createTime', 'updateUsername', 'updateTime'],
      waybillParams: {
        size: 50
      },
      trailereditable: false,
      params: {
        truckCode: getParamsFromURL(window.location.search).code,
        size: 10
      },
      trailerdomainObject: {},
      trailerfields: Array,
      truckInfo: { truckLicenseNo: null, code: null },
      listFiledIdent: ['truckLicenseNo', 'truckLicenseType', 'certStatus', 'truckOwner', 'truckPictureResourceCode', 'truckModelCode', 'truckLength', 'regTonnage', 'drivingLicenseRecourseCode', 'truckIdentifyCode', 'truckEngineNo', 'drivingLicenseExpirationDate', 'transportLicenseRecourseCode', 'transportLicenseNo', 'operateLicenseNo', 'transportLicenseExpirationDate', 'truckBizScope', 'brandName', 'totalWeight', 'curbWeight', 'truckRegistrationDate', 'truckLengthUnitCode', 'regTonnageUnitCode', 'truckHeightUnitCode', 'truckWidthUnitCode', 'cubageUnitCode', 'truckTotalWeightUnitCode', 'totalWeightUnitCode', 'truckCurbWeightUnitCode', 'truckTowWeightUnitCode', 'vehiclePermitNumber','truckCategory'],
      folder: 'truck/trailer',
      projectName: JSON.parse(localStorage.getItem('appInfo')).projectName,
      defaultDetailColumns: [],
      actualDetailColumns: [],
      clientDetailColumns: [],
      matchTruckObj: {
        truckLicenseNo: '',
        truckCode: ''
      }
    };
  },
  computed: {
    editbleIdent() {
      if ('authenticating' == this.domainObject.certStatus || 'authenticated' == this.domainObject.certStatus) {
        return false;
      } else {
        return true;
      }
    },
    showSubmit() {
      let defaultShow = true;
        if (this.domainObject.certStatus === 'authenticating' || this.domainObject.certStatus === 'authenticated') {
          defaultShow = true;
        } else {
          defaultShow = false;
        }
      return defaultShow;
    },
    showSubmitVerify() {
      let defaultShow = true;
      // 认证中和认证通过，不显示提交认证按钮
      if (this.domainObject.certStatus === 'authenticating' || this.domainObject.certStatus === 'authenticated') {
        defaultShow = false;
      } else {
        defaultShow = true;
      }
      return defaultShow;
    }
  },
  filters: {
    filterEditble(val, filed, domainObject, list) {
      let mark = false;
      list.forEach(str => {
        if (filed == str) {
          mark = true;
        }
      })
      if (mark) { // 说明是认证的字段
        if ('authenticating' == domainObject.certStatus || 'authenticated' == domainObject.certStatus) {
          return false;
        } else {
          return val;
        }
      } else { //不是认证的字段
        return val;
      }
    }
  },
  methods: {
    truckLicenseNoMatch() {
      let self = this;
      const comNo = this.domainObject.truckLicenseNo;
      if (comNo) {
        listtruck({ truckLicenseNo: comNo }, (success, error) => {
          console.log('listtruck ...', success, error);
          // if (error || success.code != 200) {
          //   this.$message({
          //     type: 'error',
          //     message: error.content || '车辆不存在！',
          //     duration: 1000
          //   });
          // }
          if (success) {
            const data = success.content;
            Object.keys(data).forEach((key) => {
              if ('code' == key) {
                self.$set(self.domainObject, 'truckCode', data[key]);
              } else {
                let mark = false;
                for (let i = 0; i < self.listFiledIdent.length; i++) {
                  let item = self.listFiledIdent[i];
                  if (item == key) {
                    mark = true;
                  }
                }
                if (mark) {
                  self.$set(self.domainObject, key, data[key]);
                }
              }
            });
            // 记录匹配到的车辆车牌号和truckCode
            this.$set(this.matchTruckObj, 'truckCode', data.code);
            this.$set(this.matchTruckObj, 'truckLicenseNo', this.domainObject.truckLicenseNo);
            // 临时补救方式，匹配到车牌后，车长与载重 验证不通过，具体原因 暂时还不知道，等待后人探索 ...
            if (this.domainObject.truckLength && this.domainObject.truckLength > 0) {
              this.$refs.form.getElementByField('truckLength').handleChange(this.domainObject.truckLength);
            }
            if (this.domainObject.regTonnage && this.domainObject.regTonnage > 0) {
              this.$refs.form.getElementByField('regTonnage').handleChange(this.domainObject.regTonnage);
            }
          }
        });
      } else {
        this.$message({
          type: 'error',
          message: '请输入车牌号',
          duration: 1000
        });
      }
    },
    formMounted(form) {
      // 获取动态字段名称
      getDetail((success) => {
        const data = success.content;
        console.log('详情默认配置', data);
        data.forEach((val) => {
          this.defaultDetailColumns.push(val.fieldConfigCode);
        });
        this.fields.forEach((val) => {
          this.actualDetailColumns.push(val.fieldConfigCode);
        });
        console.log('详情默认显示字段为', this.defaultDetailColumns);
        console.log('详情实际显示字段为', this.actualDetailColumns);
        this.actualDetailColumns.forEach((val) => {
          if (!this.defaultDetailColumns.includes(val)) {
            this.clientDetailColumns.push(val);
          }
        });
        console.log('详情动态显示字段为', this.clientDetailColumns);
      });
    },
    formReady(formData) {
      console.log('formReady', formData);
      this.inputKey = formData.paramData.inputKey;
      this.fields = formData.paramData.field;
      this.isEdit = formData.isEdit;
      this.editable = formData.editable;
      this.code = getParamsFromURL(window.location.search).truckCode || formData.code;
      this.truckInfo.truckLicenseNo = formData.model.truckLicenseNo;
      this.truckInfo.code = formData.model.code;
      console.log('formReady domainObject is', this.domainObject);
      // 车辆的实际code
      this.seqCode = formData.model.code;
      this.params.truckCode = this.domainObject.code;
      this.unVerify = (this.domainObject.certStatus === 'unauthenticated' || this.domainObject.certStatus === 'failed');
      if (this.isEdit) {
        this.loadTrailerConfig();
        const baseParams = { page: 1, size: 1 },
          searchParams = Object.assign({
            mainTruckCode: this.code
          }, baseParams);
        transportList(searchParams, (data) => {
          if (data.content.length) {
            const trailerTruckCode = data.content[0].trailerTruckCode;
            if (trailerTruckCode) {
              trailerGet({
                code: trailerTruckCode
              }, (res) => {
                if (res && res.content) {
                  // Object.assign(this.trailerdomainObject, res.content);
                  let self = this;
                  Object.keys(res.content).forEach(key => {
                    self.$set(self.trailerdomainObject, key, res.content[key]);
                  });
                }
              });
            }
          }
        });
        this.popData.mainTruckCode = this.code;
      }
    },
    editSuccess() {
      this.editable = false;
    },
    submitDone() {
      this.btnDisabled = false;
    },
    loadFinish() {
      //        console.log('load finish');
      const keys = Object.keys(window.rns);
      //        console.log(keys);
      keys.forEach((key) => {
        //          console.log(key);
        window.rns[key].init();
      });
    },
    editForm() {
      console.log('edit from');
      this.editable = true;
      this.isEdit = true;
    },
    cancelEdit() {
      this.$refs.form.resetForm();
      this.editable = false;
      this.isEdit = true;
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
    // 提交并认证
    submitAndVerify() {
      let self = this;
      let pass = this.submitForm('form', 'all');
      if (!pass) return;
      return new Promise((resolve, reject) => {
        // 验证
        self.$refs.form.$refs.form.validate((valid) => {
          if (valid) {
            self.addFun(self.domainObject, (success, error) => {
              console.log('disabled = false.')
              self.btnDisabled = false;
              if (error || success.code !== 200) {
                this.$message({
                  type: 'error',
                  showClose: true,
                  message: error.content,
                  duration: 5000
                });
                reject();
              }
              if (success && success.content) {
                resolve(success.content.code);
              }
            });
          }else{
            return new Promise((resolve,reject)=>{
              reject();
            })
          }
        })
      })
    },
    doSubmitAndVerify() {
      this.submitAndVerify().then((code) => {
        if (code) { this.verify(code, true) }
      })
    },
    submitForm(formName, type) {
      // 如果最终提交的手机号码跟上一次匹配的手机号码不一致，则删除上次匹配的userCode
      if (this.domainObject.truckLicenseNo !== this.matchTruckObj.truckLicenseNo) {
        this.$set(this.domainObject, 'truckCode', null);
      }
      if (!this.domainObject.drivingLicenseRecourseCode) {
        this.$message({
          type: 'warning',
          message: '行驶证附件为必填选项，请上传行驶证附件！',
          duration: 3000
        });
        return false;
      }
      if ('all' === type) {
        return true;
      } else {
        this.$refs[formName].submitForm();
      }
    },
    resetForm(formName) {
      if (document.querySelector('#pictureResourceCode')) {
        const imglist = document.querySelector('#pictureResourceCode .el-upload-list').querySelectorAll('li'),
          uploadCard = document.querySelector('#pictureResourceCode .el-upload--picture-card');
        if (imglist.length > 0) {
          document.querySelector('#pictureResourceCode .el-upload-list').innerHTML = '';
          removeClass(uploadCard, 'hide');
        }
      }
      console.log(this.$refs[formName]);
      this.$refs[formName].resetForm();
    },
    verify(code, type) {
      verify(code, (success, error) => {
        if (error) {
          this.$message({
            type: 'error',
            message: `提交认证失败：${error.content}`,
            duration: 5000
          });
        }
        if (success) {
          const certStatus = success.content.certStatus;
          if (certStatus) {
            this.$message({
              type: 'success',
              message: '提交成功',
              duration: 5000
            });
            this.domainObject.certStatus = certStatus;
            this.unVerify = false;
            if (type) {
              this.showPage();
            }
          } else {
            this.$message({
              type: 'error',
              message: `提交认证失败：${success.content.error}`,
              duration: 5000
            });
          }
        }
      });
    },
    showPage() {
      let self = this;
      this.$confirm(`恭喜您,新建并认证${self.objectName}成功！ 是否继续新建${self.objectName}?`, '提示', {
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
        if (qindex > -1 && !lsType) {
          url = url.substring(0, qindex);
        }
        urlRedirect(url, title);
      });

    },
    loadTrailerConfig() {
      this.trailerfields = [{
          "elementCode": "text",
          "showName": "挂车牌号",
          "detailLinkVisiable": "true",
          "fieldConfigCode": "truckLicenseNo",
          "extraParams": [{
            "controlType": "text",
            "field": "truckLicenseNo",
            "value": ""
          }]
        },
        {
          "elementCode": "text",
          "showName": "品牌型号",
          "fieldConfigCode": "brandName",
          "extraParams": [{
            "controlType": "text",
            "field": "brandName"
          }]
        },
        {
          "elementCode": "text",
          "showName": "识别代号",
          "fieldConfigCode": "idCode",
          "extraParams": [{
            "controlType": "text",
            "field": "idCode"
          }]
        },
        {
          "elementCode": "regTonnage",
          "showName": "总质量",
          "fieldConfigCode": "totalWeight",
          "extraParams": [{
              "controlType": "text",
              "field": "totalWeight"
            },
            {
              "controlType": "select",
              "field": "totalWeightUnitCode",
              "datasource": "truckCarry",
              "default": "kg"
            }
          ]
        },
        {
          "elementCode": "regTonnage",
          "showName": "整备质量",
          "fieldConfigCode": "curbWeight",
          "extraParams": [{
              "controlType": "text",
              "field": "curbWeight"
            },
            {
              "controlType": "select",
              "field": "curbWeightUnitCode",
              "datasource": "truckCarry",
              "default": "kg"
            }
          ]
        },
        {
          "elementCode": "regTonnage",
          "showName": "载重",
          "fieldConfigCode": "regTonnage",
          "extraParams": [{
              "controlType": "text",
              "field": "regTonnage"
            },
            {
              "controlType": "select",
              "field": "regTonnageUnitCode",
              "datasource": "truckCarry",
              "default": "ton"
            }
          ]
        },
        {
          "elementCode": "truckSize",
          "showName": "车长",
          "fieldConfigCode": "truckLength",
          "extraParams": [{
              "controlType": "number",
              "field": "truckLength"
            },
            {
              "controlType": "select",
              "field": "truckLengthUnitCode",
              "datasource": "truckSize",
              "default": "meter"
            }
          ]
        },
        {
          "elementCode": "truckSize",
          "showName": "车宽",
          "fieldConfigCode": "truckWidth",
          "extraParams": [{
              "controlType": "number",
              "field": "truckWidth"
            },
            {
              "controlType": "select",
              "field": "truckWidthUnitCode",
              "datasource": "truckSize",
              "default": "meter"
            }
          ]
        },
        {
          "elementCode": "truckSize",
          "showName": "车高",
          "fieldConfigCode": "truckHeight",
          "extraParams": [{
              "controlType": "number",
              "field": "truckHeight"
            },
            {
              "controlType": "select",
              "field": "truckHeightUnitCode",
              "datasource": "truckSize",
              "default": "meter"
            }
          ]
        },
        {
          "elementCode": "date",
          "showName": "注册日期",
          "fieldConfigCode": "truckRegistrationDate",
          "extraParams": [{
            "controlType": "text",
            "field": "truckRegistrationDate"
          }]
        },
        {
          "elementCode": "text",
          "showName": "产权人",
          "fieldConfigCode": "truckOwner",
          "extraParams": [{
            "controlType": "text",
            "field": "truckOwner"
          }]
        },
        {
          "elementCode": "textarea",
          "showName": "备注",
          "fieldConfigCode": "description",
          "extraParams": [{
            "controlType": "textarea",
            "field": "description"
          }]
        }
      ];
    }
  },
  created() {
    const truckUrl = ApiConst.apiTruckDomain,
      configUrl = `${truckUrl}/detail_render_info/trailer/list`;
    this.configUrl = configUrl;
  },
  mounted() {
    const self = this;
    window.matchTruckTrailerInfoNow = function() {
      console.log('matchTruckTrailerInfoNow');
      self.truckLicenseNoMatch();
    }
    // 失焦匹配信息
    setTimeout(() => {
      const ele = document.getElementsByName('truckLicenseNo')[0];
      if (ele) {
        ele.setAttribute('onblur', 'matchTruckTrailerInfoNow()');
      }
    }, 1000);
  }
};

</script>
<style lang="scss" rel="stylesheet/scss">
.truck-add {
  .submitAndVerify {
    margin-right: 3px;
  }

}

.list-page {
  height: auto !important;

  .fix-table-wrap {
    height: auto !important;
    max-height: 607px;

    .rl-fix-table {
      margin-left: 0 !important;
    }
  }
}

.el-tab-pane {

  .page-title,
  #pageRefresh,
  .hd-opr .innerblock,
  .hd-opr .el-button--default,
  .opr-button {
    display: none;
  }

  .list-page .page-header {
    padding: 0;
    border-bottom: 0;
  }
}

</style>
