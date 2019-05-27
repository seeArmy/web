/**
* ele-progress-dialog.vue
* Created by zhangjiwei on 17/11/24.
*/
<template>
  <div v-show="isShow" class="progress-dialog-bg">
    <div class="progress-dialog">
      <div class="el-dialog__header">
        <span class="el-dialog__title">{{ title }}</span>
        <button type="button" class="el-dialog__headerbtn" @click="close"><i class="el-dialog__close el-icon el-icon-close"></i></button>
      </div>
      <div class="content">
        <el-progress :percentage="percentage" :text-inside="true" :stroke-width="18"></el-progress>
        <div v-html="msg" class="body-msg"></div>
        <div class="body-msg" v-if="errorNum > 0">
          <el-button type="primary" @click="downError()">下载错误记录</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {progress}  from 'element-ui';

  export default {
    data(){
        return {
            isShow:false
        }
    },

    methods:{
      show(){
        this.isShow = true;
      },
      close(){
        this.isShow= false;
        if(this.onClose){
            this.onClose();
        }
      },
      downError() {
        this.$emit('downError');
      }
    },
    props: {
      title:null,
      percentage:null,
      msg:'',
      onClose:null,
      errorNum: {
        type: Number,
        default: 0
      }
    },
    components: {
      'el-progress':progress
    },
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  .progress-dialog-bg {
    position: fixed;
    z-index: 8888;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(255,255,255,.7);
  }
  .progress-dialog{
    position: fixed;
    z-index: 9999;
    width: 50%;
    min-height: 200px;
    max-height: 240px;
    margin: auto;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    box-sizing: border-box;
    background-color: #fff;
    box-shadow: 0 0 10px 3px rgba(0,0,0,.2);
  }
  .content{
    padding: 50px;
  }
  .body-msg{margin-top:20px;text-align:center}
  .progress-dialog h3{text-align:center;}
</style>
