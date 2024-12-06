import { Request, Response } from 'express';
// import studentValidationSchema from '../student/student.validation';
import { userServices } from './user.service';

const createStudent = async (req: Request, res: Response) => {
  try {
    const { password, student: studentData } = req.body;

    // const zodParsedData = studentValidationSchema.parse(studentData);

    const result = await userServices.createStudentIntoDB(
      password,
      studentData,
    );
    res.status(200).json({
      success: true,
      message: 'Student is created successfully!',
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: (err as Error).message || 'Something went wrong!',
      error: err,
    });
    console.log(err);
  }
};

export const userControllers = {
  createStudent,
};
