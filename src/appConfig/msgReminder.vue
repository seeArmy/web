/**
* msgReminder.vue
* Created by cc on 18/12/29.
*/
<template>
  <div class="msg-rmd">
    <div class="page-header clearfix">
      <h2 class="page-title fl">
       {{ objectName }}
      </h2>
      <span id="pageRefresh" class="page-refresh fr"><i class="ico-refresh"></i>刷新</span>
    </div>
    <div class="section">
      <h3 class="tit">APP未获取定位消息提醒：</h3>
      <el-form ref="msgForm" :rules="rules" :model="domainObject" label-width="100px">
        <el-form-item label="状态" prop="status" id="statusItem">
          <el-radio-group v-model="domainObject.status">
            <el-radio :label="'enable'">开启</el-radio>
            <el-radio :label="'disable'">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="时间段设置" required>
          <el-col :span="12">
            <el-form-item prop="enableStartTime">
              <el-time-select
                placeholder="起始时间"
                v-model="domainObject.enableStartTime"
                :picker-options="{
                  start: '00:00',
                  step: '00:15',
                  end: '24:00',
                  maxTime: domainObject.enableEndTime
                }">
              </el-time-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="enableEndTime">
              <el-time-select
                placeholder="结束时间"
                v-model="domainObject.enableEndTime"
                :picker-options="{
                  start: '00:00',
                  step: '00:15',
                  end: '24:00',
                  minTime: domainObject.enableStartTime
                }">
              </el-time-select>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="周期设置">
          <el-col :span="12">
            <el-form-item prop="cycleHours">
              <span class="time-input">
              <el-input type="number" v-model="domainObject.cycleHours" placeholder="请输入0-24之间数字"></el-input>
              <span class="unit">小时</span>
            </span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="cycleMinutes">
              <span class="time-input">
                <el-input type="number" v-model="domainObject.cycleMinutes" placeholder="请输入0-60之间数字"></el-input>
                <span class="unit">分钟</span>
              </span>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-form>
    </div>
    <div class="form-button">
      <el-button type="primary" size="large" @click="submitForm">提交</el-button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { add, get } from '../../api/AppConfigService';

  import * as utils from '../../api/Utils';

  // 引入tab跳转
  require('../public.js');

  export default {
    name: 'msgReminder',
    data() {
      const validateHours = (rule, value, callback) => {
        if (value < 0 || value > 24) {
          callback(new Error('请输入0到24之间的数字！'));
        } else {
          callback();
        }
      };
      const validateMin = (rule, value, callback) => {
        if (value < 0 || value > 60) {
          callback(new Error('请输入0到60之间的数字！'));
        } else {
          callback();
        }
      };
      return {
        objectName: 'APP消息提醒设置',
        domainObject: {
          scheduleKey: 'scheduleAppPlace',
          status: null,
          enableStartTime: null,
          enableEndTime: null,
          cycleMinutes: null,
          cycleHours: null
        },
        rules: {
          status: [
            { required: true, message: '请选择状态', trigger: 'change' }
          ],
          enableStartTime: [
            { required: true, message: '请选择起始时间', trigger: 'change' }
          ],
          enableEndTime: [
            { required: true, message: '请选择结束时间', trigger: 'change' }
          ],
          cycleHours: [
            // { required: true, message: '请输入0-24之间的数字', trigger: 'blur' },
            { validator: validateHours, trigger: 'blur' }
          ],
          cycleMinutes: [
            // { required: true, message: '请输入0-60之间的数字', trigger: 'blur' },
            { validator: validateMin, trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      valiTime() {
        const endMins = parseInt(this.domainObject.enableEndTime.split(':')[0]) * 60 + parseInt(this.domainObject.enableEndTime.split(':')[1]),
          beginMins = parseInt(this.domainObject.enableStartTime.split(':')[0]) * 60 + parseInt(this.domainObject.enableStartTime.split(':')[1]),
          setTimeTotal = endMins - beginMins,
          setTotal =  parseInt(this.domainObject.cycleHours || 0) * 60 + parseInt(this.domainObject.cycleMinutes || 0);
        if (setTotal > setTimeTotal) {
          this.$message({
            type: 'warning',
            message: '周期设置时间不能大于当前所选时间段！',
            duration: 3000
          });
          return false;
        } else {
          return true;
        }
      },
      submitForm() {
        this.$refs.msgForm.validate((valid) => {
          if (valid) {
            if (this.valiTime()) {
              add(this.domainObject, (success, error) => {
                if (error) {
                  this.$message({
                    type: 'warning',
                    message: error.content,
                    duration: 3000
                  });
                }
                if (success) {
                  this.$message({
                    type: 'success',
                    message: '提交成功！',
                    duration: 3000
                  });
                }
              });
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    },
    created() {
      const paramsObj = {
        scheduleKey: this.domainObject.scheduleKey
      };
      get(paramsObj, (success, error) => {
        if (success) {
          const data = success.content;
          Object.keys(data).forEach((key) => {
            this.$set(this.domainObject, key, data[key]);
          });
        }
      });
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
@import "../assets/sass/base.scss";
.msg-rmd {
  .el-form {
  // padding: 50px;
  // background-color: #fefefe;
  // border: solid 1px #ddd;
}
  .el-form-item {
  margin-bottom: 30px;
  .el-form-item {
  margin-bottom: 0;
}
}
#statusItem {
  display: inline-block;
}
  .tit {
    padding: 0 10px;
    margin-bottom: 30px;
    font-weight: 700;
    font-size: 14px;
  }
  .el-input {
    width: 170px;
  }
  .el-col-12 {
    width: auto;
    margin-right: 4px;
  }
  .time-input {
    position: relative;
    .unit {
      position: absolute;
      top: -4px;
      right: 10px;
      color: #999;
    }
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
      -webkit-appearance: none;
  }
  input[type="number"] {
      -moz-appearance: textfield;
  }
}
</style>
