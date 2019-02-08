'use strict';
var mongo = require("../../stores/mongo");
var aylien = require("../../serviceproviders/aylien");
var fs = require('fs');
var lr = require('line-reader');
var l = require('../../logger');
const config = require('../../config.json');

function createDBSnapshots(results, url){
	var i = 0;
	var dbss = {};
	results[0].url = url;
	dbss[i++] = {'collection': results.organization + '/' + results.product + '/' + 'abs', 'data': results[0]};
	var classifications = results[1];
	delete classifications.text;
	for(var result in classifications){
		for (var endpoint in classifications[result]){				
			delete classifications[result][endpoint].result.text;			
			delete classifications[result][endpoint].result.sentences;
			classifications[result][endpoint].result.url = url;			
			dbss[i++] = {'collection': results.organization + '/' + results.product + '/' + classifications[result][endpoint].endpoint, 'data': classifications[result][endpoint].result};	
		}
	}
	return dbss;
}

function analyse(filename, logger) { 
	const aiConfig = config.aylien;
	const mongoConfig = config.mongodb;
	var mymongo = new mongo(mongoConfig.url, 'Wiki');	
	lr.eachLine(filename, function(line, last){
		var metaData = line.split(" ");
		var url = metaData[0];
		var ai = new aylien(aiConfig.application_id, aiConfig.application_key, url, l);		
		var aiPABS = ai.AnalyseABS();			
		var aiP = ai.Analyse();		
		Promise.all([aiPABS, aiP]).then(function(results){
				results.organization = metaData[1];
				results.product = metaData[2];							
				console.log("Aylienized wiki entry for ", metaData[1], metaData[2], url);
				mymongo.InsertBulkAnalysis(createDBSnapshots(results, url));
				return results;			
		}).
			catch(error => {console.log("Failed to Aylienize ", url);
		});
		return;	
	});
	return;	
}

module.exports.analyse = analyse;