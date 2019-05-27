<template>
  <div>
    <ele-list :selectable="selectable" :operatable="operatable"
              @query="query" @ready="onReady" @action="action" @exportData="exportData"  @showLowerDept="showLowerDept"
              :total="total" :loading="loading"
              :listData="listData"
              ref="eleList"
              :customColumn="customColumn"
              :params="newParams"
              :needPage="needPage"
              :isAdvanced="isAdvanced" :isHide="isHide"
              :add="add"
              :downloadErrorData="downloadErrorData"
              :downloadTemplate="downloadTemplate"
              :importUrl="importUrl"
              :editUrl="editUrl"
              :getColumn="getColumn"
              :exportCsv="exportCsv"
              :getSearch="getSearch"
              :showImportButton="false"
              :showDownloadTemplate="false"
              :showExportButton="false"
              :showLowerDept="true"
              :showRadioCheck="showRadioCheck"
              :showColumns="showColumns"
              :objectName="objectName">
    </ele-list>
  </div>
</template>
<script type="text/ecmascript-6">
  /* eslint-disable no-unused-vars */

  import eleList from '../../components/ele-list/eleList.vue';
  import { getColumn, list, getSearch, deleted, exportCsv, add, downloadErrorData, downloadTemplate, personDeptRelationList, quit } from '../../../api/EmployeeService';
  import { getUserRoleList } from '../../../api/RoleService';
  import ApiConst from '../../../api/ApiConst';
  import { urlRedirect } from '../../../api/Utils';

  export default {
    name: 'employeeList',
    components: {
      'ele-list': eleList
    },
    props: {
      isHide: {
        type: Boolean,
        'default': false
      },
      selectable: {
        type: Boolean,
        'default': true
      },
      operatable: {
        type: Boolean,
        'default': true
      },
      showRadioCheck: {
        type: Boolean,
        'default': false
      },
      showColumns: {
        type: Array,
        default () {
          return [];
        }
      },
      customColumn: Array,
      isAdvanced: {
        type: Boolean,
        'default': true
      },
      needPage: {
        type: Boolean,
        'default': true
      },
      params: {
        type: Object,
        'default': function () {
          return {};
        }
      },
      deptList: {
        type: Array,
        'default': function () {
          return [];
        }
      },
      deptCodeList: {
        type: Array,
        'default': function () {
          return [];
        }
      }
    },
    data() {
      return {
        total: 0,
        loading: true,
        listData: [],
        objectName: '人员',
        addUrl: '/employee/add.html',
        editUrl: '/employee/add.html',
        listUrl: '/employee/list.html',
        importUrl: `${ApiConst.apiPersonDomain}/import/custom/employee`,
        exportCsv,
        downloadErrorData,
        downloadTemplate,
        add,
        getSearch,
        getColumn,
        deptMap: {},
        newParams: {
          userType: 1
        }
      };
    },
    methods: {
      showLowerDept(status) {
        console.log('是否显示下级部门', status);
        if (status) {
          this.$set(this.newParams, 'deptCode', this.deptCodeList);
        } else {
          this.$set(this.newParams, 'deptCode', this.params.deptCode);
        }
        this.$refs.eleList.dispatchQueryEvent();
      },
      dispatchQueryEvent() {
        this.$refs.eleList.isDept = true;
        this.showLowerDept('true');
      },
      openWindow(url, title) {
        urlRedirect(url, title);
      },
      exportData(params) {
        const dataTotal = this.total;
        if (dataTotal > 10000) {
          this.$message({
            type: 'warning',
            message: '导出条数超过10000条限制，不可导出！',
            duration: 3000
          });
        } else {
          this.loading = true;
          params.size = dataTotal;
          exportCsv(params, (success, error) => {
            if (error || success.code !== 200) {
              this.$message({
                type: 'error',
                message: error.content,
                duration: 5000
              });
              this.loading = false;
              return false;
            }
            if (success) {
              this.loading = false;
              window.location.href = success.content.url;
            }
          });
        }
      },
      doRemove(model) {
        const self = this;
        this.$msgbox({
          title: '确认',
          message: `确认要删除${this.objectName} ${model.fullName} 吗？`,
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '执行中...';
              deleted({ code: model.code }, (success, error) => {
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
          self.$refs.eleList.dispatchQueryEvent();
        });
      },
      doQuit(model) {
        const self = this;
        const  h = this.$createElement;
        this.$msgbox({
          title: '确认',
          message: h('p', { style: 'text-align: center' }, [
            h('span', { style: 'font-weight: 700' }, '该员工已交接完工作，允许退出本公司。'),
            h('span', { style: 'color: #f48400; display: block; margin-top: 10px;' }, '确定办理退出公司吗？')
          ]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '执行中...';
              quit({ code: model.code }, (success, error) => {
                if (success) {
                  this.$message({
                    type: 'success',
                    message: '退出公司成功',
                    duration: 1000
                  });
                  done();
                  instance.confirmButtonLoading = false;
                }
                if (error) {
                  this.$message({
                    type: 'warning',
                    message: `${error.content}`,
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
          self.$refs.eleList.dispatchQueryEvent();
        });
      },
      action(command, menu, model) {
        switch (command) {
          case 'add':
            this.openWindow(`${this.editUrl}?objectName=${this.objectName}`, `新建${this.objectName}`);
            break;
          case 'edit':
            this.openWindow(`${this.editUrl}?code=${model.code}&objectName=${this.objectName}`, `编辑${this.objectName}`);
            break;
          case 'remove':
            this.doRemove(model);
            break;
          case 'quit':
            this.doQuit(model);
            break;
          default:
            break;
        }
      },
      onReady() {
        this.$emit('firstLoad');
      },
      query(searchParams) {
        const that = this;
        console.log('searchParams', searchParams);
        Object.assign(searchParams, this.newParams);
        console.log('query', searchParams);
        that.total = 0;
        that.loading = true;
        that.listData = [];
        list(searchParams, (success, error) => {
          if (error) {
            this.$message({
              type: 'error',
              message: error.content,
              duration: 5000
            });
          }
          if (success) {
            that.total = success.total;
            const codeList = [];
            success.content.forEach((row) => {
              const actionList = [];
              actionList.push({ key: 'edit', name: '编辑' });
              // actionList.push({ key: 'remove', name: '删除' });
              // actionList.push({ key: 'quit', name: '退出公司' }); 2018年9月12日15:28:03 dorlinton要求隐藏
              row.actionMenuList = actionList;
              row.departmentName = '';
              row.roleName = '';
              codeList.push(row.code);
            });
            that.listData = success.content;
            if (codeList.length) {
              personDeptRelationList({ userCodeList: codeList }, (sc, er) => {
                if (sc) {
                  sc.content.forEach((item) => {
                    that.listData.forEach((employee) => {
                      if (employee.code === item.userCode) {
                        employee.deptCode = item.deptCode;
                        employee.departmentName = this.deptMap[item.deptCode];
                      }
                    });
                  });
                }
              });

              getUserRoleList({ userCodeList: codeList }, (sc, er) => {
                if (sc) {
                  const userRoleList = {};
                  sc.content.forEach((item) => {
                    if (item.userCode && item.roleCode && item.roleName) {
                      if (!userRoleList[item.userCode]) {
                        userRoleList[item.userCode] = [];
                      }
                      userRoleList[item.userCode].push(item.roleName);
                    }
                  });
                  that.listData.forEach((employee) => {
                    if (userRoleList[employee.code]) {
                      employee.roleName = userRoleList[employee.code].join(',');
                    }
                  });
                }
              });
            }
            that.loading = false;
          }
        });
      }
    },
    watch: {
      deptList() {
        this.deptList.forEach((item) => {
          this.deptMap[item.code] = item.deptName;
        });
      }
    }
  };
</script>
