// import from library
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const passport = require('passport');

// import internal
const userRouter = require('./user/user.router.js');
const taskRouter = require('./task/task.router.js');
const {errorHandler, NotFoundError} = require('./middleware/errorHandler.js');
const apiContentType = require('./middleware/apiContentType.js');
const {jwtStrategy, githubStrategy} = require('./config/passport.js');

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

// passport configuration
app.use(passport.initialize());
passport.use(jwtStrategy);
passport.use(githubStrategy);

// routing
app.use('/api/user', userRouter);
app.use('/api/task', taskRouter);

app.get('*', (req, res, next) => {
	next(new NotFoundError());
});

// error handling
app.use(errorHandler);

module.exports = app;
