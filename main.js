var lr = require('line-reader');

var reviewanalysis = require('./lib/sources/reviews/analysis_api_input');
var wikianalysis = require('./lib/sources/wiki/analysis_api_input');
//var us = require('./lib/upstream.js');

//var obj = {"sentiment":.54, "organization":"Maruti", "product":"WagonR", "analysis":"sentiment", "reviews": 3, timestamp: { type: Date, default: Date.now}};
//us.analyse("Statistics", obj);

//var newobj = {"sentiment":.45, "organization":"Maruti", "product":"WagonR", "analysis":"sentiment"};
//us.aggregate("Statistics", newobj);
//us.drop("Statistics", "Maruti/WagonR");

reviewanalysis.analyse("input/inputUrlList.txt");
wikianalysis.analyse("input/inputWikiList.txt");