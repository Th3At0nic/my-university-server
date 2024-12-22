/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

import { ErrorRequestHandler } from 'express';
import { NotFoundError } from '../utils/errors/notFoundError';
import { ValidationError } from '../utils/errors/validationError';
import { ConflictError } from '../utils/errors/conflictError';
import { ZodError } from 'zod';
import { TErrorSource } from '../interface/error';
import config from '../config';
import { handleZodError } from '../utils/errors/handleZodError';
import { handleMongooseError } from '../utils/errors/handleMongooseError';

export const globalErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next,
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong!';

  let errorSource: TErrorSource = [
    {
      path: '',
      message: 'Something went wrong',
    },
  ];

  if (err instanceof NotFoundError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  if (err instanceof ValidationError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  if (err instanceof ConflictError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  if (err instanceof ZodError) {
    const simplifiedZodError = handleZodError(err);
    statusCode = simplifiedZodError.statusCode;
    message = simplifiedZodError.message;
    errorSource = simplifiedZodError.errorSource;
  }

  if (err.name === 'ValidationError') {
    const simplifiedMongooseError = handleMongooseError(err);
    statusCode = simplifiedMongooseError.statusCode;
    message = simplifiedMongooseError.message;
    errorSource = simplifiedMongooseError.errorSource;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSource,
    ...(config.NODE_ENV === 'development' ? { stack: err.stack } : null),
  });
};
