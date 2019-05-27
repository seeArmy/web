<template>
  <!-- fix-table-wrap -->
  <div class="fix-table-wrap">
    <table class="rl-fix-table table-bordered">
      <thead>
        <tr>
          <th class="fix-hd fix-col" v-show="selectable">
            <input type="checkbox" class="ck-all" v-if="multiSelect" v-model="batchSelect" @change="selectAll">
            <label v-else>选择</label>
            <table-column-set :column-data="columnsData" ref="tablecolumn"  :columnret.sync="showColumnRet" />
          </th>
          <th class="fix-hd fix-col" v-if="isShowSerialNumber">序号</th>
          <th class="fix-hd fix-col" v-if="operatable">操作</th>
          <!-- <th class="fix-hd fix-col">ID</th> -->
          <th v-for="(column, column_index) in columnsData" class="fix-hd" :class="{ 'fix-col': column.extraParams[0].freeze }" v-if="showColumnRet.indexOf(column.fieldConfigCode) > -1 && checkPms(column)" :key="column_index">
            {{ column.showName }}
            <!-- 是否支持点击搜索排序 -->
            <span class="sear_icon" v-if='!isEmpty(column.extraParams[0].search)'>
               <i  class="el-icon-caret-top" :class="{ 'light_icon': column.extraParams[0].search == 'asc' }" @click="searchSort(column_index,'asc')"></i>
              <i  class="el-icon-caret-bottom" :class="{ 'light_icon': column.extraParams[0].search == 'desc' }" @click="searchSort(column_index,'desc',column_index)"></i>
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <!--<tr v-for="list in listData" :data-error="list.error">-->
        <tr :isList="true" v-for="(list,index) in listData" :key="index" :data-error="list.error" :class="{active : list.checked }" @click="selectRow(list)">
          <td class="fix-col" v-if="selectable">
            <span class="ck-mask" v-if="multiSelect">
              <input type="checkbox" class="ck-single" v-model="list.checked" :disabled='selectedCodes.indexOf(list.code)!==-1 ? true : false'>
          </span>
            <el-button v-else class="el-button--line" @click="handleSelect(list,index)" :disabled="list.code == selectedCode">
              {{ list.code == selectedCode ? '选中' : '选用' }}
            </el-button>
          </td>
          <!-- 序号展示 start ==================== -->
          <td class="fix-col" v-if='isShowSerialNumber' style="text-align:center">
            <div>{{index + 1}}</div>
          </td>
          <!-- 序号展示 end ==================== -->
          <td class="fix-col" v-if="operatable">
            <div class="cell" v-if="list.actionMenuList && list.actionMenuList.length">
              <ele-menu :handle-select="handleMenuSelect" :menu-items="list.actionMenuList" :domain-object="list"></ele-menu>
            </div>
          </td>
          <td v-for="(column,index) in columnsData" :class="{ 'fix-col': column.extraParams[0].freeze }" v-if="showColumnRet.indexOf(column.fieldConfigCode) > -1 && checkPms(column)" :key="index">
            <!--{{ getContent(list, column) }}-->
            <template v-if="column.detailLinkVisiable==='true' && editUrl && !isPlatformCode">
              <a href="javascript:;" @click="openWindow(`${editUrl}${editUrl.indexOf('?') !== -1 ? '&' : '?'}code=${list.code}&editable=false`, `${objectName}详情`)" class="blue" :data-link="`${editUrl}${editUrl.indexOf('?') !== -1 ? '&' : '?'}code=${list.code}&editable=false`" :data-title="`${objectName}详情`" :title="`查看${objectName}详情`">
                <ele-cell @tableAction="handletableAction" :field="column" :domainObject="list" :editable="false" :uploadUrl="uploadUrl" :isList="true"><slot></slot></ele-cell>
              </a>
            </template>
            <template v-else-if="column.detailLinkVisiable==='true' && editUrl && isPlatformCode">
              <a href="javascript:;" v-if="list.userCode" @click="openWindow(`${editUrl}${editUrl.indexOf('?') !== -1 ? '&' : '?'}code=${list.code}&userCode=${list.userCode}&editable=false`, `${objectName}详情`)" class="blue" :data-link="`${editUrl}${editUrl.indexOf('?') !== -1 ? '&' : '?'}code=${list.code}&userCode=${list.userCode}&editable=false`" :data-title="`${objectName}详情`" :title="`查看${objectName}详情`">
                <ele-cell @tableAction="handletableAction" :field="column" :domainObject="list" :editable="false" :uploadUrl="uploadUrl" :isList="true"><slot></slot></ele-cell>
              </a>
              <a href="javascript:;" v-else-if="list.orgCode" @click="openWindow(`${editUrl}${editUrl.indexOf('?') !== -1 ? '&' : '?'}code=${list.code}&orgCode=${list.orgCode}&editable=false`, `${objectName}详情`)" class="blue" :data-link="`${editUrl}${editUrl.indexOf('?') !== -1 ? '&' : '?'}code=${list.code}&orgCode=${list.orgCode}&editable=false`" :data-title="`${objectName}详情`" :title="`查看${objectName}详情`">
                <ele-cell @tableAction="handletableAction" :field="column" :domainObject="list" :editable="false" :uploadUrl="uploadUrl" :isList="true"><slot></slot></ele-cell>
              </a>
              <a href="javascript:;" v-else @click="openWindow(`${editUrl}${editUrl.indexOf('?') !== -1 ? '&' : '?'}code=${list.code}&editable=false`, `${objectName}详情`)" class="blue" :data-link="`${editUrl}${editUrl.indexOf('?') !== -1 ? '&' : '?'}code=${list.code}&editable=false`" :data-title="`${objectName}详情`" :title="`查看${objectName}详情`">
                <ele-cell @tableAction="handletableAction" :field="column" :domainObject="list" :editable="false" :uploadUrl="uploadUrl" :isList="true"><slot></slot></ele-cell>
              </a>
            </template>
            <template v-else>
              <ele-progress v-if="column.elementCode === 'progress'" :percent="list[column.fieldConfigCode]" :configData="column"></ele-progress>
              <ele-status v-if="column.elementCode === 'status'" :value="list[column.fieldConfigCode]" :configData="column"></ele-status>
              <ele-cell  v-if="column.elementCode !== 'progress' && column.elementCode !== 'status'" :field="column" :domainObject="list" :editable="list.editable ? list.editable : false" :uploadUrl="uploadUrl" :isList="true"><slot></slot></ele-cell>
              <!-- tip:货源详情中接单记录中 车牌号 与 司机姓名根据状态加Icon 需要在 json 中做配置 -->
              <span v-if='column.extraParams[0].showIcon' v-bind:class="[(list.driverCertStatus == 'authenticated' || list.truckCertStatus == 'authenticated') ? 'icon_certified' : 'icon_uncertified']">V</span>
            </template>
          </td>
        </tr>
        <!--</tr>-->
      </tbody>
      <tfoot v-if="footerEnable && listData.length > 0">
        <ele-total :selectable="selectable" :operatable="operatable" :columnsData="columnsData" :listData="listData" :ignoreCalColumns="ignoreCalColumns"></ele-total>
      </tfoot>
    </table>
  </div>
