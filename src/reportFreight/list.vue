/**
* list.vue
* 上报运费列表
* Created by cc on 18/3/12.
*/
<template>
  <div>
    <ele-list :selectable="selectable" :operatable="operatable"
              @query="query" @ready="query" @action="action" @more="more" @exportData="exportData"
              :total="total" :loading="loading"
              :list-data="listData"
              ref="eleList"
              :customColumn="customColumn"
              :params="params"
              :needPage="needPage"
              :needMore="needMore"
              :isAdvanced="isAdvanced"
              :deleteFun="deleteFun"
              :add="add"
              :downloadErrorData="downloadErrorData"
              :downloadTemplate="downloadTemplate"
              :importUrl="importUrl"
              :editUrl="editUrl"
              :getColumn="getColumn"
              :getList="getList"
              :exportCsv="exportCsv"
              :getSearch="getSearch"
              :getAction="getAction"
              :objectName="objectName">
      <template slot="funArea">
        <!-- <el-button type="default"  @click="batchReportFreight" v-check-permission="'ReportedCapitalflow.get'">批量上报</el-button> -->
        <el-button type="default" @click="batchValidateFreight" v-check-permission="'CheckCapitalflow.get'">批量校验</el-button>
        <el-button type="default" @click="batchDeleteFreight" v-check-permission="'uploadCapitalflow.delete'">批量删除</el-button>  
      </template>
    </ele-list>
    <el-dialog :title="actionDialogTitle" :visible.sync="actionDialogVisible" size="large">
      <component ref="waybillAction" :is="currentDialogComponent"
                 @success="dialogSuccess" @fail="dialogFail" @close="dialogClose"
                 :type="type" :actionType="actionType" :actionDomain="actionDomain"
                 :id="currentWaybillCode" :action="currentActionCode" :actionExecuteFun="actionExecuteFun"
                 :isDialog="true"></component>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogClose">取 消</el-button>
        <el-button type="primary" @click="dialogSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <ele-progress-dialog ref="progressDialog" :percentage="progressBar.percentage" :msg="progressBar.msg" :title="progressBar.title" :onClose="onProgressClose"/>
  </div>
</template>

