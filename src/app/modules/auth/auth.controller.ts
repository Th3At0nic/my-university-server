/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { LoginUserServices } from './auth.service';

const loginUser = catchAsync(async (req, res, next) => {
  const result = await LoginUserServices.loginUserAuth(req.body);
  const message = 'Successfully logged in';
  sendResponse(res, 200, true, message, result);
});

const changePassword = catchAsync(async (req, res, next) => {
  const user = req.user?.data;
  const { ...passwordData } = req.body;

  const result = await LoginUserServices.changePassword(user, passwordData);
  const message = 'Successfully Updated the Password';
  sendResponse(res, 200, true, message, result);
});

export const LoginUserControllers = {
  loginUser,
  changePassword,
};
