<template>
  <div class="custom-page">
  	<div class="page-header clearfix">
      <h2 class="page-title fl">
        {{ objectName }}
      </h2>
      <div class="hd-opr fr">
      	<!-- <slot name="buttonEdit"></slot>
        <slot name="buttonCancel"></slot>
        <slot name="buttonSave"></slot> -->
      </div>
      <span id="pageRefresh" class="page-refresh fr"><i class="ico-refresh"></i>刷新</span>
    </div>
    <!-- cert-status -->
    <div class="cert-status">
      认证状态： <strong class="org">{{ text }}</strong>
    </div>
  	<!-- 1 -->
    <div class="section">
        <h2 class="tmp-title">
      	    公司信息
        </h2>
	    <div class="el-row">
        <div class="el-col el-col-24">
          <slot name="orgName"></slot>
        </div>
	    	<div class="el-col el-col-24 el-col-orgFullName">
	    		<slot name="orgFullName"></slot>
	    	</div>
	    </div>
    </div>
    <!-- 2 -->
    <div class="section">
        <h2 class="tmp-title">
            营业执照
        </h2>
      <div class="el-row">
        <div class="el-col el-col-24">
          <slot name="businessLicenseIssuanceDate"></slot>
        </div>
        <div class="el-col el-col-24">
          <slot name="businessLicenseExpirationDate"></slot>
        </div>
        <div class="el-col el-col-24 el-col-auto">
          <slot name="businessLicenseResourceCode"></slot>
        </div>
      </div>
    </div>
    <div class="form-button" v-show='editable || !isEdit'>
    	<slot name="buttonVerify"></slot>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      certStatus: '',
      isEdit: Boolean,
      editable: Boolean,
      objectName: ''
    },
    computed: {
      text() {
        switch(this.certStatus) {
          case 'unauthenticated':
          return '未认证';
          case 'authenticating':
          return '认证中';
          case 'authenticated':
          return '认证成功';
          case 'failed':
          return '认证失败';
          default:
          return '未认证';
        }
      }
    },
    created() {
      // console.log('123');
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
@import "../assets/sass/base.scss";
.cert-status {
  padding: 20px 20px 0;
  font-size: 14px;
}
.el-col-orgFullName {
  .el-input__inner {
    width: 320px;
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
</style>
