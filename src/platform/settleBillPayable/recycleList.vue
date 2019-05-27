<template>
  <div>
    <ele-list :selectable="false" :operatable="false"
              :showImportButton="false" :showDownloadTemplate="false" :showExportButton="false"
              :showBatchBtn1="false" :showBatchBtn2="false"
              :batchBtn1Name="batchBtn1Name" :batchBtn2Name="batchBtn2Name"
              @batchOpr1="batchOpr1_" @batchOpr2="batchOpr2_"
              @query="query" @ready="onReady" @action="action"
              :total="total" :loading="loading"
              :list-data="listData"
              ref="eleList"
              :needAdd="false"
              :getColumn="getColumn"
              :getList="getList"
              :getSearch="getSearch"
              :footerEnable="false"
              :editUrl="editUrl"
              :exportCsv="exportCsv"
              :objectName="objectName">
    </ele-list>
    <!-- 审核弹窗 -->
    <el-dialog :title="approveDialogTitle" :visible.sync="approveDialogVisible">
      <el-form :model="approveForm">
        <el-form-item :label="`${batchApproveLabel}请输入审核意见或理由`">
          <el-input type="textarea" v-model="approveForm.description" placeholder="请输入内容" :rows="10" :autosize="{ minRows: 10 }"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="approveDialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="handleApproveSuccess()">审核通过</el-button>
        <el-button type="primary" @click="handleApproveFail()">审核不通过</el-button>
      </div>
    </el-dialog>
    <!-- 备注弹窗 -->
    <el-dialog :title="desDialog.title" :visible.sync="desDialog.show">
      <el-form :model="desDialog" label-width="100px" :inline="inline">
        <h3 class="des-tit">{{ desDialog.msg }}</h3>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="desDialog.description" placeholder="请输入备注信息" :rows="2" :autosize="{ minRows: 2 }"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="desDialog.show = false">关闭</el-button>
        <el-button type="primary" @click="desConfirm()">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  /* eslint-disable no-unused-vars */

  import eleList from '../../components/ele-list/eleList.vue';
  import { urlRedirect, checkPermission } from '../../../api/Utils';
  import { settlePayableList, settlePayableAllList, getPayableColumnRecycle, settlePayableListSearch, settlePayableApplyApprove, settlePayableApprove,
  settlePayableRevokeApplyApprove, settlePayableRevokeApprove, settlePayableCancel, settlePayableInvoice, settlePayableRevokeInvoice, settlePayableReceived , exportCsvPlatformBrokerBill, exportCsvBrokerBill } from '../../../api/PlatformSettleBillService';

  export default {
    name: 'recycleList',
    components: {
      'ele-list': eleList
    },
    props: {
      params: {
        type: Object,
        'default': function () {
          return {};
        }
      }
    },
    data: () => {
      return {
        batchBtn1Name: '批量提交审核',
        batchBtn2Name: '批量审核账单',
        showBatchBtn1: localStorage.getItem('orgType') !== '1',
        showBatchBtn2: false,
        listData: [],
        total: 0,
        loading: true,
        getColumn: getPayableColumnRecycle,
        getList: localStorage.getItem('orgType') !== '1' ? settlePayableList : settlePayableAllList,
        getSearch: settlePayableListSearch,
        objectName: localStorage.getItem('orgType') == '1' ? '应收客户账单回收站' : '应付平台账单回收站',
        editUrl: '/platform/settleBillPayable/create.html',
        batchApplyNum: 0,
        batchApproveNum: 0,
        batchApproveList: [],
        batchApproveLabel: '',
        approveDialogVisible: false,
        approveDialogTitle: '批量审核账单',
        approveForm: {
          description: ''
        },
        exportCsv: localStorage.getItem('orgType') == '1' ? exportCsvPlatformBrokerBill : exportCsvBrokerBill,
        desDialog: {
          code: '',
          actionCode: '',
          show: false,
          title: '',
          msg: '',
          description: ''
        },
        inline: true
      };
    },
    methods: {
      onReady() {
        console.log('ready now');
      },
      openWindow(url, title) {
        urlRedirect(url, title);
      },
      action(command, menu, model) {
        switch (command) {
          // 提交审核
          case 'applyApprove':
            this.applyApprove(model.code);
            break;
          // 撤回提交审核
          case 'revokeApply':
            this.revokeApply(model.code);
            break;
          // 审核账单
          case 'approve':
            this.approve(model.code);
            break;
          // 撤回审核
          case 'revokeApprove':
            this.revokeApprove(model.code);
            break;
          // 编辑
          case 'edit':
            this.openWindow(`/platform/settleBillPayable/select_waybill.html?billCode=${model.code}`, '编辑应收账单-选择运单');
            break;
          // 开票
          case 'invoice':
            // this.invoice(model.code);
            this.showDesDialog(model.code, 'invoice', '开票确认', '确认本账单已经开票完成了吗？');
            break;
          // 撤回开票
          case 'revokeInvoice':
            // this.revokeInvoice(model.code);
            this.showDesDialog(model.code, 'revokeInvoice', '撤回开票', '确认撤回本账单的开票状态吗？');
            break;
          // 确认收款
          case 'receive':
            // this.receive(model.code);
            this.showDesDialog(model.code, 'receive', '确认收款', '确认本账单已收款完成了吗？');
            break;
          // 作废账单
          case 'destroy':
            this.destroy(model.code);
            break;
          default:
            break;
        }
      },
      showDesDialog(code, actionCode, title, message) {
        this.desDialog.show = true;
        this.desDialog.code = code;
        this.desDialog.actionCode = actionCode;
        this.desDialog.title = title;
        this.desDialog.msg = message;
      },
      desConfirm() {
        const funObj = {
          invoice: settlePayableInvoice,
          revokeInvoice: settlePayableRevokeInvoice,
          receive: settlePayableReceived
        };
        funObj[this.desDialog.actionCode](this.desDialog.code, { description: this.desDialog.description }, (success, error) => {
          if (error || success.code !== 200) {
            this.$message({
              type: 'error',
              message: error.content,
              duration: 1000
            });
          }
          if (success) {
            this.$message({
              type: 'success',
              message: '操作成功！',
              duration: 1000
            });
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }
        });
      },
      batchOpr1_() {
        const that = this,
          list = [];
        this.listData.forEach((item) => {
          // 待提交审核，审核不通过
          if (item.checked && (item.billStatus === 'none' || item.billStatus === 'reject')) {
            list.push(item.code);
          }
        });
        if (!list.length) {
          this.$message({
            type: 'warning',
            message: '请选择待提交审核记录！',
            duration: 1000
          });
          return;
        }
        this.$msgbox({
          title: '提示',
          message: `共选中${list.length}条"待提交审核"状态的账单， 您确认批量提交审核这些账单吗？`,
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '执行中...';
              that.batchApplyNum = list.length;
              list.forEach((item) => {
                settlePayableApplyApprove(item, (success, error) => {
                  that.batchApplyNum -= 1;
                  if (that.batchApplyNum === 0) {
                    this.$message({
                      type: 'success',
                      message: '批量提交审核成功',
                      duration: 1000
                    });
                    instance.confirmButtonLoading = false;
                    done();
                    that.$refs.eleList.dispatchQueryEvent();
                  }
                });
              });
            } else {
              done();
            }
          }
        });
      },
      batchOpr2_() {
        const that = this,
          list = [];
        this.listData.forEach((item) => {
          if (item.checked && item.billStatus === 'pend') {
            list.push(item.code);
          }
        });
        if (list.length) {
          that.batchApproveList = list;
          that.batchApproveLabel = `共选中${list.length}条“待审核”状态的账单，`;
          that.approveDialogVisible = true;
          that.approveDialogTitle = '批量审核账单';
        } else {
          this.$message({
            type: 'warning',
            message: '请选择待审核记录！',
            duration: 1000
          });
        }
      },
      applyApprove(code) {
        const that = this;
        this.$msgbox({
          title: '提示',
          message: '您确认提交审核这笔账单吗？',
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '执行中...';
              settlePayableApplyApprove(code, (success, error) => {
                if (error) {
                  this.$message({
                    type: 'success',
                    message: error.content,
                    duration: 1000
                  });
                }
                if (success) {
                  this.$message({
                    type: 'success',
                    message: '提交审核成功',
                    duration: 1000
                  });
                  instance.confirmButtonLoading = false;
                  done();
                  that.$refs.eleList.dispatchQueryEvent();
                }
              });
            } else {
              done();
            }
          }
        });
      },
      revokeApply(code) {
        const that = this;
        this.$msgbox({
          title: '提示',
          message: '您确认要撤回提交审核这笔账单吗？账单将回到"待提交审核"状态，并可以编辑。',
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '执行中...';
              settlePayableRevokeApplyApprove(code, (success, error) => {
                if (error) {
                  this.$message({
                    type: 'success',
                    message: error.content,
                    duration: 1000
                  });
                }
                if (success) {
                  this.$message({
                    type: 'success',
                    message: '撤回提交审核成功！',
                    duration: 1000
                  });
                  instance.confirmButtonLoading = false;
                  done();
                  that.$refs.eleList.dispatchQueryEvent();
                }
              });
            } else {
              done();
            }
          }
        });
      },
      approve(code) {
        const that = this;
        that.batchApproveList = [code];
        that.batchApproveLabel = '';
        that.approveDialogVisible = true;
        that.approveDialogTitle = '审核账单';
      },
      handleApproveFail() {
        const that = this;
        let label = '笔';
        if (that.batchApproveList.length > 1) {
          label = '批';
        }
        this.$msgbox({
          title: '提示',
          message: `您确认审核不通过这${label}账单吗？`,
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '执行中...';
              that.batchApproveNum = that.batchApproveList.length;
              that.batchApproveList.forEach((item) => {
                settlePayableApprove(item, { billStatus: 'reject', description: that.approveForm.description }, (success, error) => {
                  that.batchApproveNum -= 1;
                  if (that.batchApproveNum === 0) {
                    this.$message({
                      type: 'success',
                      message: '审核通过操作成功！',
                      duration: 1000
                    });
                    that.approveDialogVisible = false;
                    instance.confirmButtonLoading = false;
                    done();
                    that.$refs.eleList.dispatchQueryEvent();
                  }
                });
              });
            } else {
              done();
            }
          }
        });
      },
      handleApproveSuccess() {
        const that = this;
        let label = '笔';
        if (that.batchApproveList.length > 1) {
          label = '批';
        }
        this.$msgbox({
          title: '提示',
          message: `您确认审核通过这${label}账单吗？`,
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '执行中...';
              that.batchApproveNum = that.batchApproveList.length;
              that.batchApproveList.forEach((item) => {
                settlePayableApprove(item, { billStatus: 'accept', description: that.approveForm.description }, (success, error) => {
                  if (error || success.code !== 200) {
                    this.$message({
                      type: 'warning',
                      message: `${error.content}！`,
                      duration: 3000
                    });
                    setTimeout(() => {
                      window.location.reload();
                    }, 3000);
                  }
                  if (success) {
                    that.batchApproveNum -= 1;
                    if (that.batchApproveNum === 0) {
                      this.$message({
                        type: 'success',
                        message: '审核通过操作成功！',
                        duration: 1000
                      });
                      that.approveDialogVisible = false;
                      instance.confirmButtonLoading = false;
                      done();
                      that.$refs.eleList.dispatchQueryEvent();
                    }
                  }
                });
              });
            } else {
              done();
            }
          }
        });
      },
      revokeApprove(code) {
        const that = this;
        this.$msgbox({
          title: '提示',
          message: '您确认要撤回审核这笔账单吗？账单将回到"待审核"状态。',
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '执行中...';
              settlePayableRevokeApprove(code, (success, error) => {
                if (error) {
                  this.$message({
                    type: 'success',
                    message: error.content,
                    duration: 1000
                  });
                }
                if (success) {
                  this.$message({
                    type: 'success',
                    message: '撤回提交审核成功！',
                    duration: 1000
                  });
                  instance.confirmButtonLoading = false;
                  done();
                  that.$refs.eleList.dispatchQueryEvent();
                }
              });
            } else {
              done();
            }
          }
        });
      },
      invoice(code) {
        const that = this;
        this.$msgbox({
          title: '提示',
          message: '您确认已经开票了吗？',
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '执行中...';
              settlePayableInvoice(code, (success, error) => {
                if (error) {
                  this.$message({
                    type: 'success',
                    message: error.content,
                    duration: 1000
                  });
                }
                if (success) {
                  this.$message({
                    type: 'success',
                    message: '确认开票成功！',
                    duration: 1000
                  });
                  instance.confirmButtonLoading = false;
                  done();
                  that.$refs.eleList.dispatchQueryEvent();
                }
              });
            } else {
              done();
            }
          }
        });
      },
      revokeInvoice(code) {
        const that = this;
        this.$msgbox({
          title: '提示',
          message: '您确认撤回开票吗？',
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '执行中...';
              settlePayableRevokeInvoice(code, (success, error) => {
                if (error) {
                  this.$message({
                    type: 'success',
                    message: error.content,
                    duration: 1000
                  });
                }
                if (success) {
                  this.$message({
                    type: 'success',
                    message: '撤回开票成功！',
                    duration: 1000
                  });
                  instance.confirmButtonLoading = false;
                  done();
                  that.$refs.eleList.dispatchQueryEvent();
                }
              });
            } else {
              done();
            }
          }
        });
      },
      receive(code) {
        const that = this;
        this.$msgbox({
          title: '提示',
          message: '您确认已经收款了吗？',
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '执行中...';
              settlePayableReceived(code, (success, error) => {
                if (error) {
                  this.$message({
                    type: 'success',
                    message: error.content,
                    duration: 1000
                  });
                }
                if (success) {
                  this.$message({
                    type: 'success',
                    message: '确认收款成功！',
                    duration: 1000
                  });
                  instance.confirmButtonLoading = false;
                  done();
                  that.$refs.eleList.dispatchQueryEvent();
                }
              });
            } else {
              done();
            }
          }
        });
      },
      destroy(code) {
        const that = this;
        this.$msgbox({
          title: '提示',
          message: '您确认要作废这笔账单吗？账单作废后将归到"已作废"类别，并不可再编辑。',
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '执行中...';
              settlePayableCancel(code, (success, error) => {
                if (success) {
                  this.$message({
                    type: 'success',
                    message: '作废账单成功！',
                    duration: 1000
                  });
                  instance.confirmButtonLoading = false;
                  done();
                  that.$refs.eleList.dispatchQueryEvent();
                }
              });
            } else {
              done();
            }
          }
        });
      },
      query(searchParams) {
        const self = this;
        this.total = 0;
        this.loading = true;
        self.listData = [];
        Object.assign(searchParams, this.params, { 'deleted' : true });
        this.getList(searchParams, (success, error) => {
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
              const actionList = [],
                orgType = localStorage.getItem('orgType');
              // S端（orgType = 1）的权限：
              // 应付平台管理  
              // 查看列表  opr.wuche.settleBillPayable
              // 审核账单  opr.wuche.checkSettleBillPayable
              // 撤销审核  opr.wuche.repealCheck
              // 收款确认  opr.wuche.confirmReceipt
              // 开票确认  opr.wuche.confirmInvoice
              // 撤回开票  opr.wuche.repealInvoice

              // B（orgType = 3）/b（orgType = 2）的权限： 
              // 创建应付账单  wuche.SettleBillPayable.add
              // 应付平台管理  
              // 查看列表  wuche.settleBillPayable.get
              // 编辑账单  wuche.settleBillPayable.edit
              // 作废账单  wuche.settleBillPayable.invalid
              // 提交审核  wuche.settleBillPayable.submit
              if (orgType !== "1") {
                // 账单状态为待提交审核或审核不通过
                if (data.billStatus === 'none' || data.billStatus === 'reject') {
                  // 提交审核
                  if (checkPermission("wuche.settleBillPayable.submit")) {
                    actionList.push({ key: 'applyApprove', name: '提交审核' });
                  }
                  // 编辑账单
                  if (checkPermission("wuche.settleBillPayable.edit")) {
                    actionList.push({ key: 'edit', name: '编辑账单' });
                  }
                  // 作废账单
                  if (checkPermission("wuche.settleBillPayable.invalid")) {
                    actionList.push({ key: 'destroy', name: '作废账单' });
                  }
                }
              } else {
                // 账单状态为待审核
                if (data.billStatus === 'pend') {
                  // 审核账单
                  if (checkPermission("opr.wuche.checkSettleBillPayable")) {
                    actionList.push({ key: 'approve', name: '审核账单' });
                  }
                }
                // 账单状态为审核通过
                if (data.billStatus === 'accept') {
                  // 未收款
                  if (data.receivableStatus === 'none') {
                    // 收款确认
                    if (checkPermission("opr.wuche.confirmReceipt")) {
                      actionList.push({ key: 'receive', name: '收款确认' });
                    }
                    // 撤回审核
                    if (checkPermission("opr.wuche.repealCheck")) {
                      actionList.push({ key: 'revokeApprove', name: '撤回审核' });
                    }
                  }
                  // 收款完成且未开票
                  if (data.receivableStatus === 'all' && data.invoiced === 'no') {
                    // 开票确认
                    if (checkPermission("opr.wuche.confirmInvoice")) {
                      actionList.push({ key: 'invoice', name: '开票确认' });
                    }
                  }
                  // 收款完成且开票完成
                  if (data.receivableStatus === 'all' && data.invoiced === 'yes') {
                    // 撤回开票
                    if (checkPermission("opr.wuche.repealInvoice")) {
                      actionList.push({ key: 'revokeInvoice', name: '撤回开票' });
                    }
                  }
                }
              }
              // actionList.push({ key: 'invoice', name: '开票确认' });
              // actionList.push({ key: 'revokeInvoice', name: '撤回开票' });
              // actionList.push({ key: 'receive', name: '收款确认' });
              data.actionMenuList = actionList;
            });
            self.listData = success.content;
            this.loading = false;
          }
        });
      }
    },
    mounted() {
      const orgType = localStorage.getItem('orgType');
      // S账号默认搜索全部
      if (orgType === "1") {
        this.$refs.eleList.searchModel.billStatus = 'pend,accept,reject,destroy';
      }
      this.$nextTick(() => {
        this.$refs.eleList.dispatchQueryEvent();
      });
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
.des-tit {
  font-size: 16px;
  text-align: center;
  padding: 20px;
}
.grey-section {
  padding: 10px 10px 0;
  margin: 10px;
  background-color: #f8f8f8;
  border: solid 1px #e8e8e8;
  .el-col {
    margin-bottom: 10px;
  }
}
.unit {
  position: absolute;
  top: 0;
  right: 5px;
  color: #999;
}
.form-section {
  .el-col-8 {
    .el-input {
      width: 140px;
    }
  }
  .el-col-24 {
    .el-form-item {
      display: block;
      .el-form-item__label {
        float: left;
      }
      .el-form-item__content {
        display: block;
        margin-left: 100px;
      }
    }
  }
}
.el-dialog__body .form-section .el-date-editor {
  width: 180px !important;
}
</style>

