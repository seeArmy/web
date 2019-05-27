/** * list.vue * 收到的询价 列表 */
<template>
  <div>
    <ele-list :selectable="selectable" :operatable="operatable" :customAdd="true" :customAddName="customAddName" :showImportButton="false" :showDownloadTemplate="false" :showExportButton="true" @query="query" @ready="query" @action="action" @more="more" @exportData="exportData" :autoRefresh="false" :autoRefreshTimer="30" :total="total" :loading="loading" :list-data="listData" ref="eleList" :customColumn="customColumn" :params="params" :needPage="needPage" :isAdvanced="isAdvanced" :add="add" :downloadErrorData="downloadErrorData" :downloadTemplate="downloadTemplate" :importUrl="importUrl" :editUrl="editUrl" :getColumn="getColumn" :getList="getList" :exportCsv="exportCsv" :getSearch="getSearch" :folder="folder" :objectName="objectName" :needAdd='false'>
    </ele-list>
  </div>
</template>
<script type="text/ecmascript-6">
import eleList from '../components/ele-list/eleList.vue';
import { urlRedirect } from '../../api/Utils';
import { getColumnReceivedInquiry as getColumn, listReceivedInquiry as list, getSearchReceivedInquiry as getSearch,  exportCsvReceivedInquiry as exportCsv, add, downloadErrorData, downloadTemplate } from '../../api/QuoteService';
import * as ApiConst from '../../api/ApiConst';

export default {
  name: 'inquiryList',
  components: {
    'ele-list': eleList
  },
  props: {
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
      total: 0,
      loading: true,
      getColumn,
      getList: list,
      getSearch,
      objectName: '收到的询价',
      customAddName: '收到的询价',
      addUrl: '/quote/add.html',
      editUrl: '/quote/add.html',
      listUrl: '/quote/list.html',
      quotedPriceUrl:'/quote/add.html',
      exportCsv,
      add,
      downloadErrorData,
      importUrl: ``,
      downloadTemplate,
      folder: ''
    };
  },
  methods: {
    openWindow(url, title) {
      urlRedirect(url, title);
    },
    more(model) {
      this.openWindow(`${this.listUrl}?objectName=${this.objectName}&${this.toParameterArray(model).join('&')}`, `${this.objectName}列表`);
    },
    toParameterArray(model) {
      const params = [];
      Object.keys(model).forEach((key) => {
        params.push(`${key}=${encodeURIComponent(model[key])}`);
      });
      return params;
    },
    action(command, menu, model) {
      console.log('action command', command, 'menu', menu, 'model', model);
      switch (command) {
          //抢单报价
        case 'quotedPrice':
          this.openWindow(`${this.quotedPriceUrl}?code=${model.code}&objectName=询价单报价&editable=false`,'询价单报价');
          break;
        default:
          break;
      }
    },
    exportData(params) {
      const dataTotal = this.total;
      if (dataTotal > 10000) {
        this.$message({
          type: 'warning',
          message: '导出条数超过10000条限制，不可导出！',
          duration: 3000
        });
      } else {
        this.loading = true;
        params.size = dataTotal;
        exportCsv(params, (success, error) => {
          if (error || success.code !== 200) {
            this.$message({
              type: 'error',
              message: error.content,
              duration: 5000
            });
            this.loading = false;
            return false;
          }
          if (success) {
            this.loading = false;
            window.location.href = success.content.url;
          }
        });
      }
    },
    query(searchParams) {
      console.log('searchParams', searchParams);
      Object.assign(searchParams, this.params);
      console.log('query', searchParams);
      const self = this;
      this.total = 0;
      this.loading = true;
      self.listData = [];
      list(searchParams, (success, error) => {
        if (error) {
          this.$message({
            type: 'error',
            message: error.content,
            duration: 5000
          });
        }
        if (success) {
          this.total = success.total;
          success.content.forEach((data) => {
            const actionList = [];
            // 询价中
            if (data.rfqStatus == 'enquirying') {
              let pendName = data.quoteCount>0 ? '再次报价':'立即报价';
              actionList.push({ key: 'quotedPrice', name: pendName });
            }
            data.actionMenuList = actionList;
          });
          self.listData = success.content;
          this.loading = false;
          console.log('parent.listData', self.listData);
        }
      });
    }
  },
  created() {
  }
};

</script>
<style lang="scss" rel="stylesheet/scss">
</style>
