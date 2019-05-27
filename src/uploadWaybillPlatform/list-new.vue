/**
* list.vue
* 上报运单列表
* Created by zhangjiwei on 18/2/3
*/
<template>
  <div>
    <div class="list-title">
      <span>运单上报列表</span>
      <div class="fr">
        <el-button>刷新</el-button>
        <el-button>新建运单上报</el-button>
        <el-button>导入运单上报</el-button>
        <el-button>下载模板</el-button>
      </div>
    </div>
    <div class="list-filter">
      <el-form :inline="true" :model="searchFields" class="demo-form-inline">

        <el-button>批量上报</el-button>
        <el-button>批量校验</el-button>
        <div class="fr">
          <el-form-item label="车牌号">
            <el-input v-model="searchFields.user" placeholder="请输入车牌号"></el-input>
          </el-form-item>
          <el-form-item label="运单号">
            <el-input v-model="searchFields.user" placeholder="请输入运单号"></el-input>
          </el-form-item>

          <el-form-item label="上报状态">
            <el-select v-model="searchFields.region">
              <el-option label="请选择" value="shanghai"></el-option>
              <el-option label="已上报" value="shanghai"></el-option>
              <el-option label="未上报" value="beijing"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="onSubmit">搜索</el-button>
            <el-button type="primary" @click="onSubmit">重置</el-button>
            <el-button type="primary" @click="onSubmit">高级搜索</el-button>
          </el-form-item>

        </div>
      </el-form>
    </div>
    <el-table :data="tableData" border style="width: 100%" fit>
      <el-table-column type="selection"   width="55" @selection-change="handleSelectionChange"/>
      <el-table-column fixed label="操作" width="120">
        <template scope="scope">
          <el-dropdown split-button type="primary" size="small" @click="handleActionClick">
            编辑
            <el-dropdown-menu slot="dropdown" size="small">
              <el-dropdown-item>黄金糕</el-dropdown-item>
              <el-dropdown-item>狮子头</el-dropdown-item>
              <el-dropdown-item>螺蛳粉</el-dropdown-item>
              <el-dropdown-item>双皮奶</el-dropdown-item>
              <el-dropdown-item>蚵仔煎</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>

      </el-table-column>

      <el-table-column prop="date" label="运单号" width="200">
      </el-table-column>
      <el-table-column prop="name" label="车辆校验状态"  width="200"/>
      <el-table-column prop="date" label="校验时间"  :formatter="dateFormatter('yyyy-MM-dd hh:mm:ss')" width="200"/>
      <el-table-column prop="isValid" label="上报状态"   :formatter="booleanFormatter" width="200"/>
      <el-table-column prop="address" label="货币总金额"  width="200"/>
      <el-table-column prop="zip" label="车牌号"  width="200"/>
      <el-table-column label="牌照类型"  width="200"/>
      <el-table-column   label="车型"  width="200"/>
      <el-table-column   label="载重"  width="200"/>
      <el-table-column   label="道路运输证号（车辆的）"  width="200"/>
      <el-table-column   label="来源订单"  width="200"/>
      <el-table-column   label="货物名称"  width="200"/>
      <el-table-column   label="货物类型"  width="200"/>
      <el-table-column   label="发货地"  width="200"/>
      <el-table-column   label="收货地"  width="200"/>
      <el-table-column   label="业务类型"  width="200"/>
      <el-table-column   label="托运时间"  width="200"/>
      <el-table-column   label="发货时间"  width="200"/>
      <el-table-column   label="收货时间"  width="200"/>
      <el-table-column   label="货物毛重"  width="200"/>
      <el-table-column   label="承运人"  width="200"/>
      <el-table-column   label="物流交换代码"  width="200"/>
      <el-table-column   label="发货人"  width="200"/>
      <el-table-column   label="个人证件号"  width="200"/>
      <el-table-column   label="收货人"  width="200"/>
      <el-table-column   label="车辆所有人"  width="200"/>
      <el-table-column   label="司机姓名"  width="200"/>
      <el-table-column   label="挂车牌号"  width="200"/>
      <el-table-column   label="体积"  width="200"/>
      <el-table-column   label="总件数"  width="200"/>
      <el-table-column   label="运输经营许可证"  width="200"/>
      <el-table-column   label="信用代码"  width="200"/>
      <el-table-column   label="道路运输证号"  width="200"/>
      <el-table-column   label="手机号"  width="200"/>
      <el-table-column   label="从业资格证号"  width="200"/>
      <el-table-column   label="发货地址"  width="200"/>
      <el-table-column   label="收货地址"  width="200"/>
      <el-table-column   label="上报备注"  width="200"/>
      <el-table-column   label="自由文本"  width="200"/>
      <el-table-column   label="创建时间"  width="200"/>
      <el-table-column   label="上报人"  width="200"/>
      <el-table-column   label="上报时间"  width="200"/>
    </el-table>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="3"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400">
      </el-pagination>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {urlRedirect} from '../../api/Utils';
  import * as ApiConst from '../../api/ApiConst';
  export default {
    name: 'uploadWaybill',
    components: {
    },
    props: {

    },
    data: () => {
      return {
        searchFields:{

        },
        multipleSelection:[],
        tableData: [{
          isValid:1,
          date: '2016-05-03',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          isValid:1,
          date: '2016-05-02',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }],

      };
    },
    methods: {
      ...require('../common/TableCellFormatter.js'),    // 导入所有的tableCellFormatter.
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleActionClick(val){

      },
      onSubmit(){

      },
      handleCurrentChange(){

      },
      handleSizeChange(){}
    },
    created() {
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  .el-dialog__body {
    .complex-control-2 {
      .innerblock {
        width: 110px;
      }
    }
    .form-page .el-row .el-col-12:nth-child(6n), .form-page .el-row .el-col-12:nth-child(6n-1) {
      margin-bottom: 0;
      border-bottom: 0;
    }
  }
</style>

