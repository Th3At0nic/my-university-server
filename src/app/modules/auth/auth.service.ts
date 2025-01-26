import config from '../../config';
import { ConflictError } from '../../errors/ConflictError';
import { NotFoundError } from '../../errors/NotFoundError';
import { UnauthorizedError } from '../../errors/UnauthorizedError';
import { UserModel } from '../user/user.model';
import { TChangePassData, TLoginUser, TResetPassData } from './auth.interface';
import bcrypt from 'bcrypt';
import { generateToken } from './auth.utils';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { sendEmail } from '../../utils/sendMail';
import { InternalServerError } from '../../errors/InternalServerError';

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
    userId: user.id,
    role: user.role,
  };

  //create access token and send it to the client
  const accessToken = generateToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = generateToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: user.needsPasswordChange,
  };
};

const changePassword = async (
  userData: JwtPayload,
  payload: TChangePassData,
) => {
  // console.log(userData)
  const user = await UserModel.isUserExists(userData.userId);

  if (!user) {
    throw new NotFoundError('User Not Found!', [
      {
        path: 'id',
        message: `The User with the provided ID: ${userData.userId} not found in the system. Please recheck the ID and try again`,
      },
    ]);
  }

  const isUserDeleted = user?.isDeleted;
  if (isUserDeleted) {
    throw new NotFoundError('User Not Found!', [
      {
        path: 'id',
        message: `The User with the provided ID: ${userData.userId} not found in the system. Please recheck the ID and try again`,
      },
    ]);
  }

  const isUserBlocked = user?.status;
  if (isUserBlocked === 'blocked') {
    throw new ConflictError('User is Blocked', [
      {
        path: 'status',
        message: `The user with the provided ID: ${userData.userId} is currently blocked. Access is restricted until the block is lifted.`,
      },
    ]);
  }

  const isOldPasswordValid = await UserModel.isPasswordCorrect(
    payload.oldPassword,
    user?.password,
  );

  if (!isOldPasswordValid) {
    throw new UnauthorizedError('Invalid Credentials', [
      {
        path: 'password',
        message: 'The provided old password is incorrect. Please try again.',
      },
    ]);
  }

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_round_salt),
  );

  await UserModel.findOneAndUpdate(
    {
      id: userData.userId,
      role: userData.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
    { new: true },
  );

  return {};
};

const createNewAccessTokenByRefreshToken = async (token: string) => {
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
  const decoded = jwt.verify(token, config.jwt_refresh_secret as string);

  // decoded undefined
  const { userId, role, iat } = decoded as JwtPayload;

  // req.user = decoded as JwtPayload;

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

  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };

  //create access token and send it to the client
  const accessToken = generateToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return { accessToken };
};

const forgetPassword = async (userId: string) => {
  // console.log(userData)
  const user = await UserModel.isUserExists(userId);

  if (!user) {
    throw new NotFoundError('User Not Found!', [
      {
        path: 'id',
        message: `The User with the provided ID: ${userId} not found in the system. Please recheck the ID and try again`,
      },
    ]);
  }

  const isUserDeleted = user?.isDeleted;
  if (isUserDeleted) {
    throw new NotFoundError('User Not Found!', [
      {
        path: 'id',
        message: `The User with the provided ID: ${userId} not found in the system. Please recheck the ID and try again`,
      },
    ]);
  }

  const isUserBlocked = user?.status;
  if (isUserBlocked === 'blocked') {
    throw new ConflictError('User is Blocked', [
      {
        path: 'status',
        message: `The user with the provided ID: ${userId} is currently blocked. Access is restricted until the block is lifted.`,
      },
    ]);
  }

  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };

  //create access token and send it to the client
  const resetPasswordToken = generateToken(
    jwtPayload,
    config.jwt_access_secret as string,
    '10m',
  );

  const resetPasswordUILink = `${config.reset_pass_ui_link}?id=${userId}&token=${resetPasswordToken}`;

  sendEmail(user.email, resetPasswordUILink);

  return null;
};

const resetPassword = async (payload: TResetPassData, token: string) => {
  const userId = payload.id;

  const user = await UserModel.isUserExists(userId);

  if (!user) {
    throw new NotFoundError('User Not Found!', [
      {
        path: 'id',
        message: `The User with the provided ID: ${userId} not found in the system. Please recheck the ID and try again`,
      },
    ]);
  }

  const isUserDeleted = user?.isDeleted;
  if (isUserDeleted) {
    throw new NotFoundError('User Not Found!', [
      {
        path: 'id',
        message: `The User with the provided ID: ${userId} not found in the system. Please recheck the ID and try again`,
      },
    ]);
  }

  const isUserBlocked = user?.status;
  if (isUserBlocked === 'blocked') {
    throw new ConflictError('User is Blocked', [
      {
        path: 'status',
        message: `The user with the provided ID: ${userId} is currently blocked. Access is restricted until the block is lifted.`,
      },
    ]);
  }

  // check if the token is valid
  // invalid token
  const decoded = jwt.verify(token, config.jwt_access_secret as string);

  const decodedUserId = (decoded as JwtPayload)?.userId;
  const decodedUserRole = (decoded as JwtPayload)?.role;

  if (decodedUserId !== userId) {
    throw new UnauthorizedError('Unauthorized access', [
      {
        path: 'authorization',
        message: 'User ID does not match the token payload.',
      },
    ]);
  }

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_round_salt),
  );

  const resetResult = await UserModel.findOneAndUpdate(
    {
      id: decodedUserId,
      role: decodedUserRole,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
    { new: true },
  );

  if (!resetResult) {
    throw new InternalServerError('Password reset failed', [
      {
        path: 'resetPassword',
        message: 'An error occurred while resetting the password.',
      },
    ]);
  }

  return null;
};

export const LoginUserServices = {
  loginUserAuth,
  changePassword,
  createNewAccessTokenByRefreshToken,
  forgetPassword,
  resetPassword,
};
