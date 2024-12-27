/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { FacultyServices } from './faculty.service';

const getAllFaculties = catchAsync(async (req, res, next) => {
  const result = await FacultyServices.getAllFacultiesFromDB();
  const message = 'Retrieved all faculties successfully!';
  sendResponse(res, 200, true, message, result);
});

export const FacultyControllers = {
  getAllFaculties,
};
