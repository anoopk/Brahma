var MongoClient = require('mongodb').MongoClient;

module.exports = class mongo {
	constructor(mongo, db) {
		this.mongo = mongo;
		this.db = db;
	}

	store(dbss){
		console.log(">>>>>>>>>>>>>>> ", dbss);
		var dbAnalysis = this.db;	
		MongoClient.connect(this.mongo, { useNewUrlParser: true }, function(err, db) {
			Object.keys(dbss).forEach(function(key){
				if (err) throw err;
				var dbo = db.db(dbAnalysis);
				//Add metadata
				dbo.collection(dbss[key].endpoint).insertOne(dbss[key], function(err, res) {
					if (err) throw err;
						db.close();
				});
			});
		});
	}
	
	store1(obj){
		var dbAnalysis = this.db;
		MongoClient.connect(this.mongo, { useNewUrlParser: true }, function(err, db) {
			if (err) throw err;
			var dbo = db.db(dbAnalysis);
			dbo.collection(obj.collection).createIndex({"organization": -1, "product": -1});
			dbo.collection(obj.collection).insertOne(obj, function(err, res) {
				if (err) throw err;
					db.close();
				});
		});
	}
}