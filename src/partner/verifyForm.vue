<template>
  <div>
    <div class="form-page" id="verifySection" :class="{readonly : !canEdit}">
      <el-form :model="domainObject" ref="verifyForm" label-width="100px" :inline="false">
        <verify-form-layout :isEdit="isEdit" :isReadOnly="isReadOnly" :text="text" :editable="editable && canEdit" :canEdit="canEdit" :domainObject="domainObject" :objectName="objectName" @obtains="obtains" >
          <div v-for="field in fields" :slot="field.fieldConfigCode" >
            <el-form-item :label="field.showName" :required="field.required ==='true'">
              <ele-block :field="field" :domainObject="domainObject" :editable="editable && canEdit" :uploadUrl="uploadUrl" :inputKey="inputKey"></ele-block>
            </el-form-item>
          </div>
        </verify-form-layout>
      </el-form>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import verifyFormLayout from './verifyFormLayout.vue';
  import eleBlock from '../components/ele-block/eleBlock.vue';
  export default {
    components: {
      'verify-form-layout': verifyFormLayout,
      'ele-block': eleBlock
    },
    props: {
      domainObject: Object,
      inputKey: Array,
      uploadUrl: String,
      objectName: String,
      isEdit: Boolean,
      canEdit: {
        type: Boolean,
        'default': true
      },
      isReadOnly: {
        type: Boolean,
        'default': false
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
        text:'',
      };
    },
    methods: {
      showError(text) {
        this.$message({
          type: 'error',
          showClose: true,
          message: text,
          duration: 5000
        });
        return false;
      },
      obtains() {
        this.$emit('showObtains');
      }
    },
  };
</script>

<style lang="scss" rel="stylesheet/scss">
#verifySection {
  .el-col {
    height: 45px;
  }
  .el-upload--picture-card {
    width: 36px;
    height: 36px;
    line-height: 36px;
    i {
      font-size: 14px;
    }
  }
  .el-upload-list--picture-card .el-upload-list__item {
    width: 36px;
    height: 36px;
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
