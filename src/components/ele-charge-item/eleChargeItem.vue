<!-- 费用科目列表 -->
<template>
  <div class="ele-charge-item clearfix">
    <div class="page-header clearfix" v-if="domainObject.settleStatus !== 'pass'">
      <span class="fr">
        <el-button type="primary" @click="statusEditable = !statusEditable" v-show="!statusEditable">批量维护</el-button>
        <el-button @click="cancelSubmit" v-show="statusEditable">取消</el-button>
        <el-button type="primary" @click="submitRecord" v-show="statusEditable">保存</el-button>
      </span>
    </div>
    <!-- table start-->
    <div class="fix-table-wrap">
      <el-form>
        <table class="rl-fix-table table-bordered">
          <thead>
            <tr>
              <th class="fix-hd fix-col">
                序号
              </th>
              <th class="fix-hd fix-col">操作</th>
              <th v-for="(column, column_index) in columnsData" class="fix-hd" v-bind:class="column | filterClassTh(column_index)" :key="column_index" :class="{ 'fix-col': column.extraParams[0].freeze }">
                {{ column.showName }}
              </th>
            </tr>
          </thead>
          <tbody v-if="showTrNow">
            <ele-tr ref="tr" v-for="(list, index) in listData" :key="index" :columnsData="listColumnsData[index]" :list="list.domainObject" :indexMark='index' :isEdit="isEdit" :editable="statusEditable" :editableFields="list.editableFields" :hideFields="list.hideFields" :isRoot="list.isRoot" :uploadUrl="uploadUrl" @eleTrMounted='eleTrMounted' @chargeItemSingleListValueChange="chargeItemSingleListValueChange" @chargeAction="handleChargeAction" :domainObject="domainObject"></ele-tr>
          </tbody>
        </table>
      </el-form>
    </div>
    <!-- table end-->
  </div>
</template>
<script type="text/ecmascript-6">
import eleTr from './eleChargeItemTr.vue';

import * as util from '../../../api/Utils';

const axios = require('axios');

