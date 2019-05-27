/** 
* dispatch.vue 
* 派车
* Created by cc on 19/01/22. 
*/
<template>
  <div class="form-page" id='page_subContract' v-loading.fullscreen.lock="fullscreenLoading">
    <div class="page-header clearfix">
      <h2 class="page-title fl">
        派车
      </h2>
      <span id="pageRefresh" class="page-refresh fr"><i class="ico-refresh"></i>刷新</span>
    </div>
    <!-- 货物信息 -->
    <div class="section">
      <h3 class="sec-tit">货物信息</h3>
      <div class="cargo-info light-bg">
        <div class="ci-hd">
          <ul class="fm-list">
            <li>
              <span class="fm-tit">
                来源订单：
              </span>
              <span class="fm-cont">
                {{ logisticsData.logisticsNo }}
              </span>
            </li>
            <li>
              <span class="fm-tit">
                线路名称：
              </span>
              <span class="fm-cont">
                {{ logisticsData.routeName }}
              </span>
            </li>
          </ul>
          <span class="page-refresh" title="刷新货物信息" @click="refreshData"><i class="ico-refresh"></i></span>
        </div>
        <div class="ci-md">
          <ul class="fm-list">
            <li v-if="checkPms()">
              <span class="fm-tit">
                客户运价：
              </span>
              <span class="fm-cont">
                {{ logisticsData.clientFreightPrice }} {{ clientFreightPriceUnitText }}
              </span>
            </li>
            <li>
              <span class="fm-tit">
                需求车次：
              </span>
              <span class="fm-cont">
                {{ logisticsData.truckQty }}车
              </span>
            </li>
            <li>
              <span class="fm-tit">
                剩余分配车次：
              </span>
              <span class="fm-cont">
                <strong class="org">{{ logisticsData.remainTruckQty }}车次</strong>
              </span>
            </li>
          </ul>
        </div>
        <!-- 货物表格 -->
        <div class="ci-ft">
          <ele-manifest-list ref="eleManifest" :getColumn="getListColumn" :folder="folder" :listData="listData" :editable="false" :selectable="false" :showButtons="false"></ele-manifest-list>
        </div>
      </div>
    </div>
    <!-- 参考信息 -->
    <div class="section">
      <h3 class="sec-tit">原订单参考信息</h3>
      <div class="reference-info highlight-bg">
        <ul class="fm-list">
          <li>
            <span class="fm-tit">
              计划开始时间：
            </span>
            <span class="fm-cont">
              {{ logisticsData.logisticsPlanStartTime }}
            </span>
          </li>
          <li>
            <span class="fm-tit">
              计划结束时间：
            </span>
            <span class="fm-cont">
              {{ logisticsData.logisticsPlanEndTime }}
            </span>
          </li>
        </ul>
      </div>
    </div>
    <!-- 车辆司机分配 -->
    <div class="section">
      <h3 class="sec-tit">车辆司机分配</h3>
      <!-- <ele-form> -->
      <ele-card-list ref="eleCardList" :refreshFields="refreshFields" :folder="folder" :listEditfolder="listEditfolder" :getListEditColumn="getListEditColumn" :editableFields="editableFields" :listData="listData" :selectable="false" @hasValueChange="hasValueChange" :logisticsData="logisticsData" v-if="showCard"></ele-card-list>
    <!-- </ele-form> -->
    </div>
    <!-- submit -->
    <div class="form-button">
      <el-button type="primary" @click="submitForm" size="large" :disabled="btnDisabled">提交</el-button>
    </div>
    <!-- TAB -->
    <div class="tab-section">
      <el-tabs type="border-card">
        <el-tab-pane label="来源订单信息">
          <iframe :src="logisticsDetailSrc" allowtransparency="true" frameborder="0" class="page-iframe" scrolling="no"></iframe>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- progress -->
    <ele-progress-dialog ref="progressDialog" :percentage="progressBar.percentage" :msg="progressBar.msg" :title="progressBar.title" :onClose="onProgressClose"></ele-progress-dialog>
  </div>
</template>

<script type="text/javascript-6">
import eleManifestList from '../components/ele-manifest-list/eleManifestList.vue';
import eleCardList from '../components/ele-card-list/eleCardList.vue';
import progress from '../components/eleProgressDialog.vue';

import { getParamsFromURL, checkPermission, dateFormat } from '../../api/Utils';

// 引入tab跳转
require('../public.js');

