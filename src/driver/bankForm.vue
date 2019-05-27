<template>
  <div>
    <div class="form-page bankSection" id="bankSection" :class="{readonly : !bankCanEdit}">
      <el-form :model="domainObject" ref="verifyForm" label-width="100px" :inline="false">
        <bank-form-layout :isEdit="isEdit" :editable="editable" :objectName="objectName" :bankCanEdit="bankCanEdit" :domainObject="domainObject">
          <div v-for="field in fields" :slot="field.fieldConfigCode">
            <el-form-item :label="field.showName" :required="field.required ==='true'">
              <ele-block :field="field" :domainObject="domainObject" :editable="editable && bankCanEdit" :uploadUrl="uploadUrl" :inputKey="inputKey"></ele-block>
            </el-form-item>
          </div>
        </bank-form-layout>
      </el-form>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import bankFormLayout from './bankFormLayout.vue';
  import eleBlock from '../components/ele-block/eleBlock.vue';

  export default {
    components: {
      'bank-form-layout': bankFormLayout,
      'ele-block': eleBlock
    },
    props: {
      domainObject: Object,
      inputKey: Array,
      uploadUrl: String,
      objectName: String,
      isEdit: Boolean,
      bankCanEdit: {
        type: Boolean,
        'default': true
      },
      editable: Boolean,
      btnDisabled: Boolean,
      fields: Array,
      showBtn: {
        type: Boolean,
        'default': false
      }
    },
    data() {
      return {
      };
    },
    methods: {
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
.bankSection {
  .el-col {
    height: 45px !important;
    .innerblock {
      vertical-align: top;
    }
  }
  .el-upload--picture-card {
    width: 36px;
    height: 36px;
    line-height: 36px;
    i {
      font-size: 14px;
    }
  }
  .el-upload-list--picture-card .el-upload-list__item,.file-list-item {
    width: 36px;
    height: 36px;
  }
  .pre-mask {
    line-height: 36px;
    font-size: 13px;
  }
  .el-upload-list--picture-card .el-upload-list__item-status-label {
    transform: rotate(45deg) scale(.5);
    top: -9px;
    right: -18px;
  }
  .el-upload-list--picture-card .el-upload-list__item-actions {
    font-size: 13px;
  }
  .el-upload-list--picture-card .el-upload-list__item-actions .el-upload-list__item-delete {
    margin: 0 0 0 3px;
    float: none;
  }
}
.readonly {
  .el-button--line {
    display: none !important;
  }
}

</style>
