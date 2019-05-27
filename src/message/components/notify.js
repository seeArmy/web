/** notify */

export function notify(title,content,iconUrl) {
  var appInfo = window.localStorage.getItem('appInfo'),
    appIcon = ''
  if(appInfo) {
    appIcon = JSON.parse(appInfo).platformLogoUrl
  }
  if(iconUrl === "") iconUrl = appIcon;
  var options = {body:content,icon:iconUrl,tag:"rltx"};
  if(window.Notification && window.Notification.permission === "granted"){
    var no = new Notification(title,options);
    no.onshow = function(){
      setTimeout(function(){
        no.close();
      }, 3800);
    };

    no.onclick = function() {
      window.focus();
    };
    no.onclose = function() {};
    no.onerror = function() {};
    no.display = function() {};

  } else if(window.Notification && window.Notification.permission !== "denied"){
    window.Notification.requestPermission(function(status){
      if(Notification.permission !== status){
        Notification.permission = status;
      }
    });
  } else{
    // logger.DEBUG("Notification is not support for this browser");
    console.log("Notification is not support for this browser")
  }
}
