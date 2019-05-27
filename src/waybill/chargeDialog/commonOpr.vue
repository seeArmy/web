<!-- 货单列表操作共用弹框 -->
/**
* common opr.vue
* Created by cc on 19/5/6.
*/
<template>
  <ele-dialog ref="dialog" :title="title" @submit="handleDone" @cancel="handleCancel" class="dialog-common-opr">
    <div class="common-opr-dialog">
      <!-- hd -->
      <div class="cod-hd">
        <ul class="text-list clearfix">
          <li>
            <span class="tl-tit">运单号：</span>
            <span class="tl-cont">
              {{ domainObject.waybillNo }}
            </span>
          </li>
          <li>
            <span class="tl-tit">车牌号：</span>
            <span class="tl-cont">
              {{ domainObject.truckLicenseNo }}
            </span>
          </li>
          <li v-if="showRelate">
            <span class="tl-tit">关联付款单号：</span>
            <span class="tl-cont">
              {{ listData.chargeItemPaybillNo || listData.paybillNo}}
            </span>
          </li>
          <li v-if="showRelate">
            <span class="tl-tit">付款状态：</span>
            <span class="tl-cont">
              {{ paymentStatus }}
            </span>
          </li>
        </ul>
      </div>
      <!-- bd -->
      <div class="cod-bd">
        <div class="el-row">
          <div class="el-col-12">
            <h3 v-if="showAfterTitle">修改后</h3>
            <ul class="text-list edit-after">
              <li>
                <span class="tl-tit">费用名称：</span>
                <span class="tl-cont">
                  {{ listData.chargeItemName }}
                </span>
              </li>
              <li>
                <span class="tl-tit">数量：</span>
                <span class="tl-cont">
                  <span class="edit" v-if="editStatus('chargeItemNumber')">
                    <el-input v-model="listData.chargeItemNumber"></el-input>
                  </span>
                  <span class="txt" v-else>
                    {{ listData.chargeItemNumber }}
                  </span>
                  {{ numberUnitText }}
                </span>
              </li>
              <li>
                <span class="tl-tit">单价：</span>
                <span class="tl-cont">
                  <span class="edit" v-if="editStatus('chargeItemPrice')">
                    <el-input v-model="listData.chargeItemPrice"></el-input>
                  </span>
                  <span class="txt" v-else>
                    {{ listData.chargeItemPrice }}
                  </span>
                  {{ priceUnitText }}
                </span>
              </li>
              <li>
                <span class="tl-tit">金额：</span>
                <span class="tl-cont">
                  <span class="edit" v-if="editStatus('chargeAmounts')">
                    <template v-if='listData.paybillNo'>
                      <el-input v-model="listData.paymentAmount"></el-input>
                    </template>
                    <template v-else>
                      <el-input v-model="listData.chargeAmounts"></el-input>
                    </template>
                  </span>
                  <span class="txt" v-else>
                    {{ listData.chargeAmounts || listData.paymentAmount }}
                  </span>
                  元
                </span>
              </li>
            </ul>
          </div>
          <div class="el-col-12" v-if="showBefore">
            <h3>修改前</h3>
            <ul class="text-list edit-before">
              <li>
                <span class="tl-tit">费用名称：</span>
                <span class="tl-cont">
                  {{ listDataOriginal.chargeItemName }}
                </span>
              </li>
              <li>
                <span class="tl-tit">数量：</span>
                <span class="tl-cont">
                  {{ listDataOriginal.chargeItemNumber }}
                  {{ numberUnitText }}
                </span>
              </li>
              <li>
                <span class="tl-tit">单价：</span>
                <span class="tl-cont">
                  {{ listDataOriginal.chargeItemPrice }}
                  {{ priceUnitText }}
                </span>
              </li>
              <li>
                <span class="tl-tit">金额：</span>
                <span class="tl-cont">
                  {{ listDataOriginal.chargeAmounts || listDataOriginal.paymentAmount }}
                  元
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- ft -->
      <div class="cod-ft">
        <div class="tip-msg" v-if="showTip">
          <p><span class="red">确定申请支付吗？</span></p>
        </div>
        <div class="audit-form" v-if="showAudit">
          <el-form ref="auditForm" :model="auditForm" label-width="120px">
            <el-form-item label="审核结果">
              <el-radio-group v-model="auditForm.paybillApproveStatus">
                <el-radio label="accept">审核通过</el-radio>
                <el-radio label="reject">审核未通过</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="审核备注">
              <el-input type="textarea" v-model="auditForm.paybillApproveDescription"></el-input>
            </el-form-item>
            <el-form-item label="支付打回原因">
              {{ listDataOriginal.paybillApproveDescription }}
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </ele-dialog>
</template>
<script type="text/ecmascript-6">

