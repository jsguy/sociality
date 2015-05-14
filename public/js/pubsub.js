//	Tiny pubsub
var events = {
	topics: {},
	publish: function(name){
		var args = Array.prototype.slice.call(arguments),
			argList = args.slice(1);

		if(events.topics[name]) {
			for(var i = 0; i < events.topics[name].length; i += 1) {
				events.topics[name][i].apply(this, argList);
			}
		}
	},
	subscribe: function(name, func){
		events.topics[name] = events.topics[name] || [];
		events.topics[name].push(func);
		var index = events.topics[name].length -1;
		return {
			remove: function(){
				delete events.topics[name][index];
			}
		}
	}
};
