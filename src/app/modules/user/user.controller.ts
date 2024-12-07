import { NextFunction, Request, Response } from 'express';
import { userServices } from './user.service';
import sendResponse from '../../utils/sendResponse';

// import studentValidationSchema from '../student/student.validation';

const createStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { password, student: studentData } = req.body;

    // const zodParsedData = studentValidationSchema.parse(studentData);

    const result = await userServices.createStudentIntoDB(
      password,
      studentData,
    );

    const message = 'Successfully created the student!';

    sendResponse(res, message, result);
    // res.status(200).json({
    //   success: true,
    //   message: 'Student is created successfully!',
    //   data: result,
    // });
  } catch (err) {
    next(err);
  }
};

export const userControllers = {
  createStudent,
};
