/**
* list.vue
* 车源列表
* Created by zhuyi on 17/7/21.
*/
<template>
  <!-- 车辆列表 页面 -->
  <div id='list_transport'>
    <ele-list :selectable="selectable" :operatable="operatable" @query="query" @ready="query" @action="action" @more="more" @exportData="exportData" :extraSearchParamObj="extraSearchParamObj" :total="total" :loading="loading" :list-data="listData" ref="eleList" :customColumn="customColumn" :params="params" :needPage="needPage" :isAdvanced="isAdvanced" :deleteFun="deleteFun" :add="add" :downloadErrorData="downloadErrorData" :downloadTemplate="downloadTemplate" :importUrl="importUrl" :editUrl="editUrl" :getColumn="getColumn" :getImportColumn="getImportColumn" :getList="getList" :exportCsv="exportCsv" :getSearch="getSearch" :folder="folder" :isShowPageJump='true' :objectName="objectName">
      <span slot="funArea">
        <el-button type="default" @click="changeShift()">司机对调换班</el-button>
        <el-button type="default" @click="shareTransport()">分享运力</el-button>
      </span>
      <group slot="group" :tagData="tagData" @filterData="filterData" @getHeight="getHeight" :addFun="addTag" :editFun="editTag" :deleteFun="deleteTag"></group>
    </ele-list>
    <ele-form class='form_st' ref='form'>
      <el-row>
        <el-col :span="12" v-for="field in formData.fields" :key='field.field'>
          <el-form-item :label="field.showName">
            <ele-block :field="field" :domainObject="formData.domainObject" :editable="true" :uploadUrl="formData.uploadUrl" :inputKey="formData.inputKey"></ele-block>
          </el-form-item>
        </el-col>
      </el-row>
    </ele-form>
    <el-dialog title="提示" :visible.sync="formData.dialogVisible" size="small" :before-close="handleClose">
      <span class="dig_span">共选中<span class="dig_span_num">{{formData.listSelect.length}}</span> 条运力，确定将选中的车辆及挂车与实际分享给<span class="dig_span_name" v-if='formData.model'>{{formData.model.orgFullName}}</span></span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="formData.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitShareTransport">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script type="text/ecmascript-6">
import eleList from '../components/ele-list/eleList.vue';
import group from './group.vue';
import { urlRedirect, checkPermission, getParam, showMessageUtil } from '../../api/Utils';
import { getColumn, list, getSearch, exportCsv, downloadErrorData, downloadTemplate, mainViceDriver, tagList, addTag, editTag, deleteTag,shareTransport } from '../../api/TransportService';
import { deleted } from '../../api/TruckService';
import * as TruckService from '../../api/TruckService';
import * as ApiConst from '../../api/ApiConst';
import eleBlock from '../components/ele-block/eleBlock.vue';
import eleForm from '../components/ele-form/eleForm.vue';

