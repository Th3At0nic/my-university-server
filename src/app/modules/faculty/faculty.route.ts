import { Router } from 'express';
import { FacultyControllers } from './faculty.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { updateFacultyValidationSchema } from './faculty.validation';
import { auth } from '../../middlewares/authRequest';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
  FacultyControllers.getAllFaculties,
);

router.get(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
  FacultyControllers.getAFaculty,
);

router.patch(
  '/:id',
  auth(USER_ROLE.admin),
  validateRequest(updateFacultyValidationSchema),
  FacultyControllers.updateFaculty,
);

router.delete('/:id', auth(USER_ROLE.admin), FacultyControllers.deleteFaculty);

export const FacultyRoutes = router;
