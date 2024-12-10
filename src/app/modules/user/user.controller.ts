import { userServices } from './user.service';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
// import studentValidationSchema from '../student/student.validation';

//imported HOF(catchAsync()) to pass the async func there to handle the promise and error, reduced boilerplates
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
const createStudent = catchAsync(async (req, res, next) => {
  const { password, student: studentData } = req.body;

  const result = await userServices.createStudentIntoDB(password, studentData);

  const message = 'Successfully created the student!';

  sendResponse(res, message, result);
});

export const userControllers = {
  createStudent,
};
