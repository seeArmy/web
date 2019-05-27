<!-- 小计 -->
/**
* subtotal.vue
*/
<template v-if="totalData.length">
  <tr id='page-ele-subtotal'>
    <td v-if="editable && selectable" class="fix-col"></td>
    <td v-if="operatable" class="fix-col"></td>
    <td v-for="(list,index) in totalData"  v-bind:class="columnsData | filterClassTh(index)">
      {{ list }}
    </td>
  </tr>
</template>
<script type="text/ecmascript-6">
import Decimal from "decimal.js";
export default {
  props: {
    operatable: Boolean,
    selectable: Boolean,
    columnsData: Array,
    listData: Array,
    editable: {
      type: Boolean,
      'default': true
    },
    ignoreCalColumns: {
      type: Array,
      default () {
        return [];
      }
    }
  },
  filters: {
    filterClassTh: function(column, index) {
      let val = '';
      if (column[index].extraParams.length > 0 && column[index].extraParams[0].freeze) {
        val += 'fix-col';
      }
      val += ' color-subtotal';
      return val;
    },
  },
  data() {
    return {
      totalData: [],
      cacFields:[]
    };
  },
  methods: {
    getTotal() {
      const cacFields = [],
        self = this;
      self.totalData = [];
      for (let i = 0; i < self.columnsData.length; i++) {
        if (i === 0) {
          self.totalData.push('小计：');
        } else {
          self.totalData.push('');
        }
      }
      self.columnsData.forEach((val, i) => {
        if (!(self.ignoreCalColumns.includes(val.fieldConfigCode))) {
          val.extraParams.forEach((v) => {
            if ((v.controlType === 'number' || v.controlType === 'label') && v.neddSubtotal === 'TRUE') {
              cacFields.push({
                field: v.field,
                total: 0,
                index: i
              });
            }
          });
        }
      });
      cacFields.forEach((obj, index) => {
        let fieldTotal = 0;
        self.listData.forEach((list) => {
          // list[obj.field] ? fieldTotal += parseFloat(list[obj.field]) : '';
          if(list[obj.field]){
            fieldTotal = Decimal(fieldTotal).add(Decimal(list[obj.field]));
          }
        });
        // 保留兩位小數 toFixed(2)
        // cacFields[index].total = fieldTotal.toFixed(2);
        cacFields[index].total = Decimal(fieldTotal).toNumber();

      });
      self.totalData.forEach((val, index) => {
        cacFields.forEach((o, i) => {
          if (index === o.index) {
            self.totalData[index] = o.total;
          }
        });
      });
      console.log('cacFields is', cacFields);
      self.cacFields = cacFields;
    }
  },
  created() {
    this.getTotal();
  }
};

</script>
<style lang="scss" rel="stylesheet/scss">
#page-ele-subtotal {
  .color-subtotal {
    color: #F8A200;
  }
}
.rl-fix-table tfoot td,
.rl-fix-table tfoot .fix-col {
  background-color: #E4E4E4;
  font-weight: 700;
  color: #444;
}

</style>
