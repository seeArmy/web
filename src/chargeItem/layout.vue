<template>
  <div class="custom-page form-page">
  	<div class="page-header clearfix">
      <h2 class="page-title fl">
        {{ isEdit ? ( editable ? '编辑' + objectName : objectName + '详情' ): ( '新建' + objectName) }}
      </h2>
      <div class="hd-opr fr">
        <slot name="buttonEdit"></slot>
        <slot name="buttonCancel"></slot>
        <slot name="buttonSave"></slot>
      </div>
      <span id="pageRefresh" class="page-refresh fr"><i class="ico-refresh"></i>刷新
      </span>
    </div>
  	<!-- 1 -->
    <div class="section">
	    <div class="el-row">
	    	<div class="el-col el-col-12">
	    		<slot name="seqNo"></slot>
	    	</div>
	    	<div class="el-col el-col-12">
	    		<slot name="chargeItemName"></slot>
	    	</div>
	    	<div class="el-col el-col-12">
	    		<slot name="code"></slot>
	    	</div>
	    	<div class="el-col el-col-12">
	    		<slot name="disabled"></slot>
	    	</div>

	    	<div class="el-col el-col-12">
	    		<slot name="paymentChannel"></slot>
	    	</div>
        <div class="el-col el-col-12">
          <slot name="paymentApproveType"></slot>
        </div>
	    </div>
    </div>
    <div class="section" >
      <slot name="table"></slot>
    </div>
    <div class="form-button" v-show='editable || !isEdit'>
    	<slot name="buttonSubmit"></slot>
    	<slot name="buttonReset"></slot>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      isEdit: Boolean,
      editable: Boolean,
      objectName: ''
    },
    mounted() {
      console.log('layout mounted', this.$slots);
    },
    created() {
      // console.log('123');
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
@import "../assets/sass/base.scss";
.form-button {
	text-align: center;
	padding: 20px;
}
.el-form-item__label {
	font-size: 13px;
  width: 130px !important;
}
.el-form-item__content {
  margin-left: 130px !important;
  .el-form-item__content {
    margin-left: 0 !important;
  }
}
.el-col-12:nth-child(6n), .el-col-12:nth-child(6n-1) {
  margin-bottom: 0 !important;
  border-bottom: 0 !important;
}

</style>