<script type="text/ecmascript-6">
  import eleList from '../components/ele-list/eleList.vue';
  import { urlRedirect,checkPermission } from '../../api/Utils';
  import { getColumn,list,getSearch, downloadTemplate,deleteList, getAction, executeAction, exportCsv, add, downloadErrorData,reportFreight,validateFreight } from '../../api/ReportFreightService';
  import * as ApiConst from '../../api/ApiConst';
  import eleAction from '../components/ele-action/eleAction.vue';
  import progress from '../components/eleProgressDialog.vue';
  import '../components/vueDirectives';

  var formSearchParams;
  export default {
    name: 'reportFreight',
    components: {
      'ele-list': eleList,
      'ele-action': eleAction,
      'ele-progress-dialog':progress
    },
    props: {
      selectable: {
        type: Boolean,
        'default': true
      },
      operatable: {
        type: Boolean,
        'default': true
      },
      customColumn: Array,
      isAdvanced: {
        type: Boolean,
        'default': true
      },
      needPage: {
        type: Boolean,
        'default': true
      },
      needMore: {
        type: Boolean,
        'default': false
      },
      params: {
        type: Object,
        'default': function () {
          return {};
        }
      }
    },
    data: () => {
      return {
        listData: [],
        total: 0,
        loading: true,
        getColumn:getColumn,
        actionDialogTitle: 'Dialog',
        actionDialogVisible: false,
        type: 'reportFreight',
        actionType: 'reportFreight',
        actionDomain: `${ApiConst.apiWayBillDomain}`,
        actionExecuteFun: executeAction,
        currentWaybillCode: '',
        currentActionCode: '',
        currentDialogComponent: '',
        getList: list,
        getSearch,
        objectName: '上报运费',
        addUrl: '/reportFreight/add.html',
        editUrl: '/reportFreight/add.html',
        listUrl: '/reportFreight/list.html',
        actionUrl: 'reportFreight/action.html',
        deleteFun: deleteList,
        getAction,
        exportCsv,
        add,
        downloadErrorData,
        importUrl: `${ApiConst.apiWayBillDomain}/import/custom/reportFreight`,

        popWaybillTruckMap: true,
        downloadTemplate,
        progressBar:{   // 批量上传进度条
            title:"正在处理",
            total:0,
            finished:0,
            isShow:false,
            percentage:0,
            msg:'',
        },
        showMenu:false, // 展示 校验运费与 上报运费
      };
    },
    methods: {
      onProgressClose(){
        this.query(formSearchParams);
        this.$refs.eleList.$refs.table.batchSelect = false;
        //window.location.reload();
      },
      openWindow(url, title) {
        urlRedirect(url, title);
      },
      more(model) {
//        console.log('more', `${this.listUrl}?objectName=${this.objectName}&${this.toParameterArray(model).join('&')}`);
        this.openWindow(`${this.listUrl}?objectName=${this.objectName}&${this.toParameterArray(model).join('&')}`, `${this.objectName}列表`);
      },
      dialogSubmit() {
        this.$refs.waybillAction.execute();
      },
      dialogSuccess() {
        this.dialogClose();
        this.$refs.eleList.dispatchQueryEvent();
      },
      dialogFail() {
        console.log('dialog execute failed');
      },
      dialogClose() {
        this.actionDialogVisible = false;
        this.currentDialogComponent = null;
        this.currentWaybillCode = null;
        this.currentActionCode = null;
      },
      doRemove(model) {
        const self = this;
        this.$msgbox({
          title: '确认',
          message: `确认要删除${this.objectName}吗？`,
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '执行中...';
              deleteList({ code: model.code }, (success, error) => {
                if (success) {
                  this.$message({
                    type: 'success',
                    message: '删除成功',
                    duration: 1000
                  });
                  done();
                  instance.confirmButtonLoading = false;
                }
                if (error) {
                  this.$message({
                    type: 'warning',
                    message: `${error}`,
                    duration: 1000
                  });
                  instance.confirmButtonLoading = false;
                  done();
                }
              });
            } else {
              done();
            }
          }
        }).then(() => {
          self.$refs.eleList.dispatchQueryEvent();
        });
      },
      toParameterArray(model) {
        const params = [];
        Object.keys(model).forEach((key) => {
          params.push(`${key}=${encodeURIComponent(model[key])}`);
        });
        return params;
      },
      batchReportFreight(){
        var codes = [];
        var self=this;
        this.listData.forEach(item => {
          if (item.checked) {
            codes.push(item.code);
          }
        });
        if(codes.length==0){return false}
        this.$confirm(`共选择${codes.length}条，您确认批量上报吗？`, '提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'}).then(() => {
          var finishedCount = 0,successedCount=0,failedCount=0
          this.progressBar.percentage=0;
          this.$refs.progressDialog.show();
          self.progressBar.title="正在上报运费";
          self.progressBar.msg=`正在上报 0/${codes.length}`;
          this.listData.forEach(item => {
            if (item.checked) {
              reportFreight({ code: item.code }, function(ret,err){
                  finishedCount++;
                  if(ret){
                    successedCount++;
                  }else{
                    failedCount++;
                  }
                  var progress = Math.floor((finishedCount*1.0)/(codes.length*1.0) *100);
                  self.progressBar.percentage= progress
                  self.progressBar.msg=`正在上报 ${finishedCount}/${codes.length}`;
                  if(finishedCount==codes.length){
                    self.progressBar.msg=`上报成功${successedCount}条运单，上报失败${failedCount}条运单`;
                  }
              });
            }
          })
        }).catch(e=>{});
      },
      batchValidateFreight(){
        var codes = [];
        var self=this;
        this.listData.forEach(item => {
          if (item.checked) {
            codes.push(item.code);
          }
        });
        if(codes.length==0){return false}
        this.$confirm(`共选择${codes.length}条，您确认批量校验运费吗？`, '提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'}).then(() => {
          var finishedCount = 0,successedCount=0,failedCount=0
          this.progressBar.percentage=0;
          this.$refs.progressDialog.show();
          self.progressBar.title="正在校验运费";
          self.progressBar.msg=`正在校验 0/${codes.length}`;
          this.listData.forEach(item => {
            if (item.checked) {
              validateFreight({ code: item.code }, function(ret,err){
                finishedCount++;
                if(ret && ret.content.result){
                  successedCount++;
                }else{
                  failedCount++;
                }
                var progress = Math.floor((finishedCount*1.0)/(codes.length*1.0) *100);
                self.progressBar.percentage= progress
                self.progressBar.msg=`正在校验 ${finishedCount}/${codes.length}`;
                if(finishedCount==codes.length){
                  self.progressBar.msg=`校验成功${successedCount}条运单，校验失败${failedCount}条运单`;
                }
              });
            }
          })

        }).catch(e=>{});
      },
      // 批量删除
      batchDeleteFreight(){
        var codes = [];
        var self=this;
        this.listData.forEach(item => {
          if (item.checked) {
            codes.push(item.code);
          }
        });
        if(codes.length<1){
          this.$message({
                    type: 'warning',
                    message: "请选择批量删除的运单",
                    duration: 1000
                  });
          return;
        }
        this.$confirm(`共选择${codes.length}条，您确认批量删除运单吗？`, '提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'}).then(() => {
          var finishedCount = 0,successedCount=0,failedCount=0
          this.progressBar.percentage=0;
          this.$refs.progressDialog.show();
          self.progressBar.title="正在删除运单";
          self.progressBar.msg=`正在删除 0/${codes.length}`;
          codes.forEach(item => {
              deleteList({ code: item }, (ret, err) => {
                finishedCount++;
                if(ret && ret.code == 200){
                  successedCount++;
                }else{
                  failedCount++;
                }
                var progress = Math.floor((finishedCount*1.0)/(codes.length*1.0) *100);
                self.progressBar.percentage= progress
                self.progressBar.msg=`正在删除 ${finishedCount}/${codes.length}`;
                if(finishedCount==codes.length){
                  self.progressBar.msg=`删除成功${successedCount}条运单，删除失败${failedCount}条运单`;
                }
              });
          })
        }).catch(e=>{});

      },
      action(command, menu, model) {
        console.log('action command', command, 'menu', menu, 'model', model);
        switch (command) {
          case 'add':
            this.openWindow(`${this.editUrl}?objectName=${this.objectName}`, `新建${this.objectName}`);
            break;
          case 'edit':
            this.openWindow(`${this.editUrl}?code=${model.code}&objectName=${this.objectName}`, `编辑${this.objectName}`);
            break;
          case 'remove':
            this.doRemove(model);
            break;
          case 'map':
            this.actionDialogTitle = menu.name;
            this.actionDialogVisible = true;
            this.currentWaybillCode = model.code;
            this.currentActionCode = menu.key;
            this.currentDialogComponent = 'ele-waybill-pop-map';
//            this.openWindow(`/truck/truck-gps.html?truckLicenseNo=${model.truckLicenseNo}&objectName=${this.objectName}`, '车辆轨迹');
            break;
          case 'reportFreight':
            this.$confirm('确认上报本运单吗？', '提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'}).then(() => {
              this.loading=true;
              reportFreight({ code: model.code },(ret,err)=>{
                this.loading=false;
                if(err){
                  this.$message({type: 'error',  message: '上报失败！'});
                }else{
                  this.$message({type: 'success',  message: '上报完成！'});
                }
                this.onProgressClose();
              })
            }).catch(() => {
            });
            break;
          case 'validateFreight':
            this.$confirm('确认校验本运单吗？', '提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'}).then(() => {
              this.loading=true;
              validateFreight({ code: model.code },(ret,err)=>{
                this.loading=false;
                 if(err){
                   this.$message({type: 'error',  message: '校验失败！'});
                 }else{
                    this.$message({type: 'success',  message: '校验完成！'});
                 }
                 this.onProgressClose();
              })
            }).catch((e) => {
            });
            break;
          default:
            this.actionDialogTitle = menu.name;
            this.actionDialogVisible = true;
            this.currentWaybillCode = model.code;
            this.currentActionCode = menu.key;
            this.currentDialogComponent = 'ele-action';
            break;
        }
      },
      exportData(params) {
        const dataTotal = this.total;
        if (dataTotal > 10000) {
          this.$message({
            type: 'warning',
            message: '导出条数超过10000条限制，不可导出！',
            duration: 3000
          });
        } else {
          params.size = dataTotal;
          getColumn((success) => {
            console.log('上报运费列表配置', success.content);
            const paramsObj = {
              params: params,
              configList: success.content
            };
            // paramsObj["params"].obj = 'reportFreight';
            exportCsv(paramsObj, (success) => {
              window.location.href = success.content.url;
            });
          });
        }
      },
      query(searchParams) {
        formSearchParams=searchParams;
        Object.assign(searchParams, this.params);
        const self = this;
        this.total = 0;
        this.loading = true;
        this.listData = [];
        list(searchParams, (success, error) => {
          if (error) {
            this.$message({
              type: 'error',
              message: error.content,
              duration: 5000
            });
          }
          if (success) {
            this.total = success.total;
            success.content.forEach((row) => {
              const actionList = [];
              // 运营中心 中 只有当 角色为 S  type == 1，那么才有 校验运费 与 上报运费
              if(checkPermission("CheckCapitalflow.get")){
                actionList.push({ key: 'validateFreight', name: '校验运费' });
              }
              // if(checkPermission("ReportedCapitalflow.get") && this.showMenu){
              //   actionList.push({ key: 'reportFreight', name: '上报运费' });
              // }
              actionList.push({ key: 'edit', name: '编辑' });
              if(checkPermission("uploadCapitalflow.delete")){
                actionList.push({ key: 'remove', name: '删除' });
              }
              row.actionMenuList = actionList;
            });
            self.listData = success.content;
            this.loading = false;
//              self.listData.splice(self.listData.length);
            //console.log('parent.listData', self.listData);
          }
        });
      }
    },
    created(){},
    mounted(){
     const localStorage = window.localStorage;
     const orgType = JSON.parse(localStorage.getItem('orgType'));
     this.showMenu = (orgType == 1 );
    },
  };
</script>

<style lang="scss" rel="stylesheet/scss">
.el-form-item{
  margin-right: 0px !important;
}
  .el-dialog__body {
    .complex-control-2 {
      .innerblock {
        width: 110px;
      }
    }
    .form-page .el-row .el-col-12:nth-child(6n), .form-page .el-row .el-col-12:nth-child(6n-1) {
      margin-bottom: 0;
      border-bottom: 0;
    }
  }
</style>
