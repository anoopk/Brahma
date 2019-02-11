'use strict';
var textAnalysis_api_input = require("../textanalysis_api_input.js");

function analyse(aiConfig, mongoConfig, sourceConfig, logger) { 
	sourceConfig.urlWithMetadata ? textAnalysis_api_input.analyse(aiConfig, mongoConfig, sourceConfig.urlWithMetadata, true, logger): consolelog();
}

module.exports.analyse = analyse;