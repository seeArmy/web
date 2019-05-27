/* jshint esversion:6 */

import Vue from 'vue';
import { Input,  Button, Form, FormItem, row, col, MessageBox, Message } from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
import index from './password.vue';

Vue.use(Input);
Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(row);
Vue.use(col);

Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$message = Message;
Vue.prototype.$msgbox = MessageBox;

Vue.config.productionTip = false;

require('../public.js');

/* eslint-disable no-new */
/* eslint-disable no-unused-vars */
const vm = new Vue({
  el: '#app',
  template: '<index/>',
  components: { index },
  computed: {},
  mounted() {
  }
});
window.rns = {};
