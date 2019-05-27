/** * list.vue * Created by zhuyi on 17/7/5. */
<template xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <div id="list" class="list-page">
    <!-- advance search -->
    <div class="advance-search" v-if="isAdvanced && needFullSearch">
      <div class="as-hd clearfix">
        <h3 class="tit fl">高级搜索</h3>
        <span class="as-close fr" id="asClose" @click="closeAdvanceSearch">
          <i class="el-icon-close"></i>
        </span>
      </div>
      <div class="as-bd" id="asBd">
        <v-tableSearch @reset="reset" @submit="submit" :searchFields="searchFields" :searchModel="searchModel" :isShow="false" ref="tableSearch">
        </v-tableSearch>
      </div>
    </div>
    <div class="list-wrap">
      <div class="page-header clearfix">
        <h2 class="page-title fl" v-if="objectName !== '组织' && !isHide && isAdvanced && !customListName">
         {{ objectName }}列表
        </h2>
        <h2 class="page-title fl" v-if="objectName !== '组织' && !isHide && isAdvanced && customListName">
         {{ customListName }}
        </h2>
        <h2 class="page-title fl" v-else-if="objectName === '组织' && !isHide  && isAdvanced">
          <!-- 组织结构 -->
          {{ objectName }}列表
        </h2>
        <div class="status-text fl" v-if="autoRefresh && autoRefreshTimer"><span class="org">{{ counter }}s</span>后刷新</div>
        <div class="hd-opr fr">
          <a v-if="!(!isAdvanced) && needAdd && !customAdd" href="javascript:;" class="el-button el-button--primary" @click="createObject()">
        <i class="el-icon-plus"></i> <span v-if="customAddButtonName != null">{{customAddButtonName}}</span><span v-else>新建{{ objectName }}</span>
      </a>
          <a v-else-if="!(!isAdvanced) && needAdd && customAdd" href="javascript:;" class="el-button el-button--primary" @click="createObject()">
        <i class="el-icon-plus"></i> {{ customAddName }}
      </a>
          <el-upload accept=".csv" @importClick="importClick" @beforeUpload="beforeUpload" @uploadSuccess="uploadSuccess" :action="importUrl" v-if="showImportButton && isAdvanced" :add="add" :downloadErrorData="downloadErrorData" :actionData="actionData" :getColumn="getColumn" :getImportColumn="getImportColumn" :columnsData="importColumnsData" :objectName="objectName" class="innerblock">导入{{ objectName }}</el-upload>
          <a href="javascript:;" v-if="showDownloadTemplate && isAdvanced" @click="downloadTemplate_" data-title="下载模板" class="el-button el-button--default">下载模板</a>
          <slot name="topRightFun"></slot>
        </div>
        <span @click='listRefresh' class="page-refresh fr" id="pageRefresh" v-if="isAdvanced">
      <i class="ico-refresh"></i>刷新
    </span>
      </div>
      <div class="block">
        <div class="table-opr clearfix">
          <div class="opr-button fl" v-if="isAdvanced">
            <el-button type="default" id="exportCSV" v-if="showExportButton" @click="clickExportCSV">导出{{objectName}}</el-button>
            <!-- 自定义button custom eg：订单确认列表中的 确认按钮-->
            <el-button type="default" id="custom" v-if="showCustomBtn" @click="cilckCustomBtn">{{customBtnName}}</el-button>
            <el-button type="default" id="batch_submit" v-if="showBatchSubmit" @click="batchSubmit_">{{batchOprName}}</el-button>
            <el-button type="default" id="batch_ignored" v-if="showBatchIgnored" @click="batchIgnored_">{{batchIgnoredName}}</el-button>
            <el-button type="default" id="batch_btn1" v-if="showBatchBtn1" @click="batchOpr1_">{{batchBtn1Name}}</el-button>
            <el-button type="default" id="batch_btn2" v-if="showBatchBtn2" @click="batchOpr2_">{{batchBtn2Name}}</el-button>
            <slot name="funArea"></slot>
            <el-checkbox v-if="showLowerDept" v-model="isDept" @change="showDepartment(isDept)" class="list-check-dept">显示下级部门</el-checkbox>
          </div>
          <div class="opr-button fl" v-else>
            <slot name="funArea"></slot>
          </div>
          <div class="mini-search fr" id="miniSearch" v-if="needPage && showminiSearch">
            <v-minTableSearch @reset="reset" @submit="submit" :searchFields="searchFields" :searchModel="searchModel" :isShow="isAdvanced && needFullSearch" ref="tableSearch" :miniSearchNum="miniSearchNum"></v-minTableSearch>
          </div>
          <a v-if="needMore" href="javascript:;" class="el-button el-button--primary fr" @click="more()">
        查看更多
      </a>
        </div>
        <v-table :selectable="selectable" :operatable="operatable" :multiSelect="multiSelect" :selectedCode="selectedCode" :selectedCodes="selectedCodes" :ignoreCalColumns="ignoreCalColumns" :footerEnable="footerEnable" ref="table" @menuClick="menuClick" @select="handleSelect" :deleteFun="deleteFun" :editUrl="editUrl" :actionUrl="actionUrl" :dispatch="dispatch" :dispatchUrl="dispatchUrl" :isPlatformCode="isPlatformCode" :dispatchFreightSendCar="dispatchFreightSendCar" :dispatchFreightSendCarUrl="dispatchFreightSendCarUrl" :columnsData="columnsData" :listData="listData" :searchData="searchData" :actionData="actionData" :operValues="operValues" :objectName="objectName" :uploadUrl="uploadUrl" v-loading.fullscreen.lock="loading" :refreshFreightFun="refreshFreightFun" :refreshFreightDispatch="refreshFreightDispatch" :closeFreightFun="closeFreightFun" :closeFreightDispatch="closeFreightDispatch" :pop-waybill-truck-map="popWaybillTruckMap" :pop-logsitcs-truck-map="popLogsitcsTruckMap" @searchSort="searchSort"
        @listAction="handlelistAction">
        </v-table>
        <v-page :page="page" :pageSize="pageSize" :total="total" v-on:change="change" v-if="needPage"></v-page>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import table from './eleTable.vue';
