'use strict';
var aylien = require("../serviceproviders/aylien");

function createDBSnapshots(results, infoObj, watch){
	var i = 0;
	var dbss = {};
	results[0].url = infoObj.url;
	results[0].organization = infoObj.organization;
	results[0].product = infoObj.product;
	
	dbss[i++] = {'collection': 'abs', 'data': results[0]};
	var classifications = results[1];
	delete classifications.text;
	for(var result in classifications){
		for (var endpoint in classifications[result]){	
			delete classifications[result][endpoint].result.text;			
			//delete classifications[result][endpoint].result.sentences;
			classifications[result][endpoint].result.url = infoObj.url;			
			classifications[result][endpoint].result.organization = infoObj.organization;
			classifications[result][endpoint].result.product = infoObj.product;	
			dbss[i++] = {'collection': classifications[result][endpoint].endpoint, 'data': classifications[result][endpoint].result};	
		}
	}
	return dbss;
}

function analyse(aiConfig, infoObj, callback) { 
	var ai = new aylien(aiConfig.credentials, infoObj);		
	var aiPABS = ai.AnalyseABS();			
	var aiP = ai.Analyse();
	Promise.all([aiPABS, aiP]).then(function(results){
		console.log("Aylienized wiki entry for ", infoObj);
		const snapshots = createDBSnapshots(results, infoObj, aiConfig.watch);
		callback(results);			
	});
	return;	
}

module.exports.analyse = analyse;