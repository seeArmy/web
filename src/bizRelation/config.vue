/**
* config.vue
* 业务关系配置列表
* Created by cc on 18/09/10.
*/
<template>
  <div class="list-page biz-relation">
    <!-- header -->
    <div class="page-header clearfix">
      <h2 class="page-title fl">
        业务关系配置列表
      </h2>
      <div class="hd-opr fr">
      </div>
      <span id="pageRefresh" class="page-refresh fr"><i class="ico-refresh"></i>刷新
      </span>
    </div>
    <!-- opr -->
    <div class="table-opr clearfix">
      <div class="opr-button fl">
        <!-- pop select -->
        <pop-select :configData="configData" :handleSelect="handleSelect" :buttonText="'选择公司'"></pop-select>
      </div>
    </div>
    <!-- table -->
    <div class="fix-table-wrap">
      <table class="rl-fix-table table-bordered">
        <thead>
          <tr>
            <th>序号</th>
            <th>操作</th>
            <th>公司名称</th>
            <th>伙伴默认建立关系</th>
            <th>运力默认建立关系</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in orgData" :key="index">
            <td>
              {{ index + 1 }}
            </td>
            <td>
              <button class="el-button el-button--default" @click="handleDelete(row)">删除</button>
            </td>
            <td>
              {{ row.orgFullName }}
            </td>
            <td>
              <input type="checkbox" v-model="row.partner">
            </td>
            <td>
              <input type="checkbox" v-model="row.transport">
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- tip -->
    <div class="tip">
      <p>
        注：本业务关系配置仅针对新注册的公司、新注册的司机和新添加的车辆有效。<br>
        如果本列表中的选项被勾中，新注册的公司会自动跟本列表中的公司建立业务伙伴关系，新注册的司机和新添加的车辆也会自动添加到本列表中的公司运力池中。
      </p>
    </div>
    <!-- submit -->
    <div class="submit">
      <el-button type="primary" @click="submit" :disabled="btnDisabled">提交</el-button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import popSelect from '../components/ele-pop-select/elePopSelect.vue';
  import { urlRedirect } from '../../api/Utils';

  import { add, list, deleted } from '../../api/bizRelationService';
  import ApiConst from '../../api/ApiConst';

  require('../public.js');

  export default {
    components: {
      'pop-select': popSelect
    },
    props: {
    },
    data() {
      return {
        configData: {
          datasource: 'orgManager'
        },
        orgData: [],
        btnDisabled: false,
        theme: true
      };
    },
    methods: {
      openWindow(url, title) {
        urlRedirect(url, title);
      },
      handleSelect(row) {
        console.log('handle select now', row);
        this.dataRefresh(row);
      },
      dataRefresh(row) {
        // 如果当前数据已存在
        if (this.orgData.find(data => data.orgCode === row.code)) {
          this.$message({
            type: 'warning',
            message: '当前公司已经在列表中，不能重复选择！',
            duration: 3000
          });
        } else {
          const obj = {
            orgCode: row.code,
            orgFullName: row.orgFullName,
            partner: false,
            transport: false
          };
          this.orgData.push(obj);
        }
      },
      handleDelete(row) {
        // 如果是已保存过的数据删除
        if (row.code) {
          const paramObj = {
              code: row.code
            },
            h = this.$createElement;
          this.$msgbox({
            title: '消息',
            message: h('p', null, [h('span', null, '确认删除吗？ ')]),
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            beforeClose: (action, instance, done) => {
              if (action === 'confirm') {
                instance.confirmButtonLoading = true;
                instance.confirmButtonText = '执行中...';
                deleted(paramObj, (success, error) => {
                  if (success) {
                    this.$message({
                      type: 'success',
                      message: '删除成功',
                      duration: 1000
                    });
                    done();
                    instance.confirmButtonLoading = false;
                  }
                  if (error) {
                    this.$message({
                      type: 'warning',
                      message: `${error}`,
                      duration: 1000
                    });
                    instance.confirmButtonLoading = false;
                    done();
                  }
                });
              } else {
                done();
              }
            }
          }).then(() => {
            this.getData();
          });
        } else {
          // array中删除
          this.orgData.forEach((data, index) => {
            if (data.orgCode === row.orgCode) {
              this.orgData.splice(index, 1);
            }
          });
        }
      },
      getData() {
        list({}, (success, error) => {
          if (error || success.code !== 200) {
            this.$message({
              type: 'warning',
              message: `${error.content}`,
              duration: 3000
            });
          }
          if (success) {
            this.orgData = success.content;
          }
        });
      },
      submit() {
        if (this.orgData.length === 0) {
          this.$message({
            type: 'warning',
            message: '请添加至少一条业务关系配置！',
            duration: 3000
          });
        } else {
          this.btnDisabled = true;
          const total = this.orgData.length;
          let sucNum = 0, errNum = 0;
          for (let i = 0; i < total; i++) {
            add(this.orgData[i], (success, error) => {
              if (error || success.code !== 200) {
                errNum ++;
              }
              if (success) {
                sucNum ++;
              }
              if (sucNum + errNum === total) {
                this.btnDisabled = false;
                this.$message({
                  type: 'success',
                  message: `提交成功，共成功${sucNum}条，失败${errNum}条！`,
                  duration: 3000
                });
              }
            });
          }
        }
      }
    },
    created() {
      if (this.theme) {
        document.querySelector('body').classList.add('theme-blue');
      }
      this.getData();
    },
    mounted() {
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../assets/sass/rl-fixed-table.min.scss";
  @import "../assets/sass/base.scss";
  .tip {
    padding: 10px;
    line-height: 1.4;
    font-size: 14px;
    color: #999;
  }
  .submit {
    padding: 30px;
    text-align: center;
    .el-button {
      min-width: 240px;
      padding: 10px 20px !important;
      font-size: 16px;
    }
  }
</style>

