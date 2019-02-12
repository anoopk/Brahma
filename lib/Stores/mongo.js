var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');

module.exports = class mongo {
	constructor(mongo, db) {
		this.mongo = mongo;
		this.db = db;
	}

	InsertBulkAnalysis(dbss){
		var dbAnalysis = this.db;	
		MongoClient.connect(this.mongo, { useNewUrlParser: true }, function(err, db) {
			Object.keys(dbss).forEach(function(key){
					if (err) throw err;
					fs.appendFile("mongodb.log", JSON.stringify(dbss[key].data), (error) => {		
						if(error)	
							console.log("Error writing analysis data to local file");
					});
					console.log(dbss[key].collection, " data logged into mongodb.txt");
					var dbo = db.db(dbAnalysis);
					dbo.collection(dbss[key].collection).insertOne(dbss[key].data, function(err, res) {
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
			dbo.collection(collection).insertOne(json, function(err, res) {
				if (err) throw err;
					var analysis = JSON.stringify(json);
					db.close();
				});
		});
	}
}