<template>
<div>
  <ele-list :selectable="false" :operatable="true" :customAdd="true" :customAddName="'添加配置'"
    @query="query" @ready="query" @action="action"
    :autoRefresh="false" :autoRefreshTimer="30"
    :total="total" :loading="loading"
    :list-data="listData"
    ref="eleList"
    :needPage="true"
    :showExportButton="false"
    :showImportButton="false"
    :showDownloadTemplate="false"
    :showminiSearch="false"
    :getColumn="getColumn"
    :objectName="'链金师参数配置'">
  </ele-list>

  <config-dialog ref="configdialog" @loadingData="query" />

</div>
</template>
<script type="text/ecmascript-6">
import { list, doActive } from '../../api/LjsService'
import eleList from '../components/ele-list/eleList.vue'
import ConfigDialog from './components/configDialog'

export default {
  name: 'settings',
  components: {
    eleList,
    ConfigDialog
  },
  data() {
    return {
      loading:false,
      listData:[],
      activeName:'基础设置',
      total: 0,
      params: {},
      configParams: {}
    };
  },
  methods: {
    action(command, menu, model) {
      switch (command) {
        case 'add':
          this.$refs['configdialog'].init({})
          break;
        case 'edit':
          this.$refs['configdialog'].init(model)
          break;
        case 'doactive':
          this.handleActive(model)
          break;
        default:
          break;
      }
    },
    query(searchParams) {
      // Object.assign(searchParams, this.params);
      const self = this,
        query = {
          page: 1,
          size: 20
        }
      self.total = 0;
      self.loading = true;
      self.listData = [];
      list(query, (success, error) => {
        if (error) {
          this.$message({
            type: 'error',
            message: error.content,
            duration: 5000
          });
          this.loading = false;
        }
        if (success) {
          this.total = success.total;
            success.content.forEach((data) => {
              const actionList = [];
              actionList.push({ key: 'edit', name: '修改参数' })
              if(data.isActive === 0) {
                actionList.push({ key: 'doactive', name: '激活' })
              }
              // else {
                // actionList.push({ key: 'doactive', name: '禁用' })
              // }
              data.actionMenuList = actionList;
            });
            self.listData = success.content;
            this.loading = false;
          }
        });
    },
    handleActive(item) {
      const h = this.$createElement
      this.$msgbox({
        title: '消息',
        message: h('p', null, [h('span', null, item.isActive === 0 ? '确认激活？' : '确认禁用？')]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = '执行中...';
            const query = {
              id: item.id,
              isActive: item.isActive === 0 ? "1" : "0"
            }
            doActive(query,(success,error) => {
              if(error) {
                this.$message({
                  type: 'error',
                  message: error.content,
                  duration: 5000
                })
              }
              if(success) {
                this.$message({
                  type: 'success',
                  message: '更新成功',
                  duration: 2000
                })
                this.query()
              }
              done()
              instance.confirmButtonLoading = false;
            })
          } else {
            done();
          }
        }
      }).then(() => {

      });



    },
    getColumn(cb){
      const result = {
        "code": 200,
        "content": [{
          "showName": "是否激活",
          "elementCode": "select",
          "extraParams": "{\"field1\":\"isActive\",\"optionsValue1\":[\"1\",\"0\"],\"options1\":[\"激活\",\"未激活\"]\}",
          "fieldConfigCode": "isActive"
        },{
          "showName": "企业名称",
          "elementCode": "text",
          "extraParams": "{\"field1\":\"orgName\",\"placeholder1\":\"orgName\"}",
          "fieldConfigCode": "orgName"
        },{
          "showName": "链金师APP ID",
          "elementCode": "text",
          "extraParams": "{\"field1\":\"appId\",\"placeholder1\":\"appId\"}",
          "fieldConfigCode": "appId"
        },{
          "showName": "企业组织编码",
          "elementCode": "text",
          "extraParams": "{\"field1\":\"orgCode\",\"placeholder1\":\"orgCode\"}",
          "fieldConfigCode": "orgCode"
        },{
          "showName": "链金师核心企业auid",
          "elementCode": "text",
          "extraParams": "{\"field1\":\"ljsCoreAuid\",\"placeholder1\":\"ljsCoreAuid\"}",
          "fieldConfigCode": "ljsCoreAuid"
        },{
          "showName": "数金开放平台密钥ID",
          "elementCode": "text",
          "extraParams": "{\"field1\":\"keyId\",\"placeholder1\":\"keyId\"}",
          "fieldConfigCode": "keyId"
        },{
          "showName": "数金开放平台开发者私有密钥",
          "elementCode": "text",
          "extraParams": "{\"field1\":\"priKey\",\"placeholder1\":\"priKey\"}",
          "fieldConfigCode": "priKey"
        },{
          "showName": "是否开发环境",
          "elementCode": "select",
          "extraParams": "{\"field1\":\"isDev\",\"optionsValue1\":[\"1\",\"0\"],\"options1\":[\"开发环境\",\"非开发环境\"]\}",
          "fieldConfigCode": "isDev"
        },{
          "showName": "备注",
          "elementCode": "text",
          "extraParams": "{\"field1\":\"remark\",\"placeholder1\":\"remark\"}",
          "fieldConfigCode": "remark"
        }]
      }
      cb(result,null)
    },

  },
  created() {

  }
};

</script>
<style lang="scss" rel="stylesheet/scss">

</style>
