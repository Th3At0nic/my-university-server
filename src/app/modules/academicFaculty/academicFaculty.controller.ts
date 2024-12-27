/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AcademicFacultyServices } from './academicFaculty.service';

const createAcademicFaculty = catchAsync(async (req, res, next) => {
  const data = req.body;
  const result =
    await AcademicFacultyServices.createAcademicFacultyIntoDB(data);

  const message = 'Successfully created Academic Faculty!';
  sendResponse(res, 200, true, message, result);
});

const getAllAcademicFaculty = catchAsync(async (req, res, next) => {
  const result = await AcademicFacultyServices.getAllAcademicFacultyFromDB(
    req.query,
  );
  const message = 'Retrieved all Academic Faculty Successfully!';

  sendResponse(res, 200, true, message, result);
});

const getAnAcademicFaculty = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const result = await AcademicFacultyServices.getAnAcademicFacultyFromDB(id);
  const message = `Successfully retrieved the Academic Faculty with id: ${id}`;
  sendResponse(res, 200, true, message, result);
});

const updateAnAcademicFaculty = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updatedData = req.body;
  const result = await AcademicFacultyServices.updateAcademicFacultyIntoDB(
    id,
    updatedData,
  );
  const message = `Successfully Updated the Academic Faculty with id: ${id}`;
  sendResponse(res, 200, true, message, result);
});

export const AcademicFacultyControllers = {
  createAcademicFaculty,
  getAllAcademicFaculty,
  getAnAcademicFaculty,
  updateAnAcademicFaculty,
};
