<template>
  <div class="form-page">
    <div class="company-head">
      <img :src=companyData.img alt="">
      <span>{{companyData.fullName}}</span>
    </div>
    <div class="page-header clearfix">
      <h2 class="page-title fl">
        线下保单查看
      </h2>
       <span id="pageRefresh" class="page-refresh fr"><i class="ico-refresh"></i>刷新</span>
    </div>
    <div class="verify-status">
      <div class="vs-section clearfix">
          <el-row>
            <el-col :span="24">
                <span class="name">线下保单ID:</span>
                <span class="value">
                  {{insurancePolicy.insuranceNo}}
                </span>
             </el-col>
             <el-col :span="12">
                <span class="name">保险产品名称:</span>
                <span class="value">
                  {{insurancePolicy.insuranceProductName}}
                </span>
             </el-col>
             <el-col :span="12">
                <span class="name">保险公司名称:</span>
                <span class="value">
                  {{insurancePolicy.insuranceCompanyName}}
                </span>
             </el-col>
             <el-col :span="12">
                <span class="name">保险单号:</span>
                <span class="value">
                  {{insurancePolicy.insurancePolicyNo}}
                </span>
             </el-col>
             <el-col :span="12">
                <span class="name">开始日期:</span>
                <span class="value">
                  {{insurancePolicy.startTime}}
                </span>
             </el-col>
             <el-col :span="12">
                <span class="name">截至日期:</span>
                <span class="value">
                  {{insurancePolicy.endTime}}
                </span>
             </el-col>
             <el-col :span="24">
                <span class="name">备注:</span>
                <span class="value">
                  {{insurancePolicy.description}}
                </span>
             </el-col>
            <el-col :span="24" class="el-col-auto">
                <span class="name">保险单文件:</span>
                <span class="attachmen">
                  <span class="value" v-for="item in tempInsuranceAttachment">
                    <a :href='item.url'><span>{{item.originalName}}</span></a>
                 </span>
                </span>       
             </el-col>
           </el-row>
      </div>
    </div>
    <div class="page-footer">
      <p>数据来源: {{companyData.name}} {{companyData.webLink}}</p>
      <P>{{companyData.fullName}}</P>
    </div>
  </div>
</template>

<script>
import * as ApiConst from '../../api/ApiConst';
import { getPage ,getFile} from '../../api/insurancePolicyService.';
import * as HTTP from '../../api/httpUtil';
import * as utils from '../../api/Utils';
const axios = require('axios');

axios.defaults.withCredentials = true;

export default {
  data() {
    return {
      theme: true,
      code:utils.getParamsFromURL(window.location.search).code,
      companyData:{
        img:null,
        fullName:null,
        name:null,
        webLink:null,
      },
      insurancePolicy:{
        insuranceNo:null,
        insuranceProductName:null,
        insurancePolicyNo:null,
        insuranceCompanyName: null,
        insuranceAttachment:null,
        startTime:null,
        endTime:null,
        description:null,
        originalName:null,
       },
       dateFormat: 'yyyy-MM-dd',  
       tempInsuranceAttachment:[]
    };
  },
  methods: {
   
  },
  created() {
    if (this.theme) {
      document.querySelector('body').classList.add('theme-blue');
    }
    const that = this;
    //获取平台信息
    HTTP.get(
      `${ApiConst.apiPlatformDomain}/platform/core/config/webapp`,
      {},
      (success, error) => {
        if (success && success.content) {
          that.companyData.img =  success.content['webapp.platformLogoUrl'];
          that.companyData.fullName = success.content['webapp.company'];
          that.companyData.name = success.content['webapp.appName'];
          that.companyData.webLink = success.content['webapp.appDomain'];
        }
        if (error) {
          console.error(error);
        }
      }
    );
    //获取线下保单详情
    if(this.code){
        getPage({code:this.code},(success,error)=>{
          if(success){
            this.insurancePolicy.insuranceNo = success.content.insuranceNo;
            this.insurancePolicy.insuranceProductName = success.content.insuranceProductName;
            this.insurancePolicy.insurancePolicyNo = success.content.insurancePolicyNo;
            this.insurancePolicy.insuranceCompanyName = success.content.insuranceCompanyName;
            // this.insurancePolicy.insuranceAttachment = success.content.insuranceAttachment;
            this.insurancePolicy.startTime = success.content.startTime.substring(0, 10);
            this.insurancePolicy.endTime = success.content.endTime.substring(0, 10);
            this.insurancePolicy.description = success.content.description;
            if(success.content.insuranceAttachment){
              this.insurancePolicy.insuranceAttachment = success.content.insuranceAttachment.split(':')
            }
            this.insurancePolicy.insuranceAttachment.forEach(item => {
               getFile({resourceCode:item},(res,eor)=>{
                 if(res){
                   that.tempInsuranceAttachment.push({originalName:res.content.originalName,url:res.content.url});
                 }
              })
            });
           
          }
          if(error){

          }
      })
    }
   
  }
};
</script>


<style lang="scss" rel="stylesheet/scss">
@import "../assets/sass/base.scss";
@import "./info";
</style>
