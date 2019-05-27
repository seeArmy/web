/*jshint esversion:6 */
import * as DataSource from '../../../../api/DataSourceService'
const dataKey = ['carrierPrice','driverPrice','goodsPrice','goodsVolume','goodsWeight','goodsNumber']
const datasourceCache = {}
dataKey.forEach(element => {
  const data = JSON.parse(localStorage.getItem(`${element}--`))
  datasourceCache[element] = data
})

const d1 = JSON.parse(localStorage.getItem(`goodsLoss--`)) || [],
  d2 = JSON.parse(localStorage.getItem(`goodsLossRation--`)) || [];
datasourceCache['goodsLoss'] = d1.concat(d2);

// console.log('complex times', datasourceCache)

export const complex = {
  created() {
  },
  data() {
    return {
    };
  },
  computed: {
    complexText() {
      let val = ''
      this.field.extraParams.forEach(element => {
        let modelValue = ''
        try {
          modelValue += this.domainObject[element.field].toString()
        } catch (error) {

        }

        if(element.default && !this.domainObject[element.field]) {
          modelValue = element.default
        }
        if(element.controlType === 'radio') {
          const valIndex = element.optionsValue.indexOf(modelValue)
          modelValue = element.options[valIndex]
        }
        // console.log('this.field', this.field['showName'], element.field, modelValue,this.field.extraParams, element, val)

        if(element.datasource) {
          val += this.getActualVal(element.datasource, modelValue) || ''
        } else {
          val += modelValue;
        }
        // val += element.default ? element.default : '';
      })
      return val
    }
  },
  methods:{
    getActualVal(source, modelid) {
      // console.log('source', source, modelid)
      if(datasourceCache[source]) {
        for(let i = 0; i < datasourceCache[source].length; i++) {
          if(datasourceCache[source][i].id === modelid) {
            return datasourceCache[source][i].value
          }
        }
      } else {
        DataSource[source].getData({}, (dataSource) => {
          datasourceCache[source] = dataSource
          for(let i = 0; i < datasourceCache[source].length; i++) {
            if(datasourceCache[source][i].id === modelid) {
              return datasourceCache[source][i].value
            }
          }
        });
      }
    }
  },
  mounted() {

  }
}
