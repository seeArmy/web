/**
* list.vue
* 运单列表 外包
* Created by zhuyi on 17/7/21.
*/
<template>
  <div id="waybillList">
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
              :getAction="getAction"
              :showImportButton="false"
              :needAdd="false"
              :showDownloadTemplate='false'
              :objectName="objectName"
              :folder="folder">
    <span slot="topRightFun" class="recycle-bin" @click="recycleList">
      <i class="el-icon-delete2"></i> 回收站
    </span>
      <span slot="funArea">
                <el-button v-if="showBatchFixPrice" v-check-permission="'outsourcingWaybill.updatePrice'" @click="batchFixPrice">批量修改运价</el-button>
      </span>
    </ele-list>
    <el-dialog :title="actionDialogTitle" :visible.sync="actionDialogVisible" size="large" :class="isMap" v-if="actionDialogVisible">
      <component ref="waybillAction" :is="currentDialogComponent"
                 @success="dialogSuccess" @fail="dialogFail" @close="dialogClose"
                 :type="type" :actionType="actionType" :actionDomain="actionDomain"
                 :id="currentWaybillCode" :action="currentActionCode" :actionExecuteFun="actionExecuteFun"
                 :isDialog="true"></component>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogClose">取 消</el-button>
        <el-button type="primary" @click="dialogSubmit">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 批量修改客户运价的的弹框 start======================================  -->
    <el-dialog title="批量修改运价" :visible.sync="dialogVisiblePrice.visiable" size="small" class='fix_price_dialog' @close="cancelFixPrice">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="客户运价" class='dia_item'>
          <el-input type='number' v-model="modelFixPrice.domainObject.clientFreightPrice" placeholder="请输入客户运价"></el-input>
        </el-form-item>
      </el-form>
      <div class="remark">备注：运价不填时，默  认不修改</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelFixPrice">取 消</el-button>
        <el-button type="primary" @click="submitFixPrice">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 批量修改客户运价的的弹框 end ======================================  -->

    <pop-print-waybill ref="printWaybillDialog"></pop-print-waybill>
    <loading-action ref="loadingActionDialog" @refresh="refresh"></loading-action>
  </div>
</template>

