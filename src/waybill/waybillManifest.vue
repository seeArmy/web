<!-- 收发货弹框 -->
/**
* action.vue
* Created by dsky on 17/7/6.
*/
<template>
  <ele-dialog ref="dialog" id='page_waybill_manifest' :title="title" @submit="handleDone" @cancel="handleCancel" class="huaneng_un_loading_input">
    <!-- 头部数据 -->
    <el-row class='el_header'>
      <el-col :span="8"><span class="el_label">车牌号：</span><span class="el_value">{{domainObject.truckLicenseNo}}</span></el-col>
      <el-col :span="8"><span class="el_label">主驾：</span><span class="el_value">{{domainObject.driverFullName}}</span></el-col>
      <el-col :span="8"><span class="el_label">运单号：</span><span class="el_value">{{domainObject.waybillNo}}</span></el-col>
    </el-row>
    <div class="form-page loading-action">
      <eleManifestList ref='eleManifest' :selectable='false' :isEdit='isEdit' :editable='true' :getColumn='getColumnManifest' :listData='listDataManifest' :editableFields="editableFields" @query="query" v-if="status">
      </eleManifestList>
    </div>
    <!-- 尾部数据 -->
    <el-row class='el_footer'>
      <el-col :span="12">
        <span class="el_label" :class="{'el-required' : isRequired}">{{ actionTypeText }}时间:</span>
        <span class="el_value">
          <el-date-picker
          v-model="fieldTime"
          type="datetime"
          placeholder="选择日期"
          ></el-date-picker>
        </span>
      </el-col>
      <el-col :span="12">
        <span class="el_label" :class="{'el-required' : isRequired1}">{{ actionTypeText }}凭证:</span>
        <span class="el_value file">
           <ele-file-upload
            :domainObject="domainObject"
            :configData="attachmentConfig"
            :uploadUrl="uploadUrl" :action="''" :listType="'picture-card'" :editable="true" :isList="false" :maxLength="3">
          </ele-file-upload>
        </span>
      </el-col>
    </el-row>
  </ele-dialog>
</template>
<script type="text/ecmascript-6">
import eleBlock from '../components/ele-block/eleBlock.vue';
import ApiConst from '../../api/ApiConst';
import { executeAction, getColumnManifestLoading, getColumnManifestUnloading, getListInvoiceList, loadingLoading, unloadingLoading,submitManifestFinal } from '../../api/waybillService';
import { showMessageUtil,compareTime,dateFormat } from '../../api/Utils';
import eleManifestList from '../components/ele-manifest-list/eleManifestList.vue';
import eleDialog from '../components/ele-dialog/eleDialog.vue';
import eleFileUpload from '../components/ele-file-upload/eleFileUpload.vue';

const axios = require('axios'),
  waybillUrl = ApiConst.apiWayBillDomain;

