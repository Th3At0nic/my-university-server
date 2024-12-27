import express from 'express';
import { userControllers } from './user.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { studentValidationSchema } from '../student/student.validation';
import { FacultyValidationSchema } from '../faculty/faculty.validation';

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

export const userRoute = router;
