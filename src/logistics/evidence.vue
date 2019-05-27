<template>
  <div class="tabEvidence">
    <!-- <el-button @click="save">保存</el-button> -->
    <ele-file-upload 
      :configData="configData" 
      :domainObject="domainObject" 
      :uploadUrl="uploadUrl" 
      :action="actionUrl" 
      :listType="listType"
      :editable="editable"
    >
    </ele-file-upload>
  </div>
</template>
<script type="text/ecmascript-6">
  import eleFileUpload from '../components/ele-file-upload/eleFileUpload.vue';

  export default {
    components: {
      'ele-file-upload': eleFileUpload
    },
    props: {
      domainObject: Object,
      uploadUrl: String,
      editable: {
        type: Boolean,
        'default': true
      }
    },
    data() {
      return {
        configData: {
          controlType: 'file',
          field: 'voucherResourceCode',
          dialogPreview: 'TRUE'
        },
        listType: 'picture-card',
        actionUrl: `${this.uploadUrl}/fw/image/update`
      };
    },
    methods: {
      save() {

      }
    },
    created() {
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
.tabEvidence {
  min-height: 380px;
  .saveImg {
    margin-bottom: 10px;
  }
}
</style>
