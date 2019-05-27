
<template>
  <div>
    <ele-list :selectable="selectable" :operatable="operatable"
              @query="query" @ready="query" @action="action" @more="more" @exportData="exportData"
              :total="total" :loading="loading"
              :list-data="listData"
              ref="eleList"
              :customColumn="customColumn"
              :params="params"
              :needPage="needPage"
              :needMore="needMore"
              :isAdvanced="isAdvanced"
              :importUrl="importUrl"
              :editUrl="editUrl"
              :getColumn="getSourceGoodsInfoColumn"
              :getList="getList"
              :exportCsv="exportSourceGoodsInfoCsv"
              :getSearch="getSourceGoodsInfoSearch"
              :objectName="objectName"
              :showImportButton='false'
              :showDownloadTemplate='false'
              :needAdd='false'
              @exportMyCsv='handleExportMyCsv'
              :showExportButton='false'
              :showexportBtn='true'
              >
    </ele-list>
  </div>
</template>

<script type="text/ecmascript-6">
  import eleList from '../components/ele-list/eleList.vue';
  import { urlRedirect } from '../../api/Utils';
  import { getSourceGoodsInfoColumn, getSourceGoodsInfoSearch, exportSourceGoodsInfoCsv, downloadErrorData, downloadTemplate,getSourceGoodsInfoList } from '../../api/ShipmentService';
  import * as ApiConst from '../../api/ApiConst';

  export default {
    name: 'accidentList',
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
        'default': false
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
      needMore: {
        type: Boolean,
        'default': false
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
        getSourceGoodsInfoColumn,
        getList: getSourceGoodsInfoList,
        getSourceGoodsInfoSearch,
        objectName: '货源信息',
        addUrl: '',
        editUrl: '',
        listUrl: '/shipment/sourcegoodList.html',
        exportSourceGoodsInfoCsv,
        importUrl: ''
      };
    },
    methods: {
      handleExportMyCsv(params){
       let url = `${ApiConst.apiShipmentDomain}/broker/js/export/exportSourceGoodsInfoList?`
        Object.keys(params).forEach((key,index)=>{
           if(index==0){
             url += key +'=' + params[key];
           }else{
             url +='&'+key +'=' + params[key];
           }
        })
        console.log(url)
        window.location.href = url;
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
          message: `确认要删除 ${model.truckLicenseNo} 的 ${this.objectName}记录吗？`,
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
                    duration: 1000
                  });
                  done();
                  instance.confirmButtonLoading = false;
                }
                if (error) {
                  this.$message({
                    type: 'warning',
                    message: `${error}`,
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
          exportSourceGoodsInfoCsv(params, (success, error) => {
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
        this.listData = [];
        getSourceGoodsInfoList(searchParams, (success, error) => {
          if (error) {
            this.$message({
              type: 'error',
              message: error.content,
              duration: 5000
            });
          }
          if (success) {
            this.total = success.content.data.total;
            // success.content.forEach((data) => {
            //   const actionList = [];
            //   actionList.push({ key: 'edit', name: '编辑' });
            //   actionList.push({ key: 'remove', name: '删除' });
            //   data.actionMenuList = actionList;
            // });
            self.listData = success.content.data.dataList;
            this.loading = false;
//              self.listData.splice(self.listData.length);
            //console.log('parent.listData', self.listData);
          }
        });
      }
    },
    created() {

    },
    mounted(){
      let data_width = document.getElementsByClassName('el-date-editor');
      for(let i =0;i<data_width.length;i++){
          data_width[i].style.width ='100%'
      }
    } 
  };
</script>

<style lang="scss" rel="stylesheet/scss">
</style>

