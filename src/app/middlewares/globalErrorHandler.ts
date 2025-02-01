/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { TErrorSource } from '../interface/error';
import config from '../config';
import { handleZodError } from '../errors/handleZodError';
import { handleMongooseError } from '../errors/handleMongooseError';
import { handleCastError } from '../errors/handleCastError';
import { handleDuplicateError } from '../errors/handleDuplicateError';

export const globalErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next,
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong!';

  let errorSource: TErrorSource = err.errorSource || [
    { path: '', message: err.message || 'Something went wrong' },
  ];

  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSource = simplifiedError.errorSource;
  } else if (err.name === 'ValidationError') {
    const simplifiedError = handleMongooseError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSource = simplifiedError.errorSource;
  } else if (err.name === 'CastError') {
    const simplifiedError = handleCastError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSource = simplifiedError.errorSource;
  } else if (err.code === 11000) {
    const simplifiedError = handleDuplicateError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSource = simplifiedError.errorSource;
  }

  // if (err instanceof NotFoundError) {
  //   statusCode = err.statusCode;
  //   message = err.message;
  //   errorSource = err.errorSource;
  // }
  // else if (err instanceof ValidationError) {
  //   statusCode = err.statusCode;
  //   message = err.message;
  //   errorSource = err.errorSource;
  // } else if (err instanceof ConflictError) {
  //   statusCode = err.statusCode;
  //   message = err.message;
  //   errorSource = err.errorSource;
  // }

  res.status(statusCode).json({
    success: false,
    message,
    errorSource,
    ...(config.NODE_ENV === 'development' ? { stack: err.stack } : null),
  });
};
