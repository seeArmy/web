import Vue from 'vue';
import core_screen from './core_screen.vue';

/* eslint-disable no-new */
/* eslint-disable no-unused-vars */
window.rns = {};
const vm = new Vue({
  el: '#app',
  template: '<core_screen/>',
  components: { core_screen },
  computed: {},
  mounted() {
  }
});
