import fs from 'fs';

const logError = (error, req) => {
	const date = new Date().toString();
	const logFormat = `${date} | ${req.method} ${req.path} | ${error.statusCode} | ${error.message} 

DETAIL ERROR: ${JSON.stringify(error)}
--------------------------------------------------------------------------------------------------
	\n`;

	fs.appendFile('./logError.txt', logFormat, function (err) {
		if (err) {
			console.err('Can not save the error information into logError.txt.');
		} else {
			console.log('Save the error information successfully.');
		}
	});
};

export default logError;
