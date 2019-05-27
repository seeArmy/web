/**
* action.vue
* Created by dsky on 17/7/6.
*/
<template>
  <ele-dialog ref="dialog" id='loadingAction' :title="title" @submit="handleDone" @cancel="handleCancel" :class="dialog_class">
    <div class="form-page loading-action">
      <el-row>
        <el-col :span="6" class='form_item_auto data_left' v-if='is_huaneng_un_loading_input'>
          <el-form :model="dataLeft" label-width="100px">
            <el-col :span="23" v-for="(field, index) in fieldsLeft" :key="index">
              <el-form-item :label="field.showName">
                <ele-block :editable='false' :field="field" :domainObject="dataLeft" :inputKey="inputKey" :uploadUrl="uploadUrl"></ele-block>
              </el-form-item>
            </el-col>
          </el-form>
        </el-col>
        <el-col :span=" is_huaneng_un_loading_input ? '18' : '23'" class='form_item_auto'>
          <el-row v-loading.fullscreen.lock="loading" element-loading-text="加载中">
            <el-form :model="domainObject" ref="domainObject" label-width="100px">

              <el-col :span="12">
                <el-form-item v-if="waybill != null" label="车牌号">
                  <span>{{waybill.truckLicenseNo}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item v-if="waybill != null" label="运单号">
                  <span>{{waybill.waybillNo}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-for="(field, index) in fields" :key="field.fieldConfigCode" :class="index === 4 ? 'el-col-auto' : ''">
                <el-form-item :label="field.showName" v-bind:class="field | filterClass(actionCode, projectName, waybill.meterageType)">
                  <ele-block :field="field" :domainObject="domainObject" :inputKey="inputKey" :uploadUrl="uploadUrl"></ele-block>
                </el-form-item>
              </el-col>
              <!--显示-->
              <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm('domainObject')" v-show="isEdit">提交</el-button>
                <el-button @click="handleCancel" v-show="isEdit">取消</el-button>
              </div>
              <el-col :span="24">
                <el-form-item v-show="!loading">
                  <el-button type="primary" @click="submitForm('domainObject')" v-show="isEdit && !isDialog" size="large">提交</el-button>
                  <!--<el-button @click="resetForm('domainObject')" v-show="isEdit" size="large">重置</el-button>-->
                  <el-button @click="handleCancel" v-show="isEdit && !isDialog" size="large" v-if="tableData.length">取消</el-button>
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
        </el-col>
        </el-col>
      </el-row>
    </div>
  </ele-dialog>
</template>
<script type="text/ecmascript-6">
import eleBlock from '../components/ele-block/eleBlock.vue';
import eleDialog from '../components/ele-dialog/eleDialog.vue';
import ApiConst from '../../api/ApiConst';
import { executeAction, getWaybillLoadingWeight,loadingLoading,unloadingLoading,getManifestList } from '../../api/waybillService';
import * as utils from '../../api/Utils';

const axios = require('axios'),
  waybillUrl = ApiConst.apiWayBillDomain;

function elementConfig(code, action) {
  return axios({
    method: 'get',
    //      url: `${configUrl}/waybill/${code}/action/${action}/render/list`,
    url: `${waybillUrl}/waybill/${code}/action/${action}/render/list`,
    headers: { 'Accept': 'application/json' }
  });
}
export default {
  data() {
    return {
      netLoading:loadingLoading,
      listDataManifest:[],
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
      actionCode: '',
      waybill: null,
      title: '',
      projectName: JSON.parse(localStorage.getItem('appInfo')).projectName,
      smallTicket: '',

      fieldsLeft: [],
      dataLeft: null
    };
  },
  props: {
    id: '',
    action: '',
    //      uploadUrl: '',
    isDialog: {
      type: Boolean,
      'default': false
    }
  },
  filters: {
    filterClass(val, actionCode, projectName, meterageType) {
      if ('loading' == actionCode || 'unloading' == actionCode) {
        if ('loadingTime' === val.fieldConfigCode || 'unloadingTime' === val.fieldConfigCode) {
          return 'show_icon_request';
        }
      }

      if ('unloadingInput' == actionCode ) {
        if ('unloadingGoodsWeight' === val.fieldConfigCode) {
          return 'show_icon_request';
        }
      }
      if ('unloading' == actionCode) {
        if ('unloadingGoodsWeight' === val.fieldConfigCode) {
          return 'show_icon_request';
        }
        if (meterageType === 'item' && 'unloadingGoodsNum' === val.fieldConfigCode) {
          return 'show_icon_request';
        }
        if (meterageType === 'cube' && 'unloadingGoodsVolume' === val.fieldConfigCode) {
          return 'show_icon_request';
        }
      }
      
      return '';
    }
  },
  components: {
    'ele-block': eleBlock,
    'ele-dialog': eleDialog
  },
  computed: {
    showIconRequest() {
      return 'show_icon_request';
    },
    is_huaneng_un_loading_input() {
      const index = ['loading', 'loadingInput', 'unloading', 'unloadingInput'].indexOf(this.actionCode);
      if (index >= 0) { return true; }
      return false;
    },
    dialog_class() {
      let cls = '';
      cls += 'ishn ';
      const index = ['loading', 'loadingInput', 'unloading', 'unloadingInput'].indexOf(this.actionCode);
      if (index >= 0) {
        cls += 'huaneng_un_loading_input ';
      }
      return cls;
    }
  },
  methods: {
    open(model, action, actionName) {
      this.title = actionName;
      this.waybill = model;
      this.smallTicket = '';
      if (model.waybillExternalNo1) {
        this.smallTicket = model.waybillExternalNo1;
      }
      this.actionCode = action;
      this.initForm();
      this.initFormForLeft();
      if (model) {
        this.dataLeft = {
          departDate: model.departDate || '',
          returnDate: model.returnDate || '',
          goodsWeight: model.goodsWeight || '',
          goodsWeightUnitCode: model.goodsWeightUnitCode || '',
          goodsVolume: model.goodsVolume || '',
          goodsVolumeUnitCode: model.goodsVolumeUnitCode || '',
          goodsNum: model.goodsNum || '',
          goodsNumUnitCode: model.goodsNumUnitCode || ''
        }
      };
      this.$refs.dialog.open();
    },
    handleCancel() {
      this.$refs.dialog.close();
    },
    refresh() {
      this.$refs.dialog.close();
      this.$emit('refresh', this);
    },
    fetchData() {
      if (this.waybill) {
        const paramsObj = {
          bizEventNo: 'getBalance',
          waybillNo: this.waybill.waybillNo,
          truck: this.waybill.truckLicenseNo,
          ticket: this.smallTicket,
          consign: this.waybill.logisticsExternalNo1
        };
        getWaybillLoadingWeight(paramsObj, (success, error) => {
          if (error) {
            this.$message({
              type: 'error',
              message: `${error}`,
              duration: 1000
            });
          }
          if (success && success.result && success.result.data) {
            const data = success.result.data || [];
            if (data.length > 0) {
              const res = data[0];
              this.domainObject.loadingGoodsWeight = res.NetWeight; //净重
              this.domainObject.loadingGoodsNum = res.Amount; //件数
              this.domainObject.loadingTime = res.Record2; //过磅时间
              this.smallTicket = res.Ticket; //小票号
            } else {
              this.$message({
                type: 'warning',
                message: '未获取到码头过磅数据',
                duration: 1000
              });
            }
          } else {
            this.$message({
              type: 'warning',
              message: '未获取到码头过磅数据',
              duration: 1000
            });
          }

        });
      }
    },
    handleDone() {
      console.log('execute action');
      if (this.smallTicket) {
        this.$set(this.domainObject, 'waybillExternalNo1', this.smallTicket);
      }
      this.submitForm('domainObject');
    },
    submitCallback(formName, instance, done, success, error) {
      if (success) {
        this.$message({
          type: 'success',
          message: '提交成功',
          duration: 1000
        });
        instance.confirmButtonLoading = false;
        done();
        if (!this.isDialog) {
          this.resetForm(formName);
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
        done();
        console.error(error);
        this.$emit('fail');
        this.refresh();
      }
    },
    checkPreNumFun() {
      let mark_bc = { mark: false, msg: '' };
      const index = ['loading', 'loadingInput', 'unloading', 'unloadingInput'].indexOf(this.actionCode);
      if (index < 0) { return true; }

      // 预装 重量 体积 数量  --- 对应  收发货重量  收发货体积  收发货数量
      // 业务逻辑 :
      // 1. 如果预装重量、预装体积和预装数量，这三者有其中一项有值，那么对应的实际发货重量、发货体积或发货数量也必须有值
      // 2.收货确认弹窗中的收货重量必填保留

      const goodsWeightPro = this.dataLeft.goodsWeight,
        goodsVolumePro = this.dataLeft.goodsVolume,
        goodsNumPro = this.dataLeft.goodsNum,

        goodsWeightNow = index > 1 ? this.domainObject.unloadingGoodsWeight : this.domainObject.loadingGoodsWeight,
        goodsVolumeNow = index > 1 ? this.domainObject.unloadingGoodsVolume : this.domainObject.loadingGoodsVolume,
        goodsNumNow = index > 1 ? this.domainObject.unloadingGoodsNum : this.domainObject.loadingGoodsNum;

      // 收货确认弹窗中的收货重量必填保留
      if ((goodsWeightPro && !goodsWeightNow) || (index > 1 && !goodsWeightNow)) {
        mark_bc.mark = true;
        mark_bc.msg += index > 1 ? '收货重量必须填写 ' : '发货重量必须填写 ';
        if (index > 1 && !goodsWeightNow) { mark_bc.msg = '收货重量必须填写 ' };
      }

      if (goodsVolumePro && !goodsVolumeNow) {
        mark_bc.mark = true;
        mark_bc.msg += index > 1 ? '收货体积必须填写 ' : '发货体积必须填写 ';
      }
      if (goodsNumPro && !goodsNumNow) {
        mark_bc.mark = true;
        mark_bc.msg += index > 1 ? '收货数量必须填写 ' : '发货数量必须填写 ';
      }


      if (mark_bc.mark && mark_bc.msg) {
        utils.showMessageUtil('warning', mark_bc.msg, 3000);
        return false;
      };
      return true;

    },
    checkDateTime() {
      let mark_bc = { mark: false, msg: '' };
      const index = ['loading', 'loadingInput', 'unloading', 'unloadingInput'].indexOf(this.actionCode);
      if (index < 0) { return true };

      const loadingTime = this.domainObject.loadingTime || this.waybill.loadingTime,
        unloadingTime = this.domainObject.unloadingTime || this.waybill.unloadingTime;

      const bc = utils.compareTime(loadingTime, unloadingTime);
      if ('>' === bc) {
        mark_bc.mark = true;
        mark_bc.msg = index > 1 ? ' "收货时间" 不能早于 “发货时间” ' : ' "发货时间" 不能晚于 "收货时间" '; // “收货时间”不能早于“发货时间”
      }


      // 如果设置了 不允许 设置未来的时间，则需要检验  start  ==================
      if ('FALSE' === JSON.parse(localStorage.getItem('otherappConfig'))['other.operateTimeLimit']) {
        const now = new Date(),
          time = index > 1 ? unloadingTime : loadingTime;

        let msg_time = '';
        if ('>' === utils.compareTime(time, now)) {
          mark_bc.mark = true;
          mark_bc.msg += index > 1 ? ' “收货时间” 不能选择“未来时间” ' : ' “发货时间” 不能选择“未来时间”';
        }
      }
      // 如果设置了 不允许 设置未来的时间，则需要检验  end  ==================
      if (mark_bc.mark && mark_bc.msg) {
        utils.showMessageUtil('warning', mark_bc.msg, 3000);
        return false;
      };

      return true;
    },
    checkFields() {
      // 检验规则：不允许输入 负数
      const obj = { loadingGoodsWeight: '发货重量 ', unloadingGoodsWeight: '收货重量 ', loadingGoodsVolume: '发货体积 ', unloadingGoodsVolume: '收货体积 ' , loadingGoodsNum: '发货数量 ', unloadingGoodsNum: '收货数量 '};
      let mark_bc = { mark: false, msg: '' };
      Object.keys(obj).forEach(key => {
        const val = this.domainObject[key];
        if (Number(val) < 0) { // isNaN
          mark_bc.mark = true;
          mark_bc.msg += obj[key];
        }
      });
      if (mark_bc.mark && mark_bc.msg) {
        mark_bc.msg += '不能为负数';
        utils.showMessageUtil('warning', mark_bc.msg, 3000);
        return false;
      };
      // 验证 收发货时间 的前后顺序
      if (!this.checkDateTime()) { return false; }
      if (!this.checkPreNumFun()) { return false };

        // 逻辑： 发货与收货（不包含收发货补录） && 发货时间 + 收货时间  才必填
        if ((this.actionCode === 'loading' && !this.domainObject.loadingTime) || (this.actionCode === 'unloading' && !this.domainObject.unloadingTime)) {
          let msg = 'loading' === this.actionCode ? '发货时间' : '收货时间';
          this.$message({
            type: 'warning',
            message: `请填写${msg}`,
            duration: 3000
          });
          return false;
        }

        // 发货或发货补录操作
        if (this.actionCode === 'loading' || this.actionCode === 'loadingInput') {
          // 发货重量，发货数量，发货体积
          if ((this.domainObject.loadingGoodsWeight && this.domainObject.loadingGoodsWeightUnitCode) || (this.domainObject.loadingGoodsNum && this.domainObject.loadingGoodsNumUnitCode) || (this.domainObject.loadingGoodsVolume && this.domainObject.loadingGoodsVolume)) {
            // 发货凭证
            if (this.domainObject.loadingAttachment) {
              return true;
            } else {
              this.$message({
                type: 'warning',
                message: '请上传发货凭证，必须上传至少一张图片！',
                duration: 3000
              });
              return false;
            }
          } else {
            this.$message({
              type: 'warning',
              message: '发货重量，发货数量，发货体积必须填写完整至少一项！',
              duration: 3000
            });
            return false;
          }
        }
        // 收货或收货补录操作
        if (this.actionCode === 'unloading' || this.actionCode === 'unloadingInput') {
          let result = true;
          // 收货重量，收货数量，收货体积
          if ((this.domainObject.unloadingGoodsWeight && this.domainObject.unloadingGoodsWeightUnitCode) || (this.domainObject.unloadingGoodsNum && this.domainObject.unloadingGoodsNumUnitCode) || (this.domainObject.unloadingGoodsVolume && this.domainObject.unloadingGoodsVolume)) {
            // do nothing
          } else {
            this.$message({
              type: 'warning',
              message: '收货重量，收货数量，收货体积必须填写完整至少一项！',
              duration: 3000
            });
            return false;
          }
          // 收货凭证
          if (!this.domainObject.unloadingAttachment) {
            this.$message({
              type: 'warning',
              message: '请上传收货凭证，必须上传至少一张图片！',
              duration: 3000
            });
            return false;
          }

          // 收货货量必填-禅道需求495
          if (!this.domainObject.unloadingGoodsWeight) {
            this.$message({
              type: 'warning',
              message: '收货重量必填',
              duration: 3000
            });
            return false;
          }

          switch (this.waybill.meterageType) {
            case 'item':
              {
                if (!this.domainObject.unloadingGoodsNum) {
                  this.$message({
                    type: 'warning',
                    message: '收货件数必填',
                    duration: 3000
                  });
                  return false;
                }
                break;
              }
            case 'cube':
              {
                if (!this.domainObject.unloadingGoodsVolume) {
                  this.$message({
                    type: 'warning',
                    message: '收货体积必填',
                    duration: 3000
                  });
                  return false;
                }
                break;
              }
          }

          return result;
        }

    },
    //提交 货单的 数据
    netSubmitManifest(cb){
      this.netLoading(this.domainObject.code,this.listDataManifest,(success,error)=>{
        if(success){
          cb();
          // executeAction(self.code, self.actionCode, self.domainObject, [], (success, error) => {
          //   self.submitCallback(formName, instance, done, success, error);
          // });
        }
        if (error) { showMessageUtil('warning', error.content, 2000) };
      })
    },
    submitForm(formName) {
      if (this.checkFields()) {
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
              //              if (self.actionCode === 'loading' || self.actionCode === 'loadingInput') {
              //                executeAction(self.code, self.domainObject, self.actionCode, (success, error) => {
              //                  self.submitCallback(formName, instance, done, success, error);
              //                });
              //              } else {
              const index = ['loading', 'loadingInput', 'unloading', 'unloadingInput'].indexOf(this.actionCode);
              if(index>0){
                this.netSubmitManifest(function(){
                  executeAction(self.code, self.actionCode, self.domainObject, [], (success, error) => {
                    self.submitCallback(formName, instance, done, success, error);
                  });
                })
              }


            } else {
              done();
            }
          }
        }).then(() => {});
      } else {

      }

    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    initFormForLeft() {
      let
        eleConfig = {
          data: {
            content: [{
                showName: "计划发货时间",
                elementCode: "label",
                extraParams: '{"field1":"departDate"}',
                fieldConfigCode: "departDate"
              }, {
                showName: "计划收货时间",
                elementCode: "label",
                extraParams: '{"field1":"returnDate"}',
                fieldConfigCode: "returnDate"
              },
              {
                showName: "预装重量",
                elementCode: "goodsWeight",
                extraParams: '{"field1":"goodsWeight","field2":"goodsWeightUnitCode","required":"false","detailLinkVisiable":"false"}',
                fieldConfigCode: "goodsWeight"
              },
              {
                showName: "预装体积",
                elementCode: "goodsVolume",
                extraParams: '{"field1":"goodsVolume","field2":"goodsVolumeUnitCode","required":"false","detailLinkVisiable":"false"}',
                fieldConfigCode: "goodsVolume"
              },
              {
                showName: "预装数量",
                elementCode: "goodsNum",
                extraParams: '{"field1":"goodsNum","field2":"goodsNumUnitCode","required":"false","detailLinkVisiable":"false"}',
                fieldConfigCode: "goodsNum"
              }
            ]
          }
        },
        eleDefine = JSON.parse(localStorage.getItem('eleDefine')),
        eleInfo = JSON.parse(localStorage.getItem('eleInfo'));
      // 如果是 发货 + 发货补录  只有 计划发货时间  ，如果是收货 + 收货补录 那么只有 计划收货 补录  start ===================
      const index = ['loading', 'loadingInput', 'unloading', 'unloadingInput'].indexOf(this.actionCode);
      if (index >= 0) {
        let index_del = index > 1 ? 0 : 1;
        eleConfig.data.content.splice(index_del, 1);
      }
      // 如果是 发货 + 发货补录  只有 计划发货时间  ，如果是收货 + 收货补录 那么只有 计划收货 补录  end ===================

      this.fieldsLeft = utils.getParam(eleConfig, eleDefine, eleInfo).field;
      // this.dataLeft = { logisticsPlanStartTime: 'abc', logisticsPlanEndTime: 'bcd', goodsWeight: '10', goodsWeightUnitCode: 'ton' };
    },
    initForm() {
      this.domainObject = {};
      this.fields = [];
      const self = this,
        localStorage = window.localStorage,
        eleDefine = JSON.parse(localStorage.getItem('eleDefine')),
        eleInfo = JSON.parse(localStorage.getItem('eleInfo'));
      this.code = this.waybill.code;
      axios.all([elementConfig(this.code, this.actionCode)])
        .then(axios.spread((eleConfig) => {
          if (eleConfig.data.content.length) {
            const paramData = utils.getParam(eleConfig, eleDefine, eleInfo);
            this.inputKey = paramData.inputKey;
            paramData.field.forEach((field) => {
              field.extraParams.forEach((property) => {
                self.$set(self.domainObject, property.field, self.waybill ? self.waybill[property.field] : null);
              });
            });
            //            console.log('self.domainObject: ', self.domainObject);
            this.isAction = true;
            this.fields = paramData.field;
            this.loading = false;
          } else {
            this.loading = false;
          }
        }));
    },
    // 网络请求：获取货单信息
    netGetManifestList() {
      let code = this.domainObject.code;
      if (!code) { return; }
      getManifestList({ code: code }, (success, error) => {
        if (success && success.content) {
          this.listDataManifest = success.content;
        }
        if (error) { showMessageUtil('warning', error.content, 2000) };
      })
    },
  },
  created() {},
  mounted() {
    if ('unloading' === this.actionCode) {
      this.netLoading = unloadingLoading;
    }
    const index = ['loading', 'loadingInput', 'unloading', 'unloadingInput'].indexOf(this.actionCode);
    if(index>=0){
      // 网络请求 货单列表
      this.netGetManifestList();
    }
  }

};

</script>
<style lang="scss" rel="stylesheet/scss">
@import "../assets/sass/base.scss";
#loadingAction{
.page_table_inlist{
z-index: 50;
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

.el-dialog__body .el-form .el-col-auto {
  width: 100% !important;
  height: auto !important;
}

.form_item_auto {
  // width: 100% !important;
  height: auto !important;
}

.el-col-get {
  height: 31px !important;
  text-align: right;

  .el-button {
    margin-right: 0;
  }
}

.loading-action {

  // .el-upload-list__item-preview {
  //   display: none !important;
  // }
  .el-upload-list__item-delete {
    float: none;
  }
}

#waybillList {

  .data_left {
    .complex-control-2 .innerblock {
      width: 50px;
    }
  }

  .huaneng_un_loading_input {
    .el-dialog--large {
      margin-left: -45% !important;
      width: 90%;
    }
  }
}

</style>
