<!-- 货单列表 -->
<template>
  <div class="ele-manifest-list clearfix">
    <div class="page-header clearfix" v-if="showManifestEdit">
      <span class="fr">
        <el-button type="primary" @click="statusEditable = !statusEditable" v-show="!statusEditable && editable">编辑</el-button>
        <el-button type="primary" @click="submitRecord" v-show="statusEditable && editable">保存</el-button>
        <el-button @click="cancelSubmit" v-show="statusEditable && editable">取消</el-button>
      </span>
    </div>
    <div class="page-header clearfix" v-if="showTopTab && editable && loadingMode === 'multiple' && statusEditable ">
      <span class="fl">
        <el-button @click="addRow" v-if="editable">添加一行</el-button>
        <el-button @click="delBatch" v-if="editable">批量删除</el-button>
      </span>
    </div>
    <!-- table start-->
    <div class="fix-table-wrap">
      <el-form>
        <table class="rl-fix-table table-bordered">
          <thead>
            <tr>
              <!-- left checkbox start    =====================   -->
              <th class="fix-hd fix-col" v-if="editable && selectable && statusEditable">
                <input type="checkbox" class="ck-all" v-model="batchSelect" @change="selectAll">
              </th>
              <!-- left checkbox end       =====================   -->
              <th v-show="editable && operatable" class="fix-hd fix-col">操作</th>
              <th v-for="(column, column_index) in columnsData" class="fix-hd" v-bind:class="column | filterClassTh(column_index)" :key="column_index" :class="{ 'fix-col': column.extraParams[0].freeze }">
                {{ column.showName }}
              </th>
            </tr>
          </thead>
          <tbody>
            <ele-tr :ref="['tr'+index]" v-for="(list,index) in listData" :key="index" :columnsData="listColumnsData[index]" :list="list" :indexMark='index' :selectable="selectable" :operatable="operatable" :isEdit="isEdit" :editable="editable && statusEditable" :editableFields="editableFields" :uploadUrl="uploadUrl" @eleManifestTrMounted='eleManifestTrMounted' @fieldChange='fieldChange' @singleListValueChange="singleListValueChange"></ele-tr>
            <!--             <tr :ref="['tr'+index]" v-for="(list,index) in listData" :key="index">
              <td class="fix-col" v-if="editable && selectable">
                <input type="checkbox" class="ck-single" v-model="list.checked" @click.native="selectRow(list)">
              </td>
              <td v-show="editable && operatable" class="fix-col">
                <el-button @click="delRow(index)">删除</el-button>
              </td>
              <td v-for="(column,index) in columnsData" :class="{ 'fix-col': column.extraParams[0].freeze }" :key="index">
                <ele-block :field="column" :domainObject="list" :editable="isIncludeEditableFields(column.fieldConfigCode)" :uploadUrl="uploadUrl" :isList="false"></ele-block>
              </td>
            </tr> -->
          </tbody>
          <tfoot v-if="footerEnable && listData.length > 0">
            <ele-subtotal :editable='editable && statusEditable' ref='pageSubtotal' :selectable="selectable" :operatable="operatable" :columnsData="columnsData" :listData="listData"></ele-subtotal>
          </tfoot>
        </table>
      </el-form>
    </div>
    <!-- table end-->
  </div>
