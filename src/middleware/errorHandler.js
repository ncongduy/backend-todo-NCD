export class ApiError {
  constructor(statusCode, message, source) {
    this.statusCode = statusCode;
    this.message = message;
    this.source = source;
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Not Found', source) {
    super(404, message, source);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = 'Forbidden', source) {
    super(403, message, source);
  }
}

export class InternalServerError extends ApiError {
  constructor(message = 'Internal Server Error', source) {
    super(500, message, source);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized Request', source) {
    super(401, message, source);
  }
}

export class BadRequestError extends ApiError {
  constructor(message = 'Bad Request', source) {
    super(400, message, source);
  }
}

const errorHandler = (error, req, res, next) => {
  if (error.source) {
    console.error(error.source);
  }

  res.status(error.statusCode).json({
    status: 'error',
    statusCode: error.statusCode,
    message: error.message,
  });
};

export default errorHandler;
