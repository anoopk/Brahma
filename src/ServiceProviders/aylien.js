var AYLIENTextAPI = require('aylien_textapi');
var request = require("request");

module.exports = class aylien {	
	constructor (application_id, application_key, db){
		this.application_id = application_id;
		this.application_key = application_key;
	}

	AnalyseABS(json){
		var textapi = new AYLIENTextAPI({
		  application_id: this.application_id,
		  application_key: this.application_key
		});
		// Return new promise 
		return new Promise(function(resolve, reject) {
			// Do async job
			textapi.aspectBasedSentiment(json, function(err, resp, body) {
				if (err) {
					reject(err);
				} else {
					resolve(resp);
				}
			})
		})		
	}
	
	Analyse(json) {
		var textapi = new AYLIENTextAPI({
		  application_id: this.application_id,
		  application_key: this.application_key
		});
		// Return new promise 
		return new Promise(function(resolve, reject) {
			// Do async job
			textapi.combined(json, function(err, resp, body) {
				if (err) {
					reject(err);
				} else {
					resolve(resp);
				}
			})
		})
	}
}