/**
* Created by zhangjiwei on 17/12/28.
*/
<template>
  <ele-tree-select  :treeData="ajaxTreeData" v-model="myVal"/>
</template>

<script type="text/ecmascript-6">
  import { getSelfDept } from '../../../api/OrgService';
  import EleTreeSelect from './eleTreeselect.vue';

  export default {
    components: {
      'ele-tree-select': EleTreeSelect
    },
    data() {
      return {
        ajaxTreeData: [],
        myVal: ''
      };
    },
    props: {
      value: String
    },
    methods: {
      loadTreeData() {
        getSelfDept({}, (success) => {
          if (success) {
            const jsonArr = success.content,
              rootNodes = [],
              stack = [],
              buildNode = function (item) {
                return Object.assign({
                  id: item.code,
                  value: item.code,
                  label: item.deptName,
                  children: []
                }, item);
              };
            jsonArr.forEach((item) => {
              if (!item.parentDeptCode) {
                const node = buildNode(item);
                rootNodes.push(node);
                stack.push(node);
              }
            });
            while (stack.length > 0) {
              const parentNode = stack.pop();
              jsonArr.forEach((item) => {
                if (item.parentDeptCode === parentNode.code) {
                  const child = buildNode(item);
                  parentNode.children.push(child);
                  stack.push(child);
                }
              });
            }
            this.ajaxTreeData = rootNodes;
            this.myVal = this.value;    // 数据加载完再选中节点。
          }
        });
      }
    },
    mounted() {
      this.loadTreeData();
      this.$watch('myVal', val => this.$emit('input', val));
    }
  };
</script>

<style lang="css" rel="stylesheet/css">
</style>
