/**
* list.vue
* 货物分类
* Created by zhuyi on 17/7/21.
*/
<template>
  <div>
    <ele-list :selectable="selectable" :operatable="operatable" :multiSelect="multiSelect" :selectedCode="selectedCode"
              :needAdd="true" :showImportButton="false" :showDownloadTemplate="false" :showExportButton="false"
              @query="query" @ready="query" @action="action" @more="more" @exportData="exportData" @select="handleSelect"
              :total="total" :loading="loading"
              :list-data="listData"
              ref="eleList"
              :customColumn="customColumn"
              :params="params"
              :needPage="needPage"
              :isAdvanced="isAdvanced"
              :downloadErrorData="downloadErrorData"
              :downloadTemplate="downloadTemplate"
              :importUrl="importUrl"
              :editUrl="editUrl"
              :getColumn="getColumn"
              :getList="getList"
              :exportCsv="exportCsv"
              :getSearch="getSearch"
              :objectName="objectName">
    </ele-list>
  </div>
</template>

<script type="text/ecmascript-6">
  import eleList from '../../components/ele-list/eleList.vue';
  import { urlRedirect } from '../../../api/Utils';
  import { getColumnGoodsCategory, listGoodsCategory, getSearchGoodsCategory,deletedGoodsCategory } from '../../../api/goodsCategoryService';
  import * as ApiConst from '../../../api/ApiConst';

  export default {
    name: 'RatesList',
    components: {
      'ele-list': eleList
    },
    props: {
      multiSelect: {
        type: Boolean,
        'default': true
      },
      selectedCode: {
        type: String,
        'default': null
      },
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
        selectedData: null,
        listData: [],
        total: 0,
        loading: true,
        list:listGoodsCategory,
        getColumn:getColumnGoodsCategory,
        getList: listGoodsCategory,
        getSearch:getSearchGoodsCategory,
        deleteList:deletedGoodsCategory,
        objectName: '货物分类',
        downloadErrorData: Function,
        downloadTemplate: Function,
        importUrl: `${ApiConst.apiResourceDomain}/import/custom/rates`,
        exportCsv: Function,
        editUrl: '/resourceGoodsCategory/add.html',
        listUrl: '/resourceGoodsCategory/list.html'
      };
    },
    methods: {
    doRemove(model) {
      const self = this;
      this.$msgbox({
        title: '确认',
        message: `确认要删除吗？`,
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = '执行中...';
            this.deleteList({ code: model.code }, (success, error) => {
              if (success) {
                this.$message({
                  type: 'success',
                  message: '删除成功',
                  duration: 1000
                });
                done();
                instance.confirmButtonLoading = false;
              }
              if (error) {
                this.$message({
                  type: 'warning',
                  message: `${error.content}`,
                  duration: 1000
                });
                instance.confirmButtonLoading = false;
                done();
              }
            });
          } else {
            done();
          }
        }
      }).then(() => {
        self.$refs.eleList.dispatchQueryEvent();
      });
    },

      handleSelect(model) {
        this.selectedData = model;
      },
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
          case 'add':
            this.openWindow(`${this.editUrl}?objectName=${this.objectName}`, `新建${this.objectName}`);
            break;
          case 'edit':
            this.openWindow(`${this.editUrl}?code=${model.code}&objectName=${this.objectName}`, `编辑${this.objectName}`);
            break;
          case 'detail':
            this.openWindow(`${this.editUrl}?code=${model.code}&objectName=${this.objectName}&editable=false`, `${this.objectName}详情`);
            break;
          case 'remove':
            this.doRemove(model);
            break;
          default:
            break;
        }
      },
      exportData(params) {
      },
      query(searchParams) {
        console.log('searchParams', searchParams);
        Object.assign(searchParams, this.params);
        console.log('query', searchParams);
        const self = this;
        this.total = 0;
        this.loading = true;
        self.listData = [];
        this.list(searchParams, (success, error) => {
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
              actionList.push({ key: 'remove', name: '删除' });
              data.actionMenuList = actionList;
            });
            self.listData = success.content;
            this.loading = false;
          }
        });
      }
    },
    created() {
      this.$on('submit', (e) => {
        console.log('on submit', e);
        this.$emit('done', true, this.selectedData);
      });
      this.$on('cancel', (e) => {
        console.log('on cancel', e);
      });
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../../assets/sass/rl-fixed-table.min.scss";
  @import "../../assets/sass/base.scss";
</style>
