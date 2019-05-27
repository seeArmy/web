/** *list.vue * 货源列表 */
<template>
  <div v-loading.fullscreen.lock="fullscreenLoading">
    <ele-list :selectable="selectable" :operatable="operatable" :showImportButton="false" :showDownloadTemplate="false" :showExportButton="false" @query="query" @ready="query" @action="action" @more="more" @exportData="exportData" :total="total" :loading="loading" :list-data="listData" ref="eleList" :customColumn="customColumn" :params="params" :needPage="needPage" :isAdvanced="isAdvanced" :deleteFun="deleteFun" :add="add" :downloadErrorData="downloadErrorData" :downloadTemplate="downloadTemplate" :importUrl="importUrl" :editUrl="editUrl" :getColumn="getColumn" :getList="getList" :exportCsv="exportCsv" :getSearch="getSearch" :showBatchSubmit="showBatchSubmit" :showBatchIgnored="showBatchIgnored" :batchOprName="batchOprName" :batchIgnoredName="batchIgnoredName" :batchSubmit="batchSubmitFun" :batchIgnored="batchIgnoredFun" @batchSubmit_='sendCarBatch' :objectName="objectName">
    </ele-list>
  </div>
</template>
<script type="text/ecmascript-6">
import eleList from '../components/ele-list/eleList.vue';
import { urlRedirect } from '../../api/Utils';
import { getColumn, list, getSearch, exportCsv, downloadErrorData, downloadTemplate, batchSubmit, batchIgnored } from '../../api/FreightAcceptRecordService';
import { listPlatform as listDriver } from '../../api/DriverService';
import { listPlatform as listTruck ,addTruck } from '../../api/TruckService';
import * as ApiConst from '../../api/ApiConst';

