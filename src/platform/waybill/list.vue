/** * list.vue * 运单列表 * Created by zhuyi on 17/7/21. */
<template>
  <div>
    <ele-list :selectable="selectable" :operatable="operatable" :showImportButton="false" :showDownloadTemplate="false" :showExportButton="true" :needAdd="false" @query="query" @ready="query" @action="action" @more="more" @exportData="exportData" :total="total" :loading="loading" :list-data="listData" ref="eleList" :customColumn="customColumn" :params="params" :needPage="needPage" :needMore="needMore" :isAdvanced="isAdvanced" :deleteFun="deleteFun" :add="add" :downloadErrorData="downloadErrorData" :downloadTemplate="downloadTemplate" :importUrl="importUrl" :editUrl="editUrl" :getColumn="getColumn" :getList="getList" :exportCsv="exportCsv" :getSearch="getSearch" :getAction="getAction" :objectName="objectName" :exportParams='exportParams' :folder='folder'>
      <template slot="funArea">
        <el-button v-check-permission="'opr.wuche.complianceCheck'"  @click="batchControl">运单合规确认</el-button>
      </template>

    </ele-list>
    <!-- 合规的弹框 -->
    <el-dialog title="运单合规确认" :visible.sync="dialogControl.visible" class="dialogControl">
      <el-row>
        <el-col :span="24">
          <p class="p_tit">共选择{{dialogControl.num}}条运单，确认运单是否合规？</p>
          <br/>
        </el-col>
        <el-col :span="24" class="col-bottom">
          <el-radio-group v-model="dialogControl.status">
            <el-radio label="yes">合规</el-radio>
            <el-radio label="no">不合规</el-radio>
          </el-radio-group>
        </el-col>
        <el-col :span="24">
          <el-col :span="2">
            备注：
          </el-col>
          <el-col :span="22">
            <el-input type="textarea" v-model="dialogControl.des" placeholder="请输入内容"></el-input>
          </el-col>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogControl.visible = false">取消</el-button>
        <el-button @click="netWorkUpdateComplianceStatus" :disabled="dialogControl.btnDisabled">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script type="text/ecmascript-6">
// import eleList from '../../components/ele-list/eleList.vue';
import eleList from '@/components/v3/ele-table/eleList.vue';
import { urlRedirect } from '../../../api/Utils';
import { getColumn, list, getSearch, deleteList, getAction, executeAction, exportCsv, add, downloadErrorData, downloadTemplate, getWaybillList } from '../../../api/PlatformWaybillService';
import * as SettleBillService from '../../../api/PlatformSettleBillService';
import * as ApiConst from '../../../api/ApiConst';
import { checkPermission } from '../../../api/Utils';
import '../../components/vueDirectives';

