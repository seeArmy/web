/**
* tableTotal.vue
*/
<template v-if="totalData.length">
  <tr>
    <td v-if="selectable" class="fix-col"></td>
    <td v-if="operatable" class="fix-col"></td>
    <td v-for="list in totalData">
      {{ list }}
    </td>
  </tr>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    operatable: Boolean,
    selectable: Boolean,
    columnsData: Array,
    listData: Array,
    ignoreCalColumns: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      totalData: []
    };
  },
  methods: {
    getTotal() {
      const cacFields = [],
        self = this;
      for (let i = 0; i < self.columnsData.length; i++) {
        if (i === 0) {
          self.totalData.push('合计：');
        } else {
          self.totalData.push('');
        }
      }
      self.columnsData.forEach((val, i) => {
        if (!(self.ignoreCalColumns.includes(val.fieldConfigCode))) {
          val.extraParams.forEach((v) => {
            if (v.controlType === 'number') {
              cacFields.push({
                field: v.field,
                total: 0,
                index: i
              });
            }
          });
        }
      });
      console.log('cacFields is', cacFields);
      cacFields.forEach((obj, index) => {
        let fieldTotal = 0;
        self.listData.forEach((list) => {
          list[obj.field] ? fieldTotal += parseFloat(list[obj.field]) : '';
        });
        // 保留兩位小數 toFixed(2)
        cacFields[index].total = fieldTotal.toFixed(2);

      });
      console.log('new cacFields is', cacFields);
      self.totalData.forEach((val, index) => {
        cacFields.forEach((o, i) => {
          if (index === o.index) {
            self.totalData[index] = o.total;
          }
        });
      });
    }
  },
  created() {
    console.log('this columnsData is', this.columnsData);
    console.log('this listData is', this.listData);
    this.getTotal();
  }
};
</script>

<style lang="scss" rel="stylesheet/scss">
.rl-fix-table tfoot td, .rl-fix-table tfoot .fix-col {
  background-color: #fff2b5;
  font-weight: 700;
  color: #444;
}
</style>
