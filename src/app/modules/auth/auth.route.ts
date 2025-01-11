import { Router } from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import { loginUserValidationSchema } from './auth.validation';
import { LoginUserControllers } from './auth.controller';

const router = Router();

router.post(
  '/login',
  validateRequest(loginUserValidationSchema),
  LoginUserControllers.loginUser,
);

export const LoginUserRoutes = router;
