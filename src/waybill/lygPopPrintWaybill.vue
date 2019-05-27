<template>
  <ele-dialog ref="dialog" title="提示" @submit="handleDone" @cancel="handleCancel">
    <div v-if="domainObject">
      <p class="confirm-msg">是否打印<strong class="org">{{domainObject.truckLicenseNo}}</strong>的小票？</p>
      <el-form label-width="100px" class="dialog-form">
        <el-form-item label="订单号" prop="logisticsNo">
          <el-input class="spec-input" readonly v-model="domainObject.logisticsNo" placeholder="请输入订单号"></el-input>
        </el-form-item>
        <el-form-item label="委托号" prop="logisticsExternalNo1">
          <el-input class="spec-input" readonly v-model="domainObject.logisticsExternalNo1" placeholder="请输入委托号"></el-input>
        </el-form-item>
        <el-form-item label="码头公司" prop="terminalCompany">
          <el-input class="spec-input" readonly v-model="domainObject.terminalCompany" placeholder="请输入码头公司"></el-input>
        </el-form-item>
        <el-form-item label="小票号" prop="waybillExternalNo1">
          <el-input class="spec-input" v-model="domainObject.waybillExternalNo1" placeholder="请输入小票号"></el-input>
        </el-form-item>
        <!--<el-form-item label="挂车牌号" prop="trailerTruckLicenseNo">-->
        <!--<el-input-->
        <!--class="spec-input"-->
        <!--v-model="domainObject.trailerTruckLicenseNo"-->
        <!--placeholder="请输入挂车牌号"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="套打模板">
          <el-select v-model="printTemplateCode" placeholder="请选择套打模板">
            <el-option v-for="item in printTemplateList" :key="printTemplateCode" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
  </ele-dialog>
</template>
<script type="text/ecmascript-6">
import eleDialog from '../components/ele-dialog/eleDialog.vue';
import * as PrintTemplateService from '../../api/PrintTemplateService';
import * as PrintTemplateHelper from '../print/PrintTemplateHelper';

export default {
  inject: ['eventBus'],
  components: {
    'ele-dialog': eleDialog
  },
  props: {
    type: null,
  },
  data() {
    return {
      printTemplateCode: null,
      domainObject: null,
      printTemplateList: [],
      code: null,
      printType: null
    };
  },
  methods: {
    open(model, type, strPrintType, code) {
      console.log(this.type)
      this.printType = strPrintType;
      this.code = code;
      this.type = type;
      this.domainObject = model;
      PrintTemplateService.listDocumentRelation('waybill', 'waybill', { page: 1, size: 100 }, (success, error) => {
        if (error) {
          console.error('get print template list error', error);
        } else {
          this.printTemplateList = success.content;
        }
      });
      this.$refs.dialog.open();
    },
    handleCancel() {
      this.$refs.dialog.close();
    },
    handleDone() {
      let self = this;
      const template = this.printTemplateList.find(item => item.code === this.printTemplateCode);
      if (template) {
        // PrintTemplateService.updateWaybillSmallTicket({ code: this.domainObject.code, waybillExternalNo1: this.domainObject.waybillExternalNo1 }, (suc, err) => {
        //   if (err) {
        //     this.$message.error('修改小票号失败');
        //     return;
        //   }

        PrintTemplateService.getDetail('waybill', 'waybill', (success, error) => {
         
          if (success && success.content) {
             let paramsObj = {};
            paramsObj.configList = success.content;
            PrintTemplateService.getBusinessObject(paramsObj, 'waybill', 'waybill', this.domainObject.code, (success, error) => {
              if (error) {
                console.error('getBusinessObject error', error);
              } else {
                console.log(`obj:${success.content}`);
                const paramsObj = {
                  code: this.code,
                  externalNoPrintStatus: 'printed'
                };
                PrintTemplateService.updatePrintStatus({ 'externalNoPrintStatus': 'printed' ,'waybillExternalNo1':self.domainObject.waybillExternalNo1 }, self.domainObject.code, (success1, error1) => {
                  if (error1) {
                    console.error(`修改运单打印状态错误：${error1}`);
                  }
                  this.$refs.dialog.close();
                  // 刷新页面
                  // window.location.reload();
                });
                success.content.waybillExternalNo1 = this.domainObject.waybillExternalNo1;
                PrintTemplateHelper.printDocument(template.fields.split(','), template.qrcodeField, template.context, success.content);
              }
            });
          }
        })

        // })
      }
    }
  },
  created() {

  }
};

</script>
<style lang="scss" rel="stylesheet/scss">
.confirm-msg {
  padding: 10px;
  margin-bottom: 10px;
  font-size: 16px;
  text-align: center;
  border-bottom: dashed 1px #ddd;
  .org {
    font-weight: 700;
    margin: 0 3px;
  }
}

.dialog-form {
  .el-input,
  .el-select {
    width: 180px !important;
  }
}

</style>
