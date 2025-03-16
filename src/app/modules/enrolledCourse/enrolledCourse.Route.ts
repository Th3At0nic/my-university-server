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
  auth(USER_ROLE.faculty, USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(UpdateCourseMarksValidationSchema),
  EnrolledCourseControllers.updateEnrolledCourseMarks,
);

router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.faculty),
  EnrolledCourseControllers.getAllEnrolledCourse,
);

router.get(
  '/my-enrolled-courses',
  auth(USER_ROLE.student),
  EnrolledCourseControllers.getMyEnrolledCourses,
);

export const EnrolledCourseRoutes = router;
