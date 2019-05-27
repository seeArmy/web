/** * list.vue * 销项发票列表 * Created by cc on 17/12/6. */
<template>
  <div>
    <ele-list :selectable="selectable" :operatable="operatable" :showImportButton="false" :showDownloadTemplate="false" :showExportButton="false" @query="query" @ready="query" @action="action" @more="more" @exportData="exportData" :total="total" :loading="loading" :list-data="listData" ref="eleList" :customColumn="customColumn" :params="params" :needPage="needPage" :isAdvanced="isAdvanced" :deleteFun="deleteFun" :add="add" :downloadErrorData="downloadErrorData" :downloadTemplate="downloadTemplate" :importUrl="importUrl" :editUrl="editUrl" :getColumn="getColumn" :getList="getList" :exportCsv="exportCsv" :getSearch="getSearch" :folder="folder" :objectName="objectName">
    </ele-list>
    <el-dialog title="审核发票" :visible.sync="dialogAuditVisible">
      <el-form :model="auditForm" ref="auditForm" :rules="auditRules" label-width="120px">
        <el-form-item label="销项系统号" prop="outputNo">
          {{ auditForm.outputNo }}
        </el-form-item>
        <el-form-item label="审核结果" prop="status">
          <el-radio-group v-model="auditForm.status">
            <el-radio :label="'accept'">审核通过</el-radio>
            <el-radio :label="'reject'">审核不通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="原因备注" prop="description">
          <el-input type="textarea" v-model="auditForm.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAudit()">取 消</el-button>
        <el-button type="primary" @click="submitAudit('auditForm')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="记录开票" :visible.sync="dialogRecordVisible">
      <el-form :model="recordForm" ref="recordForm" :rules="recordRules" label-width="120px">
        <el-form-item label="销项系统号" prop="outputNo">
          {{ recordForm.outputNo }}
        </el-form-item>
        <el-form-item label="发票号" prop="invoiceNo">
          <el-input v-model="recordForm.invoiceNo"></el-input>
        </el-form-item>
        <el-form-item label="开票日期" prop="invoiceTime">
          <el-date-picker type="date" v-model="recordForm.invoiceTime"></el-date-picker>
        </el-form-item>
        <el-form-item label="归属年月" prop="year">
          <el-date-picker type="date" v-model="recordForm.attributionDate" format="yyyy-MM"></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelRecord()">取 消</el-button>
        <el-button type="primary" @click="submitRecord('recordForm')">确认已开票</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script type="text/ecmascript-6">
import eleList from '../components/ele-list/eleList.vue';
import { urlRedirect } from '../../api/Utils';
import { sendLygByRobot, getColumn, list, getSearch, deleted, exportCsv, add, downloadErrorData, downloadTemplate, invoiced, audit, addLyg, sendLyg } from '../../api/OutputInvoiceService';
import * as ApiConst from '../../api/ApiConst';

import { get as partnerGet } from '../../api/PartnerService';



