<template xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <div class="uc-content table1">
    <el-form :inline="true" :model="searchModel" ref="searchModel" class="demo-form-inline">
      <el-row class="search-form">
        <el-col :span="12" :class="searchField.fieldConfigCode" v-for="(searchField, index) in searchFields" :key="searchField.fieldConfigCode">
          <el-form-item :label="searchField.showName">
            <ele-block :field="searchField" :domainObject="searchModel"></ele-block>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="search-button">
        <el-button type="primary" @click="onSubmit"><i class="el-icon-search"></i> 待选内搜索</el-button>
        <el-button @click="resetForm">重置条件</el-button>
        <el-button type="text" @click="showMore">{{ isMini ? '展开查询条件' : '收起查询条件' }}</el-button>
      </div>
    </el-form>
    <div class="list-opr-choose clearfix">
      <div class="hd-opr loc-left fl">
        <el-button type="primary" @click="doSelected" v-if="selectAll" :disabled="btnDisable">添加全部搜索结果到已选运单</el-button>
        <el-button type="primary" @click="doSelected" v-else :disabled="btnDisable">添加到已选运单</el-button>
        <span class="check-all">
            <input type="checkbox" id="selectAllResult" @click="selectAllResult" ref="selectAllCk">
            <label for="selectAllResult">选择本次搜索全部结果</label>
        </span>
      </div>
    </div>
    <v-table ref="eleTable" :selectable="selectable"
             :operatable="false"
             :multiSelect="multiSelect"
             :getData="getData"
             :columnsData="columnsData"
             :listData="listData"
             :footerEnable="false"
             v-loading.fullscreen.lock="loading">
    </v-table>
    <v-page :page="page" :pageSize="pageSize" :total="total" v-on:change="change"></v-page>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  import table from '../../../components/ele-list/eleTable.vue';
  import page from '../../../components/ele-list/elePage.vue';
  import eleBlock from '../../../components/ele-block/eleBlock.vue';

  import { settlePaymentWaitSelectList as settlePayableSelectReceivableWaybillList, settlePayableWaybillColumns, settlePayableWaybillSearch, settlePayableSelectWaybill } from '../../../../api/PlatformSettleBillService';
  // ps : 其实就是 waybillService 里面的list 调用的时候加上 搜索条件 scheduleType=platform waybillStatus=finish settleStatus=pass
  // import { list as settlePayableSelectReceivableWaybillList} from '../../../../api/waybillService';


  import { getParam, adaptHeight, getParamsFromURL } from '../../../../api/Utils';
  import { toggleClass, addClass, removeClass, hasClass } from '../../../../api/classUtil';

  export default {
    components: {
      'v-table': table,
      'v-page': page,
      'ele-block': eleBlock
    },
    props: {
      params: {},
      multiSelect: {
        type: Boolean,
        'default': true
      },
      selectable: {
        type: Boolean,
        'default': true
      }
    },
    data() {
      return {
        leftDistance: '',
        topDistance: '',
        searchFieldsDone: false,
        columnFieldsDone: false,
        selectAll: false,
        columnsData: [],
        searchData: [],
        listData: [],
        pageSize: 10,
        page: 1,
        total: 0,
        searchFields: [],
        miniFields: [],
        allFields: [],
        isMini: true,
        searchModel: {},
        searchParams: {},
        loading: Boolean,
        btnDisable: false
      };
    },
    methods: {
      showMore() {
        this.isMini = !this.isMini;
        this.searchFields = this.isMini ? this.miniFields : this.allFields;
      },
      onSubmit() {
        this.selectAll = false;
        this.getData();
      },
      resetForm() {
        const keyArray = Object.keys(this.searchModel);
        keyArray.forEach((element) => {
          this.searchModel[element] = null;
        });
      },
      change(newPage, newPageSize, type) {
        const tableWrap = document.querySelector('.table1 .fix-table-wrap');
        this.topDistance = tableWrap.scrollTop;
        this.leftDistance = tableWrap.scrollLeft;
        type === 'pageChange' ? (this.page = 1) : (this.page = newPage);
        // this.page = newPage;
        this.pageSize = newPageSize;
        this.getData();
      },
      doSelected() {
        const that = this;
        that.btnDisable = true;
        let params;
        if (that.selectAll) {
          if (!that.total) {
            this.$message({
              type: 'warning',
              message: '没有可以添加的运单！',
              duration: 1000
            });
            that.btnDisable = false;
            return;
          }
          params = that.searchParams;
        } else {
          const selectList = [];
          that.listData.forEach((item) => {
            if (item.checked) {
              selectList.push(item.code);
            }
          });
          if (!selectList.length) {
            this.$message({
              type: 'warning',
              message: '请选择您要添加的运单！',
              duration: 1000
            });
            that.btnDisable = false;
            return;
          }
          params = {
            clientOrgName: that.params.clientOrgName,
            billCode: that.params.billCode,
            codeList: selectList.join(',')
          };
        }
        that.loading = true;

        params.scheduleType='platform';
        params.waybillStatus='finish';
        params.settleStatus='pass';
        settlePayableSelectWaybill(params, (success, error) => {
          if (error) {
            this.$message({
              type: 'error',
              message: `${error.content}`,
              duration: 1000
            });
            that.btnDisable = false;
            that.loading = false;
          }
          if (success) {
            const rows = success.content.rows;
            this.$message({
              type: 'success',
              message: `您已成功添加${rows}条运单到已选运单中。`,
              duration: 1000
            });
            that.btnDisable = false;
            that.loading = false;
            if (that.selectAll) {
              that.selectAll = false;
              that.$refs.selectAllCk.checked = false;
            }
            if (this.$refs.eleTable.batchSelect) {
              this.$refs.eleTable.batchSelect = false;
            }
            this.getData();
            this.$emit('selected');
          }
        });
      },
      selectAllResult(event) {
        if (!this.total) {
          event.target.checked = false;
          return;
        }
        const checked = event.target.checked;
        this.selectAll = checked;
        this.$refs.eleTable.batchSelect = checked;
        this.$refs.eleTable.selectAll();
      },
      resetScrollBar() {
        const tableWrap = document.querySelector('.table1 .fix-table-wrap'),
          fixHd = document.querySelectorAll('.table1 .fix-hd'),
          fixCol = document.querySelectorAll('.table1 .fix-col');
        tableWrap.scrollTop = this.topDistance;
        tableWrap.scrollLeft = this.leftDistance;
        for (let i = 0, len = fixHd.length; i < len; i++) {
          fixHd[i].style.top = `${this.topDistance}px`;
        }
        for (let j = 0, len = fixCol.length; j < len; j++) {
          fixCol[j].style.left = `${this.leftDistance}px`;
        }
      },
      getData() {
        const that = this;
        // 每次查询数据先清空列表数据
        that.listData = [];
        that.loading = true;
        this.paramObj = {
          size: this.pageSize,
          page: this.page
        };
        Object.keys(that.searchModel).forEach((key) => {
          that.searchParams[key] = that.searchModel[key];
        });
        // if(this.params.platformClientOrgCode){
        //   this.paramObj['platformClientOrgCode'] = this.params.platformClientOrgCode;
        // }
        Object.assign(that.searchParams, that.params);
        Object.assign(this.paramObj, that.searchParams);


        this.paramObj.scheduleType='platform';
        this.paramObj.waybillStatus='finish';
        this.paramObj.settleStatus='pass';
        
        settlePayableSelectReceivableWaybillList(this.paramObj, (success, error) => {
          if (error) {
            that.loading = false;
            this.$message({
              type: 'error',
              message: error.content,
              duration: 5000
            });
          }
          if (success) {
            that.listData = success.content;
            if (that.selectAll) {
              that.listData.forEach((item) => {
                item.checked = true;
              });
              this.$refs.eleTable.batchSelect = true;
            } else {
              this.$refs.eleTable.batchSelect = false;
            }
            that.total = success.total;
            this.$nextTick(() => {
              that.loading = false;
              this.resetScrollBar();
            });
          }
        });
      }
    },
    created() {
      // 获取检索区域
      const self = this,
        localStorage = window.localStorage,
        queryParams = getParamsFromURL(window.location.search),
        eleDefine = JSON.parse(localStorage.getItem('eleDefine')),
        eleInfo = JSON.parse(localStorage.getItem('eleInfo'));
      settlePayableWaybillSearch((searchConfig) => {
        if (searchConfig) {
          const paramData = getParam({ data: { content: searchConfig.content } }, eleDefine, eleInfo);
          paramData.field.forEach((field) => {
            field.extraParams.forEach((property) => {
              self.$set(self.searchModel, property.field, queryParams[property.field] ? queryParams[property.field] : null);
            });
          });
          self.allFields = paramData.field;
          // self.miniFields = paramData.field.slice(0, 2);
          self.miniFields = paramData.field.slice(0, 0);
          self.searchFields = self.miniFields;
          self.isMini = true;
        }
        this.searchFieldsDone = true;
      });
      // 获取列名
      settlePayableWaybillColumns((success) => {
        if (success) {
          const resultData = success.content,
            customColumn = this.customColumn,
            newColumns = [];
          if (customColumn && customColumn.length > 0) {
            resultData.forEach((val) => {
              if (customColumn.indexOf(val.fieldConfigCode) > -1) {
                newColumns.push(val);
              }
            });
            const columns = getParam({ data: { content: newColumns } }, eleDefine, eleInfo);
            this.columnsData = columns.field;
            this.columnFieldsDone = true;
          } else {
            const columns = getParam({ data: { content: resultData } }, eleDefine, eleInfo);
            this.columnsData = columns.field;
            this.columnFieldsDone = true;
          }
        }
      });
    },
    mounted() {
      // 重置宽度
      function fixedTable(event) {
        const tableWrap = event.target,
          top = tableWrap.scrollTop,
          left = tableWrap.scrollLeft,
          fixHd = tableWrap.querySelectorAll('.table1 .fix-hd'),
          fixCol = tableWrap.querySelectorAll('.table1 .fix-col'),
          unit = 'px';
        for (let i = 0, len = fixHd.length; i < len; i++) {
          fixHd[i].style.top = top + unit;
        }
        for (let j = 0, len = fixCol.length; j < len; j++) {
          fixCol[j].style.left = left + unit;
        }
      }
      document.querySelectorAll('.table1 .fix-table-wrap').forEach((value) => {
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
.search-form {
  .loadingTime, .unloadingTime {
    width: 50%;
  }
  .el-form-item__label {
    font-size: 13px;
    width: 94px;
    padding-left: 0;
  }
}
.search-button {
  padding: 0 10px 10px;
  text-align: right;
}
</style>
