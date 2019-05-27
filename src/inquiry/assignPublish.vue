/**
* list.vue
* 指定发布
* Created by cc on 18/7/30.
*/
<template>
  <div :class="{ 'theme-blue': theme }" v-if="editable">
    <el-row :gutter="20" class="selection">
      <el-col :span="14">
        <!-- 待选 -->
        <div class="tobe-select">
          <h3 class="tit">待选（承运商库）</h3>
          <span class="page-refresh" @click="refresh"><i class="ico-refresh"></i>刷新 </span>
          <ele-list :selectable="selectable" :operatable="false"
                    :showImportButton="false" :showDownloadTemplate="false" :showExportButton="false"
                    :extraSearchParamObj="extraSearchParamObj"
                    :miniSearchNum="2"
                    @query="query" @ready="query"
                    :total="total"
                    :list-data="listData"
                    ref="eleList"
                    :customColumn="customColumn"
                    :params="params"
                    :needPage="needPage"
                    :isAdvanced="false"
                    :getColumn="getColumn"
                    :getList="getList"
                    :getSearch="getSearch"
                    :objectName="objectName">
                    <template slot="funArea">
                      <el-button @click="addToSelected">添加到已选</el-button>
                    </template>
          <group slot="group" :tagData="tagData" @filterData="filterData" @getHeight="getHeight"></group>
          </ele-list>
        </div>
      </el-col>
      <el-col :span="10">
        <!-- 已选 -->
        <div class="selected">
          <h3 class="tit">已选<span>(<strong class="org">{{ selectedNumber }}</strong>)</span></h3>
          <selected ref="selected" :selectedData="selectedData" @selectedChanged="selectedChanged"></selected>
        </div>
      </el-col>
    </el-row>
  </div>
  <div v-else>
    <h3 class="tit">已选询价对象：</h3>
    <ul class="pl-list">
      <li v-for="item in orgNameData">{{ item }}</li>
    </ul>
  </div>
</template>
<script type="text/ecmascript-6">
import eleList from '../components/ele-list/eleList.vue';
import group from './group.vue';

import { urlRedirect, getParamsFromURL, checkPermission } from '../../api/Utils';
import { list, getInquiryColumn, getInquirySearch, tagList } from '../../api/PartnerService';

import ApiConst from '../../api/ApiConst';


import selected from './selected.vue';

