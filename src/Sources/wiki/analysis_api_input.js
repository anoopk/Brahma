'use strict';
var textAnalysis_api_input = require("../textanalysis_api_input.js");

function analyse(filename, logger) { 
	textAnalysis_api_input.analyse(filename, true, logger);
}

module.exports.analyse = analyse;