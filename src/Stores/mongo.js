var MongoClient = require('mongodb').MongoClient;

module.exports = class mongo {
	constructor(url, db) {
		this.url = url;
	}

	InsertAnalysis(collection, json, url){
		//Rid of unwanted data
		switch(collection){
			case "ABS": 
				delete json.text;			
				delete json.sentences;
				json['url'] = url;			
				break
			default: 
				delete json.text;
				json['url'] = url;						
		}
		MongoClient.connect(this.url, { useNewUrlParser: true }, function(err, db) {
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