var AYLIENTextAPI = require('aylien_textapi');
var request = require("request");

module.exports = class aylien {	
	constructor (application_id, application_key){
		this.application_id = application_id;
		this.application_key = application_key;
	}

	AnalyseABS(url){
		var textapi = new AYLIENTextAPI({
		  application_id: this.application_id,
		  application_key: this.application_key
		});
		// Return new promise 
		return new Promise(function(resolve, reject) {
			var myObjABS = {'domain': 'cars'};			
			myObjABS.url = url;			
			// Do async job
			textapi.aspectBasedSentiment(myObjABS, function(err, resp, body) {
				if (err) {
					reject(err);
				} else {
					resolve(resp);
				}
			})
		})		
	}
	
	Analyse(url) {		
		var textapi = new AYLIENTextAPI({
		  application_id: this.application_id,
		  application_key: this.application_key
		});
		// Return new promise 
		return new Promise(function(resolve, reject) {
			var myObj = {'endpoint': ['classify/iab-qag', 'sentiment']};		
			myObj.url = url;
			
			// Do async job
			textapi.combined(myObj, function(err, resp, body) {
				if (err) {
					reject(err);
				} else {
					resolve(resp);
				}
			})
		})
	}
}