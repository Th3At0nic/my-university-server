import { Router } from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import {
  CreateEnrolledCourseValidationSchema,
  UpdateCourseMarksValidationSchema,
} from './enrolledCourse.validation';
import { EnrolledCourseControllers } from './enrolledCourse.controller';
import { auth } from '../../middlewares/authRequest';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

router.post(
  '/create-enrolled-course',
  auth(USER_ROLE.student),
  validateRequest(CreateEnrolledCourseValidationSchema),
  EnrolledCourseControllers.createEnrolledCourse,
);

router.patch(
  '/update-enrolled-course-marks',
  auth(USER_ROLE.faculty),
  validateRequest(UpdateCourseMarksValidationSchema),
  EnrolledCourseControllers.updateEnrolledCourseMarks,
);

router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  EnrolledCourseControllers.getAllEnrolledCourse,
);

export const EnrolledCourseRoutes = router;
