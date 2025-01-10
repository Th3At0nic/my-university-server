import { Router } from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import {
  OfferedCourseValidationSchema,
  updateOfferedCourseValidationSchema,
} from './offeredCourse.validation';
import { OfferedCourseControllers } from './offeredCourse.controller';

const router = Router();

router.post(
  '/create-offered-course',
  validateRequest(OfferedCourseValidationSchema),
  OfferedCourseControllers.createOfferedCourse,
);

router.get('/', OfferedCourseControllers.getAllOfferedCourse);

router.get('/:id', OfferedCourseControllers.getAOfferedCourse);

router.patch(
  '/:id',
  validateRequest(updateOfferedCourseValidationSchema),
  OfferedCourseControllers.updateOfferedCourse,
);

router.delete('/:id', OfferedCourseControllers.deleteOfferedCourse);

export const OfferedCourseRoutes = router;
