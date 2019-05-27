/**
* add.vue
* Created by cc on 17/12/18.
*/
<template>
  <div>
    <div class="form-page">
        <transport-layout :isEdit="isEdit" :editable="editable" :objectName="objectName">

          <user-match ref="userMatch" v-show="editable && !isEdit" @loadUser="loadUser" slot="userMatch"></user-match>

          <show-image ref="showImage" slot="showImage" @delImg="delImg" :imageUrl="imageUrl"></show-image>

          <cert-truck ref="certTruck" slot="certTruck" :isShow="false"
          @showImageOutside="showImageOutside" @previewImageOutside="previewImageOutside" @loadFirstOutside="loadFirstOutside"></cert-truck>

          <cert-person ref="certPerson" slot="certPerson" :isShow="false"
          @showImageOutside="showImageOutside" @previewImageOutside="previewImageOutside"></cert-person>

          <el-button type="primary" @click="buttonApproval()" size="large" slot="buttonApproval" :disabled="btnDisabled">提交保存</el-button>
          <el-button @click="resetForm()" size="large" slot="buttonReset" :disabled="btnDisabled">重置</el-button>

        </transport-layout>

    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  import transportLayout from './transportLayout.vue';

  import userMatch from './userMatch.vue';
  import showImage from './showImage.vue';
  import certTruck from '../certTruck/approval.vue';
  import certPerson from '../certPerson/approval.vue';

  import ApiConst from '../../../api/ApiConst';
  import * as utils from '../../../api/Utils';

  export default {
    components: {
      'transport-layout': transportLayout,
      'user-match': userMatch,
      'show-image': showImage,
      'cert-truck': certTruck,
      'cert-person': certPerson
    },
    data() {
      return {
        objectName: '人车现场认证',
        // configUrl: `${ApiConst.apiPlatformDomain}/detail_render_info/longSettle/list`,
        domainObject: {},
        // addFun: PlatformService.add,
        // editFun: PlatformService.edit,
        // getInfo: PlatformService.get,
        // uploadUrl: ApiConst.apiPlatformDomain,
        // logType: 'settle',
        // listUrl: '/waybillCustom/settleList.html',
        // listTitle: '单车结算列表',
        status: false,
        fields: [],
        inputKey: [],
        code: '',
        isEdit: false, // 控制编辑添加按钮
        editable: true, // 控制页面状态
        btnDisabled: false,
        // changeLogParams: {
        //   waybillCode: utils.getParamsFromURL(window.location.search).code,
        //   size: 10
        // },
        // loading: true,
        imageUrl: '',
        imgShowField: '',
        imgFrom: ''
      };
    },
    methods: {
      delImg(url) {
        console.log('删除的图片url为', url);
        console.log('字段field为', this.imgShowField);
        // 获取组件显示图片list数据attachmentList
        const imgField = this.$refs[this.imgFrom].$refs.form.getElementByField(this.imgShowField),
          imgArray = imgField.attachmentList;
        console.log('imgField is', imgField, imgArray);
        imgArray.forEach((data, index) => {
          const imgUrl = data.response ? data.response.content.thumbnailList[0].url : data.url;
          if (imgUrl === url) {
            console.log('okay you got me', index, data, imgUrl);
            imgArray.splice(index, 1);
            imgField._onRemove(data, imgArray);
            console.log('del success, new attachmentList is', imgArray);
            console.log('domainObject field is', this.domainObject[this.imgShowField]);
          }
        });
      },
      formReady(formData) {
        console.log('formReady', formData);
        this.inputKey = formData.paramData.inputKey;
        this.fields = formData.paramData.field;
        this.isEdit = formData.isEdit;
        this.editable = formData.editable;
        this.status = this.editable === false;
        this.code = formData.code;
      },
      showImageOutside(imgData, field, from) {
        this.imgShowField = field;
        this.imgFrom = from;
        this.imageUrl = imgData.content.thumbnailList[0].url;
        this.$refs.showImage.imgDegree = 0;
        this.$refs.showImage.imgScale = 1;
      },
      previewImageOutside(imgData, field, from) {
        this.imgShowField = field;
        this.imgFrom = from;
        this.imageUrl = imgData.response ? imgData.response.content.thumbnailList[0].url : imgData.url;
        this.$refs.showImage.imgDegree = 0;
        this.$refs.showImage.imgScale = 1;
      },
      loadFirstOutside(imgData, field, from) {
        this.imgShowField = field;
        this.imgFrom = from;
        this.imageUrl = imgData.url;
        this.$refs.showImage.imgDegree = 0;
        this.$refs.showImage.imgScale = 1;
      },
      loadUser(userData) {
        console.log('扫码枪结果为：', userData, '是否包含中文逗号', userData.includes('，'), '是否包含英文逗号', userData.includes(','));
        // 扫码枪出来人员code和车辆code，eg. 336088825057601552,336089937194084372
        const codeArray = userData.includes('，') ? userData.split('，') : userData.split(','),
          driverCode = codeArray[0] || '',
          truckCode = codeArray[1] || ''; // 车辆code有可能不存在
        console.log('codeArray为：', codeArray, '司机code为：', driverCode, '车辆code为：', truckCode);
        if (driverCode) {
          this.$refs.certPerson.loadData(driverCode);
        }
        if (truckCode) {
          this.$refs.certTruck.loadData(truckCode);
        }
      },
      submitForm() {
        this.btnDisabled = true;
        this.$refs.form.submitForm();
      },
      buttonApproval() {
        this.$refs.certTruck.submitApproval();
        this.$refs.certPerson.submitApproval();
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
      resetForm() {
        this.$refs.form.resetForm();
      },
      submitDone() {
        this.btnDisabled = false;
      }
    },
    mounted() {
      console.log('child mounted', this.$slots);
    },
    created() {
      console.log('child created');
    }
  };
</script>

