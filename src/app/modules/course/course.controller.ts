/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TCourse } from './course.interface';
import { CourseServices } from './course.service';

const createCourse = catchAsync(async (req, res, next) => {
  const courseData: TCourse = req.body;
  const result = await CourseServices.createCourseIntoDB(courseData);
  const message = 'Successfully created the course!';
  sendResponse(res, 200, true, message, result);
});

const getAllCourses = catchAsync(async (req, res, next) => {
  const result = await CourseServices.getAllCoursesFromDB(req.query);
  const message = 'Successfully retrieved the course!';
  sendResponse(res, 200, true, message, result);
});

const getACourse = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const result = await CourseServices.getACourseFromDB(id);
  const message = 'Successfully retrieved the course!';
  sendResponse(res, 200, true, message, result);
});

const deleteCourse = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const result = await CourseServices.deleteCourseFromDB(id);
  const message = 'Successfully deleted the course';
  sendResponse(res, 200, true, message, result ? null : result);
});

export const CourseControllers = {
  createCourse,
  getAllCourses,
  getACourse,
  deleteCourse,
};
