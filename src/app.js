import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';

// declare variable
const app = express();
const corsOption = {
	origin: 'http://localhost:3000',
};

// middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(cors(corsOption));
app.use(express.json());

// routing

// error handler

export default app;
