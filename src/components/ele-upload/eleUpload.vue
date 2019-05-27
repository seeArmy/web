<template>
  <div>
    <el-upload
      :show-file-list="showFileList"
      with-credentials
      :data="uploadParams"
      :before-upload="beforeUpload"
      :on-success="handleSuccess"
      :on-error="handleError"
      :accept="accept"
      :action="action">
      <el-button type="primary" @click="importClick">导入{{objectName}}</el-button>
    </el-upload>
    <el-dialog
      :title="objectName + '列表'"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      size="large">
      <v-table :getData="getData" :deleteFun="deleteFun" :selectable="selectable" :operatable="operatable" :editUrl="editUrl" :actionUrl="actionUrl"
               :dispatch="dispatch" :dispatchUrl="dispatchUrl"
               :columnsData="columnsData" :listData="listData"
               :searchData="searchData" :actionData="actionData" :operValues="operValues" :objectName="objectName" :uploadUrl="uploadUrl"
               v-loading.fullscreen.lock="loading">
      </v-table>
      <v-page :page="page" :pageSize="pageSize" :total="total" v-on:change="change"></v-page>
      <span slot="footer" class="dialog-footer">
      <!-- <span v-show="errorNum != 0">错误{{ errorNum }}条 <a href="javascript:;" @click="download">下载错误记录</a></span> -->
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="importData" v-loading.fullscreen.lock="fullscreenLoading" :element-loading-text="loadingText" :disabled="importDisabled" id="importCsv">导入{{ objectName }}</el-button>
    </span>
    </el-dialog>
    <ele-progress-dialog ref="progressDialog" :percentage="progressBar.percentage" :msg="progressBar.msg" :title="progressBar.title" :onClose="onProgressClose" :errorNum="errorNum" @downError="download"></ele-progress-dialog>
  </div>
</template>
<script>
  import table from '../../components/ele-list/eleTable.vue';
  import page from '../../components/ele-list/elePage.vue';
  import progress from '../../components/eleProgressDialog.vue';

  export default {
    inject: ['eventBus'],
    components: {
      'v-table': table,
      'v-page': page,
      'ele-progress-dialog':progress
    },
    props: {
      action: {
        type: String,
        'default': ''
      },
      accept:{
          type:String,
          'default':''
      },
      objectName: String,
      getColumn: Function,
      getImportColumn: Function,
      columnsData: null,
      exportSize: 3000,
      add: Function,
      downloadErrorData: Function,
      searchFields: [],
      searchModel: {}
    },
    data() {
      return {
        listData: Array,
        dialogVisible: false,
        searchData: null,
        getData: Function,
        editUrl: '',
        actionUrl: '',
        showFileList: false,
        uploadParams: {},
        deleteFun: null,
        actionData: null,
        operValues: {
          code: ''
        },
        uploadUrl: '',
        dispatch: false,
        dispatchUrl: '',
        selectable: false,
        operatable: false,
        loading: false,
        errorNum: 0,
        errorData: null,
        importDisabled: false,
        fullscreenLoading: false,
        loadingText: '',
        allData: Array,
        page: 1,
        pageSize: 20,
        total: 0,
        progressBar:{   // 批量上传进度条
          title: "正在处理",
          total: 0,
          finished: 0,
          isShow: false,
          percentage: 0,
          msg: ''
        }
      };
    },
    methods: {
      importClick() {
        this.$emit('importClick');
      },
      beforeUpload(file) {
        console.log('upload file is ', file);
        console.log('this columnsData is', this.columnsData);
        // 上传之前获取传递参数
        if (this.getImportColumn) {
          // 运力车辆列表导入特殊处理
          this.getImportColumn((success) => {
            // console.log('this getColumn is', success);
            // console.log('this getColumn JSON stringify is', JSON.stringify(success.content));
            this.$set(this.uploadParams, 'configList', JSON.stringify(success.content));
          });
        } else {
          this.getColumn((success) => {
            // console.log('this getColumn is', success);
            // console.log('this getColumn JSON stringify is', JSON.stringify(success.content));
            this.$set(this.uploadParams, 'configList', JSON.stringify(success.content));
          });
        }

        console.log('this.uploadParams type is==========', typeof(this.uploadParams), this.uploadParams);
        
        this.$emit('beforeUpload');
        this.loadingText = '数据正在加载中，请稍等……';
        this.fullscreenLoading = true;
      },
      handleError(err, file, fileList) {
        this.fullscreenLoading = false;
        console.error('upload failed', err);
        this.$message({
          type: 'error',
          message: '上传失败，请稍后再试！',
          duration: 3000
        });
      },
      handleSuccess(response) {
        this.importDisabled = false;
        this.fullscreenLoading = false;
        if (response && response.code === 200) {
          this.errorNum = 0;
          this.dialogVisible = true;
          this.allData = response.content;
          this.total = response.content.length;
          this.loadData(1, 20);
          // this.$emit('uploadSuccess', this.listData);
        } else {
            alert("上传失败！\n" + response.content ? response.content : response.code);
          console.error('upload error', response);
        }
      },
      text(e) {
        let t = '';
        const eTemp = e.childNodes || e;
        for (let j = 0; j < eTemp.length; j++) {
          t += eTemp[j].nodeType !== 1 ? eTemp[j].nodeValue.trim() : this.text(eTemp[j].childNodes);
        }
        return t;
      },
      loadData(page, size) {
        this.listData = this.allData.slice((page-1)*size, page*size);
        this.$emit('uploadSuccess', this.listData);
      },
      change(newPage, newSize) {
        this.page = newPage;
        this.pageSize = newSize;
        this.loadData(newPage, newSize);
      },
      onProgressClose() {
        window.location.reload();
      },
      importData() {
        const self = this,
          errorData = [],
          length = self.allData.length;
        let finishedCount = 0,
          successedCount = 0,
          failedCount = 0
        self.progressBar.percentage = 0;
        self.$refs.progressDialog.show();
        self.progressBar.title = "正在导入";
        self.progressBar.msg = `正在导入 0/${length}`;
        // 导入时将全部数据导入
        self.allData.forEach((data) => {
          self.add(data, (data_) => {
            finishedCount += 1;
            if (data_ && data_.code === 200) {
              // console.log(data_);
              successedCount += 1;
            } else {
              failedCount += 1;
              errorData.push(data);
              self.errorNum = failedCount;
              self.errorData = errorData;
              self.$set(data, 'error', true);
            }
            const progress = Math.floor((finishedCount * 1.0) / (length * 1.0) * 100);
            self.progressBar.percentage= progress;
            self.progressBar.msg=`正在导入 ${finishedCount}/${length}`;
            if (finishedCount === length) {
              self.progressBar.msg=`导入成功${successedCount}条记录，导入失败${failedCount}条记录`;
            }
          });
        });
      },
      download() {
        const self = this,
          param = {},
          trEl = this.$el.querySelector('table').querySelectorAll('tr');
        for (let j = 1; j < trEl.length; j++) {
          if (trEl[j].dataset.error === 'true') {
            const tdsEl = trEl[j].querySelectorAll('td');
            for (let i = 0; i < self.columnsData.length; i++) {
              const key = self.columnsData[i].fieldConfigCode;
              if (!param[key]) {
                param[key] = [];
              }
              param[key].push(self.text(tdsEl[i]));
            }
          }
        }
        Object.keys(param).forEach((key) => {
          param[key] = param[key].join(',');
        });
        this.downloadErrorData(param, (data) => {
          if (data && data.code === 200) {
            window.location.href = data.content.url;
          }
        });
      }
    }
  };
</script>
