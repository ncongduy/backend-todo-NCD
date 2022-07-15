import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';

import userRouter from './user/user.router.js';
import errorHandler from './middleware/errorHandler.js';

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
app.use('/api/user', userRouter);

// error handling
app.use(errorHandler);

export default app;
