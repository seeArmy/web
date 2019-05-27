<!-- 卡片式列表 -->
<template>
  <div class="ele-card-list">

    <ele-form ref="form">
    <div class="ele-card-item" v-for="(card, index) in cardListData" v-if="status">
      <div class="ec-hd">
        <span class="sequence">{{ index + 1 }}</span>
        <el-button class="remove-btn el-button--line" @click="removeCard(index)">移除</el-button>
        <el-form>
          <div v-for="field in card.fields" class="el-field" :class="['el-' + field.fieldConfigCode]" v-show="field.hide !=='true'">
            <el-form-item :label="field.showName" :required="field.required ==='true'" :class="{'el-transparent' : field.transparent ==='true'}">
              <ele-block :ref="['eleForm' + index]" :field="field" @setOutputKeyEvent = 'setOutputKeyEvent' :domainObject="card.domainObject" :editable="editable" :uploadUrl="uploadUrl"></ele-block>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <!-- 货物表格 -->
      <div class="ec-md">
        <ele-manifest-list :ref="['eleManifest' + index]" :getColumn="getListEditColumn" :folder="listEditfolder" :editableFields="editableFields" :listData="card.listData" :selectable="false" :showButtons="false" @hasValueChange="hasValueChange"></ele-manifest-list>
      </div>
      <div class="ec-ft">
        <el-button class="el-button--line" @click="copyCard(index)"><i class="el-icon-document"></i> 复制分配</el-button>
      </div>
    </div>
    <div class="add-new">
      <el-button type="primary" @click="addCard"><i class="el-icon-plus"></i> 增加空白分配</el-button>
    </div>
  </ele-form>
  </div>
</template>
<script type="text/ecmascript-6">
import eleBlock from '../ele-block/eleBlock.vue';
import eleManifestList from '../ele-manifest-list/eleManifestList.vue';
import * as util from '../../../api/Utils';
import { get as getDetailDirve } from '../../../api/DriverService';
import { getRates } from '../../../api/LogisticsService';
const axios = require('axios');
import eleForm from '../ele-form/eleForm.vue';

