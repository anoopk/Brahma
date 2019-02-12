var lr = require('line-reader');
const config = require('./config.json');
//console.log(config);
 
var reviewanalysis = require('./lib/sources/reviews/analysis_api_input');
var pr = reviewanalysis.analyse(config.aylien, config.mongodb, config.sources);

var wikianalysis = require('./lib/sources/wiki/analysis_api_input');
wikianalysis.analyse(config.aylien, config.mongodb, config.sources);


//var us = require('./lib/upstream.js');
//var newobj = {"sentiment":.45, "organization":"Maruti", "product":"WagonR", "analysis":"sentiment"};
//var newobj = {"sentiment":.45, "entity":"Suzuki", "analysis":"sentiment"};
//us.aggregate(newobj, config.aylien.watch, config.mongodb, config.watch);



