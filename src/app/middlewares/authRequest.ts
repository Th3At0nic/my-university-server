import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRole } from '../modules/user/user.interface';
import { UserModel } from '../modules/user/user.model';
import { NotFoundError } from '../errors/NotFoundError';
import { ConflictError } from '../errors/ConflictError';

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

    // check if the token is valid
    // invalid token
    //--i can avoid using try-catch block here as my instructor did it, but i did it to define the error msg
    //structure , otherwise it would only show "signature invalid" message and no path
    try {
      const decoded = jwt.verify(token, config.jwt_access_secret as string);

      // decoded undefined
      const { userId, role, iat } = decoded as JwtPayload;

      if (requiredRoles && !requiredRoles.includes(role)) {
        throw new UnauthorizedError('Access Denied', [
          {
            path: 'authorization',
            message:
              'You are not authorized to perform this action. This resource is restricted to users with specific roles. If you believe this is an error, please contact the administrator.',
          },
        ]);
      }

      const user = await UserModel.isUserExists(userId);

      if (!user) {
        throw new NotFoundError('User Not Found!', [
          {
            path: 'id',
            message: `The ${role} with the provided ID: ${userId} not found in the system. Please recheck the ID and try again`,
          },
        ]);
      }

      const isUserDeleted = user?.isDeleted;
      if (isUserDeleted) {
        throw new NotFoundError('User Not Found!', [
          {
            path: 'id',
            message: `The ${role} with the provided ID: ${userId} not found in the system. Please recheck the ID and try again`,
          },
        ]);
      }

      const isUserBlocked = user?.status;
      if (isUserBlocked === 'blocked') {
        throw new ConflictError('User is Blocked', [
          {
            path: 'status',
            message: `The ${role} with the provided ID: ${userId} is currently blocked. Access is restricted until the block is lifted.`,
          },
        ]);
      }

      if (
        user.passwordChangedAt &&
        UserModel.isJWTIssuedBeforePassChanged(
          user.passwordChangedAt,
          iat as number,
        )
      ) {
        throw new UnauthorizedError('Password Changed', [
          {
            path: 'authorization',
            message:
              'Your password has been changed recently. Please log in again with correct password to get a new token.',
          },
        ]);
      }

      req.user = decoded as JwtPayload;
      next();
    } catch (err) {
      //--i can avoid using try-catch block here as my instructor did it, but i did it to define the error msg
      //structure , otherwise it would only show "signature invalid" message and no path
      if (
        err instanceof jwt.JsonWebTokenError ||
        err instanceof jwt.TokenExpiredError
      ) {
        throw new UnauthorizedError('Authorization Error', [
          {
            path: 'authorization',
            message:
              'Your session has expired or the token is invalid. Please login again to continue.',
          },
        ]);
      }
      // If another error occurs, pass it to the next middleware
      next(err);
    }
  });
};
