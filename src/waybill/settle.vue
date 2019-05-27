/**
* add.vue 单车结算 页面
* Created by cc on 18/5/25.
*/
<template>
  <div>
    <div class="form-page">
      <ele-form :domainObject="domainObject" ref="form"
                :configUrl="configUrl" :listUrl="listUrl" :listTitle="listTitle"
                :getInfo="getInfo" :addFun="addFun" :editFun="editFun"
                :editable="editable" :isEdit="isEdit"
                @formReady="formReady" @formMounted="formMounted" @editSuccess="editSuccess" @submitDone="submitDone"
                :objectName="objectName"
                label-width="100px" :inline="false" :folder="folder">
        <settle-layout :isEdit="isEdit" :editable="editable" :objectName="objectName" :clientDetailColumns="clientDetailColumns">
          <div v-for="field in fields" :slot="field.fieldConfigCode">
            <el-form-item :label="field.showName" :required="field.required ==='true'">
              <ele-block :field="field" :domainObject="domainObject" :editable="editable"
                         :uploadUrl="uploadUrl" :inputKey="inputKey"></ele-block>
            </el-form-item>
          </div>

          <!-- <el-button v-show="!editable && isEdit" type="primary" @click="editForm()" slot="buttonEdit">编辑</el-button>
          <el-button v-show="editable && isEdit" @click="cancelEdit()" slot="buttonCancel">取消编辑</el-button>
          <el-button v-show="editable && isEdit" @click="submitForm()" slot="buttonSave">保存</el-button>
          <el-button v-show="editable && !isEdit" type="primary" @click="submitForm()" size="large" slot="buttonSubmit" :disabled="btnDisabled">提交</el-button>
          <el-button v-show="editable && !isEdit" @click="resetForm()" size="large" slot="buttonReset" :disabled="btnDisabled">重置</el-button> -->

          <waybill-match v-show="editable && !isEdit" @loadWaybill="loadWaybill" slot="waybillMatch"></waybill-match>

          <show-image ref="showImage" slot="showImage" @delImg="delImg" :imageUrl="imageUrl"></show-image>

          <!-- <charge-list ref="chargeList" :uploadUrl="uploadUrl" @caculate="getCalRealTime"
                       :domainObject="domainObject"
                       :waybillCode="code"
                       v-if="status"
                       :showBtn="showBtn"
                       :editable="editable"
                       slot="slotChargeList">
          </charge-list> -->

          <!-- 费用科目 start -->
          <div slot="slotChargeList">
            <eleChargeItem ref="eleChargeItem" :isEdit='isEdit' :editable='editable' :defaultEdit="false" :uploadUrl="uploadUrl" :getColumn="getColumnChargeItem" :listData="listDataChargeItem" @queryChargeItem="queryChargeItem" @submitChargeRecord="submitChargeRecord" @cancelChargeSubmit="cancelChargeSubmit" @chargeAction="handleChargeAction" @chargeItemSingleListValueChange="chargeItemSingleListValueChange" :domainObject="domainObject"></eleChargeItem>
          </div>
          <!-- 费用科目 end -->

          <!-- 货单表格 start -->
          <div slot='manifestModule'>
            <eleManifestList ref='eleManifest' :showTopTab='showManifestListTop' :showManifestEdit="showManifestEdit" :defaultEdit="defaultEdit" :isEdit='isEdit' :editable='editable'  @hasValueChange='hasValueChange' @singleListValueChange="singleListValueChange" :getColumn='getColumnManifestSettle' :listData='listDataManifest' :editableFields='editableFields' @query="query" @eleManifestMounted='eleManifestMounted' @fieldChange='fieldChange' @submitRecord="submitRecord" @cancelSubmit="cancelSubmit" :loadingMode='loadingMode'>
            </eleManifestList>
          </div>
          <!-- 货单表格 end   -->

          <logs slot="tabChangeLog" :selectable="false" :operatable="false"
                :domain="uploadUrl" :type="logType" :code="code" :isAdvanced="false"
                :params="changeLogParams" :needPage="true">
          </logs>

          <!-- <voucher-list slot="tabVoucherList" :waybill-code="code" :upload-url="uploadUrl"></voucher-list> -->
          <settle-form slot="settleForm" ref="settleForm"
                       :isEdit="isEdit" :editable="editable"
                       :objectName="objectName" :domainObject="domainObject" :fields="fields"
                       @settleFormMounted="settleFormMounted"
                       :inputKey="inputKey" :uploadUrl="uploadUrl" :showBtn="showBtn" v-if="status"></settle-form>

        </settle-layout>
      </ele-form>
      <!-- commonOpr dialog -->
      <commonOpr ref="commonOpr" :domainObject="domainObject" @refresh="handleRefresh"></commonOpr>
      <!-- offline dialog -->
      <offline ref="offline" :domainObject="domainObject" @refresh="handleRefresh"></offline>
      <!-- repulse dialog -->
      <repulse ref="repulse" :domainObject="domainObject" @refresh="handleRefresh"></repulse>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  import settleForm from './settleForm.vue';
  import settleLayout from './settleLayout.vue';

  import eleBlock from '../components/ele-block/eleBlock.vue';
  import eleForm from '../components/ele-form/eleForm.vue';

  import eleChargeItem from '../components/ele-charge-item/eleChargeItem.vue';

  import eleManifestList from '../components/ele-manifest-list/eleManifestList.vue';

  import commonOpr from './chargeDialog/commonOpr.vue';
  import offline from './chargeDialog/offline.vue';
  import repulse from './chargeDialog/repulse.vue';

  import chargeList from './chargeList.vue';
  // import voucherList from './voucherList.vue';
  import showImage from './showImage.vue';
  import waybillMatch from './waybillMatch.vue';

  import * as waybillService from '../../api/waybillService';
  import { get as getOrgManager } from '../../api/OrgManagementService';

  import { getColumnChargeItem, getChargeItemList, editChargeItemList, paybillGet, paybillWithdraw, calculateChargeAmount } from '../../api/waybillService';

  import ApiConst from '../../api/ApiConst';
  import * as utils from '../../api/Utils';
  import logs from '../logs/list.vue';

  import Decimal from "decimal.js";

  import { getParamsFromURL, showMessageUtil, deepClone, getGoodsCategoryVal, getMeterageTypeByGoodsCategoryCode, getGoodsCategoryByKey, urlRedirect, checkPermission } from '../../api/Utils';

  export default {
    components: {
      'ele-form': eleForm,
      'settle-layout': settleLayout,
      'settle-form': settleForm,
      'logs': logs,
      'charge-list': chargeList,
      // 'voucher-list': voucherList,
      'show-image': showImage,
      'waybill-match': waybillMatch,
      'ele-block': eleBlock,
      eleManifestList,
      eleChargeItem,
      commonOpr,
      offline,
      repulse
    },
    data() {
      return {
        objectName: '单车结算',
        configUrl: `${ApiConst.apiWayBillDomain}/detail_render_info/settle/list`,
        domainObject: {},
        addFun: waybillService.add,
        editFun: waybillService.edit,
        getInfo: waybillService.get,
        getColumnManifestSettle: waybillService.getColumnManifestSettle,
        listDataManifest: [],
        listDataManifestOriginal: [],
        editableFields: [],
        temListDataManifest: [], // 临时存放 listData
        loadingMode: 'multiple',
        showManifestEdit: true,
        showManifestListTop: true,
        defaultEdit: false,
        uploadUrl: ApiConst.apiWayBillDomain,
        logType: 'settle',
        listUrl: '/waybill/settleList.html',
        listTitle: '单车结算列表',
        status: false,
        fields: [],
        inputKey: [],
        code: '',
        isEdit: false, // 控制编辑添加按钮
        editable: true, // 控制页面状态
        btnDisabled: false,
        changeLogParams: {
          waybillCode: utils.getParamsFromURL(window.location.search).code,
          size: 10
        },
        loading: true,
        imageUrl: '',
        showBtn: false,
        showForm: false,
        folder: 'waybill/settle',
        defaultDetailColumns: [],
        actualDetailColumns: [],
        clientDetailColumns: [],
        imgShowField: '',
        dataOrgManager: null,
        firstLoad: true,
        projectName: JSON.parse(localStorage.getItem('appInfo')).projectName,
        getColumnChargeItem: getColumnChargeItem,
        listDataChargeItem: [],
        listDataChargeItemOriginal: [],
        isFirstLoad: true
      };
    },
    // watch: {
    //   domainObject: {
    //     deep: true,
    //     handler(newVal, oldVal) {
    //       console.log('domainObject 发生改变：', '新的值为：', newVal, '旧的值为：', oldVal);
    //       if (newVal) {
    //         this.getCalRealTime();
    //       }
    //     }
    //   }
    // },
    methods: {
      calWeight() {
        //统计数据写入 domainObject中
        const cacFields = this.$refs['eleManifest'].$refs['pageSubtotal'].cacFields;
        cacFields.forEach(item => {
          if (this.domainObject.hasOwnProperty(item.field)) {
            this.domainObject[item.field] = item.total;
          }
        });
      },
      syncSettleVol() {
        console.log('sync settleVol now..............');
        const cacFields = this.$refs['eleManifest'].$refs['pageSubtotal'].cacFields,
          loadFields = [{'settleDriverVolume': 'settleVolume'}, {'settleClientVolume': 'clientSettleVolume'}, {'settleLossDeduction': 'settleLossDeduction'}];
        cacFields.forEach((item) => {
          loadFields.forEach((v) => {
            Object.keys(v).forEach((k) => {
              if (item.field === k) {
                this.$set(this.domainObject, v[k], item.total);
              }
            });
          });
        });
        if (this.firstLoad) {
          console.log('the first load of this page and start to watch domainObject now....');
          this.getCalRealTime();
          this.watchDomainObject();
          this.watchSettleMethod();
          this.firstLoad = false;
        }
      },
      syncFullKeys(listData) {
        const allKeys = [];
        listData.forEach((list) => {
          delete list.undefined;
          Object.keys(list).forEach((key) => {
            if (list[key] == null || list[key] == 'null') {
              list[key] = '';
            }
            if (!allKeys.includes(key)) {
              allKeys.push(key);
            }
          });
        });
        console.log('allKeys is', allKeys);
        listData.forEach((li) => {
          allKeys.forEach((v) => {
            if (v in li) {
              console.log('v is', v, 'li is', li);
            } else {
              li[v] = '';
            }
          });
        });
      },
      getManifestObj(listData) {
        this.syncFullKeys(listData);
        const obj = {},
          ignoreKeys = ['id', 'disabled', 'deleted', 'remark', 'moduleCode', 'creatorUserCode', 'creatorUsername', 'createTime', 'updateUserCode', 'updateUsername', 'updateTime', 'ip', 'ownerUserCode', 'ownerOrgCode', 'ownerOrgName', 'synchronousId', 'assignGoodsNum', 'assignGoodsWeight', 'assignGoodsVolume', 'tobeAssignedGoodsNum', 'tobeAssignedGoodsWeight', 'tobeAssignedGoodsVolume', 'assignGoodsNumUnitCode', 'assignGoodsVolumeUnitCode', 'assignGoodsWeightUnitCode', 'tobeAssignedGoodsNumUnitCode', 'tobeAssignedGoodsVolumeUnitCode', 'tobeAssignedGoodsWeightUnitCode'],
          tempListData = JSON.parse(JSON.stringify(listData));
        tempListData.forEach((list, i) => {
          // this.$set(list, 'goodsNum', listData[i].assignGoodsNum);
          // this.$set(list, 'goodsWeight', listData[i].assignGoodsWeight);
          // this.$set(list, 'goodsVolume', listData[i].assignGoodsVolume);
          Object.keys(list).forEach((key) => {
            if (!ignoreKeys.includes(key)) {
              if (key in obj) {
                obj[key] += '@@' + list[key];
              } else {
                obj[key] = list[key] ? list[key] : '';
              }
            }
          });
        });
        console.log('manifest ojb is', obj);
        return obj;
      },
      // 网络请求：批量修改货单信息
      netEditManifestList(code) {
        // 货单信息获取
        const manifestObj = this.getManifestObj(this.listDataManifest),
          paramObj = {
            clientSettleMethod: this.domainObject.clientSettleMethod,
            settleMethod: this.domainObject.settleMethod,
            manifest: JSON.stringify(manifestObj)
          };
        waybillService.editManifestListSettle(code, paramObj, (success, error) => {
          if (error || success.code !== 200) {
            utils.showMessageUtil('warning', error.content, 2000);
          }
          if (success) {
            utils.showMessageUtil('success', '保存成功', 2000);
            this.$refs.eleManifest.statusEditable = false;
            this.calWeight();
          }
        })
      },
      // 检验 eleManifest 里面的 必填  货物名称 goodsName
      checkRulesInEleManifest() {
        let mark = true,
          msg = '';
        let keys = ['goodsName', 'meterageType'];
        let meterageType = null;
        for (let i = 0; i < this.listDataManifest.length; i++) {
          let item = this.listDataManifest[i];
          if (!item[keys[0]]) {
            msg = '请检查货物名称，必须填写！';
            mark = false;
            break;
          }
          if (!item[keys[1]]) {
            msg = '请检查计量标准，必须填写！';
            mark = false;
            break;
          }
          if (0 === i) {
            meterageType = item['meterageType'];
          } else {
            if (meterageType !== item['meterageType']) {
              msg = '计量标准必须一致！';
              mark = false;
              break;
            }
          }
          // 校验规则：3/7   计量单位是吨的货单，货量中的重量必填，计量单位是方的货单，货量中的体积必填；计量单位是件的货单，货量中的件数必填。
          if (meterageType) {
            const map = { 'ton': ['goodsWeight', '货物重量'], 'cube': ['goodsVolume', '货物体积'], 'item': ['goodsNum', '货物数量'] };
            const arr = map[meterageType];
            const key = arr[0];
            if (!item[key]) {
              msg = `请填写${arr[1]}`;
              mark = false;
              break;
            }
          }
          // 检查 每一个 货物单价 的 数值和单位 
          if ((item.goodsPrice && !item.goodsPriceUnitCode) || (!item.goodsPrice && item.goodsPriceUnitCode)) {
            msg = '请检查货单中的 货物单价的值与单位必须填写不正确 ！';
            mark = false;
            break;
          }
        }
        if (!mark) {
          utils.showMessageUtil('warning', msg, 2000)
        }
        return mark;
      },
      submitRecord() {
        if (!this.checkRulesInEleManifest()) { return; } //表格检验是否通过
        console.log('subumit record now');
        // this.$refs.eleManifest.statusEditable = false;
        // this.calWeight();
        const code = utils.getParamsFromURL(window.location.search).code;
        this.netEditManifestList(code);
      },
      cancelSubmit() {
        console.log('cancelEdit now');
        this.$refs.eleManifest.statusEditable = false;
        this.$nextTick(() => {
          this.listDataManifest = JSON.parse(JSON.stringify(this.listDataManifestOriginal));
          this.$nextTick(() => {
            this.$refs['eleManifest'].$refs['pageSubtotal'].getTotal();
          });
        });
      },
      hasValueChange(list) {
        console.log('has value changed');
        // 仅在新建页面同步
        if (!this.isEdit) {
          let mapList = [{ key1: 'goodsCategory', key2: 'goodsName' }, { key1: 'goodsCategoryGb', key2: 'cargoTypeClassificationCode' }];
          mapList.forEach((item, index) => {
            // key1  是货物列表里面的字段 key2 是domain 里面的 字段
            const key1 = item.key1,
              key2 = item.key2;
            var val1 = null,
              val2 = null;
            if (this.temListDataManifest.length > 0 && this.temListDataManifest[0][key1]) {
              val1 = this.temListDataManifest[0][key1];
            }
            if (list.length > 0 && list[0][key1]) {
              val2 = list[0][key1];
            }
            if (val2 && (val2 !== val1)) {
              this.$set(this.domainObject, key2, val2)
            }
          });

          this.$nextTick(() => {
            this.syncMeterageType();
          });

          this.temListDataManifest = utils.deepClone(list);

        }
        // 同步货量
        this.syncSettleVol();
      },
      // 单条货单输入实时计算6个字段的值
      singleListValueChange(index, list) {
        console.log('get singleListValueChange in the settle page now', index, list);
        // 货单编辑状态时才计算
        if (this.$refs.eleManifest.statusEditable && this.editable) {
          let paramsObj = {};
          Object.assign(paramsObj, { clientSettleMethod: this.domainObject.clientSettleMethod, settleMethod: this.domainObject.settleMethod }, { manifest: JSON.stringify(list) });
          waybillService.calSingleManifest(paramsObj, (success, error) => {
            if (error || success.code !== 200) {
              // utils.showMessageUtil('warning', error.content, 2000);
            }
            if (success) {
              const data = success.content,
                initKeys = ['settleClientVolume', 'settleDriverVolume', 'actualGoodsLoss', 'settleGoodsLossReasonable', 'settleGoodsLossVolume', 'settleLossDeduction'];
              // 客户结算货量，司机结算货量，实际货差，合理货差量，货差超标量，货差扣款
              initKeys.forEach((v) => {
                this.$set(list, v, data[v]);
              });
            }
          });
        }
      },
      query() {
        // let code = utils.getParamsFromURL(window.location.search).code || '';
        // if (code) { //详情
        //   this.netGetManifestList(code);
        // }
      },
      queryChargeItem() {
        let self = this;
        let code = getParamsFromURL(window.location.search).code || getParamsFromURL(window.location.search).originalCode || '';
        if (code) { //详情
          this.netGetChargeItem(code);
        } else {
        }
      },
      // 网络请求：获取货单信息
      netGetManifestList(code) {
        if (!code) { return; }
        const paramsObj = {
          waybillCode: code,
          clientSettleMethod: this.domainObject.clientSettleMethod,
          settleMethod: this.domainObject.settleMethod
        };
        waybillService.getManifestListSettle(paramsObj, (success, error) => {
          if (error || success.code !== 200) {
            // utils.showMessageUtil('warning', error.content, 2000);
          }
          if (success && success.content) {
            this.listDataManifest = success.content;
            this.listDataManifestOriginal = JSON.parse(JSON.stringify(success.content));
            this.$nextTick(() => {
              if (this.$refs['eleManifest'] && this.$refs['eleManifest'].setColumnsDataMonitor) {
                this.$refs['eleManifest'].setColumnsDataMonitor();
              }
            });
            // 同步货量
            this.syncSettleVol();
          }
        })
      },
      // 网络请求：获取费用科目信息
      netGetChargeItem(code) {
        if (!code) { return; }
        getChargeItemList({ waybillCode: code }, (success, error) => {
          if (success && success.content) {
            // this.listDataChargeItem = success.content;
            const tempArray = [];
            success.content.forEach((val, index) => {
              if (!val.chargeItemNumber) { val.chargeItemNumber = null; }
              if (!val.chargeItemPrice) { val.chargeItemPrice = null; }
              if (!val.chargeAmounts) { val.chargeAmounts = null; }
              // 处理列表数据
              const tempObj = {
                domainObject: {},
                editableFields: [],
                hideFields: [],
                checkRule: '',
                checkMsg: '',
                isRoot: !val.isRoot
              };
              tempObj.domainObject = val;
              // 默认可编辑的字段为相关附件及备注
              tempObj.editableFields = ['attachmentList', 'description'];
              const keyFields = [{ 'chargeItemNumberResource': 'chargeItemNumber' }, { 'chargeItemPriceResource': 'chargeItemPrice' }, { 'chargeItemAmountsResource': 'chargeAmounts' }];
              keyFields.forEach((obj) => {
                Object.keys(obj).forEach((k) => {
                  if (val[k]) {
                    // 可输入
                    if (val[k] === 'input') {
                      tempObj.editableFields.push(obj[k]);
                    }
                    // 无
                    if (val[k] === 'none') {
                      tempObj.hideFields.push(obj[k]);
                    }
                  }
                });
              });
              // 处理列表校验
              if ('chargeItemAmountsPrecision' in val) {
                // [0-9]{1,10}(\\\\.[0-9]{0,2})?
                // [0-9]{1,10}
                let v = val.chargeItemAmountsPrecision;
                switch(v) {
                  case 0:
                    tempObj.checkRule = '[0-9]{1,10}';
                    tempObj.checkMsg = '请输入不超过15位的整数';
                    break;
                  case 1:
                    tempObj.checkRule = '[0-9]{1,10}(\\.[0-9]{0,1})?';
                    tempObj.checkMsg = '不超过15位（最多1位小数）';
                    break;
                  case 2:
                    tempObj.checkRule = '[0-9]{1,10}(\\.[0-9]{0,2})?';
                    tempObj.checkMsg = '不超过15位（最多2位小数）';
                    break;
                }
              }
              tempArray.push(tempObj);
            });
            this.listDataChargeItem = tempArray;
            this.listDataChargeItemOriginal = JSON.parse(JSON.stringify(tempArray));
            setTimeout(() => {
              this.$refs.eleChargeItem.dealWithFields();
            }, 1000);
          }
          if (error) { showMessageUtil('warning', error.content, 2000) };
        })
      },
      handleChargeAction(action, list, index) {
        console.log('page received chargeList action now', action, list, index);
        switch(action) {
          case 'clearRow':
            this.clearRow(list, index);
            break;
          case 'addRow':
            this.addRow(list, index);
            break;
          case 'delRow':
            this.delRow(list, index);
            break;
          case 'editRow':
          case 'modifyRow':
            this.$refs.commonOpr.open(action, list, index, '修改', this.listDataChargeItem[index].editableFields, this.listDataChargeItem[index].checkRule, this.listDataChargeItem[index].checkMsg);
            break;
          case 'createRow':
            this.$refs.commonOpr.open(action, list, index, '创建', this.listDataChargeItem[index].editableFields, this.listDataChargeItem[index].checkRule, this.listDataChargeItem[index].checkMsg);
            break;
          case 'applyRow':
            this.$refs.commonOpr.open(action, list, index, '申请支付');
            break;
          case 'auditRow':
            this.$refs.commonOpr.open(action, list, index, '审核支付');
            break;
          case 'payOnlineRow':
            this.payOnline(list);
            break;
          case 'payOfflineRow':
            this.$refs.offline.open(action, list, index, '线下支付提示');
            break;
          case 'repulseRow':
            this.$refs.repulse.open(action, list, index, '司机付款打回提示');
            break;
          case 'withdrawRow':
            this.withdrawRow(list, index);
            break;
          default:
            console.log('default action is ', action, list, index);
            break;
        }
      },
      chargeItemSingleListValueChange(index, list) {
        console.log('list index is', index, 'list is', list);
        // 金额来源方式为标准计算或者公式获取，才实时计算金额
        if (list.chargeItemAmountsResource && (list.chargeItemAmountsResource === 'standard' || list.chargeItemAmountsResource === 'expression') && list.chargeItemNumber && list.chargeItemPrice) {
          const paramsObj = {
              code: list.code,
              chargeItemNumber: list.chargeItemNumber,
              chargeItemPrice: list.chargeItemPrice
            };
          calculateChargeAmount(paramsObj, (success, error) => {
            if (error) {
              // showMessageUtil('warning', error.content, 3000);
              console.log('calculateChargeAmount error', error);
            }
            if (success) {
              const amount = success.content.result;
              this.listDataChargeItem[index].domainObject.chargeAmounts = amount;
              this.getCalRealTime();
            }
          });
        } else {
          if (list.chargeAmounts) {
            this.getCalRealTime();
          }
        }
      },
      openWindow(url, title) {
        utils.urlRedirect(url, title);
      },
      handleRefresh() {
        console.log('refresh charge item now');
        this.queryChargeItem();
      },
      syncChargeFullKeys(listData) {
        const newListData = [],
          tempListData = JSON.parse(JSON.stringify(listData)),
          allKeys = [];
        tempListData.forEach((list) => {
          const val = list.domainObject;
          Object.keys(val).forEach((key) => {
            if (val[key] == null || val[key] == 'null') {
              val[key] = '';
            }
            if (!allKeys.includes(key)) {
              allKeys.push(key);
            }
          });
        });
        console.log('allKeys is', allKeys);
        tempListData.forEach((list) => {
          const val = list.domainObject;
          allKeys.forEach((v) => {
            if (v in val) {
              console.log('v is', v, 'val is', val);
            } else {
              val[v] = '';
            }
          });
          newListData.push(val);
        });
        console.log('newListData is', newListData);
        return newListData;
      },
      getChargeListData(listData) {
        const newListData = this.syncChargeFullKeys(listData),
          obj = {},
          ignoreKeys = ['id', 'disabled', 'deleted', 'remark', 'moduleCode', 'creatorUserCode', 'creatorUsername', 'createTime', 'updateUserCode', 'updateUsername', 'updateTime', 'ip', 'ownerUserCode', 'ownerOrgCode', 'ownerOrgName', 'synchronousId'],
          tempNewListData = JSON.parse(JSON.stringify(newListData)),
          waybillCode = utils.getParamsFromURL(window.location.search).code;
        tempNewListData.forEach((list, i) => {
          this.$set(list, 'businessCode', waybillCode); // 业务对象编码
          Object.keys(list).forEach((key) => {
            if (!ignoreKeys.includes(key)) {
              if (key in obj) {
                obj[key] += '@@' + list[key];
              } else {
                obj[key] = list[key] ? list[key] : '';
              }
            }
          });
        });
        console.log('tempNewListData ojb is', obj);
        return obj;
      },
      submitChargeRecord() {
        console.log('subumit record now');
        this.$refs.eleChargeItem.formValidate((valid) => {
          if (valid) {
            const waybillCode = utils.getParamsFromURL(window.location.search).code;
            const paramsObj = this.getChargeListData(this.listDataChargeItem);
            editChargeItemList(waybillCode, paramsObj, (success, error) => {
              if (error) {
                showMessageUtil('warning', error.content, 3000);
              }
              if (success) {
                showMessageUtil('success', '保存成功！', 3000);
                this.$refs.eleChargeItem.statusEditable = false;
                this.handleRefresh();
              }
            });
          } else {
            console.log('subumit record valid failed');
          }
        });
      },
      cancelChargeSubmit() {
        console.log('cancelEdit now');
        this.$refs.eleChargeItem.statusEditable = false;
        this.$nextTick(() => {
          this.listDataChargeItem = JSON.parse(JSON.stringify(this.listDataChargeItemOriginal));
        });
      },
      clearRow(list, index) {
        console.log('clear single row start here and the listData is', list, 'index is', index);
        const fields = this.listDataChargeItem[index].editableFields,
          data = this.listDataChargeItem[index].domainObject;
        Object.keys(data).forEach((k) => {
          if (fields.includes(k) && k !== 'attachmentList') {
            this.$set(data, k, null);
          }
        });
        this.getCalRealTime();
      },
      addRow(list, index) {
        console.log('add single row start here and the listData is', list, 'index is', index);
        const copyObj = JSON.parse(JSON.stringify(this.listDataChargeItem[index])),
          copyDomainObject = copyObj.domainObject;
        copyObj.isRoot = false;
        // 复制新增的移除自动生成的code
        if (copyDomainObject.code) {
          copyDomainObject.code = '';
        }
        // 付款状态默认待创建
        if (copyDomainObject.chargeItemPaybillStatus) {
          copyDomainObject.chargeItemPaybillStatus = 'uncreated';
        }
        // 支付方式默认无
        if (copyDomainObject.chargeItemPaybillPayChannel) {
          copyDomainObject.chargeItemPaybillPayChannel = null;
        }
        // 相关附件清空
        if (copyDomainObject.attachmentList) {
          copyDomainObject.attachmentList = null;
        }
        // 关联付款单号无
        if (copyDomainObject.chargeItemPaybillNo) {
          copyDomainObject.chargeItemPaybillNo = null;
        }
        // 增加标识可删除
        copyDomainObject.isRoot = 'no';
        this.listDataChargeItem.splice(index + 1, 0, copyObj);
        this.getCalRealTime();
      },
      delRow(list, index) {
        console.log('del single row start here and the listData is', list, 'index is', index);
        this.listDataChargeItem.splice(index, 1);
        this.getCalRealTime();
      },
      payOnline(model) {
        const paramsObj = {
          code: model.chargeItemPaybillCode
        };
        paybillGet(paramsObj, (success, error) => {
          if (error) {
            showMessageUtil('warning', error.content, 3000);
          }
          if (success) {
            const data = [];
            data.push(success.content);
            localStorage.setItem('paycart', JSON.stringify(data));
            this.openWindow('/paybill/order.html', '支付账单');
            this.$confirm('请问您支付完成了吗？', '确认', {
              confirmButtonText: '确定',
              cancelButtonText: '取消'
            }).then(() => {
              this.handleRefresh();
            });
          }
        });
      },
      withdrawRow(list, index) {
        this.$msgbox({
          title: '确认',
          message: `确认要撤回吗？`,
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '执行中...';
              paybillWithdraw({ code: list.chargeItemPaybillCode }, (success, error) => {
                if (success) {
                  this.$message({
                    type: 'success',
                    message: '撤回成功',
                    duration: 1000
                  });
                  done();
                  instance.confirmButtonLoading = false;
                }
                if (error) {
                  this.$message({
                    type: 'warning',
                    message: `${error.content}`,
                    duration: 1000
                  });
                  instance.confirmButtonLoading = false;
                  done();
                }
              });
            } else {
              done();
            }
          }
        }).then(() => {
          this.handleRefresh();
        });
      },
      eleManifestMounted() {
        this.syncMeterageType();
      },
      // 每次都检查 计量标准 
      syncMeterageType() {
        let self = this;
        let meterageType = null,
          mode = 'multiple';
        // mode = this.domainObject.loadingMode;
        if ('single' === mode) {
          // 取第一个
          let list0 = this.listDataManifest[0];
          meterageType = list0['meterageType'];
        }
        if ('multiple' === mode) {
          //多个的时候 去拿 数据
          let list0 = this.listDataManifest[0];
          // meterageType = getMeterageTypeByGoodsCategoryCode(list0['goodsCategory']);
          meterageType = list0['meterageType'];
          list0['meterageType'] = meterageType;
        }
        this.domainObject.meterageType = meterageType;
        // 页面中的需要计量标准的处理  客户运价 司机运价  clientFreightPriceUnitCode driverReferPriceUnitCode
        let keysFileld = ['clientFreightPriceUnitCode', 'driverReferPriceUnitCode'];
        keysFileld.forEach(key => {
          let el = this.$refs.form.getElementByField(key);
          if (el && el.onRefresh) {
            el.onRefresh({ codeUnitType: meterageType });
          }
        })
        this.listDataManifest.forEach((list, index) => {
          const refName = `tr${index}`,
            complexEl = self.$refs['eleManifest'].$refs[refName];
          if (complexEl && complexEl.length > 0) {
            let listCh = complexEl[0].$children;
            let child = null;
            for (let i = 0; i < listCh.length; i++) {
              let item = listCh[i];
              if (item.field && item.field.fieldConfigCode && item.field.fieldConfigCode === 'goodsPrice') {
                child = item;
                break;
              }
            }
            if (child) {
              // 每一行 都按照 自己的
              let meterageTypeIndex = list['meterageType'];
              child.$children[1].$children[0].onRefresh({ codeUnitType: meterageTypeIndex });
            }

            // 当合理货差系数 是按量的时候 执行 计量标准
            if (list.goodsLossMethod === 'goods.loss') {
              let childLoss = null;
              for (let i = 0; i < listCh.length; i++) {
                let item = listCh[i];
                if (item.field && item.field.fieldConfigCode && item.field.fieldConfigCode === 'freightLoss') {
                  childLoss = item;
                  break;
                }
              }
              if (childLoss) {
                let meterageTypeIndex = list['meterageType'];
                childLoss.$children[0].onRefrshSelect({ codeUnitType: meterageTypeIndex });
              }
            }
          }
        })
      },
      fieldChange(key, indexMark) {},
      delImg(url) {
        console.log('删除的图片url为', url);
        console.log('字段field为', this.imgShowField);
        // 获取组件显示图片list数据attachmentList
        const imgField = this.$refs.form.getElementByField(this.imgShowField),
          imgArray = imgField.attachmentList;
        console.log('imgField is', imgField, imgArray);
        imgArray.forEach((data, index) => {
          const imgUrl = data.response ? data.response.content.thumbnailList[0].url : data.url;
          if (imgUrl === url) {
            console.log('okay you got me', index, data, imgUrl);
            imgArray.splice(index, 1);
            imgField._onRemove(data, imgArray);
            console.log('del success, new attachmentList is', imgArray);
            console.log('domainObject field is', this.domainObject[this.imgShowField]);
          }
        });
      },
      getCal() {
        // 结算方式settleMethod返回有值，则开始计算
        if (this.domainObject.settleMethod) {
          waybillService.getTotalAmount(this.domainObject.code, null, null, (success) => {
            const data = success.content;
            data.forEach((val) => {
              if (val.expressionResultFieldName) {
                this.domainObject[val.expressionResultFieldName] = val.expressionResult;
              }
            });
            // this.domainObject = success.content;
          });
        }
      },
      getNewChargeListData(data) {
        const tempListData = JSON.parse(JSON.stringify(data)),
          arrData = [];
        tempListData.forEach((list) => {
          arrData.push(list.domainObject);
        });
        return arrData;
      },
      getCalRealTime() {
        const newObj = Object.assign({}, this.domainObject);
        delete newObj.waybillTagList;
        // 结算方式settleMethod返回有值，则开始计算
        if (this.domainObject.code && this.domainObject.settleMethod && this.$refs.eleChargeItem) {
          const newChargeListData = this.getNewChargeListData(this.listDataChargeItem);
          waybillService.getTotalAmount(this.domainObject.code, newObj, newChargeListData, (success) => {
            const data = success.content;
            data.forEach((val) => {
              if (val.expressionResultFieldName) {
                this.domainObject[val.expressionResultFieldName] = val.expressionResult;
              }
            });
            // this.domainObject = success.content;
          });
        }
      },
      formReady(formData) {
        console.log('formReady', formData);
        this.inputKey = formData.paramData.inputKey;
        this.fields = formData.paramData.field;
        this.isEdit = formData.isEdit;
        this.editable = formData.editable;
        this.code = formData.code;
        if (this.code) {
          this.showBtn = this.domainObject.settleStatus === 'settle' || this.domainObject.settleStatus === 'unsettle';
          this.status = true;
          // 实际货差单位与计量标准保持一致
          this.domainObject.actualGoodsLossUnitCode = this.domainObject.meterageType;
          // 合理货差量单位与计量标准保持一致
          this.domainObject.settleGoodsLossReasonableUnitCode = this.domainObject.meterageType;
          // 货差超标量单位与计量标准保持一致
          this.domainObject.settleGoodsLossVolumeUnitCode = this.domainObject.meterageType;
          // this.getCal();
        }
        this.netGetManifestList(this.code);
        // this.watchDomainObject();
        // this.watchSettleMethod();
      },
      watchDomainObject() {
        this.$watch('domainObject', (newVal, oldVal) => {
          console.log('domainObject 发生改变：', '新的值为：', newVal, '旧的值为：', oldVal);
          if (newVal) {
            this.getCalRealTime();
          }
        }, {
          deep: true
        });
      },
      watchSettleMethod() {
        const code = utils.getParamsFromURL(window.location.search).code;
        // 客户结算方式
        this.$watch(`domainObject.clientSettleMethod`, (newVal, oldVal) => {
          if (newVal) {
            console.log('client settle methods changed ', newVal);
            this.netGetManifestList(code);
          }
        });
        // 司机结算方式
        this.$watch(`domainObject.settleMethod`, (newVal, oldVal) => {
          if (newVal) {
            console.log('client settle methods changed ', newVal);
            this.netGetManifestList(code);
          }
        });
      },
      showImage(form, field) {
        form.getElementByField(field).$on('showImage', (imgData) => {
          console.log('showImage data is', imgData);
          this.imgShowField = field;
          this.imageUrl = imgData.content.thumbnailList[0].url;
          this.$refs.showImage.imgDegree = 0;
          this.$refs.showImage.imgScale = 1;
        });
      },
      previewImage(form, field) {
        form.getElementByField(field).$on('previewImage', (imgData) => {
          console.log('previewImage data is', imgData);
          this.imgShowField = field;
          this.imageUrl = imgData.response ? imgData.response.content.thumbnailList[0].url : imgData.url;
          this.$refs.showImage.imgDegree = 0;
          this.$refs.showImage.imgScale = 1;
        });
      },
      loadFirst(form, field) {
        form.getElementByField(field).$on('loadFirst', (imgData) => {
          console.log('loadFirst data is', imgData);
          this.imgShowField = field;
          this.imageUrl = imgData.url;
          this.$refs.showImage.imgDegree = 0;
          this.$refs.showImage.imgScale = 1;
        });
      },
      settleFormMounted() {
        
      },

      formMounted(form) {
        // 处理formMounted多次触发
        if (!this.isFirstLoad) { return false; }
        this.isFirstLoad = false;
      
        this.showImage(form, 'loadingAttachment');
        this.showImage(form, 'unloadingAttachment');
        this.previewImage(form, 'loadingAttachment');
        this.previewImage(form, 'unloadingAttachment');
        this.loadFirst(form, 'loadingAttachment');


        // 获取动态字段名称
        waybillService.getSettleDetail((success) => {
          const data = success.content;
          console.log('详情默认配置', data);
          data.forEach((val) => {
            this.defaultDetailColumns.push(val.fieldConfigCode);
          });
          this.fields.forEach((val) => {
            if (!val.extraParams[0].isShow) {
              this.actualDetailColumns.push(val.fieldConfigCode);
            }
          });
          console.log('详情默认显示字段为', this.defaultDetailColumns);
          console.log('详情实际显示字段为', this.actualDetailColumns);
          this.actualDetailColumns.forEach((val) => {
            if (!this.defaultDetailColumns.includes(val)) {
              this.clientDetailColumns.push(val);
            }
          });
          console.log('详情动态显示字段为', this.clientDetailColumns);
        });

      // 处理司机运价与 客户运价的关系  start ======
      const appInfo = JSON.parse(localStorage.getItem('appInfo'));
      console.log('appInfo ...', appInfo);
      if (appInfo.priceMode == 'auto') {
        // this.$nextTick(() => {
        // 把司机运价变成 readonly 变成不可以编辑
        let el = this.$refs.form.getElementByField('driverPrice');
        console.log('el.configData ...', el.configData);
        if (el.configData) {
          // el.configData.readonly = 'TRUE';
          this.$set(el.configData,'readonly','readonly');
        }
        // 有bug 第二个 没有起到作用
        let el2 = this.$refs.form.getElementByField('driverPriceUnitCode');
        console.log('el.configData ...', el.configData);
        if (el2.configData) {
          el2.configData.readonly = 'TRUE';
        }
        // });

   
        //监听客户运价   ,计算数据
        this.$watch(`domainObject.clientFreightPrice`, (val) => {
          this.dealWithClientFreightPrice();
        })

        this.$watch(`domainObject.clientFreightPriceUnitCode`, (val) => {
          this.domainObject.driverPriceUnitCode = this.domainObject.clientFreightPriceUnitCode;
        })
      }

      // 处理司机运价与 客户运价的关系  start ======


      // 监听 银行账号 ，去除空格  driverPayeeBankAccountNo
      this.$watch(`domainObject.driverPayeeBankAccountNo`, (val) => {
        if(val){
            this.domainObject.driverPayeeBankAccountNo =  val.replace(/[ ]/g,"");
        }
      })

      // driverPayeeBankAccountName 银行户名
      this.$watch(`domainObject.driverPayeeBankAccountName`, (val) => {
        if(val){
            this.domainObject.driverPayeeBankAccountName =  val.replace(/[ ]/g,"");
        }
      })

      // driverPayeeBankName 开户银行
      this.$watch(`domainObject.driverPayeeBankName`, (val) => {
        if(val){
            this.domainObject.driverPayeeBankName =  val.replace(/[ ]/g,"");
        }
      })

      // driverFuelCardNo 油卡卡号
      this.$watch(`domainObject.driverFuelCardNo`, (val) => {
        if(val){
            this.domainObject.driverFuelCardNo =  val.replace(/[ ]/g,"");
        }
      })



      },

      dealWithClientFreightPrice() {
        // if (!this.dataOrgManager) {
        //   return;
        // }
        if (this.domainObject.settleTradingConfigUnitCode == '%') {

          // let num = parseFloat(this.domainObject.settleTradingConfigValue) / 100;
          // let finNum = this.domainObject.clientFreightPrice * (1 - num);
          // this.domainObject.driverPrice = Math.floor(finNum * 100) / 100;

        let num =  Decimal(this.domainObject.settleTradingConfigValue).div(100).toNumber();
        let num1 = Decimal(1).sub(num).toNumber();
        let finNum = Decimal(this.domainObject.clientFreightPrice).mul(Decimal(num1)).toNumber();
        this.domainObject.driverPrice = Math.floor(finNum * 100) / 100;



        } else if (this.domainObject.settleTradingConfigUnitCode == 'yuan') {
          let finNum = this.domainObject.clientFreightPrice - this.domainObject.settleTradingConfigValue;
          this.domainObject.driverPrice = Math.floor(finNum * 100) / 100;
        }
      },

      loadWaybill(waybillData) {
        console.log('waybill is', waybillData);
        this.code = waybillData.code;
        Object.keys(waybillData).forEach((key) => {
          // this.domainObject[key] = waybillData[key];
          this.$set(this.domainObject, key, waybillData[key]);
        });
        this.showBtn = this.domainObject.settleStatus === 'settle' || this.domainObject.settleStatus === 'unsettle';
        // 实际货差单位与计量标准保持一致
        this.domainObject.actualGoodsLossUnitCode = this.domainObject.meterageType;
        // 合理货差量单位与计量标准保持一致
        this.domainObject.settleGoodsLossReasonableUnitCode = this.domainObject.meterageType;
        // 货差超标量单位与计量标准保持一致
        this.domainObject.settleGoodsLossVolumeUnitCode = this.domainObject.meterageType;
        this.status = true;
        console.log('new domainObject is', this.domainObject);
        this.getCal();
      },
      editForm() {
        this.editable = true;
      },
      cancelEdit() {
        this.$refs.form.resetForm();
        this.editable = false;
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
      submitForm() {
        // 增加固定科目(油气费、保险费、信息费)如果填写了一项，则必须填写完整判断
        const fields = [['settleConfigValue1', 'settleConfigUnitCode1'], ['settleConfigValue2', 'settleConfigUnitCode2'], ['settleConfigValue3', 'settleConfigUnitCode3']];
        if (this.checkFields(fields) === fields.length) {
          this.btnDisabled = true;
          this.$refs.form.submitForm();
          this.$refs.settleForm.submitForm();
        } else {
          this.$message({
            type: 'warning',
            message: '固定科目结算方式设置(油气费、保险费、信息费)，数值和单位必须同时填写完整！',
            duration: 3000
          });
        }
      },
      resetForm() {
        this.$refs.form.resetForm();
      },
      editSuccess() {
        this.editable = false;
        this.getCal();
      },
      submitDone() {
        this.btnDisabled = false;
      }
    },
    mounted() {
      console.log('child mounted', this.$slots);
    },
    created() {
      console.log('child created');
    }
  };
</script>

