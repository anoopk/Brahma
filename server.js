const lambdaLocal = require('lambda-local');

exports.handler = async(event, context) => {
	const config  = event;
	//Read the metadata 
	var aylien = require('./lib/Transformers/sd');
	const mongo = require('./lib/Stores/mongo');
	//Send URL text to Aylien API analyse for Classification of subject, Sentiment, Aspect Based Sentiments and Entity Detection.
	//Transform the return JSON 
	aylien.transform(config.aylien, {}, (snapshots) => {
		//Store the results in Mongo
		config.mongodb.snapshots = snapshots;
		config.mongodb.db = config.mongodb.databases.analysis;
		
		lambdaLocal.execute({
			event: config.mongodb,
			lambdaPath: './lib/Stores/mongo',
			timeoutMs: 13000
		}).then(function(done) {
			console.log("done");
		});			
		
		//mongo.store(config.mongodb, {}, (result) => {});		
		
		//Log the Aylien snapshots locally
		const logger = require('./lib/Stores/logger');		
		var append = true;
		config.logger.snapshots = snapshots;
		logger.store(config.logger, {}, (result) => { console.log("Done");});

		//Aggregate the data upstream. As of now this is a naive aggregation as a POC.
		config.mongodb.snapshots = snapshots;		
		var us = require('./lib/Aggregators/sd.js');
		us.aggregate(config.mongodb, {}, function(snapshot){
			config.mongodb.snapshots[0] = snapshot;
			config.mongodb.db = config.mongodb.databases.aggregate;
			lambdaLocal.execute({
				event: config.mongodb,
				lambdaPath: './lib/Stores/mongo',
				timeoutMs: 3000
			}).then(function(done) {
				console.log("done");
			});			
			
			//mongo.store(config.mongodb, {}, function(snapshot){
			//	console.log("Upstream statistics added.");
			//});			
		});;
	});
}