function elementConfig(code, action) {
  return axios({
    method: 'get',
    url: `${waybillUrl}/waybill/${code}/action/${action}/render/list`,
    headers: { 'Accept': 'application/json' }
  });
}
export default {
  data() {
    return {
      time: '',
      dateFormat: 'yyyy-MM-dd HH:mm:ss',
      getColumnManifest: getColumnManifestLoading,
      actionCode: '',
      listDataManifest: [],
      attachmentConfig: { field: 'loadingAttachment', controlType: 'file' },
      uploadUrl: ApiConst.apiWayBillDomain,
      fieldTime: '',
      netLoading: loadingLoading,
      editableFields: ['loadingGoodsWeight', 'loadingGoodsVolume', 'loadingGoodsNum', 'loadingDescription'],
      domainObject: {},
      inputKey: [],
      fields: [],
      loading: true,
      code: '',
      tableData: [],
      copyData: [],
      isEdit: false,
      isAction: false,
      uploadUrl: ApiConst.apiWayBillDomain,
      status: false,
      isRequired: true ,
      isRequired1: true,
      actionCodes: ['loading', 'loadingInput', 'unloading', 'unloadingInput'],
      // 将 原来的 收发货时间 存在这边，在点击 提交的时候，需要校验 ，收货时间 小于 发货时间
      tempTime:{'loadingTime':'','unloadingTime':''}
    };
  },
  props: {
    id: '',
    action: '',
    isDialog: {
      type: Boolean,
      'default': false
    },
    title: {
      type: String,
      'default': ''
    }
  },
  components: {
    'ele-block': eleBlock,
    'ele-dialog': eleDialog,
    'ele-file-upload': eleFileUpload,
    eleManifestList,
  },
  computed: {
    actionTypeText() {
      return this.actionCodes.indexOf(this.actionCode) < 2 ? '发货' : '收货';
    }
  },
  methods: {
    dealWithType() {
      if (this.actionCodes.indexOf(this.actionCode) > 1) {
        this.netLoading = unloadingLoading;
        this.getColumnManifest = getColumnManifestUnloading;
        this.attachmentConfig.field = 'unloadingAttachment';
        // this.fieldTime = 'unloadingTime';
        this.editableFields = ['unloadingGoodsWeight', 'unloadingGoodsVolume', 'unloadingGoodsNum', 'unloadingDescription']
        this.status = true;
      } else {
        this.netLoading = loadingLoading;
        this.getColumnManifest = getColumnManifestLoading;
        this.attachmentConfig.field = 'loadingAttachment';
        this.editableFields = ['loadingGoodsWeight', 'loadingGoodsVolume', 'loadingGoodsNum', 'loadingDescription'];
        this.status = true;
      }
    },
    open(model, action, actionName) {
      // 初始化
      this.fieldTime = null;
      this.tempTime = {'loadingTime':null,'unloadingTime':null};
      this.actionCode = action;
      // 将带过来的时间 带进去
      if(model.loadingTime){
        this.tempTime.loadingTime = model.loadingTime;
      }
      if(model.unloadingTime){
        this.tempTime.unloadingTime = model.unloadingTime;
      }

      if( 'loadingInput'=== this.actionCode && model.loadingTime){ // 发货补录
          this.fieldTime =  model.loadingTime;
      }
      if( 'unloadingInput'=== this.actionCode && model.unloadingTime){ // 发货补录
          this.fieldTime =  model.unloadingTime;
      }


      // this.fieldTime =  this.actionCodes.indexOf(this.actionCode) < 2 ? model.loadingTime : model.unloadingTime;
      Object.keys(this.domainObject).forEach((key) => {
        this.$set(this.domainObject, key, null);
      });

      const initKeys = ['code', 'truckLicenseNo', 'driverFullName', 'waybillNo', 'loadingGoodsWeight', 'loadingGoodsVolume', 'loadingGoodsNum', 'unloadingGoodsWeight', 'unloadingGoodsVolume', 'unloadingGoodsNum','loadingAttachment','unloadingAttachment'];
      initKeys.forEach((v) => {
        this.$set(this.domainObject, v, model[v]);
      });
      // this.domainObject = model;
      // if ('unloading' === this.actionCode) {
      //   this.$set(this.domainObject, 'loadingTime', '');
      // }
      // if ('loading' === this.actionCode) {
      //   this.$set(this.domainObject, 'unloadingTime', '');
      // }
      // console.log('open ...',this.domainObject);

      this.title = actionName;
      this.waybill = model;
      this.smallTicket = '';
      if (model.waybillExternalNo1) {
        this.smallTicket = model.waybillExternalNo1;
      }

      this.dealWithType();
      this.$nextTick(()=>{
          this.$refs.dialog.open();
      });

      // this.netGetManifestList();
      // this.initForm();
      // this.initFormForLeft();

    },
    // 获取 实际发货 与 收货的总计数值
    getTotalManifest() {
      if (this.$refs['eleManifest'].$refs['pageSubtotal']) {
        let self = this;
        const cacFields = this.$refs['eleManifest'].$refs['pageSubtotal'].cacFields;
        let keys = ['loadingGoodsWeight', 'loadingGoodsVolume', 'loadingGoodsNum', 'unloadingGoodsWeight', 'unloadingGoodsVolume', 'unloadingGoodsNum'];
        cacFields.forEach(item => {
          if (self.domainObject.hasOwnProperty(item.field) && keys.includes(item.field)) {
            self.domainObject[item.field] = item.total;
          }
        })
        if (this.actionCodes.indexOf(this.actionCode) < 2) {
           if (this.fieldTime instanceof Date){
            this.domainObject['loadingTime']  = dateFormat(this.fieldTime);
           }else{
            this.domainObject['loadingTime'] = this.fieldTime;
           }
        }
        if (this.actionCodes.indexOf(this.actionCode) > 1) {
          if (this.fieldTime instanceof Date){
              this.domainObject['unloadingTime'] = dateFormat(this.fieldTime);
          }else{
             this.domainObject['unloadingTime'] = this.fieldTime;
          }
        }
      }
    },
    valid() {
      console.log(this.listDataManifest)
      let result = true;
      const typeText = this.actionCodes.indexOf(this.actionCode) < 2 ? '发货' : '收货',
        listData = this.listDataManifest;
      // 发货、发货补录、收货、收货补录，时间及凭证校验
      if (this.fieldTime && (this.domainObject.loadingAttachment || this.domainObject.unloadingAttachment)){
        if (typeText === '发货') {
          for (let i = 0; i < listData.length; i++) {
            // 如果有计划数量
            if (listData[i].goodsNum) {
              // 如果发货数量未填写
              if (!listData[i].loadingGoodsNum) {
                const name = listData[i].goodsName,
                  number = listData[i].goodsNum;
                this.$message({
                  type: 'warning',
                  message: `${name}的计划数量为${number}件，请填写${name}的发货数量！`,
                  duration: 3000
                });
                return false;
              } else {
                result = true;
              }
            }
            // 如果有计划重量
            // Update 2019-05-21: 不管有没有计划重量都要填
            // if (listData[i].goodsWeight) {
              // 如果发货重量未填写
              if (!listData[i].loadingGoodsWeight) {
                const name = listData[i].goodsName,
                  number = listData[i].goodsWeight;
                this.$message({
                  type: 'warning',
                  message: `${name}的计划重量为${number || 0}吨，请填写${name}的发货重量！`,
                  duration: 3000
                });
                return false;
              } else {
                result = true;
              }
            // }
            // 如果有计划体积
            if (listData[i].goodsVolume) {
              // 如果发货体积未填写
              if (!listData[i].loadingGoodsVolume) {
                const name = listData[i].goodsName,
                  number = listData[i].goodsVolume;
                this.$message({
                  type: 'warning',
                  message: `${name}的计划体积为${number}方，请填写${name}的发货体积！`,
                  duration: 3000
                });
                return false;
              } else {
                result = true;
              }
            }
          }
        } else {
          for (let i = 0; i < listData.length; i++) {
            // 如果有发货数量
            if (listData[i].loadingGoodsNum) {
              // 如果收货数量未填写
              if (!listData[i].unloadingGoodsNum) {
                const name = listData[i].goodsName,
                  number = listData[i].loadingGoodsNum;
                this.$message({
                  type: 'warning',
                  message: `${name}的发货数量为${number}件，请填写${name}的收货数量！`,
                  duration: 3000
                });
                return false;
              } else {
                result = true;
              }
            }
            // 如果有发货重量
            if (listData[i].loadingGoodsWeight) {
              // 如果收货重量未填写
              if (!listData[i].unloadingGoodsWeight) {
                const name = listData[i].goodsName,
                  number = listData[i].loadingGoodsWeight;
                this.$message({
                  type: 'warning',
                  message: `${name}的发货重量为${number}吨，请填写${name}的收货重量！`,
                  duration: 3000
                });
                return false;
              } else {
                result = true;
              }
            }
            // 如果有发货体积
            if (listData[i].loadingGoodsVolume) {
              // 如果收货体积未填写
              if (!listData[i].unloadingGoodsVolume) {
                const name = listData[i].goodsName,
                  number = listData[i].loadingGoodsVolume;
                this.$message({
                  type: 'warning',
                  message: `${name}的发货体积为${number}方，请填写${name}的收货体积！`,
                  duration: 3000
                });
                return false;
              } else {
                result = true;
              }
            }
          }
        }
      } else {
        this.$message({
          type: 'warning',
          message: `${typeText}时间和${typeText}凭证为必填项，不能为空！`,
          duration: 3000
        });
        return false;
      }
      return result;
    },
    // 时间的校验，发货时间必须 早于 收货时间
    checkTime(){
      let result = true;
      const typeText = this.actionCodes.indexOf(this.actionCode) < 2 ? '发货' : '收货';
      if('发货' == typeText){
        let loadingTimeNow = this.fieldTime;
        if ('>' === compareTime(loadingTimeNow, this.tempTime.unloadingTime)){
          result = false;
          showMessageUtil('warning', '发货时间必须早于收货时间', 2000);
        }
      }else{
         let unloadingTimeNow = this.fieldTime;
        if ('<' === compareTime(unloadingTimeNow, this.tempTime.loadingTime)){
          result = false;
          showMessageUtil('warning', '收货时间必须晚于发货时间', 2000);
        }
      }
      return result;
    },
    handleDone() {
      // 1. 检验
      // 2. 提交请求  == 货单的 收发货
      // 3. waybill 的收发货
      this.getTotalManifest();
      if(!this.checkTime()){
        return;
      }
      if (!this.valid()) {
        // this.$message({
        //   type: 'warning',
        //   message: '请输入完整的信息',
        //   duration: 3000
        // });
        console.log('valid failed please check the form and make sure that all the required fields were filled correctly');
        return false;
      } else {
        const self = this,
        h = this.$createElement;
        this.$msgbox({
          title: '消息',
          message: h('p', null, [
            h('span', null, '确认提交吗？ ')
          ]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '执行中...';
              // this.netSubmitManifest(instance, done,() => {
              //   executeAction(self.domainObject.code, self.actionCode, self.domainObject, [], (success, error) => {
              //     self.submitCallback(instance, done, success, error);
              //   });
              // });
              // executeAction(self.domainObject.code, self.actionCode, self.domainObject, [], (success, error) => {
              //   if (success) {
              //     this.netSubmitManifest(instance, done, () => {
              //       self.submitCallback(instance, done, success, null);
              //     });
              //   }
              //   if (error) {
              //     self.submitCallback(instance, done, null, error);
              //   }
              // });

              this.netSubmitManifestFinal(instance,done,(success,error)=>{
                if (success) {
                  self.submitCallback(instance, done, success, null);
                }
                if(error){
                  self.submitCallback(instance, done, null, error);
                }
              })
            } else {
              done();
            }
          }
        }).then(() => {});
      }
    },
    submitCallback(instance, done, success, error) {
      if (success) {
        this.$message({
          type: 'success',
          message: '提交成功',
          duration: 1000
        });
        instance.confirmButtonLoading = false;
        done();
        if (!this.isDialog) {
          // this.resetForm(formName);
        }
        this.$emit('success');
        this.refresh();
      }
      if (error) {
        this.$message({
          type: 'error',
          message: `${error.content}`,
          duration: 3000
        });
        instance.confirmButtonLoading = false;
        instance.confirmButtonText = '确定';
        done();
        console.error(error);
        this.$emit('fail');
        this.refresh();
      }
    },
    handleCancel() {
      this.$refs.dialog.close();
    },
    refresh() {
      this.$refs.dialog.close();
      this.$emit('refresh', this);
    },
    //提交 货单的 数据
    // netSubmitManifest(instance, done, callback) {
    //   this.netLoading(this.domainObject, this.listDataManifest, (success, error) => {
    //     if (success) {
    //       callback();
    //       // executeAction(self.code, self.actionCode, self.domainObject, [], (success, error) => {
    //       //   self.submitCallback(formName, instance, done, success, error);
    //       // });
    //     }
    //     if (error) {
    //       showMessageUtil('warning', error.content, 2000) ;
    //         instance.confirmButtonLoading = false;
    //         instance.confirmButtonText = '确定';
    //         done();
    //     };
    //   })
    // },
    // God ，I hope that is the last time for fixing
    netSubmitManifestFinal(instance, done, callback){
      let domainObjectCopy = JSON.parse(JSON.stringify(this.domainObject));
      // 如果是 发货 + 发货补录 去除 unloading的字段
      if (this.actionCodes.indexOf(this.actionCode) > 1) { // 收货  去除 发货字段
          delete domainObjectCopy.loadingGoodsWeight;
          delete domainObjectCopy.loadingGoodsVolume;
          delete domainObjectCopy.loadingGoodsNum;
          delete domainObjectCopy.loadingAttachment;
      }else{ // 发货
          delete domainObjectCopy.unloadingGoodsWeight;
          delete domainObjectCopy.unloadingGoodsVolume;
          delete domainObjectCopy.unloadingGoodsNum;
          delete domainObjectCopy.unloadingAttachment;
      }

      submitManifestFinal(this.actionCode,domainObjectCopy,this.listDataManifest,(success,error)=>{
        if (success) {
          callback(success,error);
        }
        if (error) {
          showMessageUtil('warning', error.content, 2000) ;
            instance.confirmButtonLoading = false;
            instance.confirmButtonText = '确定';
            done();
        };
      })
    },

    // 网络请求：获取货单信息
    netGetManifestList() {
      let code = this.domainObject.code;
      if (!code) { return; }
      getListInvoiceList({ waybillCode: code }, (success, error) => {
        if (success && success.content) {
          const data = success.content,
            keys = ['loadingGoodsWeight','loadingGoodsVolume', 'loadingGoodsNum', 'unloadingGoodsWeight', 'unloadingGoodsVolume', 'unloadingGoodsNum'];
          data.forEach((val) => {
             this.$set(val, 'loadingGoodsWeightUnitCode', 'ton');
             this.$set(val, 'unloadingGoodsWeightUnitCode', 'ton');

             this.$set(val, 'loadingGoodsVolumeUnitCode', 'cube');
             this.$set(val, 'unloadingGoodsVolumeUnitCode', 'cube');

             this.$set(val, 'loadingGoodsNumUnitCode', 'item');
             this.$set(val, 'unloadingGoodsNumUnitCode', 'item');

            keys.forEach((v) => {
              if (!val[v]) {
                this.$set(val, v, '');
              }
            });
          });

          this.listDataManifest = data;
        }
        if (error) { showMessageUtil('warning', error.content, 2000) };
      })
    },
    query() {
      // let self = this,
      //   arr = [];
      // [1, 2].forEach(() => {
      //   let obj = { goodsName: 'No345', goodsCategory: 'No99999', goodsNum: '123', loadingGoodsWeight: '444', loadingGoodsVolume: '99', loadingGoodsNum: '88', goodsLossType: '123', loadingDescription: 'this is mook data' };
      //   arr.push(obj);
      // })
      // self.listDataManifest = arr;
      // this.$nextTick(() => { this.$refs['eleManifest'].addRow(); });
      this.netGetManifestList();

      // if (this.params.logisticsCode) { //详情
      //   this.netGetManifestList()
      // } else { //新建
      //   this.$nextTick(() => { this.$refs['eleManifest'].addRow(); })
      // }
    },
  },
  mounted() {
    // this.getColumnManifest = getColumnManifestUnloading;
    // this.attachmentConfig.field = 'unloadingAttachment';
    // this.fieldTime = 'unloadingTime';


  },
  created() {}
};

