<template>
  <div id="safety" class="form-page">
    <div class="page-header clearfix">
      <h2 class="page-title fl">支付安全管理</h2>
      <span class="page-refresh fr" id="pageRefresh">
        <i class="ico-refresh"></i>刷新
      </span>
      <div class="hd-opr fr">
      </div>
    </div>
    <div id="tmp-wrap"></div>
    <el-row>
      <big>修改支付密码</big>
      <div class="block block-box">
        <h2 v-bind:class="{ 'text-warning': !retSuccess, 'text-green': retSuccess }" v-show="retMsg">校验结果：{{ retMsg }}</h2>
        <el-form :model="domainObject" ref="domainObject" label-width="150px" :inline="false" :label-position="'right'" >
          <el-row v-show="!retSuccess">
          <el-form-item label="支付绑定手机号" class="content-width">
            <el-input v-model="domainObject.phone" placeholder="请输入手机号" readonly="readonly" disabled="disabled"></el-input>
            <span v-if="time120 > 0">({{time120}}秒后重发)</span>
            <a v-else href="javascript:;" @click="sendingVerifyCode">获取验证码</a>
          </el-form-item>
          <el-form-item label="验证码" class="content-width"
            prop="verifyCode"
            :rules="[
              { required: true, message: '请输入手机验证码', trigger: 'blur' },
            ]">
            <el-input v-model="domainObject.verifyCode" placeholder="请输入手机验证码" @blur="querySearch"></el-input>
            <!-- <i class="el-icon-circle-check text-green" v-if="isValidate === 'success'"></i> -->
            <!-- <i class="el-icon-circle-close text-red" v-if="isValidate === 'error'"></i> -->
          </el-form-item>
          <el-form-item label="支付密码"
            class="content-width"
            prop="newPassword"
            :rules="[
              { required: true, message: '请输入支付密码', trigger: 'blur' },
            ]">
            <el-input type="password" v-model="domainObject.newPassword" placeholder="请输入支付密码"></el-input>
          </el-form-item>
          <el-col :span="24" class="el-col-button">
            <el-form-item>
              <el-button type="danger" size="large" @click="handleEdit('domainObject')" :disabled="reqLoading">确认修改</el-button>
            </el-form-item>
          </el-col>
          </el-row>
        </el-form>
        <el-col :span="24" class="el-col-button" v-if="retSuccess">
          <el-button type="primary" size="large" @click="closeMe">关闭</el-button>
        </el-col>
      </div>
    </el-row>
  </div>
</template>

<script type="text/ecmascript-6">
import { resetPayPwdBySms, sendModifyPwdSms } from '../../api/PayMember'
import { closeCurrentWindow } from '../../api/Utils'

export default {
  props:{
  },
  data() {
    return {
      reqLoading: false,
      retSuccess: false,
      retMsg: '',
      domainObject: {},
      time120: 0,
      isValidate: '',
      successAmount: 0
    }
  },
  methods: {
    querySearch(e) {

    },
    countdownClock() {
      this.time120 = 120
      const m = setInterval(() => {
        if(this.time120 === 0) {
          clearInterval(m)
        } else {
          this.time120 --
        }
      },1000)
    },
    sendingVerifyCode() {
      if(this.domainObject.phone) {
        this.countdownClock()
        this.sendingSuccess = false;
        const params = {
          mobile: this.domainObject.phone
        }
        sendModifyPwdSms(params, (success, err) => {
          if (success && success.code === 200) {
            this.sendingSuccess = true;
          }
        })
      }
    },
    handleEdit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.reqLoading = true
          resetPayPwdBySms(this.domainObject, (success, error) => {
            if(success && success.code === 200) {
              this.retSuccess = true;
              this.retMsg = '修改成功'
            }
            if(error) {
              this.retSuccess = false
              this.retMsg = error.content
            }
            this.reqLoading = false
          })
        }
      })
    },
    closeMe() {
      closeCurrentWindow()
    }
  },
  created() {
    const userInfo = window.localStorage.getItem('userInfo')
    if(userInfo) {
      const o = JSON.parse(userInfo)
      this.domainObject.phone = o.loginAccount
    }
  }
}

</script>

<style lang="scss" rel="stylesheet/scss">
@import "../assets/sass/base.scss";
#safety {
  .block {
    h2 {
      text-align: center;
      font-size: 150%;
      margin-top: 1%;
      margin-bottom: 1%;
    }
  }
  .text-green {
    color: $green
  }
  .text-warning {
    color: $red;
  }

  .content-width .el-form-item__content {
    width: 300px;
  }
}
</style>
