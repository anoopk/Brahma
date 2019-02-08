var mongo = require("./stores/mongo");
var MongoClient = require('mongodb').MongoClient;
const config = require('./config.json');

function analyse(database, obj){
	var collection = obj.organization + "/" + obj.product + "/" + obj.analysis;
	const mongoConfig = config.mongodb;
	var mymongo = new mongo(mongoConfig.url, database);
	mymongo.InsertAnalysis(collection, obj);
}

function aggregate(database, obj){
	var collection = obj.organization + "/" + obj.product + "/" + obj.analysis;

	const mongoConfig = config.mongodb;
	MongoClient.connect(mongoConfig.url, { useNewUrlParser: true }, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db(database);
	  dbo.collection(collection).findOne({}, function(err, result) {
		if (err) throw err;
		obj.sentiment = ((result.reviews * result.sentiment) + obj.sentiment)/(result.reviews+1);
		obj.reviews = result.reviews+1;
		obj.timestamp = { type: Date, default: Date.now};
		var mymongo = new mongo(mongoConfig.url, database);
		mymongo.InsertAnalysis(collection, obj);
		db.close();
	  });
	});
}

module.exports.analyse = analyse;
module.exports.aggregate = aggregate;