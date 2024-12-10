import express from 'express';
import { studentController } from './student.controller';

const router = express.Router();

router.get('/', studentController.getAllStudents);

router.get('/:id', studentController.getSingleStudent);

router.delete('/:id', studentController.deleteStudent);

export const studentRoute = router;
