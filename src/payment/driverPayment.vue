<template>
  <div id='listDriverPayment' v-loading.fullscreen.lock="loading">
    <listLayout :deleteFun="deleteFun" :getColumn="getColumn" :getList="listForS" :getSearch="getSearch" :objectName="objectName" :editUrl="editUrl" :addUrl="addUrl" :importUrl="''" ref="driverPaymentlst" :showExportButton="false" :showImportButton="false" :dispatchDelete="false" :showDownloadTemplate="false" :operatable="true" :actionLst="operationSelector" v-on:payAction="handlePay" v-on:offLinePayAction="handleoffLinePayAction" v-on:canclePayAction="handlecanclePayAction" v-on:rollbackpayAction="openRollbackPayDialog" :extraParams="extraParams" :showBatchPay="showBatchPayAllow" v-on:rollbackpayActionOffline='doPayRetract' :exportCsvFunc="exportPayLstS" :showexportCsvBtn="true" :searchModelDefault='searchModelDefault' @idPrint="doIdPrint" @certificatePrint="doCertificatePrint" @declarationPrint="doDeclarationPrint">
      <template slot="funArea">
        <el-button @click="batchControl">批量控制</el-button>
        <el-button @click="batchUpdatePayee">批量修改收款人</el-button>
        <!-- <el-button @click="batchPayOffline">批量线下支付</el-button> -->
        <el-button @click="batchPayOffline" v-if="checkPermission('opr.wuche.offlinepay')">批量线下支付</el-button>
      </template>
    </listLayout>
    <!-- <pay-ment-confirm v-if="!paymentlistShow" :table-data="tableData"></pay-ment-confirm> -->
    <pay-ment-dialog ref="paymentDialog" :dialog-data="paymentObject" v-on:loadlstAction="loadinglst"></pay-ment-dialog>
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
    <!-- 撤销弹框 -->
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
import listLayout from '../layout/list/listLayout.vue';
import { queryPayFreight } from '../../api/TradeService'
import payMentConfirm from './components/payMentConfirm'
import { listForS, get as getPaymentLog, cancelOnlinePay, pay as modifyPaybillStatus } from '../../api/waybillService'
import payMentDialog from './components/payMentDialog'
import { paycart } from './components/utils'
import { urlRedirect, checkPermission } from '../../api/Utils';
import { exportPayLstS } from '../../api/PlatformService'
import { batchFreeze, batchFixPayee, payRetract } from '../../api/PaybillService'
import FixPayee from '../waybill/fixPayee.vue';

