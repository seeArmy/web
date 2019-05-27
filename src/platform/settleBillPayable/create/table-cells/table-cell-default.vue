<template>
    <a href="javascript:;" class="blue" @click="toDetail" v-if="field.fieldConfigCode === 'waybillNo'">{{ value }}</a>
    <span v-else>{{ value }}</span>
</template>

<script>
import { urlRedirect } from '../../../../../api/Utils';

  export default {
    name: 'table-cell-default',
    data() {
      return {};
    },
    computed: {
      value() {
        if (this.data[this.field.fieldConfigCode] && this.data[this.field.fieldConfigCode] !== '0') {
          if (this.formatterInfo && typeof this.formatterInfo === 'function') {
            return this.formatterInfo(this.data, this.field);
          }
        } else {
          // console.log('-', this.data[this.field.fieldConfigCode]);
          return '-';
        }
        return this.data[this.field.fieldConfigCode];
      }
    },
    props: {
      data: {
        required: true,
        type: Object,
        default() {
          return {};
        }
      },
      field: {
        required: true,
        type: Object,
        default() {
          return {};
        }
      },
      editInfo: {
        type: Object,
        default() {
          return {};
        }
      },
      formatterInfo: {
        type: Function
      }
    },
    methods: {
      openWindow(url, title) {
        urlRedirect(url, title);
      },
      toDetail() {
        this.openWindow(`/waybill/add.html?code=${this.data.code}&editable=false`, '运单详情');
      },
      init() { }
    },
    mounted() {
      this.init();
      // console.log('field1111111111111111111111111111111', this.field);
      // console.log('data22222222222222222222222222222222', this.data);
    },
    watch: {
      $route() {
        this.init();
      }
    }
  };
</script>

<style lang="sass">

</style>
