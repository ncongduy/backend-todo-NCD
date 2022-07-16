// import from library
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');

// import internal
const userRouter = require('./user/user.router.js');
const {errorHandler, NotFoundError} = require('./middleware/errorHandler.js');
const apiContentType = require('./middleware/apiContentType.js');

// declare variable
const app = express();
const corsOption = {
	origin: 'http://localhost:3000',
};

// middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(cors(corsOption));
app.use(apiContentType);
app.use(express.json());

// routing
app.use('/api/user', userRouter);

app.get('*', (req, res, next) => {
	next(new NotFoundError());
});

// error handling
app.use(errorHandler);

module.exports = app;
