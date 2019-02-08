var lr = require('line-reader');

var reviewanalysis = require('./src/sources/reviews/reviewanalysis_api_input');
var wikianalysis = require('./src/sources/wiki/wikianalysis_api_input');
reviewanalysis.analyse("input/inputURLList.txt");
wikianalysis.analyse("input/inputWikiList.txt");