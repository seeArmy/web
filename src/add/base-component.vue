<template>
  <div>
    <span @click="handleClick">props: {{test}}</span>
    <slot name="slot1" /> <!-- 具名插槽 -->
    <p>===========</p>
    <slot /> <!-- 默认插槽 -->
  </div>
</template>
<script>
export default {

};

</script>
