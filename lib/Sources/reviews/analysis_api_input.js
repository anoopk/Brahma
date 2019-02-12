'use strict';
var textAnalysis_api_input = require("../textanalysis_api_input.js");

function analyse(aiConfig, mongoConfig, sourceConfig, logger) { 
	//sourceConfig.url ? textAnalysis_api_input.analyse(aiConfig, mongoConfig, sourceConfig.url, false, logger): console.log("Bad configuration. Input file name missing.");
	var pr = textAnalysis_api_input.analyse(aiConfig, mongoConfig, sourceConfig.url, false, logger);
}

module.exports.analyse = analyse;