const actionExcludeFilter = ['settle', 'undoSettle', 'undoPayConfirm', 'removeWaybill'];
export default {
  name: 'waybillList',
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
    needMore: {
      type: Boolean,
      'default': false
    },
    params: {
      type: Object,
      'default': function() {
        return {};
      }
    },
    //是否 是被订单中引用，是，那么网路请求不一样
    isFormLogistics: {
      type: Boolean,
      'default': false
    },
  },
  data: () => {
    return {
      // 合规的弹框
      dialogControl: {
        visible: false,
        num: 0,
        status: null,
        btnDisabled: false,
        codes: [],
        des: ''
      },
      listData: [],
      total: 0,
      loading: true,
      getColumn,
      actionDialogTitle: 'Dialog',
      actionDialogVisible: false,
      type: 'waybill',
      actionType: 'waybill',
      actionDomain: `${ApiConst.apiWayBillDomain}`,
      actionExecuteFun: executeAction,
      currentWaybillCode: '',
      currentActionCode: '',
      currentDialogComponent: '',
      getList: list,
      getSearch,
      objectName: '委托运单',
      addUrl: '/platform/waybill/add.html',
      editUrl: '/platform/waybill/add.html',
      listUrl: '/platform/waybill/list.html',
      actionUrl: '/platformwaybill/action.html',
      deleteFun: deleteList,
      getAction,
      exportCsv,
      add,
      downloadErrorData,
      importUrl: `${ApiConst.apiWayBillDomain}/import/custom/waybill`,
      popWaybillTruckMap: true,
      permission: true,
      downloadTemplate,
      isMap: '',
      exportParams:null,
      folder: 'platform/waybill',
    };
  },
  methods: {
    batchControl() {
      this.batchCodeList = [];
      //判断
      this.listData.forEach(item => {
        if (item.checked) {
          this.batchCodeList.push(item.code);
        }
      })
      if (this.batchCodeList.length < 1) {
        this.$message({
          type: 'warning',
          message: `请选择要操作的项目`,
          duration: 1000
        });
        return;
      }
      this.dialogControl.num = this.batchCodeList.length;
      this.dialogControl.des = '';
      this.dialogControl.visible = true;
      this.dialogControl.status = null;
    },
    // 合规状态 网络请求
    netWorkUpdateComplianceStatus() {
      if (this.dialogControl.status == 'yes' || this.dialogControl.status == 'no') {
        let numAll = this.batchCodeList.length;
        let numSuc = 0;
        let numFail = 0;
        this.loading = true;
        for (let i = 0; i < numAll; i++) {
          let item = this.batchCodeList[i];
          let Parma = { code: item, complianceStatus: this.dialogControl.status, complianceDescription: this.dialogControl.des };
          SettleBillService.settlePayableWaybillupdateComplianceStatus(Parma, (success, error) => {
            if (error) {
              numFail++;
            }
            if (success) {
              numSuc++
              // that.$refs.eleList.dispatchQueryEvent();
            }
            if (numAll == numSuc + numFail) {
              this.loading = false;
              this.dialogControl.des = '';
              this.dialogControl.visible = false;
              this.dialogControl.status = null;
              this.$message({
                type: 'success',
                message: `共请求了${numAll}个，成功${numSuc}个, 失败${numFail}个`,
                duration: 2000
              });
              window.location.reload();
            }
          });
        }
      }
    },
    openWindow(url, title) {
      urlRedirect(url, title);
    },
    more(model) {
      //        console.log('more', `${this.listUrl}?objectName=${this.objectName}&${this.toParameterArray(model).join('&')}`);
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
        message: `确认要删除${this.objectName} ${model.waybillNo} 吗？`,
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = '执行中...';
            deleteList({ code: model.code }, (success, error) => {
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
    doSubmitSettle(actionCode, actionName, model) {
      const self = this;
      this.$msgbox({
        title: '确认',
        message: `确认要${actionName}吗？`,
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = '执行中...';
            executeAction(model.code, actionCode, null, null, (success, error) => {
              if (success) {
                this.$message({
                  type: 'success',
                  message: '操作成功',
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
    action(command, menu, model) {
      console.log('action command', command, 'menu', menu, 'model', model);
      switch (command) {
        case 'add':
          this.openWindow(`${this.editUrl}?objectName=${this.objectName}`, `新建${this.objectName}`);
          break;
        case 'edit':
          this.openWindow(`${this.editUrl}?code=${model.code}&objectName=${this.objectName}`, `编辑${this.objectName}`);
          break;
        case 'settleDetail':
          this.openWindow(`/waybill/settle.html?code=${model.code}&editable=false`, `单车结算详情`);
          break;
        case 'remove':
          this.doRemove(model);
          break;
        case 'map':
          this.isMap = 'map-dialog';
          this.actionDialogTitle = menu.name;
          this.actionDialogVisible = true;
          this.currentWaybillCode = model.code;
          this.currentActionCode = menu.key;
          this.currentDialogComponent = 'ele-waybill-pop-map';
          //            this.openWindow(`/truck/truck-gps.html?truckLicenseNo=${model.truckLicenseNo}&objectName=${this.objectName}`, '车辆轨迹');
          break;
        case 'loading':
        case 'loadingInput':
          this.$refs.loadingActionDialog.open(model, command, menu.name);
          break;
        case 'unloading':
        case 'unloadingInput':
          this.$refs.loadingActionDialog.open(model, command, menu.name);
          break;
        case 'printDispatchBill':
          this.$refs.printWaybillDialog.open(model, 'waybill', 'dispatchPrintStatus', model.code);
          break;
        case 'cancel':
          this.doSubmitSettle(menu.key, menu.name, model);
          break;
        default:
          {
            console.log('execute method:', model.code, menu);
            const method = menu.action.actionMethod;
            if (method === 'link') {
              const methodParam = menu.action.actionMethodParameter;
              this.openWindow(`${methodParam}${methodParam.indexOf('?') > 0 ? '&' : '?'}code=${model.code}`, `${menu.action.actionName}`);
            } else if (method === 'pop') {
              this.actionDialogTitle = menu.name;
              this.actionDialogVisible = true;
              this.currentWaybillCode = model.code;
              this.currentActionCode = menu.key;
              this.currentDialogComponent = 'ele-action';
            } else {
              console.error('unknow action', command);
            }
          }
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
        getColumn((success) => {
          const paramsObj = {
            params: params,
            configList: success.content
          };
          exportCsv(paramsObj, (success, error) => {
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
        });
      }
    },
    query(searchParams) {
      if (true == this.isFormLogistics) {
        this.getList = getWaybillList;
      }
      console.log('searchParams', searchParams);
      Object.assign(searchParams, this.params);
      // 固定搜索 委托的
      searchParams.scheduleType = 'platform';
      this.exportParams = searchParams;
      const self = this;
      this.total = 0;
      this.loading = true;
      this.listData = [];
      this.getList(searchParams, (success, error) => {
        if (error) {
          this.$message({
            type: 'error',
            message: error.content,
            duration: 5000
          });
        }
        const codeList = [];
        if (success) {
          this.total = success.total;
          success.content.forEach((data) => {
            const actionList = [];
            // 车辆列表新增删除权限控制
            if(data.settleStatus === 'pass'){
              actionList.push({ key: 'settleDetail', name: '单车结算详情' });
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
    this.permission = checkPermission("waybill.add")
  }
};

</script>
<style lang="scss" rel="stylesheet/scss">
.dialogControl {
  p.p_tit{
    text-align: center;
    margin-bottom: 20px;
    margin-top:20px;
  }
  .el-textarea__inner {
    height: 60px !important;
  }
}

.col-bottom {
  margin-bottom: 10px;
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
}

.map-dialog {
  .el-dialog--large {
    top: 5% !important;
    bottom: 5%;
    width: 90%;
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

</style>
