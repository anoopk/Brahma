exports.handler = async (event) => {
	var server = require('./main.js');
	server.serve(event);
    const response = {
        statusCode: 200,
        body: JSON.stringify('Data Aylienized'),
    };
    return response;
};