<template>
  <div>
    <ele-list :selectable="selectable" :operatable="operatable"
              @query="query" @ready="query" @action="action"
              :total="total" :loading="loading"
              :list-data="listData"
              ref="eleList"
              :customColumn="customColumn"
              :params="params"
              :needPage="needPage"
              :isAdvanced="isAdvanced"
              :getColumn="getColumn"
              :getList="getList"
              :getSearch="getSearch"
              :objectName="objectName"
              :editUrl="editUrl"
              :showImportButton="false"
              :showDownloadTemplate="false"
              :showExportButton="true"
              :exportCsv = 'exportCsv'
              :isShowPageJump='true'
              :needAdd="false">
    </ele-list>
  </div>
</template>

<script type="text/ecmascript-6">
  import eleList from '../components/ele-list/eleList.vue';
  import { getColumn, list, getSearch, blacklist,exportCsv } from '../../api/TruckManagementService';
  import { getParamsFromURL, urlRedirect} from '../../api/Utils';

  const blacklistFlag = getParamsFromURL(window.location.search).blacklistFlag;

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
        getColumn: getColumn,
        getList: list,
        getSearch,
        objectName: '车辆',
        addUrl: '/truckManagement/add.html',
        editUrl: '/truckManagement/add.html',
        listUrl: '/truckManagement/list.html'
      };
    },
    methods: {
      openWindow(url, title) {
        urlRedirect(url, title);
      },
      action(command, menu, model) {
        console.log('action command', command, 'menu', menu, 'model', model);
        switch (command) {
          case 'blacklist':
            this.toBlacklist(model);
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
        Object.assign(searchParams, { blacklistFlag }, this.params);
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
              if (data.blacklistFlag === 1) {
                actionList.push({ key: 'blacklist', name: '移出黑名单' });
              } else {
                actionList.push({ key: 'blacklist', name: '拉入黑名单' });
              }
              data.actionMenuList = actionList;
            });
            self.listData = success.content;
            this.loading = false;
            //              self.listData.splice(self.listData.length);
            //console.log('parent.listData', self.listData);
          }
        });
      },
      toBlacklist(model) {
        const bf = model.blacklistFlag === 1 ? 0 : 1;
        blacklist(model.code, { blacklistFlag: bf }, (success, error) => {
          if (error) {
            this.$message({
              type: 'error',
              message: error.content,
              duration: 5000
            });
          }
          if (success) {
            this.$message({
              type: 'success',
              message: '操作成功',
              duration: 5000
            });
            this.$refs.eleList.dispatchQueryEvent();
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

