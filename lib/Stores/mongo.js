var MongoClient = require('mongodb').MongoClient;

module.exports = class mongo {
	constructor(mongo, db) {
		this.mongo = mongo;
		this.db = db;
	}

	store(dbss){
		var dbAnalysis = this.db;	
		MongoClient.connect(this.mongo, { useNewUrlParser: true }, function(err, db) {
			Object.keys(dbss).forEach(function(key){
				console.log(dbss[1].results);
				if (err) throw err;
				var dbo = db.db(dbAnalysis);
				if(key > 0){
					dbo.collection(dbss[1].results.endpoint).insertOne(dbss[1].results.result, function(err, res) {
						if (err) throw err;
							db.close();
					});
				}
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