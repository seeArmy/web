/*
 * url is /message/index.html?messageType={1~18}
 */
<template>
  <div id="message-list">
    <ele-list
      ref="eleList"
      :object-name="objectName"
      :is-hide="false"
      :is-advanced="true"
      :showminiSearch="false"
      :need-full-search="false"
      :selectable="true"
      :operatable="false"
      :need-add="false"
      :showImportButton="false"
      :showDownloadTemplate="false"
      :show-export-button="false"
      :needPage="true"
      :total="total"
      :loading="loading"
      :list-data="listData"
      :customColumn="customColumn"
      :params="params"
      :getColumn="getColumn"
      @query="query"
      @customAction="handleAction"
    >
    <span slot="funArea">
      <el-button @click="handleready(1)">设为已读</el-button>
      <el-button @click="handleready(0)">恢复未读</el-button>
      <el-button @click="handleready(2)">删除</el-button>
    </span>
    </ele-list>
  </div>
</template>
<script type="text/ecmascript-6">
import eleList from '@/components/v3/ele-table/eleList.vue';
import { msgLst, msgStatus } from '../../api/MessageService'
import { getParamsFromURL, urlRedirect } from '../../api/Utils'
import * as ApiConst from '../../api/ApiConst';

export default {
  name: 'message-list',
  components: {
    eleList
  },
  computed:{

  },
  data: () => {
    return {
      total: 0,
      params: {},
      loading: false,
      listData: [],
      customColumn: [],
      objectName: '消息',
      messageType: 0,
      messageTypeSet: {
        1: '询报价异常',
        2: '订单异常',
        3: '运输过程异常',
        4: '结算异常',
        5: '车辆离线异常',
        6: '车辆停留异常',
        7: '车辆超速异常',
        8: '询报价消息',
        9: '订单信息',
       10: '企业对账消息',
       11: '公司证件消息',
       12: '个人证件消息',
       13: '车辆证件消息',
       14: '合同消息',

       15: '公司认证消息',
       16: '车辆认证消息',
       17: '司机认证消息',
      },
      pageType: {
        1: { title: '派车通知', url: '/waybill/add.html?editable=false&'},
        2: { title: '发布货源通知', url: '/freight/add.html?editable=false&'},
        3: { title: '司机认证', url: '/platform/cert_person/approval.html?editable=false&'},
        4: { title: '车辆认证', url: '/platform/cert_truck/approval.html?editable=false&'},
        5: { title: '发货通知', url: '/waybill/add.html?editable=false&'},
        6: { title: '收货通知', url: '/waybill/add.html?editable=false&'},
        7: { title: '线上支付', url: '/paybill/list.html&'},
      },
      pageJump: {
          3: { title: '公司认证', url: '/platform/cert_org/approval.html?editable=false&isShow=true&' },
          4: { title: '车辆认证', url: '/platform/cert_truck/approval.html?editable=false&isShow=true&' },
          5: { title: '司机认证', url: '/platform/cert_person/approval.html?editable=false&isShow=true&' }
      }
    }
  },
  methods: {
    handleAction(actionName, item) {
      // this page only one action name like orderType
      if(item.messageSort) {
        var title = this.pageJump[item.messageSort].title,
          url = `${this.pageJump[item.messageSort].url}code=${item.orderNumber}`
        if(item.messageSort == 3) {
          url = url + `&orgCode=${item.orderNumber}`
        }
        console.log(url)
        urlRedirect(url, title)
      }
    },
    query(params) {
      const query = {
        messageType: this.messageType,
      }
      this.loading = true
      msgLst(Object.assign(query, params),(success,error) => {
        if(success) {
          this.$set(this, 'listData', success.content)
          this.$set(this, 'total', success.total)
          this.loading = false
        }
        if(error) {
          this.loading = false
        }
      })
    },
    handleready(k) {
      const selectcodes = []
      this.listData.forEach((item) => {
        if(item.checked) {
          selectcodes.push(item.id)
        }
      })
      if(selectcodes.length === 0) {
        this.$message({
          type: 'warning',
          message: '未选中一条记录',
          duration: 3000
        })
      }
      if(selectcodes.length > 0) {
        const query = {
          messageType: this.messageType,
          id: selectcodes,
          status: k
        }
        msgStatus(query,(success,error) => {
          if(success) {
            const { data } = success
            this.$message({
              type: 'success',
              message: '消息状态修改成功',
              duration: 3000
            })
            this.$refs['eleList'].dispatchQueryEvent('fromSearch')
          }
        })
      }
    },
    getColumn(cb) {
      const ret = {
        "code": 200,
        "content": [{
          "showName": "状态",
          "elementCode": "label",
          "extraParams": "{\"field1\":\"status\",\"optionsValue1\":[\"0\",\"1\",\"2\"],\"options1\":[\"未读\",\"已读\",\"删除\"]\}",
          "extraStyles": "{\"0\":{\"color\":\"red\"}\}",
          "fieldConfigCode": "status"
        },
        // ,{
        //   "showName": "类型",
        //   "elementCode": "label",
        //   "extraParams": "{\"field1\":\"messageType\",\"optionsValue1\":[\"1\",\"2\",\"3\",\"4\",\"5\",\"6\",\"7\",\"8\",\"9\",\"10\",\"11\",\"12\",\"13\",\"14\",\"15\",\"16\",\"17\",\"18\"],\"options1\":[\"业务异常提醒\",\"询报价异常\",\"订单异常\",\"运输过程异常\",\"结算异常\",\"设备异常提醒\",\"车辆离线异常\",\"车辆停留异常\",\"车辆超速异常\",\"业务待办提醒\",\"询报价消息\",\"订单信息\",\"企业对账消息\",\"文件提醒\",\"公司证件消息\",\"个人证件消息\",\"车辆证件消息\",\"合同消息\"]\}",
        //   "fieldConfigCode": "messageType"
        // },
        // messageSort
        // ,{
        //   "showName": "类型",
        //   "elementCode": "label",
        //   "extraParams": "{\"field1\":\"messageType\",\"optionsValue1\":[\"1\",\"2\",\"3\",\"4\",\"5\",\"6\",\"7\",\"8\",\"9\",\"10\",\"11\",\"12\",\"13\",\"14\"],\"options1\":[\"询报价异常\",\"订单异常\",\"运输过程异常\",\"结算异常\",\"车辆离线异常\",\"车辆停留异常\",\"车辆超速异常\",\"询报价消息\",\"订单信息\",\"企业对账消息\",\"公司证件消息\",\"个人证件消息\",\"车辆证件消息\",\"合同消息\"]\}",
        //   "fieldConfigCode": "messageType"
        // },
        {
          "showName": "类型",
          "elementCode": "text",
          "extraParams": "{\"field1\":\"messageSortName\",\"placeholder1\":\"请输入\"}",
          "fieldConfigCode": "messageSortName"
        },
        {
          "showName": "询价单号",
          "elementCode": "text",
          "extraParams": "{\"field1\":\"description\",\"placeholder1\":\"请输入\"}",
          "fieldConfigCode": "description",
          "customActionName": "orderType"
        },{
          "showName": "消息内容",
          "elementCode": "text",
          "extraParams": "{\"field1\":\"message\",\"placeholder1\":\"请输入\"}",
          "fieldConfigCode": "message"
        },{
          "showName": "消息接收时间",
          "elementCode": "text",
          "extraParams": "{\"field1\":\"createTime\",\"placeholder1\":\"请输入\"}",
          "fieldConfigCode": "createTime"
        }]
      }
      if(this.messageType == 15) {
        ret.content[2]['showName'] = '公司';
        ret.content[2].elementCode = 'pop';
        ret.content[2].extendParams = "{\"detailLink\":[{\"key\":\"orgCode\",\"params\":\"orderNumber\"}],\"detailLinkUrl\":\"/partner/add.html?editable=false\",\"detailTitle\":\"clientOrgName\",\"detailTitle1\":\"伙伴详情\"}";

      }
      if(this.messageType == 16) {
        ret.content[2]['showName'] = '车辆';
        ret.content[2].elementCode = 'pop';
        ret.content[2].extendParams = "{\"detailLink\":[{\"key\":\"truckCode\",\"params\":\"orderNumber\"}],\"detailLinkUrl\":\"/truck/add.html?editable=false\",\"detailTitle\":\"clientOrgName\",\"detailTitle1\":\"车辆详情\"}";
      }
      if(this.messageType == 17) {
        ret.content[2]['showName'] = '司机';
        ret.content[2].elementCode = 'pop';
        ret.content[2].extendParams = "{\"detailLink\":[{\"key\":\"userCode\",\"params\":\"orderNumber\"}],\"detailLinkUrl\":\"/driver/add.html?editable=false\",\"detailTitle\":\"clientOrgName\",\"detailTitle1\":\"司机详情\"}";
      }
      cb(ret, null)
    },
  },
  mounted() {
    this.$refs['eleList'].dispatchQueryEvent('fromSearch')
  },
  created() {
    const params = getParamsFromURL(window.location.search)
    if(params.messageType) {
      this.messageType = params.messageType || 0
      this.objectName = this.messageTypeSet[this.messageType] || '未知消息类型'
    }
  }
};

</script>
<style lang="scss" rel="stylesheet/scss">

#message-list{
  .rl-fix-table th, .rl-fix-table td{
  max-width: none;
  }
}

</style>
