import { QueryBuilder } from '../../builder/QueryBuilder';
import { NotFoundError } from '../../utils/errors/NotFoundError';
import { TAdmin } from './admin.interface';
import { AdminModel } from './admin.model';

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
  const result = await AdminModel.findOneAndUpdate({ id }, { isDeleted: true });
  return result;
};

export const AdminServices = {
  getAllAdminsFromDB,
  getAnAdminFromDB,
  updateAdminIntoDB,
  deleteAdminFromDB,
};
