/**
 * dispatch.js
 * 订单派车
 * Created by cc on 19/1/22.
 */
import Vue from 'vue';
import {
  Input, Select, Button, Form, FormItem, Option, row, col, Radio, RadioGroup, Checkbox, CheckboxGroup,
  Autocomplete, DatePicker, Upload, Dialog, Alert, MessageBox, Message, Loading, Table, TableColumn, Tabs, TabPane,
  Dropdown, DropdownMenu, DropdownItem
} from 'element-ui';
import dispatch from './dispatch.vue';

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
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);

Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$message = Message;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$confirm = MessageBox.confirm;

Vue.config.productionTip = false;

/* eslint-disable no-new */
/* eslint-disable no-unused-vars */
/* eslint-disable no-one-var */
new Vue({
  el: '#app',
  template: '<dispatch/>',
  components: { dispatch },
  computed: {},
  mounted() {
  }
});
window.rns = {};
