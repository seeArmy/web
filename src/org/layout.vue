<template>
  <div class="custom-page company-page">
  	<div class="page-header clearfix">
      <h2 class="page-title fl">
        {{ isEdit ? ( editable ? '编辑' + objectName : objectName + '信息' ): ( '新建' + objectName) }}
      </h2>
      <div class="hd-opr fr">
        <slot name="buttonVerify"></slot>
      	<slot name="buttonEdit"></slot>
        <slot name="buttonCancel"></slot>
        <slot name="buttonSave"></slot>
      </div>
      <span id="pageRefresh" class="page-refresh fr"><i class="ico-refresh"></i>刷新</span>
    </div>
    <el-dialog title="公司二维码" :visible.sync="centerDialogVisible" width="30%" center>
        <img :src="codeImg"  alt="">
        <span style="display:block;">公司名称:{{domainObject.orgFullName}}</span>
    </el-dialog>
  	<!-- 1 -->
    <div class="section">
        <h2 class="tmp-title">
      	    公司信息<span class="org" v-if="!canEdit">（注：当前公司认证状态为{{ text }}，此版块信息不可编辑）</span>
        </h2>
      <div class="el-row">
        <!-- 公司全称 -->
        <div class="el-col el-col-8">
          <slot name="orgFullName"></slot>
          
        </div>  
        <!-- 客户简称 -->
        <div class="el-col el-col-8">
          <slot name="orgName"></slot>
        </div>
         <!-- 公司二维码 -->
        <div  class="el-col el-col-8" v-show="isEdit">
           <span class="el-form-item__label">公司二维码:</span><div class="icon-erweima" v-on:click="showQRcode"></div>
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
      <template v-if="clientDetailColumns.length > 0">
        <h2 class="tmp-title">
              扩展信息
          </h2>
        <div class="el-row">
          <div class="el-col el-col-6" v-for="field in clientDetailColumns" :key="field">
            <slot :name="field"></slot>
          </div>
        </div>
      </template>
	    <div v-show="isEdit">
	    	<slot name="bankInfo"></slot>
	    </div>
    </div>
    <!-- tabs -->
    <el-tabs type="border-card" v-if="isEdit">
      <el-tab-pane label="账户信息">
        <slot name="tabBankAccount"></slot>
      </el-tab-pane>
     <!--  <el-tab-pane label="附件">
        附件
      </el-tab-pane> -->
      <el-tab-pane label="变更记录">
        <slot name="tabChangeLog"></slot>
      </el-tab-pane>
    </el-tabs>
    <div class="form-button" v-show='editable || !isEdit'>
    	<slot name="buttonSubmit"></slot>
    	<slot name="buttonReset"></slot>
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
      clientDetailColumns: Array,
      canEdit: {
        type: Boolean,
        'default': true
      }
    },
    computed: {
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
      },
      showOrgType(){
        return true; 
      },
    },
    data() {
      return {
        projectName: JSON.parse(localStorage.getItem('appInfo')).projectName || '',
        centerDialogVisible:false,
        codeImg:''
      }
    },
    created() {
    },
    methods:{
      showQRcode(){
        this.centerDialogVisible = true;
        const url = `${apiOrgDomain}/org/generate_qr_code/string?code=${this.domainObject.code}`
        this.codeImg = url;
      }
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
@import "../assets/sass/base.scss";
.el-col-transportCertificateResourceCode {
  .el-form-item__label {
    width: 166px !important;
  }
  .el-form-item__content {
    margin-left: 166px !important;
    .el-form-item__content {
      margin-left: 0 !important;
    }
  }
}

.el-col-legalPersonResourceCode {
  .el-form-item__label {
    width: 140px !important;
  }
  .el-form-item__content {
    margin-left: 140px !important;
    .el-form-item__content {
      margin-left: 0 !important;
    }
  }
}

.el-col-legalPersonIdentityNumber {
  .el-form-item__label {
    width: 126px !important;
  }
  .el-form-item__content {
    margin-left: 126px !important;
    .el-form-item__content {
      margin-left: 0 !important;
    }
  }
}

// 主要是修复Ui 的bug
.company-page {
  .el-dialog{
     width: auto;
    .el-dialog__body{
        max-height: 100%;
        text-align: center;
      }
  } 
  .el-col {
    height: 45px !important;
  }
  .form-button {
    .el-button {
      width: auto !important;
    }
  }
  .hd-opr {
    .el-button {
      width: auto !important;
    }
  }
  .fix_bug_tag {
    .el-button {
      width: auto !important;
    }
  }
  .list-page {
    .el-button {
      width: auto !important;
    }
  } // 修改图片格式样式 --start  把下面包裹在layout_partner 里面 8-2
  .el-upload--picture-card {
    width: 36px;
    height: 36px;
    line-height: 44px;
  }
  .el-upload-list--picture-card .el-upload-list__item {
    width: 36px;
    height: 36px;
  }
  .el-upload-list--picture-card .el-upload-list__item-status-label {
    width: 33px;
    height: 21px;
  }
  .el-upload-list__item-preview {
    float: left;
    margin-left: -3px;
  }
  .file-component .el-upload-list__item-delete {
    float: right;
    margin-right: 0px;
  }
  .el-upload-list--picture-card .el-upload-list__item-actions .el-upload-list__item-delete {
    position: absolute;
    font-size: 10px;
    line-height: 36px;
    right: 3px;
  }
  .file-list-item {
    width: 36px!important;
    height: 36px!important;
  }
  .file-list-item .pre-mask {
    line-height: 36px;
  }
  .el-icon-upload-success .el-icon-check {
    font-size: 10px;
  }
  .el-icon-view {
    font-size: 15px;
    vertical-align: top;
    margin-top: 10px;
    padding: 0 5px;
  }
  .el-icon-delete2 {
    position: relative;
    left: 3px;
  } // 修改图片格式样式 ---end
}
.list-page {
  height: auto !important;
  .fix-table-wrap {
    height: auto !important;
    max-height: 607px;
    .rl-fix-table {
      margin-left: 0 !important;
    }
  }
}
.form-button {
	text-align: center;
	padding: 20px;
}
.el-form-item__label {
	font-size: 13px;
}
.el-textarea__inner {
	min-width: auto !important;
}
.form-page .el-row .el-col-12:nth-child(6n), .form-page .el-row .el-col-12:nth-child(6n-1) {
	margin-bottom: 0 !important;
	border-bottom: 0 !important;
}
.el-tab-pane {
  .page-title, #pageRefresh, .hd-opr .innerblock, .hd-opr .el-button--default, .opr-button {
    display: none;
  }
  .list-page .page-header {
    padding: 0;
    border-bottom: 0;
  }
}
@media (max-width: 1366px) {
	.form-page .el-select {
		width: 164px;
	}
	.complex-control-2 {
		.el-input {
			width: 83px;
		}
		.el-select {
			width: 70px !important;
		}
	}
	.form-page .innerblock .el-date-editor {
		width: 165px !important;
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
