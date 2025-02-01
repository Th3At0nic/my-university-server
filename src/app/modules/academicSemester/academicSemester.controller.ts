/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AcademicSemesterServices } from './academicSemester.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TAcademicSemester } from './academicSemester.interface';

//req handling creating an academic semester into the DB
const createAcademicSemester = catchAsync(async (req, res, next) => {
  const semesterData: TAcademicSemester = req.body;

  const result =
    await AcademicSemesterServices.createAcademicSemesterIntoDB(semesterData);

  const message = 'Successfully created semester!';

  sendResponse(res, 200, true, message, result);
});

//req handling to retrieve all academic semesters from the DB
const getAllAcademicSemester = catchAsync(async (req, res, next) => {
  const result = await AcademicSemesterServices.getAllAcademicSemestersFromDB(
    req.query,
  );

  const message = 'All Academic semesters are retrieved successfully!';

  sendResponse(res, 200, true, message, result);
});

//req handling for retrieving a single academic semester with id from the DB
const getAnAcademicSemester = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const result = await AcademicSemesterServices.getAnAcademicSemesterFromDB(id);

  const message = 'The semester retrieved successfully!';

  sendResponse(res, 200, true, message, result);
});

//req handling for updating an academic semester into db
const updateAnAcademicSemester = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updatedData = req.body;

  const result = await AcademicSemesterServices.updateAnAcademicSemesterIntoDB(
    id,
    updatedData,
  );

  const message = 'Successfully updated the semester!';

  sendResponse(res, 200, true, message, result);
});

export const AcademicSemesterControllers = {
  createAcademicSemester,
  getAllAcademicSemester,
  getAnAcademicSemester,
  updateAnAcademicSemester,
};
