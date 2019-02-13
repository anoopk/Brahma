var MongoClient = require('mongodb').MongoClient;

module.exports = class mongo {
	constructor(mongo, db) {
		this.mongo = mongo;
		this.db = db;
	}

	store(dbss, urlObj){
		var dbAnalysis = this.db;	
		MongoClient.connect(this.mongo, { useNewUrlParser: true }, function(err, db) {
			Object.keys(dbss).forEach(function(key){
				if (err) throw err;
				var dbo = db.db(dbAnalysis);
				//Add metadata
				dbss[key].result.url = urlObj.url;
				dbss[key].result.organization = urlObj.organization;
				dbss[key].result.product = urlObj.product;
				dbo.collection(dbss[key].endpoint).insertOne(dbss[key].result, function(err, res) {
					if (err) throw err;
						db.close();
				});
			});
		});
	}
	
	InsertAnalysis(collection, json){
		var dbAnalysis = this.db;
		MongoClient.connect(this.mongo, { useNewUrlParser: true }, function(err, db) {
			if (err) throw err;
			var dbo = db.db(dbAnalysis);
			dbo.collection(collection).createIndex({"organization": -1, "product": -1});
			dbo.collection(collection).insertOne(json, function(err, res) {
				if (err) throw err;
					var analysis = JSON.stringify(json);
					db.close();
				});
		});
	}
}