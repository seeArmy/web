/**
* list.vue
* 批量派车
* Created by cc on 18/7/30.
*/
<template>
  <div :class="{ 'theme-blue': theme }">
    <div class="page-header clearfix">
      <h2 class="page-title fl">
       批量派车
      </h2>
    </div>
    <!-- 订单信息 -->
    <div class="logistics-info">
      <logistics-info :logisticsData="logisticsData"></logistics-info>
    </div>
    <el-row :gutter="20" class="selection">
      <el-col :span="14">
        <!-- 待选 -->
        <div class="tobe-select">
          <h3 class="tit">待选</h3>
          <span class="page-refresh" @click="refresh"><i class="ico-refresh"></i>刷新 </span>
          <ele-list :selectable="selectable" :operatable="false" :showImportButton="false" :showDownloadTemplate="false" :showExportButton="false" :miniSearchNum="3" @query="query" @ready="query" :total="total" :loading="loading" :list-data="listData" ref="eleList" :customColumn="customColumn" :params="params" :needPage="needPage" :isAdvanced="false" :getColumn="getColumn" :getList="getList" :getSearch="getSearch" :objectName="objectName">
            <template slot="funArea">
              <el-button @click="addToSelected">添加到已选</el-button>
            </template>
          </ele-list>
        </div>
      </el-col>
      <el-col :span="10">
        <!-- 已选 -->
        <div class="selected">
          <h3 class="tit">已选<span>(<strong class="org">{{ selectedNumber }}</strong>)</span></h3>
          <selected ref="selected" :selectedData="selectedData" @selectedChanged="selectedChanged"></selected>
        </div>
      </el-col>
    </el-row>
    <!-- 调车模式 -->
    <div class="dispatch-mode tc" v-if="disableModeSelect">
      批量设置调车模式：
      <el-radio-group v-model="mode">
        <el-radio label="self">自助调车</el-radio>
        <el-radio label="platform">委托调车</el-radio>
      </el-radio-group>
    </div>
    <!-- 批量派车 -->
    <div class="tc">
      <el-button type="primary" size="large" class="batch-button" @click="batchDispatch">批量派车</el-button>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import eleList from '../components/ele-list/eleList.vue';
import { urlRedirect, getParamsFromURL, checkPermission } from '../../api/Utils';
import { get } from '../../api/LogisticsService';
import { list } from '../../api/TransportService';
import { add, getColumn, getSearch } from '../../api/BatchDispatchService';

import ApiConst from '../../api/ApiConst';


import logisticsInfo from './logisticsInfo.vue';
import selected from './selected.vue';

