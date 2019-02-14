'use strict';
var fs = require('fs');

function log(fileName, data, append){
	if(append){
		fs.appendFile(fileName, data, (error) => {		
			if(error)	
				console.log("Error writing analysis data to local file");
		});		
	}
	else{
		fs.writeFile(fileName, data, (error) => {		
			if(error)	
				console.log("Error writing analysis data to local file");
		});
	}
	console.log(fileName, " has a copy of the mongo data snapshot");
}
module.exports.store = log;