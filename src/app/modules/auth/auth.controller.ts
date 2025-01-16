/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { LoginUserServices } from './auth.service';

const loginUser = catchAsync(async (req, res, next) => {
  const result = await LoginUserServices.loginUserAuth(req.body);
  const { accessToken, refreshToken, needPasswordChange } = result;

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    secure: process.env.NODE_ENV === 'production', // Ensures the cookie is sent only over HTTPS in production
    sameSite: 'strict', // Prevents CSRF attacks
    maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
  });

  const message = 'Successfully logged in';
  sendResponse(res, 200, true, message, { accessToken, needPasswordChange });
});

const changePassword = catchAsync(async (req, res, next) => {
  const user = req.user as JwtPayload;
  const { ...passwordData } = req.body;

  const result = await LoginUserServices.changePassword(user, passwordData);
  const message = 'Successfully Updated the Password';
  sendResponse(res, 200, true, message, result);
});

const createNewAccessTokenByRefreshToken = catchAsync(
  async (req, res, next) => {
    const { refreshToken } = req.cookies;

    const result =
      await LoginUserServices.createNewAccessTokenByRefreshToken(refreshToken);
    const message = 'Access Token retrieved successfully';
    sendResponse(res, 200, true, message, result);
  },
);

export const LoginUserControllers = {
  loginUser,
  changePassword,
  createNewAccessTokenByRefreshToken,
};
