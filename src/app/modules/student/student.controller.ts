/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { studentService } from './student.service';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';

//imported HOF(catchAsync()) to pass the async func there to handle the promise and error, reduced boilerplates
const getAllStudents = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await studentService.getAllStudentsFromDB(req.query);

    const message = 'Successfully retrieved students!';

    sendResponse(res, 200, true, message, result.result, result.meta);
  },
);

const getSingleStudent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await studentService.getSingleStudentFromDB(id);

    const message = 'Successfully retrieved the student!';
    sendResponse(res, 200, true, message, result);
  },
);

const deleteStudent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await studentService.deleteStudentFromDB(id);

    const message = 'Deleted the student successfully.';

    if (result) {
      sendResponse(res, 200, true, message, null);
    }
  },
);

const updateStudent = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { student: updatedData } = req.body;

  const result = await studentService.updateStudentIntoDB(id, updatedData);

  const message = 'Updated the student successfully!';

  sendResponse(res, 200, true, message, result);
});

export const studentController = {
  getAllStudents,
  getSingleStudent,
  deleteStudent,
  updateStudent,
};
