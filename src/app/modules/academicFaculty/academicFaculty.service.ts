import { QueryBuilder } from '../../builder/QueryBuilder';
import { InternalServerError } from '../../errors/InternalServerError';
import { NotFoundError } from '../../errors/NotFoundError';
import { TAcademicFaculty } from './academicFaculty.interface';
import { AcademicFacultyModel } from './academicFaculty.model';

const createAcademicFacultyIntoDB = async (data: TAcademicFaculty) => {
  const result = await AcademicFacultyModel.create(data);
  if (!result) {
    throw new InternalServerError('Failed to Create Academic Faculty', [
      {
        path: 'server',
        message:
          'An unexpected error occurred while creating the academic faculty. Please try again later.',
      },
    ]);
  }
  return result;
};

const getAllAcademicFacultyFromDB = async (query: Record<string, unknown>) => {
  const searchableFields = ['name'];
  const academicFacultyQuery = new QueryBuilder(
    query,
    AcademicFacultyModel.find(),
  )
    .search(searchableFields)
    .filter()
    .paginate()
    .sortBy()
    .fields();

  const result = await academicFacultyQuery.modelQuery;
  if (!result.length) {
    throw new NotFoundError(`No Academic Faculty found`, [
      {
        path: `academic faculty`,
        message: `No academic faculty found in the system.`,
      },
    ]);
  }
  return result;
};

const getAnAcademicFacultyFromDB = async (id: string) => {
  const result = await AcademicFacultyModel.findById(id);
  if (!result) {
    throw new NotFoundError(`Academic Faculty not found`, [
      {
        path: `${id}`,
        message: `Academic faculty with id: ${id} not found in the system.`,
      },
    ]);
  }
  return result;
};

const updateAcademicFacultyIntoDB = async (
  id: string,
  updatedData: Partial<TAcademicFaculty>,
) => {
  const result = await AcademicFacultyModel.findByIdAndUpdate(id, updatedData, {
    new: true,
  });
  if (!result) {
    throw new NotFoundError(`Academic Faculty not found`, [
      {
        path: `${id}`,
        message: `Academic faculty with id: ${id} not found in the system.`,
      },
    ]);
  }
  return result;
};

export const AcademicFacultyServices = {
  createAcademicFacultyIntoDB,
  getAllAcademicFacultyFromDB,
  getAnAcademicFacultyFromDB,
  updateAcademicFacultyIntoDB,
};
