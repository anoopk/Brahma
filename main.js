const config = require('./config.json')
const urlReader = require('./lib/readers/urlMetaData')

//Read the metadata 
urlReader.nextUrl("input/inputURLList.txt", config.aylien, urlObj => {
	var aylien = require('./lib/Transformers/transform-sd');
	const mongo = require('./lib/Stores/mongo');
	
	//Send URL text to Aylien API analyse for Classification of subject, Sentiment, Aspect Based Sentiments and Entity Detection.
	//Transform the return JSON 
	aylien.transform(config.aylien, urlObj, (snapshots) => {
		//Store the results in Mongo
		mongo.store(snapshots, config.mongodb.url, 'Reviews');		
		
		//Log the Aylien snapshots locally
		const logger = require('./lib/Stores/logger');		
		var append = true;
		logger.store("mongo.db.data", JSON.stringify(snapshots), append);
		
		//Aggregate the data upstream. As of now this is a naive aggregation as a POC.
		var us = require('./lib/Aggregators/aggregator-sd.js');
		us.aggregate(snapshots, config.mongodb, function(snapshot){
			mongo.store(snapshots, config.mongodb.url, 'Statistics', function(){
				console.log("Upstream statistics added.");
			});			
		});;
	});
});