</template>
<script type="text/ecmascript-6">
// import eleTr from './eleTr.vue';
/* eslint-disable no-new */
/* eslint-disable no-unused-vars */
import eleConfig from '@/components/ele-config/eleConfig.vue';
import eleCell from '@/components/v3/ele-cell';
import eleMenu from '@/components/ele-menu/eleMenu.vue';
import eleProgress from '@/components/ele-progress/eleProgress.vue';
import eleStatus from '@/components/ele-status/eleStatus.vue';
import eleTotal from '@/components/v3/ele-table/eleTotal.vue';
import { urlRedirect, checkPermission } from '../../../../api/Utils';
import TableColumnSet from '@/components/v3/table-column-setting'

const axios = require('axios');

export default {
  data() {
    return {
      showColumnRet: [],
      currentSelectedCode: null,
      actionMenuList: [],
      dialogVisible: false,
      dialogTitle: '',
      customColumns: [],
      dialogFormObject: {},
      fields: [],
      editable: true, // 控制页面状态
      loading: true,
      isList: true,
      batchSelect: false,
      totalNum: [],
      totalUnit: [],
      selectedCache: []
    };
  },
  components: {
    'ele-config': eleConfig,
    'ele-menu': eleMenu,
    'ele-progress': eleProgress,
    'ele-status': eleStatus,
    // 'ele-tr': eleTr,
    'ele-total': eleTotal,
    eleCell,
    TableColumnSet
  },
  props: {
    footerEnable: {
      type: Boolean,
      'default': false
    },
    columnsData: Array,
    listData: Array,
    searchData: Array,
    getData: Function,
    editUrl: '',
    actionUrl: '',
    objectName: '',
    uploadUrl: String,
    isPlatformCode: {
      type: Boolean,
      'default': false
    },
    selectable: {
      type: Boolean,
      'default': true
    },
    multiSelect: {
      type: Boolean,
      'default': true
    },
    selectedCode: {
      type: String,
      'default': null
    },
    selectedCodes: {
      type: Array,
      default () {
        return [];
      }
    },
    ignoreCalColumns: {
      type: Array,
      default () {
        return [];
      }
    },
    operatable: {
      type: Boolean,
      'default': true
    },
    // 是否显示 序号
    isShowSerialNumber: {
      type: Boolean,
      'default': false
    }
  },
  methods: {
    checkPms(field) {
      let result = true;
      if (field.permissionCode) {
        result = checkPermission(field.permissionCode);
      }
      return result;
    },
    handletableAction(actionName, item) {
      this.$emit('listAction', actionName, item)
    },
    isEmpty(val){
      if(val == undefined || val == null) {
        return true;
      }else{
        return false;
      }
    },
    searchSort(column_index,vla){
      let column = this.columnsData[column_index];
      if(vla == 'asc'){ // 点击顺序
          column.extraParams[0].search = column.extraParams[0].search == 'asc'? '': 'asc';
      }
      if(vla == 'desc'){ // 点击顺序
          column.extraParams[0].search = column.extraParams[0].search == 'desc'? '': 'desc';
      }
      this.$emit('searchSort',column.fieldConfigCode,column.extraParams[0].search)
      console.log('colemn。。。',column);
    },
    dataChanged() {
      this.batchSelect = false;
    },
    selectAll() {
      console.log('batchSelect', this.batchSelect);
      this.listData.forEach((item) => {
        this.$set(item, 'checked', this.batchSelect);
      });
    },
    selectRow(row) {
      if (!row.rowDisabled) {
        let ckNum = 0;
        this.$set(row, 'checked', !row.checked);
        this.listData.forEach((item) => {
          if (item.checked) {
            ckNum += 1;
          }
        })
        this.batchSelect = ckNum === this.listData.length;
      } else {
        this.$message({
          type: 'warning',
          message: '该列不可编辑！',
          duration: 3000
        });
      }
    },
    handleMenuSelect(key, menu, model) {
      console.log('handle menu select, key', key, 'menu', menu, 'model', model);
      this.$emit('menuClick', key, menu, model);
    },
    handleSelect(row, index) {
      this.$emit('select', row, index);
    },
    openWindow(url, title) {
      urlRedirect(url, title);
    },
    refresh() {
      window.location.reload();
    },
  },
  created() {
    this.currentSelectedCode = this.selectedCode;
  }
};

