/*jshint esversion:6 */

export const radio = {
  created() {

  },
  data() {
    return {
    };
  },
  methods:{
    radioText() {
      let val = ''
      this.field.extraParams.forEach(element => {
        let modelValue = this.domainObject[element.field]
        if (modelValue !== null && typeof modelValue !== 'undefined' && element.optionsValue) {
          modelValue = modelValue.toString();
          for (let i = 0, len = element.optionsValue.length; i < len; i += 1) {
            if (modelValue === element.optionsValue[i].toString()) {
              modelValue = element.options[i];
              break;
            }
          }
        }
        val += modelValue
      });
      return val
    }
  }
}
