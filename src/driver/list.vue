/**
* list.vue
* 司机列表
* Created by zhuyi on 17/7/21.
*/
<template>
  <!-- 司机列表页面 -->
  <div>
    <ele-list :selectable="selectable" :operatable="operatable"
              @query="query" @ready="query" @action="action" @more="more" @exportData="exportData"
              :extraSearchParamObj="extraSearchParamObj"
              :total="total" :loading="loading"
              :list-data="listData"
              ref="eleList"
              :customColumn="customColumn"
              :params="params"
              :needPage="needPage"
              :isAdvanced="isAdvanced"
              :isPlatformCode="isPlatformCode"
              :deleteFun="deleteFun"
              :add="add"
              :downloadErrorData="downloadErrorData"
              :downloadTemplate="downloadTemplate"
              :importUrl="importUrl"
              :editUrl="editUrl"
              :getColumn="getColumn"
              :getList="getList"
              :exportCsv="exportCsv"
              :getSearch="getSearch"
              :getImportColumn="getImportColumn"
              :folder="folder"
              :isShowPageJump='true'
              :objectName="objectName">
      <group slot="group" :tagData="tagData" @filterData="filterData" @getHeight="getHeight" :addFun="addTag" :editFun="editTag" :deleteFun="deleteTag"></group>
    </ele-list>
  </div>
</template>

<script type="text/ecmascript-6">
  import eleList from '../components/ele-list/eleList.vue';
  import group from './group.vue';
  import { urlRedirect, checkPermission } from '../../api/Utils';
  import { getColumn, list, getSearch, deleted, exportCsv, add, downloadErrorData, downloadTemplate, getColumnDetail, tagList, addTag, editTag, deleteTag } from '../../api/DriverService';
  import * as ApiConst from '../../api/ApiConst';

  export default {
    name: 'driverList',
    components: {
      'ele-list': eleList,
      group
    },
    props: {
      selectable: {
        type: Boolean,
        'default': true
      },
      isPlatformCode: {
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
        listData: [],
        total: 0,
        loading: true,
        getColumn,
        getList: list,
        getSearch,
        objectName: '司机',
        addUrl: '/driver/add.html',
        editUrl: '/driver/add.html',
        listUrl: '/driver/list.html',
        deleteFun: deleted,
        exportCsv,
        add,
        downloadErrorData,
        importUrl: `${ApiConst.apiPersonDomain}/import/custom/driver`,
        downloadTemplate,
        getImportColumn: getColumnDetail,
        addTag,
        editTag,
        deleteTag,
        folder: 'person/driver',
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
      openWindow(url, title) {
        urlRedirect(url, title);
      },
      more(model) {
//        console.log('more', `${this.listUrl}?objectName=${this.objectName}&${this.toParameterArray(model).join('&')}`);
        this.openWindow(`${this.listUrl}?objectName=${this.objectName}&${this.toParameterArray(model).join('&')}`, `${this.objectName}列表`);
      },
      doRemove(model) {
        const self = this;
        this.$msgbox({
          title: '确认',
          message: `确认要删除${this.objectName} ${model.fullName} 吗？`,
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '执行中...';
              deleted({ code: model.code }, (success, error) => {
                if (success) {
                  this.$message({
                    type: 'success',
                    message: '删除成功',
                    duration: 3000
                  });
                  done();
                  instance.confirmButtonLoading = false;
                }
                if (error) {
                  this.$message({
                    type: 'warning',
                    message: `${error.content}`,
                    duration: 3000
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
          case 'remove':
            this.doRemove(model);
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
              actionList.push({ key: 'edit', name: '编辑' });
              // 司机列表新增删除权限控制
              if (checkPermission("driver.delete")) {
                actionList.push({ key: 'remove', name: '删除' });
              }
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
</style>

