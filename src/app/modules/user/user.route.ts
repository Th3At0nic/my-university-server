import express from 'express';
import { userControllers } from './user.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { studentValidationSchema } from '../student/student.validation';
import { FacultyValidationSchema } from '../faculty/faculty.validation';
import { AdminValidationSchema } from '../admin/admin.validation';

const router = express.Router();

router.post(
  '/create-student',
  validateRequest(studentValidationSchema),
  userControllers.createStudent,
);

router.post(
  '/create-faculty',
  validateRequest(FacultyValidationSchema),
  userControllers.createFaculty,
);

router.post(
  '/create-admin',
  validateRequest(AdminValidationSchema),
  userControllers.createAdmin,
);

export const userRoute = router;
