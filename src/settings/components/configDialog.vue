<template>
<div>
<el-dialog
  id="configDialog"
  :title="'参数配置'"
  :visible.sync="dialogVisible"
  :show-close="false"
  width="80%">
  <el-row>
    <el-form :model="domainObject" ref="configForm" label-width="230px" :inline="false" :label-position="'right'" >
      <el-col :span="24" v-for="(item, index) in formFields" :key="index">
        <el-form-item
          :label="item.label"
          :prop="item.prop"
          :rules="[
            { required: true, message: `请填写${item.label}`, trigger: 'blur' },
          ]">
          <template v-if="item.options">
            <d-select :editable="editable" :options="item.options" v-model="domainObject[item.prop]"></d-select>
          </template>
          <template v-else>
            <el-input v-if="editable" v-model="domainObject[item.prop]"></el-input>
            <span v-else>{{ domainObject[item.prop] || '无' }}</span>
          </template>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="是否开发环境"
          :rules="[
            { required: true, message: '请填写', trigger: 'blur', type: 'Number' },
          ]">
          <d-select :editable="editable" :options="{1: '是', 0:'否'}" v-model="domainObject['isDev']"></d-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="备注">
          <el-input v-model="domainObject.remark" placeholder="请输入"></el-input>
        </el-form-item>
      </el-col>
    </el-form>
  </el-row>
  <span slot="footer" class="dialog-footer">
    <el-button @click="handleCancle('configForm')">关 闭</el-button>
    <el-button type="primary" @click="handleSubmit('configForm')" :disabled="disabledSubmit">保存</el-button>
  </span>
</el-dialog>
</div>
</template>

<script>
import dSelect from '../../components/ele-select'
import { add, update } from '../../../api/LjsService'

export default {
  name:'config-dialog',
  props: {
    params: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  components: {
    dSelect
  },
  data() {
    return {
      isAdd: false,
      dialogVisible: false,
      disabledSubmit: false,
      domainObject: {},
      editable: false,
      formFields: [
        { label:'企业名称', prop: 'orgName'},
        { label:'链金师APP Id', prop: 'appId'},
        // { label:'企业组织编码', prop: 'orgCode'},
        { label:'链金师核心企业auid', prop: 'ljsCoreAuid'},
        { label:'数金开放平台密钥ID', prop: 'keyId'},
        { label:'数金开放平台开发者私有密钥', prop: 'priKey'},
        // { label:'是否开发环境', prop: 'isDev', options: {1: '是', 0:'否'}},
      ]
    }
  },
  methods: {
    init(params) {
      this.domainObject = {}
      this.editable = true
      if(params.id) {
        Object.keys(params).forEach((key) => {
          this.domainObject[key] = params[key]
        })
      } else {
        this.isAdd = true
      }
      this.dialogVisible = true
    },
    handleCancle(formName) {
      this.$refs[formName].resetFields()
      this.dialogVisible = false
    },
    handleSubmit(formName) {
      this.disabledSubmit = true
      if(this.domainObject['actionMenuList']) {
        delete this.domainObject['actionMenuList']
      }
      this.$refs[formName].validate((valid) => {
        if(valid) {
          if(this.isAdd) {
            this.domainObject.isActive = "0"
            this.handleAdd()
          } else {
            this.handleUpdate()
          }
        } else {
          this.disabledSubmit = false
        }
      })
    },
    handleAdd() {
      add(this.domainObject, (success, error) => {
        if (error) {
          this.$message({
            type: 'error',
            message: error.content,
            duration: 5000
          });
          this.disabledSubmit = false
        }
        if (success) {
          this.$emit('loadingData')
          this.handleCancle('configForm')
        }
      })
    },
    handleUpdate() {
      this.disabledSubmit = false
      update(this.domainObject, (success, error) => {
        if (error) {
          this.$message({
            type: 'error',
            message: error.content,
            duration: 5000
          });
          this.disabledSubmit = false
        }
        if (success) {
          this.$emit('loadingData')
          this.handleCancle('configForm')
        }
      })
    }
  },

}
</script>
