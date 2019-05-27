
<script>
export default {
  name: 'ele-block-list',
  props: {
    field: Object,
    domainObject: Object,
    uploadUrl: String,
    inputKey: Array
  },
  render: function(createElement) {
    var _field_ = this.field['fieldConfigCode'],
      _text_ = ''
    switch (this.field['elementCode']) {
      case 'select':

        break;
      case 'selectArea':

        break;
      case 'label':
        _text_ = this.labelRender()
        break;
      case 'checkbox':
        _text_ = this.checkboxRender()
        break;
      case 'radio':
        _text_ = this.radioRender()
        break;
      default:
        _text_ = this.domainObject[_field_]
        break;
    }
    return createElement(
      'span', _text_,
      [
        createElement('a', {
          attrs: {
            name: 'xxx',
            href: '#d'
          }
        }, this.$slots.default)
      ]
    )

  },
  methods: {
    labelRender() {
      let val = ''
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
          val += modelValue;
        }
        // val += element.default ? element.default : '';
      })
      return val
    },
    radioRender() {
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
    },
    checkboxRender() {
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
  },
  created() {
    // console.info('elementCode', this.field['elementCode'], this.field)
  }

}
</script>



