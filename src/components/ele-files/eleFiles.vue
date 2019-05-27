/**
* eleFiles.vue
* Created by cc on 18/4/19.
*/
<template>
  <div class="block">
    <el-form-item :prop="this.configData.field" :rules="rules" v-if="!isList && editable">
      <el-upload class="upload-files" :class="{'upload-disabled' : isDisabled}"
        :id="id"
        :with-credentials="withCredentials"
        :action="actionUrl"
        :data="dataParams"
        :before-upload="beforeUpload"
        :on-preview="handlePreview"
        :on-success="handleSuccess"
        :on-error="handleError"
        :on-remove="handleRemove"
        :file-list="fileList">
        <el-button size="small" type="primary" :disabled="isDisabled">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">建议上传.jpg/.gif/.png/.txt/.pdf/.doc/.docx/.zip/.rar类型文件，且不超过5MB。</div>
      </el-upload>
    </el-form-item>
    <div class="files-list" v-if="!editable">
      <ul class="files">
        <li v-for="item in fileList" :key="item.index">
          <a :href="item.url" :download="item.name" class="blue" target="_blank">{{ item.name }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">

import { getParamsFromURL } from '../../../api/Utils';

const axios = require('axios');
axios.defaults.withCredentials = true;

export default {
  inject: ['eventBus'],
  props: {
    configData: Object,
    editable: {
      type: Boolean,
      'default': true
    },
    isList: {
      type: Boolean,
      'default': false
    },
    domainObject: Object,
    uploadUrl: String,
    rules: Array,
    withCredentials: {
      type: Boolean,
      'default': true
    },
    maxLength: {
      type: Number,
      'default': 3
    }
  },
  data() {
    return {
      fileList: [],
      actionUrl: `${this.uploadUrl}/fw/file/update`,
      getUrl: `${this.uploadUrl}/fw/file/{resourceCode}.{suffix}`,
      id: `files${this.configData.field}`,
      count: 0,
      isDisabled: false,
      dataParams: {}
    };
  },
  watch: {
    'editable': function (val) {
      console.log('ele files editable is: ', val);
      console.log('fileList is: ', this.fileList);

    },
    isList() {
      console.log('ele files isList is: ', this.isList);
    }
  },
  methods: {
    form() {
      let parent = this.$parent;
      if (parent) {
        while (parent && parent.$options && parent.$options.componentName !== 'eleForm') {
          parent = parent.$parent;
        }
        return parent;
      }
      return null;
    },
    init() {

    },
    syncResourceCodes(fileList) {
      this.fileList = fileList;
      if (fileList.length > 0) {
        const tempArray = [];
        fileList.forEach((item) => {
          tempArray.push(item.response.content.resourceCode);
        });
        this.domainObject[this.configData.field] = tempArray.join(':');
      }
    },
    initFiles(resCodeArray) {
      this.fileList = [];
      resCodeArray.forEach((val, index) => {
        const getFileUrl = `${this.uploadUrl}/fw/file/${val}/get`;
        axios.get(getFileUrl).then((success) => {
          console.log('success is ', success);
          const data = success.data.content,
            fileObj = {
              index: index,
              name: data.originalName,
              url: data.url,
              resourceCode: data.resourceCode,
              response: {
                content: {
                  originalName: data.originalName,
                  resourceCode: data.resourceCode,
                  url: data.url
                }
              }
            };
          this.fileList.push(fileObj);
        });
      });
    },
    handleSuccess(res, file, fileList) {
      console.log('upload success! res is ', res, 'file is ', file, 'fileList is ', fileList);
      fileList.length < 3 ? (this.isDisabled = false) : (this.isDisabled = true);
      this.syncResourceCodes(fileList);
    },
    handleError(err, file, fileList) {
      console.log('upload error! error is ', err, 'file is ', file, 'fileList is ', fileList);
    },
    beforeUpload(file) {
      console.log('file is: ', file);
      console.log('file type is: ', file.type);
      this.$set(this.dataParams, 'fileName', encodeURI(file.name));
      // const isType = (file.type === 'image/jpeg' || 'image/gif' || 'image/png' || 'text/plain' || 'application/pdf' || 'application/msword' || 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 'application/x-zip-compressed' || 'application/octet-stream'),
      const isLt5M = file.size / 1024 / 1024 < 5,
        $el = document.querySelector(`#${this.id}`);
      // if (!isType) {
      //   this.$message.error('上传附件仅限.jpg/.gif/.png/.txt/.pdf/.doc/.docx/.zip/.rar格式!');
      //   return false;
      // }
      if (!isLt5M) {
        this.$message.error('上传附件大小不能超过 5MB!');
        return false;
      }
      // return isType && isLt5M;
      return isLt5M;
    },
    handleRemove(file, fileList) {
      console.log('remove success! file is ', file, 'fileList is ', fileList);
      fileList.length < 3 ? (this.isDisabled = false) : (this.isDisabled = true);
      this.syncResourceCodes(fileList);
    }
  },
  beforeCreate() {
  },
  mounted() {
    const resCodes = this.domainObject[this.configData.field],
      resCodeArray = resCodes ? resCodes.split(':') : [];
    resCodeArray.length < 3 ? (this.isDisabled = false) : (this.isDisabled = true);
    this.initFiles(resCodeArray);
  },
  created() {
    if (!this.isList) {
      if (this.eventBus) {
        this.eventBus.$emit('eleCreated', this);
      }
    }
    // console.log('isList: ', this.isList);
  }
};
</script>

<style lang="scss" rel="stylesheet/scss">
.upload-disabled {
  position: relative;
  &:before {
    content: '';
    position: absolute;
    top: 0;
    // right: 0;
    // bottom: 0;
    left: 0;
    width: 66px;
    height: 26px;
    background-color: rgba(255, 255, 255, .5);
    cursor: not-allowed;
  }
}
</style>
