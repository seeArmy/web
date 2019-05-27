<template>
  <div class="page_ele_pop_select">
    <i v-if="configData.showClear === 'TRUE' && editable" @click='clearData'
    class="el-input__icon el-icon-circle-close pop_close"></i>
    <el-button @click="select()" v-if="editable && !buttonText" :disabled="configData.readonly === 'TRUE'" v-show="configData.hideChoose != 'hide' ">选择</el-button>
    <!-- 删除按钮 -->
    <!--     <el-button icon="el-icon-delete" circle @click="deleteSelect()" v-if="editable && !buttonText" :disabled="configData.readonly === 'TRUE'" v-show="configData.showDeleted == 'show' "></el-button> --> 
    <span style="cursor: pointer" class="el-icon-delete"  @click="deleteSelect()" v-if="editable && !buttonText" v-show="configData.showDeleted == 'show' "> </span>
    <el-button @click="select()" v-if="editable && buttonText" :disabled="configData.readonly === 'TRUE'" v-show="configData.hideChoose != 'hide' ">{{ buttonText }}</el-button>
    <ele-dialog ref="dialog" :title="objectName" @submit="handleCancel" @cancel="handleCancel">
      <span class="data-refresh" title="刷新数据" @click="dataRefresh"><i class="ico-refresh"></i></span>
      <el-button v-if="configData.chooseSelf === 'TRUE'" @click="chooseSelf()">直接选择本公司</el-button>
      <component ref="list" :is="listElement" :selectable="true" :operatable="false" :multiSelect="false" :selectedCode="selectedCode" :showImportButton="false" :showDownloadTemplate="false" :showExportButton="false" :isHide="true" @query="query" @select="handleClick" :total="total" :loading="loading" :list-data="listData" :needPage="true" :isAdvanced="true" :needAdd="true" :editUrl="editUrl" :addUrl="addUrl" :getColumn="getColumns" :getSearch="getSearch" :isOpenTruckConfig="configData.isOpenTruckConfig ==='TRUE'" :objectName="objectName" @action="action">
      </component>
    </ele-dialog>
  </div>
</template>
<script type="text/ecmascript-6">
import eleDialog from '../ele-dialog/eleDialog.vue';
//  import eleList from '../ele-list/eleList.vue';
import * as DataSourceService from '../../../api/DataSourceService';
// import { getFixation } from '../../../api/LogisticsService';
import PublicArea from '../../../api/PublicArea';

import { urlRedirect } from '../../../api/Utils';

