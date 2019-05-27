<template>
  <ele-dialog ref="dialog" title="提示" @submit="handleDone" @cancel="handleCancel">
    <div v-if="domainObject">
      <!--<p class="confirm-msg">是否打印<strong class="org">{{domainObject.truckLicenseNo}}</strong>的{{this.printType == 'smallticketprintstatus' ? '小票' : '派车单' }}？</p>-->
      <el-form label-width="100px" class="dialog-form">
        <el-form-item label="运单号" prop="waybillNo">
          <el-input class="spec-input" readonly v-model="domainObject.waybillNo"></el-input>
        </el-form-item>
        <el-form-item label="车牌号" prop="truckLicenseNo">
          <el-input class="spec-input" readonly v-model="domainObject.truckLicenseNo"></el-input>
        </el-form-item>
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
      //        this.type = type;
      this.domainObject = model;
      // ps；之前用的是 list 也就是 平台的接口，现在全部用 企业的接口 8-13
      PrintTemplateService.listDocumentRelation('waybill', 'waybill', { documentCode: 'waybill.waybill', page: 1, size: 100 }, (success, error) => {
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
        // 需要传入 json 
        PrintTemplateService.getDetail('waybill', 'waybill',(success, error) => {
          if (success && success.content) {
            const paramsObj = {
              configList: success.content
            };
            PrintTemplateService.getBusinessObject(paramsObj,'waybill', 'waybill', self.domainObject.code, (success, error) => {
              if (error) {
                console.error('getBusinessObject error', error);
              } else {
                console.log(`obj:${success.content}`);
                PrintTemplateService.updatePrintStatusPrintDispatchBill({'dispatchPrintStatus':'printed'}, self.domainObject.code, (success1, error1) => {
                  if (error1) {
                    console.error(`修改运单打印状态错误：${error1}`);
                  }
                  self.$refs.dialog.close();
                });
                PrintTemplateHelper.printDocument(template.fields.split(','), template.qrcodeField, template.context, success.content);
              }
            });
          }
        })
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