export default {
  name: 'driver-payment-list',
  components: {
    'listLayout': listLayout,
    payMentConfirm,
    payMentDialog,
    FixPayee
  },
  data: () => {
    return {
      checkPermission,
      // 批量线下支付
      loading: false,
      batchPayDialog: {
        visible: false,
        ListModel: [],
        comment: ''
      },

      dialogVisible: {
        payeeFirst: false,
        modelFirst: {}
      },
      objectName: '单车付款',
      queryPayFreight,
      listForS,
      addUrl: '',
      editUrl: '',
      paymentlistShow: true,
      showBatchPayAllow: false,
      operationSelector: [
        // { name: '线上支付', actionUrl: 'payAction', nodisplay: ['offline', 'online', 'failed', 'cancel'], nodisplayProp: 'paybillPayStatus' }, //add check
        // { name: '线下支付', actionUrl: 'offLinePayAction', nodisplay: ['offline', 'online', 'cancel'], nodisplayProp: 'paybillPayStatus' },
        // { name: '取消支付', actionUrl: 'canclePayAction', nodisplay:['offline','online','cancel'], nodisplayProp: 'paybillPayStatus'},
      ],
      tableData: [],
      paymentObject: {},
      extraParams: {
        // paybillPayStatus: 'pend',
        paybillPayType: 'platform'
      },
      exportPayLstS,
      searchModelDefault: {
        paybillPayStatus: 'pend'
      },
      dialogControl: {
        visible: false,
        num: 0,
        status: null,
        btnDisabled: false,
        codes: []
      },
      dialogRepealPayCtrl: {
        visible: false,
        params: {
          title: '',
          code: '',
          payPassword: null
        },
        btnDisabled: false,
      },
      dialogActionDisable: false,
      projectName: JSON.parse(localStorage.getItem('appInfo')).projectName
    }
  },
  methods: {
    // 线下支付成功后 ，撤回调用 唐侠的接口
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
        // self.$refs.eleList.dispatchQueryEvent();
        self.$refs['driverPaymentlst'].getData();
      });

    },
    closePayDialog() {

      this.batchPayDialog.visible = false;
      this.batchPayDialog.ListModel = [];
      this.batchPayDialog.comment = '';

    },
    // 批量线下支付 支付状态为待支付
    batchPayOffline() {
      const data = this.$refs['driverPaymentlst'].checkedBox;
      let rows = [];
      data.forEach((val) => {
        if (val.paybillPayStatus !== 'paid') {
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
    // 批量线下支付
    doBatchPayOffline(type) {
      let self = this;
      let finishedCount = this.batchPayDialog.ListModel.length;
      let successedCount = 0;
      let failedCount = 0;
      this.loading = true;

      this.dialogActionDisable = true;
      this.batchPayDialog.ListModel.forEach(item => {
        // let data = { code: item.code, paybillPayStatus: 'offline', description: self.batchPayDialog.comment };
        let data = { code: item.code, paybillPayStatus: 'paid', description: self.batchPayDialog.comment };
        if (type == 'failed') { data.paybillPayStatus = 'failed' };
        modifyPaybillStatus(data, function(ret, err) {
          if (ret) {
            successedCount++;
          } else {
            failedCount++;
          }
          if (finishedCount == successedCount + failedCount) {
            self.dialogActionDisable = false;
            let msg = `请求成功${successedCount}条单据，失败${failedCount}条单据`;
            self.closePayDialog();
            self.loading = false;
            // self.$refs.eleList.dispatchQueryEvent();
            // window.location.reload();
            self.$refs['driverPaymentlst'].getData();
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
    // 点击确定 修改收款人按钮
    dialogSubmitPayee() {
      let arr = [];
      const data = this.$refs['driverPaymentlst'].checkedBox; // 拿到的就是 勾选的
      // data.forEach(item => {
      //   if (item.paybillPayStatus != 'offline' && item.paybillPayStatus != 'online' && item.payeeType == 2) {
      //     arr.push(item);
      //   }
      // })
      data.forEach(item => {
        if (item.paybillPayStatus != 'paid' && item.payeeType == 2) {
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


      let arr = [];
      const data = this.$refs['driverPaymentlst'].checkedBox; // 拿到的就是 勾选的
      // data.forEach(item => {
      //   if (item.paybillPayStatus != 'offline' && item.paybillPayStatus != 'online' && item.payeeType == 2) {
      //     arr.push(item);
      //   }
      // })
      data.forEach(item => {
        if (item.paybillPayStatus != 'paid' && item.payeeType == 2) {
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
    // 批量控制
    batchControl() {
      this.dialogControl.codes = [];
      const data = this.$refs['driverPaymentlst'].checkedBox;
      data.forEach((val) => {
        // if (val.checked) {
        this.dialogControl.codes.push(val.code);
        // }
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
    // 批量控制网络请求
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

    getColumn(cb) {
      const result = {
        "code": 200,
        "content": [{
            "showName": "单车付款单号",
            "elementCode": "text",
            "extraParams": "{\"field1\":\"paybillNo\",\"placeholder1\":\"请输入\"}",
            "fieldConfigCode": "paybillNo"
          },
          {
            "showName": "付款单类型",
            "elementCode": "label",
            "extraParams": {
              "field1": "paybillType",
              "detailLinkVisiable": "false",
              "options1": ["单车", "单项"],
              "optionsValue1": ["order", "item"]
            },
            "fieldConfigCode": "paybillType"
          },
          {
            "showName": "账单号",
            "elementCode": "text",
            "extraParams": "{\"field1\":\"brokerBillNo\",\"placeholder1\":\"请输入\"}",
            "fieldConfigCode": "brokerBillNo"
          },
          {
            "showName": "支付状态",
            "elementCode": "label",
            "extraParams": {
              "field1": "paybillPayStatus",
              "detailLinkVisiable": "false",
              "options1": ["待支付", "已支付", "支付失败"],
              "optionsValue1": ["pend", "paid", "failed"]
            },
            "fieldConfigCode": "paybillPayStatus"
          },
          {
            "showName": "支付渠道",
            "elementCode": "label",
            "extraParams": {
              "field1": "paybillPayChannel",
              "detailLinkVisiable": "false",
              "options1": ["线下支付", "链金师支付", "工商银行支付", "包商银行支付"],
              "optionsValue1": ["offline", "ljs", "icbc", "bsb"]
            },
            "fieldConfigCode": "paybillPayChannel"
          },
          {
            "showName": "控制状态",
            "elementCode": "select",
            "extraParams": "{\"field1\":\"paybillFreezeStatus\",\"optionsValue1\":[\"freeze\",\"normal\"],\"options1\":[\"冻结\",\"正常\"]\}",
            "fieldConfigCode": "paybillFreezeStatus"
          }, {
            "showName": "收款人类型",
            "elementCode": "select",
            "extraParams": "{\"field1\":\"payeeType\",\"optionsValue1\":[\"1\",\"2\"],\"options1\":[\"组织\",\"司机\"]\}",
            "fieldConfigCode": "payeeType"
          }, {
            "showName": "收款人",
            "elementCode": "text",
            "extraParams": "{\"field1\":\"payeeName\",\"placeholder1\":\"请输入\"}",
            "fieldConfigCode": "payeeName"
          }, {
            "showName": "应付金额",
            "elementCode": "text",
            "extraParams": "{\"field1\":\"paymentAmount\",\"placeholder1\":\"请输入\"}",
            "fieldConfigCode": "paymentAmount"
          }, {
            "showName": "支付单位",
            "elementCode": "text",
            "extraParams": "{\"field1\":\"payerName\",\"placeholder1\":\"请输入\"}",
            "fieldConfigCode": "payerName"
          }, {
            "showName": "收款用户ID",
            "elementCode": "text",
            "extraParams": "{\"field1\":\"platformPayeeCode\",\"placeholder1\":\"请输入\"}",
            "fieldConfigCode": "platformPayeeCode"
          }, {
            "showName": "收款用户手机号",
            "elementCode": "text",
            "extraParams": "{\"field1\":\"payeePhone\",\"placeholder1\":\"请输入\"}",
            "fieldConfigCode": "payeePhone"
          }, {
            "showName": "运单号",
            "elementCode": "text",
            "extraParams": "{\"field1\":\"waybillNo\",\"placeholder1\":\"请输入\"}",
            "fieldConfigCode": "waybillNo"
          },
          {
            "showName": "车牌号",
            "elementCode": "popSelectTruck",
            "extraParams": "{\"field1\":\"truckLicenseNo\",\"field2\":\"truckCode\",\"field3\":\"truckCode\",\"required\":\"false\",\"detailLinkVisiable\":\"false\",\"maxLength1\":\"20\",\"placeholder1\":\"请输入车牌号匹配\",\"outputKey1\":\"truck\",\"outputKey3\":\"truck\",\"inputKey1\":\"truck.truckLicenseNo\",\"inputKey2\":\"truck.code\"}",
            "fieldConfigCode": "truckLicenseNo"
          },
          {
            "showName": "线路名称",
            "elementCode": "popSelectRoute",
            "extraParams": "{\"field1\":\"routeName\",\"readonly1\":\"TRUE\",\"field2\":\"routeCode\",\"field3\":\"routeCode\",\"required\":\"false\",\"detailLinkVisiable\":\"false\",\"maxLength1\":\"20\",\"placeholder1\":\"请输入线路名称\",\"outputKey1\":\"route\",\"outputKey3\":\"route\",\"inputKey1\":\"rates.routeName,route.routeName,logistics.routeName\",\"inputKey2\":\"route.code,rates.routeCode,logistics.routeCode\"}",
            "fieldConfigCode": "route"
          }, {
            "showName": "付款备注",
            "elementCode": "text",
            "extraParams": "{\"field1\":\"description\",\"placeholder1\":\"请输入\"}",
            "fieldConfigCode": "description"
          },
          {
            "showName": "支付时间",
            "elementCode": "date",
            "extraParams": "{\"field1\":\"paybillPayTime\",\"format1\":\"yyyy-MM-dd hh:mm:ss\",\"area\":\"other\",\"required\":\"false\",\"detailLinkVisiable\":\"false\",\"placeholder1\":\"请输入支付时间\"}",
            "fieldConfigCode": "paybillPayTime"
          }
        ]
      }
      cb(result, null)
    },
    getList({}, cb) {
      const ret = {
        "code": 200,
        "content": [{
          "paybillNo": "11211",
          "receiverAuid": "111111",
          "status": 1,
          "driverFullName": "1ddda",
          "settleDriverPayment": 21341,
          "paybillPayStatus": "paid",
          "paybillPayChannel": "ljs"
        }, {
          "paybillNo": "1121ss1",
          "receiverAuid": "111111",
          "status": 1,
          "driverFullName": "1ddda",
          "settleDriverPayment": 2123,
          "paybillPayStatus": "paid",
          "paybillPayChannel": "offline"
        }],
        "total": 2
      }
      cb(ret, null)
    },
    deleteFun() {
      const ret = {
        "code": 200,
        "content": true
      };
      return (ret, null)
    },
    getSearch(cb) {
      const ret = {
        "code": 200,
        "content": [{
            "showName": "单车付款单号",
            "elementCode": "text",
            "extraParams": "{\"field1\":\"paybillNo\",\"placeholder1\":\"请输入\"}",
            "fieldConfigCode": "paybillNo"
          },
          {
            "showName": "付款单类型",
            "elementCode": "select",
            "extraParams": {
              "field1": "paybillType",
              "detailLinkVisiable": "false",
              "options1": ["单车", "单项"],
              "optionsValue1": ["order", "item"]
            },
            "fieldConfigCode": "paybillType"
          },
          {
            "showName": "账单号",
            "elementCode": "text",
            "extraParams": "{\"field1\":\"brokerBillNo\",\"placeholder1\":\"请输入\"}",
            "fieldConfigCode": "brokerBillNo"
          },
          {
            "showName": "支付状态",
            "elementCode": "select",
            "extraParams": {
              "field1": "paybillPayStatus",
              "detailLinkVisiable": "false",
              "options1": ["待支付", "已支付", "支付失败"],
              "optionsValue1": ["pend", "paid", "failed"]
            },
            "fieldConfigCode": "paybillPayStatus"
          },
          {
            "showName": "支付渠道",
            "elementCode": "select",
            "extraParams": {
              "field1": "paybillPayChannel",
              "detailLinkVisiable": "false",
              "options1": ["线下支付", "链金师支付", "工商银行支付", "包商银行支付"],
              "optionsValue1": ["offline", "ljs", "icbc", "bsb"]
            },
            "fieldConfigCode": "paybillPayChannel"
          },
          {
            "showName": "收款人类型",
            "elementCode": "select",
            "extraParams": "{\"field1\":\"payeeType\",\"optionsValue1\":[\"1\",\"2\"],\"options1\":[\"组织\",\"司机\"]\}",
            "fieldConfigCode": "payeeType"
          }, {
            "showName": "收款人",
            "elementCode": "text",
            "extraParams": "{\"field1\":\"payeeName\",\"placeholder1\":\"请输入\"}",
            "fieldConfigCode": "payeeName"
          }, {
            "showName": "支付单位",
            "elementCode": "text",
            "extraParams": "{\"field1\":\"payerName\",\"placeholder1\":\"请输入\"}",
            "fieldConfigCode": "payerName"
          }, {
            "showName": "收款用户ID",
            "elementCode": "text",
            "extraParams": "{\"field1\":\"platformPayeeCode\",\"placeholder1\":\"请输入\"}",
            "fieldConfigCode": "platformPayeeCode"
          }, {
            "showName": "收款用户手机号",
            "elementCode": "text",
            "extraParams": "{\"field1\":\"payeePhone\",\"placeholder1\":\"请输入\"}",
            "fieldConfigCode": "payeePhone"
          }, {
            "showName": "运单号",
            "elementCode": "text",
            "extraParams": "{\"field1\":\"waybillNo\",\"placeholder1\":\"请输入\"}",
            "fieldConfigCode": "waybillNo"
          },
          {
            "showName": "车牌号",
            "elementCode": "text",
            "extraParams": "{\"field1\":\"truckLicenseNo\",\"placeholder1\":\"请输入车牌号\"}",
            "fieldConfigCode": "truckLicenseNo"
          },
          {
            "showName": "线路名称",
            "elementCode": "text",
            "extraParams": "{\"field1\":\"routeName\",\"placeholder1\":\"请输入线路名称\"}",
            "fieldConfigCode": "route"
          },
          {
            "showName": "支付时间",
            "elementCode": "dateRange",
            "extraParams": "{\"field1\":\"from_paybillPayTime\",\"field3\":\"to_paybillPayTime\",\"format1\":\"yyyy-MM-dd HH:mm:ss\",\"format3\":\"yyyy-MM-dd HH:mm:ss\",\"default2\":\"到\"}",
            "fieldConfigCode": "paybillPayTime"
          }
        ]
      }
      cb(ret, null)
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
      this.paymentlistShow = false
      // this.tableData = [];
      // this.tableData.push(row)
      //push lst to cache
      const ret = []
      ret.push(row)
      paycart(ret)
      urlRedirect('../payment/index.html', '支付账单');
    },
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
          self.loadinglst()
        })
      }
    },
    handleoffLinePayAction(row) {
      if (row.paybillFreezeStatus == 'freeze') {
        this.$message({
          type: 'warning',
          message: '冻结状态不可支付',
          duration: 1000
        });
        return;
      }

      this.paymentObject.title = '线下支付提示'
      this.paymentObject.row = row
      this.$refs['paymentDialog'].init()
    },
    handlecanclePayAction(row) {
      this.paymentObject.title = '取消支付提示'
      this.paymentObject.row = row
      this.$refs['paymentDialog'].init()
    },
    loadinglst() {
      console.log('loading')
      this.$refs['driverPaymentlst'].getData()
    },
    doIdPrint(row) {
      console.log('id print now and data is', row);
      let url = `/printDoc/id.html?userCode=${row.platformDriverCode}`;
      window.open(url);
    },
    doCertificatePrint(row) {
      console.log('certificate print now and data is', row);
      let url = `/printDoc/certificate.html?userCode=${row.platformDriverCode}&paymentAmount=${row.paymentAmount}`;
      window.open(url);
    },
    doDeclarationPrint(row) {
      console.log('declaration print now and data is', row);
      let url = `/printDoc/declaration.html?userCode=${row.platformDriverCode}&paymentAmount=${row.paymentAmount}`;
      window.open(url);
    }
  },
  mounted() {
    // this.$refs.driverPaymentlst.searchModel.paybillPayStatus = 'pend';
  },
  created() {

    if (checkPermission('opr.wuche.offlinepay')) {
      this.operationSelector.push({ name: '线下支付', actionUrl: 'offLinePayAction', nodisplay: ['paid', 'failed'], nodisplayProp: 'paybillPayStatus' })
    }

    if (checkPermission('opr.wuche.walletpay')) {
      this.operationSelector.unshift({ name: '线上支付', actionUrl: 'payAction', nodisplay: ['paid', 'failed'], nodisplayProp: 'paybillPayStatus' })
      this.showBatchPayAllow = true
    }
    if (checkPermission('opr.wuche.repealPay')) {
      this.operationSelector.push({ name: '撤回支付', actionUrl: 'rollbackpayAction', nodisplay: ['pend', 'failed'], nodisplayProp: 'paybillPayStatus', extra: { key1: 'paybillPayChannel', val1: 'ljs' } })

      this.operationSelector.push({ name: '撤回支付', actionUrl: 'rollbackpayActionOffline', nodisplay: ['pend', 'failed'], nodisplayProp: 'paybillPayStatus', extra: { key1: 'paybillPayChannel', val1: 'offline' } })
    }
  }
};

</script>
<style lang="scss" rel="stylesheet/scss">
// 弹框 处理 start ========
.payee-page {
  .el-dialog--large {
    position: fixed;
    top: 0 !important;
  }
}

#listDriverPayment {
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
}



.v-modal {
  z-index: 1000 !important;
}

// 弹框 处理 end ========

</style>