export default {
  name: 'assignPublish',
  components: {
    'ele-list': eleList,
    group,
    selected
  },
  props: {
    orgNameData: Array,
    editable: Boolean,
    selectable: {
      type: Boolean,
      'default': true
    },
    operatable: {
      type: Boolean,
      'default': true
    },
    customColumn: Array,
    isAdvanced: {
      type: Boolean,
      'default': true
    },
    needPage: {
      type: Boolean,
      'default': true
    },
    params: {
      type: Object,
      'default': function() {
        return {};
      }
    }
  },
  data: () => {
    return {
      listData: [],
      selectedData: [],
      total: 0,
      loading: true,
      getColumn: getInquiryColumn,
      getList: list,
      getSearch: getInquirySearch,
      objectName: '批量派车',
      addUrl: '',
      editUrl: '',
      mode: '',
      tempSelected: [],
      selectedCount: 0,
      selectedNumber: 0,
      theme: true,
      tagData: [],
      extraSearchParamObj: {}
    };
  },
  methods: {
    getHeight() {
      console.log('getHeight now');
      this.$refs.eleList.getHeight();
    },
    filterData(params) {
      console.log('new filter params is', params);
      this.extraSearchParamObj = params;
      setTimeout(() => {
        this.$refs.eleList.dispatchQueryEvent();
      }, 300);
    },
    refresh() {
      this.$refs.eleList.dispatchQueryEvent();
    },
    calTotal() {
      this.selectedNumber = 0;
      this.selectedData.forEach((val) => {
        this.selectedNumber += val.countNumber;
      });
      // console.log('计算出选中条数为', this.selectedNumber);
    },
    selectedChanged(data) {
      // console.log('子组件数据改变，开始同步selectedData数据', data);
      this.selectedData = data;
      // console.log('子组件数据改变，selectedData数据同步为', this.selectedData);
      this.calTotal();
    },
    addToSelected() {
      // console.log('当前的selectedData数据为', this.selectedData);
      this.tempSelected = [];
      this.listData.forEach((val) => {
        if (val.checked) {
          this.selectedCount += 1;
          val.countNumber = 1;
          this.tempSelected.unshift(val);
        }
      });
      // console.log('左侧待选临时选中的数据为', this.tempSelected);
      if (this.selectedCount === 0) {
        this.$message({
          type: 'warning',
          message: `请至少选择一个承运商！`,
          duration: 3000
        });
      } else {
        this.tempSelected.forEach((val) => {
          // 如果当前数据已经存在
          if (this.selectedData.find(v => v.code === val.code)) {
            // console.log('开始循环的selectedData数据为', this.selectedData);
            this.selectedData.forEach((data, index) => {
              if (data.code === val.code) {
                this.$message({
                  type: 'warning',
                  message: `${val.orgName}已经在已选列表中！`,
                  duration: 3000
                });
                // console.log('当前数据已经选中，开始增加条数countNumber+1', val);
                // let dataCopy = JSON.parse(JSON.stringify(data));
                // dataCopy.countNumber += 1;
                // this.$set(this.selectedData, index, dataCopy);
                // console.log('变更后的countNumber+1数据为', data);
                // console.log('变更后的selectedData数据为', this.selectedData);
              }
            });
          } else {
            this.selectedData = [].concat(val).concat(this.selectedData);
          }
          // 计算条数
          this.calTotal();
        });
        // 取消左侧勾选
        this.listData.forEach((val) => {
          if (val.checked) {
            val.checked = false;
          }
        });
        this.$refs.eleList.$refs.table.batchSelect = false;
      }
    },
    openWindow(url, title) {
      urlRedirect(url, title);
    },
    query(searchParams) {
      const self = this;
      this.total = 0;
      this.loading = true;
      self.listData = [];
      Object.assign(searchParams, this.params, {'orgType': '1,2'});
      list(searchParams, (success, error) => {
        this.loading = false;
        if (error) {
          this.$message({
            type: 'error',
            message: error.content,
            duration: 3000
          });
        }
        if (success) {
          this.total = success.total;
          self.listData = success.content;
        }
      });
    }
  },
  beforeCreate() {
  },
  created() {
    tagList((success, error) => {
      if (error) {
        this.$message({
          type: 'error',
          message: error.content,
          duration: 3000
        });
        return false
      }
      if (success) {
        const data = success.content, tempData = [];
        data.forEach((val) => {
          const obj = {
            name: val.tag,
            isActive: false
          };
          tempData.push(obj);
        });
        this.tagData = tempData;
      }
    });
  }
};
</script>

<style lang="scss" rel="stylesheet/scss">
body {
  overflow-x: hidden;
}
.tc {
  text-align: center;
}
.logistics-info {
  line-height: 22px;
  font-size: 14px;
}
.selection {
  margin-top: 20px;
  .tit {
    padding-top: 10px;
    padding-left: 10px;
    font-weight: 700;
    font-size: 14px;

  }
  .el-col-14,.el-col-10 {
    border: solid 1px #ddd;
  }
  .el-col-10 {
    height: 424px;
  }
  #miniSearch {
    .el-form-item {
      margin-right: 0;
    }
    .el-input__inner {
      width: 120px;
      height: 24px;
      border-color: #dadada;
      border-radius: 0;
      &:focus {
        border-color: #f48400;
      }
    }
    .el-button--default {
      display: none;
    }
  }
}
.tobe-select {
  position: relative;
  .page-refresh {
    position: absolute;
    top: 10px;
    right: 0;
  }
  #list {
    height: auto !important;
  }
  .page-header {
    margin-top: 10px;
    padding: 0;
  }
  .fix-table-wrap {
    height: 298px !important;
    max-height: 298px;
  }
}
.selected {
  .tit {
    padding-bottom: 10px;
    border-bottom: solid 1px #e5e9ef;
  }
  .table-opr {
    padding: 10px;
  }
  .rl-fix-table {
    line-height: 22px;
    font-size: 14px;
  }
}
.dispatch-mode {
  padding: 20px;
  font-size: 14px;
  background-color: #f5f5f5;
}
.batch-button {
  width: 200px;
  margin: 40px;
}

@media (max-width: 1366px) {
  .selection {
    #miniSearch {
      .el-input__inner {
        width: 95px;
      }
    }
  }
}

</style>
