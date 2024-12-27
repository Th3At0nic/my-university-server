/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { userServices } from './user.service';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
// import studentValidationSchema from '../student/student.validation';

//imported HOF(catchAsync()) to pass the async func there to handle the promise and error, reduced boilerplates

const createStudent = catchAsync(async (req, res, next) => {
  const { password, student: studentData } = req.body;

  const result = await userServices.createStudentIntoDB(password, studentData);

  const message = 'Successfully created the student!';

  sendResponse(res, 200, true, message, result);
});

const createFaculty = catchAsync(async (req, res, next) => {
  const { password, faculty: facultyData } = req.body;

  const result = await userServices.createFacultyIntoDB(password, facultyData);

  const message = 'Successfully created the faculty!';
  sendResponse(res, 200, true, message, result);
});

export const userControllers = {
  createStudent,
  createFaculty,
};
