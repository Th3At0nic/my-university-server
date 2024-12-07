import { NextFunction, Request, Response } from 'express';
import { studentService } from './student.service';
import sendResponse from '../../utils/sendResponse';

const getAllStudents = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await studentService.getAllStudentsFromDB();

    const message = 'Successfully retrieved students!';

    sendResponse(res, message, result);
    // res.status(200).json({
    //   success: true,
    //   message: 'Students is retrieved successfully!',
    //   data: result,
    // });
  } catch (err) {
    next(err);
  }
};

const getSingleStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const result = await studentService.getSingleStudentFromDB(id);

    const message = 'Successfully retrieved the student!';
    sendResponse(res, message, result);
  } catch (err) {
    next(err);
  }
};

const deleteStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const result = await studentService.deleteStudentFromDB(id);
    res.status(200).json({
      success: true,
      message: '204 No Content, Deleted Successfully.',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const studentController = {
  getAllStudents,
  getSingleStudent,
  deleteStudent,
};
