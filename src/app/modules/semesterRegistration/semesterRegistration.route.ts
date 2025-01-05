import { Router } from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import {
  SemesterRegistrationValidationSchema,
  UpdateSemesterRegistrationValidationSchema,
} from './semesterRegistration.validation';
import { SemesterRegistrationControllers } from './semesterRegistration.controller';

const router = Router();

router.post(
  '/create-semester-registration',
  validateRequest(SemesterRegistrationValidationSchema),
  SemesterRegistrationControllers.createSemesterRegistration,
);
router.get('/', SemesterRegistrationControllers.getAllRegisteredSemesters);

router.get('/:id', SemesterRegistrationControllers.getARegisteredSemester);

router.patch(
  '/:id',
  validateRequest(UpdateSemesterRegistrationValidationSchema),
  SemesterRegistrationControllers.updateRegisteredSemester,
);

export const SemesterRegistrationRoutes = router;
