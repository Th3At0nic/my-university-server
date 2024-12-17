import { Router } from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import { AcademicDepartmentValidation } from './academicDepartment.validation';
import { AcademicDepartmentControllers } from './academicDepartment.controller';

const router = Router();

router.post(
  '/create-academic-department',
  validateRequest(AcademicDepartmentValidation),
  AcademicDepartmentControllers.createAcademicDepartment,
);

router.get('/', AcademicDepartmentControllers.getAllAcademicDepartment);

router.get('/:id', AcademicDepartmentControllers.getAnAcademicDepartment);

router.patch('/:id', AcademicDepartmentControllers.updateAcademicDepartment);

export const AcademicDepartmentRoutes = router;
