'use strict';
var aylien = require("../serviceproviders/aylien");

function createDBSnapshots(results, infoObj, watch){
	var snapshot = {};
	snapshot[0] = {"endpoint" : "abs", "result": results[0]}
	snapshot[1] = results[1].results[0];
	snapshot[2] = results[1].results[1];
	snapshot[3] = results[1].results[2];
	return snapshot;
}

function analyse(aiConfig, infoObj, callback) { 
	var ai = new aylien(aiConfig.credentials, infoObj);		
	var aiPABS = ai.AnalyseABS();			
	var aiP = ai.Analyse();
	Promise.all([aiPABS, aiP]).then(function(results){
		console.log("Aylienized wiki entry for ", infoObj);
		const snapshots = createDBSnapshots(results, infoObj, aiConfig.watch);
		callback(snapshots);			
	});
	return;	
}

module.exports.analyse = analyse;