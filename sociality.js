//	Sociality js file copyright (c) 2015 Mikkel Bergmann
//	This is unlicenced software - please do not distribute.
//	Note: All hacked together for now - just a proof of concept, please do not judge the code.
var apis = {
	"Facebook": {
		url: "https://api.facebook.com/method/links.getStats?urls=%%URL%%&format=json",
		handler: function(data){
			return data[0].total_count;
		}
	},
	"Twitter": {
		url: "http://urls.api.twitter.com/1/urls/count.json?url=%%URL%%",
		handler: function(data){
			return data.count;
		}
	},
	//"Reddit": "http://buttons.reddit.com/button_info.json?url=%%URL%%",
	"LinkedIn": {
		url: "http://www.linkedin.com/countserv/count/share?url=%%URL%%&format=json ",
		handler: function(data){
			return data.count;
		}
	},
	//"Digg": "http://widgets.digg.com/buttons/count?url=%%URL%% ",
	//"Delicious": "http://feeds.delicious.com/v2/json/urlinfo/data?url=%%URL%%",
	//"StumbleUpon": "http://www.stumbleupon.com/services/1.01/badge.getinfo?url=%%URL%%",
	"Pinterest": {
		url: "http://widgets.pinterest.com/v1/urls/count.json?source=6&url=%%URL%%",
		handler: function(data){
			return data.count;
		}
	}
},
showResult = function(name, data){
	$('#out').append("<br>" + name + ": <span>" + data + "</span>");
},
requestCount = 0,
handleSpinner = function(){
	requestCount -= 1;
	if(requestCount == 0) {
		$('.spinner').hide();
	}
},
makeRequest = function(url, name, handler) {
	$('.spinner').show();
	requestCount += 1;
	$.ajax({
		dataType: "jsonp",
		url: url,
		success: function(data){
			showResult(name, handler(data));
			handleSpinner();
		},
		error: handleSpinner
	});
};

var url = ulib.url().params['url'];

if(url) {
	url = decodeURIComponent(url);
	$('#out').append("<h1 class='statHeader'>" + url + "</h1>");
	$.each(apis, function(name, api){
		makeRequest(api.url.split("%%URL%%").join(url), name, api.handler);
	});
} else {
	console.log("Please specify a url parameter");
}