</script>
<style lang="scss" rel="stylesheet/scss">
@import "../assets/sass/base.scss";

#waybillList {
  .huaneng_un_loading_input {
    .el-dialog--large {
      margin-left: -45% !important;
      width: 90%;
    }
    .el-date-editor.el-input {
      width: 193px !important;
    }
    .el-required::before {
      content: '*';
      display: inline-block;
      margin-right: 3px;
      color: #f00;
    }
  }
}

#page_waybill_manifest {

.el-dialog__body .complex-control-2 .innerblock{
        width: auto;

}

  .el_header {
    background-color: #E4E4E4;
    height: 54px;
    padding-top: 20px;
    margin-bottom: 2px;
    padding-left: 15px;

    .el_label {
      display: inline-block;
      width: 70px;
    }
  }

  .el_footer {
    background-color: #E4E4E4;
    height: 70px;
    padding-top: 18px;
    margin-top: 2px;
    padding-left: 15px;

    .file {
      position: relative;
      top: -14px;
      .el-upload.el-upload--picture-card,
      .el-upload-list--picture-card .el-upload-list__item,
      .imgShow img {
        width: 60px;
        height: 60px;
        line-height: 60px;
      }

      .el-upload-list__item-actions {
        font-size: 18px;
      }

      .el-upload-list__item-delete {
        margin-left: 5px;
      }

      .el-upload-list--picture-card .el-upload-list__item-status-label {
        right: -18px;
        i {
          position: relative;
          margin-top: 0;
          left: -2px;
          top: -10px;
        }
      }

      .el-upload--picture-card i {
        font-size: 18px;
      }

      .el-dialog__header {
        border-bottom: none;
      }
    }

    .el-input {
      width: 70%;
    }

    .el_value {
      display: inline-block;
      width: 70%;
    }

    .el_label {
      display: inline-block;
      width: 70px;
      vertical-align: top;
      margin-top: 5px;
    }
  }
}



.el-icon-plus,
.el-icon-minus {
  cursor: pointer;
}

.el-table {
  .el-input {
    width: 100px;
    margin-right: 5px;
  }
}

.waybill-action .el-col-12 {
  height: auto !important;
}

</style>
