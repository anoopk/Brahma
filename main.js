
const config = require('./config.json')

const urlReader = require('./lib/readers/urlMetaData')
urlReader.nextUrl("input/inputURLList.txt", config.aylien, urlObj => {
	var aylien = require('./lib/ServiceProviders/analysis');
	const mongo = require('./lib/Stores/mongo');
	var mymongo = new mongo(config.mongodb.url, 'Reviews');
	aylien.analyse(config.aylien, urlObj, (snapshots) => {
		mymongo.store(snapshots);		
		const logger = require('./lib/Stores/logger');		
		//logger.store("mongo.db.data", JSON.stringify(snapshots));
	});
});
		
//var reviewanalysis = require('./lib/sources/reviews/analysis_api_input');
//var pr = reviewanalysis.analyse(config.aylien, config.mongodb, config.sources);

//var wikianalysis = require('./lib/sources/wiki/analysis_api_input');
//wikianalysis.analyse(config.aylien, config.mongodb, config.sources);


//var us = require('./lib/upstream.js');
//var newobj = {"sentiment":.45, "organization":"Maruti", "product":"WagonR", "analysis":"sentiment"};
//var newobj = {"sentiment":.45, "entity":"Suzuki", "analysis":"sentiment"};
//us.aggregate(newobj, config.aylien.watch, config.mongodb, config.watch);



