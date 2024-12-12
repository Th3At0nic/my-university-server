import { AcademicSemesterServices } from './academicSemester.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TAcademicSemester } from './academicSemester.interface';

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
const createAcademicSemester = catchAsync(async (req, res, next) => {
  const semesterData: TAcademicSemester = req.body;

  const result =
    await AcademicSemesterServices.createAcademicSemesterIntoDB(semesterData);

  const message = 'Successfully created semester!';

  sendResponse(res, message, result);
});

export const AcademicSemesterControllers = {
  createAcademicSemester,
};
