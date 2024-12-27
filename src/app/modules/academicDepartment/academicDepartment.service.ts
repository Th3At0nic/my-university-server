import { QueryBuilder } from '../../builder/QueryBuilder';
import { NotFoundError } from '../../utils/errors/NotFoundError';
import { TAcademicDepartment } from './academicDepartment.interface';
import { DepartmentModel } from './academicDepartment.model';

const createAcademicDepartmentIntoDB = async (data: TAcademicDepartment) => {
  const result = await DepartmentModel.create(data);
  return result;
};

const getAllAcademicDepartmentFromDB = async (
  query: Record<string, unknown>,
) => {
  const searchableFields = ['name'];
  const academicDepartmentQuery = new QueryBuilder(
    query,
    DepartmentModel.find().populate('academicFaculty'),
  )
    .search(searchableFields)
    .filter()
    .paginate()
    .sortBy()
    .fields();
  const result = await academicDepartmentQuery.modelQuery;

  if (!result.length) {
    throw new NotFoundError(`Academic department not found!`, [
      {
        path: 'Department',
        message: `No Academic department found.`,
      },
    ]);
  }
  return result;
};

const getAnAcademicDepartmentFromDB = async (id: string) => {
  const result = await DepartmentModel.findById(id).populate('academicFaculty');
  if (!result) {
    throw new NotFoundError(`Academic department not found!`, [
      {
        path: 'Department',
        message: `The Academic department found with id: ${id}.`,
      },
    ]);
  }
  return result;
};

const updateAcademicDepartmentIntoDB = async (
  id: string,
  updateData: Partial<TAcademicDepartment>,
) => {
  const result = await DepartmentModel.findByIdAndUpdate(id, updateData, {
    new: true,
  }).populate('academicFaculty');

  if (!result) {
    throw new NotFoundError(`Academic department not found!`, [
      {
        path: 'Department',
        message: `The Academic department found with id: ${id}.`,
      },
    ]);
  }
  return result;
};

export const AcademicDepartmentServices = {
  createAcademicDepartmentIntoDB,
  getAllAcademicDepartmentFromDB,
  getAnAcademicDepartmentFromDB,
  updateAcademicDepartmentIntoDB,
};
