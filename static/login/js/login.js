var CONFIG_URL = "https://hngateway.rltx.com/platform/platform/core/config/webapp",
LOGIN_URL = "https://hngateway.rltx.com/account/login",
host = window.location.host;

if (host.indexOf(".chngdz.com") > -1) {
  CONFIG_URL = "https://ny-gateway.chngdz.com/platform/platform/core/config/webapp";
  LOGIN_URL = "https://ny-gateway.chngdz.com/account/login";
}

$(function(){
  // loading config
  $.ajax({
    type: "GET",
    url: CONFIG_URL,
    dataType: "json",
    crossDomain: true,
    xhrFields: {
      withCredentials: true
    },
    success: function(data) {
      var data = data.content || {}, appInfo = {};
      localStorage.setItem('webappConfig',JSON.stringify(data));
      for(var key in data) {
        if(key.indexOf('webapp.') > -1) {
          var newKey = "";
          if(key.indexOf(".statement.") > -1) {
            newKey = key.replace("webapp.statement.", "");
          } else {
            newKey = key.replace("webapp.", "");
          }
          appInfo[newKey] = data[key];
        }
      }
      console.log('appInfo is', appInfo);
      window.localStorage.setItem('appInfo', JSON.stringify(appInfo));
    },
    error: function(data) {
      alert('error', data);
    }
  });
  // login start here
  $("#login").on("click", function() {
    var account = $("#account").val(), password = $("#password").val();
    if (account && password) {
      $.ajax({
        type: "POST",
        url: LOGIN_URL,
        data: {
          account: account,
          password: password
        },
        crossDomain: true,
        xhrFields: {
          withCredentials: true
        },
        dataType: "json",
        success: function(data) {
          if (data.code && data.code !== 200) {
            alert(data.content);
          }
          if (data.code === 200) {
            var data = data.content;
            if (data.loginAccount) {
              // 如果已经加入了公司组织
              if (data.orgCode) {
                const userInfo = {
                  'orgCode': data.orgCode,
                  'orgFullName': data.orgFullName,
                  'userFullName': data.userFullName,
                  'loginAccount': data.loginAccount,
                  'orgName':data.orgName
                },
                userInfoObj = JSON.stringify(userInfo);
                localStorage.setItem('userPermissions', data.permissionCodeList);
                localStorage.setItem('userInfo', userInfoObj);
                window.location.href = '/menu/menu.html';
              } else {
                // 尚未加入公司组织
                window.location.href = `/register/join.html?loginAccount=${data.loginAccount}`;
              }
            } else {
              alert(data.message);
            }
          }
        },
        error: function(data) {
          alert('error', data);
        }
      });
    } else {
      alert("用户名或密码不能为空！");
    }
  });
});