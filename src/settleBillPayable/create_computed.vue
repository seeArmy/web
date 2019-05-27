<template>
  <div>
    <!--整单核算-->
    <el-form  label-position="right" label-width="200px" size="small" :inline="true">
      <div class="computed-component">
        <div class="list-title self-title">结算汇总</div>
        <hr class="hr">
        <!--账单基本信息-->
        <el-row>
            <el-col :span="12">
              <el-form-item label="账单名称：">
                <el-input v-if="!readonly" type="text" v-model="submitData.billName" auto-complete="off"></el-input>
                <span v-if="readonly">{{submitData.billName}}</span>
              </el-form-item>
            </el-col>
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
            <el-form-item label="应付调整定额总额：" prop="pass">
              <span>￥{{submitData.adjustmentQuotaAmount  }}元</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="应付运费小计总额：" prop="pass">
              <span>￥{{submitData.freightSubtotalAmount}}元</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="含税应付运费小计总额：" prop="pass">
              <span>￥{{submitData.taxFreightSubtotalAmount}}元</span>
            </el-form-item>
          </el-col>
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
        <div class="list-title self-title">调整结果</div>
        <hr class="hr">
        <el-row>
          <el-col :span="12">
            <el-form-item label="应付运费调整：">
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
            <el-form-item label="账单含税应付运费：" >
              <span v-if="!readonly">￥{{hanShuiYingShouYunFei}}元</span>
              <span v-if="readonly">{{submitData.payableAmount}}元</span>
            </el-form-item>
          </el-col>
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
            <el-form-item label="账单含税应付代理费：" prop="pass">
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
  </div>
</template>

<script>
  import * as SettleBillService from '../../api/SettleBillService';
  import ElCol from "element-ui/packages/col/src/col";
  import Decimal from "decimal.js";
  export default {
    components: {ElCol}, name: 'create_computed',
    data() {
      return {
        itemUnit:'',
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
        }
      };
    },

    props: {
      submitData: {
        type: Object,
        default() {
          return {};
        }
      },
      params: {
        type: Object,
        default() {
          return {};
        }
      },
      readonly: {
        type: Boolean,
        default() {
          return false;
        }
      },
      lsType: {
        type: String,
        'default': ''
      }
    },
    computed:{
      showUnit(){
          var map ={
            "yuanperton":"元/吨",
            "yuanpercube":"元/方",
            "yuanperitem":"元/件"
          };
          return map[this.submitData.agencyPriceUnitCode];
      },
      allProxyMoney(){
        var allcount=0;
          if(!this.readonly){
            this.submitData.agencyPriceUnitCode=this.itemUnit;
              //{{submitData.settleWeight}}吨，{{submitData.settleVolume }}方，{{submitData.settleNumber}}
            if(!this.submitData.agencyPrice || !this.itemUnit){
                return 0;
            }
            if(this.itemUnit==='yuanperton'){  //元/吨
              allcount= new Decimal(this.submitData.agencyPrice||0).mul(new Decimal(this.submitData.settleWeight||0)).toDP(2, Decimal.ROUND_HALF_UP);
            }else if(this.itemUnit==='yuanpercube'){    //元/方
              allcount= new Decimal(this.submitData.agencyPrice||0).mul(new Decimal(this.submitData.settleVolume||0)).toDP(2, Decimal.ROUND_HALF_UP);

            }else if(this.itemUnit==='yuanperitem'){    //元/件
              allcount= new Decimal(this.submitData.agencyPrice||0).mul(new Decimal(this.submitData.settleNumber||0)).toDP(2, Decimal.ROUND_HALF_UP);
            }
            this.submitData.agencyFee=allcount.toNumber();
            return allcount.toString();
          }
      },
      hanShuiYingShouYunFei(){
        var num = new Decimal(this.submitData.taxFreightSubtotalAmount||0).add(new Decimal(this.submitData.entireSingleAdjustment||0)).toDP(2, Decimal.ROUND_HALF_UP).toString();
        this.submitData.payableAmount=num;
        return  num.toString();
      },
      hanShuiYingShouDaiLiFei(){
        var num = new Decimal(this.allProxyMoney||0).add(new Decimal(this.submitData.agencyFeeAdjustment||0)).toDP(2, Decimal.ROUND_HALF_UP);
        this.submitData.agencyAmount=num;
        return num.toString();
      }
    },
    methods: {
      onGetStatic() {
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
          SettleBillService.settleReceivableStatisticalBill(data, (res) => {
            if (res) {
              if (res.code !== 200) {
                this.$message.error(res.content);
                reject(res.content);
              } else {
                Object.keys(res.content).forEach((key) => {
                  var newkey = this.formatMoney[key];
                  if(newkey){
                    this.submitData[newkey] = res.content[key] ? res.content[key].toFixed(2) : 0;
                  }else{
                    this.submitData[key]=res.content[key];
                  }
                  //console.log(`fieldKey:${this.formatMoney[key]}  value:${res.content[key] ? res.content[key].toFixed(2) : 0}`);
                });
                this.statisTotal = res.content;
                this.submitData.payableAmount = res.content.taxSubtotal ? res.content.taxSubtotal.toFixed(2) : 0;
                console.log('this.submitData.payableAmount', this.submitData.payableAmount);
                this.tempData.tempTotal = Number(this.submitData.payableAmount) ? Number(this.submitData.payableAmount).toFixed(2) : 0;
                resolve();
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
      //      payableAmount  账单应付含税运费
      //      taxFreightSubtotalAmount   含税应付运费小计总额
      //      adjustmentWay 调整方式 quota 按整单定额调整 scale 按整单比例调整
      //          scale->entireSingleAdjustmentRoportion 整单调整比例
      //          quota->entireSingleAdjustment 应付整单调整
      onComputedByMethod() {
        if (this.submitData.adjustmentWay === 'quota') {
          this.submitData.payableAmount = Number(this.submitData.taxFreightSubtotalAmount) - (Number(this.submitData.entireSingleAdjustmentRoportion / 100) * Number(this.submitData.payableAmount));
          this.submitData.entireSingleAdjustmentRoportion = 0;
          this.submitData.payableAmount = Number(this.submitData.taxFreightSubtotalAmount) + Number(this.submitData.entireSingleAdjustment);
        }
        if (this.submitData.adjustmentWay === 'scale') {
          this.submitData.payableAmount = Number(this.submitData.taxFreightSubtotalAmount) - Number(this.submitData.entireSingleAdjustment);
          this.submitData.entireSingleAdjustment = 0;
          this.submitData.payableAmount = Number(this.submitData.taxFreightSubtotalAmount) + (Number(this.submitData.entireSingleAdjustmentRoportion / 100) * Number(this.submitData.payableAmount));
        }
        this.submitData.payableAmount = this.submitData.payableAmount ? this.submitData.payableAmount.toFixed(2) : 0;
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
        this.tempData.tempTotal = Number(this.submitData.payableAmount) - Number(this.tempData.willTotal);
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
        this.$emit('onSubmit');
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
  .computed-component {
    .el-col {
      height: 31px;
    }
    .el-col-bold {
      font-weight: 700;
    }
  }
  .btn-component{
    text-align: center;
    margin-top: 26px;
  }
  .self-title{
    color: #FF6600;
    line-height: 22px ;
  }
  .computed-form-item{
    display: inline;
    clear: both;
  }
  .will-computed-component{
    .el-input{
      float: left;
    }
    .will-input-tips{
      position: absolute;
    }
    .el-form-item{
      margin-right: 20px;
    }
  }
</style>
