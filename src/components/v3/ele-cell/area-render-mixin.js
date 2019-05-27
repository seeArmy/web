/*jshint esversion:6 */
import * as DataSourceService from '../../../../api/DataSourceService';
var provinceCache = null
export const area = {
  created() {
    if(!provinceCache) {
      DataSourceService.province.getData('', (dataSource) => {
        provinceCache = dataSource;
      });
    }
    this.province = provinceCache
  },
  data() {
    return {
      provinceFieldName: '',
      cityFieldName: '',
      countyFieldName: '',
      province: [],
      city: [],
      county: []
    };
  },
  computed: {
    areaText() {
      this.provinceFieldName = this.field.extraParams[0].field;
      this.cityFieldName = this.field.extraParams[1].field;
      this.countyFieldName = this.field.extraParams[2].field;

      if (this.domainObject[this.provinceFieldName]) {
        this.provinceChange(this.domainObject[this.provinceFieldName]);
      }

      const provinceIndex = this.indexOf(this.domainObject[this.provinceFieldName], this.province),
        cityIndex = this.indexOf(this.domainObject[this.cityFieldName], this.city),
        countyIndex = this.indexOf(this.domainObject[this.countyFieldName], this.county);
      let txt = '';
      if (provinceIndex >= 0) {
        txt = this.province[provinceIndex].value;
      }
      if (cityIndex >= 0) {
        txt += ` - ${this.city[cityIndex].value}`;
      }
      if (countyIndex >= 0) {
        txt += ` - ${this.county[countyIndex].value}`;
      }
      return txt;
    }
  },
  methods:{
    indexOf(value, array) {
      for (let i = 0, j = array.length; i < j; i += 1) {
        if (array[i].id === value) {
          return i;
        }
      }
      return -1;
    },
    provinceChange(item) {
      DataSourceService.city.getData({ keyword: item }, (dataSource) => {
        this.city = dataSource;
        const index = this.indexOf(this.domainObject[this.cityFieldName], this.city);
        if (index < 0) {
          this.domainObject[this.cityFieldName] = null;
        }
        if (this.domainObject[this.cityFieldName]) {
          this.cityChange(this.domainObject[this.cityFieldName]);
        }
      });
    },
    cityChange(item) {
      DataSourceService.county.getData({ keyword: item }, (dataSource) => {
        this.county = dataSource;
        const index = this.indexOf(this.domainObject[this.countyFieldName], this.county);
        if (index < 0) {
          this.domainObject[this.countyFieldName] = null;
        }
      });
    }
  }
}
