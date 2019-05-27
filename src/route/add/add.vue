/**
* add.vue 线路详情页面
* Created by cc on 17/8/10.
*/
<template>
  <div>
    <div class="form-page">
      <ele-form :domainObject="domainObject" ref="form" :configUrl="configUrl" :listUrl="listUrl" :listTitle="listTitle" :getInfo="getInfo" :addFun="addFun" :editFun="editFun" :editable="editable" :isEdit="isEdit" @formReady="formReady" @formMounted="formMounted" @editSuccess="editSuccess" @submitDone="submitDone" @accessDenied="accessDenied" :objectName="objectName" label-width="100px" :inline="false" :folder="folder">
        <layout :isEdit="isEdit" :editable="editable" :objectName="objectName" :fields="fields" :clientDetailColumns="clientDetailColumns">
          <div v-for="field in fields" :slot="field.fieldConfigCode">
            <el-form-item :label="field.showName" :required="field.required ==='true'">
              <ele-block :field="field" :domainObject="domainObject" :editable="editable" :uploadUrl="uploadUrl" :inputKey="inputKey"></ele-block>
            </el-form-item>
          </div>
          <!-- <span v-bind:class="showRadiusLoading | filterClassIconLoading(domainObject)" slot="loadingAddressMap" @click="showAddress('loading')" class="show-gps-icon"></span>
          <span v-bind:class="showRadiusLoading | filterClassIconUnloading(domainObject)" slot="unloadingAddressMap" @click="showAddress('unloading')" class="show-gps-icon"></span> -->

          <span slot="loadingAddressMap" class="select-address-map">
            <strong class="ll-status" :class="[loadingAddressText === '已取经纬度' ? 'green' : 'red']">{{ loadingAddressText }}</strong>
            <el-button @click="showAddress('loading')" v-show="editable">设置</el-button>
          </span>

          <span slot="unloadingAddressMap" class="select-address-map">
            <strong class="ll-status" :class="[unloadingAddressText === '已取经纬度' ? 'green' : 'red']">{{ unloadingAddressText }}</strong>
            <el-button @click="showAddress('unloading')" v-show="editable">设置</el-button>
          </span>

          <span class="show-radius" v-bind:class="showRadiusLoading | filterClass()" type="primary" @click="showFanceRediusMap('loading')" slot="loadingFanceRediusMap">{{showRadiusLoading}}</span>
          <span class="show-radius"  v-bind:class="showRadiusUnloading | filterClass()" type="primary" @click="showFanceRediusMap('unloading')" slot="unloadingFanceRediusMap">{{showRadiusUnloading}}</span>

          <el-button type="primary" v-show="!editable && isEdit" @click="editForm()" slot="buttonEdit">编辑</el-button>
          <el-button v-show="editable && isEdit" @click="cancelEdit()" slot="buttonCancel">取消编辑</el-button>
          <el-button v-show="editable && isEdit" @click="submitForm()" slot="buttonSave">保存</el-button>
          <!--<el-button v-show="!editable && isEdit" @click="changeLog()" slot="buttonChangeLog">{{ objectName }}变更记录</el-button>-->
          <el-button v-show='editable && !isEdit' type="primary" @click="submitForm()" size="large" slot="buttonSubmit" :disabled="btnDisabled">提交</el-button>
          <el-button v-show='editable && !isEdit' @click="resetForm()" size="large" slot="buttonReset" :disabled="btnDisabled">重置</el-button>
          <logs slot="tabChangeLog" :selectable="false" :operatable="false" :domain="uploadUrl" :type="logType" :code="code" :isAdvanced="false" :params="changeLogParams" :needPage="true">
          </logs>
        </layout>
      </ele-form>
      <!-- 地图 start -->
      <routerAddressMap v-if='actionDialogVisible' ref="routerAddressMap" :modelLocation="modelLocation" :dialogVisibleMap='actionDialogVisible' @dialogSubmit='dialogSubmitMap' @dialogClose='dialogCloseMap' @syncAddress="syncAddress"></routerAddressMap>
      <routerAddressMapRail v-if="actionDialogVisibleRail" ref="routerAddressMapRail" :modelLocation="modelFanceRediusMap" :dialogVisibleMap='actionDialogVisibleRail' @dialogSubmit='dialogSubmitMapRail' @dialogClose='dialogCloseMapRail'></routerAddressMapRail>
      <!-- 地图 end -->
      <div class="full-mask" v-show="dialogFormVisible">
        <el-dialog title="提示" :visible.sync="dialogFormVisible" :before-close="closePage" class="close-tip">
          <p><span class="el-icon-warning"></span>该线路不属于本公司，无法查看。</p>
          <div slot="footer" class="dialog-footer">
            <el-button @click="closePage">关闭</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import layout from '../layout.vue';