export default {
  name: 'batchDispatch',
  components: {
    'ele-list': eleList,
    'logistics-info': logisticsInfo,
    selected
  },
  props: {
    selectable: {
      type: Boolean,
      'default': true
    },
    operatable: {
      type: Boolean,
      'default': true
    },
    customColumn: Array,
    isAdvanced: {
      type: Boolean,
      'default': true
    },
    needPage: {
      type: Boolean,
      'default': true
    },
    params: {
      type: Object,
      'default': function() {
        return {};
      }
    }
  },
  data: () => {
    return {
      logisticsCode: getParamsFromURL(window.location.search).logisticsCode,
      logisticsData: {},
      listData: [],
      selectedData: [],
      total: 0,
      loading: true,
      getColumn,
      getList: list,
      getSearch,
      objectName: '批量派车',
      addUrl: '',
      editUrl: '',
      mode: '',
      tempSelected: [],
      selectedCount: 0,
      selectedNumber: 0,
      theme: true,
      disableModeSelect: JSON.parse(localStorage.getItem('appInfo')).enableScheduleType === 'TRUE', // 禁用调车模式选择
      defaultScheduleType: JSON.parse(localStorage.getItem('appInfo')).defaultScheduleType // 默认调车模式
    };
  },
  methods: {
    refresh() {
      this.$refs.eleList.dispatchQueryEvent();
    },
    calTotal() {
      this.selectedNumber = 0;
      this.selectedData.forEach((val) => {
        this.selectedNumber += val.countNumber;
      });
      // console.log('计算出选中条数为', this.selectedNumber);
    },
    selectedChanged(data) {
      // console.log('子组件数据改变，开始同步selectedData数据', data);
      this.selectedData = data;
      // console.log('子组件数据改变，selectedData数据同步为', this.selectedData);
      this.calTotal();
    },
    addToSelected() {
      // console.log('当前的selectedData数据为', this.selectedData);
      this.tempSelected = [];
      this.listData.forEach((val) => {
        if (val.checked) {
          this.selectedCount += 1;
          val.countNumber = 1;
          this.tempSelected.unshift(val);
        }
      });
      // console.log('左侧待选临时选中的数据为', this.tempSelected);
      if (this.selectedCount === 0) {
        this.$message({
          type: 'warning',
          message: `请至少勾选一辆待选车辆列表中的车！`,
          duration: 3000
        });
        return false;
      } else {
        this.tempSelected.forEach((val) => {
          // 如果当前数据已经存在
          if (this.selectedData.find(v => v.code === val.code)) {
            // console.log('开始循环的selectedData数据为', this.selectedData);
            this.selectedData.forEach((data, index) => {
              if (data.code === val.code) {
                // console.log('当前数据已经选中，开始增加条数countNumber+1', val);
                let dataCopy = JSON.parse(JSON.stringify(data));
                dataCopy.countNumber += 1;
                this.$set(this.selectedData, index, dataCopy);
                // console.log('变更后的countNumber+1数据为', data);
                // console.log('变更后的selectedData数据为', this.selectedData);
              }
            });
          } else {
            this.selectedData = [].concat(val).concat(this.selectedData);
          }
          // 计算条数
          this.calTotal();
        });
        // 取消左侧勾选
        this.listData.forEach((val) => {
          if (val.checked) {
            val.checked = false;
          }
        });
        this.$refs.eleList.$refs.table.batchSelect = false;
      }
    },
    openWindow(url, title) {
      urlRedirect(url, title);
    },
    // 逻辑：当下发的 truckAuthc = true 车辆和挂车必须都认证通过
    //      当下发的 driverAuthc = true 主驾和副驾必须都认证通过
    //  反之，不可选择
    //  return true => 禁用 false 正常
    dealTruckDriverConfig(list) {
      let mark = false; // 默认不禁用
      function isNull(obj) {
        if (obj == null) return true;
        return false
      }
      const
        truckAuthc = JSON.parse(localStorage.getItem('otherappConfig'))['other.dispatch.truck.authc'] === 'TRUE' ? true : false,
        driverAuthc = JSON.parse(localStorage.getItem('otherappConfig'))['other.dispatch.driver.authc'] === 'TRUE' ? true : false;

      // truckAuthc = true;
      // driverAuthc = true;


      // 逻辑:
      // truckAuthc true ,主车必须认证(没有主车，默认已经认证) ，挂车必须认证(没有挂车，默认已经认证)
      // driverAuthc true ,主驾必须认证(没有主驾，默认已经认证) ，副驾必须认证(没有副驾，默认已经认证)
      if (!truckAuthc && !driverAuthc) { return mark };

    let mainTruckCode = null,
        trailerTruckCode = null,
        driverCode = null,
        viceDriverCode = null;

    let truckSt1 = true,
        truckSt2 = true,
        dirverSt1 = true,
        dirverSt2 = true;

      mainTruckCode = list.mainTruckCode,
        trailerTruckCode = list.trailerTruckCode,
        driverCode = list.driverCode,
        viceDriverCode = list.viceDriverCode;
      // 若没有 此 车辆 ，挂车，主驾，副驾，默认认为其是认证通过的
      truckSt1 = (isNull(mainTruckCode) || 'authenticated' === list.mainTruckCertStatus) ? true : false,
        truckSt2 = (isNull(trailerTruckCode) || 'authenticated' === list.trailerTruckCertStatus) ? true : false,
        dirverSt1 = (isNull(driverCode) || 'authenticated' === list.driverCertStatus) ? true : false,
        dirverSt2 = (isNull(viceDriverCode) || 'authenticated' === list.viceDriverCertStatus) ? true : false;
      // 逻辑：
      // 1.左边 只有在 需要认证车辆   并且 主车与挂车 只有有一个 认证未通过   ==> true  禁止点击
      // 2.右边 只有在 需要认证驾驶员 并且 主驾与副驾 只有要一个 认证未通过   ==> true  禁止点击
      mark = (truckAuthc && (!truckSt1 || !truckSt2)) || (driverAuthc && (!dirverSt1 || !dirverSt2))

      return mark;

    },
    query(searchParams) {
      const self = this;
      this.total = 0;
      this.loading = true;
      self.listData = [];
      list(searchParams, (success, error) => {
        this.loading = false;
        if (error) {
          this.$message({
            type: 'error',
            message: error.content,
            duration: 3000
          });
        }
        if (success) {
          this.total = success.total;
          success.content.forEach(obj => {
            let checkboxStatus = 'TRUE'; // 默认可以点击
            let mark = self.dealTruckDriverConfig(obj);
            obj['checkboxStatus'] = mark ? 'FALSE' : 'TRUE';
          })
          self.listData = success.content;

        }
      });
    },
    batchDispatch() {
      const data = this.selectedData,
        self = this;
      if (data.length === 0) {
        this.$message({
          type: 'warning',
          message: `已选车辆不能为空！`,
          duration: 3000
        });
        return false;
      } else {
        const h = this.$createElement;
        this.$msgbox({
          title: '消息',
          message: h('p', null, [h('span', null, `确认批量派${self.selectedNumber}车次吗？ `)]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '执行中...';
              let sucNum = 0,
                errNum = 0;
              data.forEach((val) => {
                if (val.countNumber === 1) {
                  const paramsObj = {
                    logisticsCode: self.logisticsCode,
                    mainTruckCode: val.mainTruckCode,
                    scheduleType: self.mode
                  };
                  add(paramsObj, (success, error) => {
                    if (error || success.code !== 200) {
                      errNum += 1;
                      this.$message({
                        type: 'error',
                        message: error.content,
                        duration: 3000
                      });
                      return false;
                    }
                    if (success) {
                      sucNum += 1;
                      const data = success.content;
                      // console.log('add success', data);
                    }
                    // 判断执行条数
                    if ((sucNum + errNum) === self.selectedNumber) {
                      const info = `批量派车共${self.selectedNumber}次，成功${sucNum}条，失败${errNum}条！`;
                      self.$message({
                        type: 'success',
                        message: info,
                        duration: 3000
                      });
                      instance.confirmButtonLoading = false;
                      done();
                    }
                  });
                } else {
                  // 多条记录
                  for (let i = 0; i < val.countNumber; i++) {
                    const paramsObj = {
                      logisticsCode: self.logisticsCode,
                      mainTruckCode: val.mainTruckCode,
                      scheduleType: self.mode
                    };
                    add(paramsObj, (success, error) => {
                      if (error || success.code !== 200) {
                        errNum += 1;
                        this.$message({
                          type: 'error',
                          message: error.content,
                          duration: 3000
                        });
                        return false;
                      }
                      if (success) {
                        sucNum += 1;
                        const data = success.content;
                        // console.log('add success', data);
                      }
                      // 判断执行条数
                      if ((sucNum + errNum) === self.selectedNumber) {
                        const info = `批量派车共${self.selectedNumber}次，成功${sucNum}条，失败${errNum}条！`;
                        self.$message({
                          type: 'success',
                          message: info,
                          duration: 3000
                        });
                        instance.confirmButtonLoading = false;
                        done();
                      }
                    });
                  }
                }
              });
            } else {
              done();
            }
          }
        }).then(() => {
          // 派车成功刷新
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        });
      }
    }
  },
  beforeCreate() {
    const logisticsCode = getParamsFromURL(window.location.search).logisticsCode,
      paramsObj = {
        code: logisticsCode
      };
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
        // console.log('logistics data is', data);
      }
    });
  },
  created() {
    // 派车模式从配置中取
    const ls = JSON.parse(localStorage.getItem('appInfo'));
    if (ls.defaultScheduleType) {
      console.log('默认派车模式为：', ls.defaultScheduleType);
      this.mode = ls.defaultScheduleType;
    } else {
      console.log('调车模式没有配置');
      this.mode = 'self';
    }
  }
};

