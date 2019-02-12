var mongo = require("./stores/mongo");
var MongoClient = require('mongodb').MongoClient;

function aggregate(analysisSnapshots, aiConfig, mongoConfig){
	
	console.log(analysisSnapshots[2].data);
	var database = mongoConfig.databases.aggregate;
	
	var obj = {};
	obj.organization = analysisSnapshots[2].data.organization;
	obj.product = analysisSnapshots[2].data.product;
	obj.collection = analysisSnapshots[2].collection;
	obj.sentiment = analysisSnapshots[2].data.polarity_confidence;
	
	MongoClient.connect(mongoConfig.url, { useNewUrlParser: true }, function(err, db) {
		if (err) throw err;
		var dbo = db.db(database);
		var coll = dbo.collection(obj.collection);
		coll.countDocuments().then((count) => {
			if(0 < count){
				coll.findOne({}, {sort: { reviews: -1 }}, function(err, result) {
					if (err) throw err;
					console.log("Last sentiment object", result);
					obj.sentiment = ((result.reviews * result.sentiment) + obj.sentiment)/(result.reviews+1);
					obj.reviews = result.reviews+1;
					console.log("Current sentiment object", obj);
				});					
			}
			else {
				obj.reviews = 1;				
				console.log("Introducing Collection with ", obj);				
			}
			obj.timestamp = { type: Date, default: Date.now};
			var mymongo = new mongo(mongoConfig.url, database);
			mymongo.InsertAnalysis(obj.collection, obj);
			db.close();			
		});
	});
}

module.exports.aggregate = aggregate;