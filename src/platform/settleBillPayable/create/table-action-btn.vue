<template>
  <div class="table-action-btn-component">
    <el-button @click="btn.fn && typeof btn.fn==='function' ? btn.fn({ btn, list, index }) : onClickBtn({ btn, list, index })" :key="index" v-if='filterShowBtn(btn,readonly)' v-for="(btn,index) in list">{{btn.text || ''}}
    </el-button>
  </div>
</template>
<script>
import {
  getParam,
  getParamsFromURL,
  checkPermission
} from '../../../../api/Utils';
export default {
  name: 'table-action-btn',
  data() {
    return {};
  },
  props: {
    list: {
      type: Array,
      default () {
        return [];
      }
    },
    readonly: {
      type: Boolean,
      default () {
        return false;
      }
    }
  },
  methods: {
    filterShowBtn(btn, readonly) {
      const orgType = localStorage.getItem('orgType');
      let mark = false;

      if (orgType == 1) {
        if (readonly) { // 详情
          if (btn.key == 'export') {
            mark = true;
          }
          if (btn.key == 'waybillAffirm' && checkPermission("opr.wuche.complianceCheck")) {
            mark = true;
          }
        }
      } else { // 大小B
        if (!readonly) { // 新建
          if (btn.key == 'remove' || btn.key == 'export') {
            mark = true;
          }
        } else {
          if (btn.key == 'export') {
            mark = true;
          }
        }
      }
      return mark;
    },
    onClickBtn(opts) {
      this.$emit('onClickBtn', opts);
    },
    init() {

    }
  },


  mounted() {
    this.init();
  },
  watch: {
    $route() {
      this.init();
    }
  }
};

</script>
<style lang="scss">


</style>
