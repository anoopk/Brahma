var MongoClient = require('mongodb').MongoClient;

function store(dbss, url, dbName){
	var dbName = dbName;	
	MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
		Object.keys(dbss).forEach(function(key){
			if (err) throw err;
			var dbo = db.db(dbName);
			//Add metadata
			dbo.collection(dbss[key].endpoint).insertOne(dbss[key], function(err, res) {
				if (err) throw err;
					db.close();
			});
		});
	});
}

module.exports.store = store;