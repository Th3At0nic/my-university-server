/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AcademicSemesterServices } from './academicSemester.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TAcademicSemester } from './academicSemester.interface';

//creating an academic semester into the DB
const createAcademicSemester = catchAsync(async (req, res, next) => {
  const semesterData: TAcademicSemester = req.body;

  const result =
    await AcademicSemesterServices.createAcademicSemesterIntoDB(semesterData);

  const message = 'Successfully created semester!';

  sendResponse(res, message, result);
});

//retrieving all academic semesters from the DB
const getAllAcademicSemester = catchAsync(async (req, res, next) => {
  const result = await AcademicSemesterServices.getAllAcademicSemestersFromDB();

  const message = 'All Academic semesters are retrieved successfully!';

  sendResponse(res, message, result);
});

//retrieving a single academic semester with id from the DB
const getAnAcademicSemester = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const result = await AcademicSemesterServices.getAnAcademicSemesterFromDB(id);
  const message = 'The semester retrieved successfully!';

  sendResponse(res, message, result);
});

export const AcademicSemesterControllers = {
  createAcademicSemester,
  getAllAcademicSemester,
  getAnAcademicSemester,
};
