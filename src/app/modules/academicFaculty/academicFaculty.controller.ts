/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AcademicFacultyServices } from './academicFaculty.service';

const createAcademicFaculty = catchAsync(async (req, res, next) => {
  const data = req.body;
  const message = 'Successfully created Academic Faculty!';
  const result =
    await AcademicFacultyServices.createAcademicFacultyIntoDB(data);

  sendResponse(res, message, result);
});

export const AcademicFacultyControllers = {
  createAcademicFaculty,
};