export default {
  inject: ['eventBus'],
  components: {
    'ele-dialog': eleDialog
  },
  props: {
    configData: Object,
    editable: {
      type: Boolean,
      'default': true
    },
    handleSelect: {
      type: Function,
      'default': null
    },
    domainObject: Object,
    buttonText: String
  },
  data() {
    return {
      listElement: 'eleList',
      selectedCode: null,
      selectedModel: null,
      editUrl: '',
      addUrl: '',
      objectName: '',
      total: 0,
      loading: true,
      params: {},
      listData: []
    };
  },
  methods: {
    init() {
      try {
        const sources = this.configData.datasource.split(','),
          dataSource = DataSourceService[sources[0]];
        this.objectName = dataSource.getObjectName();
        this.addUrl = dataSource.getAddUrl(this.objectName);
        this.editUrl = dataSource.getEditUrl(this.objectName);
      } catch (e) {
        console.error('pop select init error', e, 'config', JSON.stringify(this.configData));
      }
      this.selectedCode = this.domainObject[this.configData.field];
    },
    form() {
      let parent = this.$parent;
      if (parent) {
        while (parent && parent.$options && parent.$options.componentName !== 'eleForm') {
          parent = parent.$parent;
        }
        return parent;
      }
      return null;
    },
    dataRefresh() {
      this.$refs.list.dispatchQueryEvent('fromSearch');
    },
    onRefresh(inputParams) {
      console.log('params', inputParams);
      this.params = Object.assign(this.params, inputParams);
    },
    openWindow(url, title) {
      urlRedirect(url, title);
    },
    action(command, menu, model) {
      console.log('action command is ', command);
      this.openWindow(`${this.editUrl}?objectName=${this.objectName}`, `新建${this.objectName}`);
    },
    query(searchParams) {
      console.log('searchParams', searchParams);
      Object.assign(searchParams, this.params);
      console.log('query1', searchParams);
      this.total = 0;
      this.loading = true;
      this.listData = [];

      // 自定义默认弹窗搜索条件
      // 在字段配置中配置defaultSearch3.（eg:\"defaultSearch3\":\"orgType=2,key=value\"）
      if (this.configData.defaultSearch) {
        const defaultSearchArray = this.configData.defaultSearch.split(',');
        defaultSearchArray.forEach((val) => {
          val = val.replace("@", ",");

          searchParams[val.split('=')[0]] = val.split('=')[1];
        });
      }

      this.getList(searchParams, (success, error) => {
        this.loading = false;
        if (error) {
          this.$message({
            type: 'error',
            message: error.content,
            duration: 5000
          });
        }
        if (success) {
          this.total = success.total;
          this.listData = success.content;
        }
      });
    },
    getList(params, cb) {
      const sources = this.configData.datasource.split(',');
      DataSourceService.getAllListData(sources, params, cb);
    },
    getDetail(type, obj, cb) {
      console.log('time to get detail', type, obj, cb);
      const tp = type || this.configData.datasource;
      DataSourceService.getAllDetailData(tp, obj, cb);
    },
    getColumns(cb) {
      const sources = this.configData.datasource.split(',');
      DataSourceService[sources[0]].getColumns(cb);
    },
    getSearch(cb) {
      const sources = this.configData.datasource.split(',');
      console.log('getSearch 12111111.... ', DataSourceService[sources[0]]);
      DataSourceService[sources[0]].getSearch(cb);
    },
    select() {
      console.log('configData is==========================', this.configData);
      this.$refs.dialog.open();
      this.$nextTick(() => {
        this.$refs.list.dispatchQueryEvent();
        this.$refs.list.$on('submit', this.handleSubmit);
      });
    },
    handleCancel() {
      this.$refs.dialog.close();
    },
    handleSubmit() {
      this.$refs.list.$emit('done', true, this.selectedModel);
    },
    handleClick(model) {



      console.log('select model is =====================', model);
      // return
      this.selectedModel = model;
      const type = this.configData.datasource;
      let paramsObj = {};
      // 人车组织查平台code，默认查code
      switch (type) {
        case 'driver':
          paramsObj = { userCode: model.userCode };
          break;
        case 'truck':
        case 'trailer':
          paramsObj = { truckCode: model.truckCode };
          break;
        case 'partner':
          paramsObj = { orgCode: model.orgCode };
          break;
        default:
          paramsObj = { code: model.code };
          break;
      }
      // 选中列表数据后，去查询详情
      this.getDetail(type, paramsObj, (success) => {
        console.log('查询详情信息为', success);
        if (success) {
          // 详情接口数据填充
          this.handleDone(success);
        } else {
          // 默认列表数据填充
          this.handleDone(model);
        }
      });
      this.$refs.dialog.close();
    },
    // 清除数据
    clearData(){
      const parent = this.$parent.$parent;
      parent.$children.forEach(ch=>{
        let field = ch.field.field;
        this.domainObject[field] = '';
      })
    },
    chooseSelf() {
      const orgInfo = JSON.parse(localStorage.getItem('orgInfo')).content,
        model = {
          code: orgInfo.code,
          orgName: orgInfo.orgName,
          orgCode: orgInfo.code,
          settleConfigValue1: orgInfo.settleConfigValue1 || '',
          settleConfigUnitCode1: orgInfo.settleConfigUnitCode1 || '',
          settleConfigValue2: orgInfo.settleConfigValue2 || '',
          settleConfigUnitCode2: orgInfo.settleConfigUnitCode2 || '',
          settleConfigValue3: orgInfo.settleConfigValue3 || '',
          settleConfigUnitCode3: orgInfo.settleConfigUnitCode3 || '',
          orgExternalNo: orgInfo.orgExternalNo || '' // 外部编码
        };
      // 线路中 选择自己 字段配置
      if (orgInfo.orgFullName) {
        model.linkmanFullName = orgInfo.orgFullName;
      }
      if (orgInfo.linkmanFullName) {
        model.linkmanFullName = orgInfo.linkmanFullName;
      }
      if (orgInfo.linkmanPhone) {
        model.linkmanPhone = orgInfo.linkmanPhone;
      }
      if (orgInfo.address) {
        model.address = orgInfo.address;
      }
      if (orgInfo.province) {
        model.province = orgInfo.province;
      }
      if (orgInfo.city) {
        model.city = orgInfo.city;
      }
      if (orgInfo.county) {
        model.county = orgInfo.county;
      }
      // 选择本公司直接选择，不反查详情
      this.handleDone(model);
      this.$refs.dialog.close();
    },
    deleteSelect() {

      let self = this;

      console.log('deleteSelect ...', this.$parent.$parent.$children);
      let listCh = this.$parent.$parent.$children;
      listCh.forEach(item => {
        let key = item['field']['field'];
        self.$set(self.domainObject, key, '');
      })
    },
    onSelect(model) {
      this.handleDone(model);
    },
    onSelectCode(params) {
      console.log('pop select', params);
      if (params) {
        const queryParams = Object.assign({}, params);
        queryParams.size = 10;
        this.getList(queryParams, (success) => {
          console.log('pop select', params, success);
          if (success && success.content && success.total) {
            const model = success.content[0];
            this.handleClick(model);
          }
        });
      }
    },
    handleDone(model) {
      if (model) {
        if (this.handleSelect) {
          this.handleSelect(model);
        } else {
          this.domainObject[this.configData.field] = model.code;
          this.selectedCode = this.domainObject[this.configData.field];
          if (this.configData.outputKey) {
            const outputKey = this.configData.outputKey;
            console.log('output', outputKey, 'value', model);
            PublicArea.set(outputKey, model);
            this.$emit('setOutputKeyEvent', outputKey, model)
          }
        }
      }
      // console.log('kankan this ...',this);
      this.$emit('change', model);
    }
  },
  beforeCreate() {
    /* eslint-disable global-require */
    this.$options.components.eleList = require('../ele-list/eleList.vue');
  },
  mounted() {
    console.log('1111111111111111', this.isList, this.eventBus);
    if (!this.isList) {
      console.log('2222222222222222', this.isList, this.eventBus);
      if (this.eventBus) {
        console.log('3333333333333333', this.isList, this.eventBus);
        this.eventBus.$emit('eleMounted', this);
      }
    }
  },
  created() {
    if (!this.isList) {
      if (this.eventBus) {
        this.eventBus.$emit('eleCreated', this);
      }
      if (this.configData.event && this.configData.event !== '' && this.eventBus) {
        let event = this.configData.event.replace(new RegExp('current', 'g'), '_ele');
        event = event.replace(new RegExp('rns\\[', 'g'), '_form.dispatchEvent(');
        event = event.replace(new RegExp('\\]\\.\\$emit\\(', 'g'), ', ');
        //        console.log('field', this.configData.field, 'pop select event', event);
        try {
          /* eslint-disable no-new-func */
          const listenerDefine = new Function('_ele', '_form', event);
          listenerDefine(this, this.eventBus);
        } catch (e) {
          console.error('ele-pop-select bind event failed', JSON.stringify(this.configData), 'error', e);
        }
      }
      this.$on('refresh', this.onRefresh);
      this.$on('select', this.onSelect);
      this.$on('selectCode', this.onSelectCode);
    }
  }
};

</script>
<style lang="scss" rel="stylesheet/scss">
.page_ele_pop_select {
  position: relative;
  .pop_close {
    position: absolute !important;
    left: -40px !important;
    top: 0px !important;
    width: 20px;
    z-index: 1000;
    cursor: pointer;
  }
  .data-refresh {
    position: absolute;
    top: 14px;
    right: 48px;
    opacity: .7;
    cursor: pointer;
    &:hover {
      opacity: 1
    }
  }
}

.theme-blue {
  .page_ele_pop_select {
    #miniSearch {
      .el-input {
        width: 120px !important;
      }

    }

  }

}


.el-dialog__body {
  .fix-table-wrap {
    border-left: solid 1px #dadada !important;

    .rl-fix-table {
      margin: -1px 0 0 -1px !important;
    }
  }
}

</style>
