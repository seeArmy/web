/**
 * msgReminder.js
 * Created by cc on 18/12/29.
 */
import Vue from 'vue';
import { Input, Select, Button, Form, FormItem, Option, row, col, Radio, RadioGroup, Checkbox, CheckboxGroup,
  Autocomplete, DatePicker, TimePicker, TimeSelect, Upload, Dialog, Alert, MessageBox, Message, Loading, Tag, Tabs, TabPane } from 'element-ui';
import msgReminder from './msgReminder.vue';

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
Vue.use(TimePicker);
Vue.use(TimeSelect);
Vue.use(Upload);
Vue.use(Dialog);
Vue.use(Alert);
Vue.use(Loading);
Vue.use(Tag);
Vue.use(Tabs);
Vue.use(TabPane);

Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$message = Message;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$confirm = MessageBox.confirm;

Vue.config.productionTip = false;

/* eslint-disable no-new */
/* eslint-disable no-unused-vars */
const vm = new Vue({
  el: '#app',
  template: '<msgReminder />',
  components: { msgReminder },
  computed: {},
  mounted() {
  }
});
window.rns = {};
