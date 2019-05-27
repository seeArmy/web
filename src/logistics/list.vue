/** 
* list.vue 
* 订单列表 
* Created by zhuyi on 17/7/21. 
*/
<template>
  <div id="logisticsList">
    <ele-list :selectable="selectable" :operatable="operatable" 
              :showImportButton="permission && showImportButton" 
              :needAdd="permission" 
              :showDownloadTemplate="showDownloadTemplate" 
              :showExportButton="showExportButton" 
              @query="query" @ready="query" @action="action" @more="more" @exportData="exportData" 
              :total="total" :loading="loading" :list-data="listData" 
              ref="eleList" 
              :customColumn="customColumn" 
              :params="params" 
              :needPage="needPage" 
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
              @uploadSuccess='uploadSuccess' 
              :objectName="objectName" 
              :getImportColumn="getImportColumn" 
              :folder="folder" 
              :isShowSerialNumber='true'
              v-if="showNow"
              >
    <span slot="topRightFun" class="recycle-bin" @click="recycleList">
      <i class="el-icon-delete2"></i> 回收站
    </span>
    <span slot="funArea">
      <el-button @click="assignMerchandiser" v-check-permission="'logisticsAssignPerson3.add'">分配跟单人</el-button>
    </span>
    <span slot="funArea">
      <el-button @click="batchConfirm"  v-check-permission="'logistics.finish'">批量确认完成</el-button>
    </span>
    </ele-list>
    
    <!-- 批量确认订单的弹框 str -->
    <el-dialog title="提示" :visible.sync="affirmDialogVisible" size="small">
      <p class="span_title">共选择{{listChecked.length}}条订单，批量确认完成吗？</p>
      <!-- <div class="dialog_radio">
        <el-radio class="radio" v-model="affirmRadio" label="1">确认接单</el-radio>
        <el-radio class="radio" v-model="affirmRadio" label="2">拒绝接单</el-radio>
      </div> -->
      <span slot="footer" class="dialog-footer">
    <el-button @click="affirmDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogClick">确 定</el-button>
    </span>
    </el-dialog>
    <!-- 批量确认订单的弹框 end -->

    <el-dialog :title="actionDialogTitle" :visible.sync="actionDialogVisible" v-if="actionDialogVisible" size="large" :class="isMap">
      <component ref="logisticsAction" :is="currentDialogComponent" :isLogistics='isLogistics' :page='pageMap' :size="sizeMap" @success="dialogSuccess" @fail="dialogFail" @close="dialogClose" :type="type" :actionType="actionType" :actionDomain="actionDomain" :id="currentCode" :action="currentActionCode" :actionExecuteFun="actionExecuteFun" :isDialog="true" :dialogData="dialogData"></component>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogClose">取 消</el-button>
        <el-button type="primary" @click="dialogSubmit">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 跟单人弹窗 -->
    <el-dialog title="分配跟单人" :visible.sync="assignDialogVisible" v-if="assignDialogVisible" size="large" id="am-dialog">
      <div class="assign-merchandiser">
        <employee-list ref="assignEmployee" :selectable="false" :operatable="false" :showRadioCheck="true" :showColumns="showColumns"></employee-list>
        <p class="tip-info">已选中<span class="org">{{ assignLogisticsCodes.length }}</span>单，确认将跟单人修改为选中的人员吗？</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAssignMerchandiser" :disabled="assignBtnDisabled">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script type="text/ecmascript-6">
// import eleList from '../components/ele-list/eleList.vue';
import eleList from '@/components/v3/ele-table/eleList.vue';
import eleLogisticPopMap from '../components/ele-pop-map/eleLogisticPopMap.vue';
import { urlRedirect, checkPermission } from '../../api/Utils';
import { getDetail, getColumn, getAction, list, getSearch, deleted, exportCsv, add, downloadErrorData, downloadTemplate, addAction as executeAction, edit, assignMerchandisers ,reject, accept} from '../../api/LogisticsService';
import { selfs } from '../../api/OrgService';

import ApiConst from '../../api/ApiConst';
import eleAction from '../components/ele-action/eleAction.vue';

import employeeList from '../employee/list/list.vue';

import Decimal from "decimal.js";

import '../components/vueDirectives';

