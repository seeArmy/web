<template>
<div class="container new-frame clearfix">
    <div class="innerwp brb">
        <div class="mainwrapper">
			    <div class="member-verify">
			        <div class="uchd">
			            <div class="mwhd"> <span class="fr"></span>
			                <h2 class="mwtit">会员认证</h2>
			            </div>
			        </div>
			        <!-- verify section -->
			        <div class="verify-section">
			            <div class="real-verify">
			                <div id="verify1" v-if="certStatus === 'unauthenticated' || certStatus === 'failed'">
			                    <dl class="vertype clearfix">
			                        <dt>
			                            <i class="ico-company"></i>公司认证
			                        </dt>
			                        <dd>
			                            <h4 class="ftorange">（需提供公司营业执照）</h4>
			                            <p>认证后，可管理公司人员和组织结构，并进行完整供应链管理</p>
			                        </dd>
			                        <dd class="operate">
			                            <span class="btn-a-white">
			                            	<a href="javascript:;" class="blue" id="verifyAction" data-link="/safe/verify.html" data-title="公司认证">立即认证</a>
			                            </span>
			                        </dd>
			                    </dl>
			                </div>
			                <div id="verify2" class="company-verifying" v-if="certStatus === 'authenticating'">
			                    <p class="vrf clearfix"><i class="ico-company cying"></i><strong class="org">公司实名认证，正在审核中……</strong></p>
			                    <div class="verify-info">
			                        <dl class="cominfo clearfix">
			                            <dt>公司名称：</dt>
			                            <dd class="orgName">{{ orgName }}</dd>
			                        </dl>
			                        <dl class="cominfo clearfix">
			                            <dt>公司全称：</dt>
			                            <dd class="orgFullName">{{ orgFullName }}</dd>
			                        </dl>
			                        <dl class="cominfo clearfix">
			                            <dt>申请人姓名：</dt>
			                            <dd>{{ userName }}<i class="icon i24-16 ico-perved ml10"></i></dd>
			                        </dl>
			                        <dl class="cominfo clearfix">
			                            <dt>申请认证时间：</dt>
			                            <dd>{{ verifyTime }}</dd>
			                        </dl>
			                    </div>
			                </div>
			                <div id="verify3" class="company-verifyed pr" v-if="certStatus === 'authenticated'">
			                    <i class="cvcerted pa" title="公司实名认证成功"></i>
			                    <p class="vrf clearfix"><i class="ico-company cyed"></i><strong class="ftgreen">公司实名认证已通过！</strong></p>
			                    <div class="verify-info">
			                        <dl class="cominfo clearfix">
			                            <dt>公司名称：</dt>
			                            <dd class="orgName">{{ orgName }}</dd>
			                        </dl>
			                        <dl class="cominfo clearfix">
			                            <dt>公司全称：</dt>
			                            <dd class="orgFullName">{{ orgFullName }}</dd>
			                        </dl>
			                        <dl class="cominfo clearfix">
			                            <dt>申请人姓名：</dt>
			                            <dd>{{ userName }}<i class="icon i24-16 ico-perved ml10"></i></dd>
			                        </dl>
			                        <dl class="cominfo clearfix">
			                            <dt>申请认证时间：</dt>
			                            <dd>{{ verifyTime }}</dd>
			                        </dl>
			                    </div>
			                </div>
			            </div>
			        </div>
			    </div>
        </div>
    </div>
</div>
</template>

<script type="text/ecmascript-6">
import * as VerifyService from '../../api/VerifyService';

export default {
  data() {
    return {
      certStatus: '',
      orgName: '',
      orgFullName: '',
      userName: '',
      verifyTime: '',
      theme: true
    };
  },
  created() {
    if (this.theme) {
      document.querySelector('body').classList.add('theme-blue');
    }
    VerifyService.verifyInfo((success, error) => {
      if (success) {
        const data = success.content;
        this.certStatus = data.certStatus;
        this.orgName = data.orgName;
        this.orgFullName = data.orgFullName;
        this.userName = data.updateUsername;
        this.verifyTime = data.updateTime;
      }
      if (error) {
        console.error(error);
      }
    });
  }
};
</script>

<style lang="scss" rel="stylesheet/scss">
  @import './cert.css';
</style>