import eleBlock from '../../components/ele-block/eleBlock.vue';
import eleForm from '../../components/ele-form/eleForm.vue';
import routerAddressMap from '../routerAddressMap.vue';
import routerAddressMapRail from '../routerAddressMapRail.vue';
import { add as routeAdd, edit as routeEdit, get as routeGet, getDetail } from '../../../api/RouteService';
import logs from '../../logs/list.vue';
import ApiConst from '../../../api/ApiConst';
import { getParamsFromURL, closeCurrentWindow } from '../../../api/Utils';


export default {
  components: {
    'ele-form': eleForm,
    'ele-block': eleBlock,
    routerAddressMap,
    layout,
    logs,
    routerAddressMapRail
  },
  computed: {
    // 设置与 预览 的字的显示
    showRadiusLoading() {
      if (this.editable) { // 新建 + 编辑
        return '设置'
      } else { //详情
        if ((this.domainObject.loadingFanceRedius && this.domainObject.loadingFanceRediusUnitCode) || (this.domainObject.loadingAreaRedius && this.domainObject.loadingAreaRediusUnitCode)) {
          return '预览'
        } else {
          return ''
        }
      }
    },
    showRadiusUnloading() {
      if (this.editable) { // 新建 + 编辑
        return '设置'
      } else { //详情
        if ((this.domainObject.unloadingFanceRedius && this.domainObject.unloadingFanceRediusUnitCode) || (this.domainObject.unloadingAreaRedius && this.domainObject.unloadingAreaRediusUnitCode)) {
          return '预览'
        } else {
          return ''
        }
      }
    },
    loadingAddressText() {
      let text = this.domainObject.loadingLongitude && this.domainObject.loadingLatitude ? '已取经纬度' : '未取经纬度';
      return text;
    },
    unloadingAddressText() {
      let text = this.domainObject.unloadingLongitude && this.domainObject.unloadingLatitude ? '已取经纬度' : '未取经纬度';
      return text;
    }
  },
  filters: {
    // 主要用于 class 
    filterClass(val) {
      if (val === '设置') {
        return 'show-radius-color';
      }
      return '';
    },
    filterClassIconLoading(val, domainObject) {
      if (domainObject.loadingLongitude && domainObject.loadingLatitude) {
        return 'show-gps-icon-color'
      }
      return '';
    },
    filterClassIconUnloading(val, domainObject) {
      if (domainObject.unloadingLongitude && domainObject.unloadingLatitude) {
        return 'show-gps-icon-color'
      }
      return '';
    }
  },
  data() {
    return {
      objectName: '线路',
      configUrl: `${ApiConst.apiResourceDomain}/detail_render_info/route/list`,
      folder: 'resource/route',
      domainObject: {},
      addFun: routeAdd,
      editFun: routeEdit,
      getInfo: routeGet,
      uploadUrl: ApiConst.apiResourceDomain,
      logType: 'route',
      listUrl: '/route/list.html',
      listTitle: '线路列表',
      status: false,
      code: '',
      fields: [],
      isEdit: false, // 控制编辑添加按钮
      editable: true, // 控制页面状态
      btnDisabled: false,
      changeLogParams: {
        code: getParamsFromURL(window.location.search).code,
        size: 10
      },
      loading: true,
      defaultDetailColumns: [],
      actualDetailColumns: [],
      clientDetailColumns: [],
      actionDialogVisible: false, //地图显示
      actionDialogVisibleRail: false, //地图显示
      modelLocation: {
        editable: true,
        code: '',
        isEdit: '',
        lat: 0,
        lng: 0,
        type: '',
        address: '', // loadingAddress  unloadingAddress
        realCity: '',
        realAddress: '',
        province: '',
        city: '',
      },
      //画圈的model
      modelFanceRediusMap: {
        editable: true,
        code: '',
        isEdit: '',
        lat: 0,
        lng: 0,
        type: '',
        fanceRedius: '',
        fanceRediusUnitCode: '',
        fanceRediusArea: '',
        fanceRediusUnitCodeArea: '',
        realAddress: ''
      },
      dialogFormVisible: false
    };
  },
  methods: {
    accessDenied() {
      console.log('accessDenied now');
      this.dialogFormVisible = true;
    },
    closePage() {
      this.dialogFormVisible = false;
      console.log('closePage now');
      closeCurrentWindow();
    },
    syncAddress(data, type) {
      // console.log('address changed, new address is ', data);
      // const address = data.addressComponents.street + data.addressComponents.streetNumber;
      // if (type === 'loading') {
      //   this.$set(this.domainObject, 'loadingAddress', address);
      // }
      // if (type === 'unloading') {
      //   this.$set(this.domainObject, 'unloadingAddress', address);
      // }
    },
    // 清除model 数据
    clearDialogModel() {
      this.modelLocation.code = '';
      this.modelLocation.isEdit = '';

      this.modelLocation.lat = 0;
      this.modelLocation.lng = 0;
      this.modelLocation.type = '';
      this.modelLocation.address = '';
      this.modelLocation.city = '';
      this.modelLocation.realAddress = '';

      this.modelFanceRediusMap.code = '';
      this.modelFanceRediusMap.isEdit = '';
      this.modelFanceRediusMap.lat = 0;
      this.modelFanceRediusMap.lng = 0;
      this.modelFanceRediusMap.type = '';
      this.modelFanceRediusMap.fanceRedius = '';
      this.modelFanceRediusMap.fanceRediusUnitCode = '';
      this.modelFanceRediusMap.realAddress = '';
    },
    dialogCloseMap() {
      this.actionDialogVisible = false;
      this.clearDialogModel();
    },
    dialogSubmitMap(model) {
      if ('loading' == model.type) { // 发货地址
        this.domainObject.loadingLongitude = model.lng;
        this.domainObject.loadingLatitude = model.lat;
        this.domainObject.realLoadingAddressCity = model.city;
        this.domainObject.realLoadingAddress = model.realAddress;
        //反写地址
        this.domainObject.loadingAddress = model.realAddress;
      }
      if ('unloading' == model.type) { // 发货地址
        this.domainObject.unloadingLongitude = model.lng;
        this.domainObject.unloadingLatitude = model.lat;
        this.domainObject.realUnloadingAddressCity = model.city;
        this.domainObject.realUnloadingAddress = model.realAddress;
        //反写地址
        this.domainObject.unloadingAddress = model.realAddress;
      }
      this.actionDialogVisible = false;
      this.clearDialogModel();
    },
    dialogCloseMapRail() {
      this.actionDialogVisibleRail = false;
      this.clearDialogModel();
    },
    dialogSubmitMapRail(model) {
      if ('loading' == model.type) { // 发货地址
        this.domainObject.loadingFanceRedius = model.modelRali[0].radius;
        this.domainObject.loadingFanceRediusUnitCode = model.modelRali[0].unitCode;
        this.domainObject.loadingAreaRedius = model.modelRali[1].radius;
        this.domainObject.loadingAreaRediusUnitCode = model.modelRali[1].unitCode;
      }
      if ('unloading' == model.type) { // 发货地址
        this.domainObject.unloadingFanceRedius = model.modelRali[0].radius;
        this.domainObject.unloadingFanceRediusUnitCode = model.modelRali[0].unitCode;
        this.domainObject.unloadingAreaRedius = model.modelRali[1].radius;
        this.domainObject.unloadingAreaRediusUnitCode = model.modelRali[1].unitCode;
      }
      this.actionDialogVisibleRail = false;
      this.clearDialogModel();
    },
    showAddress(type) {
      let prefix = '';
      if ('unloading' !== type && 'loading' !== type) { return }; //直接返回
      if ('unloading' === type) { prefix = 'un' };

      let mark = { flag: true, msg: '' };
      if (!this.domainObject[`${prefix}loadingProvinceCode`] || !this.domainObject[`${prefix}loadingCityCode`] || !this.domainObject[`${prefix}loadingAddress`]) {
        mark.flag = false;
        mark.msg = '请先填写地址';
      }
      if (!mark.flag) {
        this.$message({
          type: 'warning',
          message: mark.msg,
          duration: 3000
        });
        return;
      }
      //详情 + 没有坐标的时候  不给编辑
      if (!this.editable && (!this.domainObject[`${prefix}loadingLongitude`] || !this.domainObject[`${prefix}loadingLatitude`])) { return }
      this.modelLocation.code = this.domainObject.code;
      this.modelLocation.isEdit = this.isEdit;
      this.modelLocation.editable = this.editable;
      this.modelLocation.province = this.domainObject[`${prefix}loadingProvinceCode`];
      this.modelLocation.city = this.domainObject[`${prefix}loadingCityCode`];
      this.modelLocation.lng = this.domainObject[`${prefix}loadingLongitude`];
      this.modelLocation.lat = this.domainObject[`${prefix}loadingLatitude`];
      this.modelLocation.address = this.domainObject[`${prefix}loadingAddress`];
      this.modelLocation.type = type;
      this.actionDialogVisible = true;

      if ('loading' == type) {
        this.modelLocation.realCity = this.domainObject.realLoadingAddressCity;
        this.modelLocation.realAddress = this.domainObject.realLoadingAddress;
      }
      if ('unloading' == type) {
        this.modelLocation.realCity = this.domainObject.realUnloadingAddressCity;
        this.modelLocation.realAddress = this.domainObject.realUnloadingAddress;
      }
    },
    showFanceRediusMap(type) {
      let prefix = '';
      if ('unloading' !== type && 'loading' !== type) { return }; //直接返回
      if ('unloading' === type) { prefix = 'un' };
      let mark = { flag: true, msg: '' };
      if (!this.domainObject[`${prefix}loadingLongitude`] || !this.domainObject[`${prefix}loadingLatitude`]) {
        mark.flag = false;
        mark.msg = '请先填写设置地址';
      }
      if (!mark.flag) {
        this.$message({
          type: 'warning',
          message: mark.msg,
          duration: 3000
        });
        return;
      }
      this.modelFanceRediusMap.editable = this.editable;
      this.modelFanceRediusMap.code = this.domainObject.code;
      this.modelFanceRediusMap.isEdit = this.isEdit;
      this.modelFanceRediusMap.lng = this.domainObject[`${prefix}loadingLongitude`];
      this.modelFanceRediusMap.lat = this.domainObject[`${prefix}loadingLatitude`];
      this.modelFanceRediusMap.fanceRedius = this.domainObject[`${prefix}loadingFanceRedius`];
      this.modelFanceRediusMap.fanceRediusUnitCode = 'metre';
      this.modelFanceRediusMap.fanceRediusArea = this.domainObject[`${prefix}loadingAreaRedius`]
      this.modelFanceRediusMap.fanceRediusUnitCodeArea = 'metre';
      this.modelFanceRediusMap.type = type;
      if ('loading' == type) {
        this.modelFanceRediusMap.realAddress = this.domainObject.realLoadingAddress;
      }
      if ('unloading' == type) {
        this.modelFanceRediusMap.realAddress = this.domainObject.realUnloadingAddress;
      }
      if (this.modelFanceRediusMap.lng && this.modelFanceRediusMap.lat) {
        this.actionDialogVisibleRail = true;
      }
    },
    formReady(formData) {
      console.log('formReady', formData);
      this.inputKey = formData.paramData.inputKey;
      this.fields = formData.paramData.field;
      this.isEdit = formData.isEdit;
      this.editable = formData.editable;
      this.code = formData.code;
      // const params = getParamsFromURL(window.location.search),
      //   self = this;
      // if (params.logisticsCode) {
      //   LogisticsService.get({ code: params.logisticsCode }, (success) => {
      //     if (success) {
      //       self.$refs.form.dispatchEvent('logisticsNo', 'change', success.content);
      //     }
      //   });
      // }
    },
    formMounted(form) {
      // 获取动态字段名称
      getDetail((success) => {
        const data = success.content;
        console.log('详情默认配置', data);
        data.forEach((val) => {
          this.defaultDetailColumns.push(val.fieldConfigCode);
        });
        console.log('详情实际配置', this.fields);
        this.fields.forEach((val) => {
          if (!val.extraParams[0].isShow) {
            this.actualDetailColumns.push(val.fieldConfigCode);
          }
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
    editForm() {
      this.editable = true;
    },
    cancelEdit() {
      this.$refs.form.resetForm();
      this.editable = false;
    },
    submitForm() {
      this.btnDisabled = true;
      this.$refs.form.submitForm();
    },
    resetForm() {
      this.$refs.form.resetForm();
    },
    editSuccess() {
      this.editable = false;
    },
    submitDone() {
      this.btnDisabled = false;
    }
  }
};

</script>
<style lang="scss" rel="stylesheet/scss">
.full-mask {
  position: fixed;
  z-index: 9999;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #f5f5f5;
}
.close-tip {
  .el-dialog {
    width: 388px !important;
    margin-bottom: 0;
    top: 50% !important;
    transform: translateX(-50%) translateY(-50%);
    p {
      padding: 20px;
      line-height: 48px;
    }
    .el-icon-warning {
      vertical-align: middle;
      font-size: 48px;
      color: #f48400;
      margin-right: 20px;
    }
  }
  .dialog-footer {
    text-align: right;
  }
}
.map-dialog {
  .el-dialog--large {
    top: 5% !important;
    bottom: 5%;
    width: 90%;
    margin-left: -45% !important;
    margin-bottom: 0;
  }

  .pop-map {
    position: absolute;
    top: 57px;
    right: 20px;
    bottom: 55px;
    left: 20px;
  }

  .el-dialog__body {
    max-height: none;
  }

  .el-dialog__footer {
    position: absolute;
    right: 20px;
    bottom: 0;
    left: 20px;
    margin: 0;
    box-sizing: border-box;
  }
}

</style>
