<template>
  <div class="creat_computed_platform" v-loading.fullscreen.lock="fullscreenLoading">
    <!--整单核算-->
    <el-form label-position="right" label-width="200px" size="small" :inline="true">
      <div class="computed-component">
        <div class="list-title self-title">账单汇总</div>
        <hr class="hr">
        <!--账单基本信息-->
        <el-row>
          <!-- <el-col :span="12">
              <el-form-item label="账单名称：">
                <el-input v-if="!readonly" type="text" v-model="submitData.billName" auto-complete="off"></el-input>
                <span v-if="readonly">{{submitData.billName}}</span>
              </el-form-item>
            </el-col> -->
          <el-col :span="8">
            <el-form-item label="应付小计总额：">
              <!-- <el-input v-if="!readonly" type="text" v-model="submitData.paymentSubtotalAmount" auto-complete="off"></el-input> -->
              <span>{{submitData.paymentSubtotalAmount }}元</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="应付司机劳务费总额：">
              <!-- <el-input v-if="!readonly" type="text" v-model="submitData.paymentDriverSubtotalAmount" auto-complete="off"></el-input> -->
              <span>{{submitData.paymentDriverSubtotalAmount }}元</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="应付平台交易费总额：">
              <!-- <el-input v-if="!readonly" type="text" v-model="submitData.paymentTradeSubtotalAmount" auto-complete="off"></el-input> -->
              <span>{{submitData.paymentTradeSubtotalAmount }}元</span>
            </el-form-item>
          </el-col>
          <!-- 新增收发货统计 -->
          <el-col :span="8">
            <el-form-item label="发货重量合计：">
              <span>{{submitData.totalLoadingWeight }}吨</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发货数量合计：">
              <span>{{submitData.totalLoadingNum }}件</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发货体积合计：">
              <span>{{submitData.totalLoadingVolume }}方</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="收货重量合计：">
              <span>{{submitData.totalUnloadingWeight }}吨</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="收货数量合计：">
              <span>{{submitData.totalUnloadingNum }}件</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="收货体积合计：">
              <span>{{submitData.totalUnloadingVolume }}方</span>
            </el-form-item>
          </el-col>
          <!-- 添加两个字段 1.附件 2.备注 -->
          <el-col :span="12">
            <el-form-item label="附件：">
              <ele-block :field="configUpload.field" :domainObject="submitData" :editable="!readonly" :uploadUrl="configUpload.uploadUrl" :inputKey="configUpload.inputKey"></ele-block>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注：">
              <el-input v-if="!readonly" type="textarea" v-model="submitData.description" auto-complete="off"></el-input>
              <span v-if="readonly">{{submitData.description }}</span>
            </el-form-item>
          </el-col>
          <!--添加字段 end -->
          <el-col :span="24" class="el-col-description last_item">
            <el-form-item label="付款方留言：">
              <el-input v-if="!readonly" type="textarea" v-model="submitData.payerMessage" auto-complete="off"></el-input>
              <span v-if="readonly">{{submitData.payerMessage }}</span>
            </el-form-item>
          </el-col>
          <!-- 

            <el-col :span="12">
              <el-form-item label="结算总货量：" prop="pass">
               <span>{{submitData.settleWeight}}吨，{{submitData.settleVolume }}方，{{submitData.settleNumber}}件</span>
              </el-form-item>
            </el-col>


          <el-col :span="12">
            <el-form-item label="亏吨扣款总额：" prop="pass">
              <span>￥{{submitData.lossDeductionAmount }}元</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="应收调整定额总额：" prop="pass">
              <span>￥{{submitData.adjustmentQuotaAmount  }}元</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="应收运费小计总额：" prop="pass">
              <span>￥{{submitData.freightSubtotalAmount}}元</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="含税应收运费小计总额：" prop="pass">
              <span>￥{{submitData.taxFreightSubtotalAmount}}元</span>
            </el-form-item>
          </el-col> -->
          <!-- <el-col :span="12">
            <el-form-item label="代理价：">
                <el-input placeholder="请输入内容" v-model="submitData.agencyPrice" class="input-with-select" v-if="!readonly">
                  <el-select v-model="itemUnit" slot="append" placeholder="请选择" style="width:100px;">
                    <el-option label="元/吨" value="yuanperton"></el-option>
                    <el-option label="元/方" value="yuanpercube"></el-option>
                    <el-option label="元/件" value="yuanperitem"></el-option>
                  </el-select>
                </el-input>
              <span v-if="readonly">{{submitData.agencyPrice}}{{showUnit}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="代理费总额：" prop="pass">
              <span v-if="!readonly">￥{{allProxyMoney}}元</span>
              <span v-if="readonly">{{submitData.agencyFee?submitData.agencyFee:0}}元</span>
            </el-form-item>
          </el-col> -->
        </el-row>
        <div class="list-title self-title" v-if="readonly">合规确认汇总</div>
        <hr class="hr" v-if="readonly">
        <el-row v-if="readonly">
          <el-col :span="12">
            <el-form-item label="总车数 :">
              <el-input v-if="!readonly" type="text" v-model="submitData.totalTruck" auto-complete="off"></el-input>
              <span v-if="readonly">{{submitData.totalTruck}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合规车数 :">
              <el-input v-if="!readonly" type="text" v-model="submitData.complianceTruck" auto-complete="off"></el-input>
              <span v-if="readonly">{{submitData.complianceTruck}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="不合规车数 :">
              <el-input v-if="!readonly" type="text" v-model="submitData.nonComplianceTruck" auto-complete="off"></el-input>
              <span v-if="readonly">{{submitData.nonComplianceTruck}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="待确认车数 :">
              <el-input v-if="!readonly" type="text" v-model="submitData.pendTruck" auto-complete="off"></el-input>
              <span v-if="readonly">{{submitData.pendTruck}}</span>
            </el-form-item>
          </el-col>
          <!--        <el-col :span="12">
            <el-form-item label="应收运费调整：">
              <el-input type="text"  auto-complete="off" v-model="submitData.entireSingleAdjustment" v-if="!readonly">
                <template slot="append">元</template>
              </el-input>
              <span v-if="readonly">{{submitData.entireSingleAdjustment}}元</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="运费调整备注：" >
              <el-input type="text"  auto-complete="off" v-model="submitData.adjustmentDescription" v-if="!readonly"></el-input>
              <span v-if="readonly">{{submitData.adjustmentDescription}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24" class="el-col-bold">
            <el-form-item label="账单含税应收运费：" >
              <span v-if="!readonly">￥{{hanShuiYingShouYunFei}}元</span>
              <span v-if="readonly">{{submitData.receivableAmount}}元</span>
            </el-form-item>
          </el-col> -->
          <!-- <el-col :span="12">
            <el-form-item label="代理费调整：" >
              <el-input type="text"  auto-complete="off" v-model="submitData.agencyFeeAdjustment" v-if="!readonly"></el-input>
              <span v-if="readonly">{{submitData.agencyFeeAdjustment}}元</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="代理费调整备注：" prop="pass">
              <el-input type="text"  auto-complete="off" v-model="submitData.agencyFeeAdjustmentDescription" v-if="!readonly"></el-input>
              <span v-if="readonly">{{submitData.agencyFeeAdjustmentDescription}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24" class="el-col-bold">
            <el-form-item label="账单含税应收代理费：" prop="pass">
              <span v-if="!readonly">￥{{hanShuiYingShouDaiLiFei}}元</span>
              <span v-if="readonly">{{submitData.agencyAmount}}元</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="货品备注：" prop="pass">
              <el-input type="text"  auto-complete="off" v-model="submitData.goodsDescription" v-if="!readonly"></el-input>
              <span v-if="readonly">{{submitData.goodsDescription}}</span>
            </el-form-item>
          </el-col> -->
        </el-row>
      </div>
      <div class="btn-component" v-if="!readonly">
        <el-button class='form-button' type="primary" @click="onSubmit()" size="large">提交</el-button>
        <el-button class='form-button' @click="onCancel()" size="large">重置</el-button>
      </div>
    </el-form>
    <!-- 展示费用的弹框 -->
    <el-dialog title="提示" :visible.sync="dialog.visible" class="dialogControl">
      <el-row>
        <el-col :span="24">
          <p class="p_tit">确定提交吗？</p>
          <br/>
        </el-col>
        <el-col :span="24" class="line">
          <el-col :span="8">
            应付小计总额：
          </el-col>
          <el-col :span="16">
            <span>{{submitData.paymentSubtotalAmount }}元</span>
          </el-col>
        </el-col>
        <el-col :span="24" class="line">
          <el-col :span="8">
            应付司机劳务费总额：
          </el-col>
          <el-col :span="16">
            <span>{{submitData.paymentDriverSubtotalAmount }}元</span>
          </el-col>
        </el-col>
        <el-col :span="24" class="line">
          <el-col :span="8">
            应付平台交易费总额：
          </el-col>
          <el-col :span="16">
            <span>{{submitData.paymentTradeSubtotalAmount }}元</span>
          </el-col>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog.visible = false">取消</el-button>
        <el-button @click="netWorkSubmit" >确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import * as SettleBillService from '../../../api/PlatformSettleBillService';
import ApiConst from '../../../api/ApiConst';
import ElCol from "element-ui/packages/col/src/col";
import eleBlock from '../../components/ele-block/eleBlock.vue';
import Decimal from "decimal.js";
export default {
  components: { ElCol, eleBlock },
  name: 'create_computed',
  data() {
    return {
      dialog: {
        visible: false,
        btnDisabled: false
      },
      itemUnit: '',
      formatMoney: {
        adjustQuota: 'adjustmentQuotaAmount',
        billAdjustFee: 'adjustmentProportionAmount',
        confirmedLossDeduction: 'lossDeductionAmount',
        subtotal: 'freightSubtotalAmount',
        taxSubtotal: 'taxFreightSubtotalAmount'
      },
      tempData: {
        willTotal: 0,
        tempTotal: 0,
        proTotal: 0
      },
      statisTotal: {},
      isInit: true,
      reset: {
        tempData: {},
        statisTotal: {},
        submitData: {}
      },
      // upload 的相应字段配置
      configUpload: {
        field: {
          detailLinkVisiable: 'false',
          dialogPreview: 'TRUE',
          elementCode: 'file',
          event: undefined,
          extraParams: [{
            controlType: 'file',
            datasource: '',
            dialogPreview: 'TRUE',
            field: 'attachmentResourceCode',
            require: false,
            value: ''
          }],
          fieldConfigCode: 'attachmentResourceCode',
          required: 'false',
          showName: ''
        },
        domainObject: undefined,
        uploadUrl: ApiConst.apiWayBillDomain,
        inputKey: []
      },
      fullscreenLoading: true
    };
  },

  props: {
    submitData: {
      type: Object,
      default () {
        return {};
      }
    },
    params: {
      type: Object,
      default () {
        return {};
      }
    },
    readonly: {
      type: Boolean,
      default () {
        return false;
      }
    },
    lsType: {
      type: String,
      'default': ''
    }
  },
  computed: {
    showUnit() {
      var map = {
        "yuanperton": "元/吨",
        "yuanpercube": "元/方",
        "yuanperitem": "元/件"
      };
      return map[this.submitData.agencyPriceUnitCode];
    },
    allProxyMoney() {
      var allcount = 0;
      if (!this.readonly) {
        this.submitData.agencyPriceUnitCode = this.itemUnit;
        //{{submitData.settleWeight}}吨，{{submitData.settleVolume }}方，{{submitData.settleNumber}}
        if (!this.submitData.agencyPrice || !this.itemUnit) {
          return 0;
        }
        if (this.itemUnit === 'yuanperton') { //元/吨
          allcount = new Decimal(this.submitData.agencyPrice || 0).mul(new Decimal(this.submitData.settleWeight || 0)).toDP(2, Decimal.ROUND_HALF_UP);
        } else if (this.itemUnit === 'yuanpercube') { //元/方
          allcount = new Decimal(this.submitData.agencyPrice || 0).mul(new Decimal(this.submitData.settleVolume || 0)).toDP(2, Decimal.ROUND_HALF_UP);

        } else if (this.itemUnit === 'yuanperitem') { //元/件
          allcount = new Decimal(this.submitData.agencyPrice || 0).mul(new Decimal(this.submitData.settleNumber || 0)).toDP(2, Decimal.ROUND_HALF_UP);
        }
        this.submitData.agencyFee = allcount.toNumber();
        return allcount.toString();
      }
    },
    hanShuiYingShouYunFei() {
      var num = new Decimal(this.submitData.taxFreightSubtotalAmount || 0).add(new Decimal(this.submitData.entireSingleAdjustment || 0)).toDP(2, Decimal.ROUND_HALF_UP).toString();
      this.submitData.receivableAmount = num;
      return num.toString();
    },
    hanShuiYingShouDaiLiFei() {
      var num = new Decimal(this.allProxyMoney || 0).add(new Decimal(this.submitData.agencyFeeAdjustment || 0)).toDP(2, Decimal.ROUND_HALF_UP);
      this.submitData.agencyAmount = num;
      return num.toString();
    }
  },
  methods: {
    netWorkSubmit() {
      this.dialog.visible = false;
      this.$emit('onSubmit');
    },
    onGetStatic() {
      this.fullscreenLoading = true;
      return new Promise((resolve, reject) => {
        const data = {};
        if (this.params.billCode) {
          data.billCode = this.params.billCode;
        } else {
          data.clientOrgName = this.params.clientOrgName;
          data.clientOrgCode = this.params.clientOrgCode;
        }
        Object.assign(data, {
          businessType: this.lsType
        });
        if (this.submitData.billCode) {
          Object.assign(data, {
            billCode: this.submitData.billCode
          });
        }
        SettleBillService.settlePayableStatisticalBill(data, (res) => {
          if (res) {
            if (res.code !== 200) {
              this.$message.error(res.content);
              reject(res.content);
              this.fullscreenLoading = false;
            } else {
              Object.keys(res.content).forEach((key) => {
                var newkey = this.formatMoney[key];
                if (newkey) {
                  this.submitData[newkey] = res.content[key] ? res.content[key].toFixed(2) : 0;
                } else {
                  this.submitData[key] = res.content[key];
                }
                //console.log(`fieldKey:${this.formatMoney[key]}  value:${res.content[key] ? res.content[key].toFixed(2) : 0}`);
              });
              this.statisTotal = res.content;
              this.submitData.receivableAmount = res.content.taxSubtotal ? res.content.taxSubtotal.toFixed(2) : 0;
              console.log('this.submitData.receivableAmount', this.submitData.receivableAmount);
              this.tempData.tempTotal = Number(this.submitData.receivableAmount) ? Number(this.submitData.receivableAmount).toFixed(2) : 0;
              resolve();
              this.fullscreenLoading = false;
            }
          }
        });
      });
    },
    onUpdateStatis() {
      this.onGetStatic().then(() => {
        this.onComputedByMethod().onComputedWill().onComputedEnd();
        this.onSetZeroEqEmpty();
        if (this.isInit === true) {
          this.isInit = false;
          this.reset.submitData = Object.assign({}, this.submitData);
          this.reset.tempData = Object.assign({}, this.tempData);
          this.reset.statisTotal = Object.assign({}, this.statisTotal);
        }
      });
    },
    //      receivableAmount  账单应收含税运费
    //      taxFreightSubtotalAmount   含税应收运费小计总额
    //      adjustmentWay 调整方式 quota 按整单定额调整 scale 按整单比例调整
    //          scale->entireSingleAdjustmentRoportion 整单调整比例
    //          quota->entireSingleAdjustment 应收整单调整
    onComputedByMethod() {
      if (this.submitData.adjustmentWay === 'quota') {
        this.submitData.receivableAmount = Number(this.submitData.taxFreightSubtotalAmount) - (Number(this.submitData.entireSingleAdjustmentRoportion / 100) * Number(this.submitData.receivableAmount));
        this.submitData.entireSingleAdjustmentRoportion = 0;
        this.submitData.receivableAmount = Number(this.submitData.taxFreightSubtotalAmount) + Number(this.submitData.entireSingleAdjustment);
      }
      if (this.submitData.adjustmentWay === 'scale') {
        this.submitData.receivableAmount = Number(this.submitData.taxFreightSubtotalAmount) - Number(this.submitData.entireSingleAdjustment);
        this.submitData.entireSingleAdjustment = 0;
        this.submitData.receivableAmount = Number(this.submitData.taxFreightSubtotalAmount) + (Number(this.submitData.entireSingleAdjustmentRoportion / 100) * Number(this.submitData.receivableAmount));
      }
      this.submitData.receivableAmount = this.submitData.receivableAmount ? this.submitData.receivableAmount.toFixed(2) : 0;
      return this;
    },
    //          cashPlanSettleAmount 现金计划结算金额
    //          bankTransferPlanSettleAmount 银行转账计划结算金额
    //          oilCardPlanSettleAmount 油卡计划结算金额
    //          gasCardPlanSettleAmount 气卡计划结算金额
    //          bankDraftPlanSettleAmount 银行汇票计划结算金额
    //          businessDraftPlanSettleAmount 商业汇票计划结算金额
    onComputedWill() {
      this.tempData.willTotal = 0;
      ['cashPlanSettleAmount', 'bankTransferPlanSettleAmount', 'oilCardPlanSettleAmount', 'gasCardPlanSettleAmount', 'bankDraftPlanSettleAmount', 'businessDraftPlanSettleAmount'].forEach((key) => {
        console.log(this.submitData[key]);
        this.tempData.willTotal += Number(this.submitData[key]);
      });
      return this;
    },
    onComputedEnd() {
      this.tempData.tempTotal = Number(this.submitData.receivableAmount) - Number(this.tempData.willTotal);
      this.tempData.proTotal = Number(this.submitData.taxFreightSubtotalAmount);
      this.tempData.tempTotal = this.tempData.tempTotal.toFixed(2);
      this.tempData.proTotal = this.tempData.proTotal.toFixed(2);
      return this;
    },
    onChangeBase() {
      this.onComputedByMethod().onComputedWill().onComputedEnd();
      this.onSetZeroEqEmpty();
    },
    onChangeWill() {
      this.onComputedWill().onComputedEnd();
    },
    onSetZeroEqEmpty() {
      // entireSingleAdjustment
      // entireSingleAdjustmentRoportion
      // cashPlanSettleAmount
      // bankTransferPlanSettleAmount
      // oilCardPlanSettleAmount
      // gasCardPlanSettleAmount
      // bankDraftPlanSettleAmount
      // businessDraftPlanSettleAmount
      this.submitData.entireSingleAdjustment = this.submitData.entireSingleAdjustment || '';
      this.submitData.entireSingleAdjustmentRoportion = this.submitData.entireSingleAdjustmentRoportion || '';
      this.submitData.cashPlanSettleAmount = this.submitData.cashPlanSettleAmount || '';
      this.submitData.bankTransferPlanSettleAmount = this.submitData.bankTransferPlanSettleAmount || '';
      this.submitData.oilCardPlanSettleAmount = this.submitData.oilCardPlanSettleAmount || '';
      this.submitData.gasCardPlanSettleAmount = this.submitData.gasCardPlanSettleAmount || '';
      this.submitData.bankDraftPlanSettleAmount = this.submitData.bankDraftPlanSettleAmount || '';
      this.submitData.businessDraftPlanSettleAmount = this.submitData.businessDraftPlanSettleAmount || '';
    },
    onSubmit() {

      // localStorage.getItem('orgType') == '1'?'应收客户账单管理':'应付平台账单',

      if (localStorage.getItem('orgType') != '1') { // 页面为 应付平台账单的时候 需要弹框
        // 提示
        this.dialog.visible = true;
      } else {
        this.$emit('onSubmit');
      }





    },
    onCancel() {
      this.isInit = true;
      // this.submitData = Object.assign({}, this.reset.submitData);
      Object.keys(this.reset.submitData).forEach((key) => {
        this.submitData[key] = this.reset.submitData[key];
      });
      this.tempData = Object.assign({}, this.reset.tempData);
      this.statisTotal = Object.assign({}, this.reset.statisTotal);
      // this.$emit('onCancel');
    },
    init() {
      console.log('readonly:', this.readonly);
    }
  },
  mounted() {
    this.init();
  },
  watch: {
    $route() {
      this.init();
    }
  }
};

</script>
<style lang="scss">
.creat_computed_platform {

  // 给上传图片的按钮 样式 调整 start ======
  .el-upload--picture-card {
    width: 36px;
    height: 36px;
    line-height: 36px;
  }

  .el-upload--picture-card i {
    font-size: 14px;
  }

  .el-upload-list--picture-card .el-upload-list__item,
  .verifySection .file-list-item {
    width: 36px;
    height: 36px;
  }

  .el-upload-list--picture-card .el-upload-list__item-actions {
    font-size: 13px;
  }

  .el-upload-list--picture-card .el-upload-list__item-actions:hover span {
    display: inline-block;
  }

  .el-upload-list--picture-card .el-upload-list__item-actions span+span {
    margin-left: 3px;
  }

  .el-upload-list--picture-card .el-upload-list__item-actions .el-upload-list__item-delete {
    margin: 0 0 0 3px;
    float: none;
  }

  .el-upload-list--picture-card .el-upload-list__item,
  .file-list-item {
    width: 36px;
    height: 36px;
  }

  .file-list-item .pre-mask {
    line-height: 36px;
  }

  .last_item {
    margin-top: 20px;
  }

  // 给上传图片的按钮 样式 调整 end ======
}



.dialogControl {
  p.p_tit {
    text-align: center;
    margin-bottom: 20px;
    margin-top: 20px;
  }

  .line {
    padding-bottom: 10px;
  }
}


.el-col-description {
  height: auto !important;
  .el-form-item {
    width: 100%;
    .el-form-item__content {
      width: calc(100% - 200px);
      .el-textarea__inner {
        height: 100px !important;
        width: 100%;
      }
    }
  }
}

.computed-component {
  .el-col {
    height: 31px;
  }
  .el-col-bold {
    font-weight: 700;
  }
}

.btn-component {
  text-align: center;
  margin-top: 26px;
}

.self-title {
  color: #FF6600;
  line-height: 22px;
}

.computed-form-item {
  display: inline;
  clear: both;
}

.will-computed-component {
  .el-input {
    float: left;
  }
  .will-input-tips {
    position: absolute;
  }
  .el-form-item {
    margin-right: 20px;
  }
}

</style>
