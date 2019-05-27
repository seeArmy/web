<!-- 平台级业务规则配置 -->
<template>
  <div v-loading.body="loading">
    <div class="list_title">
      <h2>{{objectName}}</h2>
      <span id="pageRefresh" class="page-refresh fr"><i class="ico-refresh"></i>刷新</span>
    </div>
    <el-table ref="singleTable" :data="tableData" highlight-current-row style="width: 100%">
      <el-table-column type="index" label="序号" width="100">
      </el-table-column>
      <el-table-column property="configItem" label="配置项">
      </el-table-column>
      <el-table-column property="configItemDes" label="配置项描述">
      </el-table-column>
      <el-table-column label="配置值">
        <template scope="scope">
          <el-select v-model="scope.row.defaultVal" placeholder="请选择" v-if="scope.row.type == 'select' ">
            <el-option v-for="item in scope.row.listSelectData" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-input v-else-if="scope.row.type == 'input' " v-model="scope.row.defaultVal" placeholder="请输入内容"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="配置值说明">
        <template scope="scope">
          <span v-if="scope.row.type == 'select' ">{{scope.row.defaultVal |filterDes(scope.row.listSelectData)}}</span>
          <span v-else-if="scope.row.type == 'input' "> {{scope.row.configItemExplain}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="block_buttom">
      <el-button class='btn' type="primary" @click="submit" size="large">提交</el-button>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import eleList from '../../components/ele-list/eleList.vue';
import { urlRedirect } from '../../../api/Utils';
import { getCoreConfig, postCoreConfig } from '../../../api/PlatformService';
import * as ApiConst from '../../../api/ApiConst';

export default {
  name: 'certOrgList',
  components: {
    'ele-list': eleList
  },
  data() {
    return {
      loading: false,
      objectName: '业务规则配置',
      tableData: [{
        configItem: '司机运价填写模式',
        configItemDes: '设置订单、货源、运单、结算单中司机运价填写模式配置',
        configItemKey1: 'webapp.priceMode',
        configItemKey2: '',
        type: 'select',
        defaultVal: 'free',
        listSelectData: [{ value: 'free', label: '手工填写', des: '可直接填写司机运价' }, { value: 'auto', label: '自动计算', des: '司机运价不可填写，自动根据客户运价计算' }],
        configItemExplain: ''
      }, {
        configItem: '平台是否需要合规审查',
        configItemDes: '平台运营商可以对全平台的运单进行合规审查',
        configItemKey1: 'webapp.complianceCheck',
        configItemKey2: '',
        type: 'select',
        defaultVal: 'FALSE',
        listSelectData: [{ value: 'FALSE', label: '否' }, { value: 'TRUE', label: '是' }],
        configItemExplain: ''
      }, {
        configItem: '无车承运人上报地址配置',
        configItemDes: '配置无车承运人上报运单的上报地址',
        configItemKey1: 'service.logink.report.system',
        configItemKey2: 'webapp.reportLocation',
        type: 'select',
        defaultVal: 'china',
        listSelectData: [{ value: 'china', label: '国家', des: '上报接口对接国家无车承运人平台' }, { value: 'shanghai', label: '上海', des: '上报接口对接上海无车承运人平台' }, { value: 'neimenggu', label: '内蒙古', des: '上报接口对接内蒙古无车承运人平台' }, { value: 'rltx', label: '内蒙古（融链天下）', des: '上报接口对接内蒙古无车承运人平台' },{ value: 'jiangsu', label: '江苏', des: '上报接口对接江苏无车承运人平台' }],
        configItemExplain: ''
      }, {
        configItem: '平台是否需要做公司认证控制',
        configItemDes: '平台运营商可以对上平台开展业务的公司做认证状态的控制',
        configItemKey1: 'other.certControl',
        configItemKey2: '',
        type: 'select',
        defaultVal: 'FALSE',
        listSelectData: [{ value: 'FALSE', label: '否', des: '注册完成公司直接可以创建订单、货源、运单' }, { value: 'TRUE', label: '是', des: '只有认证通过的公司才可以创建订单、外包订单、货源、运单' }],
        configItemExplain: ''
      }, {
        configItem: '首页客服电话',
        configItemDes: '配置登陆首页中显示的客服电话',
        configItemKey1: 'webapp.hotline',
        configItemKey2: '',
        type: 'input',
        defaultVal: '',
        listSelectData: [],
        configItemExplain: ''
      }, {
        configItem: '网络备案号',
        configItemDes: '配置登陆首页中显示的网络备案号',
        configItemKey1: 'webapp.ICP',
        configItemKey2: '',
        type: 'input',
        defaultVal: '',
        listSelectData: [],
        configItemExplain: ''
      }, {
        configItem: '运单的跟单人配置',
        configItemDes: '配置平台运单跟单人方案',
        configItemKey1: 'service.waybill.owner.user.config',
        configItemKey2: '',
        type: 'select',
        defaultVal: 'current',
        listSelectData: [{ value: 'current', label: '运单创建人', des: '用户可查看和管理自己创建的运单' }, { value: 'upstream', label: '运单上游单据创建人', des: '创建订单或货源的用户可查看和管理对应订单或货源生成的运单' }],
        configItemExplain: ''
      }, {
        configItem: '司机执行运单方式',
        configItemDes: '定义司机在小程序上执行运单的方式是逐单串行方式还是多单并行方式',
        configItemKey1: 'other.waybillExecutionMode',
        configItemKey2: '',
        type: 'select',
        defaultVal: 'FALSE',
        listSelectData: [{ value: 'FALSE', label: '多单并行方式', des: '可以一次确认和执行多个运单' }, { value: 'TRUE', label: '逐单串行方式', des: '确认某个运单后，必须把该运单的装货和卸货执行完毕后才能执行下一单的确认' }],
        configItemExplain: ''
      }],
      theme: true
    };
  },
  filters: {
    filterDes(val, listSelectData) {
      let res = '';
      if (!val || !listSelectData) {
        return res;
      }
      listSelectData.forEach(item => {
        if (item.value == val) {
          res = item.des;
        }
      })
      return res;
    }
  },
  methods: {
    submit() {
      let parm = {};
      this.tableData.forEach((item, index) => {
        if (item.configItemKey1) {
          parm[item.configItemKey1] = item.defaultVal;
        }
        if (item.configItemKey2) {
          parm[item.configItemKey2] = item.defaultVal;
        }
      })
      parm.secretCode = 'Admin@rltx-config';
      this.loading = true;
      postCoreConfig(parm, (success, error) => {
        this.loading = false;
        if (error) {
          this.$message({
            type: 'error',
            message: error.content,
            duration: 5000
          });
        }
        if (success && success.content) {
          this.tableData.forEach((item, index) => {
            if (success.content[item.configItemKey1]) {
              item.defaultVal = success.content[item.configItemKey1];
            }
          })
          this.$message({
            type: 'success',
            message: '保存成功',
            duration: 5000
          });
        }
      })
    },
    query() {
      let parm = {};
      let properties = '';
      this.tableData.forEach((item, index) => {
        if (item.configItemKey1) {
          if ('webapp.priceMode' == item.configItemKey1) {
            properties = `${properties}${item.configItemKey1}`;
          } else {
            properties = `${properties},${item.configItemKey1}`;
          }
        }
        if (item.configItemKey2) {
          properties = `${properties},${item.configItemKey2}`;
        }
      })
      parm.properties = properties;
      parm.secretCode = 'Admin@rltx-config';
      this.loading = true;
      getCoreConfig(parm, (success, error) => {
        this.loading = false;
        if (error) {
          this.$message({
            type: 'error',
            message: error.content,
            duration: 5000
          });
        }
        if (success && success.content) {
          this.tableData.forEach((item, index) => {
            if (success.content[item.configItemKey1]) {
              item.defaultVal = success.content[item.configItemKey1];
            }
          })
        }
      })
    }
  },
  created() {
    if (this.theme) {
      document.querySelector('body').classList.add('theme-blue');
    }
  },
  mounted() {
    this.query();
  }
};

</script>
<style lang="scss" rel="stylesheet/scss">
@import "../../assets/sass/base.scss";
.list_title {
  overflow: hidden;
  color: #f48400;
  font-size: 16px;
  padding: 10px;
  border: solid 1px #e5e9ef;
  h2 {
    float: left;
  }
}

.block_buttom {
  text-align: center;
  padding: 20px;
  .btn {
    min-width: 240px;
  }
}

</style>
