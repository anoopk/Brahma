const lambdaLocal = require('lambda-local');

exports.handler = async(event, context) => {
	const config  = event;
	//Read the metadata 
	var aylien = require('./lib/Transformers/sd');
	const mongo = require('./lib/Stores/mongo');
	//Send URL text to Aylien API analyse for Classification of subject, Sentiment, Aspect Based Sentiments and Entity Detection.
	//Transform the return JSON 
	await aylien.handler(config.aylien, {}).then(async function(snapshots){
		config.mongodb.snapshots = snapshots;
		config.mongodb.db = config.mongodb.databases.analysis;
		
		lambdaLocal.execute({
			event: config.mongodb,
			lambdaPath: './lib/Stores/mongo',
			timeoutMs: 3000
		}).then(function(done) {
			console.log("Data moved to Mongo");
		});
		
		//Log the Aylien snaps hots locally
		const logger = require('./lib/Stores/logger');		
		var append = true;
		config.logger.snapshots = snapshots;
		logger.handler(config.logger, {}).then((result) => { console.log("Local copies of data made.");});
		
		var us = require('./lib/Aggregators/sd');
		config.upstream = {};
		config.upstream.url = config.mongodb.url;
		config.upstream.snapshots = snapshots;
		//config.upstream.db = config.mongodb.databases.analysis;
		await us.handler(config.mongodb, {}, (result) => { 
			console.log("Upstream data aggregated.");
			var mongo = require('./lib/Stores/mongo');
			config.upstream.snapshots = result;
			config.upstream.db = config.mongodb.databases.aggregate;
			mongo.handler(config.upstream, {}, () => {console.log("Data moved to Mongo")});
		});				
	});

}



