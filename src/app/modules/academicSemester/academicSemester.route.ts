import { Router } from 'express';
import { AcademicSemesterControllers } from './academicSemester.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { createAcademicSemesterValidation } from './academicSemester.validation';

const router = Router();

router.post(
  '/create-academic-semester',
  validateRequest(createAcademicSemesterValidation),
  AcademicSemesterControllers.createAcademicSemester,
);

router.get('/', AcademicSemesterControllers.getAllAcademicSemester);

router.get('/:id', AcademicSemesterControllers.getAnAcademicSemester);

export const AcademicSemesterRoutes = router;
