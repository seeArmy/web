/**
 * trustDeed.js
 * Created by cc on 18/12/3.
 */
import Vue from 'vue';
import { Message } from 'element-ui';
import trustDeed from './trustDeed.vue';

Vue.prototype.$message = Message;

/* eslint-disable no-new */
/* eslint-disable no-unused-vars */

const vm = new Vue({
  el: '#app',
  template: '<trustDeed />',
  components: { trustDeed },
  computed: {},
  mounted() {
  }
});
window.rns = {};
