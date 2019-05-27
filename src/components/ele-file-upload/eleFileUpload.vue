<template>
  <div class="file-component">
    <div :id="id" v-if="editable">

      <template v-if='hasRequired'>
        <el-form-item  :prop="this.configData.field" :rules="rules">
          <el-upload
            :action="configData && configData.controlType === 'file' ? newUploadUrl : action"
            :name="uploadFieldName"
            :data="data"
            :limit="maxLength"
            :multiple="multiple"
            :accept="accept"
            :list-type="listType"
            :with-credentials="withCredentials"
            :file-list="attachmentList"
            :on-success="_onSuccess"
            :on-preview="_onPreview"
            :before-upload="_beforUpload"
            :on-remove="_onRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
      </template>
      <template v-else>
          <el-upload
            :action="configData && configData.controlType === 'file' ? newUploadUrl : action"
            :name="uploadFieldName"
            :data="data"
            :limit="maxLength"
            :multiple="multiple"
            :accept="accept"
            :list-type="listType"
            :with-credentials="withCredentials"
            :file-list="attachmentList"
            :on-success="_onSuccess"
            :on-preview="_onPreview"
            :before-upload="_beforUpload"
            :on-remove="_onRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
      </template>
    </div>
    <div class="upload-file" v-if="!editable">
      <ul class="file-list">
        <li v-for="(item,index) in attachmentList" class="file-list-item">
          <span class="pre-mask" @click="showImage(item,index)"><i class="el-icon-view"></i></span>
          <img :src="item.url" alt="">
        </li>
      </ul>
    </div>
    <!-- 图片预览弹窗 -->
    <el-dialog :title="imgTitle" :visible.sync="dialogImageVisible" v-if="dialogImageVisible" class="original-dialog">
      <div class="img-opr-btn">
        <a :href="dialogImageUrl" target="_blank" class="link">原始图片</a> |
        <span class="rotate-btn" @click="rotateFun('minus')">逆时针旋转90°</span> |
        <span class="rotate-btn" @click="rotateFun('plus')">顺时针旋转90°</span> |
        <span class="zoom-btn" @click="zoomFun('original')">实际尺寸</span> |
        <span class="zoom-btn" @click="zoomFun('zoomIn')">放大</span> |
        <span class="zoom-btn" @click="zoomFun('zoomOut')">缩小</span>
      </div>
      <!-- <span class="prev-btn">←上一张</span>  @mousedown="moveFun"-->
      <img :src="dialogImageUrl" alt="" class="original" :style="{transform:'rotate('+ imgDegree + 'deg) scale('+ imgScale +')', left: imgLeft + 'px', top: imgTop + 'px'}" :id="'imgPreview' + dialogImageUrl">
      <!-- <span class="next-btn">下一张→</span> -->
    </el-dialog>
  </div>