import { createBill, paybillRecordApply, paybillRecordApprove, paybillEdit, calculateChargeAmount, chargeItemEdit } from '../../../api/waybillService';

import { showMessageUtil } from '../../../api/Utils';

import eleDialog from '../../components/ele-dialog/eleDialog.vue';

export default {
  data() {
    return {
      title: '',
      action: '',
      listData: {},
      listDataOriginal: {},
      auditForm: {
        paybillApproveStatus: '',
        paybillApproveDescription: ''
      },
      rule: '',
      msg: '',
      editableFields: null
    };
  },
  watch:{
    'listData': {
      handler:function() {
        console.log('deep watch effect dialog list object has changed.....');
        this.calNow();
      },
      deep:true
    }
  },
  props: {
    domainObject: Object
  },
  components: {
    'ele-dialog': eleDialog
  },
  computed: {
    showRelate() {
      let result = false; // 默认不显示
      if(this.listData.paybillNo) return true;
      if (this.listData.paymentChannel === 'cash'  && this.listData.chargeItemPaybillStatus !== 'uncreated') {
        result = true;
      }
      return result;
    },
    showAfterTitle() {
      let result = true; // 默认显示
      if (this.action === 'createRow' || this.action === 'applyRow' || this.action === 'auditRow') {
        result = false;
      }
      return result;
    },
    showBefore() {
      let result = true; // 默认显示
      if (this.action === 'createRow' || this.action === 'applyRow' || this.action === 'auditRow') {
        result = false;
      }
      return result;
    },
    showTip() {
      let result = false; // 默认不显示
      if (this.action === 'applyRow') {
        result = true;
      }
      return result;
    },
    showAudit() {
      let result = false; // 默认不显示
      if (this.action === 'auditRow') {
        result = true;
      }
      return result;
    },
    paymentStatus() {
      if(this.listData.paybillNo){
        if(this.action == 'auditRow') return '待审核'
        return '待申请'; 
      } 

      const status = this.listData.chargeItemPaybillStatus;
      switch(status) {
        case 'uncreated':
          return '待创建';
        case 'ready':
          return '待申请';
        case 'approvePend':
          return '待审核';
        case 'reject':
          return '审核未通过';
        case 'pend':
          return '待支付';
        case 'failed':
          return '支付失败';
        case 'paid':
          return '已支付';
        default:
          return '';
      }
    },
    numberUnitText() {
      const status = this.listData.chargeItemNumberUnitCode;
      switch(status) {
        case 'item':
          return '件';
        case 'litre':
          return '升';
        case 'kg':
          return '千克';
        case 'ton':
          return '吨';
        case 'km':
          return '公里';
        default:
          return '';
      }
    },
    priceUnitText() {
      const status = this.listData.chargeItemPriceUnitCode;
      switch(status) {
        case 'yuanperitem':
          return '元/件';
        case 'yuanperlitre':
          return '元/升';
        case 'yuanperkg':
          return '元/千克';
        case 'yuanperton':
          return '元/吨';
        case 'yuanperkm':
          return '元/公里';
        default:
          return '';
      }
    },
    amountUnitText() {
      const status = this.listData.chargeAmountsUnitCode;
      switch(status) {
        case 'yuan':
          return '元';
        default:
          return '';
      }
    }
  },
  methods: {
    open(action, model, index, title, editableFields, rule, msg) {
      this.auditForm.paybillApproveStatus = '';
      this.auditForm.paybillApproveDescription = '';
      

      this.title = title;
      this.action = action;
      this.listData = JSON.parse(JSON.stringify(model));
      this.listDataOriginal = JSON.parse(JSON.stringify(model));
      this.editableFields = editableFields || [];
      this.rule = rule;
      this.msg = msg;
      this.$nextTick(()=>{
        this.$refs.dialog.open();
      });
    },
    editStatus(field) {
      return this.editableFields.includes(field);
    },
    validNow() {
      let result = true;
      let amounts = this.listData.paybillNo ? this.listData.paymentAmount : this.listData.chargeAmounts;

      if (this.action === 'createRow') {
        if (!amounts) {
          showMessageUtil('warning', '请确认数量、单价、金额不能为空！', 3000);
          return false;
        }
      }
      if (this.action === 'createRow' || this.action === 'editRow' || this.action === 'modifyRow') {
        result = new RegExp(`^${this.rule}$`).test(amounts);
        if (!result) {
          showMessageUtil('warning', this.msg, 3000);
          return false;
        }
      }

      // 审核支付校验
      if (this.action === 'auditRow') {
        if (!this.auditForm.paybillApproveStatus) {
          showMessageUtil('warning', '请选择审核结果！', 3000);
          return false;
        }
      }
      return result;
    },
    handleDone() {
      let net = null, param = {};
      switch(this.action) {
        case 'createRow':
          net = createBill;
          param = {
            code: this.listData.code,
            chargeItemNumber: this.listData.chargeItemNumber,
            chargeItemPrice: this.listData.chargeItemPrice,
            chargeAmounts: this.listData.chargeAmounts
          };
          break;
          // 申请支付
        case 'applyRow':
          net = paybillRecordApply;
          param = {
            code: this.listData.chargeItemPaybillCode || this.listData.code
          };
          break;
          //修改
        case 'editRow':
        case 'modifyRow':
          // 付款单修改和费用科目修改不一样的接口
          if (this.listData.paybillNo) {
            net = paybillEdit;
            param = {
              code: this.listData.code,
              chargeItemNumber:this.listData.chargeItemNumber,
              chargeItemPrice:this.listData.chargeItemPrice,
              paymentAmount:this.listData.paymentAmount
            };
          } else {
            net = chargeItemEdit;
            param = this.listData; // 费用科目修改传整个domainObject
          }
          break;
          //审核支付
        case 'auditRow':
          net = paybillRecordApprove;
          param = {
            code: this.listData.chargeItemPaybillCode || this.listData.code,
            paybillApproveStatus:this.auditForm.paybillApproveStatus,
            paybillApproveDescription:this.auditForm.paybillApproveDescription
          };
          break;
        default:
          break;
      }
      if (this.validNow()) {
        net(param, (success, error) => {
          if (error) {
            showMessageUtil('warning', error.content, 3000);
          }
          if (success) {
            showMessageUtil('success', '操作成功！', 3000);
            this.refresh();
          }
        });
      } else {
        console.log('valid error please check all the fields which you have filled');
      }
    },
    handleCancel() {
      this.$refs.dialog.close();
    },
    refresh() {
      this.$refs.dialog.close();
      this.$emit('refresh', this);
    },
    calNow() {
      // 金额来源方式为标准计算或者公式获取，才实时计算金额
      if (this.listData.chargeItemAmountsResource && (this.listData.chargeItemAmountsResource === 'standard' || this.listData.chargeItemAmountsResource === 'expression') && this.listData.chargeItemNumber && this.listData.chargeItemPrice) {
        let paramsObj = {
            code: this.listData.code,
            chargeItemNumber: this.listData.chargeItemNumber,
            chargeItemPrice: this.listData.chargeItemPrice
          };

          if(this.listData.paybillNo){
            paramsObj.code = this.listData.chargeItemCode;
          }

        calculateChargeAmount(paramsObj, (success, error) => {
          if (error) {
            // showMessageUtil('warning', error.content, 3000);
            console.log('calculateChargeAmount error', error);
          }
          if (success) {
            const amount = success.content.result;
            if(this.listData.paybillNo){
              this.listData.paymentAmount = amount;
            }else{
              this.listData.chargeAmounts = amount;
            }
          }
        });
      }
    }
  },
  mounted() {
  },
  created() {}
};

</script>
<style lang="scss" rel="stylesheet/scss">
.dialog-common-opr {
  .el-dialog__body {
    max-height: none;
  }
}
.common-opr-dialog {
  .text-list {
    font-size: 0;
    li {
      line-height: 24px;
      margin-bottom: 10px;
      font-size: 14px;
    }
    .tl-tit {
      display: inline-block;
      width: 100px;
    }
  }
  .cod-hd {
    padding: 10px 0;
    li {
      float: left;
      width: 50%;
    }
  }
  .cod-bd {
    border-top: dashed 1px #ddd;
    .edit {
      .el-input {
        width: 150px;
      }
    }
    .edit-before {
      li:first-child {
        opacity: 0;
      }
    }
    .el-row {
      padding: 10px 0;
      h3 {
        margin-bottom: 10px;
        color: #cfbe77;
        text-align: center;
      }
    }
  }
  .cod-ft {
    & > div {
      border-top: dashed 1px #ddd;
    }
    .tip-msg {
      padding: 30px 20px;
      text-align: center;
    }
    .audit-form {
      padding-top: 10px;
    }
  }
}
</style>