import { getListColumn, getListEditColumn } from '../../api/DispatchService';
import { get, getResidueNum, manifestRemainder, getManifestList } from '../../api/LogisticsService';

import { dispatch } from '../../api/waybillService';
import eleForm from '../components/ele-form/eleForm.vue';

export default {
  name: 'dispatch',
  components: {
    'ele-form': eleForm,
    'ele-manifest-list': eleManifestList,
    'ele-card-list': eleCardList,
    'ele-progress-dialog': progress
  },
  props: {
  },
  data() {
    return {
      theme: JSON.parse(localStorage.getItem('appInfo')).projectName,
      code: getParamsFromURL(window.location.search).code,
      logisticsData: {},
      getListColumn,
      getListEditColumn,
      folder: 'logistics/dispatch',
      listEditfolder: 'logistics/dispatch/card',
      editableFields: ['assignGoodsNum', 'assignGoodsWeight', 'assignGoodsVolume'],
      refreshFields: ['driverPrice'],
      listData: [],
      btnDisabled: false,
      fullscreenLoading: false,
      showCard: false,
      remainderData: [{
        'code': '111',
        'remainderGoodsNum': 666,
        'remainderGoodsWeight': 777,
        'remainderGoodsVolume': 888
      },{
        'code': '222',
        'remainderGoodsNum': 555,
        'remainderGoodsWeight': 444,
        'remainderGoodsVolume': 333
      },{
        'code': '333',
        'remainderGoodsNum': 222,
        'remainderGoodsWeight': 111,
        'remainderGoodsVolume': 555
      },{
        'code': '444',
        'remainderGoodsNum': 999,
        'remainderGoodsWeight': 555,
        'remainderGoodsVolume': 666
      }],
      progressBar:{
        title: "正在处理",
        percentage: 0,
        msg: ''
      },
      totalCount: 0,
      finishCount: 0,
      successCount: 0,
      errorCount: 0
    }
  },
  computed: {
    logisticsDetailSrc() {
      return `/logistics/add.html?code=${this.code}&editable=false&showInTab=true`;
    },
    clientFreightPriceUnitText() {
      return this.getUnitText(this.logisticsData.clientFreightPriceUnitCode);
    }
  },
  methods: {
    checkPms() {
      let result = checkPermission('client.price.show');
      return result;
    },
    onProgressClose(){
      console.log('close progress dialog now');
      window.location.reload();
    },
    refreshData() {
      console.log('refresh data now.');
      this.getLogisticsInfo();
      this.getRemainderData();
    },
    hasValueChange() {
      console.log('manifest data changed, its time to recaculate listdata now.');
    },
    getUnitText(val) {
      switch(val) {
        // 单位
        case 'ton':
        return '吨';
        case 'cube':
        return '方';
        case 'item':
        return '件';
        case 'truck':
        return '车';
        // 单位
        case 'yuanperton':
        return '元/吨';
        case 'yuanpercube':
        return '元/方';
        case 'yuanperitem':
        return '元/件';
        case 'yuanpertruck':
        return '元/车';
        default:
        return '';
      }
    },
    getLogisticsInfo() {
      if (this.code) {
        const paramsObj = {
          code: this.code
        };
        // 获取订单信息
        get(paramsObj, (success, error) => {
          if (error || success.code !== 200) {
            this.$message({
              type: 'error',
              message: error.content,
              duration: 3000
            });
            return false;
          }
          if (success) {
            const data = success.content;
            this.logisticsData = data;
            this.getLogisticsResidueNum();
            console.log('logistics data is', data);
          }
        });

      }
    },
    getLogisticsResidueNum() {
      if (this.code) {
        // 获取订单信息
        getResidueNum(this.code, (success, error) => {
          if (error || success.code !== 200) {
            this.$message({
              type: 'error',
              message: error.content,
              duration: 3000
            });
            return false;
          }
          if (success) {
            const data = success.content;
            this.$set(this.logisticsData, 'remainTruckQty', data.remainTruckQty);
            console.log('getLogisticsResidueNum data is', data);
          }
        });

      }

    },
    getRemainderData() {
      if (this.code) {
        const paramsObj = {
          code: this.code
        };
        // 获取货单剩余信息
        manifestRemainder(paramsObj, (success, error) => {
          if (error || success.code !== 200) {
            this.$message({
              type: 'error',
              message: error.content,
              duration: 3000
            });
            return false;
          }
          if (success) {
            const data = success.content;
            this.remainderData = data;
            this.getManifestList();
            console.log('manifestRemainder data is', data);
          }
        });

      }
    },
    getManifestList() {
      if (this.code) {
        const paramsObj = {
          code: this.code
        };
        // 获取货单信息
        getManifestList(paramsObj, (success, error) => {
          if (error || success.code !== 200) {
            this.$message({
              type: 'error',
              message: error.content,
              duration: 3000
            });
            return false;
          }
          if (success) {
            const data = success.content;
            data.forEach((val) => {
              //待分配数量、重量、体积
              const match = this.remainderData.filter(item => item.code === val.code);
              console.log('匹配到的数据为', match);
              val.tobeAssignedGoodsNum = match[0].remainderGoodsNum; // 剩余货物数量
              val.tobeAssignedGoodsWeight = match[0].remainderGoodsWeight; // 剩余货物重量
              val.tobeAssignedGoodsVolume = match[0].remainderGoodsVolume; // 剩余货物体积
              val.tobeAssignedGoodsNumUnitCode = match[0].remainderGoodsNumUnitCode; // 剩余货物数量
              val.tobeAssignedGoodsWeightUnitCode = match[0].remainderGoodsWeightUnitCode; // 剩余货物重量
              val.tobeAssignedGoodsVolumeUnitCode = match[0].remainderGoodsVolumeUnitCode; // 剩余货物体积
              val.assignGoodsNum = null;
              val.assignGoodsWeight = null;
              val.assignGoodsVolume = null;
              val.assignGoodsNumUnitCode = match[0].remainderGoodsNumUnitCode || 'item'; 
              val.assignGoodsWeightUnitCode = match[0].remainderGoodsWeightUnitCode || 'ton';
              val.assignGoodsVolumeUnitCode = match[0].remainderGoodsVolumeUnitCode || 'cube';
            });
            this.listData = data;
            console.log('manifest list data is', data);
            
            this.showCard = true;
          }
        });

      }
    },
    getFields() {
      let obj = {};
      const ignoreKeys = ['code', 'id', 'disabled', 'deleted', 'remark', 'moduleCode', 'creatorUserCode', 'creatorUsername', 'createTime', 'updateUserCode', 'updateUsername', 'updateTime', 'ip', 'ownerUserCode', 'ownerOrgCode', 'ownerOrgName', 'synchronousId'];
      Object.keys(this.logisticsData).forEach((key) => {
        if (!ignoreKeys.includes(key)) {
          obj[key] = this.logisticsData[key] || null;
        }
      });
      // 来源订单code
      obj.logisticsCode = this.logisticsData.code;
      // 运单状态 执行中
      obj.waybillStatus = 'unloading';
      // 调车模式
      obj.scheduleType = 'self';
      // 运单特殊字段处理
      obj.reportBusinessTypeCode = obj.businessTypeCode; // 业务类型
      obj.loadingAddr = obj.loadingAddress; //发货详细地址
      obj.unloadingAddr = obj.unloadingAddress; //收货详细地址
      obj.reportCargoTypeClassificationCode = obj.cargoTypeClassificationCode; //国标货物类型
      // 托运客户为当前登录客户
      // const orgInfo = JSON.parse(localStorage.getItem('orgInfo')).content;
      // obj.clientOrgName = orgInfo.orgFullName;
      // obj.clientOrgCode = orgInfo.code;
      // obj.platformClientOrgCode = orgInfo.code;
      return obj;
    },
    createWaybill() {
      // this.fullscreenLoading = true;
      // this.btnDisabled = true;
      const cardListData = this.$refs.eleCardList.cardListData,
        self = this;
      let basicWaybillObj = this.getFields();
      console.log('card list data is', cardListData);
      for (let i = 0; i < cardListData.length; i++) {
        const refName = `eleManifest${i}`,
          ele = this.$refs['eleCardList'].$refs[refName],
          cacFields = ele[0].$refs['pageSubtotal'].cacFields;
        console.log('get cacFields', cacFields);
        cacFields.forEach((item) => {
          if (item.field === 'assignGoodsNum') {
            basicWaybillObj.goodsNum = item.total;
          }
          if (item.field === 'assignGoodsWeight') {
            basicWaybillObj.goodsWeight = item.total;
          }
          if (item.field === 'assignGoodsVolume') {
            basicWaybillObj.goodsVolume = item.total;
          }
        });
        const setKeys = ['carrierOrgName', 'carrierOrgCode', 'platformCarrierOrgCode', 'truckLicenseNo', 'truckCode', 'platformTruckCode', 'trailerTruckLicenseNo', 'trailerTruckCode', 'platformTrailerTruckCode', 'driverFullName', 'driverCode', 'platformDriverCode', 'driverPhone', 'driverIdentityNumber', 'payeeDriverFullName', 'payeeDriverCode', 'payeePlatformDriverCode', 'payeeDriverPhone', 'driverPayeeBankName', 'driverPayeeBankAccountName', 'driverPayeeBankAccountNo', 'driverLicenseNo', 'driverFuelCardNo', 'viceDriverFullName', 'viceDriverCode', 'platformViceDriverCode', 'viceDriverPhone', 'payeeViceDriverFullName', 'payeeViceDriverCode', 'payeePlatformViceDriverCode', 'payeeViceDriverPhone', 'driverPrice', 'driverPriceUnitCode', 'settleMethod', 'departDate', 'returnDate', 'description'];
        setKeys.forEach((val) => {
          if (val === 'departDate' || val === 'returnDate') {
            // 时间参数需要提前转换成yyyy-MM-dd HH:mm:ss
            this.$set(basicWaybillObj, val, dateFormat(cardListData[i].domainObject[val]));
          } else {
            this.$set(basicWaybillObj, val, cardListData[i].domainObject[val]);
          }
        });
        // 车牌号
        // basicWaybillObj.truckLicenseNo = cardListData[i].domainObject.truckLicenseNo;
        // basicWaybillObj.truckCode = cardListData[i].domainObject.truckCode;
        // basicWaybillObj.platformTruckCode = cardListData[i].domainObject.platformTruckCode;
        // 挂车牌号
        // basicWaybillObj.trailerTruckLicenseNo = cardListData[i].domainObject.trailerTruckLicenseNo;
        // basicWaybillObj.trailerTruckCode = cardListData[i].domainObject.trailerTruckCode;
        // basicWaybillObj.platformTrailerTruckCode = cardListData[i].domainObject.platformTrailerTruckCode;
        // 主驾信息
        // basicWaybillObj.driverFullName = cardListData[i].domainObject.driverFullName; // 主驾姓名
        // basicWaybillObj.driverCode = cardListData[i].domainObject.driverCode;
        // basicWaybillObj.platformDriverCode = cardListData[i].domainObject.platformDriverCode;
        // basicWaybillObj.driverPhone = cardListData[i].domainObject.driverPhone; // 主驾手机号
        // basicWaybillObj.driverIdentityNumber = cardListData[i].domainObject.driverIdentityNumber; // 主驾身份证号
        // basicWaybillObj.payeeDriverFullName = cardListData[i].domainObject.payeeDriverFullName; // 主驾收款人
        // basicWaybillObj.payeeDriverCode = cardListData[i].domainObject.payeeDriverCode;
        // basicWaybillObj.payeePlatformDriverCode = cardListData[i].domainObject.payeePlatformDriverCode;
        // basicWaybillObj.payeeDriverPhone = cardListData[i].domainObject.payeeDriverPhone; // 主驾收款人电话
        // 副驾信息
        // basicWaybillObj.viceDriverFullName = cardListData[i].domainObject.viceDriverFullName; // 副驾姓名
        // basicWaybillObj.viceDriverCode = cardListData[i].domainObject.viceDriverCode;
        // basicWaybillObj.platformViceDriverCode = cardListData[i].domainObject.platformViceDriverCode;
        // basicWaybillObj.viceDriverPhone = cardListData[i].domainObject.viceDriverPhone; // 副驾手机号
        // basicWaybillObj.payeeViceDriverFullName = cardListData[i].domainObject.payeeViceDriverFullName; // 副驾收款人
        // basicWaybillObj.payeeViceDriverCode = cardListData[i].domainObject.payeeViceDriverCode;
        // basicWaybillObj.payeePlatformViceDriverCode = cardListData[i].domainObject.payeePlatformViceDriverCode;
        // basicWaybillObj.payeeViceDriverPhone = cardListData[i].domainObject.payeeViceDriverPhone; // 副驾收款人电话
        // 司机运价
        // basicWaybillObj.driverPrice = cardListData[i].domainObject.driverPrice;
        // basicWaybillObj.driverPriceUnitCode = cardListData[i].domainObject.driverPriceUnitCode;
        // 计划发货时间收货时间
        // basicWaybillObj.departDate = dateFormat(cardListData[i].domainObject.departDate); // 时间需要格式化
        // basicWaybillObj.returnDate = dateFormat(cardListData[i].domainObject.returnDate);
        console.log('basicWaybillObj is ', basicWaybillObj);
        // 货单信息获取
        const manifestObj = this.getManifestObj(cardListData[i].listData);
        // 分配车次，为创建运单数量
        if (cardListData[i].domainObject.truckQty > 0) {
          for (let j = 0; j < cardListData[i].domainObject.truckQty; j ++) {
            // 订单派车新接口及参数
            const newParamsObj = {
                waybill: JSON.stringify(basicWaybillObj),
                manifest: JSON.stringify(manifestObj),
              };
            dispatch(newParamsObj, (success, error) => {
              self.finishCount += 1;
              if (error || success.code !== 200) {
                self.errorCount += 1;
                this.$message({
                  type: 'error',
                  message: error.content,
                  duration: 3000
                });
                return false;
              }
              if (success && success.content && success.content.code) {
                self.successCount += 1;
              }
              let progress = Math.floor((self.finishCount * 1.0) / (self.totalCount * 1.0) * 100);
              console.log('progress is', progress);
              this.progressBar.percentage = progress;
              this.progressBar.msg = `正在派车 ${self.finishCount}/${self.totalCount}`;
              if (self.finishCount == self.totalCount) {
              this.progressBar.title = '派车完成';
                this.progressBar.msg = `派车成功${self.successCount}次，派车失败${self.errorCount}次`;
              }
            });
          }
        }
      }
    },
    getManifestObj(listData) {
      const obj = {},
        ignoreKeys = ['id', 'disabled', 'deleted', 'remark', 'moduleCode', 'creatorUserCode', 'creatorUsername', 'createTime', 'updateUserCode', 'updateUsername', 'updateTime', 'ip', 'ownerUserCode', 'ownerOrgCode', 'ownerOrgName', 'synchronousId', 'assignGoodsNum', 'assignGoodsWeight', 'assignGoodsVolume', 'tobeAssignedGoodsNum', 'tobeAssignedGoodsWeight', 'tobeAssignedGoodsVolume', 'assignGoodsNumUnitCode', 'assignGoodsVolumeUnitCode', 'assignGoodsWeightUnitCode', 'tobeAssignedGoodsNumUnitCode', 'tobeAssignedGoodsVolumeUnitCode', 'tobeAssignedGoodsWeightUnitCode'],
        tempListData = JSON.parse(JSON.stringify(listData));
      tempListData.forEach((list, i) => {
        this.$set(list, 'resourceManifestCode', listData[i].code);
        this.$set(list, 'goodsNum', listData[i].assignGoodsNum);
        this.$set(list, 'goodsWeight', listData[i].assignGoodsWeight);
        this.$set(list, 'goodsVolume', listData[i].assignGoodsVolume);
        Object.keys(list).forEach((key) => {
          if (!ignoreKeys.includes(key)) {
            if (key in obj) {
              obj[key] += '@@' + list[key];
            } else {
              obj[key] = list[key];
            }
          }
        });
      });
      console.log('manifest ojb is', obj);
      return obj;
    },
    checkData() {
      this.totalCount = 0;
      let result = true;
      const cardListData = this.$refs.eleCardList.cardListData,
        total = cardListData.length,
        time1 = new Date(Date.parse(this.logisticsData.logisticsPlanStartTime)),
        time2 = new Date(Date.parse(this.logisticsData.logisticsPlanEndTime));
      console.log('订单的计划开始时间为', time1, '订单的计划结束时间为', time2);
      for (let i = 0; i < total; i++) {
        const obj = cardListData[i].domainObject,
          listData = cardListData[i].listData;
        // 计划发货收货时间校验
        if (obj.departDate || obj.returnDate) {
          const t1 = obj.departDate ? new Date(Date.parse(obj.departDate)) : '',
            t2 = obj.returnDate ? new Date(Date.parse(obj.returnDate)) : '';
          if (t1 && (t1 < time1 || t1 > time2)) {
            this.$message({
              type: 'warning',
              message: `请确认第${i + 1}项中，计划发货时间在订单的计划开始时间和计划结束时间范围内！`,
              duration: 3000
            });
            return false;
          }
          if (t2 && (t2 > time2 || t2 < time1)) {
            this.$message({
              type: 'warning',
              message: `请确认第${i + 1}项中，计划收货时间在订单的计划开始时间和计划结束时间范围内！`,
              duration: 3000
            });
            return false;
          }
          if (t1 && t2 && (t1 >= t2)) {
            this.$message({
              type: 'warning',
              message: `请确认第${i + 1}项中，计划发货时间不能大于或等于计划收货时间！`,
              duration: 3000
            });
            return false;
          }
        }
        // 车牌号，主驾，分配车次校验
        if (!obj.truckLicenseNo || !obj.driverFullName || !obj.settleMethod) {
          this.$message({
            type: 'warning',
            message: `请确认第${i + 1}项中，车牌号、主驾、司机结算方式均已填写完整！`,
            duration: 3000
          });
          return false;
        } else {
          // 运价校验
          if ((obj.driverPrice && !obj.driverPriceUnitCode) || (!obj.driverPrice && obj.driverPriceUnitCode)) {
            this.$message({
              type: 'warning',
              message: `第${i + 1}项中，司机运价及单位未填写完整！`,
              duration: 3000
            });
            return false;
          }
          this.totalCount += Number(obj.truckQty);
          for (let j = 0; j < listData.length; j++) {
            // 如果有计划数量
            if (listData[j].goodsNum) {
              // 如果预装数量未填写
              if (!listData[j].assignGoodsNum) {
                const name = listData[j].goodsName,
                  number = listData[j].goodsNum;
                this.$message({
                  type: 'warning',
                  message: `第${i + 1}项中，${name}的计划数量为${number}件，请填写${name}的预装数量！`,
                  duration: 3000
                });
                return false;
              } else {
                result = true;
              }
            }
            // 如果有计划重量
            if (listData[j].goodsWeight) {
              // 如果预装重量未填写
              if (!listData[j].assignGoodsWeight) {
                const name = listData[j].goodsName,
                  number = listData[j].goodsWeight;
                this.$message({
                  type: 'warning',
                  message: `第${i + 1}项中，${name}的计划重量为${number}吨，请填写${name}的预装重量！`,
                  duration: 3000
                });
                return false;
              } else {
                result = true;
              }
            }
            // 如果有计划体积
            if (listData[j].goodsVolume) {
              // 如果预装体积未填写
              if (!listData[j].assignGoodsVolume) {
                const name = listData[j].goodsName,
                  number = listData[j].goodsVolume;
                this.$message({
                  type: 'warning',
                  message: `第${i + 1}项中，${name}的计划体积为${number}方，请填写${name}的预装体积！`,
                  duration: 3000
                });
                return false;
              } else {
                result = true;
              }
            }
          }
        }
      }
      return result;
    },
    submitForm() {
      console.log('this is', this);
      if (this.checkData()) {
        this.$refs.progressDialog.show();
        this.createWaybill();
      } else {
        console.log('valid failed please check the form and make sure that all the required fields were filled correctly');
        return false;
      }
    }
  },
  created() {
      document.querySelector('body').classList.add('theme-blue');
    this.getLogisticsInfo();
    this.getRemainderData();
    
  },
  mounted() {
  }
};
</script>

