/**
* eleLogisticsPrice.vue
* Created by cc on 18/5/7.
*/
<template>
  <div class="section">
    <h2 class="tmp-title">
        运价信息
    </h2>
    <ul class="price-info el-row">
      <!-- 逻辑：先展示 订单里面的，如果没有的话 再用以后的操作 2018/6/4 -->
     <!--  <li class="el-col-6">外包运价：{{ showModel.clientFreightRate }}{{ showModel.clientFreightRateUnitName }}</li>
      <li class="el-col-18">运价备注：{{ showModel.ratesDescription }}</li> -->
        <li class="el-col-6">外包运价：{{ clientFreightRateCpt }}</li>
      <li class="el-col-18">运价备注：{{ ratesDescriptionCpt }}</li>
    </ul>
    <div class="priceColumn">
      <h3 class="price-tit">可用运价列表：</h3>
      <div class="price-opr" v-show="editable && (domainObject.logisticsStatus === 'ready' || domainObject.logisticsStatus === 'reject')">
        <el-button type="primary" v-check-permission="'logistics.addRate'" @click="handleAdd">添加运价</el-button>
      </div>
      <el-table :data="tableModel" style="width: 100%" border>
        <el-table-column label="操作/状态" width="200" align="center">
          <template scope="scope">
          <div v-if="domainObject.logisticsStatus === 'ready' || domainObject.logisticsStatus === 'reject'">
            <el-button @click="handleCancel(scope.$index)" v-show="!tableModel[scope.$index].isText && editable">取消</el-button>
            <el-button type="primary" @click="handleSave(scope.$index)" v-show="!tableModel[scope.$index].isText && editable">保存</el-button>
            <el-button class="el-button--line" v-check-permission="'logistics.selectRate'" @click="handleSelect(scope.$index)" v-show="tableModel[scope.$index].isText && editable && checkPermission('logistics.selectRate') " :disabled="tableModel[scope.$index].isSelect">
              {{ tableModel[scope.$index].isSelect ? '选中' : '选用' }}
            </el-button>
            <el-button @click="handleEdit(scope.$index)" v-show="false">编辑</el-button>
            <el-button @click="handleDelete(scope.$index)" v-check-permission="'logistics.deleteRate'" v-show="tableModel[scope.$index].isText && editable && checkPermission('logistics.selectRate')" :disabled="tableModel[scope.$index].isSelect">删除</el-button>
          </div>
          </template>
        </el-table-column>

        <el-table-column label="序号" width="50" align="center">
          <template scope="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="clientFreightRate" width="210" label="外包运价" align="center">
          <template scope="scope">
            <div class="block" v-show="!tableModel[scope.$index].isText">
              <el-input v-model="tableModel[scope.$index].clientFreightRate"></el-input>
              <el-select v-model="tableModel[scope.$index].clientFreightRateUnitCode" @change="handleSelectCarrierPrice(scope.row)">
                <el-option v-for="item in option1" :key="item.id" :label="item.value" :value="item.id">
                </el-option>
              </el-select>
            </div>
            <span v-show="tableModel[scope.$index].isText">{{ scope.row.clientFreightRate }}{{ scope.row.clientFreightRateUnitName }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="description" label="运价备注" align="center">
          <template scope="scope">
            <div class="block" v-show="!tableModel[scope.$index].isText">
              <el-input type="textarea" v-model="tableModel[scope.$index].description"></el-input>
            </div>
            <span v-show="tableModel[scope.$index].isText">{{ scope.row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="添加时间" align="center">
          <template scope="scope">
            <span v-show="tableModel[scope.$index].isText">{{ scope.row.updateTime }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
// import { dealInputKey } from '../../api/Utils';
import { add, deleted, edit, list } from '../../api/rateService';
import { rateBindLogistic, rateSelect, deleteLogisticRateRelation } from '../../api/OutsourcingLogisticsService';
import * as DataSourceService from '../../api/DataSourceService';
import '../components/vueDirectives';
import { checkPermission } from '../../api/Utils';


export default {
  name: 'eleLogisticsPrice',
  props: {
    priceData: Object,
    codeUnitType: String,
    domainObject: Object,
    rules: Array,
    code: '',
    ratesCodeList: null,
    ratesCode: ''
  },
  data() {
    return {
      checkPermission,
      editable: true,
      rateArray: [],
      tableModel: [],
      showModel: {
        clientFreightRate: '',
        clientFreightRateUnitCode: '',
        clientFreightRateUnitName:''
      },
      priceModel: {
        clientFreightPrice: '',
        clientFreightPriceUnitCode: ''
      },
      baseModel: {
        clientFreightRate: '',
        clientFreightRateUnitCode: '',
        description: '',
        updateTime: '',
        isText: false,
        isSelect: false
      },
      option1: [],
      selectRate: '',
      initBitmap: 0
    };
  },
  computed: {
    // 运价:
    clientFreightRateCpt(){
      if(this.domainObject.clientFreightPrice !=null && this.domainObject.clientFreightPrice !=undefined){
        const option = this.option1.find(item => item.id === this.domainObject.clientFreightPriceUnitCode);
        let val = '';
        if(option && option.value){
          val = option.value;
        };
        return `${this.domainObject.clientFreightPrice}${val}`;
        
      }else{
        // return this.showModel;
        return `${this.showModel.clientFreightRate}${this.showModel.clientFreightRateUnitName}`;
      }
    },
    //运价备注
    ratesDescriptionCpt(){
      if(this.domainObject.ratesDescription){
        return this.domainObject.ratesDescription;
      }else{
        return this.showModel.ratesDescription;
      }
    }
  },
  methods: {
    init() {},
    handleSelectCarrierPrice(row) {
      console.log('select carrier price', row, 'options', this.option1);
      const option = this.option1.find(item => item.id === row.clientFreightRateUnitCode);
      row.clientFreightRateUnitName = option.value;
    },
    initDone() {
      this.tableModel.forEach((row) => {
        this.handleSelectCarrierPrice(row);
      });
    },
    validateAll() {
      for (let i = 0; i < this.tableModel.length; i += 1) {
        if (!this.validate(this.tableModel[i])) {
          return false;
        }
      }
      return true;
    },
    validate(row) {
      let option = this.option1.find(item => item.id === row.clientFreightRateUnitCode);
      if (!option || option.data.codeUnitType !== this.codeUnitType) {
        this.showError('外包运价单位与计量标准不一致！');
        return false;
      }
      return true;
    },
    showError(text) {
      this.$message({
        type: 'error',
        showClose: true,
        message: text,
        duration: 5000
      });
      return false;
    },
    changeToText(index) {
      this.tableModel[index].isText = true;
      this.tableModel.splice(index, 1, this.tableModel[index]);
    },
    handleCancel(index) {
      if (this.rateArray[index]) {
        this.changeToText(index);
      } else {
        this.tableModel.splice(index, 1);
      }
    },
    handleSave(index) {
      if (this.validate(this.tableModel[index])) {
        if (this.rateArray[index]) {
          edit(this.rateArray[index], this.tableModel[index], (success, error) => {
            if (error || success.code !== 200) {
              this.showError(error.content);
            }
            if (success) {
              this.changeToText(index);
              const model = this.tableModel[index];
              if (this.rateArray[index] === this.selectRate) {
                Object.keys(model).forEach((key) => {
                  this.showModel[key] = model[key];
                });
              }
            }
          });
        } else {
          add(this.tableModel[index], (success, error) => {
            if (error || success.code !== 200) {
              this.showError(error.content);
            }
            if (success) {
              const rateCode = success.content.code;
              if (this.code) {
                const params = {
                  code: this.code,
                  ratesCode: rateCode
                };
                rateBindLogistic(params, (res, error2) => {
                  if (error2 || res.code !== 200) {
                    this.showError(error2.content);
                  }
                  if (res) {
                    this.rateArray[index] = rateCode;
                    this.tableModel[index].updateTime = res.content.updateTime;
                    this.changeToText(index);
                  }
                });
              } else {
                this.rateArray[index] = success.content.code;
                this.tableModel[index].updateTime = success.content.updateTime;
                this.changeToText(index);
              }
            }
          });
        }
      }
    },
    selectCb(index) {
      this.tableModel.forEach((val) => {
        val.isSelect = false;
      });
      const model = this.tableModel[index];
      model.isSelect = true;
      this.selectRate = this.rateArray[index];
      Object.keys(model).forEach((key) => {
        this.showModel[key] = model[key];
      });
      this.$emit('change', model);
    },
    handleSelect(index) {
      if (this.code) {
        if (this.validate(this.tableModel[index])) {
          const model = this.tableModel[index],
            params = {
              code: this.code,
              ratesCode: this.rateArray[index],
              clientFreightPrice: model.clientFreightRate,
              clientFreightPriceUnitCode: model.clientFreightRateUnitCode,
              ratesDescription: model.description
            };
          rateSelect(params, (success, error) => {
            if (error || success.code !== 200) {
              this.showError(error.content);
            }
            if (success) {
              this.selectCb(index);
            }
          });
        }
      } else {
        this.selectCb(index);
      }
    },
    handleEdit(index) {
      this.tableModel[index].isText = false;
      this.tableModel.splice(index, 1, this.tableModel[index]);
    },
    handleDelete(index) {
      const code = this.rateArray[index],
        params = {
          code
        };
      deleted(params, (success, error) => {
        if (error || success.code !== 200) {
          this.showError(error.content);
        }
        if (success) {
          const rateCode = success.content.code;
          if (this.code) {
            const paramsObj = {
              code: this.code,
              ratesCode: rateCode
            };
            deleteLogisticRateRelation(paramsObj, (res, error2) => {
              if (error2 || res.code !== 200) {
                this.showError(error2.content);
              }
              if (res) {
                if (this.tableModel[index].isSelect) {
                  this.selectRate = null;
                  this.showModel = {};
                }
                this.rateArray.splice(index, 1);
                this.tableModel.splice(index, 1);
              }
            });
          }
        }
      });
    },
    handleAdd() {
      const baseTpl = {};
      Object.keys(this.baseModel).forEach((key) => {
        baseTpl[key] = this.baseModel[key];
      });
      this.tableModel.push(baseTpl);
    },
    getRateData() {
      if (this.code) {
        const params = {
          logisticsCode: this.code,
          page: 1,
          size: 100
        };
        list(params, (success, error) => {
          if (error || success.code !== 200) {
            this.showError(error.content);
          }
          if (success) {
            success.content.forEach((val) => {
              const baseTpl = {};
              Object.keys(this.baseModel).forEach((key) => {
                baseTpl[key] = val[key] || this.baseModel[key];
              });
              this.rateArray.push(val.code);
              baseTpl.isText = true;
              // 如果当前运价选中
              if (val.code === this.ratesCode) {
                baseTpl.isSelect = true;
                this.selectRate = val.code;
                // 运价显示区域
                this.showModel.clientFreightRate = val.clientFreightRate;
                this.showModel.clientFreightRateUnitCode = val.clientFreightRateUnitCode;
                this.showModel.clientFreightRateUnitName = val.clientFreightRateUnitName;
                this.showModel.description = val.description;
              }
              this.tableModel.push(baseTpl);
              this.initDone();
            });
          }
        });
      }
    },
    loadData(dataSource, type, cb) {
      DataSourceService.getAll(dataSource.split(','), { codeUnitType: type }, (success, error) => {
        if (error) {
          console.error('load', dataSource, ' failed', error);
        } else {
          cb(success);
        }
      });
    }
  },
  watch: {
    'ratesCode': function(newVal, oldVal) {
      if (newVal) {
        this.getRateData();
      }
    },
    codeUnitType(val) {
      console.log('codeUnitType ===',val);
      this.loadData('carrierPrice', val, (options) => { this.option1 = options; });
      // 切换 计量标准 后面的数据清空
      this.tableModel.forEach(function (item) {
        if (!item.isText) {
          item.clientFreightRateUnitCode = '';
        }
      })
    }
  },
  created() {
    this.loadData('carrierPrice', this.unitCodeType, (options) => {
      this.option1 = options;
      // this.initDone();
    });
  }
};
</script>

<style lang="scss" rel="stylesheet/scss">
.price-info {
  margin: 20px;
  font-size: 13px;
  background-color: #fffbe8;
  border: solid 1px #eae5ce;
}
.priceColumn {
  margin: 20px;
  padding: 20px;
  border: solid 1px #ddd;
  .price-tit {
    font-weight: 700;
    margin-bottom: 10px;
  }
  .price-opr {
    margin-bottom: 10px;
  }
  .el-table .cell {
    padding-left: 5px;
    padding-right: 5px;
    .el-input {
      width: 100px;
    }
    .el-select {
      width: 80px;
      .el-input {
        width: 80px;
      }
    }
  }
}
</style>
