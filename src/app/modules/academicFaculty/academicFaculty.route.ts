import { Router } from 'express';
import { AcademicFacultyControllers } from './academicFaculty.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { AcademicFacultyValidation } from './academicFaculty.validation';
import { auth } from '../../middlewares/authRequest';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

router.post(
  '/create-academic-faculty',
  auth(USER_ROLE.admin),
  validateRequest(AcademicFacultyValidation),
  AcademicFacultyControllers.createAcademicFaculty,
);

router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
  AcademicFacultyControllers.getAllAcademicFaculty,
);

router.get(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
  AcademicFacultyControllers.getAnAcademicFaculty,
);

router.patch(
  '/:id',
  auth(USER_ROLE.admin),
  validateRequest(AcademicFacultyValidation),
  AcademicFacultyControllers.updateAnAcademicFaculty,
);

export const AcademicFacultyRoute = router;
