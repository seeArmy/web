/**
 * slideVerification
**/
<template>
<div class="drag">
  <div class="bg"></div>
  <div class="label">请按住滑块，拖动到最右边</div>
  <div class="btn"><i class="el-icon-d-arrow-right" /></div>
</div>
</template>

<script>
export default {
  name: 'slider',
  data() {
    return {

    }
  },
  methods: {
    load() {

    }
  },
  mounted() {
    const self = this
    var dom = function(selector) { return document.querySelector(selector); },
      box = dom(".drag"),
      bg = dom(".bg"),
      text = dom(".label"),
      btn = dom(".btn"),
      success = false,
      distance = box.offsetWidth - btn.offsetWidth;
    btn.onmousedown = function(e) {
      btn.style.transition = "";
      bg.style.transition ="";
      var e = e || window.event;
      var downX = e.clientX;
      document.onmousemove = function(e){
        var e = e || window.event;
        var moveX = e.clientX;
        var offsetX = moveX - downX;
        if( offsetX > distance){
          offsetX = distance;
        }else if( offsetX < 0){
          offsetX = 0;
        }
        btn.style.left = offsetX + "px";
        bg.style.width = offsetX + "px";
        if( offsetX == distance){
          text.innerHTML = "请稍后....";
          text.style.color = "#FFFFFF";

          btn.innerHTML = "<i class='el-icon-loading' />";
          btn.style.color = "#76c61d";
          bg.style.backgroundColor = "#76c61d";

          success = true;
          btn.onmousedown = null;
          document.onmousemove = null;
          setTimeout(function(){
            text.innerHTML = "验证通过";
            btn.innerHTML = "<i class='el-icon-circle-check' />";
            self.$emit('sliderAction', true)
          },1500);
        }
      }

      document.onmouseup = function(e){
        if(success){
          return;
        }else{
          btn.style.left = 0;
          bg.style.width = 0;
          btn.style.transition = "left 1s ease";
          bg.style.transition = "width 1s ease";
        }
        document.onmousemove = null;
        document.onmouseup = null;
      }
    }

  }
}
</script>


<style lang="scss" scoped>
@import "../../assets/sass/_color.scss";

.drag{
  width: 300px;
  height: 35px;
  line-height: 35px;
  background-color: #e8e8e8;
  position: relative;
  box-shadow: 1px 1px 6px #ddd;
}
.bg{
  width: 35px;
  height: 100%;
  position: absolute;
  background-color: $uiColor;
}
.label{
  position: absolute;
  width: 100%;
  height: 100%;
  text-align: center;
  user-select: none;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 80%;
  background: -webkit-gradient(linear, left top, right top, color-stop(0, #4d4d4d), color-stop(.4, #4d4d4d), color-stop(.5, white), color-stop(.6, #4d4d4d), color-stop(1, #4d4d4d));
  background-clip: text;
  -webkit-background-clip: text;
  animation: slidetounlock 3s infinite;
  -webkit-animation: slidetounlock 3s infinite;
  -webkit-text-fill-color: transparent;
  -webkit-text-size-adjust: none;
  color: #aaa;
}
@keyframes slidetounlock {
  0% {background-position:-200px 0;}
  100% {background-position:200px 0;}
}
@-webkit-keyframes slidetounlock {
  0%  {background-position:-200px 0;}
  100%  {background-position:200px 0;}
}
.btn{
  width:35px;
  height: 35px;
  text-align: center;
  position: absolute;
  border:1px solid #ccc;
  cursor: pointer;
  background-color: #fff;
  color:#ccc;

}
</style>
