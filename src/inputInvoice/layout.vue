<template>
  <div class="custom-page">
    <div class="page-header clearfix">
      <h2 class="page-title fl">
        {{ isEdit ? ( editable ? '编辑' + objectName : objectName + '详情' ): ( '新建' + objectName) }}
      </h2>
      <div class="hd-opr fr">
        <slot name="buttonEdit"></slot>
        <slot name="buttonCancel"></slot>
        <slot name="buttonSave"></slot>
        <!-- <slot name="buttonChangeLog"></slot> -->
      </div>
      <span id="pageRefresh" class="page-refresh fr"><i class="ico-refresh"></i>刷新
      </span>
    </div>
    <!-- 1 -->
    <div class="section">
      <h2 class="tmp-title">
      	    基本信息
        </h2>
      <div class="el-row">
        <div class="el-col el-col-8">
          <slot name="inputNo"></slot>
        </div>
        <div class="el-col el-col-8">
          <slot name="invoiceType"></slot>
        </div>
        <div class="el-col el-col-8">
          <slot name="invoiceNo"></slot>
        </div>
        <div class="el-col el-col-8">
          <slot name="invoiceTime"></slot>
        </div>
        <div class="el-col el-col-8">
          <slot name="receiveInvoiceTime"></slot>
        </div>
        <div class="el-col el-col-8">
          <slot name="attributionDate"></slot>
        </div>
      </div>
    </div>
    <!-- 2 -->
    <div class="section secpart clearfix">
      <div class="el-row">
        <div class="el-col el-col-24 el-col-height">
          <h2 class="tmp-title">
		      	    购买方信息（本公司）
		        </h2>
          <div class="el-row">
            <div class="el-col el-col-12">
              <slot name="payerOrgName"></slot>
            </div>
            <div class="el-col el-col-12">
              <slot name="longBillNo"></slot>
            </div>
            <div class="el-col el-col-24">
              <slot name="payerOrgTaxNumber"></slot>
            </div>
            <div class="el-col el-col-24">
              <slot name="payerOrgAddress"></slot>
            </div>
            <div class="el-col el-col-24">
              <slot name="payerOrgTelephone"></slot>
            </div>
            <div class="el-col el-col-24">
              <slot name="payerOrgBankName"></slot>
            </div>
            <div class="el-col el-col-24">
              <slot name="payerOrgBankAccountNo"></slot>
            </div>

          </div>
        </div>
        <!-- <div class="el-col el-col-10">
    			<h2 class="tmp-title">
		      	    账单收票余额
		        </h2>
			    <div class="el-row">
			    	<div class="el-col el-col-24">
			    		<slot name="payableAmount"></slot>
			    	</div>
			    	<div class="el-col el-col-24">
			    		<slot name="invoicedAmount"></slot>
			    	</div>
			    	<div class="el-col el-col-24">
			    		<slot name="remainderInvoiceAmount"></slot>
			    	</div>
			    </div>
    		</div> -->
      </div>
    </div>
    <!-- 3 -->
    <div class="section">
      <h2 class="tmp-title">
      	    税目信息
        </h2>
      <slot name="taxInfo"></slot>
    </div>
    <!-- 4 -->
    <div class="section secpart clearfix">
      <div class="el-row">
        <div class="el-col el-col-14 el-col-height">
          <h2 class="tmp-title">
		      	    销售方信息
		        </h2>
          <div class="el-row">
            <div class="el-col el-col-24">
              <slot name="payeeOrgName"></slot>
            </div>
            <div class="el-col el-col-24">
              <slot name="payeeOrgTaxNumber"></slot>
            </div>
            <div class="el-col el-col-12">
              <slot name="payeeOrgAddress"></slot>
            </div>
            <div class="el-col el-col-12">
              <slot name="payeeOrgTelephone"></slot>
            </div>
            <div class="el-col el-col-12">
              <slot name="payeeOrgBankName"></slot>
            </div>
            <div class="el-col el-col-12">
              <slot name="payeeOrgBankAccountNo"></slot>
            </div>
          </div>
        </div>
        <div class="el-col el-col-10">
          <h2 class="tmp-title">
		      	    备注
		        </h2>
          <div class="el-row">
            <div class="el-col el-col-24 el-col-description">
              <slot name="description"></slot>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- tabs -->
    <el-tabs type="border-card" v-if="isEdit">
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

.form-page {
  .el-row {
    .tmp-title {
      margin-left: 0;
    }
  }

  .secpart {
    .el-col {
      height: auto !important;
    }

    .el-form-item__label {
      width: 150px !important;
    }

    .el-form-item__content {
      margin-left: 150px !important;

      .el-form-item__content {
        margin-left: 0 !important;
      }
    }

    .el-dialog__wrapper {

      .el-form-item__label {
        width: 100px !important;
      }

    }


  }
}

.secpart {
  .el-col-height {
    .el-col {
      height: 31px !important;
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

.el-col-description .el-textarea__inner {
  height: 144px !important;
}

.form-page .el-row .el-col-12:nth-child(6n),
.form-page .el-row .el-col-12:nth-child(6n-1) {
  margin-bottom: 0 !important;
  border-bottom: 0 !important;
}

.el-tab-pane {

  .page-title,
  #pageRefresh,
  .hd-opr .innerblock,
  .hd-opr .el-button--default,
  .opr-button {
    display: none;
  }

  .list-page .page-header {
    padding: 0;
    border-bottom: 0;
  }
}

@media (max-width: 1366px) {
  .el-select {
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
