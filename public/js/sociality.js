
//	Sociality js file copyright (c) 2015 Mikkel Bergmann
//	This is unlicenced software - please do not distribute.
//	Note: All hacked together for now - just a proof of concept, please do not judge the code.

var url = ulib.url().params['url'];
var url2 = ulib.url().params['url2'];

var networkColours = [[],[]],

	url1Name = "data1",
	url2Name = "data2",

	showResult = function(data){
		var dataResultFormatter = function(data){
			var dataValues1 = [url1Name],
				dataValues2 = [url2Name],
				axisNames = ['x'],
				socialNetworksRank = [],
				result = [];

			//	Sort by rank
			Object.keys(data).map(function(key){
				socialNetworksRank.push({
					name: key,
					obj: socialNetworks[key]
				});
			});
			socialNetworksRank.sort(function(a,b){
				return a.obj.rank > b.obj.rank;
			});

			socialNetworksRank.map(function(obj){
				axisNames.push(obj.name);

				//	Check if the comparisonurl is the first url
				if(data[obj.name][0].comparisonUrl == url) {
					dataValues1.push(data[obj.name][0].value);
					networkColours[0].push(socialNetworks[obj.name].colors[0]);
					if(data[obj.name][1]) {
						dataValues2.push(data[obj.name][1].value);
						networkColours[1].push(socialNetworks[obj.name].colors[1]);
					}
				} else {
					dataValues2.push(data[obj.name][1].value);
					networkColours[0].push(socialNetworks[obj.name].colors[0]);
					if(data[obj.name][1]) {
						dataValues1.push(data[obj.name][1].value);
						networkColours[1].push(socialNetworks[obj.name].colors[1]);
					}
				}

			});

			//return [dataValues1, axisNames];

			result.push(dataValues1);

			if(dataValues2.length > 1) {
				result.push(dataValues2);
			}

			result.push(axisNames);

			return result;
		},
		columns = dataResultFormatter(data);

		c3.generate({
			bindto: "#out",
		    data: {
			    x: 'x',
		        columns: columns,
		        type: 'bar',
		        labels: true,
				//	Custom category colours - ref: http://bl.ocks.org/jwhitfieldseed/53a3621dcc47f8822611
				color: function(inColor, data) {
					if(data.index !== undefined) {
						return networkColours[data.id == url1Name? 0:1][data.index];
					}
					return inColor;
				}
		    },
			axis: {
				x: {type: 'category'}
			},
		    bar: {
		        width: {ratio: 0.5}
		    },
			legend: {show: false }
		});
	},
	requestCount = 0,

	hideSpinner = function(){
		$('.spinner').hide();
	},

	dataResult = {},

	//	showResult(name, handler(data));
	gatherData = function(url, name, value, comparisonUrl){
		dataResult[name] = dataResult[name] || [];
		dataResult[name].push({
			comparisonUrl: comparisonUrl,
			url: url,
			value: value
		});
	},

	handleResponse = function(){
		requestCount -= 1;
		if(requestCount == 0) {
			events.publish("dataDone", dataResult);
		}
	},

	makeRequest = function(url, name, handler, comparisonUrl) {
		//	TESTING - remove the damn spinner for now....
		//$('.spinner').show();
		requestCount += 1;
		$.ajax({
			dataType: "jsonp",
			url: url,
			success: function(data){
				gatherData(url, name, handler(data), comparisonUrl);
				handleResponse();
			},
			error: handleResponse
		});
	};

//	Setup data events
events.subscribe('dataDone', showResult);
events.subscribe('dataDone', hideSpinner);


//	TESTING
// events.publish("dataDone", {
// 	"Facebook":[173],
// 	"Twitter":[1],
// 	"Pinterest":[3],
// 	"LinkedIn":[0]
// });

if(url) {
	url = decodeURIComponent(url);
	$('#outHeader').append("<h1 class='statHeader'>" + url + "</h1>");
	$.each(socialNetworks, function(name, api){
		makeRequest(api.url.split("%%URL%%").join(url), name, api.handler, url);
	});
} else {
	console.log("Please specify a url parameter");
}


if(url2) {
	url2 = decodeURIComponent(url2);
	$('#outHeader').append("<h1 class='statHeader'>VS " + url2 + "</h1>");
	$.each(socialNetworks, function(name, api){
		makeRequest(api.url.split("%%URL%%").join(url2), name, api.handler, url2);
	});
}

