import { Router } from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import { LoginUserControllers } from './auth.controller';
import { auth } from '../../middlewares/authRequest';
import { USER_ROLE } from '../user/user.constant';
import { AuthValidationSchemas } from './auth.validation';

const router = Router();

router.post(
  '/login',
  validateRequest(AuthValidationSchemas.loginUserValidationSchema),
  LoginUserControllers.loginUser,
);

router.post(
  '/change-password',
  auth(
    USER_ROLE.admin,
    USER_ROLE.superAdmin,
    USER_ROLE.faculty,
    USER_ROLE.student,
  ),
  validateRequest(AuthValidationSchemas.changePasswordValidationSchema),
  LoginUserControllers.changePassword,
);

router.post(
  '/refresh-token',
  validateRequest(AuthValidationSchemas.refreshTokenValidationSchema),
  LoginUserControllers.createNewAccessTokenByRefreshToken,
);

router.post(
  '/forget-password',
  validateRequest(AuthValidationSchemas.forgetPasswordValidation),
  LoginUserControllers.forgetPassword,
);

router.post(
  '/reset-password',
  validateRequest(AuthValidationSchemas.resetPasswordValidation),
  LoginUserControllers.resetPassword,
);

export const LoginUserRoutes = router;
