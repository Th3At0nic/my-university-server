/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { SemesterRegistrationServices } from './semesterRegistration.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

const createSemesterRegistration = catchAsync(async (req, res, next) => {
  const result =
    await SemesterRegistrationServices.createSemesterRegistrationIntoDB(
      req.body,
    );
  const message = 'Successfully registered the semester';
  sendResponse(res, 200, true, message, result);
});

export const SemesterRegistrationControllers = {
  createSemesterRegistration,
};