</script>
<style lang="scss" rel="stylesheet/scss">
body {
  overflow-x: hidden;
}

.tc {
  text-align: center;
}

.logistics-info {
  line-height: 22px;
  font-size: 14px;
}

.selection {
  margin-top: 20px;

  .tit {
    padding-top: 10px;
    padding-left: 10px;
    font-weight: 700;
    font-size: 14px;

  }

  .el-col-14,
  .el-col-10 {
    border: solid 1px #ddd;
  }

  .el-col-10 {
    height: 424px;
  }

  #miniSearch {
    .el-form-item {
      margin-right: 0;
    }

    .el-input__inner {
      width: 120px;
      height: 24px;
      border-color: #dadada;
      border-radius: 0;

      &:focus {
        border-color: #f48400;
      }
    }

    .el-button--default {
      display: none;
    }
  }
}

.tobe-select {
  position: relative;

  .page-refresh {
    position: absolute;
    top: 10px;
    right: 0;
  }

  #list {
    height: auto !important;
  }

  .page-header {
    margin-top: 10px;
    padding: 0;
  }

  .fix-table-wrap {
    height: 298px !important;
    max-height: 298px;
  }
}

.selected {
  .tit {
    padding-bottom: 10px;
    border-bottom: solid 1px #e5e9ef;
  }

  .table-opr {
    padding: 10px;
  }

  .rl-fix-table {
    line-height: 22px;
    font-size: 14px;
  }
}

.dispatch-mode {
  padding: 20px;
  font-size: 14px;
  background-color: #f5f5f5;
}

.batch-button {
  width: 200px;
  margin: 40px;
}

@media (max-width: 1366px) {
  .selection {
    #miniSearch {
      .el-input__inner {
        width: 95px;
      }
    }
  }
}

</style>
