<template>
  <div>
    <!-- {{domainObject}} -->
    <div class="form-page">
      <el-form :model="domainObject" ref="stform" label-width="100px" :inline="false">
        <settle-form-layout :isEdit="true" :editable="editable" :objectName="objectName" :domainObject="domainObject">
          <div v-for="field in fields" :slot="field.fieldConfigCode">
            <el-form-item :label="field.showName" :required="field.required ==='true'">
              <ele-block :field="field" :domainObject="domainObject" :editable="isEditable(field.fieldConfigCode)" :uploadUrl="uploadUrl" :inputKey="inputKey"></ele-block>
            </el-form-item>
          </div>
          
          <!-- <show-price slot="showPrice" :logisticsCode="domainObject.logisticsCode" v-if="domainObject.logisticsCode"></show-price> -->
          
          <el-button v-show="editable && showBtn" @click="submitForm('settle')" size="large" slot="buttonSave" :disabled="btnStatus">暂不通过，保存数据</el-button>

          <el-button type="primary" v-show="editable && showBtn" @click="submitForm('pass')" size="large" slot="buttonSubmit" :disabled="btnStatus">结算通过，待付款</el-button>

        </settle-form-layout>
      </el-form>

    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  import settleFormLayout from './settleFormLayout.vue';
  import eleBlock from '../components/ele-block/eleBlock.vue';
  import * as waybillService from '../../api/waybillService';

  export default {
    components: {
      'settle-form-layout': settleFormLayout,
      'ele-block': eleBlock
    },
    props: {
      domainObject: Object,
      inputKey: Array,
      uploadUrl: String,
      objectName: String,
      isEdit: Boolean,
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
        editableFields: ['receivePerson','settleAdjustAmount', 'settleMethod', 'driverPrice', 'payMethod', 'driverPayeeBankName', 'driverPayeeBankAccountName', 'driverPayeeBankAccountNo', 'payeeTel', 'driverPayeeBankAccountDescription', 'settleResult', 'settleReason', 'settleClientOrgPayeeAdjust', 'settleConfigValue1', 'settleConfigValue2', 'driverFuelCardNo', 'clientFreightPrice','payeeDriverPhone','freightLoss', 'goodsPrice'],
        btnStatus: false
      };
    },
    methods: {
      isEditable(fieldConfigCode) {
        return this.editable && this.editableFields.includes(fieldConfigCode);
      },
      checkFields(fields) {
        const len = fields.length;
        let pass = 0;
        if (fields) {
          fields.forEach((val) => {
            if (this.domainObject[val[0]] || this.domainObject[val[1]]) {
              (this.domainObject[val[0]] && this.domainObject[val[1]]) ? (pass+=1) : '' ;
            } else {
              pass += 1;
            }
          });
          return pass;
        }
      },
      submitForm(result) {
        // const dom = this.$parent.$parent.$parent.$parent;
        // console.log('find dom is', dom);
        // dom.$refs.chargeList.submitRecord();
        // 保存之前先判断货物清单是否已保存
        const manifestDom = this.$parent.$parent.$parent.$parent.$refs.eleManifest;
        if (manifestDom.statusEditable) {
          this.$message({
            type: 'warning',
            message: '货物清单未保存！',
            duration: 3000
          });
          return false;
        }
        // 保存之前先判断费用科目是否已保存
        const chargeDom = this.$parent.$parent.$parent.$parent.$refs.eleChargeItem;
        if (chargeDom.statusEditable) {
          this.$message({
            type: 'warning',
            message: '费用信息未保存！',
            duration: 3000
          });
          return false;
        }
        // 后端已做费用科目校验，前端校验可注释 2019年5月15日10:01:09
        // if (!chargeDom.validForSettle()) { return false; }

        // 增加固定科目(油气费、保险费、信息费)如果填写了一项，则必须填写完整判断
        const fields = [['settleConfigValue1', 'settleConfigUnitCode1'], ['settleConfigValue2', 'settleConfigUnitCode2'], ['settleConfigValue3', 'settleConfigUnitCode3']];
        if (this.checkFields(fields) === fields.length) {
          this.$refs.stform.validate((val) => {
            if (val) {
              if (!this.domainObject.loadingTime || !this.domainObject.unloadingTime) {
                this.$message({
                  type: 'error',
                  message: '运单发货时间和收货时间为必填项！',
                  duration: 3000
                });
                return false;
              } else if (!this.domainObject.unloadingGoodsWeight) {
                this.$message({
                  type: 'error',
                  message: '收货重量为必填项！',
                  duration: 3000
                });
                return false;
              }
               else {
                this.btnStatus = true;
                this.domainObject.settleStatus = result;
                waybillService.saveManifestSettle(this.domainObject, (success, error) => {
                  if (error) {
                    this.$message({
                      type: 'warning',
                      showClose: true,
                      message: error.content,
                      duration: 3000
                    });
                    this.btnStatus = false;
                  }
                  if (success) {
                    this.btnStatus = false;
                    const settleStatus = this.domainObject.settleStatus,
                      truckLicenseNo = this.domainObject.truckLicenseNo,
                      waybillNo = this.domainObject.waybillNo,
                      h3msg = settleStatus === 'pass' ? `${truckLicenseNo}单车结算通过！` : `${truckLicenseNo}单车结算暂不通过，但已保存数据！`,
                      h = this.$createElement;
                    this.$msgbox({
                      title: '提示',
                      message: h('div', null, [
                        h('h3', null, `${h3msg}`),
                        h('p', null, [
                          h('span', null, `运单号：${waybillNo}`)
                        ])
                      ]),
                      showConfirmButton: false,
                      showCancelButton: true,
                      cancelButtonText: '关闭',
                      beforeClose: (action, instance, done) => {
                        if (action === 'confirm') {
                          instance.confirmButtonLoading = true;
                          instance.confirmButtonText = '执行中...';
                          setTimeout(() => {
                            done();
                            setTimeout(() => {
                              instance.confirmButtonLoading = false;
                            }, 300);
                          }, 3000);
                        } else {
                          done();
                          if (this.isEdit && this.editable) {
                            // 编辑成功进入详情
                            const url = window.location.href;
                            window.location.href = `${url}&editable=false`;
                          } else {
                            // 单车扫码结算页面刷新
                            window.location.reload();
                          }
                        }
                      }
                    }).then(() => {
                      console.log('submit domainObject', this.domainObject);
                      if (this.isEdit && this.editable) {
                        // 编辑成功进入详情
                        const url = window.location;
                        window.location = `${url}&editable=false`;
                      } else {
                        // 单车扫码结算页面刷新
                        window.location.reload();
                      }
                    });
                    // window.location.reload();
                    // console.log('submit domainObject', this.domainObject);
                  }
                });
              }
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        } else {
          this.$message({
            type: 'warning',
            message: '固定科目结算方式设置(油气费、保险费、信息费)，数值和单位必须同时填写完整！',
            duration: 3000
          });
        }
      }
    },
    mounted() {
      this.$nextTick(()=>{
        this.$emit('settleFormMounted');
      })
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
.el-message-box__message {
  h3 {
    padding: 0 20px;
    font-size: 16px;
    text-align: center;
  }
  p {
    padding: 20px;
    font-size: 12px;
    text-align: center;
    span + span {
      margin-left: 20px;
    }
  }
}
</style>
