import { Router } from 'express';
import { AcademicSemesterControllers } from './academicSemester.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import {
  createAcademicSemesterValidation,
  updateAcademicSemesterValidation,
} from './academicSemester.validation';
import { auth } from '../../middlewares/authRequest';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

router.post(
  '/create-academic-semester',
  auth(USER_ROLE.admin),
  validateRequest(createAcademicSemesterValidation),
  AcademicSemesterControllers.createAcademicSemester,
);

router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
  AcademicSemesterControllers.getAllAcademicSemester,
);

router.get(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
  AcademicSemesterControllers.getAnAcademicSemester,
);

router.patch(
  '/:id',
  auth(USER_ROLE.admin),
  validateRequest(updateAcademicSemesterValidation),
  AcademicSemesterControllers.updateAnAcademicSemester,
);

export const AcademicSemesterRoutes = router;
