import { Router } from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import { CreateEnrolledCourseValidationSchema } from './enrolledCourse.validation';
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

export const EnrolledCourseRoutes = router;
