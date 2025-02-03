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

const getAllRegisteredSemesters = catchAsync(async (req, res, next) => {
  const result =
    await SemesterRegistrationServices.getAllRegisteredSemestersFromDB(
      req.query,
    );
  const message = 'Retrieved all registered semesters successfully!';
  sendResponse(res, 200, true, message, result.result, result.meta);
});

const getARegisteredSemester = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const result =
    await SemesterRegistrationServices.getARegisteredSemesterFromDB(id);
  const message = 'Retrieved the registered semester successfully!';
  sendResponse(res, 200, true, message, result);
});

const updateRegisteredSemester = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updatedData = req.body;
  const result =
    await SemesterRegistrationServices.updateRegisteredSemesterIntoDB(
      id,
      updatedData,
    );
  const message = 'Updated the registered semester successfully!';
  sendResponse(res, 200, true, message, result);
});

const deleteRegisteredSemester = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const result =
    await SemesterRegistrationServices.deleteRegisteredSemesterFromDB(id);
  const message = 'Deleted the registered semester successfully!';
  sendResponse(res, 200, true, message, result ? null : result);
});

export const SemesterRegistrationControllers = {
  createSemesterRegistration,
  getAllRegisteredSemesters,
  getARegisteredSemester,
  updateRegisteredSemester,
  deleteRegisteredSemester,
};
