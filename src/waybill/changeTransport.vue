<!--订单参考信息-->
<template>
  <ele-dialog ref="dialog" class="page_change_transport" id='loadingAction' title="修改运力" @submit="handleDone" @cancel="handleCancel" v-loading.body="loading">
    <ele-form>
      <el-row>
        <el-col :span="12" v-for="field in fields" :key='field.field'>
          <el-form-item :label="field.showName">
            <ele-block :field="field" :domainObject="waybill" :editable="true" :uploadUrl="uploadUrl" :inputKey="inputKey"></ele-block>
          </el-form-item>
        </el-col>
      </el-row>
    </ele-form>
    <!--     <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消1</el-button>
      <el-button type="primary" @click="commit">确 定1</el-button>
    </div> -->
  </ele-dialog>
</template>
<script type="text/ecmascript-6">
import * as utils from '../../api/Utils';
import { changeCapacity } from '../../api/waybillService';

import eleBlock from '../components/ele-block/eleBlock.vue';
import eleDialog from '../components/ele-dialog/eleDialog.vue';
import eleForm from '../components/ele-form/eleForm.vue';

export default {
  components: {
    'ele-form': eleForm,
    'ele-block': eleBlock,
    'ele-dialog': eleDialog
  },
  props: {},
  data() {
    return {
      uploadUrl: null,
      inputKey: null,
      fields: [],
      waybill: null,
      loading: false
    };
  },
  methods: {
    handleDone() {
      const parm = { code: this.waybill.code, platformMainTruckCode: this.waybill.platformTruckCode, platformTrailerTruckCode: this.waybill.platformTrailerTruckCode, platformMainDriverCode: this.waybill.platformDriverCode };

      this.loading = true;
      changeCapacity(parm, (success, error) => {
        this.loading = false;
        if (success) {
          utils.showMessageUtil('success', '修改成功', 2000);
          this.$refs.dialog.close();
          this.$emit('refresh');
        }
        if (error) {
          utils.showMessageUtil('error', error.content, 2000);
        }
      });
    },
    open(model, action, actionName) {
      this.waybill = JSON.parse(JSON.stringify(model));
      let listKey = { truckLicenseNo: '', truckCode: '', platformTruckCode: '', trailerTruckLicenseNo: '', trailerTruckCode: '', platformTrailerTruckCode: '', driverFullName: '', driverCode: '', platformDriverCode: '' };
      this.waybill = Object.assign(listKey, this.waybill);
      this.initForm();
      this.$refs.dialog.open();
    },
    handleCancel() {
      this.$refs.dialog.close();
    },
    initForm() {
      const self = this,
        eleConfig = {
          data: {
            content: [{
                showName: "车牌号",
                elementCode: "popSelectTransport",
                extraParams: '{"field1":"truckLicenseNo","field2":"truckCode","field3":"truckCode","field4":"platformTruckCode","area":"transporter","required":"false","maxLength1":"20","placeholder1":"请输入车牌号","outputKey1":"transport","outputKey3":"transport","outputKey4":"transport","inputKey1":"transport.mainTruckLicenseNo","inputKey2":"transport.mainTruckCode","inputKey4":"transport.platformMainTruckCode","readonly1":"TRUE","isOpenTruckConfig3":"TRUE"}',
                fieldConfigCode: "truckLicenseNo"
              },
              {
                showName: "挂车牌号",
                elementCode: "popSelectTrailer",
                extraParams: '{"field1":"trailerTruckLicenseNo","field2":"trailerTruckCode","field3":"trailerTruckCode","field4":"platformTrailerTruckCode","area":"transporter","required":"false","detailLinkVisiable":"false","maxLength1":"20","readonly1":"TRUE","placeholder1":"请输入挂车牌号","outputKey1":"trailer","outputKey3":"trailer","outputKey4":"trailer","inputKey1":"transport.trailerTruckLicenseNo,trailer.truckLicenseNo","inputKey2":"transport.trailerTruckCode,trailer.code","inputKey4":"transport.platformTrailerTruckCode,trailer.truckCode","isOpenTruckConfig3":"TRUE"}',
                fieldConfigCode: "trailerTruckLicenseNo"
              },
              {
                showName: "主   驾 ",
                elementCode: "popSelectDriver",
                extraParams: '{"field1":"driverFullName","field2":"driverCode","field3":"driverCode","field4":"platformDriverCode","area":"transporter","required":"false","detailLinkVisiable":"false","maxLength1":"20","readonly1":"TRUE","placeholder1":"请输入主驾姓名","outputKey1":"driver","outputKey3":"driver","outputKey4":"driver","inputKey1":"transport.driverFullName,driver.fullName","inputKey2":"transport.driverCode,driver.code","inputKey4":"transport.platformDriverCode,driver.userCode","isOpenTruckConfig3":"TRUE"}',
                fieldConfigCode: "driverFullName"
              }
            ]
          }
        },
        eleDefine = JSON.parse(localStorage.getItem('eleDefine')),
        eleInfo = JSON.parse(localStorage.getItem('eleInfo'));
      self.fields = utils.getParam(eleConfig, eleDefine, eleInfo).field;
    },
  },
  created() {},
  mounted() {

  }
};

</script>
<style lang="scss" rel="stylesheet/scss">
.page_change_transport {
  .el-form-item__label {
    width: 85px;
  }
  .el-col {
    height: 36px !important;
  }
}

</style>
