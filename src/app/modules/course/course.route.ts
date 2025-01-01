import { Router } from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import {
  courseFacultyValidationSchema,
  CourseValidationSchema,
} from './course.validation';
import { CourseControllers } from './course.controller';

const router = Router();

router.post(
  '/create-course',
  validateRequest(CourseValidationSchema),
  CourseControllers.createCourse,
);

router.get('/', CourseControllers.getAllCourses);

router.get('/:id', CourseControllers.getACourse);

router.patch('/:id', CourseControllers.updateCourse);

router.put(
  '/:courseId/assign-faculties',
  validateRequest(courseFacultyValidationSchema),
  CourseControllers.assignFacultiesToCourse,
);

router.delete(
  '/:courseId/remove-faculties',
  validateRequest(courseFacultyValidationSchema),
  CourseControllers.removeFacultiesFromCourse,
);

router.delete('/:id', CourseControllers.deleteCourse);

export const CourseRoutes = router;
