var AYLIENTextAPI = require('aylien_textapi');
var request = require("request");

module.exports = class aylien {	
	constructor (application_id, application_key, url){
		this.obj = {};
		this.obj.url = url;
		this.textapi = new AYLIENTextAPI({
		  application_id: application_id,
		  application_key: application_key
		});
	}

	AnalyseABS(){
		this.obj.domain = 'cars';			
		var me = this;		
		
		// Return new promise 
		return new Promise(function(resolve, reject) {
			// Do async job
			me.textapi.aspectBasedSentiment(me.obj, function(err, resp, body) {
				if (err) {
					reject(err);
				} else {
					resolve(resp);
				}
			})
		})		
	}
	
	Analyse() {		
		this.obj.endpoint = ['classify/iab-qag', 'sentiment', 'entities'];		
		var me = this;		
			
		// Return new promise 
		return new Promise(function(resolve, reject) {			
			// Do async job
			me.textapi.combined(me.obj, function(err, resp, body) {
				if (err) {
					reject(err);
				} else {
					resolve(resp);
				}
			})
		})
	}
}