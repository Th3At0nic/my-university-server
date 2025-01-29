/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import { JwtPayload } from 'jsonwebtoken';
import { userServices } from './user.service';
// import studentValidationSchema from '../student/student.validation';

//imported HOF(catchAsync()) to pass the async func there to handle the promise and error, reduced boilerplates

const createStudent = catchAsync(async (req, res, next) => {
  const { password, student: studentData } = req.body;
  const result = await userServices.createStudentIntoDB(
    req.file,
    password,
    studentData,
  );
  const message = 'Successfully created the student!';
  sendResponse(res, 200, true, message, result);
});

const createFaculty = catchAsync(async (req, res, next) => {
  const { password, faculty: facultyData } = req.body;

  const result = await userServices.createFacultyIntoDB(
    req.file,
    password,
    facultyData,
  );

  const message = 'Successfully created the faculty!';
  sendResponse(res, 200, true, message, result);
});

const createAdmin = catchAsync(async (req, res, next) => {
  const { password, admin: adminData } = req.body;

  const result = await userServices.createAdminIntoDB(
    req.file,
    password,
    adminData,
  );

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
