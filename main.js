const config = require('./config.json')
const urlReader = require('./lib/readers/urlMetaData')

function main(){	
	urlReader.nextUrl("input/inputURLList.txt", config.aylien, (urlObj) => {
		const server = require('./server.js');
		config.aylien.transform = urlObj;
		config.aylien.watch = config.watch;
		server.handler(config);
	});
}

main();