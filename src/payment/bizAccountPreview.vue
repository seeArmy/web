<template>
  <div id="template" class="form-page">
    <div class="page-header clearfix">
      <h2 class="page-title fl">
       账户一览
      </h2>
      <span class="page-refresh fr" id="pageRefresh">
        <i class="ico-refresh"></i>刷新
      </span>
      <div class="hd-opr fr">
      </div>
    </div>
    <div id="tmp-wrap"></div>
    <el-row v-loading.fullscreen.lock="loading" element-loading-text="加载中">
      <el-form :model="domainObject" ref="domainObject" :inline="false" >
        <div class="block block-box">
          <el-row>
        <el-form-item :label="formfields[0].name">
          <span><big>{{ domainObject[formfields[0].prop] }}</big>&nbsp;&nbsp;</span>
        </el-form-item>
        <el-form-item :label="item.name" v-for="(item, index) in formfields" :key="index" v-if="index > 0">
          <span><big>{{ domainObject[item.prop] | toThousandslsFilter }}</big>&nbsp;元&nbsp;<a href="javascript:;" @click="openWindow(item.url,item.urlName)" :data-url="item.url" v-if="item.url">{{ item.urlName }}</a></span>
        </el-form-item>
          </el-row>
        </div>
      </el-form>
    </el-row>
  </div>
</template>

<script type="text/ecmascript-6">
import { getCompanyAcountInfo } from '../../api/virtualAccount'
import { urlRedirect } from '../../api/Utils';

export default {

  name: 'account-preview',
  data() {
    return {
      domainObject: {},
      loading: false,
      formfields: [
        { prop:'accountName' , name: '企业名称'},
        { prop:'amount' , name: '虚拟账户余额'},
      ]
    }
  },
  methods: {
    init() {
      this.loadingData();
    },
    openWindow(url, title) {
        urlRedirect(url, title);
    },
    loadingData() {
      this.loading = true;
      const obj = JSON.parse(window.localStorage.getItem('userInfo'))
      const params = {
        code: obj.orgCode
      }
      getCompanyAcountInfo(params, (success, err) => {
          if (success && success.code === 200) {
            this.loading = false;
            const { content } = success;
            this.domainObject = Object.assign({}, content);
          }
      })
    }
  },
  mounted() {
    this.init();
  }
}
</script>

<style lang="scss" rel="stylesheet/scss">
@import "../assets/sass/base.scss";

</style>