export default {
  name: 'outputInvoice',
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
    params: {
      type: Object,
      'default': function() {
        return {};
      }
    }
  },
  data: () => {
    return {
      folder: 'settle/outputVatInvoice',
      listData: [],
      total: 0,
      loading: true,
      getColumn,
      getList: list,
      getSearch,
      objectName: '销项发票',
      addUrl: '/outputInvoice/add.html',
      editUrl: '/outputInvoice/add.html',
      listUrl: '/outputInvoice/list.html',
      deleteFun: deleted,
      exportCsv,
      add,
      downloadErrorData,
      importUrl: `${ApiConst.apiSettleDomain}/import/custom/output_vat_invoice`,
      downloadTemplate,
      invoicedFun: invoiced,
      auditFun: audit,
      sendLyhFun: addLyg,
      sendLyhLocalFun: sendLyg,
      dialogAuditVisible: false,
      auditForm: {
        code: '',
        outputNo: '',
        status: '',
        description: ''
      },
      auditRules: {
        status: [
          { required: true, message: '请选择审核结果', trigger: 'change' }
        ]
      },
      dialogRecordVisible: false,
      recordForm: {
        code: '',
        outputNo: '',
        invoiceNo: '',
        invoiceTime: '',
        attributionDate: ''
      },
      recordRules: {
        invoiceNo: [
          { required: true, message: '请输入发票号', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    openWindow(url, title) {
      urlRedirect(url, title);
    },
    more(model) {

      this.openWindow(`${this.listUrl}?objectName=${this.objectName}&${this.toParameterArray(model).join('&')}`, `${this.objectName}列表`);
    },
    doRemove(model) {
      const self = this;
      this.$msgbox({
        title: '确认',
        message: `确认要作废该${this.objectName}吗？`,
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
                  message: '作废成功',
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
    doSubmit(model) {
      const self = this;
      this.$msgbox({
        title: '确认',
        message: `确认要提交审核该${this.objectName}吗？`,
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = '执行中...';
            this.auditFun({ code: model.code, status: 'pend' }, (success, error) => {
              if (success) {
                this.$message({
                  type: 'success',
                  message: '提交发送成功',
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
        self.$refs.eleList.dispatchQueryEventSavePage();
      });
    },
    doWithdraw(model) {
      const self = this;
      this.$msgbox({
        title: '确认',
        message: `确认要撤回该${this.objectName}的审核提交吗？`,
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = '执行中...';
            this.auditFun({ code: model.code, status: 'none' }, (success, error) => {
              if (success) {
                this.$message({
                  type: 'success',
                  message: '撤回提交审核成功',
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
        self.$refs.eleList.dispatchQueryEventSavePage();
      });
    },
    doAudit(model) {
      this.dialogAuditVisible = true;
      this.auditForm.code = model.code;
      this.auditForm.outputNo = model.outputNo;
    },
    cancelAudit() {
      this.dialogAuditVisible = false;
    },
    submitAudit(formName) {
      let self = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const paramsObj = {
            code: this.auditForm.code,
            status: this.auditForm.status,
            description: this.auditForm.description
          };
          this.auditFun(paramsObj, (success, error) => {
            if (error || success.code !== 200) {
              this.$message({
                type: 'warning',
                message: `${error}`,
                duration: 1000
              });
            }
            if (success) {
              const msg = this.auditForm.status === 'accept' ? '审核通过' : '审核不通过';
              this.$message({
                type: 'success',
                message: `${msg}成功`,
                duration: 1000
              });
              this.dialogAuditVisible = false;
              setTimeout(() => {
                // window.location.reload();
                 self.$refs.eleList.dispatchQueryEventSavePage();
              }, 1000);
            }
          });
        } else {
          console.log('error submit');
        }
      });
    },
    doRecord(model) {
      this.dialogRecordVisible = true;
      this.recordForm.code = model.code;
      this.recordForm.outputNo = model.outputNo;
      this.recordForm.invoiceNo = model.invoiceNo,
        this.recordForm.invoiceTime = model.invoiceTime,
        this.recordForm.attributionDate = model.attributionDate;
    },
    netGetPayerOrgCode(code) {
      return new Promise((resolve, reject) => {
        partnerGet({'code':code}, (success, error) => {
          if (success && success.content && success.content.orgExternalNo) {
            resolve(success.content.orgExternalNo);
          } else {
            reject('请求购买方组织编码出错');
          }
        })
      })
    },
    doSend(model) {
      // 调用接口

      const model_copy = Object.assign({}, model);
      delete model_copy.actionMenuList;
      const obj_target = {};

      // obj_target.outputNo = model.billNo;  // 销项系统号  ??
      // obj_target.businessType = model.businessType; //业务类型
      // obj_target.billCode = model.billCode; //  应收账单编码
      // obj_target.billNo = model.billNo; //  应收账单编号

      obj_target.invoiceNo = model.outputNo; //  发票号  ???
      obj_target.status = model.status; //状态
      obj_target.invoiced = model.invoiced; //开票状态
      obj_target.invoiceType = model.invoiceType; //发票类型
      obj_target.invoiceTime = model.invoiceTime; //  开票日期  ???
      obj_target.year = model.year; //  年

      obj_target.payerOrgCode = model.orgNo; //  购买方组织编码 ？？

      obj_target.payerOrgName = model.payerOrgName;; //  购买方名称 ？？
      obj_target.payerOrgTaxNumber = model.payerOrgTaxNumber; //  购买方纳税人识别号 ？？
      obj_target.vatType = model.vatType;; //  税目类型 ？？
      obj_target.vatCategory = model.vatCategory; //  货物或服务 ？？
      obj_target.vatModel = model.vatModel; //  规格型号 ？？
      obj_target.vatUnitName = model.vatUnitName; //  单位 ？？
      obj_target.vatNumber = model.vatNumber;; //  数量 ？？
      obj_target.vatPriceType = model.vatPriceType; //  单价类型 ？？
      obj_target.vatPrice = model.vatPrice; //  单价 ？？
      obj_target.vatAmount = model.vatAmount; //  金额 ？？
      obj_target.vatTaxRate = model.vatTaxRate; //  税率 ？？
      obj_target.vatTaxAmount = model.vatTaxAmount; //  税额 ？？
      obj_target.excludeTaxAmount = model.excludeTaxAmount; //  不含税金额 ？？
      obj_target.capitalizedTotalAmount = model.capitalizedTotalAmount; //  价税合计（大写） ？？
      obj_target.totalAmount = model.totalAmount; // 价税合计（小写） ？？
      obj_target.description = model.description; // 价税合计（小写） ？？
      obj_target.creatorUsername = model.creatorUsername; // 价税合计（小写） ？？

      const self = this;
      this.$msgbox({
        title: '确认',
        message: `确认要发送${this.objectName}吗？`,
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = '执行中...';

            this.netGetPayerOrgCode(model.payerOrgCode).then((val) => {


              // val 就是 orgExternalNo
              if (val) {

                console.log('val ...',val);

                // return;

                // 到这里才是 真的请求数据
                obj_target.payerOrgCode = val;

                sendLygByRobot(obj_target, (success, error) => {
                  if (success) {
                    this.$message({
                      type: 'success',
                      message: '发送成功',
                      duration: 1000
                    });
                    done();
                    instance.confirmButtonLoading = false;
                  }
                  if (error) {

                    let errorMsg = error.message ? error.message : error;

                    this.$message({
                      type: 'warning',
                      message: `${errorMsg}`,
                      duration: 3000
                    });
                    instance.confirmButtonLoading = false;
                    done();
                  }
                  self.$refs.eleList.dispatchQueryEvent();
                });

              } else { // 传过来没有值
                done();
                instance.confirmButtonLoading = false;
                this.$message({
                  type: 'warning',
                  message: `请求购买方组织编码出错`,
                  duration: 2000
                });
              }

            }, (error) => {

              done();
              instance.confirmButtonLoading = false;
              this.$message({
                type: 'warning',
                message: `${error}`,
                duration: 1000
              });

            })

          } else {
            done();
          }
        }
      }).then(() => {
        self.$refs.eleList.dispatchQueryEvent();
      });

    },
    cancelRecord() {
      this.dialogRecordVisible = false;
    },
    submitRecord(formName) {
      let self = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const paramsObj = {
            code: this.recordForm.code,
            invoiceNo: this.recordForm.invoiceNo,
            invoiceTime: this.recordForm.invoiceTime,
            attributionDate: this.recordForm.attributionDate,
            invoiced: true
          };
          this.invoicedFun(paramsObj, (success, error) => {
            if (error || success.code !== 200) {
              this.$message({
                type: 'warning',
                message: `${error}`,
                duration: 1000
              });
            }
            if (success) {
              this.$message({
                type: 'success',
                message: '确认已开票成功',
                duration: 1000
              });
              this.dialogRecordVisible = false;
              setTimeout(() => {
                // window.location.reload();
                self.$refs.eleList.dispatchQueryEventSavePage();
              }, 1000);
            }
          });
        } else {
          console.log('error submit');
        }
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
        case 'submit':
          this.doSubmit(model);
          break;
        case 'withdraw':
          this.doWithdraw(model);
          break;
        case 'audit':
          this.doAudit(model);
          break;
        case 'record':
          this.doRecord(model);
          break;
        case 'send':
          this.doSend(model);
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
      self.listData = [];
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
          success.content.forEach((data) => {
            const actionList = [];
            // 待提交审核
            if (data.status === 'none') {
              actionList.push({ key: 'submit', name: '提交发票审核' });
              actionList.push({ key: 'remove', name: '作废' });
            }
            // 待审核
            if (data.status === 'pend') {
              actionList.push({ key: 'withdraw', name: '撤回提交审核' });
              actionList.push({ key: 'audit', name: '审核发票' });
              // actionList.push({ key: 'send', name: '发送' });
            }
            // 审核通过
            if (data.status === 'accept' && !data.invoiced) {
              actionList.push({ key: 'record', name: '记录开票' });
            }
            // 审核不通过
            if (data.status === 'reject') {
              actionList.push({ key: 'remove', name: '作废' });
            }

            actionList.push({ key: 'edit', name: '编辑' });
            // actionList.push({ key: 'send', name: '发送' });

            data.actionMenuList = actionList;
          });
          self.listData = success.content;
          this.loading = false;
        }
      });
    }
  },
  created() {

  }
};

</script>
<style lang="scss" rel="stylesheet/scss">


</style>
