import dotenv from 'dotenv';

import app from './app.js';
import db from './config/db.js';

dotenv.config();
const port = process.env.PORT || 5000;

// check data connection
db.authenticate()
	.then(() => console.log('Connection has been established successfully.'))
	.catch((err) => console.error('Unable to connect to the database:', err));

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
