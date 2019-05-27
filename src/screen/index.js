/* jshint esversion:6 */
import Vue from 'vue'
import { row, col, Progress, DatePicker, Message } from 'element-ui'
import Index from './index.vue'
import './assets/main.scss'
require('./assets/data-set.min.js')
Vue.use(row);
Vue.use(col);
Vue.use(Progress);
Vue.use(DatePicker);
Vue.prototype.$message = Message;
/* eslint-disable no-new */
/* eslint-disable no-unused-vars */

const vm = new Vue({
  el: '#app',
  template: '<Index/>',
  components: { Index },
  computed: {},
  mounted() {
  }
});
window.rns = {};
