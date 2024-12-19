/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { ErrorRequestHandler } from 'express';
import { NotFoundError } from '../utils/errors/notFoundError';
import { ValidationError } from '../utils/errors/validationError';
import sendResponse from '../utils/sendResponse';
import { ConflictError } from '../utils/errors/conflictError';

export type TErrorSource = {
  path: string | number;
  message: string;
}[];

const errorSource: TErrorSource = [
  {
    path: '',
    message: 'Something went wrong',
  },
];

export const globalErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next,
) => {
  if (err instanceof NotFoundError) {
    sendResponse(res, err.statusCode, false, err.message, err.errorSource);
    // res.status(err.statusCode).json({ message: err.message });
  }

  if (err instanceof ValidationError) {
    sendResponse(res, err.statusCode, false, err.message, err.errorSource);
    // res.status(err.statusCode).json({ message: err.message });
  }

  if (err instanceof ConflictError) {
    sendResponse(res, err.statusCode, false, err.message, err.errorSource);
  }

  res.status(500).json({
    success: false,
    message: err.message || 'Something went wrong!',
    errorSource,
    // error: err,
  });
};
