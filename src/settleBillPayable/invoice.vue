<template>
  <div class="invoice-section">
    <!-- section 1 -->
    <div class="invoice-info">
      <div class="hd-opr clearfix">
        <el-button class="fr" v-if="domainObject.receivedInvoice === 'no' " @click="confirmInvoiced">确认已全部收票</el-button>
      </div>
      <div class="bill-info">
        <ul class="bi-list clearfix">
          <li>
            <span class="bi-tit">
              账单总金额：
            </span>
            <div class="bi-cont">
              <strong>
                {{ domainObject.payableAmount }}
              </strong>
            </div>
          </li>
          <li>
            <span class="bi-tit">
              已收票金额：
            </span>
            <div class="bi-cont">
              <strong>
                {{ domainObject.receivedInvoicedAmount }}
              </strong>
            </div>
          </li>
          <li>
            <span class="bi-tit">
              剩余收票金额：
            </span>
            <div class="bi-cont">
              <strong class="org">
                {{ domainObject.remainderReceivableInvoiceAmount }}
              </strong>
            </div>
          </li>
          <li>
            <span class="bi-tit">
              账单收票状态：
            </span>
            <div class="bi-cont">
              <strong>
                {{ domainObject.receivedInvoice === 'yes' ? '已收票' : '未收票' }}
              </strong>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!-- section 2 -->
    <div class="hd-opr clearfix">
      <el-button class="fr" @click="openWindow()">新建进项发票</el-button>
    </div>
    <div class="invoice-card" v-for="item in invoiceData" :key="item.code">
      <ul class="card-info clearfix">
        <li>
          <span class="bi-tit">
            进项系统号：
          </span>
          <div class="bi-cont">
            <a href="javascript:;" class="blue" @click="openWindow(item.code)">
              {{ item.inputNo }}
            </a>
          </div>
        </li>
        <li>
          <span class="bi-tit">
            发票号：
          </span>
          <div class="bi-cont">
            <a href="javascript:;" class="blue" @click="openWindow(item.code)">
              {{ item.invoiceNo }}
            </a>
          </div>
        </li>
<!--         <li>
          <span class="bi-tit">
            发票审核状态：
          </span>
          <div class="bi-cont">
            <strong>
              {{ item.status }}
            </strong>
          </div>
        </li>
        <li> -->
