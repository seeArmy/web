
<script>
import { area } from './area-render-mixin'
import { checkbox } from './checkbox-render-mixin'
import { radio } from './radio-render-mixin'
import { label } from './label-render-mixin'
import { pop } from './pop-render-mixin'
import { complex } from './complex-render-mixin'

export default {
  name: 'ele-block',
  props: {
    field: Object,
    domainObject: Object,
    uploadUrl: String,
    inputKey: Array
  },
  data() {
    return {
      tablehash: {},
      myText: ''
    }
  },
  mixins: [area, checkbox, radio, label, pop, complex],
  render: function(h) {
    var elementType = this.field['elementCode'],
      _field_ = this.field['fieldConfigCode'],
      _text_ = '',
      element = { type: 'span', define: {}, style: {}}
    /**
     ** 不同状态显示不同样式
     ** extraStyles
     **/
    if(this.field['extraStyles']) {
      var styl = JSON.parse(this.field['extraStyles'])
      element.style = styl[this.domainObject[_field_]]
    }
    /**
     ** 自定义调整 动作逻辑放在最前置组件
     ** customActionName
     **/
    if(this.field['customActionName']) {
      element.type = 'a'
      element.define = {
        attrs: {
          href: 'javascript:;'
        },
        'class': {
          blue: true,
        },
        on: {
          click: () => {
            this.$emit('tableAction', this.field['customActionName'], this.domainObject)
          }
        }
      }
    }
    switch (elementType) {
      /**
       ** 通用场景
       **
       ** pop: 需要附带连接
       ** selectArea: 省市区
       ** label: 固定转义，code 转 文字
       ** text: 直接文本输出
       **
       **
       **/
      case 'text':
        _text_ = this.domainObject[_field_]
        break;
      case 'pop':
        const popVal = this.resolvePop
        element.type = popVal.type
        element.define = popVal.define
        _text_ = this.domainObject[_field_]
        break;
      case 'selectArea':
        _text_ = this.areaText
        break;
      case 'label':
        _text_ = this.labelText
        break;
      default:
        _text_ = this.complexText
        break;
    }
    return h(
      'span', [
        h('span', {
          style: element.style,
        },[
          h(
            element.type,
            element.define,
            _text_)]
        )
      ]

    )

  },
  methods: {
    clickHandler(actionName) {
      this.$emit('tableAction', actionName)
    },
    hashCode(str) {
      var h = 0;
      var len = str.length;
      var t = 2147483648;
      for (var i = 0; i < len; i++) {
        h = 31 * h + str.charCodeAt(i);
        if (h > 2147483647) h %= t;
      }
      return h;
    }
  },
  created() {
    // console.info('elementCode', this.field['elementCode'], this.field)
  },
  mounted() {

  }
}
</script>



