import dotenv from 'dotenv';

import app from './app.js';
import db from './config/db.js';

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
