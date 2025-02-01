import { Router } from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import {
  AcademicDepartmentValidation,
  UpdateAcademicDepartmentValidation,
} from './academicDepartment.validation';
import { AcademicDepartmentControllers } from './academicDepartment.controller';
import { auth } from '../../middlewares/authRequest';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

router.post(
  '/create-academic-department',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(AcademicDepartmentValidation),
  AcademicDepartmentControllers.createAcademicDepartment,
);

router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
  AcademicDepartmentControllers.getAllAcademicDepartment,
);

router.get(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
  AcademicDepartmentControllers.getAnAcademicDepartment,
);

router.patch(
  '/:id',
  auth(USER_ROLE.admin),
  validateRequest(UpdateAcademicDepartmentValidation),
  AcademicDepartmentControllers.updateAcademicDepartment,
);

export const AcademicDepartmentRoutes = router;
