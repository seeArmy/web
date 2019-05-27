//Accept:text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
var axios = require('axios')
axios.defaults.withCredentials = true;
var url ='http://gateway.rltx.xyz/account/search_render_info/accident/list'
var instance = axios.create({
  headers: {'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'},
  'User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36'
});

instance.get(url).then(response=>{
			console.log(response.data)
		}).catch(function(error){
	    	console.log(error);
		});