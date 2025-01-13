import { Router } from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import {
  OfferedCourseValidationSchema,
  updateOfferedCourseValidationSchema,
} from './offeredCourse.validation';
import { OfferedCourseControllers } from './offeredCourse.controller';
import { auth } from '../../middlewares/authRequest';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

router.post(
  '/create-offered-course',
  auth(USER_ROLE.admin),
  validateRequest(OfferedCourseValidationSchema),
  OfferedCourseControllers.createOfferedCourse,
);

router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
  OfferedCourseControllers.getAllOfferedCourse,
);

router.get(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
  OfferedCourseControllers.getAOfferedCourse,
);

router.patch(
  '/:id',
  auth(USER_ROLE.admin),
  validateRequest(updateOfferedCourseValidationSchema),
  OfferedCourseControllers.updateOfferedCourse,
);

router.delete(
  '/:id',
  auth(USER_ROLE.admin),
  OfferedCourseControllers.deleteOfferedCourse,
);

export const OfferedCourseRoutes = router;
