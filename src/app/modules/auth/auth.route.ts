import { Router } from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import {
  changePasswordValidationSchema,
  loginUserValidationSchema,
  refreshTokenValidationSchema,
} from './auth.validation';
import { LoginUserControllers } from './auth.controller';
import { auth } from '../../middlewares/authRequest';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

router.post(
  '/login',
  validateRequest(loginUserValidationSchema),
  LoginUserControllers.loginUser,
);

router.post(
  '/change-password',
  auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
  validateRequest(changePasswordValidationSchema),
  LoginUserControllers.changePassword,
);

router.post(
  '/refresh-token',
  validateRequest(refreshTokenValidationSchema),
  LoginUserControllers.createNewAccessTokenByRefreshToken,
);

export const LoginUserRoutes = router;