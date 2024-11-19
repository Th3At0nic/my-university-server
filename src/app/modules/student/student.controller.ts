import { Request, Response } from 'express';
import { studentService } from './student.service';

const createStudent = async (req: Request, res: Response) => {
  try {
    console.log(req.body.student);
    const { student } = req.body;

    const result = await studentService.createStudentIntoDB(student);
    res.status(200).json({
      success: true,
      message: 'Student is created successfully!',
      data: result,
    });
  } catch (error) {
    console.log(error);
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
  } catch (error) {
    console.log(error);
  }
};

const getSingleStudent = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await studentService.getSingleStudentFromDB(id);
  res.status(200).json({
    success: true,
    message: `The student with id ${id} is found successfully!`,
    data: result,
  });
};

export const studentController = {
  createStudent,
  getAllStudents,
  getSingleStudent,
};
