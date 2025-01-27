/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { userServices } from './user.service';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import { UnauthorizedError } from '../../errors/UnauthorizedError';
import { JwtPayload } from 'jsonwebtoken';
// import studentValidationSchema from '../student/student.validation';

//imported HOF(catchAsync()) to pass the async func there to handle the promise and error, reduced boilerplates

const createStudent = catchAsync(async (req, res, next) => {
  const { password, student: studentData } = req.body;

  console.log('ekhane req file: ', req.file);
  console.log('ekhane json data: ', req.body);

  // const result = await userServices.createStudentIntoDB(password, studentData);

  const message = 'Successfully created the student!';

  sendResponse(res, 200, true, message, null);
});

const createFaculty = catchAsync(async (req, res, next) => {
  const { password, faculty: facultyData } = req.body;

  const result = await userServices.createFacultyIntoDB(password, facultyData);

  const message = 'Successfully created the faculty!';
  sendResponse(res, 200, true, message, result);
});

const createAdmin = catchAsync(async (req, res, next) => {
  const { password, admin: adminData } = req.body;

  const result = await userServices.createAdminIntoDB(password, adminData);

  const message = 'Successfully created the admin!';
  sendResponse(res, 200, true, message, result);
});

const getMyData = catchAsync(async (req, res, next) => {
  const { userId, role } = req.user as JwtPayload;

  const result = await userServices.getMyDataFromDB(userId, role);
  const message = 'Successfully Retrieved the data';
  sendResponse(res, 200, true, message, result);
});

const changeUserStatus = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const result = await userServices.changeUserStatusIntoDB(id, req.body);
  const message = `User is ${req.body.status}`;
  sendResponse(res, 200, true, message, result);
});

export const userControllers = {
  createStudent,
  createFaculty,
  createAdmin,
  getMyData,
  changeUserStatus,
};
