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
}