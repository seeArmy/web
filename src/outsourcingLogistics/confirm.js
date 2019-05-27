/**
 * list.js
 * Created by zhangyuchao on 17/7/22.
 */
import Vue from 'vue';
import { Input, Select, Button, Form, FormItem, Option, row, col, Radio, RadioGroup, Checkbox, CheckboxGroup,
  Autocomplete, DatePicker, Upload, Dialog, Alert, MessageBox, Message, Loading, Dropdown, DropdownMenu, DropdownItem } from 'element-ui';
import BaiduMap from 'vue-baidu-map';
import logisticsList from './confirm.vue';

Vue.use(Input);
Vue.use(Select);
Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Option);
Vue.use(row);
Vue.use(col);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(Autocomplete);
Vue.use(DatePicker);
Vue.use(Upload);
Vue.use(Dialog);
Vue.use(Alert);
Vue.use(Loading);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(BaiduMap, { ak: '0splGL787be69VgsOZX2t3vMvw016i0F' });

Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$message = Message;
Vue.prototype.$msgbox = MessageBox;

/* eslint-disable no-new */
/* eslint-disable no-unused-vars */

const vm = new Vue({
  el: '#app',
  template: '<logisticsList/>',
  components: { logisticsList },
  computed: {},
  mounted() {
  }
});
window.rns = {};
