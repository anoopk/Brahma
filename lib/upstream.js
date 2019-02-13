var mongo = require("./stores/mongo");
var MongoClient = require('mongodb').MongoClient;

function aggregate(snapshots, mongoConfig, callback){
	var obj = {};	
	obj.organization = snapshots[1].organization;
	obj.product = snapshots[1].product;
	obj.collection = snapshots[1].endpoint;
	obj.sentiment = snapshots[1].result.polarity_confidence;		

	var database = mongoConfig.databases.aggregate;
	MongoClient.connect(mongoConfig.url, { useNewUrlParser: true }, function(err, db) {
		if (err) throw err;
		var dbo = db.db(database);
		var coll = dbo.collection(obj.collection);
		coll.countDocuments().then((count) => {
			if(0 < count){
				coll.findOne({"organization":obj.organization, "product": obj.product}, {sort: { reviews: -1 }}, function(err, result) {
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
			db.close();			
			callback(obj);
		});
	});
}

module.exports.aggregate = aggregate;