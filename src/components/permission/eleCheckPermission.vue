/**
* 权限校验
* Created by zhangjiwei on 2018.1.8.
*/
<template>
  <div v-if="havePermission">
    <slot></slot>
  </div>
</template>
<script type="text/ecmascript-6">
  import {checkPermission} from '../../../api/Utils';

  export default{
    props: {
      permissionKey: null    // 前台调用时需要设置permissionKey。此KEY由后台配置，全局维一。如果不设置此属性，则跳过权限验证。
    },
    computed: {
      havePermission(){
        if (!this.permissionKey) {
          return true;
        }
        return checkPermission(this.permissionKey);
      }
    }
  }

</script>
