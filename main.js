//const config = require('./config.json')
const urlReader = require('./lib/readers/urlMetaData')

function serve(event){
	const config  = event;
	const response = {
		statusCode: 200,
		body: JSON.stringify('Data Aylienized'),
	};
	
	//Read the metadata 
	urlReader.nextUrl("input/inputURLList.txt", config.aylien, (urlObj) => {
		var aylien = require('./lib/Transformers/transform-sd');
		const mongo = require('./lib/Stores/mongo');
		
		//Send URL text to Aylien API analyse for Classification of subject, Sentiment, Aspect Based Sentiments and Entity Detection.
		//Transform the return JSON 
		aylien.transform(config.aylien, urlObj, (snapshots) => {
			//Store the results in Mongo
			mongo.store(snapshots, config.mongodb.url, 'Reviews', (result) => {});		
			
			//Log the Aylien snapshots locally
			const logger = require('./lib/Stores/logger');		
			var append = true;
			logger.store("mongo.db.data", JSON.stringify(snapshots), append);

			//Aggregate the data upstream. As of now this is a naive aggregation as a POC.
			var us = require('./lib/Aggregators/aggregate-sd.js');
			us.aggregate(snapshots, config.mongodb, function(snapshot){
				mongo.store(snapshot, config.mongodb.url, 'Statistics', function(snapshot){
					console.log("Upstream statistics added.");
				});			
			});;
		});
	});
}

module.exports.serve = serve;


