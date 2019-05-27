<template>
<div class="message" id="message" @click="showMsgBox">
    <div :class="msgTotal > 0 ? 'msg-fade' : ''">
      <span class="msg-icon">
        <strong class="msg-number" v-if="msgTotal > 0">{{ msgTotal > 99 ? '99+' : msgTotal }}</strong>
      </span>
    </div>
    <div class="msg-box">
        <ul class="msg-list">
            <li v-for="(item, index) in msgList" :key="index" v-show="item.msgNum > 0">
                <a href="javascript:;" @click="showMsgDialog(index)">
                  <div>
                    <span class="msg-list__icon">
                      <svg-icon :icon-class="item.iconclass"></svg-icon>
                    </span>
                  </div>
                  <div>
                    <span class="msg-list__title">{{ item.title }}</span>
                    <span class="msg-list__content">当前已收到<b>{{ item.msgNum || 0}}</b>个{{ item.title }}</span>
                  </div>
                  <!-- <span class="msg-list__content">刚刚</span> -->
                  <!-- <span @click="delMessage(item)" class="blue">删除</span> -->
                </a>
            </li>
        </ul>
        <!-- <p v-if="msgList && msgList.length > 0" class="msg-list__bottom" @click="()=>{this.msgList = []}">清空通知</p> -->
        <p v-if="msgList && msgList.length > 0" class="msg-list__bottom"><a href="javascript:;" @click="showAllDialog">查看消息</a></p>
        <p v-else>暂无消息</p>
    </div>
</div>
</template>

<script>
var apiConst = require('../../../api/ApiConst');
require('./sockjs.min.js')
// window.socketIO = new SockJS(apiConst.ws, null,{ 'transports':['xhr-polling']})
// https://github.com/sockjs/sockjs-client
// window.socketIO = new SockJS(apiConst.ws)
import '../../components/rl-icons'
import { toggleClass, hasClass, removeClass } from '../../../api/classUtil'
import { urlRedirect } from '../../../api/Utils'
import { meunMsgCount } from '@/message/msgCount'
import { notify } from '@/message/components/notify'
import { msgTotalList } from '../../../api/MessageService'


