/**
* list.vue
* 单车结算列表
* Created by cc on 18/2/3.
*/
<template>
  <div id="manifestList">
    <ele-list :selectable="selectable" :operatable="false" :showImportButton="false" :showDownloadTemplate="false" :showExportButton="true" :needAdd="false" @query="query" @ready="query" @action="action" :total="total" :loading="loading" :list-data="listData" ref="eleList" :customColumn="customColumn" :params="params" :needPage="needPage" :isAdvanced="isAdvanced" :importUrl="importUrl" :getColumn="getColumn" :getList="getList" :exportCsv="exportCsv" :getSearch="getSearch" :objectName="objectName" :editUrl="editUrl" :addUrl="addUrl" :actionUrl="actionUrl" :folder="folder">
    </ele-list>
  </div>
</template>
<script type="text/ecmascript-6">
import listLayout from '../components/ele-list/eleList.vue';
import { urlRedirect, getParamsFromURL } from '../../api/Utils';
import { getColumnManifestList, getSearchManifestList, getListManifestList, exportCsvManifestList } from '../../api/waybillService';
import * as ApiConst from '../../api/ApiConst';
import '../components/vueDirectives';


export default {
  name: 'manifestList',
  components: {
    'ele-list': listLayout,
  },
  props: {
    selectable: {
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
      objectName: '货单',
      getColumn: getColumnManifestList,
      getList: getListManifestList,
      getSearch: getSearchManifestList,
      folder: 'waybill/manifestList',
      exportCsv: exportCsvManifestList,
      listData: [],
      total: 0,
      loading: true,
      addUrl: '',
      editUrl: '',
      actionUrl: '',
      importUrl: `${ApiConst.apiWayBillDomain}/import/custom/waybill`,
    };
  },
  methods: {
    openWindow(url, title) {
      urlRedirect(url, title);
    },
    query(params) {
      const newParams = Object.assign(params, {});
      console.log('query', params);
      const self = this;
      this.total = 0;
      this.loading = true;
      this.getList(newParams, (success, error) => {
        if (error) {
          this.$message({
            type: 'error',
            message: error.content,
            duration: 5000
          });
          this.loading = false;
        }
        if (success) {
          this.total = success.total;
          self.listData = success.content;
          this.loading = false;
        }
      });
    }
  },
  created() {}
};

</script>
<style lang="scss" rel="stylesheet/scss">
.pay-confirm-title {
  text-align: center;
  margin-top: 40px;
  font-size: 16px;
}

.pay-confirm-title b {
  color: red;
}

.pay-confirm-content {
  text-align: center;
  margin: 30px 0px;
}

.dialog-footer {
  text-align: center
}

</style>
