/**
 * declaration.js
 * Created by cc on 18/12/3.
 */
import Vue from 'vue';
import { Message } from 'element-ui';
import declaration from './declaration.vue';

Vue.prototype.$message = Message;

/* eslint-disable no-new */
/* eslint-disable no-unused-vars */

const vm = new Vue({
  el: '#app',
  template: '<declaration />',
  components: { declaration },
  computed: {},
  mounted() {
  }
});
window.rns = {};
