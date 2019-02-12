'use strict';
var textAnalysis_api_input = require("../textanalysis_api_input.js");

function analyse(aiConfig, mongoConfig, obj, logger) { 
	obj ? textAnalysis_api_input.analyse(aiConfig, mongoConfig, obj, false, logger): console.log("Bad configuration. Input file name missing.");
}

module.exports.analyse = analyse;