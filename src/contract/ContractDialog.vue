<template>
  <ele-dialog ref="dialog" title="合同" @submit="handleDone" @cancel="handleCancel">
    <ele-list ref="list" :selectable="false" :operatable="true" :multiSelect="false"
              :showImportButton="false" :showDownloadTemplate="false"
              :showExportButton="false" :isHide="true" @ready="query" @query="query" @action="handleClick"
               :total="total" :loading="loading" :list-data="listData"
               :needPage="true" :isAdvanced="false"
               :needAdd="false"
               :getColumn="getColumns" :getSearch="getSearch"
               objectName="合同" :folder="folder">
    </ele-list>
  </ele-dialog>
</template>
<script type="text/ecmascript-6">
  import eleDialog from '../components/ele-dialog/eleDialog.vue';
  import eleList from '../components/ele-list/eleList.vue';
  import * as ContractService from '../../api/ContractService';

  export default {
    components: {
      'ele-dialog': eleDialog,
      'ele-list': eleList
    },
    data() {
      return {
        total: 0,
        loading: false,
        params: {},
        listData: [],
        getColumns: ContractService.getColumn,
        getSearch: ContractService.getSearch,
        folder: 'logistics/downloadContract'
      };
    },
    methods: {
      open() {
        this.$refs.dialog.open();
      },
      query(searchParams) {
        const params = Object.assign({"bizEventNo":"downloadContract"}, searchParams);
        this.total = 0;
        this.loading = true;
        this.listData = [];
        ContractService.downloadList(params, (success, error) => {
          this.loading = false;
          // if (error) {
          //   this.$message({
          //     type: 'error',
          //     message: error.content,
          //     duration: 5000
          //   });
          // }
          if (success) {
            this.total = success.result.data.length;
            success.result.data.forEach((row) => {
              row.actionMenuList = [{ key: 'download', name: '下载' }];
            });
            this.listData = success.result.data;
          }
        });
      },
      handleClick(command, menu, model) {
        console.log('download', model);
        const data = Object.assign({}, model);
        delete data.checked;
        data.actionMenuList = null;
        ContractService.addOrUpdate(data, (success, error) => {
          if (error) {
            console.error('add contract error', error);
          } else {
            this.$emit('success', success.content);
          }
        });
      },
      handleDone() {
        this.$refs.dialog.close();
      },
      handleCancel() {
        this.$refs.dialog.close();
      }
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  .el-dialog__body {
    #miniSearch {
      .el-input__inner {
        width: 150px;
      }
    }
  }
</style>
