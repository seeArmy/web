/** * list.vue * 单车付款支付列表 * Created by zhuyi on 17/7/21. */
<template>
  <div class='paybill-list'>
    <ele-list :selectable="selectable" :operatable="operatable" :showExportButton="true" @query="query" @ready="onReady" @action="action" @more="more" @exportData="exportData" :total="total" :loading="loading" :list-data="listData" ref="eleList" :customColumn="customColumn" :params="params" :needPage="needPage" :needMore="needMore" :needAdd="false" :showDownloadTemplate="false" :showImportButton="false" :isAdvanced="isAdvanced" :deleteFun="deleteFun" :add="add" :downloadErrorData="downloadErrorData" :downloadTemplate="downloadTemplate" :importUrl="importUrl" :editUrl="editUrl" :getColumn="getColumn" :getList="getList" :exportCsv="exportCsv" :getSearch="getSearch" :getAction="getAction" :exportParams='exportParams' :folder="folder" :objectName="objectName">
      <template slot="funArea">
        <el-button @click="batchControl">批量控制</el-button>
        <el-button @click="batchPay" v-if="checkPermission('onlinepay.add')">批量线上支付</el-button>
        <el-button @click="batchUpdatePayee">批量修改收款人</el-button>
        <!-- <el-button @click="batchPayOffline">批量线下支付</el-button> -->
        <el-button @click="batchPayOffline" v-if="checkPermission('offlinepay.add')">批量线下支付</el-button>
      </template>
    </ele-list>


    <!-- 撤回弹框 炼金师 撤回 -->
    <el-dialog :title="`${dialogRepealPayCtrl.params.title}`" :visible.sync="dialogRepealPayCtrl.visible" width="60%">
      <el-row>
        <el-col :span="24">
          <h3 class="tit">请输入密码：</h3>
          <br>
          <el-input type="password" v-model="dialogRepealPayCtrl.params.payPassword"></el-input>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogRepealPayCtrl.visible = false">取消</el-button>
        <el-button @click="handleRollbackPay" :disabled="dialogRepealPayCtrl.btnDisabled">确定</el-button>
      </span>
    </el-dialog>


    <el-dialog :title="actionDialogTitle" :visible.sync="actionDialogVisible" size="large">
      <component ref="waybillAction" :is="currentDialogComponent" @success="dialogSuccess" @fail="dialogFail" @close="dialogClose" :type="type" :actionType="actionType" :actionDomain="actionDomain" :id="currentWaybillCode" :action="currentActionCode" :actionExecuteFun="actionExecuteFun" :isDialog="true"></component>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogClose">取 消</el-button>
        <el-button type="primary" @click="dialogSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="线下支付提示" :visible.sync="payDialog.visible" size="small" class="pay-dialog" :close="closePayDialog">
      <h3>确认<b>{{payDialog.model.truckLicenseNo}}</b>已线下付款<b>{{payDialog.model.paymentAmount}}</b>元？</h3>
      <el-row>
        <el-col :span="12">
          单车付款单号：{{payDialog.model.paybillNo}}
        </el-col>
        <el-col :span="12">
          运单号：{{payDialog.model.waybillNo}}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          银行户名：{{payDialog.model.payeeBankAccountName}}
        </el-col>
        <el-col :span="12">
          开户银行：{{payDialog.model.payeeBankName}}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          银行账号：{{payDialog.model.payeeBankAccountNo}}
        </el-col>
        <el-col :span="24">
          备注：
          <el-input type="text" v-model="payDialog.comment" style="width:300px" />
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closePayDialog">关闭</el-button>
        <el-button @click="payFailed" :disabled="dialogActionDisable">支付失败</el-button>
        <el-button type="primary" @click="paySuccess" :disabled="dialogActionDisable">确认已付款成功</el-button>
      </span>
    </el-dialog>
    <!-- 批量线下支付 -->
    <el-dialog title="批量线下支付提示" :visible.sync="batchPayDialog.visible" size="small" class="pay-dialog" :close="closePayDialog">
      <el-row>
        <el-col :span="24">
          共选择了{{batchPayDialog.ListModel.length}}个付款单
        </el-col>
        <el-col :span="24">
          备注：
          <el-input type="text" v-model="batchPayDialog.comment" style="width:300px" />
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closePayDialog">关闭</el-button>
        <el-button @click="doBatchPayOffline('failed')" :disabled="dialogActionDisable">支付失败</el-button>
        <el-button type="primary" @click="doBatchPayOffline('success')" :disabled="dialogActionDisable">确认已付款成功</el-button>
      </span>
    </el-dialog>
    <el-dialog title="取消支付提示" :visible.sync="canclePayDialog.visible" size="small" class="pay-dialog" :close="closeCanclePayDialog">
      <h3>确认取消支付<b>{{canclePayDialog.model.truckLicenseNo}}</b>的司机费用？</h3>
      <el-row>
        <el-col :span="12">
          司机付款单号：{{canclePayDialog.model.paybillNo}}
        </el-col>
        <el-col :span="12">
          运单号：{{canclePayDialog.model.waybillNo}}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          银行户名：{{canclePayDialog.model.driverPayeeBankAccountName}}
        </el-col>
        <el-col :span="12">
          开户银行：{{canclePayDialog.model.driverPayeeBankName}}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          银行账号：{{canclePayDialog.model.driverPayeeBankAccountNo}}
        </el-col>
        <el-col :span="24">
          备注：
          <el-input type="text" v-model="canclePayDialog.comment" style="width:300px" />
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeCanclePayDialog" >关闭</el-button>
        <el-button type="primary" @click="canclePay" :disabled="dialogActionDisable">确认取消</el-button>
      </span>
    </el-dialog>
    <!-- 打回弹框 -->
    <el-dialog title="司机付款打回提示" :visible.sync="dialogRevocation.visible" size="small" class="pay-dialog" :close="closePayDialog">
      <el-row>
        <el-col :span="24">
          打回备注：
          <el-input type="text" v-model="dialogRevocation.comment" style="width:300px" />
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closePayDialog">取消</el-button>
        <el-button @click="netRevocation" :disabled="dialogActionDisable">确定</el-button>
      </span>
    </el-dialog>
    <!-- 批量控制弹框 -->
    <el-dialog title="批量控制" :visible.sync="dialogControl.visible">
      <el-row>
        <el-col :span="24">
          <p>当前选中 {{ dialogControl.num }} 条单车付款单，请选择控制状态处理结果。</p>
          <br>
        </el-col>
        <el-col :span="24">
          <h3 class="tit">控制状态处理：</h3>
          <br>
          <el-radio-group v-model="dialogControl.status">
            <el-radio label="freeze">冻结</el-radio>
            <el-radio label="normal">释放</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogControl.visible = false">取消</el-button>
        <el-button @click="confirmControl" :disabled="dialogControl.btnDisabled">确定</el-button>
      </span>
    </el-dialog>
    <!-- 批量修改收款人的弹框 -->
    <el-dialog title="请选择收款人" :visible.sync="dialogVisible.payeeFirst" size="large" class='payee'>
      <fix-payee ref='fixPayee'></fix-payee>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible.payeeFirst = false">取 消</el-button>
        <el-button type="primary" @click="dialogSubmitPayee">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script type="text/ecmascript-6">
