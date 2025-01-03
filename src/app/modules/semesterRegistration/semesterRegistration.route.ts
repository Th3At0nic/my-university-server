import { Router } from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import { SemesterRegistrationValidationSchema } from './semesterRegistration.validation';
import { SemesterRegistrationControllers } from './semesterRegistration.controller';

const router = Router();

router.post(
  '/create-semester-registration',
  validateRequest(SemesterRegistrationValidationSchema),
  SemesterRegistrationControllers.createSemesterRegistration,
);

export const SemesterRegistrationRoutes = router;
