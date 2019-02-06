var mongo = require("./stores/mongo");
var aylien = require("./serviceproviders/aylien");
var fs = require('fs');
var lr = require('line-reader');
const config = require('./config.json');

function main() { 
	const aiConfig = config.aylien;
	const mongoConfig = config.mongodb;
	var ai = new aylien(aiConfig.application_id, aiConfig.application_key);
	var mymongo = new mongo(mongoConfig.url, mongoConfig.database);	
	
	lr.eachLine('./input/inputURLList.txt', function(url, last){
		var myObj = {'endpoint': ['classify/iab-qag', 'sentiment']};
		var myObjABS = {'domain': 'cars'};
		
		myObj.url = url;
		myObjABS.url = url;
		
		var aiPABS = ai.AnalyseABS(myObjABS);			
		var aiP = ai.Analyse(myObj);		
		
		Promise.all([aiPABS, aiP]).then(function(results){
			var resp = results[0];
			delete resp.text;			
			delete resp.sentences;
			resp['url'] = url;
			mymongo.InsertAnalysis('ABS', resp);		
			
			resp = results[1];
			delete resp.text;
			
			var inputKeys = Object.keys(myObj);				
			var analysis = JSON.parse(JSON.stringify(resp));
			var results = Object.keys(analysis.results);
			results.forEach(function(result){
				analysis.results[result].result['url'] = url;
				mymongo.InsertAnalysis(analysis.results[result].endpoint, analysis.results[result].result);			
			});		
			return results;			
		})
		return;	
	});
	return;	
}

main();

