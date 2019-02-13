const config = require('./config.json')
const urlReader = require('./lib/readers/urlMetaData')

urlReader.nextUrl("input/inputURLList.txt", config.aylien, urlObj => {
	var aylien = require('./lib/ServiceProviders/analysis');
	const mongo = require('./lib/Stores/mongo');
	var mymongo = new mongo(config.mongodb.url, 'Reviews');
	aylien.analyse(config.aylien, urlObj, (snapshots) => {
		//mymongo.store(snapshots, urlObj);		
		
		//const logger = require('./lib/Stores/logger');		
		//var append = true;
		//logger.store("mongo.db.data", JSON.stringify(snapshots), append);
		
		var us = require('./lib/upstream.js');
		us.aggregate(snapshots, config.mongodb, function(snapshot){
			var mymongo = new mongo(config.mongodb.url, "Statistics");
			mymongo.store1(snapshot, function(){
				console.log("Upstream statistics added.");
			});			
		});;
	});
});

//
//var newobj = {"sentiment":.45, "organization":"Maruti", "product":"WagonR", "analysis":"sentiment"};
//var newobj = {"sentiment":.45, "entity":"Suzuki", "analysis":"sentiment"};
//us.aggregate(newobj, config.aylien.watch, config.mongodb, config.watch);



