/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { LoginUserServices } from './auth.service';

const loginUser = catchAsync(async (req, res, next) => {
  const result = await LoginUserServices.loginUserAuth(req.body);
  const message = 'Successfully logged in';
  sendResponse(res, 200, true, message, result);
});

export const LoginUserControllers = {
  loginUser,
};
