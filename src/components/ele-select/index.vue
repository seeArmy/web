/**
动态数据选择下拉框。
*/
<template>
  <div style="display:inline-block;width:100%">
    <el-select  v-if="editable" v-model="myVal" :placeholder="placeholder"  @change="handleChange" style="width:100%" filterable clearable>
      <el-option :key="-1" :label="placeholder" value=""/>
      <el-option v-for="item in parsedOptions" :key="item.value" :label="item.label" :value="item.value"/>
    </el-select>
    <span v-else>{{valueText}}</span>
  </div>
</template>

<script>
  export default {
    name:"dyn-select",
    props: {
      value: null,    // 组件值
      editable:{      // 是否是编辑状态
        default:true
      },
      options:Object,
      placeholder: {
        type: String,
        'default': '请选择'
      }
    },
    data() {
      return {
        myVal: null
      };
    },
    watch: {
      value(val, oldVal){
        if(val!= this.myVal){
          this.myVal=val+'';
        }
      }
    },
    methods:{
      handleChange(val){
        this.$emit('input',val);
      }
    },
    computed:{
      valueText(){
        var ret = this.options[this.value];
        ret == null ? '' : ret;
        return  ret;
      },
      parsedOptions(){
        var pVal =Object.keys(this.options).map(item=>{   // 转换后value会变成string类型，比较坑
          return {
            label:this.options[item],
            value:item
          }
        })
        return pVal;
      }
    },
    created(){
      if(this.value!=null)
        this.myVal = this.value+''; //options在转换后value会变成string类型，比较坑，这里必须转换为string才能正确显示。
    }
  }
</script>
<style scoped>
</style>
