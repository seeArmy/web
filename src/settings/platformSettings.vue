<template>
  <div>
    <h1><i class="el-icon-setting"></i>系统设置</h1>

    <el-tabs v-model="activeName">
      <el-tab-pane v-for="(val, key, tabIndex) in tabData" :key="'tab'+tabIndex" :label="key" :name="key" >
        <el-form label-position="top" label-width="250px">
          <el-row  :gutter="50">
            <el-col :span="8" v-for="(item, index) in val" :key="index" style="height:100px;">
              <el-form-item :label="item.paramKey +'('+item.paramComment +')'">
                <el-input v-model="item.paramVal"></el-input>
                <p></p>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <div>
      <el-button type="primary" @click="saveSettings()" :loading="loading">保存设置</el-button>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  const axios = require('axios');
  const baseDomain= require('../../api/ApiConst').BaseDomain;

  axios.defaults.withCredentials = true;

export default {
  name: 'settings',

  data() {
    return {
      loading:false,
      settingsList:[],
      tabData:{'基础设置':[]},
      activeName:'基础设置'
    };
  },
  methods: {
    saveSettings(){
      this.loading=true;
      var data ={};
      this.settingsList.forEach(item=>{
          data[item.paramKey]=item.paramVal;
      })
      axios.post(`${baseDomain}/platform/platform/core/config`,data).then(resp=> {
        this.loading=false;
        if(Object.keys(resp.data).length>10){
            this.$message.success("修改成功！");
        }else{
            this.$message.error("修改失败！请稍后重试");
        }
      }).catch(err=>{
        this.loading=false;
        this.$message.error("修改失败！请稍后重试:"+err);
      })
    }
  },
  created() {

      axios.get(`${baseDomain}/platform/platform/getAllSettings`).then(resp=>{
         this.settingsList=resp.data.content;
         resp.data.content.forEach(item=>{
             var group = item.paramGroup;
             if(!group) {group = '基础设置'}
             var groupData = this.tabData[group];
             if(!groupData){
               groupData=[];
               this.tabData[group]=groupData;
             }
             groupData.push(item);
         })
      })
  }
};

</script>
<style lang="scss" rel="stylesheet/scss">

</style>
