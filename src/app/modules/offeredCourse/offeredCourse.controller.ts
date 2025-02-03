/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { OfferedCourseServices } from './offeredCourse.service';

const createOfferedCourse = catchAsync(async (req, res, next) => {
  const offeredCourse = req.body;
  const result =
    await OfferedCourseServices.createOfferedCourseIntoDB(offeredCourse);
  const message = 'Successfully Offered the Course';
  sendResponse(res, 200, true, message, result);
});

const getAllOfferedCourse = catchAsync(async (req, res, next) => {
  const result = await OfferedCourseServices.getAllOfferedCoursesFromDB(
    req.query,
  );
  const message = 'Successfully Retrieved all Offered Courses';
  sendResponse(res, 200, true, message, result.result, result.meta);
});

const getMyOfferedCourse = catchAsync(async (req, res, next) => {
  const { userId } = req.user as JwtPayload;
  const result = await OfferedCourseServices.getMyOfferedCoursesFromDB(
    userId,
    req.query,
  );
  const message = 'Successfully Retrieved My Offered Courses';
  sendResponse(res, 200, true, message, result.result, result.meta);
});

const getAnOfferedCourse = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const result = await OfferedCourseServices.getAnOfferedCourseFromDB(id);
  const message = 'Successfully Retrieved the Offered Course';
  sendResponse(res, 200, true, message, result);
});

const updateOfferedCourse = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updateData = req.body;
  const result = await OfferedCourseServices.updateOfferedCourseIntoDB(
    id,
    updateData,
  );
  const message = 'Successfully Updated the Offered Course';
  sendResponse(res, 200, true, message, result);
});

const deleteOfferedCourse = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const result = await OfferedCourseServices.deleteOfferedCourseFromDB(id);
  const message = 'Successfully Deleted the Offered Course';
  sendResponse(res, 200, true, message, result ? null : result);
});

export const OfferedCourseControllers = {
  createOfferedCourse,
  getAllOfferedCourse,
  getMyOfferedCourse,
  getAnOfferedCourse,
  updateOfferedCourse,
  deleteOfferedCourse,
};
