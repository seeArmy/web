<template>
  <div class="table-cell-default">
    <template v-if="islink">
      <a href="javascript:;" class="blue" :data-link="detailUrl" :data-title="`${objectName}详情`" title="查看详情">
          {{value}}
        </a>
    </template>
    <template v-else-if="isPiclink">
      <div class="blue" v-bind:class="value | filterClass" @click='linktoWaybillpage'>
        {{value | filterPicLink}}
      </div>
<!--       <a href="javascript:;" class="blue" :data-link="detailUrlPic" :data-title="`运单详情`" title="查看详情">
          {{value | filterPicLink}}
        </a> -->
    </template>
    <template v-else>
      <span>{{value}}</span>
    </template>
  </div>
</template>
<script>
import * as DataSourceService from '../../../../api/DataSourceService';

import {
  urlRedirect,

} from '../../../../api/Utils';



export default {
  name: 'table-cell-default',
  data() {
    return {
      objectName: '',
      objectCode: '',
      detailUrl: '',
      objectCodeConfig:''
    };
  },
  filters:{
    filterPicLink(val){
      if('-' === val) {
        return '-';
      };
      let arr=val.split(':');
      return arr.length>0 ? arr.length : '-';
    },
    filterClass(val){
      if('-' === val) {
        return '';
      }
      let arr=val.split(':');
       return arr.length>0 ? 'pic-link' : '';
    }
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
    },
    islink() {
      let mark = false;
      if (this.listLinkConfigCode.find(item => item === this.field.fieldConfigCode)) {
        mark = true;
        // 设置 objectCode  objectName
        this.returnObjCode(this.field.fieldConfigCode);
        this.returnObjName(this.objectCode);
        this.returnUrlDetail();
      }
      return mark;
    },
    isPiclink() {
      let mark = false;
      if (this.listPicLinkConfigCode.find(item => item === this.field.fieldConfigCode)) {
        mark = true;
      }
      return mark;
    }
  },
  props: {
    data: {
      required: true,
      type: Object,
      default () {
        return {};
      }
    },
    list: {
      type: Array,
      default () {
        return [];
      }
    },
    index: {
      type: Number,
      default () {
        return 0;
      }
    },
    listLinkConfigCode: {
      type: Array,
      default () {
        return [];
      }
    },
    listPicLinkConfigCode: {
      type: Array,
      default () {
        return [];
      }
    },
    field: {
      required: true,
      type: Object,
      default () {
        return {};
      }
    },
    editInfo: {
      type: Object,
      default () {
        return {};
      }
    },
    formatterInfo: {
      type: Function
    }
  },
  methods: {
    linktoWaybillpage(){
      if(this.value.split(':').length<1) return;

      let code = this.list[this.index].code;
      let url = `/waybill/add.html?code=${code}&editable=false`;
      let title = '运单详情';
      urlRedirect(url, title);
    },
    init() {},
    returnObjName(val) {
      switch (val) {
        case 'truck':
          this.objectName = '车辆';
          break;
        case 'trailer':
          this.objectName = '挂车';
          break;
        case 'driver':
          this.objectName = '司机';
          break;
        case 'partner':
          this.objectName = '伙伴';
          break;
        case 'waybill':
          this.objectName = '运单';
          break;
        case 'route':
          this.objectName = '线路';
          break;
        case 'rates':
          this.objectName = '运价';
          break;
        case 'logistics':
          this.objectName = '订单';
          break;
        case 'transport':
          this.objectName = '车辆';
          break;
        case 'tyre':
          this.objectName = '轮胎';
          break;
        default:
          this.objectName = '';
      }
    },
    returnObjCode(val) {
      switch (val) {
        case 'waybillNo':
          this.objectCode = 'waybill';
          this.objectCodeConfig = 'code'
          break;
        case 'logisticsNo':
          this.objectCode = 'logistics';
          this.objectCodeConfig = 'logisticsCode'
          break;
        default:
          this.objectCode = '';
          this.objectCodeConfig = ''
      }
    },
    returnUrlDetail() {
       const url = DataSourceService[this.objectCode].getDetailUrl();


       this.detailUrl = `${url}${url.indexOf('?') !== -1 ? '&' : '?'}code=${this.data[this.objectCodeConfig]}&editable=false`;
    },
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


<style lang="scss" rel="stylesheet/scss">
.table-cell-default {
  .pic-link {
    cursor: pointer;
  }
}
</style>
