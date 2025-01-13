import { Router } from 'express';
import { AcademicFacultyControllers } from './academicFaculty.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { AcademicFacultyValidation } from './academicFaculty.validation';
import { auth } from '../../middlewares/auth';

const router = Router();

router.post(
  '/create-academic-faculty',
  validateRequest(AcademicFacultyValidation),
  AcademicFacultyControllers.createAcademicFaculty,
);

router.get('/', auth(), AcademicFacultyControllers.getAllAcademicFaculty);

router.get('/:id', AcademicFacultyControllers.getAnAcademicFaculty);

router.patch(
  '/:id',
  validateRequest(AcademicFacultyValidation),
  AcademicFacultyControllers.updateAnAcademicFaculty,
);

export const AcademicFacultyRoute = router;
