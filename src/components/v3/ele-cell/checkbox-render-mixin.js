/*jshint esversion:6 */

export const checkbox = {
  created() {

  },
  data() {
    return {
    };
  },
  methods:{
    checkboxText() {
      let val = ''
      this.field.extraParams.forEach(element => {
        const modelValue = this.domainObject[element.field],
          optionValue = element.optionsValue,
          optionText = element.options;
        if (modelValue && modelValue.indexOf(',') > -1) {
          const valArray = modelValue.split(','),
            textArray = [];
          valArray.forEach((val, index) => {
            if (optionValue.indexOf(val) > -1) {
              textArray.push(optionText[optionValue.indexOf(val)]);
            }
          });
          val += textArray.join('，');
          return text;
        }
        optionValue.forEach((val, index) => {
          if (val === modelValue) {
            val += optionText[index];
          }
        });
      })
      return val
    }
  }
}
