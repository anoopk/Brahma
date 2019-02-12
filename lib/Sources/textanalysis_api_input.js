'use strict';
var mongo = require("../stores/mongo");
var aylien = require("../serviceproviders/aylien");
var lr = require('line-reader');
var l = require('../logger');
var us = require('../upstream.js');

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

function analyse(aiConfig, mongoConfig, fileName, withMetaData, logger) { 
	var mymongo = new mongo(mongoConfig.url, (withMetaData ? 'Wiki':'Reviews'));	
	lr.eachLine(fileName, function(url, last){
		var infoObj = {};		
		infoObj.url = url.split(" ")[0];
		infoObj.organization = aiConfig.organization;
		infoObj.product = aiConfig.product;
		
		if(withMetaData){
			var metaData = url.split(" ");			
			if(metaData.length < 2){
				console.log("No metadata found in ", fileName);
				return;
			}	
			infoObj.url = metaData[0];	
			infoObj.organization = metaData[1];
			infoObj.product = metaData[2];
		}
		var ai = new aylien(aiConfig.credentials, infoObj, logger);		
		var aiPABS = ai.AnalyseABS();			
		var aiP = ai.Analyse();
		Promise.all([aiPABS, aiP]).then(function(results){
				console.log("Aylienized wiki entry for ", infoObj);
				const snapshots = createDBSnapshots(results, infoObj, aiConfig.watch);
				mymongo.InsertBulkAnalysis(snapshots);
				us.aggregate(snapshots, aiConfig, mongoConfig);
				return results;			
		}).
			catch(error => {console.log("Failed to Aylienize ", url, error);
		});
		return;	
	});
	return;	
}

module.exports.analyse = analyse;