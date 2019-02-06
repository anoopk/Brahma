var mongo = require("./stores/mongo");
var aylien = require("./serviceproviders/aylien");
var fs = require('fs');
var lr = require('line-reader');
const config = require('./config.json');

function main() { 
	const aiConfig = config.aylien;
	const mongoConfig = config.mongodb;
	var mymongo = new mongo(mongoConfig.url, mongoConfig.database);	
	
	lr.eachLine('./input/inputURLList.txt', function(url, last){
		var ai = new aylien(aiConfig.application_id, aiConfig.application_key);		
		var aiPABS = ai.AnalyseABS(url);			
		var aiP = ai.Analyse(url);		
		
		Promise.all([aiPABS, aiP]).then(function(results){
			var resp = results[0];
			delete resp.text;			
			delete resp.sentences;
			resp['url'] = url;
			mymongo.InsertAnalysis('ABS', resp);		
			
			resp = results[1];
			delete resp.text;
			resp['url'] = url;			
			mymongo.InsertAnalysis("Sentiment", resp);			
			return results;			
		})
		return;	
	});
	return;	
}

main();

