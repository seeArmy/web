<template>
  <div class="container new-frame clearfix">
    <div class="innerwp">
      <div class="company-cert" id="company_safe_cert">
        <div class="uchd">
          <div class="mwhd clearfix">
            <span class="fr"></span>
            
          </div>
        </div>
        <div class="uc-tablist">
          <div class="uc-main">
            <div class="compverify">

              <div class="verify unverify" id="upload_img_">
                <div>

                  <div class="uploadcerti compcerti pr">
                    <h4 class="verbgtit pa" style="line-height:49px;">营业执照</h4>
                    <ul class="formlist">
                      <li>
                        <div>
                          <p style="margin-top:30px;">发证时间:</p>
                          <el-date-picker v-model="attchmentObj.value1" :disabled="false" id="timeStart" type="date" :picker-options="pickerOption1" placeholder="选择日期"></el-date-picker>
                          <p>截止时间:</p>
                          <el-date-picker v-model="attchmentObj.value2" :disabled="false" id="timeEnd" type="date" :picker-options="pickerOption2" placeholder="选择日期"></el-date-picker>
                        </div>
                        <div class="avatar-uploader-box">
                          <el-upload
                          class="avatar-uploader"
                          :action=actionUrl
                          :show-file-list="false"
                          with-credentials
                          :data=actionParams
                          :disabled="false"
                          :on-success="handleAvatarSuccess"
                          :before-upload="beforeAvatarUpload">
                          <img v-if="attchmentObj.imageUrl" :src="attchmentObj.imageUrl" class="avatar">
                          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                        <p style="margin: -20px 0 0 10px;">请上传jpg,png或者gif图片</p>
                      </div>
                    </li>
                  </ul>

                  <p class="fmnoti">
                    <span class="btn-a-blue fr">
                      <button type="button" class="br3 submit-btn" :disabled="isDisabled" @click="verify()" title="提交公司认证">保存附件</button>
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

</template>

<style>
@import '../safe/verify.css';

.uc-tablist {
  padding: 0px !important;
  padding-left: 10px !important;
}

#fmtit1{
  text-align: left;
}

.submit-btn {
  padding: 0 12px;
  height: 26px;
  line-height: 26px;
  color: #fff;
  border: 0;
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.avatar {
  width: 150px;
  height: 150px;
}
</style>

<script>
import * as apiConst from '../../api/ApiConst';
  // import * as Utils from '../../api/Utils';
  import * as HTTP from '../../api/httpUtil';

  const axios = require('axios');

  axios.defaults.withCredentials = true;

  export default {
    data() {
      const self = this;
      return {
        // imageUrl: '',
        actionUrl: `${apiConst.apiOrgDomain}/fw/image/update`,
        actionParams: {
          type: 'certWeb',
          premission: false
        },
        params: {},
        pickerOption1: {
          disabledDate(date) {
            return date.getTime() > new Date(self.attchmentObj.value2).getTime();
          }
        },
        pickerOption2: {
          disabledDate(date) {
            return date.getTime() < new Date(self.attchmentObj.value1).getTime();
          }
        },
        CertResourceCode:'',
        isDisabled: false,
        verifyStatus: false
      };
    },
    props: {
      attchmentObj:{
       type: Object,
       'default': function () {
        return { 
          value1:'',
          value2:'',
          imageUrl:'',
          code:''}
        }
      }
    },

    methods: {
      handleAvatarSuccess(res, file) {
        console.log(res);
        if (res.code === 200) {
          this.$message({
            message: '营业证书上传成功',
            type: 'success'
          });
          this.params.CertResourceCode = res.content.resourceCode;
          this.CertResourceCode = res.content.resourceCode;
          this.attchmentObj.imageUrl = URL.createObjectURL(file.raw);
        }
      },
      beforeAvatarUpload(file) {
        const isType = file.type === 'image/jpeg' || file.type === 'image/gif' || file.type === 'image/png',
        isLt3M = file.size / 1024 / 1024 < 3;
        if (!isType) {
          this.$message.error('上传头像图片仅限JPG、GIF、PNG格式!');
        }
        if (!isLt3M) {
          this.$message.error('上传头像图片大小不能超过 3MB!');
        }
        return isType && isLt3M;
      },
      verify() {
        const obj = {};
        obj.value1 = this.attchmentObj.value1;
        obj.value2 = this.attchmentObj.value2;
        if(this.CertResourceCode.length>0) obj.attachmentResourceCode = this.CertResourceCode;
        if(this.attchmentObj.code.length>0) obj.code = this.attchmentObj.code;


        if(obj.value1 == '' || obj.value2 == ''){
         this.$message({
          type: 'warning',
          message: '请填写正确信息',
          duration: 1000
        });
         return
       }
      
       if(!obj.attachmentResourceCode  || obj.attachmentResourceCode.length<1){
        if(!obj.code || obj.code.length<1){
         this.$message({
          type: 'warning',
          message: '请填写正确信息',
          duration: 1000
        });
         return
       }
     }
     this.$emit("verify",obj); 

    },
  },
}
</script>
