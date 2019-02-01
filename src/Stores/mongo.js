var MongoClient = require('mongodb').MongoClient;

module.exports = class mongo {
	constructor(url) {
		this.url = url;
	}

	InsertAnalysis(collection, json){
		MongoClient.connect(this.url, function(err, db) {
		if (err) throw err;
		var dbo = db.db(collection);
		var myobj = json;
		dbo.collection("customers").insertOne(myobj, function(err, res) {
			if (err) throw err;
				var analysis = JSON.stringify(json);
				console.log("Document Inserted \n" + analysis);
				db.close();
			});
		});
	}
}