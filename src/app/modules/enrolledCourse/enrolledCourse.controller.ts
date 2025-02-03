/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { JwtPayload } from 'jsonwebtoken';
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

const updateEnrolledCourseMarks = catchAsync(async (req, res, next) => {
  const facultyId = req?.user?.userId;
  const result = await EnrolledCourseServices.updateCourseMarksIntoDB(
    facultyId,
    req.body,
  );
  const message = 'Updated the Enrolled Course Marks successfully';
  sendResponse(res, 200, true, message, result);
});

const getAllEnrolledCourse = catchAsync(async (req, res, next) => {
  const result = await EnrolledCourseServices.getAllEnrolledCourseFromDB(
    req.query,
  );
  const message = 'Retrieved all enrolled course successfully';
  sendResponse(res, 200, true, message, result.result, result.meta);
});

const getMyEnrolledCourses = catchAsync(async (req, res, next) => {
  const { userId } = req.user as JwtPayload;

  const result = await EnrolledCourseServices.getMyEnrolledCoursesFromDB(
    userId,
    req.query,
  );
  const message = 'Retrieved Your all enrolled course successfully';
  sendResponse(res, 200, true, message, result.result, result.meta);
});

export const EnrolledCourseControllers = {
  createEnrolledCourse,
  updateEnrolledCourseMarks,
  getAllEnrolledCourse,
  getMyEnrolledCourses,
};
