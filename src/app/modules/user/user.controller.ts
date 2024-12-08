import { userServices } from './user.service';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
// import studentValidationSchema from '../student/student.validation';

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
const createStudent = catchAsync(async (req, res, next) => {
  //passing the async func to the catchAsync func to handle promise or error
  const { password, student: studentData } = req.body;

  // const zodParsedData = studentValidationSchema.parse(studentData);

  const result = await userServices.createStudentIntoDB(password, studentData);

  const message = 'Successfully created the student!';

  sendResponse(res, message, result);
  //passes these thing into sendResponse function in another file and reduce boilerplates
  // res.status(200).json({
  //   success: true,
  //   message: 'Student is created successfully!',
  //   data: result,
  // });
});

export const userControllers = {
  createStudent,
};