</script>
<style lang="scss" rel="stylesheet/scss">
@import "../../../assets/sass/rl-table.scss";

@keyframes icon_animation {
  0%,
  100% {
    transform: rotate( 360deg) scale(1.5, 1.5);
  }
  16.5% {
    transform: rotate( 70deg) scale(0.5, 0.5);
  }
  33% {
    transform: rotate( 120deg) scale(0.8, 0.8);
  }
  49.5% {
    transform: rotate( 180deg) scale(1, 1);
  }
  66% {
    transform: rotate( 240deg) scale(1.2, 1.2);
  }
  82.5% {
    transform: rotate( 290deg) scale(1.4, 1.4);
  }
}

.sear_icon {
  display: inline-block;
  position: relative;
  width: 10px;
  top: -5px;
  i{
    display: inline-block;
    cursor: pointer;
    color:#999;
  }
  .el-icon-caret-bottom{
    position: absolute;
    top:  -2px;
    left: 0px;
  }
  .el-icon-caret-top{
    position: absolute;
    bottom:  -2px;
    left: 0px;
  }
  .light_icon {
    color:#f48400  !important;
  }
}

// 认证的图标
.icon_certified {
  display: inline-block;
  color: #fff;
  width: 16px;
  height: 16px;
  background-color: #f48400;
  border-radius: 50%;
  text-align: center;
  vertical-align: middle;
  line-height: 16px;
  font-family: "Times New Roman";
  // animation: icon_animation 5s alternate infinite;
  // animation-iteration-count:2;
}

.icon_uncertified {
  display: inline-block;
  color: block;
  width: 16px;
  height: 16px;
  background-color: #efefef;
  border-radius: 50%;
  text-align: center;
  vertical-align: middle;
  line-height: 16px;
  font-family: "Times New Roman";
}

.ck-mask {
  &::before {
    content: '';
    position: absolute;
    z-index: 20;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
}

.el-dialog__body {
  .el-form-item__label {
    &:after {
      content: "：";
      display: inline-block;
    }
  }
  .innerblock {
    margin-right: 10px;
  }
  .el-date-editor {
    width: 174px !important;
  }
  .el-select {
    width: 100px !important;
  }
  .form-page {
    .el-row {
      padding: 0 !important;
    }
    .el-col-24 {
      display: none;
    }
  }
}

</style>
