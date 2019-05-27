<template>
<div id="qrcode-dialog">
  <el-dialog title="货源二维码查看" :visible.sync="centerDialogVisible" width="30%" center>
    <img src='../../assets/huanneng-erweima.png' alt="" class="img-center">
    <p class='el-dialog-p'>客户: {{domainObject.clientOrgName}}</p>
    <p class='el-dialog-p'>货物: {{domainObject.goodsName}}</p>
    <p class='el-dialog-p' v-if='this.city.name'>运输路线: {{this.city.name}}{{this.county.name}}->{{this.city1.name}}{{this.county1.name}}</p><p v-else>运输线路:</p>
    <p class='el-dialog-p' v-if='domainObject.freightNo'>货源号: {{domainObject.freightNo}}</p><p v-else>货源号:(待生成)</p>
    <img :src="codeImg"  alt="" width="200px" height="200px" v-if='this.domainObject.code' class="img-center">
    <div v-else style='width:300px;height:300px;display: block;margin: 0 auto;'><div class="qrcode"><span>货源小程序二维码待生成</span></div></div>
    <p style='text-align:center;margin-top: 20px;'>微信扫一扫或长按图片识别二维码抢货</p>
  </el-dialog>
</div>
</template>

<script>
import { apiOrgDomain } from '@api/ApiConst'
import * as area from '@api/DataSourceService'

export default {

  name: 'qrcode-dialog',
  data() {
    return {
      projectName: JSON.parse(localStorage.getItem('appInfo')).projectName || '',
      centerDialogVisible: false,
      codeImg: '',
      province:'',
      province1:'',
      city:'',
      city1:'',
      county:'',
      county1:'',
      domainObject: {}
    }
  },
  methods: {
    initData() {
      this.codeImg = ''
      this.province = ''
      this.province1 = ''
      this.city = ''
      this.city1 = ''
      this.county = ''
      this.county1 = ''
      this.domainObject = {}
    },
    showQRcode(row) {
      Object.assign(this.domainObject, row);
      const url = `${apiOrgDomain}/freight/generate_qr_code/string?code=${row.code}`
      this.codeImg = url;
      const self = this;
      this.centerDialogVisible = true;
      if(!row.loadingProvinceCode || !row.unloadingProvinceCode) return false;
      area.province.getData({},(success)=>{
        if(success){
          self.province = success.find(option => option.id == row.loadingProvinceCode);
          self.province1 = success.find(option => option.id == row.unloadingProvinceCode);
          if(self.province){
            area.city.getData({keyword:self.province.id},(success)=>{
            if(success){
                self.city = success.find(option => option.id == row.loadingCityCode);
                if(self.city){
                    area.county.getData({keyword:self.city.id},(success)=>{
                      if(success){
                        self.county = success.find(option => option.id == row.loadingCountyCode);
                      }
                    })
                }

              }
            });
          }
          if(self.province1){
              area.city.getData({keyword:self.province1.id},(success)=>{
            if(success){
              self.city1= success.find(option => option.id == row.unloadingCityCode);
              if(self.city1){
                    area.county.getData({keyword:self.city1.id},(success)=>{
                      if(success){
                        self.county1 = success.find(option => option.id == row.unloadingCountyCode);
                      }
                    })
                }
              }
            });
          }
        }
      })
      this.centerDialogVisible = true;
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss">
#qrcode-dialog {
  .img-center{
    display: block;
    margin: 0 auto;
  }
  .el-dialog-p{
    margin : 10px 0 ;
  }
  .el-dialog-span{
    margin-bottom: 5px;
    display: inline-block;
  }
  .el-dialog__body{
    max-height:100% !important;
    min-height: auto;
    padding: 10px 20px 50px !important;
  }
  .el-dialog--small {
    width: 400px;
  }

  .qrcode{
    width: 200px;
    height: 200px;
    border: 1px dashed black;
    border-radius: 100%;
    text-align: center;
    line-height: 200px;
    margin: 20px auto 0;
  }
}
</style>

