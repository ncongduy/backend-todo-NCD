import express from 'express';
import helmet from 'helmet';

const app = express();

// middleware
app.use(helmet()); // middleware for security

app.get('/health', (req, res) => {
	res.send('Sever is running.');
});

export default app;
