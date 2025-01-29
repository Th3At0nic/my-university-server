/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { EnrolledCourseServices } from './enrolledCourse.service';

const createEnrolledCourse = catchAsync(async (req, res, next) => {
  const userId = req?.user?.userId;
  const result = await EnrolledCourseServices.createEnrolledCourseIntoDB(
    userId,
    req.body,
  );
  const message = 'Enrolled to the course successfully';
  sendResponse(res, 200, true, message, result);
});

export const EnrolledCourseControllers = {
  createEnrolledCourse,
};