</template>
<script type="text/ecmascript-6">
import { getColumnInvoiceList, getListInvoiceList, saveInvoiceList } from '../../../api/waybillService';
import eleBlock from '../ele-block/eleBlock.vue';
import eleTr from './eleManifestTr.vue';
import eleSubtotal from '../ele-list/eleSubtotal.vue';
import '../vueDirectives';
import * as util from '../../../api/Utils';
const axios = require('axios');
export default {
  name: 'invoiceList',
  components: {
    'ele-block': eleBlock,
    'ele-tr': eleTr,
    'ele-subtotal': eleSubtotal,
  },
  props: {
    waybillCode: null,
    getColumn: Function, //获取列表的列的名字
    listData: Array,
    listFieldsCheckNumber: Array, //需要校验的数字 传进来
    selectable: { // 默认有勾选框
      type: Boolean,
      'default': true
    },
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
    // 是否显示 删除 按钮
    operatable: {
      type: Boolean,
      'default': false
    },
    isEdit: {
      type: Boolean,
      'default': true
    },
    editable: {
      type: Boolean,
      'default': true
    },
    loadingMode: {
      type: String,
      'default': 'single'
    },
    folder: String,
    editableFields: Array,
    footerEnable: {
      type: Boolean,
      'default': true
    },
    showButtons: { // 显示右侧添加提交编辑按钮
      type: Boolean,
      'default': true
    }
  },
  data() {
    return {
      // getColumn: getColumnInvoiceList,
      projectName: JSON.parse(localStorage.getItem('appInfo')).projectName || '',
      importColumnsData: [],
      uploadUrl: '',
      batchSelect: false,
      listJsonFolder: null,
      columnsData: [],
      eleTrCount: 0,
      listColumnsData: [],
      statusEditable: this.defaultEdit // 默认是否为编辑状态
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
        if (this.$refs['pageSubtotal'] && this.$refs['pageSubtotal'].getTotal) {
          this.$refs['pageSubtotal'].getTotal();
        }
        this.dealWithFields();
        this.$emit('hasValueChange', this.listData);
      },
      deep: true
    },
  },
  methods: {
    // 根据传入的参数，验证 小数位
    checkRuleNumber() {
      let self = this;
      let arrayMsg = [],
        isSucess = true;
      const arrayKeys = [];
      this.listFieldsCheckNumber.forEach(obj => {
        for (let key in obj) {
          arrayKeys.push(key);
        }
      })

      // const reg = /^\d{1,10}\.?\d{0,2}$/;
      if (arrayKeys.length < 1) { return true };
      // 遍历所有的 keys，查看舒服符合  columnsData
      for (let i = 0; i < this.listData.length; i++) {
        let item = this.listData[i];
        arrayKeys.forEach(key => {
          if (Object.keys(item).indexOf(key)) {
            let val = item[key];
            
            let reg = null;
            // 获取 当前传入的 正则
            self.listFieldsCheckNumber.forEach(obj1 => {
              for (let key1 in obj1) {
                  reg =  obj1[key1] ;
              }
            })

            if (val && reg && !reg.test(val)) { // 验证不通过
              isSucess = false;
              const name = self.getFeildNameByField(key);
              if (name) {
                arrayMsg.push(name);
              }
            }
          }
        })
      }
      if (!isSucess) {
        let msg = arrayMsg.length > 0 ? arrayMsg.join() : '';
        msg += ' 请检查货单中填写，必须两位小数';
        util.showMessageUtil('warning', msg, 2000)
      }
      return isSucess;

      // const val = '123456789012345.1234';
      // const reg = /[0-9]{1,10}(\.[0-9]{0,4})$/;
      // if(!reg.test(val)){
      //    util.showMessageUtil('warning', 'cuole', 2000)
      //  return false;
      // }else{
      //    return true;
      // }
    },
    // 通过字段名字 获取 中文名字
    getFeildNameByField(key) {
      if (!key) return null;
      let name = '';
      for (let i = 0; i < this.columnsData.length; i++) {
        let item = this.columnsData[i];

        for (let j = 0; j < item.extraParams.length; j++) {
          let obj = item.extraParams[j];
          if (obj.field === key) {
            name = item.showName;
            break;
          }
        }
        if (name) { break }
      }
      return name;
    },
    dealWithFields() {
      this.listColumnsData = [];
      console.log('dealWithFields ..........');
      for (let i = 0; i < this.listData.length; i++) {
        let fs = JSON.parse(JSON.stringify(this.columnsData));
        fs.forEach((field) => {
          field.extraParams.forEach((f) => {
            if (f.inputKey) {
              const iks = f.inputKey.split(','),
                temp = [];
              iks.forEach((v) => {
                const tk = v.replace('.', `${i}.`);
                temp.push(tk);
              });
              console.log('new iks is', temp);
              f.inputKey = temp.join(',');
            }
            if (f.outputKey) {
              f.outputKey += `${i}`;
            }
          })
        })
        this.listColumnsData.push(fs);
        console.log('this.listColumnsData', this.listColumnsData);
      }
    },
    singleListValueChange(index, list) {
      console.log('list index is', index, 'list is', list);
      this.$emit('singleListValueChange', index, list);
    },
    fieldChange(key, indexMark) {
      // console.log('fieldChange ........',key,indexMark);
      this.$emit('fieldChange', key, indexMark);
    },
    submitRecord() {
      this.$emit('submitRecord');
    },
    cancelSubmit() {
      this.$emit('cancelSubmit');
    },
    eleManifestTrMounted() {
      this.eleTrCount++;
      if (this.listData.length === this.eleTrCount) {
        this.$nextTick(() => {
          this.$emit('eleManifestMounted');
        })
      }
    },
    // #### 组件逻辑 
    // 是否包含传入的数组
    isIncludeEditableFields(field) {
      // console.log('isIncludeEditableFields 111111....',(this.editable && this.editableFields.includes(field)));
      if (this.editableFields && this.editableFields.length > 0) {
        console.log('isIncludeEditableFields ....', (this.editable && this.editableFields.includes(field)), field);
        return this.editable && this.editableFields.includes(field);
      }
      // console.log('isIncludeEditableFields 2222....',(this.editable && this.editableFields.includes(field)));
      return this.editable;
    },
    // 添加一行
    addRow() {
      let obj = {};
      this.columnsData.forEach(field => {
        field.extraParams.forEach(property => {
          if (property.default) {
            this.$set(obj, property.field, property.default);
          } else {
            this.$set(obj, property.field, null);
          }
        })
      })
      this.listData.push(obj);
      // 设置 inputKey 与 outputKey
    },
    // 当数据返回 的时候 有些字段没有，此时无法监听，需要 set 进去
    setColumnsDataMonitor() {
      let self = this;
      let arrayFields = [];
      this.columnsData.forEach(field => {
        field.extraParams.forEach(property => {
          // arrayFields.push(property.field);
          arrayFields.push(property);
        })
      })
      this.listData.forEach(data => {
        arrayFields.forEach(item => {
          let field = item.field;
          let val = item.default || null;
          // 如果没有此属性，那么 需要手动 set 进去
          if (!data.hasOwnProperty(field)) {
            // self.$set(data, field, null);
            self.$set(data, field, val);
          }
        })
      })
    },
    // 批量删除  至少保留一行
    delBatch() {
      // 遍历所有的checked ,去除选中的
      let self = this,
        arrSave = [];
      this.listData.forEach((item, index) => { if (item.checked !== true) { arrSave.push(item) } })
      if (arrSave.length < 1) {
        util.showMessageUtil('warning', '至少保留一行', 2000);
        return;
      }
      for (let i = this.listData.length - 1; i >= 0; i--) {
        let obj = this.listData[i];
        if (obj.hasOwnProperty('checked') && obj.checked == true) {
          this.listData.splice(i, 1)
        }
      }
    },
    // 点击 checkbox  
    selectRow(row) {
      console.log('click row', row.checked);
      if (!row.rowDisabled) {
        let ckNum = 0;
        if ('FALSE' != row.checkboxStatus) { // 只有在 checked 配置了显示 才会生效
          this.$set(row, 'checked', !row.checked);
        }
        this.listData.forEach((item) => {
          if (item.checked) {
            ckNum += 1;
          }
        });
        this.batchSelect = ckNum === this.listData.length;
      } else {
        this.$message({
          type: 'warning',
          message: '该列不可编辑！',
          duration: 3000
        });
      }
    },
    // 点击全选
    selectAll() {
      console.log('batchSelect', this.batchSelect);
      this.listData.forEach((item) => {
        if ('FALSE' != item.checkboxStatus) {
          this.$set(item, 'checked', this.batchSelect);
        }
      });
    },
    // 提交
    saveInvoice() {
      const self = this;
      saveInvoiceList(this.waybillCode, this.listData, (success, error) => {
        if (success && success.content) {
          self.netGetList(() => {
            self.editable = !self.editable;
          });
        }
      })
    },

    delRow(index) {
      this.listData.splice(index, 1);
    },

    startEdit() {
      this.editable = !this.editable;
    },
    cancelEdit() {
      this.editable = !this.editable;
      // this.netGetList(() => {
      //   this.editable = !this.editable;
      // });
    },
    netGetList(cb) {
      getListInvoiceList({ waybillCode: this.waybillCode }, (success, error) => {
        if (success && success.content) {
          this.listData = success.content;
          if (cb) {
            cb();
          }
        }
      })
    },
    dispatchReadyEvent() {
      this.$emit('query');
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
      this.dealWithFields();
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
    // this.netGetList();
  },
  mounted() {

    this.dealWithScroll();
    this.$nextTick(() => {
      this.dealWithFields();
    });
  }
};