export default {
  name: 'trailerList',
  components: {
    'ele-list': eleList,
    'ele-form': eleForm,
    'ele-block': eleBlock,
    group
  },
  props: {
    selectable: {
      type: Boolean,
      'default': true
    },
    operatable: {
      type: Boolean,
      'default': true
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
      'default': function() {
        return {};
      }
    }
  },
  data: () => {
    return {
      formData: {
        dialogVisible: false,
        model: null,
        listSelect: [],

        fields: [],
        uploadUrl: '',
        inputKey: [],
        domainObject: { clientOrgName: '', clientOrgCode: '', platformClientOrgCode: '' }
      },
      listData: [],
      total: 0,
      loading: true,
      getColumn,
      getImportColumn: TruckService.getDetail,
      getList: list,
      getSearch,
      objectName: '车辆',
      addUrl: '/truck/add.html',
      editUrl: '/truck/add.html',
      listUrl: '/transport/list.html',
      deleteFun: deleted,
      exportCsv,
      add: TruckService.add,
      downloadErrorData,
      importUrl: `${ApiConst.apiTruckDomain}/import/custom/truck`,
      downloadTemplate,
      addTag,
      editTag,
      deleteTag,
      folder: 'transport/transport',
      tagData: [],
      extraSearchParamObj: {}
    };
  },
  methods: {
    submitShareTransport(){
      this.formData.dialogVisible = false;
      // 网络请求
      let parm = {orgCode:this.formData.model.orgCode};
      let list = [];
      this.formData.listSelect.forEach(v=>{
        if(v.platformMainTruckCode){
           list.push(v.platformMainTruckCode);
        }
      })
      parm.truckCode = list.join(',');
      shareTransport(parm,(success,error)=>{
        if(success && success.content){
          showMessageUtil('success', '分享成功', 2000)
        }
        if(error){
           showMessageUtil('warning', error.content, 2000)
        }
      })
    },
    shareTransport() {
      this.formData.listSelect = [];
      this.formData.model = null;
      let listSelect = this.getAllSelectedItem();
      if (listSelect.length < 1) return;
      this.formData.listSelect = listSelect;
      let el = this.$refs.form.getElementByField('clientOrgCode');
      if (el.select) el.select();
      el.handleSelect = this.handleSelect;
    },
    handleSelect(model) {
      console.log('===========', model);
      this.formData.dialogVisible = true;
      this.formData.model = model;
    },
    getAllSelectedItem() {
      let list_select = [];
      this.listData.forEach(item => {
        if (item.checked != undefined && item.checked == true) {
          list_select.push(item)
        }
      })
      if (list_select.length < 1) {
        showMessageUtil('warning', '您没有选择任何车辆，请检查', 2000)
      }
      return list_select;
    },
    initForm() {
      const self = this,
        eleConfig = {
          data: {
            content: [{
              "showName": "分享客户",
              "elementCode": "popSelectPartner",
              "extraParams": "{\"field1\":\"clientOrgName\",\"field2\":\"clientOrgCode\",\"field3\":\"clientOrgCode\",\"field4\":\"platformClientOrgCode\",\"required\":\"false\",\"readonly1\":\"TRUE\",\"detailLinkVisiable\":\"false\",\"maxLength1\":\"50\",\"placeholder1\":\"请输入托运客户\",\"outputKey1\":\"partner\",\"outputKey3\":\"partner\",\"outputKey4\":\"partner\",\"inputKey1\":\"rates.partnerName,partner.orgName\",\"inputKey2\":\"partner.code,rates.partnerCode\",\"inputKey4\":\"partner.orgCode\",\"isPageOrder3\":\"1\",\"chooseSelf3\":\"FALSE\"}",
              "fieldConfigCode": "clientOrg"
            }]
          }
        },
        eleDefine = JSON.parse(localStorage.getItem('eleDefine')),
        eleInfo = JSON.parse(localStorage.getItem('eleInfo'));
      self.formData.fields = getParam(eleConfig, eleDefine, eleInfo).field;
    },
    getHeight() {
      console.log('getHeight now');
      this.$refs.eleList.getHeight();
    },
    filterData(params) {
      console.log('new filter params is', params);
      this.extraSearchParamObj = params;
      setTimeout(() => {
        this.$refs.eleList.dispatchQueryEvent();
      }, 300);
    },
    //司机调班
    changeShift() {
      let list_select = [];
      this.listData.forEach(item => {
        if (item.checked != undefined && item.checked == true) {
          list_select.push(item)
        }
      })
      console.log('listData...', this.listData)
      console.log('list_select...', list_select)
      if (list_select.length < 1) {
        this.$message({
          type: 'warning',
          message: `您没有选择任何车辆，请检查`,
          duration: 1000
        });
        return;
      }
      const self = this;
      this.$msgbox({
        title: '确认',
        message: `共选中${list_select.length}个车辆，确定对调换班所选车辆的主副驾司机吗？`,
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            let count = list_select.length;
            let count_suc = 0;
            let count_fail = 0;
            list_select.forEach(model => {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '执行中...';
              mainViceDriver({ code: model.platformMainTruckCode }, (success, error) => {
                if (success) {
                  count_suc++;
                }
                if (error) {
                  count_fail++
                }
                if (count == count_suc + count_fail) {
                  done();
                  if (count == count_suc) {
                    this.$message({
                      type: 'success',
                      message: '司机全部对调成功',
                      duration: 1000
                    });
                  } else {
                    this.$message({
                      type: 'warning',
                      message: `成功${count_suc} 失败${count_fail}`,
                      duration: 1000
                    });
                  }
                  instance.confirmButtonLoading = false;
                  self.$refs.eleList.dispatchQueryEvent();
                }
              });
            })
          } else {
            done();
          }
        }
      }).then(() => {

      });

    },
    openWindow(url, title) {
      urlRedirect(url, title);
    },
    more(model) {
      //        console.log('more', `${this.listUrl}?objectName=${this.objectName}&${this.toParameterArray(model).join('&')}`);
      this.openWindow(`${this.listUrl}?objectName=${this.objectName}&${this.toParameterArray(model).join('&')}`, `${this.objectName}列表`);
    },
    doRemove(model) {
      const self = this;
      this.$msgbox({
        title: '确认',
        message: `确认要删除${this.objectName} ${model.mainTruckLicenseNo} 吗？`,
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = '执行中...';
            deleted({ code: model.mainTruckCode }, (success, error) => {
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
    toParameterArray(model) {
      const params = [];
      Object.keys(model).forEach((key) => {
        params.push(`${key}=${encodeURIComponent(model[key])}`);
      });
      return params;
    },
    action(command, menu, model) {
      console.log('action command', command, 'menu', menu, 'model', model);
      switch (command) {
        case 'add':
          this.openWindow(`${this.addUrl}?objectName=${this.objectName}`, `新建${this.objectName}`);
          break;
        case 'edit':
          this.openWindow(`${this.editUrl}?code=${model.mainTruckCode}&objectName=${this.objectName}`, `编辑${this.objectName}`);
          break;
        case 'remove':
          this.doRemove(model);
          break;
        default:
          break;
      }
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
    query(searchParams) {
      console.log('searchParams', searchParams);
      Object.assign(searchParams, this.params);
      console.log('query', searchParams);
      const self = this;
      this.total = 0;
      this.loading = true;
      self.listData = [];
      list(searchParams, (success, error) => {
        if (error) {
          this.$message({
            type: 'error',
            message: error.content,
            duration: 5000
          });
        }
        if (success) {
          this.total = success.total;
          success.content.forEach((data) => {
            const actionList = [];
            actionList.push({ key: 'edit', name: '编辑' });
            // 车辆列表新增删除权限控制
            if (checkPermission("transport.delete")) {
              actionList.push({ key: 'remove', name: '删除' });
            }
            data.actionMenuList = actionList;
          });
          self.listData = success.content;
          this.loading = false;
          //              self.listData.splice(self.listData.length);
          //console.log('parent.listData', self.listData);
        }
      });
    }
  },
  created() {
    this.initForm();
    tagList((success, error) => {
      if (error) {
        this.$message({
          type: 'error',
          message: error.content,
          duration: 3000
        });
        return false
      }
      if (success) {
        const data = success.content,
          tempData = [];
        data.forEach((val) => {
          const obj = {
            name: val.tag,
            isActive: false
          };
          tempData.push(obj);
        });
        this.tagData = tempData;
      }
    });
  }
};

</script>
<style lang="scss" rel="stylesheet/scss">
#list_transport {
  .form_st {
  height:0px;
  position:absolute;
  top:-10000px;
}


  .dig_span {
    display: inline-block;
    margin: 10px 0px;
    .dig_span_num {
      color: red;
    }
    .dig_span_name {
      color: #0066FF;
    }
  }
}

</style>
