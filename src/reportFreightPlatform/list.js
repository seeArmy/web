/**
 * list.js
 * Created by cc on 18/3/12.
 */
import Vue from 'vue';
import { Input, Select, Button, Form, FormItem, Option, row, col, Radio, RadioGroup, Checkbox, CheckboxGroup,
  Autocomplete, DatePicker, Upload, Dialog, Alert, MessageBox, Message, Loading, Table, TableColumn, Dropdown, DropdownMenu, DropdownItem,Pagination } from 'element-ui';
import reportFreight from './list.vue';

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
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(Pagination);
Vue.use(DropdownItem);

Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$message = Message;
Vue.prototype.$msgbox = MessageBox;
Vue.config.warnHandler = function (msg, vm, trace) {
  // `trace` 是组件的继承关系追踪
  console.log(msg);
}
/* eslint-disable no-new */
/* eslint-disable no-unused-vars */

const vm = new Vue({
  el: '#app',
  template: '<reportFreight/>',
  components: { reportFreight },
  computed: {},
  mounted() {
  }
});
window.rns = {};
