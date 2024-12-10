/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { studentService } from './student.service';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';

//imported HOF(catchAsync()) to pass the async func there to handle the promise and error, reduced boilerplates
const getAllStudents = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await studentService.getAllStudentsFromDB();

    const message = 'Successfully retrieved students!';

    sendResponse(res, message, result);
  },
);

const getSingleStudent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await studentService.getSingleStudentFromDB(id);

    const message = 'Successfully retrieved the student!';
    sendResponse(res, message, result);
  },
);

const deleteStudent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await studentService.deleteStudentFromDB(id);

    const message = 'Deleted the student successfully.';
    sendResponse(res, message, result);
  },
);

export const studentController = {
  getAllStudents,
  getSingleStudent,
  deleteStudent,
};
