/**
* eleTag.vue
* Created by dsky on 17/8/2.
*/
<template>
  <div class="block">
    <el-form-item :prop="this.configData.field" :rules="rules" v-if="!isList && editable">
      <el-tag
        :key="tag.name"
        v-for="tag in tagData"
        :closable="tag.close"
        :class="tag.border === 'dashed' ? 'dash-tag' : 'dash-tag solid-tag'"
        type="primary"
        :close-transition="false"
        @close="handleClose(tag)"
        @click.native.self="tag.handle ? handleClick($event, tag) : ''"
      >
        {{tag.name}}
      </el-tag>
      <el-input
        class="input-new-tag"
        v-if="inputVisible"
        v-model="inputValue"
        :maxlength="configData.maxLength"
        ref="saveTagInput"
        size="mini"
        @keyup.enter.native="handleInputConfirm"
        @blur="handleInputConfirm"
      >
      </el-input>
      <el-button v-else class="button-new-tag" size="small" @click="showInput" :disabled="configData.readonly === 'TRUE'">添加标签</el-button>
    </el-form-item>
    <!-- <template v-if="isList && editable">
      <el-tag
        :key="tag"
        v-for="tag in domainObject[configData.field]"
        :closable="true"
        type="primary"
        :close-transition="false"
        @close="handleClose(tag)"
      >
        {{tag}}
      </el-tag>
      <el-input
        class="input-new-tag"
        v-if="inputVisible"
        v-model="inputValue"
        :maxlength="configData.maxLength"
        ref="saveTagInput"
        size="mini"
        @keyup.enter.native="handleInputConfirm"
        @blur="handleInputConfirm"
      >
      </el-input>
      <el-button v-else class="button-new-tag" size="small" @click="showInput">添加标签</el-button>
    </template> -->
    <span v-if="editable === false">{{text}}</span>
  </div>
</template>

