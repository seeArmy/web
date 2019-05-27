<template>
  <div>
    <ele-list :selectable="selectable" :operatable="operatable"
              @query="query" @ready="query" @action="action"
              :total="total" :loading="loading"
              :list-data="listData"
              ref="eleList"
              :customColumn="customColumn"
              :showExportButton='true'
              :needAdd="false"
              :params="params"
              :needPage="needPage"
              :isAdvanced="isAdvanced"
              :editUrl="editUrl"
              :getColumn="getColumn"
              :getList="getList"
              :getSearch="getSearch"
              :objectName="objectName"
              :showImportButton="false"
              :showDownloadTemplate="false"
              :exportCsv="exportCsv"
              :folder="folder">
    </ele-list>
  </div>
</template>

<script type="text/ecmascript-6">
  import eleList from '../components/ele-list/eleList.vue';
  import { urlRedirect } from '../../api/Utils';
  import { getColumn, list, getSearch,exportCsv } from '../../api/OrgManagementService';

  export default {
    name: 'careList',
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
        'default': function () {
          return {};
        }
      }
    },
    data: () => {
      return {
        exportCsv,
        listData: [],
        total: 0,
        loading: true,
        getColumn,
        getList: list,
        getSearch,
        objectName: '组织',
        editUrl: '/orgManagement/add.html',
        listUrl: '/orgManagement/list.html',
        folder: 'platform/org'
      };
    },
    methods: {
      openWindow(url, title) {
        urlRedirect(url, title);
      },
      action(command, menu, model) {
        console.log('action command', command, 'menu', menu, 'model', model);
        switch (command) {
          case 'add':
            this.openWindow(`${this.editUrl}?objectName=${this.objectName}`, `新建${this.objectName}`);
            break;
          case 'edit':
            this.openWindow(`${this.editUrl}?code=${model.code}&objectName=${this.objectName}`, `编辑${this.objectName}`);
            break;
          default:
            break;
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
              actionList.push({ key: 'edit', name: '编辑' });
              data.actionMenuList = actionList;
            });
            self.listData = success.content;
            this.loading = false;
            //              self.listData.splice(self.listData.length);
            //console.log('parent.listData', self.listData);
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

