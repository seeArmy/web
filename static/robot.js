
//======= ROBOT SDK BEGIN============

var smartz = new function() {
	var self = this;
	this.listeners = {};
	this.reg = function(robotName, func) {
		self.listeners[robotName] = func;
		console.log("robot ["+robotName+"] registed");
	}
	this.robotCallBack = function(e) {
		const data = e.data;
		if (data.robotName && data.data) {
			self.listeners[data.robotName](data.data);
		}
	}
	// 监听小智机器人postMessage
	window.addEventListener("message", self.robotCallBack, false);
}

//======= ROBOT SDK  END============