import tableSearch from './eleTableSearch.vue';
import page from './elePage.vue';
import minTableSearch from './eleMinTableSearch.vue';
import eleUpload from '@/components/ele-upload/eleUpload.vue';
import { toggleClass } from '../../../../api/classUtil';
import { getParam, adaptHeight, getParamsFromURL } from '../../../../api/Utils';

// 引入tab跳转
require('@/public.js');

const axios = require('axios');

export default {
  name: 'eleList',
  components: {
    'v-table': table,
    'v-tableSearch': tableSearch,
    'v-minTableSearch': minTableSearch,
    'v-page': page,
    'el-upload': eleUpload
  },
  props: {
    exportParams: {
      type: Object,
      'default': null
    },
    selectedCode: {
      type: String,
      'default': null
    },
    customAddButtonName: { // 定制特殊新建按钮名字，如新建合同定制为下载合同
      type: String,
      'default': null
    },
    customListName: { // 定制特殊列表名字，如外包订单确认列表
      type: String,
      'default': null
    },
    selectedCodes: {
      type: Array,
      default () {
        return [];
      }
    },
    isPlatformCode: {
      type: Boolean,
      'default': false
    },
    ignoreCalColumns: {
      type: Array,
      default () {
        return [];
      }
    },
    multiSelect: {
      type: Boolean,
      'default': true
    },
    footerEnable: {
      type: Boolean,
      'default': false
    },
    autoRefresh: {
      type: Boolean,
      'default': false
    },
    autoRefreshTimer: {
      type: Number,
      'default': 30
    },
    miniSearchNum: {
      type: Number,
      'default': 2
    },
    showminiSearch: {
      type: Boolean,
      'default': true
    },
    listData: Array,
    total: Number,
    loading: Boolean,
    getColumn: Function,
    getImportColumn: Function,
    getSearch: Function,
    add: Function,
    downloadErrorData: Function,
    objectName: null,
    customAddName: null,
    addUrl: '',
    editUrl: '',
    actionUrl: '',
    dispatch: '',
    dispatchUrl: '',
    dispatchFreightSendCar: {
      type: Boolean,
      'default': false
    },
    dispatchFreightSendCarUrl: '',
    deleteFun: Function,
    getAction: Function,
    uploadUrl: String,
    exportCsv: Function,
    importUrl: String,
    downloadTemplate: Function,
    isHide: false,
    refreshFreightFun: Function,
    closeFreightFun: Function,
    refreshFreightDispatch: {
      type: Boolean,
      'default': false
    },
    closeFreightDispatch: {
      type: Boolean,
      'default': false
    },
    showExportButton: {
      type: Boolean,
      'default': true
    },
    showDownloadTemplate: {
      type: Boolean,
      'default': true
    },
    showLowerDept: {
      type: Boolean,
      'default': false
    },
    showImportButton: {
      type: Boolean,
      'default': true
    },
    showBatchSubmit: {
      type: Boolean,
      'default': false
    },
    showBatchIgnored: {
      type: Boolean,
      'default': false
    },
    showBatchBtn1: {
      type: Boolean,
      'default': false
    },
    showBatchBtn2: {
      type: Boolean,
      'default': false
    },
    popWaybillTruckMap: {
      type: Boolean,
      'default': false
    },
    popLogsitcsTruckMap: {
      type: Boolean,
      'default': false
    },
    showCustomBtn: {
      type: Boolean,
      'default': false
    },
    customBtnName: String,
    batchOprName: String,
    batchIgnoredName: String,
    batchSubmit: Function,
    batchIgnored: Function,
    batchBtn1Name: String,
    batchBtn2Name: String,
    extraSearchParamObj: {},
    selectable: {
      type: Boolean,
      'default': true
    },
    operatable: {
      type: Boolean,
      'default': true
    },
    customColumn: Array,
    removeCustomColumn: {
      type: Array,
      'default': function() {
        return [];
      }
    },
    isAdvanced: {
      type: Boolean,
      'default': true
    },
    needPage: {
      type: Boolean,
      'default': true
    },
    needMore: {
      type: Boolean,
      'default': false
    },
    needAdd: {
      type: Boolean,
      'default': true
    },
    customAdd: {
      type: Boolean,
      'default': false
    },
    needFullSearch: {
      type: Boolean,
      'default': true
    },
    params: {
      type: Object,
      'default': function() {
        return {};
      }
    },
    downloadTemplateParams: {
      type: Object,
      'default': function() {
        return {};
      }
    },
    uploadTemplateParams: {
      type: Object,
      'default': function() {
        return {};
      }
    },
    pageSize: {
      type: Number,
      'default': function() {
        return 20;
      }
    },
    folder: String,
    // 是否显示 序号
    isShowSerialNumber: {
      type: Boolean,
      'default': false
    },
  },
  data: () => {
    return {
      searchFieldsDone: false,
      columnFieldsDone: false,
      columnsData: [],
      importColumnsData: [],
      searchData: [],
      page: 1,
      exportMaxSize: 3000,
      exportMinSize: 1,
      searchFields: [],
      searchModel: {},
      actionData: {},
      operValues: {},
      isDept: true,
      leftDistance: '',
      topDistance: '',
      waybillUrl: '/waybill/list.html',
      attachmentUrl: '/attachment/list.html',
      insuranceUrl: '/insurance/list.html',
      maintenanceUrl: '/maintenance/list.html',
      careUrl: '/care/list.html',
      peccancyUrl: '/peccancy/list.html',
      accidentUrl: '/accident/list.html',
      tyreUrl: '/tyre/list.html',
      tyreInspectionUrl: '/tyre_inspection/list.html',
      bankAccountAddUrl: `/driver/account-add.html?personCode=${getParamsFromURL(window.location.search).code}`,
      timer: null,
      counter: null,
      theme: true,
      listJsonFolder:null
    };
  },
  methods: {
    listRefresh(){
      window.location.reload();
    },
    handlelistAction(actionName, item) {
      this.$emit('customAction', actionName, item)
    },
    // 设置 默认 搜索条件，主要是当 配置了 parojectName 之后 用法 直接传入 {key:val},可以设置 多个
    setSearchModelDefault(obj){
      if(obj && obj instanceof Object){
        var key;
        for(key in obj){
          if(obj.hasOwnProperty(key)){
            this.$set(this.searchModel, key, obj[key]);
            setTimeout(()=>{
             this.$set(this.searchModel, key, obj[key]); // 此处主要是为了 在第一次 展示的时候，显示的默认值 正确
            })
          }
        }
      }
    },
    // 初始化的时候 ，如果有默认的排序，需要传递过去
    initSearchSort(){
      let model = {};
      let mark = false;
      this.columnsData.forEach(item=>{
        if(item.extraParams[0].search){
          mark = true;
          model[`sort_${item.extraParams[0].field}`] = item.extraParams[0].search;
        }
      })
      return mark ? model : null;
    },
    //点击排序
    searchSort(key,val){
      key = `sort_${key}`;
      this.searchModel[key] = val;
      this.page = 1;
      this.dispatchQueryEvent();
    },
    cilckCustomBtn() {
      this.$emit('customBtnClick');
    },
    importClick() {
      this.$emit('importClick');
    },
    beforeUpload() {
      this.$emit('beforeUpload');
    },
    uploadSuccess(data) {
      this.$emit('uploadSuccess', data);
    },
    more() {
      this.$emit('more', this.params);
    },
    showDepartment(status) {
      this.$emit('showLowerDept', status);
    },
    reset() {
      this.$refs.table.dataChanged();
      this.dispatchQueryEvent();
    },
    submit(from) {
      console.log('submit from', from);
      this.$refs.table.dataChanged();
      this.dispatchQueryEvent(from);
    },
    menuClick(command, menu, model) {
      this.$emit('action', command, menu, model);
    },
    handleSelect(model, index) {
      this.$emit('select', model, index);
    },
    createObject() {
      this.$emit('action', 'add', null, null);
    },
    resetScrollBar() {
      const tableWrap = document.querySelector('.fix-table-wrap'),
        fixHd = document.querySelectorAll('.fix-hd'),
        fixCol = document.querySelectorAll('.fix-col');
      tableWrap.scrollTop = this.topDistance;
      tableWrap.scrollLeft = this.leftDistance;
      for (let i = 0, len = fixHd.length; i < len; i++) {
        fixHd[i].style.top = `${this.topDistance}px`;
      }
      for (let j = 0, len = fixCol.length; j < len; j++) {
        fixCol[j].style.left = `${this.leftDistance}px`;
      }
    },
    closeAdvanceSearch() {
      const listPage = document.querySelector('#list'),
        miniSearch = document.querySelector('#miniSearch');
      toggleClass(listPage, 'opened');
      toggleClass(miniSearch, 'hide');
    },
    // 所有 列表导出 统一地方

    // 统一修改的点
    // 1. 将 对应的server.js 的 请求变成 /export/custom/xxx ， 请求改成 postJson
    // 2. 调用 eleList 时候  有this.total
    // 3. 确保 调用 eleList 的时候 配置  :exportCsv="exportCsv"
    clickExportCSV() {
      let self = this;
      // 全部的导出在内部 统一处理 1.获取查询条件参数 1.getCloum 2.提交
      let params = this.getQueryParams();
      if(this.exportParams){
          params = this.exportParams;
      }

      // 去除 空的 key
      Object.keys(params).forEach(item => {
        if (null == params[item] || undefined == params[item]) {
          delete params[item];
        }
      });
      let dataTotal = 0;
      if (this.$parent.total) {
        dataTotal = this.$parent.total;
      }
      if (dataTotal < 1) {
        this.$message({
          type: 'warning',
          message: '请检查当前总条数为0',
          duration: 3000
        });
        return;
      }
      if (dataTotal > 3000) {
        this.$message({
          type: 'warning',
          message: '导出条数超过3000条限制，不可导出！',
          duration: 3000
        });
      } else {
        this.loading = true;
         params.page = 1; // 不管第几页 都是 发给后台 第1 页
        params.size = dataTotal;
        this.getColumn((success, error) => {
          // 排除 隐藏的字段
          let con = this.listJsonFolder ? this.listJsonFolder :success.content;
          let configListBefore = [];
          let colArr =  this.removeCustomColumn;

          con.forEach(item=>{
            if(!colArr || colArr.indexOf(item.fieldConfigCode)<0){
               configListBefore.push(item);
            }
          })
          const paramsObj = {
            params: params,
            configList: configListBefore
          };
          self.exportCsv(paramsObj, (success, error) => {
            if (error || success.code !== 200) {
              self.$message({
                type: 'error',
                message: error.content,
                duration: 5000
              });
              // loading = false;
              this.loading = false;
            }
            if (success) {
              // loading = false;
              window.location.href = success.content.url;
              this.loading = false;
            }
          });
        });
      }
    },
    batchSubmit_() {
      this.$emit('batchSubmit_');
      return;

      const self = this,
        length = self.listData.length,
        h = this.$createElement;
      let successNum = 0;
      let failedNum = 0;

      let total = 0;
      this.listData.forEach(item => {
        if (true === item.checked && 'undispatched' == item.driverAcceptStatus) {
          total++;
        }
      });
      if (total < 1) {
        this.$message({
          type: 'warning',
          message: `您并没有选择，或则您选择的车辆状态不对，请核实`,
          duration: 2000
        });
        return;
      }
      this.$msgbox({
        title: '消息',
        message: h('p', null, [h('span', null, '确认批量派车吗？ ')]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = '执行中...';
            for (let i = 0; i < length; i++) {
              const data = self.listData[i];
              if (true === data.checked && 'undispatched' == data.driverAcceptStatus) {
                self.batchSubmit(data, (success) => {
                  if (success && success.code === 200) {
                    successNum += 1;
                  } else {
                    failedNum += 1;
                  }
                  if ((successNum + failedNum) == total) {
                    const info = `请求共${total}条数据,成功忽略掉${successNum}条接单数据,忽略失败${failedNum}`;
                    self.$message({
                      type: 'warning',
                      message: info,
                      duration: 3000
                    });
                    setTimeout(() => {
                      window.location.reload();
                    }, 3000);
                    done();
                    instance.confirmButtonLoading = false;
                  }
                });
              }
            }
          } else {
            done();
          }
        }
      }).then(() => {
        // done();
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      });
    },
    batchIgnored_() {
      const self = this,
        length = self.listData.length,
        h = this.$createElement;
      let successNum = 0;
      let failedNum = 0;
      let total = 0;
      this.listData.forEach(item => {
        if (true === item.checked && 'undispatched' == item.driverAcceptStatus) {
          total++;
        }
      })
      if (total < 1) {
        this.$message({
          type: 'warning',
          message: `您并没有选择，或则您选择的车辆状态不对，请核实`,
          duration: 2000
        });
        return;
      }
      this.$msgbox({
        title: '消息',
        message: h('p', null, [h('span', null, '确认批量忽略吗？ ')]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = '执行中...';
            for (let i = 0; i < length; i++) {
              const data = self.listData[i];
              if (true === data.checked && 'undispatched' == data.driverAcceptStatus) {
                self.batchIgnored(data.code, (success) => {
                  if (success && success.code === 200) {
                    successNum += 1;
                  } else {
                    failedNum += 1;
                  }
                  console.log('数量 ...', successNum, failedNum, length, total);
                  if ((successNum + failedNum) == total) {
                    console.log('进入...1 ...')
                    const info = `请求共${total}条数据,成功忽略掉${successNum}条接单数据,忽略失败${failedNum}`;
                    self.$message({
                      type: 'warning',
                      message: info,
                      duration: 3000
                    });
                    setTimeout(() => {
                      window.location.reload();
                    }, 3000);
                    instance.confirmButtonLoading = false;
                    done();
                  }
                });
              }
            }
          } else {
            done();
          }
        }
      }).then(() => {
        // done();
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      });
    },
    batchOpr1_() {
      this.$emit('batchOpr1');
    },
    batchOpr2_() {
      this.$emit('batchOpr2');
    },
    downloadTemplate_() {
      let path = `/static/uploadTemplate/${this.objectName}导入模板.xls`;
      let mark = this.checkFileExist(path);
      if (mark) { //存在
        window.location.href = path;
      } else {
        const templateName = `${this.objectName}模板.csv`;
        this.downloadTemplate(Object.assign({
          csvTemplateName: templateName
        }, this.downloadTemplateParams), (data) => {
          if (data && data.code === 200) {
            window.location.href = data.content.url;
          }
        });
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
    //倒计时刷新页面
    counterNow() {
      if (this.counter > 0) {
        this.counter--;
      } else {
        clearInterval(this.timer);
        window.location.reload();
      }
    },
    getQueryParams(from) {
      // 查询数据时，page 始终从第一页开始查询
      const paramObj = {
        size: this.pageSize,
        page: from === 'fromSearch' ? 1 : this.page
      };
      if (from === 'fromSearch') {
        console.log('页码设置到第一页', from);
        this.page = 1;
      }
      Object.keys(this.searchModel).forEach((key) => {
        paramObj[key] = this.searchModel[key];
      });
      // 合并传进来的数据作为搜索条件
      if (this.extraSearchParamObj && Object.keys(this.extraSearchParamObj).length > 0) {
        Object.assign(paramObj, this.extraSearchParamObj);
      }
      return paramObj;
    },
    change(newPage, newPageSize) {
      const tableWrap = document.querySelector('.fix-table-wrap');
      this.topDistance = tableWrap.scrollTop;
      this.leftDistance = tableWrap.scrollLeft;
      this.page = newPage;
      this.pageSize = newPageSize;
      this.dispatchQueryEvent();
    },
    dispatchExportEvent() {
      this.$emit('exportData', this.getQueryParams());
    },
    dispatchQueryEvent(from) {
      if( this.$refs.table){
        this.$refs.table.dataChanged();
      }
      this.$emit('query', this.getQueryParams(from));
    },
    // 特殊用法，保留页面刷新,目前只在 销项发票里面 用到，尽量不要用这个方法
    dispatchQueryEventSavePage(conditon){
      if( this.$refs.table){
         this.$refs.table.dataChanged();
      }
      let page = this.page;
      let search1 =  this.getQueryParams();
      search1.page = page;
      this.$emit('query', search1);
    },
    dispatchReadyEvent() {
     let model =  this.initSearchSort();
     if(model){
        Object.assign(this.searchModel, model);
        this.page = 1;
        this.dispatchQueryEvent();
     }
      if (this.searchFieldsDone && this.columnFieldsDone) {
        this.$emit('ready', this.getQueryParams(), this.columnsData);
      }
    },
    resolveSearch(paramsData, queryParams) {
      if (paramsData.field) {
        paramsData.field.forEach((field) => {
          if (field.extraParams) {
            field.extraParams.forEach((property) => {
              this.$set(this.searchModel, property.field, queryParams[property.field] ? queryParams[property.field] : null);
            });
          }
        });
      }
      this.searchFields = paramsData.field;
      this.searchFieldsDone = true;
      this.dispatchReadyEvent();
    },
    dealWithRemoveCustomColumn(listResultData){
      if(this.removeCustomColumn.length>0){
        let resultColumn ={};
        let newColumns = [];
        listResultData.forEach((val, index) => {
          resultColumn[val.fieldConfigCode] = val;
        });
        var key;
        for(key in resultColumn){
           let index = this.removeCustomColumn.indexOf(key);
           if(index<0){
            newColumns.push(resultColumn[key])
           }
        }
        return newColumns;
      }else{
        return listResultData;
      }
    },
    resolveList(paramsData) {
      const eleDefine = JSON.parse(localStorage.getItem('eleDefine')),
        eleInfo = JSON.parse(localStorage.getItem('eleInfo')),
        customColumn = this.customColumn,
        resultColumn = {};
        let  listResultData = paramsData.data ? (paramsData.data.content) : (paramsData.content),
             newColumns = [];
      if (customColumn && customColumn.length > 0) {
        listResultData.forEach((val, index) => {
          resultColumn[val.fieldConfigCode] = index;
        });
        customColumn.forEach((val) => {
          const column = listResultData[resultColumn[val]];
          if (column) {
            newColumns.push(column);
          }
        });
        if(this.removeCustomColumn.length>0){
          newColumns = this.dealWithRemoveCustomColumn(newColumns);
        }
        const columns = getParam({ data: { content: newColumns } }, eleDefine, eleInfo);
        this.columnsData = columns.field;
        this.columnFieldsDone = true;
        this.dispatchReadyEvent();
        // columnsData 获取值之后 ,手动调用 table-column-setting 的初始加载方法
        this.$nextTick(()=>{
            this.$refs.table.$refs.tablecolumn.loadCheckStatus()
        })

      } else {

        if(this.removeCustomColumn.length>0){
          listResultData = this.dealWithRemoveCustomColumn(listResultData);
        }
        const columns = getParam({ data: { content: listResultData } }, eleDefine, eleInfo);
        this.columnsData = columns.field;
        this.columnFieldsDone = true;
        this.dispatchReadyEvent();
        // columnsData 获取值之后 ,手动调用 table-column-setting 的初始加载方法
        this.$nextTick(()=>{
            this.$refs.table.$refs.tablecolumn.loadCheckStatus()
        })
      }
    }
  },
  events: {
    reload() {
      this.dispatchQueryEvent();
    }
  },
  created() {
    if (this.theme) {
      document.querySelector('body').classList.add('theme-blue');
    }
      console.log('created ... ele_list ');
    // 获取检索区域
    const self = this,
      localStorage = window.localStorage,
      projectName = JSON.parse(localStorage.getItem('appInfo')).projectName || '',
      queryParams = getParamsFromURL(window.location.search),
      eleDefine = JSON.parse(localStorage.getItem('eleDefine')),
      eleInfo = JSON.parse(localStorage.getItem('eleInfo'));
    let searchJson = null, listJson = null;

    // 查看static 文件 是否存在
     let markExist = false;
    if(projectName && self.folder){
      let path = `../../../static/projects/${projectName}/${self.folder}/list_render_info.json`;
      markExist  = this.checkFileExist(path);
    }

    // 如果配置了项目名称，则请求新的配置json文件
    if (projectName && self.folder && markExist) {
      const folder = self.folder, // 获取配置文件目录名称
        time = (new Date()).getTime(),
      searchPath = `../../../static/projects/${projectName}/${folder}/search_render_info.json?t=${time}`,
      listPath = `../../../static/projects/${projectName}/${folder}/list_render_info.json?t=${time}`;

      // 获取搜索字段配置
      function searchConfig() {
        return axios({
          method: 'get',
          url: searchPath,
          headers: { 'Accept': 'application/json' }
        });
      }
      // 获取列表字段配置
      function listConfig() {
        return axios({
          method: 'get',
          url: listPath,
          headers: { 'Accept': 'application/json' }
        });
      }
      axios.all([searchConfig(), listConfig()])
        .then(axios.spread((searchConfig, listConfig) => {

          this.listJsonFolder = JSON.parse(JSON.stringify(listConfig.data.content));


          searchJson = searchConfig;
          listJson = listConfig;
         // console.log('搜索字段配置为', searchJson, '列表字段配置为', listJson);
          // 解析搜索字段
          const searchResultData = searchJson.data.content,
              searchParamData = getParam({ data: { content: searchResultData } }, eleDefine, eleInfo);
          // 调用解析字段method
          this.resolveSearch(searchParamData, queryParams);
          // 获取导入列配置
          if (this.getImportColumn) {
            this.getImportColumn((success) => {
              if (success) {
                const columns = getParam({ data: success }, eleDefine, eleInfo);
                this.importColumnsData = columns.field;
              }
            });
          } else {
            this.importColumnsData = listJson.data.content;
          }
          // 解析列表字段
          this.resolveList(listJson);
        }));
    } else {
      // 没有配置，则默认读取标准配置json文件
      if (this.getSearch) {
        this.getSearch((searchConfig) => {
          if (searchConfig) {
            const resultData = searchConfig.content,
              paramData = getParam({ data: { content: resultData } }, eleDefine, eleInfo);
            this.resolveSearch(paramData, queryParams);
          }
          this.searchFieldsDone = true;
          this.dispatchReadyEvent();
        });
      } else {
        this.searchFieldsDone = true;
        this.dispatchReadyEvent();
      }
      if (this.getImportColumn) {
        this.getImportColumn((success) => {
          if (success) {
            const columns = getParam({ data: success }, eleDefine, eleInfo);
            this.importColumnsData = columns.field;
          }
        });
      }
      // 获取列名
      this.getColumn((success) => {
        if (success) {
          if (!this.getImportColumn) {
            this.importColumnsData = success.content;
          }
          // 获取列表配置
          this.resolveList(success);
        }
      });
    }
  },
  mounted() {
    if (this.autoRefresh && this.autoRefreshTimer > 0) {
      this.counter = this.autoRefreshTimer;
      this.timer = setInterval(this.counterNow, 1000);
    }
    // 重置宽度
    function fixedTable(event) {
      // console.log('target is', event.target);
      const tableWrap = event.target,
        top = tableWrap.scrollTop,
        left = tableWrap.scrollLeft,
        fixHd = tableWrap.querySelectorAll('.fix-hd'),
        fixCol = tableWrap.querySelectorAll('.fix-col'),
        unit = 'px';
      for (let i = 0, len = fixHd.length; i < len; i++) {
        fixHd[i].style.top = top + unit;
      }
      for (let j = 0, len = fixCol.length; j < len; j++) {
        fixCol[j].style.left = left + unit;
      }
    }
    document.querySelectorAll('.fix-table-wrap').forEach((value) => {
      value.addEventListener('scroll', fixedTable);
    });
    // 检测高度
    this.$nextTick(() => {
      adaptHeight();
      window.onresize = () => {
        adaptHeight();
      };
    });
  }
};

</script>
<style lang="scss" rel="stylesheet/scss">
@import "../../../assets/sass/base.scss";
@import "../../../assets/sass/rl-fixed-table.min.scss";
.list-check-dept {
  margin-left: 12px;
}

</style>
