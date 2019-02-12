var lr = require('line-reader');
const config = require('./config.json');
const mongo = require('./lib/Stores/mongo')
const urlReader = require('./lib/readers/urlMetaData')

urlReader.nextUrl("input/inputURLList.txt", config.aylien, result => {
	console.log("File Reader", result);
	var aylien = require('./lib/ServiceProviders/analysis');
	aylien.analyse(config.aylien, result, (snapshots) => {
		var mymongo = new mongo(config.mongodb.url, 'Reviews');
		mymongo.InsertBulkAnalysis(snapshots);
		//console.log(snapshots[1].results[2].endpoint);
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



