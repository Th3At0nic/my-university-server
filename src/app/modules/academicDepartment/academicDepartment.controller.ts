/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TAcademicDepartment } from './academicDepartment.interface';
import { AcademicDepartmentServices } from './academicDepartment.service';

const createAcademicDepartment = catchAsync(async (req, res, next) => {
  const data: TAcademicDepartment = req.body;
  const result =
    await AcademicDepartmentServices.createAcademicDepartmentIntoDB(data);
  const message = 'Academic Department is created successfully!';

  sendResponse(res, message, result);
});

const getAllAcademicDepartment = catchAsync(async (req, res, next) => {
  const result =
    await AcademicDepartmentServices.getAllAcademicDepartmentFromDB();
  const message = 'All academic department retrieved successfully!';

  sendResponse(res, message, result);
});

const getAnAcademicDepartment = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const result =
    await AcademicDepartmentServices.getAnAcademicDepartmentFromDB(id);
  const message = `Successfully retrieved the academic department with id: ${id}`;

  sendResponse(res, message, result);
});

const updateAcademicDepartment = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updateData = req.body;
  const result =
    await AcademicDepartmentServices.updateAcademicDepartmentIntoDB(
      id,
      updateData,
    );
  const message = 'Updated the academic department successfully';

  sendResponse(res, message, result);
});

export const AcademicDepartmentControllers = {
  createAcademicDepartment,
  getAllAcademicDepartment,
  getAnAcademicDepartment,
  updateAcademicDepartment,
};
