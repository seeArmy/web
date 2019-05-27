/**
* list.vue
* 运单列表
* Created by zhuyi on 17/7/21.
*/
<template>
  <div id="clientFreightList">
    <ele-list :selectable="selectable" :operatable="operatable" @query="query" @ready="query" @action="action" @more="more" @exportData="exportData" :total="total" :loading="loading" :list-data="listData" ref="eleList" :customColumn="customColumn" :removeCustomColumn='removeCustomColumn' :params="params" :needPage="needPage" :needMore="needMore" :isAdvanced="isAdvanced"   :importUrl="importUrl" :editUrl="editUrl" :getColumn="getColumn" :getList="getList" :getSearch="getSearch"  :showImportButton="permission && showImportButton" :needAdd="permission" :showCustomBtn='showCustomBtn' :showDownloadTemplate='showDownloadTemplate' :objectName="objectName"  :folder="folder" :showExportButton='false' :needFullSearch='false' :uploadUrl='uploadUrl'>
    </ele-list>
  </div>
</template>
<script type="text/ecmascript-6">
import eleList from '../components/v3/ele-table/eleList.vue';
import { urlRedirect, checkPermission, showMessageUtil } from '../../api/Utils';
import {getColumn,getSearch,getList,remove} from '../../api/insurancePolicyService.';
import * as ApiConst from '../../api/ApiConst';


