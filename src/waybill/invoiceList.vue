<!-- 货单列表 -->
<template>
  <div class="manifest-list clearfix">
    <div class="page-header clearfix">
      <span class="fr">
        <el-button type="primary" @click="saveInvoice" v-if="editable">保存</el-button>
        <el-button type="primary" v-if="editable" @click="addRow">添加</el-button>
        <el-button @click="cancelEdit" v-if="editable">取消</el-button>
        <el-button type="primary" v-if='!editable' @click="startEdit">编辑</el-button>
      </span>
    </div>
    <!-- table start-->
    <div class="fix-table-wrap">
      <table class="rl-fix-table table-bordered">
        <thead>
          <tr>
            <th v-show="editable" class="fix-hd fix-col">操作</th>
            <th v-for="(column, column_index) in columnsData" class="fix-hd" :class="{ 'fix-col': column.extraParams[0].freeze }" :key="column_index">
              {{ column.showName }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(list,index) in listData" :key="index">
            <td v-show="editable" class="fix-col">
              <el-button @click="delRow(index)" >删除</el-button>
            </td>
            <td v-for="(column,index) in columnsData" :class="{ 'fix-col': column.extraParams[0].freeze }" :key="index">
              <ele-block :field="column" :domainObject="list" :editable="editable" :uploadUrl="uploadUrl" :isList="false"></ele-block>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- table end-->
  </div>
</template>
<script type="text/ecmascript-6">
import { getColumnInvoiceList, getListInvoiceList, saveInvoiceList } from '../../api/waybillService';
import eleBlock from '../components/ele-block/eleBlock.vue';
import eleTr from '../components/ele-list/eleTr.vue';
import '../components/vueDirectives';
import * as util from '../../api/Utils';
const axios = require('axios');
export default {
  name: 'invoiceList',
  components: {
    'ele-block': eleBlock,
    'ele-tr': eleTr,
  },
  props: {
    waybillCode: null
  },
  data() {
    return {
      getColumn: getColumnInvoiceList,
      projectName: JSON.parse(localStorage.getItem('appInfo')).projectName || '',
      folder: 'waybill/invoiceList',
      importColumnsData: [],
      uploadUrl: '',
      listJsonFolder: null,
      columnsData: [],
      isEdit: true,
      listData:[],
      editable:false
    };
  },
  methods: {
    // 提交
    saveInvoice(){
      const self = this;
      saveInvoiceList(this.waybillCode, this.listData,(success,error)=>{
        if(success && success.content){
          self.netGetList(() => {
            self.editable = !self.editable;
          });
        }
      })
    },
    addRow(){
      let obj = {};
      this.columnsData.forEach(item=>{
        obj[item.fieldConfigCode] = '';
      });
      this.listData.push(obj);
    },
    delRow(index){
      this.listData.splice(index, 1);
    },
    startEdit(){
      this.editable = !this.editable;
    },
    cancelEdit(){
      this.netGetList(() => {
        this.editable = !this.editable;
      });
    },
    netGetList(cb){
      getListInvoiceList({waybillCode:this.waybillCode},(success,error)=>{
        if(success && success.content){
          this.listData = success.content;
          if (cb) {
            cb();
          }
        }
      })
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
        // this.dispatchReadyEvent();
      } else {
        const columns = getParam({ data: { content: listResultData } }, eleDefine, eleInfo);
        this.columnsData = columns.field;
        // this.dispatchReadyEvent();
      }
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
    this.netGetList();
  },
  mounted() {
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
  }
};

</script>
<style lang="scss" rel="stylesheet/scss">
@import "../assets/sass/rl-table.scss";
.manifest-list {
  .fix-table-wrap {
    border-left: solid 1px #ddd;
  }
  .rl-fix-table {
    font-size: 14px;
    th, td {
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
      min-width: 100px;
    }
  }
}
</style>
