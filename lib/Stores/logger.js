'use strict';
var fs = require('fs');

exports.handler = async( event, context) => {	
	if(event.append){
		await fs.appendFile(event.filename, JSON.stringify(event.snapshots), (error) => {		
			if(error)	
				console.log("Error writing analysis data to local file");
		});		
	}
	else{
		await fs.writeFile(event.filename, JSON.stringify(event.snapshots), (error) => {		
			if(error)	
				console.log("Error writing analysis data to local file");
		});
	}
	console.log(event.filename, " has a copy of the mongo data snapshot");
}