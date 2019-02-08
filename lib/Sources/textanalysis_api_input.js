'use strict';
var mongo = require("../stores/mongo");
var aylien = require("../serviceproviders/aylien");
var lr = require('line-reader');
var l = require('../logger');
const config = require('../config.json');

function createDBSnapshots(results, collectionPrefix, url){
	var i = 0;
	var dbss = {};
	results[0].url = url;
	dbss[i++] = {'collection': collectionPrefix + 'abs', 'data': results[0]};
	var classifications = results[1];
	delete classifications.text;
	for(var result in classifications){
		for (var endpoint in classifications[result]){				
			delete classifications[result][endpoint].result.text;			
			delete classifications[result][endpoint].result.sentences;
			classifications[result][endpoint].result.url = url;			
			dbss[i++] = {'collection': collectionPrefix + classifications[result][endpoint].endpoint, 'data': classifications[result][endpoint].result};	
		}
	}
	return dbss;
}

function analyse(fileName, withMetaData, logger) { 
	var metaData = {};
	var url = "";
	var prefix = "";	
	const aiConfig = config.aylien;
	const mongoConfig = config.mongodb;
	var mymongo = new mongo(mongoConfig.url, 'Wiki');	
	lr.eachLine(fileName, function(url, last){
		if(withMetaData){
			metaData = url.split(" ");			
			if(metaData.length < 2){
				console.log("No metadata found in ", fileName);
				return;
			}				
			url = metaData[0];
			prefix = metaData[1] + '/' + metaData[2] + '/';
		}
		var ai = new aylien(aiConfig.application_id, aiConfig.application_key, url, l);		
		var aiPABS = ai.AnalyseABS();			
		var aiP = ai.Analyse();		
		Promise.all([aiPABS, aiP]).then(function(results){
				console.log("Aylienized wiki entry for ", url);
				mymongo.InsertBulkAnalysis(createDBSnapshots(results, prefix, url));
				return results;			
		}).
			catch(error => {console.log("Failed to Aylienize ", url);
		});
		return;	
	});
	return;	
}

module.exports.analyse = analyse;