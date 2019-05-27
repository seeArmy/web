/*jshint esversion:6 */

export const label = {
  created() {

  },
  data() {
    return {
    };
  },
  computed: {
    labelText() {
      let val = ''
      // console.log('labelText .....', this.field);
      this.field.extraParams.forEach(element => {
        if (this.domainObject && element && 'field' in element && element.field in this.domainObject) {
          let modelValue = this.domainObject[element.field];
          if (modelValue !== null && typeof modelValue !== 'undefined' && element.optionsValue) {
            modelValue = modelValue.toString();
            for (let i = 0, len = element.optionsValue.length; i < len; i += 1) {
              if (modelValue === element.optionsValue[i].toString()) {
                modelValue = element.options[i];
                break;
              }
            }
          }
          // date format
          if (modelValue !== null && typeof modelValue !== 'undefined' && element.format) {
            const fmt = element.format;
            switch (fmt) {
              case 'yyyy':
              modelValue =  modelValue ? modelValue.substring(0, 4) : '';
                break;
              case 'yyyy-MM':
              modelValue =  modelValue ? modelValue.substring(0, 7) : '';
                break;
              case 'yyyy-MM-dd':
              modelValue = modelValue ? modelValue.substring(0, 10) : '';
                break;
              default:
            }
          }
          val += modelValue;
        }
        // val += element.default ? element.default : '';
      })
      return val
    }
  },
  methods: {

  }
}
