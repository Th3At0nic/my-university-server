/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import { QueryBuilder } from '../../builder/QueryBuilder';
import { NotFoundError } from '../../utils/errors/NotFoundError';
import { TAdmin } from './admin.interface';
import { AdminModel } from './admin.model';
import { UserModel } from '../user/user.model';
import { ConflictError } from '../../utils/errors/ConflictError';

const getAllAdminsFromDB = async (query: Record<string, unknown>) => {
  const searchableFields = [
    'id',
    'name',
    'designation',
    'email',
    'contactNo',
    'presentAddress',
    'permanentAddress',
    'gender',
  ];
  const adminQuery = new QueryBuilder(
    query,
    AdminModel.find().populate('managementDepartment'),
  )
    .search(searchableFields)
    .filter()
    .paginate()
    .sortBy()
    .fields();
  const result = await adminQuery.modelQuery;
  if (!result) {
    throw new NotFoundError('No admin found!', [
      { path: 'Admin', message: 'No admin found in the system' },
    ]);
  }
  return result;
};

const getAnAdminFromDB = async (id: string) => {
  const result = await AdminModel.findOne({
    id: id,
    isDeleted: false,
  }).populate('managementDepartment');
  if (!result) {
    throw new NotFoundError('Admin not found!', [
      {
        path: id,
        message: `Admin not found with the provided id: ${id}`,
      },
    ]);
  }
  return result;
};

const updateAdminIntoDB = async (id: string, updateData: Partial<TAdmin>) => {
  const result = await AdminModel.findOneAndUpdate(
    { id, isDeleted: false },
    { $set: updateData },
    { new: true, runValidators: true },
  );

  if (!result) {
    throw new NotFoundError('Admin not found!', [
      {
        path: id || '',
        message: `Admin not found with the provided id: ${id}. So not updated`,
      },
    ]);
  }

  return result;
};

const deleteAdminFromDB = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const admin = await AdminModel.findOne({ id: id, isDeleted: false });

    if (!admin) {
      throw new NotFoundError(`Admin not found!`, [
        {
          path: `${id}`,
          message: `No admin found with the provided ID: ${id}. The record may have been deleted or does not exist. Please verify the ID and try again.`,
        },
      ]);
    }

    await UserModel.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );

    const result = await AdminModel.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );
    if (!result) {
      throw new ConflictError(`Failed to deleted.`, [
        {
          path: id,
          message: 'Failed to deleted the student. Transaction is aborted.',
        },
      ]);
    }
    await session.commitTransaction();
    return result;
  } catch (err: any) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

export const AdminServices = {
  getAllAdminsFromDB,
  getAnAdminFromDB,
  updateAdminIntoDB,
  deleteAdminFromDB,
};