<style lang="scss" rel="stylesheet/scss">
@import "../assets/sass/base.scss";
#page_subContract .fix-table-wrap {
  height: auto !important;
}
.sec-tit {
  padding-left: 20px;
  font-size: 14px;
  font-weight: 700;
}
.cargo-info, .reference-info {
  margin: 20px;
  .ci-hd {
    position: relative;
    padding: 10px 50px;
    border-bottom: solid 1px #ddd;
    li {
      width: 50%;
      font-weight: 700;
    }
    .page-refresh {
      position: absolute;
      top: 10px;
      right: 10px;
    }
  }
  .fm-list {
    font-size: 0;
    li {
      display: inline-block;
      font-size: 14px;
      line-height: 24px;
    }
  }
  .ci-md {
    padding: 10px 50px;
    li {
      width: 33.3333%;
    }
  }
}
.reference-info {
  padding: 0 40px 10px;
  li {
    width: 50%;
    .fm-tit {
      padding-left: 10px;
    }
  }
}
.sepline {
  padding-bottom: 8px;
  margin-bottom: 15px;
  border-bottom: solid 1px #ddd;
}
.light-bg {
  background-color: #f8f8f8;
}
.highlight-bg {
  padding-top: 10px;
  background-color: #fff5c0;
  margin-bottom: 15px;
}
.tab-section {
  .el-tabs__content {
    overflow: hidden;
  }
  .page-iframe {
    width: 100%;
    height: 100%;
    min-height: 1000px;
  }
}
</style>