/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { FacultyServices } from './faculty.service';

const getAllFaculties = catchAsync(async (req, res, next) => {
  const result = await FacultyServices.getAllFacultiesFromDB(req.query);
  const message = 'Retrieved all faculties successfully!';
  sendResponse(res, 200, true, message, result);
});

const getAFaculty = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const result = await FacultyServices.getAFacultyFromDB(id);
  const message = 'Retrieved the faculty successfully!';
  sendResponse(res, 200, true, message, result);
});

const updateFaculty = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updatedData = req.body;
  const result = await FacultyServices.updateFacultyIntoDB(id, updatedData);
  const message = 'Successfully updated the faculty';
  sendResponse(res, 200, true, message, result);
});

const deleteFaculty = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const result = await FacultyServices.deleteFacultyFromDB(id);
  const message = 'Deleted the faculty successfully!';
  sendResponse(res, 200, true, message, result ? null : result);
});

export const FacultyControllers = {
  getAllFaculties,
  getAFaculty,
  updateFaculty,
  deleteFaculty,
};
