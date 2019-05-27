
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
              :getColumn="getContractColumn"
              :getList="getList"
              :exportCsv="exportContractCsv"
              :getSearch="getContractSearch"
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
  import { getContractColumn, getContractSearch, exportContractCsv, getContractList } from '../../api/ShipmentService';
  import * as ApiConst from '../../api/ApiConst';

  export default {
    name: 'contractList',
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
        getContractColumn,
        getList: getContractList,
        getContractSearch,
        objectName: '合同信息',
        addUrl: '',
        editUrl: '',
        listUrl: '/shipment/vehiclegoodsList.html',
        exportContractCsv,
        importUrl: ''
      };
    },
    methods: {
      handleExportMyCsv(params){
        let url = `${ApiConst.apiShipmentDomain}/broker/js/export/exportContractInfoList?`
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
      toParameterArray(model) {
        const params = [];
        Object.keys(model).forEach((key) => {
          params.push(`${key}=${encodeURIComponent(model[key])}`);
        });
        return params;
      },
      action(command, menu, model) {
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
          exportContractCsv(params, (success, error) => {
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
        getContractList(searchParams, (success, error) => {
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