<!--           <span class="bi-tit">
            收票状态：
          </span>
          <div class="bi-cont">
            <strong>
              {{ item.invoiced ? '已收票' : '未收票' }}
            </strong>
          </div>
        </li> -->
        <li>
          <span class="bi-tit">
            购买方名称：
          </span>
          <div class="bi-cont">
            <strong>
              {{ item.payerOrgName }}
            </strong>
          </div>
        </li>
        <li>
          <span class="bi-tit">
            收票日期：
          </span>
          <div class="bi-cont">
            <strong>
             {{ item.receiveInvoiceTime | filterInvoiceTime}}
            </strong>
          </div>
        </li>
        <li>
          <span class="bi-tit">
            归属年月：
          </span>
          <div class="bi-cont">
            <strong>
              {{item.attributionDate | filterAttributionDate}}
            </strong>
          </div>
        </li>
        <li>
          <span class="bi-tit">
            价税合计：
          </span>
          <div class="bi-cont">
            <strong>
              {{ item.totalAmount }}
            </strong>
          </div>
        </li>
        <li>
          <span class="bi-tit">
            不含税小计金额：
          </span>
          <div class="bi-cont">
            <strong>
              {{ item.excludeTaxAmount }}
            </strong>
          </div>
        </li>
        <li>
          <span class="bi-tit">
            小计税额：
          </span>
          <div class="bi-cont">
            <strong>
              {{ item.vatTaxAmount }}
            </strong>
          </div>
        </li>
      </ul>
      <div class="card-table">
        <table class="rl-fix-table table-bordered">
          <thead>
            <tr>
              <th>税目类型</th>
              <th>单位</th>
              <th>数量</th>
              <th>单价类型</th>
              <th>单价</th>
              <th>金额</th>
              <th>税率</th>
              <th>税额</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {{ item.vatType === 'transport' ? '运输费' : '代理费' }}
              </td>
              <td>
                {{ item.vatUnitName }}
              </td>
              <td>
                {{ item.vatNumber }}
              </td>
              <td>
                {{ item.vatPriceType === 'include' ? '含税' : '不含税' }}
              </td>
              <td>
                {{ item.vatPrice }}
              </td>
              <td>
                {{ item.vatAmount }}
              </td>
              <td>
                {{ item.vatTaxRate }}
              </td>
              <td>
                {{ item.vatTaxAmount }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
  import { settlePayableInvoice } from '../../api/SettleBillService';
  import { list } from '../../api/InputInvoiceService';
  import { urlRedirect } from '../../api/Utils';

  export default {
    name: 'invoice',
    props: {
      domainObject: {
        type: Object,
        default() {
          return {};
        }
      },
      code: {
        type: String,
        'default': ''
      }
    },
    data() {
      return {
        invoiceData: []
      };
    },
    filters:{
      filterAttributionDate(val){
        if(!val) return '';
        var myDate = new Date(val);
        var y = myDate.getFullYear();
        var m = myDate.getMonth();
        m = m<10 ? `0${m}` :m;
        return `${y}-${m}`
      },
      filterInvoiceTime(val){
         if(!val) return '';
         var cul = val.substring(0, 10)
         return cul;
      }
    },
    methods: {
      openWindow(code) {
        let url = '',
          tit = '';
        if (code) {
          url = `/inputInvoice/add.html?code=${code}&editable=false`;
          tit = '进项发票详情';
        } else {
          url = `/inputInvoice/add.html?objectName=进项发票&billCode=${this.domainObject.code}`;
          tit = '新建进项发票';
        }
        urlRedirect(url, tit);
      },
      confirmInvoiced() {
        const self = this;
        this.$msgbox({
          title: '提示',
          message: '确认本账单已全部收票完成了吗？',
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '执行中...';
              settlePayableInvoice(self.code, (success, error) => {
                if (error) {
                  this.$message({
                    type: 'error',
                    message: error.content,
                    duration: 1000
                  });
                  instance.confirmButtonLoading = false;
                  done();
                  // 刷新
                  setTimeout(() => {
                    window.location.reload();
                  }, 1000);
                }
                if (success) {
                  this.$message({
                    type: 'success',
                    message: '确认收票成功！',
                    duration: 1000
                  });
                  instance.confirmButtonLoading = false;
                  done();
                  // 刷新
                  setTimeout(() => {
                    window.location.reload();
                  }, 1000);
                }
              });
            } else {
              done();
            }
          }
        });
      }
    },
    mounted() {
    },
    created() {
      console.log('domainObject is', this.domainObject);
      console.log('code is', this.code);
      const billNo = this.domainObject.billNo;
      if (billNo) {
        const paramsObj = {
          billNo: billNo,
          size: 20,
          page: 1
        };
        list(paramsObj, (success, error) => {
          if (error || success.code !== 200) {
            this.$message({
              type: 'error',
              message: error.content,
              duration: 5000
            });
            return false;
          }
          if (success) {
            const data = success.content;
            data.forEach((val) => {
              Object.keys(val).forEach((key) => {
                if (key === 'status') {
                  switch(val[key]) {
                    case 'none':
                      val[key] = '待提交审核';
                      break;
                    case 'pend':
                      val[key] = '待审核';
                      break;
                    case 'accept':
                      val[key] = '审核通过';
                      break;
                    case 'reject':
                      val[key] = '审核不通过';
                      break;
                    default:
                      val[key] = '待提交审核';
                      break;
                  }
                }
              });
            });
            this.invoiceData = success.content;
          }
        });
      }
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
@import "../assets/sass/rl-table.scss";
.invoice-info {
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: solid 1px #ddd;
}
.bill-info {
  padding: 20px;
  margin-top: 10px;
  font-size: 13px;
  background-color: #fffbe8;
  border: solid 1px #eae5ce;
}
.bi-list {
  li {
    box-sizing: border-box;
    width: 20%;
    float: left;
    padding-left: 80px;
    .bi-tit {
      float: left;
      margin-left: -80px;
      color: #999;
    }
  }
}
.card-info {
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: solid 1px #ddd;
  li {
    box-sizing: border-box;
    width: 25%;
    float: left;
    padding-left: 80px;
    .bi-tit {
      float: left;
      margin-left: -80px;
      color: #999;
    }
  }
}
.invoice-card {
  font-size: 13px;
  line-height: 22px;
  padding: 20px;
  margin-top: 10px;
  background-color: #fcfcfc;
  border: solid 1px #e8e8e8;
}
</style>
