import { Router } from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import {
  courseFacultyValidationSchema,
  CourseValidationSchema,
} from './course.validation';
import { CourseControllers } from './course.controller';
import { auth } from '../../middlewares/authRequest';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

router.post(
  '/create-course',
  auth(USER_ROLE.admin),
  validateRequest(CourseValidationSchema),
  CourseControllers.createCourse,
);

router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
  CourseControllers.getAllCourses,
);

router.get(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
  CourseControllers.getACourse,
);

router.patch('/:id', auth(USER_ROLE.admin), CourseControllers.updateCourse);

router.put(
  '/:courseId/assign-faculties',
  auth(USER_ROLE.admin),
  validateRequest(courseFacultyValidationSchema),
  CourseControllers.assignFacultiesToCourse,
);

router.delete(
  '/:courseId/remove-faculties',
  auth(USER_ROLE.admin),
  validateRequest(courseFacultyValidationSchema),
  CourseControllers.removeFacultiesFromCourse,
);

router.delete('/:id', auth(USER_ROLE.admin), CourseControllers.deleteCourse);

export const CourseRoutes = router;