<script type="text/ecmascript-6">
  import eleList from '../components/ele-list/eleList.vue';
  import { urlRedirect,showMessageUtil } from '../../api/Utils';
  import {deleteList, getAction, executeAction,  add, downloadErrorData, downloadTemplate ,getWaybillList ,editPriceOutsourcing as editPrice  } from '../../api/waybillService';
  import { getColumn ,list,getSearch ,exportCsvOutsourcing as exportCsv} from '../../api/OutsourcingWaybillService';
  import * as ApiConst from '../../api/ApiConst';
  import eleAction from '../components/ele-action/eleAction.vue';
  import eleWaybillPopMap from '../components/ele-pop-map/eleWaybillPopMap.vue';
  import popPrintWaybill from '../waybill/popPrintWaybill.vue';
  import LoadingAction from '../waybill/loadingAction.vue';
  import { checkPermission } from '../../api/Utils';
  import '../components/vueDirectives';

  const actionExcludeFilter = [];
  export default {
    name: 'waybillList',
    components: {
      'ele-list': eleList,
      'ele-waybill-pop-map': eleWaybillPopMap,
      'ele-action': eleAction,
      'pop-print-waybill': popPrintWaybill,
      'loading-action': LoadingAction
    },
    props: {
      showBatchFixPrice: {
        type: Boolean,
        'default': true
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
      needMore: {
        type: Boolean,
        'default': false
      },
      params: {
        type: Object,
        'default': function () {
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
        dialogVisiblePrice: {
          visiable: false
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
        objectName: '外包运单',
        addUrl: '/outsourcingWaybill/add.html',
        editUrl: '/outsourcingWaybill/add.html',
        listUrl: '/outsourcingWaybill/list.html',
        actionUrl: 'outsourcingWaybill/action.html',
        recycleUrl: '/outsourcingWaybill/recycleList.html',
        deleteFun: deleteList,
        getAction,
        exportCsv,
        add,
        downloadErrorData,
        importUrl: `${ApiConst.apiWayBillDomain}/import/custom/outsourcing`,
        popWaybillTruckMap: true,
        permission:true,
        downloadTemplate,
        folder: 'waybill/outsourcing',
        isMap: '',
        meterageTypeTemp: undefined,
        modelFixPrice: {
          options: {
            ton: [{ id: "yuanperton", name: "元/吨", value: "元/吨" }, { id: "yuanpertruck", name: "元/车", value: "元/车" }],
            cube: [{ id: "yuanpercube", name: "元/方", value: "元/方" }, { id: "yuanpertruck", name: "元/车", value: "元/车" }],
            item: [{ id: "yuanperitem", name: "元/件", value: "元/件" }, { id: "yuanpertruck", name: "元/车", value: "元/车" }]
          },
          domainObject: {
            clientFreightPrice: null,
            clientFreightPriceUnitCode: null,
            driverPrice: null,
            driverPriceUnitCode: null
          },
          fields: []
        }
      };
    },
    methods: {
      // 批量修改运价 提交
      submitFixPrice() {
        let self = this;
        const cli_price = this.modelFixPrice.domainObject.clientFreightPrice;
        if (!cli_price) {
          showMessageUtil('warning', '请输入正确的运价', 3000);
          // this.dialogVisiblePrice.visiable = false;
          return;
        }
        // 检验填入的格式
        const arr_price = [{ val: cli_price, msg: '客户运价不超过13位(最多4位小数)' }];
        const msg = '客户运价不超过13位(最多4位小数)';

        var reg = /^[0-9]{1,10}(\.[0-9]{0,4})?$/;

        if(!reg.test(cli_price)){
          showMessageUtil('warning', msg, 3000);
          return
        }

        // arr_price.forEach(item => {
        //   var reg = /^[0-9]{1,10}(\.[0-9]{0,4})?$/;
        //   if (item.val && !reg.test(item.val)) {
        //     showMessageUtil('warning', item.msg, 1000);
        //     return;
        //   }
        // })



        let arr = [];
        this.listData.forEach(item => {
          if (item.checked) { arr.push(item); }
        })
        if (arr.length < 1) {
          showMessageUtil('warning', '请选择运单', 1000);
          return;
        }
        let all_count = arr.length;
        let succ_count = 0;
        let fail_count = 0;
        for (let i = 0; i < arr.length; i++) {
          let obj = arr[i];
          let params = {};
          params.code = obj.code;
          if (this.modelFixPrice.domainObject.clientFreightPrice) {
            params.clientFreightPrice = this.modelFixPrice.domainObject.clientFreightPrice;
          }

          this.loading = true;
          editPrice(params, (success, error) => {
            if (error || success.code !== 200) {
              fail_count++;
            }
            if (success) {
              succ_count++;
            }
            if (all_count == succ_count + fail_count) {
              this.loading = false;
              const msg = `批量修改价格，共${all_count}条运单，成功${succ_count}条，失败${fail_count}条。`;
              showMessageUtil('success', msg, 3000);
              this.dialogVisiblePrice.visiable = false;
              setTimeout(function() {
                self.$refs.eleList.dispatchQueryEventSavePage();
              }, 3000)
            }
          });
        }
      },
    // 批量修改 运价
      batchFixPrice() {
        //1.单车已经结算  不能修改 2.客户必须是 同一个  需要全部满足  settleStatus = pass 计量标准必须一致
        let listSelected = [];
        let clientOrgName = undefined; // 客户
        let meterageTypeTemp = undefined; // 选中的计量标准
        // let error = { settleStatusMark: false, clientOrgNameMark: false };
        let error = { mark: false, msg: '' };
        let meterageType = null;
        for (let i = 0; i < this.listData.length; i++) {
          let item = this.listData[i];
          if (item.checked) {
            if (!clientOrgName) { clientOrgName = item.clientOrgName; }
            if (!meterageTypeTemp) {
              meterageTypeTemp = item.meterageType;
              this.meterageTypeTemp = meterageTypeTemp
            }
            listSelected.push(item);
          }
        }
        if (listSelected.length < 1) {
          error.mark = true;
          error.msg = '请至少选择一个运单';
        }
        if (error.mark) {
          showMessageUtil('warning', error.msg, 3000);
        } else {
          this.dialogVisiblePrice.visiable = true;
        }
      },
      cancelFixPrice() {
        this.dialogVisiblePrice.visiable = false;
        let model = this.modelFixPrice.domainObject;
        let key;
        for (key in model) { model[key] = undefined; }
      },
      recycleList() {
        this.openWindow(`${this.recycleUrl}`, '外包运单回收站列表');
      },
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
          case 'viewTrajectory':
          // this.openWindow(`/truck/truck-gps.html?truckLicenseNo=${model.truckLicenseNo}&waybillStatus=${model.waybillStatus}&loadingTime=${model.loadingTime}&unloadingTime=${model.unloadingTime}`, `车辆轨迹`);
          // const url = menu.action.actionMethodParameter; // 轨迹页面URL/truck/truck-gps.html
          window.open(`/truck/truck-gps.html?truckLicenseNo=${model.truckLicenseNo}&waybillStatus=${model.waybillStatus}&loadingTime=${model.loadingTime}&unloadingTime=${model.unloadingTime}&driverFullName=${model.driverFullName}&driverPhone=${model.driverPhone}&goodsName=${model.goodsName}&loadingProvinceCode=${model.loadingProvinceCode}&loadingCityCode=${model.loadingCityCode}&unloadingProvinceCode=${model.unloadingProvinceCode}&unloadingCityCode=${model.unloadingCityCode}`);
            break;
          default: {
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
        // if( true == this.isFormLogistics){
        //   this.getList = getWaybillList;
        // }
        console.log('searchParams', searchParams);
        Object.assign(searchParams, this.params);
        console.log('query', searchParams);
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
              codeList.push(data.code);
            });


            getAction(codeList, (response) => {
              success.content.forEach((row) => {
                const actionList = [];
                if (response && response.content && response.content[row.code]) {
                  response.content[row.code].forEach((action) => {
                    // if(action.actionCode == 'map')
                    // 1.目前只展示 查看位置 的action 2.在 运输完成  运单取消 状态下不需要 查看位置
                    if (action.actionCode == 'map' && row.waybillStatus != 'finish' && row.waybillStatus != 'cancel'){
                      actionList.push({key: action.actionCode, name: action.actionName, action});
                    }
                    // if(action.actionCode === 'remove'){
                    //    actionList.push({key: action.actionCode, name: action.actionName, action});
                    // }

                  });
                }
                
                // 运输中和运输完成的运单，并且有查看轨迹的权限，新增查看轨迹操作
                if ((row.waybillStatus === 'going' || row.waybillStatus === 'finish') && checkPermission('outsourcingWaybill.historyLocation')) {
                  actionList.push({ key: 'viewTrajectory', name: '查看轨迹' });
                }

                row.actionMenuList = actionList;
              });
              self.listData = success.content;
              this.loading = false;
              //console.log('parent.listData', self.listData);
            });
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

#waybillList {
  .el-dialog--large {
    transform: none;
    margin-left: -35%;
  }
}

.el-dialog__body {
  .complex-control-2 {
    .innerblock {
      width: 110px;
    }
  }
  .form-page .el-row .el-col-12:nth-child(6n), .form-page .el-row .el-col-12:nth-child(6n-1) {
    margin-bottom: 0;
    border-bottom: 0;
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
</style>

