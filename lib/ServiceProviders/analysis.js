'use strict';
var aylien = require("../serviceproviders/aylien");

function createDBSnapshots(results, urlobj, watch){
	var snapshot = {};
	snapshot[0] = {"endpoint" : "abs", "result": results[0], "organization": urlobj.organization, "product": urlobj.product};
	Object.keys(results[1].results).forEach(function(key){
		snapshot[key] = results[1].results[key];
		snapshot[key].organization = urlobj.organization;
		snapshot[key].product = urlobj.product;
		snapshot[key].url = urlobj.url;
	});
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