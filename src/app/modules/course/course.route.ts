import { Router } from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import { CourseValidationSchema } from './course.validation';
import { CourseControllers } from './course.controller';

const router = Router();

router.post(
  '/create-course',
  validateRequest(CourseValidationSchema),
  CourseControllers.createCourse,
);

router.get('/', CourseControllers.getAllCourses);

router.get('/:id', CourseControllers.getACourse);

router.delete('/:id', CourseControllers.deleteCourse);

export const CourseRoutes = router;
