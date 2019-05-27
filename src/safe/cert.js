import Vue from 'vue';
import cert from './cert.vue';

require('../public.js');

/* eslint-disable no-new */
/* eslint-disable no-unused-vars */
const vm = new Vue({
  el: '#app',
  template: '<cert />',
  components: { cert }
});
window.rns = {};
