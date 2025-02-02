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
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(SemesterRegistrationValidationSchema),
  SemesterRegistrationControllers.createSemesterRegistration,
);
router.get(
  '/',
  auth(
    USER_ROLE.admin,
    USER_ROLE.superAdmin,
    USER_ROLE.faculty,
    USER_ROLE.student,
  ),
  SemesterRegistrationControllers.getAllRegisteredSemesters,
);

router.get(
  '/:id',
  auth(
    USER_ROLE.admin,
    USER_ROLE.superAdmin,
    USER_ROLE.faculty,
    USER_ROLE.student,
  ),
  SemesterRegistrationControllers.getARegisteredSemester,
);

router.patch(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(UpdateSemesterRegistrationValidationSchema),
  SemesterRegistrationControllers.updateRegisteredSemester,
);

router.delete(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  SemesterRegistrationControllers.deleteRegisteredSemester,
);

export const SemesterRegistrationRoutes = router;
