/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AcademicSemesterServices } from './academicSemester.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TAcademicSemester } from './academicSemester.interface';

const createAcademicSemester = catchAsync(async (req, res, next) => {
  const semesterData: TAcademicSemester = req.body;

  const result =
    await AcademicSemesterServices.createAcademicSemesterIntoDB(semesterData);

  const message = 'Successfully created semester!';

  sendResponse(res, message, result);
});

const getAllAcademicSemester = catchAsync(async (req, res, next) => {
  const result = await AcademicSemesterServices.getAllAcademicSemestersFromDB();

  const message = 'All Academic semesters are retrieved successfully!';

  sendResponse(res, message, result);
});

export const AcademicSemesterControllers = {
  createAcademicSemester,
  getAllAcademicSemester,
};
