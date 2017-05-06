const Error = require('es6-error')

class CustomError extends Error {
  toJSON () {
    const { statusCode, error, message } = this
    return {statusCode, error, message}
  }
}

class NotFound extends CustomError {
  get statusCode () { return '404' }
  get error () { return 'Not Found' }
}

class BadRequest extends CustomError {
  get statusCode () { return '400' }
  get error () { return 'Bad Request' }
}

class InternalServerError extends CustomError {
  get statusCode () { return '500' }
  get error () { return 'Internal Server Error' }
}

const errorHandler = (err, req, res, next) => {
  const error = err instanceof CustomError ? err : new InternalServerError()
  res.status(error.statusCode).json({
    success: false,
    message: error.message
  })
}

const testError = (req, res, next) => {
  next(new NotFound('This is a test error page'))
}

module.exports = {
  CustomError,
  NotFound,
  BadRequest,
  InternalServerError,
  errorHandler,
  testError
}
