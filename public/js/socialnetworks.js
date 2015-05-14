var socialNetworks = {
	"Facebook": {
		url: "https://api.facebook.com/method/links.getStats?urls=%%URL%%&format=json",
		handler: function(data){
			console.log('fb', data);
			return data[0].total_count;
		},
		colors: ["blue", "#1961f3"],
		rank: 1
	},
	"Twitter": {
		url: "http://urls.api.twitter.com/1/urls/count.json?url=%%URL%%",
		handler: function(data){
			return data.count;
		},
		colors: ["lightblue", "#57d6f7"],
		rank: 2
	},
	//"Reddit": "http://buttons.reddit.com/button_info.json?url=%%URL%%",
	"LinkedIn": {
		url: "http://www.linkedin.com/countserv/count/share?url=%%URL%%&format=json ",
		handler: function(data){
			return data.count;
		},
		colors: ["black", "#333333"],
		rank: 3
	},
	//"Digg": "http://widgets.digg.com/buttons/count?url=%%URL%% ",
	//"Delicious": "http://feeds.delicious.com/v2/json/urlinfo/data?url=%%URL%%",
	//"StumbleUpon": "http://www.stumbleupon.com/services/1.01/badge.getinfo?url=%%URL%%",
	"Pinterest": {
		url: "http://widgets.pinterest.com/v1/urls/count.json?source=6&url=%%URL%%",
		handler: function(data){
			return data.count;
		},
		colors: ["red", "#f31999"],
		rank: 4
	}
};