export default {
  name: 'LogisticsList',
  components: {
    'ele-list': eleList,
    'ele-logistic-pop-map': eleLogisticPopMap,
    'ele-action': eleAction,
    'employee-list': employeeList
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
      actionDialogTitle: 'Dialog',
      actionDialogVisible: false,
      type: 'logistics',
      actionType: 'logistics',
      actionDomain: `${ApiConst.apiLogisticsDomain}`,
      actionExecuteFun: executeAction,
      currentCode: null,
      currentActionCode: null,
      currentDialogComponent: '',
      getColumn,
      getList: list,
      getSearch,
      objectName: '订单',
      addUrl: '/logistics/add.html',
      editUrl: '/logistics/add.html',
      recycleUrl: '/logistics/recycleList.html',
      outsourcingUrl: '/logistics/subContract.html',
      dispatch: true,
      dispatchUrl: '/logistics/dispatch.html',
      deleteFun: deleted,
      exportCsv,
      add,
      popTruckMap: true,
      downloadErrorData,
      importUrl: `${ApiConst.apiLogisticsDomain}/import/custom/logistics`,
      downloadTemplate,
      permission:true,
      pageMap: 1,
      sizeMap: 10,
      isMap: '',
      showImportButton: true,
      showNow: false,
      getImportColumn: getDetail,
      folder: 'logistics/logistics',
      dialogData: null,
      showDownloadTemplate: true,
      showExportButton: true,
      projectName: JSON.parse(localStorage.getItem('appInfo')).projectName,
      assignDialogVisible: false,
      assignBtnDisabled: false,
      assignLogisticsCodes: [],
      showColumns: ['fullName', 'phone', 'userStatus', 'departmentName'],
      isLogistics:true,
      affirmDialogVisible: false,
      listChecked: []
    };
  },
  methods: {
    //批量确定
    batchConfirm(){
      // 获取全部 checked 的
      let listChecked = [];
      this.listData.forEach(val => {
        if (val.checked) {
          listChecked.push(val);
        }
      })
      if (listChecked.length < 1) {
        this.$message({
          type: 'warning',
          message: `请选择订单`,
          duration: 1000
        });
        return;
      }
      this.listChecked = listChecked;
      // 弹框
      this.affirmDialogVisible = true;
    },
    dialogClick() {
        this.affirmDialogVisible = false;
        let actionCode = '';
        let actionName = '';
          // 确认
        actionCode = 'logisticsFinish';
        actionName = '确认订单';
        this.batchAction(actionCode, actionName, this.listChecked);

    },
 // 批量操作（主要是批量确定订单与拒绝）
    batchAction(actionCode, actionName, listModel) {
      let countNum = listModel.length;
      let countSuccess = 0;
      let countFailed = 0;
      if (countNum < 1) {
        this.$message({
          type: 'success',
          message: `请选择`,
          duration: 3000
        });
        return;
      }
      this.loading = true;
      for (let i = 0; i < listModel.length; i++) {
        let model = listModel[i];
          // 确认完成
          executeAction(model.code, actionCode, null, null, (success, error) => {
            if (success) {
              countSuccess++;
            }
            if (error) {
              countFailed++;
            }
            if (countNum == countSuccess + countFailed) {
              this.loading = false;
              this.$message({
                type: 'success',
                message: `操作成功${countSuccess}个,操作失败${countFailed}个`,
                duration: 3000
              });
              setTimeout(() => {
                window.location.reload();
              }, 3000);
            }
          });

      }
    },        
    assignMerchandiser() {
      this.assignLogisticsCodes = [];
      let ckNum = 0;
      this.listData.forEach((val) => {
        if (val.checked) {
          ckNum ++;
          this.assignLogisticsCodes.push(val.code);
        }
      });
      if (ckNum === 0) {
        this.$message({
          type: 'warning',
          message: '未选中任何订单！',
          duration: 3000
        });
        return false;
      } else {
        this.assignDialogVisible = true;
      }
    },
    confirmAssignMerchandiser() {
      const emObj = {},
        emListData = this.$refs.assignEmployee.$refs.list.listData,
        totalNum = this.assignLogisticsCodes.length;
      let emck = 0, sucNum = 0, errNum = 0;
      emListData.forEach((val) => {
        if (val.checked) {
          emck += 1;
          this.$set(emObj, 'carrierOwnerUserFullname', val.fullName);
          this.$set(emObj, 'carrierOwnerUserCode', val.code);
          this.$set(emObj, 'carrierOwnerPlatformUserCode', val.userCode);
        }
      });
      if (emck === 0) {
        this.$message({
          type: 'warning',
          message: '请选择跟单分配人！',
          duration: 3000
        });
        return false;
      }
      for (let i = 0; i < totalNum; i++) {
        let paramsObj = {
          code: this.assignLogisticsCodes[i]
        };
        Object.assign(paramsObj, emObj);
        assignMerchandisers(paramsObj, (success, error) => {
          if (error || success.code !== 200) {
            errNum += 1;
            // this.$message({
            //   type: 'error',
            //   message: error.content,
            //   duration: 3000
            // });
            // return false;
            console.log('assign error', error.content);
          }
          if (success) {
            sucNum += 1;
            const data = success.content;
            console.log('assign success', data);
          }
          // 判断执行条数
          if ((sucNum + errNum) === totalNum) {
            const info = `批量分配跟单人共${totalNum}次，成功${sucNum}条，失败${errNum}条！`;
            this.$message({
              type: 'success',
              message: info,
              duration: 3000
            });
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }
        });
      }
    },
    recycleList() {
      this.openWindow(`${this.recycleUrl}`, '订单回收站列表');
    },
    openWindow(url, title) {
      urlRedirect(url, title);
    },
    more(model) {
      //        console.log('more', `${this.listUrl}?objectName=${this.objectName}&${this.toParameterArray(model).join('&')}`);
      this.openWindow(`${this.listUrl}?objectName=${this.objectName}&${this.toParameterArray(model).join('&')}`, `${this.objectName}列表`);
    },
    dialogSubmit() {
      this.$refs.logisticsAction.execute();
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
    },
    // 导入 订单 统一给 承运方 默认为 当前登录的公司
    uploadSuccess(data) {
      // console.log('data ...', data);
      const localStorage = window.localStorage;
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      data.forEach(item => {
        item.carrierOrgName = userInfo.orgFullName;
        item.carrierOrgCode = userInfo.orgCode;
        item.platformCarrierOrgCode = userInfo.orgCode;
      })
    },
    doRemove(model) {
      const self = this;
      this.$msgbox({
        title: '确认',
        message: `确认要删除${this.objectName} ${model.logisticsNo} 吗？`,
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = '执行中...';
            deleted({ code: model.code }, (success, error) => {
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
    doSubmitSettle(actionCode, actionName, model) {
      const self = this;
      this.$msgbox({
        title: '确认',
        message: `确认要${actionName}吗？`,
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = '执行中...';
            executeAction(model.code, actionCode, null, null, (success, error) => {
              if (success) {
                this.$message({
                  type: 'success',
                  message: '操作成功',
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
    action(command, menu, model) {
      console.log('command===', command);
      console.log('action command', command, 'menu', menu, 'model', model);
      switch (command) {
        case 'add':
          this.openWindow(`${this.editUrl}?objectName=${this.objectName}`, `新建${this.objectName}`);
          break;
        case 'logisticsCopy':
          this.openWindow(`${this.editUrl}?originalCode=${model.code}&objectName=${this.objectName}`, `复制新建${this.objectName}`);
          break;
        case 'logisticsEdit':
          this.openWindow(`${this.editUrl}?code=${model.code}&objectName=${this.objectName}`, `编辑${this.objectName}`);
          break;
        case 'dispatch':
          this.openWindow(`${this.dispatchUrl}?code=${model.code}`, '派车');
          break;
        case 'logisticsOutsource':
          this.openWindow(`${this.outsourcingUrl}?code=${model.code}`, '转包订单');
          break;
        case 'logisticsRemove':
          this.doRemove(model);
          break;
        case 'logisticsFinish':
          this.doSubmitSettle(menu.key, menu.name, model);
          break;
        case 'logisticsMap':
          this.isMap = 'map-dialog';
          this.dialogData = model;
          this.actionDialogTitle = menu.name;
          this.actionDialogVisible = true;
          this.currentCode = model.code;
          this.currentActionCode = menu.key;
          this.currentDialogComponent = 'ele-logistic-pop-map';
          //            this.openWindow(`/truck/truck-gps.html?truckLicenseNo=${model.truckLicenseNo}&objectName=${this.objectName}`, '车辆轨迹');
          break;
        case 'bizVisual':
          window.open(`/logistics/bizVisual.html?code=${model.code}`);
          break;
        case 'billPrint':
          window.open(`/printDoc/trustDeed.html?logisticsCode=${model.code}`);
          break;
        default:
          {
            const method = menu.action.actionMethod;
            if (method === 'link') {
              const methodParam = menu.action.actionMethodParameter;
              this.openWindow(`${methodParam}?logisticsCode=${model.code}`, `${menu.action.actionName}`);
            } else if (method === 'pop') {
              this.actionDialogTitle = menu.name;
              this.actionDialogVisible = true;
              this.currentCode = model.code;
              this.currentActionCode = menu.key;
              this.currentDialogComponent = 'ele-action';
            } else {
              console.error('unknow action', command);
            }
          }
      }
    },
    //确定完成
    editFunc(command, menu, model) {
      model.logisticsStatus = 'done';
      edit(model.code, model, (success, error) => {
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
    getPercent(data, type) {
      let val = 0;
      // 发货量完成度
      if (type === 'loading') {
        switch(data.meterageType) {
          case 'ton':
            data.goodsWeight > 0 ? (val = Decimal(data.loadingGoodsWeightCount || 0).div(data.goodsWeight).mul(100).toDP(0)) : val;
            return val;
          case 'cube':
            data.goodsVolume > 0 ? (val = Decimal(data.loadingGoodsVolumeCount || 0).div(data.goodsVolume).mul(100).toDP(0)) : val;
            return val;
          case 'item':
            data.goodsNum > 0 ? (val = Decimal(data.loadingGoodsNumCount || 0).div(data.goodsNum).mul(100).toDP(0)) : val;
            return val;
          default:
            return val;
        }
      } else {
        // 收货量完成度
        switch(data.meterageType) {
          case 'ton':
            data.goodsWeight > 0 ? (val = Decimal(data.unloadingGoodsWeightCount || 0).div(data.goodsWeight).mul(100).toDP(0)) : val;
            return val;
          case 'cube':
            data.goodsVolume > 0 ? (val = Decimal(data.unloadingGoodsVolumeCount || 0).div(data.goodsVolume).mul(100).toDP(0)) : val;
            return val;
          case 'item':
            data.goodsNum > 0 ? (val = Decimal(data.unloadingGoodsNumCount || 0).div(data.goodsNum).mul(100).toDP(0)) : val;
            return val;
          default:
            return val;
        }
      }
    },
    query(searchParams) {
      console.log('searchParams', searchParams);
      Object.assign(searchParams, this.params);
      console.log('query', searchParams);
      // 如果 订单状态没有值，那么手动加上 所有状态，主要是 后端有很多条件需要，此处 先前端处理
      if (!searchParams.logisticsStatus || searchParams.logisticsStatus.length < 1) {
        searchParams.logisticsStatus = 'waiting,todo,doing,finish,cancel';
      }
      const self = this;
      this.total = 0;
      this.loading = true;
      self.listData = [];
      list(searchParams, (success, error) => {
        this.loading = false;
        if (error) {
          this.$message({
            type: 'error',
            message: error.content,
            duration: 5000
          });
        }
        const codeList = [];
        if (success) {
          this.total = success.total;
          success.content.forEach((data) => {
            codeList.push(data.code);
            // 计算车次完成度——dispatchPercent
            // (订单列表中，待装货+运输中+已卸车次 / 需求车次) * 100%
            let dispatchPercent = 0;
            if (data.truckQty > 0) {
              dispatchPercent = Decimal((data.loadingNum || 0) + (data.goingNum || 0) + (data.unloadingNum || 0)).div(data.truckQty).mul(100).toDP(0);
            } else {
              dispatchPercent = 0;
            }
            this.$set(data, 'dispatchPercent', parseInt(dispatchPercent));
            // 计算发货量完成度——loadingPercent
            // 根据计量单位，如吨，有效运单发货重量小计 / 订单的计划重量
            const loadingPercent = this.getPercent(data, 'loading');
            this.$set(data, 'loadingPercent', parseInt(loadingPercent));
            // 计算收货量完成度——unloadingPercent
            // 根据计量单位，如吨，有效运单收货重量小计 / 订单的计划重量
            const unloadingPercent = this.getPercent(data, 'unloading');
            this.$set(data, 'unloadingPercent', parseInt(unloadingPercent));
          });

          getAction(codeList, (response) => {
            success.content.forEach((row) => {
              const actionList = [];
              // actionList.push({ key: 'edit', name: '编辑' });
              // actionList.push({ key: 'remove', name: '删除' });
              //                actionList.push({ key: 'dispatch', name: '派车' });
              //                actionList.push({ key: 'map', name: '车辆位置' });
              if (response && response.content[row.code]) {
                response.content[row.code].forEach((action) => {
                  actionList.push({ key: action.actionCode, name: action.actionName, action });
                });
              }
              // actionList.push({ key: 'logisticsCopy', name: '复制新建' });
              if (checkPermission('logistics.view')) {
                 actionList.push({ key: 'bizVisual', name: '订单监控' });
              }
              // 委托单打印
              if (checkPermission('logistics.billPrint')) {
                 actionList.push({ key: 'billPrint', name: '委托单打印' });
              }
             
              row.actionMenuList = actionList;
            });
            self.listData = success.content;
            //              this.loading = false;
            //              self.listData.splice(self.listData.length);
            //console.log('parent.listData', self.listData);
          });
        }
      });
    },
    setConfigForHuaNeng(){
       this.showImportButton = false;
       this.showDownloadTemplate = false;
    },
  },
  mounted() {

    // 在public 里面 找不到 pageRefresh,
    setTimeout(() => {
      if (document.querySelector('#pageRefresh')) {
        document.querySelector('#pageRefresh').addEventListener('click', () => {
          window.location.reload();
        });
      }
    }, 2000);


    const certControl = JSON.parse(localStorage.getItem('otherappConfig'))['other.certControl'];
    if (certControl === 'TRUE') {
      selfs((success, error) => {
        if (error || success.code !== 200) {
          this.$message({
            type: 'error',
            message: `${error}`,
            duration: 3000
          });
          return false;
        }
        if (success) {
          const data = success.content;
          if (data.certStatus !== 'authenticated') {
            this.showImportButton = false;
          } else {
            this.showImportButton = true;
          }
          this.showNow = true;
          this.setConfigForHuaNeng();
        }
      });
    } else {
      this.showNow = true;
      this.setConfigForHuaNeng();
    }
  },
  created() {
     this.permission = checkPermission("logistics.add");
     this.showDownloadTemplate = checkPermission("logistics.downloadTemplate");
     this.showExportButton = checkPermission("logistics.export");
  }
};

</script>
<style lang="scss" rel="stylesheet/scss">
.dialog_radio {
  margin-top: 30px;
  margin-bottom: 30px;
}
.recycle-bin {
  margin-left: 8px;
  padding-left: 7px;
  padding-right: 10px;
  opacity: .8;
  cursor: pointer;
  &:hover {
    opacity: 1;
  }
}

#logisticsList {
  .el-dialog--large {
    transform: none;
    margin-left: -35%;
  }
}

.map-dialog {
  .el-dialog--large {
    top: 5% !important;
    bottom: 5%;
    width: 90%;
    margin-left: -45% !important;
    margin-bottom: 0;
  }
  .pop-map {
    position: absolute;
    top: 57px;
    right: 20px;
    bottom: 55px;
    left: 20px;
  }
  .el-dialog__body {
    max-height: none;
  }
  .el-dialog__footer {
    position: absolute;
    right: 20px;
    bottom: 0;
    left: 20px;
    margin: 0;
    box-sizing: border-box;
  }
}

#am-dialog .el-dialog--large {
  top: 5%;
  width: 96% !important;
  margin-left: -48% !important;
  .el-dialog__body {
    max-height: none;
  }
  .fix-table-wrap {
    height: 211px;
    max-height: 211px !important;
  }
}
.assign-merchandiser {
  .page-content {
    height: 300px !important;
    border: solid 1px #ddd;
  }
  #roleTree {
    height: 293px !important;
  }
  .hd-opr,#advanceSearch {
    display: none;
  }
  .list-page .table-opr {
    overflow: hidden;
  }
  .tip-info {
    position: absolute;
    bottom: 16px;
  }
  .pagination {
    padding: 10px 10px 8px;
  }
}

.el-dialog__body .assign-merchandiser .page-header {
  position: static;
  height: auto;
  overflow: hidden;
}

</style>
