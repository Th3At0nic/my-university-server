import { Router } from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import {
  SemesterRegistrationValidationSchema,
  UpdateSemesterRegistrationValidationSchema,
} from './semesterRegistration.validation';
import { SemesterRegistrationControllers } from './semesterRegistration.controller';
import { auth } from '../../middlewares/authRequest';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

router.post(
  '/create-semester-registration',
  auth(USER_ROLE.admin),
  validateRequest(SemesterRegistrationValidationSchema),
  SemesterRegistrationControllers.createSemesterRegistration,
);
router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
  SemesterRegistrationControllers.getAllRegisteredSemesters,
);

router.get(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
  SemesterRegistrationControllers.getARegisteredSemester,
);

router.patch(
  '/:id',
  auth(USER_ROLE.admin),
  validateRequest(UpdateSemesterRegistrationValidationSchema),
  SemesterRegistrationControllers.updateRegisteredSemester,
);

router.delete(
  '/:id',
  auth(USER_ROLE.admin),
  SemesterRegistrationControllers.deleteRegisteredSemester,
);

export const SemesterRegistrationRoutes = router;
