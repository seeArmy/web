/**
* list.vue
* 单车结算列表
* Created by cc on 18/2/3.
*/
<template>
  <div id="settleList">
    <ele-list :selectable="selectable" :operatable="operatable"
              :showImportButton="false" :showDownloadTemplate="false" :showExportButton="true" :needAdd="false"
              @query="query" @ready="query" @action="action" @exportData="exportData"
              :total="total" :loading="loading"
              :list-data="listData"
              ref="eleList"
              :customColumn="customColumn"
              :params="params"
              :needPage="needPage"
              :isAdvanced="isAdvanced"
              :deleteFun="deleteFun"
              :add="add"
              :downloadErrorData="downloadErrorData"
              :downloadTemplate="downloadTemplate"
              :importUrl="importUrl"
              :getColumn="getColumn"
              :getList="getList"
              :exportCsv="exportCsv"
              :exportParams="exportParams"
              :getSearch="getSearch"
              :getAction="getAction"
              :objectName="objectName"
              :editUrl="editUrl"
              :addUrl="addUrl"
              :actionUrl="actionUrl"
              :folder="folder"
              :pop-waybill-truck-map="popWaybillTruckMap">
      <template slot="funArea">
        <el-button type="default" v-check-permission="'settle.generateReportWaybill'"  @click="batchCreateUploadWaybill" v-if="showUpload">生成上报运单</el-button>
        <el-button type="default" @click="batchSettle" v-check-permission="'settle.batchSettleDriver'" v-if="showBatchSettle" :disabled="total === 0">批量结算</el-button>
      </template>
    </ele-list>
    <el-dialog :title="actionDialogTitle" :visible="actionDialogVisible" size="large">
      <!--<waybill-action :id="currentWaybillCode" :action="currentActionCode" ref="waybillAction" :isDialog="true"></waybill-action>-->
      <!--<div id="dialog"></div>-->
      <component ref="waybillAction" :is="currentDialogComponent"
                 @success="dialogSuccess" @fail="dialogFail"
                 :id="currentWaybillCode" :action="currentActionCode" :isDialog="true"></component>
      <div slot="footer" class="dialog-footer">
        <!--<el-button type="primary" @click="editReportFeeForm" v-show="showButton">编 辑</el-button>-->
        <el-button @click="dialogClose">取 消</el-button>
        <el-button type="primary" @click="dialogSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!--<waybill-action :id="currentWaybillCode" :action="currentActionCode" ref="waybillAction" :isDialog="true"></waybill-action>-->
    <el-dialog title="提示" :visible="payConfirmData.isShow" size="small" :before-close ="()=>payConfirmData.isShow=false">
      <div>
        <h1 class="pay-confirm-title" v-html="payConfirmData.msg"/>
        <p class="pay-confirm-content">
          运单号：{{payConfirmData.model.waybillNo}}&emsp;&emsp;&emsp;&emsp;
          <!-- 小票号：{{payConfirmData.model.smallTicket}} -->
        </p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="()=>payConfirmData.isShow=false">取 消</el-button>
        <el-button type="primary" @click="doPayConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  import listLayout from '../components/ele-list/eleList.vue';
  import eleWaybillPopMap from '../components/ele-pop-map/eleWaybillPopMap.vue';
  import { urlRedirect, getParamsFromURL } from '../../api/Utils';
  import {createUploadWaybill, getSettleColumn, settleList, getSettleSearch, deleteSettleList, getAction, exportCsv, add, downloadErrorData, downloadTemplate, executeAction, undoSettle, batchManifestSettle } from '../../api/waybillService';
  import * as ApiConst from '../../api/ApiConst';
  import waybillAction from '../components/ele-action/eleAction.vue';
  import '../components/vueDirectives';

  const actionFilters = ['settle', 'undoSettle', 'waybillSettleDetail'];

  // 单车结算列表分为待结算和已结算，参数从地址栏获取，status为unsettle待结算，settled已结算
  const pageStatus = getParamsFromURL(window.location.search).status,
    custom = {
      objectName: {
        'unsettle': '单车待结算',
        'settled': '单车已结算'
      },
      showButton: {
        'unsettle': false,
        'settled': true
      },
      extraSearchParams: {
        'unsettle': {
          'waybillStatus': 'finish',
          'settleStatus': 'unsettle,settle'
        },
        'settled': {
          'settleStatus': 'pass'
        }
      }
    }

  export default {
    name: 'settleList',
    components: {
      'ele-list': listLayout,
      'ele-waybill-pop-map': eleWaybillPopMap,
      'waybill-action': waybillAction
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
        payConfirmData: {
          isBusy: false,
          isShow: false,
          actionCode: null,
          msg:null,
          model: {
            truckLicenseNo: null,
            waybillNo: null,
            smallTicket: null
          }
        },
        listData: [],
        total: 0,
        loading: true,
        getColumn: getSettleColumn,
        actionDialogTitle: 'Dialog',
        actionDialogVisible: false,
        currentWaybillCode: '',
        currentActionCode: '',
        currentDialogComponent: '',
        getList: settleList,
        getSearch: getSettleSearch,
        objectName: custom.objectName[pageStatus],
        addUrl: '/waybill/settle.html',
        editUrl: '/waybill/settle.html',
        actionUrl: '/waybill/action.html',
        deleteFun: deleteSettleList,
        getAction,
        exportCsv,
        exportParams: null,
        add,
        downloadErrorData,
        importUrl: `${ApiConst.apiWayBillDomain}/import/custom/waybill`,
        popWaybillTruckMap: true,
        downloadTemplate,
        showUpload: custom.showButton[pageStatus],
        defaultSearchParams: custom.extraSearchParams[pageStatus],
        showBatchSettle: pageStatus === 'unsettle',
        folder: 'waybill/settle',
      };
    },
    methods: {
      batchSettle() {
        const data = this.listData,
          batchData = [];
        data.forEach((val) => {
          // 必须已勾选，有发货时间，收货时间，以及结算方式，才可以批量结算
          if (val.checked && val.loadingTime && val.unloadingTime && val.settleMethod) {
            batchData.push(val);
          }
        });
        // 选中有效记录条数
        if (batchData.length > 0) {
          const self = this;
          this.$msgbox({
            title: '提示',
            message: `共选中${batchData.length}条符合的记录，确认批量结算吗？`,
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            beforeClose: (action, instance, done) => {
              if (action === 'confirm') {
                instance.confirmButtonLoading = true;
                instance.confirmButtonText = '执行中...';
                // 批量结算
                let sucNum = 0, errNum = 0;
                for (let i = 0; i < batchData.length; i++) {
                  // 手动设置结算状态为pass
                  batchData[i].settleStatus = 'pass';
                  delete batchData[i].checked; // 删除勾选状态
                  batchManifestSettle(batchData[i], (success, error) => {
                    if (error || success.code !== 200) {
                      errNum += 1;
                    }
                    if (success) {
                      sucNum += 1;
                    }
                    if ((sucNum + errNum) === batchData.length) {
                      const info = `批量结算共${batchData.length}条数据，成功${sucNum}条，失败${errNum}条！`;
                      self.$message({
                        type: 'warning',
                        message: info,
                        duration: 3000
                      });
                      instance.confirmButtonLoading = false;
                      done();
                    }
                  });
                }
              } else {
                done();
              }
            }
          }).then(() => {
            setTimeout(() => {
              self.$refs.eleList.dispatchQueryEvent();
            }, 3000);
          });
        } else {
          this.$message({
            type: 'warning',
            message: '没有选中有效的记录（请至少选中一条运单并且该运单已填写发货时间，收货时间，结算方式）！',
            duration: 3000
          });
          return false;
        }
      },
      onReady() {
        console.log('list is ready now');
      },
      openWindow(url, title) {
        urlRedirect(url, title);
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
              this.deleteList({ code: model.code }, (success, error) => {
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
                    message: `${error}`,
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
      batchCreateUploadWaybill(){
        var checkedArr = this.listData.filter(item=>item.checked);
        if(checkedArr.length==0){
          this.$alert('请选择待生成的运单');
          return;
        }
        this.$msgbox.confirm("确认批量生成上报运单吗？").then(() => {
          this.loading=true;
          var total=checkedArr.length,successed=0,failed=0;
          checkedArr.forEach(item => {
            createUploadWaybill(item.code,(suc,err)=>{
              total--;
              if(err){
                failed++;
              }else{
                successed++;
              }
              if(total==0){
                this.loading=false;
                this.$alert(`生成完成，共成功${successed}条，失败${failed}条。\n`, {
                  callback: () => {
                    window.location.reload();
                  }
                });
              }
            })
          })
        }).catch((err)=>{});
      },
      doPayConfirm() {
        this.payConfirmData.isBusy = true;
        // 撤回结算更换新接口
        if (this.payConfirmData.actionCode === 'undoSettle') {
          undoSettle({ code: this.payConfirmData.model.code }, (success, error) => {
            this.payConfirmData.isBusy = false;
            if (success) {
              this.$message({ type: 'success', message: '操作成功', duration: 3000, onClose:action=>this.$refs.eleList.dispatchQueryEvent() });
            }
            if (error) {
              this.$message({ type: 'warning', message: `${error.content}`, duration: 3000 });
            }
            this.payConfirmData.isShow = false;
          });
        } else {
          executeAction(this.payConfirmData.model.code, this.payConfirmData.actionCode, null, null, (success, error) => {
            this.payConfirmData.isBusy = false;
            if (success) {
              this.$message({ type: 'success', message: '操作成功', duration: 3000, onClose:action=>this.$refs.eleList.dispatchQueryEvent() });
            }
            if (error) {
              this.$message({ type: 'warning', message: `${error}`, duration: 3000 });
            }
            this.payConfirmData.isShow = false;
          });
        }
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
          case 'waybillSettleDetail':
            this.openWindow(`${this.editUrl}?code=${model.code}&editable=false&objectName=${this.objectName}`, `${this.objectName}详情`);
            break;
          case 'remove':
            this.doRemove(model);
            break;
          case 'map':
            this.actionDialogTitle = menu.name;
            this.actionDialogVisible = true;
            this.currentWaybillCode = model.code;
            this.currentActionCode = menu.key;
            this.currentDialogComponent = 'ele-waybill-pop-map';
//            this.openWindow(`/truck/truck-gps.html?truckLicenseNo=${model.truckLicenseNo}&objectName=${this.objectName}`, '车辆轨迹');
            break;
          case 'payConfirm':
            this.payConfirmData.isShow = true;
            this.payConfirmData.model = model;
            this.payConfirmData.actionCode = menu.key;
            this.payConfirmData.msg=`确认<b>${this.payConfirmData.model.truckLicenseNo}</b>已经付款？`;
            break;
          case 'undoSettle':
            this.payConfirmData.isShow = true;
            this.payConfirmData.model = model;
            this.payConfirmData.actionCode = menu.key;
            this.payConfirmData.msg=`确认撤回<b>${this.payConfirmData.model.truckLicenseNo}</b>的结算通过状态？`;
            break;
          case 'undoPayConfirm':
            this.payConfirmData.isShow = true;
            this.payConfirmData.model = model;
            this.payConfirmData.actionCode = menu.key;
            this.payConfirmData.msg=`确认撤回<b>${this.payConfirmData.model.truckLicenseNo}</b>的已付款状态？`;
            break;
          default: {
            const method = menu.action.actionMethod;
            if (method === 'link') {
              const methodParam = menu.action.actionMethodParameter;
              this.openWindow(`${methodParam}${methodParam.indexOf('?') > 0 ? '&' : '?'}code=${model.code}`, `${menu.action.actionName}`);
            } else if (method === 'pop') {
              this.actionDialogTitle = menu.name;
              this.actionDialogVisible = true;
              this.currentWaybillCode = model.code;
              this.currentActionCode = menu.key;
              this.currentDialogComponent = 'waybill-action';
            } else {
              console.error('unknow action', command);
            }
          }
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
      query(params) {
        const newParams = Object.assign(params, this.defaultSearchParams);
        this.exportParams = newParams;
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
          const codeList = [];
          if (success) {
            this.total = success.total;
            success.content.forEach((data) => {
              codeList.push(data.code);
            });
            getAction(codeList, (response) => {
              success.content.forEach((row) => {
                const actionList = [];
                // actionList.push({ key: 'remove', name: '删除' });
                // actionList.push({ key: 'map', name: '查看车辆位置' });
                if (response) {
                  try {
                    response.content[row.code].forEach((action) => {
                      if (actionFilters.find(a => a === action.actionCode)) {
                        console.log(action.actionCode);
                        actionList.push({ key: action.actionCode, name: action.actionName, action });
                      }
                    });
                  } catch (e) {
                    console.error('get action list error', row.code, response.content, e);
                  }
                }
                // actionList.push({ key: 'view', name: '查看详情' });
                row.actionMenuList = actionList;
              });
              self.listData = success.content;
              this.loading = false;
//              self.listData.splice(self.listData.length);
              //console.log('parent.listData', self.listData);
            });
          }
        });
      }
    },
    created() {}
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  .pay-confirm-title{text-align:center;margin-top:40px;font-size:16px;}
  .pay-confirm-title b{color:red;}
  .pay-confirm-content{text-align:center;margin:30px 0px;}
  .dialog-footer{text-align: center}
  // #settleList {
  //   .rl-fix-table {
  //     th:nth-child(11),th:nth-child(12),td:nth-child(11),td:nth-child(12) {
  //       background-color: #fff2b5;
  //     }
  //   }
  // }
</style>