import eleList from '../components/ele-list/eleList.vue';
import { urlRedirect, checkPermission } from '../../api/Utils';
import { payRetract, getColumn, list, getSearch, deleteList, getAction, executeAction, exportCsvPaybillCustom as exportCsv, add, downloadErrorData, downloadTemplate, modifyPaybillStatus, revocationPaybill, batchFreeze, batchFixPayee } from '../../api/PaybillService';
import { cancelOnlinePay  } from '../../api/waybillService'
import * as ApiConst from '../../api/ApiConst';
import eleAction from '../components/ele-action/eleAction.vue';
import eleWaybillPopMap from '../components/ele-pop-map/eleWaybillPopMap.vue';
import { paycart } from '../payment/components/utils';
import FixPayee from '../waybill/fixPayee.vue';

export default {
  name: 'waybillList',
  components: {
    'ele-list': eleList,
    'ele-waybill-pop-map': eleWaybillPopMap,
    'ele-action': eleAction,
    'fix-payee': FixPayee
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
    }
  },
  data: () => {
    return {
      dialogRepealPayCtrl: {
        visible: false,
        params: {
          title: '',
          code: '',
          payPassword: null
        },
        btnDisabled: false,
      },
      dialogVisible: {
        payeeFirst: false,
        modelFirst: {}
      },
      dialogActionDisable: false,
      //打回弹框
      dialogRevocation: {
        visible: false,
        model: {},
        comment: '',
      },
      payDialog: {
        visible: false,
        model: {},
        comment: ''
      },
      // 批量线下支付
      batchPayDialog: {
        visible: false,
        ListModel: [],
        comment: ''
      },
      canclePayDialog: {
        visible: false,
        model: {},
        comment: ''
      },
      dialogControl: {
        visible: false,
        num: 0,
        status: null,
        btnDisabled: false,
        codes: []
      },
      listData: [],
      total: 0,
      loading: true,
      getColumn: getColumn,
      actionDialogTitle: 'Dialog',
      actionDialogVisible: false,
      type: 'paybill',
      actionType: 'paybill',
      actionDomain: `${ApiConst.apiWayBillDomain}`,
      actionExecuteFun: executeAction,
      currentWaybillCode: '',
      currentActionCode: '',
      currentDialogComponent: '',
      getList: list,
      getSearch,
      objectName: '单车付款支付',
      addUrl: '/paybill/add.html',
      editUrl: '/paybill/add.html',
      listUrl: '/paybill/list.html',
      actionUrl: 'paybill/action.html',
      deleteFun: deleteList,
      getAction,
      exportCsv,
      add,
      downloadErrorData,
      importUrl: `${ApiConst.apiWayBillDomain}/import/custom/paybill`,
      popWaybillTruckMap: true,
      downloadTemplate,
      exportParams: null,
      checkPermission,
      folder: 'waybill/paybill'
    };
  },
  methods: {
    // 点击确定 修改收款人按钮
    dialogSubmitPayee() {
      let arr = [];
      // this.listData.forEach(item => {
      //   if (item.checked && item.paybillPayStatus != 'offline' && item.paybillPayStatus != 'online' && item.payeeType == 2) {
      //     arr.push(item);
      //   }
      // })
      this.listData.forEach(item => {
        if (item.checked && item.paybillPayStatus != 'paid' && item.payeeType == 2) {
          arr.push(item);
        }
      })
      if (arr.length < 1) {
        this.$message({
          type: 'warning',
          message: `请选择未付款的付款单，且收款人必须为司机`,
          duration: 1000
        });
        return;
      }
      let all_count = arr.length;
      let succ_count = 0;
      let fail_count = 0;
      for (let i = 0; i < arr.length; i++) {
        let obj = arr[i];
        let params = this.$refs.fixPayee.domainObject;



        // 拼接 请求对象
        let parSend = {};
        if (params.payeePlatformDriverCode) {
          parSend.platformPayeeCode = params.payeePlatformDriverCode;
        } else {
          this.$message({
            type: 'warning',
            message: `您选择的司机编码不存在`,
            duration: 1000
          });
          return;
        }

        parSend.payeeCode = params.payeeDriverCode;
        parSend.payeeName = params.payeeDriverFullName;
        parSend.payeePhone = params.payeeDriverPhone;
        parSend.payeeBankName = params.driverPayeeBankName;
        parSend.payeeBankAccountName = params.driverPayeeBankAccountName;
        parSend.payeeBankAccountNo = params.driverPayeeBankAccountNo;
        parSend.payeeBankAccountDescription = params.driverPayeeBankAccountDescription;

        parSend.code = obj.code;

        // params.code = obj.code;
        this.loading = true;
        batchFixPayee(parSend, (success, error) => {
          if (error || success.code !== 200) {
            fail_count++;
          }
          if (success) {
            succ_count++;
          }
          if (all_count == succ_count + fail_count) {
            this.dialogVisible.payeeFirst = false;
            this.loading = false;
            this.$message({
              type: 'success',
              message: `批量修改${all_count}条运单收款人，成功${succ_count}条，失败${fail_count}条。`,
              duration: 3000
            });
            setTimeout(function() {
              window.location.reload();
            }, 3000)
          }
        });
      }
    },
    batchUpdatePayee() {


      // let arr = [];
      // this.listData.forEach(item => {
      //   if (item.checked && item.paybillPayStatus != 'offline' && item.paybillPayStatus != 'online' && item.payeeType == 2) {
      //     arr.push(item);
      //   }
      // })
      let arr = [];
      this.listData.forEach(item => {
        if (item.checked && item.paybillPayStatus != 'paid' && item.payeeType == 2) {
          arr.push(item);
        }
      })
      if (arr.length < 1) {
        this.$message({
          type: 'warning',
          message: `请选择未付款的付款单，且收款人必须为司机`,
          duration: 1000
        });
        return;
      }

      this.dialogVisible.payeeFirst = true;


      this.$nextTick(() => {
        this.$refs.fixPayee.domainObject
        let key;
        for (key in this.$refs.fixPayee.domainObject) {
          if (this.$refs.fixPayee.domainObject.hasOwnProperty(key)) {
            this.$refs.fixPayee.domainObject[key] = null;
          }
        }
        this.$refs.fixPayee.setSelected();
      })
    },
    batchControl() {
      this.dialogControl.codes = [];
      const data = this.listData;
      data.forEach((val) => {
        if (val.checked) {
          this.dialogControl.codes.push(val.code);
        }
      });
      this.dialogControl.num = this.dialogControl.codes.length;
      if (this.dialogControl.num > 0) {
        this.dialogControl.visible = true;
      } else {
        this.$message({
          type: 'warning',
          message: '请选择要批量控制单据！',
          duration: 3000
        });
      }
    },
    batchPay() {
      const data = this.listData,
        rows = [];
      data.forEach((val) => {
        if (val.checked) {
          rows.push(val);
        }
      });
      if (rows.length > 0) {
        for (var i in rows) {
          if (rows[0]['payerCode'] != rows[i]['payerCode']) {
            this.$message({
              type: 'warning',
              message: '请选择同一个支付单位！',
              duration: 2000
            });
            return false
          }
        }
        paycart(rows)
        urlRedirect('../paybill/order.html', '支付账单');
      } else {
        this.$message({
          type: 'warning',
          message: '必须选择至少一个需要付款的单据！',
          duration: 2000
        });
      }
    },
    // 批量线下支付 支付状态为待支付
    batchPayOffline() {
      const data = this.listData;
      let rows = [];
      data.forEach((val) => {
        if (val.checked && val.paybillPayStatus !== 'paid') {
          rows.push(val);
        }
      });
      if (rows.length > 0) {
        for (var i in rows) {
          if (rows[0]['payerCode'] != rows[i]['payerCode']) {
            this.$message({
              type: 'warning',
              message: '请选择同一个支付单位！',
              duration: 2000
            });
            return false
          }
        }
        this.batchPayDialog.ListModel = rows;

        this.batchPayDialog.visible = true;

        // paycart(rows)
        // urlRedirect('../paybill/order.html', '支付账单');
      } else {
        this.$message({
          type: 'warning',
          message: '必须选择至少一个需要付款的单据！',
          duration: 2000
        });
      }
    },
    confirmControl() {
      if (this.dialogControl.status) {
        this.dialogControl.btnDisabled = true;
        let sucNum = 0,
          errNum = 0,
          finishNum = 0;
        this.dialogControl.codes.forEach((code) => {
          const params = {
            code: code,
            paybillFreezeStatus: this.dialogControl.status
          };
          batchFreeze(params, (success, error) => {
            finishNum++;
            if (error || success.code !== 200) {
              this.$message({
                type: 'error',
                message: `${error}`,
                duration: 3000
              });
              errNum++;
            } else {
              sucNum++;
            }
            if (finishNum === this.dialogControl.num) {
              this.$message({
                type: 'success',
                message: `操作成功${sucNum}条，操作失败${errNum}条！`,
                duration: 3000
              });
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            }
          });
        });
      }
    },
    onReady() {},
    closeCanclePayDialog() {
      this.canclePayDialog.model = {};
      this.canclePayDialog.visible = false;
      this.canclePayDialog.comment = '';
    },
    closePayDialog() {
      this.payDialog.model = {};
      this.payDialog.visible = false;
      this.payDialog.comment = '';


      this.dialogRevocation.visible = false;
      this.dialogRevocation.model = {};
      this.dialogRevocation.comment = '';

      this.batchPayDialog.visible = false;
      this.batchPayDialog.ListModel = [];
      this.batchPayDialog.comment = '';

    },
    canclePay() {
      this.dialogActionDisable = true;
      modifyPaybillStatus(this.canclePayDialog.model.code, {
        code: this.canclePayDialog.model.code,
        paybillPayStatus: 'pend',
        description: this.canclePayDialog.comment
      }, (data, err) => {
        this.dialogActionDisable = false;
        if (data) {
          this.closeCanclePayDialog();
          this.$message.success("操作成功");
          // this.query({size:20,page:1,paybillPayStatus:'pend'});
          this.query({ size: 20, page: 1 });
        } else {
          this.$message.error("操作失败：" + err.content);
        }
      })
    },
    refreshNow() {
      this.$refs.eleList.dispatchQueryEvent();
    },
    paySuccess() {
      this.dialogActionDisable = true;
      modifyPaybillStatus(this.payDialog.model.code, {
        code: this.payDialog.model.code,
        // paybillPayStatus: 'offline',
        paybillPayStatus: 'paid',
        description: this.payDialog.comment
      }, (data, err) => {
        this.dialogActionDisable = false;
        if (data) {
          this.$message.success("操作成功");
          this.closePayDialog();
          this.refreshNow();
          // this.query({size:20,page:1,paybillPayStatus:'pend'});
          // this.query({ size: 20, page: 1 });
        } else {
          this.$message.error("操作失败：" + err.content);
        }
      })
    },
    // 批量线下支付
    doBatchPayOffline(type) {
      let self = this;
      let finishedCount = this.batchPayDialog.ListModel.length;
      let successedCount = 0;
      let failedCount = 0;
      this.loading = true;

      this.batchPayDialog.ListModel.forEach(item => {
        // let data = { code: item.code, paybillPayStatus: 'offline', description: self.batchPayDialog.comment };
        let data = { code: item.code, paybillPayStatus: 'paid', description: self.batchPayDialog.comment };
        if (type == 'failed') { data.paybillPayStatus = 'failed' };
        modifyPaybillStatus(item.code, data, function(ret, err) {
          if (ret) {
            successedCount++;
          } else {
            failedCount++;
          }
          if (finishedCount == successedCount + failedCount) {
            let msg = `请求成功${successedCount}条单据，失败${failedCount}条单据`;
            self.closePayDialog();
            self.loading = false;
            self.$refs.eleList.dispatchQueryEvent();
            if (successedCount > 0) {
              self.$message({
                type: 'success',
                message: msg,
                duration: 2000
              });
            } else {
              self.$message.error(msg);
              self.$message({
                type: 'error',
                message: msg,
                duration: 2000
              });
            }
          }
        });
      })
    },
    payFailed() {
      this.dialogActionDisable = true;
      modifyPaybillStatus(this.payDialog.model.code, {
        code: this.payDialog.model.code,
        paybillPayStatus: 'failed',
        description: this.payDialog.comment
      }, (data, err) => {
        this.dialogActionDisable = false;
        if (data) {
          this.$message.success("操作成功");
          this.closePayDialog();
          this.refreshNow();
          // this.query({size:20,page:1,paybillPayStatus:'pend'});
          // this.query({ size: 20, page: 1 });
        } else {
          this.$message.error("操作失败：" + err.content);
        }
      })
    },
    // 打回网络请求
    netRevocation() {
      if (this.dialogRevocation.comment == '') {
        alert('请填写备注');
        return false;
      }
      this.dialogActionDisable = true;
      revocationPaybill(this.dialogRevocation.model.code, {
        code: this.dialogRevocation.model.code,
        paybillApproveDescription: this.dialogRevocation.comment
      }, (data, err) => {
        this.dialogActionDisable = false;
        if (data) {
          this.closePayDialog();
          this.$message.success("操作成功");
          window.location.reload();
        } else {
          if (err.content) {
            this.$message.error("操作失败：" + err.content);
          } else {
            this.$message.error("操作失败");
          }
        }
      })

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
        message: `确认要删除${this.objectName}吗？`,
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
          this.actionDialogTitle = menu.name;
          this.actionDialogVisible = true;
          this.currentWaybillCode = model.code;
          this.currentActionCode = menu.key;
          this.currentDialogComponent = 'ele-waybill-pop-map';
          //            this.openWindow(`/truck/truck-gps.html?truckLicenseNo=${model.truckLicenseNo}&objectName=${this.objectName}`, '车辆轨迹');
          break;
        case 'payOffline':
          this.payDialog.model = model;
          this.payDialog.visible = true;
          break;
        case 'cacelPay':
          this.canclePayDialog.visible = true;
          this.canclePayDialog.model = model;
          break;
          // 点击打回
        case 'revocation':
          this.dialogRevocation.model = model;
          this.dialogRevocation.visible = true;
          this.initPayDialog();
          break;
        case 'payOnline':
          this.handlePay(model)
          break;
          // 线下打回支付
        case 'payRetract':
          this.doPayRetract(model)
          break;
        case 'rollbackpayAction':
          this.openRollbackPayDialog(model)
          break;
          
        default:
          this.actionDialogTitle = menu.name;
          this.actionDialogVisible = true;
          this.currentWaybillCode = model.code;
          this.currentActionCode = menu.key;
          this.currentDialogComponent = 'ele-action';
          break;
      }
    },
    // 志芳的接口 炼金师 的撤回
    openRollbackPayDialog(row) {
      const self = this
      self.dialogRepealPayCtrl.params.title = `确认撤回支付订单[${row.paybillNo}]?`
      self.dialogRepealPayCtrl.params.code = row.code
      self.dialogRepealPayCtrl.params.payPassword = null
      self.dialogRepealPayCtrl.visible = true
      self.dialogRepealPayCtrl.btnDisabled = false
    },
    handleRollbackPay() {
      const self = this,
        params = self.dialogRepealPayCtrl.params
      if (params.payPassword === null) {
        this.$message({
          type: 'error',
          message: '请输入密码'
        });
        return
      } else {
        self.dialogRepealPayCtrl.btnDisabled = true
        const query = {
          code: params.code,
          payPassword: params.payPassword
        }
        cancelOnlinePay(query, (success, err) => {
          if (success && success.code === 200) {
            this.$message({
              type: 'success',
              message: '撤回成功'
            });
            self.dialogRepealPayCtrl.visible = false
          }
          if (err) {
            this.$message({
              type: 'error',
              message: err.content
            });
          }
          self.dialogRepealPayCtrl.btnDisabled = false
          // self.loadinglst()
           self.$refs.eleList.dispatchQueryEvent();
        })
      }
    },
    // 线下支付  => 撤回
    doPayRetract(model) {
      const self = this;
      this.$msgbox({
        title: '确认',
        message: `确认要撤回吗？`,
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = '执行中...';
            payRetract({ code: model.code }, (success, error) => {
              if (success) {
                this.$message({
                  type: 'success',
                  message: '撤回成功',
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
    // 弹框出现之前，分情况初始化 一些数据
    initPayDialog() {
      this.dialogRevocation.comment = "";
    },
    exportData(params) {
      const dataTotal = this.total;
      params.paybillPayType = 'self';
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
          // paramsObj["params"].obj = 'ioSummary';
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
      Object.assign(searchParams, this.params);
      // searchParams['paybillApproveStatus']="accept";
      const self = this;
      this.total = 0;
      this.loading = true;
      this.listData = [];
      searchParams.paybillPayType = 'self';
      searchParams.paybillApproveStatus = 'accept'; // 固定加上
      // searchParams.paybillPayStatus ? '' : (searchParams.paybillPayStatus = 'pend');
      this.exportParams = searchParams;
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
          success.content.forEach((row) => {
            const actionList = [];
            // actionList.push({ key: 'rollbackpayAction', name: '撤回支付' });
            // // 待支付的单据增加打回功能
            // if(row.paybillPayStatus === 'pend'){
            //    // actionList.unshift({ key: 'payOnline', name: '打回' });
            // }
            if (row.paybillFreezeStatus !== 'freeze') {
              if (row.paybillPayStatus == 'pend' || row.paybillPayStatus == 'failed') {

                if (checkPermission('offlinepay.add')) {
                  actionList.push({ key: 'payOffline', name: '线下支付' });
                }

                // actionList.push({key: 'cacelPay', name: '取消支付'});
              }
              // 已线下支付 才有 取消支付的 操作
              // if (row.paybillPayStatus == 'offline') {
              // actionList.push({key: 'cacelPay', name: '取消支付'});
              // }
              // 只有待支付状态 才可以 打回
              if ( this.checkPermission('paybill.callBack') && row.paybillPayStatus === 'pend') {
                actionList.push({ key: 'revocation', name: '打回' });
              }


              //需求： 结算中心、无车承运下的-单车付款支付中，通过线下支付渠道的单据增加撤回支付功能；撤回后，付款单的支付状态为待支付，支付渠道置空；
              //调用 唐侠的接口
              if ( this.checkPermission('repealPay.add') &&  row.paybillPayStatus === 'paid' && row.paybillPayChannel === 'offline') {
                actionList.push({ key: 'payRetract', name: '撤回支付' });
              }
              //调取 志芳的接口
              if ( this.checkPermission('repealPay.add') &&row.paybillPayStatus === 'paid' && row.paybillPayChannel === 'ljs') {
                actionList.push({ key: 'rollbackpayAction', name: '撤回支付' });
              }
            } else {
              // 冻结之后没有操作
            }
            // 配置了线上支付，并且待支付，支付失败才显示线上支付操作
            if (this.checkPermission('onlinepay.add') && (row.paybillPayStatus === 'pend' || row.paybillPayStatus === 'failed')) {
              actionList.unshift({ key: 'payOnline', name: '线上支付' });
            }
            row.actionMenuList = actionList;
          });
          self.listData = success.content;
          this.loading = false;
          //              self.listData.splice(self.listData.length);
          console.log('parent.listData', self.listData);
        }
      });
    },
    handlePay(row) {
      if (row.paybillFreezeStatus == 'freeze') {
        this.$message({
          type: 'warning',
          message: '冻结状态不可支付',
          duration: 1000
        });
        return;
      }
      // this.paymentlistShow = false
      // this.tableData = [];
      // this.tableData.push(row)
      //push lst to cache
      const ret = []
      ret.push(row)
      paycart(ret)
      urlRedirect('../paybill/order.html', '支付账单');
    }
  },
  created() {},
  mounted() {
    // 默认 搜索条件
    this.$nextTick(() => {
      this.$refs.eleList.setSearchModelDefault({ 'paybillPayStatus': 'pend' });
      this.$refs.eleList.dispatchQueryEvent();
    });
  }
};

</script>
<style lang="scss" rel="stylesheet/scss">

.paybill-list {
  .el-input__inner{
    height: 24px !important;
    border-color: rgb(218, 218, 218);
    border-radius: 0px;
  }
}


// 弹框 处理 start ========
.payee-page {
  .el-dialog--large {
    position: fixed;
    top: 0 !important;
  }
}

.v-modal {
  z-index: 1000 !important;
}

// 弹框 处理 end ========
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

.pay-dialog h3 {
  font-size: 18px;
  text-align: center;
  margin: 20px 0px;
}

.pay-dialog h3 b {
  color: red;
}

.pay-dialog .el-col {
  padding: 10px;
}

</style>
