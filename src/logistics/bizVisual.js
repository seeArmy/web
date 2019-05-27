/**
 * biz visual.js
 * Created by cc on 18/11/8.
 */
import Vue from 'vue';
import { Message, Pagination } from 'element-ui';
import BaiduMap from 'vue-baidu-map';
import bizVisual from './bizVisual.vue';

Vue.use(BaiduMap, { ak: '0splGL787be69VgsOZX2t3vMvw016i0F' });
Vue.use(Pagination);

Vue.prototype.$message = Message;

/* eslint-disable no-new */
/* eslint-disable no-unused-vars */

const vm = new Vue({
  el: '#app',
  template: '<bizVisual />',
  components: { bizVisual },
  computed: {},
  mounted() {
  }
});
window.rns = {};
