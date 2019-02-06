var mongo = require("./stores/mongo");
var aylien = require("./serviceproviders/aylien");
var fs = require('fs');
const config = require('./config.json');

function main() { 
	const aiConfig = config.aylien;
	const mongoConfig = config.mongodb;
	var ai = new aylien(aiConfig.application_id, aiConfig.application_key);
	var mymongo = new mongo(mongoConfig.url, mongoConfig.database);	
	
	var myObj = {'url': 'https://www.news18.com/news/auto/all-new-maruti-suzuki-wagon-r-first-drive-review-tallboy-is-back-2024089.html', 'endpoint': ['classify/iab-qag', 'sentiment']};
	var myObjABS = {'url': 'https://www.news18.com/news/auto/all-new-maruti-suzuki-wagon-r-first-drive-review-tallboy-is-back-2024089.html', 'domain': 'cars'};
	var inputKeys = Object.keys(myObj);
	
	var aiPABS = ai.AnalyseABS(myObjABS);	
	
	aiPABS.then(function(resp) {
		delete resp.text;
		delete resp.sentences;
		mymongo.InsertAnalysis('ABS', resp);		
	}, function(err) {
		throw(err);
    })
	
    var aiP = ai.Analyse(myObj);		
	aiP.then(function(resp) {
		var analysis = JSON.parse(JSON.stringify(resp));
		var results = Object.keys(analysis.results);
		results.forEach(function(result){
			analysis.results[result].result[inputKeys[0]] = myObj[inputKeys[0]];
			mymongo.InsertAnalysis(analysis.results[result].endpoint, analysis.results[result].result);			
		});		
		return results;
    }, function(err) {
		throw(err);
    })
}

main();

