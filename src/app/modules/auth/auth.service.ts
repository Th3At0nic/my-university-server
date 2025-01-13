import config from '../../config';
import { ConflictError } from '../../utils/errors/ConflictError';
import { NotFoundError } from '../../utils/errors/NotFoundError';
import { UnauthorizedError } from '../../utils/errors/UnauthorizedError';
import { UserModel } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import jwt from 'jsonwebtoken';

const loginUserAuth = async (payload: TLoginUser) => {
  const { id, password: userGivenPassword } = payload;

  const user = await UserModel.isUserExists(id);

  if (!user) {
    throw new NotFoundError('User Not Found!', [
      {
        path: 'id',
        message: `The User with the provided ID: ${id} not found in the system. Please recheck the ID and try again`,
      },
    ]);
  }

  const isUserDeleted = user?.isDeleted;
  if (isUserDeleted) {
    throw new NotFoundError('User Not Found!', [
      {
        path: 'id',
        message: `The User with the provided ID: ${id} not found in the system. Please recheck the ID and try again`,
      },
    ]);
  }

  const isUserBlocked = user?.status;
  if (isUserBlocked === 'blocked') {
    throw new ConflictError('User is Blocked', [
      {
        path: 'status',
        message: `The user with the provided ID: ${id} is currently blocked. Access is restricted until the block is lifted.`,
      },
    ]);
  }

  const isPasswordValid = await UserModel.isPasswordCorrect(
    userGivenPassword,
    user?.password,
  );

  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid Credentials', [
      {
        path: 'password',
        message: 'The provided password is incorrect. Please try again.',
      },
    ]);
  }

  const jwtPayload = {
    userID: user.id,
    role: user.role,
  };

  //create access token and send it to the client
  const accessToken = jwt.sign(
    {
      data: jwtPayload,
    },
    config.jwt_access_secret as string,
    { expiresIn: '10d' },
  );

  return {
    accessToken,
    needPasswordChange: user.needsPasswordChange,
  };
};

export const LoginUserServices = {
  loginUserAuth,
};
