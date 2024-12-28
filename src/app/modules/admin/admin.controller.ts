/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AdminServices } from './admin.service';

const getAllAdmins = catchAsync(async (req, res, next) => {
  const result = await AdminServices.getAllAdminsFromDB();
  const message = 'Retrieved all admins successfully!';

  sendResponse(res, 200, true, message, result);
});

const getAnAdmin = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const result = await AdminServices.getAnAdminFromDB(id);
  const message = 'Retrieved the admin successfully';
  sendResponse(res, 200, true, message, result);
});

const updateAdmin = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updatedData = req.body;
  const result = await AdminServices.updateAdminIntoDB(id, updatedData);
  const message = 'Successfully updated the admin!';
  sendResponse(res, 200, true, message, result);
});

export const AdminControllers = {
  getAllAdmins,
  getAnAdmin,
  updateAdmin,
};
