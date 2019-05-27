<template>
  <div id="accountpreview" class="form-page">
    <div class="page-header clearfix">
      <h2 class="page-title fl">
       账户一览
      </h2>
      <span class="page-refresh fr" id="pageRefresh">
        <i class="ico-refresh"></i>刷新
      </span>
      <div class="hd-opr fr">
      </div>
    </div>
    <div id="tmp-wrap"></div>
    <el-row v-loading.fullscreen.lock="loading" element-loading-text="加载中">
      <!-- <el-form :model="domainObject" ref="domainObject" :inline="false" >
        <div class="block block-box">
          <el-row>
        <el-form-item :label="formfields[0].name">
          <span><big>{{ domainObject[formfields[0].prop] }}</big>&nbsp;&nbsp;</span>
        </el-form-item>
        <el-form-item :label="item.name" v-for="(item, index) in formfields" :key="index" v-if="index > 0">
          <span><big>{{ domainObject[item.prop] | toThousandslsFilter }}</big>&nbsp;元&nbsp;<a href="javascript:;" @click="openWindow(item.url,item.urlName)" :data-url="item.url" v-if="item.url">{{ item.urlName }}</a></span>
        </el-form-item>
          </el-row>
        </div>
      </el-form> -->
      <div class="block block-box">
        <el-row>
          <div class="detial">
            <span class="name">{{formfields[0].name}}</span>
            <span class="value"><big>{{ domainObject[formfields[0].prop] }}</big>&nbsp;&nbsp;</span>
          </div>
          <div class="detial" v-for="(item, index) in formfields" :key="index" v-if="index > 0">
            <span class="sub" v-if="item.sub">&nbsp;&nbsp;&nbsp;</span>
            <span class="name">{{ item.name }}:</span>
            <span class="value"><big v-bind:class="{ 'text-red': domainObject[item.prop] < 0 }">{{ domainObject[item.prop] | toThousandslsFilter }}</big>&nbsp;元&nbsp;<a href="javascript:;" class="blue" @click="openWindow(item.url,item.urlName)" :data-url="item.url" v-if="item.url">{{ item.urlName }}</a><el-button size="small" type="primary" @click="handleBtnAction" v-if="item.actionType && item.actionType === 'btn'">{{ item.urlName }}</el-button></span>
          </div>
        </el-row>
      </div>
      <!-- <withdraw-records /> -->
    </el-row>


    <el-dialog
      id="withdrawDialog"
      :title="'提现'"
      :visible.sync="dialogVisible"
      width="60%">
      <div id="">
        <el-row>
          <el-form :model="domainFormObject" ref="domainFormObject" label-width="150px" :inline="false" :label-position="'right'" >
            <el-col :span="24">
              <el-form-item label="银行账户余额">
                <span>{{ domainObject.realAccountAmount | toThousandslsFilter }} 元</span>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="核心企业账户余额">
                <span>{{ domainObject.coreSubAccountAmount | toThousandslsFilter }} 元</span>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="提现金额"
                prop="amount"
                :rules="[
                  { required: true, message: '请填写提现金额' },
                  { type: 'number', message: '提现金额必须为数字值'}
                ]">
                <el-input v-model.number="domainFormObject.amount" placeholder="请输入金额" id="amount" name="amount"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="提现密码"
                prop="payPassword"
                :rules="[
                  { required: true, message: '请填写提现密码' },
                ]">
                <el-input type="password" v-model="domainFormObject.payPassword" placeholder="请输入提现密码"></el-input>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button @click="handleSubmit('domainFormObject')" :disabled="disabledBtn">确 认</el-button>
      </span>
    </el-dialog>



  </div>
</template>

<script type="text/ecmascript-6">
import { getCoreRealAccount } from '../../api/virtualAccount'
import { doCoreWithdraw } from '../../api/TradeService'
import { urlRedirect } from '../../api/Utils';
import WithdrawRecords from './components/withdrawRecords'

export default {
  name: 'account-preview',
  components: {
    WithdrawRecords
  },
  data() {
    return {
      domainObject: {},
      domainFormObject: {},
      loading: false,
      formfields: [
        { prop:'companyName' , name: '企业名称'},
        { prop:'realAccountAmount' , name: '银行账户余额'},
        { prop:'headAccountAmount' , name: '虚拟账户余额汇总'},
        { prop:'coreSubAccountAmount' , name: '核心企业账户余额', sub: true},
        // { prop:'coreSubAccountAmount' , name: '核心企业账户余额', sub: true, url:'', urlName: '提现', actionType: 'btn'},
        { prop:'carrierDrawableAmount' , name: '司机账户余额合计', sub: true},
        { prop:'yunDrawableAmount' , name: '云平台账户金额', sub: true},
        { prop:'consignorPayableAmount' , name: '企业会员账户余额合计', url:'/payment/manageList.html', urlName: '(企业会员资金管理)', sub: true},
        { prop:'pendingDrawableAmount' , name: '提现结果待返回金额合计', sub: true},
        { prop:'payableDrawableDif' , name: '提现兑付差额（银行账户资金缺口）'},
      ],
      dialogVisible: false,
      disabledBtn: false,
      theme: true
    }
  },
  methods: {
    init() {
      this.loadingData();
    },
    openWindow(url, title) {
        urlRedirect(url, title);
    },
    loadingData() {
      const param = {
        // code: 'xx'
      }
      this.loading = true;
      getCoreRealAccount(param, (success, error) => {
          if (success && success.code === 200) {
            this.loading = false;
            const { content } = success;
            // console.log('res', content)
            this.domainObject = Object.assign({}, content);
            this.domainObject.driverAccountAmount = content.carrierDrawableAmount + content.pendingDrawableAmount
          }
          if(error) {
            this.loading = false;
            this.$message({
              type: 'error',
              message: error.content,
              duration: 3000
            });
          }
      })
      // console.log(this.domainObject)
    },
    handleBtnAction() {
      this.dialogVisible = true
    },
    handleSubmit(formName) {
      this.disabledBtn = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.domainFormObject.amount > this.domainObject.coreSubAccountAmount) {
            this.$message({
              type: 'error',
              message: '提现金额大于账户余额',
              duration: 3000
            });
            this.disabledBtn = false
            return false
          } else {
            doCoreWithdraw(this.domainFormObject,(success, err) => {
              if (success && success.code === 200) {
                this.$message({
                  type: 'success',
                  message: '提现成功',
                  duration: 3000
                });
                this.disabledBtn = false
                this.domainFormObject = {}
                this.dialogVisible = false
              } else {
                this.$message({
                  type: 'error',
                  message: err.content,
                  duration: 3000
                });
                this.disabledBtn = false
              }
            })
          }
        } else {
          this.disabledBtn = false
          return false;
        }
      });
    }
  },
  created() {
    if (this.theme) {
      document.querySelector('body').classList.add('theme-blue');
    }
  },
  mounted() {
    this.init();
  }
}
</script>

<style lang="scss" rel="stylesheet/scss">
@import "../assets/sass/base.scss";

#accountpreview {
  // .el-form-item__label {
  //   width: 250px;
  // }
  .el-form-item__label:last-child {
    margin-left: 20px;
  }
  .detial {
    margin-left: 20px;
    line-height: 26px;
    font-size: 14px;
    .name {
      margin-right: 10px;
    }
  }
  .text-red {
    color: $red;
  }
  .form-page .el-form-item.is-required .el-form-item__label::before {
    position: relative;
    top: 0;
    left: 0;
  }
}

</style>
