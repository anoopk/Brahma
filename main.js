var lr = require('line-reader');

//var reviewanalysis = require('./src/sources/reviews/analysis_api_input');
//var wikianalysis = require('./src/sources/wiki/analysis_api_input');
var us = require('./src/upstream.js');

var obj = {"sentiment":.54, "organization":"Maruti", "product":"WagonR", "analysis":"sentiment", "reviews": 3, timestamp: { type: Date, default: Date.now}};
//us.analyse("Statistics", obj);

var newobj = {"sentiment":.345, "organization":"Maruti", "product":"WagonR", "analysis":"sentiment"};
us.aggregate("Statistics", newobj);
//us.drop("Statistics", "Maruti/WagonR");
//reviewanalysis.analyse("input/inputURLList.txt");
//wikianalysis.analyse("input/inputWikiList.txt");