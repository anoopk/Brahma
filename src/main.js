var mongo = require("./stores/mongo");
var aylien = require("./serviceproviders/aylien");
var fs = require('fs');
var lr = require('line-reader');
const config = require('./config.json');

function main() { 
	const aiConfig = config.aylien;
	const mongoConfig = config.mongodb;
	var mymongo = new mongo(mongoConfig.url);	
	
	lr.eachLine('./input/inputURLList.txt', function(url, last){
		var ai = new aylien(aiConfig.application_id, aiConfig.application_key);		
		var aiPABS = ai.AnalyseABS(url);			
		var aiP = ai.Analyse(url);		
		
		Promise.all([aiPABS, aiP]).then(function(results){
			mymongo.InsertAnalysis('ABS', results[0], url);		
		
			var classifications = results[1];
			for(var result in classifications){
				for (var endpoint in classifications[result]){
					mymongo.InsertAnalysis(classifications[result][endpoint].endpoint, classifications[result][endpoint].result, url);
				}
			}
			return results;			
		})
		return;	
	});
	return;	
}

main();