export default {
  name: 'eleCardList',
  components: {
    'ele-form': eleForm,
    'ele-block': eleBlock,
    'ele-manifest-list': eleManifestList
  },
  props: {
    logisticsData: Object,
    folder: String,
    listEditfolder: String,
    getListEditColumn: Function,
    editableFields: Array,
    refreshFields: Array,
    listData: Array,
    selectable: {
      type: Boolean,
      'default': false
    },
    showButtons: {
      type: Boolean,
      'default': false
    }
  },
  data() {
    return {
      projectName: JSON.parse(localStorage.getItem('appInfo')).projectName,
      fields: [],
      domainObject: {},
      editable: true,
      uploadUrl: '',
      cardListData: [],
      cardTotal: 1,
      handleCount: 0,
      status: true
    };
  },
  methods: {
    setOutputKeyEvent(outputKey,model){
      console.log('outputKey  model',outputKey,model);
      // this.$emit('setOutputKeyEvent',outputKey,model)
      this.dealWithOutputKey(outputKey, model);
      this.dealWithRates(outputKey, model);
    },
    // 业务逻辑： 4/30 by chen
    // 1.当选择 车牌号的时候，主驾收款人 首先  拿  此主驾 的 委托收款人，如果没有，就拿主驾
    dealWithOutputKey(outputKey,model){
      let self = this;
      if((outputKey.indexOf('transport')>=0 || outputKey.indexOf('driver')>=0) && model){
        let i = -1,arrStr = [];
        if(outputKey.indexOf('transport')>=0){
            arrStr =  outputKey.split('transport');
        }
        if(outputKey.indexOf('driver')>=0){
            arrStr =  outputKey.split('driver');
        }
        if(arrStr.length>1){
          i = arrStr[1] == '' ? 0 : parseInt(arrStr[1]);
        }
        if(i<0)return;

        let indexCard = -1;
        this.cardListData.forEach((item,index)=>{
          if(item.outputKeyIndex == i){
            indexCard = index;
          }
        })

        if(indexCard<0)return;

        let parm = {"userCode": model['platformDriverCode'] || model['userCode']}
          getDetailDirve(parm,(success,error)=>{
              if(success && success.content){
                setTimeout(()=>{
                  let item = self.cardListData[indexCard]['domainObject'];
                  const con = success.content;
                  item['payeeDriverFullName'] = con['authorizePayeeFullName'] || con['fullName'];
                  item['payeeDriverCode'] = con['authorizePayeeCode'] || con['code'];
                  item['payeePlatformDriverCode'] = con['authorizePayeePlatformCode'] || con['userCode'];
                  item['payeeDriverPhone'] = con['authorizePayeePhone'] || con['phone'];
                },1000)
              }
          })
      }
    },
    dealWithRates(outputKey, model) {
      return false;
    },
    syncMeterageType() {
      console.log('meterageType is', this.logisticsData.meterageType);
      if (this.refreshFields.length > 0) {
        this.cardListData.forEach((card, index) => {
          this.refreshFields.forEach((f) => {
            const refName = `eleForm${index}`,
              complexEl = this.$refs[refName].filter(item => item.field.fieldConfigCode == f),
              el = complexEl[0].$children[1].$children[0];
            console.log('el is', el);
            el.onRefresh({ codeUnitType: this.logisticsData.meterageType });
          });
        });
      }
    },
    hasValueChange() {
      this.$emit('hasValueChange');
    },
    addCard() {
      this.cardTotal += 1;
      this.handleCount += 1;
      console.log('卡片数为', this.cardTotal, '操作次数为', this.handleCount);
      if (this.cardTotal > 1) {
        const fs = JSON.parse(JSON.stringify(this.fields));
        fs.forEach((field) => {
          field.extraParams.forEach((f) => {
            if (f.inputKey) {
              const iks = f.inputKey.split(','),
                temp = [];
              iks.forEach((v) => {
                const tk = v.replace('.', `${this.handleCount}.`);
                temp.push(tk);
              });
              console.log('new iks is', temp);
              f.inputKey = temp.join(',');
            }
            if (f.outputKey) {
              f.outputKey += `${this.handleCount}`;
            }
          });
        });
        const obj = {
          fields: fs,
          domainObject: JSON.parse(JSON.stringify(this.domainObject)),
          listData: JSON.parse(JSON.stringify(this.listData)),
          outputKeyIndex:this.handleCount
        };
        this.cardListData.push(obj);
        this.$nextTick(() => {
          this.syncMeterageType();
        });
      }
    },
    removeCard(index) {
      this.handleCount += 1;
      if (this.cardTotal == 1) {
        this.$message({
          type: 'warning',
          message: '移除失败，请保留至少一条记录！',
          duration: 3000
        });
        return false;
      } else {
        this.$message({
          type: 'success',
          message: '移除成功！',
          duration: 3000
        });
        this.cardListData.splice(index, 1);
        this.cardTotal -= 1;
      }
    },
    copyCard(index) {
      this.status = false; // carListData 组件销毁重建
      this.cardTotal += 1;
      this.handleCount += 1;
      const objOrignal = Object.assign({}, this.cardListData[index]);
      const fs = JSON.parse(JSON.stringify(objOrignal.fields));
        fs.forEach((field) => {
          field.extraParams.forEach((f) => {
            if (f.inputKey) {
              const iks = f.inputKey.split(','),
                temp = [];
              iks.forEach((v) => {
                const tk = v.replace('.', `${this.handleCount}.`);
                temp.push(tk);
              });
              console.log('new iks is', temp);
              f.inputKey = temp.join(',');
            }
            if (f.outputKey) {
              f.outputKey += `${this.handleCount}`;
            }
          });
        });
        const obj = {
          fields: fs,
          domainObject: Object.assign({}, objOrignal.domainObject),
          listData: Object.assign({}, objOrignal.listData),
          outputKeyIndex:this.handleCount
        };
        this.cardListData.splice(index + 1, 0, obj);
        this.$nextTick(() => {
          this.status = true; // carListData 组件销毁重建
          this.$nextTick(() => {
            this.syncMeterageType();
          });
        });
        // this.cardListData.push(obj);
    },
    resolveDetail(data) {
      this.fields = data.field;
      const fs = [].concat(this.fields);
      fs.forEach((field) => {
        field.extraParams.forEach((property) => {
          if (property.default) {
            this.$set(this.domainObject, property.field, property.default);
          } else {
            if (property.field === 'description') {
              this.$set(this.domainObject, property.field, (this.logisticsData[property.field] || null));
            } else if (property.field === 'settleMethod') {

              this.$set(this.domainObject, property.field, (this.logisticsData.clientSettleMethod || null));

            } else if (property.field === 'driverPrice') {
              this.$set(this.domainObject, property.field, (this.logisticsData.driverReferPrice || null));
            } else if (property.field === 'driverPriceUnitCode') {
              this.$set(this.domainObject, property.field, (this.logisticsData.driverReferPriceUnitCode || null));
            } else {
              this.$set(this.domainObject, property.field, null);
            }
          }
        });
      });
      const obj = {
        fields: fs,
        domainObject: JSON.parse(JSON.stringify(this.domainObject)),
        listData: JSON.parse(JSON.stringify(this.listData)),
        outputKeyIndex:0
      };
      this.cardListData.push(obj);
      console.log('this in card is', this);
    },
    initForm() {
      const localStorage = window.localStorage,
        eleDefine = JSON.parse(localStorage.getItem('eleDefine')),
        eleInfo = JSON.parse(localStorage.getItem('eleInfo')),
        self = this;

      let detailJson = null;

      // 根据add.vue页面配置的configUrl，去匹配detail_render_info.json文件目录
      var ApiConst = require('../../../api/ApiConst');
      // 引入详情配置json文件
      var rq = require(`../../../api/fieldMetadata/${ApiConst.fieldMetadataDir}/${self.folder}/detail_render_info.json`);

      // 查看static 文件 是否存在
      let markExist = false;
      if (self.projectName && self.folder) {
        let path = `../../../static/projects/${self.projectName}/${self.folder}/detail_render_info.json`;
        markExist = util.checkFileExist(path);
      }

      // 如果配置了项目名称，则请求新的配置json文件
      if (self.projectName && self.folder && markExist) {
        const time = (new Date()).getTime(),
          detailPath = `../../../static/projects/${self.projectName}/${self.folder}/detail_render_info.json?t=${time}`;
        // 获取详情字段配置
        function detailConfig() {
          return axios({
            method: 'get',
            url: detailPath,
            headers: { 'Accept': 'application/json' }
          });
        }
        axios.all([detailConfig()])
          .then(axios.spread((detailConfig) => {
            detailJson = detailConfig;
            console.log('详情字段配置为', detailJson);
            // 解析详情字段
            const detailResultData = detailJson.data.content,
              detailParamData = util.getParam({ data: { content: detailResultData } }, eleDefine, eleInfo);
            console.log('解析到的详情字段配置为', detailParamData);
            this.resolveDetail(detailParamData);
          }));
      } else {
        // 没有配置，则默认读取标准配置json文件
        const detailResultData = rq.content,
          detailParamData = util.getParam({ data: { content: detailResultData } }, eleDefine, eleInfo);
          console.log('解析到的详情字段配置为', detailParamData);
          this.resolveDetail(detailParamData);
      }

    }
  },
  created() {
    this.initForm();
  },
  mounted() {
    setTimeout(() => {
      this.syncMeterageType();
    }, 500);
  }
};