</script>
<style lang="scss" rel="stylesheet/scss">
@import "../../assets/sass/base.scss";
@import "../../assets/sass/rl-table.scss";

.ishn {
  .ele-manifest-list {

    // 3/6 将货单中的所有的width 变短 需求
    .complex-control-2 .el-input {
      width: 86px !important;
    }

    .complex-control-2 .el-select {
      // width: 118px !important;
      width: 76px !important;

      .el-input {
        width: 100% !important;
      }
    }

    .el-select {
      width: 76px !important;
    }
  }
}

.ele-manifest-list {

  // 3/6 将货单中的所有的width 变短 需求
  .complex-control-2 .el-input {
    width: 86px !important;
  }

  .complex-control-2 .el-select {
    // width: 118px !important;
    width: 76px !important;

    .el-input {
      width: 100% !important;
    }
  }

  .el-select {
    width: 76px !important;
  }

  // .ishn .complex-control-2 .el-select {
  //   width: 118px !important;
  // }

  // .ishn .el-select {
  //   width: 118px !important;
  // }

  //必填样式
  .style_request {
    &:before {
      content: '*';
      color: red;
    }
  }

  // .el-autocomplete .el-input {
  //   width: 174px !important;
  // }

  .fix-table-wrap {
    border-left: solid 1px #ddd;
    height: auto !important;
  }

  .rl-fix-table {
    font-size: 14px;

    th,
    td {
      padding: 8px 10px;
      line-height: 24px;
    }

    th {
      font-weight: 700;
    }

    .el-form-item {
      margin-bottom: 0;
    }

    .el-form-item__content {
      margin-left: 0 !important;
    }

    .el-input {
      width: 100px;
    }
  }
}

</style>
