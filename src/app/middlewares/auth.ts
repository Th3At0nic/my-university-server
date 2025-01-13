import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import { UnauthorizedError } from '../utils/errors/UnauthorizedError';

export const auth = () => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    console.log('ekhane token: ', token);

    if (!token) {
      throw new UnauthorizedError('Authorization token missing!', [
        {
          path: 'authorization',
          message: 'You must provide a valid token to access this resource.',
        },
      ]);
    }
    next();
  });
};
