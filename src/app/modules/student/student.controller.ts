import { Request, Response } from 'express';
import { studentService } from './student.service';
import studentValidationSchema from './student.validation';

const createStudent = async (req: Request, res: Response) => {
  try {
    console.log(req.body.student);
    const { student: studentData } = req.body;

    const zodParsedData = studentValidationSchema.parse(studentData);

    const result = await studentService.createStudentIntoDB(zodParsedData);
    res.status(200).json({
      success: true,
      message: 'Student is created successfully!',
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong!',
      error: err,
    });
    console.log(err);
  }
};

const getAllStudents = async (req: Request, res: Response) => {
  try {
    const result = await studentService.getAllStudentsFromDB();
    res.status(200).json({
      success: true,
      message: 'Students is retrieved successfully!',
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong!',
      error: err,
    });
    console.log(err);
  }
};

const getSingleStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await studentService.getSingleStudentFromDB(id);
    res.status(200).json({
      success: true,
      message: `The student with id ${id} is found successfully!`,
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong!',
      error: err,
    });
    console.log(err);
  }
};

export const studentController = {
  createStudent,
  getAllStudents,
  getSingleStudent,
};