</script>
<style lang="scss" rel="stylesheet/scss">
.ele-card-list {
  margin: 20px;
}
.ele-card-item {
  position: relative;
  border: solid 1px #ddd;
  margin-bottom: 20px;
}
.ec-hd {
  padding: 10px 40px 0;
  background-color: #f8f8f8;
  .sequence {
    position: absolute;
    top: 6px;
    left: 10px;
    width: 30px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    font-size: 16px;
    font-weight: bold;
    background-color: #ddd;
    border-radius: 100%;
  }
  .remove-btn {
    position: absolute;
    top: 10px;
    right: 10px;
  }
  .el-form-item__label {
    width: 106px;
  }
  .el-form > .el-field {
    display: inline-block;
    width: 50%;
  }
  .el-carrierOrgCode, .el-carrierOrgFull {
    width: 100% !important;
    .el-input {
      width: 298px !important;
    }
  }
  .el-description {
    position: absolute;
    width: auto !important;
    right: 115px;
    bottom: 3px;
    left: 0;
    .el-textarea__inner {
      width: 400px;
    }
  }
  .el-clientFreightPrice, .el-driverPrice, .el-truckQty, .el-settleMethod, .el-departDate, .el-returnDate {
    position: relative;
    padding: 10px 0 3px;
    margin-top: 3px;
    &::before {
      content: '';
      position: absolute;
      z-index: 0;
      top: 0;
      bottom: 0;
      background-color: #fff;
    }
  }
  .el-clientFreightPrice, .el-driverPrice, .el-departDate, .el-returnDate {
    &::before {
      left: -40px;
      right: 0;
    }
  }
  .el-truckQty, .el-settleMethod, .el-returnDate {
    &::before {
      left: 0;
      right: -40px;
    }
  }
  .el-driverPhone, .el-viceDriverPhone, .el-payeeDriverPhone, .el-payeeViceDriverPhone {
    position: absolute;
    width: 150px !important;
    left: 30%;
    .el-form-item__label {
      display: none;
    }
  }
  .el-viceDriverPhone, .el-payeeViceDriverPhone {
    left: auto;
    right: 10%;
  }
  .el-departDate, .el-returnDate {
    padding-top: 0;
    margin-top: 0;
  }
  .el-carrierOrgCode, .el-truckLicenseNo, .el-driverFullName, .el-truckQty, .el-settleMethod {
    .el-form-item__label::before {
      content: '*';
      position: absolute;
      left: 2px;
      color: #ff4949;
    }
    #miniSearch .el-form-item__label::before {
      display: none;
    }
  }
  .el-transparent {
    opacity: 0;
  }
}
.ec-ft {
  padding: 10px;
  text-align: right;
  border-top: dashed 1px #ddd;
}
</style>
