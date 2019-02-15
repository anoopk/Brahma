const config = require('./config.json')
const urlReader = require('./lib/readers/urlMetaData')
const lambdaLocal = require('lambda-local');

function main(){	
	urlReader.nextUrl("input/inputURLList.txt", config.aylien, (urlObj) => {
		const server = require('./server.js');
		config.aylien.transform = urlObj;
		config.aylien.watch = config.watch;
		lambdaLocal.execute({
			event: config,
			lambdaPath: './server',
			timeoutMs: 13000
		}).then(function(done) {
			console.log("done");
		});			
	});
}

main();