import express from 'express';
import { studentController } from './student.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { updateStudentValidationSchema } from './student.validation';

const router = express.Router();

router.get('/', studentController.getAllStudents);

router.get('/:id', studentController.getSingleStudent);

router.delete('/:id', studentController.deleteStudent);

router.patch(
  '/:id',
  validateRequest(updateStudentValidationSchema),
  studentController.updateStudent,
);

export const studentRoute = router;
