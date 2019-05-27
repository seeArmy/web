<template>
  <div class="custom-page">
    <el-dialog title="公司二维码" :visible.sync="centerDialogVisible" width="30%" center>
        <img :src="codeImg"  alt="">
        <span style="display:block;">公司名称:{{domainObject.orgFullName}}</span>
    </el-dialog>
    <!-- 1 -->
    <div class="section">
      <h2 class="tmp-title">
        认证信息<span class="org" v-if="!canEdit">（注：当前客户认证状态为{{ text }}，此版块信息不可编辑）</span>
      </h2>
      <div class="el-row">
        <!-- 公司全称 -->
        <div class="el-col el-col-8 getSelect" :class="{readOnly: isReadOnly}">
          <slot name="orgFullName"></slot>
          <!-- <div class="obtains" v-show="!isEdit && canEdit" @click="obtainMes">匹配</div> -->
        </div>
        <!-- 客户简称 -->
        <div class="el-col el-col-8">
          <slot name="orgName"></slot>
        </div>
        <!-- 二维码 -->
        <div  class="el-col el-col-8" v-show="!editable&&isEdit ">
           <span class="el-form-item__label">公司二维码:</span> <div class="icon-erweima" v-on:click="showQRcode"></div>
        </div>
        <!-- 组织类型 在认证的情况下不能修改 激活的状态下不能修改 -->
        <div class="el-col el-col-8">
          <slot v-if='showOrgType' name="orgType"></slot>
        </div>
        <!-- 认证状态 -->
        <div class="el-col el-col-8">
          <slot name="certStatus"></slot>
        </div>
        <!-- 纳税人识别号 -->
        <div class="el-col el-col-8">
          <slot name="orgTaxNumber"></slot>
        </div>
        <!-- 纳税人类别 -->
        <div class="el-col el-col-8">
          <slot name="taxType"></slot>
        </div>
        <!-- 营业执照附件 -->
        <div class="el-col el-col-8">
          <slot name="businessLicenseResourceCode"></slot>
        </div>
        <!-- 信用代码 -->
        <div :class="hideFields ? 'el-col el-col-8' : 'el-col el-col-16'">
          <slot name="creditCode"></slot>
        </div>
        <!-- 执照过期日期 -->
        <div class="el-col el-col-8" v-show="hideFields">
          <slot name="businessLicenseExpirationDate"></slot>
        </div>
        <!-- 运输许可证附件 -->
        <div class="el-col el-col-8 el-col-transportCertificateResourceCode">
          <slot name="transportCertificateResourceCode"></slot>
        </div>
        <!-- 许可证号码 -->
        <div class="el-col el-col-8">
          <slot name="transportCertificate"></slot>
        </div>
        <!-- 证件过期日期 -->
        <div class="el-col el-col-8">
          <slot name="transportCertificateExpirationDate"></slot>
        </div>
        <!-- 法人代表身份证附件 -->
        <div class="el-col el-col-8 el-col-legalPersonResourceCode">
          <slot name="legalPersonResourceCode"></slot>
        </div>
        <!-- 法人代表姓名 -->
        <div class="el-col el-col-8">
          <slot name="legalPersonName"></slot>
        </div>
        <!-- 法人代表身份证号 -->
        <div class="el-col el-col-8 el-col-legalPersonIdentityNumber">
          <slot name="legalPersonIdentityNumber"></slot>
        </div>
        <!-- 外部编码 -->
        <div class="el-col el-col-8">
          <slot name="orgExternalNo"></slot>
        </div>
        <!-- 业务联系人 -->
        <div class="el-col el-col-8">
          <slot name="linkmanFullName"></slot>
        </div>
        <!-- 联系电话 -->
        <div class="el-col el-col-8">
          <slot name="linkmanPhone"></slot>
        </div>
        <!-- 所在地 -->
        <div class="el-col el-col-16 el-bottom">
          <slot name="orgArea"></slot>
        </div>
        <!--详细地址  -->
        <div class="el-col el-col-8 el-bottom">
          <slot name="orgAddress"></slot>
        </div>
        <!-- 激活状态 -->
        <div class="el-col el-col-8">
          <slot name="orgStatus"></slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import { apiOrgDomain} from '../../api/ApiConst'
export default {
  props: {
    domainObject: Object,
    isEdit: Boolean,
    editable: Boolean,
    objectName: '',
    isReadOnly: {
      type: Boolean,
      'default': false
    },
    canEdit: {
      type: Boolean,
      'default': true
    }
  },
  data() {
    return {
      projectName: JSON.parse(localStorage.getItem('appInfo')).projectName,
      centerDialogVisible:false,
      codeImg:''
    }
  },
  mounted() {
  },
  created() {
    // console.log('123');
  },
  methods: {
    obtainMes() {
      this.$emit('obtains');
    },
    showQRcode(){
        this.centerDialogVisible = true;
        const url = `${apiOrgDomain}/org/generate_qr_code/string?code=${this.domainObject.orgCode}`
        this.codeImg = url;
      }
  },
  computed: {
    showOrgType(){
      return true;
    },
    text() {
      let text = '';
      if (this.domainObject.certStatus === 'authenticating') {
        text = '认证中';
      }
      if (this.domainObject.certStatus === 'authenticated') {
        text = '已认证';
      }
      return text;
    },
    hideFields() {
      return false;
    }
  },
};

</script>
<style lang="scss" rel="stylesheet/scss">
.el-dialog{
  width: auto;
    .el-dialog__body{
        max-height: 100%;
        text-align: center;
    }
} 
.icon-erweima{
  cursor:pointer;
  background: url('../assets/erweima.png') no-repeat;
  background-size: 100%;
  width:24px;
  height: 24px;
  display: inline-block;
}
</style>
