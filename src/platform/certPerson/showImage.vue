/**
* showImage.vue
* Created by cc on 17/12/13.
*/
<template>
  <div class="show-image">
    <div class="img-opr-btn" v-if="imageUrl">
      <a :href="imageUrl" target="_blank" class="link">原始图片</a> | 
      <span class="rotate-btn" @click="rotateFun('minus')">逆时针旋转90°</span> | 
      <span class="rotate-btn" @click="rotateFun('plus')">顺时针旋转90°</span> | 
      <span class="zoom-btn" @click="zoomFun('original')">实际尺寸</span> | 
      <span class="zoom-btn" @click="zoomFun('zoomIn')">放大</span> | 
      <span class="zoom-btn" @click="zoomFun('zoomOut')">缩小</span> | 
      <span class="del-btn" @click="delFun">删除</span>
    </div>
    <img :src="imageUrl" alt="" id="imgPreview" class="img" :style="{transform:'rotate('+ imgDegree + 'deg) scale('+ imgScale +')', left: imgLeft + 'px', top: imgTop + 'px'}">
  </div>
</template>

<script type="text/ecmascript-6">


export default {
  name: 'showImage',
  props: {
    imageUrl: ''
  },
  data() {
    return {
      imgDegree: 0,
      imgScale: 1,
      imgLeft: null,
      imgTop: null
    };
  },
  computed: {
  },
  methods: {
    rotateFun(type) {
      if (type === 'plus') {
        this.imgDegree += 90;
      } else {
        this.imgDegree -= 90;
      }
    },
    zoomFun(type) {
      const self = this;
      switch(type) {
        case 'original':
          self.imgScale = 1;
          break;
        case 'zoomIn':
          self.imgScale += 0.5;
          break;
        case 'zoomOut':
          self.imgScale -= 0.5;
          if (self.imgScale < 0.5) {
            self.imgScale = 0.5;
          }
          break;
      }
    },
    delFun() {
      console.log('即将删除的图片url为', this.imageUrl);
      this.$emit('delImg', this.imageUrl);
      this.imageUrl = null;
    }
  },
  watch: {
    imageUrl: function(newVal, oldVal) {
      if (newVal && oldVal) {
        const dom = document.querySelector('#imgPreview');
        this.imgLeft = null;
        this.imgTop = null;
        dom.style.left="auto";
        dom.style.top="auto";
      }
    }
  },
  created() {
  },
  mounted() {
    const self = this;
    //获取元素
    var img = document.getElementById('imgPreview');
    var area = document.getElementById('voucherPreview');
    var x = 0;
    var y = 0;
    var l = 0;
    var t = 0;
    var isDown = false;
    //鼠标按下事件
    img.onmousedown = function(e) {
        //获取x坐标和y坐标
        x = e.clientX;
        y = e.clientY;

        //获取左部和顶部的偏移量
        l = img.offsetLeft;
        t = img.offsetTop;
        //开关打开
        isDown = true;
        //设置样式  
        img.classList.add('move');
    }
    //鼠标移动
    area.onmousemove = function(e) {
        e.preventDefault();
        if (isDown == false) {
            return;
        }
        //获取x和y
        var nx = e.clientX;
        var ny = e.clientY;
        //计算移动后的左偏移量和顶部的偏移量
        var nl = nx - (x - l);
        var nt = ny - (y - t);

        self.imgLeft = nl;
        self.imgTop = nt;

        // img.style.left = nl + 'px';
        // img.style.top = nt + 'px';
    }
    //鼠标抬起事件
    img.onmouseup = function() {
        //开关关闭
        isDown = false;
        img.classList.remove('move');
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss">
.show-image {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .img {
    position: absolute;
  }
  .move {
    cursor: move;
  }
  .img-opr-btn {
    position: absolute;
    z-index: 20;
    left: 50%;
    bottom: 0;
    padding: 10px 20px;
    transform: translateX(-50%);
    background-color: rgba(0,0,0,.5);
    color: #fff;
    white-space: nowrap;
    border-radius: 5px;
    .rotate-btn, .zoom-btn, .del-btn {
      margin-left: 5px;
      margin-right: 5px;
      cursor: pointer;
      &:hover {
        color: #f48400;
      }
    }
    .link {
      margin-right: 5px;
      color: #fff;
      &:hover {
        color: #f48400;
      }
    }
  }
  .img {
    max-width: 100%;
    max-height: 100%;
  }
}
</style>
