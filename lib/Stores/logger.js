'use strict';
var fs = require('fs');

function log(event, context, callback){	
	if(event.append){
		fs.appendFile(event.filename, event.snapshots, (error) => {		
			if(error)	
				console.log("Error writing analysis data to local file");
		});		
	}
	else{
		fs.writeFile(event.filename, event.data, (error) => {		
			if(error)	
				console.log("Error writing analysis data to local file");
		});
	}
	console.log(event.filename, " has a copy of the mongo data snapshot");
}
module.exports.store = log;