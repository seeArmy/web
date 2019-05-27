<template>
  <!-- fix-table-wrap -->
  <div class="fix-table-wrap page_table_inlist">
    <table class="rl-fix-table table-bordered">
      <thead>
        <tr>
          <th class="fix-hd fix-col" v-if="selectable">
            <input type="checkbox" class="ck-all" v-if="multiSelect" v-model="batchSelect" @change="selectAll">
            <label v-else="multiSelect">选择</label>
            <!-- <table-column-set :column-data="columnsData" ref="tablecolumn"  :columnret.sync="showColumnRet" /> -->
          </th>
          <th class="fix-hd fix-col" v-if="isShowSerialNumber">序号</th>
          <th class="fix-hd fix-col" :class="{ 'w50': isShrink }" v-if="operatable">操作</th>
          <th class="fix-hd fix-col w50" v-if="showRadioCheck">操作</th>
          <!-- <th class="fix-hd fix-col">ID</th> -->
          <th v-for="(column, column_index) in columnsData" class="fix-hd" :class="{ 'fix-col': column.extraParams[0].freeze }" :key="column_index" v-if="checkPms(column)">
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
        <ele-tr :isList="true" v-for="(list,index) in listData" :key="index" :data-error="list.error" @emitEleNumber="getEleNumber" @emitEleSelect="getEleSelect" :class="{active : list.checked}" @click.native="selectRow(list)">
          <td class="fix-col" v-if="selectable">
            <span class="ck-mask" v-if="multiSelect">
            <!-- checkboxStatus 这个字段一般是不存在的，所以默认是 null 也就是 默认显示 -->
            <!-- list.checkboxStatus ===FALSE 隐藏 -->
            <input v-if="list.checkboxStatus != 'FALSE' " type="checkbox" class="ck-single" v-model="list.checked" :disabled='selectedCodes.indexOf(list.code)!==-1 ? true : false'>
          </span>
            <el-button v-else="multiSelect" :title='truckConfig(list).title' class="el-button--line" @click="handleSelect(list,index)" :disabled="list.code == selectedCode || truckConfig(list).mark">
              {{ list.code == selectedCode ? '选中' : '选用' }}
            </el-button>
          </td>
          <!-- 序号展示 start ==================== -->
          <td class="fix-col" v-if='isShowSerialNumber' style="text-align:center">
            <div>{{index+1}}</div>
          </td>
          <!-- 序号展示 end ==================== -->
          <td class="fix-col" v-if="operatable">
            <div class="cell" v-if="list.actionMenuList && list.actionMenuList.length">
              <ele-menu :handle-select="handleMenuSelect" :menu-items="list.actionMenuList" :domain-object="list"></ele-menu>
            </div>
          </td>
          <!-- 列表显示单选 -->
          <td class="fix-col" v-if="showRadioCheck">
            <span class="ck-mask"><input type="radio" :checked="list.checked" @click.stop="radioCheck"></span>
          </td>
          <td v-for="(column,index) in columnsData" :class="{ 'fix-col': column.extraParams[0].freeze }" :key="index" v-if="checkPms(column)">
            <!--{{ getContent(list, column) }}-->
            <template v-if="column.detailLinkVisiable==='true' && editUrl && !isPlatformCode">
              <a href="javascript:;" @click="openWindow(`${editUrl}${editUrl.indexOf('?') !== -1 ? '&' : '?'}code=${list.code}&editable=false`, `${objectName}详情`)" class="blue" :data-link="`${editUrl}${editUrl.indexOf('?') !== -1 ? '&' : '?'}code=${list.code}&editable=false`" :data-title="`${objectName}详情`" :title="`查看${objectName}详情`">
                <ele-block :field="column" :domainObject="list" :editable="false" :uploadUrl="uploadUrl" :isList="true"></ele-block>
              </a>
            </template>
            <template v-else-if="column.detailLinkVisiable==='true' && editUrl && isPlatformCode">
              <a href="javascript:;" v-if="list.userCode" @click="openWindow(`${editUrl}${editUrl.indexOf('?') !== -1 ? '&' : '?'}code=${list.code}&userCode=${list.userCode}&editable=false`, `${objectName}详情`)" class="blue" :data-link="`${editUrl}${editUrl.indexOf('?') !== -1 ? '&' : '?'}code=${list.code}&userCode=${list.userCode}&editable=false`" :data-title="`${objectName}详情`" :title="`查看${objectName}详情`">
                <ele-block :field="column" :domainObject="list" :editable="false" :uploadUrl="uploadUrl" :isList="true"></ele-block>
              </a>
              <a href="javascript:;" v-else-if="list.orgCode" @click="openWindow(`${editUrl}${editUrl.indexOf('?') !== -1 ? '&' : '?'}code=${list.code}&orgCode=${list.orgCode}&editable=false`, `${objectName}详情`)" class="blue" :data-link="`${editUrl}${editUrl.indexOf('?') !== -1 ? '&' : '?'}code=${list.code}&orgCode=${list.orgCode}&editable=false`" :data-title="`${objectName}详情`" :title="`查看${objectName}详情`">
                <ele-block :field="column" :domainObject="list" :editable="false" :uploadUrl="uploadUrl" :isList="true"></ele-block>
              </a>
              <a href="javascript:;" v-else @click="openWindow(`${editUrl}${editUrl.indexOf('?') !== -1 ? '&' : '?'}code=${list.code}&editable=false`, `${objectName}详情`)" class="blue" :data-link="`${editUrl}${editUrl.indexOf('?') !== -1 ? '&' : '?'}code=${list.code}&editable=false`" :data-title="`${objectName}详情`" :title="`查看${objectName}详情`">
                <ele-block :field="column" :domainObject="list" :editable="false" :uploadUrl="uploadUrl" :isList="true"></ele-block>
              </a>
            </template>
            <template v-else>
              <ele-block :field="column" :domainObject="list" :editable="list.editable ? list.editable : false" :uploadUrl="uploadUrl" :isList="true">
                <slot></slot>
              </ele-block>
              <!-- tip:货源详情中接单记录中 车牌号 与 司机姓名根据状态加Icon 需要在 json 中做配置 -->
              <span v-if='column.extraParams[0].showIcon' v-bind:class="[(list.driverCertStatus == 'authenticated' || list.truckCertStatus == 'authenticated') ? 'icon_certified' : 'icon_uncertified']">V</span>
            </template>
            <!--<ele-config :domainObject="list" v-for="field in column.extraParams" :editable="false" :field="field"></ele-config>-->
          </td>
        </ele-tr>
        <!--</tr>-->
      </tbody>
      <tfoot v-if="footerEnable && listData.length > 0">
        <ele-total :selectable="selectable" :operatable="operatable" :columnsData="columnsData" :listData="listData" :ignoreCalColumns="ignoreCalColumns"></ele-total>
      </tfoot>
    </table>
  </div>