<script type="text/ecmascript-6">
  import * as DataSourceService from '../../../api/DataSourceService';
  // import { dealInputKey } from '../../../api/Utils';

  export default {
    name: 'eleTag',
    inject: ['eventBus'],
    props: {
      isList: Boolean,
      configData: Object,
      editable: {
        type: Boolean,
        'default': true
      },
      domainObject: Object,
      rules: Array
    },
    computed: {
      text() {
        if (this.domainObject && this.configData && this.configData.field in this.domainObject) {
          if (this.domainObject[this.configData.field] instanceof Array) {
            return this.domainObject[this.configData.field].join(',');
          }
          return this.domainObject[this.configData.field];
        }
        return '';
      }
    },
    data() {
      return {
        tagData: [],
        subData: [],
        tempTagArray: [],
        inputVisible: false,
        inputValue: ''
      };
    },
    watch: {
      subData: {
        deep: true,
        handler(newval, oldval) {
          console.log('检测到subdata变化：newwal is', newval, 'oldval is', oldval);
          if (newval) {
            this.convertText(newval);
          }
        }
      }
    },
    methods: {
      form() {
        let parent = this.$parent;
        if (parent) {
          while (parent && parent.$options && parent.$options.componentName !== 'eleForm') {
            parent = parent.$parent;
          }
          return parent;
        }
        return null;
      },
      init() {

      },
      convertText(arr) {
        const nameArray = [];
        arr.forEach((val) => {
          nameArray.push(val.name);
        });
        this.domainObject[this.configData.field] = nameArray;
        console.log('提交标签值为：', this.domainObject[this.configData.field]);
      },
      handleClose(tag) {
        this.tagData.forEach((val, index) => {
          if (val === tag) {
            this.tagData.splice(index, 1);
            console.log('删除后的显示数组为：', this.tagData);
          }
        });
        this.subData.forEach((val, index) => {
          if (val === tag) {
            this.subData.splice(index, 1);
            console.log('删除后的提交数组为：', this.subData);
          }
        });
      },
      handleClick(e, tag) {
        console.log('click tag is', tag);
        // e.target.classList.toggle('solid-tag');
        if (!e.target.className.includes('solid-tag')) {
          this.tagData.forEach((val) => {
            if (val === tag) {
              val.border = 'solid';
            }
          });
          this.subData.push(tag);
        } else {
          this.tagData.forEach((val) => {
            if (val === tag) {
              val.border = 'dashed';
            }
          });
          this.subData.forEach((val, index) => {
            if (val === tag) {
              this.subData.splice(index, 1);
              console.log('删除后的数组为：', this.subData);
            }
          });
        }
      },
      showInput() {
        this.inputVisible = true;
        this.$nextTick(() => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      handleInputConfirm() {
        const inputValue = this.inputValue;
        if (inputValue) {
          const obj = {
            name: inputValue,
            border: 'solid',
            close: true
          };
          // this.subData = this.subData || [];
          this.subData.push(obj);
          // console.log('1111111111111 subData is', this.subData);
          // this.tagData = this.tagData || [];
          this.tagData.push(obj);
          // console.log('2222222222222 tagData is', this.tagData);
        }
        this.inputVisible = false;
        this.inputValue = '';
        // console.log('3333333333333', this.subData, this.tagData);
      }
    },
    mounted() {
      if (!this.isList) {
        if (this.eventBus) {
          this.eventBus.$emit('eleMounted', this);
        }
      }
      // this.$nextTick(() => {
      //   this.showInput();
      //   this.handleInputConfirm();
      // });
    },
    created() {
      console.log('tag this configData is', this.configData);
      if (!this.isList) {
        if (this.eventBus) {
          this.eventBus.$emit('eleCreated', this);
        }
        this.configData.maxLength = this.configData.maxLength ? Number(this.configData.maxLength) : 1000;

        if (this.configData.datasource) {
          DataSourceService[this.configData.datasource].getData((sucess) => {
            if (sucess) {
              console.log(sucess);
              const tempArray = [],
                tempText = [];
              sucess.forEach((val) => {
                tempText.push(val.tag);
                const obj = {
                  name: val.tag,
                  border: 'dashed',
                  handle: true,
                  close: false
                };
                tempArray.push(obj);
              });
              this.tempTagArray = tempArray;
              // 编辑页面
              if (this.domainObject[this.configData.field]) {
                const valArray = this.domainObject[this.configData.field],
                  defaultArray = [],
                  tempValArray = [];
                valArray.forEach((val) => {
                  if (tempText.includes(val)) {
                    tempArray.forEach((v, i) => {
                      if (v.name === val) {
                        tempArray[i].border = 'solid';
                        defaultArray.push(v);
                      }
                    });
                  } else {
                    const obj = {
                      name: val,
                      border: 'solid',
                      handle: false,
                      close: true
                    };
                    tempValArray.push(obj);
                  }
                });
                this.tagData = tempArray.concat(tempValArray);
                this.subData = defaultArray.concat(tempValArray);
              } else {
                this.tagData = this.tempTagArray;
              }
            }
          });
        }else if (this.configData.default && this.domainObject[this.configData.field] === this.configData.default) {
          const defaultVal = this.configData.default.split(','),
            defArray = [];
          defaultVal.forEach((val) => {
            const obj = {
              name: val,
              border: 'solid',
              handle: false,
              close: false
            };
            defArray.push(obj);
          });
          this.tagData = [].concat(defArray);
          this.subData = [].concat(defArray);
        } else if(this.domainObject[this.configData.field]){

            this.subData= this.domainObject[this.configData.field].map(item=>{
                return{
                  name:item,
                  handle: true,
                  close: true
                }
            });
          this.tagData=[].concat(this.subData);
        }
      }
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
.dash-tag {
  border-style: dashed;
  color: #333 !important;
  border-color: #999 !important;
  background-color: #fff !important;
  cursor: pointer;
  &:hover {
    border-color: #ffb45b !important;
    background-color: #fffaf4 !important;
    color: #f48400 !important;
  }
}
.solid-tag {
  border-style: solid;
  border-color: #ffb45b !important;
  background-color: #fffaf4 !important;
  color: #f48400 !important;
  cursor: pointer;
}
</style>
