'use strict';
var mongo = require("./stores/mongo");
var aylien = require("./serviceproviders/aylien");
var fs = require('fs');
var lr = require('line-reader');
const config = require('./config.json');

function analyse(filename, logger) { 
	const aiConfig = config.aylien;
	const mongoConfig = config.mongodb;
	var mymongo = new mongo(mongoConfig.url);	
	
	lr.eachLine(filename, function(url, last){
		var ai = new aylien(aiConfig.application_id, aiConfig.application_key, url);		
		var aiPABS = ai.AnalyseABS(url);			
		var aiP = ai.Analyse(url);		
		
		Promise.all([aiPABS, aiP]).then(function(results){
			mymongo.InsertAnalysis('ABS', results[0], url);		

			var classifications = results[1];
			delete classifications.text;
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

module.exports.analyse = analyse;