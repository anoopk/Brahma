var MongoClient = require('mongodb').MongoClient;

function store(event, context, callback){
	const dbss = event.snapshots;
	MongoClient.connect(event.url, { useNewUrlParser: true }, function(err, db) {
		if (err) callback(err);
				Object.keys(dbss).forEach(function(key){
			if (err) throw err;
			var dbo = db.db(event.db);
			//Add metadata
			dbo.collection(dbss[key].endpoint).insertOne(dbss[key], function(err, res) {
				if (err) throw err;
					db.close();
					callback(dbss);
			});
		});
	});
}

module.exports.store = store;