export default {
  name: 'chargeItemList',
  components: {
    'ele-tr': eleTr,
  },
  props: {
    domainObject: Object,
    waybillCode: null,
    getColumn: Function, //获取列表的列的名字
    listData: Array,
    uploadUrl: String,
    listFieldsCheckNumber: Array, //需要校验的数字 传进来
    showTopTab: { // 是否显示 上面的 操作 ,默认不显示
      type: Boolean,
      'default': false
    },
    showManifestEdit: { // 是否显示 上面的 编辑 ,默认不显示
      type: Boolean,
      'default': false
    },
    defaultEdit: { // 默认状态为编辑状态
      type: Boolean,
      'default': true
    },
    isEdit: {
      type: Boolean,
      'default': true
    },
    editable: {
      type: Boolean,
      'default': true
    },
    folder: String
  },
  data() {
    return {
      projectName: JSON.parse(localStorage.getItem('appInfo')).projectName || '',
      importColumnsData: [],
      listJsonFolder: null,
      columnsData: [],
      eleTrCount: 0,
      listColumnsData: [],
      statusEditable: this.defaultEdit, // 默认是否为编辑状态
      showTrNow: false
    };
  },
  filters: {
    filterClassTh: function(column, index) {
      let val = '';
      if (column.extraParams.length > 0 && column.extraParams[0].freeze) {
        val += 'fix-col';
      }
      if (column.requiredList === 'TRUE') {
        val += ' style_request';
      }
      return val;
    },
  },
  watch: {
    'listData': {
      handler: function() {
        console.log('deep watch effect, listData changed now.....');
        this.dealWithFields();
      },
      deep: true
    },
  },
  methods: {
    validForSettle() {
      let result = true;
      const tempListData = JSON.parse(JSON.stringify(this.listData));
      for (let i = 0; i < tempListData.length; i++) {
        const obj = tempListData[i].domainObject;
        if (obj.paymentChannel === 'cash' && (obj.chargeItemPaybillStatus === 'ready' || obj.chargeItemPaybillStatus === 'approvePend' || obj.chargeItemPaybillStatus === 'pend' || obj.chargeItemPaybillStatus === 'failed')) {
          this.$message({
            type: 'warning',
            message: '存在未支付完成的单项付款单，请先处理完成!',
            duration: 3000
          });
          return false;
        }
      }
      return result;
    },
    // 循环调用 form 的验证方法
    formValidate(cb) {
      console.log('get ele tr list components is', this.$refs['tr']);
      let count = 0;
      let isSuccess = true;
      for (let i = 0; i < this.listData.length; i++) {
        let ele_tr = this.$refs['tr'][i];
        ele_tr.formValidate(flag => {
          count++;
          if (!flag) {
            isSuccess = false;
          }
          if (count == this.listData.length) {
            cb(isSuccess);
          }
        })
      }
    },
    dealWithFields() {
      this.listColumnsData = [];
      console.log('dealWithFields in charge item..........');
      for (let i = 0; i < this.listData.length; i++) {
        const rule = this.listData[i].checkRule,
          msg = this.listData[i].checkMsg;
        let fs = JSON.parse(JSON.stringify(this.columnsData));
        fs.forEach((field) => {
          if (field.fieldConfigCode == 'chargeAmounts') {
            const f = field.extraParams[0];
            if (rule) {
              this.$set(f, 'checkRule', rule);
              console.log('set rule success');
            }
            if (msg) {
              this.$set(f, 'checkMsg', msg);
              console.log('set msg success');
            }
          }
        });
        this.listColumnsData.push(fs);
        console.log('this charge item listColumnsData is', this.listColumnsData);
      }
      this.showTrNow = true;
    },
    chargeItemSingleListValueChange(index, list) {
      console.log('list index is', index, 'list is', list);
      this.$emit('chargeItemSingleListValueChange', index, list);
    },
    submitRecord() {
      this.$emit('submitChargeRecord');
    },
    cancelSubmit() {
      this.$emit('cancelChargeSubmit');
    },
    eleTrMounted() {
      this.eleTrCount++;
      if (this.listData.length === this.eleTrCount) {
        this.$nextTick(() => {
          this.$emit('eleChargeItemMounted');
        })
      }
    },
    handleChargeAction(action, list, index) {
      this.$emit('chargeAction', action, list, index);
    },
    dispatchReadyEvent() {
      this.$emit('queryChargeItem');
    },
    resolveList(renderData) {
      let getParam = util.getParam;

      const eleDefine = JSON.parse(localStorage.getItem('eleDefine')),
        eleInfo = JSON.parse(localStorage.getItem('eleInfo')),
        listResultData = renderData.data ? (renderData.data.content) : (renderData.content),
        customColumn = this.customColumn,
        newColumns = [],
        resultColumn = {};
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
        const columns = getParam({ data: { content: newColumns } }, eleDefine, eleInfo);
        this.columnsData = columns.field;
        this.dispatchReadyEvent();
      } else {
        const columns = getParam({ data: { content: listResultData } }, eleDefine, eleInfo);
        this.columnsData = columns.field;
        this.dispatchReadyEvent();
      }
      // this.dealWithFields();
    },
    // 处理滚动
    dealWithScroll() {
      // 重置宽度
      function fixedTable(event) {
        const tableWrap = event.target,
          top = tableWrap.scrollTop,
          left = tableWrap.scrollLeft,
          fixHd = tableWrap.querySelectorAll('.fix-hd'),
          fixCol = tableWrap.querySelectorAll('.fix-col'),
          unit = 'px';
        // for (let i = 0, len = fixHd.length; i < len; i++) {
        //   fixHd[i].style.top = top + unit;
        // }
        for (let j = 0, len = fixCol.length; j < len; j++) {
          fixCol[j].style.left = left + unit;
        }
      }
      document.querySelectorAll('.fix-table-wrap').forEach((value) => {
        value.addEventListener('scroll', fixedTable);
      });
    },
    initData() {
      //1.解析 json 字段，可能有自定义的字段
      const self = this,
        eleDefine = JSON.parse(localStorage.getItem('eleDefine')),
        eleInfo = JSON.parse(localStorage.getItem('eleInfo')),
        projectName = this.projectName;
      let listJson = null;
      //检查是否存在自定义的字段
      let markExist = false;
      if (this.projectName && this.folder) {
        let path = `../../static/projects/${this.projectName}/${self.folder}/list_render_info.json`;
        markExist = util.checkFileExist(path);
      }
      if (this.projectName && self.folder && markExist) { //有配置字段
        const folder = self.folder, // 获取配置文件目录名称
          time = (new Date()).getTime(),
          listPath = `../../static/projects/${projectName}/${folder}/list_render_info.json?t=${time}`;

        function listConfig() {
          return axios({
            method: 'get',
            url: listPath,
            headers: { 'Accept': 'application/json' }
          });
        }
        listConfig().then(listConfig => {
          this.listJsonFolder = JSON.parse(JSON.stringify(listConfig.data.content));
          listJson = listConfig;
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
          this.resolveList(listJson);
        });
      } else {
        // 获取列名
        this.getColumn((success) => {
          if (success) {
            if (!this.getImportColumn) {
              console.log('获取列表配置为：', success);
              this.importColumnsData = success.content;
            }
            // 获取列表配置
            this.resolveList(success);
          }
        });
      }
    },
  },
  created() {
    this.initData();
  },
  mounted() {
    this.dealWithScroll();
    // this.$nextTick(() => {
    //   this.dealWithFields();
    // });
  }
};

</script>
<style lang="scss" rel="stylesheet/scss">
@import "../../assets/sass/base.scss";
@import "../../assets/sass/rl-table.scss";
.ele-charge-item {
  .page-header {
    padding-top: 0;
  }
  .fix-table-wrap {
    border-left: solid 1px #ddd;
    th {
      padding: 8px 10px;
      font-weight: 700;
    }
    th:first-child,th:nth-child(2) {
      width: 40px;
      text-align: center;
    }
    th:nth-child(3),td:first-child,td:nth-child(2) {
      text-align: center;
    }
    td:nth-child(3) {
      width: 100px;
      text-align: right;
      padding-right: 50px;
    }
    td:nth-child(6) {
      overflow: visible !important;
    }
  }
  .el-form-item, .el-upload-list--picture-card .el-upload-list__item {
    margin-bottom: 0
  }
  .el-upload-list--picture-card {
    display: inline-block;
    vertical-align: middle;
    height: 36px;
  }
  .el-upload-list--picture-card .el-upload-list__item-actions {
    font-size: 14px;

  }
  .el-upload-list__item-delete {
    float: none !important;
    margin: 0 0 0 5px !important;
  }
  .file-list-item {
    width: 36px;
    height: 36px;
    margin-bottom: 0;
    vertical-align: middle;
  }
  .file-list-item .pre-mask {
    line-height: 38px;
  }
  .el-button.is-disabled, .el-button.is-disabled:focus, .el-button.is-disabled:hover {
    background-color: #eef1f6 !important;
    border-color: #d1dbe5 !important;
    color: #bfcbd9 !important;
  }
}
</style>