</template>
<script type="text/ecmascript-6">
import eleTr from './eleTr.vue';
/* eslint-disable no-new */
/* eslint-disable no-unused-vars */
import eleConfig from '../ele-config/eleConfig.vue';
import eleBlock from '../ele-block/eleBlock.vue';
import eleMenu from '../ele-menu/eleMenu.vue';
import eleTotal from './eleTotal.vue';
import { urlRedirect, checkPermission } from '../../../api/Utils';
import TableColumnSet from '../table-column-setting'

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
      totalUnit: []
    };
  },
  components: {
    'ele-config': eleConfig,
    'ele-block': eleBlock,
    'ele-menu': eleMenu,
    'ele-tr': eleTr,
    'ele-total': eleTotal,
    TableColumnSet
  },
  props: {
    //是否开启 选车的时候 筛选规则
    isOpenTruckConfig: {
      type: Boolean,
      'default': false
    },
    footerEnable: {
      type: Boolean,
      'default': false
    },
    isShrink: {
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
    },
    showRadioCheck: {
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
    radioCheck() {
      console.log('radio checked');
    },
    // true => 禁止点击  false 正常状态
    truckConfig(list) {

      let obj_bc = { mark: false, title: '' };

      function isNull(obj) {
        if (obj == null) return true;
        return false
      }
      let
        truckAuthc = JSON.parse(localStorage.getItem('otherappConfig'))['other.dispatch.truck.authc'] === 'TRUE' ? true : false,
        driverAuthc = JSON.parse(localStorage.getItem('otherappConfig'))['other.dispatch.driver.authc'] === 'TRUE' ? true : false,
        objectName = this.objectName;
      if (!list || !this.isOpenTruckConfig) { return obj_bc };

      // truckAuthc = false;
      // driverAuthc = true;

      // 逻辑:
      // truckAuthc true ,主车必须认证(没有主车，默认已经认证) ，挂车必须认证(没有挂车，默认已经认证)
      // driverAuthc true ,主驾必须认证(没有主驾，默认已经认证) ，副驾必须认证(没有副驾，默认已经认证)
      if (!truckAuthc && !driverAuthc) { return obj_bc };

      let mainTruckCode = null,
        trailerTruckCode = null,
        driverCode = null,
        viceDriverCode = null;

      let truckSt1 = true,
        truckSt2 = true,
        dirverSt1 = true,
        dirverSt2 = true;

      if ('车辆' === objectName) {
        mainTruckCode = list.mainTruckCode;
        trailerTruckCode = list.trailerTruckCode;
        driverCode = list.driverCode;
        viceDriverCode = list.viceDriverCode;
        // 若没有 此 车辆 ，挂车，主驾，副驾，默认认为其是认证通过的
        truckSt1 = (isNull(mainTruckCode) || 'authenticated' === list.mainTruckCertStatus) ? true : false;
        truckSt2 = (isNull(trailerTruckCode) || 'authenticated' === list.trailerTruckCertStatus) ? true : false;
        dirverSt1 = (isNull(driverCode) || 'authenticated' === list.driverCertStatus) ? true : false;
        dirverSt2 = (isNull(viceDriverCode) || 'authenticated' === list.viceDriverCertStatus) ? true : false;
      }
      if ('挂车' === objectName) {
        trailerTruckCode = list.code;
        truckSt2 = (isNull(trailerTruckCode) || 'authenticated' === list.certStatus) ? true : false;
      }
      if ('司机' === objectName) {
        driverCode = list.code;
        dirverSt1 = (isNull(driverCode) || 'authenticated' === list.certStatus) ? true : false;
      }
      // 逻辑：
      // 1.左边 只有在 需要认证车辆   并且 主车与挂车 只有有一个 认证未通过   ==> true  禁止点击
      // 2.右边 只有在 需要认证驾驶员 并且 主驾与副驾 只有要一个 认证未通过   ==> true  禁止点击
      obj_bc.mark = (truckAuthc && (!truckSt1 || !truckSt2)) || (driverAuthc && (!dirverSt1 || !dirverSt2));
      // 处理提示信息
      if (truckAuthc && (!truckSt1 || !truckSt2)) {
        if (!truckSt1) { obj_bc.title += '主车未认证 ' }
        if (!truckSt2) { obj_bc.title += '挂车未认证 ' }
      }
      // 司机认证信息
      if (driverAuthc && (!dirverSt1 || !dirverSt2)) {
        if ('司机' === objectName) {
          if (!dirverSt1) { obj_bc.title += '司机未认证 ' }
          if (!dirverSt2) { obj_bc.title += '司机未认证 ' }
        }
        if ('车辆' === objectName || '挂车' === objectName) {
          if (!dirverSt1) { obj_bc.title += '主驾未认证 ' }
          if (!dirverSt2) { obj_bc.title += '副驾未认证 ' }
        }
      }
      if(obj_bc.title){
        obj_bc.title += ' 不可派车';
      }
      return obj_bc;
    },
    isEmpty(val) {
      if (val == undefined || val == null) {
        return true;
      } else {
        return false;
      }
    },
    searchSort(column_index, vla) {
      let column = this.columnsData[column_index];
      if (vla == 'asc') { // 点击顺序
        column.extraParams[0].search = column.extraParams[0].search == 'asc' ? '' : 'asc';
      }
      if (vla == 'desc') { // 点击顺序
        column.extraParams[0].search = column.extraParams[0].search == 'desc' ? '' : 'desc';
      }
      this.$emit('searchSort', column.fieldConfigCode, column.extraParams[0].search)
      console.log('colemn。。。', column);
    },
    getEleNumber(field, num) {
      const obj = {};
      if (!this.totalNum.length) {
        obj[field] = Number(num);
        this.totalNum.push(obj);
      } else {
        const len = this.totalNum.length;
        for (let i = 0; i < len; i += 1) {
          if (field in this.totalNum[i]) {
            this.totalNum[i][field] += Number(num);
            break;
          }
          if (i === len - 1) {
            obj[field] = Number(num);
            this.totalNum.push(obj);
          }
        }
      }
    },
    getEleSelect(field, text) {
      const obj = {};
      if (!this.totalUnit.length) {
        obj[field] = text;
        this.totalUnit.push(obj);
      } else {
        const len = this.totalUnit.length;
        for (let i = 0; i < len; i += 1) {
          if (field in this.totalUnit[i]) {
            break;
          }
          if (i === len - 1) {
            obj[field] = text;
            this.totalUnit.push(obj);
          }
        }
      }
      // console.log('this.totalUnit: ', this.totalUnit);
    },
    dataChanged() {
      this.batchSelect = false;
    },
    selectAll() {
      console.log('batchSelect', this.batchSelect);
      this.listData.forEach((item) => {
        if ('FALSE' != item.checkboxStatus) {
          this.$set(item, 'checked', this.batchSelect);
        }
      });
    },
    selectRow(row) {
      console.log('click row', row.checked);
      if (!row.rowDisabled) {
        // 默认非单选
        if (!this.showRadioCheck) {
          let ckNum = 0;
          if ('FALSE' != row.checkboxStatus) {    // 只有在 checked 配置了显示 才会生效
             this.$set(row, 'checked', !row.checked);
          }
          this.listData.forEach((item) => {
            if (item.checked) {
              ckNum += 1;
            }
          });
          this.batchSelect = ckNum === this.listData.length;
        } else {
          // 单选
          this.listData.forEach((item) => {
            if (item.checked && item.code !== row.code) {
              this.$set(item, 'checked', !item.checked);
            }
          });
          this.$set(row, 'checked', !row.checked);
        }
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
      //      this.selectedCode = row.code;
      this.$emit('select', row, index);
    },
    openWindow(url, title) {
      urlRedirect(url, title);
    },
    // getContent(list, column) {
    //   const extraParams = column.extraParams,
    //     params = JSON.parse(extraParams),
    //     field1 = params.field1;
    //   return list[field1];
    // },

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
@import "../../assets/sass/rl-table.scss";

.page_table_inlist {
  .w50 {
    width: 50px;
  }

  // disable 的时候置灰
  .el-button--line {
    &:disabled {
      color: #bfcbd9 !important;
      border-color: #bfcbd9 !important;
    }
  }
}



@keyframes icon_animation {

  0%,
  100% {
    transform: rotate(360deg) scale(1.5, 1.5);
  }

  16.5% {
    transform: rotate(70deg) scale(0.5, 0.5);
  }

  33% {
    transform: rotate(120deg) scale(0.8, 0.8);
  }

  49.5% {
    transform: rotate(180deg) scale(1, 1);
  }

  66% {
    transform: rotate(240deg) scale(1.2, 1.2);
  }

  82.5% {
    transform: rotate(290deg) scale(1.4, 1.4);
  }
}

.sear_icon {
  display: inline-block;
  position: relative;
  width: 10px;
  top: -5px;

  i {
    display: inline-block;
    cursor: pointer;
    color: #999;
  }

  .el-icon-caret-bottom {
    position: absolute;
    top: -2px;
    left: 0px;
  }

  .el-icon-caret-top {
    position: absolute;
    bottom: -2px;
    left: 0px;
  }

  .light_icon {
    color: #f48400 !important;
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