export default {
  name: 'freightAcceptRecordList',
  components: {
    'ele-list': eleList
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
    params: {
      type: Object,
      'default': function() {
        return {};
      }
    }
  },
  data: () => {
    return {
      listData: [],
      total: 0,
      loading: true,
      getColumn,
      getList: list,
      getSearch,
      objectName: '接单记录',
      addUrl: '/freightAcceptRecord/add.html',
      editUrl: '/freightAcceptRecord/add.html',
      listUrl: '/freightAcceptRecord/list.html',
      deleteFun: null,
      exportCsv,
      add: null,
      showBatchSubmit: true,
      showBatchIgnored: true,
      batchOprName: '批量派车',
      batchIgnoredName: '批量忽略',
      batchSubmitFun: batchSubmit,
      batchIgnoredFun: batchIgnored,
      downloadErrorData,
      importUrl: `${ApiConst.apiFreightDomain}/import/custom/freightAcceptRecord`,
      downloadTemplate,
      totalNetwork: 0,
      fullscreenLoading: false,
      markCheck: false,
      batchType:''
    };
  },
  methods: {
    // 批量派车
    sendCarBatch(type) {
      this.batchType = '';
      if(type == 'isOne'){
        this.batchType = type;
      }
      this.markCheck = false;
      this.checkBeforeSendAndIgnore();
      if (this.markCheck) {
        console.log('sendCarBatch self ...', self);
        this.$emit('sendCarBatch', this.listData);
      }
    },
    // 网络请求之前的检查  retrun true false
    checkBeforeSendAndIgnore() {
      const self = this,
        length = self.listData.length,
        h = this.$createElement;
      let successNum = 0;
      let failedNum = 0;
      let total = 0;
      this.listData.forEach(item => {
        if (true === item.checked && 'undispatched' == item.driverAcceptStatus) {
          total++;
        }
      });
      if (total < 1) {
        this.$message({
          type: 'warning',
          message: `您并没有选择，或则您选择的车辆状态不对，请核实`,
          duration: 2000
        });
        // return false;
        self.markCheck = false;
      } else {
        self.totalNetwork = total;
        self.markCheck = true;
      }
    },
    netWorkSendCar() {
      let successNum = 0;
      let failedNum = 0;
      let self = this;
      let length = self.listData.length;
      this.fullscreenLoading = true;
      for (let i = 0; i < length; i++) {
        const data = self.listData[i];
        if (true === data.checked && 'undispatched' == data.driverAcceptStatus) {
          self.batchSubmitFun(data, (success,error) => {
            if (success && success.code === 200) {
              successNum += 1;
            } else {
              failedNum += 1;
            }
            if ((successNum + failedNum) == self.totalNetwork) {
              this.fullscreenLoading = false;
              const info = `请求共${this.totalNetwork}条数据,成功${successNum}条数据,失败${failedNum}条数据`;
              if(this.batchType == 'isOne'){
                if(successNum == 1){
                 self.$message({
                type: 'success',
                message: '派车成功',
                duration: 3000
              });

                }else{
                   self.$message({
                      type: 'warning',
                      message: error.content,
                      duration: 3000
                    });
                }

              }else{
                 self.$message({
                type: 'warning',
                message: info,
                duration: 3000
              });

              }
              setTimeout(() => {
                window.location.reload();
              }, 3000);
            }
          });
        }
      }
    },
    // 同时把车辆司机添加到我的车辆库
    netWorkAddTruck(){
      let self = this;
       let length = self.listData.length;
       for (let i = 0; i < length; i++) {
        const data = self.listData[i];
         if (true === data.checked && 'undispatched' == data.driverAcceptStatus) {
          // 符合条件的 数据，for循环请求
          addTruck(data.platformTruckCode,(success,error)=>{
            // if(error){
            //   this.$message({
            //     type: 'warning',
            //     message: error,
            //     duration: 3000
            //   });
            // }
          })
         }
       }
    },
    openWindow(url, title) {
      urlRedirect(url, title);
    },
    more(model) {
      //        console.log('more', `${this.listUrl}?objectName=${this.objectName}&${this.toParameterArray(model).join('&')}`);
      this.openWindow(`${this.listUrl}?objectName=${this.objectName}&${this.toParameterArray(model).join('&')}`, `${this.objectName}列表`);
    },
    handleSendWaybill(model) {
      const paramObj = {
          code: model.code
        },
        h = this.$createElement;
      this.$msgbox({
        title: '消息',
        message: h('p', null, [h('span', null, '确认派车吗？ ')]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = '执行中...';
            this.batchSubmitFun(paramObj, (success, error) => {
              if (success) {
                this.$message({
                  type: 'success',
                  message: '派车成功',
                  duration: 1000
                });
                done();
                this.$refs.eleList.dispatchQueryEvent();
                instance.confirmButtonLoading = false;
              }
              if (error) {
                this.$message({
                  type: 'warning',
                  message: error.content,
                  duration: 1000
                });
                done();
                this.$refs.eleList.dispatchQueryEvent();
                instance.confirmButtonLoading = false;
              }
            });
          } else {
            done();
          }
        }
      }).then(() => {
        this.$refs.eleList.dispatchQueryEvent();
      });
    },
    handleIgnore(model) {
      const paramObj = {
          code: model.code
        },
        h = this.$createElement;
      this.$msgbox({
        title: '消息',
        message: h('p', null, [h('span', null, '确认忽略吗？ ')]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = '执行中...';
            this.batchIgnoredFun(paramObj.code, (success, error) => {
              if (success) {
                this.$message({
                  type: 'success',
                  message: '忽略成功',
                  duration: 1000
                });
                instance.confirmButtonLoading = false;
                done();
                this.$refs.eleList.dispatchQueryEvent();
              }
              if (error) {
                this.$message({
                  type: 'warning',
                  message: error.content,
                  duration: 1000
                });
                instance.confirmButtonLoading = false;
                done();
                this.$refs.eleList.dispatchQueryEvent();
              }
            });
          } else {
            done();
          }
        }
      }).then(() => {
        this.$refs.eleList.dispatchQueryEvent();
      });
    },
    toParameterArray(model) {
      const params = [];
      Object.keys(model).forEach((key) => {
        params.push(`${key}=${encodeURIComponent(model[key])}`);
      });
      return params;
    },
    action(command, menu, model) {
      console.log('action command', command, 'menu', menu, 'model', model);
      switch (command) {
        case 'sendTruck':{
             this.handelModelOne(model);
             // this.sendCarBatch();
        }
          // this.handleSendWaybill(model);
          break;
        case 'ignore':
          this.handleIgnore(model);
          break;
        case 'view':
          this.openWindow(`/waybill/add.html?code=${model.waybillCode}&editable=false`, '运单详情');
          break;
        default:
          break;
      }
    },
    handelModelOne(model){
       // this.listData.forEach((item) => {
         // this.$set(item, 'checked', true);
        // if(model.code == item.code){
        //   this.$set(item, 'checked', true);
        // }else{
        //   this.$set(item, 'checked', false);
        // }
      // });


      // let self = this;
      // console.log('model ...',model);
      // console.log('listData ...',this.listData);
      for (let i = 0;this.listData.length;i++) {
         let item = this.listData[i];
         if(item.code == model.code){
          if(item.checked){
            console.log('修改了 。。。。');
            item.checked = false;
          }
          // self.$set(item, 'checked', true);
          // item.checked = true;
          break;
         }
      }
      //  console.log('listData22 ...',this.listData);
      console.log('model... ',model)
      console.log('listData ...',this.listData);


      let self = this;
      setTimeout(function () {
        self.sendCarBatch('isOne');
      },"500");

       // this.sendCarBatch();
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
        this.loading = true;
        params.size = dataTotal;
        exportCsv(params, (success, error) => {
          if (error || success.code !== 200) {
            this.$message({
              type: 'error',
              message: error.content,
              duration: 5000
            });
            this.loading = false;
            return false;
          }
          if (success) {
            this.loading = false;
            window.location.href = success.content.url;
          }
        });
      }
    },
    query(searchParams) {
      console.log('searchParams', searchParams);
      Object.assign(searchParams, this.params);
      console.log('query', searchParams);
      const self = this;
      this.total = 0;
      this.loading = true;
      self.listData = [];
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
          success.content.forEach((data) => {
            const actionList = [],
              status = data.driverAcceptStatus;
            // actionList.push({ key: 'edit', name: '编辑' });
            switch (status) {
              case 'undispatched':
                actionList.push({ key: 'sendTruck', name: '去派车' });
                actionList.push({ key: 'ignore', name: '忽略' });
                break;
              case 'dispatched':
                actionList.push({ key: 'view', name: '查看运单详情' });
                break;
              case 'ignored':
                break;
              default:
                break;
            }
            // actionList.push({ key: 'remove', name: '删除' });
            data.actionMenuList = actionList;
          });
          self.listData = success.content;
          this.loading = false;
          // 网络请求 = > 获取 司机的认证状态
          this.queryDriveStatus();
          this.queryTruckStatus();
        }
      });
    },
    // 为每一项添加 司机认证 的属性
    queryDriveStatus() {
      let strUserCode = '';
      let self = this;
      this.listData.forEach((item, index) => {
        if (0 != index) {
          strUserCode += ',';
        }
        strUserCode += item.platformDriverCode;
      })
      listDriver({ 'code': strUserCode }, (success, error) => {
        if (error) {
          this.$message({
            type: 'error',
            message: error.content,
            duration: 5000
          });
        }
        if (success && success.content) {
          for (let i = 0; i < self.listData.length; i++) {
            let item1 = self.listData[i];
            for (var j = 0; j < success.content.length; j++) {
              let item2 = success.content[j];
              if (item2.code == item1.platformDriverCode) {
                // item1.driverCertStatus = item2.certStatus;
                 self.$set(item1, 'driverCertStatus', item2.certStatus);
                break;
              }
            }
          }
        }
      });
    },
    // 为每一项添加 司机认证 的属性
    queryTruckStatus() {
      let strTruckCode = '';
      let self = this;
      this.listData.forEach((item, index) => {
        if (0 != index) {
          strTruckCode += ',';
        }
        strTruckCode += item.platformTruckCode;
      })
      listTruck({ 'code': strTruckCode }, (success, error) => {
        if (error) {
          this.$message({
            type: 'error',
            message: error.content,
            duration: 5000
          });
        }
        if (success && success.content) {
          for (let i = 0; i < self.listData.length; i++) {
            let item1 = self.listData[i];
            for (var j = 0; j < success.content.length; j++) {
              let item2 = success.content[j];
              if (item2.code == item1.platformTruckCode) {
                self.$set(item1, 'truckCertStatus', item2.certStatus);

                // item1.truckCertStatus = item2.certStatus;
                break;
              }
            }
          }
        }
      });
    },
  },
  created() {

  }
};

</script>
<style lang="scss" rel="stylesheet/scss">
@import "../assets/sass/rl-fixed-table.min.scss";
@import "../assets/sass/base.scss";

</style>
