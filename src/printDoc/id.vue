/**
* id.vue
* 身份证打印
* Created by cc on 18/12/3.
*/
<template>
  <div class="print-doc print-id">
    <span class="print-now no-print" @click="print" title="点击打印">点击打印</span>
    <h1 class="print-tit">身份证</h1>
    <p class="img-view" v-for="item in imageData">
      <img :src="item.url" alt="">
      <!-- <span class="water-mask">本证件图片仅供单车付款使用，他用无效</span> -->
    </p>
  </div>
</template>

<script type="text/ecmascript-6">
import { getParamsFromURL } from '../../api/Utils';
import { get, getImage } from '../../api/DriverMemberService';

export default {
  name: 'id',
  components: {
  },
  props: {
  },
  data() {
    return {
      userCode: getParamsFromURL(window.location.search).userCode,
      imageData: []
    };
  },
  methods: {
    print() {
      window.print();
    }
  },
  created() {
    get({code: this.userCode}, (success, error) => {
      if (success) {
        const data = success.content;
        console.log('get user info is', data);
        if (data.identityResourceCode) {
          const resourceCodes = data.identityResourceCode.split(':');
          resourceCodes.forEach((val) => {
            getImage({resourceCode: val}, (success, error) => {
              if (success) {
                const data = success.content;
                console.log('get id image is', data);
                this.imageData.push(data.thumbnailList[0]);
              }
            })
          });
        }
      }
    });
  },
  mounted() {
  }
};

</script>

<style lang="scss" rel="stylesheet/scss">
@import './print.scss';
</style>
