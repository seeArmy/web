import Vue from "vue";
import {checkPermission} from "../../api/Utils.js";
/**
 * 检查权限
 */
Vue.directive('check-permission', function (el, binding) {
  var success = checkPermission(binding.value);
  if(!success){
    el.style.display = 'none';
  }
})

