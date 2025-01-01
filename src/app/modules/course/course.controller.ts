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

const updateCourse = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updateData = req.body;
  const result = await CourseServices.updateCourseIntoDB(id, updateData);
  const message = 'Successfully updated the course!';
  sendResponse(res, 200, true, message, result);
});

const deleteCourse = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const result = await CourseServices.deleteCourseFromDB(id);
  const message = 'Successfully deleted the course';
  sendResponse(res, 200, true, message, result ? null : result);
});

const assignFacultiesToCourse = catchAsync(async (req, res, next) => {
  const { courseId } = req.params;
  const { faculties } = req.body;
  const result = await CourseServices.assignFacultiesToCourseIntoDB(
    courseId,
    faculties,
  );
  const message = `Successfully assigned the faculties to the course with id: ${courseId}`;
  sendResponse(res, 200, true, message, result);
});

const removeFacultiesFromCourse = catchAsync(async (req, res, next) => {
  const { courseId } = req.params;
  const { faculties } = req.body;
  const result = await CourseServices.removeFacultiesFromCourseFromDB(
    courseId,
    faculties,
  );
  const message = `Successfully removed the faculties from the course with id: ${courseId}`;
  sendResponse(res, 200, true, message, result);
});

export const CourseControllers = {
  createCourse,
  getAllCourses,
  getACourse,
  updateCourse,
  deleteCourse,
  assignFacultiesToCourse,
  removeFacultiesFromCourse,
};
