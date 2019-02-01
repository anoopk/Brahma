var mongo = require("./stores/mongo");
var aylien = require("./serviceproviders/aylien");

// Mongo cluster Info
var url = "mongodb://anoop:Rucksa0k@cluster0-shard-00-00-tcllz.mongodb.net:27017,cluster0-shard-00-01-tcllz.mongodb.net:27017,cluster0-shard-00-02-tcllz.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true";

// Aylien credentials
var db = "Analysis";
var collection = "Sentiment";
var application_id = "3e37c5de";
var application_key = "69a0c0f40f7137b9e51eed2f06df37b9";


function main() { 
	var ai = new aylien(application_id, application_key);
	var mymongo = new mongo(url);	
	var myObj = {'text': 'John is a very good football player!'};
	
    var initializePromise = ai.Analyse(myObj);
    initializePromise.then(function(result) {
		mymongo.InsertAnalysis(db, collection, result);
		return result;
    }, function(err) {
        console.log(err);
		throw(err);
    })
}

main();
