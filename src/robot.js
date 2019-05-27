
//======= ROBOT SDK BEGIN============
var smartz = new function() {
	var self = this;
	this.listeners = {};
	this.reg = function(robotName,func) {
		this.listeners[robotName] = func;
		console.log("robot ["+robotName+"] registed");
		//var component = Vue.component("<a>robotName</a>",);
		//vue.getSolt(robotName).append(component);
	}
	// this.open=function(solt,robotName,data){
	// 	console.log("open page");
	// 	window.open("./smartz-data.html","robot data",'width=500,height=200');
	// }
}

var robotCallBack = function(robotName, data) {
	smartz.listeners[robotName](data);
}
//======= ROBOT SDK  END============