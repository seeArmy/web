/**
* 树形选择框
* Created by zhangjiwei on 17/12/28.
*/
<template>
  <div class="tree-select" v-clickoutside="closeTree">
        <div class="tree-select-title" @click="e=>this.showTree=!this.showTree">
          <i class="down-icon el-icon-d-caret"></i>
          {{this.currentNode.label}}
        </div>
        <div v-show="showTree" class="tree-select-content">
          <el-tree :data="privateTreeData" ref="tree"
                   node-key="id"
                   :current-node-key="this.value"
                   :highlight-current="false"
                   :default-expand-all="true"
                   :expand-on-click-node="false"
                   @node-click="nodeClick">
          </el-tree>
        </div>
    <span v-if="!editable">{{text}}</span>
  </div>
</template>

<script type="text/ecmascript-6">
  import { Tree } from 'element-ui';
  import clickoutside from './clickOutSide';

  export default {
    components: {
      'el-tree': Tree
    },
    name: 'eleTreeSelect',
    inject: ['eventBus'],
    directives: {
      clickoutside
    },
    data() {
      return {
        treeDataCache: {},
        showTree: false,
        emptyNode: { label: '请选择', value: '', id: '', children: [] },
        currentNode: {}
      };
    },
    computed: {
      privateTreeData() {
        this.buildNodeCache();
        return this.treeData;
      }
    },
    props: {
      value: String,
      treeData: Array,
      editable: {
        type: Boolean,
        'default': true
      }
    },
    methods: {
      closeTree() {
        this.showTree = false;
      },
      nodeClick(data) {
        this.showTree = false;
        this.currentNode = data;
        this.$emit('input', data.value);  // 回调v-model
      },
      getNodeByValue(v) {
        let result = this.treeDataCache[v];
        if (!result) {
          result = this.emptyNode;
        }
        return result;
      },
      buildNodeCache() {
        const stack = [];
        this.treeData.forEach(node => stack.push(node));
        while (stack.length > 0) {
          const node = stack.pop();
          this.treeDataCache[node.value] = node;
          node.children.forEach(child => stack.push(child));
        }
      }
    },
    mounted() {
      // 组件复制一下传入的数组，因为需要添加一个 请选择的数据。
      this.currentNode = this.getNodeByValue(this.value);
      this.$watch('value', (val) => {
        this.currentNode = this.getNodeByValue(val);
      });
      if (this.eventBus) {
        this.eventBus.$emit('eleMounted', this);
      }
    }
  };
</script>

<style lang="css" rel="stylesheet/css">
  .tree-select{position:relative;min-width:200px;display:inline-block}
  .tree-select-title{
    height:24px;
    line-height: 24px;
    text-align: left;
    padding-left:10px;
    border:1px solid #dadada;
    cursor:pointer;
  }
  .tree-select-content{
    box-sizing:border-box;
    z-index:99;
    position:absolute;
    left:0px;
    top:25px;
    width:100%;
    min-height: 20px;
    background:#fff;
    overflow: hidden;
    box-shadow: 10px 10px 50px #ccc;
  }
  .down-icon{float:right;line-height: 24px;margin-right:10px;}
</style>