export default {
  name: 'clientFreightList',
  components: {
    'ele-list': eleList,
  },
  props: {
    selectable: {
      type: Boolean,
      'default': true
    },
    showRecycle: {
      type: Boolean,
      'default': true
    },
    showBatchFixPrice: {
      type: Boolean,
      'default': true
    },
    operatable: {
      type: Boolean,
      'default': true
    },
    removeCustomColumnMark: {
      type: Boolean,
      'default': false
    },
    customColumn: Array,
    // 需要移除的 list 元素
    removeCustomColumn: {
      type: Array,
      'default': function() {
        return [];
      }
    },
    isAdvanced: {
      type: Boolean,
      'default': true
    },
    needPage: {
      type: Boolean,
      'default': true
    },
    showminiSearch: {
      type: Boolean,
      'default': true
    },
    needMore: {
      type: Boolean,
      'default': false
    },
    params: {
      type: Object,
      'default': function() {
        return {};
      }
    }
  },
  computed: {
  },
  data: () => {
    return {
      showDownloadTemplate:false,
      disabledDriverPrice: false,
      dialogVisible: {
        payeeFirst: false,
        modelFirst: {}
      },
      dialogVisiblePrice: {
        visiable: false
      },
      listData: [],
      total: 0,
      loading: true,
      getColumn:getColumn,
      actionDomain: `${ApiConst.apiLogisticsDomain}`,
      currentWaybillCode: '',
      currentActionCode: '',
      currentDialogComponent: '',
      getList:getList,
      getSearch:getSearch,
      objectName: '线下保单',
      addUrl: '/insurancePolicy/insurancePolicyAdd.html',
      editUrl: '/insurancePolicy/insurancePolicyAdd.html',
      recycleUrl: '',
      listUrl: '',
      actionUrl: '',
      importUrl: ``,
      permission: true,
      showImportButton: false,
      folder: '',
      showCustomBtn: false,
      dataOrgManager: null,
      uploadUrl:`${ApiConst.apiLogisticsDomain}`
    };
  },
  methods: {
    openWindow(url, title) {
      urlRedirect(url, title);
    },
    more(model) {
      this.openWindow(`${this.listUrl}?objectName=${this.objectName}&${this.toParameterArray(model).join('&')}`, `${this.objectName}列表`);
    },
    dialogSubmit() {
      this.$refs.waybillAction.execute();
    },
    dialogSuccess() {
      this.dialogClose();
      this.$refs.eleList.dispatchQueryEvent();
    },
    dialogFail() {
      console.log('dialog execute failed');
    },
    dialogClose() {
      this.actionDialogVisible = false;
      this.currentDialogComponent = null;
      this.currentWaybillCode = null;
      this.currentActionCode = null;
    },
    doRemove(model) {
      const self = this;
      this.$msgbox({
        title: '确认',
        message: `确认要删除${this.objectName} ${model.insuranceNo} 吗？`,
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = '执行中...';
            remove({ code: model.code }, (success, error) => {
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
    action(command, menu, model) {
      console.log('action command', command, 'menu', menu, 'model', model);
      switch (command) {
        case 'add':
          this.openWindow(`${this.editUrl}?objectName=${this.objectName}`, `新建${this.objectName}`);
          break;
        case 'edit':
          console.log(`${this.editUrl}?code=${model.code}&objectName=${this.objectName}`, `编辑${this.objectName}`)
           this.openWindow(`${this.editUrl}?code=${model.code}&objectName=${this.objectName}`, `编辑${this.objectName}`);
        break;
          case 'remove':
          this.doRemove(model);
          break;
      }
    },
    refresh() {
      this.$refs.eleList.dispatchQueryEvent();
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
        this.listData = [];
        getList(searchParams, (success, error) => {
          if (error) {
            this.$message({
              type: 'error',
              message: error.content,
              duration: 5000
            });
          }
          if (success) {
            success.content.forEach((item)=>{
              item.actionMenuList =[{key:'edit',name:'编辑'},{key:'remove',name:'删除'}]
            })
            this.total = success.total;
            self.listData = success.content;
            this.loading = false;
          }
        });
    },
 
  },
  mounted() {

  },
  created() {
  }
};

</script>
<style lang="scss" rel="stylesheet/scss">
#rateSection {
  .el-dialog--large {
    width: 90%;
    margin-left: -45% !important;
  }

  .dialog-content-section {
    height: 286px;
    margin: 0;
    background-color: #f5f5f5;
  }

  .el-col-10 {
    height: 286px;
    padding: 10px;
    border-right: solid 1px #ddd;
  }

  .el-col-14 {
    height: 286px;
    padding: 10px;
    background-color: #fff;
  }

  .tit {
    font-weight: 700;
  }

  .text-list {
    margin-top: 20px;

    li {
      margin-bottom: 15px;
    }

    .tl-tit {
      display: inline-block;
      vertical-align: middle;
      width: 80px;
    }

    .tl-cont {
      display: inline-block;
      vertical-align: middle;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .rate-wrap {
    margin: 10px 0;
    padding-bottom: 10px;
    border-bottom: dashed 1px #ddd;
  }

  .rate-list {
    li {
      &:last-child {
        margin-bottom: 0;
      }

      margin-bottom: 20px;
      line-height: 20px;

      .rl-tit {
        float: left;
        margin-left: -80px;
      }

      position: relative;
      padding-left: 80px;

      .tip {
        position: absolute;
        top: 0;
        left: 240px;
        color: #999;
        font-size: 12px;
      }
    }

    .rl-text {
      margin-top: -10px;
    }
  }
}

#clientFreightList {
  //修改弹框样式
  .el-dialog--small{
    width: 40%;
  }
  .el-dialog__body{
    height: 140px;
  }
  .underline{
    border-bottom: 1px dashed #ccc;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }
  .text_center{
    text-align: center;
    padding-top: 30px;
  }
  .check{
    .el-dialog__body{
      .el-textarea{
        width: 80%;
        vertical-align: middle;
      }
    }
  }
  .batchApplicatioa{
    .el-dialog__body{
      .el-textarea{
        width: 80%;
        vertical-align: middle;
      }
    }
  }
  .fix_price_dialog {
    .dia_item {
      .el-input {
        width: 100px !important;
      }
    }
  }

  .el-dialog--large {
    transform: none;
    margin-left: -35%;
  }

  .remark {
    margin-left: 10px;
    margin-top: 30px;

  }

  .ishn .loading-action {
    .el-col-auto .el-form-item__label:before {
      content: '*';
      display: inline-block;
      margin-right: 5px;
      line-height: 22px;
      color: red;
    }
  }

  .show_icon_request {
    .el-form-item__label:before {
      content: '*';
      display: inline-block;
      margin-right: 5px;
      line-height: 22px;
      color: red;
    }
  }

  .txtbox {
    width: auto;
  }

  .remark-txtbox {
    padding: 10px;
    vertical-align: middle;
    width: 553px;
    height: 72px;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
    margin: 0;
  }
}

.recycle-bin {
  margin-left: 8px;
  padding-left: 7px;
  padding-right: 10px;
  opacity: .8;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }
}

.el-dialog__body {
  .complex-control-2 {
    .innerblock {
      width: 110px;
    }
  }

  .form-page .el-row .el-col-12:nth-child(6n),
  .form-page .el-row .el-col-12:nth-child(6n-1) {
    margin-bottom: 0;
    border-bottom: 0;
  }

  .dialog-content-title {
    font-size: 18px;
    padding: 20px;
    text-align: center;
    border-bottom: 1px dashed #ccc;
  }

  .dialog-content-title b {
    color: red
  }

  .dialog-content-section {
    margin: 10px;
  }

  .rate-description .el-textarea__inner {
    width: 90%;
    height: 48px;
  }

  .dialog-content-section label {
    display: inline-block;
    width: 80px;
  }
}

.v-modal {
  z-index: 1000 !important;
}

.payee-page {
  .el-dialog--large {
    position: fixed;
    top: 0 !important;
  }
}

.map-dialog {
  .el-dialog--large {
    top: 5% !important;
    bottom: 5%;
    width: 90%;
    margin-left: -45% !important;
    margin-bottom: 0;
  }

  .pop-map {
    position: absolute;
    top: 57px;
    right: 20px;
    bottom: 55px;
    left: 20px;
  }

  .el-dialog__body {
    max-height: none;
  }

  .el-dialog__footer {
    position: absolute;
    right: 20px;
    bottom: 0;
    left: 20px;
    margin: 0;
    box-sizing: border-box;
  }
}

@media (min-width: 1400px) {
  #rateSection {
    .el-dialog--large {
      width: 70%;
      margin-left: -35% !important;
    }

    .tip {
      left: 300px !important;
    }

  }
}

</style>
