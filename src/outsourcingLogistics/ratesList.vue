<template>
  <div>
    <ele-list :selectable="false" :operatable="false"
              @query="query" @ready="ready"
              :loading="loading"
              :list-data="listData"
              ref="eleList"
              :params="params"
              :needPage="false"
              :isAdvanced="false"
              :getColumn="getColumn">
    </ele-list>
  </div>
</template>
<script type="text/ecmascript-6">
  import eleList from '../components/ele-list/eleList.vue';
  import { ratesList, getOutsourcingLogisticRatesColumn } from '../../api/rateService';

  export default {
    components: {
      'ele-list': eleList
    },
    props: {
      code: String
    },
    data() {
      return {
        params: {},
        columns: [],
        listData: [],
        loading: true,
        getColumn: getOutsourcingLogisticRatesColumn
      };
    },
    methods: {
      ready(params, columns) {
        this.columns = columns;
        this.query();
      },
      query() {
        ratesList(this.params, (success) => {
          this.loading = false;
          if (success) {
            const data = success.content,
              len = data.length;
            data.forEach((val, index) => {
              const num = len - index;
              val.sequence = num < 10 ? `0${num}` : num;
            });
            this.listData = data;
          }
        });
      }
    },
    created() {
      this.params = {
        code: this.code,
        size: 100,
        page: 1
      };
    }
  };
</script>
