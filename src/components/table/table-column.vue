/**
* table-column.vue
* Created by dsky on 17/6/5.
*/
<template>
  <div class="tableColumn">
    <el-table-column
      type="selection"
      header-align="center"
      width="80">
    </el-table-column>
    <el-table-column
      type="index"
      header-align="center"
      label="序号"
      width="70">
    </el-table-column>
    <el-table-column label="操作" width="140" header-align="center">
      <template scope="scope">
        <a :href="'add.html?'+scope.row.partnerOrgCode" class="el-button el-button--small el-button--primary" target="_blank">编辑</a>
        <el-button
          size="small"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
    <el-table-column v-for="column in columnsData" :prop="column.fieldConfigCode" :label="column.showName" header-align="center" :key="column.fieldConfigCode"></el-table-column>
  </div>
</template>

<script type="text/ecmascript-6">
  import { getColumn, deleted } from '../../../api/PartnerService';

  export default {
    name: 'tableColumn',
    props: {
      'getData': null
    },
    data() {
      return {
        columnsData: []
      };
    },
    created() {
      getColumn((success, error) => {
        if (success) {
          this.columnsData = success.data;
        } else {
          console.error(error);
        }
      });
    },
    methods: {
      formatter(row) {
        return row.address;
      },
      handleDelete(index, row) {
        const paramObj = {
            partnerOrgCode: row.partnerOrgCode
          },
          h = this.$createElement;
        this.$msgbox({
          title: '消息',
          message: h('p', null, [
            h('span', null, '确认删除吗？ ')
          ]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '执行中...';
              deleted(paramObj, (success, error) => {
                if (success) {
                  this.$message({
                    type: 'success',
                    message: '删除成功',
                    duration: 1000
                  });
                  done();
                  instance.confirmButtonLoading = false;
                }
                if (error) {
                  this.$message({
                    type: 'warning',
                    message: `${error}`,
                    duration: 1000

                  });
                  instance.confirmButtonLoading = false;
                  done();
                }
              });
            } else {
              done();
            }
          }
        }).then(() => {
          this.getData();
        });
      }
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
</style>