</template>
<script type="text/ecmascript-6">
  const axios = require('axios');

  axios.defaults.withCredentials = true;

  export default {
    name: 'eleFileUpload',
    inject: ['eventBus'],
    props: {
      configData: Object,
      maxLength: {
        type: Number,
        'default': 3
      },
      uploadUrl: String,
      domainObject: Object,
      editable: {
        type: Boolean,
        'default': true
      },
      action: {
        type: String,
        required: true
      },
      uploadFieldName: {
        type: String,
        'default': 'file'
      },
      data: Object,
      withCredentials: {
        type: Boolean,
        'default': true
      },
      multiple: Boolean,
      accept: String,
      onSuccess: Function,
      onPreview: Function,
      onRemove: Function,
      listType: String,
      rules: {
        type:Array,
        'default': function () { return [] }
      }
    },
    computed:{
      hasRequired(){
        if(this.configData.hasOwnProperty('required')) return true;
        return false
      }
    },
    data() {
      return {
        newUploadUrl: `${this.uploadUrl}/fw/image/update`,
        attachmentList: [], // 默认显示数据，应该组件初始化时传入fileUploader. 之后不应该再修改它。
        dialogImageVisible: false,    // 预览框
        dialogImageUrl: '',      // 预览图片地址。
        addDom:null,
        isSelfModify:false,
//        id: this._uid,
        id: this.configData && this.configData.controlType === 'file' ? this.configData.field + this._uid : 'upload-file',
        numCount: 0,
        sizeType:'large',
        imgWidth:0,
        imgType:'large',
        imgTitle: '图片预览',
        imgDegree: 0,
        imgScale: 1,
        imgLeft: null,
        imgTop: null
      };
    },
    watch: {
      'editable': function (val) {
        if (val === true) {
          // console.log('编辑状态开始');
          this.$nextTick(() => {
            this.refreshDom();
            if (this.addDom) {
              this.numCount >= this.maxLength ? this.addDom.classList.add('hide') : this.addDom.classList.remove('hide');
            }
          });
        }
      }
    },
    methods: {
      dragImg(item) {
        const self = this;
        let ids = `imgPreview${item.url}`;
        //获取元素
        var img = document.getElementById(ids);
        var area = img.parentNode;
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
            // console.log('imgLeft', nl, 'imgTop', nt);
        }
        //鼠标抬起事件
        img.onmouseup = function() {
            //开关关闭
            isDown = false;
            img.classList.remove('move');
        }
      },
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
        // this.$watch(`domainObject.${this.configData.field}`, (newVal, oldVal) => {
        //   console.log('newVal is', newVal, 'oldVal is', oldVal);
        //   if (newVal) {
        //     this.attachmentList = [];
        //     this.loadData();
        //   }
        // });
      },
      showImage(item, index) {
        this.imgScale = 1; // 每次打开尺寸重置为1
        this.imgDegree = 0; // 每次打开角度重置为0度
        // this.imgTitle = `图片预览（${index+1} / ${this.attachmentList.length}）`;
        var previewConfig = this.configData.dialogPreview;
        if (!previewConfig || previewConfig === 'TRUE' ) {
          if (item.response) {
            this.dialogImageUrl = item.url; // uploadedFile.
          } else {
            this.dialogImageUrl = item.url;  // local file.
          }
          this.dialogImageVisible = true;

          // 调用拖拽方法
          setTimeout(() => {
            this.dragImg(item);
          }, 500);

        } else {
          this.$emit('previewImage', item);
        }
      },
      _beforUpload(file){
        console.log('your file to be upload is', file);
        const isType = file.type === 'image/jpg' || file.type === 'image/gif' || file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/tiff' || file.type === 'image/bmp';
        if (!isType) {
          this.$message.warning('上传文件仅限jpg/gif/png/jpeg/tiff/bmp格式!');
          return false;
        }
        // if(this.attachmentList.length>= this.maxLength){
        //     alert('文件数量超出限制，最大数量：'+this.maxLength);
        //     return false;
        // }
        // return true;
        this.refreshDom();
        this.numCount += 1;
        if (this.addDom) {
          this.numCount >= this.maxLength ? this.addDom.classList.add('hide') : this.addDom.classList.remove('hide'); // 大于最大数量禁用上传。
        }
      },
      syncFileResult(fileList){   // 将界面上的图片同步到domainObject;
        this.refreshDom();
        // fileList.length >= this.maxLength ? this.addDom.classList.add('hide') : this.addDom.classList.remove('hide'); // 大于最大数量禁用上传。
        if (this.addDom) {
          this.numCount >= this.maxLength ? this.addDom.classList.add('hide') : this.addDom.classList.remove('hide'); // 大于最大数量禁用上传。
        }

        this.attachmentList=fileList;   // 同步静态查看页面。
        var tmpResult =[];
        fileList.forEach(item=>{
          if(item.response){
            tmpResult.push(item.response.content.resourceCode); // uploadedFile.
          }else{
            tmpResult.push(item.resourceCode);  // local file.
          }
        })
        this.domainObject[this.configData.field] = tmpResult.join(':')
        this.isSelfModify=true;
      },
      _onSuccess(res, file, fileList) {
        if (this.configData && this.configData.controlType === 'file') {
          this.syncFileResult(fileList);
          this.$emit('showImage', res);
        } else {
          this.onSuccess(res, file, fileList, this.domainObject);
          //this.disabled = fileList.length >= this.maxLength ? true : false; // 大于最大数量禁用上传。
        }
      },
      _onRemove(file, fileList) {
        this.numCount -= 1;
        if (this.configData && this.configData.controlType === 'file') {
          this.syncFileResult(fileList);
          // for preview
          if (fileList.length > 0) {
            this.$emit('previewImage', fileList[fileList.length - 1]);
          } else {
            this.$emit('previewImage', { 'url': null });
          }
        } else {
          this.onRemove(file, fileList, this.domainObject);
          //this.disabled = fileList.length >= this.maxLength ? true : false; // 大于最大数量禁用上传。
        }
      },
      _onPreview(file) {
        if (this.configData && this.configData.controlType === 'file') {
          this.showImage(file);
        } else {
          this.onPreview(file, this.domainObject);
        }
      },
      initUploadedFile(resCodeArray) {
        this.refreshDom();
        if (this.addDom) {
          this.numCount >= this.maxLength ? this.addDom.classList.add('hide') : this.addDom.classList.remove('hide');
        }
        this.attachmentList = [];
        resCodeArray.forEach((val, index) => {
          const getdialogImageUrl = `${this.uploadUrl}/fw/image/${val}/get`;
          axios.get(getdialogImageUrl, {
            params: {
            }
          }).then((res) => {
            const fileObj = {
              url: res.data.content.thumbnailList[0].url,
              resourceCode: res.data.content.resourceCode
            };
            this.attachmentList.push(fileObj);
            if (index === 0) {
              this.$emit('loadFirst', this.attachmentList[0]);
            }
          });
        });
      },
      refreshDom(){
        const idDom = document.querySelector(`#${this.id}`);
        if (idDom) {
          const uploadDom = idDom.querySelector('.el-upload--picture-card');
          this.addDom = uploadDom;
        }
      }
    },

    mounted() {
      if (!this.isList) {
        if (this.eventBus) {
          this.eventBus.$emit('eleMounted', this);
        }
      }

      if (this.configData && this.configData.controlType === 'file') {
        const resCode = this.domainObject[this.configData.field];
        // 特殊处理后台返回身份证正反面为空时返回resourceCode为冒号
        if (resCode === ':') {
          return false;
        }
        const resCodeArray = resCode ? resCode.split(':') : [];
        this.numCount = resCodeArray.length;
        this.initUploadedFile(resCodeArray);
        if(this.editable){
          this.refreshDom();
          //resCodeArray.length >= this.maxLength ? this.addDom.classList.add('hide') : this.addDom.classList.remove('hide'); // 大于最大数量禁用上传。
        }
      }
      if (!this.isList) {
        // 监听
        this.$watch(`domainObject.${this.configData.field}`, (newVal, oldVal) => {
          if (newVal && !this.isSelfModify) {
            console.log('外面传值 newVal is', newVal, 'oldVal is', oldVal);
            const resCodeArray = newVal ? newVal.split(':') : [];
            this.numCount = resCodeArray.length;
            this.initUploadedFile(resCodeArray);
          }
          this.isSelfModify = false;
        });
      }
    },
    created() {
      if (!this.isList) {
        if (this.eventBus) {
          this.eventBus.$emit('eleCreated', this);
        }
      }
      this.$watch(`domainObject.${this.configData.field}`,(val,oldval)=>{
        if(val){
          // 当值改变，变成有值的时候，去除 提示语
          if(this.$children.length>0){
            let el_item = this.$children[0];
            el_item.validateState = '';
            el_item.validateMessage = '';
            el_item.validateDisabled = false;
          }
        } else {
          // 如果对象里的resourceCode被清空，则将显示fileList的attachmentList数据也清空
          this.attachmentList = [];
        }
      })
      // 判断图片大小
      // let self = this;
      // this.$watch(`dialogImageUrl`, (val, oldval) => {
      //     console.log('检测到dialogImageUrl 改变 ...', val, oldval);
      //       // this.refreshSelect();
      //       let img = new Image();
      //       let W = 0;
      //       img.src = val;
      //       if (img.complete) {
      //         // console.log('from:complete : width:'+img.width+',height:'+img.height);

      //         self.imgType = img.width > 780 ? 'full' : 'large';

      //       } else {
      //         img.onload = function(){
      //           // console.log('from:onload : width:'+img.width+',height:'+img.height);
      //            // W = img.width;
      //            self.imgType = img.width > 780 ? 'full' : 'large';
      //         }
      //       }
      //   });
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  .file-component{
      .el-upload-list__item-delete{float:right;margin-right:5px;}
  }
.file-list-item {
  position: relative;
  display: inline-block;
  width: 58px;
  height: 58px;
  margin: 0 8px 8px 0;
  border: 1px dashed #c0ccda;
  border-radius: 6px;
  box-sizing: border-box;
  overflow: hidden;
  .pre-mask {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    line-height: 56px;
    font-size: 18px;
    color: #fff;
    background-color: rgba(0, 0, 0, .5);
    text-align: center;
    cursor: pointer;
    opacity: 0;
  }
  img {
    width: 100%;
    height: 100%;
  }
  &:hover {
    .pre-mask {
      opacity: 1;
      transition: opacity .2s ease-in-out;
    }
  }
}
.original-dialog {
  overflow: hidden;
  .el-dialog {
    width: 100% !important;
    top: 0 !important;
    right: 0;
    bottom: 0;
    left: 0;
    margin: 0;
    transform: none;
    background-color: rgba(255, 255, 255, 0);
    color: #eee;
    .el-dialog__header {
      position: absolute;
      z-index: 9999;
      width: 100%;
      margin: 0;
      padding: 20px;
      border-bottom: 0 !important;
    }
    .el-dialog__title {
      color: #fff;
    }
    .el-dialog__headerbtn {
      position: absolute;
      top: 25px;
      right: 66px;
      font-size: 18px;
    }
  }
  .move {
    cursor: move;
  }
  .img-opr-btn {
    position: absolute;
    z-index: 9999;
    top: 22px;
    right: 80px;
    color: #fff;
    white-space: nowrap;
    .rotate-btn, .zoom-btn {
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
  .el-dialog__body {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    padding: 0;
    text-align: center;
    color: #eee;
  }
  .prev-btn, .next-btn {
    position: absolute;
    top: 50%;
    padding: 10px;
    cursor: pointer;
    opacity: .6;
    &:hover {
      opacity: 1;
    }
  }
  .prev-btn {
    left: 0;
  }
  .next-btn {
    right: 0;
  }
}
.original {
  position: absolute;
  // top: 0;
  // right: 0;
  // bottom: 0;
  // left: 0;
  // margin: auto;
  // transition: all .2s ease-in-out;
  max-width: 100%;
  max-height: 100%;
  // cursor: move;
}
</style>
