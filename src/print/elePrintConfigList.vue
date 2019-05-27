/**
* list.vue
* 运单列表
* Created by zhuyi on 17/7/21.
*/
<template>
  <div v-show="isReady">
    <ele-list :selectable="selectable" :operatable="operatable"
              @query="query" @ready="query" @action="action" @more="more"
              :showExportButton="false" :showImportButton="false" :showDownloadTemplate="false"
              :total="total" :loading="loading"
              :list-data="listData"
              ref="eleList"
              :customColumn="customColumn"
              :params="params"
              :needPage="needPage"
              :needMore="needMore"
              :isAdvanced="isAdvanced"
              :deleteFun="deleteFun"
              :add="addFun"
              :editUrl="editUrl"
              :getColumn="getColumn"
              :getSearch="getSearch"
              :needAdd= 'needAdd'
              :objectName="objectName">
     <a class="el-button el-button--line" slot="topRightFun" v-if='!needAdd' @click='creatTemplate'>添加新的模板</a>
    </ele-list>

    <ele-pop-select ref="pop" :configData='configData' :domainObject='domain' :editable='false' :handleSelect='handleSelect'></ele-pop-select>
  </div>
</template>

<script type="text/ecmascript-6">
  import eleList from '../components/ele-list/eleList.vue';

  import elePopSelect from '../components/ele-pop-select/elePopSelect.vue';

  import { urlRedirect } from '../../api/Utils';
  import * as PrintTemplateService from '../../api/PrintTemplateService';
  import * as RenderService from '../../api/RenderService';
  import * as PrintTemplateHelper from './PrintTemplateHelper';

  export default {
    name: 'elePrintConfigList',
    components: {
      'ele-list': eleList,
      'ele-pop-select': elePopSelect
    },
    computed:{
      needAdd(){
        return this.isPlatform ? true :false;
      }
    },
    props: {
      addUrl: String,
      editUrl: String,
      listUrl: String,
      moduleName: String,
      businessObjectName: String,
      objectName: String,
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
      needMore: {
        type: Boolean,
        'default': false
      },
      params: {
        type: Object,
        'default': function () {
          return {};
        }
      },
      isPlatform: {
        type: Boolean,
        'default': true
      },
    },
    data: () => {
      return {
        listData: [],
        businessObjectFieldList: [],
        total: 0,
        loading: true,
        isReady: false,
        getColumn: PrintTemplateService.getColumn,
        getSearch: PrintTemplateService.getSearch,

        // 弹框选择模板的 配置
        configData:{
          chooseSelf:'FALSE',
          controlType:'pop',
          datasource:'print',
          field:'print',
          outputKey:'print',
          required:true,
          value:''
        },
        domain:{
        }
      };
    },
    methods: {
      handleSelect(model){
         PrintTemplateService.addDocumentRelation(this.moduleName, this.businessObjectName, {platformCode:model.code}, (success,error)=>{
          if(success){
            // 刷新页面
            this.$refs.eleList.dispatchQueryEvent();
          }
         });
      },
      // 创建模板
      creatTemplate(){
        this.$refs.pop.select();
      },
      addFun(model, cb) {
        PrintTemplateService.add(this.moduleName, this.businessObjectName, model, cb);
      },
      deleteFun(code, cb) {
        PrintTemplateService.remove(this.moduleName, this.businessObjectName, code, cb);
      },
//      getColumn(cb) {
//        PrintTemplateService.getColumn(this.moduleName, this.businessObjectName, cb);
//      },
//      getSearch(cb) {
//        PrintTemplateService.getSearch(this.moduleName, this.businessObjectName, cb);
//      },
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
          message: `确认要删除${this.objectName} ${model.name} 吗？`,
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '执行中...';

              let remove = this.isPlatform ?  PrintTemplateService.remove : PrintTemplateService.removeDocumentRelation;

               remove(this.moduleName, this.businessObjectName, model.code, (success, error) => {
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
      action(command, menu, model) {
        console.log('action command', command, 'menu', menu, 'model', model);
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
          case 'preview': {
            this.doPreview(model);
            break;
          }
          default:
            break;
        }
      },
      loadBusinessObjectFields(model) {
        if (model.documentCode) {
          const businessObject = model.documentCode.split('.');
          console.log('found', businessObject);
          PrintTemplateService.getBusinessObjectDetailRenderList(businessObject[0], businessObject[1], (success, error) => {
            if (error) {
              console.error('get detail render error', error);
            } else {
              console.log('success', success);
              RenderService.getRenderList(success, (response, err) => {
                if (err) {
                  console.error('get detail render error', err);
                } else {
                  model.checkedFields = response.field;
                  model.fieldsReady = true;
                  this.showPreview(model);
                }
              });
            }
          });
        }
      },
      showPreview(model) {
        if (model.fieldsReady && model.bgImageReady) {
          const checkedFields = model.fields.split(','),
            selected = model.checkedFields.filter(item => checkedFields.find(code => item.fieldConfigCode === code));
          PrintTemplateHelper.previewDocument(selected, model.bgImageUrl, model.context, model.qrcodeField);
        }
      },
      doPreview(model) {
        this.loadBusinessObjectFields(model);
        if (model.bgPicResourceCode) {
          PrintTemplateService.getResource(this.moduleName, model.bgPicResourceCode, (success, error) => {
            if (error) {
              console.error('get resource error', error);
            } else {
              model.bgImageUrl = success.content.thumbnailList[0].url;
              model.bgImageReady = true;
              this.showPreview(model);
            }
          });
        } else {
          model.bgImageReady = true;
        }
      },
      query(searchParams) {
        console.log('searchParams', searchParams);
        Object.assign(searchParams, this.params);
        console.log('query', searchParams);
        this.total = 0;
        this.loading = true;
        this.listData = [];

        let netList = this.isPlatform ? PrintTemplateService.list : PrintTemplateService.listDocumentRelation; 
        netList(this.moduleName, this.businessObjectName, searchParams, (success, error) => {
          this.loading = false;
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
              actionList.push({ key: 'preview', name: '预览' });
              if(this.isPlatform){
                  actionList.push({ key: 'edit', name: '编辑' });
              }
              actionList.push({ key: 'remove', name: '删除' });
              data.actionMenuList = actionList;
            });
            this.listData = success.content;
          }
        });
      }
    },
    mounted() {
      this.isReady = true;
      // this.$refs.pop.handleSelect = this.handleSelect;
    },
    created() {
//      PrintTemplateService.getBusinessObjectDetailRenderList(this.moduleName, this.businessObjectName, (success, error) => {
//        if (error) {
//          console.error('get detail render error', error);
//        } else {
//          RenderService.getRenderList(success, this.onRenderConfigDataReady);
//        }
//      });
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  .el-dialog__body {
    .complex-control-2 {
      .innerblock {
        width: 110px;
      }
    }
    .form-page .el-row .el-col-12:nth-child(6n), .form-page .el-row .el-col-12:nth-child(6n-1) {
      margin-bottom: 0;
      border-bottom: 0;
    }
  }
</style>

