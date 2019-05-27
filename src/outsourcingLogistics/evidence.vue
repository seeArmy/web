<template>
  <div class="tabEvidence">
    <!-- <el-button type="primary" @click="save" class="saveImg" v-show="editable">保存</el-button> -->
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
  import { change } from '../../api/OutsourcingLogisticsService';

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
        // if (!this.domainObject.voucherResourceCode) {
        //   this.$message({
        //     type: 'warning',
        //     message: '请上传至少一张凭证图片再保存！',
        //     duration: 3000
        //   });
        //   return false;
        // }
        change({code: this.domainObject.code, voucherResourceCode: this.domainObject.voucherResourceCode}, (success, error) => {
          if (error || success.code !== 200) {
            this.$message({
              type: 'warning',
              message: `${error.content}`,
              duration: 3000
            });
            return false;
          }
          if (success) {
            this.$message({
              type: 'success',
              message: '上传成功！',
              duration: 3000
            });
            console.log('upload success', success.content);
          }
        });
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
