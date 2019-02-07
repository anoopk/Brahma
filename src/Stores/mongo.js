var MongoClient = require('mongodb').MongoClient;

module.exports = class mongo {
	constructor(mongo, db) {
		this.mongo = mongo;
		this.db = db;
	}

	InsertBulkAnalysis(dbss){
		MongoClient.connect(this.mongo, { useNewUrlParser: true }, function(err, db) {
			Object.keys(dbss).forEach(function(key){
					if (err) throw err;
					var dbo = db.db("Analysis");
					dbo.collection(dbss[key].collection).insertOne(dbss[key].data, function(err, res) {
						if (err) throw err;
							db.close();
						});
				});
		});
	}
	
	InsertAnalysis(collection, json, url){
		MongoClient.connect(this.mongo, { useNewUrlParser: true }, function(err, db) {
			if (err) throw err;
			var dbo = db.db("Analysis");
			dbo.collection(collection).insertOne(json, function(err, res) {
				if (err) throw err;
					var analysis = JSON.stringify(json);
					db.close();
				});
		});
	}
}