import { Router } from 'express';
import { FacultyControllers } from './faculty.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { updateFacultyValidationSchema } from './faculty.validation';

const router = Router();

router.get('/', FacultyControllers.getAllFaculties);

router.get('/:id', FacultyControllers.getAFaculty);

router.patch(
  '/:id',
  validateRequest(updateFacultyValidationSchema),
  FacultyControllers.updateFaculty,
);

router.delete('/:id', FacultyControllers.deleteFaculty);

export const FacultyRoutes = router;
