// import from library
const dotenv = require('dotenv');

// import from internal
const app = require('./app.js');
const db = require('./config/db.js');

// config and declare variable
dotenv.config();
const port = process.env.PORT || 5000;

// check data connection
db.authenticate()
	.then(() => console.log('Connect to database successfully.'))
	.catch((error) => console.error('Unable to connect to the database:', error));

// run server
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
