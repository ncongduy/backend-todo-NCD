const logError = require('../utils/logError.js');

class ApiError {
  constructor(statusCode, message, source) {
    this.statusCode = statusCode;
    this.message = message;
    this.source = source;
  }
}

class NotFoundError extends ApiError {
  constructor(message = 'Not Found', source) {
    super(404, message, source);
  }
}

class ForbiddenError extends ApiError {
  constructor(message = 'Forbidden', source) {
    super(403, message, source);
  }
}

class InternalServerError extends ApiError {
  constructor(message = 'Internal Server Error', source) {
    super(500, message, source);
  }
}

class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized Request', source) {
    super(401, message, source);
  }
}

class BadRequestError extends ApiError {
  constructor(message = 'Bad Request', source) {
    super(400, message, source);
  }
}

const errorHandler = (error, req, res, next) => {
  if (error.source) {
    logError(error, req);
  }

  res.status(error.statusCode).json({
    status: 'error',
    statusCode: error.statusCode,
    message: error.message,
  });
};

module.exports = {
  ApiError,
  NotFoundError,
  ForbiddenError,
  InternalServerError,
  UnauthorizedError,
  BadRequestError,
  errorHandler,
};
