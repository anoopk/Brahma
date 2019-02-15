var MongoClient = require('mongodb').MongoClient;

exports.handler = (event, context, callback) => {
	const dbss = event.snapshots;
	MongoClient.connect(event.url, { useNewUrlParser: true }, function(err, db) {
		if (err) callback(err);
		Object.keys(dbss).forEach(function(key){
			if (err) throw err;
			var dbo = db.db(event.db);
			//Add metadata
			console.log("-----> ", dbss[key]);
			dbo.collection("sentiment").insertOne(dbss[key], function(err, res) {
				if (err) throw err;
					db.close();
			});
		});
	});
}

