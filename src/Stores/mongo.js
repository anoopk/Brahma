var MongoClient = require('mongodb').MongoClient;

module.exports = class mongo {
	constructor(url, db) {
		this.url = url;
		this.db = db;
	}

	InsertAnalysis(collection, json){
		MongoClient.connect(this.url, function(err, db) {
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