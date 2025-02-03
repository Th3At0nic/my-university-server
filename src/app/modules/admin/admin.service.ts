/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import { QueryBuilder } from '../../builder/QueryBuilder';
import { NotFoundError } from '../../errors/NotFoundError';
import { TAdmin } from './admin.interface';
import { AdminModel } from './admin.model';
import { UserModel } from '../user/user.model';
import { ConflictError } from '../../errors/ConflictError';

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

  const meta = await adminQuery.countTotal();

  return { meta, result };
};

const getAnAdminFromDB = async (id: string) => {
  const result = await AdminModel.findById(id).populate('managementDepartment');
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
  const admin = await AdminModel.findById(id);
  if (!admin) {
    throw new NotFoundError('Admin not found!', [
      {
        path: id,
        message: `Admin not found with the provided id: ${id}`,
      },
    ]);
  }

  const { name, ...remainingData } = updateData;

  const flattenedData: Record<string, unknown> = { ...remainingData };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      flattenedData[`name.${key}`] = value;
    }
  }

  const result = await AdminModel.findByIdAndUpdate(
    id,
    { $set: flattenedData },
    { new: true, runValidators: true },
  );

  if (!result) {
    throw new NotFoundError(`Couldn't update admin!`, [
      {
        path: id,
        message: `Admin with the provided id: ${id} couldn't be updated`,
      },
    ]);
  }

  return result;
};

const deleteAdminFromDB = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const admin = await AdminModel.findById(id);

    if (!admin) {
      throw new NotFoundError(`Admin not found!`, [
        {
          path: `${id}`,
          message: `No admin found with the provided ID: ${id}. Please verify the ID and try again.`,
        },
      ]);
    }

    await UserModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    );

    const result = await AdminModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    );
    if (!result) {
      throw new ConflictError(`Failed to deleted.`, [
        {
          path: id,
          message: 'Failed to deleted the admin. Transaction is aborted.',
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