export default {
  name: 'msg-box',
  data() {
    return {
      msgTotal: 0,
      msgList: [
        { title: '业务异常提醒', msgNum: 0, iconclass: 'alert' },
        { title: '设备异常提醒', msgNum: 0, iconclass: 'alert-device' },
        { title: '认证消息提醒', msgNum: 0, iconclass: 'todo' },
        { title: '文件提醒', msgNum: 0, iconclass: 'file-error' },
      ],
      tempmsgMenu: {
        0: '询报价异常',
        1: '车辆离线异常',
        2: '询报价消息',
        3: '公司证件消息',
        4: '公司认证消息'
      }
    }
  },
  methods: {
    openWindow(url, title) {
      urlRedirect(url, title);
    },
    cycleload() {
      if(window.messageloader) {
        window.clearInterval(messageloader)
      }
      window.messageloader = window.setInterval(()=>{
        this.loadmessage()
      }, 5000)
    },
    loadmessage() {
      console.log('hi')
      msgTotalList({}, (success, error) => {
        if(success && success.code === 200) {
          this.messageHandlerX(success.content.list)
        }
      })
    },
    messageHandlerX(msgData) {
      //init msg number
      this.msgTotal = 0
      this.msgList[0].msgNum = 0
      this.msgList[1].msgNum = 0
      this.msgList[2].msgNum = 0
      this.msgList[3].msgNum = 0

      for(var i =1;i <= 17;i++) {
        meunMsgCount(`/message/index.html?messageType=${i}`, 0)
      }
      const msgTotals = msgData || []
      if(msgTotals.length > 0) {
        msgTotals.forEach(element => {
          meunMsgCount(`/message/index.html?messageType=${element.messageType}`, element.count)
          // 现在只有认证消息
          this.msgList[2].msgNum += element.count
          this.msgTotal += element.count
        })
      }
    },
    messageHandler(msg) {
      try {
        // console.log('my msg', msg)
        if(msg.type === '2001') {
          const { type } = msg.data
          if(type < 5) {
            this.msgList[0].msgNum ++
          } else if(type > 4 && type < 8) {
            this.msgList[1].msgNum ++
          } else if (type > 7 && type < 11) {
            this.msgList[2].msgNum ++
          } else if (type > 14 && type < 18) {
            this.msgList[2].msgNum ++
          } else {
            this.msgList[3].msgNum ++
          }
          this.msgTotal ++
          // const h = this.$createElement;
          // this.$notify({
          //   title: msg.data.title,
          //   message: h('i', { style: 'color: teal'}, `${msg.data.title}`)
          // });
          notify(msg.data.title, msg.data.msg, '')

          for(var i =1;i <= 17;i++) {
            meunMsgCount(`/message/index.html?messageType=${i}`, 0)
          }
          const msgTotals = msg.data.messageCount || []
          if(msgTotals.length > 0) {
            msgTotals.forEach(element => {
              meunMsgCount(`/message/index.html?messageType=${element.messageType}`, element.count)
            })
          }
        }
        if(msg.type === '2002') {
          for(var i =1;i <= 17;i++) {
            meunMsgCount(`/message/index.html?messageType=${i}`, 0)
          }
          const msgTotals = msg.data.messageCount || []
          if(msgTotals.length > 0) {
            msgTotals.forEach(element => {
              meunMsgCount(`/message/index.html?messageType=${element.messageType}`, element.count)
            })
          }
        }
          // this.msgList.push(msg.data)
      } catch (error) {
        console.error('io error:',error)
      }
    },
    socketconnect() {
      console.log('connect start')
      // this.bindmenuCount()
      if(window.socketIO) {
        const user_info = {
          type: 1000,
          data: JSON.parse(window.localStorage.getItem('userInfo'))
        }
        window.socketIO.onopen = () =>{
          window.socketIO.send(JSON.stringify(user_info))
        }
        window.socketIO.onmessage = (e) => {
          // console.log(e.data.toString())
          const msgData = JSON.parse(e.data.toString())
          this.messageHandler(msgData)
          // console.log('hello', this.msgList)
          // this.$notify.info({
          //   // title: `${this.msgList.length}您有条未读消息`,
          //   message: `您有${this.msgList.length}条未读消息`,
          //   position: 'bottom-right'
          // });
        }
      }
    },
    bindmenuCount() {
      var i = 0
      setInterval(() => {
        /*
        * function
        * meunMsgCount
        * @param key is menu-key
        * @param count is msg-count
        */
        meunMsgCount('/contract/list.html', i++)
      },5000)
    },
    showMsgBox() {
      // if (this.msgTotal === 0) {
      //   this.$message({
      //     type: 'warning',
      //     message: '暂无消息',
      //     duration: 1000
      //   });
      // } else {
        toggleClass(document.querySelector('#message'), 'opened');
      // }
    },
    showAllDialog() {
      this.openWindow('/message/index.html?messageType=15',this.tempmsgMenu[4])
    },
    showMsgDialog(index) {
      removeClass(document.querySelector('#message'), 'opened')
      this.msgTotal = this.msgTotal - this.msgList[index].msgNum
      this.msgList[index].msgNum = 0
      this.openWindow('/message/index.html?messageType=15',this.tempmsgMenu[4])
      // openurl
      // for(const [i, v] of this.msgList.entries()) {
      //   if(v.msgId === item.msgId) {
      //     this.msgList.splice(i,1)
      //   }
      // }
      // this.$alert(item.msg, item.title, {
      //   confirmButtonText: '确定',
      //   callback: action => {
      //   }
      // });
    },
    demo() {
      setInterval(() => {
        var ty = Math.floor(Math.random() * 18)
        if(ty < 6) {
          this.msgList[0].msgNum ++
        } else if(ty > 5 && ty < 10) {
          this.msgList[1].msgNum ++
        } else if (ty > 10 && ty < 14) {
          this.msgList[2].msgNum ++
        } else {
          this.msgList[3].msgNum ++
        }
        this.msgTotal ++
        const h = this.$createElement;
        this.$notify({
          title: '标题名称',
          message: h('i', { style: 'color: teal'}, '这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案')
        });
      }, 1000 * 5);
    }
  },
  mounted() {
    // this.socketconnect()
    // this.demo()
    this.cycleload()
  },
  created() {
    document.addEventListener('click', (event) => {
      const target = event.target,
        message = document.querySelector('#message'),
        isOpened = hasClass(message, 'opened'),
        parents = [];
      let parent = target;
      if (parent) {
        while (parent && parent.nodeName !== 'BODY') {
          parent = parent.parentNode;
          parents.push(parent.className);
        }
      }
      if (parents.indexOf('message opened') <= -1 && isOpened) {
        removeClass(message, 'opened');
      }
    });
  }

}
</script>


<style lang="scss" scoped>
@keyframes fade {
  from {
    opacity: 1.0;
  }
  50% {
    opacity: 0.4;
  }
  to {
    opacity: 1.0;
  }
}

@-webkit-keyframes fade {
  from {
    opacity: 1.0;
  }
  50% {
    opacity: 0.4;
  }
  to {
    opacity: 1.0;
  }
}

.msg-fade {
  z-index: 99;
  animation: fade 1000ms infinite;
  -webkit-animation: fade 1000ms infinite;
}
.msg-box {
  display: none;
  position: absolute;
  z-index: 10;
  top: 20px;
  right: 0;
  width: 300px;
  max-height: 400px;
  overflow: auto;
  border: solid 1px #ddd;
  border-radius: 4px;
  background-color: #fff;
  p {
    padding: 20px;
    text-align: center;
  }
}
.opened {
  .msg-box {
    display: block;
  }
}
.msg-list {
  &__icon {
    width: 64px;
    height: 64px;
    display: flex !important;
    align-items: center;
    justify-content: center;
    svg {
      color: #dddddd;
      width: 70% !important;
      height: 70% !important;
    }
  }
  &__title {
    font-weight: 500;
    font-size: 120%;
  }
  &__content {
    font-weight: 300;
    b {
      color: #ad0000;
      font-weight: 600;
      margin: 0 2px;
    }
  }
  &__bottom {
    cursor: pointer;
    position: sticky;
    bottom: 0;
    background-color: white;
  }
  & li {
    span {
      display: block;
      line-height: 23px;
    }
    a {
      display: flex;
      align-content: center;
      align-items: center;
      padding: 8px;
      margin: 8px;
      line-height: 1.2;
      background-color: #f9fafc;
      word-wrap: break-word;
      word-break: break-all;
      .blue {
        color: #0178be;
      }
      &:hover {
        background-color: #f1efe4;
        text-decoration: none;
      }
    }
  }
}

</style>
