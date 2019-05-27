
<template>
  <div>
    <div class="form-page">
      <ele-form :domainObject="domainObject" ref="form"
                :configUrl="configUrl" :listUrl="listUrl" :listTitle="listTitle"
                :addFun='addFun' :editFun='editFun' :getInfo='getInfo'
                :editable="editable" :isEdit="isEdit"
                @formReady="formReady" @editSuccess="editSuccess" @submitDone="submitDone"
                :objectName="objectName"
                label-width="100px" :inline="false">
        <layout :isEdit="isEdit" :editable="editable" :objectName="objectName" :domainObject="domainObject" >
          <div v-for="field in fields" :key="field.fieldConfigCode" :slot="field.fieldConfigCode">
            <el-form-item :label="field.showName" :required="field.required ==='true'">
              <ele-block :field="field" :domainObject="domainObject" :editable="editable | filterEditble(field.fieldConfigCode,domainObject,listFiledIdent)" :uploadUrl="uploadUrl" :inputKey="inputKey"></ele-block>
            </el-form-item>
          </div>

          <el-button type="primary" v-show="!editable && isEdit" @click="editForm()" slot="buttonEdit">编辑</el-button>
          <el-button v-show="editable && isEdit" @click="cancelEdit()" slot="buttonCancel">取消编辑</el-button>
          <el-button v-show="editable && isEdit" @click="submitForm()" slot="buttonSave">保存</el-button>
          <!-- <el-button v-show="!editable && isEdit" @click="changeLog()" slot="buttonChangeLog">{{ objectName }}变更记录</el-button> -->

          <el-button v-show='editable && !isEdit' type="primary" @click="submitForm()" size="large" slot="buttonSubmit" :disabled="btnDisabled">提交</el-button>
          <el-button v-show='editable && !isEdit' @click="resetForm()" size="large" slot="buttonReset" :disabled="btnDisabled">重置</el-button>

        </layout>
      </ele-form>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  import layout from './layout.vue';

  import eleBlock from '../../components/ele-block/eleBlock.vue';
  import eleForm from '../../components/ele-form/eleForm.vue';

  import * as routeFreightRateService from '../../../api/routeFreightRateService';

  import ApiConst from '../../../api/ApiConst';
  import * as utils from '../../../api/Utils';
  import logs from '../../logs/list.vue';

  export default {
    components: {
      'ele-form': eleForm,
      'layout': layout,
      'logs': logs,
      'ele-block': eleBlock
    },
    data() {
      return {
        objectName: '外包运价',
        configUrl: `${ApiConst.routeFreightRate}/detail_render_info/outsourceFreight/list`,
        domainObject: {},
        addFun: routeFreightRateService.addOutsourcingDetail,
        editFun: routeFreightRateService.editOutsourcingDetail,
        getInfo: routeFreightRateService.getOutsourcingDetail,
        uploadUrl: ApiConst.apiCrane,
        logType: 'outsourceFreight',
        listUrl: '/routeFreightRate/outsourceFreight/outsourceFreightList.html',
        listTitle: '外包运价单',
        status: false,
        code: '',
        fields: [],
        isEdit: false, // 控制编辑添加按钮
        editable: true, // 控制页面状态
        btnDisabled: false,
        changeLogParams: {
          code: utils.getParamsFromURL(window.location.search).code,
          size: 10
        },
        loading: true,
        listFiledIdent:['partnerName','routeName','unloadingOrgName','loadingOrgName','goodsName','goodsCategoryName']
      };
    },
    filters: {
      filterEditble(filed,val, domainObject, list) {
        let mark = true;
        const params = utils.getParamsFromURL(window.location.search)
        let isEdit = sessionStorage.getItem('isEdit');
        let editable = sessionStorage.getItem('editable');
        if(isEdit  === 'true' && editable === 'true'){
          if(val == 'partnerName' || val == 'route'|| val == 'unloadingOrgName' || val == 'loadingOrgName' || val == 'goodsName' || val == 'goodsCategoryName'){
            mark = false;
          }
        }else if(isEdit  === 'true' && editable === 'false'){
            mark = false;
          }
        return mark;
      }
  },
    methods: {
      formReady(formData) {
        console.log('formReady', formData);
        this.inputKey = formData.paramData.inputKey;
        this.fields = formData.paramData.field;
        let self = this;
        this.isEdit = formData.isEdit;
        this.editable = formData.editable;
        this.code = formData.code;
        const params = utils.getParamsFromURL(window.location.search)
        sessionStorage.setItem('editable',this.editable);
        sessionStorage.setItem('isEdit',this.isEdit);
        if (params.originalCode) {
        this.$set(this.domainObject, 'ratesApproveStatus', '')
        this.$set(this.domainObject, 'effectiveStartDate', '')
        this.$set(this.domainObject, 'effectiveEndDate', '')
        this.$set(this.domainObject, 'ratesSystemNo', '')
        this.$set(this.domainObject, 'description', '')
      }
      this.$nextTick(()=>{
          if(this.editable && this.isEdit){
          let el = this.$refs.form.getElementByField('meterageType');
          if (el && el.configData) {
            // const val = el.configData.controlType === 'text' ? 'readonly' : 'TRUE';
            self.$set(el.configData, 'controlType', 'label');
          }
        }
      })
      this.$watch(`domainObject.freightPriceUnitCode`, (val) => {
        this.deatWithFreightPriceUnitCodeChange(val);
      })
      this.$nextTick(() => {
        this.deatWithFreightPriceUnitCodeChange(this.domainObject.freightPriceUnitCode);
      })
    },
    deatWithFreightPriceUnitCodeChange(val) {
      let self = this;
      if ('yuanpertruck' == val) {
        let el = this.$refs.form.getElementByField('clientSettleMethod');

        if (el && el.configData) {
          const val = el.configData.controlType === 'text' ? 'readonly' : 'TRUE';
          self.$set(el.configData, 'readonly', val);
          this.$set(this.domainObject, 'clientSettleMethod', 'trucknumber')
          this.dealWithOptions(el,'sub');
        }
      } else {
        let el = this.$refs.form.getElementByField('clientSettleMethod');
        if (el && el.configData) {
          const val = el.configData.controlType === 'text' ? 'readonly' : 'TRUE';
          self.$set(el.configData, 'readonly', '');
          if ('trucknumber' == this.domainObject.clientSettleMethod) {
            this.$set(this.domainObject, 'clientSettleMethod', '')
          }
          this.dealWithOptions(el,'add')
        }
      }
    },
    dealWithOptions(el, type) {
      let op1 = [{ data: { id: 'trucknumber', value: '按车次' }, id: 'trucknumber', value: '按车次' }];
      let op2 = [{ data: { id: 'loadingweight', value: '按发货货量' }, id: 'loadingweight', value: '按发货货量' },
        { data: { id: 'unloadingweight', value: '按收货货量' }, id: 'unloadingweight', value: '按收货货量' },
        { data: { id: 'smaller', value: '发货与收货两者取小' }, id: 'smaller', value: '发货与收货两者取小' },
        { data: { id: 'bigger', value: '发货与收货两者取大' }, id: 'bigger', value: '发货与收货两者取大' }
      ]
      if (el) {
        if (el.selectData) {
          if ('add' == type) { // 加
            this.$set(el, 'selectData', op2);
          }
          if ('sub' == type) { // 减少
            this.$set(el, 'selectData', op2.concat(op1));
          }
        }
      }
    },
      editForm() {
        this.editable = true;
      },
      cancelEdit() {
        this.$refs.form.resetForm();
        this.editable = false;
      },
      //判断运价开始时间必须早于运价截止时间
      checkTime() {
        let flag = true;
        if ('<' === utils.compareTime(this.domainObject.effectiveEndDate, this.domainObject.effectiveStartDate)) {
          utils.showMessageUtil('warning', '运价开始时间必须早于运价截止时间', 2000);
          flag = false;
        }
        return flag;
      },
      submitForm() {
         if (!this.checkTime()) return;
        // this.btnDisabled = true;
        this.$refs.form.submitForm();
      },
      resetForm() {
        this.$refs.form.resetForm();
      },
      editSuccess() {
        this.editable = false;
        sessionStorage.setItem('editable', this.editable);
      },
      submitDone() {
        this.btnDisabled = false;
      },
      orgFullNameMatch(){
        let self = this;
        const comNo = this.domainObject.orgFullName;
        if (comNo) {
          craneSignList.getOrgFullNameDetail({orgFullName: comNo}, (success, error) => {
            console.log('listtruck ...', success, error);
            if (success) {
              const data = success.content;
              Object.keys(data).forEach((key) => {
                if ('code' == key) {
                  self.$set(self.domainObject, 'orgCode', data[key]);
                } else {
                  let mark = false;
                  for (let i = 0; i < self.listFiledIdent.length; i++) {
                    let item = self.listFiledIdent[i];
                    if (item == key) {
                      mark = true;
                    }
                  }
                  if (mark) {
                    self.$set(self.domainObject, key, data[key]);
                  }
                }
              });
            }
          });
        } else {
          this.$message({
            type: 'error',
            message: '请输入吊车公司',
            duration: 1000
          });
        }
        }
    },
      mounted() {
        
        const self = this;
        self.$watch('domainObject.freightPriceUnitCode',(val)=>{
        if('yuanpertruck' == val){
          self.fields.forEach((item,index)=>{
            if(item.fieldConfigCode == 'clientSettleMethod'){
              console.log('self.fields[index].extraParams[0]',self.fields[index].extraParams[0])
              self.$set(self.fields[index].extraParams[0],'options',["按车次"]);
              self.$set(self.fields[index].extraParams[0],"optionsValue","trucknumber")
              self.$nextTick(() => {
                let el = self.$refs.form.getElementByField('clientSettleMethod');
                if (el && el.onRefresh) {
                    el.onRefresh();
                  }
              })
            }
          })
          console.log('this.fields',self.fields)
        }
          
        })
        // const self = this;
        // window.matchOrgFullName = function() {
        //   self.orgFullNameMatch();
        // }
        // // 失焦匹配信息
        // setTimeout(() => {
        //   const ele = document.getElementsByName('orgFullName')[0];
        //   if (ele) {
        //     ele.setAttribute('onblur', 'matchOrgFullName()');
        //   }
        // }, 1000);


    }
  };
</script>

