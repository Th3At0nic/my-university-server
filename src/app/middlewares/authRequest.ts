import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import { UnauthorizedError } from '../utils/errors/UnauthorizedError';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRole } from '../modules/user/user.interface';

export const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
      throw new UnauthorizedError('Authorization token missing!', [
        {
          path: 'authorization',
          message: 'Authorization is required to access this resource.',
        },
      ]);
    }

    //check if the token is valid
    // invalid token
    jwt.verify(
      token,
      config.jwt_access_secret as string,
      function (err, decoded) {
        if (err) {
          throw new UnauthorizedError('Authorization Error', [
            {
              path: 'authorization',
              message:
                'Your session has expired or the token is invalid. Please login again to continue.',
            },
          ]);
        }
        // decoded undefined
        const { data } = decoded as JwtPayload;
        req.user = decoded as JwtPayload;

        if (requiredRoles && !requiredRoles.includes(data?.role)) {
          throw new UnauthorizedError('Access Denied', [
            {
              path: 'authorization',
              message:
                'You are not authorized to perform this action. This resource is restricted to users with specific roles. If you believe this is an error, please contact the administrator.',
            },
          ]);
        }

        next();
      },
    );
  });
};
