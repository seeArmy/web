<template>
  <div class="custom-page">
    <div class="section">
      <div class="el-row">
        <div class="el-col el-col-24">
          <slot name="payeeDriverFullName"></slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  props: {
    domainObject: Object,
    isEdit: Boolean,
    editable: Boolean,
    addMode: Boolean,
    objectName: '',
    showLoadingUnloading: Boolean,
    disableModeSelect: {
      type: Boolean,
      'default': false
    }
  },
  mounted() {
    console.log('layout mounted', this.$slots);
  },
  created() {
    console.log('123========================', this.disableModeSelect);
  }
};

</script>
<style lang="scss" rel="stylesheet/scss">
@import "../assets/sass/base.scss";




.el-form-item__label {
  font-size: 13px;
}

.block {
  .innerblock {
    &:last-child {
      margin-right: 0;
    }
  }
}

.sepline {
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: solid 1px #ddd;
}

.form-page {
  .el-select {
    vertical-align: top !important;
  }
}

</style>
