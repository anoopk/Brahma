var AYLIENTextAPI = require('aylien_textapi');
var request = require("request");

module.exports = class aylien {	
	constructor (application_id, application_key){
		this.textapi = new AYLIENTextAPI({
		  application_id: this.application_id,
		  application_key: this.application_key
		});
	}
	
	Analyse(json) {
		// Return new promise 
		return new Promise(function(resolve, reject) {
			// Do async job
			textapi.sentiment(json, function(err, resp, body) {
				if (err) {
					reject(err);
				} else {
					resolve(resp);
				}
			})
		})
	}
}